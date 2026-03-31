import React from 'react';
import SlideOver from '@/Components/ui/SlideOver';
import Modal from '@/Components/ui/Modal';
import { X } from 'lucide-react';
import useStudentDetail from '../Hooks/useStudentDetail';
import ProfileTab from './Detail/ProfileTab';
import AcademicTab from './Detail/AcademicTab';
import StudentAcademicModal from '../../StudyClasses/Partials/Modals/StudentAcademicModal';
import StudentScoreModal from '../Modals/StudentScoreModal';

export default function StudentDetailSlider({ show, onClose, student, onEdit }) {
    const { 
        activeTab, 
        tabs, 
        isImageViewerOpen, 
        toggleImageViewer, 
        handleTabChange,
        selectedClassAccount,
        isAcademicModalOpen,
        openClassAcademic,
        closeClassAcademic,
        isScoreModalOpen,
        selectedClassForScore,
        openScoreModal,
        closeScoreModal,
    } = useStudentDetail();

    if (!student) return null;

    return (
        <React.Fragment>
            <SlideOver show={show} onClose={onClose} title="Detail Profil Siswa">
                <div className="flex flex-col h-full bg-white">
                    {/* Navigation Tabs */}
                    <div className="flex border-b border-gray-100">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all relative ${
                                    activeTab === tab.id ? 'text-primary-600 bg-primary-50/10' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto">
                        {activeTab === 'personal' && (
                            <ProfileTab 
                                student={student} 
                                onEdit={onEdit} 
                                toggleImageViewer={toggleImageViewer}
                                onClose={onClose}
                            />
                        )}
                        {activeTab === 'academic' && (
                            <AcademicTab 
                                student={student} 
                                openClassAcademic={openClassAcademic}
                                openScoreModal={openScoreModal}
                            />
                        )}
                    </div>
                </div>
            </SlideOver>

            {/* Academic Statistics Modal */}
            <StudentAcademicModal 
                show={isAcademicModalOpen}
                onClose={closeClassAcademic}
                studyClass={selectedClassAccount}
                student={student}
            />

            {/* Student Score / Progress Report Modal */}
            <StudentScoreModal 
                show={isScoreModalOpen}
                onClose={closeScoreModal}
                student={student}
                studyClass={selectedClassForScore}
            />

            {/* Photo Viewer Modal */}
            <Modal show={isImageViewerOpen} onClose={() => toggleImageViewer(false)} maxWidth="2xl">
                <div className="relative p-1 bg-white rounded-2xl overflow-hidden">
                    <button 
                        onClick={() => toggleImageViewer(false)}
                        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all z-10"
                    >
                        <X size={20} />
                    </button>
                    <img 
                        src={student.profile_picture} 
                        alt={student.name} 
                        className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl" 
                    />
                    <div className="p-4 bg-white text-center">
                        <p className="text-sm font-bold text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{student.nis} • Foto Profil Resmi</p>
                    </div>
                </div>
            </Modal>
        </React.Fragment>
    );
}
