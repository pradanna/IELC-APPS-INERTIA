import React, { useState, useMemo } from "react";
import Panel from "@/Components/ui/Panel";
import DataTable from "@/Components/ui/DataTable";
import StatusBadge from "@/Components/ui/StatusBadge";
import TableIconButton from "@/Components/ui/TableIconButton";
import SearchInput from "@/Components/ui/SearchInput";
import Select from "@/Components/ui/Select";

export default function LeadTable({
    leads,
    leadStatuses = [],
    onRowDetailClick,
    onEditClick,
    onDeleteClick,
    onFollowupClick,
    onStatusUpdate,
    processingStatusUpdate,
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sourceFilter, setSourceFilter] = useState("all");
    const [followupFilter, setFollowupFilter] = useState("all");

    const sources = useMemo(() => {
        const uniqueSources = new Set(
            leads.map((l) => l.source).filter(Boolean),
        );
        return Array.from(uniqueSources);
    }, [leads]);

    const filteredLeads = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const next7Days = new Date(today);
        next7Days.setDate(today.getDate() + 7);
        next7Days.setHours(23, 59, 59, 999);

        // 1. Filter Data
        let result = leads.filter((lead) => {
            const matchesSearch =
                (lead.name &&
                    lead.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                (lead.phone &&
                    lead.phone
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()));

            const matchesStatus =
                statusFilter === "all" ||
                (lead.status &&
                    lead.status.toLowerCase() === statusFilter.toLowerCase());
            const matchesSource =
                sourceFilter === "all" || lead.source === sourceFilter;

            let matchesFollowup = true;
            if (followupFilter !== "all") {
                if (!lead.next_followup_date) {
                    matchesFollowup = false;
                } else {
                    const fDate = new Date(lead.next_followup_date);
                    fDate.setHours(0, 0, 0, 0);

                    if (followupFilter === "today") {
                        // Filter menyertakan jadwal overdue & hari ini
                        matchesFollowup = fDate.getTime() <= today.getTime();
                    } else if (followupFilter === "this_week") {
                        // Menyertakan overdue, hari ini, hingga 7 hari kedepan
                        matchesFollowup =
                            fDate.getTime() <= next7Days.getTime();
                    }
                }
            }

            return (
                matchesSearch &&
                matchesStatus &&
                matchesSource &&
                matchesFollowup
            );
        });

        // 2. Sort by next_followup_date (Tanggal terdekat berada di atas)
        return result.sort((a, b) => {
            // Jika tidak ada tanggal, beri nilai Infinity agar berada di bagian paling bawah tabel
            const dateA = a.next_followup_date
                ? new Date(a.next_followup_date).getTime()
                : Infinity;
            const dateB = b.next_followup_date
                ? new Date(b.next_followup_date).getTime()
                : Infinity;

            return dateA - dateB;
        });
    }, [leads, searchTerm, statusFilter, sourceFilter, followupFilter]);

    const columns = [
        {
            header: "Name",
            accessor: "name",
            render: (row) => (
                <div>
                    <p className="font-medium text-gray-900">{row.name}</p>
                    <p className="text-xs text-gray-500">{row.email || "-"}</p>
                </div>
            ),
        },
        { header: "Phone", accessor: "phone", className: "whitespace-nowrap" },
        {
            header: "Source",
            accessor: "source",
            render: (row) => row.source || "-",
        },
        {
            header: "Status",
            accessor: "status",
            render: (row) => {
                const currentStatus = leadStatuses.find(
                    (s) =>
                        s.name &&
                        row.status &&
                        s.name.toLowerCase() === row.status.toLowerCase(),
                );

                if (!currentStatus) {
                    return (
                        <StatusBadge>
                            {row.status ? row.status.toUpperCase() : "UNKNOWN"}
                        </StatusBadge>
                    );
                }

                return (
                    <StatusBadge
                        backgroundColor={currentStatus.bg_color}
                        color={currentStatus.text_color}
                    >
                        {currentStatus.name.toUpperCase()}
                    </StatusBadge>
                );
            },
        },
        {
            header: "Temperature",
            accessor: "temperature",
            render: (row) => {
                const temp = row.temperature || "warm";
                const colors = {
                    cold: "bg-blue-50 text-blue-700 ring-blue-600/20",
                    warm: "bg-amber-50 text-amber-700 ring-amber-600/20",
                    hot: "bg-red-50 text-red-700 ring-red-600/20",
                };

                return (
                    <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${colors[temp]}`}
                    >
                        {temp.charAt(0).toUpperCase() + temp.slice(1)}
                    </span>
                );
            },
        },
        {
            header: "Next Follow-up",
            accessor: "next_followup_date",
            render: (row) => {
                if (!row.next_followup_date) {
                    return <span className="text-xs text-gray-400">-</span>;
                }
                const date = new Date(row.next_followup_date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const dateOnly = new Date(date);
                dateOnly.setHours(0, 0, 0, 0);

                const isOverdue = dateOnly < today;

                return (
                    <span
                        className={`text-xs ${isOverdue ? "text-red-600 font-semibold" : "text-gray-500"}`}
                    >
                        {date.toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                );
            },
        },
        {
            header: "",
            accessor: "actions",
            render: (row) => (
                <div className="flex justify-end gap-2">
                    <TableIconButton
                        type="followup"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onFollowupClick) onFollowupClick(row);
                        }}
                    />
                    <TableIconButton
                        type="detail"
                        onClick={() => onRowDetailClick(row.id)}
                    />
                    <TableIconButton
                        type="edit"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onEditClick) onEditClick(row.id);
                        }}
                    />
                    <TableIconButton
                        type="delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onDeleteClick) onDeleteClick(row);
                        }}
                    />
                </div>
            ),
        },
    ];

    const statusOptions = [
        { value: "all", label: "All Status" },
        ...leadStatuses.map((status) => ({
            value: status.name,
            label: status.name,
        })),
    ];

    const sourceOptions = [
        { value: "all", label: "All Sources" },
        ...sources.map((source) => ({
            value: source,
            label: source,
        })),
    ];

    const followupOptions = [
        { value: "all", label: "All Follow-ups" },
        { value: "today", label: "Today & Overdue" },
        { value: "this_week", label: "This Week" },
    ];

    return (
        <Panel
            title="All Leads"
            description="A list of all the leads in your database including their name, email, phone, and status."
        >
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-min-[400px]  ">
                <div className="flex flex-1  gap-3 ">
                    <div className="min-w-72">
                        <SearchInput
                            placeholder="Search by name or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className=""
                        />
                    </div>
                    <div className="min-w-50">
                        <Select
                            value={statusFilter}
                            onChange={(val) => setStatusFilter(val)}
                            options={statusOptions}
                            className="  z-40"
                        />
                    </div>
                    <div className="min-w-50">
                        <Select
                            value={sourceFilter}
                            onChange={(val) => setSourceFilter(val)}
                            options={sourceOptions}
                            className="  z-30"
                        />
                    </div>

                    <div className="min-w-50">
                        <Select
                            value={followupFilter}
                            onChange={(val) => setFollowupFilter(val)}
                            options={followupOptions}
                            className="  z-20"
                        />
                    </div>
                </div>
            </div>
            <DataTable data={filteredLeads} columns={columns} />
        </Panel>
    );
}
