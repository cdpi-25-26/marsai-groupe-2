import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import youtubeController from "../controllers/YoutubeController.js";
import { uploadFile } from "./s3.js";
import db from "../models/index.js";
import { VIDEO_REJECT_TEMPLATE } from "../constants/VideoRejectTemplate.js";
import { VIDEO_ACCEPT_TEMPLATE } from "../constants/VideoAcceptTemplate.js";
import EmailController from "../controllers/EmailController.js";

const uploadFolder = path.join(process.cwd(), "uploads");
const uploadedFolder = path.join(uploadFolder, "uploaded");
const allowedExtensions = [".mp4", ".avi", ".m4v", ".mov", ".mpg", ".mpeg", ".wmv"];
const queue = [];
let isUploading = false;
const Movie = db.Movie;

async function uploadWithRetry(filePath, filename, id_user, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const titleWithoutExt = path.parse(filename).name;
      return await youtubeController.uploadVideo(
        filePath,
        titleWithoutExt,
        `Film soumis via MarsAI — producteur #${id_user}`,
        "unlisted",
        "unlisted"
      );
    } catch (err) {
      const retryable =
        err.code === "ECONNRESET" ||
        err.code === "ETIMEDOUT" ||
        err.response?.status >= 500;
      if (!retryable || attempt === retries) throw err;
      console.warn(`Retry ${attempt} pour ${filename}...`);
      await new Promise(res => setTimeout(res, 2000 * attempt));
    }
  }
}

async function processQueue() {
  if (isUploading || queue.length === 0) return;
  const { filePath, filename, id_user, userEmail, movie } = queue.shift();
  isUploading = true;

  try {
    console.log(`Upload en cours : ${filename}`);

    let youtubeData = null;
    try {
      youtubeData = await uploadWithRetry(filePath, filename, id_user);
      const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeData.id}`;
      console.log(`✓ Upload YouTube terminé : ${youtubeData.id}`);
      console.log(`Content licensed : ${youtubeData.licensedContent}`);
      console.log(`URL YouTube : ${youtubeUrl}`);
      try {
        await movie.update({ youtube_link: youtubeUrl });
        console.log(`✓ DB youtube_link mis à jour`);
      } catch (dbErr) {
        console.error(`Erreur mise à jour youtube_link :`, dbErr.message);
      }
    } catch (ytErr) {
      console.warn(`⚠ YouTube upload ignoré pour ${filename} : ${ytErr.message}`);
      console.warn(`  Le fichier reste accessible localement via /uploads/${filename}`);
    }

    console.log(`ID USER ${id_user}`);

    try {
      await uploadFile(filePath);
    } catch (s3Err) {
      console.error(`Erreur S3 pour ${filename} :`, s3Err.message);
    }

    // Email producteur
    try {
      if (youtubeData) {
        if (youtubeData.licensedContent === true) {
          await EmailController.sendMail(userEmail, "Video rejected, content under license", VIDEO_REJECT_TEMPLATE);
        } else {
          await EmailController.sendMail(userEmail, "Your video has been accepted.", VIDEO_ACCEPT_TEMPLATE);
        }
      } else {
        console.warn(`⚠ Email non envoyé pour ${userEmail} : YouTube non disponible lors du traitement.`);
      }
      console.log(`Envoyé à ${userEmail}`);
    } catch (mailErr) {
      console.error(`Erreur email pour ${userEmail} :`, mailErr.message);
    }

    if (!fs.existsSync(uploadedFolder)) fs.mkdirSync(uploadedFolder, { recursive: true });
    const ts = Date.now();
    const movedFilename = `${ts}-${filename}`;
    const destPath = path.join(uploadedFolder, movedFilename);
    try {
      fs.renameSync(filePath, destPath);
      console.log(`Fichier déplacé dans /uploaded : ${destPath}`);
      const newRelativePath = `uploaded/${movedFilename}`;
      await movie.update({ trailer: newRelativePath });
      console.log(`✓ DB trailer mis à jour : ${newRelativePath}`);
    } catch (moveErr) {
      console.error(`Erreur déplacement/DB pour ${filename} :`, moveErr.message);
    }

  } catch (err) {
    console.error(`Erreur upload pour ${filename} :`, err.message);
  } finally {
    isUploading = false;
    processQueue();
  }
}

function startYoutubeWatcher() {
  if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });
  if (!fs.existsSync(uploadedFolder)) fs.mkdirSync(uploadedFolder, { recursive: true });

  const watcher = chokidar.watch(uploadFolder, {
    ignoreInitial: true,
    ignored: (p) => p.replace(/\\/g, '/').includes('/uploaded/'),
    awaitWriteFinish: { stabilityThreshold: 3000, pollInterval: 100 },
  });

  watcher.on("add", async (filePath) => {
    const filename = path.basename(filePath);
    const ext = path.extname(filename).toLowerCase();

    if (!allowedExtensions.includes(ext) || filename.startsWith("poster-")) {
      console.log(`Format non autorisé : ${filename}`);
      return;
    }

    console.log(`Nouvelle vidéo détectée : ${filename}`);

    try {
      const movie = await Movie.findOne({
        where: { trailer: filename },
        include: [{ 
          model: db.User,
          as: 'Producer',
          attributes: ['email', 'first_name']
        }]
      });

      if (!movie || !movie.Producer) {
        console.warn(`Aucun film ou producteur trouvé pour ${filename}`);
        return;
      }

      const id_user = movie.id_user;
      const userEmail = movie.Producer.email;

      queue.push({ filePath, filename, id_user, userEmail, movie });
      processQueue();
    } catch (err) {
      console.error("Erreur récupération film :", err.message);
    }
  });

  console.log("✓ youtubewatcher on back/uploads :", uploadFolder);
}

export default startYoutubeWatcher;
