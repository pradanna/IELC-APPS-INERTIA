import React from 'react';
import { Users, Building2, UserCheck, CalendarDays, Award } from 'lucide-react';

export default function TeacherDashboard({ stats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pengajar</p>
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">{stats.total_teachers}</h3>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                    <Building2 className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Cabang Aktif</p>
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">{stats.total_branches}</h3>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                    <UserCheck className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Guru Standby</p>
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">--</h3>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-primary-50 text-primary-600 rounded-lg">
                    <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Sesi Hari Ini</p>
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">--</h3>
                </div>
            </div>
        </div>
    );
}
