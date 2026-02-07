"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    user: { email: string } | null;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded credentials (for personal use only)
const VALID_EMAIL = "fajri@gmail.com";
const VALID_PASSWORD = "bijikuda12";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ email: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const stored = localStorage.getItem("dompetku-auth");
        if (stored) {
            try {
                const data = JSON.parse(stored);
                if (data.email === VALID_EMAIL) {
                    setIsAuthenticated(true);
                    setUser({ email: data.email });
                }
            } catch {
                localStorage.removeItem("dompetku-auth");
            }
        }
        setIsLoading(false);
    }, []);

    const login = (email: string, password: string): boolean => {
        if (email === VALID_EMAIL && password === VALID_PASSWORD) {
            setIsAuthenticated(true);
            setUser({ email });
            localStorage.setItem("dompetku-auth", JSON.stringify({ email }));
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("dompetku-auth");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
