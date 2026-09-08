import React from 'react';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  CheckCircle2,
  Check,
  CreditCard,
  Truck,
} from 'lucide-react';
import {
  ManufacturerProfileData,
  Product,
  Rfq,
  Order,
  ManufacturerInventoryItem,
  ManufacturerQuotation,
  ManufacturerSettlement,
} from '../../types';
import { INITIAL_MFR_PROFILE } from '../../mockData';

interface MfrDashboardScreenProps {
  profile?: ManufacturerProfileData;
  products?: Product[];
  rfqs?: Rfq[];
  orders?: Order[];
  inventory?: ManufacturerInventoryItem[];
  quotations?: ManufacturerQuotation[];
  settlements?: ManufacturerSettlement[];
  activities?: Array<{
    id: string;
    title: string;
    description: string;
    time: string;
    type: string;
    screen: string;
  }>;
  onNavigate: (screen: string) => void;
  onOpenQuoteModal?: (rfq: Rfq) => void;
}

export const MfrDashboardScreen: React.FC<MfrDashboardScreenProps> = ({
  profile = INITIAL_MFR_PROFILE,
  products = [],
  rfqs = [],
  orders = [],
  inventory = [],
  quotations = [],
  settlements = [],
  onNavigate,
}) => {
  // KPI items matching the screenshot
  const kpis = [
    {
      id: 'active_products',
      title: 'Active Products',
      value: '120',
      icon: Package,
      targetScreen: 'mfr_products',
    },
    {
      id: 'dispatches',
      title: 'Pending Dispatches',
      value: '7',
      icon: Truck,
      targetScreen: 'mfr_orders',
    },
    {
      id: 'new_orders',
      title: 'New Orders',
      value: '25',
      icon: ShoppingCart,
      targetScreen: 'mfr_orders',
    },
    {
      id: 'revenue',
      title: 'Revenue',
      value: '₹2,45,000',
      icon: TrendingUp,
      targetScreen: 'mfr_payments',
    },
    {
      id: 'subscription_status',
      title: 'Subscription Status',
      value: 'Premium',
      icon: CheckCircle2,
      targetScreen: 'mfr_subscriptions',
      isOrangeIcon: true,
    },
  ];

  // Stepper milestones
  const steps = [
    {
      id: 'company_details',
      label: 'Company Details',
      status: 'Completed',
      isCompleted: true,
      targetScreen: 'mfr_profile',
    },
    {
      id: 'kyc_documents',
      label: 'KYC Documents',
      status: 'Completed',
      isCompleted: true,
      targetScreen: 'mfr_kyc',
    },
    {
      id: 'bank_details',
      label: 'Bank Details',
      status: 'Pending',
      isCompleted: false,
      targetScreen: 'mfr_profile',
    },
    {
      id: 'product_info',
      label: 'Product Information',
      status: 'Pending',
      isCompleted: false,
      targetScreen: 'mfr_products',
    },
  ];

  // Recent activities list matching screenshot
  const recentActivities = [
    {
      id: 'act-1',
      title: 'New order received',
      icon: ShoppingCart,
      targetScreen: 'mfr_orders',
    },
    {
      id: 'act-2',
      title: 'Product approved',
      icon: CheckCircle2,
      targetScreen: 'mfr_products',
    },
    {
      id: 'act-3',
      title: 'Order status updated',
      icon: ShoppingCart,
      targetScreen: 'mfr_orders',
    },
    {
      id: 'act-4',
      title: 'Payment received',
      icon: CreditCard,
      targetScreen: 'mfr_payments',
    },
  ];

  // Product performance table data matching screenshot
  const productPerformance = [
    {
      id: 'prod-1',
      name: 'Classic Airtight Container (5 Ltrs)',
      category: 'Storage Containers',
      stock: '2,500',
      status: 'Active',
      statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'prod-2',
      name: 'Premium Insulated Lunch Box',
      category: 'Tiffins & Lunchware',
      stock: '850',
      status: 'Active',
      statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'prod-3',
      name: 'Modular Draw Organizer (Large)',
      category: 'Organizers',
      stock: '120',
      status: 'Low Stock',
      statusClass: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'prod-4',
      name: 'Heavy Duty Multi-Utility Tub',
      category: 'Bathroom & Utility',
      stock: '0',
      status: 'Pending',
      statusClass: 'bg-slate-100 text-slate-600 border-slate-200',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Top Welcome Banner (without Complete Profile button) */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Welcome Back, <span className="text-[#4B49AC]">Manufacturer</span>
          </h2>
          <p className="text-sm text-[#5A6B82] mt-1 font-normal">
            Manage your products, orders and business growth
          </p>
        </div>
      </div>

      {/* 2. Metric KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              onClick={() => onNavigate(kpi.targetScreen)}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:border-[#4B49AC]/40 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    kpi.isOrangeIcon
                      ? 'bg-[#EEEDFD] text-[#4B49AC] border border-[#D6D4F7]'
                      : 'bg-[#F8FAFC] text-[#5A6B82] border border-[#E2E8F0]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-[#5A6B82] mt-4 block">
                  {kpi.title}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
                  {kpi.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Product Performance Full Width Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Product Performance
          </h3>
          <button
            type="button"
            onClick={() => onNavigate('mfr_products')}
            className="text-xs font-semibold text-[#4B49AC] hover:text-[#3F3D99] hover:underline cursor-pointer"
          >
            View All Products →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-xs font-semibold text-[#5A6B82]">
                <th className="pb-3 px-4">Product Name</th>
                <th className="pb-3 px-4">Category</th>
                <th className="pb-3 px-4 text-center">Stock</th>
                <th className="pb-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]/80 text-xs">
              {productPerformance.map((prod) => (
                <tr
                  key={prod.id}
                  onClick={() => onNavigate('mfr_products')}
                  className="hover:bg-[#EEEDFD]/40 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-4 font-semibold text-slate-900">
                    {prod.name}
                  </td>
                  <td className="py-4 px-4 text-[#5A6B82]">
                    {prod.category}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-slate-900">
                    {prod.stock}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold border ${prod.statusClass}`}
                    >
                      {prod.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
