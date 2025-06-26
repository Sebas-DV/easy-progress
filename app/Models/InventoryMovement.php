<?php

namespace App\Models;

use App\Enums\InventoryTypes\Movement;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryMovement extends Model
{
    use HasUuids;

    protected $fillable = [
        'product_id',
        'warehouse_id',
        'movement_type',
        'document_type',
        'document_id',
        'quantity',
        'unit_cost',
        'total_cost',
        'balance_quantity',
        'balance_cost',
        'notes',
        'user_id',
    ];

    protected $casts = [
        'movement_type' => Movement::class,
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
