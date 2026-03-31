import { useMemo, useCallback } from "react";
import { router } from "@inertiajs/react";
import { Users, UserPlus, PhoneCall, UserX, UserCheck } from "lucide-react";

export const useCrmDashboard = (props) => {
    const {
        stats,
        leads = [],
        monthlyTarget = 0,
        monthlyTargets = [],
        filters = {}
    } = props;

    // Filter Logic untuk KPIs
    const kpis = useMemo(() => [
        {
            label: "Total Leads",
            value: stats.total,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
            filter: "all",
        },
        {
            label: "New Leads",
            value: stats.new,
            icon: UserPlus,
            color: "text-green-600",
            bg: "bg-green-50",
            filter: "New",
        },
        {
            label: "Contacted",
            value: stats.contacted,
            icon: PhoneCall,
            color: "text-amber-600",
            bg: "bg-amber-50",
            filter: "Contacted",
        },
        {
            label: "Enrolled",
            value: stats.enrolled,
            icon: UserCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            filter: "Joined",
        },
        {
            label: "Lost / Dropped",
            value: stats.lost,
            icon: UserX,
            color: "text-red-600",
            bg: "bg-red-50",
            filter: "Lost",
        },
    ], [stats]);

    // Urgent Leads Selection
    const urgentLeads = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return leads.filter((lead) => {
            if (lead.status?.toLowerCase() === "new") return true;

            if (lead.next_followup_date) {
                const followUpDate = new Date(lead.next_followup_date);
                followUpDate.setHours(0, 0, 0, 0);
                if (followUpDate <= today) return true;
            }
            return false;
        });
    }, [leads]);

    const currentMonthlyTarget = useMemo(() => {
        if (!filters.branch_id || filters.branch_id === "all") {
            return monthlyTargets.length > 0
                ? monthlyTargets.reduce((sum, target) => sum + Number(target.target_enrolled), 0)
                : monthlyTarget;
        }
        const target = monthlyTargets.find((t) => t.branch_id === filters.branch_id);
        return target ? Number(target.target_enrolled) : 0;
    }, [filters.branch_id, monthlyTargets, monthlyTarget]);

    // Chart Data Preparation
    const chartData = useMemo(() => {
        let enrolledLeads = leads.filter((l) => {
            const statusMatch = (l.status || "").toLowerCase() === "joined" || 
                              (l.lead_status || "").toLowerCase() === "joined";
            return statusMatch;
        });
        
        // Debugging (bisa dilihat di console browser F12)
        console.log(`[CRM] Total leads: ${leads.length}, Enrolled found: ${enrolledLeads.length}`);

        const year = parseInt(filters.year || new Date().getFullYear());
        const month = parseInt(filters.month || new Date().getMonth() + 1) - 1; // 0-indexed for JS
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const dailyCounts = {};
        enrolledLeads.forEach((lead) => {
            // Gunakan joined_at, fallback ke created_at jika null (untuk data lama)
            const targetDate = lead.joined_at || lead.created_at;
            if (!targetDate) return;
            
            const leadDate = new Date(targetDate);
            if (!isNaN(leadDate.getTime()) && leadDate.getFullYear() === year && leadDate.getMonth() === month) {
                const day = leadDate.getDate();
                dailyCounts[day] = (dailyCounts[day] || 0) + 1;
            }
        });

        const data = [];
        let cumulativeAchieved = 0;
        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
        const currentDay = isCurrentMonth ? today.getDate() : daysInMonth;

        for (let i = 1; i <= daysInMonth; i++) {
            cumulativeAchieved += dailyCounts[i] || 0;
            const dataPoint = {
                name: `${i}`,
                Target: currentMonthlyTarget,
            };
            if (i <= currentDay) {
                dataPoint.Achieved = cumulativeAchieved;
            }
            data.push(dataPoint);
        }
        return data;
    }, [leads, currentMonthlyTarget, filters.year, filters.month]);

    const handleFilterChange = useCallback((key, value) => {
        router.get(
            route("admin.crm.leads.index"),
            { ...filters, [key]: value },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }, [filters]);

    return {
        kpis,
        urgentLeads,
        chartData,
        currentMonthlyTarget,
        handleFilterChange
    };
};
