import instance from "./config.js";

/**
 * Récupère tous les awards (ADMIN)
 * Endpoint: GET /awards
 */
async function getAwards() {
  return await instance.get("awards");
}

/**
 * Crée un award et l'assigne à un film (ADMIN)
 * Endpoint: POST /awards/:id_movie
 */
async function createAward(id_movie, award_name) {
  return await instance.post(`awards/${id_movie}`, { award_name });
}

/**
 * Supprime un award (ADMIN)
 * Endpoint: DELETE /awards/:id
 */
async function deleteAward(id) {
  return await instance.delete(`awards/${id}`);
}

export { getAwards, createAward, deleteAward };
