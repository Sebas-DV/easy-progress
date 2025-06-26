<?php

namespace App\Enums\JournalEntryTypes;

enum Type: string
{
    case Opening = 'opening';
    case Normal = 'normal';
    case Adjustment = 'adjustment';
    case Closing = 'closing';
}
