<?php

namespace App\Http\Controllers\Finance;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Lead;
use App\Models\Payment;
use App\Models\Package;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class FinanceDashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        // TODO: [Optimasi] Seiring bertambahnya data, query di halaman Dashboard ini berpotensi menjadi lambat.
        // Beberapa langkah optimasi yang bisa dilakukan ke depan:
        // 1. Gunakan Caching (misal: Redis) untuk metrik KPI (Total Pendapatan, Jumlah Outstanding, dll).
        // 2. Hindari penggunaan ->get() untuk data modal jika jumlahnya ribuan. Ubah menjadi mekanisme Pagination atau Lazy Load (fetch via API terpisah saat modal diklik).

        // 1. KPI Metrics
        // Asumsi UUID 'c0a80101-0000-0000-0000-000000000005' adalah "Waiting for Payment" berdasarkan seeder
        $pendingInvoicesQuery = Lead::with('interestPackage')->where('lead_status_id', 'c0a80101-0000-0000-0000-000000000005')
            ->whereDoesntHave('invoices');
        $pendingInvoicesCount = $pendingInvoicesQuery->count();
        $pendingInvoicesLeads = $pendingInvoicesQuery->latest()->get();

        // Menghitung jumlah tagihan dengan status menunggu verifikasi
        $pendingVerificationsCount = Invoice::where('status', 'waiting_verification')->count();

        $revenueThisMonth = Invoice::where('status', 'paid')
            ->whereBetween('paid_at', [$startOfMonth, $endOfMonth])
            ->sum('total_amount');

        // List lengkap invoice lunas bulan ini untuk ditampilkan di modal jika KPI diklik
        $revenueThisMonthList = Invoice::with(['lead', 'items'])
            ->where('status', 'paid')
            ->whereBetween('paid_at', [$startOfMonth, $endOfMonth])
            ->latest('paid_at')
            ->get();

        $outstandingAmount = Invoice::where('status', '!=', 'paid')
            ->sum('total_amount');

        // 2. To-Do Lists (Actionable Data)
        $needsVerification = Invoice::with(['lead'])
            ->where('status', 'waiting_verification')
            ->latest()
            ->take(10)
            ->get();

        // List lengkap untuk ditampilkan di modal jika KPI card diklik
        $pendingVerificationsList = Invoice::with(['lead', 'items'])
            ->where('status', 'waiting_verification')
            ->latest()
            ->get();

        $overdueInvoices = Invoice::with(['lead'])
            ->where('status', '!=', 'paid')
            ->where('due_date', '<', $today)
            ->latest('due_date')
            ->take(10)
            ->get();

        $unpaidInvoices = Invoice::with(['lead', 'items'])
            ->where('status', '!=', 'paid')
            ->latest()
            ->get();

        $allInvoices = Invoice::with(['lead', 'items'])
            ->latest()
            ->get();

        // 3. Analytics (Mocked/Aggregated Data)
        // Menghitung trend pendapatan bulan ini per hari
        $revenueTrend = Invoice::where('status', 'paid')
            ->whereBetween('paid_at', [$startOfMonth, $endOfMonth])
            ->select(DB::raw('DATE(paid_at) as date'), DB::raw('SUM(total_amount) as total'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Ambil data paket aktif untuk dropdown tambah komponen invoice
        $packages = Package::where('is_active', 1)->get();

        return Inertia::render('Finance/Dashboard', [
            'kpis' => [
                'pending_invoices' => $pendingInvoicesCount,
                'pending_verifications' => $pendingVerificationsCount,
                'revenue_this_month' => $revenueThisMonth,
                'outstanding_amount' => $outstandingAmount,
            ],
            'lists' => [
                'needs_verification' => $needsVerification,
                'overdue_invoices' => $overdueInvoices,
                'pending_invoices_leads' => $pendingInvoicesLeads,
                'unpaid_invoices' => $unpaidInvoices,
                'pending_verifications_list' => $pendingVerificationsList,
                'revenue_this_month_list' => $revenueThisMonthList,
                'all_invoices' => $allInvoices,
            ],
            'charts' => [
                'revenue_trend' => $revenueTrend,
            ],
            'packages' => $packages,
        ]);
    }

    public function storeInvoice(Request $request)
    {
        $validated = $request->validate([
            'lead_id' => 'required|exists:leads,id',
            'items' => 'nullable|array',
            'items.*.name' => 'required|string',
            'items.*.price' => 'required|numeric',
            'include_pt_fee' => 'required|boolean',
            'pt_fee' => 'nullable|numeric',
            'total_amount' => 'required|numeric',
        ]);

        $invoice = null;
        DB::transaction(function () use ($validated, &$invoice) {
            // Generate Nomor Invoice: INV-YmdHis/urut
            $invoiceCount = Invoice::whereDate('created_at', now())->count();
            $nextId = $invoiceCount + 1;
            $invoiceNumber = 'INV-' . now()->format('YmdHis') . '/' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

            $invoice = Invoice::create([
                'lead_id' => $validated['lead_id'],
                'invoice_number' => $invoiceNumber,
                'total_amount' => $validated['total_amount'],
                'status' => 'unpaid',
                'due_date' => Carbon::now()->addDay(),
            ]);

            // Tambahkan komponen biaya Placement Test (jika dichecklist)
            if (!empty($validated['include_pt_fee']) && !empty($validated['pt_fee']) && $validated['pt_fee'] > 0) {
                $invoice->items()->create([
                    'description' => 'Biaya Placement Test',
                    'quantity' => 1,
                    'unit_price' => $validated['pt_fee'],
                    'subtotal' => $validated['pt_fee'],
                ]);
            }

            // Tambahkan rincian paket/manual yang diinput
            if (!empty($validated['items'])) {
                foreach ($validated['items'] as $item) {
                    $invoice->items()->create([
                        'description' => $item['name'],
                        'quantity' => 1,
                        'unit_price' => $item['price'],
                        'subtotal' => $item['price'],
                    ]);
                }
            }
        });

        return back()->with([
            'success' => 'Invoice berhasil diterbitkan.',
            'new_invoice_id' => $invoice?->id,
        ]);
    }

    public function downloadPdf(Invoice $invoice)
    {
        $invoice->load(['lead', 'items']);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.invoice', compact('invoice'));

        return $pdf->stream('Invoice-' . str_replace('/', '-', $invoice->invoice_number) . '.pdf');
    }

    public function updateInvoice(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'items' => 'nullable|array',
            'items.*.name' => 'required|string',
            'items.*.price' => 'required|numeric',
            'include_pt_fee' => 'required|boolean',
            'pt_fee' => 'nullable|numeric',
            'total_amount' => 'required|numeric',
        ]);

        DB::transaction(function () use ($validated, $invoice) {
            $invoice->update([
                'total_amount' => $validated['total_amount'],
            ]);

            // Clear existing items
            $invoice->items()->delete();

            // Tambahkan komponen biaya Placement Test (jika dichecklist)
            if (!empty($validated['include_pt_fee']) && !empty($validated['pt_fee']) && $validated['pt_fee'] > 0) {
                $invoice->items()->create([
                    'description' => 'Biaya Placement Test',
                    'quantity' => 1,
                    'unit_price' => $validated['pt_fee'],
                    'subtotal' => $validated['pt_fee'],
                ]);
            }

            // Tambahkan rincian paket/manual yang diinput
            if (!empty($validated['items'])) {
                foreach ($validated['items'] as $item) {
                    $invoice->items()->create([
                        'description' => $item['name'],
                        'quantity' => 1,
                        'unit_price' => $item['price'],
                        'subtotal' => $item['price'],
                    ]);
                }
            }
        });

        return back()->with('success', 'Invoice berhasil diperbarui.');
    }

    public function updateStatus(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'status' => 'required|in:unpaid,partial,paid,waiting_verification',
            'payment_method' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated, $invoice) {
            $prevStatus = $invoice->status;
            
            $invoice->update([
                'status' => $validated['status'],
                'paid_at' => $validated['status'] === 'paid' ? now() : ($invoice->status === 'paid' ? null : $invoice->paid_at),
            ]);

            // Jika status diubah menjadi paid, catat data pembayaran ke tabel payments
            if ($validated['status'] === 'paid' && $prevStatus !== 'paid') {
                Payment::create([
                    'invoice_id' => $invoice->id,
                    'amount_paid' => $invoice->total_amount,
                    'payment_method' => $validated['payment_method'] ?? 'cash',
                    'payment_date' => now(),
                ]);

                // Update Lead Status ke "Joined" (UUID: c0a80101-0000-0000-0000-000000000006)
                $invoice->lead->update([
                    'lead_status_id' => 'c0a80101-0000-0000-0000-000000000006',
                    'joined_at' => now(),
                ]);

                // Create Data Siswa (jika belum ada)
                if (!$invoice->lead->student) {
                    // Generate NIS otomatis: S-Ymd-XXXX
                    $datePart = now()->format('Ymd');
                    $lastStudent = \App\Models\Student::where('nis', 'like', "S-$datePart-%")->latest()->first();
                    $lastCount = 0;
                    if ($lastStudent) {
                        $parts = explode('-', $lastStudent->nis);
                        $lastCount = (int)end($parts);
                    }
                    $newCount = str_pad($lastCount + 1, 4, '0', STR_PAD_LEFT);
                    $nis = "S-$datePart-$newCount";

                    \App\Models\Student::create([
                        'lead_id' => $invoice->lead_id,
                        'nis' => $nis,
                        'status' => 'active',
                    ]);
                }
            }
        });

        return back()->with('success', 'Status tagihan berhasil diperbarui.');
    }
}
