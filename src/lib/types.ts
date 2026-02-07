// Database Types for Expense Tracker

export type TransactionType = "income" | "expense";

export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    currency: string;
    created_at: string;
}

export interface Category {
    id: string;
    user_id: string;
    name: string;
    icon: string;
    color: string;
    type: TransactionType;
    budget_limit: number | null;
    created_at: string;
}

export interface Transaction {
    id: string;
    user_id: string;
    category_id: string;
    amount: number;
    type: TransactionType;
    transaction_date: string;
    description: string | null;
    receipt_url: string | null;
    location: string | null;
    tags: string[];
    mood: string | null;
    is_recurring: boolean;
    created_at: string;
    // Joined data
    category?: Category;
}

export interface Budget {
    id: string;
    user_id: string;
    category_id: string;
    limit_amount: number;
    period: "weekly" | "monthly";
    start_date: string;
    created_at: string;
    // Calculated
    spent_amount?: number;
    percentage?: number;
    // Joined
    category?: Category;
}

export interface Subscription {
    id: string;
    user_id: string;
    category_id: string;
    name: string;
    amount: number;
    frequency: "weekly" | "monthly" | "yearly";
    next_billing: string;
    reminder_days: number;
    is_active: boolean;
    created_at: string;
    // Joined
    category?: Category;
}

export interface Goal {
    id: string;
    user_id: string;
    name: string;
    type: "saving" | "debt" | "emergency";
    target_amount: number;
    current_amount: number;
    deadline: string | null;
    icon: string;
    created_at: string;
}

export interface Debt {
    id: string;
    user_id: string;
    type: "debt" | "receivable";
    person_name: string;
    amount: number;
    due_date: string | null;
    is_paid: boolean;
    notes: string | null;
    created_at: string;
}

export interface SplitBill {
    id: string;
    user_id: string;
    title: string;
    total_amount: number;
    bill_date: string;
    split_method: "equal" | "percentage" | "custom";
    created_at: string;
    participants?: SplitParticipant[];
}

export interface SplitParticipant {
    id: string;
    split_bill_id: string;
    name: string;
    amount_owed: number;
    is_paid: boolean;
    paid_at: string | null;
}

// Dashboard Stats
export interface DashboardStats {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpense: number;
    lastMonthExpense: number;
    expenseChange: number;
    budgetRemaining: number;
}

// Chart Data Types
export interface CategoryBreakdown {
    name: string;
    value: number;
    color: string;
    percentage: number;
}

export interface TrendData {
    date: string;
    income: number;
    expense: number;
}
