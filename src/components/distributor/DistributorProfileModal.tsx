import React, { useState } from 'react';
import {
  X,
  Building2,
  ShieldCheck,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Edit3,
  Save,
  CheckCircle2,
  CreditCard,
  Layers,
} from 'lucide-react';
import { DistributorProfileData } from '../../types';

interface DistributorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: DistributorProfileData;
  onUpdateProfile?: (updated: Partial<DistributorProfileData>) => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
}

export const DistributorProfileModal: React.FC<DistributorProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onShowToast,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    companyName: profile.companyName || 'Apex Polymers & Distributors LLP',
    businessType: profile.businessType || 'Wholesaler & Stockist',
    gstin: profile.gstin || '24AAKCA5423E1Z4',
    pan: profile.pan || profile.panNumber || 'AAKCA5423E',
    contactPerson: profile.contactPerson || profile.primaryContactPerson || 'Rajesh Singhania',
    designation: 'Managing Partner & Procurement Head',
    phone: profile.phone || '+91 98250 11422',
    email: profile.email || 'procure@apexpolymers.in',
    officeAddress: profile.officeAddress || 'Plot 42, GIDC Vatva Phase IV',
    city: profile.city || 'Ahmedabad',
    state: profile.state || 'Gujarat',
    pincode: profile.pincode || '382445',
    annualTurnover: profile.annualTurnover || profile.annualSourcingVolume || '₹4.85 Crore',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile(formData);
    }
    setIsEditing(false);
    if (onShowToast) {
      onShowToast('Profile Updated', 'Wholesaler profile details saved successfully.', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#6F42C1]/10 text-[#6F42C1] flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Profile Details</h3>
              <p className="text-[11px] text-[#5A6B82]">Wholesaler & Buyer Information</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5A6B82] hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Top Identity Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#6F42C1] to-[#5C35A5] text-white flex items-center justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-extrabold text-sm">{formData.companyName}</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white">
                  {profile.subscriptionTier || 'PRO'}
                </span>
              </div>
              <p className="text-xs text-purple-100 font-medium flex items-center gap-1.5">
                <span>{formData.businessType}</span>
                <span>•</span>
                <span className="text-purple-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-purple-200 font-semibold block">Buyer ID</span>
              <span className="font-mono text-xs font-bold text-purple-100">{profile.id || 'DST-GJ-9021'}</span>
            </div>
          </div>

          {!isEditing ? (
            /* Simple Data Show Mode */
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] font-bold text-[#5A6B82] uppercase block mb-0.5">
                    Contact Person
                  </span>
                  <span className="font-bold text-slate-900 block">{formData.contactPerson}</span>
                  <span className="text-[11px] text-[#5A6B82]">{formData.designation}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] font-bold text-[#5A6B82] uppercase block mb-0.5">
                    Mobile Number
                  </span>
                  <span className="font-bold text-slate-900 block">{formData.phone}</span>
                  <span className="text-[11px] text-emerald-700 font-semibold">✓ OTP Verified</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[10px] font-bold text-[#5A6B82] uppercase block mb-0.5">
                  Email Address
                </span>
                <span className="font-bold text-slate-900 block">{formData.email}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] font-bold text-[#5A6B82] uppercase block mb-0.5">
                    GSTIN (Gujarat)
                  </span>
                  <span className="font-mono font-bold text-slate-900">{formData.gstin}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] font-bold text-[#5A6B82] uppercase block mb-0.5">
                    PAN Number
                  </span>
                  <span className="font-mono font-bold text-slate-900">{formData.pan}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[10px] font-bold text-[#5A6B82] uppercase block mb-0.5">
                  Registered Depot / Address
                </span>
                <p className="font-medium text-slate-900">
                  {formData.officeAddress}, {formData.city}, {formData.state} - {formData.pincode}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#5A6B82] uppercase block">
                    Annual Polymer Sourcing
                  </span>
                  <span className="font-extrabold text-sm text-slate-900">{formData.annualTurnover}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#5A6B82] uppercase block">Credit Limit</span>
                  <span className="font-extrabold text-sm text-[#6F42C1]">{profile.creditLimit || '₹45,00,000'}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Simple Edit Form */
            <form id="profile-edit-form" onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-900 mb-1">Company Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#6F42C1] focus:ring-1 focus:ring-[#6F42C1] font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-900 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#6F42C1] focus:ring-1 focus:ring-[#6F42C1] font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-900 mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#6F42C1] focus:ring-1 focus:ring-[#6F42C1] font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-900 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#6F42C1] focus:ring-1 focus:ring-[#6F42C1] font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-900 mb-1">Office Address</label>
                <input
                  type="text"
                  value={formData.officeAddress}
                  onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#6F42C1] focus:ring-1 focus:ring-[#6F42C1] font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-900 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#6F42C1] focus:ring-1 focus:ring-[#6F42C1] font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-900 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#6F42C1] focus:ring-1 focus:ring-[#6F42C1] font-medium"
                    required
                  />
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          {!isEditing ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-slate-700 text-xs font-bold hover:bg-[#F4F7FC] cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-[#5A6B82] text-xs font-bold hover:bg-[#F4F7FC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="profile-edit-form"
                className="px-5 py-2 rounded-xl bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
