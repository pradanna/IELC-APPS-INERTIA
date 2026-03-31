import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { 
    ChevronLeft, 
    Users, 
    BookCheck, 
    History, 
    Clock, 
    MessageSquare, 
    Save, 
    Calendar, 
    MapPin, 
    User,
    CheckCircle2,
    AlertCircle,
    Search,
    Plus,
    X,
    UserPlus,
    Printer
} from "lucide-react";
import AttendanceTable from "./Partials/AttendanceTable";
import axios from "axios";

export default function Show({ session, existingAttendances }) {
    const { data, setData, post, processing, errors } = useForm({
        topic_taught: session.topic_taught || "",
        attendances: session.study_class.students.map((student) => {
            const existing = existingAttendances.find(
                (a) => a.student_id === student.id
            );
            return {
                student_id: student.id,
                nis: student.nis,
                name: student.user?.name || student.lead?.name || "Unknown Student",
                status: existing ? existing.status : "present",
                late_minutes: existing ? existing.late_minutes : null,
                teacher_notes: existing ? existing.teacher_notes : "",
                is_fill_in: false,
            };
        }),
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Manual debounce for student search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm.length >= 3) {
                searchStudents();
            } else {
                setSearchResults([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const searchStudents = async () => {
        setIsSearching(true);
        try {
            const response = await axios.get(route("admin.attendances.search-students"), {
                params: { search: searchTerm }
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsSearching(false);
        }
    };

    const addFillInStudent = (student) => {
        // Prevent adding duplicates
        if (data.attendances.some(a => a.student_id === student.id)) {
            setSearchTerm("");
            setSearchResults([]);
            return;
        }

        const newEntry = {
            student_id: student.id,
            nis: student.nis,
            name: student.name,
            status: "present",
            late_minutes: null,
            teacher_notes: `Fill-in from ${student.branch}`,
            is_fill_in: true,
        };

        setData("attendances", [...data.attendances, newEntry]);
        setSearchTerm("");
        setSearchResults([]);
    };

    const removeStudent = (studentId) => {
        setData("attendances", data.attendances.filter(a => a.student_id !== studentId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.attendances.store", session.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Success toast or logic is handled by global Toast in AdminLayout
            },
        });
    };

    return (
        <AdminLayout>
            <Head title={`Attendance: ${session.study_class.name}`} />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Navbar */}
                <div className="flex items-center justify-between sticky top-0 bg-gray-50/80 backdrop-blur-md z-40 py-2 border-b border-gray-100 -mx-4 px-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("admin.attendances.index", { branch_id: session.branch_id })}
                            className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </Link>
                        <div>
                            <h1 className="text-sm font-black text-gray-900 leading-tight uppercase tracking-tight">
                                {session.study_class.name}
                            </h1>
                            <div className="flex items-center gap-3 mt-0.5">
                                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold group">
                                    <Calendar size={11} />
                                    <span>{new Date(session.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold group">
                                    <Clock size={11} />
                                    <span>{session.start_time.substring(0, 5)} - {session.end_time.substring(0, 5)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold group text-primary-500">
                                    <MapPin size={11} />
                                    <span>{session.room?.name || 'Main Hall'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => window.open(route('admin.attendances.export-pdf', session.id))}
                            className="bg-white hover:bg-gray-50 text-gray-700 text-[11px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm transition-all flex items-center gap-2 group"
                        >
                            <Printer size={14} className="text-gray-400 group-hover:text-primary-500 transition-colors" />
                            <span>Print</span>
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={processing}
                            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white text-[11px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2 group"
                        >
                            {processing ? (
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save size={14} className="group-hover:translate-y-[-1px] transition-transform" />
                            )}
                            <span>Save Attendance</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Attendance Entry Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                            <div className="bg-primary-50/50 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users size={16} className="text-primary-600" />
                                    <h2 className="text-[11px] font-black uppercase tracking-tight text-gray-900">Student Roster</h2>
                                </div>
                                <div className="relative group">
                                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 py-1 shadow-sm focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
                                        <UserPlus size={12} className="text-gray-400" />
                                        <input 
                                            type="text"
                                            placeholder="Add Fill-in Student..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="text-[10px] font-bold border-none p-0 focus:ring-0 placeholder:text-gray-300 w-32"
                                        />
                                        {isSearching && <div className="w-2 h-2 border border-primary-500 border-t-transparent rounded-full animate-spin" />}
                                    </div>

                                    {/* Search Results Dropdown */}
                                    {searchResults.length > 0 && (
                                        <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
                                            <div className="p-2 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Search Results</span>
                                                <button onClick={() => setSearchResults([])}><X size={10} /></button>
                                            </div>
                                            <div className="max-h-48 overflow-y-auto">
                                                {searchResults.map((s) => (
                                                    <button
                                                        key={s.id}
                                                        onClick={() => addFillInStudent(s)}
                                                        className="w-full text-left px-3 py-2 hover:bg-primary-50 transition-colors border-b border-gray-50 last:border-0 group"
                                                    >
                                                        <p className="text-[11px] font-black text-gray-800 group-hover:text-primary-600">{s.name}</p>
                                                        <p className="text-[9px] text-gray-400 font-bold uppercase">NIS: {s.nis} • {s.branch}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <AttendanceTable 
                                data={data} 
                                setData={setData} 
                                errors={errors}
                                onRemove={removeStudent}
                            />
                        </div>
                    </div>

                    {/* Class Info & Topic Section */}
                    <div className="space-y-6">
                        {/* Topic Taught Card */}
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                            <div className="bg-gray-50/50 px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                                <BookCheck size={16} className="text-gray-400" />
                                <h2 className="text-[11px] font-black uppercase tracking-tight text-gray-900">Session Journal</h2>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
                                        Material / Topic Taught
                                    </label>
                                    <textarea
                                        value={data.topic_taught}
                                        onChange={(e) => setData("topic_taught", e.target.value)}
                                        placeholder="What was covered in this session? (e.g. Unit 4: Grammar & Speaking)"
                                        className={`w-full text-xs font-medium bg-gray-50 border-gray-100 rounded-xl px-4 py-3 h-32 resize-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 placeholder:text-gray-300 transition-all ${
                                            errors.topic_taught ? 'border-red-300' : ''
                                        }`}
                                    />
                                    {errors.topic_taught && (
                                        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-red-500 font-bold bg-red-50 px-2 py-1 rounded-md">
                                            <AlertCircle size={10} />
                                            <span>{errors.topic_taught}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100/50">
                                    <div className="flex items-center gap-2 text-primary-700 mb-1">
                                        <CheckCircle2 size={14} />
                                        <span className="text-[11px] font-black uppercase tracking-tight">Status Update</span>
                                    </div>
                                    <p className="text-[10px] text-primary-600/80 font-medium leading-relaxed">
                                        Saving this sheet will automatically mark the session as <span className="font-black uppercase">Completed</span>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Teacher/Room Info Card */}
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                            <div className="bg-gray-50/50 px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                                <History size={16} className="text-gray-400" />
                                <h2 className="text-[11px] font-black uppercase tracking-tight text-gray-900">Session Details</h2>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 font-bold overflow-hidden shadow-inner">
                                        {session.teacher?.user?.name?.substring(0, 1) || '?'}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Instructor</p>
                                        <p className="text-sm font-black text-gray-800 tracking-tight">{session.teacher?.user?.name || 'Unassigned'}</p>
                                    </div>
                                </div>
                                <div className="space-y-3 pt-4 border-t border-gray-50">
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="text-gray-400 font-medium lowercase">branch location</span>
                                        <span className="font-black text-gray-800 uppercase tracking-tight">{session.branch?.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="text-gray-400 font-medium lowercase">enrolled students</span>
                                        <span className="font-black text-gray-800 tabular-nums bg-gray-100 px-2 py-0.5 rounded-md">
                                            {session.study_class.students.length} {session.study_class.students.length === 1 ? 'Pupil' : 'Pupils'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
