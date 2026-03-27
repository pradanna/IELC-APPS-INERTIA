import React from "react";
import Modal from "@/Components/ui/Modal";
import InputLabel from "@/Components/ui/InputLabel";
import TextInput from "@/Components/form/TextInput";
import Select from "react-select";

export default function AddPackageModal({ 
    show, 
    onClose, 
    onSubmit, 
    addPackageType, 
    setAddPackageType, 
    packageOptions, 
    selectedPackageId, 
    setSelectedPackageId, 
    manualPackageName, 
    setManualPackageName, 
    manualPackagePrice, 
    setManualPackagePrice, 
    reactSelectStyles 
}) {
    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Tambah Komponen Tagihan"
            maxWidth="sm"
        >
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="addPackageType"
                            value="paket"
                            checked={addPackageType === "paket"}
                            onChange={(e) => setAddPackageType(e.target.value)}
                            className="text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Pilih Paket</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="addPackageType"
                            value="manual"
                            checked={addPackageType === "manual"}
                            onChange={(e) => setAddPackageType(e.target.value)}
                            className="text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Input Manual</span>
                    </label>
                </div>

                {addPackageType === "paket" ? (
                    <div>
                        <InputLabel value="Pilih Paket Tambahan" />
                        <div className="mt-1">
                            <Select
                                value={packageOptions.find((opt) => opt.value === selectedPackageId) || null}
                                onChange={(opt) => setSelectedPackageId(opt ? opt.value : "")}
                                options={packageOptions}
                                placeholder="-- Pilih Paket --"
                                styles={reactSelectStyles}
                                menuPosition="fixed"
                                isClearable
                                className="w-full"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div>
                            <InputLabel value="Nama Komponen" />
                            <div className="mt-1">
                                <TextInput
                                    type="text"
                                    value={manualPackageName}
                                    onChange={(e) => setManualPackageName(e.target.value)}
                                    className="w-full"
                                    placeholder="Contoh: Modul Tambahan"
                                    required={addPackageType === "manual"}
                                />
                            </div>
                        </div>
                        <div>
                            <InputLabel value="Harga (Rp)" />
                            <div className="mt-1">
                                <TextInput
                                    type="number"
                                    value={manualPackagePrice}
                                    onChange={(e) => setManualPackagePrice(e.target.value)}
                                    className="w-full"
                                    placeholder="0"
                                    required={addPackageType === "manual"}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
                    >
                        Tambahkan
                    </button>
                </div>
            </form>
        </Modal>
    );
}
