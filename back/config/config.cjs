/**
 * Configuration Sequelize pour les migrations de base de données
 * Ce fichier utilise le format CommonJS (.cjs) car sequelize-cli y accède directement
 * 
 * Environnements supportés:
 * - development: Environnement de développement local
 * - test: Environnement pour les tests
 * - production: Environnement de production (serveur distant)
 * 
 * Toutes les configurations lisent les variables d'environnement du fichier .env
 * Exemple .env:
 * DB_USER=marsai
 * DB_PASSWORD=Mars2026!
 * DB_NAME=marsai_db
 * DB_HOST=localhost
 * DB_PORT=3306
 */

require("dotenv").config();

module.exports = {
  /**
   * Configuration pour l'environnement de développement
   * Utilisée lors du développement local et des migrations
   * logging: false = ne pas afficher les requêtes SQL dans la console
   */
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    logging: false,
  },
  
  /**
   * Configuration pour l'environnement de test
   * Utilisée lors de l'exécution des tests automatisés
   * Identique au développement mais séparé pour plus de flexibilité
   */
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    logging: false,
  },
  
  /**
   * Configuration pour l'environnement de production
   * Utilisée sur le serveur de production
   * En production, les variables d'environnement proviendraient du serveur d'hébergement
   */
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    logging: false,
  },
};