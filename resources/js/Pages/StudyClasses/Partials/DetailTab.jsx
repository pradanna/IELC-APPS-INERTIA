import React from 'react';
import { BookOpen, User, Users } from 'lucide-react';

export default function DetailTab({ studyClass }) {
    return (
        <div className="p-6 space-y-8">
            {/* Basic Info */}
            <section className="space-y-4">
                <div className="flex items-center gap-3 text-gray-400">
                    <BookOpen size={18} />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Informasi Dasar</h3>
                </div>
                <div className="grid grid-cols-1 gap-5 ml-7">
                    <div>
                        <p className="text-xs text-gray-500">Nama Kelas</p>
                        <p className="font-medium text-gray-900">{studyClass.name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Paket / Level</p>
                        <p className="font-medium text-gray-900">{studyClass.package?.name || '-'}</p>
                    </div>
                </div>
            </section>

            {/* Teacher Info */}
            <section className="space-y-4 border-t pt-8">
                <div className="flex items-center gap-3 text-gray-400">
                    <User size={18} />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Pengajar</h3>
                </div>
                <div className="ml-7 space-y-3">
                    {studyClass.teachers?.length > 0 ? (
                        studyClass.teachers.map((teacher) => (
                            <div key={teacher.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                    {teacher.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{teacher.name}</p>
                                    <p className="text-xs text-gray-500">{teacher.email || teacher.phone || 'Guru @IELC'}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">Belum ada pengajar yang ditugaskan.</p>
                    )}
                </div>
            </section>

            {/* Stats Summary */}
            <section className="grid grid-cols-2 gap-4 border-t pt-8">
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium mb-1 uppercase tracking-tight">Total Siswa</p>
                    <p className="text-2xl font-bold text-blue-900">{studyClass.students?.length || 0}</p>
                </div>
                <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                    <p className="text-xs text-purple-600 font-medium mb-1 uppercase tracking-tight">Sesi Sepekan</p>
                    <p className="text-2xl font-bold text-purple-900">{studyClass.class_schedules?.length || 0}</p>
                </div>
            </section>
        </div>
    );
}
