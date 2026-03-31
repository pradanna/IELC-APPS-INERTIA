import React, { useState } from 'react';
import SlideOver from '@/Components/ui/SlideOver';
import Badge from '@/Components/ui/Badge';
import Modal from '@/Components/ui/Modal';
import { User, Phone, Mail, MapPin, Award, Edit, X, Search, BookOpen, Clock, Building2, History } from 'lucide-react';

export default function TeacherDetailSlider({ show, onClose, teacher, onEdit }) {
    const [activeTab, setActiveTab] = useState('personal');
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

    if (!teacher) return null;

    const tabs = [
        { id: 'personal', label: 'Profil Guru', icon: User },
        { id: 'academic', label: 'History & Stat', icon: Award },
    ];

    const renderPersonalInfo = () => (
        <div className="p-6 space-y-8 ">
            {/* Header / Avatar */}
            <div className="text-center">
                <div className="mx-auto h-28 w-28 relative">
                    <div 
                        onClick={() => teacher.profile_picture && setIsImageViewerOpen(true)}
                        className="h-full w-full rounded-3xl bg-primary-100 flex items-center justify-center border-4 border-white shadow-md relative overflow-hidden group hover:ring-2 hover:ring-primary-400 transition-all cursor-pointer"
                    >
                        {teacher.profile_picture ? (
                            <img src={teacher.profile_picture} alt={teacher.name} className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-3xl font-bold text-primary-600 font-mono tracking-tighter">{teacher.name.charAt(0)}</span>
                        )}
                        {teacher.profile_picture && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Search className="text-white h-6 w-6" />
                            </div>
                        )}
                    </div>
                </div>
                {/* Compact Edit Button Under Photo */}
                <div className="mt-4 flex justify-center gap-2">
                    <button 
                        onClick={onEdit}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary-600 hover:bg-primary-700 rounded-full text-[11px] font-bold text-white shadow-lg shadow-primary-500/20 transition-all active:scale-95"
                    >
                        <Edit className="h-3.5 w-3.5" />
                        Edit Profil
                    </button>
                    <button 
                        onClick={onClose}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-[11px] font-bold text-gray-500 hover:bg-gray-100 transition-all active:scale-95"
                    >
                        Tutup
                    </button>
                </div>
                <h3 className="mt-5 text-xl font-bold text-gray-900 tracking-tight leading-tight">{teacher.name}</h3>
                <p className="text-sm text-primary-600 font-bold uppercase tracking-widest mt-1">{teacher.specialization || 'Professional Teacher'}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {teacher.branches?.map(branch => (
                        <div key={branch.id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-bold border border-gray-200 shadow-sm transition-all hover:bg-white hover:border-primary-200">
                             <Building2 size={12} className="opacity-60" />
                             {branch.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 gap-6 pt-8 border-t border-gray-100">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
                        <Phone size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Kontak WhatsApp</p>
                        <p className="text-sm text-gray-900 font-semibold">{teacher.phone || '-'}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl">
                        <Mail size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Email Institusi</p>
                        <p className="text-sm text-gray-900 font-semibold">{teacher.user?.email || '-'}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
                        <MapPin size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Domisili Guru</p>
                        <p className="text-xs text-gray-900 font-semibold leading-relaxed">{teacher.address || '-'}</p>
                    </div>
                </div>

                {/* Bio Summary Section */}
                <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100 space-y-3">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                         <History size={14} className="text-primary-500" />
                         Professional Bio
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed italic">
                        "{teacher.bio || 'Tidak ada deskripsi biografi untuk pengajar ini.'}"
                    </p>
                </div>
            </div>
        </div>
    );

    const renderAcademicInfo = () => (
        <div className="p-6 space-y-8">
            <div className="bg-primary-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden ring-4 ring-primary-50">
                 <div className="absolute right-[-20%] bottom-[-20%] text-white opacity-5">
                    <Award size={180} />
                 </div>
                 <div className="relative z-10">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary-400/20 text-primary-200 border border-primary-400/30 uppercase tracking-widest">
                         Active Period
                    </span>
                    <h3 className="text-2xl font-bold mt-2">Teaching History</h3>
                    <div className="mt-4 flex items-center gap-2 text-primary-300 italic text-sm">
                        <Clock size={16} />
                        Bergabung sejak: {new Date(teacher.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                 </div>
            </div>

            <section className="space-y-4 pt-4">
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <BookOpen size={16} className="text-primary-600" />
                      Kelas yang Sedang Diajar
                 </h4>
                 <div className="space-y-3">
                     <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 text-gray-400 text-sm flex flex-col items-center justify-center gap-2 border-dashed h-32">
                          <History size={24} className="opacity-40" />
                          <span className="text-xs font-medium italic">Data riwayat pengajaran belum dimigrasikan.</span>
                     </div>
                 </div>
            </section>
        </div>
    );

    return (
        <React.Fragment>
            <SlideOver show={show} onClose={onClose} title="Detail Profil Guru">
                <div className="flex flex-col h-full bg-white">
                    {/* Navigation Tabs */}
                    <div className="flex border-b border-gray-100 bg-white sticky top-0 z-20">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold transition-all relative ${
                                    activeTab === tab.id ? 'text-primary-700 bg-primary-50/20' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <tab.icon size={16} />
                                {tab.label.toUpperCase()}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto bg-white scrollbar-hide">
                        {activeTab === 'personal' && renderPersonalInfo()}
                        {activeTab === 'academic' && renderAcademicInfo()}
                    </div>
                </div>
            </SlideOver>

            {/* Photo Viewer Modal */}
            <Modal show={isImageViewerOpen} onClose={() => setIsImageViewerOpen(false)} maxWidth="2xl">
                <div className="relative p-1 bg-white rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                    <button 
                        onClick={() => setIsImageViewerOpen(false)}
                        className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all backdrop-blur-md z-10"
                    >
                        <X size={20} />
                    </button>
                    <img 
                        src={teacher.profile_picture} 
                        alt={teacher.name} 
                        className="w-full h-auto max-h-[80vh] object-contain rounded-2xl bg-gray-50" 
                    />
                    <div className="p-5 bg-white text-center border-t border-gray-50">
                        <p className="text-base font-bold text-gray-900 leading-tight">{teacher.name}</p>
                        <p className="text-[10px] text-primary-600 uppercase tracking-widest font-bold mt-1">{teacher.specialization || 'Professional Teaching Staff'}</p>
                    </div>
                </div>
            </Modal>
        </React.Fragment>
    );
}
