// Arquivo para configurar a URL da API conforme o ambiente
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5001'
  : 'https://seu-backend.railway.app'; // Vai mudar depois

const API_CONFIG = {
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

export default API_CONFIG;