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
      poster_image,
      image1,
      image2,
      image3,
      trailer_video,
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
      collaborators
    } = req.body;

    // -3- Validation minimale
    if (!title || !description) {
      return res.status(400).json({
        error: "Le titre et la description sont obligatoires"
      });
    }

    // -4-Création du film
    const newMovie = await Movie.create({
      title,
      description,
      duration,
      main_language,
      release_year,
      nationality,
      poster_image,
      image1,
      image2,
      image3,
      trailer_video,
      youtube_link,
      production,
      workshop,
      translation,
      synopsis,
      synopsis_anglais,
      subtitle,
      ai_tool,
      thumbnail,
      id_user
      // selection_status = 'submitted' automatiquement
    });

    // -5-Associer les catégories (N–N)
    if (categories?.length) {
      await newMovie.setCategories(categories);
    }

    // -6- Associer les collaborateurs
    if (collaborators?.length) {
      const createdCollaborators = await Promise.all(
        collaborators.map(c =>
          Collaborator.create({
            firstname: c.firstname,
            lastname: c.lastname,
            job: c.job
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
