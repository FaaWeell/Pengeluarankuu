"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getCurrentMonthName } from "@/lib/utils";
import { Plus, Moon, Sun, Bell, LogOut } from "lucide-react";
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

    return (
        <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 border-b bg-card flex items-center justify-between px-4 lg:px-6 z-30">
            {/* Spacer for mobile hamburger */}
            <div className="w-10 lg:hidden" />

            <div className="flex-1 lg:flex-none">
                <h2 className="font-semibold text-lg">
                    {currentMonth} {currentYear}
                </h2>
                <p className="text-sm text-muted-foreground hidden sm:block">
                    Halo, {user?.email?.split("@")[0] || "User"}! 👋
                </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                <Link href="/dashboard/transactions">
                    <Button size="sm" className="gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Tambah</span>
                    </Button>
                </Link>

                {mounted && (
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Toggle theme"
                    >
                        {isDark ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </button>
                )}

                <button className="relative p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <Link href="/dashboard/settings">
                    <Avatar fallback="FJ" className="w-8 h-8 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all" />
                </Link>

                <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-600 transition-colors"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
