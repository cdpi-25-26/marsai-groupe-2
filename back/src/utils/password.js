import * as bcrypt from "bcrypt";

// Nombre de rounds de salt pour bcrypt (plus élevé = plus sécurisé mais plus lent)
const SALT_ROUNDS = 10;

/**
 * Hache un mot de passe en clair avec bcrypt
 * Utilisation: Stockage sécurisé du mot de passe en base de données
 * @param {string} password - Le mot de passe en clair à hacher
 * @returns {Promise<string>} Le mot de passe hashé (ex: $2b$10$...)
 */
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare un mot de passe en clair avec un hash bcrypt
 * Utilisation: Vérification lors de la connexion
 * @param {string} password - Le mot de passe en clair fourni par l'utilisateur
 * @param {string} hashedPassword - Le hash stocké en base de données
 * @returns {Promise<boolean>} true si les mots de passe correspondent, false sinon
 */
async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export { hashPassword, comparePassword };
