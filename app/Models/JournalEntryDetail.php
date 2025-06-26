<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JournalEntryDetail extends Model
{
    use HasUuids;

    protected $fillable = [
        'journal_entry_id',
        'account_id',
        'description',
        'debit',
        'credit',
        'cost_center',
        'reference_document',
    ];

    public function journalEntry(): BelongsTo
    {
        return $this->belongsTo(JournalEntry::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }
}
