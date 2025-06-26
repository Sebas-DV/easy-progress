<?php

namespace App\Enums\CashTypes;

enum Status: string
{
    case Open = 'open';
    case Closed = 'closed';
}
