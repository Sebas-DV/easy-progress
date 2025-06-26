<?php

namespace App\Enums\InventoryTypes;

enum Movement: string
{
    case In = 'in';
    case Out = 'out';
    case Transfer = 'transfer';
}
