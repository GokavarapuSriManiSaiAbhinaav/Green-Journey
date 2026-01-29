import axios from 'axios';
import axiosRetry from 'axios-retry';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    timeout: 60000, // Increased to 60s to handle Render/Vercel free tier cold starts
    headers: {
        'Content-Type': 'application/json',
    }
});

// Configure retry strategy (3 retries, exponential backoff)
axiosRetry(api, {
    retries: 3,
    retryDelay: (retryCount) => {
        return axiosRetry.exponentialDelay(retryCount);
    },
    retryCondition: (error) => {
        // Retry on network errors or 5xx status codes
        // Also retry on timeouts (ECONNABORTED)
        // AND retry on "Network Error" (common on mobile)
        return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
            (error.code === 'ECONNABORTED') ||
            (error.message && error.message.includes('Network Error')) ||
            (error.response && error.response.status >= 500);
    },
    shouldResetTimeout: true, // Reset timeout for each retry
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
        const originalRequest = error.config;

        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
            console.warn('Request timed out - Backend might be waking up or slow mobile network');
        }

        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/admin'; // Redirect to login
        }
        return Promise.reject(error);
    }
);

export default api;
