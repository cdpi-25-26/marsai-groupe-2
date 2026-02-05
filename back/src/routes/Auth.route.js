import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import AuthController from "../controllers/AuthController.js";

const authRouter = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadDir),
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(null, `${file.fieldname}-${unique}${ext}`);
	}
});

const upload = multer({ storage });

/**
 * POST /auth/login
 * Route de connexion utilisateur
 * Vérifie les identifiants et retourne un JWT
 * Body: { email, password }
 * Response: { message, email, first_name, role, token }
 */
authRouter.post("/login", AuthController.login);

/**
 * POST /auth/register
 * Route d'enregistrement d'un nouvel utilisateur
 * Crée un compte avec les données fournies
 * Body: { firstName, lastName, email, password, role }
 * Response: { message, newUser }
 */
authRouter.post("/register", AuthController.register);

/**
 * POST /auth/register-film
 * Enregistre un producteur et son film (avec fichiers)
 */
authRouter.post(
	"/register-film",
	upload.fields([
		{ name: "filmFile", maxCount: 1 },
		{ name: "thumbnail1", maxCount: 1 },
		{ name: "thumbnail2", maxCount: 1 },
		{ name: "thumbnail3", maxCount: 1 },
		{ name: "subtitlesSrt", maxCount: 1 }
	]),
	AuthController.registerWithFilm
);

export default authRouter;
