// scripts/delete-unused-uploads.js
// Deletes all files listed in uploads-unused.json from the uploads directory and updates the JSON file.
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.resolve('uploads');
const UNUSED_JSON = path.resolve('uploads-unused.json');

function deleteUnusedUploads() {
  try {
    if (!fs.existsSync(UNUSED_JSON)) {
      console.error('❌ uploads-unused.json not found. Run check-used-uploads.js first.');
      return;
    }
    const unusedFiles = JSON.parse(fs.readFileSync(UNUSED_JSON, 'utf-8'));
    let deleted = 0;
    let notFound = 0;
    for (const file of unusedFiles) {
      const filePath = path.join(UPLOADS_DIR, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        deleted++;
      } else {
        notFound++;
      }
    }
    // Update uploads-unused.json to empty array
    fs.writeFileSync(UNUSED_JSON, JSON.stringify([], null, 2));
    console.log(`✓ Deleted ${deleted} unused files from uploads.`);
    if (notFound > 0) {
      console.log(`⚠️  ${notFound} files listed but not found.`);
    }
    console.log('✓ uploads-unused.json updated (now empty).');
  } catch (error) {
    console.error('❌ Error deleting unused uploads:', error);
  }
}

deleteUnusedUploads();
