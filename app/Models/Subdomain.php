<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Subdomain extends Model
{
    use HasFactory;

    protected $fillable = [
        'subdomain',
        'landlord_profile_id',
    ];

    /**
     * The landlord owner of this subdomain.
     */
    public function landlordProfile(): BelongsTo
    {
        return $this->belongsTo(LandlordProfile::class, 'landlord_profile_id');
    }

    /**
     * Users assigned to this specific subdomain via domain_user pivot.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'domain_user', 'landlord_profile_id', 'user_id', 'landlord_profile_id')
            ->withPivot('role')
            ->withTimestamps();
    }
}