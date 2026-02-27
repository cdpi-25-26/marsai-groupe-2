import db from "../models/index.js";
import { Op, fn, col } from "sequelize";

const {
  User,
  Movie,
  Vote,
  Award,
  Categorie
} = db;

/**
 * Admin Dashboard Statistics Controller
 * GET /admin/dashboard
 */
export const getAdminStats = async (req, res) => {
  try {
    /* ===============================
       DATES
    =============================== */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6);

    /* ===============================
       GLOBAL COUNTS
    =============================== */
    const [
      totalUsers,
      totalMovies,
      totalVotes,
      totalAwards,
      totalCategories,
      juryCount
    ] = await Promise.all([
      User.count(),
      Movie.count(),
      Vote.count(),
      Award.count(),
      Categorie.count(),
      User.count({ where: { role: "JURY" } })
    ]);

    /* ===============================
       NEW USERS TODAY
    =============================== */
    const newUsersToday = await User.count({
      where: {
        createdAt: {
          [Op.gte]: today
        }
      }
    });

    /* ===============================
       FILMS EVALUATED
       Movies that received at least 1 vote
    =============================== */
    const filmsEvaluated = await Vote.count({
      distinct: true,
      col: "id_movie"
    });

    /* ===============================
       SELECTED MOVIES
       Films with selection_status = 'selected'
    =============================== */
    const selectedMovies = await Movie.count({
      where: { selection_status: "selected" }
    });

    /* ===============================
       VOTE DISTRIBUTION
       Count YES / NO / TO DISCUSS
    =============================== */
    const [yesCount, noCount, toDiscussCount] = await Promise.all([
      Vote.count({ where: { note: "YES" } }),
      Vote.count({ where: { note: "NO" } }),
      Vote.count({ where: { note: "TO DISCUSS" } })
    ]);

    /* ===============================
       JURY PARTICIPATION RATE
       How many jury members have voted at least once
    =============================== */
    const juryWhoVoted = await Vote.count({
      distinct: true,
      col: "id_user"
    });

    const juryParticipationRate = juryCount > 0
      ? Math.round((juryWhoVoted / juryCount) * 100)
      : 0;

    /* ===============================
       VOTES TREND (Last 7 days)
    =============================== */
    const votesTrendRaw = await Vote.findAll({
      attributes: [
        [fn("DATE", col("createdAt")), "date"],
        [fn("COUNT", col("id_vote")), "count"]
      ],
      where: {
        createdAt: {
          [Op.gte]: last7Days
        }
      },
      group: [fn("DATE", col("createdAt"))],
      order: [[fn("DATE", col("createdAt")), "ASC"]]
    });

    const votesTrend = votesTrendRaw.map(v => ({
      date: v.get("date"),
      count: Number(v.get("count"))
    }));

    /* ===============================
       FILM PIPELINE
       Count per selection_status stage
    =============================== */
    const pipelineRaw = await Movie.findAll({
      attributes: [
        "selection_status",
        [fn("COUNT", col("id_movie")), "count"]
      ],
      group: ["selection_status"]
    });

    const pipeline = {};
    pipelineRaw.forEach(row => {
      pipeline[row.selection_status] = Number(row.get("count"));
    });

    /* ===============================
       FINAL RESPONSE
    =============================== */
    res.json({
      users: {
        total: totalUsers,
        newToday: newUsersToday,
        jury: juryCount,
        juryWhoVoted,
        juryParticipationRate
      },

      movies: {
        total: totalMovies,
        evaluated: filmsEvaluated,
        selected: selectedMovies,
        pipeline
      },

      votes: {
        total: totalVotes,
        trend: votesTrend,
        distribution: {
          yes: yesCount,
          no: noCount,
          toDiscuss: toDiscussCount
        }
      },

      awards: {
        total: totalAwards
      },

      categories: {
        total: totalCategories
      }
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      error: "Failed to load admin dashboard stats",
      details: error.message
    });
  }
};