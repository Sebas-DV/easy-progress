<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasUuids;

    protected $fillable = [
        'sri_code',
        'name',
        'requires_bank_account',
        'is_active',
    ];

    protected $casts = [
        'requires_bank_account' => 'boolean',
        'is_active' => 'boolean',
    ];
}
