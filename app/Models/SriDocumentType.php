<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SriDocumentType extends Model
{
    use HasUuids;

    protected $fillable = [
        'code',
        'name',
        'is_electronic',
        'is_active',
    ];

    protected $casts = [
        'is_electronic' => 'boolean',
        'is_active' => 'boolean',
    ];
}
