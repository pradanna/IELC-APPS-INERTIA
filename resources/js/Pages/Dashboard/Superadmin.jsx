import React from "react";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import ExecutiveKpiCards from "./Partials/ExecutiveKpiCards";
import BranchPerformance from "./Partials/BranchPerformance";
import CrmPipeline from "./Partials/CrmPipeline";
import TopPackages from "./Partials/TopPackages";

export default function Superadmin({ auth, stats }) {
    return (
        <SuperAdminLayout user={auth.user}>
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
        </SuperAdminLayout>
    );
}
