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