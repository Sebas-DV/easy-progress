<?php

namespace App\Enums\DocumentTypes;

enum ElectronicDocument: string
{
    case Created = 'created';
    case Signed = 'signed';
    case Sent = 'sent';
    case Received = 'received';
    case Authorized = 'authorized';
    case Rejected = 'rejected';
}
