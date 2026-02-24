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
 */
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
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