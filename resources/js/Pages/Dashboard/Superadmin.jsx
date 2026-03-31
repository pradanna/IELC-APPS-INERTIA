import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import ExecutiveKpiCards from "./Partials/ExecutiveKpiCards";
import BranchPerformance from "./Partials/BranchPerformance";
import CrmPipeline from "./Partials/CrmPipeline";
import TopPackages from "./Partials/TopPackages";

export default function Superadmin({ auth, stats, branchPerformance, crmPipeline, topPackages }) {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">Superadmin Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Laporan performa cabang, pipeline CRM, dan statistik paket kursus real-time.</p>
                </div>

                {/* Row 1: KPI Cards */}
                <ExecutiveKpiCards stats={stats} />

                {/* Row 2: Charts & Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BranchPerformance data={branchPerformance?.data || []} />
                    <CrmPipeline data={crmPipeline?.data || []} />
                </div>

                {/* Row 3: Top Packages */}
                <TopPackages data={topPackages?.data || []} />
            </div>
        </AdminLayout>
    );
}
