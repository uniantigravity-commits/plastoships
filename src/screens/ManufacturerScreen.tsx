import React, { useState } from 'react';
import {
  Factory,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Phone,
  Mail,
  MapPin,
  Ban,
  RotateCcw,
  Tag,
  Plus,
  X,
  Check,
  Building2,
  Globe,
  Calendar,
  FileText,
  CreditCard,
  Landmark,
  ShieldCheck,
  Layers,
  Zap,
  Maximize2,
  ExternalLink,
  Copy,
  Download,
  AlertCircle,
  Briefcase,
  Clock,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Manufacturer, KycStatus, Category } from '../types';
import { Modal } from '../components/Modal';

interface ManufacturerScreenProps {
  manufacturers: Manufacturer[];
  categories?: Category[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onToggleSuspend: (id: string) => void;
  onUpdateCategories?: (id: string, categories: string[]) => void;
}

export const ManufacturerScreen: React.FC<ManufacturerScreenProps> = ({
  manufacturers,
  categories,
  onApprove,
  onReject,
  onToggleSuspend,
  onUpdateCategories,
}) => {
  const [search, setSearch] = useState('');
  const [kycFilter, setKycFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected' | 'Suspended'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Modal states
  const [selectedMfr, setSelectedMfr] = useState<Manufacturer | null>(null);
  const [rejectMfr, setRejectMfr] = useState<Manufacturer | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [suspendMfr, setSuspendMfr] = useState<Manufacturer | null>(null);

  // Sign-Up Details View Tabs & Copy State
  const [mfrTab, setMfrTab] = useState<'all' | 'company' | 'plant' | 'tax' | 'bank' | 'docs'>('all');
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

  // Category editor state
  const [editingCategoryMfr, setEditingCategoryMfr] = useState<Manufacturer | null>(null);
  const [tempCategories, setTempCategories] = useState<string[]>([]);
  const [newCatInput, setNewCatInput] = useState('');

  const getCategories = (mfr: Manufacturer): string[] => {
    if (mfr.categories && mfr.categories.length > 0) {
      return mfr.categories;
    }
    if (mfr.category) {
      return mfr.category
        .split(/&|,/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return ['General Polymers'];
  };

  const getRegistrationDocs = (m: Manufacturer) => {
    if (m.registrationDocs && m.registrationDocs.length > 0) {
      return m.registrationDocs;
    }
    return [
      {
        id: `${m.id}-DOC-01`,
        docType: 'Certificate of Incorporation (COI)',
        documentNumber: m.cinNumber || 'U25209GJ2018PTC104521',
        fileName: `COI_${m.companyName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20)}.pdf`,
        fileSize: '1.4 MB',
        uploadDate: m.registeredDate,
        status: m.kycStatus === 'Approved' ? ('Verified' as const) : ('Pending Review' as const),
      },
      {
        id: `${m.id}-DOC-02`,
        docType: 'GSTIN Registration (REG-06)',
        documentNumber: m.gstin,
        fileName: `GSTIN_Registration_${m.gstin}.pdf`,
        fileSize: '1.2 MB',
        uploadDate: m.registeredDate,
        status: m.kycStatus === 'Approved' ? ('Verified' as const) : ('Pending Review' as const),
      },
      {
        id: `${m.id}-DOC-03`,
        docType: 'Company PAN Card Copy',
        documentNumber: m.panNumber,
        fileName: `PAN_${m.panNumber}.pdf`,
        fileSize: '820 KB',
        uploadDate: m.registeredDate,
        status: m.kycStatus === 'Approved' ? ('Verified' as const) : ('Pending Review' as const),
      },
      {
        id: `${m.id}-DOC-04`,
        docType: 'Factory Operating License (DISH)',
        documentNumber: m.factoryLicenseNo || `DISH/${m.city.toUpperCase().slice(0, 3)}/2024/8912`,
        fileName: `Factory_License_${m.city}_Plant.pdf`,
        fileSize: '2.1 MB',
        uploadDate: m.registeredDate,
        status: m.kycStatus === 'Approved' ? ('Verified' as const) : ('Pending Review' as const),
      },
      {
        id: `${m.id}-DOC-05`,
        docType: 'GPCB Air & Water Consent (CCA)',
        documentNumber: m.gpcbConsentNo || `GPCB/CCA-${m.city.toUpperCase().slice(0, 3)}-4190`,
        fileName: `GPCB_CCA_Consent_${m.city}.pdf`,
        fileSize: '1.8 MB',
        uploadDate: m.registeredDate,
        status: m.kycStatus === 'Approved' ? ('Verified' as const) : ('Pending Review' as const),
      },
      {
        id: `${m.id}-DOC-06`,
        docType: 'Udyam / MSME Registration Certificate',
        documentNumber: m.udyamRegistrationNo || `UDYAM-GJ-24-0019482`,
        fileName: `Udyam_Registration_${m.companyName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 16)}.pdf`,
        fileSize: '950 KB',
        uploadDate: m.registeredDate,
        status: m.kycStatus === 'Approved' ? ('Verified' as const) : ('Pending Review' as const),
      },
      {
        id: `${m.id}-DOC-07`,
        docType: 'Bank Cancelled Cheque Leaf',
        documentNumber: `CHQ-${m.bankName?.slice(0, 4) || 'HDFC'}-0192`,
        fileName: `Cancelled_Cheque_${m.bankName?.replace(/\s+/g, '_') || 'Bank'}.pdf`,
        fileSize: '610 KB',
        uploadDate: m.registeredDate,
        status: m.kycStatus === 'Approved' ? ('Verified' as const) : ('Pending Review' as const),
      },
    ];
  };

  const defaultCategoryNames = [
    'HDPE Granules',
    'Pipe Resins',
    'Blow Moulding',
    'Masterbatch & Additives',
    'Color Concentrates',
    'UV Stabilizers',
    'PP Woven Sacks',
    'Packaging Films',
    'BOPP Resins',
    'PET Preforms',
    'Bottles & Jars',
    'PVC Pipes & Compounds',
    'CPVC Resins',
    'Cable Compounds',
    'Rotomoulding Powders',
    'Water Storage Tanks',
    'LLDPE Granules',
    'Engineering Polymers',
    'Polyamides (Nylon)',
    'Polycarbonate (PC)',
  ];

  const availableCategoryNames = Array.from(
    new Set([
      ...defaultCategoryNames,
      ...(categories || []).map((c) => c.name),
      ...manufacturers.flatMap((m) => getCategories(m)),
    ])
  ).sort();

  const filtered = manufacturers.filter((m) => {
    const q = (search || '').toLowerCase().trim();
    const mfrCats = getCategories(m);

    // Status Filter (All, Pending, Approved, Rejected, Suspended)
    let matchesStatus = true;
    if (kycFilter === 'Pending') {
      matchesStatus = m.kycStatus === 'Pending' || m.accountStatus === 'Pending Review';
    } else if (kycFilter === 'Approved') {
      matchesStatus = m.kycStatus === 'Approved' && m.accountStatus !== 'Suspended';
    } else if (kycFilter === 'Rejected') {
      matchesStatus = m.kycStatus === 'Rejected' || m.accountStatus === 'Rejected';
    } else if (kycFilter === 'Suspended') {
      matchesStatus = m.accountStatus === 'Suspended';
    }
    if (!matchesStatus) return false;

    // Category Filter
    const matchesCategory =
      categoryFilter === 'All' ||
      mfrCats.some((c) => c.toLowerCase() === categoryFilter.toLowerCase());
    if (!matchesCategory) return false;

    // Search query
    if (!q) return true;
    return (
      (m.companyName || '').toLowerCase().includes(q) ||
      (m.contactPerson || '').toLowerCase().includes(q) ||
      (m.city || '').toLowerCase().includes(q) ||
      (m.id || '').toLowerCase().includes(q) ||
      (m.category || '').toLowerCase().includes(q) ||
      mfrCats.some((c) => c.toLowerCase().includes(q))
    );
  });

  const handleOpenCategoryEditor = (mfr: Manufacturer) => {
    setEditingCategoryMfr(mfr);
    setTempCategories([...getCategories(mfr)]);
    setNewCatInput('');
  };

  const handleToggleCategory = (catName: string) => {
    setTempCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  };

  const handleAddCustomCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newCatInput.trim();
    if (trimmed && !tempCategories.includes(trimmed)) {
      setTempCategories((prev) => [...prev, trimmed]);
      setNewCatInput('');
    }
  };

  const handleSaveCategories = () => {
    if (!editingCategoryMfr) return;
    if (tempCategories.length === 0) {
      alert('Please select at least one category.');
      return;
    }
    if (onUpdateCategories) {
      onUpdateCategories(editingCategoryMfr.id, tempCategories);
    }
    setEditingCategoryMfr(null);
  };

  const handleConfirmReject = () => {
    if (!rejectMfr) return;
    if (!rejectReason.trim()) {
      alert('Please enter a rejection reason.');
      return;
    }
    onReject(rejectMfr.id, rejectReason.trim());
    setRejectMfr(null);
    setRejectReason('');
  };

  const handleConfirmSuspend = () => {
    if (!suspendMfr) return;
    onToggleSuspend(suspendMfr.id);
    setSuspendMfr(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0B1F3A] tracking-tight">
            Manufacturer Management
          </h2>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left: Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-[#5A6B82] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search manufacturer, ID, city..."
              className="w-full h-10 pl-9.5 pr-4 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium placeholder-[#5A6B82] focus:outline-none focus:border-[#0B1F3A] focus:bg-white transition-all"
            />
          </div>

          {/* Category Filter Dropdown */}
          <div className="relative sm:w-56">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full h-10 px-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-semibold focus:outline-none focus:border-[#0B1F3A] focus:bg-white transition-all cursor-pointer"
            >
              <option value="All">All Categories</option>
              {availableCategoryNames.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* KYC / Account Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4F7FC] rounded-xl border border-[#E2E8F0] overflow-x-auto shrink-0">
          {(['All', 'Pending', 'Approved', 'Rejected', 'Suspended'] as const).map((tab) => {
            const count =
              tab === 'All'
                ? manufacturers.length
                : tab === 'Pending'
                ? manufacturers.filter((m) => m.kycStatus === 'Pending' || m.accountStatus === 'Pending Review').length
                : tab === 'Approved'
                ? manufacturers.filter((m) => m.kycStatus === 'Approved' && m.accountStatus !== 'Suspended').length
                : tab === 'Rejected'
                ? manufacturers.filter((m) => m.kycStatus === 'Rejected' || m.accountStatus === 'Rejected').length
                : manufacturers.filter((m) => m.accountStatus === 'Suspended').length;
            const isActive = kycFilter === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setKycFilter(tab)}
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

      {/* Manufacturers Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
                <th className="py-4 px-6 w-[24%]">Company Name</th>
                <th className="py-4 px-4 w-[16%]">Contact Person</th>
                <th className="py-4 px-4 w-[22%]">Categories</th>
                <th className="py-4 px-4 w-[14%]">Status</th>
                <th className="py-4 px-4 w-[12%]">Subscription</th>
                <th className="py-4 px-6 w-[12%] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#5A6B82]">
                    <Factory className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-sm text-[#0B1F3A]">No manufacturers found</p>
                    <p className="text-xs text-[#5A6B82] mt-0.5">Try modifying your search query or filter.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((mfr) => {
                  const mfrCats = getCategories(mfr);

                  return (
                    <tr key={mfr.id} className="hover:bg-[#F4F7FC]/70 transition-colors">
                      {/* Company Name + ID */}
                      <td className="py-4 px-6">
                        <div>
                          <span className="font-bold text-[#0B1F3A] hover:text-[#FF7A18] transition-colors block text-sm">
                            {mfr.companyName}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono-code text-[11px] text-[#5A6B82] bg-[#F4F7FC] px-1.5 py-0.5 rounded border border-slate-200">
                              {mfr.id}
                            </span>
                            <span className="text-[11px] text-[#5A6B82] flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {mfr.city}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Person */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <p className="font-bold text-[#0B1F3A]">{mfr.contactPerson}</p>
                        <p className="text-[11px] text-[#5A6B82]">{mfr.phone}</p>
                      </td>

                      {/* Categories (Multiple Categories Option) */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap items-center gap-1.5 max-w-[280px]">
                          {mfrCats.map((cat, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-[#F4F7FC] hover:bg-slate-200 text-[#0B1F3A] rounded-md font-medium text-[11px] border border-[#E2E8F0] inline-flex items-center gap-1 whitespace-nowrap transition-colors"
                            >
                              <Tag className="w-2.5 h-2.5 text-[#5A6B82]" />
                              <span>{cat}</span>
                            </span>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleOpenCategoryEditor(mfr)}
                            className="px-1.5 py-0.5 text-[10px] font-bold text-[#5A6B82] hover:text-[#0B1F3A] hover:bg-[#F4F7FC] rounded border border-dashed border-slate-300 hover:border-[#0B1F3A] transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                            title="Manage multiple categories"
                          >
                            <Plus className="w-2.5 h-2.5" />
                            <span>Add / Edit</span>
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {mfr.accountStatus === 'Suspended' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                            <Ban className="w-3.5 h-3.5 shrink-0" />
                            <span>Suspended</span>
                          </span>
                        ) : mfr.kycStatus === 'Approved' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>Approved</span>
                          </span>
                        ) : mfr.kycStatus === 'Pending' ? (
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

                      {/* Subscription */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-extrabold whitespace-nowrap ${
                            mfr.subscription === 'Diamond'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : mfr.subscription === 'Gold'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : mfr.subscription === 'Silver'
                              ? 'bg-slate-100 text-slate-700 border border-slate-300'
                              : 'bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          {mfr.subscription}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Approve and Reject Buttons (Shown when Pending Review) */}
                          {mfr.kycStatus === 'Pending' ? (
                            <>
                              <button
                                type="button"
                                onClick={() => onApprove(mfr.id)}
                                className="px-2.5 py-1 text-xs font-bold rounded-lg transition-colors shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                                title="Approve KYC"
                              >
                                Approve
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setRejectMfr(mfr);
                                  setRejectReason(mfr.kycReason || '');
                                }}
                                className="px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 cursor-pointer"
                                title="Reject KYC"
                              >
                                Reject
                              </button>
                            </>
                          ) : mfr.kycStatus === 'Rejected' ? (
                            <button
                              type="button"
                              onClick={() => onApprove(mfr.id)}
                              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                              title="Re-approve KYC"
                            >
                              Approve
                            </button>
                          ) : null}

                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() => setSelectedMfr(mfr)}
                            className="p-1.5 text-[#0B1F3A] hover:bg-[#F4F7FC] hover:text-[#FF7A18] rounded-lg border border-[#E2E8F0] transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Suspend / Reactivate (Only shown when approved) */}
                          {mfr.kycStatus === 'Approved' && (
                            <button
                              type="button"
                              onClick={() => setSuspendMfr(mfr)}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                mfr.accountStatus === 'Active'
                                  ? 'border-slate-200 text-[#5A6B82] hover:text-rose-600 hover:bg-rose-50'
                                  : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                              }`}
                              title={mfr.accountStatus === 'Active' ? 'Suspend Account' : 'Reactivate Account'}
                            >
                              {mfr.accountStatus === 'Active' ? (
                                <Ban className="w-4 h-4" />
                              ) : (
                                <RotateCcw className="w-4 h-4" />
                              )}
                            </button>
                          )}
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

      {/* MANAGE MULTIPLE CATEGORIES MODAL */}
      <Modal
        isOpen={!!editingCategoryMfr}
        onClose={() => setEditingCategoryMfr(null)}
        title="Manage Product Categories"
        subtitle={editingCategoryMfr ? `${editingCategoryMfr.companyName} (${editingCategoryMfr.id})` : ''}
        maxWidth="lg"
      >
        {editingCategoryMfr && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-2 uppercase tracking-wider">
                Selected Categories ({tempCategories.length})
              </label>
              {tempCategories.length === 0 ? (
                <p className="text-xs text-[#5A6B82] italic">No categories selected. Select from below or add a new category.</p>
              ) : (
                <div className="flex flex-wrap gap-2 p-3 bg-[#F4F7FC] rounded-xl border border-[#E2E8F0]">
                  {tempCategories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-1 bg-white text-[#0B1F3A] rounded-lg text-xs font-bold border border-[#E2E8F0] shadow-xs inline-flex items-center gap-1.5"
                    >
                      <Tag className="w-3 h-3 text-[#FF7A18]" />
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleCategory(cat)}
                        className="text-slate-400 hover:text-rose-600 ml-1 p-0.5 rounded cursor-pointer"
                        title="Remove category"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Select Marketplace Categories */}
            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-2 uppercase tracking-wider">
                Marketplace Categories (Click to toggle)
              </label>
              <div className="max-h-48 overflow-y-auto p-3 bg-white rounded-xl border border-[#E2E8F0] flex flex-wrap gap-2">
                {availableCategoryNames.map((cat) => {
                  const isSelected = tempCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleToggleCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#0B1F3A] text-white shadow-xs'
                          : 'bg-[#F4F7FC] text-[#5A6B82] hover:bg-slate-200 border border-[#E2E8F0]'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      ) : (
                        <Plus className="w-3 h-3 text-slate-400 shrink-0" />
                      )}
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add Custom Category */}
            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
                Add Custom Category Tag
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomCategory();
                    }
                  }}
                  placeholder="e.g. Biodegradable Polymers, Masterbatch Carrier..."
                  className="flex-1 h-10 px-3.5 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium placeholder-[#5A6B82] focus:outline-none focus:border-[#0B1F3A] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddCustomCategory}
                  className="px-4 py-2 bg-[#0B1F3A] hover:bg-[#122B4E] text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setEditingCategoryMfr(null)}
                className="px-4 py-2 text-xs font-bold text-[#5A6B82] hover:text-[#0B1F3A] rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCategories}
                className="px-5 py-2 bg-[#0B1F3A] hover:bg-[#122B4E] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Save Categories
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* VIEW MANUFACTURER DETAILS MODAL - ALL SIGN-UP DETAILS */}
      <Modal
        isOpen={!!selectedMfr}
        onClose={() => setSelectedMfr(null)}
        title={selectedMfr?.companyName || 'Manufacturer Details'}
        subtitle={`Application & Registration ID: ${selectedMfr?.id} • Submitted ${selectedMfr?.registeredDate}`}
        maxWidth="4xl"
      >
        {selectedMfr && (
          <div className="space-y-5">
            {/* Top Status, Tier & Notification Banner */}
            <div className="p-4 bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] rounded-2xl border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#5A6B82]">Application Status:</span>
                  {selectedMfr.kycStatus === 'Approved' ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified & Approved
                    </span>
                  ) : selectedMfr.kycStatus === 'Pending' ? (
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
                  <span className="text-xs font-bold text-[#5A6B82]">Selected Plan:</span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-[#0B1F3A] text-[#FF7A18] inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {selectedMfr.subscription} Tier
                  </span>
                </div>

                <div className="h-4 w-px bg-slate-300 hidden sm:block" />

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#5A6B82]">Entity:</span>
                  <span className="text-xs font-bold text-[#0B1F3A] bg-white px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                    {selectedMfr.legalEntityType || 'Private Limited Company'}
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
            {selectedMfr.kycReason && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-rose-900">Compliance Defect on Record:</p>
                  <p className="mt-0.5">{selectedMfr.kycReason}</p>
                </div>
              </div>
            )}

            {/* Navigation Tabs for Sign-Up Sections */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F1F5F9] rounded-xl overflow-x-auto border border-[#E2E8F0]">
              {[
                { id: 'all', label: 'All Application Details', icon: Layers },
                { id: 'company', label: 'Company & Desk', icon: Building2 },
                { id: 'plant', label: 'Plant & Facility', icon: Factory },
                { id: 'tax', label: 'Tax & Regulatory', icon: FileText },
                { id: 'bank', label: 'Bank & Settlement', icon: Landmark },
                { id: 'docs', label: `Submitted Documents (${getRegistrationDocs(selectedMfr).length})`, icon: ShieldCheck },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = mfrTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setMfrTab(tab.id as typeof mfrTab)}
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
              {/* SECTION 1: COMPANY & MANAGEMENT */}
              {(mfrTab === 'all' || mfrTab === 'company') && (
                <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0B1F3A]">1. Company Identity & Business Profile</h4>
                        <p className="text-[11px] text-[#5A6B82]">Legal details and corporate contacts submitted during sign up</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono-code bg-[#F4F7FC] px-2.5 py-1 rounded-md text-[#5A6B82] border border-[#E2E8F0]">
                      Reg ID: {selectedMfr.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Legal Business Name
                      </span>
                      <p className="font-bold text-[#0B1F3A] mt-1 text-sm">{selectedMfr.companyName}</p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">{selectedMfr.legalEntityType || 'Private Limited Company'}</p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Established & Incorporation
                      </span>
                      <p className="font-bold text-[#0B1F3A] mt-1 text-sm flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        Year {selectedMfr.establishedYear || 2018}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                        {new Date().getFullYear() - (selectedMfr.establishedYear || 2018)} Years in Polymer Industry
                      </p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Official Website
                      </span>
                      <a
                        href={selectedMfr.website ? `https://${selectedMfr.website}` : '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-blue-600 hover:text-blue-800 mt-1 flex items-center gap-1 text-xs truncate"
                      >
                        <Globe className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{selectedMfr.website || 'www.morbipolymers.in'}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">Verified Corporate Web Domain</p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] sm:col-span-2 lg:col-span-3">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Registered Corporate Office Address
                      </span>
                      <p className="font-medium text-[#0B1F3A] mt-1">
                        {selectedMfr.registeredOfficeAddress || selectedMfr.plantAddress || 'Plot No. 42-45, Survey 118/P, National Highway 8A, Makansar, Morbi, Gujarat 363642'}
                      </p>
                    </div>

                    {/* Authorized Signatory Details */}
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Authorized Signatory / MD
                      </span>
                      <p className="font-bold text-[#0B1F3A] mt-1 text-sm">{selectedMfr.contactPerson}</p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5 flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-[#5A6B82]" />
                        {selectedMfr.designation || 'Managing Director & Operations Head'}
                      </p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                          Mobile & Direct Desk
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedMfr.phone, 'Phone Number')}
                          className="text-[#5A6B82] hover:text-[#0B1F3A] p-0.5 cursor-pointer"
                          title="Copy Phone"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-bold text-[#0B1F3A] mt-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        {selectedMfr.phone}
                      </p>
                      {selectedMfr.altPhone && (
                        <p className="text-[11px] text-[#5A6B82] mt-0.5">Alt / Desk: {selectedMfr.altPhone}</p>
                      )}
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                          Official Corporate Email
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedMfr.email, 'Email Address')}
                          className="text-[#5A6B82] hover:text-[#0B1F3A] p-0.5 cursor-pointer"
                          title="Copy Email"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-bold text-[#0B1F3A] mt-1 flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{selectedMfr.email}</span>
                      </p>
                      <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Verified Primary Login Email</p>
                    </div>

                    {/* Authorized Categories */}
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] sm:col-span-2 lg:col-span-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                          Registered Manufacturing Categories & Resin Grades
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const m = selectedMfr;
                            setSelectedMfr(null);
                            handleOpenCategoryEditor(m);
                          }}
                          className="text-xs font-bold text-[#0B1F3A] hover:text-[#FF7A18] flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Manage Categories</span>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {getCategories(selectedMfr).map((cat, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-white text-[#0B1F3A] rounded-lg font-semibold text-xs border border-[#E2E8F0] inline-flex items-center gap-1.5 shadow-2xs"
                          >
                            <Tag className="w-3 h-3 text-[#FF7A18]" />
                            <span>{cat}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: PLANT & PRODUCTION INFRASTRUCTURE */}
              {(mfrTab === 'all' || mfrTab === 'plant') && (
                <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        <Factory className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0B1F3A]">2. Factory, Plant & Production Facilities</h4>
                        <p className="text-[11px] text-[#5A6B82]">Physical infrastructure and manufacturing capacities</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {selectedMfr.capacityMt.toLocaleString()} MT Installed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] sm:col-span-2 lg:col-span-3">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Manufacturing Works / Physical Plant Address
                      </span>
                      <p className="font-semibold text-[#0B1F3A] mt-1 text-sm flex items-start gap-1.5">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>
                          {selectedMfr.plantAddress || `${selectedMfr.industrialZone}, ${selectedMfr.city}, Gujarat - ${selectedMfr.pincode || '363642'}`}
                        </span>
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#5A6B82]">
                        <span className="bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                          Industrial Zone: <strong className="text-[#0B1F3A]">{selectedMfr.industrialZone}</strong>
                        </span>
                        <span className="bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                          District: <strong className="text-[#0B1F3A]">{selectedMfr.district || selectedMfr.city}</strong>
                        </span>
                        <span className="bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                          PIN Code: <strong className="text-[#0B1F3A]">{selectedMfr.pincode || '363642'}</strong>
                        </span>
                        <span className="bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                          State: <strong className="text-[#0B1F3A]">{selectedMfr.state || 'Gujarat'}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Annual Installed Capacity
                      </span>
                      <p className="text-lg font-extrabold text-emerald-700 mt-1">
                        {selectedMfr.capacityMt.toLocaleString()} MT
                      </p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">Continuous Polymer Processing</p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Connected Industrial Power Load
                      </span>
                      <p className="text-lg font-extrabold text-[#0B1F3A] mt-1 flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-500" />
                        {selectedMfr.powerLoadKw || 750} kW
                      </p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">High Tension (HT) Industrial Line</p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Factory Built-Up Area
                      </span>
                      <p className="text-lg font-extrabold text-[#0B1F3A] mt-1 flex items-center gap-1.5">
                        <Maximize2 className="w-4 h-4 text-blue-600" />
                        {(selectedMfr.plantAreaSqFt || 35000).toLocaleString()} sq.ft
                      </p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">Enclosed Shed & Warehousing</p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] sm:col-span-2 lg:col-span-3">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Production Machinery & Processing Setup
                      </span>
                      <p className="font-semibold text-[#0B1F3A] mt-1">
                        {selectedMfr.productionLines || '4 High-Speed Twin-Screw Extrusion Lines (Continuous Processing)'}
                      </p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">Equipped with gravimetric dosing and underwater pelletizing systems</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: TAX, STATUTORY & LEGAL IDENTIFICATIONS */}
              {(mfrTab === 'all' || mfrTab === 'tax') && (
                <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0B1F3A]">3. Tax, Statutory & Regulatory Identifications</h4>
                        <p className="text-[11px] text-[#5A6B82]">Government certificates and compliance numbers</p>
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
                          onClick={() => handleCopy(selectedMfr.gstin, 'GSTIN')}
                          className="text-[#5A6B82] hover:text-[#0B1F3A] p-0.5 cursor-pointer"
                          title="Copy GSTIN"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-mono-code font-bold text-sm text-[#0B1F3A] mt-1">{selectedMfr.gstin}</p>
                      <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Active & Verified Regular Taxpayer</p>
                    </div>

                    {/* PAN */}
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                          Company PAN Card
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedMfr.panNumber, 'PAN Number')}
                          className="text-[#5A6B82] hover:text-[#0B1F3A] p-0.5 cursor-pointer"
                          title="Copy PAN"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-mono-code font-bold text-sm text-[#0B1F3A] mt-1">{selectedMfr.panNumber}</p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">Income Tax Department of India</p>
                    </div>

                    {/* CIN */}
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                          Corporate ID (CIN / ROC)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedMfr.cinNumber, 'CIN Number')}
                          className="text-[#5A6B82] hover:text-[#0B1F3A] p-0.5 cursor-pointer"
                          title="Copy CIN"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-mono-code font-bold text-xs text-[#0B1F3A] mt-1 truncate">{selectedMfr.cinNumber}</p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">Registrar of Companies (ROC Gujarat)</p>
                    </div>

                    {/* MSME UDYAM */}
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                          MSME / Udyam Registration
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedMfr.udyamRegistrationNo || 'UDYAM-GJ-20-0019482', 'Udyam Number')}
                          className="text-[#5A6B82] hover:text-[#0B1F3A] p-0.5 cursor-pointer"
                          title="Copy Udyam"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-mono-code font-bold text-xs text-[#0B1F3A] mt-1">
                        {selectedMfr.udyamRegistrationNo || 'UDYAM-GJ-20-0019482'}
                      </p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">Ministry of Micro, Small & Medium Enterprises</p>
                    </div>

                    {/* DISH Factory License */}
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Factory Operating License (DISH)
                      </span>
                      <p className="font-mono-code font-bold text-xs text-[#0B1F3A] mt-1">
                        {selectedMfr.factoryLicenseNo || 'DISH/MOR/2024/8912'}
                      </p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">Directorate of Industrial Safety & Health</p>
                    </div>

                    {/* GPCB Consent */}
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        GPCB Pollution Consent (CCA)
                      </span>
                      <p className="font-mono-code font-bold text-xs text-[#0B1F3A] mt-1">
                        {selectedMfr.gpcbConsentNo || 'GPCB/CCA-MRB-4190'}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Consolidated Consent & Authorization</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: BANK ACCOUNT & ESCROW SETTLEMENT */}
              {(mfrTab === 'all' || mfrTab === 'bank') && (
                <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                        <Landmark className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0B1F3A]">4. Bank Account & Escrow Payout Settlement</h4>
                        <p className="text-[11px] text-[#5A6B82]">Settlement account for marketplace escrow disbursements</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                      Escrow Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Beneficiary Account Name
                      </span>
                      <p className="font-bold text-[#0B1F3A] mt-1 text-sm">{selectedMfr.accountHolderName || selectedMfr.companyName}</p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">Corporate Current Account</p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                        Bank Name & Branch
                      </span>
                      <p className="font-bold text-[#0B1F3A] mt-1 text-sm flex items-center gap-1.5">
                        <Landmark className="w-3.5 h-3.5 text-purple-600" />
                        {selectedMfr.bankName || 'HDFC Bank Ltd'}
                      </p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">{selectedMfr.bankBranch || 'Sanala Road Branch, Morbi'}</p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                          Bank Account Number
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedMfr.bankAccountNo || '50200088192341', 'Account Number')}
                          className="text-[#5A6B82] hover:text-[#0B1F3A] p-0.5 cursor-pointer"
                          title="Copy Account Number"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-mono-code font-bold text-sm text-[#0B1F3A] mt-1">
                        {selectedMfr.bankAccountNo || '50200088192341'}
                      </p>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">
                        IFSC: <strong className="font-mono-code text-[#0B1F3A]">{selectedMfr.bankIfsc || 'HDFC0001092'}</strong>
                      </p>
                    </div>

                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] sm:col-span-2 lg:col-span-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs text-[#0B1F3A] font-semibold">
                          Bank Verification Status: Cancelled Cheque Leaf Uploaded & Matches Corporate Legal Name
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                        Payout Enabled
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 5: REGISTRATION & COMPLIANCE DOCUMENTS */}
              {(mfrTab === 'all' || mfrTab === 'docs') && (
                <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0B1F3A]">5. Submitted Registration & KYC Documents</h4>
                        <p className="text-[11px] text-[#5A6B82]">All certificates, licenses, and statutory files submitted at sign up</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                      {getRegistrationDocs(selectedMfr).length} Documents On Record
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {getRegistrationDocs(selectedMfr).map((doc, idx) => (
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

              {/* SECTION 6: PLATFORM COMMERCIALS & LISTINGS */}
              {mfrTab === 'all' && (
                <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                      Marketplace Listings & Inventory
                    </span>
                    <p className="font-bold text-[#0B1F3A] text-sm mt-0.5">
                      {selectedMfr.productsCount} Active Polymer Product Catalog Listings
                    </p>
                  </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#5A6B82]">Trading Account Status:</span>
                      {selectedMfr.accountStatus === 'Pending Review' || selectedMfr.kycStatus === 'Pending' ? (
                        <span className="text-amber-700 font-bold flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                          Pending Review
                        </span>
                      ) : selectedMfr.accountStatus === 'Rejected' || selectedMfr.kycStatus === 'Rejected' ? (
                        <span className="text-rose-600 font-bold flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                          Rejected
                        </span>
                      ) : selectedMfr.accountStatus === 'Suspended' ? (
                        <span className="text-rose-700 font-bold flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                          Suspended
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          Active
                        </span>
                      )}
                    </div>
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setSelectedMfr(null)}
                className="px-4 py-2.5 text-xs font-bold text-[#5A6B82] hover:text-[#0B1F3A] hover:bg-[#F1F5F9] rounded-xl cursor-pointer transition-colors"
              >
                Close
              </button>

              {selectedMfr.kycStatus === 'Pending' && (
                <button
                  type="button"
                  onClick={() => {
                    const m = selectedMfr;
                    setSelectedMfr(null);
                    setRejectMfr(m);
                    setRejectReason(m.kycReason || '');
                  }}
                  className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Reject KYC
                </button>
              )}

              {selectedMfr.kycStatus !== 'Approved' && (
                <button
                  type="button"
                  onClick={() => {
                    onApprove(selectedMfr.id);
                    setSelectedMfr(null);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve KYC Compliance</span>
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
                Official PDF Document on Government / Corporate Record. Verified via Gujarat Portal Digilocker & GSTIN network.
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

      {/* REJECT REASON MODAL */}
      <Modal
        isOpen={!!rejectMfr}
        onClose={() => setRejectMfr(null)}
        title="Reject Manufacturer KYC"
        subtitle={`Provide a compliance reason for ${rejectMfr?.companyName}`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            The manufacturer will receive this notice to re-upload verified documentation.
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
              Rejection Reason / Missing Documentation
            </label>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Factory license expired; GST address differs from electricity bill..."
              className="w-full p-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A] focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setRejectMfr(null)}
              className="px-4 py-2 text-xs font-bold text-[#5A6B82] hover:text-[#0B1F3A] rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmReject}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>

      {/* SUSPEND CONFIRMATION MODAL */}
      <Modal
        isOpen={!!suspendMfr}
        onClose={() => setSuspendMfr(null)}
        title={
          suspendMfr?.accountStatus === 'Active'
            ? 'Suspend Manufacturer Account'
            : 'Reactivate Manufacturer Account'
        }
        subtitle={suspendMfr?.companyName}
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#5A6B82] leading-relaxed">
            {suspendMfr?.accountStatus === 'Active'
              ? 'Are you sure you want to suspend this manufacturer? Their products will be hidden from the public PlastoShip catalog and RFQ bidding will be disabled.'
              : 'Reactivating this manufacturer will restore catalog visibility and bidding rights across Gujarat.'}
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setSuspendMfr(null)}
              className="px-4 py-2 text-xs font-bold text-[#5A6B82] hover:text-[#0B1F3A] rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmSuspend}
              className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs cursor-pointer ${
                suspendMfr?.accountStatus === 'Active'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {suspendMfr?.accountStatus === 'Active' ? 'Yes, Suspend Account' : 'Yes, Reactivate Account'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
