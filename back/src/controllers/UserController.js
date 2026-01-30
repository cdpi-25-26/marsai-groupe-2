import User from "../models/user.js";
import { hashPassword } from "../utils/password.js";

// List
function getUsers(req, res) {
  User.findAll().then((users) => {
    res.json(users);
  });
}

// Create
function createUser(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Missing data" });
  }

  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  User.findOne({ where: { email } }).then(async (user) => {
    if (user) {
      res.json({ message: "User already exists", user });
    } else {
      const hash = await hashPassword(password);
      User.create({ email: email, password: hash, role: role }).then(
        (newUser) => {
          res.status(201).json({ message: "User created", newUser });
        },
      );
    }
  });
}

// Delete
function deleteUser(req, res) {
  const { id } = req.params;
  User.destroy({ where: { id } }).then(() => {
    res.status(204).json({ message: "User deleted" });
  });
}

// Update
function updateUser(req, res) {
  const { id } = req.params;
  const { email, password, role } = req.body;

  User.findOne({ where: { id } }).then((user) => {
    if (user) {
      user.email = email || user.email;
      user.password = password || user.password;
      user.role = role || user.role;

      user.save().then((updatedUser) => {
        res.json(updatedUser);
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
}

// Get user by ID
function getUserById(req, res) {
  const { id } = req.params;
  User.findOne({ where: { id } }).then((user) => {
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
}

function findUserByEmail(email) {
  return User.findOne({ where: { email } });
}


export default {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getUserById,
  findUserByEmail
};