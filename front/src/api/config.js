import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 1000,
});

instance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");

    if (token !== null) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.log("une erreur est survenue:", error);
    return Promise.reject(new Error(error));
  },
);

export default instance;
