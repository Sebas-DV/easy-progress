<?php

namespace App\Models;

use App\Enums\CashTypes\Transaction;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CashTransaction extends Model
{
    use HasUuids;

    protected $fillable = [
        'cash_movement_id',
        'transaction_type',
        'document_type',
        'document_id',
        'description',
        'amount',
        'user_id',
    ];

    protected $casts = [
        'transaction_type' => Transaction::class,
    ];

    public function cashMovement(): BelongsTo
    {
        return $this->belongsTo(CashMovement::class, 'cash_movement_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
