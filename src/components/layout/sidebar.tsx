"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Receipt,
    PieChart,
    RefreshCw,
    Target,
    Settings,
    Menu,
    X,
    Wallet,
} from "lucide-react";

interface NavItem {
    title: string;
    href: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
        title: "Transaksi",
        href: "/dashboard/transactions",
        icon: <Receipt className="w-5 h-5" />,
    },
    {
        title: "Anggaran",
        href: "/dashboard/budgets",
        icon: <PieChart className="w-5 h-5" />,
    },
    {
        title: "Langganan",
        href: "/dashboard/subscriptions",
        icon: <RefreshCw className="w-5 h-5" />,
    },
    {
        title: "Target",
        href: "/dashboard/goals",
        icon: <Target className="w-5 h-5" />,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = React.useState(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);

    // Close mobile menu on route change
    React.useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border shadow-sm lg:hidden"
                aria-label="Open menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
                    // Desktop
                    "hidden lg:block",
                    collapsed ? "lg:w-16" : "lg:w-64",
                    // Mobile
                    mobileOpen && "block w-64"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                                <Wallet className="w-4 h-4 text-white" />
                            </div>
                            {(!collapsed || mobileOpen) && (
                                <span className="font-bold text-lg text-sidebar-foreground">
                                    DompetKu
                                </span>
                            )}
                        </Link>

                        {/* Close button for mobile */}
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground lg:hidden"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Collapse button for desktop */}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground hidden lg:block"
                        >
                            {collapsed ? (
                                <Menu className="w-5 h-5" />
                            ) : (
                                <X className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive =
                                pathname === item.href ||
                                (item.href !== "/dashboard" && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                                        isActive
                                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                            : "text-sidebar-foreground hover:bg-sidebar-accent"
                                    )}
                                >
                                    {item.icon}
                                    {(!collapsed || mobileOpen) && <span>{item.title}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Settings */}
                    <div className="p-2 border-t border-sidebar-border">
                        <Link
                            href="/dashboard/settings"
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                                pathname === "/dashboard/settings"
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                            )}
                        >
                            <Settings className="w-5 h-5" />
                            {(!collapsed || mobileOpen) && <span>Pengaturan</span>}
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}
