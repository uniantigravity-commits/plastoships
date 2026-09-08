import React, { useState } from 'react';
import {
  X,
  Building2,
  ShieldCheck,
  User,
  Phone,
  Mail,
  MapPin,
  Factory,
  Zap,
  Gauge,
  Calendar,
  Layers,
  Edit3,
  Save,
  CheckCircle2,
  FileText,
  CreditCard,
} from 'lucide-react';
import { ManufacturerProfileData } from '../../types';

interface ManufacturerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ManufacturerProfileData;
  onUpdateProfile?: (updated: ManufacturerProfileData) => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ManufacturerProfileModal: React.FC<ManufacturerProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onShowToast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'statutory'>('overview');

  const [formData, setFormData] = useState<ManufacturerProfileData>({ ...profile });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile(formData);
    }
    setIsEditing(false);
    if (onShowToast) {
      onShowToast('Plant Profile Saved', 'Manufacturer plant specifications updated successfully.', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4B49AC] text-white flex items-center justify-center font-bold">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">Plant & Company Profile</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                  {profile.subscriptionTier || 'Diamond'} Plant
                </span>
              </div>
              <p className="text-[11px] text-[#5A6B82]">
                {profile.companyName} • ID: {profile.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] hover:border-[#4B49AC] hover:text-[#4B49AC] text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...profile });
                  setIsEditing(false);
                }}
                className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] text-[#5A6B82] hover:text-slate-900 text-xs font-bold transition-all cursor-pointer bg-white"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#5A6B82] hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Summary Banner */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-[#4B49AC] to-[#3F3D99] text-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg">
              {profile.companyName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">{formData.companyName}</p>
              <p className="text-xs text-indigo-100 font-medium">
                {formData.industrialZone}, {formData.city}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> KYC Verified
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-400 text-slate-900">
              {formData.capacityMt.toLocaleString('en-IN')} MT / Yr
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#E2E8F0] bg-[#F8FAFC] px-6">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-[#4B49AC] text-[#4B49AC] bg-white'
                : 'border-transparent text-[#5A6B82] hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Company & Plant</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('technical')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'technical'
                ? 'border-[#4B49AC] text-[#4B49AC] bg-white'
                : 'border-transparent text-[#5A6B82] hover:text-slate-900'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Technical & Capacity</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('statutory')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'statutory'
                ? 'border-[#4B49AC] text-[#4B49AC] bg-white'
                : 'border-transparent text-[#5A6B82] hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Statutory & Banking</span>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] disabled:bg-[#F8FAFC] disabled:text-[#5A6B82] text-slate-900 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Primary Contact Person
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] disabled:bg-[#F8FAFC] disabled:text-[#5A6B82] text-slate-900 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] disabled:bg-[#F8FAFC] disabled:text-[#5A6B82] text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] disabled:bg-[#F8FAFC] disabled:text-[#5A6B82] text-slate-900 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] disabled:bg-[#F8FAFC] disabled:text-[#5A6B82] text-slate-900 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Alternate Phone
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.altPhone || ''}
                    onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                    className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] disabled:bg-[#F8FAFC] disabled:text-[#5A6B82] text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Plant / Factory Address
                </label>
                <textarea
                  rows={2}
                  disabled={!isEditing}
                  value={formData.plantAddress}
                  onChange={(e) => setFormData({ ...formData, plantAddress: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E2E8F0] disabled:bg-[#F8FAFC] disabled:text-[#5A6B82] text-slate-900 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Industrial Zone</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.industrialZone}
                    onChange={(e) => setFormData({ ...formData, industrialZone: e.target.value })}
                    className="w-full h-9 px-2.5 rounded-lg border border-[#E2E8F0] disabled:bg-[#F8FAFC] text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">City</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full h-9 px-2.5 rounded-lg border border-[#E2E8F0] disabled:bg-[#F8FAFC] text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">State</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full h-9 px-2.5 rounded-lg border border-[#E2E8F0] disabled:bg-[#F8FAFC] text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Pincode</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full h-9 px-2.5 rounded-lg border border-[#E2E8F0] disabled:bg-[#F8FAFC] text-xs font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Annual Polymer Capacity (MT)
                  </label>
                  <input
                    type="number"
                    disabled={!isEditing}
                    value={formData.capacityMt}
                    onChange={(e) => setFormData({ ...formData, capacityMt: Number(e.target.value) })}
                    className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] disabled:bg-[#F8FAFC] disabled:text-[#5A6B82] text-slate-900 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Connected Power Load (kW)
                  </label>
                  <input
                    type="number"
                    disabled={!isEditing}
                    value={formData.powerLoadKw}
                    onChange={(e) => setFormData({ ...formData, powerLoadKw: Number(e.target.value) })}
                    className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] disabled:bg-[#F8FAFC] disabled:text-[#5A6B82] text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Plant Floor Area (Sq. Ft.)
                  </label>
                  <input
                    type="number"
                    disabled={!isEditing}
                    value={formData.plantAreaSqFt}
                    onChange={(e) => setFormData({ ...formData, plantAreaSqFt: Number(e.target.value) })}
                    className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] disabled:bg-[#F8FAFC] disabled:text-[#5A6B82] text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Established Year
                  </label>
                  <input
                    type="number"
                    disabled={!isEditing}
                    value={formData.establishedYear}
                    onChange={(e) => setFormData({ ...formData, establishedYear: Number(e.target.value) })}
                    className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] disabled:bg-[#F8FAFC] disabled:text-[#5A6B82] text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Polymer Product Category
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.primaryCategory}
                  onChange={(e) => setFormData({ ...formData, primaryCategory: e.target.value })}
                  className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] disabled:bg-[#F8FAFC] disabled:text-[#5A6B82] text-slate-900 font-medium"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-slate-900 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-amber-900">Gujarat Pollution Control Board (GPCB) Status</p>
                  <p className="text-[11px] text-amber-700">Valid Consolidated Consent & Authorization (CC&A) on file</p>
                </div>
                <span className="px-2 py-1 rounded bg-amber-200/80 text-amber-900 font-bold text-[10px]">
                  Valid till 2028
                </span>
              </div>
            </div>
          )}

          {activeTab === 'statutory' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                    className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] disabled:bg-[#F8FAFC] font-mono font-bold text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.panNumber}
                    onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                    className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] disabled:bg-[#F8FAFC] font-mono font-bold text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    CIN Number
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.cinNumber || ''}
                    onChange={(e) => setFormData({ ...formData, cinNumber: e.target.value })}
                    className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] disabled:bg-[#F8FAFC] font-mono font-bold text-xs"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-3">
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#4B49AC]" />
                  Verified Escrow Settlement Bank Account
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#5A6B82] uppercase mb-1">Bank Name</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full h-8.5 px-2.5 rounded-lg border border-[#E2E8F0] disabled:bg-white text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#5A6B82] uppercase mb-1">Account Number</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.bankAccountNo}
                      onChange={(e) => setFormData({ ...formData, bankAccountNo: e.target.value })}
                      className="w-full h-8.5 px-2.5 rounded-lg border border-[#E2E8F0] disabled:bg-white font-mono text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#5A6B82] uppercase mb-1">IFSC Code</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.bankIfsc}
                      onChange={(e) => setFormData({ ...formData, bankIfsc: e.target.value })}
                      className="w-full h-8.5 px-2.5 rounded-lg border border-[#E2E8F0] disabled:bg-white font-mono text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#5A6B82] uppercase mb-1">Branch</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.bankBranch || 'Morbi Main Branch'}
                      onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })}
                      className="w-full h-8.5 px-2.5 rounded-lg border border-[#E2E8F0] disabled:bg-white text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
            <span className="text-[11px] text-[#5A6B82]">
              Profile Completion Score: <strong className="text-emerald-600 font-bold">{formData.completionScore || 100}%</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-slate-700 text-xs font-bold hover:bg-[#F4F7FC] cursor-pointer"
              >
                Close
              </button>
              {isEditing && (
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#4B49AC] hover:bg-[#3F3D99] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
