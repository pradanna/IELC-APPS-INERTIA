import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DashboardTab from './Partials/DashboardTab';
import StudentTableTab from './Partials/StudentTableTab';
import { LayoutDashboard, Users, BookOpen } from 'lucide-react';

export default function Index({ kpi, pendingStudents, expiringStudents, chartData, students, availableClasses, branches, filters }) {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <AdminLayout>
            <Head title="Students Management" />

            <div className="space-y-6">
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
