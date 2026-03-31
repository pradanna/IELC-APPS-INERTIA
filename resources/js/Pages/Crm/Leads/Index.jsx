import React, {
    useState,
    useEffect,
    useMemo,
} from "react";
import { Head, useForm } from "@inertiajs/react";
import {
    Search,
    LayoutDashboard,
    Table as TableIcon,
    KanbanSquare,
    Plus,
    Download,
} from "lucide-react";
import axios from "axios";
import { Transition } from "@headlessui/react";

import CrmDashboard from "./Partials/CrmDashboard";
import LeadTable from "./Partials/LeadTable";
import LeadKanban from "./Partials/LeadKanban";
import LeadDetailPanel from "./Partials/Detail";
import AdminLayout from "@/Layouts/AdminLayout";
import { useLeadModals } from "./Hooks/useLeadModals";
import { useLeadSearch } from "./Hooks/useLeadSearch";

import CreateLeadModal from "./Modals/CreateLeadModal";
import EditLeadModal from "./Modals/EditLeadModal";
import DeleteLeadModal from "./Modals/DeleteLeadModal";
import FollowupLeadModal from "./Modals/FollowupLeadModal";
import PtScheduleModal from "./Modals/PtScheduleModal";

export default function Index({
    auth,
    filters,
    stats,
    leads,
    branches = [],
    leadSources = [],
    levels = [],
    packages = [],
    leadStatuses = [],
    ptExams = [],
    monthlyTarget = 0,
    monthlyTargets = [],
}) {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [statusFilter, setStatusFilter] = useState("all");

    const { processing } = useForm();

    const mappedLeads = useMemo(() => {
        return leads.map((lead) => {
            const statusObj = leadStatuses.find((s) => s.id === lead.lead_status_id);
            return {
                ...lead,
                status: statusObj ? statusObj.name.toLowerCase() : "new",
            };
        });
    }, [leads, leadStatuses]);

    // Custom hooks for search and modals
    const search = useLeadSearch(filters);
    const modal = useLeadModals(mappedLeads, ptExams);

    const handleShowLeadDetail = (leadId) => {
        search.setIsDropdownOpen(false);
        search.setSearchTerm("");
        search.setDropdownResults([]);
        modal.handleShowLeadDetail(leadId);
    };

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "table", label: "List View", icon: TableIcon },
        { id: "kanban", label: "Kanban Board", icon: KanbanSquare },
    ];

    return (
        <AdminLayout>
            <Head title="CRM Workspace" />

            <div className="px-4 sm:px-6 lg:px-8 w-full space-y-6">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold leading-7 text-gray-900">CRM Workspace</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage incoming leads and track conversions.</p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:flex sm:items-center gap-4">
                        <div ref={search.searchContainerRef} className="relative rounded-md shadow-sm z-20">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full rounded-lg border-0 py-1.5 pl-10 text-sm focus:outline-none text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:max-w-xs"
                                placeholder="Search leads..."
                                value={search.searchTerm}
                                onChange={(e) => search.setSearchTerm(e.target.value)}
                                onFocus={() => search.dropdownResults.length > 0 && search.setIsDropdownOpen(true)}
                            />
                            {search.isDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5">
                                    <ul className="max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                                        {search.dropdownResults.map((lead) => (
                                            <li key={lead.id} onClick={() => handleShowLeadDetail(lead.id)} className="text-gray-900 cursor-pointer select-none relative py-2 pl-4 pr-4 hover:bg-primary-50">
                                                <p className="font-medium truncate">{lead.name}</p>
                                                <p className="text-xs text-gray-500">{lead.phone}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>


                        <button onClick={() => modal.setIsCreateOpen(true)} className="inline-flex items-center gap-x-2 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                            <Plus className="-ml-0.5 h-4 w-4" />
                            New Lead
                        </button>
                    </div>
                </div>

                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`group inline-flex items-center border-b-2 py-3 px-1 text-sm font-medium ${isActive ? "border-primary-500 text-primary-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}>
                                    <Icon className={`mr-2 h-4 w-4 ${isActive ? "text-primary-500" : "text-gray-400 group-hover:text-gray-500"}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <Transition show={activeTab === "dashboard"} enter="transition ease-out duration-400 transform" enterFrom="opacity-0 translate-y-4" enterTo="opacity-100 translate-y-0">
                    <div>
                        <CrmDashboard stats={stats} leads={mappedLeads} onRowDetailClick={handleShowLeadDetail} monthlyTarget={monthlyTarget} monthlyTargets={monthlyTargets} branches={branches} leadSources={leadSources} filters={filters} onKpiClick={(filterVal) => { setStatusFilter(filterVal); setActiveTab("table"); }} />
                    </div>
                </Transition>

                <Transition show={activeTab === "table"} enter="transition ease-out duration-400 transform" enterFrom="opacity-0 translate-y-4" enterTo="opacity-100 translate-y-0">
                    <div>
                        <LeadTable 
                            leads={mappedLeads} 
                            leadStatuses={leadStatuses} 
                            onRowDetailClick={handleShowLeadDetail} 
                            onEditClick={modal.handleEditClick} 
                            onDeleteClick={modal.setLeadToDelete} 
                            onFollowupClick={modal.setLeadToFollowup} 
                            onStatusUpdate={modal.handleStatusUpdate} 
                            processingStatusUpdate={processing} 
                            statusFilter={statusFilter} 
                            setStatusFilter={setStatusFilter} 
                            filters={filters}
                        />
                    </div>
                </Transition>

                <Transition show={activeTab === "kanban"} enter="transition ease-out duration-400 transform" enterFrom="opacity-0 translate-y-4" enterTo="opacity-100 translate-y-0">
                    <div>
                        <LeadKanban 
                            leads={mappedLeads} 
                            onCardClick={handleShowLeadDetail} 
                            onEditClick={modal.handleEditClick} 
                            onDeleteClick={modal.setLeadToDelete}
                            branches={branches}
                            leadSources={leadSources}
                            filters={filters}
                        />
                    </div>
                </Transition>
            </div>

            <LeadDetailPanel
                lead={modal.selectedLead}
                open={!!modal.selectedLead}
                onClose={() => modal.setSelectedLead(null)}
                leadStatuses={leadStatuses}
                branches={branches}
                leadSources={leadSources}
                levels={levels}
                packages={packages}
                onStatusUpdate={modal.handleStatusUpdate}
                onFollowupClick={modal.setLeadToFollowup}
                onEditClick={modal.handleEditClick}
                onReviewProfile={modal.handleReviewProfile}
                onRefresh={modal.handleShowLeadDetail}
            />

            <CreateLeadModal
                show={modal.isCreateOpen}
                onClose={() => modal.setIsCreateOpen(false)}
                onSuccess={(newId) => {
                    modal.setIsCreateOpen(false);
                    if (newId) handleShowLeadDetail(newId);
                }}
                branches={branches}
                leadSources={leadSources}
                levels={levels}
                packages={packages}
            />

            <EditLeadModal
                show={!!modal.leadToEdit}
                onClose={() => modal.setLeadToEdit(null)}
                onSuccess={() => {
                    if (modal.selectedLead?.id === modal.leadToEdit?.id) {
                        handleShowLeadDetail(modal.leadToEdit.id);
                    }
                    modal.setLeadToEdit(null);
                }}
                leadToEdit={modal.leadToEdit}
                branches={branches}
                leadSources={leadSources}
                levels={levels}
                packages={packages}
            />

            <DeleteLeadModal
                show={!!modal.leadToDelete}
                onClose={() => modal.setLeadToDelete(null)}
                onSuccess={() => {
                    if (modal.selectedLead?.id === modal.leadToDelete?.id) {
                        modal.setSelectedLead(null);
                    }
                    modal.setLeadToDelete(null);
                }}
                leadToDelete={modal.leadToDelete}
            />

            <FollowupLeadModal
                show={!!modal.leadToFollowup}
                onClose={() => modal.setLeadToFollowup(null)}
                onSuccess={() => modal.setLeadToFollowup(null)}
                leadToFollowup={modal.leadToFollowup}
                leadStatuses={leadStatuses}
                packages={packages}
                dynamicPtExams={modal.dynamicPtExams}
            />

            <PtScheduleModal
                show={modal.isPtModalOpen}
                onClose={() => {
                    modal.setIsPtModalOpen(false);
                    modal.setPendingPtUpdate(null);
                }}
                pendingPtUpdate={modal.pendingPtUpdate}
                executeStatusUpdate={modal.executeStatusUpdate}
                packages={packages}
                dynamicPtExams={modal.dynamicPtExams}
            />
        </AdminLayout>
    );
}
