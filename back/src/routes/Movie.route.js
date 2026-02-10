import express from "express";
import MovieController from "../controllers/MovieController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const movieRouter = express.Router();

// ADMIN uniquement
categorieRouter.use(AuthMiddleware(["ADMIN"]));

 //-1- Voir tous les films (public)
movieRouter.get("/",MovieController.getMovies);

 //-2- Voir un film par ID (public)
movieRouter.get("/:id",MovieController.getMovieById);

 //-3- Soumettre un film (PRODUCER & ADMIN uniquement)
movieRouter.post("/", AuthMiddleware(["ADMIN","PRODUCER"]),MovieController.createMovie
);

 //-5- Supprimer un film (ADMIN uniquement)
movieRouter.delete("/:id", MovieController.deleteMovie);

 //-6- assigner un film à des juries(ADMIN uniquement)
movieRouter.post("/:id/assign-juries", MovieController.assignJuriesToMovie);

export default movieRouter;
