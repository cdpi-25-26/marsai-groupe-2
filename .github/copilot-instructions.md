# Copilot Instructions – MarsAI Project

## Big picture architecture

- Monorepo with two apps: backend in back/ (Express + Sequelize/MySQL) and frontend in front/ (React + Vite + Tailwind).
- Backend entry: back/index.js (Express setup, CORS, /uploads static, registers routes from back/src/routes/index.js).
- Data layer uses Sequelize models in back/src/models/ with associations; migrations live in back/migrations/ and are run via sequelize-cli.
- Frontend routes are defined in front/src/main.jsx using React Router; role-based gating uses RoleGuard (localStorage role).

## Critical workflows (from README/package.json)

- Install all deps: npm install (root) runs installs in back/ and front/ (see package.json scripts).
- Run backend: npm run back (root) or cd back && npm start (nodemon).
- Run frontend: npm run front (root) or cd front && npm run dev.
- DB migrations: cd back && npm run migrate (sequelize-cli using back/config/config.json).

## Backend conventions & patterns

- Routes are split by resource in back/src/routes/\*.route.js and registered in back/src/routes/index.js.
- Controllers in back/src/controllers/ use Sequelize models from back/src/models/index.js and return JSON; errors usually res.status(500).json({ error: error.message }).
- Auth middleware is role-aware (JWT Bearer + DB lookup): back/src/middlewares/AuthMiddleware.js. Example usage in Movie routes for PRODUCER/ADMIN.
- File uploads: back/src/routes/Movie.route.js uses multer fields (filmFile, thumbnail1-3, subtitlesSrt). Files stored in uploads/ and served at /uploads (see back/index.js).
- Movie creation expects multipart/form-data; controller maps multiple possible field names (see back/src/controllers/MovieController.js).

## Frontend conventions & patterns

- API access via Axios instance in front/src/api/config.js; token is read from localStorage and attached as Authorization: Bearer.
- Feature API modules live in front/src/api/ (e.g., auth.js, movies.js) and use the shared instance.
- RoleGuard (front/src/middlewares/RoleGuard.jsx) enforces roles from localStorage; routes wrap layouts in front/src/main.jsx.
- Data fetching uses TanStack Query with infinite staleTime (front/src/main.jsx), so refreshes are manual via invalidation/mutations.

## Integration points & env

- Backend expects JWT*SECRET and DB*\* env vars; connection.js defaults to local MySQL if not provided.
- Sequelize model loader (back/src/models/index.js) reads back/config/config.json; do not mix config sources unintentionally.
- Frontend talks to http://localhost:3000/ by default (front/src/api/config.js) and expects the backend to accept CORS from http://localhost:5173.

## Reference examples

- Auth + role check in route: back/src/routes/Movie.route.js
- Multipart handling + model associations: back/src/controllers/MovieController.js
- Frontend routing + RoleGuard: front/src/main.jsx
- Axios auth interceptor: front/src/api/config.js
