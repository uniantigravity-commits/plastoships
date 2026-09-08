import React, { useState } from 'react';
import {
  FileQuestion,
  Search,
  Eye,
  Activity,
  CheckCircle2,
  Clock,
  MapPin,
  Building,
  TrendingUp,
  CreditCard,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Rfq, RfqStatus } from '../types';
import { Modal } from '../components/Modal';

interface RfqScreenProps {
  rfqs: Rfq[];
}

export const RfqScreen: React.FC<RfqScreenProps> = ({ rfqs }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | RfqStatus>('All');

  const [selectedRfq, setSelectedRfq] = useState<Rfq | null>(null);
  const [trackRfq, setTrackRfq] = useState<Rfq | null>(null);

  const filtered = rfqs.filter((r) => {
    const q = (search || '').toLowerCase().trim();
    if (!q) return statusFilter === 'All' || r.status === statusFilter;

    const matchesSearch =
      (r.id || '').toLowerCase().includes(q) ||
      (r.distributorName || '').toLowerCase().includes(q) ||
      (r.product || r.productName || '').toLowerCase().includes(q) ||
      (r.deliveryLocation || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0B1F3A] tracking-tight">
            RFQ Management
          </h2>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#5A6B82] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search RFQ ID, distributor, polymer..."
            className="w-full h-10 pl-9.5 pr-4 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium placeholder-[#5A6B82] focus:outline-none focus:border-[#0B1F3A] focus:bg-white transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4F7FC] rounded-xl border border-[#E2E8F0] w-full md:w-auto overflow-x-auto">
          {(['All', 'Open', 'Quotes Received', 'Negotiating', 'Awarded', 'Closed'] as const).map(
            (tab) => {
              const count =
                tab === 'All' ? rfqs.length : rfqs.filter((r) => r.status === tab).length;
              const isActive = statusFilter === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#0B1F3A] text-white shadow-xs'
                      : 'text-[#5A6B82] hover:text-[#0B1F3A] hover:bg-white/60'
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-[#FF7A18] text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* RFQ Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
                <th className="py-4 px-6 w-[12%]">RFQ ID</th>
                <th className="py-4 px-4 w-[22%]">Distributor</th>
                <th className="py-4 px-4 w-[24%]">Product / Category</th>
                <th className="py-4 px-4 w-[14%]">Quantity</th>
                <th className="py-4 px-4 w-[13%]">Status</th>
                <th className="py-4 px-4 w-[10%]">Created Date</th>
                <th className="py-4 px-6 w-[8%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-xs">
              {filtered.map((rfq) => (
                <tr key={rfq.id} className="hover:bg-[#F4F7FC]/70 transition-colors">
                  {/* RFQ ID in Space Mono */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="font-mono-code font-bold text-xs text-[#0B1F3A] bg-[#F4F7FC] px-2.5 py-1 rounded-md border border-slate-200 inline-block whitespace-nowrap">
                      {rfq.id}
                    </span>
                  </td>

                  {/* Distributor */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-[#0B1F3A] text-xs leading-snug">
                      {rfq.distributorName}
                    </p>
                    <p className="text-[11px] text-[#5A6B82] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {rfq.deliveryLocation.split(',')[0]}
                    </p>
                  </td>

                  {/* Product & Category */}
                  <td className="py-4 px-4">
                    <p className="font-semibold text-[#0B1F3A]">{rfq.product.replace(/\s*\([^)]*\)/g, '')}</p>
                    <span className="inline-block mt-0.5 px-2 py-0.2 bg-slate-100 text-[#5A6B82] text-[10px] font-bold rounded">
                      {rfq.category}
                    </span>
                  </td>

                  {/* Quantity */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <p className="font-extrabold text-[#0B1F3A]">{rfq.quantity}</p>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
                        rfq.status === 'Open'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : rfq.status === 'Quotes Received'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : rfq.status === 'Negotiating'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : rfq.status === 'Awarded'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                      <span>{rfq.status}</span>
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="py-4 px-4 text-[#5A6B82] text-[11px] whitespace-nowrap">{rfq.createdDate}</td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedRfq(rfq)}
                        className="px-2.5 py-1.5 bg-white hover:bg-[#F4F7FC] text-[#0B1F3A] font-bold text-xs rounded-lg border border-[#E2E8F0] transition-colors flex items-center gap-1"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTrackRfq(rfq)}
                        className="px-2.5 py-1.5 bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                        title="Track Pipeline"
                      >
                        <Activity className="w-3.5 h-3.5 text-[#FF7A18]" />
                        <span>Track</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW RFQ DETAILS MODAL */}
      <Modal
        isOpen={!!selectedRfq}
        onClose={() => setSelectedRfq(null)}
        title={`RFQ Overview — ${selectedRfq?.id}`}
        subtitle={`Created on ${selectedRfq?.createdDate} by ${selectedRfq?.distributorName}`}
        maxWidth="2xl"
      >
        {selectedRfq && (
          <div className="space-y-6">
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#5A6B82]">Current Status:</span>
                <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#0B1F3A] text-[#FF7A18]">
                  {selectedRfq.status}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-[#5A6B82]">Manufacturer Quotes: </span>
                <span className="font-extrabold text-[#0B1F3A]">
                  {selectedRfq.quotesCount} Active Bids
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white">
                <p className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
                  Product Demanded
                </p>
                <h4 className="text-sm font-bold text-[#0B1F3A] mt-1">{selectedRfq.product}</h4>
                <p className="text-xs text-[#5A6B82] mt-1">Category: {selectedRfq.category}</p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[#5A6B82]">Volume:</span>
                  <span className="font-extrabold text-[#0B1F3A]">{selectedRfq.quantity}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white">
                <p className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
                  Target Price & Terms
                </p>
                <h4 className="text-base font-extrabold text-[#0B1F3A] mt-1">
                  {selectedRfq.targetPrice}
                </h4>
                <p className="text-xs text-[#5A6B82] mt-1">
                  Payment: <span className="text-[#0B1F3A] font-semibold">{selectedRfq.paymentTerms}</span>
                </p>
                <p className="text-xs text-[#5A6B82] mt-1">
                  Timeline: <span className="text-[#0B1F3A] font-semibold">{selectedRfq.deliveryTimeline}</span>
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white sm:col-span-2">
                <p className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
                  Delivery Destination & Remarks
                </p>
                <p className="text-xs font-bold text-[#0B1F3A] mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {selectedRfq.deliveryLocation}
                </p>
                <p className="text-xs text-[#5A6B82] mt-2 italic bg-[#F4F7FC] p-3 rounded-lg border border-slate-200">
                  "{selectedRfq.remarks}"
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setSelectedRfq(null)}
                className="px-4 py-2 text-xs font-bold text-[#0B1F3A] hover:bg-[#F4F7FC] rounded-xl border border-[#E2E8F0]"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* TRACK RFQ PIPELINE MODAL */}
      <Modal
        isOpen={!!trackRfq}
        onClose={() => setTrackRfq(null)}
        title="RFQ Fulfillment Pipeline"
        subtitle={`Live Gujarat Lifecycle for ${trackRfq?.id}`}
        maxWidth="lg"
      >
        {trackRfq && (
          <div className="space-y-6">
            {/* Pipeline Steps */}
            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {/* Step 1 */}
              <div className="flex items-start gap-4 relative">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 ring-4 ring-white">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0B1F3A]">RFQ Broadcasted</h4>
                  <p className="text-[11px] text-[#5A6B82]">
                    Dispatched to verified GIDC manufacturers matching {trackRfq.category}.
                  </p>
                  <span className="text-[10px] font-semibold text-emerald-700 mt-0.5 block">
                    Completed • {trackRfq.createdDate}
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 relative">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 ring-4 ring-white">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0B1F3A]">Manufacturer Bids Received</h4>
                  <p className="text-[11px] text-[#5A6B82]">
                    {trackRfq.quotesCount} bids submitted with technical certificates.
                  </p>
                  <span className="text-[10px] font-semibold text-emerald-700 mt-0.5 block">
                    Competitive Spread: ₹94 - ₹108 / Kg
                  </span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 relative">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ring-4 ring-white ${
                    trackRfq.status === 'Awarded' || trackRfq.status === 'Closed'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#FF7A18] text-white animate-pulse'
                  }`}
                >
                  {trackRfq.status === 'Awarded' || trackRfq.status === 'Closed' ? '✓' : '3'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0B1F3A]">Escrow & Commercial Finalization</h4>
                  <p className="text-[11px] text-[#5A6B82]">
                    Distributor rate negotiation and 100% PlastoShip Escrow deposit.
                  </p>
                  <span className="text-[10px] font-semibold text-amber-700 mt-0.5 block">
                    {trackRfq.status === 'Awarded' ? 'Deal Awarded' : 'Active Stage'}
                  </span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-4 relative">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ring-4 ring-white ${
                    trackRfq.status === 'Closed'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {trackRfq.status === 'Closed' ? '✓' : '4'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0B1F3A]">Gujarat Regional Dispatch & Order Completion</h4>
                  <p className="text-[11px] text-[#5A6B82]">
                    E-Way Bill generation and delivery to {trackRfq.deliveryLocation.split(',')[0]}.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between text-xs">
              <span className="text-[#5A6B82]">Designated Logistics Hub:</span>
              <span className="font-bold text-[#0B1F3A]">Gujarat State Highway Freight Corridor</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setTrackRfq(null)}
                className="px-4 py-2 text-xs font-bold text-[#0B1F3A] hover:bg-[#F4F7FC] rounded-xl border border-[#E2E8F0]"
              >
                Close Tracking
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
