import React from "react";
import Badge from "@/Components/ui/Badge";
import { MessageCircle, Clock, Pencil, Trash2 } from "lucide-react";

export default function LeadKanban({
    leads,
    onCardClick,
    onEditClick,
    onDeleteClick,
}) {
    // Define columns to render mapping the DB lead_statuses
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
        <div className="flex items-start gap-4 overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
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
                                        <h4 className="text-sm font-medium text-gray-900 leading-tight">
                                            {lead.name}
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
    );
}
