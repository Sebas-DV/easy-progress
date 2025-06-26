<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Account extends Model
{
    use HasUuids;

    protected $fillable = [
        'company_id',
        'account_type_id',
        'parent_id',
        'code',
        'name',
        'description',
        'is_detail',
        'is_active',
        'level',
    ];

    protected $casts = [
        'is_detail' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function accountType(): BelongsTo
    {
        return $this->belongsTo(AccountType::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'parent_id');
    }
}
