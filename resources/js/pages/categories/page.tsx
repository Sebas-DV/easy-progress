import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Download, FolderUp, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Categorias',
    href: route('categories.index'),
  },
];

export default function () {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Categorias" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className={'flex items-center justify-between'}>
          <h3 className={'text-2xl font-bold'}>Categorias</h3>

          <PageAction />
        </div>
      </div>
    </AppLayout>
  );
}

export function PageAction() {
  return (
    <div className={'flex items-center gap-2'}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={'default'}>
            <Plus />
            Nueva categoría
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Agregar categorías</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={'outline'} className={'text-primary'} size={'icon'}>
            <FolderUp />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Importar categorías</p>
        </TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className={'text-primary'}>
                  <Download />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exportar categorías</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
