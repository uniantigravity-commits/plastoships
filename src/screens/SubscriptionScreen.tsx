import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Edit,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Calendar,
  IndianRupee,
  Layers,
  Sparkles,
  Zap,
  Factory,
  Store,
  Check,
  Users,
} from 'lucide-react';
import { SubscriptionPlan, SubscriptionRecord, SubscriptionTier } from '../types';
import { Modal } from '../components/Modal';

interface SubscriptionScreenProps {
  plans: SubscriptionPlan[];
  records: SubscriptionRecord[];
  onCreatePlan: (plan: Omit<SubscriptionPlan, 'id' | 'activeSubscribersCount'>) => void;
  onEditPlan: (plan: SubscriptionPlan) => void;
  onTogglePlanStatus: (id: string) => void;
}

export const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({
  plans,
  records,
  onCreatePlan,
  onEditPlan,
  onTogglePlanStatus,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<SubscriptionPlan | null>(null);

  // View filtering: 'All' | 'Manufacturer' | 'Distributor'
  const [targetFilter, setTargetFilter] = useState<'All' | 'Manufacturer' | 'Distributor'>('All');
  const [recordsFilter, setRecordsFilter] = useState<'All' | 'Manufacturer' | 'Distributor'>('All');

  // Form states for creating a plan
  const [targetRole, setTargetRole] = useState<'Manufacturer' | 'Distributor'>('Manufacturer');
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [tier, setTier] = useState<SubscriptionTier>('Gold');
  const [monthlyPrice, setMonthlyPrice] = useState('8999');
  const [annualPrice, setAnnualPrice] = useState('89990');
  const [maxListings, setMaxListings] = useState('30 Plant Products');
  const [rfqAccess, setRfqAccess] = useState('Priority 2-Hour RFQ Broadcast');
  const [verifiedBadge, setVerifiedBadge] = useState(true);
  const [commissionRate, setCommissionRate] = useState('1.2% Marketplace Fee');
  const [prioritySupport, setPrioritySupport] = useState(true);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Segregate plans into Manufacturer and Distributor
  const isMfrPlan = (p: SubscriptionPlan) =>
    p.targetRole === 'Manufacturer' ||
    (!p.targetRole && !p.id.includes('DST') && !p.name.toLowerCase().includes('buyer') && !p.name.toLowerCase().includes('distributor'));

  const isDstPlan = (p: SubscriptionPlan) =>
    p.targetRole === 'Distributor' ||
    (!p.targetRole && (p.id.includes('DST') || p.name.toLowerCase().includes('buyer') || p.name.toLowerCase().includes('distributor')));

  const mfrPlans = plans.filter(isMfrPlan);
  const dstPlans = plans.filter(isDstPlan);

  const handleRoleSelectChange = (role: 'Manufacturer' | 'Distributor') => {
    setTargetRole(role);
    if (role === 'Manufacturer') {
      if (!tag || tag === 'SME Polymer Procurement' || tag === 'Wholesale Procurement') {
        setTag('Popular for GIDC Plants');
      }
      if (maxListings === '15 Active RFQs' || maxListings === '3 Active RFQ Postings') {
        setMaxListings('25 Plant Products');
      }
      if (commissionRate === '0.8% Escrow Fee') {
        setCommissionRate('1.5% Marketplace Fee');
      }
      if (rfqAccess === 'Instant Multi-Plant Quote Bids') {
        setRfqAccess('Instant Real-Time RFQ Broadcasts');
      }
    } else {
      if (!tag || tag === 'Popular for GIDC Plants' || tag === 'Standard Plant Listing') {
        setTag('Wholesale Polymer Procurement');
      }
      if (maxListings === '25 Plant Products' || maxListings === '30 Plant Products') {
        setMaxListings('15 Active RFQs');
      }
      if (commissionRate === '1.5% Marketplace Fee' || commissionRate === '1.2% Marketplace Fee') {
        setCommissionRate('0.8% Escrow Fee');
      }
      if (rfqAccess === 'Instant Real-Time RFQ Broadcasts' || rfqAccess === 'Priority 2-Hour RFQ Broadcast') {
        setRfqAccess('Instant Multi-Plant Quote Bids');
      }
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreatePlan({
      name: name.trim(),
      tag: tag.trim() || (targetRole === 'Manufacturer' ? 'Plant Membership Tier' : 'Buyer Membership Tier'),
      tier,
      targetRole,
      monthlyPrice: parseFloat(monthlyPrice) || 4999,
      annualPrice: parseFloat(annualPrice) || 49990,
      maxListings: maxListings.trim(),
      rfqAccess: rfqAccess.trim(),
      verifiedBadge,
      commissionRate: commissionRate.trim(),
      prioritySupport,
      status: 'Active',
    });

    setName('');
    setTag('');
    setIsCreateOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPlan) return;
    onEditPlan(editPlan);
    setEditPlan(null);
  };

  const filteredRecords = records.filter((r) => {
    if (recordsFilter === 'All') return true;
    return r.entityType === recordsFilter;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-[#0B1F3A] tracking-tight">
              Subscription Plans & Renewals
            </h2>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#FF7A18]/10 text-[#FF7A18] border border-[#FF7A18]/20">
              {plans.length} Tier Structures
            </span>
          </div>
          <p className="text-xs text-[#5A6B82] mt-1">
            Configure separate membership tiers for Gujarat Manufacturers and Distributors with custom quotas and fees.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            handleRoleSelectChange('Manufacturer');
            setIsCreateOpen(true);
          }}
          className="px-4 py-2.5 bg-[#FF7A18] hover:bg-[#E56A10] active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-md shadow-[#FF7A18]/20 flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Plan</span>
        </button>
      </div>

      {/* Target Audience Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-[#EAEFF8] rounded-2xl border border-[#D9E2EC]">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTargetFilter('All')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              targetFilter === 'All'
                ? 'bg-white text-[#0B1F3A] shadow-xs'
                : 'text-[#5A6B82] hover:text-[#0B1F3A]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Plans ({plans.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setTargetFilter('Manufacturer')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              targetFilter === 'Manufacturer'
                ? 'bg-[#0B1F3A] text-white shadow-xs'
                : 'text-[#5A6B82] hover:text-[#0B1F3A]'
            }`}
          >
            <Factory className="w-3.5 h-3.5 text-[#FF7A18]" />
            <span>Manufacturer Plans ({mfrPlans.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setTargetFilter('Distributor')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              targetFilter === 'Distributor'
                ? 'bg-[#0B1F3A] text-white shadow-xs'
                : 'text-[#5A6B82] hover:text-[#0B1F3A]'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span>Distributor Plans ({dstPlans.length})</span>
          </button>
        </div>

        <div className="text-[11px] font-bold text-[#5A6B82] px-3 hidden md:block">
          Showing: {targetFilter === 'All' ? 'Both Manufacturer & Distributor Sections' : `${targetFilter} Section Only`}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: MANUFACTURER MEMBERSHIP PLANS                     */}
      {/* ============================================================ */}
      {(targetFilter === 'All' || targetFilter === 'Manufacturer') && (
        <div className="space-y-4">
          {/* Section Header Card */}
          <div className="p-4 bg-gradient-to-r from-[#0B1F3A]/6 via-[#0B1F3A]/3 to-transparent border border-[#0B1F3A]/15 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1F3A] text-[#FF7A18] flex items-center justify-center font-bold shadow-xs shrink-0">
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-[#0B1F3A]">
                    Manufacturer Membership Plans
                  </h3>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-[#0B1F3A] text-white">
                    Plants & Extruders
                  </span>
                </div>
                <p className="text-xs text-[#5A6B82] mt-0.5">
                  Tiers designed for polymer manufacturing plants: SKU listings, direct RFQ quotation feeds, and plant seller badges.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                handleRoleSelectChange('Manufacturer');
                setIsCreateOpen(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1F3A] hover:text-[#FF7A18] bg-white px-3.5 py-1.5 rounded-xl border border-[#E2E8F0] shadow-xs cursor-pointer self-start sm:self-auto transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF7A18]" />
              <span>Add Manufacturer Plan</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mfrPlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl border transition-all p-6 relative flex flex-col justify-between ${
                  plan.tier === 'Diamond'
                    ? 'border-[#0B1F3A] shadow-md ring-1 ring-[#0B1F3A]'
                    : 'border-[#E2E8F0] shadow-xs hover:border-[#0B1F3A]/30'
                }`}
              >
                {plan.tier === 'Diamond' && (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 bg-[#0B1F3A] text-[#FF7A18] rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Gujarat Industrial Top Tier</span>
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                          <Factory className="w-3 h-3" />
                          <span>Manufacturer</span>
                        </span>
                        <span className="text-[10px] font-bold text-[#5A6B82] bg-slate-100 px-2 py-0.5 rounded-md">
                          {plan.tier} Tier
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-[#0B1F3A] leading-snug">{plan.name}</h4>
                      <p className="text-xs text-[#5A6B82] font-medium mt-0.5">{plan.tag}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onTogglePlanStatus(plan.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                        plan.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {plan.status}
                    </button>
                  </div>

                  <div className="mt-5 pb-5 border-b border-[#E2E8F0]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-[#0B1F3A]">
                        {formatINR(plan.monthlyPrice)}
                      </span>
                      <span className="text-xs text-[#5A6B82] font-semibold">/ month</span>
                    </div>
                    <p className="text-[11px] text-[#5A6B82] mt-1 font-medium">
                      or {formatINR(plan.annualPrice)} / year billed annually
                    </p>
                  </div>

                  <ul className="mt-5 space-y-2.5 text-xs text-[#0B1F3A]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold">{plan.maxListings}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{plan.rfqAccess}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{plan.commissionRate}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        {plan.verifiedBadge ? 'Verified Plant Seller Badge' : 'Standard Plant Badge'}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5A6B82]">
                    {plan.activeSubscribersCount} Active Plants
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditPlan(plan)}
                    className="px-3 py-1.5 bg-[#F4F7FC] hover:bg-[#0B1F3A] hover:text-white text-[#0B1F3A] text-xs font-bold rounded-lg border border-[#E2E8F0] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Plan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 2: DISTRIBUTOR MEMBERSHIP PLANS                       */}
      {/* ============================================================ */}
      {(targetFilter === 'All' || targetFilter === 'Distributor') && (
        <div className="space-y-4">
          {/* Section Header Card */}
          <div className="p-4 bg-gradient-to-r from-emerald-900/6 via-emerald-700/3 to-transparent border border-emerald-600/20 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-[#0B1F3A]">
                    Distributor Membership Plans
                  </h3>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-emerald-700 text-white">
                    Wholesalers & Buyers
                  </span>
                </div>
                <p className="text-xs text-[#5A6B82] mt-0.5">
                  Tiers designed for polymer buyers and traders: active RFQ post quotas, direct plant counter-quotes, and escrow fee discounts.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                handleRoleSelectChange('Distributor');
                setIsCreateOpen(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-white px-3.5 py-1.5 rounded-xl border border-emerald-300 shadow-xs cursor-pointer self-start sm:self-auto transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Add Distributor Plan</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dstPlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl border transition-all p-6 relative flex flex-col justify-between ${
                  plan.tier === 'Diamond'
                    ? 'border-emerald-700 shadow-md ring-1 ring-emerald-700'
                    : 'border-[#E2E8F0] shadow-xs hover:border-emerald-600/40'
                }`}
              >
                {plan.tier === 'Diamond' && (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 bg-emerald-800 text-emerald-100 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-xs flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-300" />
                    <span>Statewide Wholesale Elite</span>
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Store className="w-3 h-3" />
                          <span>Distributor</span>
                        </span>
                        <span className="text-[10px] font-bold text-[#5A6B82] bg-slate-100 px-2 py-0.5 rounded-md">
                          {plan.tier} Tier
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-[#0B1F3A] leading-snug">{plan.name}</h4>
                      <p className="text-xs text-[#5A6B82] font-medium mt-0.5">{plan.tag}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onTogglePlanStatus(plan.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                        plan.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {plan.status}
                    </button>
                  </div>

                  <div className="mt-5 pb-5 border-b border-[#E2E8F0]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-[#0B1F3A]">
                        {formatINR(plan.monthlyPrice)}
                      </span>
                      <span className="text-xs text-[#5A6B82] font-semibold">/ month</span>
                    </div>
                    <p className="text-[11px] text-[#5A6B82] mt-1 font-medium">
                      or {formatINR(plan.annualPrice)} / year billed annually
                    </p>
                  </div>

                  <ul className="mt-5 space-y-2.5 text-xs text-[#0B1F3A]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold">{plan.maxListings}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{plan.rfqAccess}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{plan.commissionRate}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        {plan.verifiedBadge ? 'Verified Buyer & Depot Badge' : 'Standard Buyer Badge'}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5A6B82]">
                    {plan.activeSubscribersCount} Active Buyers
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditPlan(plan)}
                    className="px-3 py-1.5 bg-[#F4F7FC] hover:bg-emerald-800 hover:text-white text-[#0B1F3A] text-xs font-bold rounded-lg border border-[#E2E8F0] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Plan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ACTIVE SUBSCRIPTIONS & RENEWALS TABLE                        */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">
              Active Member Subscriptions & Renewals
            </h3>
            <p className="text-xs text-[#5A6B82] mt-0.5">
              Live tracking of billing cycles, expiry dates and membership payment statuses
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#F4F7FC] p-1 rounded-xl border border-[#E2E8F0] text-xs font-bold">
              <button
                type="button"
                onClick={() => setRecordsFilter('All')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  recordsFilter === 'All' ? 'bg-white text-[#0B1F3A] shadow-xs' : 'text-[#5A6B82]'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setRecordsFilter('Manufacturer')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  recordsFilter === 'Manufacturer' ? 'bg-[#0B1F3A] text-white shadow-xs' : 'text-[#5A6B82]'
                }`}
              >
                <Factory className="w-3 h-3" />
                <span>Manufacturers</span>
              </button>
              <button
                type="button"
                onClick={() => setRecordsFilter('Distributor')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  recordsFilter === 'Distributor' ? 'bg-emerald-700 text-white shadow-xs' : 'text-[#5A6B82]'
                }`}
              >
                <Store className="w-3 h-3" />
                <span>Distributors</span>
              </button>
            </div>

            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
              98.2% Renewal Rate
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
                <th className="py-4 px-6 w-[15%]">Subscription ID</th>
                <th className="py-4 px-4 w-[24%]">Entity & Type</th>
                <th className="py-4 px-4 w-[15%]">Plan Name</th>
                <th className="py-4 px-4 w-[12%]">Amount</th>
                <th className="py-4 px-4 w-[12%]">Renewal Date</th>
                <th className="py-4 px-4 w-[11%]">Status</th>
                <th className="py-4 px-6 w-[11%] text-right">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-xs">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#F4F7FC]/70 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-mono-code font-bold text-xs text-[#0B1F3A] bg-[#F4F7FC] px-2 py-1 rounded border border-slate-200 block w-fit">
                      {rec.id}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <p className="font-bold text-[#0B1F3A]">{rec.entityName}</p>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 ${
                        rec.entityType === 'Manufacturer'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {rec.entityType === 'Manufacturer' ? (
                        <Factory className="w-2.5 h-2.5" />
                      ) : (
                        <Store className="w-2.5 h-2.5" />
                      )}
                      <span>{rec.entityType}</span>
                    </span>
                  </td>

                  <td className="py-4 px-4 font-semibold text-[#0B1F3A] whitespace-nowrap">{rec.planName}</td>

                  <td className="py-4 px-4 font-extrabold text-[#0B1F3A] whitespace-nowrap">
                    {formatINR(rec.amount)}
                  </td>

                  <td className="py-4 px-4 text-[#5A6B82] whitespace-nowrap">{rec.renewalDate}</td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
                        rec.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : rec.status === 'Expiring Soon'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold whitespace-nowrap ${
                        rec.paymentStatus === 'Paid'
                          ? 'text-emerald-700'
                          : rec.paymentStatus === 'Pending'
                          ? 'text-amber-700'
                          : 'text-rose-600'
                      }`}
                    >
                      {rec.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CREATE PLAN MODAL (With Explicit Entity Selector)            */}
      {/* ============================================================ */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Subscription Plan"
        subtitle="Introduce a customized pricing & membership tier for Gujarat marketplace participants"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {/* CRITICAL: Specify if for Manufacturer or Distributor */}
          <div>
            <label className="block text-xs font-extrabold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
              Target Marketplace Entity <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleSelectChange('Manufacturer')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  targetRole === 'Manufacturer'
                    ? 'border-[#0B1F3A] bg-[#0B1F3A]/5 ring-2 ring-[#0B1F3A]'
                    : 'border-[#E2E8F0] hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-extrabold text-xs text-[#0B1F3A]">
                    <Factory className="w-4 h-4 text-[#FF7A18]" />
                    <span>Manufacturer Plan</span>
                  </div>
                  {targetRole === 'Manufacturer' && (
                    <span className="w-4 h-4 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#5A6B82] leading-tight mt-0.5">
                  For polymer plants & extruders. Governs catalog listings & direct RFQ bidding.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelectChange('Distributor')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  targetRole === 'Distributor'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600'
                    : 'border-[#E2E8F0] hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-extrabold text-xs text-emerald-800">
                    <Store className="w-4 h-4 text-emerald-600" />
                    <span>Distributor Plan</span>
                  </div>
                  {targetRole === 'Distributor' && (
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#5A6B82] leading-tight mt-0.5">
                  For polymer buyers & traders. Governs procurement RFQs & escrow rates.
                </p>
              </button>
            </div>
          </div>

          {/* Tier Selection */}
          <div>
            <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
              Membership Tier Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Starter', 'Gold', 'Diamond'] as SubscriptionTier[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTier(t)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    tier === t
                      ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-xs'
                      : 'bg-[#F4F7FC] text-[#5A6B82] border-[#E2E8F0] hover:bg-white hover:text-[#0B1F3A]'
                  }`}
                >
                  {t} Tier
                </button>
              ))}
            </div>
          </div>

          {/* Plan Title & Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
                Plan Title
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  targetRole === 'Manufacturer'
                    ? 'e.g. Gujarat Industrial Scale-Up'
                    : 'e.g. Statewide Polymer Buyer Pro'
                }
                className="w-full h-10 px-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium focus:outline-none focus:border-[#0B1F3A] focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
                Badge / Tagline
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder={
                  targetRole === 'Manufacturer'
                    ? 'e.g. Popular for GIDC Plants'
                    : 'e.g. High-Volume Buyer Depot'
                }
                className="w-full h-10 px-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium focus:outline-none focus:border-[#0B1F3A] focus:bg-white"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
                Monthly Price (₹)
              </label>
              <input
                type="number"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(e.target.value)}
                className="w-full h-10 px-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium focus:outline-none focus:border-[#0B1F3A] focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
                Annual Price (₹)
              </label>
              <input
                type="number"
                value={annualPrice}
                onChange={(e) => setAnnualPrice(e.target.value)}
                className="w-full h-10 px-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium focus:outline-none focus:border-[#0B1F3A] focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Role-Specific Quotas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
                {targetRole === 'Manufacturer' ? 'Plant Product Listings Limit' : 'Active RFQ Postings Limit'}
              </label>
              <input
                type="text"
                value={maxListings}
                onChange={(e) => setMaxListings(e.target.value)}
                placeholder={targetRole === 'Manufacturer' ? 'e.g. 50 Plant Products' : 'e.g. 25 Active RFQs'}
                className="w-full h-10 px-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium focus:outline-none focus:border-[#0B1F3A] focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
                {targetRole === 'Manufacturer' ? 'Manufacturer Marketplace Fee' : 'Distributor Escrow Fee'}
              </label>
              <input
                type="text"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                placeholder={targetRole === 'Manufacturer' ? 'e.g. 1.2% Marketplace Fee' : 'e.g. 0.8% Escrow Fee'}
                className="w-full h-10 px-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium focus:outline-none focus:border-[#0B1F3A] focus:bg-white"
                required
              />
            </div>
          </div>

          {/* RFQ Access Tier */}
          <div>
            <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
              RFQ Broadcasting & Quote Access
            </label>
            <input
              type="text"
              value={rfqAccess}
              onChange={(e) => setRfqAccess(e.target.value)}
              placeholder={
                targetRole === 'Manufacturer'
                  ? 'e.g. Instant Real-Time RFQ Broadcasts'
                  : 'e.g. Priority Plant Quotes & Fast Dispatch'
              }
              className="w-full h-10 px-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium focus:outline-none focus:border-[#0B1F3A] focus:bg-white"
              required
            />
          </div>

          {/* Badges & Perks */}
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-[#0B1F3A]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedBadge}
                onChange={(e) => setVerifiedBadge(e.target.checked)}
                className="w-4 h-4 rounded text-[#FF7A18] focus:ring-0 cursor-pointer"
              />
              <span>Include Verified {targetRole === 'Manufacturer' ? 'Plant Seller' : 'Buyer'} Badge</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={prioritySupport}
                onChange={(e) => setPrioritySupport(e.target.checked)}
                className="w-4 h-4 rounded text-[#FF7A18] focus:ring-0 cursor-pointer"
              />
              <span>Dedicated Account Manager & Priority Support</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 text-xs font-bold text-[#5A6B82] hover:text-[#0B1F3A] rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#FF7A18] hover:bg-[#E56A10] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all"
            >
              Publish {targetRole} Plan
            </button>
          </div>
        </form>
      </Modal>

      {/* ============================================================ */}
      {/* EDIT PLAN MODAL                                              */}
      {/* ============================================================ */}
      <Modal
        isOpen={!!editPlan}
        onClose={() => setEditPlan(null)}
        title="Edit Subscription Plan"
        subtitle={editPlan?.name}
        maxWidth="lg"
      >
        {editPlan && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {/* Target Role Selector */}
            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
                Target Entity Audience
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEditPlan({ ...editPlan, targetRole: 'Manufacturer' })}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                    editPlan.targetRole === 'Manufacturer' || (!editPlan.targetRole && isMfrPlan(editPlan))
                      ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white'
                      : 'border-[#E2E8F0] bg-white text-[#5A6B82]'
                  }`}
                >
                  <Factory className="w-3.5 h-3.5" />
                  <span>Manufacturer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditPlan({ ...editPlan, targetRole: 'Distributor' })}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                    editPlan.targetRole === 'Distributor' || (!editPlan.targetRole && isDstPlan(editPlan))
                      ? 'border-emerald-700 bg-emerald-700 text-white'
                      : 'border-[#E2E8F0] bg-white text-[#5A6B82]'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Distributor</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
                Plan Name
              </label>
              <input
                type="text"
                value={editPlan.name}
                onChange={(e) => setEditPlan({ ...editPlan, name: e.target.value })}
                className="w-full h-10 px-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium focus:outline-none focus:border-[#0B1F3A] focus:bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
                  Monthly Price (₹)
                </label>
                <input
                  type="number"
                  value={editPlan.monthlyPrice}
                  onChange={(e) =>
                    setEditPlan({ ...editPlan, monthlyPrice: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full h-10 px-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium focus:outline-none focus:border-[#0B1F3A] focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
                  Annual Price (₹)
                </label>
                <input
                  type="number"
                  value={editPlan.annualPrice}
                  onChange={(e) =>
                    setEditPlan({ ...editPlan, annualPrice: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full h-10 px-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium focus:outline-none focus:border-[#0B1F3A] focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
                  Listings / RFQ Limit
                </label>
                <input
                  type="text"
                  value={editPlan.maxListings}
                  onChange={(e) => setEditPlan({ ...editPlan, maxListings: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium focus:outline-none focus:border-[#0B1F3A] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
                  Commission / Escrow Fee
                </label>
                <input
                  type="text"
                  value={editPlan.commissionRate}
                  onChange={(e) => setEditPlan({ ...editPlan, commissionRate: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium focus:outline-none focus:border-[#0B1F3A] focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setEditPlan(null)}
                className="px-4 py-2 text-xs font-bold text-[#5A6B82] hover:text-[#0B1F3A] rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
