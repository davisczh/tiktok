import axios from 'axios';

const getBaseURL = () => {
    // Determine if we're on localhost or another device
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000';
    } else {
      return `http://${hostname}:8000`; // Assuming the server runs on port 8000
    }
  }

const api = axios.create({
    baseURL: getBaseURL(),
});

export default api