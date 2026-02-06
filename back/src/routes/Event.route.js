import express from "express";
import EventsController from "../controllers/EventsController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const eventRouter = express.Router();

eventRouter.get("/", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), EventsController.getEvents);

eventRouter.get("/:id_event", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), EventsController.getEventById);

eventRouter.post("/", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), EventsController.createEvent);

eventRouter.delete("/:id_event", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), EventsController.deleteEvent);

eventRouter.put("/:id_event", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), EventsController.updateEvent);

export default eventRouter;
