import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const ticketAPI = {
    getTickets: () => api.get('/tickets'),
    getTicket: (id) => api.get(`/tickets/${id}`),
    createTicket: (data) => api.post('/tickets', data),
    updateStatus: (id, status) => api.put(`/tickets/${id}/status`, { status }),
    addComment: (id, commentData) => api.post(`/tickets/${id}/comments`, commentData),
    getAgents: () => api.get('/users/agents'),
    assignTicket: (id, agentId) => api.put(`/tickets/${id}/assign`, { agentId }),
    getAssignedTickets: () => api.get('/tickets/assigned'),
    getMyTickets: () => api.get('/tickets/my'),
};

export default ticketAPI; 