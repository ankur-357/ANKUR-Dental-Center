import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginCredentials } from '../types';
import { getUsers, setCurrentUser, getCurrentUser, isAuthenticated, clearAuthData } from '../utils/storage';

interface AuthContextType {
    currentUser: User | null;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUserState] = useState<User | null>(null);
    const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const user = getCurrentUser();
        const authenticated = isAuthenticated();

        if (user && authenticated) {
            setCurrentUserState(user);
            setIsAuthenticatedState(true);
        }

        setLoading(false);
    }, []);

    const login = async (credentials: LoginCredentials): Promise<boolean> => {
        try {
            const users = getUsers();
            const user = users.find(
                u => u.email === credentials.email && u.password === credentials.password
            );

            if (user) {
                setCurrentUser(user);
                setCurrentUserState(user);
                setIsAuthenticatedState(true);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        clearAuthData();
        setCurrentUserState(null);
        setIsAuthenticatedState(false);
    };

    const value: AuthContextType = {
        currentUser,
        isAuthenticated: isAuthenticatedState,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 