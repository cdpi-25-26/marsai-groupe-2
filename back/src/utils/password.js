import * as bcrypt from "bcrypt";

// Nombre de rounds de salt pour bcrypt (plus élevé = plus sécurisé mais plus lent)
const SALT_ROUNDS = 10;

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export { hashPassword, comparePassword };
