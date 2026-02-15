import instance from "./config.js";

/**
 * Récupère les votes du jury connecté
 * Endpoint: GET /votes/mine
 */
async function getMyVotes() {
  return await instance.get("votes/mine");
}

/**
 * Récupère tous les votes (ADMIN)
 * Endpoint: GET /votes
 */
async function getVotes() {
  return await instance.get("votes");
}

/**
 * Récupère mon vote pour un film
 * Endpoint: GET /votes/mine/:id_movie
 */
async function getMyVoteByMovie(id_movie) {
  return await instance.get(`votes/mine/${id_movie}`);
}

/**
 * Crée ou met à jour mon vote pour un film
 * Endpoint: POST /votes/mine/:id_movie
 */
async function submitMyVote(id_movie, payload) {
  return await instance.post(`votes/mine/${id_movie}`, payload);
}

/**
 * Supprime tous les votes d'un film (ADMIN)
 * Endpoint: DELETE /votes/movie/:id_movie
 */
async function deleteVotesByMovie(id_movie) {
  return await instance.delete(`votes/movie/${id_movie}`);
}

/**
 * Supprime un vote par ID (ADMIN)
 * Endpoint: DELETE /votes/:id
 */
async function deleteVoteById(id) {
  return await instance.delete(`votes/${id}`);
}

export { getMyVotes, getMyVoteByMovie, submitMyVote, getVotes, deleteVotesByMovie, deleteVoteById };
