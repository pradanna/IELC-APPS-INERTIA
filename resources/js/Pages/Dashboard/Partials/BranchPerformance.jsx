import React from "react";
import { DollarSign, Users } from "lucide-react";

const performanceData = {
    revenue: {
        title: "Revenue Contribution",
        icon: <DollarSign className="text-gray-400" size={20} />,
        total: "Rp 125.500.000",
        branches: [
            { name: "Solo", value: 75300000, percentage: 60, color: "bg-primary-600" },
            { name: "Semarang", value: 50200000, percentage: 40, color: "bg-secondary-600" },
        ],
    },
    leads: {
        title: "New Leads",
        icon: <Users className="text-gray-400" size={20} />,
        total: "85",
        branches: [
            { name: "Solo", value: 55, percentage: 65, color: "bg-primary-600" },
            { name: "Semarang", value: 30, percentage: 35, color: "bg-secondary-600" },
        ],
    },
};

const PerformanceBar = ({ branches }) => (
    <div className="w-full flex h-2 rounded-full overflow-hidden mt-2">
        {branches.map((branch, index) => (
            <div
                key={index}
                className={branch.color}
                style={{ width: `${branch.percentage}%` }}
                title={`${branch.name}: ${branch.percentage}%`}
            ></div>
        ))}
    </div>
);

const BranchStat = ({ branch }) => (
    <div className="flex items-center justify-between text-sm">
        <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full mr-2 ${branch.color}`}></span>
            <span className="text-gray-700">{branch.name}</span>
        </div>
        <span className="font-medium text-gray-900">
            {branch.value.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            })}
        </span>
    </div>
);

const BranchLeadStat = ({ branch }) => (
    <div className="flex items-center justify-between text-sm">
        <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full mr-2 ${branch.color}`}></span>
            <span className="text-gray-700">{branch.name}</span>
        </div>
        <span className="font-medium text-gray-900">{branch.value} Leads</span>
    </div>
);

export default function BranchPerformance() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Card */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-base font-semibold text-gray-900">{performanceData.revenue.title}</p>
                    {performanceData.revenue.icon}
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{performanceData.revenue.total}</p>
                <PerformanceBar branches={performanceData.revenue.branches} />
                <div className="mt-4 space-y-2">
                    {performanceData.revenue.branches.map((branch) => (
                        <BranchStat key={branch.name} branch={branch} />
                    ))}
                </div>
            </div>

            {/* Leads Card */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-base font-semibold text-gray-900">{performanceData.leads.title}</p>
                    {performanceData.leads.icon}
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{performanceData.leads.total}</p>
                <PerformanceBar branches={performanceData.leads.branches} />
                <div className="mt-4 space-y-2">
                    {performanceData.leads.branches.map((branch) => (
                        <BranchLeadStat key={branch.name} branch={branch} />
                    ))}
                </div>
            </div>
        </div>
    );
}
