<?php

namespace App\Services;

use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use InvalidArgumentException;

class FileHandler
{
    private static array $fileSettings = [
        'image' => [
            'allowed_mimes' => ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'],
            'allowed_extensions' => ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
            'max_size' => 2 * 1024 * 1024,
            'disk' => 'public',
            'base64_pattern' => '/^data:image\/(jpeg|jpg|png|gif|svg\+xml|webp);base64,(.+)$/',
        ],
        'document' => [
            'allowed_mimes' => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            'allowed_extensions' => ['pdf', 'doc', 'docx'],
            'max_size' => 10 * 1024 * 1024,
            'disk' => 'local',
            'folder' => 'documents',
            'base64_pattern' => '/^data:(application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document);base64,(.+)$/',
        ],
        'signature' => [
            'allowed_mimes' => ['application/x-pkcs12', 'application/octet-stream'],
            'allowed_extensions' => ['p12', 'pfx'],
            'max_size' => 5 * 1024 * 1024,
            'disk' => 'local',
            'folder' => 'signatures',
            'base64_pattern' => '/^data:(application\/x-pkcs12|application\/octet-stream);base64,(.+)$/',
        ],
        'excel' => [
            'allowed_mimes' => ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
            'allowed_extensions' => ['xls', 'xlsx', 'csv'],
            'max_size' => 5 * 1024 * 1024,
            'disk' => 'local',
            'folder' => 'excel',
            'base64_pattern' => '/^data:(application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|text\/csv);base64,(.+)$/',
        ],
        'video' => [
            'allowed_mimes' => ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'],
            'allowed_extensions' => ['mp4', 'mpeg', 'mov', 'webm'],
            'max_size' => 50 * 1024 * 1024,
            'disk' => 'public',
            'folder' => 'videos',
            'base64_pattern' => '/^data:video\/(mp4|mpeg|quicktime|webm);base64,(.+)$/',
        ],
        'audio' => [
            'allowed_mimes' => ['audio/mpeg', 'audio/wav', 'audio/ogg'],
            'allowed_extensions' => ['mp3', 'wav', 'ogg'],
            'max_size' => 10 * 1024 * 1024,
            'disk' => 'public',
            'folder' => 'audio',
            'base64_pattern' => '/^data:audio\/(mpeg|wav|ogg);base64,(.+)$/',
        ],
        'any' => [
            'allowed_mimes' => [],
            'allowed_extensions' => [],
            'max_size' => 10 * 1024 * 1024,
            'disk' => 'local',
            'folder' => 'files',
            'base64_pattern' => '/^data:([^;]+);base64,(.+)$/',
        ],
    ];

    public static function handleFile(
        $fileData,
        string $fileType,
        string $identifier,
        ?string $customFolder = null,
        array $options = [],
    ): ?string {
        if (empty($fileData))
        {
            return null;
        }

        $config = self::getFileConfiguration($fileType, $options);
        $folder = $customFolder ?? $config['folder'];

        if ($fileData instanceof UploadedFile)
        {
            return self::handleUploadedFile($fileData, $config, $folder, $identifier);
        }

        if (is_string($fileData) && self::isBase64($fileData))
        {
            return self::handleBase64File($fileData, $config, $folder, $identifier);
        }

        if (is_string($fileData) && !self::isBase64($fileData))
        {
            return $fileData;
        }

        return null;
    }

    private static function handleUploadedFile(
        UploadedFile $file,
        array $config,
        string $folder,
        string $identifier,
    ): string {
        self::validateUploadedFile($file, $config);

        $extension = $file->getClientOriginalExtension();
        $filename = self::generateFilename($folder, $identifier, $extension);

        if ($config['disk'] === 'public')
        {
            $path = $file->storeAs('files', $filename, 'public');

            return Storage::url($path);
        }
        else
        {
            return $file->storeAs('files', $filename, $config['disk']);
        }
    }

    private static function handleBase64File(
        string $base64Data,
        array $config,
        string $folder,
        string $identifier,
    ): string {
        self::validateBase64File($base64Data, $config);

        preg_match($config['base64_pattern'], $base64Data, $matches);

        if (empty($matches))
        {
            throw new InvalidArgumentException('Formato de base64 no válido para este tipo de archivo');
        }

        $mimeType = $matches[1];
        $fileData = base64_decode($matches[2]);

        $extension = self::getExtensionFromMimeType($mimeType);

        $filename = self::generateFilename($folder, $identifier, $extension);

        if ($config['disk'] === 'public')
        {
            Storage::disk('public')->put('files/' . $filename, $fileData);

            return Storage::url('files/' . $filename);
        }
        else
        {
            Storage::disk($config['disk'])->put('files/' . $filename, $fileData);

            return 'files/' . $filename;
        }
    }

    private static function validateUploadedFile(UploadedFile $file, array $config): void
    {
        if ($file->getSize() > $config['max_size'])
        {
            $maxSizeMB = round($config['max_size'] / (1024 * 1024), 2);

            throw new InvalidArgumentException("El archivo no puede exceder $maxSizeMB MB");
        }

        if (!empty($config['allowed_mimes']) && !in_array($file->getMimeType(), $config['allowed_mimes']))
        {
            $allowedTypes = implode(', ', $config['allowed_mimes']);

            throw new InvalidArgumentException("Tipo de archivo no permitido. Tipos permitidos: $allowedTypes");
        }

        if (!empty($config['allowed_extensions']))
        {
            $extension = strtolower($file->getClientOriginalExtension());
            if (!in_array($extension, $config['allowed_extensions']))
            {
                $allowedExts = implode(', ', $config['allowed_extensions']);

                throw new InvalidArgumentException("Extensión de archivo no permitida. Extensiones permitidas: $allowedExts");
            }
        }
    }

    private static function validateBase64File(string $base64Data, array $config): void
    {
        if (!preg_match($config['base64_pattern'], $base64Data))
        {
            throw new InvalidArgumentException('Formato de base64 no válido para este tipo de archivo');
        }

        $fileSize = self::getBase64FileSize($base64Data);
        if ($fileSize > $config['max_size'])
        {
            $maxSizeMB = round($config['max_size'] / (1024 * 1024), 2);

            throw new InvalidArgumentException("El archivo no puede exceder $maxSizeMB MB");
        }
    }

    private static function getFileConfiguration(string $fileType, array $options = []): array
    {
        $config = self::$fileSettings[$fileType] ?? self::$fileSettings['any'];

        return array_merge($config, $options);
    }

    private static function generateFilename(string $folder, string $identifier, string $extension): string
    {
        $timestamp = now()->format('Y-m-d_H-i-s');
        $id = Str::uuid();

        return "$folder/{$identifier}_{$timestamp}_$id.$extension";
    }

    private static function getExtensionFromMimeType(string $mimeType): string
    {
        $mimeToExtension = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'image/svg+xml' => 'svg',
            'image/webp' => 'webp',
            'application/pdf' => 'pdf',
            'application/msword' => 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
            'application/x-pkcs12' => 'p12',
            'application/octet-stream' => 'p12',
            'application/vnd.ms-excel' => 'xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'xlsx',
            'text/csv' => 'csv',
            'video/mp4' => 'mp4',
            'video/mpeg' => 'mpeg',
            'video/quicktime' => 'mov',
            'video/webm' => 'webm',
            'audio/mpeg' => 'mp3',
            'audio/wav' => 'wav',
            'audio/ogg' => 'ogg',
        ];

        return $mimeToExtension[$mimeType] ?? 'bin';
    }

    private static function isBase64(string $data): bool
    {
        return preg_match('/^data:[^;]+;base64,/', $data) === 1;
    }

    public static function getBase64FileSize(string $base64Data): int
    {
        $base64Content = preg_replace('/^data:[^;]+;base64,/', '', $base64Data);

        return strlen(base64_decode($base64Content));
    }

    public static function deleteFile(?string $filePath, string $disk = 'public'): bool
    {
        if (empty($filePath))
        {
            return false;
        }

        try
        {
            if (str_starts_with($filePath, '/storage/'))
            {
                $path = str_replace('/storage/', '', $filePath);

                return Storage::disk('public')->delete($path);
            }

            return Storage::disk($disk)->delete($filePath);
        }
        catch (Exception $e)
        {
            Log::error('Error deleting file: ' . $e->getMessage(), ['file_path' => $filePath]);

            return false;
        }
    }

    public static function getFileUrl(?string $filePath, string $disk = 'public'): ?string
    {
        if (empty($filePath))
        {
            return null;
        }

        if (str_starts_with($filePath, 'http') || str_starts_with($filePath, '/storage/'))
        {
            return $filePath;
        }

        if ($disk === 'public')
        {
            return Storage::url($filePath);
        }

        return route('files.download', ['path' => encrypt($filePath)]);
    }

    public static function handleImage($imageData, string $identifier, ?string $customFolder = null): ?string
    {
        return self::handleFile($imageData, 'image', $identifier, $customFolder);
    }

    public static function handleDocument($documentData, string $identifier, ?string $customFolder = null): ?string
    {
        return self::handleFile($documentData, 'document', $identifier, $customFolder);
    }

    public static function handleSignature($signatureData, string $identifier, ?string $customFolder = null): ?string
    {
        return self::handleFile($signatureData, 'signature', $identifier, $customFolder);
    }

    public static function handleExcel($excelData, string $identifier, ?string $customFolder = null): ?string
    {
        return self::handleFile($excelData, 'excel', $identifier, $customFolder);
    }

    public static function addFileType(string $type, array $settings): void
    {
        self::$fileSettings[$type] = $settings;
    }

    public static function getSupportedFileTypes(): array
    {
        return array_keys(self::$fileSettings);
    }
}
