import express from "express";
import EventsController from "../controllers/EventsController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const eventRouter = express.Router();

eventRouter.use(AuthMiddleware(["ADMIN"]));

eventRouter.get("/", EventsController.getEvents);

eventRouter.get("/:id_event", EventsController.getEventById);

eventRouter.post("/", EventsController.createEvent);

eventRouter.delete("/:id_event", EventsController.deleteEvent);

eventRouter.put("/:id_event", EventsController.updateEvent);

export default eventRouter;
