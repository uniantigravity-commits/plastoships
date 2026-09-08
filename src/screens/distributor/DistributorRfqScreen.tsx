import React, { useState, useMemo } from 'react';
import {
  FileQuestion,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  IndianRupee,
  ShieldCheck,
  ChevronRight,
  X,
  FileText,
  AlertCircle,
  Truck,
  ArrowRight,
  Layers,
  Send,
  Sparkles,
  Star,
  Check,
  Scale,
  ArrowLeft,
  Info,
  Package,
  CheckCircle,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { Rfq, Category, ManufacturerQuotation, Order } from '../../types';

interface DistributorRfqScreenProps {
  rfqs?: Rfq[];
  quotations?: ManufacturerQuotation[];
  categories?: Category[];
  onCreateRfq?: (rfqData: Partial<Rfq>) => void;
  onAcceptQuote?: (quote: any, rfq?: any) => void;
  onDeclineQuote?: (quoteId: string, reason?: string) => void;
  onNegotiateQuote?: (quoteId: string, counterPrice: number) => void;
  activeInitialNewRfqModal?: boolean;
  initialOpenCreateModal?: boolean;
  onCloseCreateModal?: () => void;
  onNavigateToOrders?: () => void;
}

export const DistributorRfqScreen: React.FC<DistributorRfqScreenProps> = ({
  rfqs = [],
  quotations = [],
  categories = [],
  onCreateRfq = (_rfqData?: Partial<Rfq>) => {},
  onAcceptQuote = (_quote?: any, _rfq?: any) => {},
  onDeclineQuote = (_quoteId?: string, _reason?: string) => {},
  onNegotiateQuote = (_quoteId?: string, _counterPrice?: number) => {},
  activeInitialNewRfqModal = false,
  initialOpenCreateModal = false,
  onCloseCreateModal,
  onNavigateToOrders,
}) => {
  // Tab filter: ALL | Open for Bids | Quotes Available | Finalized
  const [activeTab, setActiveTab] = useState<'ALL' | 'Open for Bids' | 'Quotes Available' | 'Finalized'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // View mode: 'list' (all RFQs) or 'comparison' (viewing quotes for a specific RFQ)
  const [selectedRfqForQuotes, setSelectedRfqForQuotes] = useState<Rfq | null>(null);

  // Modals state
  const [isNewRfqModalOpen, setIsNewRfqModalOpen] = useState(activeInitialNewRfqModal || initialOpenCreateModal);
  const [selectedQuoteForAccept, setSelectedQuoteForAccept] = useState<ManufacturerQuotation | null>(null);
  const [selectedQuoteForDecline, setSelectedQuoteForDecline] = useState<ManufacturerQuotation | null>(null);
  const [declineReason, setDeclineReason] = useState('Quoted price exceeds target procurement budget');
  const [customDeclineReason, setCustomDeclineReason] = useState('');
  
  // Side-by-side comparison modal state
  const [isComparisonMatrixOpen, setIsComparisonMatrixOpen] = useState(false);
  const [selectedQuoteIdsForMatrix, setSelectedQuoteIdsForMatrix] = useState<string[]>([]);
  
  // Success modal after PO issue
  const [issuedOrderDetails, setIssuedOrderDetails] = useState<{ orderId: string; amount: number; mfr: string } | null>(null);

  // New RFQ Form State
  const [rfqForm, setRfqForm] = useState({
    category: 'Storage Containers',
    product: '',
    quantity: '3,000 Units',
    targetPrice: '₹380 / unit',
    deliveryLocation: 'Bhiwandi Central Fulfillment Hub (MH-04)',
    deliveryTimeline: 'Within 10 Days',
    packaging: 'Palletized & Shrink Wrapped',
    paymentTerms: '100% Escrow Vault Guarantee',
    remarks: 'Heavy gauge, food-contact grade, drop impact tested from 2 meters, customized embossed distributor logo.',
  });

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Helper to normalize RFQ status
  const getNormalizedRfqStatus = (rfq: Rfq): 'Open for Bids' | 'Quotes Available' | 'Finalized' => {
    if (rfq.status === 'Awarded' || rfq.status === 'Closed') return 'Finalized';
    if (rfq.status === 'Quotes Received' || (rfq.quotesCount && rfq.quotesCount > 0)) return 'Quotes Available';
    return 'Open for Bids';
  };

  // Get quotes for a specific RFQ
  const getQuotesForRfq = (rfqId: string): ManufacturerQuotation[] => {
    return quotations.filter((q) => q.rfqId === rfqId);
  };

  // Filtered RFQs list
  const filteredRfqs = useMemo(() => {
    return rfqs.filter((r) => {
      const normStatus = getNormalizedRfqStatus(r);
      const matchesTab =
        activeTab === 'ALL' ||
        (activeTab === 'Open for Bids' && normStatus === 'Open for Bids') ||
        (activeTab === 'Quotes Available' && normStatus === 'Quotes Available') ||
        (activeTab === 'Finalized' && normStatus === 'Finalized');

      const query = (searchQuery || '').toLowerCase().trim();
      if (!query) return matchesTab;

      const matchesSearch =
        (r.product || r.productName || '').toLowerCase().includes(query) ||
        (r.category || '').toLowerCase().includes(query) ||
        (r.id || '').toLowerCase().includes(query) ||
        (r.remarks || r.notes || '').toLowerCase().includes(query) ||
        (r.deliveryLocation || '').toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [rfqs, activeTab, searchQuery]);

  // Active inquiries count
  const activeInquiriesCount = useMemo(() => {
    return rfqs.filter((r) => r.status !== 'Awarded' && r.status !== 'Closed').length;
  }, [rfqs]);

  // Handle open comparison view for an RFQ
  const handleOpenQuotesComparison = (rfq: Rfq) => {
    setSelectedRfqForQuotes(rfq);
    const quotesForThis = getQuotesForRfq(rfq.id);
    setSelectedQuoteIdsForMatrix(quotesForThis.map((q) => q.id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle selection for comparison matrix
  const toggleQuoteMatrixSelection = (quoteId: string) => {
    setSelectedQuoteIdsForMatrix((prev) =>
      prev.includes(quoteId) ? prev.filter((id) => id !== quoteId) : [...prev, quoteId]
    );
  };

  // Handle Create RFQ Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfqForm.product.trim()) {
      alert('Please specify the product / item specification name.');
      return;
    }

    const newRfq: Partial<Rfq> = {
      id: `RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      distributorId: 'DST-94821-IND',
      distributorName: 'Apex Polymers & Distributors LLP',
      product: rfqForm.product,
      productName: rfqForm.product,
      category: rfqForm.category,
      quantity: rfqForm.quantity,
      targetPrice: rfqForm.targetPrice,
      status: 'Open',
      createdDate: 'Just now',
      deliveryLocation: rfqForm.deliveryLocation,
      quotesCount: 0,
      deliveryTimeline: rfqForm.deliveryTimeline,
      paymentTerms: rfqForm.paymentTerms,
      notes: `Packaging: ${rfqForm.packaging}`,
      remarks: rfqForm.remarks,
      quotes: [],
    };

    onCreateRfq(newRfq);
    setIsNewRfqModalOpen(false);
    if (onCloseCreateModal) onCloseCreateModal();
    setRfqForm({
      category: 'Storage Containers',
      product: '',
      quantity: '3,000 Units',
      targetPrice: '₹380 / unit',
      deliveryLocation: 'Bhiwandi Central Fulfillment Hub (MH-04)',
      deliveryTimeline: 'Within 10 Days',
      packaging: 'Palletized & Shrink Wrapped',
      paymentTerms: '100% Escrow Vault Guarantee',
      remarks: 'Heavy gauge, food-contact grade, drop impact tested from 2 meters, customized embossed distributor logo.',
    });
  };

  // Confirm Accept & Issue PO
  const handleConfirmAcceptPO = () => {
    if (!selectedQuoteForAccept) return;
    const rfq = selectedRfqForQuotes || rfqs.find((r) => r.id === selectedQuoteForAccept.rfqId) || rfqs[0];
    const orderAmount =
      selectedQuoteForAccept.totalOrderValue ||
      selectedQuoteForAccept.totalQuotationAmount ||
      (selectedQuoteForAccept.quotedUnitPrice || selectedQuoteForAccept.quotedPricePerKg || 372) * 3000;
    
    onAcceptQuote(selectedQuoteForAccept, rfq);
    
    setIssuedOrderDetails({
      orderId: `PO-2026-${Math.floor(88000 + Math.random() * 999)}`,
      amount: orderAmount,
      mfr: selectedQuoteForAccept.manufacturerName || 'Selected Plant',
    });

    setSelectedQuoteForAccept(null);
  };

  // Confirm Decline
  const handleConfirmDecline = () => {
    if (!selectedQuoteForDecline) return;
    const finalReason = declineReason === 'Other' ? customDeclineReason : declineReason;
    onDeclineQuote(selectedQuoteForDecline.id, finalReason);
    setSelectedQuoteForDecline(null);
    setCustomDeclineReason('');
  };

  // Active quotes for the selected RFQ
  const activeRfqQuotes = useMemo(() => {
    if (!selectedRfqForQuotes) return [];
    const directQuotes = getQuotesForRfq(selectedRfqForQuotes.id);
    if (directQuotes.length > 0) return directQuotes;
    // Fallback if RFQ has quotes array
    return quotations;
  }, [selectedRfqForQuotes, quotations]);

  return (
    <div className="space-y-6 pb-16">
      {/* ============================================================ */}
      {/* 1. TOP HEADER BANNER (SCREENSHOT 1 / SCREENSHOT 2)           */}
      {/* ============================================================ */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3E8FF] text-[#7C3AED] border border-[#E9D5FF] text-xs font-bold mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
            <span>PROCUREMENT TENDERS • {activeInquiriesCount} Active Inquiries</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-[#134E4A] tracking-tight">
            RFQ & Sourcing Enquiries
          </h1>
          <p className="text-xs md:text-sm text-[#5A6B82] mt-1 font-medium">
            Broadcast bulk orders to verified manufacturers & receive competitive bidding quotes
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {selectedRfqForQuotes && (
            <button
              type="button"
              onClick={() => setSelectedRfqForQuotes(null)}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4 text-[#5A6B82]" />
              <span>Back to All RFQs</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsNewRfqModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New RFQ</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* VIEW 1: RFQ LIST VIEW (MATCHING SCREENSHOT 1)               */}
      {/* ============================================================ */}
      {!selectedRfqForQuotes && (
        <div className="space-y-6">
          {/* Tabs Filter Bar matching Screenshot 1 */}
          <div className="bg-white p-2 sm:p-3 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {(['ALL', 'Open for Bids', 'Quotes Available', 'Finalized'] as const).map((tab) => {
                const isSelected = activeTab === tab;
                const count =
                  tab === 'ALL'
                    ? rfqs.length
                    : rfqs.filter((r) => getNormalizedRfqStatus(r) === tab).length;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#6F42C1] text-white shadow-xs'
                        : 'text-[#5A6B82] hover:text-[#6F42C1] hover:bg-[#6F42C1]/10'
                    }`}
                  >
                    <span>{tab}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#5A6B82]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#5A6B82] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search RFQ ID, category, resin, location..."
                className="w-full pl-10 pr-8 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6F42C1] placeholder-[#94A3B8]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List of RFQ Cards (Pixel-Matched to Screenshot 1) */}
          <div className="space-y-4">
            {filteredRfqs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center shadow-xs">
                <FileQuestion className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No RFQ tenders found</h3>
                <p className="text-xs text-[#5A6B82] mt-1 max-w-sm mx-auto">
                  No sourcing tenders match your active tab filter or search query.
                </p>
                <button
                  type="button"
                  onClick={() => setIsNewRfqModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New RFQ</span>
                </button>
              </div>
            ) : (
              filteredRfqs.map((rfq) => {
                const quotesCount = rfq.quotesCount || getQuotesForRfq(rfq.id).length;
                const normStatus = getNormalizedRfqStatus(rfq);

                return (
                  <div
                    key={rfq.id}
                    className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs hover:border-[#6F42C1]/40 hover:shadow-sm transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    {/* Left & Middle Info */}
                    <div className="flex-1 space-y-3">
                      {/* Top Meta Badges Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-lg">
                          {rfq.id}
                        </span>

                        <span className="text-xs text-[#5A6B82] font-medium flex items-center gap-1">
                          <span>•</span>
                          <span>{rfq.createdDate}</span>
                        </span>

                        {/* Status Badge */}
                        {normStatus === 'Quotes Available' && (
                          <span className="bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            Quotes Available
                          </span>
                        )}
                        {normStatus === 'Open for Bids' && (
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            Open for Bids
                          </span>
                        )}
                        {normStatus === 'Finalized' && (
                          <span className="bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            Finalized
                          </span>
                        )}

                        {/* Category Badge */}
                        <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {rfq.category}
                        </span>
                      </div>

                      {/* Title & Remarks */}
                      <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                          {rfq.product || rfq.productName}
                        </h3>
                        {rfq.remarks && (
                          <p className="text-xs text-[#5A6B82] mt-1 line-clamp-2 leading-relaxed font-normal">
                            {rfq.remarks}
                          </p>
                        )}
                      </div>

                      {/* Specs Row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 pt-1">
                        <div className="flex items-center gap-1 font-medium">
                          <span className="text-slate-400">Target Quantity:</span>
                          <span className="font-bold text-slate-900">{rfq.quantity}</span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <div className="flex items-center gap-1 font-medium">
                          <span className="text-slate-400">Target Rate:</span>
                          <span className="font-bold text-[#6F42C1]">{rfq.targetPrice}</span>
                        </div>
                        {rfq.notes && (
                          <>
                            <span className="text-slate-300">•</span>
                            <div className="flex items-center gap-1 font-medium">
                              <span className="text-slate-500">{rfq.notes}</span>
                            </div>
                          </>
                        )}
                        {rfq.deliveryLocation && (
                          <>
                            <span className="text-slate-300">•</span>
                            <div className="flex items-center gap-1 text-slate-500 truncate max-w-xs">
                              <span>Hub: {rfq.deliveryLocation}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right Block: Quotes Count + CTA */}
                    <div className="lg:border-l lg:border-slate-100 lg:pl-6 flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 shrink-0">
                      <div className="text-left lg:text-right">
                        <div className="flex items-center lg:justify-end gap-1.5 text-sm font-bold text-slate-900">
                          <Layers className="w-4 h-4 text-[#6F42C1]" />
                          <span>{quotesCount} Quotes Received</span>
                        </div>
                        <div className="text-xs text-[#5A6B82] mt-0.5">
                          Timeline: {rfq.deliveryTimeline || 'Within 10 Days'}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenQuotesComparison(rfq)}
                        className="px-5 py-2.5 rounded-xl bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-2"
                      >
                        <span>Compare Quotes</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 2: QUOTATIONS & COMPARISON VIEW (SCREENSHOT 2)          */}
      {/* ============================================================ */}
      {selectedRfqForQuotes && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Top Breadcrumb Bar */}
          <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5A6B82]">
              <button
                type="button"
                onClick={() => setSelectedRfqForQuotes(null)}
                className="text-[#6F42C1] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All RFQs</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {selectedRfqForQuotes.id}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-slate-900 font-bold">Manufacturer Quotes</span>
            </div>

            <div className="flex items-center gap-2">
              {activeRfqQuotes.length > 1 && (
                <button
                  type="button"
                  onClick={() => setIsComparisonMatrixOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#6F42C1]/10 hover:bg-[#6F42C1]/20 text-[#6F42C1] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Scale className="w-3.5 h-3.5 text-[#6F42C1]" />
                  <span>Side-by-Side Matrix ({activeRfqQuotes.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Active RFQ Briefing Card */}
          <div className="bg-[#6F42C1] rounded-2xl p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="font-mono text-xs font-bold bg-white/10 px-2.5 py-0.5 rounded text-white/90">
                  {selectedRfqForQuotes.id}
                </span>
                <span className="bg-[#FF7A18] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  Target: {selectedRfqForQuotes.quantity} @ {selectedRfqForQuotes.targetPrice}
                </span>
                <span className="bg-white/10 text-white/80 text-[10px] font-bold px-2 py-0.5 rounded">
                  {selectedRfqForQuotes.category}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white">
                {selectedRfqForQuotes.product || selectedRfqForQuotes.productName}
              </h3>
              <p className="text-xs text-white/70 mt-1 line-clamp-1">
                {selectedRfqForQuotes.remarks || selectedRfqForQuotes.notes}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-left md:text-right text-xs">
                <div className="text-white/60">Fulfillment Location</div>
                <div className="font-bold text-white max-w-xs truncate">
                  {selectedRfqForQuotes.deliveryLocation}
                </div>
              </div>
            </div>
          </div>

          {/* Header Banner matching Screenshot 2 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20 text-xs font-bold mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6F42C1]" />
                <span>DIRECT FACTORY BIDS • {activeRfqQuotes.length} Active Quotes</span>
              </div>

              <h2 className="text-xl md:text-2xl font-black text-[#6F42C1] tracking-tight">
                Manufacturer Quotations & Comparison
              </h2>
              <p className="text-xs md:text-sm text-[#5A6B82] mt-1 font-medium">
                Evaluate factory unit rates, freight inclusions, escrow security, and lead times
              </p>
            </div>

            {activeRfqQuotes.length > 0 && (
              <button
                type="button"
                onClick={() => setIsComparisonMatrixOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Scale className="w-4 h-4 text-purple-200" />
                <span>Compare Side-by-Side</span>
              </button>
            )}
          </div>

          {/* Quotations Grid matching Screenshot 2 (2 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeRfqQuotes.length === 0 ? (
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
                <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-[#0B1F3A]">Awaiting Plant Quotations</h4>
                <p className="text-xs text-[#5A6B82] mt-1">
                  Verified polymer plants in Gujarat and Maharashtra are reviewing this RFQ tender.
                </p>
              </div>
            ) : (
              activeRfqQuotes.map((quote) => {
                const isAccepted = quote.status === 'Accepted';
                const isDeclined = quote.status === 'Declined';
                const isSelectedForMatrix = selectedQuoteIdsForMatrix.includes(quote.id);
                const unitRate = quote.quotedUnitPrice || quote.quotedPricePerKg || 372;
                const totalAmount = quote.totalOrderValue || quote.totalQuotationAmount || unitRate * 3000;

                return (
                  <div
                    key={quote.id}
                    className={`bg-white rounded-2xl border transition-all p-6 flex flex-col justify-between shadow-xs ${
                      isAccepted
                        ? 'border-emerald-500 bg-emerald-50/10'
                        : isDeclined
                        ? 'border-slate-200 opacity-60'
                        : 'border-[#E2E8F0] hover:border-emerald-300'
                    }`}
                  >
                    <div>
                      {/* Top Row: Quote ID + Validity + Compare Button */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-lg">
                            {quote.id}
                          </span>
                          <span className="text-xs text-[#5A6B82] font-medium">
                            {quote.validUntil?.startsWith('Valid') ? quote.validUntil : `Valid till ${quote.validUntil}`}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            toggleQuoteMatrixSelection(quote.id);
                            setIsComparisonMatrixOpen(true);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSelectedForMatrix
                              ? 'bg-[#6F42C1] text-white'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <Scale className="w-3.5 h-3.5 text-[#6F42C1]" />
                          <span>Compare</span>
                        </button>
                      </div>

                      {/* Product Title */}
                      <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                        {quote.productName || quote.rfqProduct}
                      </h3>
                      <p className="text-xs text-[#5A6B82] mt-0.5">
                        Against: {quote.rfqProduct || selectedRfqForQuotes?.product || 'Bulk Polymer Requirement'}
                      </p>

                      {/* Manufacturer Info Card Box matching Screenshot 2 */}
                      <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-slate-200/80 mt-3.5 space-y-2">
                        {/* Row 1: Plant Name + Rating */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                            <Building2 className="w-3.5 h-3.5 text-[#6F42C1]" />
                            <span>{quote.manufacturerName || quote.distributorName || 'Certified Gujarat Plant'}</span>
                          </div>

                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            <span>{quote.rating || 4.9}</span>
                          </div>
                        </div>

                        {/* Row 2: Factory Hub + Lead Time Badge */}
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-slate-600 font-medium">
                            Factory Hub: <span className="font-semibold text-slate-900">{quote.factoryHub || 'Jalgaon, Maharashtra'}</span>
                          </span>

                          <span className="px-2 py-0.5 rounded-md bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20 text-xs font-bold">
                            {quote.leadTime || `${quote.deliveryLeadTimeDays || 6} Days Lead Time`}
                          </span>
                        </div>

                        {/* Row 3: Inclusions */}
                        <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 pt-1 border-t border-slate-200/60">
                          <span className="flex items-center gap-1 text-slate-700">
                            <Check className="w-3.5 h-3.5 text-[#6F42C1]" />
                            <span>Freight Included</span>
                          </span>
                          <span className="flex items-center gap-1 text-slate-700">
                            <Check className="w-3.5 h-3.5 text-[#6F42C1]" />
                            <span>PlastoShip Escrow Protected</span>
                          </span>
                        </div>
                      </div>

                      {/* Manufacturer Note Quote Block matching Screenshot 2 */}
                      {quote.notes && (
                        <p className="text-xs italic text-[#5A6B82] bg-amber-50/40 p-2.5 rounded-lg border border-amber-200/50 mt-3 leading-relaxed">
                          &quot;{quote.notes}&quot;
                        </p>
                      )}
                    </div>

                    {/* Pricing Footer & Action Buttons matching Screenshot 2 */}
                    <div className="mt-5 pt-4 border-t border-[#E2E8F0] space-y-4">
                      {/* Price Numbers */}
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#5A6B82]">
                            QUOTED UNIT PRICE
                          </div>
                          <div className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                            ₹{unitRate.toLocaleString('en-IN')}{' '}
                            <span className="text-xs font-bold text-[#5A6B82]">/ unit</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#5A6B82]">
                            TOTAL ORDER VALUE
                          </div>
                          <div className="text-lg font-black text-[#6F42C1] tracking-tight mt-0.5">
                            {formatINR(totalAmount)}
                          </div>
                        </div>
                      </div>

                      {/* Action CTAs */}
                      {isAccepted ? (
                        <div className="p-3 bg-[#6F42C1]/10 text-[#6F42C1] rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 border border-[#6F42C1]/30">
                          <CheckCircle className="w-4 h-4 text-[#6F42C1]" />
                          <span>Quote Accepted • Purchase Order Active</span>
                        </div>
                      ) : isDeclined ? (
                        <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold text-center">
                          Quotation Declined
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setSelectedQuoteForAccept(quote)}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Accept & Issue PO</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedQuoteForDecline(quote)}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <X className="w-3.5 h-3.5 text-slate-500" />
                            <span>Decline</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: CREATE NEW RFQ (BROADCAST TO PLANTS)                */}
      {/* ============================================================ */}
      {isNewRfqModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20 uppercase">
                    Procurement Tender
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6F42C1]/10 text-[#6F42C1]">
                    Live Broadcast to Verified Plants
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#6F42C1]">
                  Broadcast New Bulk Procurement RFQ
                </h3>
                <p className="text-xs text-[#5A6B82] font-semibold">
                  Publish your polymer specifications to get competitive bids from certified plants across Gujarat and Western India.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsNewRfqModalOpen(false);
                  if (onCloseCreateModal) onCloseCreateModal();
                }}
                className="p-2 rounded-xl text-[#5A6B82] hover:bg-[#F4F7FC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                    Product Category
                  </label>
                  <select
                    value={rfqForm.category}
                    onChange={(e) => setRfqForm({ ...rfqForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6F42C1]"
                  >
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Storage Containers">Storage Containers</option>
                        <option value="Lunch Boxes">Lunch Boxes</option>
                        <option value="Cleaning Products">Cleaning Products</option>
                        <option value="HDPE Granules">HDPE Granules</option>
                        <option value="PP Granules">PP Granules</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                    Product / Item Description
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bulk Sourcing: 50L Heavy Duty Virgin HDPE Storage Tubs"
                    value={rfqForm.product}
                    onChange={(e) => setRfqForm({ ...rfqForm, product: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6F42C1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                    Required Quantity
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3,000 Units"
                    value={rfqForm.quantity}
                    onChange={(e) => setRfqForm({ ...rfqForm, quantity: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6F42C1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                    Target Rate / Unit (₹)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹380 / unit"
                    value={rfqForm.targetPrice}
                    onChange={(e) => setRfqForm({ ...rfqForm, targetPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6F42C1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                    Packaging Specification
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Palletized & Shrink Wrapped"
                    value={rfqForm.packaging}
                    onChange={(e) => setRfqForm({ ...rfqForm, packaging: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6F42C1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                    Fulfillment Hub / Delivery Destination
                  </label>
                  <input
                    type="text"
                    required
                    value={rfqForm.deliveryLocation}
                    onChange={(e) => setRfqForm({ ...rfqForm, deliveryLocation: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6F42C1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                    Delivery Timeline Required
                  </label>
                  <input
                    type="text"
                    required
                    value={rfqForm.deliveryTimeline}
                    onChange={(e) => setRfqForm({ ...rfqForm, deliveryTimeline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6F42C1]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                  Technical Specifications & Quality Requirements
                </label>
                <textarea
                  rows={3}
                  value={rfqForm.remarks}
                  onChange={(e) => setRfqForm({ ...rfqForm, remarks: e.target.value })}
                  placeholder="Specify material grade, impact testing, certifications, mold embossing requirements..."
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6F42C1]"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                  <strong>PlastoShip Escrow Protected:</strong> Plant bids submitted against this RFQ are legally binding. When you accept a quotation, your funds are safely locked in Escrow until physical delivery and QC sign-off.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => {
                    setIsNewRfqModalOpen(false);
                    if (onCloseCreateModal) onCloseCreateModal();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#F4F7FC] text-slate-700 text-xs font-bold hover:bg-[#E2E8F0] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish & Broadcast RFQ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: ACCEPT & ISSUE PURCHASE ORDER MODAL                 */}
      {/* ============================================================ */}
      {selectedQuoteForAccept && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedQuoteForAccept.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6F42C1]/10 text-[#6F42C1]">
                    Direct Plant Award
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#6F42C1]">
                  Issue Purchase Order & Lock Escrow
                </h3>
                <p className="text-xs text-[#5A6B82] font-semibold">
                  You are awarding this consignment to {selectedQuoteForAccept.manufacturerName}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQuoteForAccept(null)}
                className="p-2 rounded-xl text-[#5A6B82] hover:bg-[#F4F7FC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PO Summary Card */}
            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
                <span className="text-slate-500 font-semibold">Manufacturer:</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {selectedQuoteForAccept.manufacturerName}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Product SKU / Grade:</span>
                <span className="font-bold text-slate-900">
                  {selectedQuoteForAccept.productName}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Consignment Quantity:</span>
                <span className="font-bold text-slate-900">
                  {selectedQuoteForAccept.quantity || '3,000 Units'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Quoted Unit Rate:</span>
                <span className="font-bold text-slate-900">
                  ₹{(selectedQuoteForAccept.quotedUnitPrice || selectedQuoteForAccept.quotedPricePerKg || 372).toLocaleString('en-IN')} / unit
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Production Lead Time:</span>
                <span className="font-bold text-[#6F42C1]">
                  {selectedQuoteForAccept.leadTime || '6 Days Lead Time'}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-200/80">
                <span className="text-slate-700 font-bold uppercase">Total Escrow Deposit:</span>
                <span className="text-xl font-black text-[#6F42C1]">
                  {formatINR(
                    selectedQuoteForAccept.totalOrderValue ||
                      selectedQuoteForAccept.totalQuotationAmount ||
                      1116000
                  )}
                </span>
              </div>
            </div>

            {/* Escrow Guarantee Note */}
            <div className="p-3.5 bg-[#6F42C1]/10 rounded-xl border border-[#6F42C1]/20 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#6F42C1] shrink-0 mt-0.5" />
              <div className="text-[11px] text-[#6F42C1] leading-relaxed">
                <span className="font-bold block">100% Escrow Protection:</span>
                The order total will be locked in the PlastoShip Escrow Vault. Funds will only be released to {selectedQuoteForAccept.manufacturerName} after you confirm receipt, lorry receipt inspection, and batch quality compliance.
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setSelectedQuoteForAccept(null)}
                className="px-4 py-2.5 rounded-xl bg-[#F4F7FC] text-slate-700 text-xs font-bold hover:bg-[#E2E8F0] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAcceptPO}
                className="px-5 py-2.5 rounded-xl bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Issue Purchase Order</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: DECLINE QUOTATION MODAL                             */}
      {/* ============================================================ */}
      {selectedQuoteForDecline && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {selectedQuoteForDecline.id}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Decline Plant Quotation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQuoteForDecline(null)}
                className="p-1.5 rounded-lg text-[#5A6B82] hover:bg-[#F4F7FC] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#5A6B82]">
              Select a reason for declining the bid from <strong>{selectedQuoteForDecline.manufacturerName}</strong>. This feedback helps plants adjust competitive pricing:
            </p>

            <div className="space-y-2 text-xs">
              {[
                'Quoted price exceeds target procurement budget',
                'Production lead time is too long for our schedule',
                'Awarded order to alternate supplier quote',
                'Technical specification or QC test mismatch',
                'Other',
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-slate-800 font-medium"
                >
                  <input
                    type="radio"
                    name="declineReason"
                    value={reason}
                    checked={declineReason === reason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    className="text-[#6F42C1] focus:ring-[#6F42C1]"
                  />
                  <span>{reason}</span>
                </label>
              ))}

              {declineReason === 'Other' && (
                <textarea
                  rows={2}
                  value={customDeclineReason}
                  onChange={(e) => setCustomDeclineReason(e.target.value)}
                  placeholder="Specify custom reason..."
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6F42C1]"
                />
              )}
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setSelectedQuoteForDecline(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecline}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: SIDE-BY-SIDE MATRIX COMPARISON MODAL                */}
      {/* ============================================================ */}
      {isComparisonMatrixOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-5xl w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20">
                    Commercial Bid Matrix
                  </span>
                  <span className="text-xs text-[#5A6B82] font-semibold">
                    Side-by-Side Comparison
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#6F42C1]">
                  Factory Quotation Comparison Matrix
                </h3>
                <p className="text-xs text-[#5A6B82] font-semibold">
                  Comparing unit price, plant lead times, freight coverage, and ratings.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsComparisonMatrixOpen(false)}
                className="p-2 rounded-xl text-[#5A6B82] hover:bg-[#F4F7FC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
                    <th className="py-3 px-4 w-44">Parameter</th>
                    {activeRfqQuotes.map((q) => (
                      <th key={q.id} className="py-3 px-4 min-w-[220px]">
                        <div className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded inline-block mb-1">
                          {q.id}
                        </div>
                        <div className="font-extrabold text-sm text-slate-900 truncate">
                          {q.manufacturerName}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-xs font-semibold text-slate-900">
                  <tr>
                    <td className="py-3 px-4 text-slate-500 font-bold bg-slate-50/50">Quoted Unit Rate</td>
                    {activeRfqQuotes.map((q) => (
                      <td key={q.id} className="py-3 px-4 font-black text-base text-slate-900">
                        ₹{(q.quotedUnitPrice || q.quotedPricePerKg || 372).toLocaleString('en-IN')} / unit
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 text-slate-500 font-bold bg-slate-50/50">Total Order Value</td>
                    {activeRfqQuotes.map((q) => (
                      <td key={q.id} className="py-3 px-4 font-black text-sm text-[#6F42C1]">
                        {formatINR(q.totalOrderValue || q.totalQuotationAmount || 1116000)}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 text-slate-500 font-bold bg-slate-50/50">Production Lead Time</td>
                    {activeRfqQuotes.map((q) => (
                      <td key={q.id} className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20 font-bold">
                          {q.leadTime || '6 Days Lead Time'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 text-slate-500 font-bold bg-slate-50/50">Plant Rating & Hub</td>
                    {activeRfqQuotes.map((q) => (
                      <td key={q.id} className="py-3 px-4">
                        <div className="flex items-center gap-1 font-bold text-amber-700">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>{q.rating || 4.9} ★</span>
                        </div>
                        <div className="text-[11px] text-slate-500">{q.factoryHub || 'Jalgaon, MH'}</div>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 text-slate-500 font-bold bg-slate-50/50">Freight Inclusions</td>
                    {activeRfqQuotes.map((q) => (
                      <td key={q.id} className="py-3 px-4 text-[#6F42C1] font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Included in Unit Rate</span>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 text-slate-500 font-bold bg-slate-50/50">Escrow Security</td>
                    {activeRfqQuotes.map((q) => (
                      <td key={q.id} className="py-3 px-4 text-[#6F42C1] font-bold">
                        100% Escrow Protected
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 text-slate-500 font-bold bg-slate-50/50">Manufacturer Remarks</td>
                    {activeRfqQuotes.map((q) => (
                      <td key={q.id} className="py-3 px-4 text-[11px] italic text-slate-600 font-normal">
                        &quot;{q.notes || 'Export grade finish with prompt dispatch.'}&quot;
                      </td>
                    ))}
                  </tr>

                  {/* Direct Action Row in Matrix */}
                  <tr>
                    <td className="py-4 px-4 text-slate-500 font-bold bg-slate-50/50">Action</td>
                    {activeRfqQuotes.map((q) => (
                      <td key={q.id} className="py-4 px-4">
                        {q.status === 'Accepted' ? (
                          <span className="text-[#6F42C1] font-bold text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Accepted</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setIsComparisonMatrixOpen(false);
                              setSelectedQuoteForAccept(q);
                            }}
                            className="w-full py-2 px-3 rounded-xl bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <span>Accept & Issue PO</span>
                          </button>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setIsComparisonMatrixOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 5: ORDER ISSUED SUCCESS MODAL                          */}
      {/* ============================================================ */}
      {issuedOrderDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-md w-full p-6 sm:p-8 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-[#6F42C1]/10 text-[#6F42C1] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-[#6F42C1]">
              Purchase Order Successfully Issued!
            </h3>

            <p className="text-xs text-[#5A6B82] leading-relaxed">
              Order <strong className="text-slate-900 font-mono">{issuedOrderDetails.orderId}</strong> has been transmitted to <strong>{issuedOrderDetails.mfr}</strong>. Funds totaling <strong className="text-[#6F42C1]">{formatINR(issuedOrderDetails.amount)}</strong> are safely secured in your Escrow Vault.
            </p>

            <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-bold text-slate-800">{issuedOrderDetails.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Escrow Security:</span>
                <span className="font-bold text-[#6F42C1]">100% Funds Protected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tracking:</span>
                <span className="font-bold text-slate-800">Live GPS tracking active upon dispatch</span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIssuedOrderDetails(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                Back to RFQs
              </button>

              {onNavigateToOrders && (
                <button
                  type="button"
                  onClick={() => {
                    setIssuedOrderDetails(null);
                    onNavigateToOrders();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>View in Orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
