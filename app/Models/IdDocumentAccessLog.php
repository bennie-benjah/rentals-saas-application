<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IdDocumentAccessLog extends Model
{
    use HasUuids;

    public $timestamps = true;

    protected $table = 'id_document_access_log';

    protected $fillable = [
        'document_id', 'actor_id', 'actor_role', 'action', 'ip_address', 'user_agent', 'notes',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(IdDocument::class, 'document_id');
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }
}
