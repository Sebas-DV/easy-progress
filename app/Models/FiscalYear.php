<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FiscalYear extends Model
{
    use HasUuids;

    protected $fillable = [
        'company_id',
        'year',
        'start_date',
        'end_date',
        'is_closed',
    ];

    protected $casts = [
        'is_closed' => 'boolean',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
