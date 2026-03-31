import { useState } from 'react';

export default function useStudentDetail() {
    const [activeTab, setActiveTab] = useState('personal');
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [selectedClassAccount, setSelectedClassAccount] = useState(null);
    const [isAcademicModalOpen, setIsAcademicModalOpen] = useState(false);
    const [selectedClassForScore, setSelectedClassForScore] = useState(null);
    const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

    const tabs = [
        { id: 'personal', label: 'Profil' },
        { id: 'academic', label: 'Akademik' },
    ];

    const toggleImageViewer = (show = true) => {
        setIsImageViewerOpen(show);
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const openClassAcademic = (cls) => {
        setSelectedClassAccount(cls);
        setIsAcademicModalOpen(true);
    };

    const closeClassAcademic = () => {
        setSelectedClassAccount(null);
        setIsAcademicModalOpen(false);
    };

    const openScoreModal = (cls) => {
        setSelectedClassForScore(cls);
        setIsScoreModalOpen(true);
    };

    const closeScoreModal = () => {
        setSelectedClassForScore(null);
        setIsScoreModalOpen(false);
    };

    return {
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
    };
}
