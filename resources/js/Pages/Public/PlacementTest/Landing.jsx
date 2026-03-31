import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Clock, BookOpen, AlertCircle } from "lucide-react";

export default function Landing({ session, exam }) {
    // Tentukan URL untuk mulai ujian (akan kita buat nanti rute pengerjaannya)
    const startUrl = `/placement-test/${exam.slug}/${session.token}/start`;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title={exam.title} />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
                    IELC Placement Test
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
                    <div className="mb-6">
                        <p className="text-sm text-gray-500">Selamat datang,</p>
                        <h3 className="text-lg font-bold text-gray-900">
                            {session.lead_name}
                        </h3>
                    </div>

                    <div className="border-t border-b border-gray-100 py-5 space-y-4">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                                {exam.title}
                            </h4>
                            {exam.description && (
                                <p className="mt-1 text-sm text-gray-600">
                                    {exam.description}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 mt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock size={18} className="text-primary-500" />
                                <span>
                                    Durasi:{" "}
                                    <strong>
                                        {exam.duration_minutes} Menit
                                    </strong>
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <BookOpen
                                    size={18}
                                    className="text-primary-500"
                                />
                                <span>
                                    Sistem akan otomatis menutup ujian jika
                                    waktu habis.
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 mb-6">
                            <AlertCircle
                                size={20}
                                className="text-yellow-600 mt-0.5 shrink-0"
                            />
                            <p className="text-xs text-yellow-800 leading-relaxed">
                                Pastikan koneksi internet Anda stabil. Setelah
                                Anda menekan tombol mulai,{" "}
                                <strong>waktu akan terus berjalan</strong>.
                            </p>
                        </div>

                        {/* Tombol Mulai menggunakan Inertia Link */}
                        <Link
                            href={startUrl}
                            method="post"
                            as="button"
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                        >
                            {session.status === "in_progress"
                                ? "Lanjutkan Mengerjakan"
                                : "Mulai Mengerjakan"}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
