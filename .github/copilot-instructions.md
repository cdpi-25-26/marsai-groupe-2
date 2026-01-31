# Copilot Instructions – MarsAI Project

## Architettura generale

- **Monorepo**: due cartelle principali:
  - `back/` (Node.js/Express, REST API, Sequelize/MySQL)
  - `front/` (React + Vite, Tailwind CSS)

### Backend

- Entry point: `back/index.js`
- Tutte le rotte sono registrate in `back/src/routes/index.js`
- Modelli Sequelize: `back/src/models/`
- Autenticazione JWT: vedi `back/src/middlewares/AuthMiddleware.js` e `back/src/utils/password.js`
- Migrazioni: `back/migrations/` (timestamp nel nome file)
- Configurazione DB: `back/config/config.cjs` e `back/config/config.json`

### Frontend

- App React (Vite): pagine in `front/src/pages/`, componenti in `front/src/components/`, layouts in `front/src/layouts/`
- Chiamate API centralizzate in `front/src/api/` tramite Axios (`front/src/api/config.js` gestisce token JWT da `localStorage`)
- Protezione ruoli: `front/src/middlewares/RoleGuard.jsx`
- Stili: Tailwind CSS in `front/src/index.css`

## Flussi di lavoro principali

- **Installazione**: `npm install` nella root installa tutte le dipendenze (front e back)
- **Avvio backend**: `npm run back` dalla root, oppure `cd back && npm start`
- **Avvio frontend**: `npm run front` dalla root, oppure `cd front && npm run dev`
- **Ambiente**: backend su `http://localhost:3000`, frontend su `http://localhost:5173` (default Vite)
- **Migrazioni**: gestite con Sequelize CLI, file in `back/migrations/`

## Convenzioni e pattern

### Backend

- Rotte: `back/src/routes/` (es. `Movie.route.js`), controller: `back/src/controllers/`, modelli: `back/src/models/`
- Middleware di autenticazione: `back/src/middlewares/`
- Ogni nuova rotta va registrata in `back/src/routes/index.js`

### Frontend

- Pagine: `front/src/pages/`, componenti: `front/src/components/`, layouts: `front/src/layouts/`
- Chiamate API: moduli in `front/src/api/` (es. `users.js`, `auth.js`)
- Protezione ruoli: `front/src/middlewares/RoleGuard.jsx`

## Integrazione & comunicazione

- **Autenticazione**: token JWT in `localStorage`, aggiunto alle richieste API tramite Axios interceptor (`front/src/api/config.js`)
- **Data flow**: solo REST API tra frontend e backend
- **Migrazioni**: file timestamp in `back/migrations/`, eseguite con Sequelize

## Esempi pratici

- **Aggiungere una rotta backend**:
  1. Crea controller in `back/src/controllers/`
  2. Crea file rotta in `back/src/routes/`
  3. Registra la rotta in `back/src/routes/index.js`
- **Chiamare un’API dal frontend**:
  1. Aggiungi funzione in `front/src/api/`
  2. Usa l’istanza Axios configurata in `front/src/api/config.js`

## Riferimenti

- [README.md](../../README.md)
- [back/README.md](../back/README.md)
- [front/README.md](../front/README.md)

---

**Agents:** Seguite queste convenzioni e fate riferimento alla struttura delle cartelle per esempi. Non inventate nuovi pattern se non necessario. Se un flusso non è documentato, cercate esempi nei file esistenti prima di proporre soluzioni nuove.
