# SmartPower ADMC frontend

Interface React TypeScript pour visualiser l'optimisation energetique d'un PC portable par recuit simule.

## Prerequis

- Node.js
- Backend FastAPI lance sur `http://localhost:8000`

## Installation

```bash
npm install
```

## Lancement

```bash
npm run dev
```

L'application Vite est disponible sur l'URL affichee par le terminal, generalement `http://localhost:5173`.

## API utilisee

- `GET /health`
- `GET /api/config/default`
- `POST /api/evaluate`
- `POST /api/optimize`

Par defaut, le frontend cible `http://localhost:8000`. Vous pouvez changer cette URL avec `VITE_API_URL`.

