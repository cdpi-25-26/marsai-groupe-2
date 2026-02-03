import instance from "./config.js";

/**
 * Authentifie un utilisateur existant
 * Envoie les identifiants et reçoit un JWT
 * Endpoint: POST /auth/login
 * @param {Object} data - Les identifiants { email, password }
 * @returns {Promise<Object>} Réponse avec token, email, first_name, role
 * 
 * @example
 * const response = await login({ email: "user@example.com", password: "pass123" });
 * const { token, first_name, role } = response.data;
 */
async function login(data) {
  return await instance.post("auth/login", data);
}

/**
 * Enregistre un nouvel utilisateur
 * Crée un compte avec tous les paramètres fournis
 * Endpoint: POST /auth/register
 * @param {Object} data - Les données d'enregistrement
 * @returns {Promise<Object>} Réponse avec le nouvel utilisateur créé
 * 
 * @example
 * const response = await signIn({
 *   first_name: "Marco",
 *   last_name: "Pinna",
 *   email: "marco@example.com",
 *   password: "secure123",
 *   role: "PRODUCER"
 * });
 */
async function signIn(data) {
  return await instance.post("auth/register", data);
}

export { login, signIn };
