<?php

namespace App\Models;

use App\Enums\CashTypes\Status;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CashMovement extends Model
{
    use HasUuids;

    protected $fillable = [
        'cash_register_id',
        'user_id',
        'opening_date',
        'closing_date',
        'opening_balance',
        'cash_sales',
        'cash_income',
        'cash_expenses',
        'expected_balance',
        'actual_balance',
        'difference',
        'notes',
        'status',
    ];

    protected $casts = [
        'status' => Status::class,
    ];

    public function cashRegister(): BelongsTo
    {
        return $this->belongsTo(CashRegister::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
