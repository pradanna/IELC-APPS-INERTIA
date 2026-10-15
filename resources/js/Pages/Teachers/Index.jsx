import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { LayoutDashboard, Users, UserPlus } from 'lucide-react';
import Button from '@/Components/ui/Button';
import TeacherDashboard from './Partials/TeacherDashboard';
import TeacherTable from './Partials/TeacherTable';
import TeacherFormModal from './Partials/Modals/TeacherFormModal';
import TeacherDetailSlider from './Partials/TeacherDetailSlider';

export default function Index({ teachers, branches, stats }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isDetailSliderOpen, setIsDetailSliderOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const handleAdd = () => {
        setSelectedTeacher(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (teacher) => {
        setSelectedTeacher(teacher);
        setIsDetailSliderOpen(false);
        setIsFormModalOpen(true);
    };

    const handleView = (teacher) => {
        setSelectedTeacher(teacher);
        setIsDetailSliderOpen(true);
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Pengajar" />

            <div className="space-y-6 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Manajemen Pengajar</h1>
                        <p className="text-sm text-gray-500 mt-1">Kelola profil guru, penempatan cabang, dan jadwal pengajaran.</p>
                    </div>
                    <Button 
                        onClick={handleAdd}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-bold flex items-center justify-center gap-2 px-5 py-2.5 shadow-md shadow-primary-500/20 shrink-0"
                    >
                        <UserPlus size={18} />
                        Tambah Guru
                    </Button>
                </div>

                {/* Tabs Selection */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6 sm:space-x-8 overflow-x-auto scrollbar-none" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`${
                                activeTab === 'dashboard'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-all`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Overview Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('data_guru')}
                            className={`${
                                activeTab === 'data_guru'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-all`}
                        >
                            <Users className="w-4 h-4" />
                            Data Seluruh Guru
                        </button>
                    </nav>
                </div>

                {/* Tab Content Display */}
                <div className="mt-4">
                    {activeTab === 'dashboard' && (
                        <TeacherDashboard stats={stats} />
                    )}
                    {activeTab === 'data_guru' && (
                        <TeacherTable teachers={teachers} branches={branches} onEdit={handleEdit} onView={handleView} />
                    )}
                </div>
            </div>

            <TeacherFormModal 
                show={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                teacher={selectedTeacher}
                branches={branches}
            />

            <TeacherDetailSlider 
                show={isDetailSliderOpen}
                onClose={() => setIsDetailSliderOpen(false)}
                teacher={selectedTeacher}
                onEdit={() => handleEdit(selectedTeacher)}
            />
        </AdminLayout>
    );
}
