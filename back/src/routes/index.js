import express from "express";
import userRouter from "./User.route.js";
import movieRouter from "./Movie.route.js";
import authRouter from "./Auth.route.js";

const router = express.Router();

/**
 * Enregistrement de toutes les routes principales
 * Chaque groupe de routes est préfixé par son chemin
 */
router.use("/auth", authRouter);      // Routes d'authentification
router.use("/users", userRouter);     // Routes de gestion utilisateurs
router.use("/videos", movieRouter);   // Routes de gestion films/vidéos

export default router;
