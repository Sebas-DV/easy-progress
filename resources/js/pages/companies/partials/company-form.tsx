// BusinessConfigForm.tsx
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Building2, CalendarIcon, FileText, Settings, Zap } from 'lucide-react';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import timezone from 'timezones-list';
import { z } from 'zod';

export const companyConfigSchema = z.object({
  ruc: z.string().min(1).max(13),
  name: z.string().min(1),
  commercial_name: z.string().optional(),
  address: z.string().min(1),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string(),
  website: z.string().optional(),
  taxpayer_type: z.enum(['natural', 'juridica']),
  obligated_accounting: z.boolean(),
  special_taxpayer_number: z.string().optional(),
  special_taxpayer_date: z.date().nullable(),
  retention_agent_resolution: z.string().optional(),
  retention_agent_date: z.date().nullable(),
  is_artisan: z.boolean(),
  artisan_number: z.string().optional(),
  electronic_signature_file: z.string().optional(),
  electronic_signature_password: z.string().optional(),
  electronic_signature_expiry: z.date().nullable(),
  sri_environment: z.enum(['1', '2']),
  sri_token: z.string().optional(),
  sri_token_expiry: z.date().nullable(),
  logo: z.string().optional(),
  currency: z.string(),
  timezone: z.string(),
  is_active: z.boolean(),
});
export type BusinessConfig = z.infer<typeof companyConfigSchema>;

export interface BusinessConfigFormProps {
  form: UseFormReturn<BusinessConfig>;
}

export default function BusinessConfigForm({ form }: BusinessConfigFormProps) {
  const { control, watch } = form;
  const [activeTab, setActiveTab] = useState<'basic' | 'tributary' | 'electronic' | 'general'>('basic');

  const DatePicker = ({
    date,
    onDateChange,
    placeholder = 'Seleccionar fecha',
  }: {
    date: Date | null;
    onDateChange: (date: Date | null) => void;
    placeholder?: string;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'h-10 w-full justify-start border-gray-200 text-left font-normal hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
          {date ? format(date, 'dd/MM/yyyy') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date || undefined} onSelect={onDateChange} required={true} />
      </PopoverContent>
    </Popover>
  );

  const tabs = [
    { id: 'basic', label: 'Información Básica', icon: Building2 },
    { id: 'tributary', label: 'Información Tributaria', icon: FileText },
    { id: 'electronic', label: 'Facturación Electrónica', icon: Zap },
    { id: 'general', label: 'Configuración General', icon: Settings },
  ];

  return (
    <div className="-mt-4 flex flex-1 overflow-hidden">
      {/* Sidebar de pestañas */}
      <div className="flex w-80 flex-col border-r border-gray-200 bg-gray-50">
        <nav className="space-y-2 p-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'basic' | 'tributary' | 'electronic' | 'general')}
                className={cn(
                  'relative flex w-full items-start gap-3 rounded-lg p-3 text-left transition-all duration-200',
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'border border-transparent text-gray-700 hover:border-gray-200 hover:bg-white hover:shadow-sm',
                )}
              >
                <Icon className={cn('mt-0.5 h-4 w-4 flex-shrink-0', isActive ? 'text-white' : 'text-gray-500')} />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-6 p-6">
            {/* --- Información Básica --- */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <FormField
                  control={control}
                  name="ruc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RUC</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="1234567890001" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Razón Social</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Empresa S.A." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="commercial_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Comercial</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Mi Empresa" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} placeholder="Av. Principal 123 y Secundaria, Quito, Ecuador" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="02-1234567" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Celular</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="0987654321" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="contacto@empresa.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="website"
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
            )}

            {/* --- Información Tributaria --- */}
            {activeTab === 'tributary' && (
              <div className="space-y-6">
                <FormField
                  control={control}
                  name="taxpayer_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Contribuyente</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tipo" />
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
                <FormField
                  control={control}
                  name="obligated_accounting"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Obligado a llevar contabilidad</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="special_taxpayer_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Resolución Especial</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="NAC-DGERCGC12-00000001" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="special_taxpayer_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Resolución Especial</FormLabel>
                      <FormControl>
                        <DatePicker date={field.value} onDateChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="retention_agent_resolution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resolución de Agente de Retención</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="NAC-DGERCGC12-00000002" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="retention_agent_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Resolución de Retención</FormLabel>
                      <FormControl>
                        <DatePicker date={field.value} onDateChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="is_artisan"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Es Artesano</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {watch('is_artisan') && (
                  <FormField
                    control={control}
                    name="artisan_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Calificación Artesanal</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="JNDA-2023-001" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            {/* --- Facturación Electrónica --- */}
            {activeTab === 'electronic' && (
              <div className="space-y-6">
                <FormField
                  control={control}
                  name="electronic_signature_file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Archivo de Firma Electrónica (.p12)</FormLabel>
                      <FormControl>
                        <Input type="file" accept=".p12" onChange={(e) => field.onChange(e.target.files?.[0]?.name ?? '')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="electronic_signature_password"
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
                  control={control}
                  name="electronic_signature_expiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Expiración Firma</FormLabel>
                      <FormControl>
                        <DatePicker date={field.value} onDateChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="sri_environment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ambiente SRI</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona ambiente" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Pruebas</SelectItem>
                            <SelectItem value="2">Producción</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="sri_token"
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
                <FormField
                  control={control}
                  name="sri_token_expiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Expiración Token</FormLabel>
                      <FormControl>
                        <DatePicker date={field.value} onDateChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* --- Configuración General --- */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <FormField
                  control={control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo de la Empresa</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files?.[0]?.name ?? '')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moneda Principal</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona moneda" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD - Dólar Estadounidense</SelectItem>
                            <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                            <SelectItem value="PEN">PEN - Sol Peruano</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zona Horaria</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona zona horaria" />
                          </SelectTrigger>
                          <SelectContent>
                            {timezone.map((tz) => (
                              <SelectItem key={tz.tzCode} value={tz.tzCode}>
                                {tz.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Empresa Activa en el Sistema</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
