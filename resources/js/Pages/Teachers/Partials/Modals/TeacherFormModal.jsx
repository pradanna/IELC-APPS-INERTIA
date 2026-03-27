import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import imageCompression from 'browser-image-compression';
import Modal from '@/Components/ui/Modal';
import InputLabel from '@/Components/ui/InputLabel';
import Button from '@/Components/ui/Button';
import TextArea from '@/Components/ui/TextArea';
import { User, Phone, Mail, MapPin, Award, Camera, Lock, Building2 } from 'lucide-react';
import TextInput from '@/Components/form/TextInput';
import Select from '@/Components/ui/Select';

export default function TeacherFormModal({ show, onClose, teacher = null, branches = [] }) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        specialization: '',
        bio: '',
        branch_id: '',
        profile_picture: '',
    });

    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (show) {
            clearErrors();
            if (teacher) {
                setData({
                    name: teacher.name || '',
                    email: teacher.user?.email || '',
                    password: '', // Leave empty on edit
                    phone: teacher.phone || '',
                    address: teacher.address || '',
                    specialization: teacher.specialization || '',
                    bio: teacher.bio || '',
                    branch_id: teacher.branches?.find(b => b.pivot.is_primary)?.id || '',
                    profile_picture: '', // No default, keep empty if no change
                });
                setPreview(teacher.profile_picture || null);
            } else {
                reset();
                setPreview(null);
            }
        }
    }, [show, teacher]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const options = {
                maxSizeMB: 0.1, // 100kb
                maxWidthOrHeight: 800,
                useWebWorker: true,
            };
            try {
                const compressedFile = await imageCompression(file, options);
                const reader = new FileReader();
                reader.readAsDataURL(compressedFile);
                reader.onloadend = () => {
                    const base64data = reader.result;
                    setData('profile_picture', base64data);
                    setPreview(base64data);
                };
            } catch (error) {
                console.error("Compression Error:", error);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (teacher) {
            put(route('admin.teachers.update', teacher.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route('admin.teachers.store'), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    const branchOptions = branches.map(b => ({
        value: b.id,
        label: b.name
    }));

    return (
        <Modal show={show} onClose={onClose} maxWidth="4xl">
            <form onSubmit={handleSubmit} className="p-1">
                <div className="flex flex-col md:flex-row h-full overflow-hidden">
                    {/* Left: Identity & Photo */}
                    <div className="w-full md:w-1/3 bg-gray-50/50 p-8 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center">
                        <div className="relative group cursor-pointer group">
                            <div className="w-32 h-32 rounded-3xl bg-white border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-primary-400 transition-all shadow-sm">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera className="w-8 h-8 text-gray-300 group-hover:text-primary-400" />
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <div className="mt-4 text-center">
                                <p className="text-xs font-bold text-gray-900">Foto Profil</p>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tight">Klik untuk ganti</p>
                            </div>
                        </div>

                        <div className="mt-10 w-full space-y-5">
                            <div className="space-y-1.5">
                                <InputLabel htmlFor="email" value="Email Institusi" />
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="pl-9 w-full bg-white"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.email && <p className="text-[10px] text-red-500">{errors.email}</p>}
                            </div>

                            {!teacher && (
                                <div className="space-y-1.5">
                                    <InputLabel htmlFor="password" value="Password Awal" />
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <TextInput
                                            id="password"
                                            type="password"
                                            className="pl-9 w-full bg-white"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required={!teacher}
                                            placeholder="Min. 8 Karakter"
                                        />
                                    </div>
                                    {errors.password && <p className="text-[10px] text-red-500">{errors.password}</p>}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <InputLabel htmlFor="branch_id" value="Unit / Cabang Utama" />
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                                    <Select
                                        id="branch_id"
                                        value={data.branch_id}
                                        onChange={(val) => setData('branch_id', val)}
                                        options={branchOptions}
                                        className="pl-9 bg-white"
                                        placeholder="Pilih Cabang"
                                    />
                                </div>
                                {errors.branch_id && <p className="text-[10px] text-red-500">{errors.branch_id}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Right: Profile Details */}
                    <div className="flex-1 p-8 space-y-6">
                        <div className="pb-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight">{teacher ? 'Edit Profil Guru' : 'Tambah Guru Baru'}</h2>
                                <p className="text-sm text-gray-500 mt-0.5">Lengkapi informasi profesional pengajar.</p>
                            </div>
                            <Button type="button" variant="ghost" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900">
                                Tutup
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                            <div className="space-y-1.5">
                                <InputLabel htmlFor="name" value="Nama Lengkap & Gelar" />
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <TextInput
                                        id="name"
                                        className="pl-9 w-full"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Contoh: Harum Natali, M.Pd"
                                        required
                                    />
                                </div>
                                {errors.name && <p className="text-[10px] text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <InputLabel htmlFor="phone" value="WhatsApp / No. Telepon" />
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <TextInput
                                        id="phone"
                                        className="pl-9 w-full"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="08xx-xxxx-xxxx"
                                    />
                                </div>
                                {errors.phone && <p className="text-[10px] text-red-500">{errors.phone}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <InputLabel htmlFor="specialization" value="Bidang Spesialisasi" />
                            <div className="relative">
                                <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <TextInput
                                    id="specialization"
                                    className="pl-9 w-full"
                                    value={data.specialization}
                                    onChange={(e) => setData('specialization', e.target.value)}
                                    placeholder="Contoh: IELTS Academic Specialized"
                                />
                            </div>
                            {errors.specialization && <p className="text-[10px] text-red-500">{errors.specialization}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <InputLabel htmlFor="address" value="Alamat Tinggal" />
                            <div className="relative">
                                <MapPin className="absolute left-3 top-4 text-gray-400 w-4 h-4" />
                                <TextArea
                                    id="address"
                                    className="pl-9 w-full"
                                    rows={2}
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Alamat lengkap sesuai domisili..."
                                />
                            </div>
                            {errors.address && <p className="text-[10px] text-red-500">{errors.address}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <InputLabel htmlFor="bio" value="Bio Singkat / Deskripsi" />
                            <TextArea
                                id="bio"
                                className="w-full"
                                rows={3}
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                placeholder="Jelaskan secara singkat latar belakang atau prestasi guru..."
                            />
                            {errors.bio && <p className="text-[10px] text-red-500">{errors.bio}</p>}
                        </div>

                        <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
                            <Button type="submit" disabled={processing} className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-2.5 shadow-lg shadow-primary-500/20 font-bold">
                                {processing ? 'Menyimpan...' : (teacher ? 'Simpan Perubahan' : 'Daftarkan Guru')}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
