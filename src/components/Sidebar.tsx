import React from 'react';
import {
  LayoutDashboard,
  Factory,
  Store,
  Package,
  Boxes,
  FileQuestion,
  ShoppingCart,
  CreditCard,
  Receipt,
  ReceiptText,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck,
  Building2,
  Layers,
  Truck,
  User,
  KeyRound,
  X,
} from 'lucide-react';
import { UserRole } from '../types';
import { Logo } from './Logo';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

export interface PendingCounts {
  manufacturers?: number;
  distributors?: number;
  products?: number;
  rfqs?: number;
  orders?: number;
  inventoryAlerts?: number;
}

interface SidebarProps {
  currentRole?: UserRole;
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  pendingCounts?: PendingCounts;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = (props) => {
  const {
    currentRole = 'super_admin',
    currentScreen,
    onNavigate,
    onLogout,
    isMobileOpen,
    onCloseMobile,
  } = props;

  const pendingCounts: PendingCounts = props.pendingCounts || {};
  // Super Admin Navigation Items
  const superAdminMenuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'manufacturers', label: 'Manufacturer Management', icon: Factory },
    { id: 'distributors', label: 'Distributor Management', icon: Store },
    { id: 'products', label: 'Product Management', icon: Package },
    { id: 'categories', label: 'Category Management', icon: Boxes },
    { id: 'rfqs', label: 'RFQ Management', icon: FileQuestion },
    { id: 'orders', label: 'Order Management', icon: ShoppingCart },
    { id: 'subscriptions', label: 'Subscription Plans', icon: CreditCard },
    { id: 'invoices', label: 'Invoices', icon: ReceiptText },
    { id: 'payments', label: 'Payments', icon: Receipt },
    { id: 'cms', label: 'CMS Management', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Manufacturer Navigation Items
  const manufacturerMenuItems: MenuItem[] = [
    { id: 'mfr_dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'mfr_products',
      label: 'Products',
      icon: Package,
      badge: (pendingCounts.products ?? 0) > 0 ? pendingCounts.products : undefined,
      badgeColor: 'bg-[#0284C7] text-white',
    },
    {
      id: 'mfr_orders',
      label: 'Orders',
      icon: ShoppingCart,
      badge: (pendingCounts.orders ?? 0) > 0 ? pendingCounts.orders : undefined,
      badgeColor: 'bg-[#0284C7] text-white',
    },
    {
      id: 'mfr_inventory',
      label: 'Inventory',
      icon: Layers,
      badge: (pendingCounts.inventoryAlerts ?? 0) > 0 ? pendingCounts.inventoryAlerts : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'mfr_subscriptions', label: 'Subscription', icon: CreditCard },
    { id: 'mfr_payments', label: 'Payments', icon: Receipt },
    { id: 'mfr_settings', label: 'Settings', icon: Settings },
  ];

  // Distributor Navigation Items
  const distributorMenuItems: MenuItem[] = [
    { id: 'dst_dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'dst_kyc',
      label: 'KYC & Compliance',
      icon: ShieldCheck,
      badge: 'Verified',
      badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    },
    {
      id: 'dst_rfqs',
      label: 'RFQ / Enquiries',
      icon: FileQuestion,
      badge: '4 Quotes',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    {
      id: 'dst_orders',
      label: 'Orders',
      icon: ShoppingCart,
    },
    {
      id: 'dst_tracking',
      label: 'Delivery Tracking',
      icon: Truck,
    },
    {
      id: 'dst_subscription',
      label: 'Subscription',
      icon: CreditCard,
      badge: 'PRO',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    {
      id: 'dst_payments',
      label: 'Payments',
      icon: Receipt,
    },
    {
      id: 'dst_settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const menuItems =
    currentRole === 'manufacturer'
      ? manufacturerMenuItems
      : currentRole === 'distributor'
      ? distributorMenuItems
      : superAdminMenuItems;

  const menuHeaderLabel =
    currentRole === 'manufacturer'
      ? 'PLANT OPERATIONS'
      : currentRole === 'distributor'
      ? 'PROCUREMENT MENU'
      : 'MAIN MENU';

  const handleSelect = (screen: string) => {
    onNavigate(screen);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#E2E8F0] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 px-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Logo size="md" />
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden text-[#5A6B82] hover:text-[#0B1F3A] p-1.5 rounded-lg hover:bg-[#F4F7FC]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Header */}
        <div className="px-4 pt-3 pb-1">
          <span className="text-[10px] font-extrabold tracking-wider text-[#94A3B8] uppercase">
            {menuHeaderLabel}
          </span>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            {/* Panel-specific accent styles */}
            const activeBg =
              currentRole === 'manufacturer'
                ? 'bg-[#4B49AC] text-white shadow-xs'
                : currentRole === 'distributor'
                ? 'bg-[#6F42C1] text-white shadow-xs'
                : 'bg-[#0B1F3A] text-white shadow-xs';

            const activeIndicatorBg =
              currentRole === 'manufacturer'
                ? 'bg-[#FF7A18]'
                : currentRole === 'distributor'
                ? 'bg-[#FF7A18]'
                : 'bg-[#FF7A18]';

            const activeIconColor =
              currentRole === 'manufacturer'
                ? 'text-indigo-200'
                : currentRole === 'distributor'
                ? 'text-purple-200'
                : 'text-[#FF7A18]';

            const activeBadgeBg =
              currentRole === 'manufacturer'
                ? 'bg-[#FF7A18] text-white'
                : currentRole === 'distributor'
                ? 'bg-[#FF7A18] text-white'
                : 'bg-[#FF7A18] text-white';

            const inactiveHoverClass =
              currentRole === 'manufacturer'
                ? 'text-slate-600 hover:text-[#4B49AC] hover:bg-[#EEEDFD]/70'
                : currentRole === 'distributor'
                ? 'text-slate-600 hover:text-[#6F42C1] hover:bg-[#F3EEFA]/70'
                : 'text-[#5A6B82] hover:text-[#0B1F3A] hover:bg-[#F4F7FC]';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group cursor-pointer ${
                  isActive ? activeBg : inactiveHoverClass
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Panel Accent Indicator for Active State */}
                  {isActive && (
                    <span className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${activeIndicatorBg}`} />
                  )}
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? activeIconColor : 'text-[#5A6B82] group-hover:text-current'
                    }`}
                  />
                  <span className="truncate text-left">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md shrink-0 ${
                      isActive
                        ? activeBadgeBg
                        : item.badgeColor ||
                          (currentRole === 'manufacturer'
                            ? 'bg-[#4B49AC] text-white'
                            : currentRole === 'distributor'
                            ? 'bg-[#6F42C1] text-white'
                            : 'bg-[#0B1F3A] text-white')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
