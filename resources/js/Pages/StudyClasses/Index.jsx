import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/ui/DataTable';
import Button from '@/Components/ui/Button';
import SearchInput from '@/Components/ui/SearchInput';
import TableIconButton from '@/Components/ui/TableIconButton';
import ReactSelect from 'react-select';
import { Plus, Eye } from 'lucide-react';
import ClassFormModal from './Partials/ClassFormModal';
import StudyClassDetailSlider from './Partials/StudyClassDetailSlider';

export default function Index({ studyClasses, packages, teachers, rooms, branches = [], filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Provide default empty values if backend didn't paginate or return properly.
    const classData = studyClasses?.data || [];

    // Always get the freshest class data from the paginated collection based on ID
    const activeClass = selectedClassId ? classData.find(c => c.id === selectedClassId) : null;

    // Derive options for the Select2 filters
    const packageFilterOptions = [
        { value: 'all', label: 'Semua Paket' },
        ...(packages?.map(pkg => ({ value: pkg.id, label: pkg.name })) || [])
    ];

    const teacherFilterOptions = [
        { value: 'all', label: 'Semua Pengajar' },
        ...(teachers?.map(t => ({ value: t.id, label: t.name })) || [])
    ];

    // Filter states (Derived from URL/Props)
    const selectedPackage = packageFilterOptions.find(opt => opt.value == filters.package_id) || { value: 'all', label: 'Semua Paket' };
    const selectedTeacher = teacherFilterOptions.find(opt => opt.value == filters.teacher_id) || { value: 'all', label: 'Semua Pengajar' };

    const handleCreate = () => {
        setEditingClass(null);
        setIsModalOpen(true);
    };

    const handleEdit = (rowData) => {
        setEditingClass(rowData);
        setIsModalOpen(true);
    };

    const handleDetail = (rowData) => {
        setSelectedClassId(rowData.id);
        setIsDetailOpen(true);
    };

    const handleDelete = (rowData) => {
        if (confirm(`Apakah Anda yakin ingin menghapus kelas "${rowData.name}"?`)) {
            router.delete(route('admin.study-classes.destroy', rowData.id), {
                preserveScroll: true
            });
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingClass(null);
    };

    const handleFilterChange = (newFilters) => {
        router.get(route('admin.study-classes.index'), { 
            ...filters,
            ...newFilters
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const handleBranchFilter = (branchId) => {
        handleFilterChange({ branch_id: branchId });
    };

    const columns = [
        {
            header: 'Nama Kelas',
            accessor: 'name',
            className: 'font-medium text-gray-900',
        },
        {
            header: 'Mata Pelajaran / Paket',
            accessor: 'package',
            render: (row) => row.package?.name || '-',
        },
        {
            header: 'Pengajar (Guru)',
            accessor: 'teachers',
            render: (row) => row.teachers?.length > 0 ? row.teachers.map(t => t.name).join(', ') : '-',
        },
        {
            header: 'Aksi',
            accessor: 'action',
            className: 'text-right min-w-[100px]',
            render: (row) => (
                <div className="flex items-center justify-end gap-2">
                    <TableIconButton 
                        type="detail"
                        onClick={(e) => { e.stopPropagation(); handleDetail(row); }} 
                    />
                    <TableIconButton 
                        type="edit"
                        onClick={(e) => { e.stopPropagation(); handleEdit(row); }} 
                    />
                    <TableIconButton 
                        type="delete"
                        onClick={(e) => { e.stopPropagation(); handleDelete(row); }} 
                    />
                </div>
            )
        }
    ];

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        handleFilterChange({ search: value });
    };

    const filterSection = (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            <div className="w-full md:w-1/3">
                <SearchInput 
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Cari nama kelas..."
                />
            </div>
            <div className="w-full md:w-2/3 flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                    <ReactSelect 
                        options={packageFilterOptions}
                        value={selectedPackage}
                        onChange={(opt) => handleFilterChange({ package_id: opt?.value || 'all' })}
                        placeholder="Filter by Paket..."
                        className="text-sm"
                        classNamePrefix="react-select"
                        isClearable
                        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                        styles={{
                            menuPortal: base => ({ ...base, zIndex: 20000 }),
                            control: (base) => ({
                                ...base,
                                borderRadius: '0.5rem',
                                borderColor: '#e5e7eb',
                                padding: '1px',
                                boxShadow: 'none',
                                '&:hover': { borderColor: '#d1d5db' }
                            })
                        }}
                    />
                </div>
                <div className="flex-1">
                    <ReactSelect 
                        options={teacherFilterOptions}
                        value={selectedTeacher}
                        onChange={(opt) => handleFilterChange({ teacher_id: opt?.value || 'all' })}
                        placeholder="Filter by Pengajar..."
                        className="text-sm"
                        classNamePrefix="react-select"
                        isClearable
                        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                        styles={{
                            menuPortal: base => ({ ...base, zIndex: 9999 }),
                            control: (base) => ({
                                ...base,
                                borderRadius: '0.5rem',
                                borderColor: '#e5e7eb',
                                padding: '1px',
                                boxShadow: 'none',
                                '&:hover': { borderColor: '#d1d5db' }
                            })
                        }}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <AdminLayout>
            <Head title="Class Management" />

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

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">Study Class Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Kelola data ruang kelas belajar, paket belajar, dan pengajar.</p>
                    </div>
                    <div>
                        <Button 
                            onClick={handleCreate}
                            className="bg-primary-600 text-white hover:bg-primary-700 font-medium px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Tambah Kelas
                        </Button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-0 overflow-hidden">
                    <DataTable 
                        columns={columns}
                        data={classData}
                        filterSection={filterSection}
                        itemsPerPage={10} 
                        pagination={studyClasses}
                    />
                </div>
            </div>

            <ClassFormModal 
                show={isModalOpen}
                onClose={handleCloseModal}
                editingClass={editingClass}
                packages={packages}
                teachers={teachers}
                branches={branches}
            />

            {/* Detail Slider */}
            <StudyClassDetailSlider 
                show={isDetailOpen}
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelectedClassId(null);
                }}
                studyClass={activeClass}
                rooms={rooms}
                teachers={teachers}
            />

        </AdminLayout>
    );
}
