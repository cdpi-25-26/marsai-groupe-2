import instance from "./config.js";

/**
 * Récupère les films du producteur connecté
 * Endpoint: GET /movies/mine
 * Requiert: Token JWT valide
 * @returns {Promise<Object>} Array des films du producteur
 */
async function getMyMovies() {
  return await instance.get("movies/mine");
}

export { getMyMovies };
