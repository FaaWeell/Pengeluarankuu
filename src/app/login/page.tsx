"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context";

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated, isLoading: authLoading } = useAuth();

    const [isLoading, setIsLoading] = React.useState(false);
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 400));

        const success = login(name);

        if (success) {
            router.push("/dashboard");
        } else {
            setError("Nama tidak boleh kosong");
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
                    <CardTitle className="text-xl">Masuk</CardTitle>
                    <CardDescription className="text-sm">
                        Masukkan nama untuk melanjutkan
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 flex items-center gap-2 text-red-600 dark:text-red-400">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm">Nama Lengkap</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Masukkan nama anda"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Masuk / Buat Akun"
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm mt-6">
                        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                            ← Kembali
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
