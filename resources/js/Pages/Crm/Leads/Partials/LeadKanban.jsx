import React from "react";
import Badge from "@/Components/ui/Badge";
import { MessageCircle, Pencil, Trash2, MapPin, Search, Thermometer, Filter } from "lucide-react";
import { router } from "@inertiajs/react";
import ExportButton from "./ExportButton";
import Card from "@/Components/ui/Card";

export default function LeadKanban({
    leads,
    onCardClick,
    onEditClick,
    onDeleteClick,
    branches = [],
    leadSources = [],
    filters = {},
}) {
    // Helper to handle filter updates (Global URL State)
    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        // If searching, clear filters? No, keep them.
        router.get(route("admin.crm.leads.index"), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // Columns
    const columns = [
        "new",
        "contacted",
        "follow up",
        "placement test",
        "joined",
        "lost",
    ];

    const getLeadsByStatus = (status) => {
        return leads.filter((lead) => lead.status === status);
    };

    return (
        <div className="space-y-6">
            {/* Kanban Header with Filter - Static (Not Scrolling) */}
            <Card className="p-4 bg-white/95 backdrop-blur-sm shadow-sm ring-1 ring-primary-500/10 rounded-xl border-0 w-fit">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-lg text-primary-600">
                        <Filter className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Board Filters</span>
                    </div>

                    {/* Branch Filter */}
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 bg-white hover:bg-gray-50/50 hover:border-gray-400 transition-all shadow-sm">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <select
                            value={filters.branch_id || "all"}
                            onChange={(e) => handleFilterChange("branch_id", e.target.value)}
                            className="block w-full sm:w-auto border-0 py-1.5 pl-1 pr-8 text-xs focus:ring-0 focus:outline-none bg-transparent cursor-pointer font-medium"
                        >
                            <option value="all">All Branches</option>
                            {branches.map((b) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Lead Source Filter */}
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 bg-white hover:bg-gray-50/50 hover:border-gray-400 transition-all shadow-sm">
                        <Search className="h-4 w-4 text-gray-400" />
                        <select
                            value={filters.lead_source_id || "all"}
                            onChange={(e) => handleFilterChange("lead_source_id", e.target.value)}
                            className="block w-full sm:w-auto border-0 py-1.5 pl-1 pr-8 text-xs focus:ring-0 focus:outline-none bg-transparent cursor-pointer font-medium"
                        >
                            <option value="all">All Sources</option>
                            {leadSources.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Temperature Filter */}
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 bg-white hover:bg-gray-50/50 hover:border-gray-400 transition-all shadow-sm">
                        <Thermometer className="h-4 w-4 text-gray-400" />
                        <select
                            value={filters.temperature || "all"}
                            onChange={(e) => handleFilterChange("temperature", e.target.value)}
                            className="block w-full sm:w-auto border-0 py-1.5 pl-1 pr-8 text-xs focus:ring-0 focus:outline-none bg-transparent cursor-pointer font-medium"
                        >
                            <option value="all">All Temperatures</option>
                            <option value="cold">Cold</option>
                            <option value="warm">Warm</option>
                            <option value="hot">Hot</option>
                        </select>
                    </div>

                    {/* Export Button */}
                    <div className="ml-2">
                        <ExportButton filters={filters} />
                    </div>
                </div>
            </Card>

            <div className="w-full overflow-x-auto pb-10 pt-2 scrollbar-thin scrollbar-thumb-gray-200 scroll-smooth">
                <div className="flex items-start gap-5 min-w-max pr-6">
                    {columns.map((col) => {
                        const columnLeads = getLeadsByStatus(col);
                        return (
                            <div
                                key={col}
                                className="w-[300px] flex-shrink-0 flex flex-col bg-gray-100/50 rounded-xl p-3 border border-gray-200/60"
                            >
                                {/* Column Header */}
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
                                        {col.replace("-", " ")}
                                    </h3>
                                    <span className="bg-gray-200 text-gray-600 py-0.5 px-2 rounded-full text-xs font-medium">
                                        {columnLeads.length}
                                    </span>
                                </div>

                                {/* Column Cards */}
                                <div className="flex flex-col gap-3">
                                    {columnLeads.map((lead) => (
                                        <div
                                            key={lead.id}
                                            className="group bg-white p-3 rounded-xl shadow-sm ring-1 ring-gray-900/5 cursor-pointer hover:shadow-md transition-shadow"
                                            onClick={() =>
                                                onCardClick && onCardClick(lead.id)
                                            }
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-sm font-medium text-gray-900 leading-tight flex items-center gap-1.5 flex-wrap">
                                                    {lead.name}
                                                    {lead.is_profile_pending && (
                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800" title="Ada pembaruan profil tertunda">
                                                            Update
                                                        </span>
                                                    )}
                                                </h4>
                                                <Badge>
                                                    {lead.source || "Unknown"}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <MessageCircle size={14} />
                                                    <span>{lead.phone || "-"}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (onEditClick)
                                                            onEditClick(lead.id);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Edit Lead"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (onDeleteClick)
                                                            onDeleteClick(lead);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Delete Lead"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
