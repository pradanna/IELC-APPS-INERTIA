import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/ui/Modal';
import InputLabel from '@/Components/ui/InputLabel';
import Select from '@/Components/ui/Select';
import Button from '@/Components/ui/Button';
import TextArea from '@/Components/ui/TextArea';
import { User, Phone, Mail, MapPin, Calendar, BookOpen, ShieldCheck } from 'lucide-react';
import TextInput from '@/Components/form/TextInput';

export default function StudentEditModal({ show, onClose, student }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        dob: '',
        address: '',
        parent_name: '',
        parent_phone: '',
        nis: '',
        status: 'active',
    });

    useEffect(() => {
        if (student) {
            setData({
                name: student.name || '',
                email: student.email || '',
                phone: student.contact || '',
                dob: student.dob_raw || student.dob || '', // Ensure date format is correct for input
                address: student.address || '',
                parent_name: student.parent_name || '',
                parent_phone: student.parent_phone || '',
                nis: student.nis || '',
                status: student.status?.toLowerCase() || 'active',
            });
        }
    }, [student]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.students.update', student.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="3xl">
            <form onSubmit={handleSubmit} className="p-6">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                    <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                        <User size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Edit Data Siswa</h2>
                        <p className="text-sm text-gray-500">Perbarui informasi profil dan data akademik siswa.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Section: Personal Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-primary-600 font-semibold text-sm">
                            <User size={16} />
                            <span>Informasi Pribadi</span>
                        </div>
                        
                        <div>
                            <InputLabel htmlFor="name" value="Nama Lengkap" />
                            <TextInput
                                id="name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                            </div>
                            <div>
                                <InputLabel htmlFor="phone" value="No. Telepon" />
                                <TextInput
                                    id="phone"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="dob" value="Tanggal Lahir" />
                            <TextInput
                                id="dob"
                                type="date"
                                className="mt-1 block w-full"
                                value={data.dob}
                                onChange={(e) => setData('dob', e.target.value)}
                            />
                            {errors.dob && <p className="mt-1 text-xs text-red-600">{errors.dob}</p>}
                        </div>

                        <div>
                            <InputLabel htmlFor="address" value="Alamat Lengkap" />
                            <TextArea
                                id="address"
                                className="mt-1 block w-full"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                rows={3}
                            />
                            {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                        </div>
                    </div>

                    {/* Section: Academic & Parent Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-primary-600 font-semibold text-sm">
                            <ShieldCheck size={16} />
                            <span>Data Akademik & Orang Tua</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="nis" value="NIS (Nomor Induk)" />
                                <TextInput
                                    id="nis"
                                    type="text"
                                    className="mt-1 block w-full !bg-gray-50 border-gray-200"
                                    value={data.nis}
                                    onChange={(e) => setData('nis', e.target.value)}
                                    required
                                />
                                {errors.nis && <p className="mt-1 text-xs text-red-600">{errors.nis}</p>}
                            </div>
                            <div>
                                <InputLabel htmlFor="status" value="Status" />
                                <Select
                                    id="status"
                                    className="mt-1 block w-full"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                >
                                    <option value="active">Active</option>
                                    <option value="graduated">Graduated</option>
                                    <option value="dropout">Dropout</option>
                                </Select>
                                {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status}</p>}
                            </div>
                        </div>

                        <div className="pt-4 space-y-4">
                             <div className="flex items-center gap-2 text-gray-500 font-medium text-[11px] uppercase tracking-widest">
                                Orang Tua / Wali
                            </div>
                            <div>
                                <InputLabel htmlFor="parent_name" value="Nama Orang Tua" />
                                <TextInput
                                    id="parent_name"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.parent_name}
                                    onChange={(e) => setData('parent_name', e.target.value)}
                                />
                                {errors.parent_name && <p className="mt-1 text-xs text-red-600">{errors.parent_name}</p>}
                            </div>
                            <div>
                                <InputLabel htmlFor="parent_phone" value="Kontak Orang Tua" />
                                <TextInput
                                    id="parent_phone"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.parent_phone}
                                    onChange={(e) => setData('parent_phone', e.target.value)}
                                />
                                {errors.parent_phone && <p className="mt-1 text-xs text-red-600">{errors.parent_phone}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-primary-600 text-white hover:bg-primary-700 font-bold px-8 shadow-lg shadow-primary-500/20"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
