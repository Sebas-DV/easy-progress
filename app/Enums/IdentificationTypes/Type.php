<?php

namespace App\Enums\IdentificationTypes;

enum Type: string
{
    case Ruc = '04';
    case Dni = '05';
    case Ce = '06';
    case Passport = '07';
    case ForeignId = '08';
    case Other = '09';
}
