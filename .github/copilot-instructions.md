# Copilot Instructions for MarsAI Project

## Architecture Overview

- **Monorepo**: Due cartelle principali:
  - `back/` (Node.js/Express, REST API, Sequelize/MySQL)
  - `front/` (React + Vite, Tailwind CSS)
- **Backend**: Entry point `back/index.js`. Tutte le rotte sono registrate in `back/src/routes/index.js`. Modelli Sequelize in `back/src/models/`. Autenticazione JWT (vedi `AuthMiddleware.js`, `password.js`).
- **Frontend**: App React con pagine in `front/src/pages/`, componenti riusabili in `front/src/components/`, layouts in `front/src/layouts/`. Chiamate API centralizzate in `front/src/api/` tramite Axios, con token JWT da `localStorage`.

## Flussi di lavoro principali

- **Installazione**: `npm install` nella root, oppure separatamente in `back/` e `front/`.
- **Avvio backend**: `npm run back` dalla root, oppure `cd back && npm start`.
- **Avvio frontend**: `npm run front` dalla root, oppure `cd front && npm run dev`.
- **Ambiente**: Il backend usa `.env` (caricato con `dotenv`). Il frontend si aspetta il backend su `http://localhost:3000`.

## Convenzioni e pattern

- **Backend**:
  - Rotte in `back/src/routes/`, controller in `back/src/controllers/`, modelli in `back/src/models/`.
  - Middleware di autenticazione in `back/src/middlewares/`.
  - Migrazioni Sequelize in `back/migrations/`.
- **Frontend**:
  - Pagine in `front/src/pages/`, componenti in `front/src/components/`, layouts in `front/src/layouts/`.
  - Chiamate API tramite moduli in `front/src/api/` (es. `users.js`, `auth.js`).
  - Protezione ruoli in `front/src/middlewares/RoleGuard.jsx`.
  - Stili con Tailwind CSS (`index.css`).

## Integrazione & comunicazione

- **Autenticazione**: Il token JWT è salvato in `localStorage` e aggiunto a tutte le richieste API tramite Axios interceptor (`front/src/api/config.js`).
- **Data flow**: Il frontend comunica solo tramite REST API; il backend gestisce la logica e l’accesso ai dati MySQL.
- **Testing**: Non sono presenti script di test; aggiungere test dove necessario.

## Esempi pratici

- **Aggiungere una rotta backend**: crea un controller, aggiungi un file di rotta, registra in `routes/index.js`.
- **Chiamare un’API dal frontend**: aggiungi una funzione in `front/src/api/`, usa l’istanza Axios configurata.

## Riferimenti

- Vedi [README.md](../../README.md), [back/README.md](../back/README.md), [front/README.md](../front/README.md) per dettagli su setup e uso.

---

**Agents:** Seguite queste convenzioni e fate riferimento alla struttura delle cartelle per esempi. Non inventate nuovi pattern se non necessario.
