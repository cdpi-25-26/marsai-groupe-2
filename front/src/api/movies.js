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

/**
 * Soumet un film pour le producteur connecté
 * Endpoint: POST /movies
 * Requiert: Token JWT valide
 * @param {FormData} formData - Données multipart (fichier + champs)
 */
async function createMovie(formData) {
  return await instance.post("movies", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

/**
 * Met à jour les collaborateurs d'un film
 * Endpoint: PUT /movies/:id/collaborators
 */
async function updateMovieCollaborators(id, collaborators) {
  return await instance.put(`movies/${id}/collaborators`, { collaborators });
}

export { getMyMovies, createMovie, updateMovieCollaborators };
