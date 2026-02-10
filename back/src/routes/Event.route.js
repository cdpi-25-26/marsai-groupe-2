import express from "express";
import EventsController from "../controllers/EventsController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const eventRouter = express.Router();

eventRouter.use(AuthMiddleware(["ADMIN"]));

eventRouter.get("/", EventsController.getEvents);

eventRouter.post("/", EventsController.createEvent);

eventRouter.get("/:id_event", EventsController.getEventById);

eventRouter.put("/:id_event", EventsController.updateEvent);

eventRouter.delete("/:id_event", EventsController.deleteEvent);

export default eventRouter;
