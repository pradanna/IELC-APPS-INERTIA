import { useMemo } from "react";

export function useLeadsReport({ leads = [], leadSources = [], leadStatuses = [], branches = [] }) {
    // 1. Leads by Source
    const sourceData = useMemo(() => {
        const counts = leads.reduce((acc, lead) => {
            const sourceId = lead.lead_source_id;
            acc[sourceId] = (acc[sourceId] || 0) + 1;
            return acc;
        }, {});

        return leadSources
            .map((source) => ({
                name: source.name,
                value: counts[source.id] || 0,
            }))
            .sort((a, b) => b.value - a.value);
    }, [leads, leadSources]);

    // 2. Leads by Status (Conversion Funnel)
    const statusData = useMemo(() => {
        const counts = leads.reduce((acc, lead) => {
            const statusId = lead.lead_status_id;
            acc[statusId] = (acc[statusId] || 0) + 1;
            return acc;
        }, {});

        // We try to order statuses logically if possible, or just use provided order
        return leadStatuses.map((status) => ({
            name: status.name,
            value: counts[status.id] || 0,
        }));
    }, [leads, leadStatuses]);

    // 3. Leads by Branch
    const branchData = useMemo(() => { 
        const counts = leads.reduce((acc, lead) => {
            const branchId = lead.branch_id;
            acc[branchId] = (acc[branchId] || 0) + 1;
            return acc;
        }, {});

        return branches.map((branch) => ({
            name: branch.name,
            value: counts[branch.id] || 0,
        })).sort((a, b) => b.value - a.value);
    }, [leads, branches]);

    // 4. Conversion Stats
    const stats = useMemo(() => {
        const total = leads.length;
        const joined = leads.filter(l => {
            const statusName = (l.lead_status?.name || "").toLowerCase();
            return statusName === 'joined' || statusName === 'enrolled';
        }).length;

        const conversionRate = total > 0 ? ((joined / total) * 100).toFixed(1) : 0;

        return {
            total,
            joined,
            conversionRate
        };
    }, [leads]);

    return {
        sourceData,
        statusData,
        branchData,
        stats
    };
}
