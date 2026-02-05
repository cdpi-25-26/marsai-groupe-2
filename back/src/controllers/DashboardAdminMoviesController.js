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

/**
 * Get movie upodate status (ADMIN)
 */

export const updateMovieStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    const allowedStatus = ["selected", "refused", "submitted", "to_discuss", "finalist"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        error: "Invalid status value"
      });
    }

    const movie = await Movie.findByPk(id);

    if (!movie) {
      return res.status(404).json({
        error: "Movie not found"
      });
    }

    movie.selection_status = status;
    await movie.save();

    res.json({
      message: `Movie ${status} successfully`,
      movie
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to update movie status"
    });
  }
};
