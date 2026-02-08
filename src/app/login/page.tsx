"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Loader2, AlertCircle, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const { login, register, isAuthenticated, isLoading: authLoading } = useAuth();

    const [isLoading, setIsLoading] = React.useState(false);
    const [name, setName] = React.useState("");
    const [pin, setPin] = React.useState("");
    const [error, setError] = React.useState("");
    const [activeTab, setActiveTab] = React.useState("login");

    React.useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Basic validation
        if (!name.trim()) {
            setError("Nama tidak boleh kosong");
            setIsLoading(false);
            return;
        }
        if (pin.length !== 6 || !/^\d+$/.test(pin)) {
            setError("PIN harus 6 digit angka");
            setIsLoading(false);
            return;
        }

        await new Promise((resolve) => setTimeout(resolve, 800)); // Slightly longer for effect

        let result;
        if (activeTab === "login") {
            result = login(name, pin);
        } else {
            result = register(name, pin);
        }

        if (result.success) {
            router.push("/dashboard");
        } else {
            setError(result.message || "Terjadi kesalahan");
            setIsLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Animated Background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-blue-400/20 blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -60, 0],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-purple-400/20 blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [0, 100, 0],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-emerald-400/20 blur-[100px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="z-10 w-full max-w-sm px-4"
            >
                <Card className="border-white/20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                    {/* Decorative glowing top border */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500" />

                    <CardHeader className="text-center pb-2">
                        <Link href="/" className="inline-flex items-center gap-2 justify-center mb-4 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <Wallet className="w-5 h-5 text-white" />
                            </div>
                        </Link>
                        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                            DompetKu
                        </CardTitle>
                        <CardDescription>
                            {activeTab === "login" ? "Selamat datang kembali!" : "Mulai perjalanan finansialmu"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Tabs value={activeTab} onValueChange={(val) => { setError(""); setActiveTab(val); }} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl">
                                <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all">
                                    Masuk
                                </TabsTrigger>
                                <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all">
                                    Daftar
                                </TabsTrigger>
                            </TabsList>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm overflow-hidden"
                                            >
                                                <AlertCircle className="w-4 h-4 shrink-0" />
                                                <span>{error}</span>
                                            </motion.div>
                                        )}

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                                                    <User className="w-4 h-4 text-muted-foreground" /> Nama
                                                </Label>
                                                <Input
                                                    id="name"
                                                    placeholder="Nama Lengkap"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 ring-purple-500/20 transition-all pl-4"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="pin" className="text-sm font-medium flex items-center gap-2">
                                                    <Lock className="w-4 h-4 text-muted-foreground" /> PIN (6 Angka)
                                                </Label>
                                                <div className="relative group">
                                                    <Input
                                                        id="pin"
                                                        type="password"
                                                        inputMode="numeric"
                                                        maxLength={6}
                                                        placeholder="******"
                                                        value={pin}
                                                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                                                        className="font-mono tracking-[0.5em] text-center text-lg bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 ring-purple-500/20 transition-all"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    {activeTab === "login" ? "Masuk Sekarang" : "Buat Akun Baru"}
                                                    <ArrowRight className="w-4 h-4" />
                                                </span>
                                            )}
                                        </Button>
                                    </form>
                                </motion.div>
                            </AnimatePresence>

                            {activeTab === "register" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground"
                                >
                                    <Sparkles className="w-3 h-3 text-purple-500" />
                                    <span>Data tersimpan aman di browser kamu</span>
                                </motion.div>
                            )}

                            <div className="text-center text-sm mt-6">
                                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors inline-block hover:-translate-x-1 duration-200">
                                    ← Kembali ke Beranda
                                </Link>
                            </div>
                        </Tabs>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
