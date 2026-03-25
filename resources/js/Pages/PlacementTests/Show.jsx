import React, { useState } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    ArrowLeft,
    Plus,
    FileQuestion,
    Settings,
    Search,
    Upload,
    Download,
} from "lucide-react";
import Modal from "@/Components/ui/Modal";
import TextInput from "@/Components/form/TextInput";
import TextArea from "@/Components/ui/TextArea";
import TableIconButton from "@/Components/ui/TableIconButton";
import DataTable from "@/Components/ui/DataTable";

export default function PlacementTestShow({ auth, exam }) {
    const examData = exam?.data || exam;

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [editingGroupId, setEditingGroupId] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedQuestionForDetail, setSelectedQuestionForDetail] =
        useState(null);
    const [isGroupDetailModalOpen, setIsGroupDetailModalOpen] = useState(false);
    const [selectedGroupForDetail, setSelectedGroupForDetail] = useState(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        pt_question_group_id: null,
        question_text: "",
        points: 1,
        options: ["", "", "", ""],
        correct_answer: 0,
        media: null,
    });

    const openCreateQuestionModal = (groupId = null, question = null) => {
        if (question) {
            setEditingQuestionId(question.id);

            // Mapping data options dari backend agar sesuai format array frontend
            let mappedOptions = ["", "", "", ""];
            let correctIndex = 0;
            if (Array.isArray(question.options)) {
                question.options.forEach((opt, idx) => {
                    if (idx < 4) {
                        mappedOptions[idx] = opt.option_text || "";
                        if (opt.is_correct) correctIndex = idx;
                    }
                });
            }

            setData({
                pt_question_group_id: question.pt_question_group_id || null,
                question_text: question.question_text || "",
                points: question.points || 1,
                options: mappedOptions,
                correct_answer: correctIndex,
                media: null, // Input file dikosongkan agar tidak error
                _method: "put", // Trigger PUT method untuk update
            });
        } else {
            setEditingQuestionId(null);
            reset();
            setData("pt_question_group_id", groupId);
        }
        setIsCreateModalOpen(true);
    };

    const closeCreateQuestionModal = () => {
        setIsCreateModalOpen(false);
        setEditingQuestionId(null);
        reset();
    };

    const openDetailModal = (question) => {
        setSelectedQuestionForDetail(question);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedQuestionForDetail(null);
    };

    const openGroupDetailModal = (group) => {
        setSelectedGroupForDetail(group);
        setIsGroupDetailModalOpen(true);
    };

    const closeGroupDetailModal = () => {
        setIsGroupDetailModalOpen(false);
        setSelectedGroupForDetail(null);
    };

    const importForm = useForm({
        file: null,
    });

    const handleImportSubmit = (e) => {
        e.preventDefault();
        importForm.post(
            route("admin.placement-tests.questions.import", examData?.id),
            {
                onSuccess: () => {
                    setIsImportModalOpen(false);
                    importForm.reset();
                },
            },
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const routeName = editingQuestionId
            ? route("admin.placement-tests.questions.update", [
                  examData?.id,
                  editingQuestionId,
              ])
            : route("admin.placement-tests.questions.store", examData?.id);

        post(routeName, {
            onSuccess: () => {
                closeCreateQuestionModal();
            },
        });
    };

    const settingsForm = useForm({
        title: examData?.title || "",
        description: examData?.description || "",
        duration_minutes: examData?.duration_minutes || 60,
        is_active: !!examData?.is_active,
    });

    const handleSettingsSubmit = (e) => {
        e.preventDefault();
        settingsForm.put(route("admin.placement-tests.update", examData?.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsSettingsModalOpen(false);
            },
        });
    };

    const groupForm = useForm({
        instruction: "",
        reading_text: "",
        audio_path: null, // Untuk Grup
    });

    const openCreateGroupModal = (group = null) => {
        if (group) {
            setEditingGroupId(group.real_id);
            groupForm.setData({
                instruction: group.instruction || "",
                reading_text: group.reading_text || "",
                audio_path: null, // Dikosongkan agar tidak ada file yg dikirim kecuali ada file baru
                _method: "put", // Beri tau Laravel ini adalah request PUT (Update)
            });
        } else {
            setEditingGroupId(null);
            groupForm.setData({
                instruction: "",
                reading_text: "",
                audio_path: null,
            });
        }
        setIsCreateGroupModalOpen(true);
    };

    const handleGroupSubmit = (e) => {
        e.preventDefault();
        const routeName = editingGroupId
            ? route("admin.placement-tests.question-groups.update", [
                  examData?.id,
                  editingGroupId,
              ])
            : route(
                  "admin.placement-tests.question-groups.store",
                  examData?.id,
              );

        groupForm.post(routeName, {
            onSuccess: () => {
                setIsCreateGroupModalOpen(false);
                setEditingGroupId(null);
                groupForm.reset();
            },
        });
    };

    const handleDeleteGroup = (groupId) => {
        if (
            confirm(
                "Apakah Anda yakin ingin menghapus grup ini?\n\nPERHATIAN: Semua soal di dalam grup ini juga akan ikut TERHAPUS!",
            )
        ) {
            router.delete(
                route("admin.placement-tests.question-groups.destroy", [
                    examData?.id,
                    groupId,
                ]),
                { preserveScroll: true },
            );
        }
    };

    const handleDeleteQuestion = (questionId) => {
        if (confirm("Apakah Anda yakin ingin menghapus soal ini?")) {
            router.delete(
                route("admin.placement-tests.questions.destroy", [
                    examData?.id,
                    questionId,
                ]),
                { preserveScroll: true },
            );
        }
    };

    const columns = [
        {
            header: "No.",
            accessor: "rowIndex",
            className: "w-16 text-gray-500",
            render: (row) => (row.type === "group" ? "" : row.rowIndex),
        },
        {
            header: "Pertanyaan",
            accessor: "question_text",
            render: (row) => {
                if (row.type === "group") {
                    return (
                        <div
                            className={`pl-3 py-1 border-l-4 ${row.groupColor}`}
                        >
                            <div className="font-semibold text-primary-700 bg-primary-50 px-3 py-1.5 rounded-md inline-block text-sm border border-primary-100 shadow-sm">
                                [Grup] {row.instruction}
                            </div>
                        </div>
                    );
                }
                return (
                    <div
                        className={
                            row.pt_question_group_id
                                ? `ml-6 pl-3 py-1.5 border-l-4 ${row.groupColor} bg-gray-50/50 rounded-r-md`
                                : "pl-3 py-1.5 border-l-4 border-transparent"
                        }
                    >
                        <p className="line-clamp-2 max-w-sm text-gray-900">
                            {row.question_text}
                        </p>
                    </div>
                );
            },
        },
        {
            header: "Bobot",
            accessor: "points",
            className: "whitespace-nowrap text-gray-500",
            render: (row) =>
                row.type === "group" ? (
                    <span className="text-gray-400">-</span>
                ) : (
                    `${row.points} Poin`
                ),
        },
        {
            header: "Media",
            accessor: "audio_path",
            className: "whitespace-nowrap text-gray-500",
            render: (row) =>
                row.audio_path ? (
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                        Ada Media
                    </span>
                ) : (
                    <span className="text-gray-400">-</span>
                ),
        },
        {
            header: "Aksi",
            accessor: "actions",
            className: "text-right whitespace-nowrap",
            render: (row) => {
                if (row.type === "group") {
                    return (
                        <div className="flex justify-end items-center gap-2">
                            <TableIconButton
                                type="detail"
                                onClick={() => openGroupDetailModal(row)}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    openCreateQuestionModal(row.real_id)
                                }
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-md border border-primary-100 transition-colors"
                                title="Tambah Soal ke Grup Ini"
                            >
                                <Plus size={14} /> Soal
                            </button>
                            <TableIconButton
                                type="edit"
                                onClick={() => openCreateGroupModal(row)}
                            />
                            <TableIconButton
                                type="delete"
                                onClick={() => handleDeleteGroup(row.real_id)}
                            />
                        </div>
                    );
                }
                return (
                    <div className="flex justify-end gap-2">
                        <TableIconButton
                            type="detail"
                            onClick={() => openDetailModal(row)}
                        />
                        <TableIconButton
                            type="edit"
                            onClick={() =>
                                openCreateQuestionModal(
                                    row.pt_question_group_id,
                                    row,
                                )
                            }
                        />
                        <TableIconButton
                            type="delete"
                            onClick={() => handleDeleteQuestion(row.id)}
                        />
                    </div>
                );
            },
        },
    ];

    const standaloneQuestions = Array.isArray(examData?.questions)
        ? examData.questions
        : examData?.questions?.data || [];

    const groups = examData?.question_groups || [];

    // Gabungkan Grup dan Soal Mandiri untuk di-sort berdasarkan waktu dibuat
    const topLevelItems = [
        ...groups.map((g) => ({ ...g, itemType: "group" })),
        ...standaloneQuestions.map((q) => ({ ...q, itemType: "standalone" })),
    ];

    // Urutkan berdasarkan created_at (sesuai urutan input)
    topLevelItems.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        if (dateA === dateB) return a.id - b.id; // Fallback jika waktu sama persis
        return dateA - dateB;
    });

    const tableData = [];
    let questionIndex = 1;
    let groupColorIndex = 0;

    // Pilihan warna border-left yang kontras untuk membedakan antar-grup
    const groupColors = [
        "border-blue-500",
        "border-emerald-500",
        "border-purple-500",
        "border-amber-500",
        "border-pink-500",
        "border-cyan-500",
        "border-rose-500",
        "border-indigo-500",
    ];

    const query = searchQuery.toLowerCase();

    topLevelItems.forEach((item) => {
        if (item.itemType === "group") {
            const matchGroup = item.instruction?.toLowerCase().includes(query);
            const matchedQuestions = (item.questions || []).filter((q) =>
                q.question_text?.toLowerCase().includes(query),
            );

            // Tampilkan grup jika nama grup cocok, ATAU jika ada soal di dalamnya yang cocok
            if (!query || matchGroup || matchedQuestions.length > 0) {
                const currentColor =
                    groupColors[groupColorIndex % groupColors.length];
                groupColorIndex++;

                tableData.push({
                    type: "group",
                    id: `group-${item.id}`,
                    real_id: item.id,
                    instruction: item.instruction,
                    audio_path: item.audio_path,
                    reading_text: item.reading_text,
                    questions: item.questions || [],
                    groupColor: currentColor,
                });

                // Jika nama grup tidak cocok (tapi soalnya cocok), tampilkan hanya soal yang cocok saja
                const questionsToShow =
                    query && !matchGroup
                        ? matchedQuestions
                        : item.questions || [];

                questionsToShow.forEach((q) => {
                    tableData.push({
                        type: "question",
                        ...q,
                        rowIndex: questionIndex++,
                        groupColor: currentColor,
                    });
                });
            }
        } else {
            if (!query || item.question_text?.toLowerCase().includes(query)) {
                tableData.push({
                    type: "question",
                    ...item,
                    rowIndex: questionIndex++,
                    groupColor: null,
                });
            }
        }
    });

    return (
        <AdminLayout>
            <Head title={`Kelola Ujian: ${examData?.title || "Paket Ujian"}`} />

            <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route("admin.placement-tests.index")}
                            className="p-2 text-gray-400 hover:text-gray-600 bg-white rounded-full border border-gray-200 shadow-sm transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold leading-7 text-gray-900 flex items-center gap-2">
                                {examData?.title || "Detail Paket Ujian"}
                                {examData?.is_active ? (
                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                        Aktif
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                        Draft
                                    </span>
                                )}
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                {examData?.description ||
                                    "Kelola soal dan pengaturan untuk paket ujian ini."}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                settingsForm.setData({
                                    title: examData?.title || "",
                                    description: examData?.description || "",
                                    duration_minutes:
                                        examData?.duration_minutes || 60,
                                    is_active: !!examData?.is_active,
                                });
                                setIsSettingsModalOpen(true);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            <Settings size={16} /> Pengaturan
                        </button>
                        <button
                            onClick={() => setIsImportModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg shadow-sm hover:bg-emerald-100 transition-colors"
                        >
                            <Upload size={16} /> Import Excel
                        </button>
                        <button
                            onClick={() => openCreateGroupModal(null)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 border border-primary-100 rounded-lg shadow-sm hover:bg-primary-100 transition-colors"
                        >
                            <Plus size={16} /> Tambah Grup Soal
                        </button>
                        <button
                            onClick={() => openCreateQuestionModal(null)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg shadow-sm hover:bg-primary-700 transition-colors"
                        >
                            <Plus size={16} /> Tambah Soal
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Kolom Kiri: Daftar Soal */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    <FileQuestion
                                        size={18}
                                        className="text-primary-600"
                                    />
                                    Daftar Soal (
                                    {examData?.questions_count || 0})
                                </h3>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari soal atau grup..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="block w-full rounded-lg border-0 py-1.5 pl-9 pr-3 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:max-w-xs"
                                    />
                                </div>
                            </div>
                            {tableData.length > 0 ? (
                                <div className="p-4">
                                    <DataTable
                                        data={tableData}
                                        columns={columns}
                                    />
                                </div>
                            ) : searchQuery ? (
                                <div className="p-10 text-center text-gray-500">
                                    <Search
                                        size={48}
                                        className="mx-auto text-gray-300 mb-3"
                                    />
                                    <p className="text-sm font-medium text-gray-900">
                                        Pencarian tidak ditemukan
                                    </p>
                                    <p className="text-sm mt-1">
                                        Tidak ada soal atau grup yang cocok
                                        dengan "{searchQuery}".
                                    </p>
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                                    >
                                        Reset Pencarian
                                    </button>
                                </div>
                            ) : (
                                <div className="p-10 text-center text-gray-500">
                                    <FileQuestion
                                        size={48}
                                        className="mx-auto text-gray-300 mb-3"
                                    />
                                    <p className="text-sm font-medium text-gray-900">
                                        Belum ada soal
                                    </p>
                                    <p className="text-sm mt-1">
                                        Mulai tambahkan soal untuk paket ujian
                                        ini.
                                    </p>
                                    <button
                                        onClick={() =>
                                            setIsImportModalOpen(true)
                                        }
                                        className="mt-4 mr-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                                    >
                                        <Upload size={16} /> Import Excel
                                    </button>
                                    <button
                                        onClick={() =>
                                            openCreateGroupModal(null)
                                        }
                                        className="mt-4 mr-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                                    >
                                        <Plus size={16} /> Tambah Grup Soal
                                    </button>
                                    <button
                                        onClick={() =>
                                            openCreateQuestionModal(null)
                                        }
                                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                                    >
                                        <Plus size={16} /> Tambah Soal Pertama
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Kolom Kanan: Informasi Paket Ujian */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Informasi Paket
                                </h3>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Durasi Pengerjaan
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {examData?.duration_minutes || 60} Menit
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Total Soal
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {examData?.questions_count || 0} Soal
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Soal */}
            <Modal
                show={isCreateModalOpen}
                onClose={closeCreateQuestionModal}
                title={
                    editingQuestionId
                        ? "Edit Soal"
                        : data.pt_question_group_id
                          ? "Tambah Soal ke Grup"
                          : "Tambah Soal Mandiri"
                }
                maxWidth="xl"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Pertanyaan <span className="text-red-500">*</span>
                        </label>
                        <TextArea
                            value={data.question_text}
                            onChange={(e) =>
                                setData("question_text", e.target.value)
                            }
                            className="mt-1 block w-full"
                            rows={3}
                            placeholder="Masukkan pertanyaan di sini..."
                            required
                        />
                        {errors.question_text && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.question_text}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Materi Audio/Video (Opsional)
                            </label>
                            <input
                                type="file"
                                accept="audio/*,video/*"
                                onChange={(e) =>
                                    setData("media", e.target.files[0])
                                }
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                            />
                            {errors.media && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.media}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Bobot Soal (Poin){" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <TextInput
                                type="number"
                                min="1"
                                value={data.points}
                                onChange={(e) =>
                                    setData("points", e.target.value)
                                }
                                className="mt-1 block w-full"
                                required
                            />
                            {errors.points && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.points}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Pilihan Jawaban{" "}
                            <span className="text-red-500">*</span>
                            <span className="text-gray-500 font-normal ml-1">
                                (Pilih radio button untuk jawaban yang benar)
                            </span>
                        </label>
                        {data.options.map((option, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3"
                            >
                                <input
                                    type="radio"
                                    name="correct_answer"
                                    checked={data.correct_answer === index}
                                    onChange={() =>
                                        setData("correct_answer", index)
                                    }
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 cursor-pointer"
                                />
                                <div className="flex-1">
                                    <TextInput
                                        type="text"
                                        value={option}
                                        onChange={(e) => {
                                            const newOptions = [
                                                ...data.options,
                                            ];
                                            newOptions[index] = e.target.value;
                                            setData("options", newOptions);
                                        }}
                                        className="w-full"
                                        placeholder={`Opsi ${String.fromCharCode(65 + index)}`}
                                        required
                                    />
                                    {errors[`options.${index}`] && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors[`options.${index}`]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={closeCreateQuestionModal}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
                        >
                            {processing
                                ? "Menyimpan..."
                                : editingQuestionId
                                  ? "Simpan Perubahan"
                                  : "Simpan Soal"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal Tambah Grup Soal */}
            <Modal
                show={isCreateGroupModalOpen}
                onClose={() => {
                    setIsCreateGroupModalOpen(false);
                    setEditingGroupId(null);
                    groupForm.reset();
                }}
                title={editingGroupId ? "Edit Grup Soal" : "Tambah Grup Soal"}
                maxWidth="2xl"
            >
                <form onSubmit={handleGroupSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Instruksi Pengerjaan{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <TextInput
                                value={groupForm.data.instruction}
                                onChange={(e) =>
                                    groupForm.setData(
                                        "instruction",
                                        e.target.value,
                                    )
                                }
                                className="mt-1 block w-full"
                                placeholder="Contoh: Listen to the audio to answer Q4-Q7"
                                required
                            />
                            {groupForm.errors.instruction && (
                                <p className="mt-1 text-xs text-red-600">
                                    {groupForm.errors.instruction}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Audio Listening (Opsional)
                                </label>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) =>
                                        groupForm.setData(
                                            "audio_path",
                                            e.target.files[0],
                                        )
                                    }
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                />
                                {groupForm.errors.audio_path && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {groupForm.errors.audio_path}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Teks Reading (Opsional, untuk soal cerita
                                panjang)
                            </label>
                            <TextArea
                                value={groupForm.data.reading_text}
                                onChange={(e) =>
                                    groupForm.setData(
                                        "reading_text",
                                        e.target.value,
                                    )
                                }
                                className="mt-1 block w-full"
                                rows={4}
                                placeholder="Masukkan teks artikel atau bahan bacaan..."
                            />
                            {groupForm.errors.reading_text && (
                                <p className="mt-1 text-xs text-red-600">
                                    {groupForm.errors.reading_text}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => {
                                setIsCreateGroupModalOpen(false);
                                setEditingGroupId(null);
                                groupForm.reset();
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={groupForm.processing}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
                        >
                            {groupForm.processing
                                ? "Menyimpan..."
                                : editingGroupId
                                  ? "Simpan Perubahan"
                                  : "Simpan Grup"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal Detail Soal */}
            <Modal
                show={isDetailModalOpen}
                onClose={closeDetailModal}
                title="Detail Soal"
                maxWidth="2xl"
            >
                {selectedQuestionForDetail && (
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">
                                Pertanyaan
                            </h4>
                            <p className="mt-2 text-base text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-100 whitespace-pre-wrap">
                                {selectedQuestionForDetail.question_text}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">
                                    Bobot Poin
                                </h4>
                                <p className="mt-1 text-sm text-gray-900">
                                    {selectedQuestionForDetail.points} Poin
                                </p>
                            </div>
                            {selectedQuestionForDetail.audio_path && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">
                                        Media
                                    </h4>
                                    <audio
                                        controls
                                        className="mt-2 w-full max-h-10"
                                    >
                                        <source
                                            src={`/${selectedQuestionForDetail.audio_path}`}
                                            type="audio/mpeg"
                                        />
                                        Browser Anda tidak mendukung elemen
                                        audio.
                                    </audio>
                                </div>
                            )}
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-3">
                                Pilihan Jawaban
                            </h4>
                            <div className="space-y-2">
                                {selectedQuestionForDetail.options &&
                                    selectedQuestionForDetail.options.map(
                                        (opt, idx) => (
                                            <div
                                                key={idx}
                                                className={`flex items-start gap-3 p-3 rounded-lg border ${
                                                    opt.is_correct
                                                        ? "bg-green-50 border-green-200 text-green-800"
                                                        : "bg-white border-gray-200 text-gray-700"
                                                }`}
                                            >
                                                <div className="mt-0.5">
                                                    {opt.is_correct ? (
                                                        <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs">
                                                            ✓
                                                        </div>
                                                    ) : (
                                                        <div className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 text-xs">
                                                            {String.fromCharCode(
                                                                65 + idx,
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 text-sm">
                                                    {opt.option_text}
                                                </div>
                                            </div>
                                        ),
                                    )}
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={closeDetailModal}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal Detail Grup Soal */}
            <Modal
                show={isGroupDetailModalOpen}
                onClose={closeGroupDetailModal}
                title="Detail Grup Soal"
                maxWidth="3xl"
            >
                {selectedGroupForDetail && (
                    <div className="flex flex-col max-h-[80vh]">
                        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                            {/* Informasi Grup Utama */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">
                                        Instruksi Pengerjaan
                                    </h4>
                                    <p className="mt-1 text-base text-primary-800 bg-primary-50 p-4 rounded-lg border border-primary-100 whitespace-pre-wrap">
                                        {selectedGroupForDetail.instruction}
                                    </p>
                                </div>

                                {selectedGroupForDetail.audio_path && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">
                                            Audio Listening
                                        </h4>
                                        <audio
                                            controls
                                            className="mt-2 w-full max-h-10"
                                        >
                                            <source
                                                src={`/${selectedGroupForDetail.audio_path}`}
                                                type="audio/mpeg"
                                            />
                                            Browser Anda tidak mendukung elemen
                                            audio.
                                        </audio>
                                    </div>
                                )}

                                {selectedGroupForDetail.reading_text && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">
                                            Teks Reading / Bacaan
                                        </h4>
                                        <div className="mt-2 text-sm text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap">
                                            {
                                                selectedGroupForDetail.reading_text
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Daftar Soal dalam Grup */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">
                                    Daftar Soal Terkait (
                                    {selectedGroupForDetail.questions.length})
                                </h4>
                                <div className="space-y-3">
                                    {selectedGroupForDetail.questions.length >
                                    0 ? (
                                        selectedGroupForDetail.questions.map(
                                            (q, qIdx) => (
                                                <div
                                                    key={q.id}
                                                    className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                                                >
                                                    <div className="flex gap-4">
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900 text-sm">
                                                                {qIdx + 1}.{" "}
                                                                {
                                                                    q.question_text
                                                                }
                                                            </p>
                                                            {q.audio_path && (
                                                                <audio
                                                                    controls
                                                                    className="mt-2 w-full max-h-8"
                                                                >
                                                                    <source
                                                                        src={`/${q.audio_path}`}
                                                                        type="audio/mpeg"
                                                                    />
                                                                </audio>
                                                            )}
                                                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                {q.options &&
                                                                    q.options.map(
                                                                        (
                                                                            opt,
                                                                            optIdx,
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    optIdx
                                                                                }
                                                                                className={`flex items-start gap-2 p-2 rounded-md border text-xs ${
                                                                                    opt.is_correct
                                                                                        ? "bg-green-50 border-green-200 text-green-800"
                                                                                        : "bg-gray-50 border-gray-200 text-gray-700"
                                                                                }`}
                                                                            >
                                                                                <span className="font-bold mt-0.5">
                                                                                    {String.fromCharCode(
                                                                                        65 +
                                                                                            optIdx,
                                                                                    )}

                                                                                    .
                                                                                </span>
                                                                                <span className="flex-1">
                                                                                    {
                                                                                        opt.option_text
                                                                                    }
                                                                                </span>
                                                                                {opt.is_correct && (
                                                                                    <span className="text-green-600 font-bold">
                                                                                        ✓
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        ),
                                                                    )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded">
                                                                {q.points} Poin
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg text-center border border-dashed border-gray-200">
                                            Belum ada soal di dalam grup ini.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tombol Footer */}
                        <div className="pt-4 mt-4 flex justify-end gap-3 border-t border-gray-100 bg-white">
                            <button
                                type="button"
                                onClick={closeGroupDetailModal}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal Pengaturan Paket Ujian */}
            <Modal
                show={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                title="Pengaturan Paket Ujian"
                maxWidth="lg"
            >
                <form onSubmit={handleSettingsSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nama Paket Ujian{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <TextInput
                            type="text"
                            value={settingsForm.data.title}
                            onChange={(e) =>
                                settingsForm.setData("title", e.target.value)
                            }
                            className="mt-1 block w-full"
                            placeholder="Contoh: PT General English"
                            required
                        />
                        {settingsForm.errors.title && (
                            <p className="mt-1 text-xs text-red-600">
                                {settingsForm.errors.title}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Deskripsi (Opsional)
                        </label>
                        <TextArea
                            value={settingsForm.data.description}
                            onChange={(e) =>
                                settingsForm.setData(
                                    "description",
                                    e.target.value,
                                )
                            }
                            className="mt-1 block w-full sm:text-sm"
                            rows={3}
                            placeholder="Penjelasan singkat mengenai ujian..."
                        />
                        {settingsForm.errors.description && (
                            <p className="mt-1 text-xs text-red-600">
                                {settingsForm.errors.description}
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
                            value={settingsForm.data.duration_minutes}
                            onChange={(e) =>
                                settingsForm.setData(
                                    "duration_minutes",
                                    e.target.value,
                                )
                            }
                            className="mt-1 block w-full"
                            required
                        />
                        {settingsForm.errors.duration_minutes && (
                            <p className="mt-1 text-xs text-red-600">
                                {settingsForm.errors.duration_minutes}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={settingsForm.data.is_active}
                            onChange={(e) =>
                                settingsForm.setData(
                                    "is_active",
                                    e.target.checked,
                                )
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
                    {settingsForm.errors.is_active && (
                        <p className="mt-1 text-xs text-red-600">
                            {settingsForm.errors.is_active}
                        </p>
                    )}

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-50">
                        <button
                            type="button"
                            onClick={() => setIsSettingsModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={settingsForm.processing}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
                        >
                            {settingsForm.processing
                                ? "Menyimpan..."
                                : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal Import Excel */}
            <Modal
                show={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                title="Import Soal dari Excel"
                maxWidth="lg"
            >
                <form onSubmit={handleImportSubmit} className="space-y-4">
                    <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-lg border border-blue-100 space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">
                                Panduan Format Excel:
                            </p>
                            <a
                                href={route(
                                    "admin.placement-tests.template.download",
                                )}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-primary-700 bg-white border border-primary-200 rounded-md shadow-sm hover:bg-primary-50 transition-colors"
                                download
                            >
                                <Download size={14} /> Download Template
                            </a>
                        </div>
                        <p>
                            Pastikan baris pertama (header) menggunakan nama
                            kolom berikut:
                        </p>
                        <ul className="list-disc list-inside ml-4 font-mono text-xs">
                            <li>kode_grup (Kosongkan jika soal mandiri)</li>
                            <li>instruksi_grup_wacana</li>
                            <li>pertanyaan</li>
                            <li>pilihan_a</li>
                            <li>pilihan_b</li>
                            <li>pilihan_c</li>
                            <li>pilihan_d</li>
                            <li>kunci (A/B/C/D atau Angka 0/1/2/3)</li>
                            <li>bobot</li>
                        </ul>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Pilih File Excel (.xlsx, .csv){" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={(e) =>
                                importForm.setData("file", e.target.files[0])
                            }
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 border border-gray-200 rounded-md"
                            required
                        />
                        {importForm.errors.file && (
                            <p className="mt-1 text-xs text-red-600">
                                {importForm.errors.file}
                            </p>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-50">
                        <button
                            type="button"
                            onClick={() => setIsImportModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={importForm.processing}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
                        >
                            {importForm.processing
                                ? "Mengimpor..."
                                : "Import Soal"}
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
