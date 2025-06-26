<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseDetail extends Model
{
    use HasUuids;

    protected $fillable = [
        'purchase_id',
        'product_id',
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

    public function purchase(): BelongsTo
    {
        return $this->belongsTo(Purchase::class);
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
