import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  // Add response interceptor for error handling
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API Error:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/auth/login';
        }
      }
      return Promise.reject(error);
    }
  ) 

  // Authentication API - Updated to match your backend
export const authApi = {
    // Admin login - using emailOrPhone field to match your backend
    login: (credentials: { email: string; password: string }) => 
      api.post('/auth/login', { 
        emailOrPhone: credentials.email, 
        password: credentials.password,
        role: 'admin' 
      }),
    // Admin signup - using register endpoint
    signup: (adminData: { name: string; email: string; phone_number: string; password: string; confirmPassword: string }) => 
      api.post('/auth/register', { 
        name: adminData.name,
        email: adminData.email,
        phone_number: adminData.phone_number,
        password: adminData.password,
        type: 'admin'
      }),
    logout: () => api.post('/auth/logout'),
    // Get current admin - using protected route
    getCurrentAdmin: () => api.get('/auth/protected'),
    refreshToken: () => api.post('/auth/refresh'),
    // Admin-specific endpoint
    adminAccess: () => api.get('/auth/admin'),
  };

export const dashboardApi = {
    getStats: () => api.get('/admin/dashboard'),
};

  // User API
export const userApi = {
  getAllUsers: (params: any) => api.get('/admin/users', { params }),
  getUserDetails: (userId: string) => api.get(`/admin/users/${userId}`),
  updateUserStatus: (userId: string, data: any) => 
    api.patch(`/admin/users/${userId}/status`, data),
  verifySeller: (userId: string) => 
    api.patch(`/admin/users/${userId}/verify`),
};

export const enquiryApi = {
  getAllEnquiries: (params: any) => api.get('/admin/enquiries', { params }),
  getQuotationsByEnquiry: (enquiryId: string) => 
    api.get(`/admin/enquiries/${enquiryId}/quotations`),
};

export const quotationApi = {
  getAllQuotations: (params: any) => api.get('/admin/quotations', { params }),
  updateQuotationStatus: (quotationId: string, data: any) => 
    api.patch(`/admin/quotations/${quotationId}/status`, data),
};

export const feedbackApi = {
    getAllFeedback: (params: any) => api.get('/feedback/get-all-feedback', { params }),
    getFeedbackMessages: (feedbackId: string) => 
      api.get(`/feedback/${feedbackId}/messages`),
    updateFeedbackStatus: (feedbackId: string, data: any) => 
      api.patch(`/feedback/update-status/${feedbackId}`, data),
    replyToFeedback: (feedbackId: string, data: any) => 
      api.post(`/feedback/${feedbackId}/reply`, data),
  };

export const conversationApi = {
  getAllConversations: (params: any) => api.get('/admin/conversations', { params }),
  getMessagesBetween: (buyerId: string, sellerId: string) =>
    api.get(`/admin/messages/between`, { params: { buyer_id: buyerId, seller_id: sellerId } }),
};

export default api;