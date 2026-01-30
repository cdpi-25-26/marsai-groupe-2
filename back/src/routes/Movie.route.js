import express from "express";
import MovieController from "../controllers/MovieController.js";

const movieRouter = express.Router();

movieRouter.get("/", MovieController.getMovies); // Admin
movieRouter.post("/", MovieController.createMovie); // Admin

movieRouter.post("/upload", (req, res) => {
  // Code à faire
  res.send("Upload de vidéo");
}); // User

export default movieRouter;
