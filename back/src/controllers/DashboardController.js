import db from "../models/index.js";

const { User, Movie, Vote, Award } = db;

const getAdminStats = async (req, res) => {
  try {
    const [
      users,
      movies,
      votes,
      awards,
      jury
    ] = await Promise.all([
      User.count(),
      Movie.count(),
      Vote.count(),
      Award.count(),
      User.count({ where: { role: "jury" } })
    ]);

    res.json({
      users,
      movies,
      jury,
      votes,
      awards
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to load admin dashboard stats"
    });
  }
};

export default getAdminStats;
