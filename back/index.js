import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { Sequelize } from "sequelize";
import sequelize from "./src/db/connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

const db = {};

async function loadModels() {
  const files = fs.readdirSync(__dirname)
    .filter(file =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.endsWith(".js")
    );

  for (const file of files) {
    const fileUrl = pathToFileURL(path.join(__dirname, file)).href;
    const { default: modelDefiner } = await import(fileUrl);

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