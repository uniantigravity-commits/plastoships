import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  Download,
  IndianRupee,
  ShieldCheck,
  Building,
  Store,
  Filter,
  FileText,
} from 'lucide-react';
import { PaymentTransaction } from '../types';
import { Modal } from '../components/Modal';

interface PaymentScreenProps {
  payments: PaymentTransaction[];
  onNavigate?: (screen: any) => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({ payments, onNavigate }) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Subscription' | 'Order Payment' | 'Escrow Settlement'>('All');
  const [selectedTxn, setSelectedTxn] = useState<PaymentTransaction | null>(null);

  const filtered = payments.filter((p) => {
    const q = (search || '').toLowerCase().trim();
    if (!q) return typeFilter === 'All' || p.type === typeFilter;

    const matchesSearch =
      (p.id || '').toLowerCase().includes(q) ||
      (p.partyName || '').toLowerCase().includes(q) ||
      (p.invoiceNumber || '').toLowerCase().includes(q) ||
      (p.referenceId || '').toLowerCase().includes(q) ||
      (p.method || '').toLowerCase().includes(q);

    const matchesType = typeFilter === 'All' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalVolume = payments
    .filter((p) => p.status === 'Success')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleExportReceipt = (txn: PaymentTransaction) => {
    // Generate simulated PDF invoice download
    const invoiceContent = `======================================================
PLASTOSHIP GUJARAT REGIONAL B2B INFRASTRUCTURE
TAX INVOICE & PAYMENT RECEIPT
======================================================
Invoice Number: ${txn.invoiceNumber}
Transaction ID: ${txn.id}
Date & Time:    ${txn.date}
Payment Method: ${txn.method}
Status:         ${txn.status.toUpperCase()}

Party Name:     ${txn.partyName}
Party Role:     ${txn.partyRole}
Transaction:    ${txn.type}
Reference ID:   ${txn.referenceId}

Total Amount:   INR ${txn.amount.toLocaleString('en-IN')}
GSTIN:          24AAACP9921D1ZQ (PlastoShip GJ)
HSN Category:   Polymer Raw Materials B2B Platform Service
======================================================
Thank you for trading on PlastoShip Gujarat!
`;
    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${txn.invoiceNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0B1F3A] tracking-tight">
            Payments & Transactions
          </h2>
          <p className="text-sm font-semibold text-[#5A6B82] mt-1">
            Real-time settlement logs, gateway reconciliations, and escrow records.
          </p>
        </div>
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('invoices')}
            className="px-4 py-2 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#FF7A18] hover:text-[#FF7A18] text-[#0B1F3A] text-xs font-bold transition-all flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#FF7A18]" />
            <span>Go to Invoice Management</span>
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#5A6B82] font-semibold">
            <span>Total Settled Volume</span>
            <Receipt className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#0B1F3A] mt-2">{formatINR(totalVolume)}</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">100% Verified Gujarat Accounts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#5A6B82] font-semibold">
            <span>Escrow In-Transit</span>
            <ShieldCheck className="w-4 h-4 text-[#FF7A18]" />
          </div>
          <p className="text-2xl font-extrabold text-[#0B1F3A] mt-2">
            {formatINR(
              payments
                .filter((p) => p.status === 'Pending' || p.type === 'Order Payment')
                .reduce((acc, curr) => acc + curr.amount, 0)
            )}
          </p>
          <p className="text-[11px] text-[#5A6B82] font-medium mt-1">Protected until bill of lading pass</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#5A6B82] font-semibold">
            <span>Membership Collections</span>
            <IndianRupee className="w-4 h-4 text-[#0B1F3A]" />
          </div>
          <p className="text-2xl font-extrabold text-[#0B1F3A] mt-2">
            {formatINR(
              payments
                .filter((p) => p.type === 'Subscription')
                .reduce((acc, curr) => acc + curr.amount, 0)
            )}
          </p>
          <p className="text-[11px] text-purple-700 font-medium mt-1">Diamond & Gold Tiers Active</p>
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
            placeholder="Search Txn ID, invoice, party name..."
            className="w-full h-10 pl-9.5 pr-4 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium placeholder-[#5A6B82] focus:outline-none focus:border-[#0B1F3A] focus:bg-white transition-all"
          />
        </div>

        {/* Type Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4F7FC] rounded-xl border border-[#E2E8F0] w-full md:w-auto overflow-x-auto">
          {(['All', 'Order Payment', 'Escrow Settlement', 'Subscription'] as const).map((tab) => {
            const count = tab === 'All' ? payments.length : payments.filter((p) => p.type === tab).length;
            const isActive = typeFilter === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setTypeFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
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

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
                <th className="py-4 px-6 w-[15%]">Transaction ID</th>
                <th className="py-4 px-4 w-[22%]">Party & Role</th>
                <th className="py-4 px-4 w-[16%]">Type</th>
                <th className="py-4 px-4 w-[14%]">Amount</th>
                <th className="py-4 px-4 w-[13%]">Gateway / Method</th>
                <th className="py-4 px-4 w-[12%]">Status</th>
                <th className="py-4 px-6 w-[8%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-xs">
              {filtered.map((txn) => (
                <tr key={txn.id} className="hover:bg-[#F4F7FC]/70 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-mono-code font-bold text-xs text-[#0B1F3A] bg-[#F4F7FC] px-2 py-1 rounded border border-slate-200 block w-fit">
                      {txn.id}
                    </span>
                    <span className="font-mono-code text-[10px] text-[#5A6B82] mt-1 block">
                      {txn.invoiceNumber}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <p className="font-bold text-[#0B1F3A]">{txn.partyName}</p>
                    <span
                      className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                        txn.partyRole === 'Manufacturer'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {txn.partyRole}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-[#0B1F3A]">{txn.type}</span>
                    <p className="font-mono-code text-[10px] text-[#5A6B82] mt-0.5">{txn.referenceId}</p>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <p className="font-extrabold text-sm text-[#0B1F3A]">{formatINR(txn.amount)}</p>
                    <p className="text-[10px] text-[#5A6B82]">{txn.date}</p>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg font-bold text-[#0B1F3A] text-[11px] border border-slate-200 inline-block whitespace-nowrap">
                      {txn.method}
                    </span>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
                        txn.status === 'Success'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : txn.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{txn.status}</span>
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => handleExportReceipt(txn)}
                        className="p-1.5 text-[#5A6B82] hover:text-[#0B1F3A] hover:bg-[#F4F7FC] rounded-lg border border-[#E2E8F0] transition-colors cursor-pointer"
                        title="Download Tax Receipt"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW TRANSACTION DETAILS MODAL */}
      <Modal
        isOpen={!!selectedTxn}
        onClose={() => setSelectedTxn(null)}
        title={`Transaction Details — ${selectedTxn?.id}`}
        subtitle={`Invoice: ${selectedTxn?.invoiceNumber}`}
        maxWidth="lg"
      >
        {selectedTxn && (
          <div className="space-y-6">
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#5A6B82] uppercase">Payment Amount</span>
                <p className="text-xl font-extrabold text-[#0B1F3A] mt-0.5">
                  {formatINR(selectedTxn.amount)}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedTxn.status === 'Success'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {selectedTxn.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[#5A6B82]">Payer / Receiver:</span>
                <p className="font-bold text-[#0B1F3A] mt-1">{selectedTxn.partyName}</p>
                <p className="text-[11px] text-[#5A6B82] mt-0.5">Role: {selectedTxn.partyRole}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[#5A6B82]">Settlement Method:</span>
                <p className="font-bold text-[#0B1F3A] mt-1">{selectedTxn.method}</p>
                <p className="font-mono-code text-[11px] text-[#5A6B82] mt-0.5">Ref: {selectedTxn.referenceId}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[#5A6B82]">Timestamp:</span>
                <p className="font-bold text-[#0B1F3A] mt-1">{selectedTxn.date}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[#5A6B82]">Payment Category:</span>
                <p className="font-bold text-[#0B1F3A] mt-1">{selectedTxn.type}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => handleExportReceipt(selectedTxn)}
                className="px-4 py-2 bg-[#F4F7FC] hover:bg-[#E2E8F0] text-[#0B1F3A] text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Invoice File</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTxn(null)}
                className="px-4 py-2 bg-[#0B1F3A] text-white text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
