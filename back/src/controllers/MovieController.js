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
        { model: Categorie, 
          through: { attributes: [] } 
        },
        { model: Collaborator,
          through: { attributes: [] } 
         },
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
      display_picture,
      picture1,
      picture2,
      picture3,
      trailer,
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
      display_picture,
      picture1,
      picture2,
      picture3,
      trailer,
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
            first_name: c.firstname,
            last_name: c.lastname,
            email: c.email,
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



///////////////////////////////////////////////////////////////////////// Modifier un film (ADMIN uniquement)

async function updateMovie(req, res) {
  try {
    const { id } = req.params;

    const movie = await Movie.findByPk(id);

    if (!movie) {
      return res.status(404).json({ error: "Film non trouvé" });
    }

    // Sécurité : uniquement ADMIN
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "Seul un administrateur peut modifier un film"
      });
    }

    await movie.update(req.body);

    res.status(200).json({
      message: "Film mis à jour avec succès",
      movie
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

    res.status(200).json({
      message: "Film supprimé"
    });
    //correction du status 204 (pas de JSON avec 204)
    //return res.status(204).send(); 

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
};
