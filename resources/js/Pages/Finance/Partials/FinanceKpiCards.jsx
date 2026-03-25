import React from "react";
import { Receipt, ShieldAlert, TrendingUp, AlertCircle } from "lucide-react";

export default function FinanceKpiCards({ kpis, onCardClick }) {
    // Format Rupiah
    const formatRp = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    const cards = [
        {
            id: "pending_invoices",
            label: "Menunggu Dibuatkan Tagihan",
            value: kpis.pending_invoices,
            icon: Receipt,
            colors: "text-amber-600 bg-amber-50",
            clickable: true,
        },
        {
            id: "pending_verifications",
            label: "Menunggu Verifikasi",
            value: kpis.pending_verifications,
            icon: ShieldAlert,
            colors: "text-blue-600 bg-blue-50",
            clickable: true,
        },
        {
            id: "revenue_this_month",
            label: "Total Pendapatan (Bulan Ini)",
            value: formatRp(kpis.revenue_this_month),
            icon: TrendingUp,
            colors: "text-emerald-600 bg-emerald-50",
            clickable: true,
        },
        {
            id: "outstanding_amount",
            label: "Tagihan Belum Lunas",
            value: formatRp(kpis.outstanding_amount),
            icon: AlertCircle,
            colors: "text-red-600 bg-red-50",
            clickable: true,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, idx) => {
                const Icon = card.icon;
                return (
                    <div
                        key={idx}
                        onClick={() =>
                            card.clickable &&
                            onCardClick &&
                            onCardClick(card.id)
                        }
                        className={`bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-5 flex items-center gap-4 ${
                            card.clickable
                                ? "cursor-pointer hover:bg-gray-50 transition-colors"
                                : ""
                        }`}
                    >
                        <div className={`p-3 rounded-xl ${card.colors}`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">
                                {card.label}
                            </p>
                            <p className="text-xl font-bold text-gray-900">
                                {card.value}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
