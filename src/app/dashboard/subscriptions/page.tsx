"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useLocalStorage } from "@/hooks";
import {
    Plus,
    Edit2,
    Trash2,
    X,
    RefreshCw,
    Loader2,
    Film,
    Music,
    Wifi,
    Dumbbell,
    Cloud,
    Newspaper,
    Gamepad2,
    CreditCard,
    Calendar,
    DollarSign,
    AlertCircle,
} from "lucide-react";

interface Subscription {
    id: string;
    name: string;
    amount: number;
    billingCycle: "monthly" | "yearly";
    nextBillingDate: string;
    icon: string;
    category: string;
    isActive: boolean;
}

// Start with empty subscriptions
const emptySubscriptions: Subscription[] = [];

const iconMap: Record<string, React.ReactNode> = {
    film: <Film className="w-5 h-5" />,
    music: <Music className="w-5 h-5" />,
    wifi: <Wifi className="w-5 h-5" />,
    dumbbell: <Dumbbell className="w-5 h-5" />,
    cloud: <Cloud className="w-5 h-5" />,
    newspaper: <Newspaper className="w-5 h-5" />,
    gamepad: <Gamepad2 className="w-5 h-5" />,
};

const categories = ["Streaming", "Music", "Internet", "Fitness", "Storage", "News", "Gaming"];

import { useAuth } from "@/context";

export default function SubscriptionsPage() {
    const { user } = useAuth();
    const userKey = user?.name ? user.name.toLowerCase().replace(/\s+/g, '-') : 'guest';

    const [subscriptions, setSubscriptions, isLoaded] = useLocalStorage<Subscription[]>(
        `dompetku-subscriptions-${userKey}`,
        emptySubscriptions
    );
    const [showModal, setShowModal] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [formName, setFormName] = React.useState("");
    const [formAmount, setFormAmount] = React.useState("");
    const [formCycle, setFormCycle] = React.useState<"monthly" | "yearly">("monthly");
    const [formDate, setFormDate] = React.useState("");
    const [formIcon, setFormIcon] = React.useState("film");
    const [formCategory, setFormCategory] = React.useState("Streaming");

    // Calculate totals
    const activeSubscriptions = subscriptions.filter((s) => s.isActive);
    const monthlyTotal = activeSubscriptions.reduce((sum, s) => {
        return s.billingCycle === "monthly" ? sum + s.amount : sum + s.amount / 12;
    }, 0);
    const yearlyTotal = monthlyTotal * 12;

    // Upcoming payments (within 7 days)
    const upcomingPayments = activeSubscriptions.filter((s) => {
        const nextDate = new Date(s.nextBillingDate);
        const now = new Date();
        const diffDays = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
    });

    const resetForm = () => {
        setFormName("");
        setFormAmount("");
        setFormCycle("monthly");
        setFormDate("");
        setFormIcon("film");
        setFormCategory("Streaming");
        setEditingId(null);
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (sub: Subscription) => {
        setEditingId(sub.id);
        setFormName(sub.name);
        setFormAmount(sub.amount.toString());
        setFormCycle(sub.billingCycle);
        setFormDate(sub.nextBillingDate);
        setFormIcon(sub.icon);
        setFormCategory(sub.category);
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName || !formAmount || !formDate) return;

        if (editingId) {
            setSubscriptions((prev) =>
                prev.map((s) =>
                    s.id === editingId
                        ? {
                            ...s,
                            name: formName,
                            amount: parseFloat(formAmount),
                            billingCycle: formCycle,
                            nextBillingDate: formDate,
                            icon: formIcon,
                            category: formCategory,
                        }
                        : s
                )
            );
        } else {
            const newSub: Subscription = {
                id: crypto.randomUUID(),
                name: formName,
                amount: parseFloat(formAmount),
                billingCycle: formCycle,
                nextBillingDate: formDate,
                icon: formIcon,
                category: formCategory,
                isActive: true,
            };
            setSubscriptions((prev) => [...prev, newSub]);
        }

        setShowModal(false);
        resetForm();
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Yakin ingin menghapus langganan ini?")) {
            setSubscriptions((prev) => prev.filter((s) => s.id !== id));
        }
    };

    const toggleActive = (id: string) => {
        setSubscriptions((prev) =>
            prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
        );
    };

    const getDaysUntil = (date: string) => {
        const nextDate = new Date(date);
        const now = new Date();
        return Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    };

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Langganan</h1>
                    <p className="text-muted-foreground">Kelola semua subscription kamu</p>
                </div>
                <Button
                    onClick={openAddModal}
                    className="gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Langganan
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <RefreshCw className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Aktif</p>
                                <p className="text-xl font-bold">{activeSubscriptions.length} langganan</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Per Bulan</p>
                                <p className="text-xl font-bold text-orange-600">{formatCurrency(monthlyTotal)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Per Tahun</p>
                                <p className="text-xl font-bold text-purple-600">{formatCurrency(yearlyTotal)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Segera Jatuh Tempo</p>
                                <p className="text-xl font-bold text-red-600">{upcomingPayments.length} dalam 7 hari</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Subscription List */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Langganan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {subscriptions.map((sub) => {
                            const daysUntil = getDaysUntil(sub.nextBillingDate);
                            const isUrgent = daysUntil <= 3 && daysUntil >= 0;
                            const isPast = daysUntil < 0;

                            return (
                                <div
                                    key={sub.id}
                                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors group ${!sub.isActive ? "opacity-50" : ""
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                                            {iconMap[sub.icon] || <CreditCard className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">{sub.name}</h3>
                                                <Badge variant="secondary" className="text-xs">
                                                    {sub.category}
                                                </Badge>
                                                {!sub.isActive && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Nonaktif
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {sub.billingCycle === "monthly" ? "Bulanan" : "Tahunan"} - Jatuh tempo{" "}
                                                {formatDate(sub.nextBillingDate)}
                                            </p>
                                            {isUrgent && (
                                                <p className="text-xs text-orange-600 font-medium">
                                                    {daysUntil === 0 ? "Jatuh tempo hari ini!" : `${daysUntil} hari lagi`}
                                                </p>
                                            )}
                                            {isPast && (
                                                <p className="text-xs text-red-600 font-medium">Sudah lewat jatuh tempo</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold">{formatCurrency(sub.amount)}</span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="w-8 h-8"
                                                onClick={() => toggleActive(sub.id)}
                                            >
                                                <RefreshCw className={`w-4 h-4 ${sub.isActive ? "" : "text-green-600"}`} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="w-8 h-8"
                                                onClick={() => openEditModal(sub)}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="w-8 h-8 text-destructive"
                                                onClick={() => handleDelete(sub.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{editingId ? "Edit Langganan" : "Tambah Langganan"}</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label>Nama Langganan</Label>
                                    <Input
                                        placeholder="Contoh: Netflix"
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Jumlah (Rp)</Label>
                                    <Input
                                        type="number"
                                        placeholder="54990"
                                        value={formAmount}
                                        onChange={(e) => setFormAmount(e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Siklus Pembayaran</Label>
                                    <div className="flex gap-2 mt-2">
                                        <Button
                                            type="button"
                                            variant={formCycle === "monthly" ? "default" : "outline"}
                                            className="flex-1"
                                            onClick={() => setFormCycle("monthly")}
                                        >
                                            Bulanan
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={formCycle === "yearly" ? "default" : "outline"}
                                            className="flex-1"
                                            onClick={() => setFormCycle("yearly")}
                                        >
                                            Tahunan
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <Label>Tanggal Jatuh Tempo Berikutnya</Label>
                                    <Input
                                        type="date"
                                        value={formDate}
                                        onChange={(e) => setFormDate(e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Kategori</Label>
                                    <select
                                        className="mt-1 w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                                        value={formCategory}
                                        onChange={(e) => setFormCategory(e.target.value)}
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label>Icon</Label>
                                    <div className="grid grid-cols-4 gap-2 mt-2">
                                        {Object.keys(iconMap).map((icon) => (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() => setFormIcon(icon)}
                                                className={`p-3 rounded-lg border transition-colors ${formIcon === icon
                                                    ? "border-primary bg-primary/10"
                                                    : "border-border hover:bg-muted"
                                                    }`}
                                            >
                                                {iconMap[icon]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500">
                                    {editingId ? "Simpan Perubahan" : "Tambah Langganan"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
