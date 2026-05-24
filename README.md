# recuitSim

Projet ADOMC avec backend FastAPI et frontend React/Vite pour visualiser une optimisation energetique par recuit simule.

## Lancement avec Docker

Depuis la racine du projet :

```bash
docker compose up --build
```

Services exposes :

- Frontend : `http://localhost:5173`
- Backend : `http://localhost:8000`
- Healthcheck backend : `http://localhost:8000/health`

Le frontend Docker est servi par Nginx. Les routes `/api/*` et `/health` sont proxyfiees vers le conteneur backend.

## Arret

```bash
docker compose down
```

