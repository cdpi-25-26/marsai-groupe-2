import db from "../models/index.js";

const {
  Movie,
  Categorie,
  Collaborator,
  User
} = db;


//////////////////////////////////////////////////////////// Récupérer tous les films
 
async function getMovies(req, res) {
  try {
    const movies = await Movie.findAll({
      include: [
        {
          model: Categorie,
          through: { attributes: [] }
        },
        {
          model: Collaborator,
          through: { attributes: [] }
        },
        {
          model: User,
          attributes: ["id_user", "first_name", "last_name"]
        },
        {
          model: User,
          as: "assignedJury",
          attributes: ["id_user", "first_name", "last_name", "email"]
        }
      ]
    });

    res.json(movies);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//////////////////////////////////////////////////////////// Mes films (producteur connecté)

async function getMyMovies(req, res) {
  try {
    const id_user = req.user.id_user;
    const movies = await Movie.findAll({
      where: { id_user },
      include: [
        {
          model: Categorie,
          through: { attributes: [] }
        },
        {
          model: Collaborator,
          through: { attributes: [] }
        }
      ]
    });

    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


/////////////////////////////////////////////////////////////////////// Récupérer un film par ID

async function getMovieById(req, res) {
  try {
    const { id } = req.params;

    const movie = await Movie.findByPk(id, {
      include: [
        { model: Categorie },
        { model: Collaborator },
        { model: User, attributes: ["id_user", "first_name", "last_name"] }
      ]
    });

    if (!movie) {
      return res.status(404).json({ error: "Film non trouvé" });
    }

    res.json(movie);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


/////////////////////////////////////////////////////////////////////////////// Soumettre un film
 
async function createMovie(req, res) {
  try {

    // -1- Récupérer utilisateur connecté
    const id_user = req.user.id_user;

    // -2- Récupérer les données du formulaire
    const {
      title,
      description,
      duration,
      main_language,
      release_year,
      nationality,
      youtube_link,
      production,
      workshop,
      translation,
      synopsis,
      synopsis_anglais,
      subtitle,
      ai_tool,
      thumbnail,
      categories,
      collaborators,
      filmTitleOriginal,
      durationSeconds,
      filmLanguage,
      releaseYear,
      youtubeLink,
      synopsisOriginal,
      synopsisEnglish,
      aiClassification,
      aiStack,
      aiMethodology
    } = req.body;

    const files = req.files || {};
    const filmFile = files.filmFile?.[0]?.filename || null;
    const thumb1 = files.thumbnail1?.[0]?.filename || null;
    const thumb2 = files.thumbnail2?.[0]?.filename || null;
    const thumb3 = files.thumbnail3?.[0]?.filename || null;
    const subtitleFile = files.subtitlesSrt?.[0]?.filename || null;

    const movieTitle = filmTitleOriginal || title;
    const movieDescription = synopsisOriginal || description || synopsis;
    const movieDurationRaw = durationSeconds ?? duration;
    const movieDuration = movieDurationRaw !== undefined && movieDurationRaw !== null
      ? Number(movieDurationRaw)
      : null;
    const movieMainLanguage = filmLanguage || main_language;
    const movieReleaseYear = releaseYear || release_year || null;
    const movieYoutubeLink = youtubeLink || youtube_link;
    const movieSynopsisEnglish = synopsisEnglish || synopsis_anglais;
    const movieProduction = aiClassification || production;
    const movieWorkshop = aiMethodology || workshop;
    const movieAiTool = aiStack || ai_tool;
    const movieSubtitle = subtitleFile || subtitle || null;
    const movieThumbnail = thumb1 || thumbnail || null;

    // -3- Validation minimale
    if (!movieTitle || !movieDescription) {
      return res.status(400).json({
        error: "Le titre et la description sont obligatoires"
      });
    }

    if (movieDuration !== null && Number.isNaN(movieDuration)) {
      return res.status(400).json({
        error: "La durée du film est invalide"
      });
    }

    if (durationSeconds && movieDuration > 120) {
      return res.status(400).json({
        error: "La durée maximale est de 120 secondes"
      });
    }

    // -4-Création du film
    const newMovie = await Movie.create({
      title: movieTitle,
      description: movieDescription,
      duration: movieDuration,
      main_language: movieMainLanguage,
      release_year: movieReleaseYear,
      nationality,
      trailer: filmFile || req.body.trailer || req.body.trailer_video || null,
      youtube_link: movieYoutubeLink,
      production: movieProduction,
      workshop: movieWorkshop,
      translation,
      synopsis: movieDescription,
      synopsis_anglais: movieSynopsisEnglish,
      subtitle: movieSubtitle,
      ai_tool: movieAiTool,
      picture1: thumb1 || req.body.picture1 || null,
      picture2: thumb2 || req.body.picture2 || null,
      picture3: thumb3 || req.body.picture3 || null,
      thumbnail: movieThumbnail,
      id_user
      // selection_status = 'submitted' automatiquement
    });

    // -5-Associer les catégories (N–N)
    let parsedCategories = categories;
    if (typeof categories === "string") {
      try {
        parsedCategories = JSON.parse(categories);
      } catch (parseError) {
        parsedCategories = [];
      }
    }

    if (parsedCategories?.length) {
      await newMovie.setCategories(parsedCategories);
    }

    // -6- Associer les collaborateurs
    let parsedCollaborators = collaborators;
    if (typeof collaborators === "string") {
      try {
        parsedCollaborators = JSON.parse(collaborators);
      } catch (parseError) {
        parsedCollaborators = [];
      }
    }

    if (parsedCollaborators?.length) {
      const createdCollaborators = await Promise.all(
        parsedCollaborators.map(c =>
          Collaborator.create({
            first_name: c.first_name || c.firstname || "",
            last_name: c.last_name || c.lastname || "",
            job: c.job || null
          })
        )
      );

      await newMovie.setCollaborators(createdCollaborators);
    }

    res.status(201).json({
      message: "Film soumis avec succès",
      movie: newMovie
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


///////////////////////////////////////////////////////////////////////////////////////// Supprimer un film
 
async function deleteMovie(req, res) {
  try {
    const { id } = req.params;

    const movie = await Movie.findByPk(id);

    if (!movie) {
      return res.status(404).json({ error: "Film non trouvé" });
    }

    await movie.destroy();

    res.status(204).json({
      message: "Film supprimé"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

///////////////////////////////////////////////////////////////////////// Mettre à jour le statut

async function updateMovieStatus(req, res) {
  try {
    const { id } = req.params;
    const { selection_status } = req.body;

    const allowed = ["submitted", "refused", "to_discuss", "selected", "finalist"];
    if (!allowed.includes(selection_status)) {
      return res.status(400).json({ error: "Statut invalide" });
    }

    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ error: "Film non trouvé" });
    }

    movie.selection_status = selection_status;
    await movie.save();

    res.json({ message: "Statut mis à jour", movie });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

///////////////////////////////////////////////////////////////////////// Assigner un jury

async function assignJury(req, res) {
  try {
    const { id } = req.params;
    const { id_user } = req.body;

    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ error: "Film non trouvé" });
    }

    const juryUser = await User.findByPk(id_user);
    if (!juryUser || juryUser.role !== "JURY") {
      return res.status(400).json({ error: "Utilisateur jury invalide" });
    }

    movie.assigned_jury_id = id_user;
    await movie.save();

    res.json({ message: "Jury assigné", movie });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default {
  getMovies,
  getMyMovies,
  getMovieById,
  createMovie,
  deleteMovie,
  updateMovieStatus,
  assignJury
};
