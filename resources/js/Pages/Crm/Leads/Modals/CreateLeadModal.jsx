import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/ui/Modal";
import InputLabel from "@/Components/ui/InputLabel";
import TextInput from "@/Components/form/TextInput";
import TextArea from "@/Components/ui/TextArea";
import Select from "react-select";
import DatePicker from "@/Components/form/DatePicker";

import { toTitleCase } from "@/lib/utils";

export default function CreateLeadModal({
    show,
    onClose,
    onSuccess,
    branches = [],
    leadSources = [],
    levels = [],
    packages = [],
}) {
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
        temperature: "warm",
        notes: "",
    });

    // Reset form when modal opens
    useEffect(() => {
        if (show) {
            createForm.reset();
            createForm.clearErrors();
        }
    }, [show]);

    const handleSubmit = (e) => {
        e.preventDefault();
        createForm.post(route("admin.crm.leads.store"), {
            onSuccess: (page) => {
                createForm.reset();
                onClose();
                const newLead = page.props.leads[0];
                if (newLead && onSuccess) {
                    onSuccess(newLead.id);
                }
            },
        });
    };

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
        menuPortal: (base) => ({ ...base, zIndex: 20000 }),
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Add New Lead"
            maxWidth="4xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-sm font-semibold leading-6 text-gray-900">
                        Personal Information
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                    <div>
                        <InputLabel htmlFor="create_name">
                            Name <span className="text-red-500">*</span>
                        </InputLabel>
                        <div className="mt-1">
                            <TextInput
                                id="create_name"
                                value={createForm.data.name}
                                onChange={(e) =>
                                    createForm.setData("name", toTitleCase(e.target.value))
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

                    <div>
                        <InputLabel htmlFor="create_phone">
                            Phone <span className="text-red-500">*</span>
                        </InputLabel>
                        <div className="mt-1">
                            <TextInput
                                id="create_phone"
                                value={createForm.data.phone}
                                onChange={(e) =>
                                    createForm.setData("phone", e.target.value)
                                }
                            />
                            {createForm.errors.phone && (
                                <p className="mt-1 text-xs text-red-600">
                                    {createForm.errors.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="create_email">Email</InputLabel>
                        <div className="mt-1">
                            <TextInput
                                id="create_email"
                                type="email"
                                value={createForm.data.email}
                                onChange={(e) =>
                                    createForm.setData("email", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="create_dob">Date of Birth</InputLabel>
                        <DatePicker
                            id="create_dob"
                            value={createForm.data.dob}
                            onChange={(date) => createForm.setData("dob", date)}
                            placeholder="Select birthday"
                            minYear={1950}
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="create_parent_name">
                            Parent's Name
                        </InputLabel>
                        <div className="mt-1">
                            <TextInput
                                id="create_parent_name"
                                value={createForm.data.parent_name}
                                onChange={(e) =>
                                    createForm.setData("parent_name", toTitleCase(e.target.value))
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="create_parent_phone">
                            Parent's Phone
                        </InputLabel>
                        <div className="mt-1">
                            <TextInput
                                id="create_parent_phone"
                                value={createForm.data.parent_phone}
                                onChange={(e) =>
                                    createForm.setData("parent_phone", e.target.value)
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

                <div>
                    <InputLabel htmlFor="create_address">Address</InputLabel>
                    <div className="mt-1">
                        <TextArea
                            id="create_address"
                            rows={2}
                            value={createForm.data.address}
                            onChange={(e) =>
                                createForm.setData("address", e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="border-b border-gray-200 pb-2 mt-2">
                    <h3 className="text-sm font-semibold leading-6 text-gray-900">
                        Lead Details
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                    <div>
                        <InputLabel htmlFor="create_branch_id">
                            Branch <span className="text-red-500">*</span>
                        </InputLabel>
                        <div className="mt-1">
                            <Select
                                id="create_branch_id"
                                styles={reactSelectStyles}
                                menuPosition="fixed"
                                options={branches.map((b) => ({
                                    value: b.id,
                                    label: b.name,
                                }))}
                                value={branches
                                    .map((b) => ({ value: b.id, label: b.name }))
                                    .find((opt) => opt.value === createForm.data.branch_id) || null}
                                onChange={(opt) =>
                                    createForm.setData("branch_id", opt ? opt.value : "")
                                }
                                placeholder="Select Branch"
                                isClearable
                                className="w-full"
                                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                            />
                            {createForm.errors.branch_id && (
                                <p className="mt-1 text-xs text-red-600">
                                    {createForm.errors.branch_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="create_lead_source_id">Lead Source</InputLabel>
                        <div className="mt-1">
                            <Select
                                id="create_lead_source_id"
                                styles={reactSelectStyles}
                                menuPosition="fixed"
                                options={leadSources.map((s) => ({
                                    value: s.id,
                                    label: s.name,
                                }))}
                                value={leadSources
                                    .map((s) => ({ value: s.id, label: s.name }))
                                    .find((opt) => opt.value === createForm.data.lead_source_id) || null}
                                onChange={(opt) =>
                                    createForm.setData("lead_source_id", opt ? opt.value : "")
                                }
                                placeholder="Select Source"
                                isClearable
                                className="w-full"
                                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="create_interest_level_id">Interested Level</InputLabel>
                        <div className="mt-1">
                            <Select
                                id="create_interest_level_id"
                                styles={reactSelectStyles}
                                menuPosition="fixed"
                                options={levels.map((l) => ({ value: l.id, label: l.name }))}
                                value={levels
                                    .map((l) => ({ value: l.id, label: l.name }))
                                    .find((opt) => opt.value === createForm.data.interest_level_id) || null}
                                onChange={(opt) =>
                                    createForm.setData("interest_level_id", opt ? opt.value : "")
                                }
                                placeholder="Select Level"
                                isClearable
                                className="w-full"
                                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="create_interest_package_id">Interested Package</InputLabel>
                        <div className="mt-1">
                            <Select
                                id="create_interest_package_id"
                                styles={reactSelectStyles}
                                menuPosition="fixed"
                                options={packages.map((p) => ({ value: p.id, label: p.name }))}
                                value={packages
                                    .map((p) => ({ value: p.id, label: p.name }))
                                    .find((opt) => opt.value === createForm.data.interest_package_id) || null}
                                onChange={(opt) =>
                                    createForm.setData("interest_package_id", opt ? opt.value : "")
                                }
                                placeholder="Select Package"
                                isClearable
                                className="w-full"
                                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="create_temperature">Temperature</InputLabel>
                        <div className="mt-1">
                            <Select
                                id="create_temperature"
                                styles={reactSelectStyles}
                                menuPosition="fixed"
                                options={[
                                    { value: "cold", label: "Cold" },
                                    { value: "warm", label: "Warm" },
                                    { value: "hot", label: "Hot" },
                                ]}
                                value={[
                                    { value: "cold", label: "Cold" },
                                    { value: "warm", label: "Warm" },
                                    { value: "hot", label: "Hot" },
                                ].find((opt) => opt.value === createForm.data.temperature) || null}
                                onChange={(opt) =>
                                    createForm.setData("temperature", opt ? opt.value : "warm")
                                }
                                className="w-full"
                                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="create_notes">Notes</InputLabel>
                    <div className="mt-1">
                        <TextArea
                            id="create_notes"
                            rows={3}
                            value={createForm.data.notes}
                            onChange={(e) => createForm.setData("notes", e.target.value)}
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
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
}
