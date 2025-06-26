<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreditNoteDetail extends Model
{
    use HasUuids;

    protected $fillable = [
        'credit_note_id',
        'product_id',
        'main_code',
        'auxiliary_code',
        'description',
        'quantity',
        'unit_price',
        'discount',
        'subtotal',
        'tax_rate_id',
        'tax_base',
        'tax_value',
        'total',
    ];

    public function creditNote(): BelongsTo
    {
        return $this->belongsTo(CreditNote::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function taxRate(): BelongsTo
    {
        return $this->belongsTo(TaxRate::class);
    }
}
