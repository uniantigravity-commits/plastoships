import React from 'react';
import {
  FileQuestion,
  ShoppingCart,
  ShieldCheck,
  Package,
  Plus,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Clock,
  Truck,
  Receipt,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Building2,
  Calendar,
  Layers,
  CreditCard,
  IndianRupee,
} from 'lucide-react';
import { Rfq, Order, Product, DistributorProfileData, ManufacturerQuotation } from '../../types';
import { INITIAL_DISTRIBUTOR_PROFILE } from '../../mockData';

interface DistributorDashboardScreenProps {
  profile?: DistributorProfileData;
  rfqs?: Rfq[];
  orders?: Order[];
  products?: Product[];
  quotations?: ManufacturerQuotation[];
  onNavigate: (screen: string) => void;
  onOpenNewRfq: () => void;
}

export const DistributorDashboardScreen: React.FC<DistributorDashboardScreenProps> = ({
  profile = INITIAL_DISTRIBUTOR_PROFILE,
  rfqs = [],
  orders = [],
  products = [],
  quotations = [],
  onNavigate,
  onOpenNewRfq,
}) => {
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const activeOrders = orders.filter((o) => o.orderStatus !== 'Completed');
  const totalEscrowSecured = orders.reduce(
    (sum, o) => sum + (o.paymentStatus === 'Escrow Held' ? o.amount : 0),
    0
  );
  const openRfqs = rfqs.filter((r) => r.status === 'Open' || r.status === 'Quotes Received');
  const inTransitOrders = orders.filter(
    (o) => o.orderStatus === 'Dispatched' || o.orderStatus === 'Processing'
  );

  const kpis = [
    {
      id: 'rfqs',
      title: 'Active RFQs',
      value: openRfqs.length.toString(),
      trend: '+3 Plant Bids Live',
      targetScreen: 'dst_rfqs',
      icon: FileQuestion,
      accent: 'bg-amber-50 text-amber-700',
    },
    {
      id: 'quotes',
      title: 'Quotations Received',
      value: quotations.length.toString(),
      trend: 'Avg ₹126.80/kg',
      targetScreen: 'dst_rfqs',
      icon: Layers,
      accent: 'bg-blue-50 text-blue-700',
    },
    {
      id: 'orders',
      title: 'Total Purchase Orders',
      value: orders.length.toString(),
      trend: `${orders.filter((o) => o.orderStatus === 'Completed').length} Delivered`,
      targetScreen: 'dst_orders',
      icon: ShoppingCart,
      accent: 'bg-indigo-50 text-indigo-700',
    },
    {
      id: 'tracking',
      title: 'Active Dispatches',
      value: inTransitOrders.length.toString(),
      trend: 'Live Tracking in Orders',
      targetScreen: 'dst_orders',
      icon: Truck,
      accent: 'bg-purple-50 text-purple-700',
    },
    {
      id: 'escrow',
      title: 'Escrow Secured',
      value: formatINR(totalEscrowSecured),
      trend: '100% Protected',
      targetScreen: 'dst_payments',
      icon: ShieldCheck,
      accent: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'subscription',
      title: 'Revolving Credit Line',
      value: profile.creditLimit || '₹2.50 Cr',
      trend: 'Platinum Pro',
      targetScreen: 'dst_subscription',
      icon: IndianRupee,
      accent: 'bg-emerald-50 text-emerald-700',
    },
  ];

  const recentActivities = [
    {
      id: 'act-1',
      title: 'Quotation Received from Morbi Extrusions',
      description: 'Quoted ₹124.50/Kg for 25 MT PP Injection Grade (RFQ-GJ-9021)',
      time: '12 mins ago',
      targetScreen: 'dst_rfqs',
    },
    {
      id: 'act-2',
      title: 'Lorry Receipt Generated for Order ORD-GJ-7041',
      description: 'Vehicle GJ-03-AB-4921 dispatched from Vatva GIDC Hub',
      time: '1 hour ago',
      targetScreen: 'dst_orders',
    },
    {
      id: 'act-3',
      title: 'Escrow Deposit Confirmed',
      description: '₹18,67,500 locked in PlastoShip Escrow for Order ORD-GJ-7042',
      time: '3 hours ago',
      targetScreen: 'dst_payments',
    },
    {
      id: 'act-4',
      title: 'New Bulk RFQ Published',
      description: 'RFQ-GJ-9024 for 40 MT HDPE Blow Molding Grade posted to plants',
      time: 'Yesterday',
      targetScreen: 'dst_rfqs',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Procurement Dashboard
          </h2>
          <p className="text-xs md:text-sm text-[#5A6B82] mt-1 font-medium">
            Manage your polymer procurement, RFQs, escrow payments, and live deliveries
          </p>
        </div>
      </div>

      {/* Top Buyer Identity Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#6F42C1] text-white flex items-center justify-center font-black text-xl shrink-0 shadow-sm">
            AP
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {profile.companyName}
              </h3>
              <span className="font-mono text-xs font-bold text-[#5A6B82] bg-[#F4F7FC] px-2.5 py-0.5 rounded-md border border-[#E2E8F0]">
                {profile.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#6F42C1]/10 text-[#6F42C1] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Wholesaler
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20">
                PLATINUM PRO
              </span>
            </div>
            <p className="text-xs text-[#5A6B82] font-medium">
              {profile.industrialZone}, {profile.city}, Gujarat • GSTIN: {profile.gstin} • Credit Limit:{' '}
              <span className="font-semibold text-slate-900">{profile.creditLimit}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('dst_rfqs')}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-slate-800 hover:bg-[#F8FAFC] text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-[#6F42C1]" />
            <span>Compare Quotations</span>
          </button>
          <button
            type="button"
            onClick={onOpenNewRfq}
            className="px-4 py-2.5 rounded-xl bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-purple-100" />
            <span>Post New Bulk RFQ</span>
          </button>
        </div>
      </div>

      {/* 6 KPI Cards matching Admin Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              onClick={() => onNavigate(kpi.targetScreen)}
              className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs hover:border-[#6F42C1]/50 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider truncate">
                  {kpi.title}
                </span>
                <div
                  className={`w-8 h-8 rounded-lg ${kpi.accent} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {kpi.value}
                </h3>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E2E8F0]/60 text-xs">
                  <span className="text-[#5A6B82] font-semibold">{kpi.trend}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#5A6B82] group-hover:text-[#6F42C1] transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Left 2 Cols (Consignments & RFQs) | Right 1 Col (Quotations & Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Dispatches with tracking */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#6F42C1]" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Active Consignments & In-Transit Shipments
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('dst_orders')}
                className="text-xs font-bold text-[#6F42C1] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All Orders</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#E2E8F0]">
              {orders.slice(0, 3).map((ord) => (
                <div key={ord.id} className="p-5 hover:bg-[#F8FAFC] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-[#F4F7FC] px-2 py-0.5 rounded border border-[#E2E8F0]">
                        {ord.id}
                      </span>
                      <span className="text-xs font-bold text-[#5A6B82]">from</span>
                      <span className="text-xs font-bold text-slate-900">{ord.manufacturer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          ord.orderStatus === 'Dispatched'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.orderStatus === 'Processing'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
                        {ord.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{ord.product}</p>
                      <p className="text-[#5A6B82] mt-0.5">
                        Quantity: <span className="font-semibold text-slate-900">{ord.quantity}</span> • Dispatch Hub:{' '}
                        <span className="font-semibold text-slate-900">{ord.dispatchHub}</span>
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-xs text-[#5A6B82]">Invoice Value</p>
                      <p className="font-extrabold text-sm text-slate-900">{formatINR(ord.amount)}</p>
                    </div>
                  </div>

                  {ord.trackingNumber && ord.trackingNumber !== 'Pending Dispatch' && (
                    <div className="mt-3 pt-3 border-t border-[#E2E8F0]/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-[#5A6B82]">
                        <Truck className="w-3.5 h-3.5 text-[#6F42C1]" />
                        <span>LR / Tracking:</span>
                        <span className="font-mono font-bold text-slate-900">{ord.trackingNumber}</span>
                      </div>
                      <span className="text-xs font-semibold text-[#6F42C1]">
                        Est. Delivery: {ord.estimatedDelivery}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Active Bulk RFQs Table */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileQuestion className="w-4 h-4 text-[#6F42C1]" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Active Bulk RFQ Enquiries
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('dst_rfqs')}
                className="text-xs font-bold text-[#6F42C1] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All RFQs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
                    <th className="py-3.5 px-6">RFQ ID</th>
                    <th className="py-3.5 px-6">Product Grade</th>
                    <th className="py-3.5 px-6">Quantity</th>
                    <th className="py-3.5 px-6">Target Price</th>
                    <th className="py-3.5 px-6 text-center">Bids Received</th>
                    <th className="py-3.5 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-xs font-semibold text-slate-900">
                  {rfqs.slice(0, 4).map((r) => (
                    <tr key={r.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">{r.id}</td>
                      <td className="py-4 px-6">
                        <div className="font-extrabold text-slate-900">{r.product}</div>
                        <div className="text-[11px] text-[#5A6B82]">{r.category}</div>
                      </td>
                      <td className="py-4 px-6 font-bold">{r.quantity}</td>
                      <td className="py-4 px-6 font-mono font-bold text-[#6F42C1]">{r.targetPrice}</td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#6F42C1]/10 text-[#6F42C1]">
                          {r.quotesCount} Plant Bids
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            r.status === 'Quotes Received'
                              ? 'bg-[#6F42C1]/10 text-[#6F42C1]'
                              : r.status === 'Open'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col */}
        <div className="space-y-6">
          {/* Commercial Bids from Plants */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Recent Plant Quotations
              </h3>
              <span className="text-xs font-bold text-[#6F42C1] bg-[#6F42C1]/10 border border-[#6F42C1]/20 px-2 py-0.5 rounded-full">
                {quotations.length} Active Bids
              </span>
            </div>

            <div className="space-y-3">
              {quotations.slice(0, 3).map((q) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#6F42C1]/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[11px] font-bold text-[#5A6B82]">{q.id}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#6F42C1]/10 text-[#6F42C1]">
                      {q.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">{q.rfqProduct}</h4>
                  <p className="text-[11px] text-[#5A6B82] mt-0.5">
                    Plant: <span className="font-bold text-slate-900">{q.distributorName}</span>
                  </p>

                  <div className="mt-2 pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[11px] text-[#5A6B82]">Quoted Rate:</span>
                      <span className="font-bold text-slate-900 ml-1">₹{q.quotedPricePerKg}/Kg</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate('dst_rfqs')}
                      className="text-[11px] font-bold text-[#6F42C1] hover:underline cursor-pointer"
                    >
                      Review Bid →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onNavigate('dst_rfqs')}
              className="w-full mt-4 py-2.5 rounded-xl bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold transition-colors cursor-pointer text-center block"
            >
              Compare All Quotations
            </button>
          </div>

          {/* Recent Activity Timeline matching Admin Dashboard */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Recent Activity
              </h3>
              <Clock className="w-4 h-4 text-[#5A6B82]" />
            </div>

            <div className="space-y-3.5">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => onNavigate(act.targetScreen)}
                  className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#6F42C1]/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{act.title}</p>
                    <span className="text-[10px] text-[#5A6B82] shrink-0 font-medium">{act.time}</span>
                  </div>
                  <p className="text-[11px] text-[#5A6B82] leading-relaxed line-clamp-2">
                    {act.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
