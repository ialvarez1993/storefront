import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001", // URL base de tu json-server
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
