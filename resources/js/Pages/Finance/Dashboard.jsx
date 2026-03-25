import React, { useState, useEffect } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    FileText,
    Download,
    Plus,
    Trash2,
    Pencil,
    CreditCard,
    CheckSquare,
} from "lucide-react";
import FinanceKpiCards from "./Partials/FinanceKpiCards";
import FinanceActionTables from "./Partials/FinanceActionTables";
import FinanceCharts from "./Partials/FinanceCharts";
import AdminLayout from "@/Layouts/AdminLayout";
import Modal from "@/Components/ui/Modal";
import DataTable from "@/Components/ui/DataTable";
import Select from "react-select";
import TextInput from "@/Components/form/TextInput";
import InputLabel from "@/Components/ui/InputLabel";
import { formatRp } from "@/lib/utils";

export default function Dashboard({ kpis, lists, charts, packages = [] }) {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role || "";

    const canEditOrPay = ["superadmin", "finance"].includes(userRole);
    const canVerify = ["superadmin", "finance", "frontdesk"].includes(userRole);

    const [isPendingInvoiceModalOpen, setIsPendingInvoiceModalOpen] =
        useState(false);
    const [isUnpaidInvoiceModalOpen, setIsUnpaidInvoiceModalOpen] =
        useState(false);

    const [invoiceModalMode, setInvoiceModalMode] = useState("unpaid"); // 'unpaid' | 'verification' | 'paid_this_month'

    // State untuk Modal Proses Pembayaran
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] =
        useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cash");

    // State untuk Modal Buat Invoice
    const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] =
        useState(false);
    const [selectedLeadForInvoice, setSelectedLeadForInvoice] = useState(null);
    const [includePtFee, setIncludePtFee] = useState(true);
    const [ptFee, setPtFee] = useState(150000);

    // State untuk Modal Edit Invoice
    const [isEditInvoiceModalOpen, setIsEditInvoiceModalOpen] = useState(false);
    const [selectedInvoiceForEdit, setSelectedInvoiceForEdit] = useState(null);
    const [editIncludePtFee, setEditIncludePtFee] = useState(false);
    const [editPtFee, setEditPtFee] = useState(150000);
    const [editAdditionalItems, setEditAdditionalItems] = useState([]);

    // State untuk Modals & Items Tambahan
    const [additionalItems, setAdditionalItems] = useState([]);
    const [isAddPackageModalOpen, setIsAddPackageModalOpen] = useState(false);
    const [addPackageTarget, setAddPackageTarget] = useState("create"); // 'create' | 'edit'
    const [addPackageType, setAddPackageType] = useState("paket");
    const [selectedPackageId, setSelectedPackageId] = useState("");
    const [manualPackageName, setManualPackageName] = useState("");
    const [manualPackagePrice, setManualPackagePrice] = useState("");

    // Load draft items dari local storage ketika lead dipilih
    useEffect(() => {
        if (selectedLeadForInvoice) {
            const saved = localStorage.getItem(
                `draft_invoice_items_${selectedLeadForInvoice.id}`,
            );
            if (saved) {
                try {
                    setAdditionalItems(JSON.parse(saved));
                } catch (e) {
                    initDefaultPackage(selectedLeadForInvoice);
                }
            } else {
                initDefaultPackage(selectedLeadForInvoice);
            }
        }
    }, [selectedLeadForInvoice]);

    const initDefaultPackage = (lead) => {
        if (lead.interest_package) {
            setAdditionalItems([
                {
                    id: `pkg-${lead.interest_package.id}-${Date.now()}`,
                    type: "paket",
                    package_id: lead.interest_package.id,
                    name: lead.interest_package.name,
                    price: lead.interest_package.price,
                },
            ]);
        } else {
            setAdditionalItems([]);
        }
    };

    // Save draft items ke local storage setiap kali ada perubahan
    useEffect(() => {
        if (selectedLeadForInvoice) {
            localStorage.setItem(
                `draft_invoice_items_${selectedLeadForInvoice.id}`,
                JSON.stringify(additionalItems),
            );
        }
    }, [additionalItems, selectedLeadForInvoice]);

    const packageOptions = packages
        .filter((p) => p.is_active)
        .map((p) => ({
            value: p.id,
            label: `${p.name} - ${formatRp(p.price)}`,
        }));

    const handleAddPackageSubmit = (e) => {
        e.preventDefault();

        let newItem = { id: Date.now().toString() };

        if (addPackageType === "paket") {
            const pkg = packages.find((p) => p.id === selectedPackageId);
            if (!pkg) return alert("Pilih paket terlebih dahulu");
            newItem = {
                ...newItem,
                type: "paket",
                package_id: pkg.id,
                name: pkg.name,
                price: pkg.price,
            };
        } else {
            if (!manualPackageName || !manualPackagePrice)
                return alert("Lengkapi nama dan harga");
            newItem = {
                ...newItem,
                type: "manual",
                name: manualPackageName,
                price: manualPackagePrice,
            };
        }

        if (addPackageTarget === "create") {
            setAdditionalItems([...additionalItems, newItem]);
        } else {
            setEditAdditionalItems([...editAdditionalItems, newItem]);
        }
        setIsAddPackageModalOpen(false);
        // Reset form
        setSelectedPackageId("");
        setManualPackageName("");
        setManualPackagePrice("");
    };

    // Style custom untuk menyelaraskan react-select dengan form Tailwind bawaan
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

    const handleRemoveItem = (id) => {
        setAdditionalItems(additionalItems.filter((item) => item.id !== id));
    };

    const handleRemoveEditItem = (id) => {
        setEditAdditionalItems(
            editAdditionalItems.filter((item) => item.id !== id),
        );
    };

    const submitInvoice = () => {
        if (!selectedLeadForInvoice) return;

        router.post(
            route("admin.finance.invoices.store"),
            {
                lead_id: selectedLeadForInvoice.id,
                items: additionalItems,
                include_pt_fee: includePtFee,
                pt_fee: ptFee,
                total_amount: totalAmount,
            },
            {
                onSuccess: (page) => {
                    localStorage.removeItem(
                        `draft_invoice_items_${selectedLeadForInvoice.id}`,
                    );
                    setIsCreateInvoiceModalOpen(false);
                    setIsPendingInvoiceModalOpen(false); // Menutup daftar leads jika sukses

                    // Buka PDF invoice di tab baru jika ada ID invoice baru
                    const newInvoiceId = page.props.flash?.new_invoice_id;
                    if (newInvoiceId) {
                        const newWindow = window.open(
                            `/admin/finance/invoices/${newInvoiceId}/pdf`,
                            "_blank",
                        );

                        // Beri notifikasi jika pop-up diblokir oleh browser
                        if (
                            !newWindow ||
                            newWindow.closed ||
                            typeof newWindow.closed === "undefined"
                        ) {
                            alert(
                                "Pop-up diblokir oleh browser Anda! Mohon izinkan pop-up (di pojok kanan atas browser) untuk melihat PDF Invoice otomatis.",
                            );
                        }
                    }
                },
            },
        );
    };

    const submitEditInvoice = () => {
        if (!selectedInvoiceForEdit) return;

        router.put(
            route("admin.finance.invoices.update", selectedInvoiceForEdit.id),
            {
                items: editAdditionalItems,
                include_pt_fee: editIncludePtFee,
                pt_fee: editPtFee,
                total_amount: editTotalAmount,
            },
            {
                onSuccess: () => {
                    setIsEditInvoiceModalOpen(false);
                },
                preserveScroll: true,
            },
        );
    };

    const handleCardClick = (id) => {
        if (id === "pending_invoices") {
            setIsPendingInvoiceModalOpen(true);
        } else if (id === "outstanding_amount") {
            setInvoiceModalMode("unpaid");
            setIsUnpaidInvoiceModalOpen(true);
        } else if (id === "pending_verifications") {
            setInvoiceModalMode("verification");
            setIsUnpaidInvoiceModalOpen(true);
        } else if (id === "revenue_this_month") {
            setInvoiceModalMode("paid_this_month");
            setIsUnpaidInvoiceModalOpen(true);
        }
    };

    const pendingInvoiceColumns = [
        {
            header: "Nama Lead",
            accessor: "name",
            className: "font-medium text-gray-900",
        },
        { header: "No. HP", accessor: "phone" },
        {
            header: "Paket Diminati",
            accessor: "interest_package",
            render: (row) => row.interest_package?.name || "-",
        },
        {
            header: "Aksi",
            accessor: "actions",
            className: "text-right",
            render: (row) => (
                <button
                    onClick={() => {
                        setSelectedLeadForInvoice(row);
                        setIncludePtFee(true);
                        setPtFee(150000);
                        setIsCreateInvoiceModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary-50 text-primary-700 hover:bg-primary-100 px-3 py-1.5 rounded-md transition-colors"
                >
                    <FileText size={14} /> Buat Invoice
                </button>
            ),
        },
    ];

    const unpaidInvoiceColumns = [
        {
            header: "No. Invoice",
            accessor: "invoice_number",
            className: "font-medium text-gray-900",
        },
        {
            header: "Nama Lead",
            accessor: "lead",
            render: (row) => row.lead?.name || "Unknown",
        },
        {
            header: "Total Tagihan",
            accessor: "total_amount",
            render: (row) => formatRp(row.total_amount),
        },
        {
            header:
                invoiceModalMode === "paid_this_month"
                    ? "Tanggal Lunas"
                    : "Jatuh Tempo",
            accessor:
                invoiceModalMode === "paid_this_month" ? "paid_at" : "due_date",
            render: (row) => {
                const dateVal =
                    invoiceModalMode === "paid_this_month"
                        ? row.paid_at
                        : row.due_date;
                return dateVal
                    ? new Date(dateVal).toLocaleDateString("id-ID")
                    : "-";
            },
        },
        {
            header: "Status",
            accessor: "status",
            render: (row) => {
                if (row.status === "unpaid")
                    return (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium">
                            Belum Lunas
                        </span>
                    );
                if (row.status === "partial")
                    return (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-medium">
                            Sebagian
                        </span>
                    );
                if (row.status === "waiting_verification")
                    return (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                            Menunggu Verifikasi
                        </span>
                    );
                if (row.status === "paid")
                    return (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                            Lunas
                        </span>
                    );
                return (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                        {row.status}
                    </span>
                );
            },
        },
        {
            header: "Aksi",
            accessor: "actions",
            className: "text-right",
            render: (row) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() =>
                            window.open(
                                `/admin/finance/invoices/${row.id}/pdf`,
                                "_blank",
                            )
                        }
                        className="inline-flex items-center justify-center p-1.5 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                        title={
                            row.status === "paid"
                                ? "Download Bukti Pembayaran"
                                : "Download PDF"
                        }
                    >
                        <FileText size={16} />
                    </button>
                    {canEditOrPay && row.status !== "paid" && (
                        <button
                            onClick={() => {
                                setSelectedInvoiceForEdit(row);
                                const items = row.items || [];
                                const ptItem = items.find(
                                    (i) =>
                                        i.description ===
                                        "Biaya Placement Test",
                                );
                                if (ptItem) {
                                    setEditIncludePtFee(true);
                                    setEditPtFee(Number(ptItem.unit_price));
                                } else {
                                    setEditIncludePtFee(false);
                                    setEditPtFee(150000);
                                }
                                const otherItems = items
                                    .filter(
                                        (i) =>
                                            i.description !==
                                            "Biaya Placement Test",
                                    )
                                    .map((i) => ({
                                        id: i.id,
                                        name: i.description,
                                        price: i.unit_price,
                                    }));
                                setEditAdditionalItems(otherItems);
                                setIsEditInvoiceModalOpen(true);
                            }}
                            className="inline-flex items-center justify-center p-1.5 text-gray-500 hover:text-amber-600 bg-gray-50 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Invoice"
                        >
                            <Pencil size={16} />
                        </button>
                    )}
                    {canEditOrPay && row.status !== "paid" && (
                        <button
                            onClick={() => {
                                setSelectedInvoiceForPayment(row);
                                setPaymentMethod("cash");
                                setIsPaymentModalOpen(true);
                            }}
                            className="inline-flex items-center justify-center p-1.5 text-gray-500 hover:text-emerald-600 bg-gray-50 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Proses Pembayaran"
                        >
                            <CreditCard size={16} />
                        </button>
                    )}
                    {invoiceModalMode === "unpaid" && canVerify && (
                        <button
                            onClick={() => {
                                if (
                                    window.confirm(
                                        "Apakah Anda yakin ingin mengajukan verifikasi? Status akan diubah menjadi Menunggu Verifikasi.",
                                    )
                                ) {
                                    router.put(
                                        route(
                                            "admin.finance.invoices.update-status",
                                            row.id,
                                        ),
                                        {
                                            status: "waiting_verification",
                                        },
                                        {
                                            preserveScroll: true,
                                            // Toast akan muncul otomatis, tidak perlu menutup modal ini agar admin bisa memproses data lain
                                        },
                                    );
                                }
                            }}
                            className="inline-flex items-center justify-center p-1.5 text-gray-500 hover:text-purple-600 bg-gray-50 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Ajukan Verifikasi"
                        >
                            <CheckSquare size={16} />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    // Kalkulasi Total Tagihan
    const additionalTotal = additionalItems.reduce(
        (sum, item) => sum + Number(item.price || 0),
        0,
    );
    const totalAmount = (includePtFee ? Number(ptFee) : 0) + additionalTotal;

    const editAdditionalTotal = editAdditionalItems.reduce(
        (sum, item) => sum + Number(item.price || 0),
        0,
    );
    const editTotalAmount =
        (editIncludePtFee ? Number(editPtFee) : 0) + editAdditionalTotal;

    return (
        <AdminLayout>
            <div className="space-y-6">
                <Head title="Finance Dashboard" />

                {/* Header & Quick Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 leading-tight">
                            Finance Overview
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Pantau pendapatan, verifikasi pembayaran, dan
                            tagihan jatuh tempo.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Tombol Aksi Cepat */}
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <Download className="w-4 h-4 text-gray-500" />
                            Export Laporan
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 rounded-lg transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            Buat Tagihan Manual
                        </button>
                    </div>
                </div>

                {/* Lapis Atas: KPI Highlights */}
                <FinanceKpiCards kpis={kpis} onCardClick={handleCardClick} />

                {/* Lapis Tengah: To-Do Lists */}
                <FinanceActionTables
                    lists={lists}
                    onProcessPayment={(invoice) => {
                        setSelectedInvoiceForPayment(invoice);
                        setPaymentMethod("cash");
                        setIsPaymentModalOpen(true);
                    }}
                />

                {/* Lapis Bawah: Analytics */}
                <FinanceCharts charts={charts} />
            </div>

            {/* Modal Leads Menunggu Tagihan */}
            <Modal
                show={isPendingInvoiceModalOpen}
                onClose={() => setIsPendingInvoiceModalOpen(false)}
                title="Daftar Lead Menunggu Tagihan"
                maxWidth="4xl"
            >
                <div className="mb-4">
                    <DataTable
                        columns={pendingInvoiceColumns}
                        data={lists.pending_invoices_leads || []}
                    />
                </div>
                <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
                    <button
                        onClick={() => setIsPendingInvoiceModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </Modal>

            {/* Modal Tagihan Belum Lunas */}
            <Modal
                show={isUnpaidInvoiceModalOpen}
                onClose={() => setIsUnpaidInvoiceModalOpen(false)}
                title={
                    invoiceModalMode === "unpaid"
                        ? "Daftar Tagihan Belum Lunas"
                        : invoiceModalMode === "verification"
                          ? "Daftar Menunggu Verifikasi"
                          : "Daftar Pendapatan Bulan Ini"
                }
                maxWidth="7xl"
            >
                <div className="mb-4">
                    <DataTable
                        columns={unpaidInvoiceColumns}
                        data={
                            invoiceModalMode === "unpaid"
                                ? lists.unpaid_invoices || []
                                : invoiceModalMode === "verification"
                                  ? lists.pending_verifications_list || []
                                  : lists.revenue_this_month_list || []
                        }
                    />
                </div>
                <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
                    <button
                        onClick={() => setIsUnpaidInvoiceModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </Modal>

            {/* Modal Buat Invoice */}
            <Modal
                show={isCreateInvoiceModalOpen}
                onClose={() => setIsCreateInvoiceModalOpen(false)}
                title="Rincian Pembuatan Invoice"
                maxWidth="md"
            >
                {selectedLeadForInvoice && (
                    <div className="space-y-5">
                        {/* Info Lead & Paket */}
                        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                            <p className="text-xs text-blue-600 mb-1">
                                Nama Siswa / Lead
                            </p>
                            <p className="text-sm font-semibold text-blue-900">
                                {selectedLeadForInvoice.name}
                            </p>

                            <p className="text-xs text-blue-600 mt-3 mb-1">
                                Paket yang Diminati
                            </p>
                            <p className="text-sm font-semibold text-blue-900">
                                {selectedLeadForInvoice.interest_package
                                    ?.name || "Tidak ada paket yang dipilih"}
                            </p>
                        </div>

                        {/* Rincian Tagihan */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                <h4 className="text-sm font-semibold text-gray-900">
                                    Komponen Tagihan
                                </h4>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAddPackageTarget("create");
                                        setIsAddPackageModalOpen(true);
                                    }}
                                    className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-2 py-1 rounded transition-colors"
                                >
                                    <Plus size={14} /> Tambah
                                </button>
                            </div>

                            <div className="flex items-center justify-between text-sm mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={includePtFee}
                                        onChange={(e) =>
                                            setIncludePtFee(e.target.checked)
                                        }
                                        className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                                    />
                                    <span className="text-gray-600">
                                        Biaya Placement Test
                                    </span>
                                </label>
                                {includePtFee ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">
                                            Rp
                                        </span>
                                        <input
                                            type="number"
                                            value={ptFee}
                                            onChange={(e) =>
                                                setPtFee(Number(e.target.value))
                                            }
                                            className="w-28 text-right text-sm border-gray-300 rounded-md py-1 px-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                ) : (
                                    <span className="text-gray-400">Rp 0</span>
                                )}
                            </div>

                            {/* Invoice Items */}
                            {additionalItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between text-sm mt-2 group"
                                >
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveItem(item.id)
                                            }
                                            className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Hapus komponen"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <span>{item.name}</span>
                                    </div>
                                    <span className="font-medium text-gray-900">
                                        {formatRp(item.price)}
                                    </span>
                                </div>
                            ))}

                            <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-2">
                                <span className="font-bold text-gray-900">
                                    Total Invoice
                                </span>
                                <span className="font-bold text-primary-700 text-lg">
                                    {formatRp(totalAmount)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                onClick={() =>
                                    setIsCreateInvoiceModalOpen(false)
                                }
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={submitInvoice}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
                            >
                                Simpan & Terbitkan
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal Edit Invoice */}
            <Modal
                show={isEditInvoiceModalOpen}
                onClose={() => setIsEditInvoiceModalOpen(false)}
                title="Edit Rincian Invoice"
                maxWidth="md"
            >
                {selectedInvoiceForEdit && (
                    <div className="space-y-5">
                        <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100">
                            <p className="text-xs text-amber-600 mb-1">
                                No. Invoice
                            </p>
                            <p className="text-sm font-semibold text-amber-900">
                                {selectedInvoiceForEdit.invoice_number}
                            </p>
                            <p className="text-xs text-amber-600 mt-3 mb-1">
                                Nama Siswa / Lead
                            </p>
                            <p className="text-sm font-semibold text-amber-900">
                                {selectedInvoiceForEdit.lead?.name || "-"}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                <h4 className="text-sm font-semibold text-gray-900">
                                    Komponen Tagihan
                                </h4>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAddPackageTarget("edit");
                                        setIsAddPackageModalOpen(true);
                                    }}
                                    className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-2 py-1 rounded transition-colors"
                                >
                                    <Plus size={14} /> Tambah
                                </button>
                            </div>

                            <div className="flex items-center justify-between text-sm mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editIncludePtFee}
                                        onChange={(e) =>
                                            setEditIncludePtFee(
                                                e.target.checked,
                                            )
                                        }
                                        className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                                    />
                                    <span className="text-gray-600">
                                        Biaya Placement Test
                                    </span>
                                </label>
                                {editIncludePtFee ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">
                                            Rp
                                        </span>
                                        <input
                                            type="number"
                                            value={editPtFee}
                                            onChange={(e) =>
                                                setEditPtFee(
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="w-28 text-right text-sm border-gray-300 rounded-md py-1 px-2 focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                ) : (
                                    <span className="text-gray-400">Rp 0</span>
                                )}
                            </div>

                            {editAdditionalItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between text-sm mt-2 group"
                                >
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveEditItem(item.id)
                                            }
                                            className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Hapus komponen"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <span>{item.name}</span>
                                    </div>
                                    <span className="font-medium text-gray-900">
                                        {formatRp(item.price)}
                                    </span>
                                </div>
                            ))}

                            <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-2">
                                <span className="font-bold text-gray-900">
                                    Total Invoice
                                </span>
                                <span className="font-bold text-primary-700 text-lg">
                                    {formatRp(editTotalAmount)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setIsEditInvoiceModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={submitEditInvoice}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal Tambah Komponen */}
            <Modal
                show={isAddPackageModalOpen}
                onClose={() => setIsAddPackageModalOpen(false)}
                title="Tambah Komponen Tagihan"
                maxWidth="sm"
            >
                <form onSubmit={handleAddPackageSubmit} className="space-y-4">
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="addPackageType"
                                value="paket"
                                checked={addPackageType === "paket"}
                                onChange={(e) =>
                                    setAddPackageType(e.target.value)
                                }
                                className="text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Pilih Paket
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="addPackageType"
                                value="manual"
                                checked={addPackageType === "manual"}
                                onChange={(e) =>
                                    setAddPackageType(e.target.value)
                                }
                                className="text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Input Manual
                            </span>
                        </label>
                    </div>

                    {addPackageType === "paket" ? (
                        <div>
                            <InputLabel value="Pilih Paket Tambahan" />
                            <div className="mt-1">
                                <Select
                                    value={
                                        packageOptions.find(
                                            (opt) =>
                                                opt.value === selectedPackageId,
                                        ) || null
                                    }
                                    onChange={(opt) =>
                                        setSelectedPackageId(
                                            opt ? opt.value : "",
                                        )
                                    }
                                    options={packageOptions}
                                    placeholder="-- Pilih Paket --"
                                    styles={reactSelectStyles}
                                    menuPosition="fixed"
                                    isClearable
                                    className="w-full"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div>
                                <InputLabel value="Nama Komponen" />
                                <div className="mt-1">
                                    <TextInput
                                        type="text"
                                        value={manualPackageName}
                                        onChange={(e) =>
                                            setManualPackageName(e.target.value)
                                        }
                                        className="w-full"
                                        placeholder="Contoh: Modul Tambahan"
                                        required={addPackageType === "manual"}
                                    />
                                </div>
                            </div>
                            <div>
                                <InputLabel value="Harga (Rp)" />
                                <div className="mt-1">
                                    <TextInput
                                        type="number"
                                        value={manualPackagePrice}
                                        onChange={(e) =>
                                            setManualPackagePrice(
                                                e.target.value,
                                            )
                                        }
                                        className="w-full"
                                        placeholder="0"
                                        required={addPackageType === "manual"}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsAddPackageModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
                        >
                            Tambahkan
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal Proses Pembayaran */}
            <Modal
                show={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                title="Proses Pembayaran Tagihan"
                maxWidth="sm"
            >
                {selectedInvoiceForPayment && (
                    <div className="space-y-4">
                        <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
                            <p className="text-xs text-purple-600 mb-1">
                                No. Invoice
                            </p>
                            <p className="text-sm font-semibold text-purple-900">
                                {selectedInvoiceForPayment.invoice_number}
                            </p>
                            <p className="text-xs text-purple-600 mt-3 mb-1">
                                Total Tagihan
                            </p>
                            <p className="text-sm font-semibold text-purple-900">
                                {formatRp(
                                    selectedInvoiceForPayment.total_amount,
                                )}
                            </p>
                        </div>

                        <div className="text-sm text-gray-600 text-center py-2">
                            Apakah Anda ingin menerima pembayaran ini sebagai
                            lunas atau menolaknya kembali menjadi belum lunas?
                        </div>

                        <div>
                            <InputLabel value="Metode Pembayaran" />
                            <select
                                value={paymentMethod}
                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }
                                className="mt-1 block w-full rounded-lg border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            >
                                <option value="cash">Cash</option>
                                <option value="transfer BCA">
                                    Transfer BCA
                                </option>
                                <option value="transfer BNI">
                                    Transfer BNI
                                </option>
                            </select>
                        </div>

                        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setIsPaymentModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    router.put(
                                        route(
                                            "admin.finance.invoices.update-status",
                                            selectedInvoiceForPayment.id,
                                        ),
                                        {
                                            status: "unpaid",
                                        },
                                        {
                                            onSuccess: () =>
                                                setIsPaymentModalOpen(false),
                                            preserveScroll: true,
                                        },
                                    );
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                            >
                                Tolak
                            </button>
                            <button
                                onClick={() => {
                                    router.put(
                                        route(
                                            "admin.finance.invoices.update-status",
                                            selectedInvoiceForPayment.id,
                                        ),
                                        {
                                            status: "paid",
                                            payment_method: paymentMethod,
                                        },
                                        {
                                            onSuccess: () =>
                                                setIsPaymentModalOpen(false),
                                            preserveScroll: true,
                                        },
                                    );
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                            >
                                Terima (Lunas)
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}
