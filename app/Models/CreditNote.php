<?php

namespace App\Models;

use App\Enums\DocumentTypes\Status;
use App\Enums\DocumentTypes\Type;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreditNote extends Model
{
    use HasUuids;

    protected $fillable = [
        'company_id',
        'establishment_id',
        'emission_point_id',
        'customer_id',
        'inventory_id',
        'sequential_number',
        'access_key',
        'authorization_number',
        'authorization_date',
        'issue_date',
        'modified_document_type',
        'modified_document_number',
        'modified_document_date',
        'reason',
        'type',
        'status',
        'subtotal_iva_0',
        'subtotal_iva',
        'subtotal_no_iva',
        'subtotal_exempt',
        'iva_value',
        'total',
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

    public function inventory(): BelongsTo
    {
        return $this->belongsTo(Inventory::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
