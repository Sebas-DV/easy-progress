<?php

namespace App\Services;

use App\Models\Company;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CompanyService
{
    /**
     * @throws \Throwable
     */
    public function createCompanyWithOwner(array $company, User $user, Team $team)
    {
        return DB::transaction(function () use ($company, $user, $team)
        {
            $company = Company::create([
                ...$company,
                'team_id' => $team->id,
            ]);

            $this->addOwnerToCompany($company, $user);

            return $company;
        });
    }

    public function addOwnerToCompany(Company $company, User $user, array $options = []): void
    {
        $isFirstCompany = $user->companies()->count() === 0;

        $company->users()->attach($user->id, [
            'is_active' => true,
            'is_default' => $options['is_default'] ?? $isFirstCompany,
            'is_owner' => true,
            'role_id' => $options['role_id'] ?? null,
            'joined_at' => now(),
        ]);
    }
}
