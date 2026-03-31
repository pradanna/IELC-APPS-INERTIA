import React, { useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import ReactSelect from 'react-select';
import Modal from '@/Components/ui/Modal';
import Button from '@/Components/ui/Button';
import InputLabel from '@/Components/ui/InputLabel';
import Select from '@/Components/ui/Select';
import Toast from '@/Components/ui/Toast';

export default function ClassFormModal({ show, onClose, editingClass, packages, teachers, branches = [] }) {
    const { auth } = usePage().props;
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        package_id: '',
        teacher_ids: [],
        branch_id: '',
    });

    useEffect(() => {
        if (show) {
            clearErrors();
            if (editingClass) {
                setData({
                    name: editingClass.name || '',
                    package_id: editingClass.package_id || '',
                    teacher_ids: editingClass.teachers?.map(t => t.id) || [],
                    branch_id: editingClass.branch_id || '',
                });
            } else {
                reset();
            }
        }
    }, [show, editingClass]);

    const submit = (e) => {
        e.preventDefault();

        if (editingClass) {
            put(route('admin.study-classes.update', editingClass.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('admin.study-classes.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    const packageOptions = packages?.map(pkg => ({
        value: pkg.id,
        label: pkg.name
    })) || [];

    const teacherOptions = teachers?.map(t => ({
        value: t.id,
        label: t.name
    })) || [];

    const handleTeacherChange = (selectedOptions) => {
        setData('teacher_ids', selectedOptions ? selectedOptions.map(opt => opt.value) : []);
    };

    return (
        <Modal 
            show={show} 
            onClose={onClose} 
            maxWidth="md"
            title={editingClass ? "Edit Kelas" : "Tambah Kelas Baru"}
        >
            <form onSubmit={submit} className="space-y-4 px-2">
                {/* Branch Selection (Superadmin Only) */}
                {auth?.user?.role === 'superadmin' && (
                    <div>
                        <InputLabel htmlFor="branch_id" value="Cabang (Branch)" required />
                        <Select
                            id="branch_id"
                            value={data.branch_id}
                            onChange={(val) => setData('branch_id', val)}
                            options={branches.map(b => ({ value: b.id, label: b.name }))}
                            placeholder="Pilih Cabang..."
                            error={errors.branch_id}
                        />
                        {errors.branch_id && <p className="mt-1 text-xs text-red-500">{errors.branch_id}</p>}
                    </div>
                )}

                <div>
                    <InputLabel htmlFor="name" value="Nama Kelas" required />
                    <input
                        id="name"
                        type="text"
                        className={`mt-1 block w-full text-sm px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors ${
                            errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                        }`}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Contoh: Paris & Co B1"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div>
                    <InputLabel htmlFor="package_id" value="Mata Pelajaran / Paket Utama" required />
                    <Select
                        id="package_id"
                        value={data.package_id}
                        onChange={(val) => setData('package_id', val)}
                        options={packageOptions}
                        placeholder="Pilih Paket Belajar"
                        error={errors.package_id}
                    />
                    {errors.package_id && <p className="mt-1 text-xs text-red-500">{errors.package_id}</p>}
                </div>

                <div>
                    <InputLabel htmlFor="teacher_ids" value="Pengajar (Multiple Teachers)" required />
                    <ReactSelect
                        isMulti
                        options={teacherOptions}
                        value={teacherOptions.filter(opt => data.teacher_ids.includes(opt.value))}
                        onChange={handleTeacherChange}
                        placeholder="Pilih beberapa pengajar..."
                        className="mt-1 text-sm"
                        classNamePrefix="react-select"
                        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                        styles={{
                            menuPortal: base => ({ ...base, zIndex: 20000 }),
                            control: (base) => ({
                                ...base,
                                borderRadius: '0.5rem',
                                borderColor: errors.teacher_ids ? '#ef4444' : '#e5e7eb',
                                padding: '1px',
                                boxShadow: 'none',
                                '&:hover': {
                                    borderColor: '#6366f1' // Assuming primary color shade
                                }
                            })
                        }}
                    />
                    {typeof errors.teacher_ids === 'string' && <p className="mt-1 text-xs text-red-500">{errors.teacher_ids}</p>}
                    {/* Handle potential array errors from Laravel like teacher_ids.0 */}
                    {Object.keys(errors).filter(k => k.startsWith('teacher_ids.')).map(k => (
                        <p key={k} className="mt-1 text-xs text-red-500">{errors[k]}</p>
                    ))}
                </div>

                <div className="mt-6 flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
                    <Button 
                        type="button" 
                        onClick={onClose}
                        variant="ghost"
                        className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-4"
                        disabled={processing}
                    >
                        Batal
                    </Button>
                    <Button 
                        type="submit"
                        className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 shadow-sm"
                        disabled={processing}
                    >
                        {processing ? 'Menyimpan...' : (editingClass ? 'Simpan Perubahan' : 'Buat Kelas')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
