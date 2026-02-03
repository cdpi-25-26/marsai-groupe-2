import jwt from "jsonwebtoken";
import db from "../models/index.js";
const User = db.User;

/**
 * Middleware d'authentification JWT
 * Valide le token JWT, vérifie l'utilisateur en base de données,
 * et contrôle les permissions selon les rôles requis
 * 
 * @param {Object} req - L'objet requête HTTP
 * @param {Object} res - L'objet réponse HTTP
 * @param {Function} next - Fonction pour continuer vers le prochain middleware/contrôleur
 * @param {Array<string>} roles - Liste des rôles autorisés (ex: ["ADMIN", "JURY"])
 *                                 Si vide, tous les rôles authentifiés sont acceptés
 * 
 * @example
 * // Utilisation dans une route:
 * router.get("/users", (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]), UserController.getUsers);
 */
export default async function AuthMiddleware(req, res, next, roles = []) {
  // ÉTAPE 1: Extraire le token du header Authorization
  const authHeader = req.header("Authorization");
  const [prefix, token] = authHeader?.split(" ") || [null, undefined];

  // Vérifier le format "Bearer [token]"
  if (prefix !== "Bearer") {
    return res.status(401).json({ error: "Aucun token Bearer fourni" });
  }

  if (!token) {
    return res
      .status(401)
      .json({ error: "Vous devez être authentifié pour accéder à cette ressource" });
  }

  try {
    // ÉTAPE 2: Vérifier et décoder le JWT avec la clé secrète
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }

    // Vérifier que le payload contient l'email
    if (!decoded?.email) {
      return res.status(401).json({ error: "Payload JWT invalide" });
    }

    // ÉTAPE 3: Récupérer l'utilisateur de la base de données
    let user;
    try {
      user = await User.findOne({ where: { email: decoded.email } });
    } catch (err) {
      return res.status(500).json({ error: "Erreur base de données" });
    }

    // ÉTAPE 4: Vérifier que l'utilisateur existe et contrôler les permissions
    if (!user || (roles.length && !roles.includes(user.role))) {
      return res.status(403).json({
        error:
          "Accès refusé. Vous n'avez pas les permissions nécessaires pour accéder à cette ressource",
      });
    }

    // ÉTAPE 5: Attacher l'utilisateur à l'objet requête pour le contrôleur
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}
