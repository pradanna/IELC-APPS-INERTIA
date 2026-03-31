import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@/Components/ui/Modal';
import Button from '@/Components/ui/Button';
import Badge from '@/Components/ui/Badge';
import { Loader2, TrendingUp, Calendar, AlertCircle, CheckCircle2, Printer } from 'lucide-react';

export default function StudentAcademicModal({ show, onClose, studyClass, student }) {
    const [loading, setLoading] = useState(false);
    const [academicData, setAcademicData] = useState(null);

    useEffect(() => {
        if (show && student && studyClass) {
            fetchAcademicData();
        }
    }, [show, student, studyClass]);

    const fetchAcademicData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(route('admin.study-classes.student-academic', [studyClass.id, student.id]));
            setAcademicData(response.data);
        } catch (error) {
            console.error("Failed to fetch academic data", error);
        } finally {
            setLoading(false);
        }
    };

    if (!student) return null;

    return (
        <Modal 
            show={show} 
            onClose={onClose} 
            title={`Akademik: ${student.name || student.lead?.name || 'Siswa'}`}
            maxWidth="2xl"
        >
            <div className="p-4 sm:p-6 min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
                        <Loader2 className="animate-spin" size={32} />
                        <p className="text-sm font-medium">Memuat data akademik...</p>
                    </div>
                ) : academicData ? (
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Average Score</p>
                                    <p className="text-xl font-bold text-gray-900">{academicData.summary.avg_score?.toFixed(1) || '0.0'}</p>
                                </div>
                            </div>
                            <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100 flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">Attendance</p>
                                    <p className="text-xl font-bold text-gray-900">{academicData.summary.attendance_percentage}%</p>
                                </div>
                            </div>
                        </div>

                        {/* Assessment Section */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <div className="w-1 h-4 bg-primary-600 rounded-full"></div>
                                DAFTAR NILAI (SCORES)
                            </h3>
                            <div className="overflow-hidden border border-gray-100 rounded-xl">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 font-bold text-[10px] uppercase tracking-wider border-b border-gray-100">
                                        <tr>
                                            <th className="px-4 py-3">Assessment Type</th>
                                            <th className="px-4 py-3 text-center">Score</th>
                                            <th className="px-4 py-3">Feedback</th>
                                            <th className="px-4 py-3 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {academicData.scores.length > 0 ? academicData.scores.map((score) => (
                                            <tr key={score.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-gray-900 capitalize">
                                                    {score.assessment_type.replace('_', ' ')}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`inline-block px-2 py-1 rounded-lg font-bold text-sm ${
                                                        score.total_score >= 80 ? 'text-emerald-700 bg-emerald-50' : 
                                                        score.total_score >= 60 ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50'
                                                    }`}>
                                                        {parseFloat(score.total_score).toFixed(1)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-500 italic">
                                                    {score.final_feedback || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <a 
                                                        href={route('admin.student-scores.pdf', score.id)} 
                                                        target="_blank"
                                                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-primary-50 hover:text-primary-600 transition-all border border-transparent hover:border-primary-100"
                                                        title="Cetak Rapor PDF"
                                                    >
                                                        <Printer size={14} />
                                                    </a>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="px-4 py-8 text-center text-gray-400 italic">Belum ada nilai terinput.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Attendance Section */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <div className="w-1 h-4 bg-primary-600 rounded-full"></div>
                                KEHADIRAN TERAKHIR
                            </h3>
                            <div className="space-y-2">
                                {academicData.attendances.length > 0 ? academicData.attendances.slice(0, 5).map((att) => (
                                    <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            {['present', 'late'].includes(att.status) ? (
                                                <CheckCircle2 size={18} className={att.status === 'present' ? "text-emerald-500" : "text-amber-500"} />
                                            ) : (
                                                <AlertCircle size={18} className="text-red-500" />
                                            )}
                                            <div>
                                                <p className="text-xs font-bold text-gray-900">
                                                    {new Date(att.class_session?.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                                <p className="text-[10px] text-gray-500 uppercase">{att.class_session?.start_time} - {att.class_session?.end_time}</p>
                                            </div>
                                        </div>
                                        <Badge 
                                            variant={att.status === 'present' ? 'success' : att.status === 'late' ? 'warning' : 'danger'}
                                            className="text-[10px] py-0.5 px-2"
                                        >
                                            {att.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                )) : (
                                    <p className="text-center py-4 text-xs text-gray-400 italic">Belum ada riwayat kehadiran.</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <AlertCircle size={48} className="mb-2 opacity-20" />
                        <p className="text-sm">Gagal memuat data.</p>
                    </div>
                )}
                
                <div className="mt-8 flex justify-end">
                    <Button variant="outline" onClick={onClose} className="px-6">Tutup</Button>
                </div>
            </div>
        </Modal>
    );
}
