import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

// Add interceptor for JWT if stored in localStorage
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle paginated data and simplify responses
api.interceptors.response.use(response => {
    // If backend returns paginated structure { content: [], ... }
    if (response.data && response.data.content && Array.isArray(response.data.content)) {
        return response.data.content;
    }
    return response.data;
}, error => {
    return Promise.reject(error);
});

export const workflowService = {
    getAll: () => api.get('/workflows'),
    getById: (id) => api.get(`/workflows/${id}`),
    create: (workflow) => api.post('/workflows', workflow),
    update: (id, workflow) => api.put(`/workflows/${id}`, workflow),
    delete: (id) => api.delete(`/workflows/${id}`),
    getSteps: (workflowId) => api.get(`/workflows/${workflowId}/steps`),
    addStep: (workflowId, step) => api.post(`/workflows/${workflowId}/steps`, step),
    updateStep: (stepId, step) => api.put(`/workflows/steps/${stepId}`, step),
    deleteStep: (stepId) => api.delete(`/workflows/steps/${stepId}`),
    getRules: (stepId) => api.get(`/workflows/steps/${stepId}/rules`),
    addRule: (stepId, rule) => api.post(`/workflows/steps/${stepId}/rules`, rule),
    updateRule: (ruleId, rule) => api.put(`/workflows/rules/${ruleId}`, rule),
    deleteRule: (ruleId) => api.delete(`/workflows/rules/${ruleId}`),
};

export const executionService = {
    start: (workflowId, data) => api.post(`/executions/workflow/${workflowId}`, data),
    getById: (id) => api.get(`/executions/${id}`),
    getLogs: (id) => api.get(`/executions/${id}/logs`),
    approve: (id, approverId, data) => api.post(`/executions/${id}/approve?approverId=${approverId}`, data),
    cancel: (id) => api.post(`/executions/${id}/cancel`),
    retry: (id) => api.post(`/executions/${id}/retry`),
    getAll: () => api.get('/executions')
};

export const auditService = {
    getAll: () => api.get('/audit-logs')
};
