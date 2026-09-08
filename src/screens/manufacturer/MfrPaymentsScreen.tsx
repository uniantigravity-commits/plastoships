import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Wallet,
  Building2,
  Edit2,
  Check,
  X,
  FileText,
  Download,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  Printer,
} from 'lucide-react';
import { ManufacturerSettlement, ManufacturerProfileData } from '../../types';
import { Modal } from '../../components/Modal';

interface MfrPaymentsScreenProps {
  settlements?: ManufacturerSettlement[];
  profile?: ManufacturerProfileData;
  onNavigate?: (screen: string) => void;
}

interface TransactionItem {
  id: string;
  date: string;
  paymentType: string;
  amount: string;
  amountNumber: number;
  status: 'Pending' | 'Completed' | 'Failed';
  description?: string;
  referenceNo?: string;
}

interface PaymentDocument {
  id: string;
  title: string;
  type: string;
  date: string;
  fileSize: string;
  downloadUrl?: string;
}

export const MfrPaymentsScreen: React.FC<MfrPaymentsScreenProps> = ({
  settlements,
  profile,
  onNavigate,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bank Details State
  const [bankInfo, setBankInfo] = useState({
    accountName: profile?.companyName || 'Metro Plastics Manufacturing Ltd.',
    bankName: 'HDFC Bank',
    accountNumber: '•••• •••• 4092',
    rawAccountNumber: '50200034184092',
    branchName: 'Andheri East, Mumbai',
    ifscCode: 'HDFC0001234',
    isVerified: true,
  });

  // Modal States
  const [isEditBankModalOpen, setIsEditBankModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<PaymentDocument | null>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  // Edit Bank Form State
  const [editBankForm, setEditBankForm] = useState({
    accountName: bankInfo.accountName,
    bankName: bankInfo.bankName,
    accountNumber: bankInfo.rawAccountNumber,
    branchName: bankInfo.branchName,
    ifscCode: bankInfo.ifscCode,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Transaction History matching screenshot
  const [transactions, setTransactions] = useState<TransactionItem[]>([
    {
      id: 'TXN-9021',
      date: 'Oct 15, 2026',
      paymentType: 'Order Payment',
      amount: '₹72,500',
      amountNumber: 72500,
      status: 'Pending',
      description: 'Payment for Order ORD-2041 (Metro Supermart)',
      referenceNo: 'ESC-9021-METRO',
    },
    {
      id: 'TXN-9020',
      date: 'Oct 14, 2026',
      paymentType: 'Payout',
      amount: '₹1,25,000',
      amountNumber: 125000,
      status: 'Completed',
      description: 'Direct NEFT Settlement to HDFC Bank A/c 4092',
      referenceNo: 'NEFT-HDFC-991204',
    },
    {
      id: 'TXN-9019',
      date: 'Oct 12, 2026',
      paymentType: 'Order Payment',
      amount: '₹85,000',
      amountNumber: 85000,
      status: 'Completed',
      description: 'Payment for Order ORD-2040 (Global Retailers)',
      referenceNo: 'ESC-9019-GLOBAL',
    },
    {
      id: 'TXN-9018',
      date: 'Oct 10, 2026',
      paymentType: 'Order Payment',
      amount: '₹44,000',
      amountNumber: 44000,
      status: 'Completed',
      description: 'Payment for Order ORD-2039 (Sharma Plastics)',
      referenceNo: 'ESC-9018-SHARMA',
    },
    {
      id: 'TXN-9017',
      date: 'Jan 01, 2026',
      paymentType: 'Subscription Payment',
      amount: '₹29,999',
      amountNumber: 29999,
      status: 'Completed',
      description: 'PlastoShip Premium Plan Yearly Renewal',
      referenceNo: 'INV-2026-088',
    },
    {
      id: 'TXN-9016',
      date: 'Dec 15, 2025',
      paymentType: 'Payout',
      amount: '₹45,200',
      amountNumber: 45200,
      status: 'Failed',
      description: 'Bank clearance timeout - Amount refunded to Escrow',
      referenceNo: 'FAIL-REV-8812',
    },
  ]);

  // Payment Documents matching screenshot
  const [documents, setDocuments] = useState<PaymentDocument[]>([
    {
      id: 'INV-2026-088',
      title: 'Invoice #INV-2026-088',
      type: 'Subscription Invoice',
      date: 'Jan 01, 2026',
      fileSize: '240 KB',
    },
    {
      id: 'REC-2026-01',
      title: 'Receipt #REC-2026-01',
      type: 'Payout Receipt',
      date: 'Oct 14, 2026',
      fileSize: '180 KB',
    },
  ]);

  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const masked = `•••• •••• ${editBankForm.accountNumber.slice(-4)}`;
    setBankInfo({
      accountName: editBankForm.accountName,
      bankName: editBankForm.bankName,
      accountNumber: masked,
      rawAccountNumber: editBankForm.accountNumber,
      branchName: editBankForm.branchName,
      ifscCode: editBankForm.ifscCode,
      isVerified: true,
    });
    setIsEditBankModalOpen(false);
    showToast('Bank account details updated successfully!');
  };

  const handleDownloadDoc = (doc: PaymentDocument) => {
    showToast(`Downloading ${doc.title}...`);
  };

  const handleViewDoc = (doc: PaymentDocument) => {
    setSelectedDoc(doc);
    setIsDocModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Screen Title & Subtitle */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Payments
        </h2>
        <p className="text-xs sm:text-sm text-[#5A6B82] mt-1 font-normal">
          Track your payments, transactions and payout details
        </p>
      </div>

      {/* 4 Top KPI Cards matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Earnings */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
              TOTAL EARNINGS
            </span>
            <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">
              ₹4,52,500
            </span>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
              PENDING PAYMENTS
            </span>
            <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">
              ₹72,500
            </span>
          </div>
        </div>

        {/* Completed Payments */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
              COMPLETED PAYMENTS
            </span>
            <div className="w-6 h-6 rounded-full bg-[#EEEDFD] text-[#4B49AC] flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4B49AC]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">
              142
            </span>
          </div>
        </div>

        {/* Last Payment Received */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
              LAST PAYMENT RECEIVED
            </span>
            <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5 text-purple-600" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Oct 14, 2026
            </span>
          </div>
        </div>
      </div>

      {/* Bank Account Information (Full Width) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs flex flex-col justify-between">
        <div>
          {/* Top row: Icon + Title + Verified Badge */}
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#4B49AC]">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Bank Account Information
              </h3>
            </div>

            {bankInfo.isVerified && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Account
              </span>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-5 gap-x-6 text-xs sm:text-sm">
            <div>
              <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                ACCOUNT NAME
              </span>
              <p className="font-bold text-slate-900 mt-1">
                {bankInfo.accountName}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                BANK NAME
              </span>
              <p className="font-bold text-slate-900 mt-1">
                {bankInfo.bankName}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                ACCOUNT NUMBER
              </span>
              <p className="font-bold font-mono text-slate-900 mt-1 tracking-wider">
                {bankInfo.accountNumber}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                BRANCH NAME
              </span>
              <p className="font-bold text-slate-900 mt-1">
                {bankInfo.branchName}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                IFSC CODE
              </span>
              <p className="font-bold font-mono text-slate-900 mt-1 tracking-wider">
                {bankInfo.ifscCode}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Edit Button */}
        <div className="pt-6 mt-6 border-t border-[#F1F5F9]">
          <button
            type="button"
            onClick={() => {
              setEditBankForm({
                accountName: bankInfo.accountName,
                bankName: bankInfo.bankName,
                accountNumber: bankInfo.rawAccountNumber,
                branchName: bankInfo.branchName,
                ifscCode: bankInfo.ifscCode,
              });
              setIsEditBankModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#CBD5E1] bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Bank Details</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Transaction History (Left Table) + Payment Documents (Right Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Table: Transaction History */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 pb-4 border-b border-[#F1F5F9]">
            <h3 className="text-base font-bold text-slate-900">
              Transaction History
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider bg-white">
                  <th className="py-4 px-5">TRANSACTION ID</th>
                  <th className="py-4 px-5">DATE</th>
                  <th className="py-4 px-5">PAYMENT TYPE</th>
                  <th className="py-4 px-5">AMOUNT</th>
                  <th className="py-4 px-5 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-xs sm:text-sm text-slate-900">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-5 font-bold font-mono text-slate-900">
                      {tx.id}
                    </td>
                    <td className="py-4 px-5 text-[#5A6B82] font-normal">
                      {tx.date}
                    </td>
                    <td className="py-4 px-5 font-medium text-slate-900">
                      {tx.paymentType}
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-900">
                      {tx.amount}
                    </td>
                    <td className="py-4 px-5 text-right">
                      {tx.status === 'Completed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                          <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                          Completed
                        </span>
                      )}
                      {tx.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Pending
                        </span>
                      )}
                      {tx.status === 'Failed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                          <X className="w-3.5 h-3.5 text-rose-600" />
                          Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Card: Payment Documents */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-5">
              Payment Documents
            </h3>

            <div className="space-y-3.5">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 sm:p-4 rounded-xl border border-[#E2E8F0] hover:border-slate-300 bg-white transition-colors flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-slate-500 shrink-0 group-hover:text-[#4B49AC]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {doc.title}
                      </h4>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">
                        {doc.type} • {doc.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleViewDoc(doc)}
                      title="View Document"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadDoc(doc)}
                      title="Download"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#4B49AC] hover:bg-[#EEEDFD] transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Bank Details Modal */}
      {isEditBankModalOpen && (
        <Modal
          isOpen={isEditBankModalOpen}
          onClose={() => setIsEditBankModalOpen(false)}
          title="Edit Bank Account Details"
        >
          <form onSubmit={handleSaveBankDetails} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                required
                value={editBankForm.accountName}
                onChange={(e) =>
                  setEditBankForm({ ...editBankForm, accountName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-slate-900 focus:outline-none focus:border-[#4B49AC]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  required
                  value={editBankForm.bankName}
                  onChange={(e) =>
                    setEditBankForm({ ...editBankForm, bankName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-slate-900 focus:outline-none focus:border-[#4B49AC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  required
                  value={editBankForm.ifscCode}
                  onChange={(e) =>
                    setEditBankForm({ ...editBankForm, ifscCode: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-slate-900 focus:outline-none focus:border-[#4B49AC]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bank Account Number
              </label>
              <input
                type="text"
                required
                value={editBankForm.accountNumber}
                onChange={(e) =>
                  setEditBankForm({
                    ...editBankForm,
                    accountNumber: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-mono text-slate-900 focus:outline-none focus:border-[#4B49AC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Branch Name & City
              </label>
              <input
                type="text"
                required
                value={editBankForm.branchName}
                onChange={(e) =>
                  setEditBankForm({ ...editBankForm, branchName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-slate-900 focus:outline-none focus:border-[#4B49AC]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setIsEditBankModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#4B49AC] hover:bg-[#3F3D99] text-white text-xs font-semibold shadow-xs"
              >
                Save Bank Details
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Payout Details Modal */}
      {isPayoutModalOpen && (
        <Modal
          isOpen={isPayoutModalOpen}
          onClose={() => setIsPayoutModalOpen(false)}
          title="Payout Breakdown & Schedule"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">Available for Payout</span>
                <span className="font-extrabold text-slate-900">₹1,45,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">Settlement Frequency</span>
                <span className="font-semibold text-slate-900">Weekly (Every Wednesday)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6B82]">Direct Deposit Bank</span>
                <span className="font-semibold text-slate-900">{bankInfo.bankName} (A/c {bankInfo.accountNumber.slice(-4)})</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-[#5A6B82]">Next Scheduled Dispatch</span>
                <span className="font-bold text-[#4B49AC]">Oct 21, 2026 • 11:00 AM IST</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsPayoutModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Document Viewer Modal */}
      {isDocModalOpen && selectedDoc && (
        <Modal
          isOpen={isDocModalOpen}
          onClose={() => setIsDocModalOpen(false)}
          title={selectedDoc.title}
        >
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#5A6B82]">Document Type:</span>
                <span className="font-bold text-slate-900">{selectedDoc.type}</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#5A6B82]">Issued Date:</span>
                <span className="font-semibold text-slate-900">{selectedDoc.date}</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#5A6B82]">File Size:</span>
                <span className="text-slate-900">{selectedDoc.fileSize}</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm border-t border-slate-200 pt-2">
                <span className="text-[#5A6B82]">Verification:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Digitally Signed
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownloadDoc(selectedDoc);
                  setIsDocModalOpen(false);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#4B49AC] hover:bg-[#3F3D99] text-white text-xs font-semibold shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
