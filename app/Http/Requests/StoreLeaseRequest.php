<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Lease::class);
    }

    public function rules(): array
    {
        return [
            'unit_id' => ['required', 'exists:units,id'],
            'tenant_id' => ['required', 'exists:users,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
            'rent_amount' => ['required', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'size:3'],
            'billing_cycle' => ['nullable', 'string', 'in:monthly,quarterly,annual'],
            'billing_day' => ['nullable', 'integer', 'min:1', 'max:28'],
            'deposit_amount' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'billing_cycle' => $this->billing_cycle ?? 'monthly',
        ]);
    }
}