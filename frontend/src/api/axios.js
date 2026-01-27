import axios from 'axios';
import axiosRetry from 'axios-retry';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    timeout: 10000, // 10s timeout for mobile networks
});

// Configure retry strategy (3 retries, exponential backoff)
axiosRetry(api, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        // Retry on network errors or 5xx status codes
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response && error.response.status >= 500);
    }
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors (Token expired)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.warn('Request timed out');
        }
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/admin'; // Redirect to login
        }
        return Promise.reject(error);
    }
);

export default api;
