import db from "../models/index.js";
const { Movie, User } = db;

/**
 * Get all movies (ADMIN)
 */
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll({
      include: [{
        model: User,
        attributes: ["id_user", "email", "role"]
      }],
      order: [["createdAt", "DESC"]]
    });

    res.json({
      count: movies.length,
      movies
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get movie by ID (ADMIN)
 */
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: "Failed to load movie" });
  }
};
