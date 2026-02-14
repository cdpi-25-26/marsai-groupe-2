import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import youtubeController from "../controllers/YoutubeController.js";

const uploadFolder = path.join(process.cwd(), "uploads");
const uploadedFolder = path.join(uploadFolder, "uploaded");
const allowedExtensions = [".mp4", ".avi", ".m4v", ".mov", ".mpg", ".mpeg", ".wmv"];
const queue = [];
let isUploading = false;

// Vérifie que le fichier est stable avant upload
async function waitForFileStable(filePath, checkInterval = 1000, stableChecks = 3) {
  return new Promise((resolve, reject) => {
    let lastSize = -1;
    let stableCount = 0;

    const check = () => {
      if (!fs.existsSync(filePath)) return reject(new Error("Fichier introuvable"));
      const size = fs.statSync(filePath).size;

      if (size === lastSize) {
        stableCount++;
        if (stableCount >= stableChecks) return resolve();
      } else {
        lastSize = size;
        stableCount = 0;
      }
      setTimeout(check, checkInterval);
    };
    check();
  });
}

// Upload avec retry
async function uploadWithRetry(filePath, filename, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const data = await youtubeController.uploadVideo(
        filePath,
        `Upload automatique - ${filename}`,
        "Vidéo uploadée automatiquement",
        "unlisted" // changer en "public" pour publier directement
      );
      return data;
    } catch (err) {
      console.warn(`Tentative ${attempt} échouée pour ${filename} : ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise(res => setTimeout(res, 2000));
    }
  }
}

// Traitement de la file d’attente
async function processQueue() {
  if (isUploading || queue.length === 0) return;

  const { filePath, filename } = queue.shift();
  isUploading = true;

  try {
    console.log(`Attente que le fichier soit stable : ${filename}`);
    await waitForFileStable(filePath);

    console.log(`Upload en cours : ${filename}`);
    const data = await uploadWithRetry(filePath, filename);

    console.log(`Upload terminé : ${data.data.id}`);
    console.log(`URL YouTube : https://www.youtube.com/watch?v=${data.data.id}`);

    if (!fs.existsSync(uploadedFolder)) fs.mkdirSync(uploadedFolder, { recursive: true });
    const destPath = path.join(uploadedFolder, `${Date.now()}-${filename}`);
    fs.renameSync(filePath, destPath);
    console.log(`Fichier déplacé dans /uploaded : ${destPath}`);

  } catch (err) {
    console.error(`Erreur upload pour ${filename} : ${err.message}`);
  } finally {
    isUploading = false;
    processQueue();
  }
}

// Démarrage du watcher
function startYoutubeWatcher() {
  if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });
  if (!fs.existsSync(uploadedFolder)) fs.mkdirSync(uploadedFolder, { recursive: true });

  const watcher = chokidar.watch(uploadFolder, {
    ignoreInitial: true,
    ignored: /\/uploaded\//,
    awaitWriteFinish: { stabilityThreshold: 3000, pollInterval: 100 },
  });

  watcher.on("add", (filePath) => {
    const filename = path.basename(filePath);
    const ext = path.extname(filename).toLowerCase();

    if (!allowedExtensions.includes(ext) || filename.startsWith("poster-")) {
      console.log(`Format non autorisé : ${filename}`);
      return;
    }

    console.log(`Nouvelle vidéo détectée : ${filename}`);
    queue.push({ filePath, filename });
    processQueue();
  });

  console.log("Surveillance du dossier back/uploads :", uploadFolder);
}

export default startYoutubeWatcher;
