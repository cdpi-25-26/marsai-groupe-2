/**
 * Chargeur automatique de modèles Sequelize
 * Ce fichier charge dynamiquement tous les modèles du répertoire /models
 * Crée les associations entre modèles et initialise Sequelize
 * 
 * Processus:
 * 1. Détermine l'environnement (development/test/production)
 * 2. Charge la configuration depuis config.json
 * 3. Initialise l'instance Sequelize
 * 4. Charge dynamiquement tous les fichiers .js (modèles)
 * 5. Établit les associations entre modèles
 * 6. Exporte l'objet db avec tous les modèles et l'instance Sequelize
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize } from 'sequelize';
import process from 'process';
import dotenv from 'dotenv';

/**
 * Obtient le répertoire courant du module
 * Nécessaire car les modules ES n'ont pas __dirname par défaut
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

/**
 * Détermine l'environnement d'exécution
 * Par défaut: 'development' si non spécifié
 */
const env = process.env.NODE_ENV || 'development';

dotenv.config();

const config = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'marsai',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  dialect: 'mysql',
  logging: false,
};

const db = {};

/**
 * Initialise l'instance Sequelize
 * Crée la connexion à la base de données MySQL
 * Utilise soit une variable d'environnement, soit les paramètres directs
 */
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

/**
 * Fonction asynchrone pour charger tous les modèles
 */
async function loadModels() {
  /**
   * Lit tous les fichiers du répertoire courant (/models)
   * Filtre pour obtenir uniquement les fichiers .js (sauf ce fichier)
   */
  const files = fs.readdirSync(__dirname)
    .filter(file =>
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.endsWith('.js')
    );

  /**
   * Charge dynamiquement chaque modèle
   * Chaque modèle définit une fonction qui retourne un model Sequelize
   */
  for (const file of files) {
    const modelModule = await import(new URL(file, import.meta.url));
    const modelDefiner = modelModule.default;
    const model = modelDefiner(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }

  /**
   * Établit les associations entre modèles
   * Si un modèle a une méthode associate(), l'appelle pour définir les relations
   * Exemple: User.associate(db) définit les relations User -> Film, User -> Evaluation, etc.
   */
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
}

/**
 * Charge les modèles et initialise les associations
 */
await loadModels();

/**
 * Ajoute l'instance Sequelize et la classe Sequelize à l'objet db
 * Pour y accéder dans les contrôleurs: import db from '...'; db.sequelize.query(...)
 */
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
