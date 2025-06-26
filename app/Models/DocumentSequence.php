<?php

namespace App\Models;

use App\Enums\DocumentTypes\TypeCode;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentSequence extends Model
{
    use HasUuids;

    protected $fillable = [
        'emission_point_id',
        'document_type',
        'current_sequential',
        'start_sequential',
        'end_sequential',
        'is_active',
    ];

    protected $casts = [
        'document_type' => TypeCode::class,
        'is_active' => 'boolean',
    ];

    public function emissionPoint(): BelongsTo
    {
        return $this->belongsTo(EmissionPoint::class);
    }
}
