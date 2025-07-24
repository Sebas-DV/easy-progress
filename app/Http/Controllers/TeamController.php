<?php

namespace App\Http\Controllers;

use App\Http\Requests\Team\TeamCreateRequest;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class TeamController extends Controller
{
    public function add(TeamCreateRequest $request): RedirectResponse
    {
        try
        {
            DB::transaction(function () use ($request)
            {
                $team = Team::create([
                    'name' => $request->name,
                    'description' => $request->description,
                    'user_id' => Auth::id(),
                ]);

                auth()->user()->update([
                    'current_team_id' => $team->id,
                ]);
            });

            return response()->redirectTo('dashboard')->with('success', 'Team created successfully.');
        }
        catch (Throwable $t)
        {
            Log::error('Team creation failed.' . $t->getMessage());

            return response()->redirectTo('dashboard')->with('error', 'Team creation failed.');
        }
    }

    public function switch()
    {
    }
}
