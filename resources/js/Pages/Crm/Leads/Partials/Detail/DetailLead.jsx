import {
    Phone,
    Mail,
    Home,
    Briefcase,
    Info,
    Calendar,
    GitBranch,
    StickyNote,
    User,
    Thermometer,
    Pencil,
} from "lucide-react";

const WhatsAppIcon = (props) => (
    <svg viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M12.04 2C6.58 2 2.13 6.45 2.13 12c0 1.78.46 3.45 1.29 4.94L2 22l5.25-1.42c1.44.78 3.06 1.21 4.79 1.21h.01c5.46 0 9.9-4.45 9.9-9.9S17.5 2 12.04 2m4.83 12.14c-.15.42-.83.78-1.13.82-.3.04-.68.06-1.04-.12-.35-.18-1.42-.66-2.7-1.64-.99-.75-1.66-1.68-1.86-1.97-.2-.29-.01-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.38-.02-.52-.08-.14-.73-1.75-.99-2.4-.26-.65-.53-.56-.72-.57-.18-.01-.39-.01-.61-.01-.22 0-.58.08-.88.41-.3.33-1.14 1.11-1.14 2.71s1.17 3.15 1.32 3.36c.15.21 2.29 3.49 5.55 4.92 3.26 1.43 3.26.95 3.84.89.58-.06 1.84-1.09 2.1-2.14.24-1.05.24-1.94.17-2.14c-.08-.2-.29-.32-.61-.52"
        />
    </svg>
);

const DetailRow = ({ icon: Icon, label, value, action }) => {
    if (!value) return null;
    return (
        <div className="flex items-center gap-3">
            <Icon className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
            <div className="text-sm flex-grow">
                <p className="text-gray-500">{label}</p>
                <p className="font-medium text-gray-800">{value}</p>
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
};

export default function DetailLead({ lead, onEditClick }) {
    // Dapatkan notes terbaru: prioritas dari follow-up terakhir yang memiliki notes, jika tidak ada fallback ke notes awal
    const displayNote = (() => {
        const followups = lead?.followups || [];
        if (followups.length > 0) {
            const sorted = [...followups].sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at),
            );
            const latestWithNote = sorted.find((f) => f.notes?.trim());
            if (latestWithNote) return latestWithNote.notes;
        }
        return lead?.notes;
    })();

    return (
        <>
            {/* Edit Action */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => onEditClick && onEditClick(lead?.id)}
                    className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                >
                    <Pencil className="-ml-0.5 h-4 w-4 text-gray-400" />
                    Edit Detail
                </button>
            </div>

            {/* Details Grid */}
            <div className="space-y-4">
                <DetailRow
                    icon={Phone}
                    label="Phone"
                    value={lead?.phone}
                    action={
                        lead?.phone && (
                            <a
                                href={`https://wa.me/${lead.phone.replace(
                                    /\D/g,
                                    "",
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-gray-400 hover:text-green-500 rounded-md hover:bg-green-100 transition-colors"
                                title="Send WhatsApp Message"
                            >
                                <WhatsAppIcon className="h-5 w-5" />
                            </a>
                        )
                    }
                />
                <DetailRow icon={Mail} label="Email" value={lead?.email} />
                <DetailRow icon={Home} label="Address" value={lead?.address} />
                <DetailRow
                    icon={Calendar}
                    label="Date of Birth"
                    value={lead?.dob}
                />
                <DetailRow
                    icon={User}
                    label="Parent Name"
                    value={lead?.parent_name}
                />
                <DetailRow
                    icon={Phone}
                    label="Parent Phone"
                    value={lead?.parent_phone}
                />
            </div>

            {/* CRM Info */}
            <div className="space-y-4 border-t border-gray-200 pt-5">
                <DetailRow
                    icon={Thermometer}
                    label="Temperature"
                    value={
                        lead?.temperature
                            ? lead.temperature.charAt(0).toUpperCase() +
                              lead.temperature.slice(1)
                            : null
                    }
                />
                <DetailRow
                    icon={GitBranch}
                    label="Branch"
                    value={lead?.branch}
                />
                <DetailRow
                    icon={Info}
                    label="Lead Source"
                    value={lead?.lead_source}
                />
                <DetailRow
                    icon={Briefcase}
                    label="Interested Package"
                    value={lead?.interest_package?.name}
                />
            </div>

            {/* Notes */}
            {displayNote && (
                <div className="space-y-2 border-t border-gray-200 pt-5">
                    <div className="flex items-center gap-3">
                        <StickyNote className="h-4 w-4 text-gray-400 shrink-0" />
                        <p className="text-sm text-gray-500">
                            {displayNote !== lead?.notes
                                ? "Latest Follow-up Notes"
                                : "Notes"}
                        </p>
                    </div>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200 whitespace-pre-wrap">
                        {displayNote}
                    </div>
                </div>
            )}
        </>
    );
}
