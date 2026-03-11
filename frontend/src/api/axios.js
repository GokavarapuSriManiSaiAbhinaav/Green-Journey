import axios from 'axios';
import { configureRetryLogic } from '../utils/retryLogic';

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000') + "/api",
    timeout: 30000, // Adjusted to 30s as requested
    headers: {
        'Content-Type': 'application/json',
    }
});

// Use the external retry logic utility
configureRetryLogic(api);

let isFirstRequestPending = false;
let isFirstRequestCompleted = false;

// Add a request interceptor to include the JWT token and dispatch loading state
api.interceptors.request.use(
    (config) => {
        if (!isFirstRequestCompleted && !isFirstRequestPending) {
            isFirstRequestPending = true;
            window.dispatchEvent(new Event('backend-waking'));
        }

        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        if (isFirstRequestPending) {
            isFirstRequestPending = false;
            window.dispatchEvent(new Event('backend-ready'));
        }
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors (Token expired) and loading state
api.interceptors.response.use(
    (response) => {
        if (isFirstRequestPending) {
            isFirstRequestPending = false;
            isFirstRequestCompleted = true;
            window.dispatchEvent(new Event('backend-ready'));
        }
        return response;
    },
    (error) => {
        if (isFirstRequestPending) {
            isFirstRequestPending = false;
            if (error.response) {
                isFirstRequestCompleted = true;
            }
            window.dispatchEvent(new Event('backend-ready'));
        }

        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
            console.warn('Request timed out - Backend might be waking up or slow mobile network');
        }

        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            // Graceful non-blocking redirect
            setTimeout(() => {
                window.location.href = '/admin'; // Redirect to login
            }, 1000);
        }
        return Promise.reject(error);
    }
);

export default api;
