import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import {
    ClipboardList,
    Clock,
    Activity,
    Link as LinkIcon,
    Eye,
    GraduationCap,
    Plus,
    FileQuestion,
} from "lucide-react";

export default function PlacementTestIndex({
    auth,
    stats,
    tests = [],
    examPackages = [],
}) {
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
        <SuperAdminLayout user={auth?.user}>
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
                                                Status
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
                                                    <div
                                                        className="cursor-pointer"
                                                        onClick={() =>
                                                            alert(
                                                                `Buka drawer detail untuk Lead: ${test.lead_name}`,
                                                            )
                                                        }
                                                    >
                                                        <p className="text-sm font-semibold text-primary-600 hover:text-primary-800 hover:underline">
                                                            {test.lead_name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {test.wa}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">
                                                    {test.package_name}
                                                </td>
                                                <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-700">
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
                                                            className="p-1.5 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-100 rounded-md transition-colors"
                                                            title="Copy Magic Link"
                                                        >
                                                            <LinkIcon
                                                                size={16}
                                                            />
                                                        </button>
                                                        <button
                                                            className="p-1.5 text-gray-500 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-100 rounded-md transition-colors"
                                                            title="Lihat Hasil Detail"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        {test.status ===
                                                            "completed" && (
                                                            <button
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
                                <Link
                                    href={route(
                                        "superadmin.placement-tests.create",
                                    )}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-500 px-3 py-1.5 rounded-md shadow-sm transition-colors"
                                >
                                    <Plus size={14} /> Buat Paket
                                </Link>
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
                                            <button
                                                className="inline-flex items-center gap-1.5 p-1.5 px-2.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all"
                                                title="Kelola Soal"
                                            >
                                                <FileQuestion size={14} />{" "}
                                                Kelola
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
