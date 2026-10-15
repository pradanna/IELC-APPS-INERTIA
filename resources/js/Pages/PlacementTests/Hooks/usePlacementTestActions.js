import { useState } from "react";
import { useForm, router } from "@inertiajs/react";

export const usePlacementTestActions = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        description: "",
        duration_minutes: 60,
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.placement-tests.store"), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const handleCopyLink = (test) => {
        if (!test.token) {
            alert("Sesi ini tidak memiliki token ujian.");
            return;
        }
        const magicLink = `${window.location.origin}/placement-test/${test.package_slug}/${test.token}`;
        navigator.clipboard
            .writeText(magicLink)
            .then(() => alert("Tautan ujian berhasil disalin ke clipboard!"))
            .catch((err) => console.error("Gagal menyalin text: ", err));
    };

    const handleSendWa = (test) => {
        if (!test.token) {
            alert("Sesi ini tidak memiliki token ujian.");
            return;
        }

        const magicLink = `${window.location.origin}/placement-test/${test.package_slug}/${test.token}`;
        let waNumber = test.wa.replace(/\D/g, "");
        if (waNumber.startsWith("0")) waNumber = "62" + waNumber.substring(1);

        const message = `Halo *${test.lead_name}*,\n\nBerikut adalah tautan (*Magic Link*) untuk mengakses *Placement Test - ${test.package_name}*:\n\n${magicLink}\n\nSilakan klik tautan di atas untuk mulai mengerjakan ujian.\n\nTerima kasih.`;
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, "_blank");
    };

    const handleUpdateStatus = (statusId) => {
        if (!selectedTest) return;
        setIsUpdatingStatus(true);
        router.put(
            route("admin.crm.leads.status.update", { lead: selectedTest.lead_id }),
            { lead_status_id: statusId },
            {
                preserveScroll: true,
                onSuccess: () => setIsEnrollModalOpen(false),
                onFinish: () => setIsUpdatingStatus(false),
            }
        );
    };

    return {
        modals: {
            isCreateModalOpen, setIsCreateModalOpen,
            isEnrollModalOpen, setIsEnrollModalOpen,
        },
        form: { data, setData, handleSubmit, processing, errors },
        actions: { handleCopyLink, handleSendWa, handleUpdateStatus, setSelectedTest },
        selectedTest,
        isUpdatingStatus
    };
};
