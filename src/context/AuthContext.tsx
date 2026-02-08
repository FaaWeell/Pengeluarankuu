"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    user: { name: string; email: string } | null;
    login: (name: string) => boolean;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded credentials removed - using dynamic simple auth
// const VALID_EMAIL = "fajri@gmail.com";
// const VALID_PASSWORD = "bijikuda12";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // User now stores name instead of just email, but we'll map name to email for compatibility if needed
    // or just change the type. For minimal breakage, let's allow 'email' to be the identifier for now,
    // or better, update the type to match the new simple auth.
    // The plan said "Update User type to include name". Let's do that.
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const stored = localStorage.getItem("dompetku-current-user");
        if (stored) {
            try {
                const data = JSON.parse(stored);
                if (data.name) {
                    setIsAuthenticated(true);
                    setUser(data);
                }
            } catch {
                localStorage.removeItem("dompetku-current-user");
            }
        }
        setIsLoading(false);
    }, []);

    const login = (name: string): boolean => {
        if (name.trim().length > 0) {
            const newUser = { name, email: `${name.toLowerCase()}@local.user` }; // Mock email for compatibility
            setIsAuthenticated(true);
            setUser(newUser);
            localStorage.setItem("dompetku-current-user", JSON.stringify(newUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("dompetku-current-user");
    };

    return (
        // @ts-ignore - Ignoring type mismatch for now, we will update the interface next
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
