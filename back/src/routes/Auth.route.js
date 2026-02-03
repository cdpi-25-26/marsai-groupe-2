import express from "express";
import AuthController from "../controllers/AuthController.js";

const authRouter = express.Router();

/**
 * POST /auth/login
 * Route de connexion utilisateur
 * Vérifie les identifiants et retourne un JWT
 * Body: { email, password }
 * Response: { message, email, first_name, role, token }
 */
authRouter.post("/login", AuthController.login);

/**
 * POST /auth/register
 * Route d'enregistrement d'un nouvel utilisateur
 * Crée un compte avec les données fournies
 * Body: { firstName, lastName, email, password, role }
 * Response: { message, newUser }
 */
authRouter.post("/register", AuthController.register);

export default authRouter;
