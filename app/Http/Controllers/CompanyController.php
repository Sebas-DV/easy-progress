<?php

namespace App\Http\Controllers;

use App\Http\Requests\Company\CompanyCreateRequest;
use App\Http\Requests\Company\CompanyUpdateRequest;
use App\Models\Company;
use App\Models\CompanyUser;
use App\Services\FileHandler;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class CompanyController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('companies/create');
    }

    /**
     * Store a newly created company in storage.
     *
     * @throws Throwable
     */
    public function store(CompanyCreateRequest $request): JsonResponse
    {
        try
        {
            return DB::transaction(function () use ($request)
            {
                $validated = $request->validated();
                $user = auth()->user();

                $companyId = Str::uuid();

                $validated['logo'] = FileHandler::handleImage(
                    $request->file('logo') ?? $request->input('logo'),
                    $companyId,
                    'companies-logos',
                );

                $validated['electronic_signature'] = FileHandler::handleImage(
                    $request->file('electronic_signature_file') ?? $request->input('electronic_signature_file'),
                    $companyId,
                    'companies-electronic-signatures',
                );

                $validated['team_id'] = $user->current_team_id;
                $validated['id'] = $companyId;

                $company = Company::create($validated);

                $isFirstCompany = $user->companies()->count() === 0;

                CompanyUser::create([
                    'company_id' => $company->id,
                    'user_id' => $user->id,
                    'is_active' => true,
                    'is_default' => $isFirstCompany,
                    'is_owner' => true,
                    'joined_at' => now(),
                ]);

                if ($isFirstCompany || !$user->current_company_id)
                {
                    $user->update(['current_company_id' => $company->id]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Company created successfully.',
                ]);
            });
        }
        catch (Exception $e)
        {
            return response()->json([
                'message' => 'Failed to create company: ' . $e->getMessage(),
                'success' => false,
            ], 500);
        }
    }

    public function list(): JsonResponse
    {
        try
        {
            $user = auth()->user();

            $companies = $user->activeCompanies()
                ->select('companies.id', 'companies.ruc', 'companies.name')
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

            return response()->json([
                'success' => true,
                'data' => $companies,
                'current_company_id' => $user->current_company_id,
            ]);
        }
        catch (Exception $e)
        {
            return response()->json([
                'message' => 'Failed to retrieve companies: ' . $e->getMessage(),
                'success' => false,
            ], 500);
        }
    }

    public function update(CompanyUpdateRequest $request): JsonResponse
    {
    }
}
