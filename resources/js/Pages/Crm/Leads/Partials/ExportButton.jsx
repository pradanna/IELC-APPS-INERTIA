import React from "react";
import { Download } from "lucide-react";

export default function ExportButton({ filters = {} }) {
    return (
        <a 
            href={route("admin.crm.leads.export", filters)} 
            className="inline-flex items-center gap-x-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
            <Download className="-ml-0.5 h-4 w-4 text-gray-400" />
            Export Data
        </a>
    );
}
