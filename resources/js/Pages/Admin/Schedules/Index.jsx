import React, { useMemo } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { Calendar as CalendarIcon, Users, Building2, Clock, Plus } from "lucide-react";
import { useScheduleModals } from "./Hooks/useScheduleModals";
import ManageScheduleModal from "./Modals/ManageScheduleModal";

export default function ScheduleIndex({ filters, rooms, schedules, sessions, branches, studyClasses, teachers, currentDayOfWeek }) {
    // Hooks
    const { isCreateModalOpen, isEditMode, openCreateModal, openEditModal, closeCreateModal, deleteSchedule, form, selectedSlot } = useScheduleModals(filters);
    const selectedDateStr = filters.date;
    const isPast = filters.isPast;
    
    // Time slots for the grid (08:00 to 21:00) -> Now Rows again
    const timeSlots = useMemo(() => {
        const slots = [];
        for (let i = 9; i <= 19; i++) {
            slots.push(`${i.toString().padStart(2, '0')}:00`);
        }
        return slots;
    }, []);

    // Generate date navigation
    const dateTabs = useMemo(() => {
        const tabs = [];
        const today = new Date();
        for (let i = -2; i < 12; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            tabs.push(date);
        }
        return tabs;
    }, []);

    const uniqueTeachers = useMemo(() => {
        const teacherMap = new Map();
        
        // Use the same logic as grid rendering to avoid double-counting
        rooms.forEach(room => {
            timeSlots.forEach(time => {
                const hour = parseInt(time.split(':')[0]);
                
                const session = sessions.find(s => {
                    const sStart = parseInt(s.start_time.split(':')[0]);
                    return s.room_id === room.id && sStart === hour;
                });
                
                const schedule = schedules.find(s => {
                    const sStart = parseInt(s.start_time.split(':')[0]);
                    const sDay = s.day_of_week;
                    return s.room_id === room.id && sStart === hour && sDay === currentDayOfWeek;
                });

                let teacherName = null;
                if (session?.teacher?.user) {
                    teacherName = session.teacher.user.name;
                } else if (schedule?.teacher?.user) {
                    teacherName = schedule.teacher.user.name;
                }

                if (teacherName) {
                    teacherMap.set(teacherName, (teacherMap.get(teacherName) || 0) + 1);
                }
            });
        });
        
        return Array.from(teacherMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [rooms, timeSlots, schedules, sessions, currentDayOfWeek]);

    const handleDateChange = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        router.get(route('admin.schedules.index'), { ...filters, date: dateStr }, { preserveState: true, preserveScroll: true });
    };

    const isSameDay = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    };

    const handleBranchChange = (branchId) => {
        router.get(route('admin.schedules.index'), { ...filters, branch_id: branchId });
    };

    /**
     * Drag & Drop Handlers (Native HTML5)
     */
    const handleDragStart = (e, item) => {
        if (isPast) return; // DISALLOW MOVING PAST RECORDS
        e.dataTransfer.setData("id", item.id);
        e.dataTransfer.setData("type", item.type);
        e.dataTransfer.effectAllowed = "move";
        
        // Add a class for visual feedback if needed
        e.currentTarget.style.opacity = "0.4";
    };

    const handleDragEnd = (e) => {
        e.currentTarget.style.opacity = "1";
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Required to allow drop
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, room, time) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("id");
        const type = e.dataTransfer.getData("type");

        if (id && type) {
            router.post(route('admin.schedules.move'), {
                id: id,
                type: type,
                new_room_id: room.id,
                new_start_time: time,
                date: selectedDateStr
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    // Success toast or sound if needed
                }
            });
        }
    };

    // Helper to find content based on Room (Col) and Time (Row)
    const getCellContent = (room, timeStr) => {
        const timeVal = parseInt(timeStr.split(':')[0]);
        
        // Find both to check for matches
        const session = sessions.find(s => {
            const start = parseInt(s.start_time.split(':')[0]);
            const end = parseInt(s.end_time.split(':')[0]);
            return s.room_id === room.id && timeVal >= start && timeVal < end;
        });

        const schedule = schedules.find(s => {
            const start = parseInt(s.start_time.split(':')[0]);
            const end = parseInt(s.end_time.split(':')[0]);
            return s.room_id === room.id && timeVal >= start && timeVal < end;
        });

        // Priority 1: Actual Session (Today's Reality)
        if (session) {
            // Smart Color: If session matches the recurring class, keep it Green (Emerald)
            const isRecurringMatch = schedule && session.study_class_id === schedule.study_class_id;
            const classColor = session.study_class?.class_color || '#eff6ff'; // Default to blue-50
            
            return {
                id: isRecurringMatch ? schedule.id : session.id,
                title: session.study_class?.name || "Class",
                teacher: session.teacher?.user?.name || "N/A",
                status: session.status,
                type: isRecurringMatch ? 'schedule' : 'session',
                isRecurring: isRecurringMatch,
                originalData: session,
                color: classColor,
                borderColor: 'border-gray-200'
            };
        }

        // Priority 2: Recurring Schedule (Template)
        if (schedule) {
            const classColor = schedule.study_class?.class_color || '#ecfdf5'; // Default to emerald-50
            return {
                id: schedule.id,
                title: schedule.study_class?.name || "Class",
                teacher: schedule.teacher?.user?.name || "N/A",
                type: 'schedule',
                isRecurring: true,
                originalData: schedule,
                color: classColor,
                borderColor: 'border-gray-200'
            };
        }

        return null;
    };

    const selectedDateObj = new Date(selectedDateStr);

    return (
        <AdminLayout>
            <Head title="Class Schedule" />

            <div className="flex flex-col gap-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight flex items-center gap-2">
                            Class Schedule
                            {isPast && (
                                <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-200">
                                    READ-ONLY HISTORY
                                </span>
                            )}
                        </h1>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">Room Availability & Session Tracking</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => handleDateChange(new Date())}
                            className="bg-white border border-gray-200 text-gray-700 text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                        >
                            TODAY
                        </button>

                        <button 
                            onClick={() => {
                                const params = new URLSearchParams(filters).toString();
                                window.open(route('admin.schedules.download-pdf') + '?' + params, '_blank');
                            }}
                            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all shadow-md active:scale-95 shadow-rose-500/20"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                            PRINT PDF
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs (Branches & Dates) */}
                <div className="flex flex-col gap-3">
                    {/* Branch Tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide border-b border-gray-100">
                        {branches.map((b) => {
                            const isSelected = filters.branch_id == b.id;
                            return (
                                <button
                                    key={b.id}
                                    onClick={() => handleBranchChange(b.id)}
                                    className={`
                                        px-4 py-1.5 rounded-t-xl transition-all duration-200 text-[11px] font-black uppercase tracking-tight
                                        ${isSelected 
                                            ? "bg-primary-600 text-white shadow-md transform translate-y-[1px]" 
                                            : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                        }
                                    `}
                                >
                                    {b.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* Date Navigation */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide">
                        {dateTabs.map((date, idx) => {
                            const isSelected = isSameDay(date, selectedDateObj);
                            const isToday = isSameDay(date, new Date());
                            
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleDateChange(date)}
                                    className={`
                                        flex flex-col items-center min-w-[64px] py-1.5 px-2 rounded-xl transition-all duration-200
                                        ${isSelected 
                                            ? "bg-primary-600 text-white shadow-lg ring-2 ring-primary-100 scale-105" 
                                            : "bg-white border border-gray-100 text-gray-500 hover:border-primary-300 hover:bg-primary-50/20"
                                        }
                                    `}
                                >
                                    <span className={`text-[8px] uppercase font-bold tracking-tighter ${isSelected ? "text-primary-100" : "text-gray-400"}`}>
                                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </span>
                                    <span className="text-xs font-black leading-none mt-0.5">
                                        {date.getDate()}
                                    </span>
                                    {isToday && !isSelected && (
                                        <div className="w-1 h-1 bg-primary-500 rounded-full mt-1 animate-pulse"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Grid Container: Rooms as Columns, Time as Rows (Square Style) */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col h-[70vh]">
                    
                    {/* Header: Room Columns */}
                    <div className="flex bg-gray-50 border-b border-gray-200 sticky top-0 z-20 min-w-max">
                        {/* Empty Corner */}
                        <div className="min-w-[100px] sticky left-0 z-30 bg-gray-100 border-r border-gray-200 p-3 flex items-center justify-center shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                            <Clock size={16} className="text-gray-400" />
                        </div>
                        
                        {/* Room Headers */}
                        {rooms.map(room => (
                            <div 
                                key={room.id}
                                className="min-w-[100px] max-w-[100px] flex-1 border-r border-gray-200 p-3 text-center"
                            >
                                <div className="text-[10px] font-black text-gray-800 tracking-tight truncate uppercase">{room.name}</div>
                                <div className="text-[8px] text-gray-400 font-bold">CAP: {room.capacity}</div>
                            </div>
                        ))}
                    </div>

                    {/* Body: Time Rows */}
                    <div className="flex-1 overflow-auto scrollbar-thin">
                        <div className="min-w-max">
                            {timeSlots.map(time => (
                                <div key={time} className="flex border-b border-gray-100 group transition-colors">
                                    {/* Sticky Time Label (Left Column) */}
                                    <div className="min-w-[100px] sticky left-0 z-10 bg-gray-50 border-r border-gray-200 p-3 flex items-center justify-center shadow-[2px_0_5px_rgba(0,0,0,0.02)] group-hover:bg-gray-100 transition-colors">
                                        <div className="text-[11px] font-black text-gray-500">{time}</div>
                                    </div>

                                    {/* Room Cells */}
                                    {rooms.map(room => {
                                        const content = getCellContent(room, time);
                                        return (
                                            <div 
                                                key={`${room.id}-${time}`}
                                                onClick={() => !content && !isPast && openCreateModal(room, time, currentDayOfWeek)}
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleDrop(e, room, time)}
                                                className={`
                                                    min-w-[100px] max-w-[100px] flex-1 border-r border-gray-100 p-0.5 min-h-[50px] transition-colors relative
                                                    ${(!content && !isPast) ? 'cursor-pointer hover:bg-primary-50/50' : 'cursor-default'}
                                                `}
                                            >
                                                {!content && !isPast && (
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                        <Plus className="text-primary-300" size={12} />
                                                    </div>
                                                )}
                                                {content && (
                                                        <div 
                                                            draggable="true"
                                                            onDragStart={(e) => handleDragStart(e, content)}
                                                            onDragEnd={handleDragEnd}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openEditModal(content, room, time, currentDayOfWeek);
                                                            }}
                                                            className={`
                                                                h-full w-full rounded-lg border p-1.5 flex flex-col justify-center gap-0.5 transition-all hover:scale-[1.05] cursor-grab active:cursor-grabbing shadow-md relative
                                                                ${content.isRecurring ? 'ring-2 ring-emerald-400/60 border-emerald-500/40 shadow-emerald-500/20' : 'border-black/5'}
                                                            `}
                                                            style={{ backgroundColor: content.color }}
                                                        >
                                                            {/* Status "Light" Indicator */}
                                                            <div className={`
                                                                absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm z-10
                                                                ${content.isRecurring ? 'bg-emerald-400' : 'bg-rose-500'}
                                                            `}></div>

                                                            <div className="flex items-start justify-between gap-1">
                                                                <div className="text-[10px] font-black leading-tight line-clamp-2 text-white drop-shadow-sm">
                                                                    {content.title}
                                                                </div>
                                                                {content.isRecurring && (
                                                                    <CalendarIcon size={10} className="text-white/70 shrink-0 mt-0.5" />
                                                                )}
                                                            </div>
                                                            <div className="text-[8px] font-bold text-white/90 uppercase truncate">
                                                                {content.teacher}
                                                            </div>
                                                            {content.type === 'session' && (
                                                                <div className="mt-auto text-[7px] font-black bg-white/20 text-white px-1 rounded self-end leading-none border border-white/30 backdrop-blur-sm">
                                                                    {content.status.charAt(0)}
                                                                </div>
                                                            )}
                                                        </div>

                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Teacher Recap Panel */}
                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-gray-50/50 px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users size={14} className="text-gray-400" />
                            <h3 className="text-[11px] font-black uppercase tracking-tight text-gray-900">Today's Teaching Roster</h3>
                        </div>
                        <div className="bg-primary-50 text-primary-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                            {uniqueTeachers.length} TEACHERS ACTIVE
                        </div>
                    </div>
                    <div className="p-4">
                        {uniqueTeachers.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {uniqueTeachers.map((teacher, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                        <span className="text-[11px] font-bold text-gray-700">
                                            {teacher.name} <span className="text-gray-400 font-medium ml-1">({teacher.count}x)</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-[10px] text-gray-400 italic">No teachers scheduled for this day.</div>
                        )}
                    </div>
                </div>

                {/* Compact Legend */}
                <div className="flex flex-wrap items-center gap-4 text-[9px] font-bold uppercase tracking-tight bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-gray-500">Repeating Schedule</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        <span className="text-gray-500">Actual Session</span>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <ManageScheduleModal
                show={isCreateModalOpen}
                onClose={closeCreateModal}
                form={form}
                selectedSlot={selectedSlot}
                studyClasses={studyClasses}
                teachers={teachers}
                isEditMode={isEditMode}
                isReadOnly={isPast}
                deleteSchedule={deleteSchedule}
            />
        </AdminLayout>
    );
} 

ScheduleIndex.layout = (page) => <div children={page} />;
