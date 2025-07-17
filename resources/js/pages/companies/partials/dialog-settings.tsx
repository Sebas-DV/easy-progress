import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  AlertTriangle,
  Building2,
  CalendarIcon,
  Check,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Globe,
  Save,
  Settings,
  Shield,
  Upload,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

import timezone from 'timezones-list';

interface BusinessConfig {
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
  settings: Record<string, any>;
}

export default function BusinessConfigModal() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [config, setConfig] = useState<BusinessConfig>({
    ruc: '1792146739001',
    name: 'TechCorp S.A.',
    commercial_name: 'TechCorp',
    address: 'Av. Amazonas 123 y Colón, Quito, Ecuador',
    phone: '02-2345678',
    mobile: '0987654321',
    email: 'contacto@techcorp.com',
    website: 'https://www.techcorp.com',
    taxpayer_type: 'juridica',
    obligated_accounting: true,
    special_taxpayer_number: '',
    special_taxpayer_date: null,
    retention_agent_resolution: '',
    retention_agent_date: null,
    is_artisan: false,
    artisan_number: '',
    electronic_signature_file: 'techcorp_signature.p12',
    electronic_signature_password: '',
    electronic_signature_expiry: new Date('2024-12-31'),
    sri_environment: '2',
    sri_token: '',
    sri_token_expiry: null,
    logo: 'techcorp_logo.png',
    currency: 'USD',
    timezone: 'America/Guayaquil',
    is_active: true,
    settings: {},
  });

  const updateConfig = (field: keyof BusinessConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Guardando configuración:', config);
    setOpen(false);
  };

  const tabs = [
    {
      id: 'basic',
      label: 'Información Básica',
      icon: Building2,
      description: 'Datos generales de la empresa',
      completed: true,
      hasErrors: false,
    },
    {
      id: 'tributary',
      label: 'Información Tributaria',
      icon: FileText,
      description: 'Configuración fiscal y SRI',
      completed: true,
      hasErrors: false,
    },
    {
      id: 'electronic',
      label: 'Facturación Electrónica',
      icon: Zap,
      description: 'Firma digital y ambiente SRI',
      completed: false,
      hasErrors: true,
    },
    {
      id: 'general',
      label: 'Configuración General',
      icon: Settings,
      description: 'Preferencias del sistema',
      completed: true,
      hasErrors: false,
    },
  ];

  const completedTabs = tabs.filter((tab) => tab.completed).length;
  const progressPercentage = (completedTabs / tabs.length) * 100;

  // Función para obtener el estado de la firma digital
  const getSignatureStatus = () => {
    if (!config.electronic_signature_file) return { status: 'error', label: 'No configurada' };
    if (config.electronic_signature_expiry && config.electronic_signature_expiry < new Date()) {
      return { status: 'warning', label: 'Expirada' };
    }
    return { status: 'success', label: 'Configurada' };
  };

  // Función para obtener el estado del token SRI
  const getTokenStatus = () => {
    if (!config.sri_token) return { status: 'error', label: 'No configurado' };
    if (config.sri_token_expiry && config.sri_token_expiry < new Date()) {
      return { status: 'warning', label: 'Expirado' };
    }
    return { status: 'success', label: 'Válido' };
  };

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
        <Calendar mode="single" selected={date || undefined} onSelect={onDateChange} initialFocus />
      </PopoverContent>
    </Popover>
  );

  const FileUpload = ({
    label,
    accept,
    onChange,
    currentFile,
    hasError = false,
  }: {
    label: string;
    accept: string;
    onChange: (file: string) => void;
    currentFile?: string;
    hasError?: boolean;
  }) => (
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
        <Button variant="outline" size="sm" className="flex items-center gap-2 border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50">
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
    </div>
  );

  const StatusBadge = ({ status, children }: { status: 'success' | 'warning' | 'error' | 'info'; children: React.ReactNode }) => {
    const variants = {
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      error: 'bg-red-100 text-red-800 border-red-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200',
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
  };

  const ConfigSummary = () => {
    const signatureStatus = getSignatureStatus();
    const tokenStatus = getTokenStatus();

    return (
      <ScrollArea className="h-full">
        <div className="space-y-3 p-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
              <Shield className="h-4 w-4 text-blue-600" />
              Resumen de Configuración
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">RUC:</span>
                <span className="font-mono text-xs font-medium">{config.ruc}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Ambiente SRI:</span>
                <StatusBadge status={config.sri_environment === '2' ? 'success' : 'warning'}>
                  {config.sri_environment === '2' ? 'Producción' : 'Pruebas'}
                </StatusBadge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Firma Digital:</span>
                <StatusBadge status={signatureStatus.status as any}>{signatureStatus.label}</StatusBadge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Token SRI:</span>
                <StatusBadge status={tokenStatus.status as any}>{tokenStatus.label}</StatusBadge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Estado:</span>
                <StatusBadge status={config.is_active ? 'success' : 'error'}>{config.is_active ? 'Activa' : 'Inactiva'}</StatusBadge>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <Settings className="h-4 w-4" />
          Configurar Empresa
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[85vh] max-w-6xl flex-col p-0">
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Configuración de Empresa</h2>
              <p className="text-sm text-gray-600">Gestiona la información y configuración de tu empresa</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4" />
              Guardar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="border-b px-6 pb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Configuración completada</span>
            <span className="text-sm text-gray-600">
              {completedTabs}/{tabs.length} secciones
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-gray-200" />
        </div>

        <div className="-mt-4 flex flex-1 overflow-hidden">
          <div className="flex w-80 flex-col border-r border-gray-200 bg-gray-50">
            <div className="flex-1 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'relative flex w-full items-start gap-3 rounded-lg p-3 text-left transition-all duration-200',
                        isActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'border border-transparent text-gray-700 hover:border-gray-200 hover:bg-white hover:shadow-sm',
                      )}
                    >
                      <Icon className={cn('mt-0.5 h-4 w-4 flex-shrink-0', isActive ? 'text-white' : 'text-gray-500')} />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium">{tab.label}</div>
                        <div className={cn('mt-0.5 text-xs', isActive ? 'text-blue-100' : 'text-gray-500')}>{tab.description}</div>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        {tab.completed && <Check className={cn('h-3 w-3 flex-shrink-0', isActive ? 'text-white' : 'text-green-500')} />}
                        {tab.hasErrors && <AlertTriangle className={cn('h-3 w-3 flex-shrink-0', isActive ? 'text-white' : 'text-red-500')} />}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/*  <div className="h-80 border-t border-gray-200">
              <ConfigSummary />
            </div>*/}
          </div>

          {/* Área de contenido principal */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6">
                {/* Información Básica */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                      <div className="rounded-lg bg-blue-100 p-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
                        <p className="text-sm text-gray-600">Datos generales de identificación de la empresa</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="ruc" className="text-sm font-medium text-gray-700">
                            RUC <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="ruc"
                            value={config.ruc}
                            onChange={(e) => updateConfig('ruc', e.target.value)}
                            placeholder="1234567890001"
                            maxLength={13}
                            className="h-10 border-gray-200 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Razón Social <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="name"
                            value={config.name}
                            onChange={(e) => updateConfig('name', e.target.value)}
                            placeholder="Empresa S.A."
                            className="h-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="commercial_name" className="text-sm font-medium text-gray-700">
                          Nombre Comercial
                        </Label>
                        <Input
                          id="commercial_name"
                          value={config.commercial_name}
                          onChange={(e) => updateConfig('commercial_name', e.target.value)}
                          placeholder="Mi Empresa"
                          className="h-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                          Dirección <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="address"
                          value={config.address}
                          onChange={(e) => updateConfig('address', e.target.value)}
                          placeholder="Av. Principal 123 y Secundaria, Quito, Ecuador"
                          rows={3}
                          className="resize-none border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                            Teléfono
                          </Label>
                          <Input
                            id="phone"
                            value={config.phone}
                            onChange={(e) => updateConfig('phone', e.target.value)}
                            placeholder="02-1234567"
                            className="h-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">
                            Celular
                          </Label>
                          <Input
                            id="mobile"
                            value={config.mobile}
                            onChange={(e) => updateConfig('mobile', e.target.value)}
                            placeholder="0987654321"
                            className="h-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={config.email}
                            onChange={(e) => updateConfig('email', e.target.value)}
                            placeholder="contacto@empresa.com"
                            className="h-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                            Sitio Web
                          </Label>
                          <Input
                            id="website"
                            value={config.website}
                            onChange={(e) => updateConfig('website', e.target.value)}
                            placeholder="https://www.empresa.com"
                            className="h-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
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
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Tipo de Contribuyente</Label>
                          <Select
                            value={config.taxpayer_type}
                            onValueChange={(value: 'natural' | 'juridica') => updateConfig('taxpayer_type', value)}
                          >
                            <SelectTrigger className="h-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="natural">Persona Natural</SelectItem>
                              <SelectItem value="juridica">Persona Jurídica</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-3 pt-6">
                          <Switch
                            id="obligated_accounting"
                            checked={config.obligated_accounting}
                            onCheckedChange={(checked) => updateConfig('obligated_accounting', checked)}
                          />
                          <Label htmlFor="obligated_accounting" className="text-sm font-medium text-gray-700">
                            Obligado a llevar contabilidad
                          </Label>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="flex items-center gap-4 font-semibold text-gray-900">
                          <Shield className="h-4 w-4 text-primary" />
                          Contribuyente Especial
                        </h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="special_taxpayer_number" className="text-sm font-medium text-gray-700">
                              Número de Resolución
                            </Label>
                            <Input
                              id="special_taxpayer_number"
                              value={config.special_taxpayer_number}
                              onChange={(e) => updateConfig('special_taxpayer_number', e.target.value)}
                              placeholder="NAC-DGERCGC12-00000001"
                              className="h-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Fecha de Resolución</Label>
                            <DatePicker date={config.special_taxpayer_date} onDateChange={(date) => updateConfig('special_taxpayer_date', date)} />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="flex items-center gap-4 font-semibold">
                          <CreditCard className="h-4 w-4 text-primary" />
                          Agente de Retención
                        </h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="retention_agent_resolution" className="text-sm font-medium text-gray-700">
                              Resolución de Agente de Retención
                            </Label>
                            <Input
                              id="retention_agent_resolution"
                              value={config.retention_agent_resolution}
                              onChange={(e) => updateConfig('retention_agent_resolution', e.target.value)}
                              placeholder="NAC-DGERCGC12-00000002"
                              className="h-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Fecha de Resolución</Label>
                            <DatePicker date={config.retention_agent_date} onDateChange={(date) => updateConfig('retention_agent_date', date)} />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="flex items-center gap-4 font-semibold">
                          <Settings className="h-4 w-4 text-primary" />
                          Calificación Artesanal
                        </h4>
                        <div className="flex items-center space-x-3">
                          <Switch id="is_artisan" checked={config.is_artisan} onCheckedChange={(checked) => updateConfig('is_artisan', checked)} />
                          <Label htmlFor="is_artisan" className="text-sm font-medium text-gray-700">
                            Es Artesano
                          </Label>
                        </div>
                        {config.is_artisan && (
                          <div className="space-y-2 rounded-md border p-4 pl-4">
                            <Label htmlFor="artisan_number" className="text-sm font-medium text-gray-700">
                              Número de Calificación Artesanal
                            </Label>
                            <Input
                              id="artisan_number"
                              value={config.artisan_number}
                              onChange={(e) => updateConfig('artisan_number', e.target.value)}
                              placeholder="JNDA-2023-001"
                              className="h-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                        <h3 className="0 text-lg font-semibold">Facturación Electrónica</h3>
                        <p className="text-sm text-gray-600">Configuración para la emisión de comprobantes electrónicos</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-4 font-semibold">
                          <Shield className="h-4 w-4 text-primary" />
                          Firma Electrónica
                        </h4>
                        <div className="space-y-4 rounded-lg border p-4">
                          <FileUpload
                            label="Archivo de Firma Electrónica (.p12)"
                            accept="PNG, JPG, SVG (máx. 2MB)"
                            onChange={(file) => updateConfig('electronic_signature_file', file)}
                            currentFile={config.electronic_signature_file}
                            hasError={!config.electronic_signature_file}
                          />
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="electronic_signature_password" className="text-sm font-medium text-gray-700">
                                Contraseña de Firma
                              </Label>
                              <Input
                                id="electronic_signature_password"
                                type="password"
                                value={config.electronic_signature_password}
                                onChange={(e) => updateConfig('electronic_signature_password', e.target.value)}
                                placeholder="••••••••"
                                className="h-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">Fecha de Expiración</Label>
                              <DatePicker
                                date={config.electronic_signature_expiry}
                                onDateChange={(date) => updateConfig('electronic_signature_expiry', date)}
                                placeholder="Fecha de expiración"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="flex items-center gap-4 font-semibold">
                          <Globe className="h-4 w-4 text-primary" />
                          Configuración SRI
                        </h4>
                        <div className="space-y-4 rounded-lg border p-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Ambiente SRI</Label>
                              <Select value={config.sri_environment} onValueChange={(value: '1' | '2') => updateConfig('sri_environment', value)}>
                                <SelectTrigger className="h-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                                  <SelectValue />
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
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="sri_token" className="text-sm font-medium text-gray-700">
                                Token SRI
                              </Label>
                              <Input
                                id="sri_token"
                                value={config.sri_token}
                                onChange={(e) => updateConfig('sri_token', e.target.value)}
                                placeholder="Token de acceso SRI"
                                className="h-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Fecha de Expiración del Token</Label>
                            <DatePicker
                              date={config.sri_token_expiry}
                              onDateChange={(date) => updateConfig('sri_token_expiry', date)}
                              placeholder="Fecha de expiración del token"
                            />
                          </div>
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
                        <h4 className="font-semibold">Logo de la Empresa</h4>
                        <div className="rounded-lg border p-4">
                          <FileUpload
                            label=""
                            accept="PNG, JPG, SVG (máx. 2MB)"
                            onChange={(file) => updateConfig('logo', file)}
                            currentFile={config.logo}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="flex items-center gap-4 font-semibold">
                          <CreditCard className="h-4 w-4 text-primary" />
                          Moneda Principal
                        </h4>
                        <Select value={config.currency} onValueChange={(value) => updateConfig('currency', value)}>
                          <SelectTrigger className="h-10 w-full border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                            <SelectValue />
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
                      </div>

                      <div className="space-y-4">
                        <h4 className="flex items-center gap-4 font-semibold">
                          <Globe className="h-4 w-4 text-primary" />
                          Zona Horaria
                        </h4>
                        <Select value={config.timezone} onValueChange={(value) => updateConfig('timezone', value)}>
                          <SelectTrigger className="h-10 w-full border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timezone.map((tz) => (
                              <SelectItem value={tz.tzCode} key={tz.tzCode}>
                                <div className="flex items-center gap-2">{tz.label}</div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 font-semibold text-gray-900">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Estado del Sistema
                        </h4>
                        <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id="is_active"
                              checked={config.is_active}
                              onChange={(e) => updateConfig('is_active', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <Label htmlFor="is_active" className="text-sm font-medium text-gray-900">
                                Empresa activa en el sistema
                              </Label>
                              <p className="text-xs text-gray-600">Desactivar temporalmente la empresa sin eliminar los datos</p>
                            </div>
                          </div>
                          <StatusBadge status={config.is_active ? 'success' : 'error'}>{config.is_active ? 'Activa' : 'Inactiva'}</StatusBadge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
