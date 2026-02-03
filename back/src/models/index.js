/**
 * Chargeur automatique de modèles Sequelize
 * Ce fichier charge dynamiquement tous les modèles du répertoire /models
 * Crée les associations entre modèles et initialise Sequelize
 * 
 * Processus:
 * 1. Détermine l'environnement (development/test/production)
 * 2. Charge la configuration depuis config.cjs
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

/**
 * Obtient le répertoire courant du module
 * Nécessaire car les modules ES ne ont pas __dirname par défaut
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

/**
 * Détermine l'environnement d'exécution
 * Par défaut: 'development' si non spécifié
 */
const env = process.env.NODE_ENV || 'development';

/**
 * Importe la configuration depuis config.cjs
 * Obtient les paramètres de connexion MySQL pour l'environnement actuel
 */
const configModule = await import('../../config/config.cjs');
const config = configModule.default ? configModule.default[env] : configModule[env];

/**
 * Objet qui contiendra tous les modèles Sequelize
 * Structure: { User: Model, Film: Model, ... }
 */
const db = {};

/**
 * Initialise l'instance Sequelize
 * Crée la connexion à la base de données MySQL
 * Utilise soit une variable d'environnement, soit les paramètres directs
 */
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

/**
 * Lit tous les fichiers du répertoire courant (/models)
 * Filtre pour obtenir uniquement les fichiers .js (sauf tests)
 */
const files = fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&              // Ignore les fichiers cachés
      file !== basename &&                    // Ignore ce fichier (index.js)
      file.slice(-3) === '.js' &&             // Inclut uniquement les .js
      file.indexOf('.test.js') === -1         // Ignore les fichiers de test
    );
  });

/**
 * Charge dynamiquement chaque modèle
 * Chaque modèle définit une fonction qui retourne un model Sequelize
 */
for (const file of files) {
  const modelModule = await import(path.join(__dirname, file));
  const model = modelModule.default ? modelModule.default(sequelize, Sequelize.DataTypes) : modelModule(sequelize, Sequelize.DataTypes);
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

/**
 * Ajoute l'instance Sequelize et la classe Sequelize à l'objet db
 * Pour y accéder dans les contrôleurs: import db from '...'; db.sequelize.query(...)
 */
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Exporte l'objet db contenant tous les modèles et l'instance Sequelize
export default db;
