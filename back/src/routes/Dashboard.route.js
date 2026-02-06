import express from "express";
import { getAdminStats } from "../controllers/DashboardController.js";

const router = express.Router();

router.get("/admin/dashboard", getAdminStats);

export default router;
