<?php

namespace App\Enums\AccountTypes;

enum Type: string
{
    case Debit = 'debit';
    case Credit = 'credit';
}
