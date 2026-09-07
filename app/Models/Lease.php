<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use App\Models\Unit;
use App\Models\IdDocument;
use App\Models\Property;
use App\Models\User;

class Lease extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'unit_id', 'tenant_id', 'landlord_id', 'start_date', 'end_date',
        'rent_amount', 'currency', 'billing_cycle', 'billing_day',
        'deposit_amount', 'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'rent_amount' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
    ];

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    public function landlord(): BelongsTo
    {
        return $this->belongsTo(User::class, 'landlord_id');
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }
    

    

    // Access Property through Unit directly on Lease
    public function property(): HasOneThrough
    {
        return $this->hasOneThrough(
            Property::class,
            Unit::class,
            'id',          // Foreign key on units table...
            'id',          // Foreign key on properties table...
            'unit_id',     // Local key on leases table...
            'property_id'  // Local key on units table...
        );
    }
    public function documents(): HasMany
{
    // Points to IdDocument model using user_id or a specific foreign key
    return $this->hasMany(IdDocument::class, 'user_id', 'tenant_id');
}
}
