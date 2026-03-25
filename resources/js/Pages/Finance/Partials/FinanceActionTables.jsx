import React from "react";
import { MessageCircle, FileText, CreditCard } from "lucide-react";

export default function FinanceActionTables({ lists, onProcessPayment }) {
    const { needs_verification, overdue_invoices } = lists;

    const formatRp = (val) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(val);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table: Butuh Verifikasi Segera */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden flex flex-col">
                <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">
                        Butuh Verifikasi Segera
                    </h3>
                    {needs_verification.length > 0 && (
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            {needs_verification.length}
                        </span>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {needs_verification.length > 0 ? (
                                needs_verification.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.lead?.name || "Unknown"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {item.invoice_number}
                                            </p>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-900">
                                            {formatRp(item.total_amount)}
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    title="Lihat Invoice (PDF)"
                                                    onClick={() =>
                                                        window.open(
                                                            `/admin/finance/invoices/${item.id}/pdf`,
                                                            "_blank",
                                                        )
                                                    }
                                                    className="p-1.5 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </button>
                                                <button
                                                    title="Proses Pembayaran"
                                                    onClick={() =>
                                                        onProcessPayment &&
                                                        onProcessPayment(item)
                                                    }
                                                    className="p-1.5 text-gray-500 hover:text-emerald-600 bg-gray-50 hover:bg-emerald-50 rounded-lg transition-colors"
                                                >
                                                    <CreditCard className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="px-5 py-8 text-center text-sm text-gray-500"
                                    >
                                        Semua pembayaran sudah diverifikasi.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Table: Tagihan Jatuh Tempo */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden flex flex-col">
                <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">
                        Tagihan Jatuh Tempo (Overdue)
                    </h3>
                    {overdue_invoices.length > 0 && (
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            {overdue_invoices.length}
                        </span>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {overdue_invoices.length > 0 ? (
                                overdue_invoices.map((invoice) => (
                                    <tr
                                        key={invoice.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <p className="text-sm font-medium text-gray-900">
                                                {invoice.lead?.name ||
                                                    "Unknown"}
                                            </p>
                                            <p className="text-xs text-red-600 font-medium">
                                                Jatuh tempo:{" "}
                                                {new Date(
                                                    invoice.due_date,
                                                ).toLocaleDateString("id-ID")}
                                            </p>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-900">
                                            {formatRp(invoice.total_amount)}
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-4 text-right">
                                            <button
                                                className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                                onClick={() => {
                                                    // Bisa diarahkan ke route khusus untuk hit API WA
                                                    window.open(
                                                        `https://wa.me/${invoice.lead?.phone}?text=Halo%20${invoice.lead?.name},%20mengingatkan%20tagihan%20sebesar...`,
                                                        "_blank",
                                                    );
                                                }}
                                            >
                                                <MessageCircle className="w-3.5 h-3.5" />
                                                Kirim WA
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="px-5 py-8 text-center text-sm text-gray-500"
                                    >
                                        Tidak ada tagihan yang jatuh tempo.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
