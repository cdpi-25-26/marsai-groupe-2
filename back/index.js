/**
 * Point d'entrée principal de l'application backend
 * Serveur Express pour l'API REST du festival MarsAI
 * Fonctionnalités:
 * - Configuration CORS pour accepter les requêtes du frontend
 * - Parsing JSON automatique
 * - Chargement des variables d'environnement
 * - Routage vers les contrôleurs (Auth, Users, Videos)
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./src/routes/index.js";
import { configDotenv } from "dotenv";

/**
 * Charge les variables d'environnement depuis le fichier .env
 * Variables utilisées: PORT, JWT_SECRET, DATABASE_* etc.
 */
configDotenv();

/**
 * Crée une application Express
 * Express est un framework Node.js minimaliste et flexible
 * pour créer des serveurs et des APIs
 */
const app = express();

/**
 * Middleware CORS (Cross-Origin Resource Sharing)
 * Permet aux requêtes depuis d'autres domaines d'accéder à cette API
 * origin: "*" = accepte les requêtes de tous les domaines
 * À restreindre en production pour des raisons de sécurité
 */
app.use(cors({ origin: "*" }));

/**
 * Middleware pour parser automatiquement le JSON des requêtes
 * Transforme les données brutes en objets JavaScript
 */
app.use(express.json());

/**
 * Port sur lequel le serveur écoute
 * Utilise la variable d'environnement PORT ou 3000 par défaut
 */
const PORT = process.env.PORT || 3000;

/**
 * Utilise le router défini dans src/routes/index.js
 * Tous les endpoints (Auth, Users, Videos) sont enregistrés ici
 */
app.use("/", router);

/**
 * Démarre le serveur HTTP et affiche un message de confirmation
 * Le serveur écoute sur le port spécifié et est prêt à accepter les requêtes
 */
app.listen(PORT, () => {
  console.log("-----------------------------");
  console.log("--        L'ARBITRE        --");
  console.log("-----------------------------");

  console.log(`Le serveur est lancé sur http://localhost:${PORT}`);
});
