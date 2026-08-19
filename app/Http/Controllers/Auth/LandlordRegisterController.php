<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterLandlordRequest;
use App\Models\LandlordProfile;
use App\Models\Property;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class LandlordRegisterController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('register/landlord');
    }

    public function store(RegisterLandlordRequest $request)
    {
        $data = $request->validated();

        DB::transaction(function () use ($data, $request) {
            // Check if user is already logged in
            $user = $request->user();

            if (! $user) {
                // 1. Create a new User if Guest
                $user = User::create([
                    'name' => $data['firstName'] . ' ' . $data['lastName'],
                    'email' => $data['email'],
                    'password' => Hash::make($data['password']),
                    'phone' => $data['phone'],
                    'account_type' => 'landlord',
                ]);

                event(new Registered($user));
                Auth::login($user);
            }

            // Assign landlord role if using Spatie Permission
            if (method_exists($user, 'assignRole') && ! $user->hasRole('landlord')) {
                $user->assignRole('landlord');
            }

            // 2. Create LandlordProfile linked via user_id foreign key
            LandlordProfile::updateOrCreate(
                ['user_id' => $user->id], // Prevents duplicate profile entries for the same user
                [
                    'owner_type' => $data['ownerType'],
                    'dob' => $data['dob'] ?? null,
                    'id_type' => $data['idType'],
                    'id_number' => $data['idNumber'],
                    'address' => $data['address'] ?? null,
                    'city' => $data['city'] ?? null,
                    'country' => $data['country'],
                    'legal_name' => $data['legalName'],
                    'entity_type' => $data['entityType'],
                    'tax_id' => $data['taxId'],
                    'years_operating' => $data['yearsOperating'] ?? null,
                    'portfolio_size' => $data['portfolioSize'] ?? null,
                    'website' => $data['website'] ?? null,
                    'payout_method' => $data['payoutMethod'],
                    'bank_name' => $data['bankName'] ?? null,
                    'account_name' => $data['accountName'] ?? null,
                    'account_number' => $data['accountNumber'] ?? null,
                    'routing_number' => $data['routingNumber'] ?? null,
                    'mpesa_number' => $data['mpesaNumber'] ?? null,
                    'paypal_email' => $data['paypalEmail'] ?? null,
                    'currency' => $data['currency'],
                    'proof_type' => $data['proofType'],
                    'tos_ack' => $data['tosAck'],
                    'tax_ack' => $data['taxAck'],
                    'signature' => $data['signature'],
                ]
            );

            // 3. Create initial property if submitted
            if (class_exists(Property::class) && ! empty($data['propName'])) {
                Property::create([
                    'landlord_id' => $user->id,
                    'name' => $data['propName'],
                    'type' => $data['propType'],
                    'address' => $data['propAddress'],
                    'units' => $data['units'],
                    'year_built' => $data['yearBuilt'] ?? null,
                    'monthly_rent' => $data['monthlyRent'],
                    'amenities' => json_encode($data['amenities'] ?? []),
                ]);
            }
        });

        return redirect()->route('dashboard');
    }
}
