import express from "express";
import VoteController from "../controllers/VoteController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const voteRouter = express.Router();

voteRouter.use(AuthMiddleware(["ADMIN"]));

voteRouter.get("/", VoteController.getVote);

voteRouter.get("/:id", VoteController.getVoteById);

voteRouter.post("/:id_movie/:id_user", VoteController.createVote);

voteRouter.delete("/:id", VoteController.deleteVote);


voteRouter.put("/:id_vote", VoteController.updateVote);

export default voteRouter;