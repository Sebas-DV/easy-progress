<?php

namespace App\Enums\DocumentTypes;

enum Status: string
{
    case Draft = 'draft';
    case Issued = 'issued';
    case Authorized = 'authorized';
    case Cancelled = 'cancelled';
}
