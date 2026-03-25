import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition, Menu } from "@headlessui/react";
import { X, User, ChevronDown, PhoneCall } from "lucide-react";
import StatusBadge from "@/Components/ui/StatusBadge";
import DetailLead from "./DetailLead";
import History from "./History";
import Whatsapp from "./Whatsapp";

export default function LeadDetailPanel({
    lead,
    open,
    onClose,
    leadStatuses = [],
    onStatusUpdate,
    onFollowupClick,
    onEditClick,
}) {
    const [activeTab, setActiveTab] = useState("details");

    // Reset tab kembali ke 'details' setiap kali membuka lead baru
    useEffect(() => {
        if (open) {
            setActiveTab("details");
        }
    }, [open, lead?.id]);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative  z-40" onClose={() => {}}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-xl">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                        {/* Header */}
                                        <div className="bg-gray-50 px-4 py-5 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                                    Lead Details
                                                </Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="relative rounded-md bg-gray-50 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                        onClick={onClose}
                                                    >
                                                        <X className="h-6 w-6" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Main Content */}
                                        <div className="relative flex-1 flex flex-col pb-6">
                                            {/* Top Info (Selalu tampil di atas) */}
                                            <div className="px-4 py-6 sm:px-6 flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                                                    <User className="h-6 w-6" />
                                                </div>
                                                <div className="grow">
                                                    <h3 className="text-lg font-bold text-gray-900">
                                                        {lead?.name}
                                                    </h3>
                                                    <div className="flex items-center gap-x-2 mt-1">
                                                        {(() => {
                                                            const currentStatus =
                                                                leadStatuses.find(
                                                                    (s) =>
                                                                        s.id ===
                                                                        lead?.lead_status_id,
                                                                );

                                                            if (!currentStatus)
                                                                return null;

                                                            return (
                                                                <StatusBadge
                                                                    backgroundColor={
                                                                        currentStatus.bg_color
                                                                    }
                                                                    color={
                                                                        currentStatus.text_color
                                                                    }
                                                                >
                                                                    {currentStatus.name.toUpperCase()}
                                                                </StatusBadge>
                                                            );
                                                        })()}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onFollowupClick &&
                                                                onFollowupClick(
                                                                    lead,
                                                                )
                                                            }
                                                            className="inline-flex items-center justify-center gap-x-1 rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-700 shadow-sm ring-1 ring-inset ring-green-600/20 hover:bg-green-100 transition-colors"
                                                        >
                                                            <PhoneCall className="-ml-0.5 h-3.5 w-3.5 text-green-600" />
                                                            <span>
                                                                Follow-up
                                                            </span>
                                                        </button>
                                                        <Menu
                                                            as="div"
                                                            className="relative inline-block text-left"
                                                        >
                                                            {/* <div>
                                                                <Menu.Button className="inline-flex items-center justify-center gap-x-1 rounded-md bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-600 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-100">
                                                                    <span>
                                                                        Ubah
                                                                        Status
                                                                    </span>
                                                                    <ChevronDown className="-mr-0.5 h-4 w-4 text-gray-400" />
                                                                </Menu.Button>
                                                            </div> */}

                                                            <Transition
                                                                as={Fragment}
                                                                enter="transition ease-out duration-100"
                                                                enterFrom="transform opacity-0 scale-95"
                                                                enterTo="transform opacity-100 scale-100"
                                                                leave="transition ease-in duration-75"
                                                                leaveFrom="transform opacity-100 scale-100"
                                                                leaveTo="transform opacity-0 scale-95"
                                                            >
                                                                <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                                    <div className="py-1">
                                                                        {leadStatuses.map(
                                                                            (
                                                                                status,
                                                                            ) => {
                                                                                const isCurrent =
                                                                                    lead?.lead_status_id ===
                                                                                    status.id;
                                                                                return (
                                                                                    <Menu.Item
                                                                                        key={
                                                                                            status.id
                                                                                        }
                                                                                        disabled={
                                                                                            isCurrent
                                                                                        }
                                                                                    >
                                                                                        {({
                                                                                            active,
                                                                                            disabled,
                                                                                        }) => (
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={(
                                                                                                    e,
                                                                                                ) => {
                                                                                                    if (
                                                                                                        !disabled &&
                                                                                                        onStatusUpdate
                                                                                                    ) {
                                                                                                        onStatusUpdate(
                                                                                                            lead.id,
                                                                                                            status.id,
                                                                                                        );
                                                                                                    }
                                                                                                }}
                                                                                                className={`${
                                                                                                    active
                                                                                                        ? "bg-gray-100 text-gray-900"
                                                                                                        : "text-gray-700"
                                                                                                } ${disabled ? "opacity-50 cursor-not-allowed" : ""} flex w-full items-center gap-2 px-4 py-2 text-sm text-left`}
                                                                                            >
                                                                                                <span
                                                                                                    className="w-2 h-2 rounded-full border border-gray-300"
                                                                                                    style={{
                                                                                                        backgroundColor:
                                                                                                            status.bg_color ||
                                                                                                            "#d1d5db",
                                                                                                    }}
                                                                                                ></span>
                                                                                                {
                                                                                                    status.name
                                                                                                }
                                                                                            </button>
                                                                                        )}
                                                                                    </Menu.Item>
                                                                                );
                                                                            },
                                                                        )}
                                                                    </div>
                                                                </Menu.Items>
                                                            </Transition>
                                                        </Menu>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tabs Navigation */}
                                            <div className="border-b border-gray-200 px-4 sm:px-6">
                                                <nav
                                                    className="-mb-px flex space-x-6"
                                                    aria-label="Tabs"
                                                >
                                                    <button
                                                        onClick={() =>
                                                            setActiveTab(
                                                                "details",
                                                            )
                                                        }
                                                        className={`whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors ${
                                                            activeTab ===
                                                            "details"
                                                                ? "border-primary-500 text-primary-600"
                                                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                                        }`}
                                                    >
                                                        Details
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setActiveTab(
                                                                "history",
                                                            )
                                                        }
                                                        className={`whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors ${
                                                            activeTab ===
                                                            "history"
                                                                ? "border-blue-500 text-blue-600"
                                                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                                        }`}
                                                    >
                                                        Lead History
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setActiveTab(
                                                                "whatsapp",
                                                            )
                                                        }
                                                        className={`whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors ${
                                                            activeTab ===
                                                            "whatsapp"
                                                                ? "border-green-500 text-green-600"
                                                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                                        }`}
                                                    >
                                                        WhatsApp History
                                                    </button>
                                                </nav>
                                            </div>

                                            {/* Tab Contents */}
                                            <div className="px-4 py-6 sm:px-6 space-y-6">
                                                {activeTab === "details" && (
                                                    <DetailLead
                                                        lead={lead}
                                                        onEditClick={
                                                            onEditClick
                                                        }
                                                    />
                                                )}

                                                {activeTab === "history" && (
                                                    <History
                                                        lead={lead}
                                                        leadStatuses={
                                                            leadStatuses
                                                        }
                                                    />
                                                )}

                                                {activeTab === "whatsapp" && (
                                                    <Whatsapp />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
