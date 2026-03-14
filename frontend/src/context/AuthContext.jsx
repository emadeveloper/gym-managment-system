import React, { createContext, useContext, useEffect, useState } from 'react';
import { getToken, isAuthenticated, getUser, removeToken, removeUser, saveToken, saveUser } from '../utils/auth';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);
const MOCK_LOGIN_USERS = {
    'valentina.rios@example.com': {
        password: 'Valentina123!',
        user: {
            id: 'mock-valentina-001',
            email: 'valentina.rios@example.com',
            name: 'Valentina Ríos',
            role: 'USER',
        },
        token: 'mock-token-valentina-001',
    },
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const token = getToken();
        const savedUser = getUser();

        if (token && savedUser) {
            setUser(savedUser);
        }

        setLoading(false);
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authAPI.login(email, password);
            const { token, user: userData } = response.data;

            // Save in Local Storage
            saveToken(token);
            saveUser(userData);

            // Update State
            setUser(userData);

            return { success: true };
        } catch (err) {
            const normalizedEmail = (email || '').trim().toLowerCase();
            const mockCredentials = MOCK_LOGIN_USERS[normalizedEmail];

            if (mockCredentials && mockCredentials.password === password) {
                saveToken(mockCredentials.token);
                saveUser(mockCredentials.user);
                setUser(mockCredentials.user);
                return { success: true };
            }

            const errorMessage = err.response?.data?.message || "Login Failed";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authAPI.register(email, password);
            const { token, user: userData } = response.data;

            // Auto login after registration
            saveToken(token);
            saveUser(userData);
            setUser(userData);

            return { success: true, user: userData };
        } catch (err) {
            const apiError = err.response?.data;
            const validationDetails = apiError?.details;
            const firstValidationMessage = validationDetails && typeof validationDetails === 'object'
                ? Object.values(validationDetails)[0]
                : null;

            const errorMessage = firstValidationMessage || apiError?.message || "Registration Failed";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        removeToken();
        removeUser();
        setUser(null);
        setError(null);
    };

    const updateCurrentUser = (nextUser) => {
        saveUser(nextUser);
        setUser(nextUser);
    };

    /**
     * Verificar si el usuario tiene un rol específico
     * @param {string} role - Rol a verificar (ej: 'ADMIN', 'USER')
     * @returns {boolean}
     */
    const hasRole = (role) => {
        return user?.role === role;
    };

    /**
     * Verificar si el usuario tiene alguno de los roles especificados
     * @param {string[]} roles - Array de roles a verificar
     * @returns {boolean}
     */
    const hasAnyRole = (roles) => {
        return roles.includes(user?.role);
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateCurrentUser,
        hasRole,
        hasAnyRole,
        isAuthenticated: isAuthenticated() && !!user,
        isAdmin: user?.role === 'ADMIN',
        isUser: user?.role === 'USER',
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
