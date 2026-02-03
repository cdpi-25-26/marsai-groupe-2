'use strict';

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
const configFile = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config/config.json'), 'utf8'));
const config = configFile[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

async function loadModels() {
  const files = fs.readdirSync(__dirname)
    .filter(file =>
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.endsWith('.js')
    );

  for (const file of files) {
    const { default: modelDefiner } = await import(
      path.join(__dirname, file)
    );

    const model = modelDefiner(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
}

await loadModels();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
