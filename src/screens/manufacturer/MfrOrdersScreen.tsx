import React, { useState } from 'react';
import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  Truck,
  Box,
  Filter,
  Eye,
  ArrowLeft,
  X,
  Check,
} from 'lucide-react';
import { Order } from '../../types';
import { Modal } from '../../components/Modal';

interface MfrOrdersScreenProps {
  orders?: Order[];
  manufacturerName?: string;
  onUpdateOrderStatus?: (orderId: string, status: Order['orderStatus'], trackingNo?: string) => void;
  onNavigate?: (screen: string) => void;
}

interface OrderItem {
  id: string;
  buyerName: string;
  contactPerson?: string;
  phone?: string;
  shippingAddress?: string;
  product: string;
  sku?: string;
  quantity: string;
  orderValue: string;
  orderValueNumber?: number;
  unitPrice?: string;
  orderDate: string;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Dispatched' | 'Completed';
  paymentStatus?: string;
  dispatchStatus?: string;
  expectedShipDate?: string;
  trackingNumber?: string;
  carrier?: string;
}

export const MfrOrdersScreen: React.FC<MfrOrdersScreenProps> = ({
  orders,
  manufacturerName,
  onUpdateOrderStatus,
  onNavigate,
}) => {
  // Currently viewed order (inner page view)
  const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);

  // Tracking Modal State for Order Details
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingInput, setTrackingInput] = useState({
    carrier: 'Blue Dart Logistics',
    trackingNumber: 'TRK-IND-992140',
    dispatchNotes: 'Dispatched via Express surface cargo.',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [selectedBuyerFilter, setSelectedBuyerFilter] = useState<string>('All');

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Orders Data matching design specifications
  const [orderList, setOrderList] = useState<OrderItem[]>([
    {
      id: 'ORD-2041',
      buyerName: 'Metro Supermart',
      contactPerson: 'Ramesh Singh',
      phone: '+91 98201 22334',
      shippingAddress: 'Plot 42, MIDC Industrial Area, Andheri East, Mumbai, 400093',
      product: 'Premium Kitchen Storage Box Set (3 Pcs)',
      sku: 'PLS-STO-101',
      quantity: '500 Sets',
      orderValue: '₹72,500',
      unitPrice: '₹145 / Set',
      orderDate: 'Oct 14, 2026',
      status: 'Pending',
      paymentStatus: 'Payment Authorized (Escrow)',
      dispatchStatus: 'Awaiting Fulfillment',
      expectedShipDate: 'Oct 20, 2026',
    },
    {
      id: 'ORD-2040',
      buyerName: 'Global Retailers',
      contactPerson: 'Anjali Verma',
      phone: '+91 98765 43210',
      shippingAddress: 'Warehouse 12, GIDC Estate, Vatva, Ahmedabad, 382445',
      product: 'Modular Drawer Organizer (4-Tier)',
      sku: 'PLS-ORG-204',
      quantity: '1,000 Pcs',
      orderValue: '₹85,000',
      unitPrice: '₹85 / Pc',
      orderDate: 'Oct 12, 2026',
      status: 'Confirmed',
      paymentStatus: '50% Advance Received',
      dispatchStatus: 'In Production Queue',
      expectedShipDate: 'Oct 22, 2026',
    },
    {
      id: 'ORD-2039',
      buyerName: 'Sharma Plastics',
      contactPerson: 'Vikas Sharma',
      phone: '+91 99112 33445',
      shippingAddress: 'Shop 18, Sadar Bazar Wholesale Market, Delhi, 110006',
      product: 'Insulated Lunch Tiffin (4 Tier)',
      sku: 'PLS-LNC-005',
      quantity: '200 Sets',
      orderValue: '₹44,000',
      unitPrice: '₹220 / Set',
      orderDate: 'Oct 10, 2026',
      status: 'Processing',
      paymentStatus: 'Full Payment Confirmed',
      dispatchStatus: 'Packing & Labeling',
      expectedShipDate: 'Oct 17, 2026',
    },
    {
      id: 'ORD-2038',
      buyerName: 'City Mall Hub',
      contactPerson: 'Deepak Patel',
      phone: '+91 97123 99887',
      shippingAddress: 'Commercial Hub, SG Highway, Ahmedabad, 380054',
      product: 'Microwave Safe Bowls (Set of 4)',
      sku: 'PLS-BWL-302',
      quantity: '150 Sets',
      orderValue: '₹16,500',
      unitPrice: '₹110 / Set',
      orderDate: 'Oct 08, 2026',
      status: 'Dispatched',
      paymentStatus: 'Payment Settled',
      dispatchStatus: 'In Transit via Blue Dart',
      trackingNumber: 'TRK-IND-992140',
      carrier: 'Blue Dart Logistics',
    },
    {
      id: 'ORD-2037',
      buyerName: 'Daily Needs Mart',
      contactPerson: 'Suresh Kumar',
      phone: '+91 98450 77889',
      shippingAddress: 'Brigade Road, Commercial Area, Bengaluru, 560025',
      product: 'Premium Kitchen Storage Box Set (3 Pcs)',
      sku: 'PLS-STO-101',
      quantity: '300 Sets',
      orderValue: '₹43,500',
      unitPrice: '₹145 / Set',
      orderDate: 'Oct 05, 2026',
      status: 'Completed',
      paymentStatus: 'Payment Settled',
      dispatchStatus: 'Delivered',
      trackingNumber: 'TRK-IND-881203',
      carrier: 'VRL Logistics',
    },
  ]);

  const selectedOrder = orderList.find((o) => o.id === viewingOrderId);

  // Filtered Orders based on searchQuery, orderStatusFilter, and selectedBuyerFilter
  const filteredOrders = orderList.filter((item) => {
    // Status filter
    if (orderStatusFilter !== 'All' && item.status !== orderStatusFilter) return false;

    // Buyer filter
    if (selectedBuyerFilter !== 'All' && item.buyerName !== selectedBuyerFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = item.id.toLowerCase().includes(q);
      const matchBuyer = item.buyerName.toLowerCase().includes(q);
      const matchProduct = item.product.toLowerCase().includes(q);
      if (!matchId && !matchBuyer && !matchProduct) return false;
    }

    return true;
  });

  // Unique buyer names for filter dropdown
  const uniqueBuyers = Array.from(new Set(orderList.map((o) => o.buyerName)));

  const handleUpdateTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingOrderId) return;

    setOrderList((prev) =>
      prev.map((o) =>
        o.id === viewingOrderId
          ? {
              ...o,
              status: 'Dispatched',
              dispatchStatus: `Dispatched via ${trackingInput.carrier}`,
              trackingNumber: trackingInput.trackingNumber,
              carrier: trackingInput.carrier,
            }
          : o
      )
    );

    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(viewingOrderId, 'Dispatched', trackingInput.trackingNumber);
    }

    setIsTrackingModalOpen(false);
    showToast(`Tracking information updated for ${viewingOrderId}`);
  };

  // -------------------------------------------------------------
  // INNER VIEW: ORDER DETAILS
  // -------------------------------------------------------------
  if (viewingOrderId && selectedOrder) {
    return (
      <div className="space-y-6 pb-16">
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

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewingOrderId(null)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Order Details
              </h2>
              <p className="text-xs sm:text-sm text-[#5A6B82] font-mono mt-0.5">
                {selectedOrder.id}
              </p>
            </div>
          </div>

          <div>
            {selectedOrder.status === 'Pending' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#EEEDFD] border border-[#D6D4F7] text-[#4B49AC] text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-[#4B49AC]" />
                Pending
              </span>
            )}
            {selectedOrder.status === 'Confirmed' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                Confirmed
              </span>
            )}
            {selectedOrder.status === 'Processing' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#EEEDFD] border border-[#D6D4F7] text-[#4B49AC] text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-[#4B49AC]" />
                Processing
              </span>
            )}
            {selectedOrder.status === 'Dispatched' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
                <Truck className="w-3.5 h-3.5 text-purple-600" />
                Dispatched
              </span>
            )}
            {selectedOrder.status === 'Completed' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                Completed
              </span>
            )}
          </div>
        </div>

        {/* Order Summary (Full Width) */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Order Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                Order Date
              </span>
              <span className="font-semibold text-slate-900 mt-1 block">
                {selectedOrder.orderDate}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                Total Amount
              </span>
              <span className="font-bold text-slate-900 mt-1 block">
                {selectedOrder.orderValue}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                Quantity
              </span>
              <span className="font-semibold text-slate-900 mt-1 block">
                {selectedOrder.quantity}
              </span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Product Details
          </h3>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-slate-400 shrink-0">
                <Box className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  {selectedOrder.product}
                </h4>
                <p className="text-xs text-[#5A6B82] font-mono mt-0.5">
                  SKU: {selectedOrder.sku || 'PLS-STO-101'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                {selectedOrder.orderValue}
              </span>
              <span className="text-xs text-[#5A6B82] block">
                {selectedOrder.unitPrice || '₹145 / Set'} × {selectedOrder.quantity}
              </span>
            </div>
          </div>
        </div>

        {/* Payment & Dispatch Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              Payment Status
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-[#5A6B82]">Settlement Status</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {selectedOrder.paymentStatus || 'Payment Settled'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Dispatch Status
              </h3>
              {selectedOrder.status !== 'Completed' && (
                <button
                  type="button"
                  onClick={() => setIsTrackingModalOpen(true)}
                  className="text-xs font-bold text-[#4B49AC] hover:text-[#3F3D99] hover:underline cursor-pointer"
                >
                  Update Tracking
                </button>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="text-xs text-[#5A6B82]">
                {selectedOrder.dispatchStatus || 'In Transit'}
              </p>
              {selectedOrder.trackingNumber && (
                <p className="text-xs font-mono font-bold text-slate-900">
                  Tracking: {selectedOrder.trackingNumber} ({selectedOrder.carrier})
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 flex items-center justify-between border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => setViewingOrderId(null)}
            className="px-5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Back to Orders
          </button>

          {selectedOrder.status === 'Confirmed' && (
            <button
              type="button"
              onClick={() => {
                setOrderList((prev) =>
                  prev.map((o) =>
                    o.id === selectedOrder.id
                      ? { ...o, status: 'Processing', dispatchStatus: 'In Production' }
                      : o
                  )
                );
                showToast(`Order ${selectedOrder.id} marked as Processing`);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#4B49AC] hover:bg-[#3F3D99] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Start Processing
            </button>
          )}

          {selectedOrder.status === 'Processing' && (
            <button
              type="button"
              onClick={() => setIsTrackingModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#4B49AC] hover:bg-[#3F3D99] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Dispatch Order
            </button>
          )}
        </div>

        {isTrackingModalOpen && (
          <Modal
            isOpen={isTrackingModalOpen}
            onClose={() => setIsTrackingModalOpen(false)}
            title="Update Tracking Information"
          >
            <form onSubmit={handleUpdateTracking} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  Logistics Carrier
                </label>
                <input
                  type="text"
                  required
                  value={trackingInput.carrier}
                  onChange={(e) =>
                    setTrackingInput({ ...trackingInput, carrier: e.target.value })
                  }
                  placeholder="e.g. Blue Dart, VRL Logistics, Delhivery"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-slate-900 focus:outline-none focus:border-[#4B49AC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  Tracking / LR Number
                </label>
                <input
                  type="text"
                  required
                  value={trackingInput.trackingNumber}
                  onChange={(e) =>
                    setTrackingInput({
                      ...trackingInput,
                      trackingNumber: e.target.value,
                    })
                  }
                  placeholder="e.g. TRK-IND-992140"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-slate-900 focus:outline-none focus:border-[#4B49AC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  Dispatch Notes
                </label>
                <textarea
                  rows={2}
                  value={trackingInput.dispatchNotes}
                  onChange={(e) =>
                    setTrackingInput({
                      ...trackingInput,
                      dispatchNotes: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-sm text-slate-900 focus:outline-none focus:border-[#4B49AC]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsTrackingModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#4B49AC] hover:bg-[#3F3D99] text-white text-xs font-semibold shadow-xs"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // MASTER ORDERS WORKBENCH
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 pb-16">
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

      {/* Top Header with Filter Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Orders
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6B82] mt-1 font-normal">
            Track customer orders, manage fulfillment and dispatch tracking
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFilterModalOpen(true)}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border transition-colors cursor-pointer shrink-0 self-start sm:self-auto text-xs font-semibold ${
            orderStatusFilter !== 'All' || selectedBuyerFilter !== 'All' || searchQuery.trim() !== ''
              ? 'border-[#4B49AC] bg-[#EEEDFD]/50 text-[#4B49AC]'
              : 'border-[#CBD5E1] bg-white hover:bg-slate-50 text-slate-700'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filter</span>
          {(orderStatusFilter !== 'All' || selectedBuyerFilter !== 'All' || searchQuery.trim() !== '') && (
            <span className="w-2 h-2 rounded-full bg-[#4B49AC]" />
          )}
        </button>
      </div>

      {/* Top Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
              TOTAL ORDERS
            </span>
            <div className="w-6 h-6 rounded-full bg-[#EEEDFD] text-[#4B49AC] flex items-center justify-center">
              <ShoppingCart className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
              25
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
              CONFIRMED ORDERS
            </span>
            <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Check className="w-3 h-3 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
              18
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
              DISPATCH PENDING
            </span>
            <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Truck className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
              7
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
              COMPLETED ORDERS
            </span>
            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
              <Box className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
              145
            </span>
          </div>
        </div>
      </div>

      {/* Main Unified Orders Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {/* Status Filter Pills */}
        <div className="p-5 pb-3 flex items-center justify-between gap-3 flex-wrap border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2 flex-wrap">
            {(['All', 'Pending', 'Confirmed', 'Processing', 'Dispatched', 'Completed'] as const).map(
              (status) => {
                const isSelected = orderStatusFilter === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setOrderStatusFilter(status)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#4B49AC] text-white'
                        : 'bg-white border border-[#CBD5E1] text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {status}
                  </button>
                );
              }
            )}
          </div>

          <div className="text-xs text-[#5A6B82]">
            Showing <span className="font-bold text-slate-900">{filteredOrders.length}</span> orders
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider bg-white">
                <th className="py-4 px-5">ORDER ID</th>
                <th className="py-4 px-5">BUYER NAME</th>
                <th className="py-4 px-5">PRODUCT</th>
                <th className="py-4 px-5">QUANTITY</th>
                <th className="py-4 px-5">ORDER VALUE</th>
                <th className="py-4 px-5">ORDER DATE</th>
                <th className="py-4 px-5">STATUS</th>
                <th className="py-4 px-5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-xs sm:text-sm text-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-xs text-[#5A6B82]">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isPending = order.status === 'Pending';
                  const isConfirmed = order.status === 'Confirmed';
                  const isProcessing = order.status === 'Processing';
                  const isDispatched = order.status === 'Dispatched';
                  const isCompleted = order.status === 'Completed';

                  return (
                    <tr key={order.id} className="hover:bg-[#EEEDFD]/30 transition-colors">
                      <td className="py-4 px-5 font-bold font-mono text-slate-900">
                        {order.id}
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-900">
                        {order.buyerName}
                      </td>
                      <td className="py-4 px-5 text-[#5A6B82] font-normal truncate max-w-[200px]">
                        {order.product}
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-900">
                        {order.quantity}
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-900">
                        {order.orderValue}
                      </td>
                      <td className="py-4 px-5 text-[#5A6B82] font-normal">
                        {order.orderDate}
                      </td>
                      <td className="py-4 px-5">
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#EEEDFD] border border-[#D6D4F7] text-[#4B49AC] text-xs font-semibold">
                            <Clock className="w-3 h-3 text-[#4B49AC]" />
                            Pending
                          </span>
                        )}
                        {isConfirmed && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                            Confirmed
                          </span>
                        )}
                        {isProcessing && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#EEEDFD] border border-[#D6D4F7] text-[#4B49AC] text-xs font-semibold">
                            <Clock className="w-3 h-3 text-[#4B49AC]" />
                            Processing
                          </span>
                        )}
                        {isDispatched && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
                            <Truck className="w-3 h-3 text-purple-600" />
                            Dispatched
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                            <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                            Completed
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => setViewingOrderId(order.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#D6D4F7] bg-white hover:bg-[#EEEDFD] text-[#4B49AC] text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#4B49AC]" />
                          <span>View Order</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <Modal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          title="Filter Orders"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Search Keyword
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID, Buyer, Product..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-slate-900 focus:outline-none focus:border-[#4B49AC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Filter by Buyer Name
              </label>
              <select
                value={selectedBuyerFilter}
                onChange={(e) => setSelectedBuyerFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-slate-900 focus:outline-none focus:border-[#4B49AC]"
              >
                <option value="All">All Buyers</option>
                {uniqueBuyers.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Order Status
              </label>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-slate-900 focus:outline-none focus:border-[#4B49AC]"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBuyerFilter('All');
                  setOrderStatusFilter('All');
                  showToast('Filters cleared');
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                Reset Filters
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFilterModalOpen(false);
                    showToast('Filter criteria applied!');
                  }}
                  className="px-5 py-2 rounded-xl bg-[#4B49AC] hover:bg-[#3F3D99] text-white text-xs font-semibold shadow-xs"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
