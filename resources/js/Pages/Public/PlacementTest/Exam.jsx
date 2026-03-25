import React, { useState, useEffect, useMemo } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Clock, ChevronLeft, ChevronRight, Check } from "lucide-react";

export default function Exam({
    session,
    exam_title,
    pages,
    is_review = false,
    user_answers = {},
}) {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(
        Math.floor(session.remaining_seconds || 0),
    );

    const storageKey = `pt_answers_${session.token}`;
    const initialAnswers =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem(storageKey) || "{}")
            : {};

    // Menggunakan useForm untuk menyimpan data jawaban secara otomatis & submit
    const { data, setData, post, processing } = useForm({
        answers: is_review ? user_answers : initialAnswers,
    });

    // Logika Timer mundur
    useEffect(() => {
        if (is_review) return; // Nonaktifkan timer di mode review
        if (timeLeft <= 0) {
            if (!processing) {
                handleFinish();
            }
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, processing, is_review]);

    const formatTime = (seconds) => {
        const safeSeconds = Math.max(0, Math.floor(seconds));
        const h = Math.floor(safeSeconds / 3600);
        const m = Math.floor((safeSeconds % 3600) / 60);
        const s = safeSeconds % 60;
        if (h > 0)
            return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    // Pemetaan Nomor Soal ke Halaman (untuk Sidebar Grid)
    const questionMap = useMemo(() => {
        const map = [];
        pages.forEach((page, pIdx) => {
            page.questions.forEach((q) => {
                map.push({ number: q.number, id: q.id, pageIndex: pIdx });
            });
        });
        return map;
    }, [pages]);

    const handleOptionSelect = (questionId, optionId) => {
        if (is_review) return; // Blokir interaksi jika dalam mode review
        const newAnswers = { ...data.answers, [questionId]: optionId };
        setData("answers", newAnswers);
        if (typeof window !== "undefined") {
            localStorage.setItem(storageKey, JSON.stringify(newAnswers));
        }
    };

    const handleFinish = () => {
        post(
            route("public.placement-test.submit", [
                session.slug,
                session.token,
            ]),
            {
                onSuccess: () => {
                    if (typeof window !== "undefined") {
                        localStorage.removeItem(storageKey);
                    }
                },
            },
        );
    };

    const confirmFinish = () => {
        if (
            confirm(
                "Apakah Anda yakin ingin mengakhiri ujian dan mengirimkan jawaban?",
            )
        ) {
            handleFinish();
        }
    };

    const getTimerColorClass = () => {
        if (is_review) return "bg-blue-50 text-blue-700 border-blue-200";
        if (timeLeft <= 300)
            return "bg-red-50 text-red-700 border-red-200 animate-pulse"; // <= 5 menit
        if (timeLeft <= 600)
            return "bg-yellow-50 text-yellow-700 border-yellow-200"; // <= 10 menit
        return "bg-green-50 text-green-700 border-green-200"; // Default > 10 menit
    };

    const activePage = pages[currentPageIndex];

    return (
        <div className="h-screen bg-gray-50 flex flex-col font-sans">
            <Head title={`Mengerjakan - ${exam_title}`} />

            {/* Header / Topbar */}
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm z-10 shrink-0">
                <div className="font-semibold text-gray-800 tracking-tight">
                    {exam_title}
                </div>
                {is_review ? (
                    <div className="px-3 py-1.5 rounded-lg border font-mono text-sm font-semibold bg-blue-50 text-blue-700 border-blue-200">
                        Mode Evaluasi
                    </div>
                ) : (
                    <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-semibold transition-colors ${getTimerColorClass()}`}
                    >
                        <Clock size={16} />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                )}
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Navigasi Kiri */}
                <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                            Navigasi Soal
                        </p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="grid grid-cols-4 gap-2">
                            {questionMap.map((q) => {
                                const isAnswered =
                                    data.answers[q.id] !== undefined;
                                const isCurrentPage =
                                    currentPageIndex === q.pageIndex;

                                // Status pewarnaan sidebar untuk review
                                let buttonClass = "";
                                if (is_review) {
                                    const pageData = pages[q.pageIndex];
                                    const questionData =
                                        pageData.questions.find(
                                            (x) => x.id === q.id,
                                        );
                                    const userAnswerId = data.answers[q.id];
                                    const correctOption =
                                        questionData.options.find(
                                            (opt) => opt.is_correct,
                                        );

                                    if (userAnswerId === correctOption?.id) {
                                        buttonClass =
                                            "bg-green-100 text-green-800 border-green-400";
                                    } else {
                                        buttonClass =
                                            "bg-red-100 text-red-800 border-red-400";
                                    }
                                } else {
                                    buttonClass = isAnswered
                                        ? "bg-primary-50 text-primary-700 border border-primary-200"
                                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50";
                                }

                                return (
                                    <button
                                        key={q.number}
                                        onClick={() =>
                                            setCurrentPageIndex(q.pageIndex)
                                        }
                                        className={`h-10 w-full flex items-center justify-center rounded-md text-sm font-medium transition-all ${
                                            isCurrentPage
                                                ? "ring-2 ring-primary-500 ring-offset-1"
                                                : ""
                                        } ${buttonClass}`}
                                    >
                                        {q.number}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="p-4 border-t border-gray-200">
                        {is_review ? (
                            <button
                                onClick={() => window.close()}
                                className="w-full inline-flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
                            >
                                Tutup Evaluasi
                            </button>
                        ) : (
                            <button
                                onClick={confirmFinish}
                                disabled={processing}
                                className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <Check size={16} /> Akhiri Ujian
                            </button>
                        )}
                    </div>
                </aside>

                {/* Main Content Kanan */}
                <main className="flex-1 overflow-y-auto bg-gray-50/50 relative">
                    <div className="max-w-4xl mx-auto py-8 px-6 pb-32">
                        {/* Jika Soal berupa Grup (Wacana / Audio) */}
                        {activePage.type === "group" && (
                            <div className="mb-6 bg-blue-50/50 border border-blue-100 rounded-xl p-6">
                                <h3 className="font-semibold text-sm text-blue-900 mb-3 uppercase tracking-wider">
                                    Instruction
                                </h3>
                                <p className="text-sm text-blue-800 mb-4">
                                    {activePage.instruction}
                                </p>

                                {activePage.audio_path && (
                                    <audio
                                        controls
                                        className="w-full max-w-sm mb-4"
                                    >
                                        <source
                                            src={`/${activePage.audio_path}`}
                                            type="audio/mpeg"
                                        />
                                    </audio>
                                )}
                                {activePage.reading_text && (
                                    <div className="text-sm bg-white p-5 rounded-lg border border-blue-100 text-gray-800 leading-relaxed whitespace-pre-wrap shadow-sm">
                                        {activePage.reading_text}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Render Soal-soalnya */}
                        {activePage.questions.map((q) => (
                            <div
                                key={q.id}
                                className="mb-6 bg-white border border-gray-200 shadow-sm rounded-xl p-6"
                            >
                                <div className="flex gap-4">
                                    <div className="shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-sm font-bold">
                                        {q.number}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-base font-medium text-gray-900 mb-4 leading-relaxed">
                                            {q.text}
                                        </p>
                                        {q.audio_path && (
                                            <audio
                                                controls
                                                className="w-full max-w-sm mb-4"
                                            >
                                                <source
                                                    src={`/${q.audio_path}`}
                                                    type="audio/mpeg"
                                                />
                                            </audio>
                                        )}

                                        <div className="space-y-2.5">
                                            {q.options.map((opt, idx) => {
                                                const isSelected =
                                                    data.answers[q.id] ===
                                                    opt.id;

                                                let optionStyle = isSelected
                                                    ? "bg-primary-50 border-primary-500"
                                                    : "bg-white border-gray-200 hover:bg-gray-50";
                                                let reviewBadge = null;

                                                if (is_review) {
                                                    optionStyle =
                                                        "bg-white border-gray-200 opacity-60"; // Default styling

                                                    if (
                                                        opt.is_correct &&
                                                        isSelected
                                                    ) {
                                                        optionStyle =
                                                            "bg-green-50 border-green-500 ring-1 ring-green-500";
                                                        reviewBadge = (
                                                            <span className="ml-auto text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                                                                ✓ Jawaban Anda
                                                                Benar
                                                            </span>
                                                        );
                                                    } else if (
                                                        opt.is_correct &&
                                                        !isSelected
                                                    ) {
                                                        optionStyle =
                                                            "bg-green-50 border-green-500 ring-1 ring-green-500";
                                                        reviewBadge = (
                                                            <span className="ml-auto text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                                                                ✓ Kunci Jawaban
                                                            </span>
                                                        );
                                                    } else if (
                                                        !opt.is_correct &&
                                                        isSelected
                                                    ) {
                                                        optionStyle =
                                                            "bg-red-50 border-red-500 ring-1 ring-red-500";
                                                        reviewBadge = (
                                                            <span className="ml-auto text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded">
                                                                ✗ Jawaban Anda
                                                                Salah
                                                            </span>
                                                        );
                                                    }
                                                }

                                                return (
                                                    <label
                                                        key={opt.id}
                                                        className={`flex items-center gap-3 p-3.5 border rounded-lg transition-colors ${!is_review ? "cursor-pointer" : ""} ${optionStyle}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`q_${q.id}`}
                                                            checked={isSelected}
                                                            disabled={is_review}
                                                            onChange={() =>
                                                                handleOptionSelect(
                                                                    q.id,
                                                                    opt.id,
                                                                )
                                                            }
                                                            className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 ${is_review ? "opacity-70 cursor-default" : ""}`}
                                                        />
                                                        <span className="text-sm text-gray-800">
                                                            {String.fromCharCode(
                                                                65 + idx,
                                                            )}
                                                            . {opt.text}
                                                        </span>
                                                        {reviewBadge}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Navigasi Bawah */}
                        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
                            <button
                                onClick={() =>
                                    setCurrentPageIndex((prev) =>
                                        Math.max(0, prev - 1),
                                    )
                                }
                                disabled={currentPageIndex === 0}
                                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    currentPageIndex === 0
                                        ? "opacity-0 cursor-default pointer-events-none"
                                        : "bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50"
                                }`}
                            >
                                <ChevronLeft size={16} /> Sebelumnya
                            </button>

                            {currentPageIndex < pages.length - 1 ? (
                                <button
                                    onClick={() =>
                                        setCurrentPageIndex((prev) =>
                                            Math.min(
                                                pages.length - 1,
                                                prev + 1,
                                            ),
                                        )
                                    }
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg shadow-sm hover:bg-primary-700 transition-colors"
                                >
                                    Berikutnya <ChevronRight size={16} />
                                </button>
                            ) : (
                                !is_review && (
                                    <button
                                        onClick={confirmFinish}
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                                    >
                                        Akhiri Ujian <Check size={16} />
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
