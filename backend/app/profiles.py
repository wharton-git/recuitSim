from __future__ import annotations

from app.models import Solution
from app.scoring import normalized_metrics


PROFILE_LABELS = ("eco", "balanced", "performance", "silent", "cool")


def _profile_score(profile: str, solution: Solution) -> float:
    metrics = normalized_metrics(solution.metrics)

    if profile == "eco":
        return (
            (0.45 * metrics["battery"])
            + (0.3 * metrics["energy"])
            + (0.15 * metrics["temperature"])
            + (0.1 * metrics["noise"])
        )
    if profile == "performance":
        return (
            (0.65 * metrics["performance"])
            + (0.15 * metrics["temperature"])
            + (0.1 * metrics["energy"])
            + (0.1 * metrics["battery"])
        )
    if profile == "silent":
        return (
            (0.55 * metrics["noise"])
            + (0.2 * metrics["temperature"])
            + (0.15 * metrics["battery"])
            + (0.1 * metrics["performance"])
        )
    if profile == "cool":
        return (
            (0.55 * metrics["temperature"])
            + (0.2 * metrics["noise"])
            + (0.15 * metrics["energy"])
            + (0.1 * metrics["performance"])
        )

    return (
        (0.25 * metrics["performance"])
        + (0.25 * metrics["battery"])
        + (0.2 * metrics["temperature"])
        + (0.15 * metrics["noise"])
        + (0.15 * metrics["energy"])
    )


def recommended_profiles(solutions: list[Solution]) -> dict[str, Solution]:
    if not solutions:
        return {}

    recommendations: dict[str, Solution] = {}
    for profile in PROFILE_LABELS:
        selected = max(solutions, key=lambda solution: (_profile_score(profile, solution), solution.score))
        recommendations[profile] = selected.model_copy(update={"profile_label": profile})

    return recommendations

