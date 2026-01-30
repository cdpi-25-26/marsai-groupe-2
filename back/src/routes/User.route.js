import express from "express";
import UserController from "../controllers/UserController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const userRouter = express.Router();

// Admin
userRouter.use((req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]));
userRouter.get("/", UserController.getUsers); // List all users
userRouter.get("/:id", UserController.getUserById); // Get user by ID
userRouter.post("/", UserController.createUser); // Create new user
userRouter.delete("/:id", UserController.deleteUser); // Delete user by ID
userRouter.put(
  "/:id",
  UserController.updateUser,
); // Update user by ID

export default userRouter;
