<?php

namespace App\Enums\JournalEntryTypes;

enum Status: string
{
    case Draft = 'draft';
    case Posted = 'posted';
    case Cancelled = 'cancelled';
}
