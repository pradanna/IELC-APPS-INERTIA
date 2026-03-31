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
import InvoiceTableTab from "./Partials/InvoiceTableTab";
import AdminLayout from "@/Layouts/AdminLayout";
import { LayoutDashboard } from "lucide-react";
import Modal from "@/Components/ui/Modal";
import DataTable from "@/Components/ui/DataTable";
import Select from "react-select";
import TextInput from "@/Components/form/TextInput";
import InputLabel from "@/Components/ui/InputLabel";
import { formatRp } from "@/lib/utils";

// Modals
import PendingInvoicesModal from "./Modals/PendingInvoicesModal";
import InvoicesListModal from "./Modals/InvoicesListModal";
import InvoiceFormModal from "./Modals/InvoiceFormModal";
import AddPackageModal from "./Modals/AddPackageModal";
import PaymentModal from "./Modals/PaymentModal";

export default function Dashboard({ kpis, lists, charts, packages = [] }) {
    const [activeTab, setActiveTab] = useState('dashboard');
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
        menuPortal: (base) => ({ ...base, zIndex: 20000 }),
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
                        {/* <button
                            type="button"
                            className="inline-flex items-center gap-2 bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 rounded-lg transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            Buat Tagihan Manual
                        </button> */}
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mt-2">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`${
                                activeTab === 'dashboard'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('invoices')}
                            className={`${
                                activeTab === 'invoices'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
                        >
                            <FileText className="w-4 h-4" />
                            Data Tagihan (Invoices)
                        </button>
                    </nav>
                </div>

                <div className="mt-4">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6">
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
                    )}

                    {activeTab === 'invoices' && (
                        <InvoiceTableTab 
                            invoices={lists.all_invoices || []} 
                            canEditOrPay={canEditOrPay}
                            onEditInvoice={(row) => {
                                setSelectedInvoiceForEdit(row);
                                const items = row.items || [];
                                const ptItem = items.find((i) => i.description === "Biaya Placement Test");
                                if (ptItem) {
                                    setEditIncludePtFee(true);
                                    setEditPtFee(Number(ptItem.unit_price));
                                } else {
                                    setEditIncludePtFee(false);
                                    setEditPtFee(150000);
                                }
                                const otherItems = items.filter((i) => i.description !== "Biaya Placement Test")
                                    .map((i) => ({
                                        id: i.id,
                                        name: i.description,
                                        price: i.unit_price,
                                    }));
                                setEditAdditionalItems(otherItems);
                                setIsEditInvoiceModalOpen(true);
                            }}
                            onProcessPayment={(row) => {
                                setSelectedInvoiceForPayment(row);
                                setPaymentMethod("cash");
                                setIsPaymentModalOpen(true);
                            }}
                            onViewPdf={(row) => window.open(`/admin/finance/invoices/${row.id}/pdf`, "_blank")}
                        />
                    )}
                </div>
            </div>

            {/* Modals Modularized */}
            <PendingInvoicesModal
                show={isPendingInvoiceModalOpen}
                onClose={() => setIsPendingInvoiceModalOpen(false)}
                data={lists.pending_invoices_leads}
                columns={pendingInvoiceColumns}
            />

            <InvoicesListModal
                show={isUnpaidInvoiceModalOpen}
                onClose={() => setIsUnpaidInvoiceModalOpen(false)}
                mode={invoiceModalMode}
                data={
                    invoiceModalMode === "unpaid"
                        ? lists.unpaid_invoices
                        : invoiceModalMode === "verification"
                        ? lists.pending_verifications_list
                        : lists.revenue_this_month_list
                }
                columns={unpaidInvoiceColumns}
            />

            <InvoiceFormModal
                show={isCreateInvoiceModalOpen}
                onClose={() => setIsCreateInvoiceModalOpen(false)}
                title="Rincian Pembuatan Invoice"
                selectedLead={selectedLeadForInvoice}
                mode="create"
                includePtFee={includePtFee}
                setIncludePtFee={setIncludePtFee}
                ptFee={ptFee}
                setPtFee={setPtFee}
                additionalItems={additionalItems}
                handleRemoveItem={handleRemoveItem}
                totalAmount={totalAmount}
                onAddClick={() => {
                    setAddPackageTarget("create");
                    setIsAddPackageModalOpen(true);
                }}
                onSubmit={submitInvoice}
            />

            <InvoiceFormModal
                show={isEditInvoiceModalOpen}
                onClose={() => setIsEditInvoiceModalOpen(false)}
                title="Edit Rincian Invoice"
                selectedInvoice={selectedInvoiceForEdit}
                mode="edit"
                includePtFee={editIncludePtFee}
                setIncludePtFee={setEditIncludePtFee}
                ptFee={editPtFee}
                setPtFee={setEditPtFee}
                additionalItems={editAdditionalItems}
                handleRemoveItem={handleRemoveEditItem}
                totalAmount={editTotalAmount}
                onAddClick={() => {
                    setAddPackageTarget("edit");
                    setIsAddPackageModalOpen(true);
                }}
                onSubmit={submitEditInvoice}
            />

            <AddPackageModal
                show={isAddPackageModalOpen}
                onClose={() => setIsAddPackageModalOpen(false)}
                onSubmit={handleAddPackageSubmit}
                addPackageType={addPackageType}
                setAddPackageType={setAddPackageType}
                packageOptions={packageOptions}
                selectedPackageId={selectedPackageId}
                setSelectedPackageId={setSelectedPackageId}
                manualPackageName={manualPackageName}
                setManualPackageName={setManualPackageName}
                manualPackagePrice={manualPackagePrice}
                setManualPackagePrice={setManualPackagePrice}
                reactSelectStyles={reactSelectStyles}
            />

            <PaymentModal
                show={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                selectedInvoice={selectedInvoiceForPayment}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
            />
        </AdminLayout>
    );
}
