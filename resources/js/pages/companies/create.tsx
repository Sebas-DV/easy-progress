import { Button } from '@/components/ui/button';
import { useCreateCompany } from '@/hooks/queries/use-company';
import AppLayout from '@/layouts/app-layout';
import { CompanyLayout } from '@/layouts/company/layout';
import { CompanyForm } from '@/pages/companies/partials/company-form';
import { Head } from '@inertiajs/react';
import { nanoid } from 'nanoid';

export default function () {
  const { mutate: createCompany } = useCreateCompany();

  const handleSubmit = (data: unknown) => {
    console.log(data);

    createCompany(data, {
      onSuccess: () => {
        console.log('Company created successfully');
      },
      onError: (error: Error) => {
        console.error('Error creating company:', error.message);
      },
    });
  };

  const companyId = nanoid(10);

  return (
    <AppLayout>
      <Head title={'Crear Empresa'} />

      <CompanyLayout
        title={'Crear Empresa'}
        description={'Crea una nueva empresa para gestionar tus recursos'}
        actions={
          <Button form={companyId} type={'submit'}>
            Save
          </Button>
        }
      >
        <CompanyForm handleSubmit={handleSubmit} formId={companyId} />
      </CompanyLayout>
    </AppLayout>
  );
}
