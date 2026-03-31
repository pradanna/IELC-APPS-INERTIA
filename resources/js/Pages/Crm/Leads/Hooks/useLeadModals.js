import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";

export const useLeadModals = (mappedLeads = [], initialPtExams = []) => {
    const [selectedLead, setSelectedLead] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [leadToEdit, setLeadToEdit] = useState(null);
    const [leadToDelete, setLeadToDelete] = useState(null);
    const [leadToFollowup, setLeadToFollowup] = useState(null);
    const [isPtModalOpen, setIsPtModalOpen] = useState(false);
    const [pendingPtUpdate, setPendingPtUpdate] = useState(null);
    const [dynamicPtExams, setDynamicPtExams] = useState(initialPtExams || []);

    // Sync selected lead with mapped leads from props
    useEffect(() => {
        if (selectedLead) {
            const updatedLeadFromList = mappedLeads.find((l) => l.id === selectedLead.id);
            if (updatedLeadFromList) {
                setSelectedLead((prev) => ({
                    ...prev,
                    ...updatedLeadFromList
                }));
            }
        }
    }, [mappedLeads, selectedLead?.id]);

    // Fetch Active PT Exams if needed
    useEffect(() => {
        if ((isPtModalOpen || !!leadToFollowup) && dynamicPtExams.length === 0) {
            axios.get(route("admin.placement-tests.active"))
                .then((response) => setDynamicPtExams(response.data))
                .catch((error) => console.error("Failed to fetch active PT exams", error));
        }
    }, [isPtModalOpen, leadToFollowup, dynamicPtExams.length]);

    const handleShowLeadDetail = (leadId) => {
        axios.get(route("admin.crm.leads.show", { lead: leadId }))
            .then((response) => setSelectedLead(response.data.data))
            .catch((err) => {
                console.error("Failed to fetch lead details", err);
                alert("Maaf, gagal memuat detail lead.");
            });
    };

    const handleEditClick = (leadId) => {
        axios.get(route("admin.crm.leads.show", { lead: leadId }))
            .then((response) => setLeadToEdit(response.data.data));
    };

    const handleStatusUpdate = (leadId, newStatus) => {
        // Status ID for Placement Test
        if (newStatus === "c0a80101-0000-0000-0000-000000000004") {
            const leadInfo = mappedLeads.find((l) => l.id === leadId);
            setPendingPtUpdate({ leadId, newStatus, interest_package_id: leadInfo?.interest_package_id || "" });
            setIsPtModalOpen(true);
            return;
        }
        executeStatusUpdate(leadId, newStatus);
    };

    const executeStatusUpdate = (leadId, newStatus, extraData = {}) => {
        router.put(route("admin.crm.leads.status.update", { lead: leadId }),
            { lead_status_id: newStatus, ...extraData },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => {
                    setIsPtModalOpen(false);
                    setPendingPtUpdate(null);
                },
            }
        );
    };

    const handleReviewProfile = (leadId, actionType) => {
        router.post(route('admin.crm.leads.review-profile', { lead: leadId }), {
            action: actionType
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                axios.get(route("admin.crm.leads.show", { lead: leadId }))
                    .then((response) => setSelectedLead(response.data.data));
            }
        });
    };

    return {
        selectedLead, setSelectedLead,
        isCreateOpen, setIsCreateOpen,
        leadToEdit, setLeadToEdit,
        leadToDelete, setLeadToDelete,
        leadToFollowup, setLeadToFollowup,
        isPtModalOpen, setIsPtModalOpen,
        pendingPtUpdate, setPendingPtUpdate,
        dynamicPtExams, setDynamicPtExams,
        handleShowLeadDetail,
        handleEditClick,
        handleStatusUpdate,
        executeStatusUpdate,
        handleReviewProfile,
    };
};
