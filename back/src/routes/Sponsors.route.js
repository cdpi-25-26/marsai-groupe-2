import express from "express";
import SponsorController from "../controllers/SponsorController.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";

const sponsorRouter = express.Router();



// PUBLIC

sponsorRouter.get("/", SponsorController.getAllSponsors);

sponsorRouter.get("/:id", SponsorController.getSponsorById);




// ADMIN ONLY
 
sponsorRouter.post("/", AuthMiddleware(["admin"]), SponsorController.createSponsor);

sponsorRouter.put("/:id", AuthMiddleware(["admin"]), SponsorController.updateSponsor);

sponsorRouter.delete("/:id", AuthMiddleware(["admin"]), SponsorController.deleteSponsor);

export default sponsorRouter;