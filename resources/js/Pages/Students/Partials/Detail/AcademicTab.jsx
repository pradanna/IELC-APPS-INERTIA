import React from 'react';
import Badge from '@/Components/ui/Badge';
import { GraduationCap, Clock, BookOpen, FileText, TrendingUp } from 'lucide-react';

export default function AcademicTab({ student, openClassAcademic, openScoreModal }) {
    if (!student) return null;

    return (
        <div className="p-6 space-y-8">
            {/* Enrollment info */}
            <div className="group bg-primary-600 rounded-2xl p-6 text-white shadow-lg shadow-primary-500/20 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 text-white opacity-10 transform -rotate-12">
                    <GraduationCap size={120} />
                </div>
                <div className="relative z-10">
                    <p className="text-xs text-primary-200 font-medium uppercase tracking-widest">Enrollment</p>
                    <h3 className="text-xl font-bold mt-1">Siswa Terdaftar</h3>
                    <div className="mt-4 flex items-center gap-2 text-primary-100 italic text-sm">
                        <Clock size={14} />
                        Join pada: {student.created_at}
                    </div>
                </div>
            </div>

            {/* Current Class Status */}
            <section className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen size={18} className="text-primary-600" />
                    Status Kelas Saat Ini
                </h4>
                <div className="space-y-3">
                    {student.classes?.length > 0 ? (
                        student.classes.map(cls => (
                            <div key={cls.id} className="relative group">
                                <button 
                                    onClick={() => openClassAcademic && openClassAcademic(cls)}
                                    className="w-full text-left p-4 rounded-xl border border-gray-100 bg-white flex items-center justify-between shadow-sm hover:border-primary-300 hover:ring-4 hover:ring-primary-500/5 transition-all active:scale-[0.98] pr-20"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-primary-600 uppercase tracking-tighter group-hover:text-primary-700 transition-colors">{cls.package_name}</span>
                                        <span className="text-base font-semibold text-gray-900">{cls.name}</span>
                                    </div>
                                    <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                                        <TrendingUp size={18} />
                                    </div>
                                </button>
                                
                                {/* Add Score Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openScoreModal && openScoreModal(cls);
                                    }}
                                    className="absolute right-12 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-transparent hover:border-emerald-100 group/btn"
                                    title="Isi Progress Report"
                                >
                                    <FileText size={18} />
                                    <span className="sr-only">Add Score</span>
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 text-orange-700 text-sm flex items-start gap-3 italic">
                            <Clock size={16} className="mt-0.5" />
                            Siswa ini belum memiliki plot kelas aktif. Silakan hubungi Frontdesk untuk plotting jadwal.
                        </div>
                    )}
                </div>
            </section>

             {/* Purchased History Snapshot */}
             <section className="space-y-4 border-t pt-8">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <FileText size={18} className="text-primary-600" />
                    Riwayat Paket Berhasil Dibayar
                </h4>
                <div className="space-y-3">
                    {student.purchased_packages?.map((pkg, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-dashed border-gray-200">
                             <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">{pkg.package_name}</span>
                                <span className="text-[11px] text-gray-500 italic">Terbayar Lunas</span>
                             </div>
                             <div className="text-right">
                                <Badge variant="primary">Plotting Ready</Badge>
                             </div>
                        </div>
                    ))}
                    {(!student.purchased_packages || student.purchased_packages.length === 0) && (
                        <p className="text-center py-4 text-xs text-gray-400 italic">Belum ada riwayat paket.</p>
                    )}
                </div>
            </section>
        </div>
    );
}
