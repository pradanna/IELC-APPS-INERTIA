import React, { useState } from 'react';
import SlideOver from '@/Components/ui/SlideOver';
import DetailTab from './DetailTab';
import StudentsTab from './StudentsTab';
import ScheduleTab from './ScheduleTab';
import { Calendar, Users, BookOpen } from 'lucide-react';

import AddScheduleModal from './Modals/AddScheduleModal';

export default function StudyClassDetailSlider({ show, onClose, studyClass, rooms, teachers }) {
    const [activeTab, setActiveTab] = useState('detail');
    const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);

    if (!studyClass) return null;

    const tabs = [
        { id: 'detail', label: 'Detail', icon: BookOpen },
        { id: 'students', label: 'Daftar Siswa', icon: Users },
        { id: 'schedule', label: 'Jadwal', icon: Calendar },
    ];

    const handleAddSchedule = () => {
        setEditingSchedule(null);
        setIsAddScheduleModalOpen(true);
    };

    const handleEditSchedule = (schedule) => {
        setEditingSchedule(schedule);
        setIsAddScheduleModalOpen(true);
    };

    return (
        <SlideOver 
            show={show} 
            onClose={onClose} 
            title={studyClass.name}
        >
            <div className="flex flex-col h-full bg-white">
                {/* Tabs Navigation */}
                <div className="flex border-b border-gray-100 bg-white sticky top-0 z-20">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all relative ${
                                    active ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <Icon size={16} />
                                <span>{tab.label}</span>
                                {active && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="flex-1">
                    {activeTab === 'detail' && (
                        <DetailTab studyClass={studyClass} />
                    )}
                    {activeTab === 'students' && (
                        <StudentsTab 
                            students={studyClass.students} 
                            studyClass={studyClass}
                        />
                    )}
                    {activeTab === 'schedule' && (
                        <ScheduleTab 
                            schedules={studyClass.class_schedules} 
                            rooms={rooms}
                            onAddSchedule={handleAddSchedule}
                            onEditSchedule={handleEditSchedule}
                        />
                    )}
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="w-full py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Tutup Panel
                    </button>
                </div>
            </div>

            <AddScheduleModal 
                show={isAddScheduleModalOpen}
                onClose={() => {
                    setIsAddScheduleModalOpen(false);
                    setEditingSchedule(null);
                }}
                studyClass={studyClass}
                rooms={rooms}
                teachers={teachers}
                schedule={editingSchedule}
            />
        </SlideOver>
    );
}
