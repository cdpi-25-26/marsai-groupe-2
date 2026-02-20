// scripts/check-used-uploads.js
// Checks which files in the uploads directory are actually referenced by movies in the database.
import fs from 'fs';
import path from 'path';
import db from '../src/models/index.js';

const UPLOADS_DIR = path.resolve('uploads');

async function checkUsedUploads() {
  try {
    const { Movie } = db;
    // Fields that may contain references to files in uploads
    const fileFields = [
      'display_picture', 'picture1', 'picture2', 'picture3',
      'trailer', 'thumbnail', 'youtube_link',
      'film_file', 'thumbnail1', 'thumbnail2', 'thumbnail3',
      'subtitles_srt'
    ];
    const movies = await Movie.findAll({ raw: true });
    // Collect all referenced files
    const usedFiles = new Set();
    for (const movie of movies) {
      for (const field of fileFields) {
        if (movie[field]) {
          usedFiles.add(path.basename(movie[field]));
        }
      }
    }
    // List all files in uploads directory
    const allFiles = fs.readdirSync(UPLOADS_DIR);
    // Unused files
    const unusedFiles = allFiles.filter(f => !usedFiles.has(f));
    // Used files
    const actuallyUsed = allFiles.filter(f => usedFiles.has(f));
    // Output results to JSON files
    fs.writeFileSync('uploads-unused.json', JSON.stringify(unusedFiles, null, 2));
    fs.writeFileSync('uploads-used.json', JSON.stringify(actuallyUsed, null, 2));
    console.log('✓ uploads-used.json: files used by movies');
    console.log('✓ uploads-unused.json: files not referenced (safe to delete)');
  } catch (error) {
    console.error('❌ Error checking uploads:', error);
  } finally {
    await db.sequelize.close();
  }
}

checkUsedUploads();
