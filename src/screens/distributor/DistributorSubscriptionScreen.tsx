import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Award,
  Download,
  ArrowRight,
  TrendingUp,
  FileText,
  Clock,
  Sparkles,
  X,
  IndianRupee,
} from 'lucide-react';
import { DistributorProfileData } from '../../types';
import { INITIAL_DISTRIBUTOR_PROFILE } from '../../mockData';

interface DistributorSubscriptionScreenProps {
  profile?: DistributorProfileData;
  onNavigate?: (screen: string) => void;
}

export const DistributorSubscriptionScreen: React.FC<DistributorSubscriptionScreenProps> = ({
  profile = INITIAL_DISTRIBUTOR_PROFILE,
  onNavigate,
}) => {
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [requestedCredit, setRequestedCredit] = useState('₹4.00 Crore');
  const [creditNotes, setCreditNotes] = useState('');

  const plans = [
    {
      id: 'starter',
      name: 'Starter Wholesaler',
      price: '₹0',
      period: 'Forever Free',
      description: 'Basic access to public catalog and standard RFQs',
      features: [
        'Up to 3 RFQs per month',
        'Standard 48hr quote response',
        'Standard Escrow protection',
        'Standard road freight only',
      ],
      current: false,
    },
    {
      id: 'gold',
      name: 'Gold Trade Partner',
      price: '₹19,999',
      period: 'per year',
      description: 'Ideal for regional wholesale depots with regular polymer consumption',
      features: [
        'Up to 15 RFQs per month',
        'Direct Plant bidding access',
        '₹75 Lakhs Escrow credit line',
        'Priority lab COA validation',
      ],
      current: false,
    },
    {
      id: 'platinum',
      name: 'Platinum Pro Wholesaler',
      price: '₹49,999',
      period: 'per year',
      description: 'Full procurement power with highest credit limits and zero commission',
      features: [
        'Unlimited Bulk RFQs & Direct Plant tenders',
        '₹2.50 Crore Escrow revolving credit line',
        '0% Buyer platform commission',
        'Priority Rail Siding logistics & fast dispatches',
        'Dedicated PlastoShip Key Account Manager',
        '24/7 Priority Logistics dispatch hotline',
      ],
      current: true,
    },
    {
      id: 'enterprise',
      name: 'Consortium Enterprise',
      price: '₹99,999',
      period: 'per year',
      description: 'Custom multi-city depots, dedicated rail rakes, and bulk imports',
      features: [
        'Custom credit up to ₹10.00 Crore',
        'Full multi-depot ERP integration',
        'Custom resin grade formulations',
        'Direct port customs clearance assistance',
      ],
      current: false,
    },
  ];

  const invoices = [
    {
      id: 'INV-SUB-2026-01',
      date: '01 Jan 2026',
      plan: 'Platinum Pro Wholesaler (1 Year)',
      amount: 49999,
      status: 'Paid',
      utr: 'UTR-HDFC-99182310',
    },
    {
      id: 'INV-SUB-2025-01',
      date: '01 Jan 2025',
      plan: 'Gold Trade Partner (1 Year)',
      amount: 19999,
      status: 'Paid',
      utr: 'UTR-ICICI-88192031',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] tracking-tight">
              Subscription & Credit Plan
            </h2>
            <span className="px-2.5 py-1 text-xs font-bold bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20 rounded-lg flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-[#6F42C1]" />
              Platinum Pro Active
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#5A6B82] mt-1 font-medium">
            Manage your annual procurement tier, B2B revolving credit line, and platform entitlements
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsCreditModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#6F42C1]/10 hover:border-[#6F42C1]/20 hover:text-[#6F42C1] text-[#1E293B] text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4 text-[#6F42C1]" />
            <span>Request Credit Extension</span>
          </button>
          <button
            type="button"
            onClick={() => setIsRenewModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-purple-200" />
            <span>Renew Plan</span>
          </button>
        </div>
      </div>

      {/* Current Active Plan Banner */}
      <div className="bg-[#6F42C1] rounded-2xl p-6 text-white relative overflow-hidden shadow-md">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-purple-400/25 to-transparent pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 z-10 relative">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 border border-white/30 text-white">
                CURRENT TIER
              </span>
              <span className="text-xs text-white/80 font-mono">Plan ID: SUB-DST-94821</span>
            </div>
            <h3 className="text-2xl font-black text-white">Platinum Pro Wholesaler</h3>
            <p className="text-xs text-white/90 mt-1 max-w-xl leading-relaxed">
              Enjoy zero commission on direct plant procurements, priority rail dispatches, and up to ₹2.50 Cr revolving credit.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-white/95">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-200" />
                Renewal Date: 31 Dec 2026
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-200" />
                Auto-Renew: Enabled (e-NACH)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 border border-white/20 p-4 rounded-xl backdrop-blur-xs min-w-[170px]">
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider block">
                Available Credit Line
              </span>
              <span className="text-xl font-black text-white">{profile.creditLimit}</span>
              <span className="text-[10px] text-purple-100 block mt-0.5">45-day Escrow rolling</span>
            </div>
            <div className="bg-white/10 border border-white/20 p-4 rounded-xl backdrop-blur-xs min-w-[170px]">
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider block">
                Platform Commission
              </span>
              <span className="text-xl font-black text-white">0.0%</span>
              <span className="text-[10px] text-purple-100 block mt-0.5">100% Direct Rates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Comparison Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
            Procurement Tier Packages
          </h3>
          <span className="text-xs text-[#5A6B82] font-semibold">Billed Annually in INR</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                p.current
                  ? 'border-[#6F42C1] shadow-md ring-2 ring-[#6F42C1]/20'
                  : 'border-[#E2E8F0] shadow-xs hover:border-[#6F42C1]/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-extrabold text-[#1E293B]">{p.name}</h4>
                  {p.current && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="mb-3">
                  <span className="text-2xl font-black text-[#1E293B]">{p.price}</span>
                  <span className="text-xs text-[#5A6B82] ml-1">/ {p.period}</span>
                </div>
                <p className="text-[11px] text-[#5A6B82] mb-4 leading-relaxed">{p.description}</p>

                <div className="space-y-2 pt-3 border-t border-[#E2E8F0]">
                  {p.features.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <CheckCircle2
                        className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#6F42C1]"
                      />
                      <span className="text-[#1E293B] leading-tight">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                {p.current ? (
                  <button
                    type="button"
                    onClick={() => setIsRenewModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-[#6F42C1]/10 border border-[#6F42C1]/20 text-[#6F42C1] text-xs font-bold hover:bg-[#6F42C1]/20 transition-colors cursor-pointer text-center"
                  >
                    Manage & Extend Plan
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      alert(`Initiating upgrade flow to ${p.name}`);
                      setIsRenewModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-white border border-[#6F42C1] text-[#6F42C1] hover:bg-[#6F42C1]/10 text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    Select {p.name}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices & Receipts Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#6F42C1]" />
            <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
              Subscription Invoices & GST Tax Receipts
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
                <th className="py-3.5 px-6">Invoice ID</th>
                <th className="py-3.5 px-6">Billing Date</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Payment UTR</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] font-semibold text-[#1E293B]">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-[#1E293B]">{inv.id}</td>
                  <td className="py-4 px-6 text-[#5A6B82]">{inv.date}</td>
                  <td className="py-4 px-6 font-bold">{inv.plan}</td>
                  <td className="py-4 px-6 font-mono font-bold">₹{inv.amount.toLocaleString('en-IN')}</td>
                  <td className="py-4 px-6 font-mono text-[#5A6B82]">{inv.utr}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Downloading GST Tax Invoice PDF: ${inv.id}.pdf`)}
                      className="text-xs font-bold text-[#6F42C1] hover:text-[#5C35A5] flex items-center gap-1 justify-end cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Line Request Modal */}
      {isCreditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-base font-extrabold text-[#1E293B]">
                Request Credit Limit Enhancement
              </h3>
              <button
                type="button"
                onClick={() => setIsCreditModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#F4F7FC] text-[#5A6B82] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Credit enhancement application for ${requestedCredit} submitted to PlastoShip Credit Desk.`);
                setIsCreditModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-[#1E293B] block mb-1">Current Limit: ₹2.50 Crore</label>
                <label className="font-bold text-[#1E293B] block mt-3 mb-1">
                  Requested Limit Target
                </label>
                <select
                  value={requestedCredit}
                  onChange={(e) => setRequestedCredit(e.target.value)}
                  className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] font-bold text-[#1E293B] focus:border-[#6F42C1] focus:outline-none"
                >
                  <option>₹3.50 Crore</option>
                  <option>₹4.00 Crore</option>
                  <option>₹5.00 Crore</option>
                  <option>₹7.50 Crore</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#1E293B] block mb-1">
                  Procurement Justification / Monthly Volume
                </label>
                <textarea
                  rows={3}
                  value={creditNotes}
                  onChange={(e) => setCreditNotes(e.target.value)}
                  placeholder="Mention your upcoming government or export contracts that necessitate higher polymer rolling credit..."
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] focus:border-[#6F42C1] focus:outline-none font-medium text-[#1E293B]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsCreditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#1E293B] hover:bg-[#F4F7FC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6F42C1] text-xs font-bold text-white hover:bg-[#5C35A5] cursor-pointer"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Renew Modal */}
      {isRenewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-base font-extrabold text-[#1E293B]">
                Extend Platinum Pro Plan
              </h3>
              <button
                type="button"
                onClick={() => setIsRenewModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#F4F7FC] text-[#5A6B82] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">Plan:</span>
                <span className="font-bold text-[#1E293B]">Platinum Pro Wholesaler</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">Duration:</span>
                <span className="font-bold text-[#1E293B]">12 Months (until Dec 2027)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">Annual Fee:</span>
                <span className="font-mono font-bold text-[#1E293B]">₹49,999</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">GST (18%):</span>
                <span className="font-mono text-[#5A6B82]">₹8,999.82</span>
              </div>
              <div className="pt-2 border-t border-[#E2E8F0] flex justify-between font-extrabold text-sm text-[#1E293B]">
                <span>Total Payable:</span>
                <span className="text-[#6F42C1]">₹58,998.82</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setIsRenewModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#1E293B] hover:bg-[#F4F7FC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Payment processed via linked HDFC B2B mandate. Subscription extended until Dec 2027!');
                  setIsRenewModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#6F42C1] text-xs font-bold text-white hover:bg-[#5C35A5] cursor-pointer"
              >
                Confirm Payment & Renew
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
