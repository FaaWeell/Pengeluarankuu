"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { TrendLineChart, CategoryPieChart, MonthlyBarChart } from "@/components/charts";
import { useTransactions, useLocalStorage } from "@/hooks";
import { useMemo } from "react";
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    CreditCard,
    Utensils,
    Car,
    Film,
    ShoppingCart,
    Zap,
    Wifi,
    Briefcase,
    Coffee,
    Home,
    Music,
    Heart,
    Gift,
    Loader2,
    Dumbbell,
    Cloud,
} from "lucide-react";

// Icon mapping untuk kategori
const categoryIconMap: Record<string, React.ReactNode> = {
    "briefcase": <Briefcase className="w-5 h-5" />,
    "utensils": <Utensils className="w-5 h-5" />,
    "car": <Car className="w-5 h-5" />,
    "film": <Film className="w-5 h-5" />,
    "shopping-cart": <ShoppingCart className="w-5 h-5" />,
    "zap": <Zap className="w-5 h-5" />,
    "coffee": <Coffee className="w-5 h-5" />,
    "home": <Home className="w-5 h-5" />,
    "wifi": <Wifi className="w-5 h-5" />,
    "gift": <Gift className="w-5 h-5" />,
    "heart": <Heart className="w-5 h-5" />,
    "music": <Music className="w-5 h-5" />,
    "dumbbell": <Dumbbell className="w-5 h-5" />,
    "cloud": <Cloud className="w-5 h-5" />,
};

// Budget interface for localStorage
interface Budget {
    id: string;
    name: string;
    limit: number;
    spent: number;
    icon: string;
    color: string;
}

// Subscription interface for localStorage
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

export default function DashboardPage() {
    const { transactions, stats, categoryBreakdown, isLoaded } = useTransactions();
    const [budgets] = useLocalStorage<Budget[]>("dompetku-budgets", []);
    const [subscriptions] = useLocalStorage<Subscription[]>("dompetku-subscriptions", []);

    const getCategoryIcon = (iconName?: string) => {
        if (!iconName) return <CreditCard className="w-5 h-5" />;
        return categoryIconMap[iconName] || <CreditCard className="w-5 h-5" />;
    };

    // Generate trend data from actual transactions (current month)
    const trendData = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Create weekly buckets
        const weeklyData: { date: string; income: number; expense: number }[] = [];
        const weeks = [1, 7, 14, 21, daysInMonth];

        for (let i = 0; i < weeks.length - 1; i++) {
            const startDay = weeks[i];
            const endDay = weeks[i + 1];
            let income = 0;
            let expense = 0;

            transactions.forEach((tx) => {
                const txDate = new Date(tx.transaction_date);
                if (
                    txDate.getMonth() === currentMonth &&
                    txDate.getFullYear() === currentYear &&
                    txDate.getDate() >= startDay &&
                    txDate.getDate() < endDay
                ) {
                    if (tx.type === "income") {
                        income += tx.amount;
                    } else {
                        expense += tx.amount;
                    }
                }
            });

            const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
            weeklyData.push({
                date: `${startDay} ${monthNames[currentMonth]}`,
                income,
                expense,
            });
        }

        return weeklyData;
    }, [transactions]);

    // Generate monthly comparison data (last 6 months)
    const monthlyData = useMemo(() => {
        const months: { month: string; income: number; expense: number }[] = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
        const now = new Date();

        for (let i = 5; i >= 0; i--) {
            const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const targetMonth = targetDate.getMonth();
            const targetYear = targetDate.getFullYear();

            let income = 0;
            let expense = 0;

            transactions.forEach((tx) => {
                const txDate = new Date(tx.transaction_date);
                if (txDate.getMonth() === targetMonth && txDate.getFullYear() === targetYear) {
                    if (tx.type === "income") {
                        income += tx.amount;
                    } else {
                        expense += tx.amount;
                    }
                }
            });

            months.push({
                month: monthNames[targetMonth],
                income,
                expense,
            });
        }

        return months;
    }, [transactions]);

    // Get upcoming bills from subscriptions (within 14 days)
    const upcomingBills = useMemo(() => {
        const now = new Date();
        return subscriptions
            .filter((sub) => sub.isActive)
            .map((sub) => {
                const nextDate = new Date(sub.nextBillingDate);
                const diffDays = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return {
                    name: sub.name,
                    amount: sub.amount,
                    dueIn: diffDays,
                    icon: sub.icon,
                };
            })
            .filter((bill) => bill.dueIn >= 0 && bill.dueIn <= 14)
            .sort((a, b) => a.dueIn - b.dueIn)
            .slice(0, 3);
    }, [subscriptions]);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Get recent transactions (last 5)
    const recentTransactions = transactions.slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Saldo */}
                <Card className="bg-gradient-to-br from-emerald-500 to-cyan-500 border-0 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                            <Wallet className="w-4 h-4" />
                            Total Saldo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalBalance)}</div>
                        <p className="text-xs opacity-75 mt-1">Semua rekening</p>
                    </CardContent>
                </Card>

                {/* Pemasukan Bulan Ini */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <ArrowUpRight className="w-4 h-4 text-green-500" />
                            Pemasukan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.monthlyIncome)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Bulan ini</p>
                    </CardContent>
                </Card>

                {/* Pengeluaran Bulan Ini */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                            Pengeluaran
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.monthlyExpense)}</div>
                        <div className="flex items-center gap-1 mt-1">
                            {stats.expenseChange !== 0 && (
                                <Badge variant={stats.expenseChange > 0 ? "destructive" : "success"} className="text-xs gap-1">
                                    {stats.expenseChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    {Math.abs(stats.expenseChange)}%
                                </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">vs bulan lalu</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Sisa Anggaran */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-blue-500" />
                            Sisa Anggaran
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${stats.budgetRemaining >= 0 ? "text-foreground" : "text-red-600"}`}>
                            {formatCurrency(stats.budgetRemaining)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Bulan ini</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trend Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Tren Keuangan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {trendData.some((d) => d.income > 0 || d.expense > 0) ? (
                            <TrendLineChart data={trendData} />
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <p className="text-sm">Belum ada data transaksi bulan ini</p>
                                <p className="text-xs mt-1">Tambah transaksi untuk melihat tren</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Category Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Kategori Pengeluaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {categoryBreakdown.length > 0 ? (
                            <>
                                <CategoryPieChart data={categoryBreakdown} total={stats.monthlyExpense} />
                                <div className="space-y-2 mt-4">
                                    {categoryBreakdown.slice(0, 4).map((cat) => (
                                        <div key={cat.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                                <span className="text-sm">{cat.name}</span>
                                            </div>
                                            <span className="text-sm font-medium">{formatCurrency(cat.value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-sm">Belum ada data pengeluaran</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Comparison Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Perbandingan Bulanan</CardTitle>
                </CardHeader>
                <CardContent>
                    {monthlyData.some((d) => d.income > 0 || d.expense > 0) ? (
                        <MonthlyBarChart data={monthlyData} />
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <p className="text-sm">Belum ada data transaksi</p>
                            <p className="text-xs mt-1">Tambah transaksi untuk melihat perbandingan bulanan</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Transaksi Terakhir</CardTitle>
                            <a href="/dashboard/transactions" className="text-sm text-primary hover:underline">
                                Lihat Semua
                            </a>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentTransactions.length > 0 ? (
                            <div className="space-y-3">
                                {recentTransactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                                }`}>
                                                {getCategoryIcon(tx.category?.icon)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{tx.description || tx.category?.name || "Transaksi"}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {tx.category?.name || "Lainnya"} - {formatRelativeTime(tx.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`font-semibold ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}>
                                            {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-sm">Belum ada transaksi</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Budget Progress + Upcoming Bills */}
                <div className="space-y-6">
                    {/* Budget Progress */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Progress Anggaran</CardTitle>
                                <a href="/dashboard/budgets" className="text-sm text-primary hover:underline">
                                    Kelola
                                </a>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {budgets.length > 0 ? (
                                <div className="space-y-4">
                                    {budgets.slice(0, 4).map((budget) => {
                                        const percentage = budget.limit > 0 ? Math.round((budget.spent / budget.limit) * 100) : 0;
                                        const isWarning = percentage >= 80;
                                        const isOver = percentage >= 100;

                                        return (
                                            <div key={budget.id} className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="font-medium">{budget.name}</span>
                                                    <span className={isOver ? "text-red-500" : isWarning ? "text-orange-500" : "text-muted-foreground"}>
                                                        {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={Math.min(percentage, 100)}
                                                    className="h-2"
                                                    indicatorClassName={isOver ? "bg-red-500" : isWarning ? "bg-orange-500" : "bg-emerald-500"}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-muted-foreground">
                                    <p className="text-sm">Belum ada anggaran</p>
                                    <a href="/dashboard/budgets" className="text-sm text-primary hover:underline">
                                        Buat anggaran
                                    </a>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming Bills */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Tagihan Mendatang</CardTitle>
                                <a href="/dashboard/subscriptions" className="text-sm text-primary hover:underline">
                                    Kelola
                                </a>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {upcomingBills.length > 0 ? (
                                <div className="space-y-3">
                                    {upcomingBills.map((bill) => (
                                        <div key={bill.name} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                                {getCategoryIcon(bill.icon)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{bill.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {bill.dueIn === 0 ? "Hari ini" : `${bill.dueIn} hari lagi`}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-sm">{formatCurrency(bill.amount)}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-muted-foreground">
                                    <p className="text-sm">Belum ada tagihan mendatang</p>
                                    <a href="/dashboard/subscriptions" className="text-sm text-primary hover:underline">
                                        Tambah langganan
                                    </a>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
