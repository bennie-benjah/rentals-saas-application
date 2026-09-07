<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Support\Str;


class Invoice extends Model
{
    protected $fillable = [
        'lease_id', 'reference', 'amount_due', 'amount_paid', 'currency',
        'period_start', 'period_end', 'due_date', 'status', 'reminder_sent_at',
    ];

    protected $casts = [
        'amount_due' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'period_start' => 'date',
        'period_end' => 'date',
        'due_date' => 'date',
        'reminder_sent_at' => 'datetime',
    ];

    public function lease(): BelongsTo
    {
        return $this->belongsTo(Lease::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function getBalanceAttribute(): float
    {
        return (float) $this->amount_due - (float) $this->amount_paid;
    }

    public function markPaidIfSettled(): void
    {
        if ($this->amount_paid >= $this->amount_due) {
            $this->update(['status' => 'paid']);
        } elseif ($this->amount_paid > 0) {
            $this->update(['status' => 'partial']);
        }
    }
    public function tenant(): HasOneThrough
{
    return $this->hasOneThrough(
        User::class,  // Target model
        Lease::class, // Intermediate model
        'id',         // Foreign key on leases table...
        'id',         // Foreign key on users table...
        'lease_id',   // Local key on invoices table...
        'tenant_id'   // Local key on leases table...
    );
}
    protected static function booted(): void
{
    static::creating(function ($invoice) {
        if (empty($invoice->reference)) {
            $invoice->reference = 'INV-' . strtoupper(Str::random(8));
        }

        // Ensure status matches schema requirements
        if ($invoice->status === 'pending') {
            $invoice->status = 'unpaid'; // Or 'PENDING' depending on your schema
        }
    });
}
}
