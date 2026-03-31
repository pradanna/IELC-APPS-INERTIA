import React from 'react';
import Modal from '@/Components/ui/Modal';
import { MapPin, Clock, Calendar, User, BookOpen } from 'lucide-react';
import Select from 'react-select';

export default function ManageScheduleModal({ 
    show, 
    onClose, 
    form, 
    selectedSlot, 
    studyClasses, 
    teachers,
    isEditMode = false,
    isReadOnly = false,
    deleteSchedule = () => {}
}) {
    const { data, setData, processing, errors, submitForm } = form;

    const reactSelectStyles = {
        control: (base, state) => ({
            ...base,
            borderRadius: '0.75rem',
            padding: '2px',
            borderColor: state.isFocused ? '#2563eb' : '#e5e7eb',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(37, 99, 235, 0.1)' : 'none',
            '&:hover': {
                borderColor: '#2563eb'
            },
            fontSize: '0.875rem',
            backgroundColor: isReadOnly ? '#f9fafb' : 'white',
        }),
        option: (base, state) => ({
            ...base,
            fontSize: '0.875rem',
            backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#eff6ff' : 'white',
            color: state.isSelected ? 'white' : '#1f2937',
        }),
        placeholder: (base) => ({
            ...base,
            color: '#9ca3af',
        }),
        menuPortal: base => ({ ...base, zIndex: 20000 })
    };

    return (
        <Modal 
            show={show} 
            onClose={onClose} 
            title={isReadOnly ? "View Class History" : (isEditMode ? "Edit Class Schedule" : "Create Class Schedule")}
            maxWidth="md"
        >
            <form onSubmit={submitForm} className="space-y-4">
                {/* Historical Warning */}
                {isReadOnly && (
                    <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-amber-700 uppercase tracking-tight">Read-Only Session History</span>
                    </div>
                )}

                {/* Info Header */}
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-[11px] font-bold text-gray-600 truncate">
                            {selectedSlot?.room?.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-[11px] font-bold text-gray-600">
                            {selectedSlot?.time}
                        </span>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-3">
                    {/* Study Class Select */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">
                            <BookOpen size={12} /> Study Class
                        </label>
                        <Select
                            styles={reactSelectStyles}
                            isDisabled={isReadOnly}
                            options={studyClasses
                                .filter(sc => sc.branch_id == data.branch_id)
                                .map(sc => ({
                                    value: sc.id,
                                    label: `${sc.name} (${sc.package?.name})`
                                }))
                            }
                            value={studyClasses
                                .map(sc => ({ value: sc.id, label: `${sc.name} (${sc.package?.name})` }))
                                .find(opt => opt.value === data.study_class_id) || null}
                            onChange={opt => setData('study_class_id', opt ? opt.value : '')}
                            placeholder="Search class..."
                            isClearable
                            className={errors.study_class_id ? 'border-red-500 rounded-xl' : ''}
                            menuPortalTarget={document.body}
                        />
                        {errors.study_class_id && <p className="text-[9px] text-red-500 mt-1 font-bold">{errors.study_class_id}</p>}
                    </div>

                    {/* Teacher Select */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">
                            <User size={12} /> Teacher
                        </label>
                        <Select
                            styles={reactSelectStyles}
                            isDisabled={isReadOnly}
                            options={teachers.map(t => ({
                                value: t.id,
                                label: t.user?.name
                            }))}
                            value={teachers
                                .map(t => ({ value: t.id, label: t.user?.name }))
                                .find(opt => opt.value === data.teacher_id) || null}
                            onChange={opt => setData('teacher_id', opt ? opt.value : '')}
                            placeholder="Search teacher..."
                            isClearable
                            className={errors.teacher_id ? 'border-red-500 rounded-xl' : ''}
                            menuPortalTarget={document.body}
                        />
                        {errors.teacher_id && <p className="text-[9px] text-red-500 mt-1 font-bold">{errors.teacher_id}</p>}
                    </div>

                    {/* Options */}
                    {!isReadOnly && (
                        <div className="flex items-center gap-4 bg-primary-50/50 p-2.5 rounded-xl border border-primary-100/50">
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="is_recurring"
                                    checked={data.is_recurring}
                                    onChange={e => setData('is_recurring', e.target.checked)}
                                    className="rounded text-primary-600 focus:ring-primary-500 border-gray-300"
                                />
                                <label htmlFor="is_recurring" className="text-[10px] font-bold text-primary-700 uppercase">Weekly Recurring</label>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="pt-4 flex items-center justify-between gap-3">
                    <div>
                        {isEditMode && !isReadOnly && (
                            <button
                                type="button"
                                onClick={deleteSchedule}
                                className="px-4 py-2 text-xs font-bold text-red-600 uppercase hover:bg-red-50 rounded-xl transition-all"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-3 w-full justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-4 py-2 text-xs font-bold uppercase transition-all ${
                                isReadOnly ? "bg-gray-900 text-white rounded-xl px-10 hover:bg-black" : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {isReadOnly ? "CLOSE" : "Cancel"}
                        </button>
                        {!isReadOnly && (
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-black uppercase px-6 py-2 rounded-xl shadow-lg shadow-primary-500/20 disabled:opacity-50 transition-all active:scale-95"
                            >
                                {processing ? 'Processing...' : (isEditMode ? 'Update' : 'Save')}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </Modal>
    );
}
