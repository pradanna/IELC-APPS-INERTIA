import React from "react";
import { Link } from "@inertiajs/react";
import { Plus, FileQuestion } from "lucide-react";

export default function ExamManagementSidebar({ examPackages, onCreateClick }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Manajemen Ujian</h3>
                <button
                    onClick={onCreateClick}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-500 px-3 py-1.5 rounded-md shadow-sm transition-colors"
                >
                    <Plus size={14} /> Buat Paket
                </button>
            </div>
            <div className="p-0">
                <ul className="divide-y divide-gray-100">
                    {examPackages.map((pkg) => (
                        <li key={pkg.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{pkg.name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {pkg.questions_count} Soal &bull; 
                                    <span className={pkg.active ? "text-green-600 ml-1 font-medium" : "text-gray-400 ml-1"}>
                                        {pkg.active ? "Aktif" : "Draft"}
                                    </span>
                                </p>
                            </div>
                            <Link
                                href={route("admin.placement-tests.show", pkg.id)}
                                className="inline-flex items-center gap-1.5 p-1.5 px-2.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all"
                            >
                                <FileQuestion size={14} /> Kelola
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
