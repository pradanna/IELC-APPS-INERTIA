import React from "react";
import Card from "@/Components/ui/Card";
import { Users, UserPlus, PhoneCall, UserX, UserCheck } from "lucide-react";
import Timeline from "./Timeline";

export default function CrmDashboard({ stats, timeline }) {
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                    Leads Dashboard
                </h2>
                <Timeline current={timeline} />
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
                    <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4">
                        <h3 className="text-sm font-semibold text-gray-900">
                            Urgent Follow-ups
                        </h3>
                    </div>
                    <div className="p-5 text-sm text-gray-500 text-center py-10">
                        No urgent follow-ups required at the moment.
                    </div>
                </Card>

                {/* Future implementation (e.g., Conversion Chart, Today's Scheduled Calls) */}
                <div className="bg-white border border-dashed border-gray-300 rounded-xl flex items-center justify-center p-10">
                    <span className="text-sm text-gray-400 font-medium">
                        Future Chart / Analytics
                    </span>
                </div>
            </div>
        </div>
    );
}
