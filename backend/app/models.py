from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, Field, model_validator


class FanMode(str, Enum):
    SILENT = "silent"
    NORMAL = "normal"
    PERFORMANCE = "performance"


class PowerMode(str, Enum):
    ECO = "eco"
    BALANCED = "balanced"
    PERFORMANCE = "performance"


class LaptopConfiguration(BaseModel):
    brightness: int = Field(..., ge=20, le=100, description="Screen brightness in percent.")
    cpu_frequency: float = Field(..., ge=1.2, le=3.5, description="CPU frequency in GHz.")
    fan_mode: FanMode
    power_mode: PowerMode


class MetricWeights(BaseModel):
    performance: float = Field(0.3, ge=0.0, le=1.0)
    battery: float = Field(0.3, ge=0.0, le=1.0)
    temperature: float = Field(0.2, ge=0.0, le=1.0)
    noise: float = Field(0.1, ge=0.0, le=1.0)
    energy: float = Field(0.1, ge=0.0, le=1.0)

    def total_weight(self) -> float:
        return (
            self.performance
            + self.battery
            + self.temperature
            + self.noise
            + self.energy
        )

    @model_validator(mode="after")
    def validate_non_zero_total(self) -> "MetricWeights":
        if self.total_weight() <= 0:
            raise ValueError("At least one optimization weight must be greater than 0.")
        return self

    def normalized(self) -> dict[str, float]:
        total = self.total_weight()
        return {
            "performance": self.performance / total,
            "battery": self.battery / total,
            "temperature": self.temperature / total,
            "noise": self.noise / total,
            "energy": self.energy / total,
        }


class AnnealingSettings(BaseModel):
    initial_temperature: float = Field(100.0, gt=0.0)
    cooling_rate: float = Field(0.95, gt=0.0, lt=1.0)
    min_temperature: float = Field(0.1, gt=0.0)
    max_iterations: int = Field(500, ge=1, le=20_000)

    @model_validator(mode="after")
    def validate_temperature_range(self) -> "AnnealingSettings":
        if self.min_temperature >= self.initial_temperature:
            raise ValueError("min_temperature must be lower than initial_temperature.")
        return self


class OptimizeRequest(BaseModel):
    weights: MetricWeights = Field(default_factory=MetricWeights)
    settings: AnnealingSettings = Field(default_factory=AnnealingSettings)


class Metrics(BaseModel):
    performance: float = Field(..., ge=0.0, le=100.0)
    battery: float = Field(..., ge=0.0, le=100.0)
    temperature: float = Field(..., ge=0.0, le=100.0)
    noise: float = Field(..., ge=0.0, le=100.0)
    energy: float = Field(..., ge=0.0, le=100.0)


class Solution(LaptopConfiguration):
    metrics: Metrics
    score: float = Field(..., ge=0.0, le=1.0)
    profile_label: str


class HistoryEntry(BaseModel):
    iteration: int
    temperature: float
    candidate_score: float
    current_score: float
    best_score: float
    accepted: bool
    acceptance_probability: float
    score_delta: float


class OptimizationSummary(BaseModel):
    iterations: int
    accepted_moves: int
    acceptance_rate: float
    candidate_count: int
    pareto_count: int
    best_score: float
    average_score: float
    final_temperature: float


class OptimizeResponse(BaseModel):
    best_solution: Solution
    pareto_front: list[Solution]
    recommended_profiles: dict[str, Solution]
    history: list[HistoryEntry]
    summary: OptimizationSummary


class SearchSpace(BaseModel):
    brightness: dict[str, int]
    cpu_frequency: dict[str, float]
    fan_modes: list[FanMode]
    power_modes: list[PowerMode]


class DefaultConfigResponse(BaseModel):
    weights: MetricWeights
    settings: AnnealingSettings
    search_space: SearchSpace
    example_configuration: LaptopConfiguration
