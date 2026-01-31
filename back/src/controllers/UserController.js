// Update current user (by JWT)
function updateCurrentUser(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    User.findOne({ where: { email } }).then(async (user) => {
      if (!user) return res.status(404).json({ error: "User not found" });
      // Aggiorna solo i campi consentiti
      const updatableFields = [
        "first_name", "last_name", "phone", "mobile", "birth_date", "street", "postal_code", "city", "country", "biography", "job", "portfolio", "youtube", "instagram", "linkedin", "facebook", "tiktok", "known_by_mars_ai"
      ];
      updatableFields.forEach(field => {
        if (field in req.body) user[field] = req.body[field];
      });
      if (req.body.password) {
        user.password = await hashPassword(req.body.password);
      }
      user.save().then(updatedUser => {
        res.json(updatedUser);
      });
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}
// Get current user (by JWT)
import jwt from "jsonwebtoken";

function getCurrentUser(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    User.findOne({ where: { email } }).then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}
import db from "../models/index.js";
const User = db.User;
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

  // DEBUG: logga il body ricevuto
  console.log("[REGISTER] req.body:", req.body);


  let {
    first_name,
    last_name,
    email,
    password,
    phone,
    mobile,
    birth_date,
    street,
    postal_code,
    city,
    country,
    biography,
    job,
    portfolio,
    youtube,
    instagram,
    linkedin,
    facebook,
    tiktok,
    known_by_mars_ai,
    role
  } = req.body;

  // Se birth_date è vuoto o non valido, impostalo a null
  if (!birth_date || birth_date === '' || birth_date === 'Invalid date') {
    birth_date = null;
  }

  if (!first_name || !last_name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  User.findOne({ where: { email } }).then(async (user) => {
    if (user) {
      res.json({ message: "User already exists", user });
    } else {
      const hash = await hashPassword(password);
      User.create({
        first_name,
        last_name,
        email,
        password: hash,
        phone,
        mobile,
        birth_date,
        street,
        postal_code,
        city,
        country,
        biography,
        job,
        portfolio,
        youtube,
        instagram,
        linkedin,
        facebook,
        tiktok,
        known_by_mars_ai,
        role
      })
      .then((newUser) => {
        res.status(201).json({ message: "User created", newUser });
      })
      .catch((err) => {
        console.error("[REGISTER] Sequelize error:", err);
        res.status(500).json({ error: "DB error", details: err.message });
      });
    }
  });
}

// Delete
function deleteUser(req, res) {
  const { id_user } = req.params;
  User.destroy({ where: { id_user } }).then(() => {
    res.status(204).json({ message: "User deleted" });
  });
}

// Update
function updateUser(req, res) {
  const { id_user } = req.params;
  const { first_name, last_name, email, password, role } = req.body;

  User.findOne({ where: { id_user } }).then(async (user) => {
    if (user) {
      user.first_name = first_name || user.first_name;
      user.last_name = last_name || user.last_name;
      user.email = email || user.email;
      if (password) {
        user.password = await hashPassword(password);
      }
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
  const { id_user } = req.params;
  User.findOne({ where: { id_user } }).then((user) => {
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
  findUserByEmail,
  getCurrentUser,
  updateCurrentUser
};