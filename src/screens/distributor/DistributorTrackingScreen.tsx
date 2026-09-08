import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Download,
  AlertCircle,
  Building2,
  Package,
  X,
  Navigation,
} from 'lucide-react';
import { Order } from '../../types';

interface DistributorTrackingScreenProps {
  orders?: Order[];
  onConfirmDelivery?: (orderId: string) => void;
  onNavigate?: (screen: string) => void;
}

export const DistributorTrackingScreen: React.FC<DistributorTrackingScreenProps> = ({
  orders = [],
  onConfirmDelivery,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLrModalOpen, setIsLrModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueText, setIssueText] = useState('');

  // Enriched tracking consignments
  const trackableOrders = orders.map((ord, idx) => ({
    ...ord,
    vehicleNo: `GJ-${String(10 + (idx * 3) % 25).padStart(2, '0')}-AB-${1000 + (idx * 431) % 8999}`,
    transporterName: 'Gujarat Express Polymer Logistics LLP',
    driverName: ['Ramesh Patel', 'Bhupendra Jadeja', 'Kishan Solanki', 'Dharmesh Trivedi'][idx % 4],
    driverPhone: '+91 98251 ' + (20000 + (idx * 3141) % 70000),
    currentLocation: ['Ahmedabad Toll Plaza (NH-48)', 'Morbi Extrusion Bay 4', 'Vapi Industrial Ring Road', 'Sanand GIDC Inbound Gate'][idx % 4],
    gpsCoordinates: '23.0225° N, 72.5714° E',
    progressPercent: ord.orderStatus === 'Completed' ? 100 : ord.orderStatus === 'Dispatched' ? 70 : 35,
  }));

  const filteredConsignments = trackableOrders.filter((c) => {
    const q = (searchTerm || '').toLowerCase().trim();
    if (!q) {
      return (
        statusFilter === 'All' ||
        (statusFilter === 'In Transit' && (c.orderStatus === 'Dispatched' || c.orderStatus === 'Processing' || c.orderStatus === 'In Transit')) ||
        (statusFilter === 'Delivered' && (c.orderStatus === 'Completed' || c.orderStatus === 'Delivered'))
      );
    }

    const matchesSearch =
      (c.id || '').toLowerCase().includes(q) ||
      (c.product || c.productName || '').toLowerCase().includes(q) ||
      (c.manufacturer || c.manufacturerName || '').toLowerCase().includes(q) ||
      (c.trackingNumber && c.trackingNumber.toLowerCase().includes(q)) ||
      (c.vehicleNo && c.vehicleNo.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'In Transit' && (c.orderStatus === 'Dispatched' || c.orderStatus === 'Processing' || c.orderStatus === 'In Transit')) ||
      (statusFilter === 'Delivered' && (c.orderStatus === 'Completed' || c.orderStatus === 'Delivered'));

    return matchesSearch && matchesStatus;
  });

  const handleOpenLr = (ord: Order) => {
    setSelectedOrder(ord);
    setIsLrModalOpen(true);
  };

  const handleOpenIssue = (ord: Order) => {
    setSelectedOrder(ord);
    setIsIssueModalOpen(true);
  };

  const handleConfirmDeliveryAction = (orderId: string) => {
    if (onConfirmDelivery) {
      onConfirmDelivery(orderId);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
              Delivery Tracking
            </h2>
            <span className="px-2.5 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded-lg flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              Live Fleet GPS
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#5A6B82] mt-1 font-medium">
            Monitor real-time dispatches, Lorry Receipts (LR), driver coordinates, and warehouse delivery status
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('dst_orders')}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0B1F3A] text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <Package className="w-4 h-4 text-emerald-600" />
            <span>All Purchase Orders</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
          <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider block">
            In-Transit Shipments
          </span>
          <h3 className="text-2xl font-extrabold text-[#0B1F3A] mt-2">
            {orders.filter((o) => o.orderStatus === 'Dispatched' || o.orderStatus === 'Processing').length}
          </h3>
          <p className="text-xs font-semibold text-blue-600 mt-1 flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5" /> Live GPS Active
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
          <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider block">
            On-Time Delivery Rate
          </span>
          <h3 className="text-2xl font-extrabold text-emerald-700 mt-2">99.4%</h3>
          <p className="text-xs font-semibold text-emerald-700 mt-1">Across Gujarat corridors</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
          <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider block">
            Total Tonnage on Route
          </span>
          <h3 className="text-2xl font-extrabold text-[#0B1F3A] mt-2">65 MT</h3>
          <p className="text-xs font-semibold text-[#5A6B82] mt-1">HDPE, PP, & LDPE Resins</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
          <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider block">
            Escrow Released upon QC
          </span>
          <h3 className="text-2xl font-extrabold text-emerald-700 mt-2">100% Guaranteed</h3>
          <p className="text-xs font-semibold text-[#5A6B82] mt-1">Zero auto-debit before signoff</p>
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#5A6B82] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, LR Tracking No, Vehicle, or Resin Grade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9.5 pl-9.5 pr-4 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] focus:outline-none focus:border-emerald-500 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['All', 'In Transit', 'Delivered'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#0B1F3A] text-white shadow-xs'
                  : 'bg-[#F4F7FC] text-[#5A6B82] hover:text-[#0B1F3A] border border-[#E2E8F0]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Consignments List */}
      <div className="space-y-4">
        {filteredConsignments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center shadow-xs">
            <Truck className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
            <h4 className="text-sm font-bold text-[#0B1F3A]">No active consignments found</h4>
            <p className="text-xs text-[#5A6B82] mt-1">All current deliveries have been recorded and settled.</p>
          </div>
        ) : (
          filteredConsignments.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:border-emerald-300 transition-all space-y-4"
            >
              {/* Header Row */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-[#0B1F3A] bg-[#F4F7FC] px-2.5 py-0.5 rounded-md border border-[#E2E8F0]">
                      {c.id}
                    </span>
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                      LR: {c.trackingNumber || 'LR-GJ-8841'}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        c.orderStatus === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.orderStatus === 'Dispatched'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.orderStatus === 'Completed' ? 'Delivered & Approved' : c.orderStatus}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#0B1F3A]">{c.product}</h3>
                  <p className="text-xs text-[#5A6B82] mt-0.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Origin Plant: <strong className="text-[#0B1F3A]">{c.manufacturer}</strong></span>
                    <span>•</span>
                    <span>Quantity: <strong className="text-[#0B1F3A]">{c.quantity}</strong></span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl min-w-[140px] text-right">
                    <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                      Est. Arrival
                    </span>
                    <span className="text-xs font-extrabold text-[#0B1F3A]">{c.estimatedDelivery}</span>
                  </div>
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl min-w-[140px] text-right">
                    <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                      Invoice Amount
                    </span>
                    <span className="text-sm font-black text-[#0B1F3A]">
                      ₹{c.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Multi-Step Timeline */}
              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0B1F3A]">Live Route Progress:</span>
                    <span className="font-semibold text-blue-700">{c.currentLocation}</span>
                  </div>
                  <span className="font-bold text-[#5A6B82]">{c.progressPercent}% Completed</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full transition-all duration-500 ${
                      c.orderStatus === 'Completed' ? 'bg-emerald-500' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${c.progressPercent}%` }}
                  />
                </div>

                {/* Milestone steps */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>1. PO & Escrow Locked</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>2. Plant QC & Loaded</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 font-bold ${
                      c.orderStatus !== 'Processing' ? 'text-blue-700' : 'text-[#94A3B8]'
                    }`}
                  >
                    {c.orderStatus !== 'Processing' ? (
                      <Truck className="w-4 h-4 shrink-0 text-blue-600 animate-pulse" />
                    ) : (
                      <Clock className="w-4 h-4 shrink-0" />
                    )}
                    <span>3. In Transit (Highway)</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 font-bold ${
                      c.orderStatus === 'Completed' ? 'text-emerald-700' : 'text-[#94A3B8]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>4. Delivered & QC Signed</span>
                  </div>
                </div>
              </div>

              {/* Truck Driver & Logistics Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
                  <span className="text-[#5A6B82] block text-[11px]">Vehicle / Truck Number:</span>
                  <span className="font-mono font-bold text-[#0B1F3A]">{c.vehicleNo}</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
                  <span className="text-[#5A6B82] block text-[11px]">Assigned Driver & Phone:</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-bold text-[#0B1F3A]">{c.driverName}</span>
                    <a
                      href={`tel:${c.driverPhone}`}
                      className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> {c.driverPhone}
                    </a>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
                  <span className="text-[#5A6B82] block text-[11px]">Destination Warehouse:</span>
                  <span className="font-bold text-[#0B1F3A]">{c.dispatchHub} Depot</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenLr(c)}
                    className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-bold text-[#0B1F3A] hover:bg-[#F4F7FC] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>View Digital LR & B/L</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenIssue(c)}
                    className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Report Delay / Transit Issue</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {c.orderStatus !== 'Completed' ? (
                    <button
                      type="button"
                      onClick={() => handleConfirmDeliveryAction(c.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Delivery & Release Escrow</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Consignment Completed & Settled
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Digital LR Modal */}
      {isLrModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-extrabold text-[#0B1F3A]">
                  Digital Lorry Receipt (LR) & Consignment Note
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLrModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#F4F7FC] text-[#5A6B82]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">LR Document No:</span>
                <span className="font-mono font-bold text-[#0B1F3A]">{selectedOrder.trackingNumber || 'LR-GJ-8841'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">Purchase Order:</span>
                <span className="font-mono font-bold text-[#0B1F3A]">{selectedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">Consignor (Plant):</span>
                <span className="font-bold text-[#0B1F3A]">{selectedOrder.manufacturer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">Consignee (Buyer):</span>
                <span className="font-bold text-[#0B1F3A]">Apex Polymers LLP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">Polymer Grade:</span>
                <span className="font-bold text-[#0B1F3A]">{selectedOrder.product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">Quantity Dispatched:</span>
                <span className="font-bold text-[#0B1F3A]">{selectedOrder.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">COA / Batch Test:</span>
                <span className="font-bold text-emerald-700">Attached & Certified</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => alert(`Downloading signed LR PDF: ${selectedOrder.trackingNumber || 'LR-GJ-8841'}.pdf`)}
                className="px-4 py-2 rounded-xl bg-[#0B1F3A] text-xs font-bold text-white hover:bg-[#142d4f] flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Signed LR PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Transit Issue Modal */}
      {isIssueModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-base font-extrabold text-[#0B1F3A]">
                Report Transit Delay or Issue
              </h3>
              <button
                type="button"
                onClick={() => setIsIssueModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#F4F7FC] text-[#5A6B82]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Transit dispute ticket raised with PlastoShip Logistics Control for Order ${selectedOrder.id}.`);
                setIsIssueModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-[#0B1F3A] block mb-1">Issue Category</label>
                <select className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] font-medium text-[#0B1F3A]">
                  <option>Highway Toll / Highway Delay</option>
                  <option>Transporter Vehicle Breakdown</option>
                  <option>Wrong Delivery Depot Scheduled</option>
                  <option>Damaged Packaging / Bag Spill</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#0B1F3A] block mb-1">Issue Details</label>
                <textarea
                  rows={3}
                  value={issueText}
                  onChange={(e) => setIssueText(e.target.value)}
                  placeholder="Describe the logistics issue so PlastoShip operations team can intervene immediately..."
                  className="w-full p-3 rounded-xl border border-[#E2E8F0]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#0B1F3A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-700"
                >
                  Submit Logistics Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
