import db from "../models/index.js";
const User = db.User;
import { comparePassword } from "../utils/password.js";
import UserController from "./UserController.js";
import jwt from "jsonwebtoken";

function login(req, res) {
  const { email, password } = req.body;

  User.findOne({ where: { email } }).then((user) => {
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    comparePassword(password, user.password).then((isMatch) => {
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      });

      return res.status(200).json({
        message: "Login successful",
        email: user.email,
        first_name: user.first_name,
        role: user.role,
        token,
      });
    });
  });
}

function register(req, res) {
  UserController.createUser(req, res);
  // Email sending (optional)
}

export default { login, register };
