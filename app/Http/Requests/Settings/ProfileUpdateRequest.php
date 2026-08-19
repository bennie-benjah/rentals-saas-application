<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'phone' => ['nullable', 'string', 'max:30'],

            // Landlord Profile Rules
            'owner_type' => ['nullable', 'string', 'max:50'],
            'dob' => ['nullable', 'date'],
            'id_type' => ['nullable', 'string', 'max:50'],
            'id_number' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'legal_name' => ['nullable', 'string', 'max:255'],
            'entity_type' => ['nullable', 'string', 'max:50'],
            'tax_id' => ['nullable', 'string', 'max:100'],
            'years_operating' => ['nullable', 'integer'],
            'portfolio_size' => ['nullable', 'integer'],
            'website' => ['nullable', 'url', 'max:255'],
            'payout_method' => ['nullable', 'string', 'max:50'],
            'bank_name' => ['nullable', 'string', 'max:100'],
            'account_name' => ['nullable', 'string', 'max:100'],
            'account_number' => ['nullable', 'string', 'max:100'],
            'routing_number' => ['nullable', 'string', 'max:100'],
            'mpesa_number' => ['nullable', 'string', 'max:30'],
            'paypal_email' => ['nullable', 'email', 'max:255'],
            'currency' => ['nullable', 'string', 'max:10'],
            'proof_type' => ['nullable', 'string', 'max:50'],
            'tos_ack' => ['nullable', 'boolean'],
            'tax_ack' => ['nullable', 'boolean'],
            'signature' => ['nullable', 'string', 'max:255'],

            // Tenant Profile Rules — field names match the *_prefixed keys
            // the frontend form uses to avoid colliding with the landlord
            // fields above (tenant_dob vs dob, tenant_signature vs signature, etc.)
            'tenant_dob' => ['nullable', 'date'],
            'nationality' => ['nullable', 'string', 'max:100'],
            'tenant_id_type' => ['nullable', 'string', 'max:50'],
            'tenant_id_number' => ['nullable', 'string', 'max:100'],
            'employment_status' => ['nullable', 'string', 'max:50'],
            'employer' => ['nullable', 'string', 'max:255'],
            'job_title' => ['nullable', 'string', 'max:150'],
            'monthly_income' => ['nullable', 'numeric', 'min:0'],
            'employed_since' => ['nullable', 'string', 'max:50'],
            'employer_phone' => ['nullable', 'string', 'max:30'],
            'prev_address' => ['nullable', 'string', 'max:255'],
            'prev_landlord' => ['nullable', 'string', 'max:255'],
            'prev_landlord_phone' => ['nullable', 'string', 'max:30'],
            'reason_leaving' => ['nullable', 'string', 'max:500'],
            'ref_name' => ['nullable', 'string', 'max:255'],
            'ref_phone' => ['nullable', 'string', 'max:30'],
            'ref_relation' => ['nullable', 'string', 'max:100'],
            'emergency_name' => ['nullable', 'string', 'max:255'],
            'emergency_phone' => ['nullable', 'string', 'max:30'],
            'property_name' => ['nullable', 'string', 'max:255'],
            'unit_label' => ['nullable', 'string', 'max:100'],
            'move_in' => ['nullable', 'date'],
            'lease_term' => ['nullable', 'string', 'max:50'],
            'occupants' => ['nullable', 'string', 'max:20'],
            'pets' => ['nullable', 'string', 'max:255'],
            'vehicle' => ['nullable', 'string', 'max:255'],
            'bg_consent' => ['nullable', 'boolean'],
            'deposit_ack' => ['nullable', 'boolean'],
            'rules_ack' => ['nullable', 'boolean'],
            'tenant_signature' => ['nullable', 'string', 'max:255'],
        ];
    }
}
