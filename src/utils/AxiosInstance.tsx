import axios from 'axios';
import store from '../redux/store/Store'
import { clearAuth, updateToken } from '@/redux/slice/AuthSlice';

const instance = axios.create({
    baseURL: ' http://127.0.0.1:8000/',
    headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor to attach the access token
instance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.accessToken;

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Refresh Token Logic
const refreshToken = async () => {
    const state = store.getState();
    const refresh = state.auth.refreshToken;

    if (!refresh) {
        console.warn('No refresh token found...');
        return null;
    }

    try {
        const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
            refresh,
        });
        const newToken = response.data.access;
        store.dispatch(updateToken({ accessToken: newToken }));
        return newToken;
    } catch (error) {
        console.error('Failed to refresh token:', error);
        store.dispatch(clearAuth()); // Clear auth state
        

        
        // navigate('/session-expired');  // Redirect to session expired page
        return null;
    }
};

// Response Interceptor to handle 401 Unauthorized
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newToken = await refreshToken();

            if (newToken) {
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return instance(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;