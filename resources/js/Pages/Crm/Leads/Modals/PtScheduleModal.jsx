import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/ui/Modal";
import InputLabel from "@/Components/ui/InputLabel";
import TextInput from "@/Components/form/TextInput";
import Select from "react-select";

export default function PtScheduleModal({
    show,
    onClose,
    pendingPtUpdate,
    executeStatusUpdate,
    packages = [],
    dynamicPtExams = [],
}) {
    const ptForm = useForm({
        pt_exam_id: "",
        scheduled_at: "",
        interest_package_id: "",
    });

    useEffect(() => {
        if (show && pendingPtUpdate?.interest_package_id) {
            ptForm.setData("interest_package_id", pendingPtUpdate.interest_package_id);
        }
    }, [show, pendingPtUpdate]);

    const handlePtSubmit = (e) => {
        e.preventDefault();
        if (pendingPtUpdate) {
            executeStatusUpdate(
                pendingPtUpdate.leadId,
                pendingPtUpdate.newStatus,
                {
                    pt_exam_id: ptForm.data.pt_exam_id,
                    scheduled_at: ptForm.data.scheduled_at,
                    interest_package_id: ptForm.data.interest_package_id,
                }
            );
        }
    };

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
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Jadwalkan Placement Test"
        >
            <form onSubmit={handlePtSubmit} className="space-y-4">
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
                                .find((opt) => opt.value === ptForm.data.pt_exam_id) || null}
                            onChange={(opt) =>
                                ptForm.setData("pt_exam_id", opt ? opt.value : "")
                            }
                            placeholder="-- Pilih Paket --"
                            isClearable
                            className="w-full"
                        />
                        {ptForm.errors.pt_exam_id && (
                            <p className="mt-1 text-xs text-red-600">
                                {ptForm.errors.pt_exam_id}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <InputLabel
                        htmlFor="pt_interest_package_id"
                        value="Paket yang Diminati"
                    />
                    <div className="mt-1">
                        <Select
                            id="pt_interest_package_id"
                            styles={reactSelectStyles}
                            menuPosition="fixed"
                            options={packages.map((p) => ({
                                value: p.id,
                                label: p.name,
                            }))}
                            value={packages
                                .map((p) => ({ value: p.id, label: p.name }))
                                .find((opt) => opt.value === ptForm.data.interest_package_id) || null}
                            onChange={(opt) =>
                                ptForm.setData("interest_package_id", opt ? opt.value : "")
                            }
                            placeholder="-- Pilih Paket Pendaftaran --"
                            isClearable
                            className="w-full"
                        />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="pt_scheduled_at" value="Jadwal Pelaksanaan" />
                    <div className="mt-1">
                        <TextInput
                            id="pt_scheduled_at"
                            type="datetime-local"
                            value={ptForm.data.scheduled_at}
                            onChange={(e) =>
                                ptForm.setData("scheduled_at", e.target.value)
                            }
                            className="w-full"
                            required
                        />
                        {ptForm.errors.scheduled_at && (
                            <p className="mt-1 text-xs text-red-600">
                                {ptForm.errors.scheduled_at}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                        type="submit"
                        disabled={ptForm.processing}
                        className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:col-start-2 disabled:opacity-50"
                    >
                        {ptForm.processing ? "Menyimpan..." : "Jadwalkan & Ubah Status"}
                    </button>
                    <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                        onClick={onClose}
                    >
                        Batal
                    </button>
                </div>
            </form>
        </Modal>
    );
}
