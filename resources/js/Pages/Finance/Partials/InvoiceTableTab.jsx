import React, { useState } from 'react';
import DataTable from '@/Components/ui/DataTable';
import SearchInput from '@/Components/ui/SearchInput';
import TableIconButton from '@/Components/ui/TableIconButton';
import ReactSelect from 'react-select';
import { formatRp } from '@/lib/utils';
import { FileText, Pencil, CreditCard, Eye, Download } from 'lucide-react';

export default function InvoiceTableTab({ 
    invoices, 
    canEditOrPay, 
    onEditInvoice, 
    onProcessPayment,
    onViewPdf
}) {
    // Default dates: 7 days ago until today
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Format to YYYY-MM-DD for input[type="date"]
    const formatDate = (date) => date.toISOString().split('T')[0];

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [startDate, setStartDate] = useState(formatDate(sevenDaysAgo));
    const [endDate, setEndDate] = useState(formatDate(new Date()));

    // Filter Options
    const statusOptions = [
        { value: 'all', label: 'Semua Status' },
        { value: 'unpaid', label: 'Belum Lunas' },
        { value: 'partial', label: 'Sebagian' },
        { value: 'waiting_verification', label: 'Menunggu Verifikasi' },
        { value: 'paid', label: 'Lunas' },
        { value: 'canceled', label: 'Dibatalkan' }
    ];

    // Filter Logic
    const filteredData = (invoices || []).filter(item => {
        // Search Term Filter
        const matchSearch = item.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.lead?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Status Filter
        const matchStatus = !selectedStatus || selectedStatus.value === 'all' || item.status === selectedStatus.value;
        
        // Date Range Filter
        const invoiceDate = item.created_at ? new Date(item.created_at) : null;
        let matchDate = true;
        
        if (invoiceDate) {
            // Set time to midnight for accurate day comparison
            const checkDate = new Date(invoiceDate);
            checkDate.setHours(0, 0, 0, 0);
            
            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                if (checkDate < start) matchDate = false;
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                if (checkDate > end) matchDate = false;
            }
        }
        
        return matchSearch && matchStatus && matchDate;
    });

    const columns = [
        {
            header: "No. Invoice",
            accessor: "invoice_number",
            className: "font-medium text-gray-900",
        },
        {
            header: "Nama Lead / Siswa",
            accessor: "lead",
            render: (row) => (
                <div>
                    <span className="block font-medium text-gray-900">{row.lead?.name || "Unknown"}</span>
                    <span className="block text-xs text-gray-500 mt-0.5">{row.lead?.phone || "-"}</span>
                </div>
            )
        },
        {
            header: "Total Tagihan",
            accessor: "total_amount",
            render: (row) => formatRp(row.total_amount),
        },
        {
            header: "Tgl Dibuat",
            accessor: "created_at",
            render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString("id-ID") : "-",
        },
        {
            header: "Jatuh Tempo",
            accessor: "due_date",
            render: (row) => row.due_date ? new Date(row.due_date).toLocaleDateString("id-ID") : "-",
        },
        {
            header: "Status",
            accessor: "status",
            render: (row) => {
                if (row.status === "unpaid") return <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded-md text-xs font-medium border border-red-100">Belum Lunas</span>;
                if (row.status === "partial") return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-medium border border-amber-100">Sebagian</span>;
                if (row.status === "waiting_verification") return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">Verifikasi</span>;
                if (row.status === "paid") return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium border border-emerald-100">Lunas</span>;
                if (row.status === "canceled") return <span className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-md text-xs font-medium border border-gray-200">Batal</span>;
                return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">{row.status}</span>;
            },
        },
        {
            header: "Aksi",
            accessor: "actions",
            className: "text-right min-w-[120px]",
            render: (row) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onViewPdf(row); }}
                        className="inline-flex items-center justify-center p-1.5 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat PDF Invoice"
                    >
                        {row.status === "paid" ? <Download size={16} /> : <FileText size={16} />}
                    </button>
                    {canEditOrPay && row.status !== "paid" && row.status !== "canceled" && (
                        <TableIconButton 
                            type="edit"
                            onClick={(e) => { e.stopPropagation(); onEditInvoice(row); }} 
                        />
                    )}
                    {canEditOrPay && row.status !== "paid" && row.status !== "canceled" && (
                        <TableIconButton 
                            type="payment"
                            onClick={(e) => { e.stopPropagation(); onProcessPayment(row); }} 
                        />
                    )}
                </div>
            ),
        },
    ];

    const filterSection = (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                <div className="w-full sm:flex-1">
                    <SearchInput 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari No. Invoice / Nama..."
                    />
                </div>
                <div className="w-full sm:w-64">
                    <ReactSelect 
                        options={statusOptions}
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        placeholder="Filter Status..."
                        className="text-sm"
                        classNamePrefix="react-select"
                        isClearable
                        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                        styles={{
                            menuPortal: base => ({ ...base, zIndex: 9999 }),
                            control: (base) => ({
                                ...base,
                                borderRadius: '0.5rem',
                                borderColor: '#e5e7eb',
                                padding: '1px',
                                boxShadow: 'none',
                                '&:hover': { borderColor: '#d1d5db' }
                            })
                        }}
                    />
                </div>
            </div>
            
            {/* Date Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">
                    Filter Tanggal:
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="text-sm border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 w-full sm:w-40 px-2.5 py-1.5"
                    />
                    <span className="text-gray-400">s/d</span>
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="text-sm border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 w-full sm:w-40 px-2.5 py-1.5"
                    />
                </div>
                <button 
                    onClick={() => {
                        setStartDate('');
                        setEndDate('');
                        setSearchTerm('');
                        setSelectedStatus(null);
                    }}
                    className="text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors sm:ml-auto"
                >
                    Reset Filter
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h3 className="text-base font-semibold text-gray-900">Daftar Semua Tagihan (Invoices)</h3>
                    <p className="text-xs text-gray-500 mt-1">Menampilkan invoice lunas dan belum lunas berdasarkan rentang tanggal</p>
                </div>
            </div>
            <DataTable 
                columns={columns}
                data={filteredData}
                filterSection={filterSection}
                itemsPerPage={15}
            />
        </div>
    );
}
