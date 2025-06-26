<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Withholding extends Model
{
    use HasUuids;

    protected $fillable = [
        'company_id',
        'establishment_id',
        'emission_point_id',
        'supplier_id',
        'purchase_id',
        'sequential_number',
        'access_key',
        'authorization_number',
        'authorization_code',
        'issue_date',
        'type',
        'status',
        'total_retained',
        'xml_file',
        'pdf_file',
        'user_id',
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

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function purchase(): BelongsTo
    {
        return $this->belongsTo(Purchase::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
