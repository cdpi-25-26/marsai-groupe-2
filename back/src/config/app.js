const baseUrl = process.env.BACKEND_URL || "http://localhost:3000";

const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI ||
  `${baseUrl}/auth/google/callback`;

export { baseUrl, GOOGLE_REDIRECT_URI };