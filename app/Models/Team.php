<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Jurager\Teams\Models\Team as TeamModel;

class Team extends TeamModel
{
    use HasUuids;

    protected $fillable = [
        'id',
        'user_id',
        'name',
        'description',
    ];
}
