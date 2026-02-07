"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { Transaction, Category, TransactionType } from "@/lib/types";

// Default categories
const defaultCategories: Category[] = [
    { id: "1", user_id: "local", name: "Gaji", icon: "briefcase", color: "#10b981", type: "income", budget_limit: null, created_at: new Date().toISOString() },
    { id: "2", user_id: "local", name: "Freelance", icon: "briefcase", color: "#059669", type: "income", budget_limit: null, created_at: new Date().toISOString() },
    { id: "3", user_id: "local", name: "Bonus", icon: "gift", color: "#14b8a6", type: "income", budget_limit: null, created_at: new Date().toISOString() },
    { id: "4", user_id: "local", name: "Makanan", icon: "utensils", color: "#f97316", type: "expense", budget_limit: null, created_at: new Date().toISOString() },
    { id: "5", user_id: "local", name: "Transport", icon: "car", color: "#3b82f6", type: "expense", budget_limit: null, created_at: new Date().toISOString() },
    { id: "6", user_id: "local", name: "Hiburan", icon: "film", color: "#a855f7", type: "expense", budget_limit: null, created_at: new Date().toISOString() },
    { id: "7", user_id: "local", name: "Belanja", icon: "shopping-cart", color: "#ec4899", type: "expense", budget_limit: null, created_at: new Date().toISOString() },
    { id: "8", user_id: "local", name: "Utilities", icon: "zap", color: "#eab308", type: "expense", budget_limit: null, created_at: new Date().toISOString() },
    { id: "9", user_id: "local", name: "Kos", icon: "home", color: "#6366f1", type: "expense", budget_limit: null, created_at: new Date().toISOString() },
    { id: "10", user_id: "local", name: "Kesehatan", icon: "heart", color: "#ef4444", type: "expense", budget_limit: null, created_at: new Date().toISOString() },
];

// Start with empty transactions
const emptyTransactions: Transaction[] = [];

export function useTransactions() {
    const [transactions, setTransactions, isLoaded] = useLocalStorage<Transaction[]>(
        "dompetku-transactions",
        emptyTransactions
    );
    const [categories] = useLocalStorage<Category[]>("dompetku-categories", defaultCategories);

    // Add transaction
    const addTransaction = useCallback(
        (transaction: Omit<Transaction, "id" | "user_id" | "created_at">) => {
            const newTransaction: Transaction = {
                ...transaction,
                id: crypto.randomUUID(),
                user_id: "local",
                created_at: new Date().toISOString(),
            };
            setTransactions((prev) => [newTransaction, ...prev]);
            return newTransaction;
        },
        [setTransactions]
    );

    // Update transaction
    const updateTransaction = useCallback(
        (id: string, updates: Partial<Transaction>) => {
            setTransactions((prev) =>
                prev.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx))
            );
        },
        [setTransactions]
    );

    // Delete transaction
    const deleteTransaction = useCallback(
        (id: string) => {
            setTransactions((prev) => prev.filter((tx) => tx.id !== id));
        },
        [setTransactions]
    );

    // Get category by ID
    const getCategoryById = useCallback(
        (categoryId: string) => {
            return categories.find((c) => c.id === categoryId);
        },
        [categories]
    );

    // Get transactions with category data joined
    const transactionsWithCategory = useMemo(() => {
        return transactions.map((tx) => ({
            ...tx,
            category: getCategoryById(tx.category_id),
        }));
    }, [transactions, getCategoryById]);

    // Calculate stats
    const stats = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyTransactions = transactions.filter((tx) => {
            const txDate = new Date(tx.transaction_date);
            return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
        });

        const monthlyIncome = monthlyTransactions
            .filter((tx) => tx.type === "income")
            .reduce((sum, tx) => sum + tx.amount, 0);

        const monthlyExpense = monthlyTransactions
            .filter((tx) => tx.type === "expense")
            .reduce((sum, tx) => sum + tx.amount, 0);

        // Last month stats
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const lastMonthTransactions = transactions.filter((tx) => {
            const txDate = new Date(tx.transaction_date);
            return txDate.getMonth() === lastMonth && txDate.getFullYear() === lastMonthYear;
        });

        const lastMonthExpense = lastMonthTransactions
            .filter((tx) => tx.type === "expense")
            .reduce((sum, tx) => sum + tx.amount, 0);

        const totalBalance = transactions.reduce((sum, tx) => {
            return tx.type === "income" ? sum + tx.amount : sum - tx.amount;
        }, 0);

        return {
            totalBalance,
            monthlyIncome,
            monthlyExpense,
            lastMonthExpense,
            expenseChange: lastMonthExpense > 0
                ? Math.round(((monthlyExpense - lastMonthExpense) / lastMonthExpense) * 100)
                : 0,
            budgetRemaining: monthlyIncome - monthlyExpense,
        };
    }, [transactions]);

    // Category breakdown for charts
    const categoryBreakdown = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyExpenses = transactions.filter((tx) => {
            const txDate = new Date(tx.transaction_date);
            return (
                tx.type === "expense" &&
                txDate.getMonth() === currentMonth &&
                txDate.getFullYear() === currentYear
            );
        });

        const breakdown: Record<string, { name: string; value: number; color: string }> = {};

        monthlyExpenses.forEach((tx) => {
            const category = getCategoryById(tx.category_id);
            if (category) {
                if (!breakdown[category.id]) {
                    breakdown[category.id] = {
                        name: category.name,
                        value: 0,
                        color: category.color,
                    };
                }
                breakdown[category.id].value += tx.amount;
            }
        });

        return Object.values(breakdown).sort((a, b) => b.value - a.value);
    }, [transactions, getCategoryById]);

    return {
        transactions: transactionsWithCategory,
        categories,
        stats,
        categoryBreakdown,
        isLoaded,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getCategoryById,
    };
}
