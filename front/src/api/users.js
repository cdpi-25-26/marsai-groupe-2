import instance from "./config.js";

async function getUsers() {
  return await instance.get("users");
}

async function createUser(newUser) {
  return await instance.post("users", newUser);
}

async function updateUser(id, updatedUser) {
  return await instance.put(`users/${id}`, updatedUser);
}

async function deleteUser(id) {
  return await instance.delete(`users/${id}`);
}

async function getUserById(id) {
  return await instance.get(`users/${id}`);
}

async function getCurrentUser() {
  return await instance.get("users/me");
}

async function updateCurrentUser(updatedUser) {
  return await instance.put("users/me", updatedUser);
}

/**
 * Inscription publique à la newsletter
 * Endpoint: POST /newsletter/subscribe
 */
async function subscribeNewsletter(payload) {
  return await instance.post("newsletter/subscribe", payload);
}

/**
 * Liste des abonnés newsletter (ADMIN)
 * Endpoint: GET /newsletter/subscribers
 */
async function getNewsletterSubscribers() {
  return await instance.get("newsletter/subscribers");
}

/**
 * Envoi d'une newsletter (ADMIN)
 * Endpoint: POST /newsletter/send
 */
async function sendNewsletter(payload) {
  return await instance.post("newsletter/send", payload);
}

export {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getCurrentUser,
  updateCurrentUser,
  subscribeNewsletter,
  getNewsletterSubscribers,
  sendNewsletter
};
