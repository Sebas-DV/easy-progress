<?php

namespace App\Models;

use App\Enums\JournalEntryTypes\Status;
use App\Enums\JournalEntryTypes\Type;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JournalEntry extends Model
{
    use HasUuids;

    protected $fillable = [
        'company_id',
        'accounting_period_id',
        'entry_number',
        'entry_date',
        'entry_type',
        'description',
        'reference_type',
        'reference_id',
        'total_debit',
        'total_credit',
        'status',
    ];

    protected $casts = [
        'status' => Status::class,
        'entry_type' => Type::class,
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function accountingPeriod(): BelongsTo
    {
        return $this->belongsTo(AccountingPeriod::class);
    }

    public function journalEntries(): HasMany
    {
        return $this->hasMany(JournalEntryDetail::class, 'journal_entry_id');
    }
}
