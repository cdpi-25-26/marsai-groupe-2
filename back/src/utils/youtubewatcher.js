//Vérifie la présence de nouveaux fichiers and back/upload
//Les fichiers uploadés sont déplacés en auto dans un sous-dossier uploaded

// back/src/utils/youtubewatcher.js
import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import youtubeController from '../controllers/youtubeController.js';

const uploadFolder = path.join(process.cwd(), 'uploads');
const uploadedFolder = path.join(uploadFolder, 'uploaded');
const allowedExtensions = ['.mp4', '.avi', '.m4v', '.mov', '.mpg', '.mpeg', '.wmv'];
const queue = [];
let isUploading = false;

// Attendre que le fichier soit stable (taille fixe pendant plusieurs intervalles consécutifs)
// function waitForFileStable(filePath, checkInterval = 1000, stableChecks = 3) {
//   return new Promise((resolve, reject) => {
//     let lastSize = -1;
//     let stableCount = 0;

//     const check = () => {
//       fs.stat(filePath, (err, stats) => {
//         if (err) return reject(new Error(`Fichier introuvable : ${filePath}`));

//         if (stats.size === lastSize) {
//           stableCount++;
//           if (stableCount >= stableChecks) return resolve();
//         } else {
//           lastSize = stats.size;
//           stableCount = 0;
//         }

//         setTimeout(check, checkInterval);
//       });
//     };
//     check();
//   });
// }

// Upload avec retry et timeout
async function uploadWithRetry(filePath, filename, retries = 3, timeout = 300000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // const filePath = path.join(uploadFolder, filename);

      // Timeout sur l'upload
      const uploadPromise = youtubeController.uploadVideo(
        filePath, // chemin complet
        `Upload automatique - ${filename}`,
        'Vidéo uploadée automatiquement'
      );
      const timer = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout upload')), timeout)
      );

      const data = await Promise.race([uploadPromise, timer]);
      return data;
    } catch (err) {
      console.warn(`Tentative ${attempt} échouée pour ${filename} : ${err.message}`);
      if (attempt === retries) throw err;
      // Attente avant retry
      await new Promise(res => setTimeout(res, 2000));
    }
  }
}

// Traitement de la file d'attente
async function processQueue() {
  if (isUploading || queue.length === 0) return;

  const { filename, filePath } = queue.shift();
  isUploading = true;

  try {
    console.log(`Attente que le fichier soit stable : ${filename}`);
    // await waitForFileStable(filePath);

    console.log(`Upload en cours : ${filename}`);
    const data = await uploadWithRetry(filePath, filename);

    if (!data?.data?.id) {
      throw new Error("Réponse YouTube invalide");
    }

    console.log(`Upload terminé : ${data.data.id}`);

    // Crée le dossier uploaded si besoin
    if (!fs.existsSync(uploadedFolder)) fs.mkdirSync(uploadedFolder, { recursive: true });

    // Déplace le fichier
    const destinationPath = path.join(uploadedFolder,`${Date.now()}-${filename}`);

    fs.renameSync(filePath, destinationPath);

    console.log(`Fichier déplacé dans /uploaded : ${destinationPath}`);
  } catch (err) {
    console.error(`Erreur upload pour ${filename} : ${err.message}`);
  } finally {
    isUploading = false;
    processQueue();
  }
}

// Démarrage du watcher
async function startYoutubeWatcher() {

  // Vérification du token en premier temps
  const tokenOk = await youtubeController.verifyOAuth2Token();
  if (!tokenOk) {
    console.error("Le token OAuth2 est invalide. Arrêt du watcher !");
    return;
  }

  if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });
  if (!fs.existsSync(uploadedFolder)) fs.mkdirSync(uploadedFolder, { recursive: true });

  const watcher = chokidar.watch(uploadFolder, { ignoreInitial: true,    ignored: /\/uploaded\//, awaitWriteFinish: { stabilityThreshold: 5000, pollInterval: 100}
  });

  watcher.on('add', (filePath) => {
    const filename = path.basename(filePath);
    const ext = path.extname(filename).toLowerCase();

    // Filtrage des formats autorisés et des miniatures poster-*.jpg
    if (!allowedExtensions.includes(ext) || filename.startsWith('poster-')) {
      console.log(`Format non autorisé : ${filename}`);
      return;
    }

    console.log(`Nouvelle vidéo détectée : ${filename}`);
    queue.push({ filename, filePath });
    processQueue();
  });

  console.log('Surveillance du dossier :', uploadFolder);
}

export default startYoutubeWatcher;

