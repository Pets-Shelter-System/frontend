import axios from "axios";

const api = axios.create({
  baseURL: "http://petmarket.runasp.net/api", 
});

export default api;
