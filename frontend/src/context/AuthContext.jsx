import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false); // Make it false initially, check cookies later if we need to hydrate

    // Note: For a real app, you would verify token from cookie/localstorage on mount
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            // Decode or verify token and set user implicitly
            // For this SaaS boilerplate we assume auth if token exists
            checkAuth();
        }
    }, []);

    const checkAuth = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users/profile');
            setUser(res.data.data);
            setIsAuthenticated(true);
        } catch (error) {
            setIsAuthenticated(false);
            Cookies.remove('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        if (res.data.token) {
            Cookies.set('token', res.data.token, { expires: 30 });
            setUser(res.data.data);
            setIsAuthenticated(true);
        }
        return res.data;
    };

    const signup = async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        if (res.data.token) {
            Cookies.set('token', res.data.token, { expires: 30 });
            setUser(res.data.data);
            setIsAuthenticated(true);
        }
        return res.data;
    };

    const logout = async () => {
        await api.get('/auth/logout');
        Cookies.remove('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
