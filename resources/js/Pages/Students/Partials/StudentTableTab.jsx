import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Eye, Edit, Repeat as RepeatIcon, MessageCircle, BookPlus } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import ClassPlacementModal from '../Modals/ClassPlacementModal';
import StudentEditModal from '../Modals/StudentEditModal';
import StudentDetailSlider from './StudentDetailSlider';

export default function StudentTableTab({ students, availableClasses = {}, branches = [], filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [openMenuId, setOpenMenuId] = useState(null);
    const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedStudentForDetail, setSelectedStudentForDetail] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        // Remove empty filters
        Object.keys(newFilters).forEach(k => {
            if (!newFilters[k]) delete newFilters[k];
        });

        router.get(route('admin.students.index'), newFilters, {
            preserveState: true,
            replace: true,
            only: ['students', 'filters'],
        });
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            handleFilterChange('search', searchTerm);
        }
    };
    
    // Extract actual data array handles both raw mockup array and backend Laravel pagination resource
    const studentList = students.data || students || [];
    const meta = students.meta || null;

    const handleActionClick = (action, student) => {
        setOpenMenuId(null); // Close menu after action
        if (action === "Ganti Kelas" || action === "Assign Class") {
            setSelectedStudent(student);
            setIsPlacementModalOpen(true);
        } else if (action === "Lihat Detail" || action === "Lihat Detail Profil (Konsep UX)") {
            setSelectedStudentForDetail(student);
            setIsDetailOpen(true);
        } else if (action === "Edit Data") {
            setSelectedStudent(student);
            setIsEditModalOpen(true);
        }
    };

    // Toggle menu dropdown
    const toggleMenu = (e, id) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col relative">
            {/* Click Backdrop for closing menus */}
            {openMenuId && (
                <div 
                    className="fixed inset-0 z-[90] bg-transparent" 
                    onClick={() => setOpenMenuId(null)}
                />
            )}

            <div className="px-5 py-4 border-b border-gray-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-[95]">
                <div className="flex-none">
                    <h3 className="text-base font-semibold text-gray-900">Master Data Siswa</h3>
                    <p className="text-xs text-gray-500 mt-1">Daftar lengkap seluruh siswa lembaga IELC</p>
                </div>
                
                <div className="flex flex-wrap w-full lg:w-auto items-center gap-3">
                    {/* Search Field */}
                    <div className="relative flex-1 min-w-[200px] lg:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                            onBlur={() => handleFilterChange('search', searchTerm)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                            placeholder="Cari NIS, Nama..."
                        />
                    </div>

                    {/* Branch Filter */}
                    <select 
                        value={filters.branch_id || ''}
                        onChange={(e) => handleFilterChange('branch_id', e.target.value)}
                        className="flex-none min-w-[130px] pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
                    >
                        <option value="">Semua Cabang</option>
                        {branches.map(branch => (
                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select 
                        value={filters.status || ''}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="flex-none min-w-[120px] pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
                    >
                        <option value="">Semua Status</option>
                        <option value="active">Active</option>
                        <option value="graduated">Graduated</option>
                        <option value="stop">Stop</option>
                    </select>

                    {/* Clear Filters */}
                    {(filters.search || filters.status || filters.branch_id) && (
                        <button 
                            onClick={() => router.get(route('admin.students.index'))}
                            className="text-xs font-bold text-red-500 hover:text-red-600 px-2 py-1 underline underline-offset-4"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>
            
            <div className="overflow-visible">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                NIS
                            </th>
                            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama Siswa & Kontak
                            </th>
                            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Program / Paket Utama
                            </th>
                            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kelas Saat Ini
                            </th>
                            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="relative px-5 py-3 w-10">
                                <span className="sr-only">Aksi</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {studentList.length > 0 ? studentList.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {student.nis}
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        {/* Profile Picture / Avatar */}
                                        <div className="flex-shrink-0">
                                            {student.profile_picture ? (
                                                <img 
                                                    src={student.profile_picture} 
                                                    alt={student.name} 
                                                    className="h-9 w-9 rounded-full object-cover ring-1 ring-gray-100 shadow-sm"
                                                />
                                            ) : (
                                                <div className="h-9 w-9 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-xs border border-primary-100 shadow-sm">
                                                    {student.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col">
                                            <button 
                                                onClick={() => handleActionClick("Lihat Detail", student)}
                                                className="text-sm font-semibold text-gray-900 hover:text-primary-600 text-left transition-colors"
                                            >
                                                {student.name}
                                            </button>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <a 
                                                    href={`https://wa.me/${student.contact.replace(/^0/, '62')}`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-green-600 transition-colors"
                                                >
                                                    <MessageCircle className="w-3 h-3" />
                                                    {student.contact}
                                                </a>
                                                <span className="text-gray-300">•</span>
                                                <span className="text-[11px] text-gray-400">{student.branch}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-600">
                                    {student.package}
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap">
                                    {student.class ? (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-700/10">
                                            {student.class}
                                        </span>
                                    ) : (
                                        <button 
                                            onClick={() => handleActionClick("Assign Class", student)}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 ring-1 ring-amber-600/10 transition-colors"
                                        >
                                            <BookPlus size={12} /> Plotting Kelas
                                        </button>
                                    )}
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                                        student.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-600'
                                    }`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap text-right text-sm font-medium relative overflow-visible">
                                    <div className="relative inline-block text-left">
                                        <button 
                                            onClick={(e) => toggleMenu(e, student.id)}
                                            className={`p-1.5 rounded-lg transition-colors ${openMenuId === student.id ? 'bg-gray-100 text-gray-900 shadow-inner' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                        
                                        {openMenuId === student.id && (
                                            <div className="absolute right-0 top-full mt-1 w-48 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-[100] overflow-hidden divide-y divide-gray-100 origin-top-right">
                                                <div className="py-1">
                                                    <button 
                                                        onClick={() => handleActionClick("Lihat Detail", student)}
                                                        className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 text-left"
                                                    >
                                                        <Eye className="mr-3 h-4 w-4 text-gray-400 group-hover:text-primary-500" />
                                                        Lihat Detail Profil
                                                    </button>
                                                    <button 
                                                        onClick={() => handleActionClick("Edit Data", student)}
                                                        className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 text-left"
                                                    >
                                                        <Edit className="mr-3 h-4 w-4 text-gray-400 group-hover:text-primary-500" />
                                                        Edit Data
                                                    </button>
                                                </div>
                                                <div className="py-1">
                                                    <button 
                                                        onClick={() => handleActionClick("Ganti Kelas", student)}
                                                        className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 text-left"
                                                    >
                                                        <RepeatIcon className="mr-3 h-4 w-4 text-gray-400 group-hover:text-primary-500" />
                                                        Plotting / Ganti Kelas
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="px-5 py-12 text-center">
                                    <p className="text-sm font-medium text-gray-900 mt-2">Belum ada data siswa</p>
                                    <p className="text-xs text-gray-500 mt-1">Data siswa baru akan muncul di sini setelah didaftarkan.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Placeholder */}
            {studentList.length > 0 && (
                <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <p className="text-sm text-gray-500 border-none">
                        Menampilkan <span className="font-medium text-gray-900">{meta?.from || 1}</span> hingga <span className="font-medium text-gray-900">{meta?.to || studentList.length}</span> dari <span className="font-medium text-gray-900">{meta?.total || studentList.length}</span> hasil
                    </p>
                    <div className="flex gap-1 border-none overflow-x-auto">
                        {meta && meta.links ? (
                            meta.links.map((link, i) => (
                                <Link 
                                    key={i}
                                    href={link.url}
                                    className={`px-3 py-1 text-sm border border-gray-200 rounded-md whitespace-nowrap ${link.active ? 'bg-primary-50 text-primary-600 border-primary-500 font-medium' : 'bg-white text-gray-500'} ${!link.url ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-50'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))
                        ) : (
                            <>
                                <button className="px-3 py-1 text-sm border border-gray-200 rounded-md bg-white text-gray-500 disabled:opacity-50">Sebelumnya</button>
                                <button className="px-3 py-1 text-sm border border-gray-200 rounded-md bg-white text-gray-500 disabled:opacity-50">Selanjutnya</button>
                            </>
                        )}
                    </div>
                </div>
            )}

            <ClassPlacementModal 
                show={isPlacementModalOpen}
                onClose={() => setIsPlacementModalOpen(false)}
                student={selectedStudent}
                availableClassesByPackage={availableClasses}
            />

            <StudentDetailSlider 
                show={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                student={selectedStudentForDetail}
                onEdit={() => {
                    setIsDetailOpen(false);
                    setSelectedStudent(selectedStudentForDetail);
                    setIsEditModalOpen(true);
                }}
            />

            <StudentEditModal 
                show={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedStudent(null);
                }}
                student={selectedStudent}
            />
        </div>
    );
}
