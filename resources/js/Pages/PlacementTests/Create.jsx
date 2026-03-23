import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import InputLabel from "@/Components/ui/InputLabel";
import TextInput from "@/Components/ui/TextInput";
import TextArea from "@/Components/ui/TextArea";
import { ArrowLeft, Save } from "lucide-react";

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("superadmin.placement-tests.store"));
    };

    return (
        <SuperAdminLayout user={auth?.user}>
            <Head title="Buat Paket Ujian Baru" />

            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Link
                        href={route("superadmin.placement-tests.index")}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold leading-7 text-gray-900">
                            Buat Paket Ujian Baru
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Tambahkan paket soal placement test baru ke dalam
                            sistem.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <InputLabel htmlFor="title">
                                Nama Paket Ujian{" "}
                                <span className="text-red-500">*</span>
                            </InputLabel>
                            <div className="mt-1">
                                <TextInput
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    className="w-full"
                                    placeholder="Contoh: PT General English"
                                    isFocused
                                />
                                {errors.title && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.title}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="description">
                                Deskripsi (Opsional)
                            </InputLabel>
                            <div className="mt-1">
                                <TextArea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    rows={4}
                                    className="w-full"
                                    placeholder="Penjelasan singkat mengenai paket ujian ini..."
                                />
                                {errors.description && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                id="is_active"
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) =>
                                    setData("is_active", e.target.checked)
                                }
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                            />
                            <InputLabel
                                htmlFor="is_active"
                                className="mb-0 cursor-pointer"
                            >
                                Aktifkan Paket Ini untuk digunakan Leads
                            </InputLabel>
                        </div>
                        {errors.is_active && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.is_active}
                            </p>
                        )}

                        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                            <Link
                                href={route("superadmin.placement-tests.index")}
                                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-500 transition-all disabled:opacity-50"
                            >
                                <Save size={16} />
                                {processing ? "Menyimpan..." : "Simpan Paket"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
