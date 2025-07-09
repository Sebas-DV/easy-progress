import type { NavItem } from '@/types';
import {
    AlertTriangle,
    Archive,
    ArrowRightLeft,
    ArrowUpDown,
    Award,
    BarChart,
    BarChart3,
    Building,
    Calculator,
    Calendar,
    CheckSquare,
    ClipboardCheck,
    ClipboardList,
    Clock,
    CreditCard,
    DollarSign,
    Edit,
    Eye,
    FileText,
    Hash,
    LayoutGrid,
    List,
    Package,
    Package2,
    Plus,
    Receipt,
    Repeat,
    Ruler,
    Search,
    Send,
    ShoppingCart,
    Star,
    Tags,
    TrendingUp,
    Truck,
    Users,
    Wallet,
    Warehouse,
    Zap,
} from 'lucide-react';

export const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        isActive: true,
    },
];

export const inventoryNavItem: NavItem[] = [
    {
        title: 'Productos',
        icon: Package,
        items: [
            {
                title: 'Lista de Productos',
                href: '/users',
                icon: Package,
            },
            {
                title: 'Categorías',
                href: '/users/roles',
                icon: Tags,
            },
            {
                title: 'Unidades de Medida',
                href: '/users/create',
                icon: Ruler,
            },
            {
                title: 'Conversiones',
                href: '/users/create',
                icon: ArrowRightLeft,
            },
        ],
    },
    {
        title: 'Almacenes',
        icon: Building,
        items: [
            {
                title: 'Almacenes',
                href: '/users',
                icon: Warehouse,
            },
        ],
    },
    {
        title: 'Movimientos',
        icon: TrendingUp,
        items: [
            {
                title: 'Movimientos de Inventario',
                href: '/users',
                icon: ArrowUpDown,
            },
            {
                title: 'Transferencias',
                href: '/users/roles',
                icon: ArrowRightLeft,
            },
            {
                title: 'Ajustes de Inventario',
                href: '/users/create',
                icon: Edit,
            },
            {
                title: 'Reservas',
                href: '/users/create',
                icon: Eye,
            },
        ],
    },
    {
        title: 'Control de Calidad',
        icon: ClipboardCheck,
        items: [
            {
                title: 'Inspecciones',
                href: '/users',
                icon: CheckSquare,
            },
            {
                title: 'Certificaciones',
                href: '/users/roles',
                icon: Award,
            },
            {
                title: 'No Conformidades',
                href: '/users/create',
                icon: AlertTriangle,
            },
        ],
    },
    {
        title: 'Inventario Físico',
        icon: Search,
        items: [
            {
                title: 'Conteos Físicos',
                href: '/users',
                icon: ClipboardList,
            },
            {
                title: 'Análisis de Variaciones',
                href: '/users/roles',
                icon: BarChart3,
            },
            {
                title: 'Programación de Conteos',
                href: '/users/create',
                icon: Calendar,
            },
        ],
    },
    {
        title: 'Lotes y Series',
        icon: Package2,
        items: [
            {
                title: 'Control de Lotes',
                href: '/users',
                icon: Hash,
            },
            {
                title: 'Fechas de Vencimiento',
                href: '/users/roles',
                icon: Calendar,
            },
            {
                title: 'Trazabilidad',
                href: '/users/create',
                icon: BarChart,
            },
        ],
    },
];

export const buyerNavItem: NavItem[] = [
    {
        title: 'Proveedores',
        icon: Users,
        items: [
            {
                title: 'Lista de Proveedores',
                href: '/users',
                icon: Building,
            },
            {
                title: 'Términos de Pago',
                href: '/users/roles',
                icon: CreditCard,
            },
            {
                title: 'Evaluaciones',
                href: '/users/create',
                icon: Star,
            },
            {
                title: 'Documentos',
                href: '/users/create',
                icon: FileText,
            },
        ],
    },
    {
        title: 'Órdenes de Compra',
        icon: ShoppingCart,
        items: [
            {
                title: 'Nueva Orden',
                href: '/users',
                icon: Plus,
            },
            {
                title: 'Lista de Órdenes',
                href: '/users/roles',
                icon: List,
            },
            {
                title: 'Seguimiento',
                href: '/users/create',
                icon: Clock,
            },
            {
                title: 'Aprobaciones',
                href: '/users/create',
                icon: CheckSquare,
            },
        ],
    },
    {
        title: 'Recepciones',
        icon: Receipt,
        items: [
            {
                title: 'Registro de Compras',
                href: '/users',
                icon: FileText,
            },
            {
                title: 'Liquidaciones',
                href: '/users/roles',
                icon: Receipt,
            },
            {
                title: 'Notas de Crédito/Débito',
                href: '/users/create',
                icon: CreditCard,
            },
            {
                title: 'Archivo Digital',
                href: '/users/create',
                icon: Archive,
            },
        ],
    },
    {
        title: 'Retenciones',
        icon: FileText,
        items: [
            {
                title: 'Comprobantes de Retención',
                href: '/users',
                icon: Receipt,
            },
            {
                title: 'Cálculo de Retenciones',
                href: '/users/roles',
                icon: Calculator,
            },
            {
                title: 'Archivo de Retenciones',
                href: '/users/create',
                icon: Archive,
            },
        ],
    },
];

export const salesNavItem: NavItem[] = [
    {
        title: 'Clientes',
        icon: Users,
        items: [
            {
                title: 'Lista de Clientes',
                href: '/users',
                icon: Users,
            },
            {
                title: 'Límites de Crédito',
                href: '/users/roles',
                icon: CreditCard,
            },
            {
                title: 'Evaluaciones Crediticias',
                href: '/users/create',
                icon: TrendingUp,
            },
            {
                title: 'Términos de Pago',
                href: '/users/create',
                icon: FileText,
            },
        ],
    },
    {
        title: 'Cotizaciones',
        icon: FileText,
        items: [
            {
                title: 'Nueva Cotización',
                href: '/users',
                icon: Plus,
            },
            {
                title: 'Lista de Cotizaciones',
                href: '/users/roles',
                icon: List,
            },
            {
                title: 'Envío de Cotizaciones',
                href: '/users/create',
                icon: Send,
            },
            {
                title: 'Seguimiento',
                href: '/users/create',
                icon: CheckSquare,
            },
        ],
    },
    {
        title: 'Órdenes de Venta',
        icon: ShoppingCart,
        items: [
            {
                title: 'Nueva Orden',
                href: '/users',
                icon: Plus,
            },
            {
                title: 'Órdenes Pendientes',
                href: '/users/roles',
                icon: List,
            },
            {
                title: 'Estado de Entregas',
                href: '/users/create',
                icon: Truck,
            },
            {
                title: 'Preparación',
                href: '/users/create',
                icon: Package,
            },
        ],
    },
    {
        title: 'Facturación',
        icon: Receipt,
        items: [
            {
                title: 'Facturas',
                href: '/users',
                icon: FileText,
            },
            {
                title: 'Notas de Crédito',
                href: '/users/roles',
                icon: CreditCard,
            },
            {
                title: 'Notas de Débito',
                href: '/users/create',
                icon: Plus,
            },
            {
                title: 'Facturación Recurrente',
                href: '/users/create',
                icon: Repeat,
            },
            {
                title: 'Ciclos de Facturación',
                href: '/users/create',
                icon: Calendar,
            },
        ],
    },
    {
        title: 'Anticipos',
        icon: DollarSign,
        items: [
            {
                title: 'Recepción de Anticipos',
                href: '/users',
                icon: Wallet,
            },
            {
                title: 'Aplicación de Anticipos',
                href: '/users/roles',
                icon: ArrowRightLeft,
            },
            {
                title: 'Estado de Anticipos',
                href: '/users/create',
                icon: List,
            },
        ],
    },
    {
        title: 'Facturación Electrónica',
        icon: Zap,
        items: [
            {
                title: 'Envío al SRI',
                href: '/users',
                icon: Send,
            },
            {
                title: 'Autorizaciones',
                href: '/users/roles',
                icon: CheckSquare,
            },
            {
                title: 'Errores y Rechazos',
                href: '/users/create',
                icon: AlertTriangle,
            },
            {
                title: 'Archivo Electrónico',
                href: '/users/create',
                icon: Archive,
            },
        ],
    },
];
