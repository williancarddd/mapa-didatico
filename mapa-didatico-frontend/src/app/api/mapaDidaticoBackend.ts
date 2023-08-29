import axios from "axios";


const apiMapaDidaticoBackend = axios.create({
  baseURL: `http://localhost:3001/`,
});

export default apiMapaDidaticoBackend;