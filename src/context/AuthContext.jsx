import { createContext, useContext, useState, useEffect } from 'react';
import { validateUser, logout as logoutApi } from '../lib/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkAuth = async () => {
        try {
            setLoading(true);
            const response = await validateUser();
            if (response.success) {
                setUser(response.data);
            } else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = (userData) => {
        // This is called after successful login in LoginForm
        // It should receive the user data from the login response
        if (userData.data) {
            setUser(userData.data);
        } else {
            setUser(userData);
        }
    };

    const logout = async () => {
        try {
            await logoutApi();
            setUser(null);
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout, checkAuth }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
