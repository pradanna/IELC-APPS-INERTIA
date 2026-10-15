import React from "react";
import Card from "@/Components/ui/Card";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    Legend
} from "recharts";
import { useLeadsReport } from "../Hooks/useLeadsReport";
import { Target, Users, TrendingUp } from "lucide-react";

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function LeadsReport({ leads, leadSources, leadStatuses, branches }) {
    const { sourceData, statusData, branchData, stats } = useLeadsReport({ 
        leads, 
        leadSources, 
        leadStatuses, 
        branches 
    });

    return (
        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card className="p-5 flex items-center gap-4 bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl border-0">
                    <div className="p-3 bg-indigo-50 rounded-xl">
                        <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest leading-none mb-1">Filtered Leads</p>
                        <p className="text-2xl font-bold text-gray-900 leading-none">{stats.total}</p>
                    </div>
                </Card>
                
                <Card className="p-5 flex items-center gap-4 bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl border-0">
                    <div className="p-3 bg-emerald-50 rounded-xl">
                        <Target className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest leading-none mb-1">Enrolled Students</p>
                        <p className="text-2xl font-bold text-gray-900 leading-none">{stats.joined}</p>
                    </div>
                </Card>

                <Card className="p-5 flex items-center gap-4 bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl border-0">
                    <div className="p-3 bg-amber-50 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest leading-none mb-1">Conversion Rate</p>
                        <p className="text-2xl font-bold text-gray-900 leading-none">{stats.conversionRate}%</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sources Report */}
                <Card className="p-0 shadow-sm ring-1 ring-gray-900/5 rounded-xl bg-white border-0 overflow-hidden">
                    <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4">
                        <h3 className="text-sm font-semibold text-gray-900">Leads by Source</h3>
                    </div>
                    <div className="p-5 h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sourceData} layout="vertical" margin={{ left: 30, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    fontSize={11} 
                                    width={100} 
                                    axisLine={false} 
                                    tickLine={false}
                                />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc'}}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Status Funnel */}
                <Card className="p-0 shadow-sm ring-1 ring-gray-900/5 rounded-xl bg-white border-0 overflow-hidden">
                    <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4">
                        <h3 className="text-sm font-semibold text-gray-900">Conversion Funnel (Status)</h3>
                    </div>
                    <div className="p-5 h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statusData} margin={{ top: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    fontSize={10} 
                                    axisLine={false} 
                                    tickLine={false}
                                    interval={0}
                                />
                                <YAxis fontSize={12} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc'}}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Branch Performance */}
                <Card className="p-0 shadow-sm ring-1 ring-gray-900/5 rounded-xl bg-white border-0 lg:col-span-2 overflow-hidden">
                    <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4">
                        <h3 className="text-sm font-semibold text-gray-900">Branch Distribution</h3>
                    </div>
                    <div className="p-5 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={branchData} margin={{ top: 10, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    fontSize={12} 
                                    axisLine={false} 
                                    tickLine={false}
                                    label={{ value: 'Branch Name', position: 'bottom', offset: 0, fontSize: 10, fill: '#94a3b8' }}
                                />
                                <YAxis fontSize={12} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc'}}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}
