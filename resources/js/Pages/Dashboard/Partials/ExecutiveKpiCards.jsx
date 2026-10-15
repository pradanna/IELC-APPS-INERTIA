import { Home, Users, UserPlus, Briefcase } from "lucide-react";
import React from "react";

const iconMap = {
    "Total Branches": <Home size={20} className="text-blue-500" />,
    "Total Teachers": <Users size={20} className="text-indigo-500" />,
    "Total Students": <UserPlus size={20} className="text-emerald-500" />,
    "New Leads (This Month)": <Briefcase size={20} className="text-amber-500" />,
};


const KpiCard = ({ item }) => {
    return (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider truncate pr-2">
                    {item.name}
                </p>
                <div className="shrink-0">{iconMap[item.name]}</div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-end justify-between">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{item.stat}</p>
            </div>
        </div>
    );
};

export default function ExecutiveKpiCards({stats}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
            {stats.map((item, index) => (
                <KpiCard key={index} item={item} />
            ))}
        </div>
    );
}
