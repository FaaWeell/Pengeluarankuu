"use client";

import { Avatar } from "@/components/ui/avatar";
import { getCurrentMonthName } from "@/lib/utils";
import { Moon, Sun, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context";

export function Navbar() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);
    const currentMonth = getCurrentMonthName();
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("dompetku-theme");
        if (stored === "dark") {
            setIsDark(true);
        } else if (stored === "system") {
            setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
        } else {
            setIsDark(document.documentElement.classList.contains("dark"));
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = isDark ? "light" : "dark";
        setIsDark(!isDark);
        localStorage.setItem("dompetku-theme", newTheme);

        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(newTheme);
    };

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const username = user?.email?.split("@")[0] || "User";

    return (
        <header className="fixed top-0 right-0 left-0 lg:left-64 h-14 border-b border-border bg-card/95 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 z-30">
            {/* Spacer for mobile hamburger */}
            <div className="w-10 lg:hidden" />

            <div className="flex-1 lg:flex-none">
                <h2 className="font-medium text-sm">
                    {currentMonth} {currentYear}
                </h2>
                <p className="text-xs text-muted-foreground hidden sm:block">
                    Halo, {username}
                </p>
            </div>

            <div className="flex items-center gap-2">
                {mounted && (
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                )}

                <Link href="/dashboard/settings">
                    <Avatar
                        fallback={username.slice(0, 2).toUpperCase()}
                        className="w-7 h-7 cursor-pointer text-xs"
                    />
                </Link>

                <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Logout"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </header>
    );
}
