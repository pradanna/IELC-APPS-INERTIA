import React, { useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/ui/Modal';
import InputLabel from '@/Components/ui/InputLabel';
import Select from '@/Components/ui/Select';
import Button from '@/Components/ui/Button';
import TextArea from '@/Components/ui/TextArea';
import TextInput from '@/Components/form/TextInput';
import { User, Phone, Mail, MapPin, Calendar, Camera, Users, Hash, ShieldCheck } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export default function StudentEditModal({ show, onClose, student }) {
    const fileInput = useRef();
    const [preview, setPreview] = React.useState(null);
    const [isCompressing, setIsCompressing] = React.useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        dob: '',
        address: '',
        parent_name: '',
        parent_phone: '',
        nis: '',
        status: 'active',
        profile_picture: null,
        _method: 'put', // Required for Laravel file uploads in PUT/PATCH
    });

    useEffect(() => {
        if (student) {
            setData({
                name: student.name || '',
                email: student.email || '',
                phone: student.contact || '',
                dob: student.dob_raw || '', 
                address: student.address || '',
                parent_name: student.parent_name || '',
                parent_phone: student.parent_phone || '',
                nis: student.nis || '',
                status: student.status?.toLowerCase() || 'active',
                profile_picture: null, // Don't send previous path as file
                _method: 'put',
            });
            setPreview(student.profile_picture || null);
            setIsCompressing(false);
        }
    }, [student]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file)); // Preview instant
            
            const options = {
                maxSizeMB: 1, 
                maxWidthOrHeight: 1024,
                useWebWorker: true,
            };

            try {
                setIsCompressing(true);
                const compressedBlob = await imageCompression(file, options);
                
                // Convert Blob to File to preserve filename and help backend detection
                const compressedFile = new File([compressedBlob], file.name, { 
                    type: file.type,
                    lastModified: Date.now() 
                });

                setData('profile_picture', compressedFile);
                setPreview(URL.createObjectURL(compressedFile));
            } catch (error) {
                console.error("Compression Error:", error);
            } finally {
                setIsCompressing(false);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.students.update', student.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                            <User size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 leading-tight">Edit Profil Siswa</h2>
                            <p className="text-xs text-gray-500">Update data akademik dan informasi pribadi</p>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    
                    {/* 1. Academic Info (Top) */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider">
                            <ShieldCheck size={14} />
                            Administrasi
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <InputLabel htmlFor="nis" value="Nomor Induk Siswa (NIS)" />
                                <TextInput
                                    id="nis"
                                    type="text"
                                    className="w-full !bg-gray-50 font-mono font-semibold"
                                    value={data.nis}
                                    onChange={(e) => setData('nis', e.target.value)}
                                    required
                                />
                                {errors.nis && <p className="text-xs text-red-600 mt-1">{errors.nis}</p>}
                            </div>
                            <div className="space-y-1">
                                <InputLabel htmlFor="status" value="Status Keanggotaan" />
                                <Select
                                    id="status"
                                    className="w-full"
                                    value={data.status}
                                    options={[
                                        { value: 'active', label: 'Active' },
                                        { value: 'graduated', label: 'Graduated' },
                                        { value: 'stop', label: 'Stop' },
                                    ]}
                                    onChange={(val) => setData('status', val)}
                                />
                                {errors.status && <p className="text-xs text-red-600 mt-1">{errors.status}</p>}
                            </div>
                        </div>
                    </section>

                    {/* 2. Personal Info & Photo */}
                    <section className="space-y-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider">
                            <User size={14} />
                            Informasi Pribadi
                        </div>

                        {/* Photo Upload Section */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200/50">
                            <div className="relative group">
                                <div className="h-24 w-24 rounded-full bg-white border-2 border-primary-100 flex items-center justify-center overflow-hidden shadow-sm">
                                    {preview ? (
                                        <img src={preview} className="h-full w-full object-cover" alt="Profile" />
                                    ) : (
                                        <User size={40} className="text-gray-300" />
                                    )}
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => fileInput.current.click()}
                                    className="absolute bottom-0 right-0 p-1.5 bg-primary-600 text-white rounded-full border-2 border-white shadow-lg hover:bg-primary-700 transition-all active:scale-90"
                                >
                                    <Camera size={14} />
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInput} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="text-center sm:text-left">
                                <p className="text-sm font-bold text-gray-900">Foto Profil</p>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">Format JPG atau PNG. Maksimal 2MB.<br/>Akan muncul di kartu absensi dan dashboard.</p>
                                {errors.profile_picture && <p className="text-[10px] text-red-600 mt-1.5 font-bold uppercase">{errors.profile_picture}</p>}
                            </div>
                        </div>

                        {/* Basic Details */}
                        <div className="space-y-4">
                            <div>
                                <InputLabel htmlFor="name" value="Nama Lengkap" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="w-full mt-1"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="w-full"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                                </div>
                                <div className="space-y-1">
                                    <InputLabel htmlFor="phone" value="No. Telepon / WhatsApp" />
                                    <TextInput
                                        id="phone"
                                        type="text"
                                        className="w-full"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                    {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="dob" value="Tanggal Lahir" />
                                <TextInput
                                    id="dob"
                                    type="date"
                                    className="w-full mt-1"
                                    value={data.dob}
                                    onChange={(e) => setData('dob', e.target.value)}
                                />
                                {errors.dob && <p className="text-xs text-red-600 mt-1">{errors.dob}</p>}
                            </div>

                            <div>
                                <InputLabel htmlFor="address" value="Alamat Lengkap" />
                                <TextArea
                                    id="address"
                                    className="w-full mt-1"
                                    rows={2}
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                                {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
                            </div>
                        </div>
                    </section>

                    {/* 3. Parent Info */}
                    <section className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider">
                            <Users size={14} />
                            Data Orang Tua / Wali
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <InputLabel htmlFor="parent_name" value="Nama Ayah/Ibu/Wali" />
                                <TextInput
                                    id="parent_name"
                                    type="text"
                                    className="w-full"
                                    value={data.parent_name}
                                    onChange={(e) => setData('parent_name', e.target.value)}
                                />
                                {errors.parent_name && <p className="text-xs text-red-600 mt-1">{errors.parent_name}</p>}
                            </div>
                            <div className="space-y-1">
                                <InputLabel htmlFor="parent_phone" value="No. Telp Wali" />
                                <TextInput
                                    id="parent_phone"
                                    type="text"
                                    className="w-full"
                                    value={data.parent_phone}
                                    onChange={(e) => setData('parent_phone', e.target.value)}
                                />
                                {errors.parent_phone && <p className="text-xs text-red-600 mt-1">{errors.parent_phone}</p>}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-white sticky bottom-0 z-10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 rounded-xl text-sm font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700 transition-all active:scale-95"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={processing || isCompressing}
                        className="px-8 py-2.5 rounded-xl text-sm font-extrabold text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
                    >
                        {isCompressing ? 'Sedang Kompres...' : (processing ? 'Menyimpan...' : 'Simpan Perubahan')}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
