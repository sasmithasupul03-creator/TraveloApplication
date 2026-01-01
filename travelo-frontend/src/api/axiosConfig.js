import axios from 'axios';

// Connects to your Spring Boot Backend on Port 5000
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;