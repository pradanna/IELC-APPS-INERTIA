import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/ui/Modal";
import InputLabel from "@/Components/ui/InputLabel";
import TextInput from "@/Components/form/TextInput";
import TextArea from "@/Components/ui/TextArea";
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import { toTitleCase } from "@/lib/utils";

export default function EditLeadModal({
    show,
    onClose,
    onSuccess,
    leadToEdit,
    branches = [],
    leadSources = [],
    levels = [],
    packages = [],
}) {
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
        temperature: "warm",
        notes: "",
    });

    useEffect(() => {
        if (leadToEdit && show) {
            editForm.setData({
                name: leadToEdit.name || "",
                phone: leadToEdit.phone || "",
                email: leadToEdit.email || "",
                dob: leadToEdit.dob || "",
                address: leadToEdit.address || "",
                parent_name: leadToEdit.parent_name || "",
                parent_phone: leadToEdit.parent_phone || "",
                branch_id: leadToEdit.branch_id || "",
                lead_source_id: leadToEdit.lead_source_id || "",
                interest_level_id: leadToEdit.interest_level_id || "",
                interest_package_id: leadToEdit.interest_package_id || "",
                temperature: leadToEdit.temperature || "warm",
                notes: leadToEdit.notes || "",
            });
        }
    }, [leadToEdit, show]);

    const handleSubmit = (e) => {
        e.preventDefault();
        editForm.put(route("admin.crm.leads.update", leadToEdit.id), {
            preserveScroll: true,
            onSuccess: () => {
                editForm.reset();
                onClose();
                if (onSuccess) onSuccess();
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
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Edit Lead"
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
                        <InputLabel htmlFor="edit_name">
                            Name <span className="text-red-500">*</span>
                        </InputLabel>
                        <div className="mt-1">
                            <TextInput
                                id="edit_name"
                                value={editForm.data.name}
                                onChange={(e) =>
                                    editForm.setData("name", toTitleCase(e.target.value))
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

                    <div>
                        <InputLabel htmlFor="edit_phone">
                            Phone <span className="text-red-500">*</span>
                        </InputLabel>
                        <div className="mt-1">
                            <TextInput
                                id="edit_phone"
                                value={editForm.data.phone}
                                onChange={(e) =>
                                    editForm.setData("phone", e.target.value)
                                }
                            />
                            {editForm.errors.phone && (
                                <p className="mt-1 text-xs text-red-600">
                                    {editForm.errors.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="edit_email">Email</InputLabel>
                        <div className="mt-1">
                            <TextInput
                                id="edit_email"
                                type="email"
                                value={editForm.data.email}
                                onChange={(e) =>
                                    editForm.setData("email", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="edit_dob">Date of Birth</InputLabel>
                        <TextInput
                            id="edit_dob"
                            type="date"
                            value={editForm.data.dob}
                            onChange={(e) =>
                                editForm.setData("dob", e.target.value)
                            }
                            className="mt-1 block w-full"
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="edit_parent_name">
                            Parent's Name
                        </InputLabel>
                        <div className="mt-1">
                            <TextInput
                                id="edit_parent_name"
                                value={editForm.data.parent_name}
                                onChange={(e) =>
                                    editForm.setData("parent_name", toTitleCase(e.target.value))
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="edit_parent_phone">
                            Parent's Phone
                        </InputLabel>
                        <div className="mt-1">
                            <TextInput
                                id="edit_parent_phone"
                                value={editForm.data.parent_phone}
                                onChange={(e) =>
                                    editForm.setData("parent_phone", e.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>

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

                <div className="border-b border-gray-200 pb-2 mt-2">
                    <h3 className="text-sm font-semibold leading-6 text-gray-900">
                        Lead Details
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
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
                                value={branches
                                    .map((b) => ({ value: b.id, label: b.name }))
                                    .find((opt) => opt.value === editForm.data.branch_id) || null}
                                onChange={(opt) =>
                                    editForm.setData("branch_id", opt ? opt.value : "")
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

                    <div>
                        <InputLabel htmlFor="edit_lead_source_id">Lead Source</InputLabel>
                        <div className="mt-1">
                            <Select
                                id="edit_lead_source_id"
                                styles={reactSelectStyles}
                                menuPosition="fixed"
                                options={leadSources.map((s) => ({
                                    value: s.id,
                                    label: s.name,
                                }))}
                                value={leadSources
                                    .map((s) => ({ value: s.id, label: s.name }))
                                    .find((opt) => opt.value === editForm.data.lead_source_id) || null}
                                onChange={(opt) =>
                                    editForm.setData("lead_source_id", opt ? opt.value : "")
                                }
                                placeholder="Select Source"
                                isClearable
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="edit_interest_level_id">Interested Level</InputLabel>
                        <div className="mt-1">
                            <Select
                                id="edit_interest_level_id"
                                styles={reactSelectStyles}
                                menuPosition="fixed"
                                options={levels.map((l) => ({ value: l.id, label: l.name }))}
                                value={levels
                                    .map((l) => ({ value: l.id, label: l.name }))
                                    .find((opt) => opt.value === editForm.data.interest_level_id) || null}
                                onChange={(opt) =>
                                    editForm.setData("interest_level_id", opt ? opt.value : "")
                                }
                                placeholder="Select Level"
                                isClearable
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="edit_interest_package_id">Interested Package</InputLabel>
                        <div className="mt-1">
                            <Select
                                id="edit_interest_package_id"
                                styles={reactSelectStyles}
                                menuPosition="fixed"
                                options={packages.map((p) => ({ value: p.id, label: p.name }))}
                                value={packages
                                    .map((p) => ({ value: p.id, label: p.name }))
                                    .find((opt) => opt.value === editForm.data.interest_package_id) || null}
                                onChange={(opt) =>
                                    editForm.setData("interest_package_id", opt ? opt.value : "")
                                }
                                placeholder="Select Package"
                                isClearable
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="edit_temperature">Temperature</InputLabel>
                        <div className="mt-1">
                            <Select
                                id="edit_temperature"
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
                                ].find((opt) => opt.value === editForm.data.temperature) || null}
                                onChange={(opt) =>
                                    editForm.setData("temperature", opt ? opt.value : "warm")
                                }
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="edit_notes">Notes</InputLabel>
                    <div className="mt-1">
                        <TextArea
                            id="edit_notes"
                            rows={3}
                            value={editForm.data.notes}
                            onChange={(e) => editForm.setData("notes", e.target.value)}
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
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
}
