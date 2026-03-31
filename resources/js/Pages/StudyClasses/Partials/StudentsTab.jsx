import React from 'react';
import Badge from '@/Components/ui/Badge';
import { Users, BarChart3, TrendingUp, Phone } from 'lucide-react';
import StudentAcademicModal from './Modals/StudentAcademicModal';

export default function StudentsTab({ students = [], studyClass }) {
    const [selectedStudent, setSelectedStudent] = React.useState(null);
    const [isAcademicModalOpen, setIsAcademicModalOpen] = React.useState(false);

    const handleViewAcademic = (student) => {
        setSelectedStudent(student);
        setIsAcademicModalOpen(true);
    };
    return (
        <div className="p-6">
            <div className="space-y-3">
                {students.length > 0 ? (
                    students.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                            <div className="flex items-center gap-3">
                                {student.profile_picture ? (
                                    <img src={student.profile_picture} alt={student.lead?.name} className="h-9 w-9 rounded-full object-cover border border-gray-100" />
                                ) : (
                                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                                        {(student.lead?.name || 'S').charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-bold text-gray-900 leading-none">{student.lead?.name || 'Siswa'}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tight">{student.nis}</span>
                                        <span className="text-gray-300">•</span>
                                        <a href={`tel:${student.lead?.phone}`} className="flex items-center gap-0.5 text-[10px] text-primary-600 hover:underline">
                                            <Phone size={10} />
                                            {student.lead?.phone || '-'}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                {/* Academic Mini Stats */}
                                <div className="hidden sm:flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Avg. Score</p>
                                        <p className={`text-xs font-bold ${
                                            (student.scores_avg_total_score || 0) >= 80 ? 'text-emerald-600' : 
                                            (student.scores_avg_total_score || 0) >= 60 ? 'text-amber-600' : 'text-red-600'
                                        }`}>
                                            {student.scores_avg_total_score ? parseFloat(student.scores_avg_total_score).toFixed(1) : '0.0'}
                                        </p>
                                    </div>
                                    <div className="text-right pr-2">
                                        <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Attendance</p>
                                        <p className="text-xs font-bold text-gray-900">
                                            {student.total_attended || 0} Ses
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleViewAcademic(student)}
                                        className="p-2 transition-all text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg group"
                                        title="Liat Detail Akademik"
                                    >
                                        <BarChart3 size={18} className="group-hover:scale-110 transition-transform" />
                                    </button>
                                    <Badge variant="success" className="text-[9px] uppercase font-black tracking-tighter px-1.5 py-0">Active</Badge>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <Users className="mx-auto h-12 w-12 text-gray-200" />
                        <p className="mt-2 text-sm text-gray-500">Belum ada siswa di kelas ini.</p>
                    </div>
                )}
            </div>

            <StudentAcademicModal 
                show={isAcademicModalOpen}
                onClose={() => setIsAcademicModalOpen(false)}
                student={selectedStudent}
                studyClass={studyClass}
            />
        </div>
    );
}
