# Copilot Instructions for MarsAI Project

## Architecture Overview

- **Monorepo**: Contains `back/` (Node.js/Express backend) and `front/` (React + Vite frontend).
- **Backend**: REST API using Express, with routes for `/auth`, `/users`, `/videos`. Uses Sequelize for MySQL integration. Entry point: `back/index.js`.
- **Frontend**: React app (Vite) with pages for admin, auth, and public. API calls via `front/src/api/` using Axios, with token-based auth from `localStorage`.

## Key Workflows

- **Install dependencies**: Run `npm install` in the root, or separately in `back/` and `front/`.
- **Start backend**: From root, `npm run back` (runs `nodemon index.js` in `back/`). Or: `cd back && npm start`.
- **Start frontend**: From root, `npm run front`. Or: `cd front && npm run dev`.
- **Environment**: Backend loads `.env` via `dotenv`. Frontend expects backend at `http://localhost:3000`.

## Project Conventions

- **Backend**:
  - All routes are registered in `back/src/routes/index.js`.
  - Controllers in `back/src/controllers/`, models in `back/src/models/`.
  - Auth uses JWT (see `AuthMiddleware.js`, `password.js`).
  - Use ES modules (`type: module` in `package.json`).
- **Frontend**:
  - Pages in `front/src/pages/`, components in `front/src/components/`, layouts in `front/src/layouts/`.
  - API modules in `front/src/api/` wrap backend endpoints.
  - Role-based guards in `front/src/middlewares/RoleGuard.jsx`.
  - Styling via Tailwind CSS (`index.css`).

## Integration & Patterns

- **Auth**: JWT token is stored in `localStorage` and attached to all API requests via Axios interceptor (`config.js`).
- **Data flow**: Frontend calls backend REST endpoints; backend connects to MySQL via Sequelize.
- **Testing**: No test scripts provided; add tests as needed.

## Examples

- To add a new backend route: create a controller, add a route file, register in `routes/index.js`.
- To call a backend API: add a function in `front/src/api/`, use Axios instance for auth.

## References

- See [README.md](../../README.md), [back/README.md](../back/README.md), [front/README.md](../front/README.md) for setup and usage.

---

**Agents:** Follow these conventions and reference the directory structure for examples. Avoid inventing new patterns unless necessary.
