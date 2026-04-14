// TODO: Replace with your deployed backend URL after deployment
// Example: 'https://your-backend.azurewebsites.net/api'
const PRODUCTION_API_URL = 'YOUR_BACKEND_URL_HERE/api';

const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

export const API_BASE_URL = isProduction 
  ? PRODUCTION_API_URL 
  : 'http://localhost:5001/api';

export const DEBUG_API = 'http://localhost:5001/api';