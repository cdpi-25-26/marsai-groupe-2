import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import MovieController from "../controllers/MovieController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const movieRouter = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
// ADMIN & PRODUCER
// Supprimer un film (ADMIN peut tout supprimer, PRODUCER seulement les siens)
movieRouter.delete("/:id", AuthMiddleware(["ADMIN", "PRODUCER"]), MovieController.deleteMovie);

// Modifier un film (ADMIN + PRODUCER propriétaire)
movieRouter.put("/:id", AuthMiddleware(["ADMIN", "PRODUCER"]), filmUpload, MovieController.updateMovie);

// Mettre à jour le statut (ADMIN)
movieRouter.put("/:id/status", AuthMiddleware(["ADMIN"]), MovieController.updateMovieStatus);

// Assigner catégories (ADMIN)
movieRouter.put("/:id/categories", AuthMiddleware(["ADMIN"]), MovieController.updateMovieCategories);

// Assigner jurys (ADMIN)
movieRouter.put("/:id/juries", AuthMiddleware(["ADMIN"]), MovieController.updateMovieJuries);
    { name: "thumbnail2", maxCount: 1 },
    { name: "thumbnail3", maxCount: 1 },
    { name: "subtitlesSrt", maxCount: 1 }
  ]),
  MovieController.createMovie
);


// ADMIN & PRODUCER
// Supprimer un film (ADMIN peut tout supprimer, PRODUCER seulement les siens)
movieRouter.delete("/:id", AuthMiddleware(["ADMIN", "PRODUCER"]),MovieController.deleteMovie);

// Modifier un film (ADMIN + PRODUCER propriétaire)
movieRouter.put(
  "/:id",
  AuthMiddleware(["ADMIN", "PRODUCER"]),
  upload.fields([
    { name: "filmFile", maxCount: 1 },
    { name: "thumbnail1", maxCount: 1 },
    { name: "thumbnail2", maxCount: 1 },
    { name: "thumbnail3", maxCount: 1 },
    { name: "subtitlesSrt", maxCount: 1 }
  ]),
  MovieController.updateMovie
);

// Assigner un film à des juries(ADMIN)
// movieRouter.post("/:id/assign-juries", AuthMiddleware(["ADMIN"]),MovieController.assignJuriesToMovie);

// Mettre à jour le statut (ADMIN)
movieRouter.put("/:id/status", AuthMiddleware(["ADMIN"]),MovieController.updateMovieStatus);

// Assigner catégories (ADMIN)
movieRouter.put("/:id/categories", AuthMiddleware(["ADMIN"]),MovieController.updateMovieCategories);

// Assigner jurys (ADMIN)
movieRouter.put("/:id/juries", AuthMiddleware(["ADMIN"]),MovieController.updateMovieJuries);

// Assigner un film à des juries(ADMIN)
// movieRouter.post("/:id/assign-juries", AuthMiddleware(["ADMIN"]),MovieController.assignJuriesToMovie);

// Assigner collaborateurs (PRODUCER/ADMIN)
movieRouter.put("/:id/collaborators", AuthMiddleware(["ADMIN", "PRODUCER"]), MovieController.updateMovieCollaborators);

export default movieRouter;
