<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Inertia\Testing\Concerns\Has;

class TaxRate extends Model
{
    use HasUuids;

    protected $fillable = [
        'code',
        'name',
        'rate',
        'tax_type',
        'is_active',
        'valid_from',
        'valid_until',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
