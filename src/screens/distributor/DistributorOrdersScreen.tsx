import React, { useState } from 'react';
import {
  Search,
  Truck,
  Download,
  MapPin,
  CheckCircle2,
  X,
  FileText,
  ShieldCheck,
  PackageCheck,
  AlertCircle,
  ExternalLink,
  Navigation,
  Clock,
  Building2,
} from 'lucide-react';
import { Order } from '../../types';

interface DistributorOrdersScreenProps {
  orders?: Order[];
  onConfirmDelivery?: (orderId: string) => void;
  onNavigate?: (screen: string) => void;
}

// Default orders matching the exact design reference from the screenshot
const DEFAULT_DISTRIBUTOR_ORDERS: Partial<Order>[] = [
  {
    id: 'PO-2026-88291',
    createdDate: '28 Aug 2026',
    product: 'AeroSeal 4-Piece Airtight Modular Storage Set',
    productName: 'AeroSeal 4-Piece Airtight Modular Storage Set',
    category: 'Storage Containers',
    manufacturer: 'Nilkamal Moldings & Logistics Ltd',
    dispatchHub: 'Bhiwandi Central Fulfillment Hub',
    quantity: '2,500 Units',
    amount: 412500,
    unitPricePerKg: 165,
    orderStatus: 'In Transit',
    paymentStatus: 'Escrow Held',
    trackingNumber: 'LR-BHW-882910',
    estimatedDelivery: 'Tomorrow, 03:30 PM',
  },
  {
    id: 'PO-2026-88240',
    createdDate: '25 Aug 2026',
    product: 'ThermaLock 3-Container Insulated Lunch Box',
    productName: 'ThermaLock 3-Container Insulated Lunch Box',
    category: 'Lunch Boxes',
    manufacturer: 'Milton Housewares & Appliances',
    dispatchHub: 'Bhiwandi Central Fulfillment Hub',
    quantity: '1,800 Units',
    amount: 864000,
    unitPricePerKg: 480,
    orderStatus: 'Dispatched',
    paymentStatus: 'Escrow Held',
    trackingNumber: 'LR-BHW-882400',
    estimatedDelivery: '03 Sep 2026',
  },
  {
    id: 'PO-2026-88195',
    createdDate: '20 Aug 2026',
    product: 'DuraCrate Heavy-Duty Industrial Stacking Crate',
    productName: 'DuraCrate Heavy-Duty Industrial Stacking Crate',
    category: 'Storage Containers',
    manufacturer: 'Supreme Industries Polymer Works',
    dispatchHub: 'Bhiwandi Central Fulfillment Hub',
    quantity: '1,200 Units',
    amount: 504000,
    unitPricePerKg: 420,
    orderStatus: 'Delivered',
    paymentStatus: 'Paid to MFR',
    trackingNumber: 'LR-BHW-881950',
    estimatedDelivery: 'Delivered on 24 Aug',
  },
  {
    id: 'PO-2026-88090',
    createdDate: '18 Aug 2026',
    product: 'ChefPro 3-Tier Revolving Spice Tower',
    productName: 'ChefPro 3-Tier Revolving Spice Tower',
    category: 'Kitchenware',
    manufacturer: 'Cello World Plastics LLP',
    dispatchHub: 'Pune Central Stockyard',
    quantity: '2,000 Units',
    amount: 570000,
    unitPricePerKg: 285,
    orderStatus: 'Confirmed',
    paymentStatus: 'Escrow Held',
    trackingNumber: 'LR-PUN-880900',
    estimatedDelivery: '05 Sep 2026',
  },
];

export const DistributorOrdersScreen: React.FC<DistributorOrdersScreenProps> = ({
  orders = [],
  onConfirmDelivery = (_orderId: string) => {},
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [trackingOrder, setTrackingOrder] = useState<any | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<any | null>(null);
  const [deliveryConfirmOrder, setDeliveryConfirmOrder] = useState<any | null>(null);
  const [qcCheckVerified, setQcCheckVerified] = useState(false);
  const [invoiceToast, setInvoiceToast] = useState<string | null>(null);

  // Merge provided orders or use enriched defaults if empty
  const activeOrdersList = orders.length > 0 ? orders : (DEFAULT_DISTRIBUTOR_ORDERS as Order[]);

  // Format currency in Indian Rupees
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  // Helper to derive SKU
  const getSku = (ord: any) => {
    if (ord.sku) return ord.sku;
    const name = ord.productName || ord.product || 'PRD';
    if (name.includes('AeroSeal')) return 'STR-MOD-1200-4P';
    if (name.includes('ThermaLock')) return 'LNC-TH-3C';
    if (name.includes('DuraCrate')) return 'IND-CRT-6040';
    if (name.includes('ChefPro')) return 'KTN-SP-3TR';
    return `PLAST-${ord.id?.replace(/[^0-9]/g, '')?.slice(-4) || '8820'}`;
  };

  // Helper to derive unit price display
  const getUnitPriceText = (ord: any) => {
    if (ord.unitPricePerKg) {
      return `(₹${ord.unitPricePerKg}/u)`;
    }
    const qtyNum = parseInt(String(ord.quantity || '1').replace(/[^0-9]/g, ''), 10) || 1;
    const pricePerUnit = Math.round((ord.amount || 100000) / qtyNum);
    return `(₹${pricePerUnit}/u)`;
  };

  // Helper to get formatted status date/subtext
  const getStatusSubtext = (ord: any) => {
    if (ord.estimatedDelivery) {
      return ord.estimatedDelivery;
    }
    if (ord.orderStatus === 'In Transit') return 'Tomorrow, 03:30 PM';
    if (ord.orderStatus === 'Dispatched') return '03 Sep 2026';
    if (ord.orderStatus === 'Delivered' || ord.orderStatus === 'Completed') return 'Delivered on 24 Aug';
    if (ord.orderStatus === 'Confirmed') return '05 Sep 2026';
    return ord.createdDate || 'Pending';
  };

  // Status badge styling matching the reference design
  const renderStatusBadge = (ord: any) => {
    const status = ord.orderStatus;
    const subtext = getStatusSubtext(ord);

    if (status === 'In Transit') {
      return (
        <div>
          <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 inline-block">
            In Transit
          </span>
          <div className="text-xs text-slate-500 mt-1 font-medium">{subtext}</div>
        </div>
      );
    }

    if (status === 'Dispatched') {
      return (
        <div>
          <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 inline-block">
            Dispatched
          </span>
          <div className="text-xs text-slate-500 mt-1 font-medium">{subtext}</div>
        </div>
      );
    }

    if (status === 'Delivered' || status === 'Completed') {
      return (
        <div>
          <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 inline-block">
            Delivered
          </span>
          <div className="text-xs text-slate-500 mt-1 font-medium">{subtext}</div>
        </div>
      );
    }

    // Default / Confirmed / Processing
    return (
      <div>
        <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-600 border border-purple-200 inline-block">
          {status || 'Confirmed'}
        </span>
        <div className="text-xs text-slate-500 mt-1 font-medium">{subtext}</div>
      </div>
    );
  };

  // Filtered orders
  const filteredOrders = activeOrdersList.filter((ord: any) => {
    const query = (searchQuery || '').toLowerCase().trim();
    if (!query) return true;
    return (
      (ord.id && ord.id.toLowerCase().includes(query)) ||
      (ord.product && ord.product.toLowerCase().includes(query)) ||
      (ord.productName && ord.productName.toLowerCase().includes(query)) ||
      (ord.manufacturer && ord.manufacturer.toLowerCase().includes(query)) ||
      (ord.manufacturerName && ord.manufacturerName.toLowerCase().includes(query)) ||
      (ord.category && ord.category.toLowerCase().includes(query)) ||
      (ord.dispatchHub && ord.dispatchHub.toLowerCase().includes(query)) ||
      (ord.trackingNumber && ord.trackingNumber.toLowerCase().includes(query))
    );
  });

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryConfirmOrder) return;
    onConfirmDelivery(deliveryConfirmOrder.id);
    setDeliveryConfirmOrder(null);
    setQcCheckVerified(false);
  };

  const handleDownloadInvoice = (ord: any) => {
    setInvoiceOrder(ord);
  };

  const triggerDownloadAction = () => {
    setInvoiceToast(`Invoice for ${invoiceOrder?.id || 'PO'} downloaded successfully.`);
    setTimeout(() => {
      setInvoiceToast(null);
      setInvoiceOrder(null);
    }, 1800);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Toast Notification */}
      {invoiceToast && (
        <div className="fixed bottom-6 right-6 bg-[#115E59] text-white px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 border border-teal-700 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold">{invoiceToast}</span>
        </div>
      )}

      {/* Header Container matching screenshot */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 uppercase tracking-wider">
              CONTRACTED ORDERS
            </span>
            <span className="text-xs font-medium text-slate-500">
              • {filteredOrders.length} Total Sourcing Orders
            </span>
          </div>
          <h1 className="text-2xl md:text-[26px] font-bold text-[#1E293B] mt-2 tracking-tight">
            Purchase Orders & Consignments
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Manage official B2B purchase orders, tax invoices, and live logistics manifests
          </p>
        </div>

        {/* Right Search Input Box matching screenshot */}
        <div className="w-full md:w-80">
          <div className="relative flex items-center bg-[#F8FAFC] border border-slate-200/90 rounded-xl px-3.5 py-2.5 shadow-2xs focus-within:border-teal-500 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PO, product or maker..."
              className="bg-transparent text-xs text-[#1E293B] placeholder-slate-400 focus:outline-none w-full font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Card Container matching screenshot */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#F8FAFC]/90 border-b border-slate-200/90 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">PO NUMBER & DATE</th>
                <th className="py-4 px-6 font-semibold">PRODUCT & CATEGORY</th>
                <th className="py-4 px-6 font-semibold">MANUFACTURER</th>
                <th className="py-4 px-6 font-semibold">QUANTITY & VALUE</th>
                <th className="py-4 px-6 font-semibold">STATUS</th>
                <th className="py-4 px-6 font-semibold text-right md:text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-[#1E293B]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <p className="font-semibold text-sm">No purchase orders found matching your search.</p>
                    <p className="text-xs text-slate-400 mt-1">Try searching with a different PO number, product name, or maker.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord: any) => {
                  const poNumber = ord.id?.startsWith('PO-') ? ord.id : `PO-${ord.id?.replace('ORD-', '') || '2026-88291'}`;
                  const orderDate = ord.createdDate || '28 Aug 2026';
                  const productName = ord.productName || ord.product || 'AeroSeal 4-Piece Modular Storage Set';
                  const categoryName = ord.category || 'Storage Containers';
                  const sku = getSku(ord);
                  const manufacturerName = ord.manufacturer || ord.manufacturerName || 'Nilkamal Moldings & Logistics Ltd';
                  const hubLocation = ord.dispatchHub || 'Bhiwandi Central Fulfillment Hub';
                  const quantity = ord.quantity || '2,500 Units';
                  const totalValue = formatINR(ord.amount || 412500);
                  const unitPrice = getUnitPriceText(ord);

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* 1. PO NUMBER & DATE */}
                      <td className="py-4 px-6 align-top">
                        <div className="font-bold text-[#1E293B] text-xs md:text-sm font-mono tracking-tight">
                          {poNumber}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">{orderDate}</div>
                      </td>

                      {/* 2. PRODUCT & CATEGORY */}
                      <td className="py-4 px-6 align-top max-w-xs">
                        <div className="font-bold text-[#1E293B] text-xs md:text-sm leading-snug">
                          {productName}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {categoryName} • SKU: {sku}
                        </div>
                      </td>

                      {/* 3. MANUFACTURER */}
                      <td className="py-4 px-6 align-top">
                        <div className="font-bold text-[#1E293B] text-xs md:text-sm">
                          {manufacturerName}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{hubLocation}</span>
                        </div>
                      </td>

                      {/* 4. QUANTITY & VALUE */}
                      <td className="py-4 px-6 align-top whitespace-nowrap">
                        <div className="font-bold text-[#1E293B] text-xs md:text-sm">
                          {quantity}
                        </div>
                        <div className="text-xs font-bold text-teal-700 mt-1">
                          {totalValue}{' '}
                          <span className="font-semibold text-teal-800/90">{unitPrice}</span>
                        </div>
                      </td>

                      {/* 5. STATUS */}
                      <td className="py-4 px-6 align-top whitespace-nowrap">
                        {renderStatusBadge(ord)}
                      </td>

                      {/* 6. ACTIONS */}
                      <td className="py-4 px-6 align-top text-right md:text-center whitespace-nowrap">
                        <div className="flex items-center justify-end md:justify-center gap-2">
                          {/* Track Button */}
                          <button
                            type="button"
                            onClick={() => setTrackingOrder(ord)}
                            className="bg-[#0F766E] hover:bg-[#0D9488] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track</span>
                          </button>

                          {/* Download Invoice Button */}
                          <button
                            type="button"
                            onClick={() => handleDownloadInvoice(ord)}
                            title="Download Tax Invoice"
                            className="border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 hover:text-[#1E293B] p-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center shadow-2xs active:scale-95"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LIVE DISPATCH TRACKING MODAL */}
      {trackingOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#5A6B82] bg-[#F4F7FC] px-2 py-0.5 rounded border border-[#E2E8F0]">
                    {trackingOrder.id?.startsWith('PO-') ? trackingOrder.id : `PO-${trackingOrder.id}`}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      trackingOrder.orderStatus === 'Delivered'
                        ? 'bg-teal-100 text-teal-800'
                        : trackingOrder.orderStatus === 'In Transit'
                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {trackingOrder.orderStatus || 'In Transit'}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-[#1E293B]">
                  Consignment & Dispatch Tracking
                </h3>
                <p className="text-xs text-[#5A6B82] font-semibold">
                  {trackingOrder.productName || trackingOrder.product} ({trackingOrder.quantity})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTrackingOrder(null)}
                className="p-2 rounded-xl text-[#5A6B82] hover:bg-[#F4F7FC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Transporter Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#5A6B82] uppercase">Logistics Transporter</span>
                <p className="font-bold text-[#1E293B] mt-0.5">Gujarat Saurashtra Roadways</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#5A6B82] uppercase">LR / B/L Number</span>
                <p className="font-mono font-bold text-[#1E293B] mt-0.5">
                  {trackingOrder.trackingNumber || 'LR-BHW-882910'}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#5A6B82] uppercase">Truck Reg No & Driver</span>
                <p className="font-bold text-[#1E293B] mt-0.5">GJ-15-BT-4910 (Mansukhbhai)</p>
              </div>
            </div>

            {/* Step Milestones */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
                Consignment Timeline Milestones
              </h4>

              <div className="relative pl-6 space-y-6 border-l-2 border-[#E2E8F0] ml-3">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-teal-500 border-2 border-white shadow-xs" />
                  <p className="text-xs font-bold text-[#1E293B]">Purchase Order Confirmed & Escrow Secured</p>
                  <p className="text-[11px] text-[#5A6B82]">{trackingOrder.createdDate || '28 Aug 2026'} • Full Escrow deposited in secure holding account</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-teal-500 border-2 border-white shadow-xs" />
                  <p className="text-xs font-bold text-[#1E293B]">Plant Quality Lab QC Inspection Passed (COA)</p>
                  <p className="text-[11px] text-[#5A6B82]">Batch verified against ISO & BIS technical standards</p>
                </div>

                <div className="relative">
                  <div
                    className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white shadow-xs ${
                      trackingOrder.orderStatus === 'Delivered'
                        ? 'bg-teal-500'
                        : 'bg-teal-600 animate-pulse'
                    }`}
                  />
                  <p className="text-xs font-bold text-[#1E293B]">Dispatched from {trackingOrder.dispatchHub || 'Central Hub'}</p>
                  <p className="text-[11px] text-[#5A6B82]">E-Way Bill generated • Toll Pass Live</p>
                </div>

                <div className="relative">
                  <div
                    className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white ${
                      trackingOrder.orderStatus === 'Delivered' ? 'bg-teal-500' : 'bg-slate-300'
                    }`}
                  />
                  <p
                    className={`text-xs font-bold ${
                      trackingOrder.orderStatus === 'Delivered' ? 'text-teal-700' : 'text-[#5A6B82]'
                    }`}
                  >
                    {trackingOrder.orderStatus === 'Delivered' ? 'Delivered & Accepted' : 'Inbound Arrival & Warehouse Signoff'}
                  </p>
                  <p className="text-[11px] text-[#5A6B82]">Status: {getStatusSubtext(trackingOrder)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E2E8F0]">
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => {
                    setTrackingOrder(null);
                    onNavigate('dst_tracking');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border border-teal-200"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Open Full Fleet GPS Map</span>
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                {trackingOrder.orderStatus !== 'Delivered' && (
                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryConfirmOrder(trackingOrder);
                      setTrackingOrder(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span>Confirm Receipt & QC</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setTrackingOrder(null)}
                  className="px-4 py-2 rounded-xl bg-[#F4F7FC] text-[#1E293B] text-xs font-bold hover:bg-[#E2E8F0] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELIVERY & RELEASE ESCROW MODAL */}
      {deliveryConfirmOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 uppercase">
                  Consignment QC Confirmation
                </span>
                <h3 className="text-lg font-extrabold text-[#1E293B] mt-1">
                  Confirm Delivery & Release Escrow
                </h3>
                <p className="text-xs text-[#5A6B82] font-semibold">
                  PO: {deliveryConfirmOrder.id} — {deliveryConfirmOrder.productName || deliveryConfirmOrder.product}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeliveryConfirmOrder(null)}
                className="p-2 rounded-xl text-[#5A6B82] hover:bg-[#F4F7FC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeliverySubmit} className="space-y-4 text-xs">
              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#5A6B82]">Manufacturer Plant:</span>
                  <span className="font-bold text-[#1E293B]">{deliveryConfirmOrder.manufacturer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A6B82]">Delivered Quantity:</span>
                  <span className="font-bold text-[#1E293B]">{deliveryConfirmOrder.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A6B82]">Escrow Release Amount:</span>
                  <span className="font-extrabold text-sm text-teal-700">
                    {formatINR(deliveryConfirmOrder.amount)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-teal-50/50 border border-teal-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={qcCheckVerified}
                    onChange={(e) => setQcCheckVerified(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <div className="text-[11px] leading-relaxed text-[#1E293B]">
                    <strong>I confirm consignment receipt & inspection:</strong> Items have arrived at our warehouse, packages are sealed, tare counts verified, and goods match the purchase contract.
                  </div>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setDeliveryConfirmOrder(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#F4F7FC] text-[#1E293B] text-xs font-bold hover:bg-[#E2E8F0] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!qcCheckVerified}
                  className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2 ${
                    qcCheckVerified ? 'bg-[#0F766E] hover:bg-[#0D9488]' : 'bg-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize Escrow Settlement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAX INVOICE PREVIEW MODAL */}
      {invoiceOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 uppercase">
                  GST Tax Invoice
                </span>
                <h3 className="text-lg font-extrabold text-[#1E293B] mt-1">
                  Tax Invoice: INV-{invoiceOrder.id?.replace(/[^0-9]/g, '') || '88291'}
                </h3>
                <p className="text-xs text-[#5A6B82] font-semibold">
                  Date: {invoiceOrder.createdDate || '28 Aug 2026'} • GSTIN: 27AAACN1029B1Z8
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInvoiceOrder(null)}
                className="p-2 rounded-xl text-[#5A6B82] hover:bg-[#F4F7FC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                <div>
                  <span className="text-[10px] font-bold text-[#5A6B82] uppercase">Supplier / Manufacturer</span>
                  <p className="font-extrabold text-[#1E293B] mt-0.5">
                    {invoiceOrder.manufacturer || 'Nilkamal Moldings & Logistics Ltd'}
                  </p>
                  <p className="text-[11px] text-[#5A6B82]">{invoiceOrder.dispatchHub || 'Bhiwandi Central Fulfillment Hub'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#5A6B82] uppercase">Buyer / Distributor</span>
                  <p className="font-extrabold text-[#1E293B] mt-0.5">Apex Polymers & Distributors LLP</p>
                  <p className="text-[11px] text-[#5A6B82]">GSTIN: 24ABFPS1092M1ZK</p>
                </div>
              </div>

              <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-bold text-[#5A6B82] uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Item Description</th>
                      <th className="py-2.5 px-4">HSN Code</th>
                      <th className="py-2.5 px-4">Qty</th>
                      <th className="py-2.5 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    <tr>
                      <td className="py-3 px-4 font-bold text-[#1E293B]">
                        {invoiceOrder.productName || invoiceOrder.product}
                        <div className="text-[10px] text-slate-500 font-normal">SKU: {getSku(invoiceOrder)}</div>
                      </td>
                      <td className="py-3 px-4 font-mono">39241000</td>
                      <td className="py-3 px-4">{invoiceOrder.quantity}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        {formatINR((invoiceOrder.amount || 412500) / 1.18)}
                      </td>
                    </tr>
                    <tr className="bg-[#F8FAFC]">
                      <td colSpan={3} className="py-2 px-4 text-right font-semibold text-[#5A6B82]">
                        18% GST (CGST 9% + SGST 9%):
                      </td>
                      <td className="py-2 px-4 text-right font-mono font-bold">
                        {formatINR((invoiceOrder.amount || 412500) - (invoiceOrder.amount || 412500) / 1.18)}
                      </td>
                    </tr>
                    <tr className="bg-[#F8FAFC] font-extrabold text-sm text-[#1E293B]">
                      <td colSpan={3} className="py-3 px-4 text-right">
                        Total Invoice Payable:
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-teal-700">
                        {formatINR(invoiceOrder.amount || 412500)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setInvoiceOrder(null)}
                className="px-4 py-2 rounded-xl bg-[#F4F7FC] text-[#1E293B] text-xs font-bold hover:bg-[#E2E8F0] transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={triggerDownloadAction}
                className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Tax Invoice (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
