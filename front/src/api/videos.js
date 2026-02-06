// import instance from "./config.js";

// /**
//  * Récupère la liste de tous les films/vidéos
//  * Endpoint: GET /videos
//  * @returns {Promise<Object>} Array de tous les films disponibles
//  * 
//  * @example
//  * const response = await getVideos();
//  * const films = response.data;
//  */
// async function getVideos() {
//   return await instance.get("videos");
// }

// export { getVideos };


import instance from "./config.js";

/**
 * Get all movies (Admin)
 * Endpoint: GET /movies
 */
async function getVideos() {
  return await instance.get("movies");
}

export { getVideos };

