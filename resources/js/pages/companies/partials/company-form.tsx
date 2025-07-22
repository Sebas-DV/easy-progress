import { ImageCrop } from '@/components/image-crop';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  AlertTriangle,
  Building2,
  CalendarIcon,
  Check,
  CheckCircle,
  Clock,
  CreditCard,
  Crop,
  FileText,
  Globe,
  ImageIcon,
  Settings,
  Shield,
  Upload,
  XCircle,
  Zap,
} from 'lucide-react';
import React, { JSX, memo, useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import timezoneList from 'timezones-list';
import { withMask } from 'use-mask-input';
import { z } from 'zod';

const businessConfigSchema = z
  .object({
    ruc: z
      .string({
        error: 'RUC es requerido',
      })
      .min(13, {
        error: 'RUC debe tener 13 dígitos',
      })
      .max(13, {
        error: 'RUC debe tener 13 dígitos',
      })
      .regex(/^\d{13}$/, 'RUC debe tener 13 dígitos'),
    name: z
      .string({
        error: 'Razón social es requerida',
      })
      .min(1, {
        error: 'Razón social es requerida',
      }),
    commercial_name: z.string().optional(),
    address: z.string({ error: 'Dirección es requerida' }).min(1, {
      error: 'Dirección es requerida',
    }),
    phone: z.string().optional(),
    mobile: z.string().optional(),
    email: z.string({
      error: 'Email es requerido',
    }),
    website: z.string(),
    taxpayer_type: z.enum(['natural', 'juridica']),
    obligated_accounting: z.boolean(),
    special_taxpayer_number: z.string().optional(),
    special_taxpayer_date: z.date().optional().nullable(),
    retention_agent_resolution: z.string().optional(),
    retention_agent_date: z.date().optional().nullable(),
    is_artisan: z.boolean(),
    artisan_number: z.string().optional(),
    electronic_signature_file: z.string().optional(),
    electronic_signature_password: z.string().optional(),
    electronic_signature_expiry: z.date().optional().nullable(),
    sri_environment: z.enum(['1', '2']).optional(),
    sri_token: z.string().optional(),
    sri_token_expiry: z.date().optional().nullable(),
    logo: z.string().optional(),
    currency: z.string(),
    timezone: z.string(),
    is_active: z.boolean(),
  })
  .refine(
    (data) => {
      return !(data.is_artisan && (!data.artisan_number || data.artisan_number.trim().length === 0));
    },
    {
      message: 'Número de calificación artesanal es requerido cuando es artesano',
      path: ['artisan_number'],
    },
  )
  .refine(
    (data) => {
      return !(data.special_taxpayer_number && data.special_taxpayer_number.trim().length > 0 && !data.special_taxpayer_date);
    },
    {
      message: 'Fecha de resolución es requerida cuando se especifica el número de resolución',
      path: ['special_taxpayer_date'],
    },
  )
  .refine(
    (data) => {
      return !(data.retention_agent_resolution && data.retention_agent_resolution.trim().length > 0 && !data.retention_agent_date);
    },
    {
      message: 'Fecha de resolución es requerida cuando se especifica la resolución de agente de retención',
      path: ['retention_agent_date'],
    },
  )
  .refine(
    (data) => {
      return !(
        data.electronic_signature_file &&
        data.electronic_signature_file.trim().length > 0 &&
        (!data.electronic_signature_password || data.electronic_signature_password.trim().length === 0)
      );
    },
    {
      message: 'Contraseña de firma electrónica es requerida cuando se carga un archivo de firma',
      path: ['electronic_signature_password'],
    },
  )
  .refine(
    (data) => {
      return !(data.electronic_signature_file && data.electronic_signature_file.trim().length > 0 && !data.electronic_signature_expiry);
    },
    {
      message: 'Fecha de expiración es requerida cuando se carga un archivo de firma electrónica',
      path: ['electronic_signature_expiry'],
    },
  )
  .refine(
    (data) => {
      return !(data.sri_token && data.sri_token.trim().length > 0 && !data.sri_token_expiry);
    },
    {
      message: 'Fecha de expiración del token es requerida cuando se especifica un token SRI',
      path: ['sri_token_expiry'],
    },
  );

const DEFAULT_VALUES: Partial<BusinessConfig> = {
  is_artisan: false,
  is_active: false,
  obligated_accounting: false,
};

type BusinessConfig = z.infer<typeof businessConfigSchema>;

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  completed: boolean;
  hasErrors: boolean;
}

interface DatePickerProps {
  date: Date | null | undefined;
  onDateChange: (date: Date | null | undefined) => void;
  placeholder?: string;
}

interface FileUploadProps {
  label: string;
  accept?: string;
  onChange: (file: string) => void;
  currentFile?: string;
  hasError?: boolean;
  onFileSelect?: (file: File) => void;
}

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
}

interface CompanyFromProps {
  defaultValues?: BusinessConfig;
  handleSubmit: (data: BusinessConfig) => void;
  formId: string;
}

const DatePicker: React.FC<DatePickerProps> = memo<DatePickerProps>(({ date, onDateChange, placeholder = 'Seleccionar fecha' }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className={cn(
          'h-10 w-full justify-start border-gray-200 text-left font-normal hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20',
          !date && 'text-muted-foreground',
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
        {date ? format(date, 'dd/MM/yyyy') : placeholder}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar mode="single" selected={date || undefined} onSelect={(newDate) => onDateChange(newDate || null)} required />
    </PopoverContent>
  </Popover>
));

const FileUpload: React.FC<FileUploadProps> = memo<FileUploadProps>(({ label, accept = '*/*', currentFile, hasError = false, onFileSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const file: File | undefined = event.target.files?.[0];
      if (file && onFileSelect) {
        onFileSelect(file);
      }
    },
    [onFileSelect],
  );

  const handleButtonClick = useCallback((): void => {
    inputRef.current?.click();
  }, []);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="flex items-center space-x-2">
        <div
          className={cn(
            'flex-1 rounded-md border bg-gray-50 px-3 py-2 text-sm',
            hasError ? 'border-red-300 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600',
          )}
        >
          {currentFile || 'Ningún archivo seleccionado'}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
          onClick={handleButtonClick}
        >
          <Upload className="h-4 w-4" />
          Subir
        </Button>
      </div>
      <p className="text-xs text-gray-500">{accept}</p>
      {hasError && (
        <p className="flex items-center gap-1 text-xs text-red-600">
          <XCircle className="h-3 w-3" />
          Archivo requerido
        </p>
      )}
      <input ref={inputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
    </div>
  );
});

const StatusBadge: React.FC<StatusBadgeProps> = memo<StatusBadgeProps>(({ status, children }) => {
  const variants = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-primary border-primary/20',
  };

  const icons = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
    info: Clock,
  };

  const Icon = icons[status];

  return (
    <Badge className={cn('border px-2 py-1 text-xs font-medium', variants[status])}>
      <Icon className="mr-1 h-3 w-3" />
      {children}
    </Badge>
  );
});

interface TabButtonProps {
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = memo<TabButtonProps>(({ tab, isActive, onClick }) => {
  const Icon = tab.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all duration-200',
        isActive ? 'bg-primary text-white shadow-md' : 'border text-gray-700 hover:border-gray-200 hover:bg-white hover:shadow-sm',
      )}
    >
      <Icon className={cn('mt-0.5 h-4 w-4 flex-shrink-0', isActive ? 'text-white' : 'text-gray-500')} />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">{tab.label}</div>
        <div className={cn('mt-0.5 text-xs', isActive ? 'text-white' : 'text-gray-500')}>{tab.description}</div>
      </div>
      <div className="flex flex-col items-center gap-1">
        {tab.completed && !tab.hasErrors && <Check className={cn('h-3 w-3 flex-shrink-0', isActive ? 'text-white' : 'text-green-500')} />}
        {tab.hasErrors && <AlertTriangle className={cn('h-3 w-3 flex-shrink-0', isActive ? 'text-white' : 'text-red-500')} />}
      </div>
    </button>
  );
});

export function CompanyForm({ defaultValues, formId, handleSubmit }: CompanyFromProps): JSX.Element {
  const [activeTab, setActiveTab] = useState('basic');
  const [cropperOpen, setCropperOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState('');

  const form = useForm<BusinessConfig>({
    resolver: zodResolver(businessConfigSchema),
    defaultValues: {
      ...DEFAULT_VALUES,
      ...defaultValues,
    },
    mode: 'onBlur',
  });

  const formValues = form.watch();
  const formErrors = form.formState.errors;

  // Extraer valores específicos de forma segura
  const ruc = formValues.ruc || '';
  const name = formValues.name || '';
  const address = formValues.address || '';
  const email = formValues.email || '';
  const taxpayer_type = formValues.taxpayer_type || '';
  const is_artisan = formValues.is_artisan || false;
  const artisan_number = formValues.artisan_number || '';
  const currency = formValues.currency || '';
  const timezone = formValues.timezone || '';

  const getTabStatus = useMemo((): {
    basic: { completed: boolean; hasErrors: boolean };
    tributary: { completed: boolean; hasErrors: boolean };
    electronic: { completed: boolean; hasErrors: boolean };
    general: { completed: boolean; hasErrors: boolean };
  } => {
    const checkBasicTab = (): { completed: boolean; hasErrors: boolean } => {
      const requiredValues = [ruc, name, address, email];
      const hasAllRequired: boolean = requiredValues.every((value) => {
        return value && String(value).trim().length > 0;
      });

      const hasErrors: boolean = !!(formErrors.ruc || formErrors.name || formErrors.address || formErrors.email);
      return { completed: hasAllRequired, hasErrors };
    };

    const checkTributaryTab = (): { completed: boolean; hasErrors: boolean } => {
      const hasRequiredFields: boolean = !!(taxpayer_type && taxpayer_type.trim().length > 0);

      // Verificar si es artesano y tiene número requerido
      const hasArtisanNumber: boolean = !is_artisan || !!(artisan_number && artisan_number.trim().length > 0);

      // Verificar campos condicionales
      const specialTaxpayerNumber = formValues.special_taxpayer_number || '';
      const specialTaxpayerDate = formValues.special_taxpayer_date;
      const retentionAgentResolution = formValues.retention_agent_resolution || '';
      const retentionAgentDate = formValues.retention_agent_date;

      // Si hay número de contribuyente especial, debe tener fecha
      const hasSpecialTaxpayerDateIfRequired =
        !specialTaxpayerNumber || specialTaxpayerNumber.trim().length === 0 || (specialTaxpayerDate !== null && specialTaxpayerDate !== undefined);

      // Si hay resolución de agente de retención, debe tener fecha
      const hasRetentionDateIfRequired =
        !retentionAgentResolution ||
        retentionAgentResolution.trim().length === 0 ||
        (retentionAgentDate !== null && retentionAgentDate !== undefined);

      const hasErrors: boolean =
        !!formErrors.taxpayer_type || (is_artisan && !hasArtisanNumber) || !hasSpecialTaxpayerDateIfRequired || !hasRetentionDateIfRequired;

      return {
        completed: hasRequiredFields && hasArtisanNumber && hasSpecialTaxpayerDateIfRequired && hasRetentionDateIfRequired,
        hasErrors: hasErrors,
      };
    };

    const checkElectronicTab = (): { completed: boolean; hasErrors: boolean } => {
      const signatureFile = formValues.electronic_signature_file || '';
      const signaturePassword = formValues.electronic_signature_password || '';
      const signatureExpiry = formValues.electronic_signature_expiry;
      const sriToken = formValues.sri_token || '';
      const sriTokenExpiry = formValues.sri_token_expiry;

      const hasSignaturePasswordIfRequired =
        !signatureFile || signatureFile.trim().length === 0 || (signaturePassword && signaturePassword.trim().length > 0);

      const hasSignatureExpiryIfRequired =
        !signatureFile || signatureFile.trim().length === 0 || (signatureExpiry !== null && signatureExpiry !== undefined);

      const hasSriTokenExpiryIfRequired = !sriToken || sriToken.trim().length === 0 || (sriTokenExpiry !== null && sriTokenExpiry !== undefined);

      const hasErrors =
        !hasSignaturePasswordIfRequired ||
        !hasSignatureExpiryIfRequired ||
        !hasSriTokenExpiryIfRequired ||
        !!(formErrors.electronic_signature_password || formErrors.electronic_signature_expiry || formErrors.sri_token_expiry);

      return {
        completed: hasSignaturePasswordIfRequired && hasSignatureExpiryIfRequired && hasSriTokenExpiryIfRequired,
        hasErrors,
      };
    };

    const checkGeneralTab = (): { completed: boolean; hasErrors: boolean } => {
      const requiredValues = [currency, timezone];
      const hasAllRequired: boolean = requiredValues.every((value) => {
        return value && String(value).trim().length > 0;
      });

      const hasErrors: boolean = !!(formErrors.currency || formErrors.timezone);
      return { completed: hasAllRequired, hasErrors };
    };

    return {
      basic: checkBasicTab(),
      tributary: checkTributaryTab(),
      electronic: checkElectronicTab(),
      general: checkGeneralTab(),
    };
  }, [formValues, formErrors, ruc, name, address, email, taxpayer_type, is_artisan, artisan_number, currency, timezone]);

  const tabs: Tab[] = useMemo(
    () => [
      {
        id: 'basic',
        label: 'Información Básica',
        icon: Building2,
        description: 'Datos generales de la empresa',
        completed: getTabStatus.basic.completed,
        hasErrors: getTabStatus.basic.hasErrors,
      },
      {
        id: 'tributary',
        label: 'Información Tributaria',
        icon: FileText,
        description: 'Configuración fiscal y SRI',
        completed: getTabStatus.tributary.completed,
        hasErrors: getTabStatus.tributary.hasErrors,
      },
      {
        id: 'electronic',
        label: 'Facturación Electrónica',
        icon: Zap,
        description: 'Firma digital y ambiente SRI',
        completed: getTabStatus.electronic.completed,
        hasErrors: getTabStatus.electronic.hasErrors,
      },
      {
        id: 'general',
        label: 'Configuración General',
        icon: Settings,
        description: 'Preferencias del sistema',
        completed: getTabStatus.general.completed,
        hasErrors: getTabStatus.general.hasErrors,
      },
    ],
    [getTabStatus],
  );

  const isArtisan: boolean = formValues.is_artisan || false;
  const currentLogo: string | undefined = formValues.logo;
  const currentSignatureFile: string | undefined = formValues.electronic_signature_file;
  const isActive: boolean = formValues.is_active || false;

  const handleSignatureFileSelect = useCallback(
    (file: File): void => {
      if (file) {
        form.setValue('electronic_signature_file', file.name);
      }
    },
    [form],
  );

  const handleLogoFileSelect = useCallback((file: File): void => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>): void => {
        const result = e.target?.result as string;
        setTempImageSrc(result);
        setCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleCrop = useCallback(
    (croppedImage: string): void => {
      form.setValue('logo', croppedImage);
      setCropperOpen(false);
      setTempImageSrc('');
    },
    [form],
  );

  const handleCropCancel = useCallback((): void => {
    setCropperOpen(false);
    setTempImageSrc('');
  }, []);

  const handleCropExisting = useCallback((): void => {
    setTempImageSrc(currentLogo || '');
    setCropperOpen(true);
  }, [currentLogo]);

  const handleTabClick = useCallback((tabId: string): void => {
    setActiveTab(tabId);
  }, []);

  return (
    <>
      <ImageCrop src={tempImageSrc} onCrop={handleCrop} onCancel={handleCropCancel} isOpen={cropperOpen} />

      <div className="ml-4 flex w-full flex-1">
        <div className="flex w-80 flex-col">
          <div className="flex-1">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <TabButton key={tab.id} tab={tab} isActive={activeTab === tab.id} onClick={() => handleTabClick(tab.id)} />
              ))}
            </nav>
          </div>
        </div>

        <Form {...form}>
          <form className={'w-full flex-1'} onSubmit={form.handleSubmit(handleSubmit)} id={formId}>
            <div className="w-full flex-1">
              <div className="w-full px-8">
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                      <div className="rounded-lg bg-primary/20 p-2">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
                        <p className="text-sm text-gray-600">Datos generales de identificación de la empresa</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          name={'ruc'}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                RUC <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="1234567890001" maxLength={13} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          name={'name'}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Razón Social <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Nombre de la empresa" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        name={'commercial_name'}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre Comercial</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nombre comercial (opcional)" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name={'address'}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Dirección <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Dirección completa" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          name={'phone'}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Teléfono</FormLabel>
                              <FormControl>
                                <Input {...field} ref={withMask('9999999')} placeholder="2234567" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          name={'mobile'}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Celular</FormLabel>
                              <FormControl>
                                <Input {...field} ref={withMask('99-9999999')} placeholder="09-9999999" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          name={'email'}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Email <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="email@empresa.com" type="email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          name={'website'}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sitio Web</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://www.empresa.com" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tributary' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                      <div className="rounded-lg bg-primary/20 p-2">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Información Tributaria</h3>
                        <p className="text-sm text-gray-600">Configuración tributaria y obligaciones fiscales</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          name={'taxpayer_type'}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Tipo de Contribuyente <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar tipo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="natural">Persona Natural</SelectItem>
                                    <SelectItem value="juridica">Persona Jurídica</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-center space-x-3 pt-6">
                          <FormField
                            name="obligated_accounting"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel className="text-sm font-medium text-gray-700">Obligado a llevar contabilidad</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="flex items-center gap-4 font-semibold text-gray-900">
                          <Shield className="h-4 w-4 text-primary" />
                          Contribuyente Especial
                        </h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            name={'special_taxpayer_number'}
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Número de Resolución</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="NAC-DGERCGC12-00000001" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            name={'special_taxpayer_date'}
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Fecha de Resolución</FormLabel>
                                <FormControl>
                                  <DatePicker date={field.value} onDateChange={(date) => field.onChange(date)} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="flex items-center gap-4 font-semibold">
                          <CreditCard className="h-4 w-4 text-primary" />
                          Agente de Retención
                        </h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            name={'retention_agent_resolution'}
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Resolución de Agente de Retención</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="NAC-DGERCGC12-00000001" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            name={'retention_agent_date'}
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Fecha de Resolución</FormLabel>
                                <FormControl>
                                  <DatePicker date={field.value} onDateChange={(date) => field.onChange(date)} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="flex items-center gap-4 font-semibold">
                          <Settings className="h-4 w-4 text-primary" />
                          Calificación Artesanal
                        </h4>

                        <FormField
                          name="is_artisan"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <FormLabel>Es Artesano</FormLabel>
                            </FormItem>
                          )}
                        />

                        {isArtisan && (
                          <div className="space-y-2 rounded-md border p-4 pl-4">
                            <FormField
                              name={'artisan_number'}
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Número de Calificación Artesanal <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="JNDA-2023-001" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'electronic' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b pb-4">
                      <div className="rounded-lg bg-primary/20 p-2">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Facturación Electrónica</h3>
                        <p className="text-sm text-gray-600">Configuración para la emisión de comprobantes electrónicos (Opcional)</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 font-semibold">
                          <Shield className="h-4 w-4 text-primary" />
                          Firma Electrónica
                        </h4>
                        <div className="space-y-4 rounded-lg border p-4">
                          <FileUpload
                            label="Archivo de Firma Electrónica (.p12)"
                            accept="Archivos .p12 o .pfx (máx. 5MB)"
                            onChange={(file) => form.setValue('electronic_signature_file', file)}
                            currentFile={currentSignatureFile}
                            onFileSelect={handleSignatureFileSelect}
                          />
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                              name="electronic_signature_password"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Contraseña de Firma</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="password" placeholder="••••••••" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              name="electronic_signature_expiry"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Fecha de Expiración</FormLabel>
                                  <FormControl>
                                    <DatePicker date={field.value} onDateChange={field.onChange} placeholder="Fecha de expiración" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 font-semibold">
                          <Globe className="h-4 w-4 text-primary" />
                          Configuración SRI
                        </h4>
                        <div className="space-y-4 rounded-lg border p-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                              name="sri_environment"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Ambiente SRI</FormLabel>
                                  <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar ambiente" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="1">
                                          <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                            Ambiente de Pruebas
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="2">
                                          <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            Ambiente de Producción
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              name="sri_token"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Token SRI</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Token de acceso SRI" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            name="sri_token_expiry"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Fecha de Expiración del Token</FormLabel>
                                <FormControl>
                                  <DatePicker date={field.value} onDateChange={field.onChange} placeholder="Fecha de expiración del token" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                      <div className="rounded-lg bg-primary/20 p-2">
                        <Settings className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Configuración General</h3>
                        <p className="text-sm text-gray-600">Preferencias del sistema y configuraciones adicionales</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 font-semibold">
                          <ImageIcon className="h-4 w-4 text-primary" />
                          Logo de la Empresa
                        </h4>
                        <div className="rounded-lg border p-4">
                          <div className="space-y-4">
                            <div className="flex items-start gap-4">
                              {currentLogo && (
                                <div className="flex-shrink-0">
                                  <div className="relative h-24 w-24 overflow-hidden rounded-lg border bg-gray-50">
                                    <img src={currentLogo} alt="Logo actual" className="h-full w-full object-contain" />
                                  </div>
                                  <p className="mt-1 text-center text-xs text-gray-500">Vista previa</p>
                                </div>
                              )}

                              <div className="flex-1 space-y-2">
                                <FileUpload
                                  label=""
                                  accept="PNG, JPG, SVG (máx. 2MB) - Se recortará automáticamente"
                                  onChange={(file) => form.setValue('logo', file)}
                                  currentFile={currentLogo ? 'Logo configurado' : ''}
                                  onFileSelect={handleLogoFileSelect}
                                />
                                {currentLogo && (
                                  <Button type="button" variant="outline" size="sm" className="flex items-center gap-2" onClick={handleCropExisting}>
                                    <Crop className="h-4 w-4" />
                                    Recortar Logo
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 font-semibold">
                          <CreditCard className="h-4 w-4 text-primary" />
                          Moneda Principal
                        </h4>
                        <FormField
                          name="currency"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger className="h-10 w-full border-gray-200 focus:border-primary focus:ring-2">
                                    <SelectValue placeholder="Seleccionar moneda" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="USD">
                                      <div className="flex items-center gap-2">USD - Dólar Estadounidense</div>
                                    </SelectItem>
                                    <SelectItem value="COP">
                                      <div className="flex items-center gap-2">COP - Peso Colombiano</div>
                                    </SelectItem>
                                    <SelectItem value="PEN">
                                      <div className="flex items-center gap-2">PEN - Sol Peruano</div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 font-semibold">
                          <Globe className="h-4 w-4 text-primary" />
                          Zona Horaria
                        </h4>
                        <FormField
                          name="timezone"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger className="h-10 w-full">
                                    <SelectValue placeholder="Seleccionar zona horaria" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timezoneList.map((tz) => (
                                      <SelectItem value={tz.tzCode} key={tz.tzCode}>
                                        <div className="flex items-center gap-2">{tz.label}</div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 font-semibold text-gray-900">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Estado del Sistema
                        </h4>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                          <FormField
                            name="is_active"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div>
                                  <FormLabel className="text-sm font-medium text-gray-900">Empresa activa en el sistema</FormLabel>
                                  <p className="text-xs text-gray-600">Desactivar temporalmente la empresa sin eliminar los datos</p>
                                </div>
                              </FormItem>
                            )}
                          />
                          <StatusBadge status={isActive ? 'success' : 'error'}>{isActive ? 'Activa' : 'Inactiva'}</StatusBadge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
