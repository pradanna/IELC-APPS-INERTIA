import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Users, 
    BookOpen, 
    ChevronRight, 
    Search, 
    Filter,
    GraduationCap,
    Clock,
    AlertCircle,
    ArrowRight
} from 'lucide-react';

export default function Index({ classes, branches, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        router.get(route('admin.academic.index'), { ...filters, search: value }, {
            preserveState: true,
            replace: true
        });
    };

    const handleBranchFilter = (branchId) => {
        router.get(route('admin.academic.index'), { ...filters, branch_id: branchId }, {
            preserveState: true
        });
    };

    return (
        <AdminLayout>
            <Head title="Academic Management" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                            <GraduationCap className="text-primary-600" size={28} />
                            Academic Recording
                        </h1>
                        <p className="text-sm text-gray-500 mt-1 font-medium">Record and manage student performance in batch.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                         <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder="Search class name..."
                                className="pl-10 pr-4 py-2 bg-white border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all w-64 shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Branch Pills */}
                <div className="flex flex-wrap items-center gap-2 pb-2">
                    <button
                        onClick={() => handleBranchFilter('all')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                            !filters.branch_id || filters.branch_id === 'all'
                            ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/20'
                            : 'bg-white text-gray-400 border-gray-100 hover:border-primary-200 hover:text-primary-600'
                        }`}
                    >
                        All
                    </button>
                    {branches.map((branch) => (
                        <button
                            key={branch.id}
                            onClick={() => handleBranchFilter(branch.id.toString())}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                filters.branch_id === branch.id.toString()
                                ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/20'
                                : 'bg-white text-gray-400 border-gray-100 hover:border-primary-200 hover:text-primary-600'
                            }`}
                        >
                            {branch.name}
                        </button>
                    ))}
                </div>

                {/* Class Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {classes.data.length > 0 ? (
                        classes.data.map((c) => (
                            <Link
                                key={c.id}
                                href={route('admin.academic.show', c.id)}
                                className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all active:scale-[0.98] relative overflow-hidden"
                            >
                                {/* Decorative Accent */}
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="p-2 bg-primary-50 rounded-xl text-primary-600">
                                            <BookOpen size={20} />
                                        </div>
                                        <div className="bg-gray-50 px-2 py-0.5 rounded text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                                            {c.package?.level?.name || 'Class'}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-black text-gray-900 group-hover:text-primary-600 transition-colors leading-tight truncate">
                                            {c.name}
                                        </h3>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <Users size={12} className="text-gray-400" />
                                            <span className="text-[11px] font-bold text-gray-500">{c.students_count} Enrolled Students</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex flex-col gap-1">
                                            <Link 
                                                href={route('admin.academic.show', c.id)}
                                                className="text-[10px] font-black uppercase text-primary-500 flex items-center gap-1 hover:text-primary-700 transition-colors group/link"
                                            >
                                                Manage Academic
                                                <ChevronRight size={10} className="group-hover/link:translate-x-0.5 transition-transform" />
                                            </Link>
                                            <Link 
                                                href={route('admin.academic.report', c.id)}
                                                className="text-[9px] font-bold uppercase text-gray-400 flex items-center gap-1 hover:text-primary-500 transition-colors group/report"
                                            >
                                                View Class Report
                                                <ArrowRight size={8} className="group-hover/report:translate-x-0.5 transition-transform" />
                                            </Link>
                                        </div>
                                        <div className="flex -space-x-2">
                                            {c.teachers?.slice(0, 2).map((t, idx) => (
                                                <div 
                                                    key={idx}
                                                    title={t.user?.name}
                                                    className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-black text-gray-400 overflow-hidden"
                                                >
                                                    {t.user?.name?.substring(0, 1) || '?'}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-20 bg-white border border-dashed border-gray-200 rounded-3xl flex flex-col items-center text-center">
                            <div className="p-4 bg-gray-50 rounded-full text-gray-300 mb-4">
                                <AlertCircle size={32} />
                            </div>
                            <h3 className="text-base font-bold text-gray-400">No classes found</h3>
                            <p className="text-xs text-gray-400 mt-1">Try adjusting your branch or search filters.</p>
                        </div>
                    )}
                </div>

                {/* Pagination placeholder - keeping it simple for index */}
                {classes.links && classes.links.length > 3 && (
                     <div className="flex justify-center pt-8">
                       {/* Pagination component here if needed */}
                     </div>
                )}
            </div>
        </AdminLayout>
    );
}
