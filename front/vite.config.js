/**
 * Configuration Vite pour le projet React
 * Vite est un bundler et serveur de développement ultrarapide pour les applications modernes
 * 
 * Plugins configurés:
 * - @vitejs/plugin-react: Supporte JSX et Fast Refresh pour le rechargement rapide
 * - @tailwindcss/vite: Intègre Tailwind CSS dans le processus de build
 * 
 * Documentation: https://vite.dev/config/
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Configuration Vite avec les plugins nécessaires
 * - react: Transforme JSX et active Fast Refresh pour l'expérience développeur optimale
 * - tailwindcss: Traite les styles Tailwind CSS lors de la compilation
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
});



