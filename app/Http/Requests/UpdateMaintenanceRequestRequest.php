<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMaintenanceRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('maintenance_request'));
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', 'required', 'string', 'in:submitted,acknowledged,in_progress,resolved,cancelled'],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'description' => ['sometimes', 'string', 'max:4000'],
        ];
    }
}
