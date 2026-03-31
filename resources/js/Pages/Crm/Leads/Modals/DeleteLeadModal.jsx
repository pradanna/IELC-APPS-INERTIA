import React from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/ui/Modal";

export default function DeleteLeadModal({ show, onClose, onSuccess, leadToDelete }) {
    const deleteForm = useForm();

    const handleSubmit = () => {
        deleteForm.delete(route("admin.crm.leads.destroy", leadToDelete?.id), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                if (onSuccess) onSuccess();
            },
        });
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
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
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
                        onClick={handleSubmit}
                        disabled={deleteForm.processing}
                    >
                        {deleteForm.processing ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
