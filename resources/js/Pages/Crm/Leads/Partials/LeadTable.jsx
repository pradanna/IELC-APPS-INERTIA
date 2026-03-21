import React, { Fragment, useState, useMemo } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import Panel from "@/Components/ui/Panel";
import DataTable from "@/Components/ui/DataTable";
import Badge from "@/Components/ui/Badge";
import TableIconButton from "@/Components/ui/TableIconButton";
import { getLeadStatusType } from "@/lib/utils";

export default function LeadTable({
    leads,
    leadStatuses = [],
    onRowDetailClick,
    onEditClick,
    onDeleteClick,
    onStatusUpdate,
    processingStatusUpdate,
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sourceFilter, setSourceFilter] = useState("all");

    const sources = useMemo(() => {
        const uniqueSources = new Set(
            leads.map((l) => l.source).filter(Boolean),
        );
        return Array.from(uniqueSources);
    }, [leads]);

    const filteredLeads = useMemo(() => {
        return leads.filter((lead) => {
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

            return matchesSearch && matchesStatus && matchesSource;
        });
    }, [leads, searchTerm, statusFilter, sourceFilter]);

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

                return (
                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button className="inline-flex w-full items-center justify-center gap-x-1 rounded-md bg-transparent px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1">
                                {currentStatus ? (
                                    <Badge
                                        style={{
                                            backgroundColor:
                                                currentStatus.bg_color,
                                            color: currentStatus.text_color,
                                        }}
                                    >
                                        {currentStatus.name.toUpperCase()}
                                    </Badge>
                                ) : (
                                    <Badge type={getLeadStatusType(row.status)}>
                                        {row.status?.toUpperCase() || "UNKNOWN"}
                                    </Badge>
                                )}
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <div className="px-3 py-2 text-xs font-semibold text-gray-400">
                                        Change status
                                    </div>
                                    {leadStatuses.map((status) => {
                                        const isCurrent =
                                            row.status &&
                                            status.name.toLowerCase() ===
                                                row.status.toLowerCase();
                                        return (
                                            <Menu.Item
                                                key={status.id}
                                                disabled={isCurrent}
                                            >
                                                {({ active, disabled }) => (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onStatusUpdate(
                                                                row.id,
                                                                status.id,
                                                            )
                                                        }
                                                        disabled={
                                                            processingStatusUpdate ||
                                                            disabled
                                                        }
                                                        className={`${
                                                            active
                                                                ? "bg-gray-100 text-gray-900"
                                                                : "text-gray-700"
                                                        } ${
                                                            disabled
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : ""
                                                        } flex items-center gap-2 w-full text-left px-4 py-2 text-sm capitalize`}
                                                    >
                                                        <span
                                                            className="w-2 h-2 rounded-full border border-gray-300"
                                                            style={{
                                                                backgroundColor:
                                                                    status.bg_color ||
                                                                    "#d1d5db",
                                                            }}
                                                        ></span>
                                                        {status.name}
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        );
                                    })}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                );
            },
        },
        {
            header: "Created At",
            accessor: "created_at",
            render: (row) => (
                <span className="text-xs text-gray-500">
                    {new Date(row.created_at).toLocaleDateString()}
                </span>
            ),
        },
        {
            header: "",
            accessor: "actions",
            render: (row) => (
                <div className="flex justify-end gap-2">
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

    return (
        <Panel
            title="All Leads"
            description="A list of all the leads in your database including their name, email, phone, and status."
        >
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 flex-col gap-4 sm:flex-row">
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                        <option value="all">All Status</option>
                        {leadStatuses.map((status) => (
                            <option key={status.id} value={status.name}>
                                {status.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                        <option value="all">All Sources</option>
                        {sources.map((source) => (
                            <option key={source} value={source}>
                                {source}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <DataTable data={filteredLeads} columns={columns} />
        </Panel>
    );
}
