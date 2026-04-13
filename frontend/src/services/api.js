import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getProfile: (studentId) => apiClient.get(`/auth/profile/${studentId}`),
  updateProfile: (studentId, data) => apiClient.put(`/auth/profile/${studentId}`, data),
};

export const knowledgeBaseAPI = {
  search: (query) => apiClient.get(`/knowledge-base/search?query=${query}`),
  getByCategory: (category) => apiClient.get(`/knowledge-base/category/${category}`),
  getById: (id) => apiClient.get(`/knowledge-base/${id}`),
  getAll: () => apiClient.get('/knowledge-base/all'),
  create: (data) => apiClient.post('/knowledge-base', data),
  update: (id, data) => apiClient.put(`/knowledge-base/${id}`, data),
  delete: (id) => apiClient.delete(`/knowledge-base/${id}`),
};

export const chatbotAPI = {
  sendMessage: (studentId, message, sessionId) =>
    apiClient.post(`/chat/send?userId=${studentId}`, { message }),
  getChatHistory: (studentId) => apiClient.get(`/chat/history/${studentId}`),
  clearChatHistory: (studentId) => apiClient.delete(`/chat/history/${studentId}`),
};

export const learningAPI = {
  recordPerformance: (data) => apiClient.post('/learning/record-performance', data),
  getPerformance: (studentId) => apiClient.get(`/learning/performance/${studentId}`),
  getPerformanceBySemester: (studentId, semester) =>
    apiClient.get(`/learning/performance/${studentId}/${semester}`),
};

export const notificationAPI = {
  getNotifications: (studentId) => apiClient.get(`/notifications/${studentId}`),
  getUnreadNotifications: (studentId) => apiClient.get(`/notifications/unread/${studentId}`),
  markAsRead: (notificationId) => apiClient.put(`/notifications/mark-read/${notificationId}`),
  markAllAsRead: (studentId) => apiClient.put(`/notifications/mark-all-read/${studentId}`),
};

export default apiClient;
