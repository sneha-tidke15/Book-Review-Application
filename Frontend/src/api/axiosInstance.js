import axios from 'axios';

// Default configuration
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // Increased timeout for production
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token to requests if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Removed X-Request-Timestamp header to prevent CORS issues
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    // Handle errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      
      // Handle specific status codes
      if (status === 401) {
        // Unauthorized - redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (status === 403) {
        // Forbidden
        console.error('Forbidden: You do not have permission to access this resource');
      } else if (status === 429) {
        // Rate limit exceeded
        console.error('Rate limit exceeded:', data.error);
      }
      
      return Promise.reject({
        message: data.message || 'An error occurred',
        status: status,
        data: data,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return Promise.reject({
        message: 'No response from server. Please check your connection.',
        isNetworkError: true,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      return Promise.reject({
        message: 'Error setting up request',
        error: error.message,
      });
    }
  }
);

export default axiosInstance;