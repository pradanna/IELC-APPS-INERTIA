import React from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

// Hooks
import { usePlacementTestActions } from "./Hooks/usePlacementTestActions";

// Partials
import PlacementStats from "./Partials/PlacementStats";
import PlacementTable from "./Partials/PlacementTable";
import ExamManagementSidebar from "./Partials/ExamManagementSidebar";

// Modals
import CreatePackageModal from "./Modals/CreatePackageModal";
import EnrollStudentModal from "./Modals/EnrollStudentModal";

export default function PlacementTestIndex({
    stats,
    tests = [],
    examPackages = [],
}) {
    const { 
        modals, 
        form, 
        actions, 
        selectedTest, 
        isUpdatingStatus 
    } = usePlacementTestActions();

    return (
        <AdminLayout>
            <Head title="Placement Test Dashboard" />

            <div className="w-full space-y-6 min-w-0">
                {/* Header */}
                <div>
                    <h1 className="text-xl font-bold leading-7 text-gray-900">
                        Placement Test Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Monitor aktivitas ujian dan kelola paket ujian siswa.
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-6 min-w-0">
                    {/* Kolom Kiri: Stats & Tabel Utama */}
                    <div className="xl:col-span-2 space-y-6 min-w-0">
                        <PlacementStats stats={stats} />
                        
                        <PlacementTable 
                            tests={tests} 
                            onCopyLink={actions.handleCopyLink}
                            onSendWa={actions.handleSendWa}
                            onOpenEnroll={(test) => {
                                actions.setSelectedTest(test);
                                modals.setIsEnrollModalOpen(true);
                            }}
                        />
                    </div>

                    {/* Kolom Kanan: Sidebar */}
                    <div className="xl:col-span-1 min-w-0">
                        <ExamManagementSidebar 
                            examPackages={examPackages}
                            onCreateClick={() => modals.setIsCreateModalOpen(true)}
                        />
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CreatePackageModal 
                isOpen={modals.isCreateModalOpen}
                onClose={() => modals.setIsCreateModalOpen(false)}
                form={form}
            />

            <EnrollStudentModal 
                isOpen={modals.isEnrollModalOpen}
                onClose={() => modals.setIsEnrollModalOpen(false)}
                selectedTest={selectedTest}
                onUpdateStatus={actions.handleUpdateStatus}
                isUpdatingStatus={isUpdatingStatus}
            />
        </AdminLayout>
    );
}
