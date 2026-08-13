<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TenantProfile extends Model
{
    protected $fillable = [
        'user_id', 'dob', 'nationality', 'id_type', 'id_number',
        'employment_status', 'employer', 'job_title', 'monthly_income', 'employed_since', 'employer_phone',
        'prev_address', 'prev_landlord', 'prev_landlord_phone', 'reason_leaving',
        'ref_name', 'ref_phone', 'ref_relation', 'emergency_name', 'emergency_phone',
        'property_name', 'unit_label', 'move_in', 'lease_term', 'occupants', 'pets', 'vehicle',
        'bg_consent', 'deposit_ack', 'rules_ack', 'signature',
    ];

    protected $casts = [
        'dob' => 'date',
        'move_in' => 'date',
        'bg_consent' => 'boolean',
        'deposit_ack' => 'boolean',
        'rules_ack' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
