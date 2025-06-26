<?php

namespace App\Enums\CashTypes;

enum Transaction: string
{
    case Income = 'income';
    case Expense = 'expense';
}
