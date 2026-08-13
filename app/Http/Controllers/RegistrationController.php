<?php

namespace App\Http\Controllers;

use App\Models\LandlordProfile;
use App\Models\Property;
use App\Models\TenantProfile;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegistrationController extends Controller
{
    /**
     * POST /register/landlord
     */
    public function storeLandlord(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'firstName' => ['required', 'string', 'max:100'],
            'lastName' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', Password::defaults()],
            'phone' => ['nullable', 'string', 'max:30'],
            'ownerType' => ['nullable', 'string', 'max:50'],
            'dob' => ['nullable', 'date'],
            'idType' => ['nullable', 'string', 'max:50'],
            'idNumber' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'legalName' => ['nullable', 'string', 'max:255'],
            'entityType' => ['nullable', 'string', 'max:100'],
            'taxId' => ['nullable', 'string', 'max:100'],
            'yearsOperating' => ['nullable', 'string', 'max:50'],
            'portfolioSize' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'url', 'max:255'],
            'propName' => ['nullable', 'string', 'max:255'],
            'propType' => ['nullable', 'string', 'max:100'],
            'propAddress' => ['nullable', 'string', 'max:255'],
            'units' => ['nullable', 'integer', 'min:1'],
            'yearBuilt' => ['nullable', 'integer', 'min:1800', 'max:'.date('Y')],
            'monthlyRent' => ['nullable', 'numeric', 'min:0'],
            'amenities' => ['nullable', 'array'],
            'payoutMethod' => ['nullable', 'string', 'max:50'],
            'bankName' => ['nullable', 'string', 'max:100'],
            'accountName' => ['nullable', 'string', 'max:100'],
            'accountNumber' => ['nullable', 'string', 'max:100'],
            'routingNumber' => ['nullable', 'string', 'max:100'],
            'mpesaNumber' => ['nullable', 'string', 'max:30'],
            'paypalEmail' => ['nullable', 'email', 'max:255'],
            'currency' => ['nullable', 'string', 'size:3'],
            'proofType' => ['nullable', 'string', 'max:100'],
            'tosAck' => ['required', 'accepted'],
            'taxAck' => ['nullable', 'boolean'],
            'signature' => ['nullable', 'string'],
        ]);

        $user = DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => trim($data['firstName'].' '.$data['lastName']),
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'account_type' => 'landlord',
                'email_verified_at' => now(),
            ]);

            // Explicit server-side Spatie role binding
            $user->assignRole('landlord');

            LandlordProfile::create([
                'user_id' => $user->id,
                'owner_type' => $data['ownerType'] ?? null,
                'dob' => $data['dob'] ?? null,
                'id_type' => $data['idType'] ?? null,
                'id_number' => $data['idNumber'] ?? null,
                'address' => $data['address'] ?? null,
                'city' => $data['city'] ?? null,
                'country' => $data['country'] ?? null,
                'legal_name' => $data['legalName'] ?? null,
                'entity_type' => $data['entityType'] ?? null,
                'tax_id' => $data['taxId'] ?? null,
                'years_operating' => $data['yearsOperating'] ?? null,
                'portfolio_size' => $data['portfolioSize'] ?? null,
                'website' => $data['website'] ?? null,
                'payout_method' => $data['payoutMethod'] ?? null,
                'bank_name' => $data['bankName'] ?? null,
                'account_name' => $data['accountName'] ?? null,
                'account_number' => $data['accountNumber'] ?? null,
                'routing_number' => $data['routingNumber'] ?? null,
                'mpesa_number' => $data['mpesaNumber'] ?? null,
                'paypal_email' => $data['paypalEmail'] ?? null,
                'currency' => $data['currency'] ?? null,
                'proof_type' => $data['proofType'] ?? null,
                'tos_ack' => (bool) ($data['tosAck'] ?? false),
                'tax_ack' => (bool) ($data['taxAck'] ?? false),
                'signature' => $data['signature'] ?? null,
            ]);

            if (! empty($data['propName'])) {
                Property::create([
                    'landlord_id' => $user->id,
                    'name' => $data['propName'],
                    'type' => $data['propType'] ?? null,
                    'address' => $data['propAddress'] ?? null,
                    'city' => $data['city'] ?? null,
                    'country' => $data['country'] ?? null,
                    'year_built' => $data['yearBuilt'] ?? null,
                    'total_units' => $data['units'] ?? null,
                    'monthly_rent' => $data['monthlyRent'] ?? null,
                    'amenities' => $data['amenities'] ?? [],
                ]);
            }

            return $user;
        });

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route('dashboard');
    }

    /**
     * POST /register/tenant
     */
    public function storeTenant(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'firstName' => ['required', 'string', 'max:100'],
            'lastName' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', Password::defaults()],
            'phone' => ['nullable', 'string', 'max:30'],
            'dob' => ['nullable', 'date'],
            'nationality' => ['nullable', 'string', 'max:100'],
            'idType' => ['nullable', 'string', 'max:50'],
            'idNumber' => ['nullable', 'string', 'max:100'],
            'employmentStatus' => ['nullable', 'string', 'max:100'],
            'employer' => ['nullable', 'string', 'max:100'],
            'jobTitle' => ['nullable', 'string', 'max:100'],
            'monthlyIncome' => ['nullable', 'numeric', 'min:0'],
            'employedSince' => ['nullable', 'string', 'max:50'],
            'employerPhone' => ['nullable', 'string', 'max:30'],
            'prevAddress' => ['nullable', 'string', 'max:255'],
            'prevLandlord' => ['nullable', 'string', 'max:100'],
            'prevLandlordPhone' => ['nullable', 'string', 'max:30'],
            'reasonLeaving' => ['nullable', 'string', 'max:255'],
            'refName' => ['nullable', 'string', 'max:100'],
            'refPhone' => ['nullable', 'string', 'max:30'],
            'refRelation' => ['nullable', 'string', 'max:50'],
            'emergencyName' => ['nullable', 'string', 'max:100'],
            'emergencyPhone' => ['nullable', 'string', 'max:30'],
            'property' => ['nullable', 'string', 'max:255'],
            'unit' => ['nullable', 'string', 'max:50'],
            'moveIn' => ['nullable', 'date'],
            'leaseTerm' => ['nullable', 'string', 'max:50'],
            'occupants' => ['nullable', 'string', 'max:50'],
            'pets' => ['nullable', 'string', 'max:100'],
            'vehicle' => ['nullable', 'string', 'max:100'],
            'bgConsent' => ['required', 'accepted'],
            'depositAck' => ['required', 'accepted'],
            'rulesAck' => ['required', 'accepted'],
            'signature' => ['nullable', 'string'],
        ]);

        $user = DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => trim($data['firstName'].' '.$data['lastName']),
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'account_type' => 'tenant',
                'email_verified_at' => now(),
            ]);

            // Explicit server-side Spatie role binding
            $user->assignRole('tenant');

            TenantProfile::create([
                'user_id' => $user->id,
                'dob' => $data['dob'] ?? null,
                'nationality' => $data['nationality'] ?? null,
                'id_type' => $data['idType'] ?? null,
                'id_number' => $data['idNumber'] ?? null,
                'employment_status' => $data['employmentStatus'] ?? null,
                'employer' => $data['employer'] ?? null,
                'job_title' => $data['jobTitle'] ?? null,
                'monthly_income' => $data['monthlyIncome'] ?? null,
                'employed_since' => $data['employedSince'] ?? null,
                'employer_phone' => $data['employerPhone'] ?? null,
                'prev_address' => $data['prevAddress'] ?? null,
                'prev_landlord' => $data['prevLandlord'] ?? null,
                'prev_landlord_phone' => $data['prevLandlordPhone'] ?? null,
                'reason_leaving' => $data['reasonLeaving'] ?? null,
                'ref_name' => $data['refName'] ?? null,
                'ref_phone' => $data['refPhone'] ?? null,
                'ref_relation' => $data['refRelation'] ?? null,
                'emergency_name' => $data['emergencyName'] ?? null,
                'emergency_phone' => $data['emergencyPhone'] ?? null,
                'property_name' => $data['property'] ?? null,
                'unit_label' => $data['unit'] ?? null,
                'move_in' => $data['moveIn'] ?? null,
                'lease_term' => $data['leaseTerm'] ?? null,
                'occupants' => $data['occupants'] ?? null,
                'pets' => $data['pets'] ?? null,
                'vehicle' => $data['vehicle'] ?? null,
                'bg_consent' => (bool) ($data['bgConsent'] ?? false),
                'deposit_ack' => (bool) ($data['depositAck'] ?? false),
                'rules_ack' => (bool) ($data['rulesAck'] ?? false),
                'signature' => $data['signature'] ?? null,
            ]);

            return $user;
        });

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route('tenant.index');
    }
}