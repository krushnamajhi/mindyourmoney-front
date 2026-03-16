import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthResponse } from '../domain/models';
import { AuthService } from '../services/AuthService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = AuthService.getToken();
            if (token) {
                try {
                    // Validate token by fetching current user
                    const currentUser = await AuthService.getCurrentUser();
                    setUser(currentUser);
                } catch (error) {
                    // Token invalid or expired
                    AuthService.removeToken();
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const response: AuthResponse = await AuthService.login(email, password);
        AuthService.setToken(response.token);
        setUser(response.user);
    };

    const signup = async (firstName: string, lastName: string, email: string, password: string) => {
        const response: AuthResponse = await AuthService.signup({
            firstName,
            lastName,
            email,
            password,
        });
        AuthService.setToken(response.token);
        setUser(response.user);
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
