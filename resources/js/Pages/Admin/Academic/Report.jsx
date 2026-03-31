import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { 
    ChevronLeft, 
    Users, 
    FileText,
    Printer,
    Download,
    Search,
    GraduationCap,
    Clock,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    History,
    Calendar
} from "lucide-react";

export default function Report({ studyClass, allScores, assessmentTypes }) {
    const [selectedType, setSelectedType] = useState('quiz');
    const [selectedSession, setSelectedSession] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedStudent, setExpandedStudent] = useState(null);

    const assessmentKeys = Object.keys(assessmentTypes);

    // Get available sessions for the selected assessment type
    const getAvailableSessions = (type) => {
        const sessionNums = new Set();
        Object.values(allScores).flat().forEach(score => {
            if (score.assessment_type === type) {
                sessionNums.add(score.session_number);
            }
        });
        return Array.from(sessionNums).sort((a, b) => a - b);
    };

    const availableSessions = getAvailableSessions(selectedType);

    // Effect to auto-select the latest session when type changes
    useEffect(() => {
        const sessions = getAvailableSessions(selectedType);
        if (sessions.length > 0) {
            setSelectedSession(sessions[sessions.length - 1]);
        } else {
            setSelectedSession(1);
        }
    }, [selectedType]);

    const filteredStudents = studyClass.students.filter(student => 
        student.lead?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nis?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePrintAll = () => {
        window.open(route('admin.academic.export-pdf', { 
            studyClass: studyClass.id, 
            type: selectedType,
            session: selectedSession
        }), '_blank');
    };

    const handlePrintSingle = (studentId) => {
        window.open(route('admin.academic.export-pdf', { 
            studyClass: studyClass.id, 
            type: selectedType,
            session: selectedSession,
            student_id: studentId
        }), '_blank');
    };

    return (
        <AdminLayout>
            <Head title={`Academic Report: ${studyClass.name}`} />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <Link 
                            href={route("admin.academic.index")}
                            className="mt-1 p-2 bg-white border border-gray-100 hover:bg-gray-50 rounded-xl text-gray-400 transition-all shadow-sm active:scale-95"
                        >
                            <ChevronLeft size={20} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-600 mb-1">
                                <GraduationCap size={14} />
                                Sequential Progress Tracking
                            </div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
                                {studyClass.name}
                            </h1>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">
                                {studyClass.package?.level?.name || 'Class'} • {studyClass.branch?.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                         <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari siswa NIS/Nama..."
                                className="pl-9 pr-4 py-2 bg-white border-gray-200 rounded-xl text-xs focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all w-48 shadow-sm"
                            />
                        </div>

                        <button
                            onClick={handlePrintAll}
                            className="bg-primary-600 hover:bg-primary-700 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2 active:scale-95 group"
                        >
                            <Printer size={14} className="group-hover:rotate-12 transition-transform" />
                            Mass Print Sesi #{selectedSession}
                        </button>
                    </div>
                </div>

                {/* Session & Category Matrix */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar: Session History */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
                            <div className="flex items-center gap-2 text-gray-400 mb-4 px-2">
                                <History size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">History Category</span>
                            </div>
                            <div className="space-y-1">
                                {assessmentKeys.map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedType(key)}
                                        className={`w-full text-left px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all ${
                                            selectedType === key 
                                            ? "bg-primary-600 text-white shadow-md shadow-primary-500/20 translate-x-1" 
                                            : "text-gray-500 hover:bg-gray-50"
                                        }`}
                                    >
                                        {assessmentTypes[key]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
                             <div className="flex items-center gap-2 text-gray-400 mb-4 px-2">
                                <Clock size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Recorded Sessions</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {availableSessions.length > 0 ? (
                                    availableSessions.map(num => (
                                        <button
                                            key={num}
                                            onClick={() => setSelectedSession(num)}
                                            className={`aspect-square flex items-center justify-center rounded-xl text-[10px] font-black border transition-all ${
                                                selectedSession === num
                                                ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/20"
                                                : "bg-gray-50 border-transparent text-gray-400 hover:border-gray-300"
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    ))
                                ) : (
                                    <div className="col-span-4 py-4 text-center text-[9px] font-bold text-gray-300 uppercase tracking-widest border border-dashed border-gray-100 rounded-xl">
                                        No sessions recorded
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Student List for Selected Session */}
                    <div className="lg:col-span-3 space-y-6">
                         <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden border-separate">
                            <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detail Sesi:</span>
                                    <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-gray-900 shadow-sm">
                                        {assessmentTypes[selectedType]} #{selectedSession}
                                    </span>
                                </div>
                                <Link 
                                    href={`${route('admin.academic.show', studyClass.id)}?type=${selectedType}&session=${selectedSession}`}
                                    className="text-[9px] font-black text-primary-600 uppercase tracking-widest hover:underline"
                                >
                                    Edit This Session
                                </Link>
                            </div>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                        <th className="px-6 py-4 w-[240px]">Student Details</th>
                                        <th className="px-4 py-4 text-center w-[60px]">LIS</th>
                                        <th className="px-4 py-4 text-center w-[60px]">RED</th>
                                        <th className="px-4 py-4 text-center w-[60px]">SPK</th>
                                        <th className="px-4 py-4 text-center w-[70px] bg-primary-50/20 text-primary-600">AVG</th>
                                        <th className="px-6 py-4">Session Feedback</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredStudents.map((student) => {
                                        const studentScores = allScores[student.id] || [];
                                        const currentScore = studentScores.find(s => s.assessment_type === selectedType && s.session_number === selectedSession);
                                        const isExpanded = expandedStudent === student.id;

                                        return (
                                            <React.Fragment key={student.id}>
                                                <tr className="group hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 border border-gray-200">
                                                                {student.lead?.name?.substring(0, 1)}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-[11px] font-black text-gray-900 tracking-tight leading-none mb-1 truncate">{student.lead?.name}</p>
                                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight font-mono">#{student.nis}</p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-2 py-4 text-center">
                                                        <span className={`text-[11px] font-bold ${currentScore ? 'text-gray-900' : 'text-gray-200'}`}>
                                                            {currentScore?.score_details?.listening || "-"}
                                                        </span>
                                                    </td>
                                                    <td className="px-2 py-4 text-center">
                                                        <span className={`text-[11px] font-bold ${currentScore ? 'text-gray-900' : 'text-gray-200'}`}>
                                                            {currentScore?.score_details?.reading || "-"}
                                                        </span>
                                                    </td>
                                                    <td className="px-2 py-4 text-center">
                                                        <span className={`text-[11px] font-bold ${currentScore ? 'text-gray-900' : 'text-gray-200'}`}>
                                                            {currentScore?.score_details?.speaking || "-"}
                                                        </span>
                                                    </td>
                                                    <td className="px-2 py-4 text-center bg-primary-50/10">
                                                        <span className={`text-[12px] font-black ${currentScore ? 'text-primary-600' : 'text-gray-200'}`}>
                                                            {currentScore ? parseFloat(currentScore.total_score).toFixed(1) : "-"}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <p className="text-[10px] text-gray-500 font-medium italic line-clamp-1 max-w-[200px]">
                                                            {currentScore?.final_feedback || "Belum ada catatan."}
                                                        </p>
                                                    </td>

                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button 
                                                                disabled={!currentScore}
                                                                onClick={() => handlePrintSingle(student.id)}
                                                                className={`p-1.5 rounded-lg transition-all ${
                                                                    currentScore 
                                                                    ? 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50' 
                                                                    : 'text-gray-100 cursor-not-allowed'
                                                                }`}
                                                                title="Print Individual Report"
                                                            >
                                                                <FileText size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Additional Info Dashboard */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Class Status</p>
                                <div className="text-xl font-black text-center text-gray-900">
                                     {studyClass.students.length} Pupils
                                </div>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Session Total</p>
                                <div className="text-xl font-black text-center text-primary-600">
                                     {availableSessions.length} Sesi
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
