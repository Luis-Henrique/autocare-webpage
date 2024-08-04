import axios from 'axios';

const baseURL = 'https://api.autocare.app.br';

const api = axios.create({
  baseURL
});

export default api;
