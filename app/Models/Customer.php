<?php

namespace App\Models;

use App\Enums\IdentificationTypes\Type;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Customer extends Model
{
    use HasUuids;

    protected $fillable = [
        'company_id',
        'identification_type',
        'identification_number',
        'business_name',
        'comercial_name',
        'address',
        'phone',
        'mobile',
        'email',
        'credit_limit',
        'credit_days',
        'is_active',
    ];

    protected $casts = [
        'identification_type' => Type::class,
        'is_active' => 'boolean',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
