import React, { useState, useEffect } from "react";
import Modal from "@/Components/ui/Modal";
import InputLabel from "@/Components/ui/InputLabel";
import { Link, router, useForm } from "@inertiajs/react";
import { CheckCircle2, BookOpen, AlertCircle } from "lucide-react";
import Select from "react-select";

export default function ClassPlacementModal({
    show,
    onClose,
    student,
    availableClassesByPackage, // Object: { package_name: [classes], ... }
}) {
    if (!student) return null;

    // Use Inertia useForm for submission
    const { data, setData, post, processing, errors, reset } = useForm({
        placements: {}, // { invoice_item_id: study_class_id }
    });

    useEffect(() => {
        if (show) {
            reset();
            // Initialize empty placements
            const initialPlacements = {};
            (student.purchased_packages || []).forEach(item => {
                initialPlacements[item.id] = "";
            });
            setData("placements", initialPlacements);
        }
    }, [show, student]);

    const handleClassChange = (itemId, classId) => {
        setData("placements", {
            ...data.placements,
            [itemId]: classId,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.students.assign-classes", student.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const purchasedPackages = student.purchased_packages || [];

    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Plotting Kelas Siswa"
            maxWidth="2xl"
        >
            <form onSubmit={submit} className="space-y-6">
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Plotting Kelas Untuk</p>
                            <p className="text-sm font-semibold text-blue-900">{student.name} ({student.nis})</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    {purchasedPackages.length === 0 && (
                        <div className="text-center py-6 text-gray-500 text-sm">
                            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2 opacity-50" />
                            Belum ada paket yang dibeli atau lunas untuk siswa ini.
                        </div>
                    )}

                    {purchasedPackages.map((item) => {
                        const classes = availableClassesByPackage[item.package_name] || [];
                        const options = classes.map(c => ({ value: c.id, label: c.name }));

                        return (
                            <div key={item.id} className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm ring-1 ring-gray-900/5">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="text-sm font-semibold text-gray-900">{item.package_name}</h4>
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 uppercase">Paket Berlangganan</span>
                                </div>
                                
                                <div>
                                    <InputLabel value="Pilih Kelas" className="mb-1.5" />
                                    <Select
                                        options={options}
                                        value={options.find(opt => opt.value === data.placements[item.id]) || null}
                                        onChange={(opt) => handleClassChange(item.id, opt ? opt.value : "")}
                                        placeholder="-- Pilih Kelas Aktif --"
                                        className="text-sm"
                                        classNamePrefix="react-select"
                                        isClearable
                                        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                        styles={{
                                            menuPortal: base => ({ ...base, zIndex: 9999 }),
                                            control: (base) => ({
                                                ...base,
                                                borderRadius: '0.625rem',
                                                borderColor: errors[`placements.${item.id}`] ? '#ef4444' : '#e5e7eb',
                                            })
                                        }}
                                    />
                                    {errors[`placements.${item.id}`] && (
                                        <p className="mt-1 text-xs text-red-600">{errors[`placements.${item.id}`]}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 flex justify-end gap-3 pt-5 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={processing || purchasedPackages.length === 0}
                        className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? "Menyimpan..." : (
                            <>
                                <CheckCircle2 size={16} />
                                Konfirmasi Plotting
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
