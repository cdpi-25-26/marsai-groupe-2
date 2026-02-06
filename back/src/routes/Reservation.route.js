import express from "express";
import ReservationController from "../controllers/ReservationController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const reservationRouter = express.Router();

reservationRouter.get("/", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), ReservationController.getReservations);

reservationRouter.get("/:id_reservation ", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), ReservationController.getReservationById);

reservationRouter.post("/", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), ReservationController.createReservation);

reservationRouter.put("/:id_reservation", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), ReservationController.updateReservation);

reservationRouter.delete("/:id_reservation", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), ReservationController.deleteReservation);

export default reservationRouter;