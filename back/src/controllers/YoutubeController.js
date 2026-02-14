import fs from "fs";
import path from "path";
import { google } from "googleapis";

// Récupération du client OAuth2
async function getOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/google/oauth2callback"
  );

  const tokenPath = path.join(process.cwd(), "config/youtube_token.json");
  if (!fs.existsSync(tokenPath)) throw new Error("Token non trouvé, connectez-vous via /google/auth");

  const token = JSON.parse(fs.readFileSync(tokenPath));
  oauth2Client.setCredentials(token);

  oauth2Client.on("tokens", (tokens) => {
    const updated = { ...token, ...tokens };
    fs.writeFileSync(tokenPath, JSON.stringify(updated, null, 2));
    console.log("Tokens mis à jour dans le JSON");
  });

  return oauth2Client;
}

// Upload vidéo avec URL et option de visibilité
async function uploadVideo(filePath, title, description, privacyStatus = "unlisted") {
  if (!fs.existsSync(filePath)) throw new Error("Fichier introuvable");

  const oauth2Client = await getOAuth2Client();
  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

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
  getOAuth2Client,
  uploadVideo,
};
