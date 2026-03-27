import React from 'react';
import Badge from '@/Components/ui/Badge';
import { Calendar, Clock, MapPin, Plus, User, Edit2 } from 'lucide-react';

export default function ScheduleTab({ schedules = [], onAddSchedule, onEditSchedule }) {
    const getDayName = (day) => {
        return {
            1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis', 5: 'Jumat', 6: 'Sabtu', 7: 'Minggu'
        }[day] || 'Unknown';
    };

    return (
        <div className="p-6">
            <div className="space-y-4">
                {schedules.length > 0 ? (
                    schedules.map((schedule) => (
                        <div key={schedule.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-primary-200 transition-colors">
                            <div className="absolute top-0 right-0 p-3 text-gray-50 group-hover:text-primary-50 transition-colors">
                                <Calendar size={60} strokeWidth={1} />
                            </div>
                            <div className="relative z-10 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="primary" className="font-bold px-3 py-1 bg-primary-100 text-primary-800 border-none">
                                            {getDayName(schedule.day_of_week)}
                                        </Badge>
                                        <button 
                                            onClick={() => onEditSchedule(schedule)}
                                            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <Clock size={16} />
                                        <span className="text-sm font-medium">
                                            {schedule.start_time?.substring(0, 5)} - {schedule.end_time?.substring(0, 5)}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                        <User size={16} className="text-primary-500" />
                                        <span>{schedule.teacher?.name || 'Belum ada pengajar'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin size={16} className="text-gray-400" />
                                        <span>{schedule.room?.name || 'TBA'}</span>
                                        {schedule.room?.capacity && (
                                            <span className="text-xs text-gray-400 font-normal ml-auto">Kap: {schedule.room.capacity}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                        <Calendar className="mx-auto h-12 w-12 text-gray-200" />
                        <p className="mt-2 text-sm font-medium text-gray-900">Jadwal belum dikonfigurasi</p>
                        <p className="text-xs text-gray-500 mt-1">Kelas ini belum memiliki sesi pertemuan sepekan.</p>
                    </div>
                )}

                {/* Add Schedule Button */}
                {schedules.length < 2 && (
                    <button 
                        onClick={onAddSchedule}
                        className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-primary-200 rounded-xl text-primary-600 hover:bg-primary-50 hover:border-primary-400 transition-all font-bold text-sm"
                    >
                        <Plus size={18} />
                        Tambah Jadwal Sesi
                    </button>
                )}
            </div>
        </div>
    );
}
