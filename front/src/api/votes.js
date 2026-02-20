import instance from './config.js';

/**
 * Submit a vote for a film
 */
export async function submitVote(voteData) {
  const response = await instance.post('/votes', voteData);
  return response.data;
}

/**
 * Get current user's votes
 */
export async function getUserVotes() {
  const response = await instance.get('/votes/my-votes');
  return response.data;
}

/**
 * Get all votes for a specific movie (admin only)
 */
export async function getMovieVotes(movieId) {
  const response = await instance.get(`/votes/movie/${movieId}`);
  return response.data;
}

/**
 * Update an existing vote
 */
export async function updateVote(voteId, voteData) {
  const response = await instance.put(`/votes/${voteId}`, voteData);
  return response.data;
}

/**
 * Delete a vote
 */
export async function deleteVote(voteId) {
  const response = await instance.delete(`/votes/${voteId}`);
  return response.data;
}

/**
 * Get voting statistics (admin only)
 */
export async function getVotingStats() {
  const response = await instance.get('/votes/stats');
  return response.data;
}
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

export { getMyVotes, getMyVoteByMovie, submitMyVote, getVotes };
