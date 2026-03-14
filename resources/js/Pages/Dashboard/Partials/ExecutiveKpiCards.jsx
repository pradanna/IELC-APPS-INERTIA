import { Home, Users, UserPlus, Briefcase } from "lucide-react";
import React from "react";

const iconMap = {
    "Total Branches": <Home size={24} className="text-gray-400" />,
    "Total Teachers": <Users size={24} className="text-gray-400" />,
    "Total Students": <UserPlus size={24} className="text-gray-400" />,
    "Total Leads": <Briefcase size={24} className="text-gray-400" />,
};


const KpiCard = ({ item }) => {

    return (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-5">
            <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {item.name}
                </p>
                {iconMap[item.name]}
            </div>
            <div className="mt-4 flex items-end justify-between">
                <p className="text-2xl font-bold text-gray-900">{item.stat}</p>
            </div>
        </div>
    );
};

export default function ExecutiveKpiCards({stats}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, index) => (
                <KpiCard key={index} item={item} />
            ))}
        </div>
    );
}
