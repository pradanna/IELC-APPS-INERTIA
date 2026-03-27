import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
    useMemo,
} from "react";
import { Head, router, useForm } from "@inertiajs/react";
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
import Modal from "@/Components/ui/Modal";
import InputLabel from "@/Components/ui/InputLabel";
import TextArea from "@/Components/ui/TextArea";
import Select from "react-select";
import { toTitleCase } from "@/lib/utils";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TextInput from "@/Components/form/TextInput";

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
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [dropdownResults, setDropdownResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [leadToEdit, setLeadToEdit] = useState(null);
    const [leadToDelete, setLeadToDelete] = useState(null);
    const [leadToFollowup, setLeadToFollowup] = useState(null);
    const searchContainerRef = useRef(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [dynamicPtExams, setDynamicPtExams] = useState(ptExams || []);

    const { processing } = useForm(); // Untuk status update inline

    const [isPtModalOpen, setIsPtModalOpen] = useState(false);
    const [pendingPtUpdate, setPendingPtUpdate] = useState(null);

    // Transformasi data untuk memetakan `lead_status_id` menjadi `status` (string)
    // agar kompatibel dengan seluruh komponen UI yang masih membaca field .status
    const mappedLeads = useMemo(() => {
        return leads.map((lead) => {
            const statusObj = leadStatuses.find(
                (s) => s.id === lead.lead_status_id,
            );
            return {
                ...lead,
                // Fallback otomatis ke "new" jika relasi tidak ditemukan
                status: statusObj ? statusObj.name.toLowerCase() : "new",
            };
        });
    }, [leads, leadStatuses]);

    const handleDeleteClick = (lead) => {
        setLeadToDelete(lead);
    };

    const handleFollowupClick = (lead) => {
        setLeadToFollowup(lead);
    };

    const handleStatusUpdate = (leadId, newStatus) => {
        // Jika status Placement Test dipilih, tahan update & buka modal PT Schedule
        if (newStatus === "c0a80101-0000-0000-0000-000000000004") {
            const leadInfo = mappedLeads.find((l) => l.id === leadId);
            setPendingPtUpdate({ leadId, newStatus, interest_package_id: leadInfo?.interest_package_id || "" });
            setIsPtModalOpen(true);
            return;
        }
        executeStatusUpdate(leadId, newStatus);
    };

    const executeStatusUpdate = (leadId, newStatus, extraData = {}) => {
        router.put(
            route("admin.crm.leads.status.update", { lead: leadId }),
            {
                lead_status_id: newStatus,
                ...extraData,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    // Toast otomatis merespon flash
                },
                onError: (errors) => {
                    console.error("Inertia error triggered!", errors);
                },
                onFinish: () => {
                    setIsPtModalOpen(false);
                    setPendingPtUpdate(null);
                },
            },
        );
    };

    // Ambil data Active PT Exams dari server jika belum ada saat status Placement Test dipilih
    useEffect(() => {
        if (
            (isPtModalOpen || !!leadToFollowup) &&
            dynamicPtExams.length === 0
        ) {
            axios
                .get(route("admin.placement-tests.active"))
                .then((response) => {
                    setDynamicPtExams(response.data);
                })
                .catch((error) => {
                    console.error("Failed to fetch active PT exams", error);
                });
        }
    }, [
        isPtModalOpen,
        leadToFollowup,
        dynamicPtExams.length,
    ]);

    const handleReviewProfile = (leadId, actionType) => {
        router.post(route('admin.crm.leads.review-profile', { lead: leadId }), {
            action: actionType
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                axios
                    .get(route("admin.crm.leads.show", { lead: leadId }))
                    .then((response) => setSelectedLead(response.data.data));
            }
        });
    };

    // Debounce untuk filter data utama di tabel & kanban
    const handleSearch = useCallback((query) => {
        router.get(
            route("admin.crm.leads.index"),
            { search: query },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== (filters.search || "")) {
                handleSearch(searchTerm);
            }
        }, 500); // Delay lebih lama untuk filter list utama
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, filters.search, handleSearch]);

    // Debounce untuk live search dropdown via API
    useEffect(() => {
        if (searchTerm.length < 2) {
            setDropdownResults([]);
            setIsDropdownOpen(false);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            axios
                .get(route("admin.crm.leads.search", { query: searchTerm }))
                .then((response) => {
                    setDropdownResults(response.data);
                    setIsDropdownOpen(response.data.length > 0);
                });
        }, 250); // Cepat untuk popup dropdown

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Syncs the selected lead detail panel with the latest data from props after an update.
    useEffect(() => {
        if (selectedLead) {
            const updatedLead = mappedLeads.find(
                (l) => l.id === selectedLead.id,
            );
            if (updatedLead) {
                setSelectedLead(updatedLead);
            }
        }
    }, [mappedLeads, selectedLead?.id]);

    // Tutup dropdown jika klik di luar
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchContainerRef]);

    // Ambil dan tampilkan detail Lead
    const handleShowLeadDetail = (leadId) => {
        setIsDropdownOpen(false);
        setSearchTerm("");
        setDropdownResults([]);
        // Ambil data lengkap dari server untuk memastikan data history dan follow-up termuat
        axios
            .get(route("admin.crm.leads.show", { lead: leadId }))
            .then((response) => {
                setSelectedLead(response.data.data);
            })
            .catch((err) => {
                console.error("Failed to fetch lead details", err);
                // Berikan umpan balik visual kepada pengguna
                alert(
                    "Maaf, gagal memuat detail lead. Silakan coba beberapa saat lagi.",
                );
            });
    };

    const handleEditClick = (leadId) => {
        axios
            .get(route("admin.crm.leads.show", { lead: leadId }))
            .then((response) => {
                setLeadToEdit(response.data.data);
            });
    };

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "table", label: "List View", icon: TableIcon },
        { id: "kanban", label: "Kanban Board", icon: KanbanSquare },
    ];

    // Custom styling agar React-Select menyatu mulus dengan UI Tailwind Anda
    const reactSelectStyles = {
        control: (base, state) => ({
            ...base,
            border: "0",
            boxShadow: state.isFocused
                ? "0 0 0 2px #4f46e5"
                : "0 0 0 1px #d1d5db",
            borderRadius: "0.5rem",
            padding: "2px 0",
        }),
    };

    return (
        <AdminLayout>
            <Head title="CRM Workspace" />

            <div className="px-4 sm:px-6 lg:px-8  mx-auto space-y-6">
                {/* Header & Controls */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold leading-7 text-gray-900">
                            CRM Workspace
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage incoming leads and track conversions.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:flex sm:items-center gap-4">
                        <div
                            ref={searchContainerRef}
                            className="relative rounded-md shadow-sm z-20"
                        >
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full rounded-lg border-0 py-1.5 pl-10 text-sm focus:outline-none text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:max-w-xs"
                                placeholder="Search leads..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() =>
                                    dropdownResults.length > 0 &&
                                    setIsDropdownOpen(true)
                                }
                            />
                            {isDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5">
                                    <ul className="max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                                        {dropdownResults.map((lead) => (
                                            <li
                                                key={lead.id}
                                                onClick={() =>
                                                    handleShowLeadDetail(
                                                        lead.id,
                                                    )
                                                }
                                                className="text-gray-900 cursor-pointer select-none relative py-2 pl-4 pr-4 hover:bg-primary-50"
                                            >
                                                <p className="font-medium truncate">
                                                    {lead.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {lead.phone}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <a
                            href={route("admin.crm.leads.export", {
                                search: searchTerm,
                            })}
                            className="inline-flex items-center gap-x-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            <Download
                                className="-ml-0.5 h-4 w-4 text-gray-400"
                                aria-hidden="true"
                            />
                            Export
                        </a>

                        <button
                            type="button"
                            onClick={() => setIsCreateOpen(true)}
                            className="inline-flex items-center gap-x-2 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                        >
                            <Plus
                                className="-ml-0.5 h-4 w-4"
                                aria-hidden="true"
                            />
                            New Lead
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        group inline-flex items-center border-b-2 py-3 px-1 text-sm font-medium
                                        ${
                                            isActive
                                                ? "border-primary-500 text-primary-600"
                                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                        }
                                    `}
                                >
                                    <Icon
                                        className={`mr-2 h-4 w-4 ${isActive ? "text-primary-500" : "text-gray-400 group-hover:text-gray-500"}`}
                                    />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                <Transition
                    show={activeTab === "dashboard"}
                    enter="transition ease-out duration-400 transform"
                    enterFrom="opacity-0 translate-y-4"
                    enterTo="opacity-100 translate-y-0"
                >
                    <div>
                        <CrmDashboard
                            stats={stats}
                            leads={mappedLeads}
                            onRowDetailClick={handleShowLeadDetail}
                            monthlyTarget={monthlyTarget}
                            monthlyTargets={monthlyTargets}
                            branches={branches}
                            onKpiClick={(filterVal) => {
                                setStatusFilter(filterVal);
                                setActiveTab("table");
                            }}
                        />
                    </div>
                </Transition>
                <Transition
                    show={activeTab === "table"}
                    enter="transition ease-out duration-400 transform"
                    enterFrom="opacity-0 translate-y-4"
                    enterTo="opacity-100 translate-y-0"
                >
                    <div>
                        <LeadTable
                            leads={mappedLeads}
                            leadStatuses={leadStatuses}
                            onRowDetailClick={handleShowLeadDetail}
                            onEditClick={handleEditClick}
                            onDeleteClick={handleDeleteClick}
                            onFollowupClick={handleFollowupClick}
                            onStatusUpdate={handleStatusUpdate}
                            processingStatusUpdate={processing}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                        />
                    </div>
                </Transition>
                <Transition
                    show={activeTab === "kanban"}
                    enter="transition ease-out duration-400 transform"
                    enterFrom="opacity-0 translate-y-4"
                    enterTo="opacity-100 translate-y-0"
                >
                    <div>
                        <LeadKanban
                            leads={mappedLeads}
                            onCardClick={handleShowLeadDetail}
                            onEditClick={handleEditClick}
                            onDeleteClick={handleDeleteClick}
                        />
                    </div>
                </Transition>
            </div>
            <LeadDetailPanel
                lead={selectedLead}
                open={!!selectedLead}
                onClose={() => setSelectedLead(null)}
                leadStatuses={leadStatuses}
                onStatusUpdate={handleStatusUpdate}
                onFollowupClick={handleFollowupClick}
                onEditClick={handleEditClick}
                onReviewProfile={handleReviewProfile}
            />

            {/* Create Lead Modal */}
            <CreateLeadModal
                show={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={(newId) => {
                    setIsCreateOpen(false);
                    if (newId) handleShowLeadDetail(newId);
                }}
                branches={branches}
                leadSources={leadSources}
                levels={levels}
                packages={packages}
            />

            <EditLeadModal
                show={!!leadToEdit}
                onClose={() => setLeadToEdit(null)}
                onSuccess={() => {
                    if (selectedLead?.id === leadToEdit?.id) {
                        handleShowLeadDetail(leadToEdit.id);
                    }
                    setLeadToEdit(null);
                }}
                leadToEdit={leadToEdit}
                branches={branches}
                leadSources={leadSources}
                levels={levels}
                packages={packages}
            />

            <DeleteLeadModal
                show={!!leadToDelete}
                onClose={() => setLeadToDelete(null)}
                onSuccess={() => {
                    if (selectedLead?.id === leadToDelete?.id) {
                        setSelectedLead(null);
                    }
                    setLeadToDelete(null);
                }}
                leadToDelete={leadToDelete}
            />

            <FollowupLeadModal
                show={!!leadToFollowup}
                onClose={() => setLeadToFollowup(null)}
                onSuccess={() => setLeadToFollowup(null)}
                leadToFollowup={leadToFollowup}
                leadStatuses={leadStatuses}
                packages={packages}
                dynamicPtExams={dynamicPtExams}
            />

            <PtScheduleModal
                show={isPtModalOpen}
                onClose={() => {
                    setIsPtModalOpen(false);
                    setPendingPtUpdate(null);
                }}
                pendingPtUpdate={pendingPtUpdate}
                executeStatusUpdate={executeStatusUpdate}
                packages={packages}
                dynamicPtExams={dynamicPtExams}
            />
        </AdminLayout>
    );
}
