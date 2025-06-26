<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Quotation extends Model
{
    use HasUuids;

    protected $fillable = [
        'company_id',
        'customer_id',
        'quotation_number',
        'issue_date',
        'expiry_date',
        'status',
        'subtotal',
        'discount',
        'tax_amount',
        'total',
        'terms_conditions',
        'notes',
        'user_id',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
