import { History as HistoryIcon, Clock, ArrowRight } from "lucide-react";

export default function History({ lead }) {
    const histories = lead?.histories || [];

    if (histories.length === 0) {
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
                {histories.map((event, eventIdx) => (
                    <li key={event.id || eventIdx}>
                        <div className="relative pb-8">
                            {eventIdx !== histories.length - 1 ? (
                                <span
                                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                                    aria-hidden="true"
                                />
                            ) : null}
                            <div className="relative flex space-x-3">
                                <div>
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 ring-8 ring-white">
                                        <Clock className="h-4 w-4 text-blue-600" />
                                    </span>
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {event.description ||
                                                "Aktivitas dicatat"}
                                        </p>
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
