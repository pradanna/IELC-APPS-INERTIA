<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Student\UpdateStudentRequest;
use App\Actions\Student\UpdateStudentAction;
use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Http\Resources\StudentResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class StudentController extends Controller
{
    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentRequest $request, Student $student, UpdateStudentAction $updateAction)
    {
        // THIN_CONTROLLER: All mutation logic is in the Action
        $updateAction->execute($student, $request->validated());

        return back()->with('success', 'Data siswa berhasil diperbarui.');
    }

    public function index(Request $request)
    {
        $branchId = $request->get('branch_id');

        // Query Students with filtering
        $studentsQuery = Student::with(['lead.interestPackage', 'lead.branch', 'studyClasses'])
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($branchId && $branchId !== 'all', function ($query) use ($branchId) {
                $query->whereHas('lead', function ($q) use ($branchId) {
                    $q->where('branch_id', $branchId);
                });
            })
            ->when($request->filter === 'new', function ($query) {
                $query->whereMonth('created_at', now()->month)
                      ->whereYear('created_at', now()->year);
            })
            ->when($request->filter === 'pending', function ($query) {
                $query->whereDoesntHave('studyClasses');
            })
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nis', 'like', "%{$search}%")
                      ->orWhereHas('lead', function ($ql) use ($search) {
                          $ql->where('name', 'like', "%{$search}%")
                             ->orWhere('email', 'like', "%{$search}%");
                      });
                });
            })
            ->latest();
        
        // Paginate
        $paginatedStudents = $studentsQuery->paginate(15)->withQueryString();
        $formattedStudents = StudentResource::collection($paginatedStudents);

        // Fetch Support Data
        $branches = \App\Models\Branch::all(['id', 'name']);

        // Calculate KPIs dynamically (Filter by branch if provided)
        $kpiQuery = Student::when($branchId && $branchId !== 'all', function ($query) use ($branchId) {
            $query->whereHas('lead', fn($q) => $q->where('branch_id', $branchId));
        });

        $totalActive = (clone $kpiQuery)->where('status', 'active')->count();
        $newStudents = (clone $kpiQuery)->whereMonth('created_at', Carbon::now()->month)
                                ->whereYear('created_at', Carbon::now()->year)
                                ->count();
        
        $pendingPlacementBaseQuery = (clone $kpiQuery)->where('status', 'active')->whereDoesntHave('studyClasses');
        $pendingPlacement = $pendingPlacementBaseQuery->count();

        // 5 Siswa terbaru yang belum di plot ke study_class mana pun
        $pendingStudents = $pendingPlacementBaseQuery->with(['lead.interestPackage', 'lead.invoices.items'])->latest()->take(5)->get()->map(function($student) {
            $purchasedPackages = $student->lead->invoices()
                ->where('status', 'paid')
                ->with('items')
                ->get()
                ->flatMap(fn($invoice) => $invoice->items)
                ->filter(fn($item) => $item->description !== 'Biaya Placement Test')
                ->map(fn($item) => [
                    'id' => $item->id,
                    'package_name' => $item->description,
                    'price' => $item->unit_price,
                ])
                ->values();

            return [
                'id' => $student->id,
                'name' => $student->lead->name ?? '-',
                'nis' => $student->nis,
                'package' => $student->lead->interestPackage->name ?? '-',
                'purchased_packages' => $purchasedPackages,
                'branch_id' => $student->lead->branch_id,
            ];
        });

        // Expiring Students (Saat ini kosong)
        $expiringStudents = [];

        // Kalkulasi Chart Data (Respect Branch)
        $packagesCount = (clone $kpiQuery)->whereHas('lead.interestPackage')
            ->with('lead.interestPackage')
            ->get()
            ->groupBy(fn($student) => $student->lead->interestPackage->name)
            ->map(fn($group) => $group->count());

        $chartData = $packagesCount->map(function ($count, $name) {
            return [
                'name' => $name,
                'value' => $count
            ];
        })->values()->toArray();

        // Fetch all classes grouped by package name
        $availableClasses = \App\Models\StudyClass::with('package')->get()->groupBy(fn($class) => $class->package->name);

        return Inertia::render('Students/Index', [
            'kpi' => [
                'totalActive' => $totalActive,
                'newStudents' => $newStudents,
                'pendingPlacement' => $pendingPlacement,
            ],
            'pendingStudents' => $pendingStudents,
            'expiringStudents' => $expiringStudents,
            'chartData' => $chartData,
            'students' => $formattedStudents,
            'availableClasses' => $availableClasses,
            'branches' => $branches,
            'filters' => $request->only(['status', 'branch_id', 'search', 'tab', 'filter']),
        ]);
    }

    public function assignClasses(Request $request, Student $student)
    {
        $validated = $request->validate([
            'placements' => 'required|array',
            'placements.*' => 'nullable|exists:study_classes,id',
        ]);

        // We filter out null/empty selections
        $classIds = collect($validated['placements'])->filter()->values()->all();

        // Standard Laravel sync: replace all previous associations with this new set
        // Or we might want to syncWithoutDetaching if they are adding one by one.
        // User said "menempatkan kelas sesuai dengan yang dibeli", usually one pakage maps to one class.
        $student->studyClasses()->sync($classIds);

        return back()->with('success', 'Plotting kelas berhasil diperbarui.');
    }
}
