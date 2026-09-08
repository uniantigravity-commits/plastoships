import React, { useState, useRef } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  FileText,
  Check,
  Building2,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { ManufacturerKycDoc } from '../../types';

interface MfrKycScreenProps {
  kycDocs?: ManufacturerKycDoc[];
  onUploadDoc?: (doc: ManufacturerKycDoc) => void;
}

interface DocUploadItem {
  id: string;
  title: string;
  status: 'Uploaded' | 'Pending Review' | 'Rejected' | 'Required';
  fileName?: string;
  rejectionReason?: string;
}

export const MfrKycScreen: React.FC<MfrKycScreenProps> = ({
  kycDocs,
  onUploadDoc,
}) => {
  // Verification Status
  const [verificationStatus, setVerificationStatus] = useState<'DRAFT' | 'PENDING' | 'VERIFIED'>('DRAFT');

  // Business Registration Details
  const [businessDetails, setBusinessDetails] = useState({
    gstin: '24AAACC1206D1Z1',
    panNumber: 'AAACC1206D',
    registrationType: 'Proprietorship',
  });

  // Document Uploads State
  const [documents, setDocuments] = useState<DocUploadItem[]>([
    {
      id: 'incorporation',
      title: 'Certificate of Incorporation / Registration Certificate',
      status: 'Uploaded',
      fileName: 'registration_cert.pdf',
    },
    {
      id: 'gst',
      title: 'GST Certificate',
      status: 'Pending Review',
      fileName: 'gst_document_v2.pdf',
    },
    {
      id: 'msme',
      title: 'MSME / Udyam Registration',
      status: 'Rejected',
      rejectionReason: 'Document blurry. Re-upload required.',
    },
    {
      id: 'factory_license',
      title: 'Factory License / Trade License',
      status: 'Required',
    },
  ]);

  // Bank Account Details
  const [bankDetails, setBankDetails] = useState({
    accountName: 'Apex Plastics Ltd.',
    accountNumber: '50200012345678',
    ifscCode: 'HDFC0001234',
    bankName: 'HDFC Bank',
    branchName: 'Rajkot Main Branch',
    chequeFileName: '',
  });

  // Authorized Signatory Details
  const [signatoryDetails, setSignatoryDetails] = useState({
    signatoryName: 'Rajesh Kumar',
    idProofFileName: '',
  });

  // Toast / feedback state
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  // File input refs
  const chequeInputRef = useRef<HTMLInputElement>(null);
  const idProofInputRef = useRef<HTMLInputElement>(null);
  const docInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setFeedbackMessage({ type, text });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3500);
  };

  const handleDocFileSelect = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === docId
            ? {
                ...doc,
                status: 'Pending Review',
                fileName: file.name,
                rejectionReason: undefined,
              }
            : doc
        )
      );
      showToast(`${file.name} uploaded successfully. Status updated to Pending Review.`);

      if (onUploadDoc) {
        onUploadDoc({
          id: `KYC-${Date.now().toString().slice(-4)}`,
          documentType: documents.find((d) => d.id === docId)?.title || docId,
          documentNumber: businessDetails.gstin,
          description: `Uploaded on ${new Date().toLocaleDateString()}`,
          status: 'In Review',
          uploadDate: new Date().toISOString().split('T')[0],
          fileName: file.name,
          fileSize: '1.4 MB',
        });
      }
    }
  };

  const handleChequeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBankDetails((prev) => ({ ...prev, chequeFileName: file.name }));
      showToast(`Cancelled cheque (${file.name}) uploaded.`);
    }
  };

  const handleIdProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSignatoryDetails((prev) => ({ ...prev, idProofFileName: file.name }));
      showToast(`ID Proof (${file.name}) uploaded.`);
    }
  };

  const handleSaveDraft = () => {
    setVerificationStatus('DRAFT');
    showToast('KYC & Compliance details saved as draft.', 'info');
  };

  const handleSubmitForVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationStatus('PENDING');
    showToast('Your KYC documents have been submitted for verification! Our compliance team will review within 24-48 hours.', 'success');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          KYC & Compliance
        </h2>
        <p className="text-xs sm:text-sm text-[#5A6B82] mt-1 font-normal">
          Complete your business verification and compliance details
        </p>
      </div>

      {/* Toast Notification */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium flex items-center justify-between shadow-xs transition-all ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-[#EEEDFD] border-[#D6D4F7] text-[#4B49AC]'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2
              className={`w-5 h-5 shrink-0 ${
                feedbackMessage.type === 'success' ? 'text-emerald-600' : 'text-[#4B49AC]'
              }`}
            />
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmitForVerification} className="space-y-6">
        {/* 1. Profile Verification Status Banner */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Profile Verification Status
              </h3>
              <p className="text-xs sm:text-sm text-[#5A6B82] mt-0.5">
                {verificationStatus === 'DRAFT'
                  ? 'Please submit your documents for review'
                  : verificationStatus === 'PENDING'
                  ? 'Your documents are under review by the compliance team'
                  : 'All compliance documents verified'}
              </p>
            </div>
          </div>

          <div>
            <span className="inline-block px-3 py-1 bg-[#F1F5F9] text-[#475569] text-xs font-bold tracking-wider rounded-md">
              {verificationStatus}
            </span>
          </div>
        </div>

        {/* 2. Business Registration Details Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900">
            Business Registration Details
          </h3>

          {/* GSTIN & PAN Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                GSTIN
              </label>
              <input
                type="text"
                value={businessDetails.gstin}
                onChange={(e) =>
                  setBusinessDetails({ ...businessDetails, gstin: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                placeholder="24AAACC1206D1Z1"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                PAN Number
              </label>
              <input
                type="text"
                value={businessDetails.panNumber}
                onChange={(e) =>
                  setBusinessDetails({ ...businessDetails, panNumber: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                placeholder="AAACC1206D"
              />
            </div>
          </div>

          {/* Business Registration Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1.5">
              Business Registration Type
            </label>
            <input
              type="text"
              value={businessDetails.registrationType}
              onChange={(e) =>
                setBusinessDetails({
                  ...businessDetails,
                  registrationType: e.target.value,
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
              placeholder="Proprietorship / Partnership / Private Limited"
            />
          </div>
        </div>

        {/* 3. Document Uploads Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 mb-2">
            Document Uploads
          </h3>

          <div className="space-y-3.5">
            {documents.map((doc) => {
              const isRejected = doc.status === 'Rejected';
              const isUploaded = doc.status === 'Uploaded';
              const isPending = doc.status === 'Pending Review';
              const isRequired = doc.status === 'Required';

              return (
                <div
                  key={doc.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isRejected
                      ? 'border-rose-200 bg-[#FFF5F5]'
                      : 'border-[#E2E8F0] bg-white'
                  }`}
                >
                  {/* Left Column: Title + Badge + Meta */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {doc.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Uploaded Badge */}
                      {isUploaded && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                          <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                          Uploaded
                        </span>
                      )}

                      {/* Pending Review Badge */}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Pending Review
                        </span>
                      )}

                      {/* Rejected Badge */}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-medium">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          Rejected
                        </span>
                      )}

                      {/* Required Badge */}
                      {isRequired && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-[#F1F5F9] text-[#64748B] text-xs font-medium">
                          Required
                        </span>
                      )}

                      {/* File Name or Rejection Reason */}
                      {doc.fileName && (
                        <span className="text-xs text-[#5A6B82] font-normal">
                          {doc.fileName}
                        </span>
                      )}

                      {isRejected && doc.rejectionReason && (
                        <span className="text-xs text-rose-600 font-normal">
                          {doc.rejectionReason}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Upload / Replace Button */}
                  <div className="shrink-0">
                    <input
                      type="file"
                      ref={(el) => {
                        docInputRefs.current[doc.id] = el;
                      }}
                      onChange={(e) => handleDocFileSelect(doc.id, e)}
                      accept="application/pdf, image/png, image/jpeg"
                      className="hidden"
                    />

                    {isUploaded || isPending ? (
                      <button
                        type="button"
                        onClick={() => docInputRefs.current[doc.id]?.click()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#D6D4F7] bg-white hover:bg-[#EEEDFD] text-[#4B49AC] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#4B49AC]" />
                        <span>Replace</span>
                      </button>
                    ) : isRejected ? (
                      <button
                        type="button"
                        onClick={() => docInputRefs.current[doc.id]?.click()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-dashed border-rose-400 bg-white hover:bg-rose-50/50 text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-rose-500" />
                        <span>Upload New</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => docInputRefs.current[doc.id]?.click()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-dashed border-[#4B49AC] bg-[#EEEDFD]/50 hover:bg-[#EEEDFD] text-[#4B49AC] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#4B49AC]" />
                        <span>Upload File</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Bank Account Details Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900">
            Bank Account Details
          </h3>

          {/* Account Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1.5">
              Account Name
            </label>
            <input
              type="text"
              value={bankDetails.accountName}
              onChange={(e) =>
                setBankDetails({ ...bankDetails, accountName: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
              placeholder="Enter account name"
            />
          </div>

          {/* Account Number & IFSC Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                Account Number
              </label>
              <input
                type="text"
                value={bankDetails.accountNumber}
                onChange={(e) =>
                  setBankDetails({ ...bankDetails, accountNumber: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                placeholder="50200012345678"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                IFSC Code
              </label>
              <input
                type="text"
                value={bankDetails.ifscCode}
                onChange={(e) =>
                  setBankDetails({ ...bankDetails, ifscCode: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                placeholder="HDFC0001234"
              />
            </div>
          </div>

          {/* Bank Name & Branch Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                Bank Name
              </label>
              <input
                type="text"
                value={bankDetails.bankName}
                onChange={(e) =>
                  setBankDetails({ ...bankDetails, bankName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                placeholder="HDFC Bank"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                Branch Name
              </label>
              <input
                type="text"
                value={bankDetails.branchName}
                onChange={(e) =>
                  setBankDetails({ ...bankDetails, branchName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                placeholder="Rajkot Main Branch"
              />
            </div>
          </div>

          {/* Cancelled Cheque / Passbook Copy Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1.5">
              Cancelled Cheque / Passbook Copy
            </label>
            <input
              type="file"
              ref={chequeInputRef}
              onChange={handleChequeUpload}
              accept="application/pdf, image/png, image/jpeg"
              className="hidden"
            />
            <div
              onClick={() => chequeInputRef.current?.click()}
              className="border border-dashed border-[#CBD5E1] bg-[#F8FAFC] rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[120px]"
            >
              <Upload className="w-5 h-5 text-slate-500 mb-1" />
              <span className="text-xs font-bold text-slate-900">
                {bankDetails.chequeFileName ? bankDetails.chequeFileName : 'Upload Document'}
              </span>
              <span className="text-[11px] text-[#5A6B82] mt-0.5">
                PDF, JPG up to 5MB
              </span>
            </div>
          </div>
        </div>

        {/* 5. Authorized Signatory Details Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Authorized Signatory Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
            {/* Authorized Signatory Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                Authorized Signatory Name
              </label>
              <input
                type="text"
                value={signatoryDetails.signatoryName}
                onChange={(e) =>
                  setSignatoryDetails({
                    ...signatoryDetails,
                    signatoryName: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                placeholder="Rajesh Kumar"
              />
            </div>

            {/* ID Proof (Aadhaar / PAN Copy) */}
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                ID Proof (Aadhaar / PAN Copy)
              </label>
              <input
                type="file"
                ref={idProofInputRef}
                onChange={handleIdProofUpload}
                accept="application/pdf, image/png, image/jpeg"
                className="hidden"
              />
              <div
                onClick={() => idProofInputRef.current?.click()}
                className="border border-dashed border-[#4B49AC] bg-[#EEEDFD]/40 hover:bg-[#EEEDFD] rounded-xl px-4 py-2.5 transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs font-semibold text-[#4B49AC] min-h-[42px]"
              >
                <Upload className="w-4 h-4 text-[#4B49AC]" />
                <span>
                  {signatoryDetails.idProofFileName
                    ? signatoryDetails.idProofFileName
                    : 'Upload ID Proof'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Bottom Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-6 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors cursor-pointer"
          >
            Save Draft
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#4B49AC] hover:bg-[#3F3D99] text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Submit For Verification
          </button>
        </div>
      </form>
    </div>
  );
};
