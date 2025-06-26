<?php

namespace App\Models;

use App\Enums\BankTypes\Transaction;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BankTransaction extends Model
{
    use HasUuids;

    protected $fillable = [
        'bank_account_id',
        'transaction_type',
        'transaction_date',
        'referral_number',
        'beneficiary',
        'concept',
        'amount',
        'balance',
        'is_reconciled',
        'reconciliation_date',
        'user_id',
    ];

    protected $casts = [
        'transaction_type' => Transaction::class,
        'is_reconciled' => 'boolean',
    ];

    public function bankAccount(): BelongsTo
    {
        return $this->belongsTo(BankAccount::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
