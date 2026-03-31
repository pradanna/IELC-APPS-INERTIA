import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/ui/Modal";
import InputLabel from "@/Components/ui/InputLabel";
import TextInput from "@/Components/form/TextInput";
import TextArea from "@/Components/ui/TextArea";
import Select from "react-select";

export default function FollowupLeadModal({
    show,
    onClose,
    onSuccess,
    leadToFollowup,
    leadStatuses = [],
    packages = [],
    dynamicPtExams = [],
}) {
    const followupForm = useForm({
        method: "whatsapp",
        scheduled_at: "",
        notes: "",
        lead_status_id: "",
        pt_exam_id: "",
        interest_package_id: "",
    });

    useEffect(() => {
        if (show && leadToFollowup) {
            followupForm.reset();
            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + 3);
            defaultDate.setHours(10, 0, 0, 0);
            const offset = defaultDate.getTimezoneOffset() * 60000;
            const localISOTime = new Date(defaultDate.getTime() - offset)
                .toISOString()
                .slice(0, 16);

            followupForm.setData({
                method: "whatsapp",
                scheduled_at: localISOTime,
                notes: "",
                lead_status_id: leadToFollowup.lead_status_id || "",
                pt_exam_id: "",
                interest_package_id: leadToFollowup.interest_package_id || "",
            });
        }
    }, [show, leadToFollowup]);

    const handleFollowupSubmit = (e) => {
        e.preventDefault();
        followupForm.post(route("admin.crm.leads.followups.store", leadToFollowup?.id), {
            preserveScroll: true,
            onSuccess: () => {
                followupForm.reset();
                onClose();
                if (onSuccess) onSuccess();
            },
        });
    };

    const followupTemplates = [
        "Tidak diangkat",
        "Nomor tidak aktif",
        "Minta pricelist",
        "Minta jadwal trial",
    ];

    const reactSelectStyles = {
        control: (base, state) => ({
            ...base,
            border: "0",
            boxShadow: state.isFocused
                ? "0 0 0 2px #4f46e5"
                : "0 0 0 1px #d1d5db",
            borderRadius: "0.5rem",
            padding: "2px 0",
        }),
        menuPortal: base => ({ ...base, zIndex: 20000 })
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            title={`Follow-up: ${leadToFollowup?.name || ""}`}
        >
            <form onSubmit={handleFollowupSubmit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="followup_status" value="Update Status" />
                    <div className="mt-1">
                        <select
                            id="followup_status"
                            value={followupForm.data.lead_status_id}
                            onChange={(e) =>
                                followupForm.setData("lead_status_id", e.target.value)
                            }
                            className="block w-full rounded-lg border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                        >
                            {/* Joined UUID is 9571e1cd-fbda-476c-9a4d-e9cde60b1357 based on previous state if string */}
                            {leadStatuses
                                .filter((status) => status.id !== 'c0a80101-0000-0000-0000-000000000006')
                                .map((status) => (
                                    <option key={status.id} value={status.id}>
                                        {status.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="followup_method" value="Follow-up Method" />
                    <div className="mt-1">
                        <select
                            id="followup_method"
                            value={followupForm.data.method}
                            onChange={(e) =>
                                followupForm.setData("method", e.target.value)
                            }
                            className="block w-full rounded-lg border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                        >
                            <option value="whatsapp">WhatsApp</option>
                            <option value="call">Phone Call</option>
                            <option value="email">Email</option>
                        </select>
                    </div>
                </div>

                {followupForm.data.lead_status_id !== 'c0a80101-0000-0000-0000-000000000005' &&
                 followupForm.data.lead_status_id !== 'c0a80101-0000-0000-0000-000000000006' &&
                 followupForm.data.lead_status_id !== 'c0a80101-0000-0000-0000-000000000004' &&
                 followupForm.data.lead_status_id !== 'c0a80101-0000-0000-0000-000000000007' && (
                    <div>
                        <InputLabel htmlFor="scheduled_at" value="Next Schedule Follow Up" />
                        <div className="mt-1">
                            <TextInput
                                id="scheduled_at"
                                type="datetime-local"
                                value={followupForm.data.scheduled_at}
                                onChange={(e) =>
                                    followupForm.setData("scheduled_at", e.target.value)
                                }
                                className="w-full"
                            />
                        </div>
                    </div>
                )}

                {(followupForm.data.lead_status_id === 'c0a80101-0000-0000-0000-000000000005' ||
                   followupForm.data.lead_status_id === 'c0a80101-0000-0000-0000-000000000004') && (
                    <div>
                        <InputLabel
                            htmlFor="followup_interest_package_id"
                            value="Paket yang Diminati"
                        />
                        <div className="mt-1">
                            <Select
                                id="followup_interest_package_id"
                                styles={reactSelectStyles}
                                menuPosition="fixed"
                                options={packages.map((p) => ({
                                    value: p.id,
                                    label: p.name,
                                }))}
                                value={packages
                                    .map((p) => ({ value: p.id, label: p.name }))
                                    .find((opt) => opt.value === followupForm.data.interest_package_id) || null}
                                onChange={(opt) =>
                                    followupForm.setData("interest_package_id", opt ? opt.value : "")
                                }
                                placeholder="-- Pilih Paket Pendaftaran --"
                                isClearable
                                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                className="w-full"
                            />
                        </div>
                    </div>
                )}

                {followupForm.data.lead_status_id === 'c0a80101-0000-0000-0000-000000000004' && (
                    <>
                        <div>
                            <InputLabel htmlFor="pt_exam_id" value="Pilih Paket Ujian" />
                            <div className="mt-1">
                                <Select
                                    id="pt_exam_id"
                                    styles={reactSelectStyles}
                                    menuPosition="fixed"
                                    options={dynamicPtExams.map((exam) => ({
                                        value: exam.id,
                                        label: exam.title || exam.name,
                                    }))}
                                    value={dynamicPtExams
                                        .map((exam) => ({ value: exam.id, label: exam.title || exam.name }))
                                        .find((opt) => opt.value === followupForm.data.pt_exam_id) || null}
                                    onChange={(opt) =>
                                        followupForm.setData("pt_exam_id", opt ? opt.value : "")
                                    }
                                    placeholder="-- Pilih Paket --"
                                    isClearable
                                    className="w-full"
                                    menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                />
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="scheduled_at" value="PT Schedule" />
                            <div className="mt-1">
                                <TextInput
                                    id="scheduled_at"
                                    type="datetime-local"
                                    value={followupForm.data.scheduled_at}
                                    onChange={(e) =>
                                        followupForm.setData("scheduled_at", e.target.value)
                                    }
                                    className="w-full"
                                    required
                                />
                            </div>
                        </div>
                    </>
                )}

                <div>
                    <InputLabel htmlFor="followup_notes" value="Notes" />
                    <div className="mt-2 mb-3 flex flex-wrap gap-2">
                        {followupTemplates.map((template, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                    const currentNotes = followupForm.data.notes || "";
                                    const newNotes = currentNotes.trim()
                                        ? `${currentNotes.trim()}\n- ${template}`
                                        : `- ${template}`;
                                    followupForm.setData("notes", newNotes);
                                }}
                                className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 hover:bg-blue-100 transition-colors"
                            >
                                + {template}
                            </button>
                        ))}
                    </div>
                    <div className="mt-1">
                        <TextArea
                            id="followup_notes"
                            rows={3}
                            value={followupForm.data.notes}
                            onChange={(e) => followupForm.setData("notes", e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                        type="submit"
                        disabled={followupForm.processing}
                        className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:col-start-2 disabled:opacity-50"
                    >
                        {followupForm.processing ? "Saving..." : "Save Follow-up"}
                    </button>
                    <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
}
