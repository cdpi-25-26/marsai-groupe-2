import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./src/db/connection.js";
import routes from "./src/routes/index.js";
import startYoutubeWatcher from "./src/utils/youtubewatcher.js";
import youtubeController from "./src/controllers/YoutubeController.js";

// Charge les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration des middlewares
app.use(cors({ origin: "*" ,
   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes de l'API
app.use("/", routes);

// Route de test de connexion
app.get("/", (req, res) => {
  res.json({ message: "MarsAI Backend API is running" });
});

// Test de connexion à la base de données et démarrage du serveur
async function startServer() {
  try {
    // Test de connexion à la base de données
    await sequelize.authenticate();
    console.log("✓ Connexion à la base de données MySQL établie avec succès");

    // Initialise le token YouTube
    try {
      await youtubeController.initYoutubeAuth();
      console.log("✓ Auth YouTube initialisée");
    } catch (err) {
      console.warn("X Token YouTube manquant ou non initialisé. Connectez-vous via http://localhost:3000/google/auth ou https://nonephemeral-marge-empties.ngrok-free.dev/auth/google/callback si en prod pour générer le token.");
    }
    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`✓ API disponible sur http://localhost:${PORT} en local ou https://nonephemeral-marge-empties.ngrok-free.dev en prod`);
      // Démarrage du watcher (back/uploads)
      startYoutubeWatcher();
    });
  } catch (error) {
    console.error("✗ Erreur de connexion à la base de données:", error.message);
    process.exit(1);
  }
}

startServer();