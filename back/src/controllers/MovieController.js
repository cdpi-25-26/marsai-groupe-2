import Movie from "../models/Movie.js";

// Liste
function getMovies(req, res) {
  Movie.findAll().then((movies) => {
    res.json(movies);
  });
}

// Création
function createMovie(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  Movie.findOne({ where: { title } }).then((movie) => {
    if (movie) {
      res.json(movie);
    } else {
      Movie.create({ title: title, description: description }).then(
        (newMovie) => {
          res.status(201).json(newMovie);
        },
      );
    }
  });
}

export default { getMovies, createMovie };
