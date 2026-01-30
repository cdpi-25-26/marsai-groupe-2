import bcrypt from "bcrypt";
import db from "../src/models/index.js";

async function createAdmin() {
  await db.sequelize.sync();
  const hash = await bcrypt.hash("admin123", 10);
  const [admin, created] = await db.User.findOrCreate({
    where: { email: "admin@example.com" },
    defaults: {
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      password: hash,
      phone: "0000000000",
      address: "HQ",
      registrationDate: new Date(),
      role: "ADMIN"
    }
  });
  if (created) {
    console.log("Admin user created:", admin.email);
  } else {
    console.log("Admin user already exists:", admin.email);
  }
  await db.sequelize.close();
}

createAdmin().catch(console.error);
