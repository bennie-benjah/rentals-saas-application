<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;
use App\Models\TenantProfile;
use App\Models\LandlordProfile;
use App\Models\Lease;
use App\Models\Plan;

#[Fillable(['name', 'email', 'password', 'phone', 'is_active', 'account_type'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser, MustVerifyEmail
{
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'is_active',
        'account_type',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function landlordProfiles(): BelongsToMany
    {
        return $this->belongsToMany(LandlordProfile::class, 'domain_user')
                    ->withPivot('role')
                    ->withTimestamps();
    }
    public function tenantProfile(): HasOne
    {
        return $this->hasOne(TenantProfile::class, 'user_id');
    }
    public function leases(): HasMany
{
    return $this->hasMany(Lease::class, 'tenant_id');
}
public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }
}