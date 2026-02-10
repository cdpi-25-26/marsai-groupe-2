import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import MovieController from "../controllers/MovieController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();
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

/ ////////////////////////////////////////////////////////////////////////// Voir tous les films
 // Public (ex: page sélection officielle)

router.get(
  "/",
  MovieController.getMovies
);

//////////////////////////////////////////////////////////////////////// Mes films
// Seulement pour PRODUCER connecté

router.get(
  "/mine",
  (req, res, next) => AuthMiddleware(req, res, next, ["PRODUCER"]),
  MovieController.getMyMovies
);


//////////////////////////////////////////////////////////////////////// Films assignés (JURY)

router.get(
  "/assigned",
  (req, res, next) => AuthMiddleware(req, res, next, ["JURY"]),
  MovieController.getAssignedMovies
);





//////////////////////////////////////////////////////////////////////// Soumettre un film
 // Seulement pour PRODUCER connecté

router.post(
  "/",
  (req, res, next) => AuthMiddleware(req, res, next, ["PRODUCER"]),
  upload.fields([
    { name: "filmFile", maxCount: 1 },
    { name: "thumbnail1", maxCount: 1 },
    { name: "thumbnail2", maxCount: 1 },
    { name: "thumbnail3", maxCount: 1 },
    { name: "subtitlesSrt", maxCount: 1 }
  ]),
  MovieController.createMovie
);

///////////////////////////////////////////////////////////////////////// Mettre à jour le statut
// ADMIN uniquement
router.put(
  "/:id/status",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  MovieController.updateMovieStatus
);

///////////////////////////////////////////////////////////////////////// Assigner catégories (ADMIN)
router.put(
  "/:id/categories",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  MovieController.updateMovieCategories
);

///////////////////////////////////////////////////////////////////////// Assigner jurys (ADMIN)
router.put(
  "/:id/juries",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  MovieController.updateMovieJuries
);

///////////////////////////////////////////////////////////////////////// Assigner collaborateurs (PRODUCER/ADMIN)
router.put(
  "/:id/collaborators",
  (req, res, next) => AuthMiddleware(req, res, next, ["PRODUCER", "ADMIN"]),
  MovieController.updateMovieCollaborators
);

/////////////////////////////////////////////////////////////////////////// Modifier un film
//Seulement le propriétaire ou ADMIN

/*router.put(
  "/:id",
  (req, res, next) => AuthMiddleware(req, res, next, ["PRODUCER"]),
  MovieController.updateMovie
);*/

///////////////////////////////////////////////////////////////////////// Supprimer un film
// ADMIN uniquement






const movieRouter = express.Router();

// ADMIN uniquement
movieRouter.use(AuthMiddleware(["ADMIN"]));

 //-1- Voir tous les films (public)
movieRouter.get("/",MovieController.getMovies);

 //-2- Voir un film par ID (public)
movieRouter.get("/:id",MovieController.getMovieById);

 //-3- Soumettre un film (PRODUCER & ADMIN uniquement)
movieRouter.post("/", AuthMiddleware(["ADMIN","PRODUCER"]),MovieController.createMovie
);

 //-5- Supprimer un film (ADMIN uniquement)
movieRouter.delete("/:id", MovieController.deleteMovie);

 //-6- assigner un film à des juries(ADMIN uniquement)
movieRouter.post("/:id/assign-juries", MovieController.assignJuriesToMovie);

export default movieRouter;
