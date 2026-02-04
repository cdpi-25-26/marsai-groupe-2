import api from "./config";

const getAdminStats = () => {
  return api.get("/dashboard/admin");
};

export default {
  getAdminStats
};
