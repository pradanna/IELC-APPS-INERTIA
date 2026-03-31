import { useState } from 'react';
import { useForm } from '@inertiajs/react';

export const useScheduleModals = (filters) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        id: '',
        type: '',
        study_class_id: '',
        teacher_id: '',
        room_id: '',
        branch_id: filters.branch_id || '',
        day_of_week: '',
        start_time: '',
        is_recurring: true,
        date: filters.date || '',
    });

    const isPast = filters.isPast;

    const openCreateModal = (room, time, dayOfWeek) => {
        if (isPast) return; // EXTRA SAFETY
        setIsEditMode(false);
        // ... (rest of the logic)
        setSelectedSlot({ room, time, dayOfWeek });
        
        setData({
            id: '',
            type: '',
            study_class_id: '',
            teacher_id: '',
            room_id: room.id,
            branch_id: filters.branch_id || room.branch_id,
            day_of_week: dayOfWeek,
            start_time: time,
            is_recurring: true,
            date: filters.date,
        });
        
        setIsCreateModalOpen(true);
    };

    const openEditModal = (content, room, time, dayOfWeek) => {
        setIsEditMode(true);
        setSelectedSlot({ room, time, dayOfWeek });

        setData({
            id: content.id,
            type: content.type,
            study_class_id: content.originalData?.study_class_id || '',
            teacher_id: content.originalData?.teacher_id || '',
            room_id: room.id,
            branch_id: content.originalData?.branch_id || filters.branch_id,
            day_of_week: dayOfWeek,
            start_time: time,
            is_recurring: content.isRecurring ?? false,
            date: filters.date,
        });

        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        setIsEditMode(false);
        reset();
        clearErrors();
    };

    const submitForm = (e) => {
        e.preventDefault();
        
        if (isEditMode) {
            put(route('admin.schedules.update'), {
                onSuccess: () => closeCreateModal(),
                preserveScroll: true
            });
        } else {
            post(route('admin.schedules.store'), {
                onSuccess: () => closeCreateModal(),
                preserveScroll: true
            });
        }
    };

    const deleteSchedule = () => {
        if (!isEditMode) return;
        
        if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
            destroy(route('admin.schedules.destroy'), {
                data: { 
                    id: data.id, 
                    type: data.type,
                    date: data.date 
                },
                onSuccess: () => closeCreateModal(),
                preserveScroll: true
            });
        }
    };

    return {
        isCreateModalOpen,
        isEditMode,
        openCreateModal,
        openEditModal,
        closeCreateModal,
        selectedSlot,
        deleteSchedule,
        form: { data, setData, processing, errors, submitForm }
    };
};
