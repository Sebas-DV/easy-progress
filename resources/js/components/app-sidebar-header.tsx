import { Breadcrumbs } from '@/components/breadcrumbs';
import { CompanySwitcher } from '@/components/company-switcher';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Bell, Calendar, File, Folder, Grid3x3, Home, Search, Settings, Share, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  category: string;
  action?: () => void;
}

const commandItems: CommandItem[] = [
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

export function AppSidebarHeader() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(commandItems);
  const [notificationCount, setNotificationCount] = useState(3);

  useEffect(() => {
    setNotificationCount(10);
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

  const customBreadcrumbs: BreadcrumbItemType[] = [
    {
      title: <CompanySwitcher />,
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
