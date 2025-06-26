<?php

namespace App\Enums\DocumentTypes;

enum TypeCode: string
{
    case Invoice = '01';
    case CreditNote = '02';
    case DebitNote = '03';
    case Receipt = '04';
    case QuotationInvoice = '05';
    case DeliveryNote = '06';
    case TransportDocument = '07';
}
