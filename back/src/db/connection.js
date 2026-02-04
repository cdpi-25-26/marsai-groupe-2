/**
 * Configuration de la connexion à la base de données MySQL avec Sequelize
 * Sequelize est un ORM (Object-Relational Mapping) pour Node.js
 * Il permet d'interagir avec la base de données en utilisant des modèles JavaScript
 */

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Charge les variables d'environnement du fichier .env
dotenv.config();

/**
 * Instance Sequelize pour la connexion à la base de données
 * Paramètres de connexion:
 * - Nom de la base: marsai_db
 * - Utilisateur: marsai
 * - Mot de passe: Mars2026!
 * - Host: localhost (serveur local)
 * - Port: 3306 (port par défaut MySQL)
 * - Dialect: mysql (type de base de données)
 */
const sequelize = new Sequelize(
  process.env.DB_NAME || "marsai_db",
  process.env.DB_USER || "marsai",
  process.env.DB_PASSWORD || "Mars2026!",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
  }
);

/**
 * Commenté: Synchronisation automatique des modèles avec la base de données
 * Utiliser uniquement si vous voulez créer/mettre à jour automatiquement les tables
 * À la place, nous utilisons les migrations (files dans /migrations)
 */
/*sequelize.sync().then(() => {
  console.log("La base de données est synchronisée.");
});*/

// Exporte l'instance Sequelize pour l'utiliser dans les modèles et contrôleurs
export default sequelize;
