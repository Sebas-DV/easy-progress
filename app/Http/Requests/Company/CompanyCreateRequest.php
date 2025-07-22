<?php

namespace App\Http\Requests\Company;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'ruc' => [
                'required',
                'string',
                'size:13',
                'regex:/^\d{13}$/',
                Rule::unique('companies', 'ruc'),
            ],
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:1000',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('companies', 'email'),
            ],
            'commercial_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20|regex:/^[0-9\-\+\(\)\s]+$/',
            'mobile' => 'nullable|string|max:20|regex:/^[0-9\-\+\(\)\s]+$/',
            'website' => 'nullable|url|max:255',
            'taxpayer_type' => 'required|in:natural,juridica',
            'obligated_accounting' => 'boolean',
            'special_taxpayer_number' => 'nullable|string|max:255',
            'special_taxpayer_date' => 'nullable|date|before_or_equal:today',
            'retention_agent_resolution' => 'nullable|string|max:255',
            'retention_agent_date' => 'nullable|date|before_or_equal:today',
            'is_artisan' => 'boolean',
            'artisan_number' => [
                'nullable',
                'string',
                'max:255',
                'required_if:is_artisan,true',
            ],
            'electronic_signature_file' => 'nullable|string|max:255',
            'electronic_signature_password' => 'nullable|string|max:255',
            'electronic_signature_expiry' => 'nullable|date|after:today',
            'sri_environment' => 'nullable|in:1,2',
            'sri_token' => 'nullable|string|max:500',
            'sri_token_expiry' => 'nullable|date|after:today',
            'currency' => 'required|string|size:3|in:USD,COP,PEN,EUR,CAD,AUD',
            'timezone' => 'required|string|timezone',
            'logo' => 'nullable|string',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'ruc.required' => 'El RUC es requerido.',
            'ruc.size' => 'El RUC debe tener exactamente 13 dígitos.',
            'ruc.regex' => 'El RUC debe contener solo dígitos.',
            'ruc.unique' => 'Este RUC ya está registrado en el sistema.',
            'name.required' => 'La razón social es requerida.',
            'name.max' => 'La razón social no puede exceder 255 caracteres.',
            'address.required' => 'La dirección es requerida.',
            'address.max' => 'La dirección no puede exceder 1000 caracteres.',
            'email.required' => 'El email es requerido.',
            'email.email' => 'El email debe tener un formato válido.',
            'email.unique' => 'Este email ya está registrado en el sistema.',
            'phone.regex' => 'El teléfono tiene un formato inválido.',
            'mobile.regex' => 'El celular tiene un formato inválido.',
            'website.url' => 'El sitio web debe ser una URL válida.',
            'taxpayer_type.required' => 'El tipo de contribuyente es requerido.',
            'taxpayer_type.in' => 'El tipo de contribuyente debe ser "natural" o "juridica".',
            'special_taxpayer_date.before_or_equal' => 'La fecha de resolución no puede ser futura.',
            'retention_agent_date.before_or_equal' => 'La fecha de resolución no puede ser futura.',
            'artisan_number.required_if' => 'El número de calificación artesanal es requerido cuando es artesano.',
            'electronic_signature_expiry.after' => 'La fecha de expiración de la firma debe ser futura.',
            'sri_environment.in' => 'El ambiente SRI debe ser "1" (Pruebas) o "2" (Producción).',
            'sri_token_expiry.after' => 'La fecha de expiración del token debe ser futura.',
            'currency.required' => 'La moneda es requerida.',
            'currency.size' => 'La moneda debe tener 3 caracteres.',
            'currency.in' => 'La moneda seleccionada no es válida.',
            'timezone.required' => 'La zona horaria es requerida.',
            'timezone.timezone' => 'La zona horaria seleccionada no es válida.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'obligated_accounting' => $this->boolean('obligated_accounting'),
            'is_artisan' => $this->boolean('is_artisan'),
            'is_active' => $this->boolean('is_active', true),
        ]);

        if ($this->has('ruc'))
        {
            $this->merge([
                'ruc' => preg_replace('/[^0-9]/', '', $this->input('ruc')),
            ]);
        }

        if ($this->has('phone') && $this->input('phone'))
        {
            $this->merge([
                'phone' => preg_replace('/[^\d\-+()\s]/', '', $this->input('phone')),
            ]);
        }

        if ($this->has('mobile') && $this->input('mobile'))
        {
            $this->merge([
                'mobile' => preg_replace('/[^\d\-+()\s]/', '', $this->input('mobile')),
            ]);
        }
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator): void
    {
        // You can customize the response here if needed
        parent::failedValidation($validator);
    }
}
