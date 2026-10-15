import React from "react";
import { LinkIcon, MessageCircle, Eye, GraduationCap } from "lucide-react";
import LeadStatusBadge from "@/Components/ui/StatusBadge";

const StatusBadge = ({ status }) => {
    const configs = {
        pending: { label: "🟡 Pending", color: "bg-yellow-50 text-yellow-800 ring-yellow-600/20" },
        in_progress: { label: "🔵 In Progress", color: "bg-blue-50 text-blue-800 ring-blue-600/20" },
        completed: { label: "🟢 Completed", color: "bg-green-50 text-green-800 ring-green-600/20" },
    };
    const config = configs[status] || null;
    if (!config) return null;

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${config.color}`}>
            {config.label}
        </span>
    );
};

export default function PlacementTable({ tests, onCopyLink, onSendWa, onOpenEnroll }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4">
                <h3 className="text-sm font-semibold text-gray-900">Daftar Sesi Ujian</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-white">
                        <tr>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lead & WA</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paket Ujian</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Pengerjaan</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Ujian</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skor & Level</th>
                            <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {tests.map((test) => (
                            <tr key={test.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-3 whitespace-nowrap">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-semibold text-primary-600 truncate max-w-[150px]">{test.lead_name}</p>
                                        <p className="text-xs text-gray-500">{test.wa}</p>
                                        {test.lead_status && (
                                            <LeadStatusBadge
                                                backgroundColor={test.lead_status.bg_color}
                                                color={test.lead_status.text_color}
                                                className="px-1.5 py-0 scale-90"
                                            >
                                                {test.lead_status.name.toUpperCase()}
                                            </LeadStatusBadge>
                                        )}
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-sm text-gray-700">{test.package_name}</td>
                                <td className="px-5 py-3 text-sm text-gray-700">{test.scheduled_at}</td>
                                <td className="px-5 py-3 whitespace-nowrap">
                                    <StatusBadge status={test.status} />
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap">
                                    {test.status === "completed" ? (
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{test.score}</p>
                                            <p className="text-xs text-gray-500">{test.recommended_level}</p>
                                        </div>
                                    ) : <span className="text-gray-400 text-sm">-</span>}
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap text-right">
                                    <div className="flex justify-end gap-2">
                                        <ActionButton icon={LinkIcon} onClick={() => onCopyLink(test)} title="Salin Link" hover="hover:text-blue-600 hover:bg-blue-100" />
                                        <ActionButton icon={MessageCircle} onClick={() => onSendWa(test)} title="Kirim WA" hover="hover:text-green-600 hover:bg-green-100" />
                                        <ActionButton icon={Eye} onClick={() => {
                                            if (test.status === "completed") {
                                                window.open(`/placement-test/${test.package_slug}/${test.token}/review`, "_blank");
                                            } else {
                                                alert("Hasil ujian belum tersedia.");
                                            }
                                        }} title="Review" hover="hover:text-indigo-600 hover:bg-indigo-100" />
                                        {test.status === "completed" && (
                                            <ActionButton icon={GraduationCap} onClick={() => onOpenEnroll(test)} title="Enroll" hover="hover:text-emerald-600 hover:bg-emerald-100" />
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const ActionButton = ({ icon: Icon, onClick, title, hover }) => (
    <button onClick={onClick} className={`p-1.5 text-gray-500 bg-gray-50 rounded-md transition-colors ${hover}`} title={title}>
        <Icon size={16} />
    </button>
);
