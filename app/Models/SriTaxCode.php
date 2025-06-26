<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SriTaxCode extends Model
{
    use HasUuids;

    protected $fillable = [
        'tax_type',
        'code',
        'description',
        'percentage',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
