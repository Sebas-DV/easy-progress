export interface CreateCompanyRequest {
  ruc: string;
  name: string;
  commercial_name: string;
  address: string;
  phone: string;
  mobile: string;
  email: string;
  website: string;

  taxpayer_type: 'natural' | 'juridica';
  obligated_accounting: boolean;
  special_taxpayer_number: string;
  special_taxpayer_date: Date | null;
  retention_agent_resolution: string;
  retention_agent_date: Date | null;
  is_artisan: boolean;
  artisan_number: string;

  electronic_signature_file: string;
  electronic_signature_password: string;
  electronic_signature_expiry: Date | null;
  sri_environment: '1' | '2';
  sri_token: string;
  sri_token_expiry: Date | null;

  logo: string;
  currency: string;
  timezone: string;
  is_active: boolean;
  settings: Record<string, string>;
}

export interface UserCompanyResponse {
  success: boolean;
  data: {
    id: string;
    ruc: string;
    name: string;
    is_current: boolean;
    is_active: boolean;
    is_default: boolean;
  }[];
  current_company_id: string | null;
}
