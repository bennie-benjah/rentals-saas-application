<?php


namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
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
use Inertia\Inertia;
use Inertia\Response;
class TenantRegisterController extends Controller
{
    
    public function createTenant(): Response
    {
        return Inertia::render('register/tenant'); // Adjust path to match your React component
    }
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