from __future__ import annotations

import math
import random
from statistics import mean
from typing import TypeVar

from app.models import (
    AnnealingSettings,
    FanMode,
    HistoryEntry,
    LaptopConfiguration,
    MetricWeights,
    OptimizationSummary,
    OptimizeResponse,
    PowerMode,
    Solution,
)
from app.pareto import pareto_front, unique_solutions
from app.profiles import recommended_profiles
from app.scoring import CPU_MAX, CPU_MIN, evaluate_configuration


FAN_MODES = list(FanMode)
POWER_MODES = list(PowerMode)
T = TypeVar("T")


def random_configuration(rng: random.Random) -> LaptopConfiguration:
    return LaptopConfiguration(
        brightness=rng.randint(20, 100),
        cpu_frequency=round(rng.uniform(CPU_MIN, CPU_MAX), 2),
        fan_mode=rng.choice(FAN_MODES),
        power_mode=rng.choice(POWER_MODES),
    )


def _move_enum_value(values: list[T], current: T, rng: random.Random) -> T:
    index = values.index(current)
    possible_indices = {max(0, index - 1), min(len(values) - 1, index + 1)}
    possible_indices.discard(index)
    if not possible_indices:
        return current
    return values[rng.choice(sorted(possible_indices))]


def create_neighbor(config: LaptopConfiguration, rng: random.Random) -> LaptopConfiguration:
    data = config.model_dump()
    dimension = rng.choice(["brightness", "cpu_frequency", "fan_mode", "power_mode"])

    if dimension == "brightness":
        data["brightness"] = max(20, min(100, config.brightness + rng.randint(-10, 10)))
    elif dimension == "cpu_frequency":
        data["cpu_frequency"] = round(max(CPU_MIN, min(CPU_MAX, config.cpu_frequency + rng.uniform(-0.25, 0.25))), 2)
    elif dimension == "fan_mode":
        data["fan_mode"] = _move_enum_value(FAN_MODES, config.fan_mode, rng)
    else:
        data["power_mode"] = _move_enum_value(POWER_MODES, config.power_mode, rng)

    # Small second move improves exploration while keeping neighbors local.
    if rng.random() < 0.18:
        if dimension != "brightness" and rng.random() < 0.5:
            data["brightness"] = max(20, min(100, int(data["brightness"]) + rng.randint(-5, 5)))
        elif dimension != "cpu_frequency":
            data["cpu_frequency"] = round(max(CPU_MIN, min(CPU_MAX, float(data["cpu_frequency"]) + rng.uniform(-0.12, 0.12))), 2)

    return LaptopConfiguration(**data)


def solution_cost(solution: Solution) -> float:
    return (1.0 - solution.score) * 100.0


def _acceptance_probability(delta: float, temperature: float) -> float:
    if delta <= 0:
        return 1.0
    return math.exp(-delta / temperature)


def generate_candidate_pool(weights: MetricWeights, count: int, rng: random.Random) -> list[Solution]:
    return [evaluate_configuration(random_configuration(rng), weights) for _ in range(count)]


def run_simulated_annealing(
    weights: MetricWeights,
    settings: AnnealingSettings,
    rng: random.Random | None = None,
) -> OptimizeResponse:
    active_rng = rng or random.Random()

    current = evaluate_configuration(random_configuration(active_rng), weights)
    best = current
    candidates: list[Solution] = [current]
    history: list[HistoryEntry] = []
    accepted_moves = 0
    temperature = settings.initial_temperature

    for iteration in range(1, settings.max_iterations + 1):
        if temperature <= settings.min_temperature:
            break

        candidate = evaluate_configuration(create_neighbor(current, active_rng), weights)
        candidates.append(candidate)

        previous_score = current.score
        current_cost = solution_cost(current)
        candidate_cost = solution_cost(candidate)
        delta = candidate_cost - current_cost
        probability = _acceptance_probability(delta, temperature)
        accepted = delta <= 0 or active_rng.random() < probability

        if accepted:
            current = candidate
            accepted_moves += 1
            if current.score > best.score:
                best = current

        history.append(
            HistoryEntry(
                iteration=iteration,
                temperature=round(temperature, 4),
                candidate_score=candidate.score,
                current_score=current.score,
                best_score=best.score,
                accepted=accepted,
                acceptance_probability=round(probability, 4),
                score_delta=round(candidate.score - previous_score, 4),
            )
        )

        temperature *= settings.cooling_rate

    exploration_count = max(40, min(250, settings.max_iterations // 2))
    candidates.extend(generate_candidate_pool(weights, exploration_count, active_rng))
    candidates = unique_solutions(candidates)
    best = max(candidates, key=lambda solution: solution.score)

    front = pareto_front(candidates)
    recommendations = recommended_profiles(front or candidates)

    scores = [solution.score for solution in candidates]
    summary = OptimizationSummary(
        iterations=len(history),
        accepted_moves=accepted_moves,
        acceptance_rate=round(accepted_moves / len(history), 4) if history else 0.0,
        candidate_count=len(candidates),
        pareto_count=len(front),
        best_score=best.score,
        average_score=round(mean(scores), 4) if scores else 0.0,
        final_temperature=round(temperature, 4),
    )

    return OptimizeResponse(
        best_solution=best,
        pareto_front=front,
        recommended_profiles=recommendations,
        history=history,
        summary=summary,
    )
