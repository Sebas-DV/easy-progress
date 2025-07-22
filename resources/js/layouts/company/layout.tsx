import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import React from 'react';

export function CompanyLayout({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div className="px-4 py-6">
      <div className={'flex items-center justify-between'}>
        <Heading title={title} description={description} />

        {actions}
      </div>

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
        <Separator className="my-6 md:hidden" />

        <div className="flex-1">
          <section className="space-y-12">{children}</section>
        </div>
      </div>
    </div>
  );
}
