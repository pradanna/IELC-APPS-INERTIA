import React from "react";
import DataTable from "@/Components/ui/DataTable";
import Panel from "@/Components/ui/Panel";

export default function LeadSourcesTable({ leadSources }) {
    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Name", accessor: "name" },
        { header: "Created At", accessor: "created_at" },
        {
            header: "",
            accessor: "actions",
            render: (row) => (
                <div className="text-right">
                    <a
                        href="#"
                        className="text-primary-600 hover:text-primary-900"
                    >
                        Edit
                    </a>
                </div>
            ),
        },
    ];

    return (
        <Panel
            title="Lead Sources"
            description="A list of all the sources for new leads."
            action={
                <button
                    type="button"
                    className="block rounded-md bg-primary-600 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                    Add Source
                </button>
            }
        >
            <DataTable data={leadSources} columns={columns} />
        </Panel>
    );
}
