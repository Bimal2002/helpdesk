import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getProfile: () => api.get('/users/profile'),
};

// User API
export const userAPI = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (profileData) => api.put('/users/profile', profileData),
    getAllUsers: () => api.get('/users'),
    createUser: (userData) => api.post('/users', userData),
};

// Ticket API
export const ticketAPI = {
    createTicket: (ticketData) => api.post('/tickets', ticketData),
    getTickets: () => api.get('/tickets'),
    getTicket: (id) => api.get(`/tickets/${id}`),
    updateStatus: (id, status) => api.put(`/tickets/${id}/status`, { status }),
    addNote: (id, note) => api.post(`/tickets/${id}/notes`, note),
    assignTicket: (id, agentId) => api.put(`/tickets/${id}/assign`, { agentId }),
};

export default api; 