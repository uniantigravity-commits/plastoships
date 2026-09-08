import React from 'react';
import {
  Factory,
  Store,
  Package,
  FileQuestion,
  ShoppingCart,
  IndianRupee,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Building,
} from 'lucide-react';
import {
  NavScreen,
  Manufacturer,
  Distributor,
  Product,
  Rfq,
  Order,
  SubscriptionRecord,
} from '../types';

interface DashboardScreenProps {
  onNavigate: (screen: NavScreen) => void;
  manufacturers: Manufacturer[];
  distributors: Distributor[];
  products: Product[];
  rfqs: Rfq[];
  orders: Order[];
  subscriptions: SubscriptionRecord[];
  recentActivities: Array<{
    id: string;
    title: string;
    description: string;
    time: string;
    type: string;
    navScreen: NavScreen;
  }>;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  manufacturers,
  distributors,
  products,
  rfqs,
  orders,
  subscriptions,
  recentActivities,
}) => {
  // Compute live metrics
  const totalManufacturers = manufacturers.length;
  const totalDistributors = distributors.length;
  const totalProducts = products.length;
  const activeRfqs = rfqs.filter((r) => r.status !== 'Closed').length;
  const totalOrders = orders.length;

  const totalSubscriptionRevenue = subscriptions.reduce((acc, curr) => acc + curr.amount, 0);

  // Pending counts
  const pendingMfrKyc = manufacturers.filter((m) => m.kycStatus === 'Pending').length;
  const pendingDstKyc = distributors.filter((d) => d.kycStatus === 'Pending').length;
  const pendingPrdApproval = products.filter((p) => p.status === 'Pending').length;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const kpis = [
    {
      id: 'mfr',
      title: 'Total Manufacturers',
      value: totalManufacturers.toString(),
      trend: '+4 this month',
      targetScreen: 'manufacturers' as NavScreen,
      icon: Factory,
      accent: 'bg-blue-50 text-blue-700',
    },
    {
      id: 'dst',
      title: 'Total Distributors',
      value: totalDistributors.toString(),
      trend: '+6 verified',
      targetScreen: 'distributors' as NavScreen,
      icon: Store,
      accent: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'prd',
      title: 'Total Products',
      value: totalProducts.toString(),
      trend: `${products.filter((p) => p.status === 'Approved').length} Live Catalog`,
      targetScreen: 'products' as NavScreen,
      icon: Package,
      accent: 'bg-purple-50 text-purple-700',
    },
    {
      id: 'rfq',
      title: 'Active RFQs',
      value: activeRfqs.toString(),
      trend: '₹1.8 Cr Live Pipeline',
      targetScreen: 'rfqs' as NavScreen,
      icon: FileQuestion,
      accent: 'bg-amber-50 text-amber-700',
    },
    {
      id: 'ord',
      title: 'Total Orders',
      value: totalOrders.toString(),
      trend: `${orders.filter((o) => o.orderStatus === 'Completed').length} Delivered`,
      targetScreen: 'orders' as NavScreen,
      icon: ShoppingCart,
      accent: 'bg-indigo-50 text-indigo-700',
    },
    {
      id: 'rev',
      title: 'Subscription Revenue',
      value: formatINR(totalSubscriptionRevenue),
      trend: 'FY 26 Recurring',
      targetScreen: 'subscriptions' as NavScreen,
      icon: IndianRupee,
      accent: 'bg-orange-50 text-[#FF7A18]',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
            Dashboard
          </h2>
        </div>
      </div>

      {/* 6 KPI Cards (White, Radius 16px, Soft Border, Clickable) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <button
              key={kpi.id}
              type="button"
              onClick={() => onNavigate(kpi.targetScreen)}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 text-left hover:border-[#0B1F3A]/30 hover:shadow-md transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.accent}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-[#5A6B82] group-hover:text-[#FF7A18] transition-colors">
                  <span>View</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>

              <div className="mt-4">
                <p className="text-xs font-bold text-[#5A6B82] uppercase tracking-wider">{kpi.title}</p>
                <h3 className="text-2xl md:text-3xl font-extrabold text-[#0B1F3A] mt-1 tracking-tight">
                  {kpi.value}
                </h3>
                <p className="text-xs font-semibold text-[#5A6B82] mt-1.5 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{kpi.trend}</span>
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-base font-extrabold text-[#0B1F3A]">Pending Approvals</h3>
            <p className="text-xs text-[#5A6B82] mt-0.5">Verification requests requiring admin review</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
            {pendingMfrKyc + pendingDstKyc + pendingPrdApproval} Total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {/* Manufacturer KYC Pending */}
          <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0B1F3A]">Manufacturer KYC Pending</h4>
                <p className="text-[11px] text-[#5A6B82] mt-0.5 font-medium">
                  GSTIN, PAN & factory licenses
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-extrabold text-[#0B1F3A] px-2 py-0.5 bg-white border border-[#E2E8F0] rounded-lg">
                {pendingMfrKyc}
              </span>
              <button
                type="button"
                onClick={() => onNavigate('manufacturers')}
                className="px-3 py-1.5 bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Review
              </button>
            </div>
          </div>

          {/* Distributor Approval Pending */}
          <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0B1F3A]">Distributor Approval Pending</h4>
                <p className="text-[11px] text-[#5A6B82] mt-0.5 font-medium">
                  Trader onboarding & trade volume
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-extrabold text-[#0B1F3A] px-2 py-0.5 bg-white border border-[#E2E8F0] rounded-lg">
                {pendingDstKyc}
              </span>
              <button
                type="button"
                onClick={() => onNavigate('distributors')}
                className="px-3 py-1.5 bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Review
              </button>
            </div>
          </div>

          {/* Product Approval Pending */}
          <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0B1F3A]">Product Approval Pending</h4>
                <p className="text-[11px] text-[#5A6B82] mt-0.5 font-medium">
                  Polymer spec sheets & pricing
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-extrabold text-[#0B1F3A] px-2 py-0.5 bg-white border border-[#E2E8F0] rounded-lg">
                {pendingPrdApproval}
              </span>
              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="px-3 py-1.5 bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
