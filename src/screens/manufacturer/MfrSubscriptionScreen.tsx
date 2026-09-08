import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  FileText,
  Eye,
  Download,
  Printer,
  X,
  Shield,
  Sparkles,
} from 'lucide-react';
import { ManufacturerProfileData } from '../../types';
import { Modal } from '../../components/Modal';

interface MfrSubscriptionScreenProps {
  profile?: ManufacturerProfileData;
  onNavigate?: (screen: string) => void;
}

interface InvoiceItem {
  invoiceId: string;
  planName: string;
  billingCycle: string;
  amount: string;
  rawAmount: number;
  date: string;
  status: 'Paid' | 'Expired' | 'Pending';
  billedTo: string;
  gstin: string;
  location: string;
}

export const MfrSubscriptionScreen: React.FC<MfrSubscriptionScreenProps> = ({
  profile,
  onNavigate,
}) => {
  // Current Active Plan
  const [currentPlan, setCurrentPlan] = useState<'Basic' | 'Premium' | 'Platinum'>('Premium');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected Invoice for Modal Receipt
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Billing History matching the screenshots
  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    {
      invoiceId: 'INV - 2026 - 088',
      planName: 'Premium Plan',
      billingCycle: 'Yearly',
      amount: '₹29,999',
      rawAmount: 29999,
      date: 'Jan 01, 2026',
      status: 'Paid',
      billedTo: profile?.companyName || 'Apex Plastics & Moulds Ltd.',
      gstin: '27AABCP1234F1Z8',
      location: 'Mumbai, Maharashtra, India',
    },
    {
      invoiceId: 'INV - 2025 - 012',
      planName: 'Premium Plan',
      billingCycle: 'Yearly',
      amount: '₹29,999',
      rawAmount: 29999,
      date: 'Jan 01, 2025',
      status: 'Paid',
      billedTo: profile?.companyName || 'Apex Plastics & Moulds Ltd.',
      gstin: '27AABCP1234F1Z8',
      location: 'Mumbai, Maharashtra, India',
    },
    {
      invoiceId: 'INV - 2024 - 405',
      planName: 'Basic Plan',
      billingCycle: 'Forever',
      amount: 'Free',
      rawAmount: 0,
      date: 'Jan 01, 2024',
      status: 'Expired',
      billedTo: profile?.companyName || 'Apex Plastics & Moulds Ltd.',
      gstin: '27AABCP1234F1Z8',
      location: 'Mumbai, Maharashtra, India',
    },
  ]);

  const handleOpenInvoice = (inv: InvoiceItem) => {
    setSelectedInvoice(inv);
    setIsInvoiceModalOpen(true);
  };

  const handleDownloadInvoice = (inv: InvoiceItem) => {
    showToast(`Downloading Tax Invoice ${inv.invoiceId}...`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePlanChange = (plan: 'Basic' | 'Premium' | 'Platinum') => {
    setCurrentPlan(plan);
    showToast(`Successfully switched to ${plan} Plan`);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Toast */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Subscription
        </h2>
        <p className="text-xs sm:text-sm text-[#5A6B82] mt-1 font-normal">
          Manage your PlastoShip plan and billing details
        </p>
      </div>

      {/* Top Cards: Current Plan Details + Included Features Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Box: Active Plan Status & Actions */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            {/* Top row: Plan name, badge, and start date */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {currentPlan === 'Platinum' ? 'Platinum Plan' : currentPlan === 'Basic' ? 'Basic Plan' : 'Premium Plan'}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                    <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                    Active
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#5A6B82] mt-1">
                  Yearly Billing Cycle
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-[#5A6B82] block">
                  Subscription Start Date
                </span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  Jan 01, 2024
                </span>
              </div>
            </div>

            {/* Middle Grid: Next Renewal Date & Subscription Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {/* Next Renewal Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                  NEXT RENEWAL DATE
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-4 h-4 text-[#4B49AC]" />
                  <span className="text-base sm:text-lg font-bold text-slate-900">
                    Dec 31, 2026
                  </span>
                </div>
              </div>

              {/* Subscription Amount Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                  SUBSCRIPTION AMOUNT
                </span>
                <div className="mt-2">
                  <span className="text-base sm:text-lg font-bold text-slate-900">
                    {currentPlan === 'Platinum' ? '₹79,999' : currentPlan === 'Basic' ? 'Free' : '₹29,999'}
                  </span>
                  <span className="text-xs sm:text-sm text-[#5A6B82] font-normal ml-1">
                    / year
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions Row */}
          <div className="flex flex-wrap items-center gap-3 pt-6 mt-6 border-t border-[#F1F5F9]">
            <button
              type="button"
              onClick={() => showToast('Subscription renewed for 1 year!')}
              className="px-5 py-2.5 rounded-xl bg-[#4B49AC] hover:bg-[#3F3D99] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Renew Subscription
            </button>

            <button
              type="button"
              onClick={() => handlePlanChange('Platinum')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#D6D4F7] bg-white hover:bg-[#EEEDFD] text-[#4B49AC] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Upgrade Plan</span>
            </button>

            <button
              type="button"
              onClick={() => handlePlanChange('Basic')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-slate-50 text-[#5A6B82] hover:text-slate-900 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Downgrade Plan</span>
            </button>
          </div>
        </div>

        {/* Right Card: Included Features */}
        <div className="lg:col-span-4 bg-[#4B49AC] rounded-2xl p-6 sm:p-7 text-white flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#D6D4F7]">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white">
                  Included Features
                </h4>
                <p className="text-xs text-[#D6D4F7]">
                  Premium Plan Benefits
                </p>
              </div>
            </div>

            <div className="space-y-3.5 pt-1 border-t border-white/20">
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span className="text-xs sm:text-sm text-[#EEEDFD] leading-snug">
                  Product Listing Limit: 500 Products
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span className="text-xs sm:text-sm text-[#EEEDFD] leading-snug">
                  RFQ Access: Unlimited
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span className="text-xs sm:text-sm text-[#EEEDFD] leading-snug">
                  Order Management: Advanced Dashboard
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span className="text-xs sm:text-sm text-[#EEEDFD] leading-snug">
                  Business Visibility: Standard Search & Verified Badge
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span className="text-xs sm:text-sm text-[#EEEDFD] leading-snug">
                  Support Level: Priority Email & Chat (4h SLA)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans Section */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          Available Plans
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Plan 1: Basic */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-900">Basic</h4>
              <div className="mt-3 mb-5">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Free
                </span>
                <span className="text-xs text-[#5A6B82] ml-1.5 font-normal">
                  Forever
                </span>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-[#5A6B82]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-600 shrink-0 stroke-[2]" />
                  <span>Up to 100 Products</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-600 shrink-0 stroke-[2]" />
                  <span>Limited RFQ Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-600 shrink-0 stroke-[2]" />
                  <span>Standard Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-600 shrink-0 stroke-[2]" />
                  <span>Basic Search Listing</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6">
              <button
                type="button"
                onClick={() => handlePlanChange('Basic')}
                className="w-full py-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Switch to Basic
              </button>
            </div>
          </div>

          {/* Plan 2: Premium (Active Plan) */}
          <div className="bg-white rounded-2xl border-2 border-[#4B49AC] p-6 shadow-xs flex flex-col justify-between relative">
            {/* Active Plan Tag */}
            <div className="absolute top-5 right-5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#4B49AC] text-white text-[10px] font-bold uppercase tracking-wider">
                <Check className="w-3 h-3 stroke-[2.5]" />
                ACTIVE PLAN
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900">Premium</h4>
              <div className="mt-3 mb-5">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  ₹29,999
                </span>
                <span className="text-xs text-[#5A6B82] ml-1.5 font-normal">
                  / year
                </span>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-800">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#4B49AC] shrink-0 stroke-[2]" />
                  <span>Up to 500 Products</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#4B49AC] shrink-0 stroke-[2]" />
                  <span>Unlimited RFQ Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#4B49AC] shrink-0 stroke-[2]" />
                  <span>Advanced Order Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#4B49AC] shrink-0 stroke-[2]" />
                  <span>Priority Support</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6">
              <button
                type="button"
                disabled
                className="w-full py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#5A6B82] text-xs sm:text-sm font-semibold cursor-default"
              >
                Current Plan
              </button>
            </div>
          </div>

          {/* Plan 3: Platinum (Recommended) */}
          <div className="bg-white rounded-2xl border-2 border-[#FF7A18] p-6 shadow-xs flex flex-col justify-between relative">
            {/* Recommended Tag */}
            <div className="absolute -top-3 right-6">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FF7A18] text-white text-[11px] font-bold shadow-xs">
                ★ Recommended
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900">Platinum</h4>
              <div className="mt-3 mb-5">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  ₹79,999
                </span>
                <span className="text-xs text-[#5A6B82] ml-1.5 font-normal">
                  / year
                </span>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-800">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF7A18] shrink-0 stroke-[2]" />
                  <span>Unlimited Products</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF7A18] shrink-0 stroke-[2]" />
                  <span>0% Commission</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF7A18] shrink-0 stroke-[2]" />
                  <span>Dedicated Account Manager</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF7A18] shrink-0 stroke-[2]" />
                  <span>Priority Search Placement</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6">
              <button
                type="button"
                onClick={() => handlePlanChange('Platinum')}
                className="w-full py-2.5 rounded-xl bg-[#4B49AC] hover:bg-[#3F3D99] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Upgrade to Platinum
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#4B49AC]" />
            <h3 className="text-base font-bold text-slate-900">
              Billing History
            </h3>
          </div>
          <span className="text-xs text-[#5A6B82] font-semibold">
            {invoices.length} Invoices
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider bg-white">
                <th className="py-4 px-5">INVOICE ID</th>
                <th className="py-4 px-5">PLAN NAME</th>
                <th className="py-4 px-5">BILLING CYCLE</th>
                <th className="py-4 px-5">AMOUNT</th>
                <th className="py-4 px-5">DATE</th>
                <th className="py-4 px-5 text-center">STATUS</th>
                <th className="py-4 px-5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-xs sm:text-sm text-slate-800">
              {invoices.map((inv) => (
                <tr key={inv.invoiceId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5 font-bold font-mono text-slate-900">
                    {inv.invoiceId}
                  </td>
                  <td className="py-4 px-5 font-medium text-slate-900">
                    {inv.planName}
                  </td>
                  <td className="py-4 px-5 text-[#5A6B82] font-normal">
                    {inv.billingCycle}
                  </td>
                  <td className="py-4 px-5 font-bold text-slate-900">
                    {inv.amount}
                  </td>
                  <td className="py-4 px-5 text-[#5A6B82] font-normal">
                    {inv.date}
                  </td>
                  <td className="py-4 px-5 text-center">
                    {inv.status === 'Paid' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                        <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold">
                        Expired
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenInvoice(inv)}
                        title="View Receipt"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#4B49AC] hover:bg-[#EEEDFD] transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadInvoice(inv)}
                        title="Download PDF"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#4B49AC] hover:bg-[#EEEDFD] transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Invoice Receipt Modal */}
      {isInvoiceModalOpen && selectedInvoice && (
        <Modal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          title="Tax Invoice Receipt"
        >
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-start justify-between border-b border-[#F1F5F9] pb-4">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  PlastoShip B2B Network
                </h4>
                <p className="text-xs text-[#5A6B82] mt-0.5">
                  GSTIN: {selectedInvoice.gstin}
                </p>
                <p className="text-xs text-[#5A6B82]">
                  {selectedInvoice.location}
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-900">
                  {selectedInvoice.invoiceId}
                </span>
                <p className="text-xs text-[#5A6B82] mt-1">
                  {selectedInvoice.date}
                </p>
              </div>
            </div>

            {/* Billed To Card */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#5A6B82]">Billed To:</span>
                <span className="font-bold text-slate-900">
                  {selectedInvoice.billedTo}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#5A6B82]">Plan Details:</span>
                <span className="font-semibold text-slate-900">
                  {selectedInvoice.planName} ({selectedInvoice.billingCycle})
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#5A6B82]">Payment Status:</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                  Paid
                </span>
              </div>
            </div>

            {/* Total Paid */}
            <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
              <span className="text-base font-bold text-slate-900">
                Total Paid:
              </span>
              <span className="text-xl font-extrabold text-[#4B49AC]">
                {selectedInvoice.amount}
              </span>
            </div>

            {/* Modal Buttons: Print & Download PDF */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleDownloadInvoice(selectedInvoice);
                  setIsInvoiceModalOpen(false);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4B49AC] hover:bg-[#3F3D99] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
