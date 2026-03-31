import React from "react";
import Modal from "@/Components/ui/Modal";
import { Plus, Trash2 } from "lucide-react";
import { formatRp } from "@/lib/utils";

export default function InvoiceFormModal({
    show,
    onClose,
    title,
    selectedLead,
    selectedInvoice,
    mode = "create",
    includePtFee,
    setIncludePtFee,
    ptFee,
    setPtFee,
    additionalItems,
    handleRemoveItem,
    totalAmount,
    onAddClick,
    onSubmit,
}) {
    const leadName = mode === "create" ? selectedLead?.name : selectedInvoice?.lead?.name;
    const interestPackageName = mode === "create" ? selectedLead?.interest_package?.name : null;

    return (
        <Modal show={show} onClose={onClose} title={title} maxWidth="md">
            <div className="space-y-5">
                <div className={`${mode === "create" ? "bg-blue-50/50 border-blue-100" : "bg-amber-50/50 border-amber-100"} p-4 rounded-lg border`}>
                    {mode === "edit" && (
                        <>
                            <p className={`text-xs ${mode === "create" ? "text-blue-600" : "text-amber-600"} mb-1`}>No. Invoice</p>
                            <p className={`text-sm font-semibold ${mode === "create" ? "text-blue-900" : "text-amber-900"} mb-3`}>
                                {selectedInvoice?.invoice_number}
                            </p>
                        </>
                    )}
                    <p className={`text-xs ${mode === "create" ? "text-blue-600" : "text-amber-600"} mb-1`}>Nama Siswa / Lead</p>
                    <p className={`text-sm font-semibold ${mode === "create" ? "text-blue-900" : "text-amber-900"}`}>{leadName}</p>

                    {mode === "create" && (
                        <>
                            <p className="text-xs text-blue-600 mt-3 mb-1">Paket yang Diminati</p>
                            <p className="text-sm font-semibold text-blue-900">
                                {interestPackageName || "Tidak ada paket yang dipilih"}
                            </p>
                        </>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <h4 className="text-sm font-semibold text-gray-900">Komponen Tagihan</h4>
                        <button
                            type="button"
                            onClick={onAddClick}
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-2 py-1 rounded transition-colors"
                        >
                            <Plus size={14} /> Tambah
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-sm mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={includePtFee}
                                onChange={(e) => setIncludePtFee(e.target.checked)}
                                className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                            />
                            <span className="text-gray-600">Biaya Placement Test</span>
                        </label>
                        {includePtFee ? (
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">Rp</span>
                                <input
                                    type="number"
                                    value={ptFee}
                                    onChange={(e) => setPtFee(Number(e.target.value))}
                                    className="w-28 text-right text-sm border-gray-300 rounded-md py-1 px-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                        ) : (
                            <span className="text-gray-400">Rp 0</span>
                        )}
                    </div>

                    {additionalItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm mt-2 group">
                            <div className="flex items-center gap-2 text-gray-600">
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Hapus komponen"
                                >
                                    <Trash2 size={14} />
                                </button>
                                <span>{item.name}</span>
                            </div>
                            <span className="font-medium text-gray-900">{formatRp(item.price)}</span>
                        </div>
                    ))}

                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-2">
                        <span className="font-bold text-gray-900">Total Invoice</span>
                        <span className="font-bold text-primary-700 text-lg">{formatRp(totalAmount)}</span>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onSubmit}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
                    >
                        {mode === "create" ? "Simpan & Terbitkan" : "Simpan Perubahan"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
