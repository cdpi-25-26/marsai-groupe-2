import axios from "axios";

/**
 * Instance Axios configurée pour communiquer avec le backend
 * Base URL: http://localhost:3000/
 * Timeout: 5000ms (increased for DB operations)
 */
const instance = axios.create({
  // baseURL: "http://localhost:3000/",
  // timeout: 5000,
  baseURL: "http://127.0.0.1:3000/",
  timeout: 10000,
});

/**
 * Intercepteur de requête
 * Ajoute automatiquement le token JWT dans le header Authorization
 * de chaque requête HTTP envoyée au backend
 */
instance.interceptors.request.use(
  async (config) => {
    // Récupérer le token du localStorage
    const token = localStorage.getItem("token");

    // Ajouter le token au header si disponible
    if (token !== null) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.log("Une erreur est survenue lors de la requête:", error);
    return Promise.reject(new Error(error));
  },
);

export default instance;
