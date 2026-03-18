import db from "../models/index.js";
import { hashPassword } from "../utils/password.js";

function getCurrentUser(req, res) {
  try {
    const user = req.user;  // Mis à disposition par AuthMiddleware
    if (user) {
      // Retirer le mot de passe et les données sensibles de la réponse
      const { password, ...safeUser } = user.toJSON();
      res.json(safeUser);
    } else {
      res.status(404).json({ error: "Utilisateur non trouvé" });
    }
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur" });
  }
}

async function updateCurrentUser(req, res) {
  try {
    const user = req.user;  // Récupéré par AuthMiddleware
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    
    // Liste des champs autorisés à être modifiés par l'utilisateur lui-même
    const updatableFields = [
      "first_name", "last_name", "phone", "mobile", "birth_date", 
      "street", "postal_code", "city", "country", "biography", 
      "job", "portfolio", "youtube", "instagram", "linkedin", 
      "facebook", "tiktok", "known_by_mars_ai"
    ];
    
    // Appliquer les mises à jour seulement aux champs autorisés
    updatableFields.forEach(field => {
      if (field in req.body) user[field] = req.body[field];
    });
    
    // Mettre à jour le mot de passe s'il est fourni
    if (req.body.password) {
      user.password = await hashPassword(req.body.password);
    }
    
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
  }
}

function getUsers(req, res) {
  db.User.findAll().then((users) => {
    res.json(users);
  });
}

function createUser(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  // Mapping compatibilité camelCase (frontend) ↔ snake_case (base de données)
  let {
    first_name,
    firstName,
    last_name,
    lastName,
    email,
    password,
    phone,
    mobile,
    birth_date,
    birthDate,
    street,
    postal_code,
    postalCode,
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
    knownByMarsAi,
    role
  } = req.body;

  // Convertir les variables camelCase en snake_case si nécessaire
  first_name = first_name || firstName;
  last_name = last_name || lastName;
  birth_date = birth_date || birthDate;
  postal_code = postal_code || postalCode;
  known_by_mars_ai = known_by_mars_ai || knownByMarsAi;

  if (!role) {
    role = "PRODUCER";  // Rôle par défaut
  }

  // Valider la date de naissance
  if (!birth_date || birth_date === '' || birth_date === 'Invalid date') {
    birth_date = null;
  }

  // Vérifier que tous les champs obligatoires sont remplis
  if (!first_name || !last_name || !email || !password || !role) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  // Vérifier que l'email n'existe pas déjà
  db.User.findOne({ where: { email } }).then(async (user) => {
    if (user) {
      res.json({ message: "Cet utilisateur existe déjà", user });
    } else {
      // Hacher le mot de passe avec bcrypt
      const hash = await hashPassword(password);
      
      // Créer l'utilisateur en base de données
      db.User.create({
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
        res.status(201).json({ message: "Utilisateur créé avec succès", newUser });
      })
      .catch((err) => {
        res.status(500).json({ error: "Erreur base de données", details: err.message });
      });
    }
  });
}

function deleteUser(req, res) {
  const id_user = req.params.id;
  db.User.destroy({ where: { id_user } }).then(() => {
    res.status(204).json({ message: "Utilisateur supprimé avec succès" });
  });
}

function updateUser(req, res) {
  const id_user = req.params.id;
  
  // Mapping compatibilité camelCase (frontend) ↔ snake_case (base de données)
  let {
    first_name,
    firstName,
    last_name,
    lastName,
    email,
    password,
    role
  } = req.body;

  // Convertir les variables camelCase en snake_case si nécessaire
  first_name = first_name || firstName;
  last_name = last_name || lastName;

  // Récupérer l'utilisateur et le mettre à jour
  db.User.findOne({ where: { id_user } }).then(async (user) => {
    if (user) {
      // Mettre à jour les champs fournis (garder l'ancien si non fourni)
      user.first_name = first_name || user.first_name;
      user.last_name = last_name || user.last_name;
      user.email = email || user.email;
      
      // Hasher le mot de passe s'il est fourni et non vide
      if (password && password.trim()) {
        user.password = await hashPassword(password);
      }
      
      user.role = role || user.role;

      // Sauvegarder les modifications en base de données
      user.save().then((updatedUser) => {
        res.json(updatedUser);
      }).catch((err) => {
        res.status(500).json({ error: "Erreur base de données", details: err.message });
      });
    } else {
      res.status(404).json({ error: "Utilisateur non trouvé" });
    }
  }).catch((err) => {
    res.status(500).json({ error: "Erreur base de données", details: err.message });
  });
}

function getUserById(req, res) {
  const id_user = req.params.id;
  db.User.findOne({ where: { id_user } }).then((user) => {
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Utilisateur non trouvé" });
    }
  });
}

function findUserByEmail(email) {
  return db.User.findOne({ where: { email } });
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