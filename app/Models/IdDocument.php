<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class IdDocument extends Model
{
    use HasUuids;

    protected $fillable = [
        'owner_id', 'kind', 'slot', 'disk', 'file_path', 'file_name',
        'size_bytes', 'mime_type', 'sha256', 'status', 'review_notes',
        'reviewed_by', 'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function accessLogs(): HasMany
    {
        return $this->hasMany(IdDocumentAccessLog::class, 'document_id');
    }
}
