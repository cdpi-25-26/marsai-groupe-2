import db from "../models/index.js";
const User = db.User;
import { comparePassword } from "../utils/password.js";
import UserController from "./UserController.js";
import jwt from "jsonwebtoken";

/**
 * Fonction de connexion (Login)
 * Valide les identifiants de l'utilisateur et crée un JWT
 * @param {Object} req - La requête HTTP contenant { email, password }
 * @param {Object} res - La réponse HTTP
 * @returns {Object} Un token JWT et les infos utilisateur si succès, sinon erreur 401
 */
function login(req, res) {
  const { email, password } = req.body;

  // Chercher l'utilisateur par son email
  User.findOne({ where: { email } }).then((user) => {
    if (!user) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    // Comparer le mot de passe fourni avec le hash en base de données
    comparePassword(password, user.password).then((isMatch) => {
      if (!isMatch) {
        return res.status(401).json({ error: "Identifiants invalides" });
      }

      // Créer un JWT valide 1 heure par défaut
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      });

      // Retourner le token et les infos utilisateur
      return res.status(200).json({
        message: "Connexion réussie",
        email: user.email,
        first_name: user.first_name,
        role: user.role,
        token,
      });
    });
  });
}

/**
 * Fonction d'enregistrement (Register)
 * Crée un nouvel utilisateur dans la base de données
 * @param {Object} req - La requête HTTP contenant les données d'enregistrement
 * @param {Object} res - La réponse HTTP
 */
function register(req, res) {
  // Déléguer à UserController pour créer l'utilisateur
  UserController.createUser(req, res);
}

export default { login, register };
