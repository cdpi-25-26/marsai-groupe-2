import express from "express";
import CategorieController from "../controllers/CategorieController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();


// Public

router.get("/", CategorieController.getCategories);
router.get("/:id", CategorieController.getCategorieById);


// ADMIN uniquement

router.post(
  "/",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  CategorieController.createCategorie
);

router.put(
  "/:id",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  CategorieController.updateCategorie
);

router.delete(
  "/:id",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  CategorieController.deleteCategorie
);

export default router;
