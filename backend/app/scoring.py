from __future__ import annotations

from typing import Mapping

from app.models import FanMode, LaptopConfiguration, MetricWeights, Metrics, PowerMode, Solution


CPU_MIN = 1.2
CPU_MAX = 3.5
BRIGHTNESS_MIN = 20
BRIGHTNESS_MAX = 100

TEMPERATURE_MIN = 30.0
TEMPERATURE_MAX = 95.0
NOISE_MIN = 20.0
NOISE_MAX = 70.0


FAN_NOISE_FACTOR: Mapping[FanMode, float] = {
    FanMode.SILENT: 0.15,
    FanMode.NORMAL: 0.45,
    FanMode.PERFORMANCE: 0.9,
}

FAN_POWER_FACTOR: Mapping[FanMode, float] = {
    FanMode.SILENT: 0.1,
    FanMode.NORMAL: 0.4,
    FanMode.PERFORMANCE: 0.85,
}

FAN_COOLING_FACTOR: Mapping[FanMode, float] = {
    FanMode.SILENT: 0.0,
    FanMode.NORMAL: 0.45,
    FanMode.PERFORMANCE: 1.0,
}

POWER_PERFORMANCE_FACTOR: Mapping[PowerMode, float] = {
    PowerMode.ECO: 0.15,
    PowerMode.BALANCED: 0.55,
    PowerMode.PERFORMANCE: 1.0,
}

POWER_CONSUMPTION_FACTOR: Mapping[PowerMode, float] = {
    PowerMode.ECO: 0.1,
    PowerMode.BALANCED: 0.45,
    PowerMode.PERFORMANCE: 1.0,
}


def clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))


def normalize_range(value: float, minimum: float, maximum: float) -> float:
    if maximum == minimum:
        return 0.0
    return clamp((value - minimum) / (maximum - minimum), 0.0, 1.0)


def inverse_normalize_range(value: float, minimum: float, maximum: float) -> float:
    return 1.0 - normalize_range(value, minimum, maximum)


def _round_metric(value: float) -> float:
    return round(clamp(value, 0.0, 100.0), 2)


def simulate_metrics(config: LaptopConfiguration) -> Metrics:
    """Estimate laptop behavior with simple, bounded engineering-inspired formulas."""
    brightness_n = normalize_range(config.brightness, BRIGHTNESS_MIN, BRIGHTNESS_MAX)
    cpu_n = normalize_range(config.cpu_frequency, CPU_MIN, CPU_MAX)
    fan_noise = FAN_NOISE_FACTOR[config.fan_mode]
    fan_power = FAN_POWER_FACTOR[config.fan_mode]
    fan_cooling = FAN_COOLING_FACTOR[config.fan_mode]
    power_perf = POWER_PERFORMANCE_FACTOR[config.power_mode]
    power_consumption = POWER_CONSUMPTION_FACTOR[config.power_mode]

    performance = 28 + (46 * cpu_n) + (22 * power_perf) + (4 * fan_cooling)
    battery = 100 - (
        (20 * brightness_n)
        + (30 * cpu_n)
        + (16 * fan_power)
        + (24 * power_consumption)
    )
    temperature = 34 + (33 * cpu_n) + (19 * power_consumption) + (3 * brightness_n) - (11 * fan_cooling)
    noise = 22 + (43 * fan_noise) + (4 * cpu_n) + (2 * power_consumption)
    energy = 15 + (24 * brightness_n) + (38 * cpu_n) + (18 * fan_power) + (25 * power_consumption)

    return Metrics(
        performance=_round_metric(performance),
        battery=_round_metric(battery),
        temperature=_round_metric(temperature),
        noise=_round_metric(noise),
        energy=_round_metric(energy),
    )


def normalized_metrics(metrics: Metrics) -> dict[str, float]:
    """Normalize every criterion to a 0..1 utility value, where higher is better."""
    return {
        "performance": normalize_range(metrics.performance, 0.0, 100.0),
        "battery": normalize_range(metrics.battery, 0.0, 100.0),
        "temperature": inverse_normalize_range(metrics.temperature, TEMPERATURE_MIN, TEMPERATURE_MAX),
        "noise": inverse_normalize_range(metrics.noise, NOISE_MIN, NOISE_MAX),
        "energy": inverse_normalize_range(metrics.energy, 0.0, 100.0),
    }


def weighted_score(metrics: Metrics, weights: MetricWeights) -> float:
    normalized = normalized_metrics(metrics)
    normalized_weights = weights.normalized()
    score = sum(normalized[criterion] * weight for criterion, weight in normalized_weights.items())
    return round(clamp(score, 0.0, 1.0), 4)


def infer_profile_label(config: LaptopConfiguration, metrics: Metrics) -> str:
    if config.fan_mode == FanMode.SILENT and metrics.noise <= 35:
        return "silent"
    if metrics.temperature <= 45 and metrics.energy <= 45:
        return "cool"
    if metrics.performance >= 82:
        return "performance"
    if metrics.battery >= 72 and metrics.energy <= 45:
        return "eco"
    return "balanced"


def evaluate_configuration(config: LaptopConfiguration, weights: MetricWeights | None = None) -> Solution:
    active_weights = weights or MetricWeights()
    safe_config = config.model_copy(update={"cpu_frequency": round(config.cpu_frequency, 2)})
    metrics = simulate_metrics(safe_config)
    return Solution(
        **safe_config.model_dump(),
        metrics=metrics,
        score=weighted_score(metrics, active_weights),
        profile_label=infer_profile_label(safe_config, metrics),
    )


def solution_key(solution: Solution) -> tuple[int, float, str, str]:
    return (
        solution.brightness,
        round(solution.cpu_frequency, 2),
        solution.fan_mode.value,
        solution.power_mode.value,
    )

