import express from "express";
import CategorieController from "../controllers/CategorieController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();


const authorize = (roles = []) =>
  (req, res, next) => AuthMiddleware(req, res, next, roles);

// Public

router.get(
    "/",
    authorize(["ADMIN"]),
     CategorieController.getCategories);



router.get(
    "/:id",
    authorize(["ADMIN"]),
    CategorieController.getCategorieById);


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
