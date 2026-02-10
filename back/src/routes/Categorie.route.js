import express from "express";
import CategorieController from "../controllers/CategorieController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const categorieRouter = express.Router();

// Public
categorieRouter.get("/", CategorieController.getCategories);

categorieRouter.get("/:id", CategorieController.getCategorieById);


// ADMIN uniquement
categorieRouter.use(AuthMiddleware(["ADMIN"]));

categorieRouter.post("/", CategorieController.createCategorie);

categorieRouter.put("/:id", CategorieController.updateCategorie);

categorieRouter.delete("/:id",CategorieController.deleteCategorie
);

export default categorieRouter;
