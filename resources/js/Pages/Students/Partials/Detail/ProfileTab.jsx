import React from 'react';
import Badge from '@/Components/ui/Badge';
import { User, Phone, Mail, MapPin, Calendar, Edit, Search } from 'lucide-react';

export default function ProfileTab({ student, onEdit, toggleImageViewer, onClose }) {
    if (!student) return null;

    return (
        <div className="p-6 space-y-8 ">
            {/* Header / Avatar */}
            <div className="text-center">
                <div className="mx-auto h-28 w-28 relative">
                    <div 
                        onClick={() => student.profile_picture && toggleImageViewer(true)}
                        className="h-full w-full rounded-full bg-primary-100 flex items-center justify-center border-4 border-white shadow-md relative overflow-hidden group hover:ring-2 hover:ring-primary-400 transition-all cursor-pointer"
                    >
                        {student.profile_picture ? (
                            <img src={student.profile_picture} alt={student.name} className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-3xl font-bold text-primary-600 font-mono tracking-tighter">{(student.name || 'S').charAt(0)}</span>
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
                    >
                        <Edit className="h-3 w-3 text-primary-600" />
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
}
