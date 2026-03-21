import Button from "@/Components/ui/Button";
import DataTable from "@/Components/ui/DataTable";
import InputLabel from "@/Components/ui/InputLabel";
import Modal from "@/Components/ui/Modal";
import Panel from "@/Components/ui/Panel";
import TableIconButton from "@/Components/ui/TableIconButton";
import Select from "@/Components/ui/Select";
import TextInput from "@/Components/ui/TextInput";
import { useForm } from "@inertiajs/react";
import React, { useState } from "react";
import SearchInput from "@/Components/ui/SearchInput";

const MONTHS = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
];

export default function MonthlyTargetTable({
    monthlyTargets = [],
    branches = [],
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [targetToDelete, setTargetToDelete] = useState(null);
    const [targetToEdit, setTargetToEdit] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { data, setData, post, processing, errors, reset } = useForm({
        branch_id: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        target_enrolled: "",
    });
    const deleteForm = useForm();
    const editForm = useForm({
        branch_id: "",
        month: "",
        year: "",
        target_enrolled: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("superadmin.monthly-targets.store"), {
            onSuccess: () => {
                reset();
                setIsOpen(false);
            },
        });
    };

    const handleDeleteTarget = () => {
        deleteForm.delete(
            route("superadmin.monthly-targets.destroy", targetToDelete.id),
            {
                preserveScroll: true,
                onSuccess: () => setTargetToDelete(null),
            },
        );
    };

    const handleEditClick = (target) => {
        editForm.setData({
            branch_id: target.branch_id,
            month: target.month,
            year: target.year,
            target_enrolled: target.target_enrolled,
        });
        setTargetToEdit(target);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.put(
            route("superadmin.monthly-targets.update", targetToEdit.id),
            {
                onSuccess: () => {
                    setTargetToEdit(null);
                    editForm.reset();
                },
            },
        );
    };

    const columns = [
        { header: "Branch", accessor: "branch_name" },
        {
            header: "Period",
            accessor: "period",
            render: (row) => `${MONTHS[row.month - 1]?.label} ${row.year}`,
        },
        {
            header: "Target Enrolled",
            accessor: "target_enrolled",
            className: "font-semibold",
        },
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
                        onClick={() => setTargetToDelete(row)}
                    />
                </div>
            ),
        },
    ];

    const branchOptions = branches.map((branch) => ({
        value: branch.id,
        label: branch.name,
    }));

    const filteredTargets = monthlyTargets.filter((target) => {
        const query = searchQuery.toLowerCase();
        const matchBranch = target.branch_name?.toLowerCase().includes(query);
        const matchYear = target.year?.toString().includes(query);
        const matchMonth = MONTHS[target.month - 1]?.label
            .toLowerCase()
            .includes(query);
        return matchBranch || matchYear || matchMonth;
    });

    return (
        <>
            <Panel
                title="Monthly Targets"
                description="Manage branch-specific enrollment targets for each month."
                action={
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="block rounded-md bg-primary-600 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                        Add Target
                    </button>
                }
            >
                <DataTable
                    data={filteredTargets}
                    columns={columns}
                    filterSection={
                        <SearchInput
                            placeholder="Cari berdasarkan cabang, bulan, atau tahun..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    }
                />
            </Panel>

            {/* CREATE MODAL */}
            <Modal
                show={isOpen}
                onClose={() => setIsOpen(false)}
                title="Add New Target"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <InputLabel value="Branch" />
                        <div className="mt-1">
                            <Select
                                value={data.branch_id}
                                onChange={(val) => setData("branch_id", val)}
                                options={branchOptions}
                                placeholder="Select a branch"
                                className="w-full"
                            />
                            {errors.branch_id && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.branch_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Month" />
                        <div className="mt-1">
                            <Select
                                value={data.month}
                                onChange={(val) => setData("month", val)}
                                options={MONTHS}
                                className="w-full"
                            />
                            {errors.month && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.month}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="year" value="Year" />
                        <div className="mt-1">
                            <TextInput
                                id="year"
                                type="number"
                                value={data.year}
                                onChange={(e) =>
                                    setData("year", e.target.value)
                                }
                                className="block w-full"
                            />
                            {errors.year && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.year}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="target_enrolled"
                            value="Target Enrolled"
                        />
                        <div className="mt-1">
                            <TextInput
                                id="target_enrolled"
                                type="number"
                                value={data.target_enrolled}
                                onChange={(e) =>
                                    setData("target_enrolled", e.target.value)
                                }
                                className="block w-full"
                            />
                            {errors.target_enrolled && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.target_enrolled}
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

            {/* DELETE MODAL */}
            <Modal
                show={!!targetToDelete}
                onClose={() => setTargetToDelete(null)}
                title="Delete Target"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Are you sure you want to delete the target for{" "}
                        <span className="font-bold text-gray-900">
                            {targetToDelete?.branch_name} (
                            {MONTHS[targetToDelete?.month - 1]?.label}{" "}
                            {targetToDelete?.year})
                        </span>
                        ? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setTargetToDelete(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteTarget}
                            disabled={deleteForm.processing}
                        >
                            {deleteForm.processing ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* EDIT MODAL */}
            <Modal
                show={!!targetToEdit}
                onClose={() => setTargetToEdit(null)}
                title="Edit Target"
            >
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                        <InputLabel value="Branch" />
                        <div className="mt-1">
                            <Select
                                value={editForm.data.branch_id}
                                onChange={(val) =>
                                    editForm.setData("branch_id", val)
                                }
                                options={branchOptions}
                                placeholder="Select a branch"
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
                        <InputLabel value="Month" />
                        <div className="mt-1">
                            <Select
                                value={editForm.data.month}
                                onChange={(val) =>
                                    editForm.setData("month", val)
                                }
                                options={MONTHS}
                                className="w-full"
                            />
                            {editForm.errors.month && (
                                <p className="mt-1 text-xs text-red-600">
                                    {editForm.errors.month}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="edit_year" value="Year" />
                        <div className="mt-1">
                            <TextInput
                                id="edit_year"
                                type="number"
                                value={editForm.data.year}
                                onChange={(e) =>
                                    editForm.setData("year", e.target.value)
                                }
                                className="block w-full"
                            />
                            {editForm.errors.year && (
                                <p className="mt-1 text-xs text-red-600">
                                    {editForm.errors.year}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="edit_target_enrolled"
                            value="Target Enrolled"
                        />
                        <div className="mt-1">
                            <TextInput
                                id="edit_target_enrolled"
                                type="number"
                                value={editForm.data.target_enrolled}
                                onChange={(e) =>
                                    editForm.setData(
                                        "target_enrolled",
                                        e.target.value,
                                    )
                                }
                                className="block w-full"
                            />
                            {editForm.errors.target_enrolled && (
                                <p className="mt-1 text-xs text-red-600">
                                    {editForm.errors.target_enrolled}
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
                            onClick={() => setTargetToEdit(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
