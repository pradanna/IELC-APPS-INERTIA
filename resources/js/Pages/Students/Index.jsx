import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DashboardTab from './Partials/DashboardTab';
import StudentTableTab from './Partials/StudentTableTab';
import { LayoutDashboard, Users, BookOpen } from 'lucide-react';

export default function Index({ kpi, pendingStudents, expiringStudents, chartData, students, availableClasses, branches = [], filters = {} }) {
    const [activeTab, setActiveTabState] = useState(filters.tab || 'dashboard');
    
    const setActiveTab = (tab) => {
        setActiveTabState(tab);
        router.get(route('admin.students.index'), {
            ...filters,
            tab: tab
        }, {
            preserveScroll: true,
            preserveState: true,
            replace: true
        });
    };

    const handleCardClick = (extraFilters) => {
        // Switch tab to data siswa and apply filters
        setActiveTabState('data_siswa');
        router.get(route('admin.students.index'), {
            ...filters,
            ...extraFilters,
            tab: 'data_siswa'
        }, {
            preserveScroll: true,
            preserveState: true,
            replace: true
        });
    };

    const handleBranchFilter = (branchId) => {
        router.get(route('admin.students.index'), { 
            ...filters,
            branch_id: branchId,
            tab: activeTab // Preserve current tab
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    return (
        <AdminLayout>
            <Head title="Students Management" />

            <div className="space-y-6">
                {/* Branch Pills */}
                <div className="flex flex-wrap items-center gap-2 pb-2">
                    <button
                        onClick={() => handleBranchFilter('all')}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm border ${
                            !filters.branch_id || filters.branch_id === 'all'
                            ? 'bg-primary-600 text-white border-primary-600 shadow-primary-200'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-primary-300 hover:text-primary-600'
                        }`}
                    >
                        All Branches
                    </button>
                    {branches.map((branch) => (
                        <button
                            key={branch.id}
                            onClick={() => handleBranchFilter(branch.id.toString())}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm border ${
                                filters.branch_id === branch.id.toString()
                                ? 'bg-primary-600 text-white border-primary-600 shadow-primary-200'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-primary-300 hover:text-primary-600'
                            }`}
                        >
                            {branch.name}
                        </button>
                    ))}
                </div>

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Students Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage all students and their class placements.</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`${
                                activeTab === 'dashboard'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('data_siswa')}
                            className={`${
                                activeTab === 'data_siswa'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                        >
                            <Users className="w-4 h-4" />
                            Data Siswa
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-4">
                    {activeTab === 'dashboard' && (
                        <DashboardTab 
                            kpi={kpi} 
                            pendingStudents={pendingStudents} 
                            expiringStudents={expiringStudents} 
                            chartData={chartData} 
                            availableClasses={availableClasses}
                            onCardClick={handleCardClick}
                        />
                    )}
                    {activeTab === 'data_siswa' && (
                        <StudentTableTab 
                            students={students} 
                            availableClasses={availableClasses} 
                            branches={branches}
                            filters={filters}
                        />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
