"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { useLocalStorage } from "@/hooks";
import {
    Plus,
    Edit2,
    Trash2,
    X,
    PieChart,
    Loader2,
    Utensils,
    Car,
    Film,
    ShoppingCart,
    Zap,
    Coffee,
    Home,
    Heart,
    CreditCard,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
} from "lucide-react";

interface Budget {
    id: string;
    name: string;
    limit: number;
    spent: number;
    icon: string;
    color: string;
}

// Start with empty budgets
const emptyBudgets: Budget[] = [];

const iconMap: Record<string, React.ReactNode> = {
    utensils: <Utensils className="w-5 h-5" />,
    car: <Car className="w-5 h-5" />,
    film: <Film className="w-5 h-5" />,
    "shopping-cart": <ShoppingCart className="w-5 h-5" />,
    zap: <Zap className="w-5 h-5" />,
    coffee: <Coffee className="w-5 h-5" />,
    home: <Home className="w-5 h-5" />,
    heart: <Heart className="w-5 h-5" />,
};

export default function BudgetsPage() {
    const [budgets, setBudgets, isLoaded] = useLocalStorage<Budget[]>("dompetku-budgets", emptyBudgets);
    const [showModal, setShowModal] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [formName, setFormName] = React.useState("");
    const [formLimit, setFormLimit] = React.useState("");
    const [formIcon, setFormIcon] = React.useState("utensils");

    // Calculate totals
    const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const overBudgetCount = budgets.filter((b) => b.spent >= b.limit).length;
    const warningCount = budgets.filter((b) => b.spent >= b.limit * 0.8 && b.spent < b.limit).length;

    const resetForm = () => {
        setFormName("");
        setFormLimit("");
        setFormIcon("utensils");
        setEditingId(null);
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (budget: Budget) => {
        setEditingId(budget.id);
        setFormName(budget.name);
        setFormLimit(budget.limit.toString());
        setFormIcon(budget.icon);
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName || !formLimit) return;

        if (editingId) {
            setBudgets((prev) =>
                prev.map((b) =>
                    b.id === editingId
                        ? { ...b, name: formName, limit: parseFloat(formLimit), icon: formIcon }
                        : b
                )
            );
        } else {
            const newBudget: Budget = {
                id: crypto.randomUUID(),
                name: formName,
                limit: parseFloat(formLimit),
                spent: 0,
                icon: formIcon,
                color: "#10b981",
            };
            setBudgets((prev) => [...prev, newBudget]);
        }

        setShowModal(false);
        resetForm();
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Yakin ingin menghapus anggaran ini?")) {
            setBudgets((prev) => prev.filter((b) => b.id !== id));
        }
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
                    <h1 className="text-2xl font-bold">Anggaran</h1>
                    <p className="text-muted-foreground">Kelola anggaran bulanan kamu</p>
                </div>
                <Button
                    onClick={openAddModal}
                    className="gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Anggaran
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <PieChart className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Anggaran</p>
                                <p className="text-xl font-bold">{formatCurrency(totalBudget)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Terpakai</p>
                                <p className="text-xl font-bold text-orange-600">{formatCurrency(totalSpent)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Melebihi Batas</p>
                                <p className="text-xl font-bold text-red-600">{overBudgetCount} kategori</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Sisa</p>
                                <p className="text-xl font-bold text-green-600">{formatCurrency(totalBudget - totalSpent)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Budget List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgets.map((budget) => {
                    const percentage = Math.round((budget.spent / budget.limit) * 100);
                    const isOver = percentage >= 100;
                    const isWarning = percentage >= 80 && !isOver;

                    return (
                        <Card key={budget.id} className="group">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                                            style={{ backgroundColor: `${budget.color}20`, color: budget.color }}
                                        >
                                            {iconMap[budget.icon] || <CreditCard className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{budget.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {formatCurrency(budget.spent)} dari {formatCurrency(budget.limit)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEditModal(budget)}>
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-8 h-8 text-destructive"
                                            onClick={() => handleDelete(budget.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className={isOver ? "text-red-600 font-medium" : isWarning ? "text-orange-600" : ""}>
                                            {percentage}% terpakai
                                        </span>
                                        <span className={isOver ? "text-red-600" : "text-muted-foreground"}>
                                            Sisa: {formatCurrency(Math.max(0, budget.limit - budget.spent))}
                                        </span>
                                    </div>
                                    <Progress
                                        value={Math.min(percentage, 100)}
                                        className="h-3"
                                        indicatorClassName={isOver ? "bg-red-500" : isWarning ? "bg-orange-500" : "bg-emerald-500"}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{editingId ? "Edit Anggaran" : "Tambah Anggaran"}</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label>Nama Kategori</Label>
                                    <Input
                                        placeholder="Contoh: Makanan"
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Batas Anggaran (Rp)</Label>
                                    <Input
                                        type="number"
                                        placeholder="2000000"
                                        value={formLimit}
                                        onChange={(e) => setFormLimit(e.target.value)}
                                        className="mt-1"
                                        required
                                    />
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
                                    {editingId ? "Simpan Perubahan" : "Tambah Anggaran"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
