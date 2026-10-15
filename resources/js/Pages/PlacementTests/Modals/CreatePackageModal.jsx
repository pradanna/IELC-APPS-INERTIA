import React from "react";
import { X } from "lucide-react";
import TextInput from "@/Components/form/TextInput";
import TextArea from "@/Components/ui/TextArea";

export default function CreatePackageModal({ isOpen, onClose, form }) {
    const { data, setData, handleSubmit, processing, errors } = form;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Buat Paket Ujian Baru</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Paket Ujian <span className="text-red-500">*</span></label>
                        <TextInput
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="Contoh: PT General English"
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Deskripsi (Opsional)</label>
                        <TextArea
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            className="mt-1 block w-full sm:text-sm"
                            rows={3}
                            placeholder="Penjelasan singkat mengenai ujian..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Durasi (Menit) <span className="text-red-500">*</span></label>
                        <TextInput
                            type="number"
                            min="1"
                            value={data.duration_minutes}
                            onChange={(e) => setData("duration_minutes", e.target.value)}
                            className="mt-1 block w-full"
                        />
                        {errors.duration_minutes && <p className="mt-1 text-xs text-red-600">{errors.duration_minutes}</p>}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={data.is_active}
                            onChange={(e) => setData("is_active", e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                        />
                        <label htmlFor="is_active" className="text-sm text-gray-700 cursor-pointer">Aktifkan paket ini</label>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-50">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">Batal</button>
                        <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors">
                            {processing ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
