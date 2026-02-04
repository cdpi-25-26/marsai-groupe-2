import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import bcrypt from "bcrypt";
import db from "../src/models/index.js";

const { User, Movie } = db;

async function seedDemo() {
  try {
    /* -------------------------
       USERS
    ------------------------- */
    const passwordHash = await bcrypt.hash("password123", 10);

    const [jury] = await User.findOrCreate({
      where: { email: "jury@example.com" },
      defaults: {
        first_name: "Jury",
        last_name: "Member",
        email: "jury@example.com",
        password: passwordHash,
        phone: "0101010101",
        role: "JURY"
      }
    });

    const [producer] = await User.findOrCreate({
      where: { email: "producer@example.com" },
      defaults: {
        first_name: "Producer",
        last_name: "User",
        email: "producer@example.com",
        password: passwordHash,
        phone: "0202020202",
        role: "PRODUCER"
      }
    });

    /* -------------------------
       MOVIES
       (duration is REQUIRED)
    ------------------------- */
    await Movie.bulkCreate([
  {
    title: "AI Dreams",
    description: "Short film generated with AI tools",
    duration: 12,
    main_language: "EN",
    release_year: 2025,
    nationality: "France",
    production: "MarsAI Studio",
    id_user: producer.id_user
  },
  {
    title: "Synthetic Mars",
    description: "Sci-fi AI movie",
    duration: 24,
    main_language: "EN",
    release_year: 2026,
    nationality: "USA",
    production: "Red Planet Lab",
    id_user: producer.id_user
  }
]);


    console.log("✅ Demo seed completed successfully");
  } catch (error) {
    console.error("❌ Demo seed failed:", error);
  } finally {
    await db.sequelize.close();
  }
}

seedDemo();
