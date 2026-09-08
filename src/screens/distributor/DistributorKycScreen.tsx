import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Edit,
  X,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { DistributorProfileData, DistributorKycDoc } from '../../types';
import { INITIAL_DISTRIBUTOR_PROFILE } from '../../mockData';

interface DistributorKycScreenProps {
  profile?: DistributorProfileData;
  kycDocs?: DistributorKycDoc[];
  onUpdateProfile: (updated: Partial<DistributorProfileData>) => void;
  onUploadDoc: (newDoc: Partial<DistributorKycDoc>) => void;
}

export const DistributorKycScreen: React.FC<DistributorKycScreenProps> = ({
  profile = INITIAL_DISTRIBUTOR_PROFILE,
  kycDocs = [],
  onUpdateProfile,
  onUploadDoc,
}) => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);

  // Edit Profile Form
  const [profileForm, setProfileForm] = useState({
    companyName: profile?.companyName || '',
    contactPerson: profile?.contactPerson || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    altPhone: profile?.altPhone || '',
    city: profile?.city || '',
    pincode: profile?.pincode || '',
    officeAddress: profile?.officeAddress || '',
    gstin: profile?.gstin || '',
    panNumber: profile?.panNumber || '',
  });

  // Upload Doc Form
  const [docForm, setDocForm] = useState({
    documentType: 'GSTIN Certificate (REG-06)',
    documentNumber: '24ABFPS1092M1ZK',
    description: 'Updated registration certificate',
    fileName: 'GST_Shreeji_Polymers_2026.pdf',
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileForm);
    setIsEditProfileOpen(false);
  };

  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: Partial<DistributorKycDoc> = {
      id: `DST-DOC-${Math.floor(10 + Math.random() * 90)}`,
      documentType: docForm.documentType,
      documentNumber: docForm.documentNumber,
      description: docForm.description,
      status: 'In Review',
      uploadDate: new Date().toISOString().split('T')[0],
      fileName: docForm.fileName,
      fileSize: '1.4 MB',
    };
    onUploadDoc(newDoc);
    setIsUploadDocOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#6F42C1] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
            SP
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#1E293B] tracking-tight">
                KYC & Legal Entity Profile
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#6F42C1]" />
                KYC Verified
              </span>
            </div>
            <p className="text-xs text-[#5A6B82] font-medium">
              GSTIN: {profile.gstin} • PAN: {profile.panNumber} • Verified Wholesaler Status Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsEditProfileOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#1E293B] hover:bg-[#6F42C1]/10 hover:border-[#6F42C1]/20 hover:text-[#6F42C1] text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
          >
            <Edit className="w-4 h-4 text-[#6F42C1]" />
            <span>Edit Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setIsUploadDocOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Business Information */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
              Wholesaler & Legal Registration Details
            </h3>
            <span className="font-mono text-xs font-bold text-[#5A6B82] bg-[#F4F7FC] px-2.5 py-0.5 rounded border border-[#E2E8F0]">
              {profile.id}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-bold text-[#5A6B82] uppercase">Trading Entity Name</span>
              <p className="font-extrabold text-[#1E293B] text-sm mt-0.5">{profile.companyName}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#5A6B82] uppercase">Business Constitution</span>
              <p className="font-extrabold text-[#1E293B] text-sm mt-0.5">{profile.businessType}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#5A6B82] uppercase">Authorized Procurement Officer</span>
              <p className="font-bold text-[#1E293B] mt-0.5">{profile.contactPerson}</p>
              <p className="text-[11px] text-[#5A6B82]">{profile.designation}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#5A6B82] uppercase">Contact Phone & Email</span>
              <p className="font-bold text-[#1E293B] mt-0.5">{profile.phone}</p>
              <p className="text-[11px] text-[#5A6B82]">{profile.email}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#5A6B82] uppercase">GSTIN (Gujarat)</span>
              <p className="font-mono font-bold text-[#1E293B] mt-0.5">{profile.gstin}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#5A6B82] uppercase">Company PAN Number</span>
              <p className="font-mono font-bold text-[#1E293B] mt-0.5">{profile.panNumber}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
            <span className="text-[10px] font-bold text-[#5A6B82] uppercase">
              Registered Office & Warehouse Depot
            </span>
            <div className="flex items-start gap-2 text-xs bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
              <MapPin className="w-4 h-4 text-[#6F42C1] shrink-0 mt-0.5" />
              <p className="font-medium text-[#1E293B] leading-relaxed">{profile.officeAddress}</p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Banking & Verification Score */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
                Verification Score
              </h3>
              <span className="text-sm font-black text-[#6F42C1]">{profile.completionScore}%</span>
            </div>

            <div className="w-full bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#6F42C1] h-full rounded-full transition-all"
                style={{ width: `${profile.completionScore}%` }}
              />
            </div>

            <div className="space-y-2 text-xs text-[#5A6B82]">
              <div className="flex items-center gap-2 text-[#6F42C1] font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#6F42C1]" />
                <span>GSTIN Certificate verified on Portal</span>
              </div>
              <div className="flex items-center gap-2 text-[#6F42C1] font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#6F42C1]" />
                <span>Bank Mandate & Cheque verified</span>
              </div>
              <div className="flex items-center gap-2 text-[#6F42C1] font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#6F42C1]" />
                <span>GIDC Warehouse NOC approved</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 space-y-3">
            <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
              Bank Refund Account
            </h3>
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">Bank Name:</span>
                <span className="font-bold text-[#1E293B]">{profile.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">Account No:</span>
                <span className="font-mono font-bold text-[#1E293B]">{profile.bankAccountNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">IFSC Code:</span>
                <span className="font-mono font-bold text-[#1E293B]">{profile.bankIfsc}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">Branch:</span>
                <span className="font-semibold text-[#1E293B]">{profile.bankBranch}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KYC Documents Vault */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#6F42C1]" />
            <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
              Regulatory Compliance & Document Vault
            </h3>
          </div>
          <span className="text-xs font-bold text-[#5A6B82]">
            {kycDocs.length} Documents on record
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
                <th className="py-3.5 px-6">Document Type</th>
                <th className="py-3.5 px-6">Document Ref #</th>
                <th className="py-3.5 px-6">File Name & Size</th>
                <th className="py-3.5 px-6">Upload Date</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-xs font-semibold text-[#1E293B]">
              {kycDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-extrabold text-[#1E293B]">{doc.documentType}</div>
                    <div className="text-[11px] text-[#5A6B82]">{doc.description}</div>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-[#1E293B]">{doc.documentNumber}</td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-[#1E293B]">{doc.fileName}</div>
                    <div className="text-[11px] text-[#5A6B82]">{doc.fileSize}</div>
                  </td>
                  <td className="py-4 px-6 font-medium text-[#5A6B82]">{doc.uploadDate}</td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        doc.status === 'Verified'
                          ? 'bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Downloading verified document: ${doc.fileName}`)}
                      className="p-2 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#6F42C1]/10 hover:border-[#6F42C1]/20 hover:text-[#6F42C1] text-[#5A6B82] transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#1E293B]">Edit Business Profile</h3>
                <p className="text-xs text-[#5A6B82] font-semibold">
                  Update your contact details and registered warehouse address.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="p-2 rounded-xl text-[#5A6B82] hover:bg-[#F4F7FC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E293B] mb-1 uppercase">Trading Name</label>
                  <input
                    type="text"
                    value={profileForm.companyName}
                    onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#6F42C1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1E293B] mb-1 uppercase">Contact Person</label>
                  <input
                    type="text"
                    value={profileForm.contactPerson}
                    onChange={(e) => setProfileForm({ ...profileForm, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#6F42C1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E293B] mb-1 uppercase">Phone Number</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#6F42C1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1E293B] mb-1 uppercase">Email Address</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#6F42C1]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E293B] mb-1 uppercase">Office & Warehouse Address</label>
                <textarea
                  rows={3}
                  value={profileForm.officeAddress}
                  onChange={(e) => setProfileForm({ ...profileForm, officeAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] focus:outline-none focus:border-[#6F42C1]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#F4F7FC] text-[#1E293B] text-xs font-bold hover:bg-[#E2E8F0] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#6F42C1] text-white text-xs font-bold shadow-xs hover:bg-[#5C35A5] transition-colors cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD DOCUMENT MODAL */}
      {isUploadDocOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#1E293B]">Upload Compliance Document</h3>
                <p className="text-xs text-[#5A6B82] font-semibold">
                  Upload PDF scan of GST certificate, trade license or bank cheque.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadDocOpen(false)}
                className="p-2 rounded-xl text-[#5A6B82] hover:bg-[#F4F7FC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDocSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-[#1E293B] mb-1 uppercase">Document Category</label>
                <select
                  value={docForm.documentType}
                  onChange={(e) => setDocForm({ ...docForm, documentType: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#6F42C1]"
                >
                  <option value="GSTIN Certificate (REG-06)">GSTIN Certificate (REG-06)</option>
                  <option value="Partnership Deed / Trade Registration">Partnership Deed / Trade Registration</option>
                  <option value="Firm PAN Card">Firm PAN Card</option>
                  <option value="Cancelled Cheque (Escrow Refund Account)">Cancelled Cheque (Escrow Refund Account)</option>
                  <option value="Warehouse Storage License (GIDC)">Warehouse Storage License (GIDC)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E293B] mb-1 uppercase">Registration / Ref Number</label>
                <input
                  type="text"
                  value={docForm.documentNumber}
                  onChange={(e) => setDocForm({ ...docForm, documentNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#6F42C1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E293B] mb-1 uppercase">Attach PDF Document</label>
                <div className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-6 text-center bg-[#F8FAFC] hover:bg-[#F4F7FC] cursor-pointer">
                  <Upload className="w-6 h-6 text-[#6F42C1] mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#1E293B]">{docForm.fileName}</p>
                  <p className="text-[10px] text-[#5A6B82] mt-0.5">Click or drag PDF file (Max 10 MB)</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsUploadDocOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#F4F7FC] text-[#1E293B] text-xs font-bold hover:bg-[#E2E8F0] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
