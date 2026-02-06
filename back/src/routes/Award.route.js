import express from "express";
import AwardController from "../controllers/AwardController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const awardRouter = express.Router();

awardRouter.get("/", AwardController.getAward);

awardRouter.get("/:id", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),AwardController.getAwardById);

awardRouter.post("/:id_movie", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),AwardController.createAward);

awardRouter.delete("/:id", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),AwardController.deleteAward);

awardRouter.put("/:id/:id_movie", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),AwardController.updateAward);

export default awardRouter;