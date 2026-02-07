const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5001'
  : 'https://satisfied-motivation-production.up.railway.app';

const API_CONFIG = {
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

export default API_CONFIG;