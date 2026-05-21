from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models import (
    AnnealingSettings,
    DefaultConfigResponse,
    LaptopConfiguration,
    MetricWeights,
    OptimizeRequest,
    OptimizeResponse,
    SearchSpace,
    Solution,
)
from app.optimizer import run_simulated_annealing
from app.scoring import evaluate_configuration


app = FastAPI(
    title="recuitSim API",
    description="Backend FastAPI pour optimiser les reglages energetiques d'un PC portable par recuit simule.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "recuitSim-backend"}


@app.get("/api/config/default", response_model=DefaultConfigResponse)
def get_default_config() -> DefaultConfigResponse:
    return DefaultConfigResponse(
        weights=MetricWeights(),
        settings=AnnealingSettings(),
        search_space=SearchSpace(
            brightness={"min": 20, "max": 100},
            cpu_frequency={"min": 1.2, "max": 3.5},
            fan_modes=["silent", "normal", "performance"],
            power_modes=["eco", "balanced", "performance"],
        ),
        example_configuration=LaptopConfiguration(
            brightness=60,
            cpu_frequency=2.1,
            fan_mode="normal",
            power_mode="balanced",
        ),
    )


@app.post("/api/evaluate", response_model=Solution)
def evaluate(config: LaptopConfiguration) -> Solution:
    return evaluate_configuration(config, MetricWeights())


@app.post("/api/optimize", response_model=OptimizeResponse)
def optimize(request: OptimizeRequest) -> OptimizeResponse:
    return run_simulated_annealing(request.weights, request.settings)

