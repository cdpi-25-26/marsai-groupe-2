### Démarrage du serveur - `back/index.js`

```javascript
import express from "express";
import cors from "cors";
import router from "./src/routes/index.js";

const app = express();
app.use(cors({ origin: "*" })); // Autoriser toutes les origines CORS
app.use(express.json()); // Parser JSON

const PORT = process.env.PORT || 3000;
app.use("/", router); // Charger les routs

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
```

**Explication:**

- **CORS** permet au frontend (localhost:5173) de communiquer avec le backend (localhost:3000)
- **express.json()** parse les body des requêtes en JSON
- **Router** charge toutes les routes depuis `src/routes/index.js`

---

## 📁 Base de données et Migrations {#migrations}

### Qu'est-ce qu'une migration?

Une migration est un fichier JavaScript qui décrit les changements à apporter à la base de données. C'est comme un historique versionné des changements.

### Structure d'une migration

**Fichier:** `back/migrations/20260128100000-create-users.cjs`

```javascript
"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    // ✅ Exécuté lors de la migration
    await queryInterface.createTable("users", {
      id_user: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER, // ID auto-incrémenté
      },
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false, // Champ obligatoire
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true, // Chaque email doit être unique
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM("ADMIN", "JURY", "PRODUCER"),
        allowNull: false,
        defaultValue: "PRODUCER", // Rôle par défaut
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // ⏮️ Exécuté lors du rollback (annulation)
    await queryInterface.dropTable("users");
  },
};
```

### Exécution des migrations

```bash
# Exécuter toutes les migrations non exécutées
npx sequelize-cli db:migrate

# Annuler la dernière migration
npx sequelize-cli db:migrate:undo

# Réinitialiser la BD complètement
npx sequelize-cli db:migrate:undo:all
```

### Pourquoi les migrations?

✅ **Historique versionné** - Savoir qui a changé quoi et quand
✅ **Rollback facile** - Annuler les changements si problème
✅ **Collaboration** - Sync automatique entre développeurs
✅ **Production-safe** - Appliquer les changements en production de manière sécurisée

---

## 🔐 Authentification et JWT {#jwt}

### Qu'est-ce que JWT?

**JWT (JSON Web Token)** est un standard d'authentification stateless. Voici comment ça fonctionne:

```
┌─────────────────────────────────────────────────────────────┐
│ ÉTAPE 1: USER LOGIN                                         │
│                                                             │
│ Frontend envoie: { email, password }                        │
│        ↓↓↓                                                  │
│ Backend reçoit → Valide mot de passe → Crée JWT           │
│        ↓↓↓                                                  │
│ JWT retourné: eyJhbGc...xyz (longue chaîne encodée)       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ÉTAPE 2: REQUÊTES PROTÉGÉES                                │
│                                                             │
│ Frontend stocke JWT dans localStorage                       │
│ À chaque requête, envoie: Authorization: Bearer [TOKEN]    │
│        ↓↓↓                                                  │
│ Backend vérifie le JWT avec la clé secrète                │
│ Si valide → Traite la requête                             │
│ Si expiré/invalide → Retourne 401 Unauthorized            │
└─────────────────────────────────────────────────────────────┘
```

### Structure d'un JWT

Un JWT contient 3 parties séparées par `.`:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
  ↑ HEADER (Algorithme: HS256)

eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3MDY3OTI5NzMsImV4cCI6MTcwNjc5NjU3M30.
  ↑ PAYLOAD (Données: email, dates création/expiration)

SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
  ↑ SIGNATURE (Hash sécurisé avec clé secrète)
```

### Création du JWT - `back/src/controllers/AuthController.js`

```javascript
import jwt from "jsonwebtoken";

function login(req, res) {
  const { email, password } = req.body;

  User.findOne({ where: { email } }).then((user) => {
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Vérifier le mot de passe avec bcrypt
    comparePassword(password, user.password).then((isMatch) => {
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // ✅ CRÉATION DU JWT
      const token = jwt.sign(
        { email }, // Payload (données à encoder)
        process.env.JWT_SECRET, // Clé secrète (⚠️ CONFIDENTIELLE!)
        { expiresIn: "1h" }, // Options (expiration)
      );

      return res.status(200).json({
        message: "Login successful",
        email: user.email,
        first_name: user.first_name,
        role: user.role,
        token, // Retourner le token
      });
    });
  });
}
```

**Points clés:**

- `jwt.sign()` crée le token
- `process.env.JWT_SECRET` est la clé secrète (définie dans `.env`)
- `expiresIn: "1h"` - Token valide 1 heure
- Seule l'email est stockée dans le payload (pas le password!)

### Variables d'environnement - `.env`

```bash
JWT_SECRET=3939a257017821afc405406c53cd22741720d24871e43ff24792a47045fdc083
JWT_EXPIRES_IN=1h
DB_NAME=marsai_db
DB_USER=root
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=3306
PORT=3000
```

---

## 🛡️ Middleware d'authentification {#middleware}

### Qu'est-ce qu'un middleware?

Un middleware est une fonction qui s'exécute **avant** le controller pour:

- Valider le token JWT
- Vérifier les permissions (rôles)
- Rejeter les requêtes non authentifiées

### Code du middleware - `back/src/middlewares/AuthMiddleware.js`

```javascript
import jwt from "jsonwebtoken";
import db from "../models/index.js";
const User = db.User;

export default async function AuthMiddleware(req, res, next, roles = []) {
  // ÉTAPE 1: Extraire le token du header
  const authHeader = req.header("Authorization");
  const [prefix, token] = authHeader?.split(" ") || [null, undefined];

  // Vérifier le format "Bearer [token]"
  if (prefix !== "Bearer") {
    return res.status(401).json({ error: "No Bearer token" });
  }

  if (!token) {
    return res.status(401).json({
      error: "You must be authenticated to access this resource",
    });
  }

  try {
    // ÉTAPE 2: Vérifier et décoder le JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    if (!decoded?.email) {
      return res.status(401).json({ error: "Invalid Payload" });
    }

    // ÉTAPE 3: Récupérer l'utilisateur de la BD
    let user;
    try {
      user = await User.findOne({ where: { email: decoded.email } });
    } catch (err) {
      return res.status(500).json({ error: "Database error" });
    }

    // ÉTAPE 4: Vérifier les permissions
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Si des rôles sont requis, vérifier que l'utilisateur en a un
    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({
        error: "Insufficient permissions",
      });
    }

    // ÉTAPE 5: Attacher l'utilisateur à la requête
    req.user = user;
    next(); // Continuer vers le controller
  } catch (err) {
    return res.status(500).json({ error: "Authentication error" });
  }
}
```

### Flux du middleware

```
┌─────────────────────────────────────────────────────────────┐
│ REQUÊTE HTTP ARRIVE                                         │
│ Authorization: Bearer eyJhbGc...                           │
└────────────────────┬────────────────────────────────────────┘
                     ↓
        ┌────────────────────────────┐
        │ AuthMiddleware s'exécute   │
        └────────────────────────────┘
                     ↓
        ┌─────────────────────────────┐
        │ Extrait token du header    │
        │ "Bearer xyz" → "xyz"       │
        └──────────┬──────────────────┘
                   ↓
        ┌──────────────────────────────┐
        │ Vérifie JWT avec clé secrète│
        │ Si expiré → 401             │
        │ Si invalide → 401           │
        └──────────┬──────────────────┘
                   ↓
        ┌──────────────────────────────┐
        │ Récupère user de BD         │
        │ req.user = user             │
        └──────────┬──────────────────┘
                   ↓
        ┌──────────────────────────────┐
        │ Vérifie roles (si requis)   │
        │ Si pas le bon rôle → 403   │
        └──────────┬──────────────────┘
                   ↓
        ┌──────────────────────────────┐
        │ next() → Passe au controller │
        └────────────────────────────────┘
```

---

## 🎮 Controllers {#controllers}

Les controllers contiennent la logique métier. Ils reçoivent les données de la requête et retournent les réponses.

### 1. Auth Controller - `back/src/controllers/AuthController.js`

#### Fonction Login

```javascript
function login(req, res) {
  const { email, password } = req.body;

  // Chercher l'utilisateur par email
  User.findOne({ where: { email } }).then((user) => {
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Comparer le password avec le hash en BD
    comparePassword(password, user.password).then((isMatch) => {
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Créer JWT
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      });

      // Retourner les infos utilisateur + token
      return res.status(200).json({
        message: "Login successful",
        email: user.email,
        first_name: user.first_name,
        role: user.role,
        token,
      });
    });
  });
}
```

#### Fonction Register

```javascript
function register(req, res) {
  // Déléguer au UserController pour créer l'utilisateur
  UserController.createUser(req, res);
}
```

### 2. User Controller - `back/src/controllers/UserController.js`

#### Créer un utilisateur

```javascript
function createUser(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Missing data" });
  }

  // Mapping camelCase → snake_case pour compatibilité frontend
  let {
    firstName, // Frontend envoie camelCase
    lastName,
    email,
    password,
    role,
  } = req.body;

  // Convertir en snake_case pour la BD
  const first_name = firstName;
  const last_name = lastName;

  // Valider les champs requis
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Vérifier si email existe déjà
  User.findOne({ where: { email } }).then(async (user) => {
    if (user) {
      return res.json({ message: "User already exists", user });
    }

    // Hasher le password avec bcrypt
    const hash = await hashPassword(password);

    // Créer l'utilisateur en BD
    User.create({
      first_name,
      last_name,
      email,
      password: hash,
      role: role || "PRODUCER", // Rôle par défaut
    })
      .then((newUser) => {
        return res.status(201).json({
          message: "User created",
          newUser,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          error: "DB error",
          details: err.message,
        });
      });
  });
}
```

#### Lister tous les utilisateurs (ADMIN seulement)

```javascript
function getUsers(req, res) {
  // Récupérer tous les utilisateurs
  User.findAll().then((users) => {
    res.json(users); // Retourner array d'utilisateurs
  });
}
```

#### Mettre à jour un utilisateur

```javascript
function updateUser(req, res) {
  const id_user = req.params.id; // ID de la requête

  // Mapping camelCase → snake_case
  let { firstName, lastName, email, password, role } = req.body;
  const first_name = firstName;
  const last_name = lastName;

  // Chercher l'utilisateur
  User.findOne({ where: { id_user } }).then(async (user) => {
    if (user) {
      // Mettre à jour les champs
      user.first_name = first_name || user.first_name;
      user.last_name = last_name || user.last_name;
      user.email = email || user.email;
      if (password && password.trim()) {
        user.password = await hashPassword(password);
      }
      user.role = role || user.role;

      // Sauvegarder en BD
      user.save().then((updatedUser) => {
        res.json(updatedUser);
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
}
```

#### Récupérer le profil de l'utilisateur authentifié

```javascript
function getCurrentUser(req, res) {
  try {
    const user = req.user; // Mis par le middleware Auth
    if (user) {
      // Retirer password de la réponse
      const { password, ...safeUser } = user.toJSON();
      res.json(safeUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error retrieving user" });
  }
}
```

#### Mettre à jour son propre profil

```javascript
function updateCurrentUser(req, res) {
  try {
    const user = req.user;  // L'utilisateur authentifié du middleware
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Champs autorisés pour self-update
    const updatableFields = [
      "first_name", "last_name", "phone", "mobile",
      "birth_date", "street", "postal_code", "city",
      "country", "biography", "job", "portfolio",
      "youtube", "instagram", "linkedin", "facebook", "tiktok"
    ];

    // Mettre à jour seulement les champs autorisés
    updatableFields.forEach(field => {
      if (field in req.body) user[field] = req.body[field];
    });

    // Hasher le password si fourni
    if (req.body.password) {
      user.password = await hashPassword(req.body.password);
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Error updating user" });
  }
}
```

---

## 🛣️ Routes et endpoints {#routes}

Les routes définissent les endpoints API et appliquent les middlewares.

### Routes index - `back/src/routes/index.js`

```javascript
import express from "express";
import userRouter from "./User.route.js";
import authRouter from "./Auth.route.js";
import movieRouter from "./Movie.route.js";

const router = express.Router();

// Enregistrer les routers
router.use("/auth", authRouter); // /auth/login, /auth/register
router.use("/users", userRouter); // /users, /users/me, etc
router.use("/videos", movieRouter); // /videos, etc

export default router;
```

### Routes d'authentification - `back/src/routes/Auth.route.js`

```javascript
import express from "express";
import AuthController from "../controllers/AuthController.js";

const authRouter = express.Router();

// LOGIN: POST http://localhost:3000/auth/login
// Body: { email, password }
authRouter.post("/login", AuthController.login);

// REGISTER: POST http://localhost:3000/auth/register
// Body: { firstName, lastName, email, password, role }
authRouter.post("/register", AuthController.register);

export default authRouter;
```

### Routes utilisateurs - `back/src/routes/User.route.js`

```javascript
import express from "express";
import UserController from "../controllers/UserController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const userRouter = express.Router();

// ✅ ROUTES AUTHENTIFIÉES (tous les rôles)

// GET /users/me - Récupérer mon profil
// Header: Authorization: Bearer [token]
userRouter.get(
  "/me",
  (req, res, next) => AuthMiddleware(req, res, next),
  UserController.getCurrentUser,
);

// PUT /users/me - Mettre à jour mon profil
// Header: Authorization: Bearer [token]
userRouter.put(
  "/me",
  (req, res, next) => AuthMiddleware(req, res, next),
  UserController.updateCurrentUser,
);

// 🔒 ROUTES ADMIN SEULEMENT

// GET /users - Lister tous les utilisateurs
// Header: Authorization: Bearer [token]
// Rôle requis: ADMIN
userRouter.get(
  "/",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), // Vérifier rôle ADMIN
  UserController.getUsers,
);

// GET /users/:id - Récupérer un utilisateur spécifique
userRouter.get(
  "/:id",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  UserController.getUserById,
);

// POST /users - Créer un nouvel utilisateur
// Nota: NON protégé (admin depuis le panel)
userRouter.post("/", UserController.createUser);

// DELETE /users/:id - Supprimer un utilisateur
userRouter.delete(
  "/:id",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  UserController.deleteUser,
);

// PUT /users/:id - Modifier un utilisateur (Admin)
userRouter.put(
  "/:id",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  UserController.updateUser,
);

export default userRouter;
```

### Hiérarchie des routes

```
/auth
  ├── POST /login       → AuthController.login
  └── POST /register    → AuthController.register

/users
  ├── GET /me          → [AuthMiddleware] → UserController.getCurrentUser
  ├── PUT /me          → [AuthMiddleware] → UserController.updateCurrentUser
  ├── GET /            → [AuthMiddleware(ADMIN)] → UserController.getUsers
  ├── GET /:id         → [AuthMiddleware(ADMIN)] → UserController.getUserById
  ├── POST /           → UserController.createUser
  ├── PUT /:id         → [AuthMiddleware(ADMIN)] → UserController.updateUser
  └── DELETE /:id      → [AuthMiddleware(ADMIN)] → UserController.deleteUser

/videos
  ├── GET /            → Récupérer films
  └── ... (endpoints films)
```

---

## 🎨 Frontend - Intégration {#frontend-integration}

### Configuration Axios - `front/src/api/config.js`

```javascript
import axios from "axios";

// Créer instance Axios
const instance = axios.create({
  baseURL: "http://localhost:3000",
});

// Interceptor pour ajouter le token à chaque requête
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    // Ajouter le header Authorization
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;
```

**Explication:**

- Chaque requête Axios ajoute automatiquement `Authorization: Bearer [token]`
- Le token est récupéré depuis `localStorage`

### Module API Users - `front/src/api/users.js`

```javascript
import instance from "./config.js";

// GET /users - Lister tous les utilisateurs
async function getUsers() {
  return await instance.get("users");
}

// POST /users - Créer un utilisateur
async function createUser(newUser) {
  return await instance.post("users", newUser);
}

// PUT /users/:id - Modifier un utilisateur
async function updateUser(id, updatedUser) {
  return await instance.put(`users/${id}`, updatedUser);
}

// DELETE /users/:id - Supprimer un utilisateur
async function deleteUser(id) {
  return await instance.delete(`users/${id}`);
}

// GET /users/me - Récupérer mon profil
async function getCurrentUser() {
  return await instance.get("users/me");
}

// PUT /users/me - Mettre à jour mon profil
async function updateCurrentUser(updatedUser) {
  return await instance.put("users/me", updatedUser);
}

export {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getCurrentUser,
  updateCurrentUser,
};
```

### Page Login - `front/src/pages/auth/Login.jsx`

```jsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../../api/auth.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // Appeler l'API login
      const response = await login({ email, password });
      const { token, first_name, role } = response.data;

      // Sauvegarder le token et infos utilisateur dans localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("firstName", first_name);
      localStorage.setItem("email", email);
      localStorage.setItem("role", role);

      // Rediriger selon le rôle
      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "JURY") {
        navigate("/jury/home");
      } else {
        navigate("/producer/home");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">Se connecter</button>
    </form>
  );
}
```

### Middleware Protection des rôles - `front/src/middlewares/RoleGuard.jsx`

```jsx
import { Navigate } from "react-router";

export default function RoleGuard({ children, requiredRole }) {
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // Si pas authenticité → Login
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // Si rôle pas requis → Afficher la page
  if (!requiredRole) {
    return children;
  }

  // Si pas le bon rôle → Dashboard
  if (userRole !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // Rôle correct → Afficher la page
  return children;
}
```

### Utilisation du RoleGuard dans Router

```jsx
import RoleGuard from "./middlewares/RoleGuard.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/admin/dashboard",
    element: (
      <RoleGuard requiredRole="ADMIN">
        <AdminLayout>
          <Dashboard />
        </AdminLayout>
      </RoleGuard>
    ),
  },
  // ... autres routes
]);
```

### Fonction Logout

```javascript
function handleLogout() {
  // Nettoyer localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("firstName");
  localStorage.removeItem("role");

  // Recharger la page (redirection vers login)
  window.location.href = "/auth/login";
}
```

---

## 🔄 Flux d'authentification complet {#flux-complet}

### Scenario 1: Registration → Login → Access Admin

```
┌──────────────────────────────────────┐
│ 1. USER CLICKS "REGISTER"           │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│ 2. FRONTEND ENVOIE DATA             │
│ POST /auth/register                 │
│ Body: {                             │
│   firstName: "Marco",               │
│   lastName: "Pinna",                │
│   email: "marco@example.com",       │
│   password: "securepass123",        │
│   role: "ADMIN"                     │
│ }                                   │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│ 3. BACKEND REÇOIT                  │
│ AuthController.register()           │
│   → Appelle UserController.createUser()
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│ 4. BACKEND CRÉE L'UTILISATEUR      │
│ - Hash password avec bcrypt         │
│ - Crée user en BD                   │
│ - Retourne status 201               │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│ 5. USER CLICKS "LOGIN"              │
│ POST /auth/login                    │
│ Body: {                             │
│   email: "marco@example.com",       │
│   password: "securepass123"         │
│ }                                   │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│ 6. BACKEND VALIDE LOGIN             │
│ - Cherche user par email            │
│ - Comparaison password avec bcrypt  │
│ - Crée JWT: { email, iat, exp }    │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│ 7. BACKEND RETOURNE                 │
│ {                                   │
│   token: "eyJhbGc...",              │
│   email: "marco@example.com",       │
│   first_name: "Marco",              │
│   role: "ADMIN"                     │
│ }                                   │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│ 8. FRONTEND STOCKE EN localStorage  │
│ - token → Authorization header      │
│ - email, firstName, role → Affichage│
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│ 9. USER NAVIGATE TO ADMIN PAGE     │
│ GET /users                          │
│ Header: Authorization: Bearer [JWT] │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│ 10. MIDDLEWARE VALIDE JWT           │
│ - Extrait token du header           │
│ - Vérifie signature avec secret     │
│ - Récupère user de BD               │
│ - Vérifie rôle = ADMIN              │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│ 11. CONTROLLER RETOURNE USERS       │
│ UserController.getUsers()           │
│ Retourne array de tous les users    │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│ 12. PAGE ADMIN AFFICHE LA LISTE     │
│ ✅ Access granted!                   │
└──────────────────────────────────────┘
```

### Scenario 2: Token expiré

```
┌──────────────────────────────────────┐
│ USER FAIT REQUÊTE                  │
│ Token expiré (> 1 heure)           │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│ MIDDLEWARE REÇOIT TOKEN             │
│ jwt.verify() → ERREUR!              │
│ "Token expired"                     │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│ MIDDLEWARE RETOURNE 401             │
│ { error: "Invalid token" }          │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│ FRONTEND REÇOIT 401                 │
│ - Supprimer token de localStorage   │
│ - Rediriger vers /auth/login        │
│ - Afficher "Session expired"        │
└──────────────────────────────────────┘
```

---

## 🔒 Hashage de password - `back/src/utils/password.js`

```javascript
import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 10; // Niveau de sécurité

/**
 * Hache un password avec bcrypt
 * @param password Le password en clair
 * @returns Hash du password
 */
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
  // Résultat: "$2b$10$..." (long hash sécurisé)
}

/**
 * Compare un password en clair avec un hash
 * @param password Le password en clair (du login form)
 * @param hashedPassword Le hash en BD
 * @returns true si correspond, false sinon
 */
async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}
```

### Pourquoi bcrypt?

```
Password = "myPassword123"

❌ MAUVAIS (stocker en clair)
  BD: myPassword123
  Risque: Si quelqu'un accède à la BD, tous les passwords sont compromis

✅ BON (stocker le hash)
  BD: $2b$10$9F3s8D9K8E7B6C5A4Z3Y2X1W0V9U8T7S6R5Q4P3O2N1M0L9K8J7I
  Même si quelqu'un accède à la BD, on ne peut pas retrouver le password original

Hash = fonction unidirectionnelle:
  hash(password) = hash_value  ✅
  hash_value = password???     ❌ Impossible!

Chaque fois qu'on hash "myPassword123", on peut comparer avec bcrypt.compare()
```

---

## 📊 Résumé des technologies

| Composant            | Technology        | Usage                       |
| -------------------- | ----------------- | --------------------------- |
| **Backend**          | Node.js + Express | REST API                    |
| **Authentification** | JWT + bcrypt      | Tokens + Password hashing   |
| **Base de données**  | MySQL + Sequelize | ORM avec migrations         |
| **Frontend**         | React + Vite      | UI web                      |
| **Styling**          | Tailwind CSS      | Design responsive           |
| **HTTP Client**      | Axios             | Calls API avec interceptors |

---

## 🎯 Points clés à retenir

1. **JWT** - Token stateless qui contient email et expiration
2. **Middleware Auth** - Valide JWT et rôles avant chaque requête protégée
3. **Bcrypt** - Hash unidirectionnel pour les passwords (jamais en clair!)
4. **Migrations** - Historique versionné de la BD
5. **Controllers** - Logique métier, appels à la BD
6. **Routes** - Endpoints API, application des middlewares
7. **Frontend** - Axios interceptor ajoute token automatiquement
8. **localStorage** - Stockage du token, email, role client-side

---

## 🚀 Prochaines étapes

1. **Implémenter refresh tokens** - JWT expirant + refresh token
2. **Ajouter role-based routes** - Limiter accès par route
3. **Email verification** - Confirmer email à l'enregistrement
4. **Rate limiting** - Prévenir brute force attacks
5. **Logging** - Enregistrer actions importantes
6. **Tests unitaires** - Jest pour controllers et utils

---

**Créé le:** 2 février 2026
**Auteur:** Copilot GitHub
**Projet:** MarsAI Groupe 2 - Tutorial Complet
