import api from "./config";

export const getAdminStats = async () => {
  const res = await api.get("/admin/dashboard");
  return res.data;
};
