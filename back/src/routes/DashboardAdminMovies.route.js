import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import {
  getAllMovies,
  getMovieById
} from "../controllers/DashboardAdminMoviesController.js";

const router = express.Router();

router.get(
  "/movies",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  getAllMovies
);

router.get(
  "/movies/:id",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  getMovieById
);

export default router;
