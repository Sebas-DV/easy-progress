import { NavFooter } from '@/components/nav-footer';
import { electronicInvoicesNavItem, externalNavItem, inventoryNavItem, mainNavItems, salesNavItem, settingsNavItem } from '@/components/nav-items';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Headset } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Soporte Técnico',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Headset,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                <TeamSwitcher />
            </SidebarHeader>

            <SidebarContent className={'gap-0'}>
                <NavMain items={mainNavItems} title={'Menú Principal'} />
                <NavMain items={externalNavItem} title={'Terceros'} />
                <NavMain items={inventoryNavItem} title={'Inventario'} />
                <NavMain items={salesNavItem} title={'Ventas '} />
                <NavMain items={electronicInvoicesNavItem} title={'Documentos Electrónicos'} />
                <NavMain items={settingsNavItem} title={'Configuración'} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
