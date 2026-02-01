import instance from "./config.js";

async function getUsers() {
  return await instance.get("users");
  // http://localhost:3000/users; fetch method GET
}

async function createUser(newUser) {
  return await instance.post("users", newUser);
  // http://localhost:3000/users; fetch method POST
}


async function updateUser(id, updatedUser) {
  return await instance.put(`users/${id}`, updatedUser);
  // http://localhost:3000/users/1; fetch method PUT
}

async function deleteUser(id) {
  return await instance.delete(`users/${id}`);
  // http://localhost:3000/users/1; fetch method DELETE
}

async function getUserById(id) {
  return await instance.get(`users/${id}`);
  // http://localhost:3000/users/1; fetch method GET
}

// Ottiene il profilo dell’utente autenticato
async function getCurrentUser() {
  return await instance.get("users/me");
}

// Aggiorna il profilo dell’utente autenticato
async function updateCurrentUser(updatedUser) {
  return await instance.put("users/me", updatedUser);
}

export { getUsers, createUser, updateUser, deleteUser, getUserById, getCurrentUser, updateCurrentUser };
