<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Jurager\Teams\Traits\HasTeams;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasTeams;
    use HasUuids;
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'current_team_id',
        'current_company_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function currentTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'current_team_id');
    }

    public function currentCompany(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'current_company_id');
    }

    public function companies(): BelongsToMany
    {
        return $this->belongsToMany(Company::class, 'company_users')
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

    public function activeCompanies(): BelongsToMany
    {
        return $this->companies()->wherePivot('is_active', true);
    }

    public function ownedCompanies(): BelongsToMany
    {
        return $this->companies()->wherePivot('is_owner', true);
    }

    public function defaultCompany()
    {
        return $this->companies()
            ->wherePivot('is_default', true)
            ->wherePivot('is_active', true)
            ->first();
    }

    public function isOwnerOf(Company $company): bool
    {
        return $this->ownedCompanies()->where('companies.id', $company->id)->exists();
    }

    public function setDefaultCompany(Company $company): void
    {
        // Remove default from all companies
        $this->companies()->updateExistingPivot($this->defaultCompany()->id, ['is_default' => false]);

        // Set the new default company
        $this->companies()->updateExistingPivot($company->id, ['is_default' => true]);
    }
}
