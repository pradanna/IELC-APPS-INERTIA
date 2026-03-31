import React from "react";
import { Head } from "@inertiajs/react";
import { CheckCircle, Trophy, Target } from "lucide-react";

export default function Result({ session, exam, stats }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title={`Hasil - ${exam.title}`} />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
                    IELC Placement Test
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-10 px-4 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle size={32} className="text-green-600" />
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Ujian Telah Selesai!
                    </h3>
                    <p className="text-sm text-gray-500 mb-8">
                        Terima kasih{" "}
                        <span className="font-medium text-gray-900">
                            {session.lead_name}
                        </span>
                        , Anda telah berhasil menyelesaikan{" "}
                        <strong>{exam.title}</strong>.
                    </p>

                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 space-y-5">
                        {/* Score Display */}
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Trophy size={14} className="text-amber-500" />
                                Total Poin / Nilai
                            </p>
                            <p className="text-4xl font-extrabold text-primary-600">
                                {session.final_score}
                            </p>
                        </div>

                        <div className="border-t border-gray-200"></div>

                        {/* Stats Display */}
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Target size={14} className="text-blue-500" />
                                Statistik Jawaban
                            </p>
                            <p className="text-sm text-gray-800">
                                <strong>{stats.correct_answers}</strong> benar
                                dari total{" "}
                                <strong>{stats.total_questions}</strong> soal
                            </p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Admin kami akan segera meninjau hasil Anda dan
                            menghubungi Anda untuk menginformasikan level yang
                            direkomendasikan. Anda sudah dapat menutup halaman
                            ini.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
