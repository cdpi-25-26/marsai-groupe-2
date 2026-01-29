
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize("marsai", "root", "rootroot", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
});

/*sequelize.sync().then(() => {
  console.log("La base de données est synchronisée.");
});*/

export default sequelize;
