import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { 
    ChevronLeft, 
    Save, 
    Users, 
    BookOpen, 
    MessageSquare, 
    Clock, 
    CheckCircle2, 
    HelpCircle,
    TrendingUp,
    PlusCircle,
    History
} from "lucide-react";

export default function MassEntry({ 
    studyClass, 
    existingScores, 
    assessmentType: initialType, 
    sessionNumber: initialSession,
    existingSessions,
    availableTypes 
}) {
    const [stats, setStats] = useState({ avg: 0, progress: 0 });

    const { data, setData, post, processing, errors } = useForm({
        assessment_type: initialType,
        session_number: initialSession,
        scores: studyClass.students.map(student => {
            const existing = existingScores[student.id];
            return {
                student_id: student.id,
                total_score: existing ? existing.total_score : "",
                final_feedback: existing ? existing.final_feedback : "",
                score_details: existing ? existing.score_details : {
                    listening: "",
                    reading: "",
                    speaking: ""
                }
            };
        })
    });

    // Stats calculation
    useEffect(() => {
        const filled = data.scores.filter(s => s.total_score !== "" && s.total_score !== null);
        const avg = filled.length > 0 
            ? filled.reduce((acc, curr) => acc + parseFloat(curr.total_score), 0) / filled.length 
            : 0;
        
        setStats({
            avg: avg.toFixed(1),
            progress: Math.round((filled.length / studyClass.students.length) * 100)
        });
    }, [data.scores]);

    const handleSubScoreChange = (studentId, skill, value) => {
        const newScores = data.scores.map(s => {
            if (s.student_id === studentId) {
                const newDetails = { ...s.score_details, [skill]: value };
                // Calculate average of the 3 sub-scores
                const l = parseFloat(newDetails.listening || 0);
                const r = parseFloat(newDetails.reading || 0);
                const sp = parseFloat(newDetails.speaking || 0);
                const avg = (l + r + sp) / 3;
                
                return { 
                    ...s, 
                    score_details: newDetails,
                    total_score: l || r || sp ? avg.toFixed(1) : s.total_score
                };
            }
            return s;
        });
        setData('scores', newScores);
    };

    const handleFeedbackChange = (studentId, value) => {
        const newScores = data.scores.map(s => 
            s.student_id === studentId ? { ...s, final_feedback: value } : s
        );
        setData('scores', newScores);
    };

    const handleTypeChange = (newType) => {
        router.get(route('admin.academic.show', studyClass.id), { type: newType }, { preserveState: false });
    };

    const handleSessionChange = (newSession) => {
        router.get(route('admin.academic.show', studyClass.id), { 
            type: data.assessment_type, 
            session: newSession 
        }, { preserveState: false });
    };

    const handleNewSession = () => {
        const nextSession = existingSessions.length > 0 ? Math.max(...existingSessions) + 1 : 2;
        handleSessionChange(nextSession);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.academic.store', studyClass.id));
    };

    return (
        <AdminLayout>
            <Head title={`Mass Entry: ${studyClass.name}`} />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <Link 
                            href={route("admin.academic.index")}
                            className="mt-1 p-2 bg-white border border-gray-100 hover:bg-gray-50 rounded-xl text-gray-400 transition-all shadow-sm active:scale-95"
                        >
                            <ChevronLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
                                Mass Academic Entry
                            </h1>
                            <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-tighter">
                                {studyClass.name} • {studyClass.package?.level?.name || 'Class'} • {studyClass.branch?.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link 
                            href={route("admin.academic.report", studyClass.id)}
                            className="bg-white hover:bg-gray-50 text-gray-500 text-[11px] font-black uppercase tracking-widest px-6 py-3 rounded-xl border border-gray-200 transition-all flex items-center gap-2 active:scale-95"
                        >
                            <TrendingUp size={14} className="text-primary-500" />
                            View Reports
                        </Link>
                        <button
                            onClick={submit}
                            disabled={processing}
                            className="bg-primary-600 hover:bg-primary-700 text-white text-[11px] font-black uppercase tracking-widest px-8 py-3 rounded-xl shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                            <Save size={14} />
                            {processing ? "Saving..." : "Save Session Data"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Panel: Configuration */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Assessment Type Selector */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <BookOpen size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Assessment Category</span>
                            </div>
                            <div className="space-y-2">
                                {availableTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => handleTypeChange(type.id)}
                                        className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${
                                            data.assessment_type === type.id 
                                            ? "bg-primary-50 border-primary-200 text-primary-700 shadow-sm" 
                                            : "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100"
                                        }`}
                                    >
                                        {type.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Session Selector */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
                            <div className="flex items-center justify-between gap-2 text-gray-400 mb-2">
                                <div className="flex items-center gap-2">
                                    <History size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Sesi Berurutan</span>
                                </div>
                                <button 
                                    onClick={handleNewSession}
                                    className="p-1 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                    title="Start New Session"
                                >
                                    <PlusCircle size={16} />
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-2">
                                {existingSessions.length > 0 ? (
                                    existingSessions.map(num => (
                                        <button
                                            key={num}
                                            onClick={() => handleSessionChange(num)}
                                            className={`aspect-square flex items-center justify-center rounded-xl text-[10px] font-black border transition-all ${
                                                data.session_number === num
                                                ? "bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-500/20"
                                                : "bg-white border-gray-100 text-gray-400 hover:border-gray-300"
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    ))
                                ) : (
                                    <div className="col-span-4 py-4 text-center text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                                        No past sessions
                                    </div>
                                )}
                            </div>
                            
                            <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Sesi</span>
                                <span className="px-3 py-1 bg-primary-50 text-primary-700 text-[11px] font-black rounded-lg"># {data.session_number}</span>
                            </div>
                        </div>

                        {/* Quick Stats Card */}
                        <div className="bg-primary-600 rounded-3xl p-6 text-white shadow-xl shadow-primary-500/20">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-primary-200 text-[10px] font-black uppercase tracking-widest mb-1 text-center">Recording Progress</p>
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="text-4xl font-black">{stats.progress}%</div>
                                        <div className="w-12 h-12 rounded-full border-4 border-primary-500/30 flex items-center justify-center">
                                            <CheckCircle2 size={24} className="text-primary-200" />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-primary-500/30">
                                    <p className="text-primary-200 text-[10px] font-black uppercase tracking-widest mb-1 text-center">Class Average</p>
                                    <div className="text-2xl font-black text-center">{stats.avg === "0.0" ? "-" : stats.avg}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Spreadsheet Entry */}
                    <div className="lg:col-span-3">
                        <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden min-h-[600px]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                            <th className="px-6 py-5 w-[220px]">Student Name</th>
                                            <th className="px-4 py-5 text-center w-[80px]">LIS</th>
                                            <th className="px-4 py-5 text-center w-[80px]">RED</th>
                                            <th className="px-4 py-5 text-center w-[80px]">SPK</th>
                                            <th className="px-4 py-5 text-center w-[80px] bg-primary-50/50 text-primary-600">AVG</th>
                                            <th className="px-6 py-5">Academic Feedback</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {data.scores.map((s, index) => {
                                            const student = studyClass.students.find(st => st.id === s.student_id);
                                            return (
                                                <tr key={s.student_id} className="group hover:bg-primary-50/10 transition-colors">
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
                                                    
                                                    {/* Sub-Score Inputs */}
                                                    <td className="px-2 py-4">
                                                        <input 
                                                            type="number"
                                                            value={s.score_details?.listening}
                                                            onChange={(e) => handleSubScoreChange(s.student_id, 'listening', e.target.value)}
                                                            className="w-full text-center border text-xs font-bold rounded-lg border-gray-200 p-2 focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 hover:border-gray-300 transition-all shadow-sm"
                                                            placeholder="-"
                                                        />
                                                    </td>
                                                    <td className="px-2 py-4">
                                                        <input 
                                                            type="number"
                                                            value={s.score_details?.reading}
                                                            onChange={(e) => handleSubScoreChange(s.student_id, 'reading', e.target.value)}
                                                            className="w-full text-center border text-xs font-bold rounded-lg border-gray-200 p-2 focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 hover:border-gray-300 transition-all shadow-sm"
                                                            placeholder="-"
                                                        />
                                                    </td>
                                                    <td className="px-2 py-4">
                                                        <input 
                                                            type="number"
                                                            value={s.score_details?.speaking}
                                                            onChange={(e) => handleSubScoreChange(s.student_id, 'speaking', e.target.value)}
                                                            className="w-full text-center border text-xs font-bold rounded-lg border-gray-200 p-2 focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 hover:border-gray-300 transition-all shadow-sm"
                                                            placeholder="-"
                                                        />
                                                    </td>

                                                    <td className="px-2 py-4 bg-primary-50/10">
                                                        <div className={`text-center text-[13px] font-black transition-colors ${
                                                            s.total_score === "" || s.total_score === null ? "text-gray-200" : "text-primary-600"
                                                        }`}>
                                                            {s.total_score ? parseFloat(s.total_score).toFixed(1) : "-"}
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="relative group/input">
                                                            <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                                                            <input 
                                                                type="text"
                                                                value={s.final_feedback}
                                                                onChange={(e) => handleFeedbackChange(s.student_id, e.target.value)}
                                                                placeholder="Berikan masukan akademik..."
                                                                className={`w-full pl-9 pr-4 py-2 text-[10px] font-medium rounded-xl border focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all ${
                                                                    s.final_feedback === "" ? "bg-gray-50/50 text-gray-300 border-gray-100" : "bg-white text-gray-800 border-primary-200 shadow-sm"
                                                                }`}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Helpful Tip */}
                        <div className="mt-6 flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
                             <HelpCircle size={18} className="text-gray-400" />
                             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Tip: Gunakan Tombol + di Sesi Berurutan untuk membuka sesi pengisian baru tanpa menimpa data lama.</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
