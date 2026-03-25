import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import ExecutiveKpiCards from "./Partials/ExecutiveKpiCards";
import BranchPerformance from "./Partials/BranchPerformance";
import CrmPipeline from "./Partials/CrmPipeline";
import TopPackages from "./Partials/TopPackages";

export default function Superadmin({ auth, stats }) {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Superadmin Dashboard
                </h1>

                {/* Row 1: KPI Cards */}
                <ExecutiveKpiCards stats={stats} />

                {/* Row 2: Branch Performance */}
                <BranchPerformance />

                {/* Row 3: Crm & Leads */}
                <CrmPipeline />

                {/* Row 4: Top Packages */}
                <TopPackages />
            </div>
        </AdminLayout>
    );
}
