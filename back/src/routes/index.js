import express from "express";
import userRouter from "./User.route.js";
import movieRouter from "./Movie.route.js";
import authRouter from "./Auth.route.js";
import awardRouter from "./Award.route.js";
import voteRouter from "./Vote.route.js";
import categorieRouter from "./Categorie.route.js";
//import collaboratorRouter from "./Collaborator.route.js";
import reservationRouter from "./Reservation.route.js";import eventRouter from "./Event.route.js";

const router = express.Router();

/**
 * Enregistrement de toutes les routes principales
 * Chaque groupe de routes est préfixé par son chemin
 */
router.use("/auth", authRouter);      // Routes d'authentification
router.use("/users", userRouter);     // Routes de gestion utilisateurs
router.use("/movies", movieRouter);   // Routes de gestion films/vidéos
router.use("/awards", awardRouter);  // Routes de gestion awards
router.use("/votes", voteRouter); // Routes de gestion votes
router.use("/categories", categorieRouter); // Routes de gestion catégories
//router.use("/collaborators", collaboratorRouter); // Routes de gestion collaborateurs
router.use("/reservations", reservationRouter); // Routes de gestion réservations
router.use("/events", eventRouter); // Routes de gestion réservations

export default router;
