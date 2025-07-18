import type { NavItem } from '@/types';
import { Building, CreditCard, Hash, LayoutGrid, Truck, Users } from 'lucide-react';

export const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid,
    isActive: true,
  },
];

export const settingsNavItem: NavItem[] = [
  {
    title: 'Empresa y establecimientos',
    href: '/settings/profile',
    icon: Building,
  },
  {
    title: 'Usuarios básicos',
    href: '/settings/security',
    icon: Users,
  },
  {
    title: 'Plan de cuentas simple',
    href: '/settings/notifications',
    icon: Hash,
  },
  {
    title: 'Configuración SRI',
    href: '/settings/sri',
    icon: CreditCard,
  },
];

export const externalNavItem: NavItem[] = [
  {
    title: 'Clientes',
    href: '/external/clients',
    icon: Users,
  },
  {
    title: 'Proveedores',
    href: '/external/providers',
    icon: Users,
  },
  {
    title: 'Transportistas',
    href: '/external/carriers',
    icon: Truck,
  },
];

export const inventoryNavItem: NavItem[] = [
  {
    title: 'Productos y servicios',
    href: '/inventory/products',
    icon: LayoutGrid,
  },
  {
    title: 'Categorías',
    href: route('categories.index'),
    icon: LayoutGrid,
  },
  {
    title: 'Almacén',
    href: '/inventory/units',
    icon: LayoutGrid,
  },
];

export const salesNavItem: NavItem[] = [
  {
    title: 'Cotizaciones',
    href: '/sales/quotes',
    icon: LayoutGrid,
  },
  {
    title: 'Facturación manual',
    href: '/sales/manual-invoices',
    icon: LayoutGrid,
  },
  {
    title: 'Notas de crédito/débito',
    href: '/sales/credit-debit-notes',
    icon: LayoutGrid,
  },
];

export const electronicInvoicesNavItem: NavItem[] = [
  {
    title: 'Facturación Electrónica',
    href: '/electronic-invoices',
    icon: LayoutGrid,
  },
];
