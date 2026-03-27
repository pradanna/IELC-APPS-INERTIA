import React from 'react';
import { Mail, MapPin, Phone, Award, Building2 } from 'lucide-react';

export default function TeacherTable({ teachers, branches, onEdit, onView }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto text-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Info Pengajar</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kontak</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cabang</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Spesialisasi</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100 uppercase tracking-tight">
                        {teachers.data.map((teacher) => (
                            <tr key={teacher.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div 
                                        className="flex items-center gap-3 cursor-pointer group/item"
                                        onClick={() => onView(teacher)}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-600 font-bold overflow-hidden shadow-sm shadow-primary-500/10 transition-transform group-hover/item:scale-110">
                                            {teacher.profile_picture ? (
                                                <img src={teacher.profile_picture} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-lg">{teacher.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 leading-tight group-hover/item:text-primary-600 transition-colors">{teacher.name}</p>
                                            <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1 uppercase font-semibold">
                                                <Mail className="w-2.5 h-2.5" />
                                                {teacher.user?.email || '-'}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-[11px] text-gray-600 font-medium">
                                            <Phone className="w-3 h-3 text-gray-400" />
                                            {teacher.phone || '-'}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[11px] text-gray-600 font-medium">
                                            <MapPin className="w-3 h-3 text-gray-400" />
                                            <span className="truncate max-w-[150px]">{teacher.address || '-'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-wrap gap-1.5">
                                        {teacher.branches?.map((branch) => (
                                            <span 
                                                key={branch.id}
                                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[9px] font-bold border transition-all ${
                                                    branch.pivot?.is_primary 
                                                        ? 'bg-primary-50 text-primary-700 border-primary-200 shadow-sm' 
                                                        : 'bg-gray-50 text-gray-600 border-gray-200'
                                                }`}
                                            >
                                                <Building2 className="w-2.5 h-2.5 opacity-60" />
                                                {branch.name}
                                                {branch.pivot?.is_primary && <span className="text-[7px] bg-primary-200/50 px-1 rounded ml-1 opacity-70">MAIN</span>}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 text-gray-700 text-[10px] font-bold rounded-full shadow-sm">
                                        <Award className="w-3 h-3 text-primary-500" />
                                        {teacher.specialization || 'GENERAL TEACHER'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => onView(teacher)}
                                            className="text-primary-600 hover:bg-primary-50 transition-all font-bold text-[10px] uppercase border border-primary-100 rounded-lg px-3 py-1.5 shadow-sm"
                                        >
                                            Detail
                                        </button>
                                        <button 
                                            onClick={() => onEdit(teacher)}
                                            className="text-gray-600 hover:bg-gray-50 transition-all font-bold text-[10px] uppercase border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Placeholder */}
            {teachers.links && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-500 font-medium">Halaman {teachers.current_page} dari {teachers.last_page}</p>
                    {/* Add actual pagination component here later */}
                </div>
            )}
        </div>
    );
}
