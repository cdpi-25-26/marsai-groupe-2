import express from "express";
import VoteController from "../controllers/VoteController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const voteRouter = express.Router();

voteRouter.get("/", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), VoteController.getVote);

voteRouter.get("/:id", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), VoteController.getVoteById);

voteRouter.post("/:id_movie/:id_user", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), VoteController.createVote);

voteRouter.delete("/:id", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), VoteController.deleteVote);


voteRouter.put("/:id", (req, res, next) => 
AuthMiddleware(req, res, next, ["ADMIN"]),VoteController.updateVote);

export default voteRouter;