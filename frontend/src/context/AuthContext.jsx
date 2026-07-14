import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null); // ✅ Added token state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
            fetchUser(savedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (token) => {
        try {
            const res = await api.get('/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data.data);
        } catch (error) {
            console.error('Error fetching user:', error);
            localStorage.removeItem('token');
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await api.post('/api/auth/login', { email, password });
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        setToken(token); // ✅ Save token to state
        setUser(user);
        return user;
    };

    const signup = async (name, email, password) => {
        const res = await api.post('/api/auth/register', { name, email, password });
        const { token } = res.data;
        localStorage.setItem('token', token);
        setToken(token); // ✅ Save token to state
        await fetchUser(token);
    };

    const logout = async () => {
        try {
            const savedToken = localStorage.getItem('token');
            await api.post('/api/auth/logout', {}, {
                headers: { Authorization: `Bearer ${savedToken}` }
            });
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            setToken(null); // ✅ Clear token from state
        }
    };

    return (
        // ✅ Added token to context value
        <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

