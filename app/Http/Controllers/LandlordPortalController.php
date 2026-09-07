<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandlordPortalController extends Controller
{
    public function show(Request $request)
    {
        // Pulled from middleware
        $landlordProfile = $request->attributes->get('currentLandlord');

        abort_if(! $landlordProfile, 404, 'Property portal not found.');

        // Load user relationship
        $landlord = $landlordProfile->user;

        abort_if(! $landlord, 404, 'Landlord user record not found.');

        $properties = Property::where('landlord_id', $landlord->id)
            ->with(['units'])
            ->get()
            ->map(fn ($property) => [
                'id' => $property->id,
                'name' => $property->name,
                'address' => $property->address,
                'cover_image' => $property->image_path ?? 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
                // Match the 'vacant' status from your database schema
                'available_units_count' => $property->units->where('status', 'vacant')->count(),
                'min_rent' => $property->units->min('rent_amount') ?? $property->monthly_rent,
            ]);

        return Inertia::render('portal/landlord-home', [
            'landlord' => [
                'id' => $landlord->id,
                'company_name' => $landlordProfile->legal_name ?? $landlord->name,
                'welcome_message' => "Welcome to our resident portal! Browse our available properties below or sign in to manage your tenancy.",
                'support_email' => $landlord->email,
                'support_phone' => $landlordProfile->mpesa_number ?? null,
            ],
            'properties' => $properties,
        ]);
    }
}