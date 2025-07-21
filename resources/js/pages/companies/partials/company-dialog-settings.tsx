// BusinessConfigModal.tsx
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import BusinessConfigForm, { BusinessConfig, companyConfigSchema } from '@/pages/companies/partials/company-form';
import { useCompanyStore } from '@/stores/company-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

export function BusinessConfigModal() {
  const { isOpen, setIsOpen } = useCompanyStore();

  const defaultValues: BusinessConfig = {
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
  };

  const form = useForm<BusinessConfig>({
    resolver: zodResolver(companyConfigSchema),
    defaultValues,
    mode: 'onChange',
  });

  const values = form.watch();
  const basicComplete = !!(values.ruc && values.name && values.address && values.email);
  const tributaryComplete = !!values.taxpayer_type;
  const electronicComplete = !!(values.electronic_signature_file && values.sri_token);
  const generalComplete = !!(values.currency && values.timezone);
  const completedTabs = [basicComplete, tributaryComplete, electronicComplete, generalComplete].filter(Boolean).length;
  const progressPercentage = (completedTabs / 4) * 100;

  const onSubmit = (data: BusinessConfig) => {
    console.log('Guardando configuración:', data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="flex h-[85vh] max-w-6xl flex-col p-0">
        {/* Header */}
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
            <Button onClick={() => form.handleSubmit(onSubmit)()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4" />
              Guardar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="border-b px-6 pb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Configuración completada</span>
            <span className="text-sm text-gray-600">{completedTabs}/4 secciones</span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-gray-200" />
        </div>

        {/* Formulario */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-hidden">
            <BusinessConfigForm form={form} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
