import React from 'react';
import Badge from '@/Components/ui/Badge';
import { Users } from 'lucide-react';

export default function StudentsTab({ students = [] }) {
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
                                    <p className="text-sm font-medium text-gray-900">{student.lead?.name || 'Siswa'}</p>
                                    <p className="text-xs text-gray-500">{student.lead?.phone || 'No phone number'}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <Badge variant="success" className="text-[10px] uppercase font-bold">{student.status || 'active'}</Badge>
                                <span className="text-[9px] text-gray-400 font-mono tracking-tighter">{student.nis}</span>
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
        </div>
    );
}
