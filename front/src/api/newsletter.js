import instance from "./config.js";

async function createNewsLetter(email) {
    console.log(email);
  return await instance.post("newsletter", {email});
}

export { createNewsLetter };