import React, { useState } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    ClipboardList,
    Clock,
    Activity,
    Link as LinkIcon,
    Eye,
    GraduationCap,
    Plus,
    FileQuestion,
    X,
    MessageCircle,
    CreditCard,
} from "lucide-react";
import LeadStatusBadge from "@/Components/ui/StatusBadge";
import TextInput from "@/Components/form/TextInput";
import TextArea from "@/Components/ui/TextArea";
import Modal from "@/Components/ui/Modal";

export default function PlacementTestIndex({
    auth,
    stats,
    tests = [],
    examPackages = [],
    leadStatuses = [],
}) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        description: "",
        duration_minutes: 60,
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.placement-tests.store"), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const handleCopyLink = (test) => {
        if (!test.token) {
            alert("Sesi ini tidak memiliki token ujian.");
            return;
        }
        const magicLink = `${window.location.origin}/placement-test/${test.package_slug}/${test.token}`;
        navigator.clipboard
            .writeText(magicLink)
            .then(() => {
                alert("Tautan ujian berhasil disalin ke clipboard!");
            })
            .catch((err) => {
                console.error("Gagal menyalin text: ", err);
            });
    };

    const handleSendWa = (test) => {
        if (!test.token) {
            alert("Sesi ini tidak memiliki token ujian.");
            return;
        }

        // Sesuaikan URL ini dengan rute halaman pengerjaan ujian yang akan dibuat
        const magicLink = `${window.location.origin}/placement-test/${test.package_slug}/${test.token}`;

        let waNumber = test.wa.replace(/\D/g, "");
        if (waNumber.startsWith("0")) {
            waNumber = "62" + waNumber.substring(1);
        }

        const message = `Halo *${test.lead_name}*,\n\nBerikut adalah tautan (*Magic Link*) untuk mengakses *Placement Test - ${test.package_name}*:\n\n${magicLink}\n\nSilakan klik tautan di atas untuk mulai mengerjakan ujian.\n\nTerima kasih.`;
        window.open(
            `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`,
            "_blank",
        );
    };

    const handleUpdateStatus = (statusId) => {
        setIsUpdatingStatus(true);
        router.put(
            route("admin.crm.leads.status.update", {
                lead: selectedTest.lead_id,
            }),
            { lead_status_id: statusId },
            {
                preserveScroll: true,
                onSuccess: () => setIsEnrollModalOpen(false),
                onFinish: () => setIsUpdatingStatus(false),
            },
        );
    };

    const StatusBadge = ({ status }) => {
        if (status === "pending")
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                    🟡 Pending
                </span>
            );
        if (status === "in_progress")
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-600/20">
                    🔵 In Progress
                </span>
            );
        if (status === "completed")
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-800 ring-1 ring-inset ring-green-600/20">
                    🟢 Completed
                </span>
            );
        return null;
    };

    return (
        <AdminLayout>
            <Head title="Placement Test Dashboard" />

            <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-xl font-bold leading-7 text-gray-900">
                        Placement Test Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Monitor aktivitas ujian dan kelola paket ujian siswa.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Kolom Kiri: Quick Stats & Tabel Utama */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Baris Atas: Quick Stats */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <ClipboardList size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Ujian Hari Ini
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats?.today || 0}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Sedang Mengerjakan
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats?.inProgress || 0}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Menunggu Tindakan
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats?.pending || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tabel Utama: Daftar Aktivitas Ujian */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Daftar Sesi Ujian
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-white">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Nama Lead & WA
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Paket Ujian
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Waktu Pengerjaan
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Status Ujian
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Skor & Level
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {tests.map((test) => (
                                            <tr
                                                key={test.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-5 py-3 whitespace-nowrap">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-semibold text-primary-600 truncate max-w-[150px]">
                                                                {test.lead_name}
                                                            </p>
                                                            
                                                        </div>
                                                        <p className="text-xs text-gray-500">
                                                            {test.wa}
                                                        </p>
                                                        <p>
                                                            {test.lead_status && (
                                                                <LeadStatusBadge
                                                                    backgroundColor={test.lead_status.bg_color}
                                                                    color={test.lead_status.text_color}
                                                                    className="px-1.5 py-0 scale-90"
                                                                >
                                                                    {test.lead_status.name.toUpperCase()}
                                                                </LeadStatusBadge>
                                                            )}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3 whitespace-wrap text-sm text-gray-700">
                                                    {test.package_name}
                                                </td>
                                                <td className="px-5 py-3 whitespace-wrap text-sm text-gray-700">
                                                    {test.scheduled_at}
                                                </td>

                                                <td className="px-5 py-3 whitespace-nowrap">
                                                    <StatusBadge
                                                        status={test.status}
                                                    />
                                                </td>
                                                <td className="px-5 py-3 whitespace-nowrap">
                                                    {test.status ===
                                                    "completed" ? (
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">
                                                                {test.score}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {
                                                                    test.recommended_level
                                                                }
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3 whitespace-nowrap text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleCopyLink(
                                                                    test,
                                                                )
                                                            }
                                                            className="p-1.5 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-100 rounded-md transition-colors"
                                                            title="Salin Link Ujian"
                                                        >
                                                            <LinkIcon
                                                                size={16}
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleSendWa(
                                                                    test,
                                                                )
                                                            }
                                                            className="p-1.5 text-gray-500 hover:text-green-600 bg-gray-50 hover:bg-green-100 rounded-md transition-colors"
                                                            title="Kirim Link via WhatsApp"
                                                        >
                                                            <MessageCircle
                                                                size={16}
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (
                                                                    test.status ===
                                                                    "completed"
                                                                ) {
                                                                    window.open(
                                                                        `/placement-test/${test.package_slug}/${test.token}/review`,
                                                                        "_blank",
                                                                    );
                                                                } else {
                                                                    alert(
                                                                        "Hasil ujian belum tersedia karena sesi belum selesai.",
                                                                    );
                                                                }
                                                            }}
                                                            className="p-1.5 text-gray-500 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-100 rounded-md transition-colors"
                                                            title="Review Evaluasi Ujian"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        {test.status ===
                                                            "completed" && (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedTest(
                                                                        test,
                                                                    );
                                                                    setIsEnrollModalOpen(
                                                                        true,
                                                                    );
                                                                }}
                                                                className="p-1.5 text-gray-500 hover:text-emerald-600 bg-gray-50 hover:bg-emerald-100 rounded-md transition-colors"
                                                                title="Enroll to Class"
                                                            >
                                                                <GraduationCap
                                                                    size={16}
                                                                />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: Master Data Manajemen Ujian */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Manajemen Ujian
                                </h3>
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-500 px-3 py-1.5 rounded-md shadow-sm transition-colors"
                                >
                                    <Plus size={14} /> Buat Paket
                                </button>
                            </div>
                            <div className="p-0">
                                <ul className="divide-y divide-gray-100">
                                    {examPackages.map((pkg) => (
                                        <li
                                            key={pkg.id}
                                            className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                        >
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {pkg.name}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {pkg.questions_count} Soal
                                                    &bull;
                                                    <span
                                                        className={
                                                            pkg.active
                                                                ? "text-green-600 ml-1 font-medium"
                                                                : "text-gray-400 ml-1"
                                                        }
                                                    >
                                                        {pkg.active
                                                            ? "Aktif"
                                                            : "Draft"}
                                                    </span>
                                                </p>
                                            </div>
                                            <Link
                                                href={route(
                                                    "admin.placement-tests.show",
                                                    pkg.id,
                                                )}
                                                className="inline-flex items-center gap-1.5 p-1.5 px-2.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all"
                                                title="Kelola Soal"
                                            >
                                                <FileQuestion size={14} />{" "}
                                                Kelola
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Create Paket Ujian */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-900">
                                Buat Paket Ujian Baru
                            </h2>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nama Paket Ujian{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <TextInput
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    placeholder="Contoh: PT General English"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.title}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Deskripsi (Opsional)
                                </label>
                                <TextArea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    className="mt-1 block w-full sm:text-sm"
                                    rows={3}
                                    placeholder="Penjelasan singkat mengenai ujian..."
                                />
                                {errors.description && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Durasi (Menit){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <TextInput
                                    type="number"
                                    min="1"
                                    value={data.duration_minutes}
                                    onChange={(e) =>
                                        setData(
                                            "duration_minutes",
                                            e.target.value,
                                        )
                                    }
                                    className="mt-1 block w-full"
                                />
                                {errors.duration_minutes && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.duration_minutes}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData("is_active", e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                                />
                                <label
                                    htmlFor="is_active"
                                    className="text-sm text-gray-700 cursor-pointer"
                                >
                                    Aktifkan paket ini
                                </label>
                            </div>
                            {errors.is_active && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.is_active}
                                </p>
                            )}

                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-50">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
                                >
                                    {processing ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Enroll to Class */}
            <Modal
                show={isEnrollModalOpen}
                onClose={() => setIsEnrollModalOpen(false)}
                title="Enroll Siswa ke Kelas"
                maxWidth="2xl"
            >
                {selectedTest && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                            <div>
                                <p className="text-xs text-emerald-700 mb-1">
                                    Nama Siswa
                                </p>
                                <p className="text-sm font-semibold text-emerald-900">
                                    {selectedTest.lead_name}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-emerald-700 mb-1">
                                    Paket Ujian
                                </p>
                                <p className="text-sm font-semibold text-emerald-900">
                                    {selectedTest.package_name}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-emerald-700 mb-1">
                                    Skor Akhir
                                </p>
                                <p className="text-sm font-bold text-emerald-700">
                                    {selectedTest.score || 0}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-emerald-700 mb-1">
                                    Rekomendasi Level
                                </p>
                                <p className="text-sm font-semibold text-emerald-900">
                                    {selectedTest.recommended_level || "-"}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                            <GraduationCap className="h-10 w-10 text-emerald-500 mb-3" />
                            <h4 className="text-base font-semibold text-gray-900">
                                Tindak Lanjut Pendaftaran
                            </h4>
                            <p className="text-sm text-gray-500 mt-1 max-w-md leading-relaxed">
                                Berdasarkan rekomendasi level{" "}
                                <strong>
                                    {selectedTest.recommended_level || "-"}
                                </strong>
                                , Anda bisa melanjutkan prospek ini ke tahap
                                pembayaran invoice atau langsung mengubah
                                statusnya menjadi resmi bergabung (Joined).
                            </p>

                            <div className="mt-6 w-full p-4 bg-gray-50 rounded-md border border-gray-100 border-dashed">
                                <p className="text-sm text-gray-500 italic">
                                    (Form pemilihan paket pendaftaran, jadwal,
                                    dan pembuatan invoice tagihan akan
                                    ditambahkan di sini nantinya)
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-end border-t border-gray-100">
                            <button
                                onClick={() => handleUpdateStatus('c0a80101-0000-0000-0000-000000000005')}
                                disabled={isUpdatingStatus}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-wait"
                            >
                                <CreditCard size={16} />
                                {isUpdatingStatus
                                    ? "Memproses..."
                                    : "Proses Siswa ke Pembayaran"}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}
