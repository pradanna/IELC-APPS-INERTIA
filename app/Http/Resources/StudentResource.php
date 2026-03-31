<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $purchasedPackages = $this->lead->invoices()
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
            'id' => $this->id,
            'nis' => $this->nis,
            'name' => $this->lead->name ?? '-',
            'email' => $this->lead->email ?? '-',
            'dob' => $this->lead->dob ? $this->lead->dob->format('d M Y') : '-',
            'dob_raw' => $this->lead->dob ? $this->lead->dob->format('Y-m-d') : '',
            'address' => $this->lead->address ?? '-',
            'parent_name' => $this->lead->parent_name ?? '-',
            'parent_phone' => $this->lead->parent_phone ?? '-',
            'profile_picture' => $this->profile_picture,
            'contact' => $this->lead->phone ?: ($this->lead->parent_phone ?? '-'),
            'package' => $this->lead->interestPackage->name ?? '-',
            'class' => $this->studyClasses->first()->name ?? null,
            'classes' => $this->studyClasses->map(fn($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'package_name' => $c->package->name ?? '-',
            ]),
            'status' => ucfirst($this->status),
            'branch' => $this->lead->branch->name ?? '-',
            'branch_id' => $this->lead->branch_id,
            'purchased_packages' => $purchasedPackages,
            'created_at' => $this->created_at->format('d M Y'),
        ];
    }
}
