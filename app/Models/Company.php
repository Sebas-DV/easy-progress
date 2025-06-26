<?php

namespace App\Models;

use App\Enums\SriEnvironment;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Jurager\Teams\Models\Team;

class Company extends Model
{
    use HasUuids;

    protected $fillable = [
        'team_id',
        'ruc',
        'name',
        'commercial_name',
        'address',
        'phone',
        'email',
        'logo',
        'electronic_signature_file',
        'electronic_signature_password',
        'obligated_accounting',
        'special_taxpayer_number',
        'retention_agent_resolution',
        'sri_environment',
        'is_active',
    ];

    protected $casts = [
        'obligated_accounting' => 'boolean',
        'is_active' => 'boolean',
        'sri_environment' => SriEnvironment::class
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
