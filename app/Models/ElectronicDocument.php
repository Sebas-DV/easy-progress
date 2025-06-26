<?php

namespace App\Models;

use App\Enums\SriEnvironment;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Enums\DocumentTypes\ElectronicDocument as DocumentStatus;

class ElectronicDocument extends Model
{
    use HasUuids;

    protected $fillable = [
        'company_id',
        'document_type',
        'access_key',
        'authorization_number',
        'authorization_date',
        'environment',
        'status',
        'sri_message',
        'xml_content',
        'xml_file',
        'pdf_file',
        'send_attempts',
        'last_send_attempt',
    ];

    protected $casts = [
        'environment' => SriEnvironment::class,
        'status' => DocumentStatus::class,
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
