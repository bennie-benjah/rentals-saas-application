<?php
namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\LandlordProfile;
use App\Models\TenantProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request, $user = null): Response
    {
        // Resolve target user: if {user} ID is passed, find user; otherwise default to logged-in user
        $authUser = $request->user();

        if ($user) {
            $user = User::findOrFail($user);

            // Authorization guard: Ensure non-admins can only view/edit their own profile
            if ($authUser->id !== $user->id && ! $authUser->hasRole('admin')) {
                abort(403, 'Unauthorized access.');
            }
        } else {
            $user = $authUser;
        }

        $roles = $user->getRoleNames()->toArray();

        // Check explicit roles or account types
        $isLandlordRole = in_array('landlord', $roles) || $user->account_type === 'landlord';
        $isTenantRole   = in_array('tenant', $roles) || $user->account_type === 'tenant';

        // Retrieve landlord profile for the target user

        $landlord = $isLandlordRole
            ? LandlordProfile::where('user_id', $user->id)->first()
            : null;

        // Retrieve tenant profile for the target user
        $tenant = $isTenantRole
            ? TenantProfile::where('user_id', $user->id)->first()
            : null;

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
            'status'          => session('status'),
            'profileUser'     => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? null,
            ],
            'profileData'     => [
                'account_type' => $user->account_type ?? ($isLandlordRole ? 'landlord' : ($isTenantRole ? 'tenant' : null)),
                'landlord'     => $landlord ? $landlord->toArray() : null,
                'tenant'       => $tenant ? $tenant->toArray() : null,
            ],
        ]);
    }

    public function update(ProfileUpdateRequest $request, $user = null): RedirectResponse
    {
        $authUser = $request->user();

        if ($user) {
            $user = User::findOrFail($user);

            // Authorization guard: Ensure non-admins can only update their own profile
            if ($authUser->id !== $user->id && ! $authUser->hasRole('admin')) {
                abort(403, 'Unauthorized access.');
            }
        } else {
            $user = $authUser;
        }

        $roles = $user->getRoleNames()->toArray();

        $isLandlordRole = in_array('landlord', $roles) || $user->account_type === 'landlord';
        $isTenantRole   = in_array('tenant', $roles) || $user->account_type === 'tenant';

        // 1. Update Base User Info
        $user->fill($request->safe()->only(['name', 'email', 'phone']));
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }
        $user->save();

        // 2. Update Landlord Profile
        if ($isLandlordRole) {
            LandlordProfile::updateOrCreate(
                ['user_id' => $user->id], // Enforces exact ownership by user ID
                $request->safe()->only([
                    'owner_type', 'dob', 'id_type', 'id_number', 'address', 'city', 'country',
                    'legal_name', 'entity_type', 'tax_id', 'years_operating', 'portfolio_size', 'website',
                    'payout_method', 'bank_name', 'account_name', 'account_number', 'routing_number',
                    'mpesa_number', 'paypal_email', 'currency', 'proof_type', 'tos_ack', 'tax_ack', 'signature',
                ])
            );
        }

        // 3. Update Tenant Profile
        if ($isTenantRole) {
            $validated = $request->safe()->all();

            $tenantData = [
                'dob'                 => $validated['tenant_dob'] ?? $validated['dob'] ?? null,
                'nationality'         => $validated['nationality'] ?? null,
                'id_type'             => $validated['tenant_id_type'] ?? $validated['id_type'] ?? null,
                'id_number'           => $validated['tenant_id_number'] ?? $validated['id_number'] ?? null,
                'employment_status'   => $validated['employment_status'] ?? null,
                'employer'            => $validated['employer'] ?? null,
                'job_title'           => $validated['job_title'] ?? null,
                'monthly_income'      => $validated['monthly_income'] ?? null,
                'employed_since'      => $validated['employed_since'] ?? null,
                'employer_phone'      => $validated['employer_phone'] ?? null,
                'prev_address'        => $validated['prev_address'] ?? null,
                'prev_landlord'       => $validated['prev_landlord'] ?? null,
                'prev_landlord_phone' => $validated['prev_landlord_phone'] ?? null,
                'reason_leaving'      => $validated['reason_leaving'] ?? null,
                'ref_name'            => $validated['ref_name'] ?? null,
                'ref_phone'           => $validated['ref_phone'] ?? null,
                'ref_relation'        => $validated['ref_relation'] ?? null,
                'emergency_name'      => $validated['emergency_name'] ?? null,
                'emergency_phone'     => $validated['emergency_phone'] ?? null,
                'property_name'       => $validated['property_name'] ?? null,
                'unit_label'          => $validated['unit_label'] ?? null,
                'move_in'             => $validated['move_in'] ?? null,
                'lease_term'          => $validated['lease_term'] ?? null,
                'occupants'           => $validated['occupants'] ?? null,
                'pets'                => $validated['pets'] ?? null,
                'vehicle'             => $validated['vehicle'] ?? null,
                'bg_consent'          => $validated['bg_consent'] ?? false,
                'deposit_ack'         => $validated['deposit_ack'] ?? false,
                'rules_ack'           => $validated['rules_ack'] ?? false,
                'signature'           => $validated['tenant_signature'] ?? $validated['signature'] ?? null,
            ];

            $tenantData = array_filter($tenantData, fn($value) => ! is_null($value));

            TenantProfile::updateOrCreate(
                ['user_id' => $user->id],
                $tenantData
            );
        }

        return back()->with('status', 'profile-updated');
    }
}
