import axios from 'axios';

const TOKEN_KEY = 'auth_token';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://192.168.1.15:3000/', // Default or env
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
            return Promise.reject({ error: error.response.data.errors, errorType: error.response.data.error });
        }
        else {
            // Handle other global errors
            const message = error.response?.data?.message || error.message || 'An error occurred';
            console.error('API Error:', message);
            return Promise.reject({ error: error.response.data.errors, errorType: error.response.data.error });
        }

    }
);

export default apiClient;
