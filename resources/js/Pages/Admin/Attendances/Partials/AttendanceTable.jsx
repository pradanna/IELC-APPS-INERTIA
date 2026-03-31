import React, { useState } from "react";
import { User, MessageSquare, AlertCircle, Clock, Search, X, Plus } from "lucide-react";

export default function AttendanceTable({ data, setData, errors, onRemove }) {
    const [searchTerm, setSearchTerm] = useState("");

    const updateAttendance = (studentId, fields) => {
        const newAttendances = data.attendances.map(item => 
            item.student_id === studentId ? { ...item, ...fields } : item
        );
        setData("attendances", newAttendances);
    };

    const handleStatusChange = (studentId, status) => {
        const fieldUpdate = { status };
        
        // Clear late_minutes if not late
        if (status !== 'late') {
            fieldUpdate.late_minutes = null;
        } else {
            // Find current value to avoid overwriting if already set
            const current = data.attendances.find(a => a.student_id === studentId);
            if (current && current.late_minutes === null) {
                fieldUpdate.late_minutes = 0;
            }
        }
        
        updateAttendance(studentId, fieldUpdate);
    };

    const handleMinutesChange = (studentId, minutes) => {
        updateAttendance(studentId, { late_minutes: parseInt(minutes) || 0 });
    };

    const handleNotesChange = (studentId, notes) => {
        updateAttendance(studentId, { teacher_notes: notes });
    };

    const statusOptions = [
        { label: 'Present', value: 'present', color: 'bg-green-100 text-green-700 hover:bg-green-700 hover:text-white', activeColor: 'bg-green-600 text-white border-green-600 ring-4 ring-green-100' },
        { label: 'Absent', value: 'absent', color: 'bg-red-100 text-red-700 hover:bg-red-700 hover:text-white', activeColor: 'bg-red-600 text-white border-red-600 ring-4 ring-red-100' },
        { label: 'Late', value: 'late', color: 'bg-amber-100 text-amber-700 hover:bg-amber-700 hover:text-white', activeColor: 'bg-amber-500 text-white border-amber-500 ring-4 ring-amber-100' },
        { label: 'Excused', value: 'excused', color: 'bg-blue-100 text-blue-700 hover:bg-blue-700 hover:text-white', activeColor: 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100' },
    ];

    const filteredAttendances = data.attendances.filter(student => 
        (student.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col">
            {/* Search Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/20">
                <div className="relative group">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input 
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search student in this class..."
                        className="w-full h-9 pl-9 pr-9 bg-white border-gray-200 rounded-xl text-xs font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full text-gray-400"
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50/30 border-b border-gray-100">
                            <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Student Info</th>
                            <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                            <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Documentation</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredAttendances.map((student) => (
                            <tr key={student.student_id} className="group hover:bg-primary-50/10 transition-colors">
                                <td className="px-5 py-4 align-top w-[240px]">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-[11px] font-black border border-gray-200 overflow-hidden">
                                                {student.name?.substring(0, 1)}
                                            </div>
                                            {student.is_fill_in && (
                                                <div className="absolute -top-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white shadow-sm">
                                                    <Plus size={6} strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <p className="text-xs font-black text-gray-800 truncate tracking-tight">{student.name}</p>
                                                {student.is_fill_in && (
                                                    <span className="bg-emerald-50 text-emerald-700 text-[8px] font-black px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-tighter">Fill-in</span>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tabular-nums">NIS: #{student.nis}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4 align-top w-[400px]">
                                    <div className="flex flex-wrap gap-2">
                                        {statusOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => handleStatusChange(student.student_id, opt.value)}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
                                                    student.status === opt.value
                                                        ? opt.activeColor
                                                        : `bg-white border-gray-100 text-gray-400 hover:border-gray-300`
                                                }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Late Input Field */}
                                    {student.status === 'late' && (
                                        <div className="mt-3 flex items-center gap-3 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600">
                                                <Clock size={14} />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-[9px] font-black text-amber-700 uppercase tracking-tighter mb-1">Minutes Late</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={student.late_minutes || 0}
                                                        onChange={(e) => handleMinutesChange(student.student_id, e.target.value)}
                                                        className="w-full text-xs font-bold bg-white border-amber-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-amber-500/20 tabular-nums h-8"
                                                        min="0"
                                                        autoFocus
                                                    />
                                                    <span className="text-[10px] font-black text-amber-600 uppercase">Mins</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </td>
                                <td className="px-5 py-4 align-top relative">
                                    <div className="relative group/note">
                                        <MessageSquare size={12} className="absolute left-3 top-3 text-gray-300 group-focus-within/note:text-primary-400 transition-colors" />
                                        <textarea
                                            value={student.teacher_notes}
                                            onChange={(e) => handleNotesChange(student.student_id, e.target.value)}
                                            placeholder="Add observation..."
                                            className="w-full text-[11px] font-medium bg-gray-50 border-gray-100 rounded-xl pl-9 pr-3 py-2.5 h-[56px] min-h-[56px] max-h-[120px] resize-y focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 placeholder:text-gray-300 transition-all shadow-inner"
                                        />
                                    </div>

                                    {/* Remove button for fill-in students */}
                                    {student.is_fill_in && (
                                        <button 
                                            onClick={() => onRemove(student.student_id)}
                                            className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            title="Remove Fill-in Student"
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {(filteredAttendances.length === 0 && data.attendances.length > 0) && (
                    <div className="py-20 text-center">
                        <Search size={32} className="text-gray-200 mx-auto mb-3" />
                        <p className="text-xs font-bold text-gray-400">No students match your search.</p>
                        <button 
                            onClick={() => setSearchTerm("")}
                            className="mt-2 text-[10px] font-black text-primary-600 uppercase"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {data.attendances.length === 0 && (
                    <div className="py-20 text-center">
                        <User size={32} className="text-gray-200 mx-auto mb-3" />
                        <p className="text-xs font-bold text-gray-400">No students enrolled in this class.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
