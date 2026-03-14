import Button from "@/Components/ui/Button";
import DataTable from "@/Components/ui/DataTable";
import InputLabel from "@/Components/ui/InputLabel";
import Modal from "@/Components/ui/Modal";
import Panel from "@/Components/ui/Panel";
import TextArea from "@/Components/ui/TextArea";
import TextInput from "@/Components/ui/TextInput";
import { useForm } from "@inertiajs/react";
import React, { useState } from "react";

export default function LevelsTable({ levels }) {
    const [isOpen, setIsOpen] = useState(false);
    const [levelToDelete, setLevelToDelete] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
    });
    const deleteForm = useForm();

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("levels.store"), {
            onSuccess: () => {
                reset();
                setIsOpen(false);
            },
        });
    };

    const handleDeleteLevel = () => {
        deleteForm.delete(route("levels.destroy", levelToDelete.id), {
            preserveScroll: true,
            onSuccess: () => setLevelToDelete(null),
        });
    };

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Name", accessor: "name" },
        { header: "Description", accessor: "description" },
        { header: "Created At", accessor: "created_at" },
        {
            header: "",
            accessor: "actions",
            render: (row) => (
                <div className="flex justify-end gap-3">
                    <a
                        href="#"
                        className="text-primary-600 hover:text-primary-900"
                    >
                        Edit
                    </a>
                    <button
                        type="button"
                        onClick={() => setLevelToDelete(row)}
                        className="text-red-600 hover:text-red-900"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Panel
                title="Levels"
                description="A list of all the course levels offered."
                action={
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="block rounded-md bg-primary-600 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                        Add Level
                    </button>
                }
            >
                <DataTable data={levels} columns={columns} />
            </Panel>

            <Modal
                show={isOpen}
                onClose={() => setIsOpen(false)}
                title="Add New Level"
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
                                    setData("name", e.target.value)
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
                show={!!levelToDelete}
                onClose={() => setLevelToDelete(null)}
                title="Delete Level"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Are you sure you want to delete{" "}
                        <span className="font-bold text-gray-900">
                            {levelToDelete?.name}
                        </span>
                        ? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setLevelToDelete(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteLevel}
                            disabled={deleteForm.processing}
                        >
                            {deleteForm.processing ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
