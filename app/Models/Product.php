<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasUuids;

    protected $fillable = [
        'company_id',
        'category_id',
        'unit_of_measure_id',
        'tax_rate_id',
        'code',
        'barcode',
        'name',
        'description',
        'type',
        'is_inventoriable',
        'cost',
        'minium_stock',
        'maximum_stock',
        'has_multiple_prices',
        'is_active',
    ];

    protected $casts = [
        'is_inventoriable' => 'boolean',
        'has_multiple_prices' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class);
    }

    public function unitOfMeasure(): BelongsTo
    {
        return $this->belongsTo(UnitOfMeasure::class);
    }

    public function taxRate(): BelongsTo
    {
        return $this->belongsTo(TaxRate::class);
    }

    public function inventoryMovements(): HasMany
    {
        return $this->hasMany(InventoryMovement::class);
    }
}
