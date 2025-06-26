<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuotationDetail extends Model
{
    use HasUuids;

    protected $fillable = [
        'quotation_id',
        'product_id',
        'product_price_id',
        'description',
        'quantity',
        'unit_price',
        'discount',
        'subtotal',
        'tax_rate_id',
        'tax_amount',
        'total',
    ];

    public function quotation(): BelongsTo
    {
        return $this->belongsTo(Quotation::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function productPrice(): BelongsTo
    {
        return $this->belongsTo(ProductPrice::class);
    }

    public function taxRate(): BelongsTo
    {
        return $this->belongsTo(TaxRate::class);
    }
}
