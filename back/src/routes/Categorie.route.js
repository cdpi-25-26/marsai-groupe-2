import express from "express";
import CategorieController from "../controllers/CategorieController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();


// Public

router.get("/", CategorieController.getCategories);
router.get("/:id", CategorieController.getCategorieById);


// ADMIN uniquement
router.use(AuthMiddleware(["ADMIN"]));

router.post(
  "/",
  CategorieController.createCategorie
);

router.put(
  "/:id",
  CategorieController.updateCategorie
);

router.delete(
  "/:id",
  CategorieController.deleteCategorie
);

export default router;
