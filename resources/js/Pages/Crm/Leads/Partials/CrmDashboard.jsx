import React from "react";
import Card from "@/Components/ui/Card";
import DataTable from "@/Components/ui/DataTable";
import TableIconButton from "@/Components/ui/TableIconButton";
import { Filter, Calendar, MapPin, Search, Thermometer } from "lucide-react";
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
import { useCrmDashboard } from "../Hooks/useCrmDashboard";
import ExportButton from "./ExportButton";

export default function CrmDashboard({
    stats,
    leads = [],
    onRowDetailClick,
    monthlyTarget = 0,
    monthlyTargets = [],
    branches = [],
    leadSources = [],
    onKpiClick,
    filters = {},
}) {
    const { kpis, urgentLeads, chartData, currentMonthlyTarget, handleFilterChange } = useCrmDashboard({
        stats,
        leads,
        monthlyTarget,
        monthlyTargets,
        filters,
    });

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    // TABLE COLUMN (URGENT)
    const urgentColumns = [
        {
            header: "Lead",
            accessor: "name",
            render: (row) => (
                <div>
                    <p className="font-medium text-gray-900 flex items-center gap-1.5">
                        {row.name}
                        {row.is_profile_pending && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800" title="Ada pembaruan profil tertunda">
                                Update
                            </span>
                        )}
                    </p>
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
                <div className="flex justify-end pr-2">
                    <TableIconButton
                        type="detail"
                        onClick={() => onRowDetailClick && onRowDetailClick(row.id)}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Global Filters Section */}
            <Card className="p-4 bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-gray-400">
                        <Filter className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Filters</span>
                    </div>

                    {/* Branch Filter */}
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-2 bg-white hover:bg-gray-50/50 hover:border-gray-400 transition-all">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <select
                            value={filters.branch_id || "all"}
                            onChange={(e) => handleFilterChange("branch_id", e.target.value)}
                            className="block w-full sm:w-auto border-0 py-1.5 pl-1 pr-8 text-sm focus:ring-0 focus:outline-none bg-transparent cursor-pointer"
                        >
                            <option value="all">All Branches</option>
                            {branches.map((b) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Month Filter */}
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-2 bg-white hover:bg-gray-50/50 hover:border-gray-400 transition-all">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <select
                            value={filters.month || new Date().getMonth() + 1}
                            onChange={(e) => handleFilterChange("month", e.target.value)}
                            className="block w-full sm:w-auto border-0 py-1.5 pl-1 pr-8 text-sm focus:ring-0 focus:outline-none bg-transparent cursor-pointer"
                        >
                            {months.map((m, i) => (
                                <option key={i} value={i + 1}>{m}</option>
                            ))}
                        </select>
                    </div>

                    {/* Year Filter */}
                    <div className="flex items-center gap-1 border border-gray-300 rounded-lg px-2 bg-white hover:bg-gray-50/50 hover:border-gray-400 transition-all">
                        <select
                            value={filters.year || new Date().getFullYear()}
                            onChange={(e) => handleFilterChange("year", e.target.value)}
                            className="block w-full sm:w-auto border-0 py-1.5 pl-1 pr-8 text-sm focus:ring-0 focus:outline-none bg-transparent cursor-pointer"
                        >
                            {years.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    {/* Lead Source Filter */}
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-2 bg-white hover:bg-gray-50/50 hover:border-gray-400 transition-all">
                        <Search className="h-4 w-4 text-gray-400" />
                        <select
                            value={filters.lead_source_id || "all"}
                            onChange={(e) => handleFilterChange("lead_source_id", e.target.value)}
                            className="block w-full sm:w-auto border-0 py-1.5 pl-1 pr-8 text-sm focus:ring-0 focus:outline-none bg-transparent cursor-pointer"
                        >
                            <option value="all">All Sources</option>
                            {leadSources.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    {/* Temperature Filter */}
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-2 bg-white hover:bg-gray-50/50 hover:border-gray-400 transition-all">
                        <Thermometer className="h-4 w-4 text-gray-400" />
                        <select
                            value={filters.temperature || "all"}
                            onChange={(e) => handleFilterChange("temperature", e.target.value)}
                            className="block w-full sm:w-auto border-0 py-1.5 pl-1 pr-8 text-sm focus:ring-0 focus:outline-none bg-transparent cursor-pointer"
                        >
                            <option value="all">All Temperatures</option>
                            <option value="cold">Cold</option>
                            <option value="warm">Warm</option>
                            <option value="hot">Hot</option>
                        </select>
                    </div>

                    {/* Export Button */}
                    <div className="ml-auto">
                        <ExportButton filters={filters} />
                    </div>
                </div>
            </Card>

            {/* KPI Overview */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {kpis.map((kpi, idx) => {
                    const Icon = kpi.icon;
                    return (
                        <div
                            key={idx}
                            onClick={() => onKpiClick && onKpiClick(kpi.filter)}
                            className="cursor-pointer group focus:outline-none"
                            role="button"
                            tabIndex={0}
                        >
                            <Card className="flex items-center gap-4 p-5 h-full group-hover:shadow-md transition-all ring-1 ring-transparent hover:ring-primary-500/20">
                                <div className={`p-3 rounded-xl ${kpi.bg}`}>
                                    <Icon className={`w-6 h-6 ${kpi.color}`} />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider leading-none mb-1">
                                        {kpi.label}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 leading-none">
                                        {kpi.value}
                                    </p>
                                </div>
                            </Card>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Urgent Follow-ups Card */}
                <Card className="p-0 overflow-hidden shadow-sm ring-1 ring-gray-900/5 rounded-xl bg-white border-0">
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
                    <div className="overflow-auto max-h-80">
                        {urgentLeads.length > 0 ? (
                            <DataTable
                                data={urgentLeads}
                                columns={urgentColumns}
                            />
                        ) : (
                            <div className="p-5 text-sm text-gray-500 text-center py-12">
                                No urgent follow-ups required for the selected filters.
                            </div>
                        )}
                    </div>
                </Card>

                {/* Enrollment Target Card */}
                <Card className="p-0 flex flex-col shadow-sm ring-1 ring-gray-900/5 rounded-xl bg-white border-0">
                    <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4">
                        <h3 className="text-sm font-semibold text-gray-900">
                            Enrollment Target vs Achieved
                        </h3>
                    </div>
                    <div className="p-5 flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="Achieved"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
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
