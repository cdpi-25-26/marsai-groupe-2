// scripts/export-movies-users.js
import fs from 'fs';
import db from '../src/models/index.js';

async function exportMoviesAndUsers() {
  try {
    const { Movie, User } = db;
    // Export all users (excluding passwords for security)
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      raw: true
    });
    // Export all movies
    const movies = await Movie.findAll({ raw: true });

    // Write to JSON files
    fs.writeFileSync('exported-users.json', JSON.stringify(users, null, 2));
    fs.writeFileSync('exported-movies.json', JSON.stringify(movies, null, 2));
    console.log('✅ Export completed: exported-users.json, exported-movies.json');
  } catch (error) {
    console.error('❌ Export failed:', error);
  } finally {
    await db.sequelize.close();
  }
}

exportMoviesAndUsers();
