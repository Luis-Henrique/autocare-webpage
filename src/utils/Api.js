import axios from 'axios';

const baseURL = 'http://autocare.f6gcbuc7cpg5epcg.eastus.azurecontainer.io:8000';

const api = axios.create({
  baseURL
});

export default api;
