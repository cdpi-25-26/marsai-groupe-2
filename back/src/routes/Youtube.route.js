import express from "express";
import fs from "fs";
import path from "path";
import youtubeController from "../controllers/YoutubeController.js";

const youtubeRouter = express.Router();

const uploadFolder = path.join(process.cwd(), "uploads");

youtubeRouter.post("/upload", async (req, res) => {
  const { fileName, title, description } = req.body;

  // Vérifications basiques
  if (!fileName || !title || !description) {
    return res.status(400).json({ error: "fileName, title et description requis" });
  }

  const sanitizedFileName = path.basename(fileName);

  if (sanitizedFileName !== fileName) {
    return res.status(400).json({ error: "Nom de fichier invalide" });
  }

  if (!fileName.match(/\.(mp4|avi|m4v|mov|mpg|mpeg|wmv)$/i)) {
  return res.status(400).json({ error: "Extension non autorisée" });
  }

  const filePath = path.join(uploadFolder, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `Fichier ${fileName} introuvable dans ${uploadFolder}` });
  }

  try {
    const data = await youtubeController.uploadVideo(filePath, title, description);

    if (!data?.data?.id) {
      throw new Error("Réponse YouTube invalide");
    }

    res.json({
      message: "Vidéo uploadée",
      videoId: data.data.id,
      status: data.data.status,
      title: title
    });

  } catch (err) {
    console.error(`Erreur lors de l'upload de ${fileName} :`, err.message);
    res.status(500).json({
      error: "Erreur lors de l'upload de la vidéo",
      details: err.message
    });
  }
});

export default youtubeRouter;


