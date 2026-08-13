<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePropertyRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Requests\UpdatePropertyRequest;
use Illuminate\Support\Facades\Storage;
use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PropertyController extends Controller
{
    use AuthorizesRequests;
    public function index(Request $request)
{
    $this->authorize('viewAny', Property::class);

    $properties = Property::where('landlord_id', $request->user()->id)
        ->withCount([
            'units',
            'units as occupied_units_count' => function ($query) {
                $query->where('status', 'occupied');
            }
        ])
        ->latest()
        ->get()
        ->map(function ($property) {
            $totalUnits = $property->units_count;
            $occupied = $property->occupied_units_count;
            $occupancyRate = $totalUnits > 0 ? round(($occupied / $totalUnits) * 100) : 0;

            return [
                'id' => $property->id,
                'name' => $property->name,
                // Use uploaded image or fallback to placeholder
                'img' => $property->image_path 
    ? Storage::url($property->image_path) 
    : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
                'units' => "{$totalUnits} Units · {$occupancyRate}% Occupied",
                'yield' => '$' . number_format($property->monthly_rent / 1000, 1) . 'k/mo',
            ];
        });

    return Inertia::render('dashboard/properties', ['properties' => $properties]);
}

public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'address' => 'nullable|string|max:255',
        'city' => 'nullable|string|max:255',
        'country' => 'nullable|string|max:255',
        'total_units' => 'nullable|numeric',
        'monthly_rent' => 'nullable|numeric',
        'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120', // Max 5MB
    ]);

    $imagePath = null;
    if ($request->hasFile('image')) {
        // Store in public disk under 'properties' directory
        $imagePath = $request->file('image')->store('properties', 'public');
    }

    $property = Property::create([
        'name' => $validated['name'],
        'address' => $validated['address'] ?? null,
        'city' => $validated['city'] ?? null,
        'country' => $validated['country'] ?? null,
        'total_units' => $validated['total_units'] ?? 0,
        'monthly_rent' => $validated['monthly_rent'] ?? 0,
        'image_path' => $imagePath,
        'landlord_id' => $request->user()->id,
    ]);

    return back()->with('success', 'Property created.');
}

    public function update(UpdatePropertyRequest $request, Property $property)
    {
        $property->update($request->validated());

        return back()->with('success', 'Property updated.');
    }

    public function destroy(Request $request, Property $property)
    {
        $this->authorize('delete', $property);
        $property->delete();

        return back()->with('success', 'Property removed.');
    }
}
