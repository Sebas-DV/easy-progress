<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SystemSetting extends Model
{
    use HasUuids;

    protected $fillable = [
        'company_id',
        'key',
        'value',
        'type',
        'description',
    ];

    protected $casts = [
        'value' => 'array',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
