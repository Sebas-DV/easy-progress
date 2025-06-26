<?php

namespace App\Enums\BankTypes;

enum Transaction: string
{
    case Deposit = 'deposit';
    case Withdrawal = 'withdrawal';
    case Transfer = 'transfer';
    case Check = 'check';
    case Fee = 'fee';
}
