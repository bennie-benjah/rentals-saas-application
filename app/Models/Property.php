<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends Model
{
    use SoftDeletes;

    protected $fillable = [
    'landlord_id', 'name', 'image_path', 'type', 'address', 'city', 'country',
    'year_built', 'total_units', 'monthly_rent', 'amenities',
];

    protected $casts = [
        'amenities' => 'array',
    ];

    public function landlord(): BelongsTo
    {
        return $this->belongsTo(User::class, 'landlord_id');
    }

    public function units(): HasMany
    {
        return $this->hasMany(Unit::class);
    }

    public function maintenanceRequests(): HasMany
    {
        return $this->hasManyThrough(MaintenanceRequest::class, Unit::class);
    }

    public function occupancyRate(): float
    {
        $total = $this->units()->count();
        if ($total === 0) {
            return 0.0;
        }
        $occupied = $this->units()->where('status', 'occupied')->count();

        return round(($occupied / $total) * 100, 1);
    }
}
