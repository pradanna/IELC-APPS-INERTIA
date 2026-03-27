import Button from "@/Components/ui/Button";
import DataTable from "@/Components/ui/DataTable";
import InputLabel from "@/Components/ui/InputLabel";
import Modal from "@/Components/ui/Modal";
import Panel from "@/Components/ui/Panel";
import TableIconButton from "@/Components/ui/TableIconButton";
import Select from "@/Components/ui/Select";
import TextInput from "@/Components/form/TextInput";
import TextArea from "@/Components/ui/TextArea";
import { useForm } from "@inertiajs/react";
import React, { useState } from "react";
import SearchInput from "@/Components/ui/SearchInput";
import { toTitleCase } from "@/lib/utils";

export default function PackagesTable({ packages, levels = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [packageToDelete, setPackageToDelete] = useState(null);
    const [packageToEdit, setPackageToEdit] = useState(null);
    const [packageToView, setPackageToView] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        level_id: "",
        description: "",
        type: "group",
        sessions_count: "",
        duration_days: "",
        price: "",
        is_active: true,
    });
    const deleteForm = useForm();
    const editForm = useForm({
        name: "",
        level_id: "",
        description: "",
        type: "group",
        sessions_count: "",
        duration_days: "",
        price: "",
        is_active: true,
    });

    // Auto calculate duration_days (2 sessions/week)
    React.useEffect(() => {
        if (data.sessions_count) {
            const weeks = Math.ceil(parseInt(data.sessions_count) / 2);
            setData("duration_days", weeks * 7);
        }
    }, [data.sessions_count]);

    React.useEffect(() => {
        if (editForm.data.sessions_count) {
            const weeks = Math.ceil(parseInt(editForm.data.sessions_count) / 2);
            editForm.setData("duration_days", weeks * 7);
        }
    }, [editForm.data.sessions_count]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.packages.store"), {
            onSuccess: () => {
                reset();
                setIsOpen(false);
            },
        });
    };

    const handleDeletePackage = () => {
        deleteForm.delete(route("admin.packages.destroy", packageToDelete.id), {
            preserveScroll: true,
            onSuccess: () => setPackageToDelete(null),
        });
    };

    const handleEditClick = (pkg) => {
        editForm.setData({
            name: pkg.name,
            level_id: pkg.level_id || "",
            description: pkg.description || "",
            type: pkg.type || "group",
            sessions_count: pkg.sessions_count || "",
            duration_days: pkg.duration_days || "",
            price: pkg.price || "",
            is_active: !!pkg.is_active,
        });
        setPackageToEdit(pkg);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.put(route("admin.packages.update", packageToEdit.id), {
            onSuccess: () => {
                setPackageToEdit(null);
                editForm.reset();
            },
        });
    };

    const columns = [

        { header: "Name", accessor: "name" },
        {
            header: "Level",
            accessor: "level",
            render: (row) => row.level?.name,
        },
        { header: "Type", accessor: "type" },
        { header: "Sessions", accessor: "sessions_count" },
        {
            header: "Price",
            accessor: "price",
            render: (row) => row.price_formatted || row.price,
        },
        {
            header: "Active",
            accessor: "is_active",
            render: (row) => (
                <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${row.is_active ? "bg-green-50 text-green-700 ring-green-600/20" : "bg-red-50 text-red-700 ring-red-600/20"}`}
                >
                    {row.is_active ? "Active" : "Inactive"}
                </span>
            ),
        },
        { header: "Created At", accessor: "created_at" },
        {
            header: "",
            accessor: "actions",
            render: (row) => (
                <div className="flex justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                    <TableIconButton
                        type="detail"
                        onClick={(e) => {
                            e.preventDefault();
                            setPackageToView(row);
                        }}
                    />
                    <TableIconButton
                        type="edit"
                        onClick={(e) => {
                            e.preventDefault();
                            handleEditClick(row);
                        }}
                    />
                    <TableIconButton
                        type="delete"
                        onClick={(e) => {
                            e.preventDefault();
                            setPackageToDelete(row);
                        }}
                    />
                </div>
            ),
        },
    ];

    const levelOptions = levels.map((level) => ({
        value: level.id,
        label: level.name,
    }));

    const typeOptions = [
        { value: "group", label: "Group" },
        { value: "private", label: "Private" },
        { value: "semi-private", label: "Semi-Private" },
    ];

    const filteredPackages = packages.filter((pkg) => {
        const query = searchQuery.toLowerCase();
        const matchName = pkg.name?.toLowerCase().includes(query);
        const matchLevel = pkg.level?.name?.toLowerCase().includes(query);
        const matchType = pkg.type?.toLowerCase().includes(query);
        return matchName || matchLevel || matchType;
    });

    return (
        <>
            <Panel
                title="Packages"
                description="A list of all the course packages offered."
                action={
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="block rounded-md bg-primary-600 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                        Add Package
                    </button>
                }
            >
                <DataTable
                    data={filteredPackages}
                    columns={columns}
                    filterSection={
                        <SearchInput
                            placeholder="Cari berdasarkan nama, level, atau tipe..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    }
                />
            </Panel>

            <Modal
                show={isOpen}
                onClose={() => setIsOpen(false)}
                title="Add New Package"
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
                                rows={2}
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Level" />
                        <div className="mt-1">
                            <Select
                                value={data.level_id}
                                onChange={(val) => setData("level_id", val)}
                                options={levelOptions}
                                placeholder="Select a level"
                                className="w-full"
                            />
                            {errors.level_id && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.level_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Type" />
                        <div className="mt-1">
                            <Select
                                value={data.type}
                                onChange={(val) => setData("type", val)}
                                options={typeOptions}
                                className="w-full"
                            />
                            {errors.type && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.type}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel
                                htmlFor="sessions_count"
                                value="Sessions"
                            />
                            <div className="mt-1">
                                <TextInput
                                    id="sessions_count"
                                    type="number"
                                    value={data.sessions_count}
                                    onChange={(e) =>
                                        setData(
                                            "sessions_count",
                                            e.target.value,
                                        )
                                    }
                                />
                                {errors.sessions_count && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.sessions_count}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="price" value="Price" />
                            <div className="mt-1">
                                <TextInput
                                    id="price"
                                    type="number"
                                    value={data.price}
                                    onChange={(e) =>
                                        setData("price", e.target.value)
                                    }
                                />
                                {errors.price && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.price}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="duration_days" value="Duration (Weeks)" />
                            <div className="mt-1">
                                <TextInput
                                    id="duration_days"
                                    type="text"
                                    readOnly
                                    disabled
                                    className="bg-gray-50 text-gray-400"
                                    value={data.duration_days ? `Berakhir dalam ${data.duration_days / 7} Minggu` : ""}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData("is_active", e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                            />
                            <InputLabel htmlFor="is_active" value="Active Package" />
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
                show={!!packageToDelete}
                onClose={() => setPackageToDelete(null)}
                title="Delete Package"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Are you sure you want to delete{" "}
                        <span className="font-bold text-gray-900">
                            {packageToDelete?.name}
                        </span>
                        ? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setPackageToDelete(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeletePackage}
                            disabled={deleteForm.processing}
                        >
                            {deleteForm.processing ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                show={!!packageToEdit}
                onClose={() => setPackageToEdit(null)}
                title="Edit Package"
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
                        <InputLabel htmlFor="edit_description" value="Description" />
                        <div className="mt-1">
                            <TextArea
                                id="edit_description"
                                name="description"
                                rows={2}
                                value={editForm.data.description}
                                onChange={(e) =>
                                    editForm.setData("description", e.target.value)
                                }
                            />
                            {editForm.errors.description && (
                                <p className="mt-1 text-xs text-red-600">
                                    {editForm.errors.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Level" />
                        <div className="mt-1">
                            <Select
                                value={editForm.data.level_id}
                                onChange={(val) =>
                                    editForm.setData("level_id", val)
                                }
                                options={levelOptions}
                                placeholder="Select a level"
                                className="w-full"
                            />
                            {editForm.errors.level_id && (
                                <p className="mt-1 text-xs text-red-600">
                                    {editForm.errors.level_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Type" />
                        <div className="mt-1">
                            <Select
                                value={editForm.data.type}
                                onChange={(val) =>
                                    editForm.setData("type", val)
                                }
                                options={typeOptions}
                                className="w-full"
                            />
                            {editForm.errors.type && (
                                <p className="mt-1 text-xs text-red-600">
                                    {editForm.errors.type}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel
                                htmlFor="edit_sessions_count"
                                value="Sessions"
                            />
                            <div className="mt-1">
                                <TextInput
                                    id="edit_sessions_count"
                                    type="number"
                                    value={editForm.data.sessions_count}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "sessions_count",
                                            e.target.value,
                                        )
                                    }
                                />
                                {editForm.errors.sessions_count && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {editForm.errors.sessions_count}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="edit_price" value="Price" />
                            <div className="mt-1">
                                <TextInput
                                    id="edit_price"
                                    type="number"
                                    value={editForm.data.price}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "price",
                                            e.target.value,
                                        )
                                    }
                                />
                                {editForm.errors.price && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {editForm.errors.price}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="edit_duration_days" value="Duration (Weeks)" />
                            <div className="mt-1">
                                <TextInput
                                    id="edit_duration_days"
                                    type="text"
                                    readOnly
                                    disabled
                                    className="bg-gray-50 text-gray-400"
                                    value={editForm.data.duration_days ? `Berakhir dalam ${editForm.data.duration_days / 7} Minggu` : ""}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="edit_is_active"
                                checked={editForm.data.is_active}
                                onChange={(e) => editForm.setData("is_active", e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                            />
                            <InputLabel htmlFor="edit_is_active" value="Active Package" />
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
                            onClick={() => setPackageToEdit(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
            <Modal
                show={!!packageToView}
                onClose={() => setPackageToView(null)}
                title="Package Detail"
            >
                {packageToView && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Package Name</h4>
                                <p className="mt-1 text-sm font-semibold text-gray-900">{packageToView.name}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</h4>
                                <p className="mt-1 flex items-center">
                                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${packageToView.is_active ? "bg-green-50 text-green-700 ring-green-600/20" : "bg-red-50 text-red-700 ring-red-600/20"}`}>
                                        {packageToView.is_active ? "Active" : "Inactive"}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Level</h4>
                                <p className="mt-1 text-sm text-gray-900">{packageToView.level?.name || '-'}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Type</h4>
                                <p className="mt-1 text-sm text-gray-900 capitalize">{packageToView.type}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</h4>
                                <p className="mt-1 text-sm text-gray-900">{packageToView.sessions_count} Sesi</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</h4>
                                <p className="mt-1 text-sm text-gray-900">{packageToView.duration_days / 7} Minggu</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Price</h4>
                            <p className="mt-1 text-lg font-bold text-primary-600">{packageToView.price_formatted}</p>
                        </div>

                        <div>
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Description</h4>
                            <div className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 min-h-[80px] whitespace-pre-wrap">
                                {packageToView.description || 'No description provided.'}
                            </div>
                        </div>

                        <div className="flex justify-end border-t pt-4">
                            <Button variant="outline" onClick={() => setPackageToView(null)}>Close</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}
