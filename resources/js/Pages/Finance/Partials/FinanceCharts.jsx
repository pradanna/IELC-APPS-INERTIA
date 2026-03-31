import React from "react";
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
} from "recharts";

export default function FinanceCharts({ charts }) {
    // Mock data untuk Pie Chart sementara (Anda bisa lempar data aslinya dari Controller nanti)
    const pieData = [
        { name: "General English", value: 60 },
        { name: "TOEFL Prep", value: 30 },
        { name: "IELTS Prep", value: 10 },
    ];
    const COLORS = ["#0ea5e9", "#8b5cf6", "#f59e0b"]; // primary/secondary shades

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Line Chart: Tren Pemasukan */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-5 lg:col-span-2 flex flex-col h-80">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Tren Pemasukan (Bulan Ini)
                </h3>
                <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={charts.revenue_trend}
                            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#f3f4f6"
                            />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12, fill: "#6b7280" }}
                                tickFormatter={(val) => new Date(val).getDate()}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: "#6b7280" }}
                                tickFormatter={(val) => `Rp ${val / 1000}k`}
                            />
                            <Tooltip
                                formatter={(value) =>
                                    new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    }).format(value)
                                }
                            />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#10b981"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                name="Pendapatan"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pie Chart: Komposisi Paket */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-5 flex flex-col h-80">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Pendapatan per Paket
                </h3>
                <div className="flex-1 w-full flex justify-center items-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Label Tengah Pie Chart */}
                    <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                        <span className="text-xs text-gray-500">Top</span>
                        <span className="text-sm font-bold text-gray-900">
                            General Eng.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
