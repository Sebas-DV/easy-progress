<?php

namespace App\Models;

use App\Enums\DocumentTypes\Status;
use App\Enums\DocumentTypes\Type;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    use HasUuids;

    protected $fillable = [
        'company_id',
        'establishment_id',
        'emission_point_id',
        'customer_id',
        'sequential_number',
        'access_key',
        'authorization_code',
        'authorization_date',
        'issue_date',
        'type',
        'status',
        'subtotal_iva_0',
        'subtotal_iva',
        'subtotal_no_iva',
        'subtotal_exempt',
        'discount',
        'ice_value',
        'iva_value',
        'total',
        'additional_information',
        'xml_file',
        'pdf_file',
        'user_id',
    ];

    protected $casts = [
        'type' => Type::class,
        'status' => Status::class,
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function establishment(): BelongsTo
    {
        return $this->belongsTo(Establishment::class);
    }

    public function emissionPoint(): BelongsTo
    {
        return $this->belongsTo(EmissionPoint::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(InvoiceDetail::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
