import React from "react";
import Modal from "@/Components/ui/Modal";
import InputLabel from "@/Components/ui/InputLabel";
import { formatRp } from "@/lib/utils";
import { router } from "@inertiajs/react";

export default function PaymentModal({ 
    show, 
    onClose, 
    selectedInvoice, 
    paymentMethod, 
    setPaymentMethod 
}) {
    if (!selectedInvoice) return null;

    const handleUpdateStatus = (status) => {
        router.put(
            route("admin.finance.invoices.update-status", selectedInvoice.id),
            {
                status: status,
                payment_method: status === 'paid' ? paymentMethod : null,
            },
            {
                onSuccess: () => onClose(),
                preserveScroll: true,
            }
        );
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Proses Pembayaran Tagihan"
            maxWidth="sm"
        >
            <div className="space-y-4">
                <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
                    <p className="text-xs text-purple-600 mb-1">No. Invoice</p>
                    <p className="text-sm font-semibold text-purple-900">
                        {selectedInvoice.invoice_number}
                    </p>
                    <p className="text-xs text-purple-600 mt-3 mb-1">Total Tagihan</p>
                    <p className="text-sm font-semibold text-purple-900">
                        {formatRp(selectedInvoice.total_amount)}
                    </p>
                </div>

                <div className="text-sm text-gray-600 text-center py-2">
                    Apakah Anda ingin menerima pembayaran ini sebagai lunas atau menolaknya kembali menjadi belum lunas?
                </div>

                <div>
                    <InputLabel value="Metode Pembayaran" />
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 block w-full rounded-lg border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    >
                        <option value="cash">Cash</option>
                        <option value="transfer BCA">Transfer BCA</option>
                        <option value="transfer BNI">Transfer BNI</option>
                    </select>
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => handleUpdateStatus("unpaid")}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Tolak
                    </button>
                    <button
                        onClick={() => handleUpdateStatus("paid")}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                    >
                        Terima (Lunas)
                    </button>
                </div>
            </div>
        </Modal>
    );
}
