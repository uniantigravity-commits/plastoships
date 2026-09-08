import React, { useState } from 'react';
import {
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  TrendingDown,
  DollarSign,
  Download,
  MessageSquare,
  X,
  Plus,
  Send,
  ArrowUpRight,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { ManufacturerQuotation, Rfq, Order } from '../../types';

interface DistributorQuotationsScreenProps {
  quotations?: ManufacturerQuotation[];
  rfqs?: Rfq[];
  onAcceptQuote?: (quote: ManufacturerQuotation) => void;
  onNegotiateQuote?: (rfqId: string, quoteId: string, counterPrice: number) => void;
  onNavigate?: (screen: string) => void;
}

export const DistributorQuotationsScreen: React.FC<DistributorQuotationsScreenProps> = ({
  quotations = [],
  rfqs = [],
  onAcceptQuote,
  onNegotiateQuote,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedQuote, setSelectedQuote] = useState<ManufacturerQuotation | null>(null);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isNegotiateModalOpen, setIsNegotiateModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [counterPrice, setCounterPrice] = useState<number>(120);
  const [negotiateNotes, setNegotiateNotes] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Plant Supplier', text: 'Namaste! We can dispatch 25 MT within 48 hours from Morbi Plant.', time: '10:30 AM' },
  ]);

  const filteredQuotes = quotations.filter((q) => {
    const productName = (q.rfqProduct || q.productName || '').toLowerCase();
    const distName = (q.distributorName || '').toLowerCase();
    const qId = (q.id || '').toLowerCase();
    const rfqId = (q.rfqId || '').toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      productName.includes(search) ||
      distName.includes(search) ||
      qId.includes(search) ||
      rfqId.includes(search);

    const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAccept = (q: ManufacturerQuotation) => {
    setSelectedQuote(q);
    setIsAcceptModalOpen(true);
  };

  const handleOpenNegotiate = (q: ManufacturerQuotation) => {
    setSelectedQuote(q);
    setCounterPrice(Math.round(q.quotedPricePerKg * 0.96));
    setIsNegotiateModalOpen(true);
  };

  const handleOpenChat = (q: ManufacturerQuotation) => {
    setSelectedQuote(q);
    setIsChatModalOpen(true);
  };

  const confirmAccept = () => {
    if (selectedQuote && onAcceptQuote) {
      onAcceptQuote(selectedQuote);
    }
    setIsAcceptModalOpen(false);
  };

  const confirmNegotiate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedQuote && onNegotiateQuote) {
      onNegotiateQuote(selectedQuote.rfqId, selectedQuote.id, counterPrice);
    }
    setIsNegotiateModalOpen(false);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatHistory((prev) => [
      ...prev,
      { sender: 'You (Buyer)', text: chatMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setChatMessage('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] tracking-tight">
              Quotations Received
            </h2>
            <span className="px-2.5 py-1 text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 rounded-lg">
              {quotations.length} Active Bids
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#5A6B82] mt-1 font-medium">
            Review, negotiate, and award procurement bids directly from certified extrusion manufacturers
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('dst_rfqs')}
            className="px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post New RFQ</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
          <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider block">
            Total Quotations
          </span>
          <h3 className="text-2xl font-extrabold text-[#1E293B] mt-2">{quotations.length}</h3>
          <p className="text-xs font-semibold text-teal-600 mt-1">From verified Gujarat plants</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
          <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider block">
            Lowest Rate Quoted
          </span>
          <h3 className="text-2xl font-extrabold text-teal-700 mt-2">₹124.50 / Kg</h3>
          <p className="text-xs font-semibold text-teal-700 mt-1">PP Injection Grade</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
          <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider block">
            Avg Lead Time
          </span>
          <h3 className="text-2xl font-extrabold text-[#1E293B] mt-2">2 - 3 Days</h3>
          <p className="text-xs font-semibold text-[#5A6B82] mt-1">Direct from Morbi & Vatva</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
          <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider block">
            Escrow Secured
          </span>
          <h3 className="text-2xl font-extrabold text-teal-600 mt-2">100% Protected</h3>
          <p className="text-xs font-semibold text-[#5A6B82] mt-1">No payment released before QC</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#5A6B82] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search quotations by product, plant supplier, or RFQ ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9.5 pl-9.5 pr-4 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:border-teal-500 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Pending Review', 'Accepted', 'Counter Offered'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'bg-[#F4F7FC] text-[#5A6B82] hover:text-[#1E293B] border border-[#E2E8F0]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Quotations List / Cards */}
      <div className="space-y-4">
        {filteredQuotes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center shadow-xs">
            <Layers className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
            <h4 className="text-sm font-bold text-[#1E293B]">No quotations found</h4>
            <p className="text-xs text-[#5A6B82] mt-1">
              Try adjusting your search criteria or submit a new bulk RFQ.
            </p>
          </div>
        ) : (
          filteredQuotes.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:border-teal-300 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-[#1E293B] bg-[#F4F7FC] px-2.5 py-0.5 rounded-md border border-[#E2E8F0]">
                      {q.id}
                    </span>
                    <span className="text-xs text-[#5A6B82]">for RFQ:</span>
                    <span className="font-mono text-xs font-bold text-[#1E293B]">{q.rfqId}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        q.status === 'Accepted'
                          ? 'bg-teal-100 text-teal-800'
                          : q.status === 'Counter Offered'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#1E293B]">{q.rfqProduct}</h3>
                  <p className="text-xs text-[#5A6B82] mt-0.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Manufacturer: <strong className="text-[#1E293B]">{q.distributorName}</strong></span>
                    <span>•</span>
                    <span>Valid until: <strong>{q.validityDate}</strong></span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl text-right min-w-[150px]">
                    <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                      Quoted Price
                    </span>
                    <span className="text-lg font-black text-[#1E293B]">
                      ₹{q.quotedPricePerKg} <span className="text-xs font-normal text-[#5A6B82]">/ Kg</span>
                    </span>
                  </div>
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl text-right min-w-[130px]">
                    <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                      Est. Total (20 MT)
                    </span>
                    <span className="text-sm font-extrabold text-teal-700">
                      ₹{(q.quotedPricePerKg * 20000).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quotation Specs Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 text-xs">
                <div>
                  <span className="text-[#5A6B82] block text-[11px]">Delivery Timeline:</span>
                  <span className="font-bold text-[#1E293B]">{q.deliveryDays} Days from PO</span>
                </div>
                <div>
                  <span className="text-[#5A6B82] block text-[11px]">Payment Terms:</span>
                  <span className="font-bold text-[#1E293B]">{q.paymentTerms}</span>
                </div>
                <div>
                  <span className="text-[#5A6B82] block text-[11px]">COA & QC Assurance:</span>
                  <span className="font-bold text-teal-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Guaranteed
                  </span>
                </div>
                <div>
                  <span className="text-[#5A6B82] block text-[11px]">Dispatch Plant Hub:</span>
                  <span className="font-bold text-[#1E293B]">Morbi Polymer GIDC</span>
                </div>
              </div>

              {q.remarks && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 mb-3">
                  <strong>Plant Note:</strong> {q.remarks}
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenChat(q)}
                    className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-bold text-[#1E293B] hover:bg-[#F4F7FC] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                    <span>Liaise with Plant</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert(`Downloading official Commercial Quotation PDF: ${q.id}.pdf`)}
                    className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-bold text-[#5A6B82] hover:text-[#1E293B] hover:bg-[#F4F7FC] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {q.status !== 'Accepted' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenNegotiate(q)}
                        className="px-4 py-2 rounded-xl border border-[#0F766E] text-[#0F766E] hover:bg-teal-50 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Counter-Offer / Negotiate
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenAccept(q)}
                        className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-300" />
                        <span>Award Quote & Lock Escrow</span>
                      </button>
                    </>
                  )}
                  {q.status === 'Accepted' && (
                    <span className="px-3 py-1.5 rounded-xl bg-teal-100 text-teal-800 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Awarded • Purchase Order Created
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Accept & Lock Escrow Modal */}
      {isAcceptModalOpen && selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-extrabold text-[#1E293B]">
                  Award Quotation & Deposit Escrow
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAcceptModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#F4F7FC] text-[#5A6B82]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">Quotation ID:</span>
                <span className="font-mono font-bold text-[#1E293B]">{selectedQuote.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">Selected Plant:</span>
                <span className="font-bold text-[#1E293B]">{selectedQuote.distributorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">Product Grade:</span>
                <span className="font-bold text-[#1E293B]">{selectedQuote.rfqProduct}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">Quoted Rate:</span>
                <span className="font-extrabold text-teal-700">₹{selectedQuote.quotedPricePerKg} / Kg</span>
              </div>
              <div className="pt-2 border-t border-[#E2E8F0] flex justify-between text-sm">
                <span className="font-bold text-[#1E293B]">Escrow Deposit Amount:</span>
                <span className="font-black text-[#1E293B]">
                  ₹{(selectedQuote.quotedPricePerKg * 20000).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> 100% Escrow Protection
              </p>
              <p className="text-[11px] leading-relaxed">
                Funds will remain securely locked in PlastoShip Escrow account and only released upon delivery and QC verification.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setIsAcceptModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#1E293B] hover:bg-[#F4F7FC]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAccept}
                className="px-4 py-2 rounded-xl bg-[#0F766E] text-xs font-bold text-white hover:bg-[#0D9488] flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                Confirm & Create Purchase Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Negotiate / Counter-Offer Modal */}
      {isNegotiateModalOpen && selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-base font-extrabold text-[#1E293B]">
                Submit Counter-Offer
              </h3>
              <button
                type="button"
                onClick={() => setIsNegotiateModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#F4F7FC] text-[#5A6B82]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={confirmNegotiate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#1E293B] block mb-1">
                  Plant Quoted Rate: <span className="font-mono text-[#5A6B82]">₹{selectedQuote.quotedPricePerKg}/Kg</span>
                </label>
                <label className="font-bold text-[#1E293B] block mt-3 mb-1">
                  Your Proposed Counter Price (₹/Kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(parseFloat(e.target.value))}
                  className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] font-bold text-sm text-[#1E293B] focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#1E293B] block mb-1">
                  Procurement Notes / Justification
                </label>
                <textarea
                  rows={3}
                  value={negotiateNotes}
                  onChange={(e) => setNegotiateNotes(e.target.value)}
                  placeholder="e.g. Ready for repeat monthly orders of 50 MT if target rate of ₹120/kg is agreed."
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsNegotiateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#1E293B] hover:bg-[#F4F7FC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0F766E] text-xs font-bold text-white hover:bg-[#0D9488] flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch Counter-Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chat with Plant Liaison Modal */}
      {isChatModalOpen && selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-base font-extrabold text-[#1E293B]">
                  Direct Plant Liaison
                </h3>
                <p className="text-xs text-[#5A6B82]">{selectedQuote.distributorName} • {selectedQuote.rfqProduct}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsChatModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#F4F7FC] text-[#5A6B82]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat message thread */}
            <div className="h-64 overflow-y-auto p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender.includes('You') ? 'items-end' : 'items-start'
                  }`}
                >
                  <span className="text-[10px] font-bold text-[#5A6B82] mb-0.5">
                    {msg.sender} • {msg.time}
                  </span>
                  <div
                    className={`p-3 rounded-2xl text-xs max-w-[85%] ${
                      msg.sender.includes('You')
                        ? 'bg-[#0F766E] text-white rounded-br-none'
                        : 'bg-white border border-[#E2E8F0] text-[#1E293B] rounded-bl-none shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                placeholder="Type your question or delivery specification..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 h-9.5 px-3 rounded-xl border border-[#E2E8F0] text-xs focus:border-[#0F766E]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-bold hover:bg-[#0D9488] flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
