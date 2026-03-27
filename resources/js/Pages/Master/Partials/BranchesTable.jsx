import Button from "@/Components/ui/Button";
import DataTable from "@/Components/ui/DataTable";
import InputLabel from "@/Components/ui/InputLabel";
import Modal from "@/Components/ui/Modal";
import Panel from "@/Components/ui/Panel";
import TableIconButton from "@/Components/ui/TableIconButton";
import TextArea from "@/Components/ui/TextArea";
import TextInput from "@/Components/form/TextInput";
import { useForm } from "@inertiajs/react";
import React, { useState } from "react";
import SearchInput from "@/Components/ui/SearchInput";
import { toTitleCase } from "@/lib/utils";

export default function BranchesTable({ branches }) {
    const [isOpen, setIsOpen] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState(null);
    const [branchToEdit, setBranchToEdit] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        phone: "",
        address: "",
    });
    const deleteForm = useForm();
    const editForm = useForm({
        name: "",
        phone: "",
        address: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.branches.store"), {
            onSuccess: () => {
                reset();
                setIsOpen(false);
            },
        });
    };

    const handleDeleteBranch = () => {
        deleteForm.delete(route("admin.branches.destroy", branchToDelete.id), {
            preserveScroll: true,
            onSuccess: () => setBranchToDelete(null),
        });
    };

    const handleEditClick = (branch) => {
        editForm.setData({
            name: branch.name,
            phone: branch.phone,
            address: branch.address,
        });
        setBranchToEdit(branch);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.put(route("admin.branches.update", branchToEdit.id), {
            onSuccess: () => {
                setBranchToEdit(null);
                editForm.reset();
            },
        });
    };

    const columns = [

        { header: "Name", accessor: "name" },
        { header: "Phone", accessor: "phone" },
        { header: "Address", accessor: "address" },
        { header: "Created At", accessor: "created_at" },
        {
            header: "",
            accessor: "actions",
            render: (row) => (
                <div className="flex justify-end gap-3">
                    <TableIconButton
                        type="edit"
                        onClick={() => handleEditClick(row)}
                        className="text-primary-600 hover:text-primary-900"
                    >
                        Edit
                    </TableIconButton>
                    <TableIconButton
                        type="delete"
                        onClick={() => setBranchToDelete(row)}
                        className="text-red-600 hover:text-red-900"
                    >
                        Delete
                    </TableIconButton>
                </div>
            ),
        },
    ];

    const filteredBranches = branches.filter((branch) => {
        const query = searchQuery.toLowerCase();
        const matchName = branch.name?.toLowerCase().includes(query);
        const matchAddress = branch.address?.toLowerCase().includes(query);
        return matchName || matchAddress;
    });

    return (
        <>
            <Panel
                title="Branches"
                description="A list of all the branches in the system."
                action={
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="block rounded-md bg-primary-600 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                        Add Branch
                    </button>
                }
            >
                <DataTable
                    data={filteredBranches}
                    columns={columns}
                    filterSection={
                        <SearchInput
                            placeholder="Cari berdasarkan nama atau alamat..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    }
                />
            </Panel>

            <Modal
                show={isOpen}
                onClose={() => setIsOpen(false)}
                title="Add New Branch"
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
                        <InputLabel htmlFor="phone" value="Phone" />
                        <div className="mt-1">
                            <TextInput
                                id="phone"
                                name="phone"
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                            />
                            {errors.phone && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="address" value="Address" />
                        <div className="mt-1">
                            <TextArea
                                id="address"
                                name="address"
                                rows={3}
                                value={data.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                            />
                            {errors.address && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.address}
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
                show={!!branchToDelete}
                onClose={() => setBranchToDelete(null)}
                title="Delete Branch"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Are you sure you want to delete{" "}
                        <span className="font-bold text-gray-900">
                            {branchToDelete?.name}
                        </span>
                        ? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setBranchToDelete(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteBranch}
                            disabled={deleteForm.processing}
                        >
                            {deleteForm.processing ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                show={!!branchToEdit}
                onClose={() => setBranchToEdit(null)}
                title="Edit Branch"
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
                        <InputLabel htmlFor="edit_phone" value="Phone" />
                        <div className="mt-1">
                            <TextInput
                                id="edit_phone"
                                name="phone"
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
                        <InputLabel htmlFor="edit_address" value="Address" />
                        <div className="mt-1">
                            <TextArea
                                id="edit_address"
                                name="address"
                                rows={3}
                                value={editForm.data.address}
                                onChange={(e) =>
                                    editForm.setData("address", e.target.value)
                                }
                            />
                            {editForm.errors.address && (
                                <p className="mt-1 text-xs text-red-600">
                                    {editForm.errors.address}
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
                            onClick={() => setBranchToEdit(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
