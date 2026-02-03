/**
 * Configuration ESLint pour le projet React
 * ESLint est un outil d'analyse statique qui détecte les erreurs et les problèmes de style de code
 * 
 * Configurations appliquées:
 * - @eslint/js: Règles ESLint recommandées par la communauté JavaScript
 * - react-hooks: Règles spécifiques aux hooks React (useEffect, useState, etc.)
 * - react-refresh: Support pour Fast Refresh de Vite
 * 
 * Environnement: Browser (ES2020+)
 * Support: Fichiers .js et .jsx avec JSX syntax
 */

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

/**
 * Configuration ESLint plate (flat config) pour React + Vite
 * 
 * Ignore: Dossier /dist (build output)
 * Cible: Tous les fichiers .js et .jsx
 * Règles strictes: Détecte les variables inutilisées sauf si elles commencent par majuscule ou underscore
 */
export default defineConfig([
  // Ignore les fichiers générés lors du build
  globalIgnores(['dist']),
  {
    // Applique les règles à tous les fichiers JavaScript et JSX
    files: ['**/*.{js,jsx}'],
    // Étend les configurations recommandées pour React et ESLint
    extends: [
      js.configs.recommended,           // Règles ESLint de base
      reactHooks.configs.flat.recommended, // Règles pour React Hooks
      reactRefresh.configs.vite,        // Intégration Vite Fast Refresh
    ],
    // Configuration du parser et de l'environnement
    languageOptions: {
      ecmaVersion: 2020,                // Support ES2020
      globals: globals.browser,         // Globals du navigateur (window, document, etc.)
      parserOptions: {
        ecmaVersion: 'latest',          // Accepte la dernière syntaxe ECMAScript
        ecmaFeatures: { jsx: true },    // Supporte la syntaxe JSX
        sourceType: 'module',           // Modules ES (import/export)
      },
    },
    // Règles de linting personnalisées
    rules: {
      // Permet les variables inutilisées si elles commencent par majuscule ou underscore
      // Utile pour les composants React et les paramètres ignorés
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
