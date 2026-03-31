import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, Link } from '@inertiajs/react';
import { Search, Calendar, MapPin, User, Clock, CheckCircle2, Timer, Plus, Printer } from 'lucide-react';

export default function Index({ sessions, branches, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [date, setDate] = useState(filters.date || 'today');
    const [branchId, setBranchId] = useState(filters.branch_id || '');

    const handleFilter = (newFilters) => {
        router.get(route('admin.attendances.index'), {
            ...filters,
            ...newFilters
        }, { preserveState: true, preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="Attendance Dashboard" />
            
            <div className="space-y-6">
                {/* Header & Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">Attendance Dashboard</h1>
                        <p className="text-xs text-gray-500">Manage daily class presence and topics.</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Date Toggle */}
                        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                            {['today', 'yesterday'].map((d) => (
                                <button
                                    key={d}
                                    onClick={() => handleFilter({ date: d })}
                                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all ${
                                        (filters.date || 'today') === d 
                                        ? 'bg-white text-primary-600 shadow-sm border border-gray-200' 
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>

                        {/* Branch Filter (Superadmin only) */}
                        {branches.length > 0 && (
                            <select
                                value={filters.branch_id || ''}
                                onChange={(e) => handleFilter({ branch_id: e.target.value })}
                                className="text-xs font-bold bg-white border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 min-w-[140px]"
                            >
                                <option value="">All Branches</option>
                                {branches.map((b) => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        )}

                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search teacher or class..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter({ search })}
                                className="pl-9 pr-4 py-2 text-xs font-medium bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-[240px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Session Grid */}
                {sessions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {sessions.map((session) => (
                            <Link
                                key={`${session.type}-${session.id}`}
                                href={session.type === 'schedule' 
                                    ? route('admin.attendances.initiate', { type: 'schedule', id: session.id, date: filters.formatted_date }) 
                                    : route('admin.attendances.show', session.id)}
                                className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary-100 transition-all text-left block"
                            >
                                <div className="p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-primary-50 transition-colors">
                                            {session.type === 'schedule' ? (
                                                <Timer className="text-emerald-400 group-hover:text-emerald-500" size={16} />
                                            ) : (
                                                <Calendar className="text-gray-400 group-hover:text-primary-500" size={16} />
                                            )}
                                        </div>
                                        <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight ${
                                            session.status === 'completed' 
                                            ? 'bg-green-50 text-green-700' 
                                            : session.type === 'schedule'
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-amber-50 text-amber-700'
                                        }`}>
                                            {session.status}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                                            {session.study_class?.name}
                                        </h3>
                                        <p className="text-[10px] text-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                            {session.study_class?.package?.level?.name || 'General'}
                                            {session.type === 'schedule' && <span className="ml-2 text-emerald-500 font-black">• RECURRING</span>}
                                        </p>
                                    </div>

                                    <div className="space-y-2 pt-2 border-t border-gray-50">
                                        <div className="flex items-center gap-2 text-[11px] text-gray-600">
                                            <User size={13} className="text-gray-400" />
                                            <span className="font-semibold">{session.teacher?.user?.name || 'Unassigned'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] text-gray-600">
                                            <Clock size={13} className="text-gray-400" />
                                            <span>{session.start_time.substring(0, 5)} - {session.end_time.substring(0, 5)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] text-gray-600">
                                            <MapPin size={13} className="text-gray-400" />
                                            <span>{session.room?.name || 'TBA'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-4 py-2 border-t flex items-center justify-between transition-colors ${
                                    session.type === 'schedule' 
                                    ? 'bg-emerald-50/30 group-hover:bg-emerald-50 border-emerald-100' 
                                    : 'bg-gray-50 border-gray-100 group-hover:bg-primary-50/50'
                                }`}>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-bold uppercase tracking-tight ${
                                            session.type === 'schedule' ? 'text-emerald-600' : 'text-gray-400 group-hover:text-primary-500'
                                        }`}>
                                            {session.status === 'completed' ? 'Update Entry' : session.type === 'schedule' ? 'Initiate Session' : 'Start Attendance'}
                                        </span>
                                        {session.status === 'completed' && (
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-100/50 rounded text-green-700 text-[9px] font-black tabular-nums">
                                                <CheckCircle2 size={10} />
                                                {session.present_count}/{session.total_count}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        {session.status === 'completed' && (
                                            <button 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    window.open(route('admin.attendances.export-pdf', session.id));
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-white rounded-md transition-all shadow-sm border border-transparent hover:border-gray-200"
                                                title="Print Attendance PDF"
                                            >
                                                <Printer size={12} />
                                            </button>
                                        )}
                                        {session.status === 'completed' ? (
                                            <div className="p-1 text-green-500">
                                                <CheckCircle2 size={12} />
                                            </div>
                                        ) : (
                                            <Plus size={12} className={session.type === 'schedule' ? 'text-emerald-400' : 'text-gray-300 group-hover:text-primary-400'} />
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center">
                        <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            <Timer size={20} className="text-gray-300" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 capitalize">No {date} sessions found</h3>
                        <p className="text-xs text-gray-400 max-w-[240px] mx-auto mt-1">Try adjusting your branch or date filters to see scheduled classes.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

