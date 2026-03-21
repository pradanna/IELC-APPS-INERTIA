import { router } from "@inertiajs/react";
import React from "react";

export default function Timeline({ current }) {
    const timelines = {
        today: "Today",
        week: "This Week",
        month: "This Month",
    };

    function handleChange(e) {
        const selectedTimeline = e.target.value;
        router.get(
            route("superadmin.crm.leads.index"),
            { timeline: selectedTimeline },
            {
                preserveState: true,
                replace: true,
            }
        );
    }

    return (
        <div className="flex items-center gap-2">
            <select
                id="timeline"
                name="timeline"
                className="block w-full max-w-xs rounded-lg border-gray-200 py-1.5 pl-3 pr-10 text-sm focus:border-primary-500 focus:ring-primary-500"
                defaultValue={current}
                onChange={handleChange}
            >
                {Object.entries(timelines).map(([key, label]) => (
                    <option key={key} value={key}>
                        {label}
                    </option>
                ))}
            </select>
        </div>
    );
}
