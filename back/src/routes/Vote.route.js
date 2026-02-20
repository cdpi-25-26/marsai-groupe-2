import express from "express";
import VoteController from "../controllers/VoteController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const voteRouter = express.Router();

// JURY: gérer ses votes
voteRouter.get("/mine", AuthMiddleware(["JURY", "ADMIN"]), VoteController.getMyVotes);
voteRouter.get("/mine/:id_movie", AuthMiddleware(["JURY", "ADMIN"]), VoteController.getMyVoteByMovie);
voteRouter.post("/mine/:id_movie", AuthMiddleware(["JURY", "ADMIN"]), VoteController.createOrUpdateMyVote);

// ADMIN: gestion globale des votes
voteRouter.get("/", AuthMiddleware(["ADMIN"]), VoteController.getVote);
voteRouter.post("/:id_movie/:id_user", AuthMiddleware(["ADMIN"]), VoteController.createVote);
voteRouter.get("/:id", AuthMiddleware(["ADMIN"]), VoteController.getVoteById);
voteRouter.delete("/:id", AuthMiddleware(["ADMIN"]), VoteController.deleteVote);
voteRouter.put("/:id_vote", AuthMiddleware(["ADMIN"]), VoteController.updateVote);

export default voteRouter;