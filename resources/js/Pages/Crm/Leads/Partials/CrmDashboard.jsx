import React, { useMemo, useState } from "react";
import Card from "@/Components/ui/Card";
import { Users, UserPlus, PhoneCall, UserX, UserCheck } from "lucide-react";
import DataTable from "@/Components/ui/DataTable";
import TableIconButton from "@/Components/ui/TableIconButton";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function CrmDashboard({
    stats,
    leads = [],
    onRowDetailClick,
    monthlyTarget = 0,
    monthlyTargets = [],
    branches = [],
}) {
    const [selectedBranchId, setSelectedBranchId] = useState("all");

    const kpis = [
        {
            label: "Total Leads",
            value: stats.total,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "New Leads",
            value: stats.new,
            icon: UserPlus,
            color: "text-green-600",
            bg: "bg-green-50",
        },
        {
            label: "Contacted",
            value: stats.contacted,
            icon: PhoneCall,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
        {
            label: "Enrolled",
            value: stats.enrolled,
            icon: UserCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            label: "Lost / Dropped",
            value: stats.lost,
            icon: UserX,
            color: "text-red-600",
            bg: "bg-red-50",
        },
    ];

    // Filter Leads untuk menentukan urgensi follow-up
    const urgentLeads = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return leads.filter((lead) => {
            // 3. Sangat Krusial: New Lead yang baru masuk
            if (lead.status?.toLowerCase() === "new") return true;

            if (lead.next_followup_date) {
                const followUpDate = new Date(lead.next_followup_date);
                followUpDate.setHours(0, 0, 0, 0);

                // 1 & 2. Jadwal Follow-up Hari ini atau sudah Terlewat (Overdue)
                if (followUpDate <= today) return true;
            }
            return false;
        });
    }, [leads]);

    // Kolom untuk Tabel Urgent
    const urgentColumns = [
        {
            header: "Lead",
            accessor: "name",
            render: (row) => (
                <div>
                    <p className="font-medium text-gray-900">{row.name}</p>
                    <p className="text-xs text-gray-500">{row.phone || "-"}</p>
                </div>
            ),
        },
        {
            header: "Urgency",
            accessor: "urgency",
            render: (row) => {
                if (row.status?.toLowerCase() === "new") {
                    return (
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                            New Lead
                        </span>
                    );
                }
                if (row.next_followup_date) {
                    const followUpDate = new Date(row.next_followup_date);
                    followUpDate.setHours(0, 0, 0, 0);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (followUpDate < today) {
                        return (
                            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                Overdue
                            </span>
                        );
                    }
                    if (followUpDate.getTime() === today.getTime()) {
                        return (
                            <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                Today
                            </span>
                        );
                    }
                }
                return null;
            },
        },
        {
            header: "",
            accessor: "actions",
            render: (row) => (
                <div className="flex justify-end">
                    <TableIconButton
                        type="detail"
                        onClick={() =>
                            onRowDetailClick && onRowDetailClick(row.id)
                        }
                    />
                </div>
            ),
        },
    ];

    const currentMonthlyTarget = useMemo(() => {
        if (selectedBranchId === "all") {
            return monthlyTargets.length > 0
                ? monthlyTargets.reduce(
                      (sum, target) => sum + Number(target.target_enrolled),
                      0,
                  )
                : monthlyTarget;
        }
        const target = monthlyTargets.find(
            (t) => t.branch_id === Number(selectedBranchId),
        );
        return target ? Number(target.target_enrolled) : 0;
    }, [selectedBranchId, monthlyTargets, monthlyTarget]);

    const chartData = useMemo(() => {
        // Filter leads yang sudah enrolled ("joined")
        let enrolledLeads = leads.filter(
            (l) => l.status?.toLowerCase() === "joined",
        );

        if (selectedBranchId !== "all") {
            enrolledLeads = enrolledLeads.filter(
                (l) => l.branch_id === Number(selectedBranchId),
            );
        }

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate(); // Jumlah hari bulan ini

        const dailyCounts = {};
        enrolledLeads.forEach((lead) => {
            if (!lead.joined_at) return;

            const leadDate = new Date(lead.joined_at);
            // Hanya hitung enrollment di bulan dan tahun yang sama
            if (
                leadDate.getFullYear() === year &&
                leadDate.getMonth() === month
            ) {
                dailyCounts[leadDate.getDate()] =
                    (dailyCounts[leadDate.getDate()] || 0) + 1;
            }
        });

        const data = [];
        let cumulativeAchieved = 0;
        const currentDay = today.getDate();

        for (let i = 1; i <= daysInMonth; i++) {
            cumulativeAchieved += dailyCounts[i] || 0;

            const dataPoint = {
                name: `${i} ${today.toLocaleDateString("id-ID", { month: "short" })}`,
                Target: currentMonthlyTarget,
            };

            // Garis Achieved hanya digambar sampai tanggal hari ini
            if (i <= currentDay) {
                dataPoint.Achieved = cumulativeAchieved;
            }

            data.push(dataPoint);
        }

        return data;
    }, [leads, selectedBranchId, currentMonthlyTarget]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                    Leads Dashboard
                </h2>
            </div>
            {/* KPI Overview */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {kpis.map((kpi, idx) => {
                    const Icon = kpi.icon;
                    return (
                        <Card key={idx} className="flex items-center gap-4 p-5">
                            <div className={`p-3 rounded-xl ${kpi.bg}`}>
                                <Icon className={`w-6 h-6 ${kpi.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    {kpi.label}
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {kpi.value}
                                </p>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Priority Section Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-0 overflow-hidden">
                    <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">
                            Urgent Follow-ups
                        </h3>
                        {urgentLeads.length > 0 && (
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                {urgentLeads.length}
                            </span>
                        )}
                    </div>
                    <div className="overflow-auto max-h-75">
                        {urgentLeads.length > 0 ? (
                            <DataTable
                                data={urgentLeads}
                                columns={urgentColumns}
                            />
                        ) : (
                            <div className="p-5 text-sm text-gray-500 text-center py-10">
                                No urgent follow-ups required at the moment.
                            </div>
                        )}
                    </div>
                </Card>

                {/* Enrollment Target vs Achieved Chart */}
                <Card className="p-0 flex flex-col">
                    <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-gray-900">
                            Enrollment Target vs Achieved
                        </h3>
                        {branches.length > 0 && (
                            <select
                                value={selectedBranchId}
                                onChange={(e) =>
                                    setSelectedBranchId(e.target.value)
                                }
                                className="block w-full sm:w-48 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            >
                                <option value="all">All Branches</option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="p-5 flex-1 min-h-75">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                margin={{
                                    top: 30,
                                    right: 30,
                                    left: 0,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="Achieved"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    activeDot={{ r: 6 }}
                                    name="Enrolled Leads"
                                />
                                {currentMonthlyTarget > 0 && (
                                    <Line
                                        type="linear"
                                        dataKey="Target"
                                        stroke="#ef4444"
                                        strokeDasharray="5 5"
                                        strokeWidth={2}
                                        dot={false}
                                        name="Monthly Target"
                                    />
                                )}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}
