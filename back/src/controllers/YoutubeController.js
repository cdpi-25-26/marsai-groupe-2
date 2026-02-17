// import fs from "fs";
// import path from "path";
// import { google } from "googleapis";

// const TOKEN_PATH = path.join(process.cwd(), "config/youtube_token.json");
// let oauth2Client;
// let tokenData;

// async function initYoutubeAuth() {
//   oauth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     "http://localhost:3000/google/oauth2callback"
//   );

//   if (!fs.existsSync(TOKEN_PATH)) {
//     throw new Error("Token non trouvé, connectez-vous via /google/auth");
//   }

//   tokenData = JSON.parse(fs.readFileSync(TOKEN_PATH));
//   oauth2Client.setCredentials(tokenData);

//   // Met à jour le JSON à chaque changement de token
//   oauth2Client.on("tokens", (tokens) => {
//     tokenData = {...tokenData, ...tokens };
//     fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenData, null, 2));
//     consolelog("Token mis à jour dans le JSON");
//   });

//   // Refresh toutes les 45 minutes
//   setInterval(async () => {
//     try {
//       const newToken = await oauth2Client.getAccessToken();
//       if (newToken?.token) {
//         tokenData.access_token = newToken.token;
//         oauth2Client.setCredentials(tokenData);
//         fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenData, null, 2));
//         console.log("Token Youtube rafraichi");
//       }
//     } catch (err) {
//       consome.error("Erreur lors du refresh automatique du token ;", err.message);
//     }
//   }, 45 * 60 * 1000)
// }

// // Récupération du client OAuth2
// async function getOAuth2Client() {
//   const oauth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     "http://localhost:3000/google/oauth2callback"
//   );

//   const tokenPath = path.join(process.cwd(), "config/youtube_token.json");
//   if (!fs.existsSync(tokenPath)) throw new Error("Token non trouvé, connectez-vous via /google/auth");

//   const token = JSON.parse(fs.readFileSync(tokenPath));
//   oauth2Client.setCredentials(token);

//   oauth2Client.on("tokens", (tokens) => {
//     const updated = { ...token, ...tokens };
//     fs.writeFileSync(tokenPath, JSON.stringify(updated, null, 2));
//     console.log("Tokens mis à jour dans le JSON");
//   });

//   return oauth2Client;
// }

// // Upload vidéo avec URL et option de visibilité
// async function uploadVideo(filePath, title, description, privacyStatus = "unlisted") {
//   if (!fs.existsSync(filePath)) throw new Error("Fichier introuvable");

//   const oauth2Client = await getOAuth2Client();
//   const youtube = google.youtube({ version: "v3", auth: oauth2Client });

//   try {
//     const response = await youtube.videos.insert({
//       part: ["snippet", "status"],
//       requestBody: {
//         snippet: { title, description },
//         status: { privacyStatus }, 
//       },
//       media: { body: fs.createReadStream(filePath) },
//     });

//     if (!response?.data?.id) throw new Error("Réponse YouTube invalide");

//     return response;

//   } catch (err) {
//     if (err.response?.data?.error?.errors?.[0]?.reason === "quotaExceeded") {
//       throw new Error("Quota YouTube dépassé pour aujourd’hui");
//     }
//     throw err;
//   }
// }

// export default {
//   initYoutubeAuth,
//   getOAuth2Client,
//   uploadVideo,
// };


import fs from "fs";
import path from "path";
import { google } from "googleapis";

const TOKEN_PATH = path.join(process.cwd(), "config/youtube_token.json");
let oauth2Client;
let tokenData;

/**
 * Initialise le client OAuth2 et refresh automatique toutes les 45 minutes
 */
async function initYoutubeAuth() {
  oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/google/oauth2callback"
  );

  if (!fs.existsSync(TOKEN_PATH)) {
    throw new Error("Token non trouvé, connectez-vous via /google/auth");
  }

  tokenData = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oauth2Client.setCredentials(tokenData);

  try {
    const { token } = await oauth2Client.getAccessToken();
    if (token && token !== tokenData.access_token) {
      tokenData.access_token = token;
      oauth2Client.setCredentials(tokenData);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenData, null, 2));
      console.log("Token YouTube validé au démarrage");
    }
  } catch (err) {
    console.error("Erreur lors de la validation du token au démarrage :", err.message);
  }

  // Met à jour le JSON à chaque changement de token
  oauth2Client.on("tokens", (tokens) => {
    tokenData = { ...tokenData, ...tokens };
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenData, null, 2));
    console.log("Token mis à jour dans le JSON");
  });

  // Refresh automatique toutes les 45 minutes
  setInterval(async () => {
    try {
      const newToken = await oauth2Client.getAccessToken();
      if (newToken?.token) {
        tokenData.access_token = newToken.token;
        oauth2Client.setCredentials(tokenData);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenData, null, 2));
        console.log("Token YouTube rafraîchi automatiquement");
      }
    } catch (err) {
      console.error("Erreur lors du refresh automatique du token :", err.message);
    }
  }, 45 * 60 * 1000);
}

/**
 * Retourne le client OAuth2 déjà initialisé
 */
function getOAuth2Client() {
  if (!oauth2Client) throw new Error("OAuth2 non initialisé, appelez initYoutubeAuth() au démarrage");
  return oauth2Client;
}

/**
 * Upload vidéo avec titre, description et statut
 */
async function uploadVideo(filePath, title, description, privacyStatus = "unlisted") {
  if (!fs.existsSync(filePath)) throw new Error("Fichier introuvable");

  const client = getOAuth2Client();
  const youtube = google.youtube({ version: "v3", auth: client });

  try {
    const response = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: { title, description },
        status: { privacyStatus },
      },
      media: { body: fs.createReadStream(filePath) },
    });

    if (!response?.data?.id) throw new Error("Réponse YouTube invalide");

    return response;
  } catch (err) {
    if (err.response?.data?.error?.errors?.[0]?.reason === "quotaExceeded") {
      throw new Error("Quota YouTube dépassé pour aujourd’hui");
    }
    throw err;
  }
}

export default {
  initYoutubeAuth,
  getOAuth2Client,
  uploadVideo,
};
