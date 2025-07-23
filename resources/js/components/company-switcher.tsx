import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Building2, ChevronDown, Edit, Plus } from 'lucide-react';

export function CompanySwitcher() {
  const {
    auth: { companies, current_company },
  } = usePage<SharedData>().props;

  if (companies?.length === 0) {
    return (
      <Button variant="ghost" className="h-auto p-0 font-normal text-foreground hover:bg-transparent focus:ring-0">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span className="text-muted-foreground">Crear Compañía</span>
        </div>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="ml-4 h-auto p-0 font-normal text-foreground hover:bg-transparent focus:ring-0">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="max-w-[200px] truncate">{current_company?.name || 'Seleccionar Compañía'}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Cambiar Compañía</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {companies?.map((company) => (
          <DropdownMenuItem key={company.id} className="flex cursor-pointer items-center gap-3 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium">{company.name}</span>
                {company.is_default && (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Actual</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">RUC: {company.ruc}</div>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
          <Edit className="h-4 w-4" />
          <span>Editar Compañía Actual</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex cursor-pointer items-center gap-2" asChild={true}>
          <Link href={route('company.create')}>
            <Plus className="h-4 w-4" />
            <span>Crear Nueva Compañía</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
