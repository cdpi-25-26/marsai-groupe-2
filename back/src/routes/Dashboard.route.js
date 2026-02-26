import express from "express";
import { getAdminStats } from "../controllers/DashboardController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

/**
 * GET /admin/dashboard
 * Retourne les statistiques globales pour le tableau de bord admin.
 * Protégé : ADMIN uniquement.
 */
router.get("/", AuthMiddleware(["ADMIN"]), getAdminStats);

export default router;
