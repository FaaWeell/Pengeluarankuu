"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend,
    Area,
    AreaChart,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

// Trend Line Chart - untuk menampilkan tren harian
interface TrendData {
    date: string;
    income: number;
    expense: number;
}

interface TrendChartProps {
    data: TrendData[];
}

export function TrendLineChart({ data }: TrendChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}jt`}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value: number, name: string) => [
                        formatCurrency(value),
                        name === "income" ? "Pemasukan" : "Pengeluaran",
                    ]}
                />
                <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#incomeGradient)"
                />
                <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#expenseGradient)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

// Category Pie Chart
interface CategoryData {
    name: string;
    value: number;
    color: string;
}

interface CategoryPieChartProps {
    data: CategoryData[];
    total: number;
}

export function CategoryPieChart({ data, total }: CategoryPieChartProps) {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                    }}
                    formatter={(value: number) => [formatCurrency(value), "Jumlah"]}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

// Monthly Bar Chart
interface MonthlyData {
    month: string;
    income: number;
    expense: number;
}

interface MonthlyBarChartProps {
    data: MonthlyData[];
}

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string) => [
                        formatCurrency(value),
                        name === "income" ? "Pemasukan" : "Pengeluaran",
                    ]}
                />
                <Legend
                    formatter={(value) => (value === "income" ? "Pemasukan" : "Pengeluaran")}
                />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

// Budget Progress Mini Chart
interface BudgetData {
    name: string;
    spent: number;
    limit: number;
}

interface BudgetBarChartProps {
    data: BudgetData[];
}

export function BudgetBarChart({ data }: BudgetBarChartProps) {
    const chartData = data.map((item) => ({
        name: item.name,
        spent: item.spent,
        remaining: Math.max(0, item.limit - item.spent),
        percentage: Math.round((item.spent / item.limit) * 100),
    }));

    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 0, left: 60, bottom: 0 }}>
                <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}jt`}
                />
                <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string) => [
                        formatCurrency(value),
                        name === "spent" ? "Terpakai" : "Sisa",
                    ]}
                />
                <Bar dataKey="spent" stackId="a" fill="#f97316" radius={[0, 0, 0, 0]} />
                <Bar dataKey="remaining" stackId="a" fill="#e5e7eb" radius={[0, 4, 4, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
