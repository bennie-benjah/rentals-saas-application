<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'tagline',
        'price',
        'unit',
        'cta',
        'featured',
        'features',
        'includes',
        'not_included',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'features' => 'array',
        'includes' => 'array',
        'not_included' => 'array',
    ];

    /**
     * Get all landlord profiles subscribed to this plan.
     */
    public function landlordProfiles(): HasMany
    {
        return $this->hasMany(LandlordProfile::class);
    }

    /**
     * Get all tenant profiles assigned to this plan.
     */
    public function tenantProfiles(): HasMany
    {
        return $this->hasMany(TenantProfile::class);
    }

    /**
     * Get all users assigned directly to this plan.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get all Landlords (Users with landlord role/profile) on this plan.
     */
    public function landlords(): HasManyThrough
    {
        return $this->hasManyThrough(
            User::class,
            LandlordProfile::class,
            'plan_id', // Foreign key on LandlordProfile
            'id',      // Foreign key on User
            'id',      // Local key on Plan
            'user_id'  // Local key on LandlordProfile
        );
    }

    /**
     * Get all Tenants (Users with tenant profile) on this plan.
     */
    public function tenants(): HasManyThrough
    {
        return $this->hasManyThrough(
            User::class,
            TenantProfile::class,
            'plan_id', // Foreign key on TenantProfile
            'id',      // Foreign key on User
            'id',      // Local key on Plan
            'user_id'  // Local key on TenantProfile
        );
    }
}