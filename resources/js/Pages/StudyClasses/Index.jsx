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

export default function Index({ studyClasses, packages, teachers, rooms }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
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

    // Filter Logic
    const filteredData = classData.filter(item => {
        // Search Term Filter
        const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.package?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.teachers?.some(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Package Filter
        const matchPackage = !selectedPackage || selectedPackage.value === 'all' || item.package_id === selectedPackage.value;
        
        // Teacher Filter
        const matchTeacher = !selectedTeacher || selectedTeacher.value === 'all' || item.teachers?.some(t => t.id === selectedTeacher.value);

        return matchSearch && matchPackage && matchTeacher;
    });

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
            router.delete(route('admin.study-classes.destroy', rowData.id));
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingClass(null);
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

    const filterSection = (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            <div className="w-full md:w-1/3">
                <SearchInput 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari nama kelas..."
                />
            </div>
            <div className="w-full md:w-2/3 flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                    <ReactSelect 
                        options={packageFilterOptions}
                        value={selectedPackage}
                        onChange={setSelectedPackage}
                        placeholder="Filter by Paket..."
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
                <div className="flex-1">
                    <ReactSelect 
                        options={teacherFilterOptions}
                        value={selectedTeacher}
                        onChange={setSelectedTeacher}
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
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Study Class Management</h1>
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
                        data={filteredData}
                        filterSection={filterSection}
                        itemsPerPage={10}
                    />
                </div>
            </div>

            <ClassFormModal 
                show={isModalOpen}
                onClose={handleCloseModal}
                editingClass={editingClass}
                packages={packages}
                teachers={teachers}
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
