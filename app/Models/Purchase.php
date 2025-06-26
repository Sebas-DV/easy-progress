<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Purchase extends Model
{
    use HasUuids;

    protected $fillable = [
        'company_id',
        'supplier_id',
        'document_type',
        'establishment',
        'emission_point',
        'sequential',
        'authorization_number',
        'issue_date',
        'accounting_date',
        'subtotal_iva_0',
        'subtotal_iva',
        'subtotal_no_iva',
        'subtotal_exempt',
        'discount',
        'ice_value',
        'iva_value',
        'total',
        'status',
        'user_id',
    ];

    protected $casts = [
        'issue_date' => 'datetime',
        'accounting_date' => 'datetime',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
