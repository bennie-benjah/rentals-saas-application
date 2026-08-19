<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterLandlordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->user()?->id;
        return [
            // Owner / User fields
            'firstName' => ['required', 'string', 'max:255'],
            'lastName' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $userId],
        'password' => $userId ? ['nullable', 'string'] : ['required', 'string', 'min:8'],
            'phone' => ['required', 'string', 'max:50'],
            'dob' => ['nullable', 'date'],
            'country' => ['required', 'string', 'max:255'],
            'idType' => ['required', 'string', 'in:national,passport,drivers'],
            'idNumber' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'ownerType' => ['required', 'string', 'in:individual,company'],

            // Business
            'legalName' => ['required', 'string', 'max:255'],
            'entityType' => ['required', 'string', 'in:sole,llc,corp,trust,partnership'],
            'taxId' => ['required', 'string', 'max:255'],
            'yearsOperating' => ['nullable', 'numeric'],
            'portfolioSize' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'url', 'max:255'],

            // Property
            'propName' => ['required', 'string', 'max:255'],
            'propType' => ['required', 'string'],
            'propAddress' => ['required', 'string', 'max:255'],
            'units' => ['required', 'integer', 'min:1'],
            'yearBuilt' => ['nullable', 'numeric'],
            'monthlyRent' => ['required', 'numeric', 'min:0'],
            'amenities' => ['array'],

            // Payouts
            'payoutMethod' => ['required', 'string', 'in:bank,mpesa,paypal'],
            'bankName' => ['required_if:payoutMethod,bank', 'nullable', 'string', 'max:255'],
            'accountName' => ['required_if:payoutMethod,bank', 'nullable', 'string', 'max:255'],
            'accountNumber' => ['required_if:payoutMethod,bank', 'nullable', 'string', 'max:255'],
            'routingNumber' => ['nullable', 'string', 'max:255'],
            'mpesaNumber' => ['required_if:payoutMethod,mpesa', 'nullable', 'string', 'max:255'],
            'paypalEmail' => ['required_if:payoutMethod,paypal', 'nullable', 'email', 'max:255'],
            'currency' => ['required', 'string', 'max:10'],

            // Verification
            'proofType' => ['required', 'string'],
            'tosAck' => ['required', 'accepted'],
            'taxAck' => ['required', 'accepted'],
            'signature' => ['required', 'string', 'max:255'],
            'idDocs' => ['required', 'array'],
            'ownershipDocs' => ['required', 'array'],
        ];
    }
}