<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMaintenanceRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\MaintenanceRequest::class);
    }

    public function rules(): array
    {
        return [
            'unit_id' => ['nullable', 'exists:units,id'],
            'title' => ['required', 'string', 'max:150'],
            'description' => ['required', 'string', 'max:4000'],
            'priority' => ['nullable', 'string', 'in:low,medium,high,urgent'],
            'photos' => ['nullable', 'array', 'max:5'],
            'photos.*' => ['image', 'max:5120'], // 5MB each
        ];
    }
}
