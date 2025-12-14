import React, { createContext, useContext, useEffect, useState } from 'react';
import { getToken, isAuthenticated, getUser, removeToken, removeUser, saveToken, saveUser } from '../utils/auth';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider ({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load user from localStorage 
    useEffect(() => {
        const token = getToken();
        const savedUser = getUser();

        if(token && savedUser) {
            setUser(savedUser);
        }

        setLoading(false)
    },[]);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authAPI.login(email, password);
            const { token, user: userData} = response.data;

            // Save in Local Storage
            saveToken(token);
            saveUser(userData);

            // Update State
            setUser(userData);

            return { success: true};
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Login Failed";
            setError(errorMessage);
            return { success: false, error: errorMessage};
        } finally {
            setLoading(false);
        }
    }

    const register = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authAPI.register(email, password);
            const { token, user: userData } = response.data;

            // Auto login after the register
            saveToken(token);
            saveUser(userData);
            setUser(userData);

            return {success: true};
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Registration Failed";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const logout = () => {
        removeToken();
        removeUser();
        setUser(null);
        setError(null);
    }

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: isAuthenticated() && !!user,
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
} 

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used withim an Auth Provider");
    }

    return context;
}

