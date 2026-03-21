import axios from 'axios';
import type { APIError } from '../lib/ErrorTypes';

const TOKEN_KEY = 'auth_token';

const normalizeBaseUrl = (url: string): string => {
    if (!url) return url;
    return url.endsWith('/') ? url.slice(0, -1) : url;
};

const getDefaultApiUrl = (): string => {
    // Match backend default host/port in local setups without hardcoding LAN IPs.
    if (typeof window !== 'undefined' && window.location?.hostname) {
        const protocol = window.location.protocol || 'http:';
        return `${protocol}//${window.location.hostname}:3000`;
    }
    return 'http://localhost:3000';
};

const apiClient = axios.create({
    baseURL: normalizeBaseUrl(import.meta.env.VITE_API_URL || getDefaultApiUrl()),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: Attach JWT token to all requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: Handle errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            // Only redirect if not already on login/signup pages
            if (!window.location.pathname.includes('/login') &&
                !window.location.pathname.includes('/signup')) {
                window.location.href = '/login';
            }
        }
        //Form Field Errors
        if ([422, 423].includes(error.response?.status)) {
            console.log("Validation errors: ", error.response.data);
            const errors: APIError = error.response.data
            return Promise.reject(errors);
        }
        else {
            // Handle other global errors
            const errors: APIError = error.response.data
            return Promise.reject(errors);
        }

    }
);

export default apiClient;
