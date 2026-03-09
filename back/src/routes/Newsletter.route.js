import express from "express";
import NewsletterController from "../controllers/NewsletterController.js";

const newsletterRouter = express.Router();

newsletterRouter.post("/", NewsletterController.main);

export default newsletterRouter;
