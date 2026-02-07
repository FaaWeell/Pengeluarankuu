"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useTransactions } from "@/hooks";
import {
    Plus,
    Search,
    ArrowUpRight,
    ArrowDownRight,
    Edit2,
    Trash2,
    X,
    Briefcase,
    Utensils,
    Car,
    Film,
    ShoppingCart,
    Zap,
    Coffee,
    Home,
    Wifi,
    CreditCard,
    Gift,
    Receipt,
    Heart,
    Loader2,
    AlertTriangle,
} from "lucide-react";

// Icon mapping for categories
const categoryIconMap: Record<string, React.ReactNode> = {
    "briefcase": <Briefcase className="w-4 h-4" />,
    "utensils": <Utensils className="w-4 h-4" />,
    "car": <Car className="w-4 h-4" />,
    "film": <Film className="w-4 h-4" />,
    "shopping-cart": <ShoppingCart className="w-4 h-4" />,
    "zap": <Zap className="w-4 h-4" />,
    "coffee": <Coffee className="w-4 h-4" />,
    "home": <Home className="w-4 h-4" />,
    "wifi": <Wifi className="w-4 h-4" />,
    "gift": <Gift className="w-4 h-4" />,
    "heart": <Heart className="w-4 h-4" />,
};

export default function TransactionsPage() {
    const {
        transactions,
        categories,
        isLoaded,
        addTransaction,
        updateTransaction,
        deleteTransaction,
    } = useTransactions();

    const [searchQuery, setSearchQuery] = React.useState("");
    const [typeFilter, setTypeFilter] = React.useState<"all" | "income" | "expense">("all");
    const [categoryFilter, setCategoryFilter] = React.useState("Semua");
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Delete confirmation state
    const [deleteConfirm, setDeleteConfirm] = React.useState<{ show: boolean; id: string; name: string }>({
        show: false,
        id: "",
        name: "",
    });

    // Form state
    const [formType, setFormType] = React.useState<"income" | "expense">("expense");
    const [formAmount, setFormAmount] = React.useState("");
    const [formDescription, setFormDescription] = React.useState("");
    const [formCategoryId, setFormCategoryId] = React.useState("");
    const [formDate, setFormDate] = React.useState(new Date().toISOString().split("T")[0]);
    const [formTags, setFormTags] = React.useState("");

    // Filter transactions
    const filteredTransactions = React.useMemo(() => {
        return transactions.filter((tx) => {
            const matchesSearch = tx.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = typeFilter === "all" || tx.type === typeFilter;
            const matchesCategory = categoryFilter === "Semua" || tx.category?.name === categoryFilter;
            return matchesSearch && matchesType && matchesCategory;
        });
    }, [transactions, searchQuery, typeFilter, categoryFilter]);

    // Calculate totals
    const totalIncome = filteredTransactions
        .filter((tx) => tx.type === "income")
        .reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpense = filteredTransactions
        .filter((tx) => tx.type === "expense")
        .reduce((sum, tx) => sum + tx.amount, 0);
    const balance = totalIncome - totalExpense;

    // Get category names for filter
    const categoryNames = ["Semua", ...categories.map((c) => c.name)];

    // Reset form
    const resetForm = () => {
        setFormType("expense");
        setFormAmount("");
        setFormDescription("");
        setFormCategoryId("");
        setFormDate(new Date().toISOString().split("T")[0]);
        setFormTags("");
        setEditingId(null);
    };

    // Open modal for adding
    const openAddModal = () => {
        resetForm();
        setShowAddModal(true);
    };

    // Open modal for editing
    const openEditModal = (tx: typeof transactions[0]) => {
        setEditingId(tx.id);
        setFormType(tx.type);
        setFormAmount(tx.amount.toString());
        setFormDescription(tx.description || "");
        setFormCategoryId(tx.category_id);
        setFormDate(tx.transaction_date);
        setFormTags(tx.tags?.join(", ") || "");
        setShowAddModal(true);
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formAmount || !formDescription || !formCategoryId) return;

        setIsSubmitting(true);

        const transactionData = {
            amount: parseFloat(formAmount),
            type: formType,
            description: formDescription,
            category_id: formCategoryId,
            transaction_date: formDate,
            tags: formTags.split(",").map((t) => t.trim()).filter(Boolean),
            receipt_url: null,
            location: null,
            mood: null,
            is_recurring: false,
        };

        // Small delay for UX
        await new Promise((resolve) => setTimeout(resolve, 200));

        if (editingId) {
            updateTransaction(editingId, transactionData);
        } else {
            addTransaction(transactionData);
        }

        setIsSubmitting(false);
        setShowAddModal(false);
        resetForm();
    };

    // Open delete confirmation
    const openDeleteConfirm = (id: string, name: string) => {
        setDeleteConfirm({ show: true, id, name });
    };

    // Handle delete
    const handleDelete = () => {
        deleteTransaction(deleteConfirm.id);
        setDeleteConfirm({ show: false, id: "", name: "" });
    };

    // Get category icon
    const getCategoryIcon = (iconName?: string) => {
        if (!iconName) return <CreditCard className="w-4 h-4" />;
        return categoryIconMap[iconName] || <CreditCard className="w-4 h-4" />;
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
                    <h1 className="text-2xl font-bold">Transaksi</h1>
                    <p className="text-muted-foreground">Kelola semua transaksi keuangan kamu</p>
                </div>
                <Button
                    onClick={openAddModal}
                    className="gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Transaksi
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <ArrowUpRight className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Pemasukan</p>
                                <p className="text-xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <ArrowDownRight className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
                                <p className="text-xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${balance >= 0 ? "bg-emerald-100" : "bg-red-100"}`}>
                                <Receipt className={`w-5 h-5 ${balance >= 0 ? "text-emerald-600" : "text-red-600"}`} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Selisih</p>
                                <p className={`text-xl font-bold ${balance >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                                    {balance >= 0 ? "+" : ""}{formatCurrency(balance)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari transaksi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Type Filter */}
                        <div className="flex gap-2">
                            <Button
                                variant={typeFilter === "all" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setTypeFilter("all")}
                            >
                                Semua
                            </Button>
                            <Button
                                variant={typeFilter === "income" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setTypeFilter("income")}
                                className={typeFilter === "income" ? "bg-green-600 hover:bg-green-700" : ""}
                            >
                                Pemasukan
                            </Button>
                            <Button
                                variant={typeFilter === "expense" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setTypeFilter("expense")}
                                className={typeFilter === "expense" ? "bg-red-600 hover:bg-red-700" : ""}
                            >
                                Pengeluaran
                            </Button>
                        </div>
                    </div>

                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {categoryNames.slice(0, 8).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${categoryFilter === cat
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Transactions List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Daftar Transaksi</span>
                        <span className="text-sm font-normal text-muted-foreground">
                            {filteredTransactions.length} transaksi ditemukan
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredTransactions.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Belum ada transaksi</p>
                            <Button variant="link" onClick={openAddModal}>
                                Tambah transaksi pertama
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredTransactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors group border"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                                }`}
                                        >
                                            {getCategoryIcon(tx.category?.icon)}
                                        </div>
                                        <div>
                                            <p className="font-medium">{tx.description}</p>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span>{tx.category?.name || "Lainnya"}</span>
                                                <span>-</span>
                                                <span>{formatDate(tx.transaction_date)}</span>
                                            </div>
                                            {tx.tags && tx.tags.length > 0 && (
                                                <div className="flex gap-1 mt-1">
                                                    {tx.tags.map((tag) => (
                                                        <span key={tag} className="text-xs text-primary">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={`font-semibold ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}>
                                            {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                                        </span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="w-8 h-8"
                                                onClick={() => openEditModal(tx)}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="w-8 h-8 text-destructive hover:text-destructive"
                                                onClick={() => openDeleteConfirm(tx.id, tx.description || "transaksi ini")}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Transaction Modal */}
            {showAddModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
                    style={{ zIndex: 9999 }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowAddModal(false);
                    }}
                >
                    <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{editingId ? "Edit Transaksi" : "Tambah Transaksi"}</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Type Selector */}
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant={formType === "income" ? "default" : "outline"}
                                        className={`flex-1 gap-2 ${formType === "income" ? "bg-green-600 hover:bg-green-700" : "border-green-500 text-green-600 hover:bg-green-50"}`}
                                        onClick={() => setFormType("income")}
                                    >
                                        <ArrowUpRight className="w-4 h-4" />
                                        Pemasukan
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={formType === "expense" ? "default" : "outline"}
                                        className={`flex-1 gap-2 ${formType === "expense" ? "bg-red-600 hover:bg-red-700" : "border-red-500 text-red-600 hover:bg-red-50"}`}
                                        onClick={() => setFormType("expense")}
                                    >
                                        <ArrowDownRight className="w-4 h-4" />
                                        Pengeluaran
                                    </Button>
                                </div>

                                {/* Amount */}
                                <div>
                                    <Label>Jumlah (Rp)</Label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={formAmount}
                                        onChange={(e) => setFormAmount(e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <Label>Deskripsi</Label>
                                    <Input
                                        placeholder="Contoh: Makan Siang"
                                        value={formDescription}
                                        onChange={(e) => setFormDescription(e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <Label>Kategori</Label>
                                    <select
                                        className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                                        value={formCategoryId}
                                        onChange={(e) => setFormCategoryId(e.target.value)}
                                        required
                                    >
                                        <option value="">Pilih kategori</option>
                                        {categories
                                            .filter((c) => c.type === formType)
                                            .map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                {/* Date */}
                                <div>
                                    <Label>Tanggal</Label>
                                    <Input
                                        type="date"
                                        value={formDate}
                                        onChange={(e) => setFormDate(e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>

                                {/* Tags */}
                                <div>
                                    <Label>Tags (pisahkan dengan koma)</Label>
                                    <Input
                                        placeholder="makan, rutin, bulanan"
                                        value={formTags}
                                        onChange={(e) => setFormTags(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>

                                {/* Submit */}
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    {editingId ? "Simpan Perubahan" : "Tambah Transaksi"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
                    style={{ zIndex: 9999 }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setDeleteConfirm({ show: false, id: "", name: "" });
                    }}
                >
                    <Card className="w-full max-w-sm">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Hapus Transaksi?</h3>
                                <p className="text-muted-foreground text-sm mb-6">
                                    Kamu yakin ingin menghapus &quot;{deleteConfirm.name}&quot;? Tindakan ini tidak bisa dibatalkan.
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setDeleteConfirm({ show: false, id: "", name: "" })}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex-1"
                                        onClick={handleDelete}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Hapus
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
