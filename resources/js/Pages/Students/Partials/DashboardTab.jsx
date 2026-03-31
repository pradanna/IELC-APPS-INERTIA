import React, { useState } from 'react';
import { Users, UserPlus, AlertCircle, CalendarClock, PieChart as PieChartIcon, Settings } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ClassPlacementModal from '../Modals/ClassPlacementModal';

// Recharts colors
const COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#8b5cf6'];

export default function DashboardTab({ kpi, pendingStudents, expiringStudents, chartData, availableClasses = {}, onCardClick }) {
    const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false);
    const [selectedStudentForPlot, setSelectedStudentForPlot] = useState(null);

    const handlePlotClick = (student) => {
        setSelectedStudentForPlot(student);
        setIsPlacementModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Lapis Atas: KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                    onClick={() => onCardClick({ status: 'active', filter: null })}
                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-blue-100 transition-all group"
                >
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Siswa Aktif</p>
                        <h3 className="text-2xl font-bold text-gray-900 leading-tight">{kpi.totalActive}</h3>
                    </div>
                </div>
                
                <div 
                    onClick={() => onCardClick({ filter: 'new', status: null })}
                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-green-100 transition-all group"
                >
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Siswa Baru (Bulan Ini)</p>
                        <h3 className="text-2xl font-bold text-gray-900 leading-tight">{kpi.newStudents}</h3>
                    </div>
                </div>

                <div 
                    onClick={() => onCardClick({ filter: 'pending', status: null })}
                    className="bg-white p-5 rounded-xl border border-red-100 shadow-sm flex items-center gap-4 relative overflow-hidden ring-1 ring-red-500/10 cursor-pointer hover:shadow-md hover:border-red-200 transition-all group"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg relative z-10 animate-pulse group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-medium text-red-600 uppercase tracking-wider">Belum Masuk Kelas</p>
                        <h3 className="text-2xl font-bold text-gray-900 leading-tight">{kpi.pendingPlacement}</h3>
                        <p className="text-xs text-red-500 mt-0.5">Membutuhkan penempatan kelas segera</p>
                    </div>
                </div>
            </div>

            {/* Lapis Tengah: To-Do Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tabel Menunggu Penempatan */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Siswa Menunggu Penempatan Kelas</h3>
                            <p className="text-xs text-gray-500 mt-1">Siswa yang sudah lunas tetapi belum diplot ke kelas</p>
                        </div>
                    </div>
                    <div className="p-0 flex-1 overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asal Paket</th>
                                    <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {pendingStudents.length > 0 ? pendingStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50/50">
                                        <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {student.name}
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                                                {student.package}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap text-sm text-right">
                                            <button 
                                                onClick={() => handlePlotClick(student)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
                                            >
                                                <Settings className="w-3.5 h-3.5" />
                                                Plotting Kelas
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="px-5 py-8 text-center text-sm text-gray-500">
                                            Tidak ada siswa yang menunggu penempatan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tabel Hampir Habis Masa Aktif */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Siswa Hampir Jatuh Tempo</h3>
                            <p className="text-xs text-gray-500 mt-1">Sisa masa aktif paket 1-2 minggu</p>
                        </div>
                    </div>
                    <div className="p-0 flex-1 overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paket</th>
                                    <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sisa Waktu</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {expiringStudents.length > 0 ? expiringStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50/50">
                                        <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {student.name}
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {student.package}
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap text-sm text-right">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                                                student.weeks_left <= 1 ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                                            }`}>
                                                <CalendarClock className="w-3.5 h-3.5" />
                                                {student.weeks_left} Minggu Lagi
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="px-5 py-8 text-center text-sm text-gray-500">
                                            Semua masa aktif terpantau aman.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Lapis Bawah: Visualisasi */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <PieChartIcon className="w-4 h-4 text-gray-400" />
                        Distribusi Siswa per Program
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Ringkasan popularitas paket yang sedang aktif</p>
                </div>
                <div className="h-64 sm:h-80 w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value) => [`${value} Siswa`, 'Jumlah']}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                            />
                            <Legend 
                                verticalAlign="bottom" 
                                height={36}
                                iconType="circle"
                                wrapperStyle={{ fontSize: '12px', color: '#4b5563' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <ClassPlacementModal 
                show={isPlacementModalOpen}
                onClose={() => setIsPlacementModalOpen(false)}
                student={selectedStudentForPlot}
                availableClassesByPackage={availableClasses}
            />
        </div>
    );
}
