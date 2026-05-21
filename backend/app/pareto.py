from __future__ import annotations

from app.models import Solution
from app.scoring import solution_key


def dominates(candidate: Solution, other: Solution) -> bool:
    candidate_metrics = candidate.metrics
    other_metrics = other.metrics

    at_least_as_good = (
        candidate_metrics.performance >= other_metrics.performance
        and candidate_metrics.battery >= other_metrics.battery
        and candidate_metrics.temperature <= other_metrics.temperature
        and candidate_metrics.noise <= other_metrics.noise
        and candidate_metrics.energy <= other_metrics.energy
    )
    strictly_better = (
        candidate_metrics.performance > other_metrics.performance
        or candidate_metrics.battery > other_metrics.battery
        or candidate_metrics.temperature < other_metrics.temperature
        or candidate_metrics.noise < other_metrics.noise
        or candidate_metrics.energy < other_metrics.energy
    )
    return at_least_as_good and strictly_better


def unique_solutions(solutions: list[Solution]) -> list[Solution]:
    unique: dict[tuple[int, float, str, str], Solution] = {}
    for solution in solutions:
        key = solution_key(solution)
        if key not in unique or solution.score > unique[key].score:
            unique[key] = solution
    return list(unique.values())


def pareto_front(solutions: list[Solution]) -> list[Solution]:
    candidates = unique_solutions(solutions)
    front: list[Solution] = []

    for candidate in candidates:
        is_dominated = any(
            dominates(other, candidate)
            for other in candidates
            if solution_key(other) != solution_key(candidate)
        )
        if not is_dominated:
            front.append(candidate)

    return sorted(front, key=lambda solution: solution.score, reverse=True)

