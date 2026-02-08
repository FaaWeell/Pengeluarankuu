"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
    id: string;
    name: string;
    pin: string;
    email: string; // Keep for compatibility/display
    createdAt: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (name: string, pin: string) => { success: boolean; message?: string };
    register: (name: string, pin: string) => { success: boolean; message?: string };
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("dompetku-current-session");
        if (stored) {
            try {
                const data = JSON.parse(stored);
                if (data && data.id) {
                    setIsAuthenticated(true);
                    setUser(data);
                }
            } catch {
                localStorage.removeItem("dompetku-current-session");
            }
        }
        setIsLoading(false);
    }, []);

    const getUsers = (): User[] => {
        try {
            return JSON.parse(localStorage.getItem("dompetku-users") || "[]");
        } catch {
            return [];
        }
    };

    const register = (name: string, pin: string): { success: boolean; message?: string } => {
        if (!name.trim() || pin.length !== 6) {
            return { success: false, message: "Nama dan PIN (6 digit) harus diisi" };
        }

        const users = getUsers();
        // Check for exact duplicate credentials (name + pin)
        const duplicate = users.find(u => u.name.toLowerCase() === name.toLowerCase() && u.pin === pin);
        if (duplicate) {
            return { success: false, message: "Akun dengan nama dan PIN ini sudah ada" };
        }

        const newUser: User = {
            id: crypto.randomUUID(),
            name: name.trim(),
            pin,
            email: `${name.toLowerCase().replace(/\s+/g, '.')}@local.user`,
            createdAt: new Date().toISOString()
        };

        const updatedUsers = [...users, newUser];
        localStorage.setItem("dompetku-users", JSON.stringify(updatedUsers));

        // Auto login
        loginUser(newUser);
        return { success: true };
    };

    const login = (name: string, pin: string): { success: boolean; message?: string } => {
        const users = getUsers();
        const found = users.find(u => u.name.toLowerCase() === name.toLowerCase() && u.pin === pin);

        if (found) {
            loginUser(found);
            return { success: true };
        }
        return { success: false, message: "Nama atau PIN salah" };
    };

    const loginUser = (userData: User) => {
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem("dompetku-current-session", JSON.stringify(userData));
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("dompetku-current-session");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, isLoading }}>
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
