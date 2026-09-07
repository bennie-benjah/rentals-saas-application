<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\User;
use App\Models\Plan;
class LandlordProfile extends Model
{
    protected $fillable = [
        'user_id','plan_id', 'subdomain', 'owner_type', 'dob', 'id_type', 'id_number', 'address', 'city', 'country',
        'legal_name', 'entity_type', 'tax_id', 'years_operating', 'portfolio_size', 'website',
        'payout_method', 'bank_name', 'account_name', 'account_number', 'routing_number',
        'mpesa_number', 'paypal_email', 'currency',
        'proof_type', 'tos_ack', 'tax_ack', 'signature',
    ];

    protected $casts = [
        'dob' => 'date',
        'tos_ack' => 'boolean',
        'tax_ack' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function domainUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'domain_user')
            ->withPivot('role')
            ->withTimestamps();
    }
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }
}