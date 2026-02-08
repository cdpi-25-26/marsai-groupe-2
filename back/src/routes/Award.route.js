import express from "express";
import AwardController from "../controllers/AwardController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const awardRouter = express.Router();

awardRouter.use(AuthMiddleware(["ADMIN"]));

awardRouter.get("/", AwardController.getAward);

awardRouter.get("/:id", AwardController.getAwardById);

awardRouter.post("/:id_movie", AwardController.createAward);

awardRouter.delete("/:id", AwardController.deleteAward);

awardRouter.put("/:id/:id_movie", AwardController.updateAward);

export default awardRouter;