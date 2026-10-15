import React from "react";
import { ClipboardList, Activity, Clock } from "lucide-react";

export default function PlacementStats({ stats }) {
    const statCards = [
        {
            label: "Ujian Hari Ini",
            value: stats?.today || 0,
            icon: ClipboardList,
            color: "bg-indigo-50 text-indigo-600",
        },
        {
            label: "Sedang Mengerjakan",
            value: stats?.inProgress || 0,
            icon: Activity,
            color: "bg-blue-50 text-blue-600",
        },
        {
            label: "Menunggu Tindakan",
            value: stats?.pending || 0,
            icon: Clock,
            color: "bg-yellow-50 text-yellow-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {statCards.map((stat, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className={`p-3 ${stat.color} rounded-lg`}>
                        <stat.icon size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
