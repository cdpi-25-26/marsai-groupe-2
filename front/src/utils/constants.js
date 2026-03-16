/**
 * Constantes globales de l'application MarsAI
 *
 * API_BASE : URL de base du backend.
 * UPLOAD_BASE : URL de base pour accéder aux fichiers uploadés.
 */
export const API_BASE =
  import.meta.env.VITE_API_URL
  || import.meta.env.VITE_API_BASE_URL
  || "http://127.0.0.1:3000";

export const UPLOAD_BASE =
  import.meta.env.VITE_UPLOAD_BASE || `${API_BASE}/uploads`;