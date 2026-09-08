import React, { useState } from 'react';
import {
  Store,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  MapPin,
  Phone,
  Mail,
  Ban,
  RotateCcw,
  Building,
  TrendingUp,
  CreditCard,
  Building2,
  Calendar,
  Globe,
  FileText,
  Landmark,
  ShieldCheck,
  Layers,
  Copy,
  Check,
  Clock,
  Briefcase,
  ExternalLink,
  Package,
  ShieldAlert,
  Maximize2,
  Warehouse,
  Tag,
} from 'lucide-react';
import { Distributor, KycStatus, AccountStatus } from '../types';
import { Modal } from '../components/Modal';

interface DistributorScreenProps {
  distributors: Distributor[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onToggleSuspend: (id: string) => void;
}

export const DistributorScreen: React.FC<DistributorScreenProps> = ({
  distributors,
  onApprove,
  onReject,
  onToggleSuspend,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected' | 'Suspended'>('All');

  // Modal states
  const [selectedDst, setSelectedDst] = useState<Distributor | null>(null);
  const [rejectDst, setRejectDst] = useState<Distributor | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [suspendDst, setSuspendDst] = useState<Distributor | null>(null);

  // Tab & Preview States
  const [dstTab, setDstTab] = useState<'all' | 'entity' | 'trade' | 'tax' | 'bank' | 'docs'>('all');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{
    title: string;
    fileName: string;
    size: string;
    docNumber?: string;
    status: string;
    uploadDate?: string;
  } | null>(null);

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2200);
  };

  const getDistributorDocs = (d: Distributor) => {
    if (d.registrationDocs && d.registrationDocs.length > 0) {
      return d.registrationDocs;
    }
    return [
      {
        id: `${d.id}-DOC-01`,
        docType: 'GSTIN Registration (REG-06)',
        documentNumber: d.gstin,
        fileName: `GSTIN_${d.gstin}.pdf`,
        fileSize: '1.2 MB',
        uploadDate: d.joinedDate,
        status: d.kycStatus === 'Approved' ? ('Verified' as const) : ('Pending Review' as const),
      },
      {
        id: `${d.id}-DOC-02`,
        docType: 'Entity PAN Card Copy',
        documentNumber: d.panNumber || 'ABFPS1092M',
        fileName: `PAN_${d.panNumber || 'ABFPS1092M'}.pdf`,
        fileSize: '810 KB',
        uploadDate: d.joinedDate,
        status: d.kycStatus === 'Approved' ? ('Verified' as const) : ('Pending Review' as const),
      },
      {
        id: `${d.id}-DOC-03`,
        docType: 'Bank Cancelled Cheque Leaf',
        documentNumber: `CHQ-${d.bankName?.slice(0, 4) || 'HDFC'}-1092`,
        fileName: `Cancelled_Cheque_${d.bankName?.replace(/\s+/g, '_') || 'Bank'}.pdf`,
        fileSize: '620 KB',
        uploadDate: d.joinedDate,
        status: d.kycStatus === 'Approved' ? ('Verified' as const) : ('Pending Review' as const),
      },
      {
        id: `${d.id}-DOC-04`,
        docType: 'Trade License / Incorporation Certificate',
        documentNumber: d.cinNumber || `TRD/GJ/${d.city.toUpperCase().slice(0, 3)}/2022/990`,
        fileName: `Registration_Certificate_${d.companyName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 16)}.pdf`,
        fileSize: '1.7 MB',
        uploadDate: d.joinedDate,
        status: d.kycStatus === 'Approved' ? ('Verified' as const) : ('Pending Review' as const),
      },
    ];
  };

  const filtered = distributors.filter((d) => {
    const q = (search || '').toLowerCase().trim();
    let matchesStatus = true;
    if (statusFilter === 'Pending') {
      matchesStatus = d.kycStatus === 'Pending' || d.status === 'Pending Review';
    } else if (statusFilter === 'Approved') {
      matchesStatus = d.kycStatus === 'Approved' && d.status !== 'Suspended';
    } else if (statusFilter === 'Rejected') {
      matchesStatus = d.kycStatus === 'Rejected' || d.status === 'Rejected';
    } else if (statusFilter === 'Suspended') {
      matchesStatus = d.status === 'Suspended';
    }

    if (!q) return matchesStatus;

    const matchesSearch =
      (d.companyName || '').toLowerCase().includes(q) ||
      (d.contactPerson || '').toLowerCase().includes(q) ||
      (d.city || '').toLowerCase().includes(q) ||
      (d.id || '').toLowerCase().includes(q) ||
      (d.businessType || '').toLowerCase().includes(q);

    return matchesSearch && matchesStatus;
  });

  const handleConfirmReject = () => {
    if (!rejectDst) return;
    if (!rejectReason.trim()) {
      alert('Please enter a rejection reason.');
      return;
    }
    onReject(rejectDst.id, rejectReason.trim());
    setRejectDst(null);
    setRejectReason('');
  };

  const handleConfirmSuspend = () => {
    if (!suspendDst) return;
    onToggleSuspend(suspendDst.id);
    setSuspendDst(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0B1F3A] tracking-tight">
            Distributor Management
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
            placeholder="Search distributor, ID, business type..."
            className="w-full h-10 pl-9.5 pr-4 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium placeholder-[#5A6B82] focus:outline-none focus:border-[#0B1F3A] focus:bg-white transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4F7FC] rounded-xl border border-[#E2E8F0] w-full md:w-auto overflow-x-auto">
          {(['All', 'Pending', 'Approved', 'Rejected', 'Suspended'] as const).map((tab) => {
            const count =
              tab === 'All'
                ? distributors.length
                : tab === 'Pending'
                ? distributors.filter((d) => d.kycStatus === 'Pending' || d.status === 'Pending Review').length
                : tab === 'Approved'
                ? distributors.filter((d) => d.kycStatus === 'Approved' && d.status !== 'Suspended').length
                : tab === 'Rejected'
                ? distributors.filter((d) => d.kycStatus === 'Rejected' || d.status === 'Rejected').length
                : distributors.filter((d) => d.status === 'Suspended').length;
            const isActive = statusFilter === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
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
          })}
        </div>
      </div>

      {/* Distributors Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
                <th className="py-4 px-6 w-[32%]">Company Name</th>
                <th className="py-4 px-4 w-[22%]">Contact Person</th>
                <th className="py-4 px-4 w-[18%]">Business Type</th>
                <th className="py-4 px-4 w-[15%]">Status</th>
                <th className="py-4 px-6 w-[13%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#5A6B82]">
                    <Store className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-sm text-[#0B1F3A]">No distributors found</p>
                    <p className="text-xs text-[#5A6B82] mt-0.5">Try adjusting your filters.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((dst) => (
                  <tr key={dst.id} className="hover:bg-[#F4F7FC]/70 transition-colors">
                    {/* Company Name + ID */}
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-bold text-[#0B1F3A] hover:text-[#FF7A18] transition-colors block text-sm">
                          {dst.companyName}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono-code text-[11px] text-[#5A6B82] bg-[#F4F7FC] px-1.5 py-0.5 rounded border border-slate-200">
                            {dst.id}
                          </span>
                          <span className="text-[11px] text-[#5A6B82] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {dst.city}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Person */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <p className="font-bold text-[#0B1F3A]">{dst.contactPerson}</p>
                      <p className="text-[11px] text-[#5A6B82]">{dst.phone}</p>
                    </td>

                    {/* Business Type */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-slate-100 text-[#0B1F3A] rounded-lg font-semibold text-[11px] border border-slate-200 inline-block whitespace-nowrap">
                        {dst.businessType}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {dst.status === 'Suspended' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                          <Ban className="w-3.5 h-3.5 shrink-0" />
                          <span>Suspended</span>
                        </span>
                      ) : dst.kycStatus === 'Approved' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Approved</span>
                        </span>
                      ) : dst.kycStatus === 'Pending' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                          <span>Pending Review</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                          <XCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Rejected</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Approve and Reject Buttons (Shown when Pending Review) */}
                        {dst.kycStatus === 'Pending' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => onApprove(dst.id)}
                              className="px-2.5 py-1 text-xs font-bold rounded-lg transition-colors shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                              title="Approve KYC"
                            >
                              Approve
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setRejectDst(dst);
                                setRejectReason(dst.kycReason || '');
                              }}
                              className="px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 cursor-pointer"
                              title="Reject KYC"
                            >
                              Reject
                            </button>
                          </>
                        ) : dst.kycStatus === 'Rejected' ? (
                          <button
                            type="button"
                            onClick={() => onApprove(dst.id)}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                            title="Re-approve KYC"
                          >
                            Approve
                          </button>
                        ) : null}

                        {/* View Details */}
                        <button
                          type="button"
                          onClick={() => setSelectedDst(dst)}
                          className="p-1.5 text-[#0B1F3A] hover:bg-[#F4F7FC] hover:text-[#FF7A18] rounded-lg border border-[#E2E8F0] transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Suspend / Reactivate (Only shown when approved) */}
                        {dst.kycStatus === 'Approved' && (
                          <button
                            type="button"
                            onClick={() => setSuspendDst(dst)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              dst.status === 'Active'
                                ? 'border-slate-200 text-[#5A6B82] hover:text-rose-600 hover:bg-rose-50'
                                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                            }`}
                            title={dst.status === 'Active' ? 'Suspend Distributor' : 'Reactivate Distributor'}
                          >
                            {dst.status === 'Active' ? (
                              <Ban className="w-4 h-4" />
                            ) : (
                              <RotateCcw className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW DISTRIBUTOR MODAL - ALL SIGN-UP DETAILS */}
      <Modal
        isOpen={!!selectedDst}
        onClose={() => setSelectedDst(null)}
        title={selectedDst?.companyName || 'Distributor Details'}
        subtitle={`Application & Registration ID: ${selectedDst?.id} • Submitted ${selectedDst?.joinedDate}`}
        maxWidth="4xl"
      >
        {selectedDst && (
          <div className="space-y-5">
            {/* Top Status & Tier Banner */}
            <div className="p-4 bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] rounded-2xl border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#5A6B82]">Application Status:</span>
                  {selectedDst.kycStatus === 'Approved' ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified & Approved
                    </span>
                  ) : selectedDst.kycStatus === 'Pending' ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Pending Super Admin Review
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      Rejected
                    </span>
                  )}
                </div>

                <div className="h-4 w-px bg-slate-300 hidden sm:block" />

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#5A6B82]">Trading Role:</span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-[#0B1F3A] text-white inline-flex items-center gap-1">
                    <Store className="w-3.5 h-3.5 text-[#FF7A18]" />
                    {selectedDst.businessType}
                  </span>
                </div>

                <div className="h-4 w-px bg-slate-300 hidden sm:block" />

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#5A6B82]">Entity:</span>
                  <span className="text-xs font-bold text-[#0B1F3A] bg-white px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                    {selectedDst.legalEntityType || 'Partnership Firm'}
                  </span>
                </div>
              </div>

              {/* Copy Feedback Toast */}
              {copiedText && (
                <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1.5 animate-in fade-in">
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied {copiedText}</span>
                </div>
              )}
            </div>

            {/* Rejection Reason if any */}
            {selectedDst.kycReason && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-rose-900">Compliance Defect on Record:</p>
                  <p className="mt-0.5">{selectedDst.kycReason}</p>
                </div>
              </div>
            )}

            {/* Navigation Tabs for Sign-Up Sections */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F1F5F9] rounded-xl overflow-x-auto border border-[#E2E8F0]">
              {[
                { id: 'all', label: 'All Application Details', icon: Layers },
                { id: 'entity', label: 'Entity & Desk', icon: Building2 },
                { id: 'trade', label: 'Warehouse & Trade', icon: Warehouse },
                { id: 'tax', label: 'Tax & Regulatory', icon: FileText },
                { id: 'bank', label: 'Bank & Settlement', icon: Landmark },
                { id: 'docs', label: `Submitted Documents (${getDistributorDocs(selectedDst).length})`, icon: ShieldCheck },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = dstTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDstTab(tab.id as typeof dstTab)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#0B1F3A] shadow-xs border border-[#E2E8F0]'
                        : 'text-[#5A6B82] hover:text-[#0B1F3A] hover:bg-white/50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FF7A18]' : 'text-[#5A6B82]'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Sections */}
            <div className="space-y-4">
              {/* SECTION 1: ENTITY IDENTITY & CONTACT DESK */}
              {(dstTab === 'all' || dstTab === 'entity') && (
                <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0B1F3A]">1. Commercial Entity & Corporate Contacts</h4>
                        <p className="text-[11px] text-[#5A6B82]">Business constitution and primary contact desk submitted during sign up</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono-code bg-[#F4F7FC] px-2.5 py-1 rounded-md text-[#5A6B82] border border-[#E2E8F0]">
                      Reg ID: {selectedDst.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Trade / Firm Name
                      </span>
                      <p className="font-bold text-[#0B1F3A] mt-1 text-sm">{selectedDst.companyName}</p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">{selectedDst.legalEntityType || 'Partnership Firm'}</p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Established Year
                      </span>
                      <p className="font-bold text-[#0B1F3A] mt-1 text-sm flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        Year {selectedDst.establishedYear || 2016}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                        {new Date().getFullYear() - (selectedDst.establishedYear || 2016)} Years Regional Trading Experience
                      </p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Business Website
                      </span>
                      <a
                        href={selectedDst.website ? `https://${selectedDst.website}` : '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-blue-600 hover:text-blue-800 mt-1 flex items-center gap-1 text-xs truncate"
                      >
                        <Globe className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{selectedDst.website || 'www.polymerdistributors.in'}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">Commercial Web Portal</p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] sm:col-span-2 lg:col-span-3">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Registered Business Office Address
                      </span>
                      <p className="font-medium text-[#0B1F3A] mt-1">
                        {selectedDst.officeAddress || `${selectedDst.city}, Gujarat State`}
                      </p>
                    </div>

                    {/* Authorized Contact Person */}
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Authorized Representative
                      </span>
                      <p className="font-bold text-[#0B1F3A] mt-1 text-sm">{selectedDst.contactPerson}</p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5 flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-[#5A6B82]" />
                        {selectedDst.designation || 'Managing Partner'}
                      </p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                          Primary Mobile / Direct
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedDst.phone, 'Phone Number')}
                          className="text-[#5A6B82] hover:text-[#0B1F3A] p-0.5 cursor-pointer"
                          title="Copy Phone"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-bold text-[#0B1F3A] mt-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        {selectedDst.phone}
                      </p>
                      {selectedDst.altPhone && (
                        <p className="text-[11px] text-[#5A6B82] mt-0.5">Alt / Desk: {selectedDst.altPhone}</p>
                      )}
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                          Official Procurement Email
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedDst.email, 'Email Address')}
                          className="text-[#5A6B82] hover:text-[#0B1F3A] p-0.5 cursor-pointer"
                          title="Copy Email"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-bold text-[#0B1F3A] mt-1 flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{selectedDst.email}</span>
                      </p>
                      <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Verified Primary Account Email</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: WAREHOUSE & TRADING CAPACITY */}
              {(dstTab === 'all' || dstTab === 'trade') && (
                <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        <Warehouse className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0B1F3A]">2. Warehouse Logistics & Trade Procurement</h4>
                        <p className="text-[11px] text-[#5A6B82]">Storage facilities, credit limit, and polymer purchase volumes</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {selectedDst.tradeVolumeYear} Annual Turnover
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] sm:col-span-2 lg:col-span-3">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Operating Warehouse & Depot Address
                      </span>
                      <p className="font-semibold text-[#0B1F3A] mt-1 text-sm flex items-start gap-1.5">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>
                          {selectedDst.warehouseAddress || `${selectedDst.city} Industrial Area, Gujarat - ${selectedDst.pincode || '382415'}`}
                        </span>
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#5A6B82]">
                        <span className="bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                          City / Hub: <strong className="text-[#0B1F3A]">{selectedDst.city}</strong>
                        </span>
                        <span className="bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                          District: <strong className="text-[#0B1F3A]">{selectedDst.district || selectedDst.city}</strong>
                        </span>
                        <span className="bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                          PIN: <strong className="text-[#0B1F3A]">{selectedDst.pincode || '382415'}</strong>
                        </span>
                        <span className="bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                          State: <strong className="text-[#0B1F3A]">{selectedDst.state || 'Gujarat'}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Annual Trade Volume
                      </span>
                      <p className="text-lg font-extrabold text-emerald-700 mt-1 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        {selectedDst.tradeVolumeYear}
                      </p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">Audited FY Turnover</p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Platform Escrow Credit Limit
                      </span>
                      <p className="text-lg font-extrabold text-[#0B1F3A] mt-1 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-purple-600" />
                        {selectedDst.creditLimit}
                      </p>
                      <p className="text-[11px] text-purple-700 font-semibold mt-0.5">Revolving Procurement Line</p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Warehouse Covered Area
                      </span>
                      <p className="text-lg font-extrabold text-[#0B1F3A] mt-1 flex items-center gap-1.5">
                        <Maximize2 className="w-4 h-4 text-blue-600" />
                        {(selectedDst.warehouseCapacitySqFt || 20000).toLocaleString()} sq.ft
                      </p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">
                        Monthly Procurement: <strong>{selectedDst.monthlyProcurementMt || 300} MT</strong>
                      </p>
                    </div>

                    {/* Target Polymers */}
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] sm:col-span-2 lg:col-span-3">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block mb-2">
                        Target Polymer Resins & Grades Procured
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedDst.targetPolymers || ['HDPE Granules', 'LLDPE Film Resins', 'PP Homopolymer', 'PVC Resins']).map(
                          (poly, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 bg-white text-[#0B1F3A] rounded-lg font-semibold text-xs border border-[#E2E8F0] inline-flex items-center gap-1.5 shadow-2xs"
                            >
                              <Tag className="w-3 h-3 text-[#FF7A18]" />
                              <span>{poly}</span>
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: TAX & STATUTORY IDENTIFICATIONS */}
              {(dstTab === 'all' || dstTab === 'tax') && (
                <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0B1F3A]">3. Tax, Statutory & Government Identifications</h4>
                        <p className="text-[11px] text-[#5A6B82]">Statutory licenses and business identification credentials</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono-code bg-[#F4F7FC] px-2.5 py-1 rounded-md text-[#0B1F3A] border border-[#E2E8F0]">
                      GSTIN State Code: 24 (Gujarat)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                    {/* GSTIN */}
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                          GSTIN Registration (REG-06)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedDst.gstin, 'GSTIN')}
                          className="text-[#5A6B82] hover:text-[#0B1F3A] p-0.5 cursor-pointer"
                          title="Copy GSTIN"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-mono-code font-bold text-sm text-[#0B1F3A] mt-1">{selectedDst.gstin}</p>
                      <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Active & Verified Regular Taxpayer</p>
                    </div>

                    {/* PAN */}
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                          Entity PAN Card
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedDst.panNumber || 'ABFPS1092M', 'PAN Number')}
                          className="text-[#5A6B82] hover:text-[#0B1F3A] p-0.5 cursor-pointer"
                          title="Copy PAN"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-mono-code font-bold text-sm text-[#0B1F3A] mt-1">
                        {selectedDst.panNumber || 'ABFPS1092M'}
                      </p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">Income Tax Department of India</p>
                    </div>

                    {/* Trade / ROC Registration */}
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                          Trade / ROC License Ref
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedDst.cinNumber || 'PRT/GJ/AHD/2016/8812', 'License Number')}
                          className="text-[#5A6B82] hover:text-[#0B1F3A] p-0.5 cursor-pointer"
                          title="Copy Ref"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-mono-code font-bold text-xs text-[#0B1F3A] mt-1 truncate">
                        {selectedDst.cinNumber || 'PRT/GJ/AHD/2016/8812'}
                      </p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">Gujarat Municipal & Trade Authority</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: BANK ACCOUNT & ESCROW SETTLEMENT */}
              {(dstTab === 'all' || dstTab === 'bank') && (
                <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                        <Landmark className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0B1F3A]">4. Bank Account & Escrow Settlement</h4>
                        <p className="text-[11px] text-[#5A6B82]">Settlement current account registered for Escrow RFQ purchases</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                      Escrow Linked
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Beneficiary Account Name
                      </span>
                      <p className="font-bold text-[#0B1F3A] mt-1 text-sm">
                        {selectedDst.accountHolderName || selectedDst.companyName}
                      </p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">Commercial Current Account</p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Bank Name & Branch
                      </span>
                      <p className="font-bold text-[#0B1F3A] mt-1 text-sm flex items-center gap-1.5">
                        <Landmark className="w-3.5 h-3.5 text-purple-600" />
                        {selectedDst.bankName || 'HDFC Bank Ltd'}
                      </p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">
                        {selectedDst.bankBranch || `${selectedDst.city} Industrial Branch`}
                      </p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                          Bank Account Number
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedDst.bankAccountNo || '50200077182901', 'Account Number')}
                          className="text-[#5A6B82] hover:text-[#0B1F3A] p-0.5 cursor-pointer"
                          title="Copy Account Number"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-mono-code font-bold text-sm text-[#0B1F3A] mt-1">
                        {selectedDst.bankAccountNo || '50200077182901'}
                      </p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">
                        IFSC: <strong className="font-mono-code text-[#0B1F3A]">{selectedDst.bankIfsc || 'HDFC0000412'}</strong>
                      </p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] sm:col-span-2 lg:col-span-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs text-[#0B1F3A] font-semibold">
                          Bank Verification Status: Cancelled Cheque Leaf Uploaded & Matches Commercial Firm Title
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                        Direct Debit Enabled
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 5: REGISTRATION & COMPLIANCE DOCUMENTS */}
              {(dstTab === 'all' || dstTab === 'docs') && (
                <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0B1F3A]">5. Submitted Registration Documents</h4>
                        <p className="text-[11px] text-[#5A6B82]">Certificates and verification files uploaded at sign up</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                      {getDistributorDocs(selectedDst).length} Documents On Record
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {getDistributorDocs(selectedDst).map((doc, idx) => (
                      <div
                        key={doc.id || idx}
                        className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-[#CBD5E1] transition-all flex items-start justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-bold text-[#0B1F3A] text-xs truncate">{doc.docType}</h5>
                            <p className="text-[11px] font-mono-code text-[#5A6B82] truncate mt-0.5">
                              {doc.fileName} • {doc.fileSize}
                            </p>
                            {doc.documentNumber && (
                              <p className="text-[10px] text-[#5A6B82] mt-0.5 font-mono-code">
                                Ref: {doc.documentNumber}
                              </p>
                            )}
                            <div className="mt-1.5 flex items-center gap-1.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  doc.status === 'Verified'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {doc.status}
                              </span>
                              <span className="text-[10px] text-slate-400">Uploaded {doc.uploadDate}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setPreviewDoc({
                              title: doc.docType,
                              fileName: doc.fileName,
                              size: doc.fileSize,
                              docNumber: doc.documentNumber,
                              status: doc.status,
                              uploadDate: doc.uploadDate,
                            })
                          }
                          className="px-2.5 py-1.5 bg-white hover:bg-[#0B1F3A] text-[#0B1F3A] hover:text-white border border-[#CBD5E1] rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setSelectedDst(null)}
                className="px-4 py-2.5 text-xs font-bold text-[#5A6B82] hover:text-[#0B1F3A] hover:bg-[#F1F5F9] rounded-xl cursor-pointer transition-colors"
              >
                Close
              </button>

              {selectedDst.kycStatus === 'Pending' && (
                <button
                  type="button"
                  onClick={() => {
                    const d = selectedDst;
                    setSelectedDst(null);
                    setRejectDst(d);
                    setRejectReason(d.kycReason || '');
                  }}
                  className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Reject KYC
                </button>
              )}

              {selectedDst.kycStatus !== 'Approved' && (
                <button
                  type="button"
                  onClick={() => {
                    onApprove(selectedDst.id);
                    setSelectedDst(null);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Distributor KYC</span>
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* DOCUMENT PREVIEW MODAL */}
      <Modal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc?.title || 'Document Preview'}
        subtitle={`${previewDoc?.fileName} • ${previewDoc?.size}`}
        maxWidth="md"
      >
        {previewDoc && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#5A6B82] font-semibold">Verification Status:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    previewDoc.status === 'Verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {previewDoc.status}
                </span>
              </div>

              {previewDoc.docNumber && (
                <div className="flex items-center justify-between">
                  <span className="text-[#5A6B82] font-semibold">Document / Reg Number:</span>
                  <span className="font-mono-code font-bold text-[#0B1F3A]">{previewDoc.docNumber}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-[#5A6B82] font-semibold">File Name:</span>
                <span className="font-mono-code text-[#0B1F3A]">{previewDoc.fileName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#5A6B82] font-semibold">File Size:</span>
                <span className="text-[#0B1F3A]">{previewDoc.size}</span>
              </div>

              {previewDoc.uploadDate && (
                <div className="flex items-center justify-between">
                  <span className="text-[#5A6B82] font-semibold">Submission Date:</span>
                  <span className="text-[#0B1F3A]">{previewDoc.uploadDate}</span>
                </div>
              )}
            </div>

            {/* Document Mock Viewer Card */}
            <div className="p-6 bg-white rounded-xl border-2 border-dashed border-[#CBD5E1] text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 mx-auto flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-[#0B1F3A] text-sm">{previewDoc.title}</h4>
              <p className="text-[#5A6B82] text-xs">
                Official PDF Document on Government & Bank Record. Verified via Gujarat Portal Digilocker & GSTIN network.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 text-xs font-bold text-[#5A6B82] hover:text-[#0B1F3A] rounded-xl cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* REJECT MODAL */}
      <Modal
        isOpen={!!rejectDst}
        onClose={() => setRejectDst(null)}
        title="Reject Distributor KYC"
        subtitle={`Provide reason for ${rejectDst?.companyName}`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
              Rejection Reason
            </label>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Bank statement outdated or credit verification failed..."
              className="w-full p-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setRejectDst(null)}
              className="px-4 py-2 text-xs font-bold text-[#5A6B82] hover:text-[#0B1F3A] rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmReject}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>

      {/* SUSPEND MODAL */}
      <Modal
        isOpen={!!suspendDst}
        onClose={() => setSuspendDst(null)}
        title={
          suspendDst?.status === 'Active'
            ? 'Suspend Distributor Account'
            : 'Reactivate Distributor Account'
        }
        subtitle={suspendDst?.companyName}
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#5A6B82] leading-relaxed">
            {suspendDst?.status === 'Active'
              ? 'Suspending this distributor will immediately freeze their RFQ creation and escrow payment authorizations.'
              : 'Reactivating this distributor will restore purchasing access on the Gujarat regional network.'}
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setSuspendDst(null)}
              className="px-4 py-2 text-xs font-bold text-[#5A6B82] hover:text-[#0B1F3A] rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmSuspend}
              className={`px-4 py-2 text-xs font-bold text-white rounded-xl ${
                suspendDst?.status === 'Active'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {suspendDst?.status === 'Active' ? 'Yes, Suspend' : 'Yes, Reactivate'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
