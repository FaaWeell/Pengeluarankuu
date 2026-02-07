"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useLocalStorage } from "@/hooks";
import {
    Plus,
    Edit2,
    Trash2,
    X,
    Target,
    Loader2,
    Car,
    Home,
    Plane,
    GraduationCap,
    Smartphone,
    Gift,
    PiggyBank,
    TrendingUp,
    Calendar,
    Sparkles,
} from "lucide-react";

interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    icon: string;
    color: string;
}

// Start with empty goals
const emptyGoals: Goal[] = [];

const iconMap: Record<string, React.ReactNode> = {
    car: <Car className="w-6 h-6" />,
    home: <Home className="w-6 h-6" />,
    plane: <Plane className="w-6 h-6" />,
    graduation: <GraduationCap className="w-6 h-6" />,
    smartphone: <Smartphone className="w-6 h-6" />,
    gift: <Gift className="w-6 h-6" />,
    "piggy-bank": <PiggyBank className="w-6 h-6" />,
    target: <Target className="w-6 h-6" />,
};

const colorOptions = [
    "#10b981", "#3b82f6", "#a855f7", "#f97316", "#ec4899", "#eab308", "#ef4444", "#14b8a6"
];

export default function GoalsPage() {
    const [goals, setGoals, isLoaded] = useLocalStorage<Goal[]>("dompetku-goals", emptyGoals);
    const [showModal, setShowModal] = React.useState(false);
    const [showAddFundsModal, setShowAddFundsModal] = React.useState(false);
    const [selectedGoalId, setSelectedGoalId] = React.useState<string | null>(null);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [formName, setFormName] = React.useState("");
    const [formTarget, setFormTarget] = React.useState("");
    const [formDeadline, setFormDeadline] = React.useState("");
    const [formIcon, setFormIcon] = React.useState("target");
    const [formColor, setFormColor] = React.useState("#10b981");
    const [addAmount, setAddAmount] = React.useState("");

    // Calculate totals
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const completedGoals = goals.filter((g) => g.currentAmount >= g.targetAmount).length;

    const resetForm = () => {
        setFormName("");
        setFormTarget("");
        setFormDeadline("");
        setFormIcon("target");
        setFormColor("#10b981");
        setEditingId(null);
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (goal: Goal) => {
        setEditingId(goal.id);
        setFormName(goal.name);
        setFormTarget(goal.targetAmount.toString());
        setFormDeadline(goal.deadline);
        setFormIcon(goal.icon);
        setFormColor(goal.color);
        setShowModal(true);
    };

    const openAddFunds = (goalId: string) => {
        setSelectedGoalId(goalId);
        setAddAmount("");
        setShowAddFundsModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName || !formTarget || !formDeadline) return;

        if (editingId) {
            setGoals((prev) =>
                prev.map((g) =>
                    g.id === editingId
                        ? {
                            ...g,
                            name: formName,
                            targetAmount: parseFloat(formTarget),
                            deadline: formDeadline,
                            icon: formIcon,
                            color: formColor,
                        }
                        : g
                )
            );
        } else {
            const newGoal: Goal = {
                id: crypto.randomUUID(),
                name: formName,
                targetAmount: parseFloat(formTarget),
                currentAmount: 0,
                deadline: formDeadline,
                icon: formIcon,
                color: formColor,
            };
            setGoals((prev) => [...prev, newGoal]);
        }

        setShowModal(false);
        resetForm();
    };

    const handleAddFunds = (e: React.FormEvent) => {
        e.preventDefault();
        if (!addAmount || !selectedGoalId) return;

        setGoals((prev) =>
            prev.map((g) =>
                g.id === selectedGoalId
                    ? { ...g, currentAmount: g.currentAmount + parseFloat(addAmount) }
                    : g
            )
        );

        setShowAddFundsModal(false);
        setSelectedGoalId(null);
        setAddAmount("");
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Yakin ingin menghapus target ini?")) {
            setGoals((prev) => prev.filter((g) => g.id !== id));
        }
    };

    const getDaysRemaining = (deadline: string) => {
        const deadlineDate = new Date(deadline);
        const now = new Date();
        return Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
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
                    <h1 className="text-2xl font-bold">Target Keuangan</h1>
                    <p className="text-muted-foreground">Capai impian finansialmu</p>
                </div>
                <Button
                    onClick={openAddModal}
                    className="gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Target
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Target className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Target</p>
                                <p className="text-xl font-bold">{formatCurrency(totalTarget)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <PiggyBank className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Terkumpul</p>
                                <p className="text-xl font-bold text-green-600">{formatCurrency(totalSaved)}</p>
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
                                <p className="text-sm text-muted-foreground">Progress</p>
                                <p className="text-xl font-bold text-orange-600">
                                    {Math.round((totalSaved / totalTarget) * 100)}%
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tercapai</p>
                                <p className="text-xl font-bold text-purple-600">{completedGoals} dari {goals.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goals.map((goal) => {
                    const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
                    const isCompleted = percentage >= 100;
                    const daysRemaining = getDaysRemaining(goal.deadline);
                    const isUrgent = daysRemaining <= 30 && daysRemaining > 0 && !isCompleted;
                    const isOverdue = daysRemaining < 0 && !isCompleted;

                    return (
                        <Card key={goal.id} className="group overflow-hidden">
                            <div className="h-2" style={{ backgroundColor: goal.color }}></div>
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                            style={{ backgroundColor: `${goal.color}20`, color: goal.color }}
                                        >
                                            {iconMap[goal.icon] || <Target className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-lg">{goal.name}</h3>
                                                {isCompleted && (
                                                    <Badge variant="success" className="text-xs">
                                                        <Sparkles className="w-3 h-3 mr-1" />
                                                        Tercapai!
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="w-4 h-4" />
                                                {isCompleted ? (
                                                    <span className="text-green-600">Target tercapai!</span>
                                                ) : isOverdue ? (
                                                    <span className="text-red-600">Deadline lewat</span>
                                                ) : isUrgent ? (
                                                    <span className="text-orange-600">{daysRemaining} hari lagi</span>
                                                ) : (
                                                    <span>{daysRemaining} hari lagi</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEditModal(goal)}>
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-8 h-8 text-destructive"
                                            onClick={() => handleDelete(goal.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-2xl font-bold" style={{ color: goal.color }}>
                                                {formatCurrency(goal.currentAmount)}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                dari {formatCurrency(goal.targetAmount)}
                                            </p>
                                        </div>
                                        <p className="text-lg font-semibold">{percentage}%</p>
                                    </div>
                                    <Progress
                                        value={Math.min(percentage, 100)}
                                        className="h-3"
                                        indicatorClassName={isCompleted ? "bg-green-500" : ""}
                                        style={{ "--progress-color": goal.color } as React.CSSProperties}
                                    />
                                    {!isCompleted && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full mt-2"
                                            onClick={() => openAddFunds(goal.id)}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Tambah Dana
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Add/Edit Goal Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{editingId ? "Edit Target" : "Tambah Target"}</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label>Nama Target</Label>
                                    <Input
                                        placeholder="Contoh: Dana Darurat"
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Target Dana (Rp)</Label>
                                    <Input
                                        type="number"
                                        placeholder="50000000"
                                        value={formTarget}
                                        onChange={(e) => setFormTarget(e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Deadline</Label>
                                    <Input
                                        type="date"
                                        value={formDeadline}
                                        onChange={(e) => setFormDeadline(e.target.value)}
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
                                <div>
                                    <Label>Warna</Label>
                                    <div className="grid grid-cols-8 gap-2 mt-2">
                                        {colorOptions.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setFormColor(color)}
                                                className={`w-8 h-8 rounded-full border-2 transition-transform ${formColor === color ? "scale-110 border-foreground" : "border-transparent"
                                                    }`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500">
                                    {editingId ? "Simpan Perubahan" : "Tambah Target"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Add Funds Modal */}
            {showAddFundsModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-sm mx-4">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Tambah Dana</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setShowAddFundsModal(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddFunds} className="space-y-4">
                                <div>
                                    <Label>Jumlah Dana (Rp)</Label>
                                    <Input
                                        type="number"
                                        placeholder="1000000"
                                        value={addAmount}
                                        onChange={(e) => setAddAmount(e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500">
                                    Tambah
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
