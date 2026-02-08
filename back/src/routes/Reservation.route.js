import express from "express";
import ReservationController from "../controllers/ReservationController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const reservationRouter = express.Router();


reservationRouter.use(AuthMiddleware(["ADMIN"]));

reservationRouter.get("/", ReservationController.getReservations);

reservationRouter.get("/:id_reservation",ReservationController.getReservationById);

reservationRouter.post("/", ReservationController.createReservation);

reservationRouter.put("/:id_reservation",ReservationController.updateReservation);

reservationRouter.delete("/:id_reservation", ReservationController.deleteReservation);

export default reservationRouter;