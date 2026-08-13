<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Unit::class);
    }

    public function rules(): array
    {
        return [
            'unit_number' => ['required', 'string', 'max:50'],
            'bedrooms' => ['nullable', 'integer', 'min:0', 'max:20'],
            'bathrooms' => ['nullable', 'integer', 'min:0', 'max:20'],
            'rent_amount' => ['required', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'size:3'],
            'status' => ['nullable', 'string', 'in:vacant,occupied,maintenance,reserved'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
