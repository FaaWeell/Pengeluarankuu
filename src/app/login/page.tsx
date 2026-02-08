"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Loader2, AlertCircle, Lock, User } from "lucide-react";
import { useAuth } from "@/context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

        await new Promise((resolve) => setTimeout(resolve, 500));

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
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-sm border-border/50">
                <CardHeader className="text-center pb-4">
                    <Link href="/" className="inline-flex items-center gap-2 justify-center mb-3">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Wallet className="w-4 h-4 text-primary-foreground" />
                        </div>
                    </Link>
                    <CardTitle className="text-xl">DompetKu</CardTitle>
                    <CardDescription className="text-sm">
                        Kelola keuanganmu dengan aman
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="login">Masuk</TabsTrigger>
                            <TabsTrigger value="register">Daftar</TabsTrigger>
                        </TabsList>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm flex items-center gap-2">
                                    <User className="w-3.5 h-3.5" /> Nama Lengkap
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Masukkan nama anda"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-9"
                                    style={{ textIndent: "0px" }} // clean style
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pin" className="text-sm flex items-center gap-2">
                                    <Lock className="w-3.5 h-3.5" /> PIN (6 Angka)
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="pin"
                                        type="password"
                                        inputMode="numeric"
                                        maxLength={6}
                                        placeholder="******"
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                                        className="font-mono tracking-widest text-center"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    activeTab === "login" ? "Masuk" : "Buat Akun"
                                )}
                            </Button>
                        </form>
                    </Tabs>

                    <div className="text-center text-sm mt-6">
                        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                            ← Kembali ke Beranda
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
