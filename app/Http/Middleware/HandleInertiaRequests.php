<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        if (!$user)
        {
            return [
                'name' => config('app.name'),
                'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            ];
        }

        $user->makeHidden(['owned_teams', 'created_at', 'updated_at']);
        $teams = $user->allTeams()->each(fn ($team) => $team->makeHidden(['created_at', 'updated_at']))->values();
        $currentTeam = $user->currentTeam?->makeHidden(['created_at', 'updated_at']);

        $companies = $user->activeCompanies()
            ->select(['companies.id', 'companies.ruc', 'companies.name'])
            ->get()
            ->map(function ($company) use ($user)
            {
                return [
                    'id' => $company->id,
                    'ruc' => $company->ruc,
                    'name' => $company->name,
                    'is_current' => $user->current_company_id === $company->id,
                    'is_owner' => $user->isOwnerOf($company),
                    'is_default' => $user->defaultCompany()?->id === $company->id,
                ];
            });
        $currentCompany = $user->currentCompany?->only(['id', 'ruc', 'name']);

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
                'teams' => $teams,
                'current_team' => $currentTeam,
                'companies' => $companies,
                'current_company' => $currentCompany,
            ],
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
