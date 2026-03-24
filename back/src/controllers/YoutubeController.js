import fs from "fs";
import path from "path";
import { google } from "googleapis";

const TOKEN_PATH = path.join(process.cwd(), "config/youtube_token.json");
let oauth2Client;
let tokenData;

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

  await oauth2Client.getAccessToken();
  oauth2Client.on("tokens", (tokens) => {
    tokenData = { ...tokenData, ...tokens };
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenData, null, 2));
    console.log("Token mis à jour dans le JSON");
  });

  console.log("✓ initYoutubeAuth ON");
}

function getOAuth2Client() {
  if (!oauth2Client) throw new Error("OAuth2 non initialisé, appelez initYoutubeAuth() au démarrage");
  return oauth2Client;
}

function isGoogleAuthActive() {
  return !!oauth2Client;
}

async function getVideoDetails(videoId) {
  const client = getOAuth2Client();
  const youtube = google.youtube({ version: "v3", auth: client });

  try {
    const response = await youtube.videos.list({
      id: videoId,
      part: ["status", "contentDetails", "snippet"]
    });

    if (!response.data.items?.length) {
      return null;
    }

    const video = response.data.items[0];
    return {
      id: videoId,
      licensedContent: video.contentDetails?.licensedContent ?? false,
      privacyStatus: video.status?.privacyStatus,
      rejectionReason: video.status?.rejectionReason ?? null,
      uploadStatus: video.status?.uploadStatus ?? null,
      publicStatsViewable: video.status?.publicStatsViewable ?? false,
      embeddable: video.contentDetails?.embeddable ?? false,
    };
  } catch (err) {
    console.warn("Erreur récupération détails vidéo:", err.message);
    return null;
  }
}

async function uploadVideo(filePath, title, description, privacyStatus = "unlisted") {
  if (!fs.existsSync(filePath)) throw new Error("Fichier introuvable");

  const client = getOAuth2Client();
  const youtube = google.youtube({ version: "v3", auth: client });

  try {
    const response = await youtube.videos.insert({
      part: ["snippet", "status", "contentDetails"],
      requestBody: {
        snippet: { title, description },
        status: { privacyStatus },
      },
      media: { body: fs.createReadStream(filePath) },
    });

    if (!response?.data?.id) throw new Error("Réponse YouTube invalide");

    const videoId = response.data.id;
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const videoDetails = await getVideoDetails(videoId);

    return {
      id: videoId,
      licensedContent: videoDetails?.licensedContent ?? response.data.contentDetails?.licensedContent ?? false,
      privacyStatus: videoDetails?.privacyStatus ?? response.data.status?.privacyStatus,
      rejectionReason: videoDetails?.rejectionReason ?? null,
      uploadStatus: videoDetails?.uploadStatus ?? null,
      duration: response.data.contentDetails?.duration
    };

  } catch (err) {
    if (err.response?.data?.error?.errors?.[0]?.reason === "quotaExceeded") {
      throw new Error("Quota YouTube dépassé pour aujourd'hui");
    }
    throw err;
  }
}

export default {
  initYoutubeAuth,
  getOAuth2Client,
  isGoogleAuthActive,
  uploadVideo,
  getVideoDetails,
};
