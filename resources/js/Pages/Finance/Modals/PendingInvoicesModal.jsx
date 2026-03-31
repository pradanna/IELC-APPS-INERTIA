import React from "react";
import Modal from "@/Components/ui/Modal";
import DataTable from "@/Components/ui/DataTable";

export default function PendingInvoicesModal({ 
    show, 
    onClose, 
    data, 
    columns 
}) {
    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Daftar Lead Menunggu Tagihan"
            maxWidth="4xl"
        >
            <div className="mb-4">
                <DataTable
                    columns={columns}
                    data={data || []}
                />
            </div>
            <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                    Tutup
                </button>
            </div>
        </Modal>
    );
}
