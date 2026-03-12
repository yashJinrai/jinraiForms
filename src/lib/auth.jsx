import api from './api';

export const login = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await api.post('/auth/forgot_password', { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const verifyOtp = async (email, otp) => {
    try {
        const response = await api.post('/auth/verify-otp', { email, otp });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const resetPassword = async (email, newPassword) => {
    try {
        const response = await api.post('/auth/reset_password', { email, newPassword });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
export const validateUser = async () => {
    try {
        const response = await api.get('/auth/valid_user');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const logout = async () => {
    try {
        const response = await api.get('/auth/logout');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
