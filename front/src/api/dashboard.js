// import instance from "./config.js";

// /**
//  * Get admin dashboard statistics
//  * Endpoint: GET /dashboard
//  */
// async function getAdminStats() {
//   return await instance.get("admin/dashboard");
// }

// export { getAdminStats };


import instance from "./config.js";

async function getAdminStats() {
  const res = await instance.get("/");
  return res.data;
}

export { getAdminStats };
