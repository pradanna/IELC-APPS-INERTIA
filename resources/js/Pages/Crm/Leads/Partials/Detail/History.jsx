import { useMemo } from "react";
import {
    History as HistoryIcon,
    Clock,
    ArrowRight,
    Phone,
    MessageCircle,
    Mail,
    PlusCircle,
    Pencil,
} from "lucide-react";

const EventIcon = ({ event }) => {
    const baseClass = "h-4 w-4";
    let icon;

    switch (event.type) {
        case "creation":
            icon = <PlusCircle className={`${baseClass} text-green-600`} />;
            break;
        case "status_change":
            icon = <ArrowRight className={`${baseClass} text-blue-600`} />;
            break;
        case "update":
            icon = <Pencil className={`${baseClass} text-yellow-600`} />;
            break;
        case "followup":
            switch (event.method) {
                case "whatsapp":
                    icon = (
                        <MessageCircle
                            className={`${baseClass} text-teal-600`}
                        />
                    );
                    break;
                case "call":
                    icon = <Phone className={`${baseClass} text-sky-600`} />;
                    break;
                case "email":
                    icon = <Mail className={`${baseClass} text-gray-600`} />;
                    break;
                default:
                    icon = (
                        <HistoryIcon className={`${baseClass} text-gray-600`} />
                    );
            }
            break;
        default:
            icon = <Clock className={`${baseClass} text-gray-600`} />;
    }

    const bgColors = {
        creation: "bg-green-50",
        status_change: "bg-blue-50",
        update: "bg-yellow-50",
        followup: "bg-teal-50",
    };

    return (
        <span
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                bgColors[event.type] || "bg-gray-50"
            } ring-8 ring-white`}
        >
            {icon}
        </span>
    );
};

const EventContent = ({ event, leadStatuses }) => {
    if (event.type === "followup") {
        return (
            <>
                <p className="text-sm text-gray-500">
                    Follow-up logged by{" "}
                    <span className="font-medium text-gray-700">
                        {event.user?.name || "System"}
                    </span>{" "}
                    via{" "}
                    <span className="font-medium capitalize text-gray-700">
                        {event.method}
                    </span>
                    .
                </p>
                {event.notes && (
                    <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200/80 whitespace-pre-wrap">
                        {event.notes}
                    </div>
                )}
                {event.scheduled_at && (
                    <p className="mt-2 text-xs text-gray-400">
                        Next schedule set for:{" "}
                        {new Date(event.scheduled_at).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                        })}
                    </p>
                )}
            </>
        );
    }

    // For activity logs (creation, status_change, update)
    const causerName =
        typeof event.causer === "object" ? event.causer?.name : event.causer;
    return (
        <>
            <p className="text-sm text-gray-500">
                {event.description}{" "}
                {causerName && (
                    <>
                        by{" "}
                        <span className="font-medium text-gray-700">
                            {causerName}
                        </span>
                    </>
                )}
            </p>
            {(event.type === "update" || event.type === "status_change") &&
                event.properties?.attributes &&
                event.properties?.old && (
                    <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-200/80 overflow-x-auto">
                        <ul className="space-y-1.5">
                            {Object.keys(event.properties.attributes).map(
                                (key) => {
                                    if (
                                        key === "updated_at" ||
                                        key === "created_at"
                                    )
                                        return null;

                                    let oldValue =
                                        event.properties.old[key] ?? "none";
                                    let newValue =
                                        event.properties.attributes[key] ??
                                        "none";

                                    // Translasi lead_status_id menjadi Nama Status
                                    if (
                                        key === "lead_status_id" &&
                                        leadStatuses?.length > 0
                                    ) {
                                        const oldStat = leadStatuses.find(
                                            (s) => String(s.id) === String(oldValue),
                                        );
                                        const newStat = leadStatuses.find(
                                            (s) => String(s.id) === String(newValue),
                                        );
                                        if (oldStat) oldValue = oldStat.name;
                                        if (newStat) newValue = newStat.name;
                                    }

                                    // Percantik teks key
                                    const displayKey =
                                        key === "lead_status_id"
                                            ? "status"
                                            : key.replace(/_/g, " ");

                                    return (
                                        <li
                                            key={key}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="font-medium capitalize text-gray-600 min-w-[100px]">
                                                {displayKey}
                                            </span>
                                            <span className="line-through text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                                {String(oldValue)}
                                            </span>
                                            <span className="text-gray-400">
                                                →
                                            </span>
                                            <span className="text-gray-700 font-medium bg-white px-1.5 py-0.5 rounded border border-gray-100">
                                                {String(newValue)}
                                            </span>
                                        </li>
                                    );
                                },
                            )}
                        </ul>
                    </div>
                )}
        </>
    );
};

export default function History({ lead, leadStatuses = [] }) {
    const combinedHistory = useMemo(() => {
        if (!lead) return [];

        // Ambil data (tahan banting jika object terbungkus dalam `data`)
        const activitiesData = lead.activities || lead.data?.activities || [];
        const activityEvents = activitiesData.map((activity) => {
            let type = "update";

            if (activity.event === "created") {
                type = "creation";
            } else if (activity.event === "updated") {
                const changedAttributes = activity.properties?.attributes || {};
                if ("lead_status_id" in changedAttributes) {
                    type = "status_change";
                }
            }

            return {
                id: `activity-${activity.id}`,
                type: type,
                description:
                    activity.description || `Lead has been ${activity.event}`,
                causer: activity.causer || null, // Dikirim mentah, dibaca di EventContent
                created_at: activity.created_at,
                properties: activity.properties,
            };
        });

        // 3. Follow-up events (from lead_followups table)
        const followupsData = lead.followups || lead.data?.followups || [];
        const followupEvents = followupsData.map((f) => ({
            id: `followup-${f.id}`,
            type: "followup",
            created_at: f.created_at,
            ...f,
        }));

        const allEvents = [...activityEvents, ...followupEvents];

        // Sort all events by date, newest first
        return allEvents.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
    }, [lead]);

    if (combinedHistory.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-14 w-14 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                    <HistoryIcon className="h-7 w-7" />
                </div>
                <h4 className="text-base font-semibold text-gray-900">
                    No Lead History
                </h4>
                <p className="mt-2 text-sm text-gray-500 max-w-xs">
                    Perubahan status, catatan, dan aktivitas penting lainnya
                    terkait lead ini akan ditampilkan di sini.
                </p>
            </div>
        );
    }

    return (
        <div className="flow-root">
            <ul role="list" className="-mb-8">
                {combinedHistory.map((event, eventIdx) => (
                    <li key={event.id}>
                        <div className="relative pb-8">
                            {eventIdx !== combinedHistory.length - 1 ? (
                                <span
                                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                                    aria-hidden="true"
                                />
                            ) : null}
                            <div className="relative flex space-x-3">
                                <EventIcon event={event} />
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div>
                                        <EventContent
                                            event={event}
                                            leadStatuses={leadStatuses}
                                        />
                                    </div>
                                    <div className="flex flex-col items-end whitespace-nowrap text-right text-sm text-gray-500">
                                        <time dateTime={event.created_at}>
                                            {new Date(
                                                event.created_at,
                                            ).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </time>
                                        <span className="text-xs text-gray-400">
                                            {new Date(
                                                event.created_at,
                                            ).toLocaleTimeString("id-ID", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
