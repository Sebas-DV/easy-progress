import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useCompanyStore } from '@/stores/company-store';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Bell, Building2, Calendar, ChevronDown, Edit, File, Folder, Grid3x3, Home, Plus, Search, Settings, Share, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  category: string;
  action?: () => void;
}

interface Company {
  id: string;
  name: string;
  ruc: string;
  logo?: string;
  is_active: boolean;
  is_default: boolean;
}

const commandItems: CommandItem[] = [
  // Navigation
  { id: 'home', label: 'Go to Home', icon: Home, shortcut: 'H', category: 'Navigation' },
  { id: 'dashboard', label: 'Go to Dashboard', icon: Grid3x3, shortcut: 'D', category: 'Navigation' },
  { id: 'calendar', label: 'Open Calendar', icon: Calendar, shortcut: 'C', category: 'Navigation' },
  { id: 'files', label: 'Browse Files', icon: Folder, shortcut: 'F', category: 'Navigation' },

  // Actions
  { id: 'new-file', label: 'Create New File', icon: File, shortcut: 'N', category: 'Actions' },
  { id: 'new-folder', label: 'Create New Folder', icon: Folder, shortcut: 'Shift+N', category: 'Actions' },
  { id: 'export', label: 'Export Data', icon: Share, shortcut: 'E', category: 'Actions' },
  { id: 'search', label: 'Search Everything', icon: Search, shortcut: '/', category: 'Actions' },

  // Settings
  { id: 'settings', label: 'Open Settings', icon: Settings, shortcut: ',', category: 'Settings' },
  { id: 'profile', label: 'Edit Profile', icon: User, shortcut: 'P', category: 'Settings' },
];

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Empresa Principal S.A.',
    ruc: '1792148549001',
    is_active: true,
    is_default: true,
  },
  {
    id: '2',
    name: 'Sucursal Norte Cia. Ltda.',
    ruc: '1792148549002',
    is_active: true,
    is_default: false,
  },
  {
    id: '3',
    name: 'Comercial del Sur S.A.',
    ruc: '1792148549003',
    is_active: true,
    is_default: false,
  },
];

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(commandItems);
  const [notificationCount, setNotificationCount] = useState(3);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { isOpen, setIsOpen } = useCompanyStore();

  useEffect(() => {
    setNotificationCount(10);

    const loadCompanies = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const companies = mockCompanies;

        setCompanies(companies);

        const defaultCompany = companies.find((c) => c.is_default) || companies[0] || null;
        setCurrentCompany(defaultCompany);
      } catch (error) {
        console.error('Error loading companies:', error);
        setCompanies([]);
        setCurrentCompany(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanies().then((r) => r);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsCommandOpen(true);
      }

      if (event.key === 'Escape') {
        setIsCommandOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredItems(commandItems);
    } else {
      const filtered = commandItems.filter(
        (item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery]);

  const handleCommandSelect = (item: CommandItem) => {
    setIsCommandOpen(false);
    setSearchQuery('');
    if (item.action) {
      item.action();
    } else {
      console.log(`Executing command: ${item.label}`);
    }
  };

  const handleCompanySwitch = async (companyId: string) => {
    try {
      setIsCompanyDropdownOpen(false);

      const selectedCompany = companies.find((c) => c.id === companyId);
      if (!selectedCompany) return;

      setCurrentCompany(selectedCompany);

      setCompanies((prev) =>
        prev.map((c) => ({
          ...c,
          is_default: c.id === companyId,
        })),
      );

      console.log(`Switching to company: ${selectedCompany.name}`);
    } catch (error) {
      console.error('Error switching company:', error);
    }
  };

  const handleEditCompany = () => {
    setIsOpen(true);

    setIsCompanyDropdownOpen(false);
    console.log(`Editing company: ${currentCompany?.name}`);
  };

  const handleCreateCompany = () => {
    setIsOpen(true);

    setIsCompanyDropdownOpen(false);
    console.log('Creating new company');
    window.location.href = '/companies/create';
  };

  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, CommandItem[]>,
  );

  const renderCompanySelector = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 px-2 py-1">
          <Building2 className="h-4 w-4 animate-pulse" />
          <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
        </div>
      );
    }

    if (companies.length === 0) {
      return (
        <Button variant="ghost" onClick={handleCreateCompany} className="h-auto p-0 font-normal text-foreground hover:bg-transparent focus:ring-0">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span className="text-muted-foreground">Crear Compañía</span>
          </div>
        </Button>
      );
    }

    return (
      <DropdownMenu open={isCompanyDropdownOpen} onOpenChange={setIsCompanyDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="ml-4 h-auto p-0 font-normal text-foreground hover:bg-transparent focus:ring-0">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="max-w-[200px] truncate">{currentCompany?.name || 'Seleccionar Compañía'}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-80">
          <DropdownMenuLabel className="text-xs text-muted-foreground">Cambiar Compañía</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {companies.map((company) => (
            <DropdownMenuItem key={company.id} onClick={() => handleCompanySwitch(company.id)} className="flex cursor-pointer items-center gap-3 p-3">
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

          {/* Opciones adicionales */}
          <DropdownMenuItem onClick={handleEditCompany} className="flex cursor-pointer items-center gap-2">
            <Edit className="h-4 w-4" />
            <span>Editar Compañía Actual</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleCreateCompany} className="flex cursor-pointer items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Crear Nueva Compañía</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const customBreadcrumbs: BreadcrumbItemType[] = [
    {
      title: renderCompanySelector(),
      href: '/dashboard',
    },
  ];

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sm:px-4 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <SidebarTrigger />

          <div className="min-w-0 flex-1">
            <Breadcrumbs breadcrumbs={customBreadcrumbs} />
          </div>
        </div>

        {/* Right side - Search and notifications */}
        <div className="flex items-center gap-2">
          {/* Search command trigger */}
          <Button
            variant="outline"
            className="relative flex w-48 justify-between text-sm text-muted-foreground sm:w-56 lg:w-64"
            onClick={() => setIsCommandOpen(true)}
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search or type a command</span>
              <span className="sm:hidden">Search</span>
            </div>
            <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 select-none">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          {/* Notifications button with badge */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* Command Palette Modal */}
      <Dialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="border-b px-4 py-3">
            <DialogTitle className="sr-only">Command Palette</DialogTitle>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Type a command or search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-0 bg-transparent py-2 pr-4 pl-10 text-sm placeholder:text-muted-foreground focus:ring-0 focus:outline-none"
                autoFocus
              />
            </div>
          </DialogHeader>

          <div className="max-h-96 overflow-y-auto">
            {Object.entries(groupedItems).length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">No commands found</div>
            ) : (
              Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="px-2 py-2">
                  <div className="px-2 py-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">{category}</div>
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleCommandSelect(item)}
                      className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.shortcut && (
                        <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground select-none">
                          {item.shortcut}
                        </kbd>
                      )}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>

          <div className="border-t bg-muted/20 px-4 py-3">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium select-none">
                  ↑↓
                </kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium select-none">
                  ↵
                </kbd>
                <span>Select</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium select-none">
                  Esc
                </kbd>
                <span>Close</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
