import React, { useState, useEffect, useCallback, useRef } from "react";
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

import CrmDashboard from "./Partials/CrmDashboard";
import LeadTable from "./Partials/LeadTable";
import LeadKanban from "./Partials/LeadKanban";
import LeadDetailPanel from "./Partials/Detail";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import Modal from "@/Components/ui/Modal";
import InputLabel from "@/Components/ui/InputLabel";
import TextInput from "@/Components/ui/TextInput";
import TextArea from "@/Components/ui/TextArea";
import Select from "react-select";
import { toTitleCase } from "@/lib/utils";

export default function Index({
    auth,
    filters,
    stats,
    timeline,
    leads,
    branches = [],
    leadSources = [],
    levels = [],
    packages = [],
    leadStatuses = [],
}) {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [dropdownResults, setDropdownResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [leadToEdit, setLeadToEdit] = useState(null);
    const [leadToDelete, setLeadToDelete] = useState(null);
    const searchContainerRef = useRef(null);

    const { put, processing } = useForm(); // Untuk status update inline
    const deleteForm = useForm();

    const createForm = useForm({
        name: "",
        phone: "",
        email: "",
        dob: "",
        address: "",
        parent_name: "",
        parent_phone: "",
        branch_id: "",
        lead_source_id: "",
        interest_level_id: "",
        interest_package_id: "",
        notes: "",
    });

    const editForm = useForm({
        name: "",
        phone: "",
        email: "",
        dob: "",
        address: "",
        parent_name: "",
        parent_phone: "",
        branch_id: "",
        lead_source_id: "",
        interest_level_id: "",
        interest_package_id: "",
        notes: "",
    });

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        createForm.post(route("superadmin.crm.leads.store"), {
            onSuccess: (page) => {
                createForm.reset();
                setIsCreateOpen(false);

                // Otomatis buka side panel detail menggunakan lead terbaru di list
                const newLead = page.props.leads[0];
                if (newLead) {
                    handleShowLeadDetail(newLead.id);
                }
            },
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        // Asumsikan route 'superadmin.crm.leads.update' sudah ada
        editForm.put(route("superadmin.crm.leads.update", leadToEdit.id), {
            preserveScroll: true,
            onSuccess: () => {
                setLeadToEdit(null);
                editForm.reset();
                if (selectedLead?.id === leadToEdit.id) {
                    handleShowLeadDetail(leadToEdit.id);
                }
            },
        });
    };

    const handleDeleteClick = (lead) => {
        setLeadToDelete(lead);
    };

    const handleDeleteSubmit = () => {
        deleteForm.delete(
            route("superadmin.crm.leads.destroy", leadToDelete.id),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setLeadToDelete(null);
                    if (selectedLead?.id === leadToDelete.id) {
                        setSelectedLead(null);
                    }
                },
            },
        );
    };

    const handleStatusUpdate = (leadId, newStatus) => {
        put(
            route("superadmin.crm.leads.status.update", { lead: leadId }),
            {
                status: newStatus,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // The page will auto-reload the new props, no need to manually update state
                },
            },
        );
    };

    // Debounce untuk filter data utama di tabel & kanban
    const handleSearch = useCallback((query) => {
        router.get(
            route("superadmin.crm.leads.index"),
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
                .get(
                    route("superadmin.crm.leads.search", { query: searchTerm }),
                )
                .then((response) => {
                    setDropdownResults(response.data);
                    setIsDropdownOpen(response.data.length > 0);
                });
        }, 250); // Cepat untuk popup dropdown

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

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

        axios
            .get(route("superadmin.crm.leads.show", { lead: leadId }))
            .then((response) => {
                setSelectedLead(response.data.data);
            });
    };

    const handleEditClick = (leadId) => {
        axios
            .get(route("superadmin.crm.leads.show", { lead: leadId }))
            .then((response) => {
                const leadData = response.data.data;
                editForm.setData({
                    name: leadData.name || "",
                    phone: leadData.phone || "",
                    email: leadData.email || "",
                    dob: leadData.dob || "",
                    address: leadData.address || "",
                    parent_name: leadData.parent_name || "",
                    parent_phone: leadData.parent_phone || "",
                    branch_id: leadData.branch_id || "",
                    lead_source_id: leadData.lead_source_id || "",
                    interest_level_id: leadData.interest_level_id || "",
                    interest_package_id: leadData.interest_package_id || "",
                    notes: leadData.notes || "",
                });
                setLeadToEdit(leadData);
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
        <SuperAdminLayout user={auth.user}>
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
                            href={route("superadmin.crm.leads.export", {
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
                {activeTab === "dashboard" && (
                    <CrmDashboard stats={stats} timeline={timeline} />
                )}
                {activeTab === "table" && (
                    <LeadTable
                        leads={leads}
                        leadStatuses={leadStatuses}
                        onRowDetailClick={handleShowLeadDetail}
                        onEditClick={handleEditClick}
                        onDeleteClick={handleDeleteClick}
                        onStatusUpdate={handleStatusUpdate}
                        processingStatusUpdate={processing}
                    />
                )}
                {activeTab === "kanban" && (
                    <LeadKanban
                        leads={leads}
                        onCardClick={handleShowLeadDetail}
                        onEditClick={handleEditClick}
                        onDeleteClick={handleDeleteClick}
                    />
                )}
            </div>
            <LeadDetailPanel
                lead={selectedLead}
                open={!!selectedLead}
                onClose={() => setSelectedLead(null)}
            />

            {/* Create Lead Modal */}
            <Modal
                show={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Add New Lead"
                maxWidth="4xl"
            >
                <form onSubmit={handleCreateSubmit} className="space-y-6">
                    {/* Section: Personal Info */}
                    <div className="border-b border-gray-200 pb-2">
                        <h3 className="text-sm font-semibold leading-6 text-gray-900">
                            Personal Information
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                        {/* Name (Required) */}
                        <div>
                            <InputLabel htmlFor="name">
                                Name <span className="text-red-500">*</span>
                            </InputLabel>
                            <div className="mt-1">
                                <TextInput
                                    id="name"
                                    value={createForm.data.name}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "name",
                                            toTitleCase(e.target.value),
                                        )
                                    }
                                    isFocused={true}
                                />
                                {createForm.errors.name && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {createForm.errors.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Phone (Required) */}
                        <div>
                            <InputLabel htmlFor="phone">
                                Phone <span className="text-red-500">*</span>
                            </InputLabel>
                            <div className="mt-1">
                                <TextInput
                                    id="phone"
                                    value={createForm.data.phone}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "phone",
                                            e.target.value,
                                        )
                                    }
                                />
                                {createForm.errors.phone && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {createForm.errors.phone}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <div className="mt-1">
                                <TextInput
                                    id="email"
                                    type="email"
                                    value={createForm.data.email}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "email",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <InputLabel htmlFor="dob">Date of Birth</InputLabel>
                            <div className="mt-1">
                                <TextInput
                                    id="dob"
                                    type="date"
                                    value={createForm.data.dob}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "dob",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>

                        {/* Parent Name */}
                        <div>
                            <InputLabel htmlFor="parent_name">
                                Parent's Name
                            </InputLabel>
                            <div className="mt-1">
                                <TextInput
                                    id="parent_name"
                                    value={createForm.data.parent_name}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "parent_name",
                                            toTitleCase(e.target.value),
                                        )
                                    }
                                />
                            </div>
                        </div>

                        {/* Parent Phone */}
                        <div>
                            <InputLabel htmlFor="parent_phone">
                                Parent's Phone
                            </InputLabel>
                            <div className="mt-1">
                                <TextInput
                                    id="parent_phone"
                                    value={createForm.data.parent_phone}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "parent_phone",
                                            e.target.value,
                                        )
                                    }
                                />
                                {createForm.errors.parent_phone && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {createForm.errors.parent_phone}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Address (Full Width) */}
                    <div>
                        <InputLabel htmlFor="address">Address</InputLabel>
                        <div className="mt-1">
                            <TextArea
                                id="address"
                                rows={2}
                                value={createForm.data.address}
                                onChange={(e) =>
                                    createForm.setData(
                                        "address",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                    </div>

                    {/* Section: Interest Info */}
                    <div className="border-b border-gray-200 pb-2 mt-2">
                        <h3 className="text-sm font-semibold leading-6 text-gray-900">
                            Lead Details
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                        {/* Branch (Required) */}
                        <div>
                            <InputLabel htmlFor="branch_id">
                                Branch <span className="text-red-500">*</span>
                            </InputLabel>
                            <div className="mt-1">
                                <Select
                                    id="branch_id"
                                    styles={reactSelectStyles}
                                    menuPosition="fixed"
                                    options={branches.map((b) => ({
                                        value: b.id,
                                        label: b.name,
                                    }))}
                                    value={
                                        branches
                                            .map((b) => ({
                                                value: b.id,
                                                label: b.name,
                                            }))
                                            .find(
                                                (opt) =>
                                                    opt.value ===
                                                    createForm.data.branch_id,
                                            ) || null
                                    }
                                    onChange={(opt) =>
                                        createForm.setData(
                                            "branch_id",
                                            opt ? opt.value : "",
                                        )
                                    }
                                    placeholder="Select Branch"
                                    isClearable
                                    className="w-full"
                                />
                                {createForm.errors.branch_id && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {createForm.errors.branch_id}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Lead Source */}
                        <div>
                            <InputLabel htmlFor="lead_source_id">
                                Lead Source
                            </InputLabel>
                            <div className="mt-1">
                                <Select
                                    id="lead_source_id"
                                    styles={reactSelectStyles}
                                    menuPosition="fixed"
                                    options={leadSources.map((s) => ({
                                        value: s.id,
                                        label: s.name,
                                    }))}
                                    value={
                                        leadSources
                                            .map((s) => ({
                                                value: s.id,
                                                label: s.name,
                                            }))
                                            .find(
                                                (opt) =>
                                                    opt.value ===
                                                    createForm.data
                                                        .lead_source_id,
                                            ) || null
                                    }
                                    onChange={(opt) =>
                                        createForm.setData(
                                            "lead_source_id",
                                            opt ? opt.value : "",
                                        )
                                    }
                                    placeholder="Select Source"
                                    isClearable
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Interested Level */}
                        <div>
                            <InputLabel htmlFor="interest_level_id">
                                Interested Level
                            </InputLabel>
                            <div className="mt-1">
                                <Select
                                    id="interest_level_id"
                                    styles={reactSelectStyles}
                                    menuPosition="fixed"
                                    options={levels.map((l) => ({
                                        value: l.id,
                                        label: l.name,
                                    }))}
                                    value={
                                        levels
                                            .map((l) => ({
                                                value: l.id,
                                                label: l.name,
                                            }))
                                            .find(
                                                (opt) =>
                                                    opt.value ===
                                                    createForm.data
                                                        .interest_level_id,
                                            ) || null
                                    }
                                    onChange={(opt) =>
                                        createForm.setData(
                                            "interest_level_id",
                                            opt ? opt.value : "",
                                        )
                                    }
                                    placeholder="Select Level"
                                    isClearable
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Interested Package */}
                        <div>
                            <InputLabel htmlFor="interest_package_id">
                                Interested Package
                            </InputLabel>
                            <div className="mt-1">
                                <Select
                                    id="interest_package_id"
                                    styles={reactSelectStyles}
                                    menuPosition="fixed"
                                    options={packages.map((p) => ({
                                        value: p.id,
                                        label: p.name,
                                    }))}
                                    value={
                                        packages
                                            .map((p) => ({
                                                value: p.id,
                                                label: p.name,
                                            }))
                                            .find(
                                                (opt) =>
                                                    opt.value ===
                                                    createForm.data
                                                        .interest_package_id,
                                            ) || null
                                    }
                                    onChange={(opt) =>
                                        createForm.setData(
                                            "interest_package_id",
                                            opt ? opt.value : "",
                                        )
                                    }
                                    placeholder="Select Package"
                                    isClearable
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <InputLabel htmlFor="notes">Notes</InputLabel>
                        <div className="mt-1">
                            <TextArea
                                id="notes"
                                rows={3}
                                value={createForm.data.notes}
                                onChange={(e) =>
                                    createForm.setData("notes", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                            type="submit"
                            disabled={createForm.processing}
                            className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:col-start-2 disabled:opacity-50"
                        >
                            {createForm.processing ? "Saving..." : "Save Lead"}
                        </button>
                        <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                            onClick={() => setIsCreateOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Lead Modal */}
            <Modal
                show={!!leadToEdit}
                onClose={() => setLeadToEdit(null)}
                title="Edit Lead"
                maxWidth="4xl"
            >
                <form onSubmit={handleEditSubmit} className="space-y-6">
                    {/* Section: Personal Info */}
                    <div className="border-b border-gray-200 pb-2">
                        <h3 className="text-sm font-semibold leading-6 text-gray-900">
                            Personal Information
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                        {/* Name (Required) */}
                        <div>
                            <InputLabel htmlFor="edit_name">
                                Name <span className="text-red-500">*</span>
                            </InputLabel>
                            <div className="mt-1">
                                <TextInput
                                    id="edit_name"
                                    value={editForm.data.name}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "name",
                                            toTitleCase(e.target.value),
                                        )
                                    }
                                    isFocused={true}
                                />
                                {editForm.errors.name && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {editForm.errors.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Phone (Required) */}
                        <div>
                            <InputLabel htmlFor="edit_phone">
                                Phone <span className="text-red-500">*</span>
                            </InputLabel>
                            <div className="mt-1">
                                <TextInput
                                    id="edit_phone"
                                    value={editForm.data.phone}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "phone",
                                            e.target.value,
                                        )
                                    }
                                />
                                {editForm.errors.phone && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {editForm.errors.phone}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <InputLabel htmlFor="edit_email">Email</InputLabel>
                            <div className="mt-1">
                                <TextInput
                                    id="edit_email"
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "email",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <InputLabel htmlFor="edit_dob">
                                Date of Birth
                            </InputLabel>
                            <div className="mt-1">
                                <TextInput
                                    id="edit_dob"
                                    type="date"
                                    value={editForm.data.dob}
                                    onChange={(e) =>
                                        editForm.setData("dob", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* Parent Name */}
                        <div>
                            <InputLabel htmlFor="edit_parent_name">
                                Parent's Name
                            </InputLabel>
                            <div className="mt-1">
                                <TextInput
                                    id="edit_parent_name"
                                    value={editForm.data.parent_name}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "parent_name",
                                            toTitleCase(e.target.value),
                                        )
                                    }
                                />
                            </div>
                        </div>

                        {/* Parent Phone */}
                        <div>
                            <InputLabel htmlFor="edit_parent_phone">
                                Parent's Phone
                            </InputLabel>
                            <div className="mt-1">
                                <TextInput
                                    id="edit_parent_phone"
                                    value={editForm.data.parent_phone}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "parent_phone",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address (Full Width) */}
                    <div>
                        <InputLabel htmlFor="edit_address">Address</InputLabel>
                        <div className="mt-1">
                            <TextArea
                                id="edit_address"
                                rows={2}
                                value={editForm.data.address}
                                onChange={(e) =>
                                    editForm.setData("address", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Section: Interest Info */}
                    <div className="border-b border-gray-200 pb-2 mt-2">
                        <h3 className="text-sm font-semibold leading-6 text-gray-900">
                            Lead Details
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                        {/* Branch (Required) */}
                        <div>
                            <InputLabel htmlFor="edit_branch_id">
                                Branch <span className="text-red-500">*</span>
                            </InputLabel>
                            <div className="mt-1">
                                <Select
                                    id="edit_branch_id"
                                    styles={reactSelectStyles}
                                    menuPosition="fixed"
                                    options={branches.map((b) => ({
                                        value: b.id,
                                        label: b.name,
                                    }))}
                                    value={
                                        branches
                                            .map((b) => ({
                                                value: b.id,
                                                label: b.name,
                                            }))
                                            .find(
                                                (opt) =>
                                                    opt.value ===
                                                    editForm.data.branch_id,
                                            ) || null
                                    }
                                    onChange={(opt) =>
                                        editForm.setData(
                                            "branch_id",
                                            opt ? opt.value : "",
                                        )
                                    }
                                    placeholder="Select Branch"
                                    isClearable
                                    className="w-full"
                                />
                                {editForm.errors.branch_id && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {editForm.errors.branch_id}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Lead Source */}
                        <div>
                            <InputLabel htmlFor="edit_lead_source_id">
                                Lead Source
                            </InputLabel>
                            <div className="mt-1">
                                <Select
                                    id="edit_lead_source_id"
                                    styles={reactSelectStyles}
                                    menuPosition="fixed"
                                    options={leadSources.map((s) => ({
                                        value: s.id,
                                        label: s.name,
                                    }))}
                                    value={
                                        leadSources
                                            .map((s) => ({
                                                value: s.id,
                                                label: s.name,
                                            }))
                                            .find(
                                                (opt) =>
                                                    opt.value ===
                                                    editForm.data
                                                        .lead_source_id,
                                            ) || null
                                    }
                                    onChange={(opt) =>
                                        editForm.setData(
                                            "lead_source_id",
                                            opt ? opt.value : "",
                                        )
                                    }
                                    placeholder="Select Source"
                                    isClearable
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Interested Level */}
                        <div>
                            <InputLabel htmlFor="edit_interest_level_id">
                                Interested Level
                            </InputLabel>
                            <div className="mt-1">
                                <Select
                                    id="edit_interest_level_id"
                                    styles={reactSelectStyles}
                                    menuPosition="fixed"
                                    options={levels.map((l) => ({
                                        value: l.id,
                                        label: l.name,
                                    }))}
                                    value={
                                        levels
                                            .map((l) => ({
                                                value: l.id,
                                                label: l.name,
                                            }))
                                            .find(
                                                (opt) =>
                                                    opt.value ===
                                                    editForm.data
                                                        .interest_level_id,
                                            ) || null
                                    }
                                    onChange={(opt) =>
                                        editForm.setData(
                                            "interest_level_id",
                                            opt ? opt.value : "",
                                        )
                                    }
                                    placeholder="Select Level"
                                    isClearable
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Interested Package */}
                        <div>
                            <InputLabel htmlFor="edit_interest_package_id">
                                Interested Package
                            </InputLabel>
                            <div className="mt-1">
                                <Select
                                    id="edit_interest_package_id"
                                    styles={reactSelectStyles}
                                    menuPosition="fixed"
                                    options={packages.map((p) => ({
                                        value: p.id,
                                        label: p.name,
                                    }))}
                                    value={
                                        packages
                                            .map((p) => ({
                                                value: p.id,
                                                label: p.name,
                                            }))
                                            .find(
                                                (opt) =>
                                                    opt.value ===
                                                    editForm.data
                                                        .interest_package_id,
                                            ) || null
                                    }
                                    onChange={(opt) =>
                                        editForm.setData(
                                            "interest_package_id",
                                            opt ? opt.value : "",
                                        )
                                    }
                                    placeholder="Select Package"
                                    isClearable
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <InputLabel htmlFor="edit_notes">Notes</InputLabel>
                        <div className="mt-1">
                            <TextArea
                                id="edit_notes"
                                rows={3}
                                value={editForm.data.notes}
                                onChange={(e) =>
                                    editForm.setData("notes", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                            type="submit"
                            disabled={editForm.processing}
                            className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:col-start-2 disabled:opacity-50"
                        >
                            {editForm.processing ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                            onClick={() => setLeadToEdit(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Lead Modal */}
            <Modal
                show={!!leadToDelete}
                onClose={() => setLeadToDelete(null)}
                title="Delete Lead"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Are you sure you want to delete{" "}
                        <span className="font-bold text-gray-900">
                            {leadToDelete?.name}
                        </span>
                        ? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 mt-5 sm:mt-6">
                        <button
                            type="button"
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => setLeadToDelete(null)}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
                            onClick={handleDeleteSubmit}
                            disabled={deleteForm.processing}
                        >
                            {deleteForm.processing ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </Modal>
        </SuperAdminLayout>
    );
}
