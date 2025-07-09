import { NavFooter } from '@/components/nav-footer';
import { buyerNavItem, inventoryNavItem, mainNavItems, salesNavItem } from '@/components/nav-items';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Soporte Técnico',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: BookOpen,
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
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} title={'Menú Principal'} />
                <NavMain items={inventoryNavItem} title={'Inventario'} />
                <NavMain items={buyerNavItem} title={'Compras'} />
                <NavMain items={salesNavItem} title={'Ventas y Facturación'} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
