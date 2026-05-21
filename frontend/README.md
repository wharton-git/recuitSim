# SmartPower ADMC frontend

Interface React TypeScript pour visualiser l'optimisation energetique d'un PC portable par recuit simule.

## Prerequis

- Node.js
- pnpm
- Backend FastAPI lance sur `http://localhost:8000`

## Installation

```bash
pnpm install
```

## Lancement

```bash
pnpm run dev
```

L'application Vite est disponible sur l'URL affichee par le terminal, generalement `http://localhost:5173`.

## API utilisee

- `GET /health`
- `GET /api/config/default`
- `POST /api/evaluate`
- `POST /api/optimize`

Par defaut, le frontend cible `http://localhost:8000`. Vous pouvez changer cette URL avec `VITE_API_URL`.

## Docker

Depuis la racine du projet :

```bash
docker compose up --build
```

Le frontend est ensuite disponible sur `http://localhost:5173`.
