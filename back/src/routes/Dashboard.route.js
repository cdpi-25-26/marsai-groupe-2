// import express from 'express';
// import getAdminStats from '../controllers/DashboardController.js';
// import auth from '../middlewares/AuthMiddleware.js'

// const router = express.Router();

// router.get ("/admin", auth(["admin"]), getAdminStats);

// export default router;

import express from "express";
import getAdminStats from "../controllers/DashboardController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
 
const router = express.Router();

router.get(
  "/admin",
  (req, res, next) => AuthMiddleware(req, res, next, ["ADMIN"]),
  getAdminStats
);

export default router;
