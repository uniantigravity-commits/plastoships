import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  User,
  LogOut,
  Settings as SettingsIcon,
  Shield,
  CheckCheck,
  Menu,
  ChevronDown,
  Building2,
  Factory,
  Store,
  CreditCard,
  Layers,
  KeyRound,
} from 'lucide-react';
import { UserRole } from '../types';
import { LogoIcon } from './Logo';

interface HeaderProps {
  currentRole?: UserRole;
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  onOpenMobile: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  pendingTotal: number;
  onSwitchRole?: (role: UserRole) => void;
  onOpenProfileModal?: () => void;
  onOpenChangePasswordModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole = 'super_admin',
  currentScreen,
  onNavigate,
  onLogout,
  onOpenMobile,
  searchQuery,
  onSearchChange,
  pendingTotal,
  onSwitchRole,
  onOpenProfileModal,
  onOpenChangePasswordModal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Super Admin Notifications
  const [superAdminNotifications, setSuperAdminNotifications] = useState([
    {
      id: 'N-1',
      title: 'New Manufacturer KYC Submitted',
      description: 'Dahej Petro Compounders Pvt Ltd submitted PAN, GSTIN & Factory License.',
      time: '12m ago',
      read: false,
      screen: 'manufacturers',
    },
    {
      id: 'N-2',
      title: 'Product Review Required',
      description: 'Morbi Polymer submitted HDPE Blow Moulding Granules (B56003).',
      time: '45m ago',
      read: false,
      screen: 'products',
    },
    {
      id: 'N-3',
      title: 'High-Volume RFQ Broadcast',
      description: 'Shreeji Polymer created RFQ for 25 MT HDPE Granules (Sanand Hub).',
      time: '2h ago',
      read: false,
      screen: 'rfqs',
    },
    {
      id: 'N-4',
      title: 'Subscription Expiring in 48h',
      description: 'Morbi Polymer Diamond annual tier renewal is due tomorrow.',
      time: '5h ago',
      read: true,
      screen: 'subscriptions',
    },
  ]);

  // Manufacturer Notifications
  const [mfrNotifications, setMfrNotifications] = useState([
    {
      id: 'MN-1',
      title: 'New RFQ in HDPE Granules',
      description: 'Shreeji Polymer created RFQ-GJ-9410 for 25 MT HDPE Blow Moulding.',
      time: '15m ago',
      read: false,
      screen: 'mfr_orders',
    },
    {
      id: 'MN-2',
      title: 'Order Confirmed by Buyer',
      description: 'Order ORD-GJ-7028 (20 MT Pipe Resins) confirmed. Escrow payment secured.',
      time: '1h ago',
      read: false,
      screen: 'mfr_orders',
    },
    {
      id: 'MN-3',
      title: 'Escrow Settlement Credited',
      description: '₹21,51,555 credited to HDFC Bank A/C ...2341 for ORD-GJ-7012.',
      time: '1d ago',
      read: true,
      screen: 'mfr_payments',
    },
  ]);

  // Distributor Notifications
  const [dstNotifications, setDstNotifications] = useState([
    {
      id: 'DN-1',
      title: 'Quote Received for RFQ-GJ-9410',
      description: 'Morbi Polymer submitted quote ₹106.5/Kg for 25 MT HDPE Granules.',
      time: '20m ago',
      read: false,
      screen: 'dst_rfqs',
    },
    {
      id: 'DN-2',
      title: 'Dispatch Confirmed for ORD-GJ-7035',
      description: 'Vapi Polymers dispatched 30 MT PP Raffia Granules (TRK-GJ-882410).',
      time: '3h ago',
      read: false,
      screen: 'dst_orders',
    },
  ]);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications =
    currentRole === 'manufacturer'
      ? mfrNotifications
      : currentRole === 'distributor'
      ? dstNotifications
      : superAdminNotifications;

  const setNotifications =
    currentRole === 'manufacturer'
      ? setMfrNotifications
      : currentRole === 'distributor'
      ? setDstNotifications
      : setSuperAdminNotifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev: any[]) => prev.map((n) => ({ ...n, read: true })));
  };

  const getScreenTitle = (screen: string) => {
    switch (screen) {
      // Super Admin Screens
      case 'dashboard':
        return 'Dashboard';
      case 'manufacturers':
        return 'Manufacturer Management';
      case 'distributors':
        return 'Distributor Management';
      case 'products':
        return 'Product Management';
      case 'categories':
        return 'Category Management';
      case 'rfqs':
        return 'RFQ Management';
      case 'orders':
        return 'Order Management';
      case 'subscriptions':
        return 'Subscription Plans & Renewals';
      case 'payments':
        return 'Payments & Transactions';
      case 'cms':
        return 'CMS & Marketplace Content';
      case 'reports':
        return 'Analytics & Reports';
      case 'settings':
        return 'Admin Settings';

      // Manufacturer Screens
      case 'mfr_dashboard':
        return 'Dashboard';
      case 'mfr_profile':
        return 'Company Profile';
      case 'mfr_kyc':
        return 'KYC & Compliance';
      case 'mfr_products':
        return 'Products';
      case 'mfr_categories':
        return 'Categories';
      case 'mfr_orders':
      case 'mfr_rfqs':
        return 'Orders';
      case 'mfr_inventory':
        return 'Inventory';
      case 'mfr_subscriptions':
        return 'Subscription';
      case 'mfr_payments':
        return 'Payments';
      case 'mfr_settings':
        return 'Settings';

      // Distributor Screens
      case 'dst_dashboard':
        return 'Procurement Dashboard';
      case 'dst_profile':
        return 'Profile';
      case 'dst_password':
      case 'dst_change_password':
        return 'Change Password';
      case 'dst_catalog':
        return 'Polymer Catalog';
      case 'dst_rfqs':
        return 'RFQ / Enquiries';
      case 'dst_quotations':
        return 'Quotations Received';
      case 'dst_orders':
        return 'Purchase Orders';
      case 'dst_tracking':
        return 'Delivery Tracking';
      case 'dst_subscription':
        return 'Subscription & Credit Plan';
      case 'dst_payments':
        return 'Escrow & Payments';
      case 'dst_kyc':
        return 'KYC & Compliance';
      case 'dst_settings':
        return 'Buyer Account Settings';

      default:
        return 'Dashboard';
    }
  };

  const roleMeta = {
    super_admin: {
      portalName: 'PlastoShip',
      userTitle: 'Super Admin',
      userSubtitle: 'System Administrator',
      avatarText: 'SA',
      avatarBg: 'bg-[#0B1F3A]',
      badgeText: 'Super Admin',
      badgeBg: 'bg-orange-50 text-[#FF7A18] border border-orange-200',
      company: 'PlastoShip Operations',
      email: 'admin@plastoship.com',
      searchPlaceholder: 'Search plants, products...',
      profileScreen: 'settings',
      accentColor: '#FF7A18',
    },
    manufacturer: {
      portalName: 'PlastoShip Plant Portal',
      userTitle: 'Morbi Polymer Extrusions',
      userSubtitle: 'MFR-GJ-1042 • Diamond Plant',
      avatarText: 'M',
      avatarBg: 'bg-[#4B49AC]',
      badgeText: 'Manufacturer',
      badgeBg: 'bg-[#EEEDFD] text-[#4B49AC] border border-[#D6D4F7]',
      company: 'Morbi Polymer Extrusions Pvt Ltd',
      email: 'jayesh@morbipolymers.in',
      searchPlaceholder: 'Search inventory, orders...',
      profileScreen: 'mfr_profile',
      accentColor: '#4B49AC',
    },
    distributor: {
      portalName: 'PlastoShip Buyer Portal',
      userTitle: 'Apex Polymers LLP',
      userSubtitle: 'DST-94821 • Verified Wholesaler',
      avatarText: 'AP',
      avatarBg: 'bg-[#6F42C1]',
      badgeText: 'Distributor',
      badgeBg: 'bg-[#F3EEFA] text-[#6F42C1] border border-[#DECFF6]',
      company: 'Apex Polymers LLP (Ahmedabad)',
      email: 'procurement@apexpolymers.in',
      searchPlaceholder: 'Search RFQs, quotations, orders, tracking...',
      profileScreen: 'dst_profile',
      accentColor: '#6F42C1',
    },
  }[currentRole];

  return (
    <header className="sticky top-0 z-30 h-18 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 md:px-8 flex items-center justify-between transition-all relative">
      {/* Subtle Top Panel Indicator Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 ${
          currentRole === 'manufacturer'
            ? 'bg-[#4B49AC]'
            : currentRole === 'distributor'
            ? 'bg-[#6F42C1]'
            : 'bg-[#FF7A18]'
        }`}
      />

      {/* Left: Mobile Menu & Current Breadcrumb */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-[#5A6B82] hover:text-[#0B1F3A] hover:bg-[#F4F7FC]"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden shrink-0">
          <LogoIcon size="sm" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#5A6B82] hidden sm:inline">
              {roleMeta.portalName}
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">/</span>
            <h1 className="text-sm md:text-base font-bold text-[#0B1F3A] truncate">
              {getScreenTitle(currentScreen)}
            </h1>
            <span className={`hidden md:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${roleMeta.badgeBg}`}>
              {roleMeta.badgeText}
            </span>
          </div>
        </div>
      </div>

      {/* Right Side: Global Search, Live Status, Notification, Profile */}
      <div className="flex items-center gap-2 md:gap-3.5">
        {/* Search */}
        <div className="relative hidden md:block w-60 lg:w-72">
          <Search className="w-4 h-4 text-[#5A6B82] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={roleMeta.searchPlaceholder}
            className={`w-full h-9.5 pl-9.5 pr-4 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] placeholder-[#5A6B82] focus:outline-none focus:bg-white transition-all font-medium ${
              currentRole === 'manufacturer'
                ? 'focus:border-[#4B49AC]'
                : currentRole === 'distributor'
                ? 'focus:border-[#6F42C1]'
                : 'focus:border-[#0B1F3A]'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5A6B82] hover:text-[#0B1F3A]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative w-9.5 h-9.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F4F7FC] flex items-center justify-center text-[#0B1F3A] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span
                className={`absolute -top-1 -right-1 w-4.5 h-4.5 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs ${
                  currentRole === 'manufacturer'
                    ? 'bg-[#4B49AC]'
                    : currentRole === 'distributor'
                    ? 'bg-[#6F42C1]'
                    : 'bg-[#FF7A18]'
                }`}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
              <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider">
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        currentRole === 'manufacturer'
                          ? 'bg-[#EEEDFD] text-[#4B49AC] border border-[#D6D4F7]'
                          : currentRole === 'distributor'
                          ? 'bg-[#F5F0FC] text-[#6F42C1] border border-[#DDD0F5]'
                          : 'bg-orange-50 text-[#FF7A18] border border-orange-200'
                      }`}
                    >
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className={`text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                      currentRole === 'manufacturer'
                        ? 'text-[#4B49AC] hover:underline'
                        : currentRole === 'distributor'
                        ? 'text-[#6F42C1] hover:underline'
                        : 'text-[#0B1F3A] hover:text-[#FF7A18]'
                    }`}
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#E2E8F0]/70">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#5A6B82]">
                    No notifications at this time.
                  </div>
                ) : (
                  notifications.map((item: any) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.screen);
                        setShowNotifications(false);
                        setNotifications((prev: any[]) =>
                          prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
                        );
                      }}
                      className={`p-3.5 cursor-pointer hover:bg-[#F4F7FC] transition-colors flex items-start gap-3 ${
                        !item.read ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          !item.read ? 'bg-[#FF7A18]' : 'bg-slate-300'
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-[#0B1F3A] truncate">{item.title}</p>
                          <span className="text-[10px] text-[#5A6B82] shrink-0">{item.time}</span>
                        </div>
                        <p className="text-[11px] text-[#5A6B82] mt-0.5 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 pl-1.5 sm:pr-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F4F7FC] transition-colors"
          >
            <div className={`w-7.5 h-7.5 rounded-lg ${roleMeta.avatarBg} text-white flex items-center justify-center font-bold text-xs`}>
              {roleMeta.avatarText}
            </div>
            <div className="text-left hidden sm:block max-w-[130px] lg:max-w-[170px]">
              <p className="text-xs font-bold text-[#0B1F3A] leading-tight truncate">
                {roleMeta.userTitle}
              </p>
              <p className="text-[10px] text-[#5A6B82] truncate">{roleMeta.userSubtitle}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#5A6B82] hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 py-1">
              <div className="px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <p className="text-xs font-bold text-[#0B1F3A] truncate">{roleMeta.company}</p>
                <p className="text-[11px] text-[#5A6B82] truncate">{roleMeta.email}</p>
                <span
                  className={`mt-1.5 inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded ${roleMeta.badgeBg}`}
                >
                  {roleMeta.badgeText}
                </span>
              </div>

              <button
                type="button"
                id="header-user-profile-menu-btn"
                onClick={() => {
                  if (onOpenProfileModal) {
                    onOpenProfileModal();
                  } else {
                    onNavigate(roleMeta.profileScreen);
                  }
                  setShowProfileMenu(false);
                }}
                className="w-full px-4 py-2.5 text-xs font-semibold text-[#0B1F3A] hover:bg-[#F4F7FC] flex items-center gap-2.5 text-left cursor-pointer transition-colors"
              >
                <User className="w-4 h-4 text-[#5A6B82]" />
                <span>Profile</span>
              </button>

              <button
                type="button"
                id="header-user-change-password-menu-btn"
                onClick={() => {
                  if (onOpenChangePasswordModal) {
                    onOpenChangePasswordModal();
                  } else {
                    onNavigate('change_password');
                  }
                  setShowProfileMenu(false);
                }}
                className="w-full px-4 py-2.5 text-xs font-semibold text-[#0B1F3A] hover:bg-[#F4F7FC] flex items-center gap-2.5 text-left cursor-pointer transition-colors"
              >
                <KeyRound className="w-4 h-4 text-[#5A6B82]" />
                <span>Change Password</span>
              </button>

              {/* Fast Switch Role Helper for Testing & Verification */}
              {onSwitchRole && (
                <div className="border-t border-[#E2E8F0] my-1 pt-1 bg-[#F8FAFC]/50 px-2 py-1.5">
                  <p className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider px-2 mb-1">
                    Quick Role Switch
                  </p>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchRole('super_admin');
                        setShowProfileMenu(false);
                      }}
                      className={`text-[10px] font-bold py-1.5 px-1 rounded text-center transition-all cursor-pointer ${
                        currentRole === 'super_admin'
                          ? 'bg-[#0B1F3A] text-[#FF7A18] shadow-xs border border-orange-400/30'
                          : 'text-[#5A6B82] hover:bg-slate-200'
                      }`}
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchRole('manufacturer');
                        setShowProfileMenu(false);
                      }}
                      className={`text-[10px] font-bold py-1.5 px-1 rounded text-center transition-all cursor-pointer ${
                        currentRole === 'manufacturer'
                          ? 'bg-[#4B49AC] text-[#FF7A18] shadow-xs border border-indigo-400/30'
                          : 'text-[#5A6B82] hover:bg-slate-200'
                      }`}
                    >
                      Plant
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchRole('distributor');
                        setShowProfileMenu(false);
                      }}
                      className={`text-[10px] font-bold py-1.5 px-1 rounded text-center transition-all cursor-pointer ${
                        currentRole === 'distributor'
                          ? 'bg-[#6F42C1] text-[#FF7A18] shadow-xs border border-purple-400/30'
                          : 'text-[#5A6B82] hover:bg-slate-200'
                      }`}
                    >
                      Buyer
                    </button>
                  </div>
                </div>
              )}

              <div className="border-t border-[#E2E8F0] my-1" />

              <button
                type="button"
                onClick={onLogout}
                className="w-full px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
