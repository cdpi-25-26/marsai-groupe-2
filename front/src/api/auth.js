import instance from "./config.js";

async function login(data) {
  return await instance.post("auth/login", data);
}

async function signIn(data) {
  return await instance.post("auth/register", data);
}

/**
 * Enregistre un producteur et son film (multipart/form-data)
 * Endpoint: POST /auth/register-film
 */
async function signInWithFilm(formData) {
  return await instance.post("auth/register-film", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

export { login, signIn, signInWithFilm };
