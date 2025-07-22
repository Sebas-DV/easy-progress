<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyUser extends Model
{
    use HasUuids;

    protected $fillable = [
        'company_id',
        'user_id',
        'is_active',
        'is_default',
        'is_owner',
        'last_accessed_at',
        'invited_at',
        'joined_at',
        'permissions',
    ];
    protected $casts = [
        'is_active' => 'boolean',
        'is_default' => 'boolean',
        'is_owner' => 'boolean',
        'last_accessed_at' => 'datetime',
        'invited_at' => 'datetime',
        'joined_at' => 'datetime',
        'permissions' => 'array',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    #[Scope]
    protected function active($query)
    {
        return $query->where('is_active', true);
    }

    #[Scope]
    protected function owners($query)
    {
        return $query->where('is_owner', true);
    }

    #[Scope]
    protected function forUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    #[Scope]
    protected function formCompany($query, $companyId)
    {
        return $query->where('company_id', $companyId);
    }
}
