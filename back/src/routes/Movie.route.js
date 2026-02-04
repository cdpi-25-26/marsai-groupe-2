
import express from "express";
import MovieController from "../controllers/MovieController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

/ ////////////////////////////////////////////////////////////////////////// Voir tous les films
 // Public (ex: page sélection officielle)

router.get(
  "/",
  MovieController.getMovies
);


///////////////////////////////////////////////////////////////////////// Voir un film par ID
// Public

router.get(
  "/:id",
  MovieController.getMovieById
);


//////////////////////////////////////////////////////////////////////// Soumettre un film
 // Seulement pour PRODUCER connecté

router.post(
  "/",
  (req, res, next) => AuthMiddleware(req, res, next, ["PRODUCER"]),
  MovieController.createMovie
);


/////////////////////////////////////////////////////////////////////////// Modifier un film
//Seulement le propriétaire ou ADMIN

/*router.put(
  "/:id",
  (req, res, next) => AuthMiddleware(req, res, next, ["PRODUCER"]),
  MovieController.updateMovie
);*/


///////////////////////////////////////////////////////////////////////// Supprimer un film
// ADMIN uniquement
router.delete(
  "/:id",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  MovieController.deleteMovie
);

export default router;








/****** 
const authorize = (roles = []) =>
  (req, res, next) => AuthMiddleware(req, res, next, roles);
*****/