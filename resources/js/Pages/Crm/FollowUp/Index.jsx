import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import Card from "@/Components/ui/Card";
import Badge from "@/Components/ui/Badge";
import Button from "@/Components/ui/Button";
import { MoreHorizontal } from "lucide-react";


export default function Index({ auth, followUps, filters }) {
    const handleTabChange = (value) => {
        // router.get(route('crm.follow-up.index', { tab: value }), {}, { preserveState: true, replace: true });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${day} ${month} ${year}, ${hours}:${minutes}`;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Follow Up Schedule
                </h2>
            }
        >
            <Head title="Follow Up Schedule" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card className="p-6">
                        <div className="mb-4">
                            <h3 className="text-base font-bold text-gray-900">Jadwal Follow Up</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs">
                                    <tr>
                                        <th className="px-4 py-3">Lead</th>
                                        <th className="px-4 py-3">Jadwal</th>
                                        <th className="px-4 py-3">Metode</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">PIC</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {followUps?.data?.map((followUp) => (
                                        <tr key={followUp.id}>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900">{followUp.lead?.name}</div>
                                                <div className="text-xs text-gray-500">{followUp.lead?.phone}</div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{formatDate(followUp.scheduled_at)}</td>
                                            <td className="px-4 py-3"><Badge>{followUp.method}</Badge></td>
                                            <td className="px-4 py-3"><Badge>{followUp.status}</Badge></td>
                                            <td className="px-4 py-3 text-gray-600">{followUp.user?.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
