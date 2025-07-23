<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\TeamController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function ()
{
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function (): void
{
    Route::group(['prefix' => 'dashboard'], function ()
    {
        Route::get('/', function ()
        {
            return Inertia::render('dashboard');
        })->name('dashboard');

        Route::get('categories', function ()
        {
            return Inertia::render('categories/page');
        })->name('categories.index');

        Route::group(['prefix' => 'companies'], function ()
        {
            Route::get('/create', [CompanyController::class, 'create'])->name('company.create');
        });
    });

    Route::group(['prefix' => 'v1/backend'], function ()
    {
        Route::group(['prefix' => 'teams'], function ()
        {
            Route::post('add', [TeamController::class, 'add'])->name('teams.add');
            Route::post('update', [TeamController::class, 'update'])->name('teams.update');
            Route::delete('delete/{team}', [TeamController::class, 'delete'])->name('teams.delete');
            Route::post('switch', [TeamController::class, 'switch'])->name('teams.switch');
        });

        Route::group(['prefix' => 'companies'], function ()
        {
            Route::get('list', [CompanyController::class, 'list'])->name('companies.list');
            Route::post('create', [CompanyController::class, 'store'])->name('companies.create');
            Route::post('update', [CompanyController::class, 'update'])->name('companies.update');
        });
    });
});

require __DIR__ . '/settings.php';

require __DIR__ . '/auth.php';
