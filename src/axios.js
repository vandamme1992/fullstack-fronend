import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4444",
});

//записивает токет авторизации в локалсторадж во всем проекте
instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem("token");
  return config;
});

export default instance;
