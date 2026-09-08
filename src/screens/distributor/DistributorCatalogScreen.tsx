import React, { useState } from 'react';
import {
  Search,
  Filter,
  Package,
  Layers,
  Building2,
  FileQuestion,
  ShoppingCart,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Info,
  X,
  FileText,
  SlidersHorizontal,
  ArrowRight,
  ExternalLink,
  Sparkles,
  MapPin,
  Check,
} from 'lucide-react';
import { Product, Category, Rfq, Order } from '../../types';

interface DistributorCatalogScreenProps {
  products?: Product[];
  categories?: Category[];
  onRequestRfq?: (product?: Product) => void;
  onInstantOrder?: (orderData: Partial<Order>) => void;
  onPlaceOrder?: (orderData: Partial<Order>) => void;
  addresses?: any[];
  onNavigate?: (screen: string) => void;
}

export const DistributorCatalogScreen: React.FC<DistributorCatalogScreenProps> = ({
  products = [],
  categories = [],
  onRequestRfq = (_product?: Product) => {},
  onInstantOrder,
  onPlaceOrder,
  addresses = [],
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceSort, setPriceSort] = useState<'default' | 'asc' | 'desc'>('default');

  // Modal States
  const [tdsModalProduct, setTdsModalProduct] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [checkoutQuantityMt, setCheckoutQuantityMt] = useState<number>(5);
  const [checkoutFreight, setCheckoutFreight] = useState<'Ex-Factory' | 'FOR Destination'>('FOR Destination');
  const [checkoutDeliveryLoc, setCheckoutDeliveryLoc] = useState('Sanand GIDC Phase 2, Ahmedabad');

  // Filter products
  const filteredProducts = (products || []).filter((p) => {
    const matchesCategory =
      !selectedCategory ||
      selectedCategory === 'All' ||
      ((p.category || '').toLowerCase() === (selectedCategory || '').toLowerCase());
    const query = (searchQuery || '').toLowerCase().trim();
    const matchesSearch =
      !query ||
      (p.productName && p.productName.toLowerCase().includes(query)) ||
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.polymerGrade && p.polymerGrade.toLowerCase().includes(query)) ||
      (p.manufacturerName && p.manufacturerName.toLowerCase().includes(query)) ||
      (p.id && p.id.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (priceSort === 'asc') return (a.pricePerKg || 0) - (b.pricePerKg || 0);
    if (priceSort === 'desc') return (b.pricePerKg || 0) - (a.pricePerKg || 0);
    return 0;
  });

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutProduct) return;

    const baseAmount = checkoutQuantityMt * 1000 * (checkoutProduct.pricePerKg || 100);
    const freightAmount = checkoutFreight === 'FOR Destination' ? checkoutQuantityMt * 1000 * 2.5 : 0;
    const subtotal = baseAmount + freightAmount;
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    const newOrder: Partial<Order> = {
      id: `ORD-GJ-${Math.floor(7000 + Math.random() * 900)}`,
      manufacturer: checkoutProduct.manufacturerName || 'Gujarat Polymer Extrusions',
      distributor: 'Shreeji Polymer Distribution Ahmedabad',
      product: `${checkoutProduct.productName || checkoutProduct.name} (${checkoutProduct.polymerGrade || 'Virgin'})`,
      productName: checkoutProduct.productName || checkoutProduct.name,
      polymerGrade: checkoutProduct.polymerGrade || 'Virgin Grade',
      quantity: `${checkoutQuantityMt} Metric Tons (MT)`,
      amount: total,
      totalAmount: total,
      unitPricePerKg: checkoutProduct.pricePerKg,
      orderStatus: 'Confirmed',
      createdDate: new Date().toISOString().split('T')[0],
      dispatchHub: checkoutFreight === 'FOR Destination' ? 'Sanand Logistics Depot' : 'Morbi Plant Gate',
      paymentStatus: 'Escrow Held',
      trackingNumber: `TRK-GJ-${Math.floor(880000 + Math.random() * 9000)}`,
      estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      escrowLocked: true,
      coaVerified: true,
    };

    if (onInstantOrder) {
      onInstantOrder(newOrder);
    } else if (onPlaceOrder) {
      onPlaceOrder(newOrder);
    }
    setCheckoutProduct(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Polymer Resin Marketplace Catalog
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
              Verified Gujarat Plants
            </span>
          </div>
          <p className="text-xs text-[#5A6B82] font-medium">
            Browse virgin polymers, masterbatches, and engineering resins with live factory pricing & escrow protection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#5A6B82]">
            Showing <span className="text-slate-900 font-extrabold">{sortedProducts.length}</span> verified SKUs
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#5A6B82] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search polymer grade, MFI, application, or plant name..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-900 placeholder-[#5A6B82] focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5A6B82] hover:text-slate-900"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2">
            <select
              value={priceSort}
              onChange={(e: any) => setPriceSort(e.target.value)}
              className="px-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0F766E] cursor-pointer"
            >
              <option value="default">Sort by: Default Featured</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-[#0F766E] text-white shadow-xs'
                : 'bg-[#F4F7FC] text-[#5A6B82] hover:text-slate-900 hover:bg-[#E2E8F0]'
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                (selectedCategory || '').toLowerCase() === (cat.name || '').toLowerCase()
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'bg-[#F4F7FC] text-[#5A6B82] hover:text-slate-900 hover:bg-[#E2E8F0]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedProducts.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            <div>
              {/* Card Header & Badges */}
              <div className="p-5 border-b border-[#E2E8F0] bg-gradient-to-b from-[#F8FAFC] to-white">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-[11px] font-bold text-[#5A6B82] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                    {prod.id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-teal-100 text-teal-800 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      BIS Certified
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-100 text-blue-800">
                      In Stock
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  {prod.productName}
                </h3>
                <p className="text-xs font-bold text-teal-700 mt-1">
                  Grade: {prod.polymerGrade || 'Virgin Industrial'}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-[#5A6B82] mt-2 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-[#5A6B82] shrink-0" />
                  <span className="truncate">{prod.manufacturerName || 'Certified Gujarat Plant'}</span>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                  <div>
                    <span className="text-[10px] font-bold text-[#5A6B82] uppercase">Melt Flow (MFI)</span>
                    <p className="font-extrabold text-slate-900">{prod.mfi || '0.35 g/10min'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#5A6B82] uppercase">Resin Density</span>
                    <p className="font-extrabold text-slate-900">{prod.density || '0.956 g/cm³'}</p>
                  </div>
                  <div className="pt-2 border-t border-[#E2E8F0]/60">
                    <span className="text-[10px] font-bold text-[#5A6B82] uppercase">Min Order (MOQ)</span>
                    <p className="font-bold text-slate-900">{prod.minOrderQuantity || '5 MT'}</p>
                  </div>
                  <div className="pt-2 border-t border-[#E2E8F0]/60">
                    <span className="text-[10px] font-bold text-[#5A6B82] uppercase">HSN Code</span>
                    <p className="font-mono font-bold text-slate-900">{prod.hsnCode || '39012000'}</p>
                  </div>
                </div>

                {prod.description && (
                  <p className="text-xs text-[#5A6B82] line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                )}
              </div>
            </div>

            {/* Pricing & Actions Footer */}
            <div className="p-5 border-t border-[#E2E8F0] bg-[#F8FAFC]">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider">
                    Factory Benchmark Rate
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">₹{prod.pricePerKg}</span>
                    <span className="text-xs font-bold text-[#5A6B82]">/ Kg + GST</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setTdsModalProduct(prod)}
                  className="text-xs font-bold text-[#0F766E] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View TDS</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onRequestRfq(prod)}
                  className="py-2.5 px-3 rounded-xl bg-white border border-[#0F766E] text-[#0F766E] hover:bg-teal-50 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <FileQuestion className="w-3.5 h-3.5 text-teal-600" />
                  <span>Request RFQ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCheckoutProduct(prod)}
                  className="py-2.5 px-3 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Buy via Escrow</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TECHNICAL DATA SHEET (TDS) MODAL */}
      {tdsModalProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#5A6B82] bg-[#F4F7FC] px-2 py-0.5 rounded border border-[#E2E8F0]">
                    {tdsModalProduct.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                    ASTM D1238 / BIS Standard
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Technical Data Sheet (TDS)
                </h3>
                <p className="text-xs text-[#5A6B82] font-semibold mt-0.5">
                  {tdsModalProduct.productName} — Grade: {tdsModalProduct.polymerGrade}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTdsModalProduct(null)}
                className="p-2 rounded-xl text-[#5A6B82] hover:bg-[#F4F7FC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                  Polymer Physical & Rheological Properties
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-[#E2E8F0]">
                  <div>
                    <span className="text-[#5A6B82]">Melt Flow Rate (190°C/2.16kg):</span>
                    <p className="font-bold text-slate-900">{tdsModalProduct.mfi || '0.35 g/10min'}</p>
                  </div>
                  <div>
                    <span className="text-[#5A6B82]">Mass Density:</span>
                    <p className="font-bold text-slate-900">{tdsModalProduct.density || '0.956 g/cm³'}</p>
                  </div>
                  <div>
                    <span className="text-[#5A6B82]">Tensile Strength at Yield:</span>
                    <p className="font-bold text-slate-900">28 MPa (ASTM D638)</p>
                  </div>
                  <div>
                    <span className="text-[#5A6B82]">Elongation at Break:</span>
                    <p className="font-bold text-slate-900">&gt; 600%</p>
                  </div>
                  <div>
                    <span className="text-[#5A6B82]">Vicat Softening Point:</span>
                    <p className="font-bold text-slate-900">126 °C (ASTM D1525)</p>
                  </div>
                  <div>
                    <span className="text-[#5A6B82]">Environmental Stress Crack (ESCR):</span>
                    <p className="font-bold text-slate-900">F50 &gt; 1000 hrs</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
                  Recommended Processing & Applications
                </h4>
                <p className="text-xs text-[#5A6B82] leading-relaxed">
                  Suitable for high-speed continuous extrusion blow moulding machines, industrial Jerry cans, chemical storage containers, and agricultural pesticide bottles.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed font-medium">
                  <strong>Lab Quality Assurance:</strong> Every consignment dispatched via PlastoShip includes an authorized Certificate of Analysis (COA) matching this TDS batch parameter report.
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setTdsModalProduct(null)}
                className="px-4 py-2 rounded-xl bg-[#F4F7FC] text-slate-700 text-xs font-bold hover:bg-[#E2E8F0] transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const p = tdsModalProduct;
                  setTdsModalProduct(null);
                  onRequestRfq(p);
                }}
                className="px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-bold hover:bg-[#115E59] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <FileQuestion className="w-3.5 h-3.5" />
                <span>Create RFQ with this TDS</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIRECT ESCROW CHECKOUT MODAL */}
      {checkoutProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 uppercase">
                  100% Escrow Protected Order
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  Place Direct Purchase Order
                </h3>
                <p className="text-xs text-[#5A6B82] font-semibold">
                  {checkoutProduct.productName} ({checkoutProduct.polymerGrade})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutProduct(null)}
                className="p-2 rounded-xl text-[#5A6B82] hover:bg-[#F4F7FC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                  Order Quantity (Metric Tons)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={checkoutQuantityMt}
                    onChange={(e) => setCheckoutQuantityMt(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-32 px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0F766E]"
                  />
                  <span className="text-xs font-bold text-[#5A6B82]">
                    = {(checkoutQuantityMt * 1000).toLocaleString('en-IN')} Kilograms
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                  Freight Delivery Terms
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutFreight('FOR Destination')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      checkoutFreight === 'FOR Destination'
                        ? 'border-[#0F766E] bg-teal-50/50 font-bold text-teal-900'
                        : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#5A6B82]'
                    }`}
                  >
                    <p className="font-extrabold text-xs text-slate-900">FOR Destination</p>
                    <p className="text-[11px] text-[#5A6B82] mt-0.5">Delivered to your Ahmedabad warehouse</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCheckoutFreight('Ex-Factory')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      checkoutFreight === 'Ex-Factory'
                        ? 'border-[#0F766E] bg-teal-50/50 font-bold text-teal-900'
                        : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#5A6B82]'
                    }`}
                  >
                    <p className="font-extrabold text-xs text-slate-900">Ex-Factory</p>
                    <p className="text-[11px] text-[#5A6B82] mt-0.5">Buyer arranges transport from Morbi plant</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wider">
                  Delivery Destination Address
                </label>
                <input
                  type="text"
                  value={checkoutDeliveryLoc}
                  onChange={(e) => setCheckoutDeliveryLoc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              {/* Price Calculation Card */}
              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-2 text-xs">
                <div className="flex justify-between text-[#5A6B82]">
                  <span>Resin Base Price ({(checkoutQuantityMt * 1000).toLocaleString()} Kg @ ₹{checkoutProduct.pricePerKg}/Kg):</span>
                  <span className="font-semibold text-slate-900">{formatINR(checkoutQuantityMt * 1000 * checkoutProduct.pricePerKg)}</span>
                </div>
                <div className="flex justify-between text-[#5A6B82]">
                  <span>Estimated Freight ({checkoutFreight}):</span>
                  <span className="font-semibold text-slate-900">
                    {checkoutFreight === 'FOR Destination' ? formatINR(checkoutQuantityMt * 1000 * 2.5) : '₹0.00 (Ex-Factory)'}
                  </span>
                </div>
                <div className="flex justify-between text-[#5A6B82]">
                  <span>GST (18% IGST / CGST+SGST):</span>
                  <span className="font-semibold text-slate-900">
                    {formatINR(
                      (checkoutQuantityMt * 1000 * checkoutProduct.pricePerKg +
                        (checkoutFreight === 'FOR Destination' ? checkoutQuantityMt * 1000 * 2.5 : 0)) *
                        0.18
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#E2E8F0] flex justify-between font-extrabold text-sm text-slate-900">
                  <span>Total Escrow Commitment:</span>
                  <span className="text-teal-700">
                    {formatINR(
                      (checkoutQuantityMt * 1000 * checkoutProduct.pricePerKg +
                        (checkoutFreight === 'FOR Destination' ? checkoutQuantityMt * 1000 * 2.5 : 0)) *
                        1.18
                    )}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-[11px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Funds will be placed into PlastoShip Escrow and released only after delivery confirmation.</span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setCheckoutProduct(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#F4F7FC] text-slate-700 text-xs font-bold hover:bg-[#E2E8F0] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Confirm Escrow Order</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
