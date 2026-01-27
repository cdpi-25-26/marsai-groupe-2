import instance from "./config.js";

async function getVideos() {
  return await instance.get("videos");
}

export { getVideos };
