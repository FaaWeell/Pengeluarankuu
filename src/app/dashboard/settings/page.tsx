"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/context";
import { useLocalStorage } from "@/hooks";
import {
    Settings,
    User,
    Moon,
    Sun,
    Monitor,
    Download,
    Trash2,
    Bell,
    Shield,
    Palette,
    HelpCircle,
    LogOut,
    Check,
    Loader2,
    FileJson,
    FileSpreadsheet,
    AlertTriangle,
} from "lucide-react";

interface UserProfile {
    name: string;
    email: string;
    currency: string;
    language: string;
}

const defaultProfile: UserProfile = {
    name: "Fajar",
    email: "fajar@example.com",
    currency: "IDR",
    language: "id",
};

import { useAuth } from "@/context";

export default function SettingsPage() {
    const { user } = useAuth();
    const { theme, setTheme, resolvedTheme } = useTheme();

    // Create keys based on username
    const userKey = user?.name ? user.name.toLowerCase().replace(/\s+/g, '-') : 'guest';

    // Initialize profile with auth user data if available
    const initialProfile = {
        ...defaultProfile,
        name: user?.name || defaultProfile.name,
        email: user?.email || defaultProfile.email
    };

    const [profile, setProfile, isLoaded] = useLocalStorage<UserProfile>(
        `dompetku-profile-${userKey}`,
        initialProfile
    );
    const [activeSection, setActiveSection] = React.useState("profile");
    const [isSaving, setIsSaving] = React.useState(false);
    const [showSuccess, setShowSuccess] = React.useState(false);
    const [isExporting, setIsExporting] = React.useState(false);

    const handleProfileSave = async () => {
        setIsSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsSaving(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    const handleExport = async (format: "json" | "csv") => {
        setIsExporting(true);

        // Get all data from localStorage
        // Get all data from localStorage
        const transactions = JSON.parse(localStorage.getItem(`dompetku-transactions-${userKey}`) || "[]");
        const budgets = JSON.parse(localStorage.getItem(`dompetku-budgets-${userKey}`) || "[]");
        const subscriptions = JSON.parse(localStorage.getItem(`dompetku-subscriptions-${userKey}`) || "[]");
        const goals = JSON.parse(localStorage.getItem(`dompetku-goals-${userKey}`) || "[]");

        const allData = {
            exportDate: new Date().toISOString(),
            profile,
            transactions,
            budgets,
            subscriptions,
            goals,
        };

        let content: string;
        let filename: string;
        let mimeType: string;

        if (format === "json") {
            content = JSON.stringify(allData, null, 2);
            filename = `dompetku-export-${new Date().toISOString().split("T")[0]}.json`;
            mimeType = "application/json";
        } else {
            // CSV format - export transactions
            const headers = ["Date", "Description", "Type", "Amount", "Category"];
            const rows = transactions.map((tx: any) => [
                tx.transaction_date,
                tx.description,
                tx.type,
                tx.amount,
                tx.category_id,
            ]);
            content = [headers, ...rows].map((row) => row.join(",")).join("\n");
            filename = `dompetku-transactions-${new Date().toISOString().split("T")[0]}.csv`;
            mimeType = "text/csv";
        }

        // Create download
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsExporting(false);
    };

    const handleClearData = () => {
        if (window.confirm("Yakin ingin menghapus SEMUA data? Aksi ini tidak dapat dibatalkan!")) {
            if (window.confirm("PERINGATAN TERAKHIR: Semua transaksi, anggaran, dan data lainnya akan hilang. Lanjutkan?")) {
                localStorage.removeItem(`dompetku-transactions-${userKey}`);
                localStorage.removeItem(`dompetku-budgets-${userKey}`);
                localStorage.removeItem(`dompetku-subscriptions-${userKey}`);
                localStorage.removeItem(`dompetku-goals-${userKey}`);
                localStorage.removeItem(`dompetku-categories-${userKey}`);
                localStorage.removeItem(`dompetku-profile-${userKey}`);
                window.location.reload();
            }
        }
    };

    const sections = [
        { id: "profile", label: "Profil", icon: User },
        { id: "appearance", label: "Tampilan", icon: Palette },
        { id: "notifications", label: "Notifikasi", icon: Bell },
        { id: "data", label: "Data", icon: Download },
        { id: "about", label: "Tentang", icon: HelpCircle },
    ];

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Settings className="w-6 h-6" />
                    Pengaturan
                </h1>
                <p className="text-muted-foreground">Kelola preferensi aplikasi kamu</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <Card className="lg:col-span-1 h-fit">
                    <CardContent className="p-2">
                        <nav className="space-y-1">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeSection === section.id
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted"
                                        }`}
                                >
                                    <section.icon className="w-4 h-4" />
                                    {section.label}
                                </button>
                            ))}
                        </nav>
                    </CardContent>
                </Card>

                {/* Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Profile Section */}
                    {activeSection === "profile" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Profil Pengguna</CardTitle>
                                <CardDescription>Kelola informasi akun kamu</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                                        {profile.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{profile.name}</h3>
                                        <p className="text-muted-foreground">{profile.email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                    <div>
                                        <Label>Nama</Label>
                                        <Input
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label>Email</Label>
                                        <Input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label>Mata Uang</Label>
                                        <select
                                            className="mt-1 w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                                            value={profile.currency}
                                            onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                                        >
                                            <option value="IDR">IDR - Rupiah Indonesia</option>
                                            <option value="USD">USD - US Dollar</option>
                                            <option value="EUR">EUR - Euro</option>
                                            <option value="SGD">SGD - Singapore Dollar</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label>Bahasa</Label>
                                        <select
                                            className="mt-1 w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                                            value={profile.language}
                                            onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                                        >
                                            <option value="id">Bahasa Indonesia</option>
                                            <option value="en">English</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-4">
                                    <Button onClick={handleProfileSave} disabled={isSaving}>
                                        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        {showSuccess && <Check className="w-4 h-4 mr-2" />}
                                        {showSuccess ? "Tersimpan!" : "Simpan Perubahan"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Appearance Section */}
                    {activeSection === "appearance" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Tampilan</CardTitle>
                                <CardDescription>Sesuaikan tampilan aplikasi</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label className="text-base font-medium">Tema</Label>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Pilih tema yang nyaman untuk kamu
                                    </p>
                                    <div className="grid grid-cols-3 gap-4">
                                        <button
                                            onClick={() => setTheme("light")}
                                            className={`p-4 rounded-xl border-2 transition-all ${theme === "light"
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                                }`}
                                        >
                                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
                                                <Sun className="w-6 h-6 text-amber-600" />
                                            </div>
                                            <p className="font-medium">Terang</p>
                                            {theme === "light" && (
                                                <Badge variant="success" className="mt-2">Aktif</Badge>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => setTheme("dark")}
                                            className={`p-4 rounded-xl border-2 transition-all ${theme === "dark"
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                                }`}
                                        >
                                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-2">
                                                <Moon className="w-6 h-6 text-slate-200" />
                                            </div>
                                            <p className="font-medium">Gelap</p>
                                            {theme === "dark" && (
                                                <Badge variant="success" className="mt-2">Aktif</Badge>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => setTheme("system")}
                                            className={`p-4 rounded-xl border-2 transition-all ${theme === "system"
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                                }`}
                                        >
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-slate-800 flex items-center justify-center mx-auto mb-2">
                                                <Monitor className="w-6 h-6 text-slate-600" />
                                            </div>
                                            <p className="font-medium">Sistem</p>
                                            {theme === "system" && (
                                                <Badge variant="success" className="mt-2">Aktif</Badge>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Notifications Section */}
                    {activeSection === "notifications" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Notifikasi</CardTitle>
                                <CardDescription>Kelola notifikasi dan pengingat</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div>
                                        <p className="font-medium">Pengingat Tagihan</p>
                                        <p className="text-sm text-muted-foreground">
                                            Ingatkan H-3 sebelum jatuh tempo
                                        </p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div>
                                        <p className="font-medium">Peringatan Anggaran</p>
                                        <p className="text-sm text-muted-foreground">
                                            Notifikasi saat anggaran mencapai 80%
                                        </p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div>
                                        <p className="font-medium">Laporan Mingguan</p>
                                        <p className="text-sm text-muted-foreground">
                                            Kirim ringkasan setiap minggu
                                        </p>
                                    </div>
                                    <input type="checkbox" className="w-5 h-5 accent-primary" />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Data Section */}
                    {activeSection === "data" && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Export Data</CardTitle>
                                    <CardDescription>Download semua data kamu</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Button
                                            variant="outline"
                                            className="h-auto py-4 flex flex-col items-center gap-2"
                                            onClick={() => handleExport("json")}
                                            disabled={isExporting}
                                        >
                                            {isExporting ? (
                                                <Loader2 className="w-8 h-8 animate-spin" />
                                            ) : (
                                                <FileJson className="w-8 h-8 text-blue-600" />
                                            )}
                                            <div>
                                                <p className="font-medium">Export JSON</p>
                                                <p className="text-xs text-muted-foreground">Semua data lengkap</p>
                                            </div>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-auto py-4 flex flex-col items-center gap-2"
                                            onClick={() => handleExport("csv")}
                                            disabled={isExporting}
                                        >
                                            {isExporting ? (
                                                <Loader2 className="w-8 h-8 animate-spin" />
                                            ) : (
                                                <FileSpreadsheet className="w-8 h-8 text-green-600" />
                                            )}
                                            <div>
                                                <p className="font-medium">Export CSV</p>
                                                <p className="text-xs text-muted-foreground">Transaksi saja</p>
                                            </div>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-destructive/50">
                                <CardHeader>
                                    <CardTitle className="text-destructive flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" />
                                        Zona Berbahaya
                                    </CardTitle>
                                    <CardDescription>Aksi yang tidak dapat dibatalkan</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="destructive" onClick={handleClearData}>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Hapus Semua Data
                                    </Button>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* About Section */}
                    {activeSection === "about" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Tentang DompetKu</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white">
                                        <Shield className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl">DompetKu</h3>
                                        <p className="text-muted-foreground">Versi 1.0.0</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground">
                                    DompetKu adalah aplikasi pengelolaan keuangan pribadi yang membantu kamu
                                    mencatat transaksi, mengatur anggaran, dan mencapai target keuanganmu.
                                </p>
                                <div className="pt-4 border-t space-y-2">
                                    <p className="text-sm">
                                        <span className="text-muted-foreground">Dibuat dengan</span>{" "}
                                        <span className="font-medium">Next.js, Tailwind CSS, dan Recharts</span>
                                    </p>
                                    <p className="text-sm">
                                        <span className="text-muted-foreground">Data disimpan</span>{" "}
                                        <span className="font-medium">Lokal di browser (localStorage)</span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
