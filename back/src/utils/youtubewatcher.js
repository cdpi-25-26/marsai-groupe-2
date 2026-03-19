import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import { Op } from "sequelize";
import youtubeController from "../controllers/YoutubeController.js";
import { uploadFile } from "./s3.js";
import db from "../models/index.js";
import { VIDEO_REJECT_TEMPLATE } from "../constants/VideoRejectTemplate.js";
import { VIDEO_ACCEPT_TEMPLATE } from "../constants/VideoAcceptTemplate.js";
import EmailController from "../controllers/EmailController.js";

// défini le chemin absolu du dossier ou les fichiers vidéo sont placés avant d'être traités
const uploadFolder = path.join(process.cwd(), "uploads");
const mediaFolder = path.join(uploadFolder, "medias");
const allowedExtensions = [".mp4", ".avi", ".m4v", ".mov", ".mpg", ".mpeg", ".wmv"];
const queue = [];
let isUploading = false;
const Movie = db.Movie;

function isAlreadyQueued(movieId) {
  return queue.some((item) => item.movieId === movieId);
}

async function enqueueMovieUpload(movie) {
  if (!movie || !movie.id_movie) return false;
  if (isAlreadyQueued(movie.id_movie)) return false;

  const trailer = movie.trailer || "";
  const filename = path.basename(trailer);
  const ext = path.extname(filename).toLowerCase();
  const filePath = path.join(mediaFolder, filename);

  if (!filename || !allowedExtensions.includes(ext)) return false;
  if (!fs.existsSync(filePath)) {
    console.warn(`Fichier introuvable pour film ${movie.id_movie}: ${filePath}`);
    return false;
  }

  const userEmail = movie.Producer?.email;
  if (!userEmail) {
    console.warn(`Email producteur manquant pour film ${movie.id_movie}`);
    return false;
  }

  queue.push({
    filePath,
    filename,
    id_user: movie.id_user,
    userEmail,
    movieId: movie.id_movie,
  });

  await Movie.update(
    { youtube_status: "processing" },
    { where: { id_movie: movie.id_movie } }
  );

  processQueue();
  return true;
}

async function recoverPendingMovies() {
  try {
    const pendingMovies = await Movie.findAll({
      where: {
        trailer: { [Op.ne]: null },
        [Op.or]: [
          { youtube_status: null },
          { youtube_status: "pending" },
          { youtube_status: "failed" },
        ],
      },
      include: [{
        model: db.User,
        as: "Producer",
        attributes: ["email", "first_name"],
      }],
      order: [["id_movie", "ASC"]],
    });

    if (!pendingMovies.length) return;

    let enqueued = 0;
    for (const movie of pendingMovies) {
      const queued = await enqueueMovieUpload(movie);
      if (queued) enqueued += 1;
    }

    if (enqueued > 0) {
      console.log(`✓ Recover pending uploads: ${enqueued} film(s) ajouté(s) à la queue`);
    }
  } catch (error) {
    console.warn(`Recover pending uploads failed: ${error.message}`);
  }
}

async function findMovieByTrailerWithRetry(filename, retries = 6, delayMs = 1200) {
  const mediasPath = `medias/${filename}`;
  for (let attempt = 1; attempt <= retries; attempt++) {
    const movie = await Movie.findOne({
      where: {
        trailer: {
          [Op.in]: [filename, mediasPath],
        },
      },
      include: [{
        model: db.User,
        as: "Producer",
        attributes: ["email", "first_name"],
      }],
    });

    if (movie && movie.Producer) return movie;
    if (attempt < retries) {
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
  return null;
}

// Tentative de upload (si erreur reseau ou server -> retries n fois)
async function uploadWithRetry(filePath, filename, id_user, retries = 3) {
  // filePath: chemin vers le fichier à upload
  // filename: nom du fichier 
  // retries: nombre max de tentatives

  // boucle for qui tente l'upload
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // supprime l'extension pour affichage
      const titleWithoutExt = path.parse(filename).name;
      // appelle la fonction d'upload sur Youtube
      return await youtubeController.uploadVideo(
        filePath,
        titleWithoutExt,
        `Film soumis par le producteur #${id_user}`,
        "public"
      );
    } catch (err) {
      // Déterminer si l'erreur est "retryable" (réexécuter l'opération après erreur)
      const retryable =
        // si coupure de connexion
        err.code === "ECONNRESET" ||
        // si err de délai d'attente
        err.code === "ETIMEDOUT" ||
        // si err côté serveur
        err.response?.status >= 500;
      // si err === false ou nd de retries atteint on lance l'erreur
      if (!retryable || attempt === retries) throw err;
      // affiche un avertissement en console à chaque nouvelle tentative de upload
      console.warn(`Retry ${attempt} pour ${filename}...`);
      // introduit un délai avec temps d'attente qui progresse de façon exponentielle à chaque tentative
      await new Promise(res => setTimeout(res, 2000 * attempt));
    }
  }
}

// Traitement de la file d’attente (s'assurer que les fichiers sont uploadés un  par un et retry auto si server error)
async function processQueue() {
  // booléen qui indique si un uload est en cours
  if (isUploading || queue.length === 0) return;
  // extraction du premier fichier, retire le premier élément de la queue et le retourne
  const { filePath, filename, id_user, userEmail, movieId } = queue.shift();
  isUploading = true;

  try {
    console.log(`Upload en cours : ${filename}`);

    const data = await uploadWithRetry(filePath, filename, id_user);

    console.log(`✓ Upload terminé : ${data.id}`);
    console.log(`Content licensed : ${data.licensedContent}`);
    console.log(`URL YouTube : https://www.youtube.com/watch?v=${data.id}`);
    console.log(`ID USER ${id_user}`);

    // Persiste les métadonnées YouTube côté DB pour pouvoir consulter la vidéo depuis l'app.
    await Movie.update(
      {
        youtube_movie_id: data.id,
        youtube_link: `https://www.youtube.com/watch?v=${data.id}`,
        youtube_status: "uploaded",
      },
      { where: { id_movie: movieId } }
    );

    // Appelle de la fonction de s3.js pour upload dans Scaleway
    try {
      await uploadFile(filePath);
    } catch (s3Error) {
      // S3 est secondaire: ne pas casser le pipeline principal si les credentials/bucket sont invalides.
      console.warn(`S3 upload ignoré pour ${filename}: ${s3Error.message}`);
    }

    try {
      if (data.licensedContent === true) {
        await EmailController.sendMail(
          userEmail,
          "Video rejected, content under license",
          VIDEO_REJECT_TEMPLATE,
        );
      } else {
        await EmailController.sendMail(
          userEmail,
          "Your video has been accepted.",
          VIDEO_ACCEPT_TEMPLATE,
        );
      }
      console.log(`Envoyé à ${userEmail}`);
    } catch (mailError) {
      console.warn(`Email non envoyé à ${userEmail}: ${mailError.message}`);
    }

    // Keep files in uploads/medias so Admin/Jury can stream via ngrok/Vercel.
    console.log(`Fichier conservé dans /medias : ${filePath}`);

  } catch (err) {
    console.error(`Erreur upload pour ${filename} : ${err.message}`);
    if (movieId) {
      await Movie.update(
        { youtube_status: "failed" },
        { where: { id_movie: movieId } }
      );
    }
  } finally {
    // on continue la queue
    isUploading = false;
    processQueue();
  }
}

// Démarrage du watcher sur le dossier uploads
function startYoutubeWatcher() {
  // vérifie présence des dossiers et créé si besoin
  if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });
  if (!fs.existsSync(mediaFolder)) fs.mkdirSync(mediaFolder, { recursive: true });

  // surveille les fichiers dans uploads/medias
  const watcher = chokidar.watch(mediaFolder, {
    // ignore les fichiers présents au démarrage
    ignoreInitial: true,
    // verif de la stabilité du file avant de add
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
      const movie = await findMovieByTrailerWithRetry(filename);

      if (!movie || !movie.Producer) {
        console.warn(`Aucun film ou producteur trouvé pour ${filename}`);
        return;
      }

      await enqueueMovieUpload(movie);
    } catch (err) {
      console.error("Erreur récupération film :", err.message);
    }
  });

  recoverPendingMovies();

  console.log("✓ youtubewatcher on back/uploads/medias :", mediaFolder);
}

export default startYoutubeWatcher;
