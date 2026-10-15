import React from "react";
import Modal from "@/Components/ui/Modal";
import { GraduationCap, CreditCard } from "lucide-react";

export default function EnrollStudentModal({ isOpen, onClose, selectedTest, onUpdateStatus, isUpdatingStatus }) {
    if (!selectedTest) return null;

    return (
        <Modal show={isOpen} onClose={onClose} title="Enroll Siswa ke Kelas" maxWidth="2xl">
            <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                    <div>
                        <p className="text-xs text-emerald-700 mb-1">Nama Siswa</p>
                        <p className="text-sm font-semibold text-emerald-900">{selectedTest.lead_name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-emerald-700 mb-1">Paket Ujian</p>
                        <p className="text-sm font-semibold text-emerald-900">{selectedTest.package_name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-emerald-700 mb-1">Skor Akhir</p>
                        <p className="text-sm font-bold text-emerald-700">{selectedTest.score || 0}</p>
                    </div>
                    <div>
                        <p className="text-xs text-emerald-700 mb-1">Rekomendasi Level</p>
                        <p className="text-sm font-semibold text-emerald-900">{selectedTest.recommended_level || "-"}</p>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                    <GraduationCap className="h-10 w-10 text-emerald-500 mb-3" />
                    <h4 className="text-base font-semibold text-gray-900">Tindak Lanjut Pendaftaran</h4>
                    <p className="text-sm text-gray-500 mt-1 max-w-md leading-relaxed">
                        Berdasarkan rekomendasi level <strong>{selectedTest.recommended_level || "-"}</strong>, Anda bisa melanjutkan prospek ini ke tahap pembayaran invoice atau langsung bergabung.
                    </p>
                    <div className="mt-6 w-full p-4 bg-gray-50 rounded-md border border-gray-100 border-dashed">
                        <p className="text-sm text-gray-500 italic">(Form pemilihan paket pendaftaran dan pembuatan invoice akan ada di sini)</p>
                    </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-end border-t border-gray-100">
                    <button
                        onClick={() => onUpdateStatus('c0a80101-0000-0000-0000-000000000005')}
                        disabled={isUpdatingStatus}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-wait"
                    >
                        <CreditCard size={16} />
                        {isUpdatingStatus ? "Memproses..." : "Proses Siswa ke Pembayaran"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
