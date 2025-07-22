<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'mobile',
        'email',
        'website',
        'taxpayer_type',
        'obligated_accounting',
        'special_taxpayer_number',
        'special_taxpayer_date',
        'retention_agent_resolution',
        'retention_agent_date',
        'is_artisan',
        'artisan_number',
        'electronic_signature_file',
        'electronic_signature_password',
        'electronic_signature_expiry',
        'sri_environment',
        'sri_token',
        'sri_token_expiry',
        'logo',
        'currency',
        'timezone',
        'is_active',
        'settings',
    ];
    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
        'is_artisan' => 'boolean',
        'obligated_accounting' => 'boolean',
        'special_taxpayer_date' => 'datetime',
        'retention_agent_date' => 'datetime',
        'electronic_signature_expiry' => 'datetime',
        'sri_token_expiry' => 'datetime',
    ];
    protected $hidden = [
        'electronic_signature_file',
        'electronic_signature_password',
        'sri_token',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'company_users')
            ->withPivot([
                'is_active',
                'is_default',
                'is_owner',
                'last_accessed_at',
                'invited_at',
                'joined_at',
                'permissions',
            ])
            ->withTimestamps();
    }

    public function activeUsers(): BelongsToMany
    {
        return $this->users()->wherePivot('is_active', true);
    }

    public function owners(): BelongsToMany
    {
        return $this->users()->wherePivot('is_owner', true);
    }

    public function primaryOwner()
    {
        return $this->owners()->orderBy('company_users.created_at')->first();
    }

    public function companyUsers(): HasMany
    {
        return $this->hasMany(CompanyUser::class);
    }

    #[Scope]
    protected function active($query)
    {
        return $query->where('is_active', true);
    }

    #[Scope]
    protected function forTeam($query, $teamId)
    {
        return $query->where('team_id', $teamId);
    }

    public function isOwnedBy(User $user): bool
    {
        return $this->owners()->where('users.id', $user->id)->exists();
    }

    public function getUserRole(User $user)
    {
        $company = $this->users()
            ->where('users.id', $user->id)
            ->first();

        return $company ? $company->pivot->role_id : null;
    }
}
