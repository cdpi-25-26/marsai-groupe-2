import express from "express";
import MovieController from "../controllers/MovieController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

/**
 * Helper pour simplifier l'utilisation des rôles
 */
const authorize = (roles = []) =>
  (req, res, next) => AuthMiddleware(req, res, next, roles);



 //-1- Voir tous les films (public)
 
router.get(
  "/",
  MovieController.getMovies
);



 //-2- Voir un film par ID (public)
 
router.get(
  "/:id",
  MovieController.getMovieById
);



 //-3- Soumettre un film (PRODUCER uniquement)
 
router.post(
  "/",
  authorize(["PRODUCER", "ADMIN"]),
  MovieController.createMovie
);



 //-4- Modifier un film (PRODUCER connecté)
 
/*router.put(
  "/:id",
  authorize(["PRODUCER"]),
  MovieController.updateMovie
);*/



 //-5- Supprimer un film (ADMIN uniquement)
 
router.delete(
  "/:id",
  authorize(["ADMIN"]),
  MovieController.deleteMovie
);


 //-6- assigner un film à des juries(ADMIN uniquement)
 

router.post(
  "/:id/assign-juries",
  authorize(["ADMIN"]),
  MovieController.assignJuriesToMovie
);




export default router;





/*import express from "express";
import MovieController from "../controllers/MovieController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

/ ////////////////////////////////////////////////////////////////////////// Voir tous les films
 // Public (ex: page sélection officielle)

router.get(
  "/",
  MovieController.getMovies
);

//////////////////////////////////////////////////////////////////////// Mes films
// Seulement pour PRODUCER connecté

router.get(
  "/mine",
  (req, res, next) => AuthMiddleware(req, res, next, ["PRODUCER"]),
  MovieController.getMyMovies
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

  (req, res, next) => AuthMiddleware(req, res, next, ["PRODUCER", "ADMIN"]),
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
/*router.delete(
  "/:id",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  MovieController.deleteMovie
);

export default router;*/


