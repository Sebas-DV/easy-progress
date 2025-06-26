<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WithholdingDetail extends Model
{
    use HasUuids;

    protected $fillable = [
        'withholding_id',
        'tax_type',
        'tax_code',
        'tax_base',
        'percentage',
        'retained_value',
        'fiscal_period',
    ];

    public function withholding(): BelongsTo
    {
        return $this->belongsTo(Withholding::class);
    }
}
