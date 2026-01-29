import { Sequelize } from "sequelize";

const sequelize = new Sequelize("marsai", "root", "root", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
});

/*sequelize.sync().then(() => {
  console.log("La base de données est synchronisée.");
});*/

export default sequelize;
