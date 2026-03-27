import React, { useState } from 'react';
import SlideOver from '@/Components/ui/SlideOver';
import Badge from '@/Components/ui/Badge';
import Modal from '@/Components/ui/Modal';
import { User, Phone, Mail, MapPin, Calendar, BookOpen, GraduationCap, Clock, Award, FileText, Edit, X, Search } from 'lucide-react';

export default function StudentDetailSlider({ show, onClose, student, onEdit }) {
    const [activeTab, setActiveTab] = useState('personal');
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

    if (!student) return null;

    const tabs = [
        { id: 'personal', label: 'Profil', icon: User },
        { id: 'academic', label: 'Akademik', icon: GraduationCap },
    ];

    const renderPersonalInfo = () => (
        <div className="p-6 space-y-8 ">
            {/* Header / Avatar */}
            <div className="text-center">
                <div className="mx-auto h-28 w-28 relative">
                    <div 
                        onClick={() => student.profile_picture && setIsImageViewerOpen(true)}
                        className="h-full w-full rounded-full bg-primary-100 flex items-center justify-center border-4 border-white shadow-md relative overflow-hidden group hover:ring-2 hover:ring-primary-400 transition-all cursor-pointer"
                    >
                        {student.profile_picture ? (
                            <img src={student.profile_picture} alt={student.name} className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-3xl font-bold text-primary-600 font-mono tracking-tighter">{student.name.charAt(0)}</span>
                        )}
                        {student.profile_picture && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Search className="text-white h-6 w-6" />
                            </div>
                        )}
                    </div>
                </div>
                {/* Compact Edit Button Under Photo */}
                <div className="mt-3 flex justify-center gap-2">
                    <button 
                        onClick={onEdit}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all active:scale-95"
                    >                        <Edit className="h-3 w-3 text-primary-600" />
                        Edit Data
                    </button>
                    <button 
                        onClick={onClose}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-bold text-gray-500 hover:bg-gray-100 transition-all active:scale-95"
                    >
                        Tutup
                    </button>
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900 tracking-tight">{student.name}</h3>
                <p className="text-sm text-gray-500">{student.nis} • {student.branch}</p>
                <div className="mt-2 inline-flex">
                    <Badge variant={
                        student.status === 'Active' ? 'success' : 
                        (student.status === 'Graduated' ? 'primary' : 'secondary')
                    }>
                        {student.status}
                    </Badge>
                </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 gap-6 pt-6 border-t border-gray-100">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                        <Phone size={18} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Tlp / WhatsApp</p>
                        <p className="text-sm text-gray-900 font-medium">{student.contact}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                        <Mail size={18} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Email</p>
                        <p className="text-sm text-gray-900 font-medium">{student.email || '-'}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                        <MapPin size={18} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Alamat</p>
                        <p className="text-sm text-gray-900 font-medium leading-relaxed">{student.address || '-'}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                        <Calendar size={18} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Tanggal Lahir</p>
                        <p className="text-sm text-gray-900 font-medium">{student.dob || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Parent Information */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
                <h4 className="text-xs font-bold text-gray-900 uppercase flex items-center gap-2">
                    <User size={14} className="text-primary-500" />
                    Data Orang Tua
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-medium">Nama</p>
                        <p className="text-sm text-gray-900 font-medium">{student.parent_name || '-'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-medium">No. Telepon</p>
                        <p className="text-sm text-gray-900 font-medium">{student.parent_phone || '-'}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAcademicInfo = () => (
        <div className="p-6 space-y-8">
            {/* Enrollment info */}
            <div className="group bg-primary-600 rounded-2xl p-6 text-white shadow-lg shadow-primary-500/20 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 text-white opacity-10 transform -rotate-12">
                    <GraduationCap size={120} />
                </div>
                <div className="relative z-10">
                    <p className="text-xs text-primary-200 font-medium uppercase tracking-widest">Enrollment</p>
                    <h3 className="text-xl font-bold mt-1">Siswa Terdaftar</h3>
                    <div className="mt-4 flex items-center gap-2 text-primary-100 italic text-sm">
                        <Clock size={14} />
                        Join pada: {student.created_at}
                    </div>
                </div>
            </div>

            {/* Current Class Status */}
            <section className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen size={18} className="text-primary-600" />
                    Status Kelas Saat Ini
                </h4>
                <div className="space-y-3">
                    {student.classes?.length > 0 ? (
                        student.classes.map(cls => (
                            <div key={cls.id} className="p-4 rounded-xl border border-gray-100 bg-white flex flex-col gap-1 shadow-sm hover:border-primary-100 transition-colors">
                                <span className="text-xs font-bold text-primary-600 uppercase tracking-tighter">{cls.package_name}</span>
                                <span className="text-base font-semibold text-gray-900">{cls.name}</span>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 text-orange-700 text-sm flex items-start gap-3 italic">
                            <Clock size={16} className="mt-0.5" />
                            Siswa ini belum memiliki plot kelas aktif. Silakan hubungi Frontdesk untuk plotting jadwal.
                        </div>
                    )}
                </div>
            </section>

             {/* Purchased History Snapshot */}
             <section className="space-y-4 border-t pt-8">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <FileText size={18} className="text-primary-600" />
                    Riwayat Paket Berhasil Dibayar
                </h4>
                <div className="space-y-3">
                    {student.purchased_packages?.map((pkg, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-dashed border-gray-200">
                             <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">{pkg.package_name}</span>
                                <span className="text-[11px] text-gray-500 italic">Terbayar Lunas</span>
                             </div>
                             <div className="text-right">
                                <Badge variant="primary">Plotting Ready</Badge>
                             </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );

    return (
        <React.Fragment>
            <SlideOver show={show} onClose={onClose} title="Detail Profil Siswa">
                <div className="flex flex-col h-full bg-white">
                    {/* Navigation Tabs */}
                    <div className="flex border-b border-gray-100">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all relative ${
                                    activeTab === tab.id ? 'text-primary-600 bg-primary-50/10' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto">
                        {activeTab === 'personal' && renderPersonalInfo()}
                        {activeTab === 'academic' && renderAcademicInfo()}
                    </div>
                </div>
            </SlideOver>

            {/* Photo Viewer Modal */}
            <Modal show={isImageViewerOpen} onClose={() => setIsImageViewerOpen(false)} maxWidth="2xl">
                <div className="relative p-1 bg-white rounded-2xl overflow-hidden">
                    <button 
                        onClick={() => setIsImageViewerOpen(false)}
                        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all z-10"
                    >
                        <X size={20} />
                    </button>
                    <img 
                        src={student.profile_picture} 
                        alt={student.name} 
                        className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl" 
                    />
                    <div className="p-4 bg-white text-center">
                        <p className="text-sm font-bold text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{student.nis} • Foto Profil Resmi</p>
                    </div>
                </div>
            </Modal>
        </React.Fragment>
    );
}
