# recuitSim backend

API FastAPI pour optimiser les reglages energetiques d'un laptop avec un recuit simule.

## Prerequis

- Python 3.12+

## Installation

Depuis le dossier `backend/` :

```bash
pip install -r requirements.txt
```

## Lancement

```bash
uvicorn app.main:app --reload
```

L'API est ensuite disponible sur `http://127.0.0.1:8000`.

## Endpoints

- `GET /health` : verification de disponibilite.
- `GET /api/config/default` : parametres par defaut, espace de recherche et exemple de configuration.
- `POST /api/evaluate` : evaluation d'une configuration.
- `POST /api/optimize` : lancement du recuit simule.

## Exemple `/api/evaluate`

```json
{
  "brightness": 60,
  "cpu_frequency": 2.1,
  "fan_mode": "normal",
  "power_mode": "balanced"
}
```

## Exemple `/api/optimize`

```json
{
  "weights": {
    "performance": 0.3,
    "battery": 0.3,
    "temperature": 0.2,
    "noise": 0.1,
    "energy": 0.1
  },
  "settings": {
    "initial_temperature": 100,
    "cooling_rate": 0.95,
    "min_temperature": 0.1,
    "max_iterations": 500
  }
}
```

La reponse contient la meilleure solution, le front de Pareto, les profils recommandes, l'historique des iterations et un resume.

