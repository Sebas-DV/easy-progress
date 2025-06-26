<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Bank extends Model
{
    use HasUuids;

    protected $fillable = [
        'code',
        'name',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
