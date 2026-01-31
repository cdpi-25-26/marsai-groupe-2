import express from "express";
import UserController from "../controllers/UserController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const userRouter = express.Router();

// Admin

// Solo ADMIN può vedere la lista utenti
userRouter.get("/", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), UserController.getUsers);
userRouter.get("/:id", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), UserController.getUserById);
userRouter.post("/", UserController.createUser); // Create new user
userRouter.delete("/:id", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), UserController.deleteUser);
userRouter.put("/:id", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), UserController.updateUser);

// Endpoint per utente autenticato (Producer, Jury, Admin)
userRouter.get("/me", (req, res, next) => AuthMiddleware(req, res, next), UserController.getCurrentUser);

// Endpoint per aggiornare il proprio profilo (Producer, Jury, Admin)
userRouter.put("/me", (req, res, next) => AuthMiddleware(req, res, next), UserController.updateCurrentUser);

export default userRouter;
