import instance from "./config.js";

/**
 * Récupère les statistiques globales du tableau de bord admin.
 * Endpoint: GET /admin/dashboard
 *
 * Retourne:
 *  - users   : { total, newToday, jury }
 *  - movies  : { total, evaluated }
 *  - votes   : { total, trend[] }
 *  - awards  : { total, assigned }
 *  - categories: { total }
 */
async function getAdminStats() {
  const res = await instance.get("admin/dashboard");
  return res.data;
}

export { getAdminStats };
