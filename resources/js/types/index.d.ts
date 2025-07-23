import { LucideIcon } from 'lucide-react';
import React from 'react';
import type { Config } from 'ziggy-js';

export interface Auth {
  user: User;
  teams: Team[] | null;
  current_team: Team | null;
  companies: Company[] | null;
  current_company: Company | null;
}

export interface BreadcrumbItem {
  title: string | React.ReactNode;
  href: string;
}

export interface NavItem {
  title: string;
  href?: string;
  icon?: LucideIcon;
  items?: NavItem[];
  isActive?: boolean;
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  ziggy: Config & { location: string };
  sidebarOpen: boolean;
  [key: string]: unknown;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface Team {
  description: string;
  name: string;
  user_id: string;
  id: string;
}

export interface Company {
  id: string;
  ruc: string;
  name: string;
  is_current: boolean;
  is_active: boolean;
  is_default: boolean;
}
