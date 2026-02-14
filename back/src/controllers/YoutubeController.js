import fs from "fs";
import path from "path";
import { google } from "googleapis";

// Récupération du client OAuth2 avec refresh automatique 
function getOAuth2Client() {
  return new Promise((resolve, reject) => {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "http://localhost:3000/google/oauth2callback"
    );

    // Chemin corrigé : config sous back/
    const tokenPath = path.join(process.cwd(), "config/youtube_token.json");
    if (!fs.existsSync(tokenPath)) return reject(new Error("Token non trouvé, connectez-vous via /google/auth"));

    const token = JSON.parse(fs.readFileSync(tokenPath));
    oauth2Client.setCredentials(token);

    oauth2Client.on("tokens", (tokens) => {
      const updated = { ...token, ...tokens };
      fs.writeFileSync(tokenPath, JSON.stringify(updated, null, 2));
      console.log("Tokens mis à jour dans le JSON ✅");
    });

    resolve(oauth2Client);
  });
}

// Fonction pour attendre que le fichier soit stable avant upload 
// function waitForFileStable(filePath, stableCycles = 3, interval = 500, maxWait = 15000) {
//   return new Promise((resolve, reject) => {
//     let lastSize = -1;
//     let stableCount = 0;
//     const startTime = Date.now();

//     const check = setInterval(() => {
//       if (!fs.existsSync(filePath)) return;

//       const size = fs.statSync(filePath).size;
//       if (size === lastSize) {
//         stableCount++;
//         if (stableCount >= stableCycles) {
//           clearInterval(check);
//           resolve();
//         }
//       } else {
//         lastSize = size;
//         stableCount = 0;
//       }

//       if (Date.now() - startTime > maxWait) {
//         clearInterval(check);
//         reject(new Error("Le fichier n'a pas été stable à temps"));
//       }
//     }, interval);
//   });
// }

// Upload vidéo avec chemin complet 
// async function uploadVideo(filePath, title, description) {
//   if (!fs.existsSync(filePath)) {
//     return Promise.reject(new Error("Fichier introuvable"));
//   }

//   // Attente du fichier stable avant upload
//   // await waitForFileStable(filePath);

//   const oauth2Client = await getOAuth2Client();
//   const youtube = google.youtube({ version: "v3", auth: oauth2Client });

//   return youtube.videos.insert({
//     part: ["snippet", "status"],
//     requestBody: {
//       snippet: { title, description },
//       status: { privacyStatus: "private" },
//     },
//     media: { body: fs.createReadStream(filePath) },
//   });
// }

async function uploadVideo(filePath, title, description) {
  if (!fs.existsSync(filePath)) {
    throw new Error("Fichier introuvable");
  }

  const oauth2Client = await getOAuth2Client();
  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  try {
    const response = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: { title, description },
        status: { privacyStatus: "private" },
      },
      media: { body: fs.createReadStream(filePath) },
    });

    if (!response?.data?.id) {
      throw new Error("Réponse YouTube invalide");
    }

    return response;

  } catch (err) {
    if (err.response?.data?.error?.errors?.[0]?.reason === "quotaExceeded") {
      throw new Error("Quota YouTube dépassé pour aujourd’hui");
    }

    throw err;
  }
}

export default {
  getOAuth2Client,
  uploadVideo,
  // waitForFileStable, 
};


