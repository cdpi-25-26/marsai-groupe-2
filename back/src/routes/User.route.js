import express from "express";
import UserController from "../controllers/UserController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const userRouter = express.Router();

/**
 * ===== ROUTES POUR L'UTILISATEUR AUTHENTIFIÉ =====
 * Accessible par tous les rôles (ADMIN, JURY, PRODUCER)
 */

/**
 * GET /users/me
 * Récupère le profil de l'utilisateur actuellement authentifié
 * Header requis: Authorization: Bearer [token JWT]
 * Response: Données utilisateur (sans mot de passe)
 */
userRouter.get("/me", (req, res, next) => AuthMiddleware(req, res, next), UserController.getCurrentUser);

/**
 * PUT /users/me
 * Met à jour le profil de l'utilisateur actuellement authentifié
 * Header requis: Authorization: Bearer [token JWT]
 * Body: Champs à mettre à jour (first_name, last_name, email, password, etc.)
 * Response: Utilisateur mis à jour
 */
userRouter.put("/me", (req, res, next) => AuthMiddleware(req, res, next), UserController.updateCurrentUser);

/**
 * ===== ROUTES RÉSERVÉES AUX ADMINISTRATEURS =====
 * Nécessitent un rôle ADMIN pour accéder
 */

/**
 * GET /users
 * Récupère la liste de tous les utilisateurs
 * Rôle requis: ADMIN
 * Header requis: Authorization: Bearer [token JWT]
 * Response: Array de tous les utilisateurs
 */
userRouter.get("/", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), UserController.getUsers);

/**
 * GET /users/:id
 * Récupère un utilisateur spécifique par son ID
 * Rôle requis: ADMIN
 * Param: id = id_user de l'utilisateur à récupérer
 * Header requis: Authorization: Bearer [token JWT]
 * Response: Données de l'utilisateur
 */
userRouter.get("/:id", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), UserController.getUserById);

/**
 * POST /users
 * Crée un nouvel utilisateur en base de données
 * ⚠️ NON protégé (pour permettre aux admins de créer des utilisateurs depuis le panel admin)
 * Body: { firstName, lastName, email, password, role }
 * Response: { message, newUser }
 */
userRouter.post("/", UserController.createUser);

/**
 * DELETE /users/:id
 * Supprime un utilisateur de la base de données
 * Rôle requis: ADMIN
 * Param: id = id_user de l'utilisateur à supprimer
 * Header requis: Authorization: Bearer [token JWT]
 * Response: Status 204 No Content
 */
userRouter.delete("/:id", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), UserController.deleteUser);

/**
 * PUT /users/:id
 * Met à jour les données d'un utilisateur (Admin modifie un autre utilisateur)
 * Rôle requis: ADMIN
 * Param: id = id_user de l'utilisateur à modifier
 * Body: Champs à mettre à jour (firstName, lastName, email, password, role)
 * Header requis: Authorization: Bearer [token JWT]
 * Response: Utilisateur mis à jour
 */
userRouter.put("/:id", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), UserController.updateUser);

export default userRouter;
