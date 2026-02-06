// import db from "../models/index.js";
// import { Op, fn, col, literal } from "sequelize";

// const {
//   User,
//   Movie,
//   Vote,
//   Award,
//   Categorie
// } = db;

// /**
//  * Admin Dashboard Statistics
//  */
// export const getAdminStats = async (req, res) => {
//   try {
//     /* ===============================
//        Dates
//     =============================== */
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const last7Days = new Date();
//     last7Days.setDate(last7Days.getDate() - 6);

//     /* ===============================
//        GLOBAL COUNTS
//     =============================== */
//     const [
//       totalUsers,
//       totalMovies,
//       totalVotes,
//       totalAwards,
//       totalCategories,
//       juryCount
//     ] = await Promise.all([
//       User.count(),
//       Movie.count(),
//       Vote.count(),
//       Award.count(),
//       Categorie.count(),
//       User.count({ where: { role: "JURY" } })
//     ]);

//     /* ===============================
//        NEW USERS TODAY
//     =============================== */
//     const newUsersToday = await User.count({
//       where: {
//         createdAt: {
//           [Op.gte]: today
//         }
//       }
//     });

//     /* ===============================
//        FILMS EVALUATED
//        (movies that received votes)
//     =============================== */
//     const filmsEvaluated = await Vote.count({
//       distinct: true,
//       col: "movieId"
//     });

//     /* ===============================
//        AWARDS ASSIGNED
//     =============================== */
//     const awardsAssigned = await Award.count({
//       where: {
//         movieId: {
//           [Op.ne]: null
//         }
//       }
//     });

//     /* ===============================
//        VOTES TREND (7 days)
//     =============================== */
//     const votesTrendRaw = await Vote.findAll({
//       attributes: [
//         [fn("DATE", col("createdAt")), "day"],
//         [fn("COUNT", col("id")), "votes"]
//       ],
//       where: {
//         createdAt: {
//           [Op.gte]: last7Days
//         }
//       },
//       group: [fn("DATE", col("createdAt"))],
//       order: [[fn("DATE", col("createdAt")), "ASC"]]
//     });

//     /* Format trend */
//     const votesTrend = votesTrendRaw.map(v => ({
//       day: v.get("day"),
//       votes: v.get("votes")
//     }));

//     /* ===============================
//        RESPONSE
//     =============================== */
//     res.json({
//       users: {
//         total: totalUsers,
//         newToday: newUsersToday,
//         jury: juryCount
//       },

//       movies: {
//         total: totalMovies,
//         evaluated: filmsEvaluated
//       },

//       votes: {
//         total: totalVotes,
//         trend: votesTrend
//       },

//       awards: {
//         total: totalAwards,
//         assigned: awardsAssigned
//       },

//       categories: {
//         total: totalCategories
//       }
//     });

//   } catch (error) {
//     console.error("Dashboard error:", error);
//     res.status(500).json({
//       error: "Failed to load admin dashboard stats"
//     });
//   }
// };


import db from "../models/index.js";
import { Op, fn, col } from "sequelize";

const {
  User,
  Movie,
  Vote,
  Award,
  Categorie   // keep your existing spelling
} = db;

/**
 * Admin Dashboard Statistics Controller
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
       Movies that received ≥ 1 vote
    =============================== */
    const filmsEvaluated = await Vote.count({
      distinct: true,
      col: "movieId"
    });

    /* ===============================
       AWARDS ASSIGNED
    =============================== */
    const awardsAssigned = await Award.count({
      where: {
        movieId: {
          [Op.ne]: null
        }
      }
    });

    /* ===============================
       VOTES TREND (Last 7 days)
    =============================== */
    const votesTrendRaw = await Vote.findAll({
      attributes: [
        [fn("DATE", col("createdAt")), "date"],
        [fn("COUNT", col("id")), "count"]
      ],
      where: {
        createdAt: {
          [Op.gte]: last7Days
        }
      },
      group: [fn("DATE", col("createdAt"))],
      order: [[fn("DATE", col("createdAt")), "ASC"]]
    });

    /* ===============================
       FORMAT TREND FOR CHART
    =============================== */
    const votesTrend = votesTrendRaw.map(v => ({
      date: v.get("date"),
      count: Number(v.get("count"))
    }));

    /* ===============================
       FINAL RESPONSE
    =============================== */
    res.json({
      users: {
        total: totalUsers,
        newToday: newUsersToday,
        jury: juryCount
      },

      movies: {
        total: totalMovies,
        evaluated: filmsEvaluated
      },

      votes: {
        total: totalVotes,
        trend: votesTrend
      },

      awards: {
        total: totalAwards,
        assigned: awardsAssigned
      },

      categories: {
        total: totalCategories
      }
    });

  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      error: "Failed to load admin dashboard stats"
    });
  }
};
