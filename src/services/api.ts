import axios from "axios";
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;