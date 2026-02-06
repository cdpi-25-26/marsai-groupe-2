/**
 * Point d'entrée principal du serveur backend MarsAI
 * Configure Express, charge les routes et démarre le serveur
 */

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import sequelize from "./src/db/connection.js";
import db from "./src/models/index.js";
import routes from "./src/routes/index.js";

// Charge les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Configuration des middlewares
 */
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Routes de l'API
 */
app.use("/", routes);

/**
 * Route de test de connexion
 */
app.get("/", (req, res) => {
  res.json({ message: "MarsAI Backend API is running" });
});

/**
 * Test de connexion à la base de données et démarrage du serveur
 */
async function startServer() {
  try {
    // Test de connexion à la base de données
    await sequelize.authenticate();
    console.log("✓ Connexion à la base de données MySQL établie avec succès");

    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`✓ Serveur backend démarré sur le port ${PORT}`);
      console.log(`✓ API disponible sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("✗ Erreur de connexion à la base de données:", error.message);
    process.exit(1);
  }
}

startServer();