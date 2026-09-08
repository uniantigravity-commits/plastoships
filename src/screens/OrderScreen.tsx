import React, { useState } from 'react';
import {
  ShoppingCart,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  IndianRupee,
  MapPin,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { Modal } from '../components/Modal';

interface OrderScreenProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const OrderScreen: React.FC<OrderScreenProps> = ({ orders, onUpdateStatus }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    const q = (search || '').toLowerCase().trim();
    if (!q) return statusFilter === 'All' || o.orderStatus === statusFilter;

    const matchesSearch =
      (o.id || '').toLowerCase().includes(q) ||
      (o.manufacturer || o.manufacturerName || '').toLowerCase().includes(q) ||
      (o.distributor || o.distributorName || '').toLowerCase().includes(q) ||
      (o.product || o.productName || '').toLowerCase().includes(q) ||
      (o.dispatchHub || '').toLowerCase().includes(q) ||
      (o.trackingNumber || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const allStatuses: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Processing',
    'Dispatched',
    'Completed',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0B1F3A] tracking-tight">
            Order Management
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
            placeholder="Search Order ID, plant, buyer, hub..."
            className="w-full h-10 pl-9.5 pr-4 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium placeholder-[#5A6B82] focus:outline-none focus:border-[#0B1F3A] focus:bg-white transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4F7FC] rounded-xl border border-[#E2E8F0] w-full md:w-auto overflow-x-auto">
          {(['All', 'Pending', 'Confirmed', 'Processing', 'Dispatched', 'Completed'] as const).map(
            (tab) => {
              const count =
                tab === 'All' ? orders.length : orders.filter((o) => o.orderStatus === tab).length;
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

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
                <th className="py-4 px-6 w-[14%]">Order ID</th>
                <th className="py-4 px-4 w-[23%]">Manufacturer</th>
                <th className="py-4 px-4 w-[20%]">Distributor</th>
                <th className="py-4 px-4 w-[23%]">Product / Quantity</th>
                <th className="py-4 px-4 w-[10%] text-right">Amount</th>
                <th className="py-4 px-6 w-[10%] text-right">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-xs">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-[#F4F7FC]/70 transition-colors">
                  {/* Order ID in Space Mono */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="font-mono-code font-bold text-xs text-[#0B1F3A] bg-[#F4F7FC] px-2 py-1 rounded border border-slate-200 block w-fit">
                      {order.id}
                    </span>
                    <span className="text-[10px] text-[#5A6B82] mt-1 block">
                      {order.createdDate}
                    </span>
                  </td>

                  {/* Manufacturer */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-[#0B1F3A]">{order.manufacturer}</p>
                    <p className="text-[11px] text-[#5A6B82] mt-0.5">{order.dispatchHub}</p>
                  </td>

                  {/* Distributor */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-[#0B1F3A]">{order.distributor}</p>
                  </td>

                  {/* Product & Qty */}
                  <td className="py-4 px-4">
                    <p className="font-semibold text-[#0B1F3A]">{order.product}</p>
                    <p className="text-[11px] font-extrabold text-[#5A6B82] mt-0.5">{order.quantity}</p>
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-4 whitespace-nowrap text-right">
                    <p className="font-extrabold text-sm text-[#0B1F3A]">{formatINR(order.amount)}</p>
                  </td>

                  {/* Order Status */}
                  <td className="py-4 px-6 whitespace-nowrap text-right">
                    <div className="flex justify-end">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer transition-colors whitespace-nowrap ${
                          order.orderStatus === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : order.orderStatus === 'Dispatched'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : order.orderStatus === 'Processing'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : order.orderStatus === 'Confirmed'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-zinc-100 text-zinc-700 border-zinc-300'
                        }`}
                      >
                        {allStatuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW ORDER DETAILS MODAL */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details — ${selectedOrder?.id}`}
        subtitle={`Dispatched from ${selectedOrder?.dispatchHub}`}
        maxWidth="2xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#5A6B82]">Invoice Value:</span>
                <p className="text-xl font-extrabold text-[#0B1F3A] mt-0.5">
                  {formatINR(selectedOrder.amount)}
                </p>
              </div>
              <div>
                <span className="text-xs font-bold text-[#5A6B82]">Escrow Status:</span>
                <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {selectedOrder.paymentStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white">
                <p className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
                  Manufacturer Seller
                </p>
                <h4 className="text-sm font-bold text-[#0B1F3A] mt-1">{selectedOrder.manufacturer}</h4>
                <p className="text-xs text-[#5A6B82] mt-1">Dispatch Yard: {selectedOrder.dispatchHub}</p>
              </div>

              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white">
                <p className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
                  Distributor Buyer
                </p>
                <h4 className="text-sm font-bold text-[#0B1F3A] mt-1">{selectedOrder.distributor}</h4>
                <p className="text-xs text-[#5A6B82] mt-1">
                  Est. Delivery: {selectedOrder.estimatedDelivery}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white sm:col-span-2">
                <p className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
                  Consignment & Tracking
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-[#5A6B82]">Product: </span>
                    <span className="text-xs font-bold text-[#0B1F3A]">{selectedOrder.product}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#5A6B82]">Volume: </span>
                    <span className="text-xs font-extrabold text-[#0B1F3A]">
                      {selectedOrder.quantity}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[#5A6B82]">Logistics Waybill:</span>
                  <span className="font-mono-code font-bold text-[#0B1F3A]">
                    {selectedOrder.trackingNumber}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-xs font-bold text-[#0B1F3A] hover:bg-[#F4F7FC] rounded-xl border border-[#E2E8F0]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
