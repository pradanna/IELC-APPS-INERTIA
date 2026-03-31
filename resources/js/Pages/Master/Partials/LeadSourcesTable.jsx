import Button from "@/Components/ui/Button";
import DataTable from "@/Components/ui/DataTable";
import InputLabel from "@/Components/ui/InputLabel";
import Modal from "@/Components/ui/Modal";
import Panel from "@/Components/ui/Panel";
import TableIconButton from "@/Components/ui/TableIconButton";
import TextInput from "@/Components/form/TextInput";
import { useForm } from "@inertiajs/react";
import React, { useState } from "react";
import SearchInput from "@/Components/ui/SearchInput";
import { toTitleCase } from "@/lib/utils";

export default function LeadSourcesTable({ leadSources }) {
    const [isOpen, setIsOpen] = useState(false);
    const [sourceToDelete, setSourceToDelete] = useState(null);
    const [sourceToEdit, setSourceToEdit] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
    });
    const deleteForm = useForm();
    const editForm = useForm({
        name: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.lead-sources.store"), {
            onSuccess: () => {
                reset();
                setIsOpen(false);
            },
        });
    };

    const handleDeleteSource = () => {
        deleteForm.delete(
            route("admin.lead-sources.destroy", sourceToDelete.id),
            {
                preserveScroll: true,
                onSuccess: () => setSourceToDelete(null),
            },
        );
    };

    const handleEditClick = (source) => {
        editForm.setData({
            name: source.name,
        });
        setSourceToEdit(source);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.put(route("admin.lead-sources.update", sourceToEdit.id), {
            onSuccess: () => {
                setSourceToEdit(null);
                editForm.reset();
            },
        });
    };

    const columns = [

        { header: "Name", accessor: "name" },
        { header: "Created At", accessor: "created_at" },
        {
            header: "",
            accessor: "actions",
            render: (row) => (
                <div className="flex justify-end gap-3">
                    <TableIconButton
                        type="edit"
                        onClick={() => handleEditClick(row)}
                    />
                    <TableIconButton
                        type="delete"
                        onClick={() => setSourceToDelete(row)}
                    />
                </div>
            ),
        },
    ];

    const filteredSources = leadSources.filter((source) => {
        return source.name?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <>
            <Panel
                title="Lead Sources"
                description="A list of all incoming lead sources (e.g. Instagram, Walk-in)."
                action={
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="block rounded-md bg-primary-600 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                        Add Source
                    </button>
                }
            >
                <DataTable
                    data={filteredSources}
                    columns={columns}
                    filterSection={
                        <SearchInput
                            placeholder="Cari berdasarkan nama sumber..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    }
                />
            </Panel>

            <Modal
                show={isOpen}
                onClose={() => setIsOpen(false)}
                title="Add New Lead Source"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="name" value="Source Name" />
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

            <Modal
                show={!!sourceToDelete}
                onClose={() => setSourceToDelete(null)}
                title="Delete Lead Source"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Are you sure you want to delete{" "}
                        <span className="font-bold text-gray-900">
                            {sourceToDelete?.name}
                        </span>
                        ? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setSourceToDelete(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteSource}
                            disabled={deleteForm.processing}
                        >
                            {deleteForm.processing ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                show={!!sourceToEdit}
                onClose={() => setSourceToEdit(null)}
                title="Edit Lead Source"
            >
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="edit_name" value="Source Name" />
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
                            onClick={() => setSourceToEdit(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
