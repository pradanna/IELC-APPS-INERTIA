import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Jadwal Follow Up</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs
                                value={filters.tab}
                                onValueChange={handleTabChange}
                                className="mb-4"
                            >
                                <TabsList>
                                    <TabsTrigger value="today">
                                        Hari Ini
                                    </TabsTrigger>
                                    <TabsTrigger value="upcoming">
                                        Akan Datang
                                    </TabsTrigger>
                                    <TabsTrigger value="overdue">
                                        Terlewat
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Lead</TableHead>
                                        <TableHead>Jadwal</TableHead>
                                        <TableHead>Metode</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>PIC</TableHead>
                                        <TableHead>
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {followUps.data.map((followUp) => (
                                        <TableRow key={followUp.id}>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {followUp.lead.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {followUp.lead.phone}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(
                                                    followUp.scheduled_at,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {followUp.method}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge>{followUp.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                {followUp.user.name}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <span className="sr-only">
                                                                Open menu
                                                            </span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            Mark as Complete
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            Reschedule
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            View Lead
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="mt-4">
                                <Pagination>
                                    <PaginationContent>
                                        {followUps.links.map((link, index) => (
                                            <PaginationItem key={index}>
                                                <PaginationLink
                                                    href={link.url}
                                                    isActive={link.active}
                                                >
                                                    <span
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    ></span>
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
