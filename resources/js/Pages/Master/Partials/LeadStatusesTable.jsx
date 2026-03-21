import React, { useState } from "react";
import StatusBadge from "@/Components/ui/StatusBadge";
import Button from "@/Components/ui/Button";
import DataTable from "@/Components/ui/DataTable";
import Panel from "@/Components/ui/Panel";
import TableIconButton from "@/Components/ui/TableIconButton";
import Modal from "@/Components/ui/Modal";
import InputLabel from "@/Components/ui/InputLabel";
import TextInput from "@/Components/ui/TextInput";
import TextArea from "@/Components/ui/TextArea";
import { useForm } from "@inertiajs/react";
import SearchInput from "@/Components/ui/SearchInput";
import { toTitleCase } from "@/lib/utils";

export default function LeadStatusesTable({ leadStatuses }) {
    const [isOpen, setIsOpen] = useState(false);
    const [statusToDelete, setStatusToDelete] = useState(null);
    const [statusToEdit, setStatusToEdit] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
        text_color: "#000000",
        bg_color: "#f3f4f6",
    });

    const deleteForm = useForm();
    const editForm = useForm({
        name: "",
        description: "",
        text_color: "#000000",
        bg_color: "#f3f4f6",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("superadmin.master.lead-statuses.store"), {
            onSuccess: () => {
                reset();
                setIsOpen(false);
            },
        });
    };

    const handleDeleteStatus = () => {
        deleteForm.delete(
            route("superadmin.master.lead-statuses.destroy", statusToDelete.id),
            {
                preserveScroll: true,
                onSuccess: () => setStatusToDelete(null),
            },
        );
    };

    const handleEditClick = (status) => {
        editForm.setData({
            name: status.name,
            description: status.description || "",
            text_color: status.text_color || "#000000",
            bg_color: status.bg_color || "#f3f4f6",
        });
        setStatusToEdit(status);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.put(
            route("superadmin.master.lead-statuses.update", statusToEdit.id),
            {
                onSuccess: () => {
                    setStatusToEdit(null);
                    editForm.reset();
                },
            },
        );
    };

    const columns = [
        {
            header: "Name",
            accessor: "name",
            className: "w-1/4 font-medium text-gray-900",
        },
        {
            header: "Description",
            accessor: "description",
            className: "text-gray-500",
        },
        {
            header: "Colors",
            render: (status) => (
                <StatusBadge
                    color={status.text_color}
                    backgroundColor={status.bg_color}
                >
                    {status.name}
                </StatusBadge>
            ),
        },
        {
            header: "",
            accessor: "actions",
            render: (row) => (
                <div className="flex items-center justify-end gap-3">
                    <TableIconButton
                        type="edit"
                        onClick={() => handleEditClick(row)}
                    />
                    <TableIconButton
                        type="delete"
                        onClick={() => setStatusToDelete(row)}
                    />
                </div>
            ),
        },
    ];

    const filteredStatuses = leadStatuses.filter((status) => {
        const query = searchQuery.toLowerCase();
        const matchName = status.name?.toLowerCase().includes(query);
        const matchDesc = status.description?.toLowerCase().includes(query);
        return matchName || matchDesc;
    });

    return (
        <>
            <Panel
                title="Lead Statuses"
                description="A list of all the lead statuses for your branches."
                action={
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="block rounded-md bg-primary-600 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                        Create Lead Status
                    </button>
                }
            >
                <DataTable
                    columns={columns}
                    data={filteredStatuses}
                    filterSection={
                        <SearchInput
                            placeholder="Cari berdasarkan nama atau deskripsi..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    }
                />
            </Panel>

            {/* Create Modal */}
            <Modal
                show={isOpen}
                onClose={() => setIsOpen(false)}
                title="Create Lead Status"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="name" value="Name" />
                        <div className="mt-1">
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", toTitleCase(e.target.value))
                                }
                                isFocused={true}
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="description" value="Description" />
                        <div className="mt-1">
                            <TextArea
                                id="description"
                                name="description"
                                rows={3}
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="text_color"
                                value="Text Color"
                            />
                            <div className="mt-1">
                                <TextInput
                                    id="text_color"
                                    type="color"
                                    className="h-10 p-1 cursor-pointer"
                                    value={data.text_color}
                                    onChange={(e) =>
                                        setData("text_color", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="bg_color"
                                value="Background Color"
                            />
                            <div className="mt-1">
                                <TextInput
                                    id="bg_color"
                                    type="color"
                                    className="h-10 p-1 cursor-pointer"
                                    value={data.bg_color}
                                    onChange={(e) =>
                                        setData("bg_color", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:col-start-2 disabled:opacity-50"
                        >
                            {processing ? "Saving..." : "Save"}
                        </button>
                        <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                show={!!statusToDelete}
                onClose={() => setStatusToDelete(null)}
                title="Delete Lead Status"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Are you sure you want to delete{" "}
                        <span className="font-bold text-gray-900">
                            {statusToDelete?.name}
                        </span>
                        ? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setStatusToDelete(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteStatus}
                            disabled={deleteForm.processing}
                        >
                            {deleteForm.processing ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                show={!!statusToEdit}
                onClose={() => setStatusToEdit(null)}
                title="Edit Lead Status"
            >
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="edit_name" value="Name" />
                        <div className="mt-1">
                            <TextInput
                                id="edit_name"
                                name="name"
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

                    <div>
                        <InputLabel
                            htmlFor="edit_description"
                            value="Description"
                        />
                        <div className="mt-1">
                            <TextArea
                                id="edit_description"
                                name="description"
                                rows={3}
                                value={editForm.data.description}
                                onChange={(e) =>
                                    editForm.setData(
                                        "description",
                                        e.target.value,
                                    )
                                }
                            />
                            {editForm.errors.description && (
                                <p className="mt-1 text-xs text-red-600">
                                    {editForm.errors.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="edit_text_color"
                                value="Text Color"
                            />
                            <div className="mt-1">
                                <TextInput
                                    id="edit_text_color"
                                    type="color"
                                    className="h-10 p-1 cursor-pointer"
                                    value={editForm.data.text_color}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "text_color",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="edit_bg_color"
                                value="Background Color"
                            />
                            <div className="mt-1">
                                <TextInput
                                    id="edit_bg_color"
                                    type="color"
                                    className="h-10 p-1 cursor-pointer"
                                    value={editForm.data.bg_color}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "bg_color",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
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
                            onClick={() => setStatusToEdit(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
