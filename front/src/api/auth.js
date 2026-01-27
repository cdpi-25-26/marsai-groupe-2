import instance from "./config.js";

async function login(data) {
  return await instance.post("auth/login", data);
}

async function signIn(data) {
  return await instance.post("auth/register", data);
}

export { login, signIn };
