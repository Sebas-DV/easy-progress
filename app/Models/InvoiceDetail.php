<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceDetail extends Model
{
    use HasUuids;

    protected $fillable = [
        'invoice_id',
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

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
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
