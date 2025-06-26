<?php

namespace App\Models;

use App\Enums\AccountTypes\Category;
use App\Enums\AccountTypes\Type;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AccountType extends Model
{
    use HasUuids;

    protected $fillable = [
        'code',
        'name',
        'nature',
        'category',
    ];

    protected $casts = [
        'nature' => Type::class,
        'category' => Category::class,
    ];

    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class);
    }
}
