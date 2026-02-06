import instance from "./config.js";

/**
 * Récupère la liste de tous les films/vidéos
 * Endpoint: GET /movies
 * @returns {Promise<Object>} Array de tous les films disponibles
 * 
 * @example
 * const response = await getVideos();
 * const films = response.data;
 */
async function getVideos() {
  return await instance.get("movies");
}

/**
 * Met à jour le statut d'un film
 * Endpoint: PUT /movies/:id/status
 */
async function updateMovieStatus(id, selection_status) {
  return await instance.put(`movies/${id}/status`, { selection_status });
}

/**
 * Assigne un jury à un film
 * Endpoint: PUT /movies/:id/assign-jury
 */
async function assignMovieJury(id, id_user) {
  return await instance.put(`movies/${id}/assign-jury`, { id_user });
}

export { getVideos, updateMovieStatus, assignMovieJury };
