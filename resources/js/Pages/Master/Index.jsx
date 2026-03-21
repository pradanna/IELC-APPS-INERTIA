import React from "react";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import { Head } from "@inertiajs/react";

import Tabs from "./Partials/Tabs";
import BranchesTable from "./Partials/BranchesTable";
import LevelsTable from "./Partials/LevelsTable";
import PackagesTable from "./Partials/PackagesTable";
import LeadSourcesTable from "./Partials/LeadSourcesTable";
import LeadStatusesTable from "./Partials/LeadStatusesTable";
import MonthlyTargetTable from "./Partials/MonthlyTargetTable";

export default function Index({
    auth,
    branches,
    levels,
    packages,
    leadSources,
    lead_statuses,
    monthlyTargets,
}) {
    const tabs = [
        {
            name: "branches",
            label: "Branches",
            content: <BranchesTable branches={branches.data} />,
        },
        {
            name: "levels",
            label: "Levels",
            content: <LevelsTable levels={levels.data} />,
        },
        {
            name: "packages",
            label: "Packages",
            content: (
                <PackagesTable packages={packages.data} levels={levels.data} />
            ),
        },
        {
            name: "lead_sources",
            label: "Lead Sources",
            content: <LeadSourcesTable leadSources={leadSources.data} />,
        },
        {
            name: "lead_statuses",
            label: "Lead Statuses",
            content: <LeadStatusesTable leadStatuses={lead_statuses.data} />,
        },
        {
            name: "monthly_targets",
            label: "Monthly Targets",
            content: (
                <MonthlyTargetTable
                    monthlyTargets={monthlyTargets?.data || []}
                    branches={branches?.data || []}
                />
            ),
        },
    ];

    return (
        <SuperAdminLayout user={auth.user}>
            <Head title="Master Data" />
            <div className="px-4 sm:px-6 lg:px-8  pb-0">
                <h1 className="text-xl font-bold leading-7 text-gray-900 mb-3">
                    Master Data
                </h1>
                {/* <p className="mt-1 text-sm text-gray-500">
                    Manage core system data like branches, levels, packages, and
                    lead sources.
                </p> */}

                <Tabs tabs={tabs} initialTab="branches" />
            </div>
        </SuperAdminLayout>
    );
}
