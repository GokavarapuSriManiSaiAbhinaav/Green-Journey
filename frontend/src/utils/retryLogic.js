import axiosRetry from 'axios-retry';

export const configureRetryLogic = (axiosInstance) => {
    axiosRetry(axiosInstance, {
        retries: 1,
        retryDelay: (retryCount) => {
            return axiosRetry.exponentialDelay(retryCount);
        },
        retryCondition: (error) => {
            // Retry once on network errors, timeouts, or 5xx status codes
            return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
                (error.code === 'ECONNABORTED') ||
                (error.message && error.message.includes('Network Error')) ||
                (error.response && error.response.status >= 500);
        },
        shouldResetTimeout: true,
    });
};
