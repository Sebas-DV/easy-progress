<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmissionPoint extends Model
{
    use HasUuids;

    protected $fillable = [
        'establishment_id',
        'code',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function establishment(): BelongsTo
    {
        return $this->belongsTo(Establishment::class);
    }
}
