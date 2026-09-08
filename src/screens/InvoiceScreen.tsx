import React, { useState } from 'react';
import {
  FileText,
  Search,
  Eye,
  Download,
  IndianRupee,
  Clock,
  AlertCircle,
  Building2,
  Store,
  Filter,
  ArrowUpDown,
  Printer,
  X,
  CreditCard,
  Receipt,
  Sparkles,
  ShieldCheck,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { Invoice, InvoiceType, InvoiceStatus } from '../types';
import { Modal } from '../components/Modal';

interface InvoiceScreenProps {
  invoices: Invoice[];
  onShowToast?: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
}

export const InvoiceScreen: React.FC<InvoiceScreenProps> = ({
  invoices,
  onShowToast,
}) => {
  // Active Tab: 'Subscription' | 'Sales'
  const [activeTab, setActiveTab] = useState<InvoiceType>('Subscription');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState<'All' | 'Manufacturers' | 'Distributors'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Selected Invoice for View Modal
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Filter invoices for current tab
  const tabInvoices = invoices.filter((inv) => inv.type === activeTab);

  // Apply search and filter
  const filteredInvoices = tabInvoices.filter((inv) => {
    // Entity filter
    if (entityFilter === 'Manufacturers' && inv.entityType !== 'Manufacturer') return false;
    if (entityFilter === 'Distributors' && inv.entityType !== 'Distributor') return false;

    // Status filter
    if (statusFilter !== 'All' && inv.status !== statusFilter) return false;

    // Search query
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    return (
      inv.id.toLowerCase().includes(q) ||
      inv.entityName.toLowerCase().includes(q) ||
      (inv.planName && inv.planName.toLowerCase().includes(q)) ||
      (inv.orderId && inv.orderId.toLowerCase().includes(q)) ||
      (inv.productDescription && inv.productDescription.toLowerCase().includes(q)) ||
      (inv.gstin && inv.gstin.toLowerCase().includes(q)) ||
      inv.billingPeriod.toLowerCase().includes(q)
    );
  });

  // Calculate summary metrics
  const totalSubscription = invoices
    .filter((inv) => inv.type === 'Subscription')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalOutstanding = invoices
    .filter((inv) => inv.status === 'Pending' || inv.status === 'Overdue')
    .reduce((sum, inv) => sum + (inv.outstandingAmount ?? inv.amount), 0);

  const totalSales = invoices
    .filter((inv) => inv.type === 'Sales')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const overdueCount = invoices.filter((inv) => inv.status === 'Overdue').length;
  const pendingCount = invoices.filter((inv) => inv.status === 'Pending').length;

  // Download Invoice handler
  const handleDownloadInvoice = (inv: Invoice) => {
    const cgst = inv.taxAmount ? inv.taxAmount / 2 : (inv.amount * 0.18) / 2;
    const sgst = cgst;
    const taxable = inv.taxableAmount || inv.amount - (inv.taxAmount || inv.amount * 0.18);

    const invoiceContent = `================================================================================
                    PLASTOSHIP GUJARAT B2B INFRASTRUCTURE
                        TAX INVOICE & BILL OF SUPPLY
================================================================================
Invoice No:    ${inv.id}
Date of Issue: ${inv.issuedDate}
Due Date:      ${inv.dueDate}
Status:        ${inv.status.toUpperCase()}
Billing Cycle: ${inv.billingPeriod}
================================================================================
ISSUED BY:
PlastoShip Gujarat Regional Hub Pvt Ltd
GSTIN: 24AAACP9921D1ZQ | CIN: U25209GJ2024PTC109920
Address: Tower 4, GIDC Infocity Complex, Gandhinagar, Gujarat 382009
State / Code: Gujarat (24)
Website: www.plastoship.in | Helpdesk: support@plastoship.in
--------------------------------------------------------------------------------
BILLED TO:
Entity Name:   ${inv.entityName}
Entity Type:   ${inv.entityType}
Entity ID:     ${inv.entityId || 'N/A'}
GSTIN / UIN:   ${inv.gstin || '24AAXXX0000X1XX'}
State / Code:  Gujarat (24)
================================================================================
PARTICULARS & LINE ITEMS:
--------------------------------------------------------------------------------
# | Description                           | HSN/SAC | Quantity | Amount (INR)
--------------------------------------------------------------------------------
1 | ${inv.planName || inv.productDescription || 'Polymer B2B Platform Service'}
  | HSN/SAC: ${inv.hsnSacCode || '998313'} | Qty: 1 | Rate: ${taxable.toLocaleString('en-IN')}
--------------------------------------------------------------------------------
TAXABLE AMOUNT:                                       INR ${taxable.toLocaleString('en-IN')}
CGST @ 9.0%:                                          INR ${cgst.toLocaleString('en-IN')}
SGST @ 9.0%:                                          INR ${sgst.toLocaleString('en-IN')}
--------------------------------------------------------------------------------
TOTAL INVOICE VALUE (INCL. GST):                      INR ${inv.amount.toLocaleString('en-IN')}
OUTSTANDING BALANCE:                                  INR ${(inv.outstandingAmount ?? (inv.status === 'Paid' ? 0 : inv.amount)).toLocaleString('en-IN')}
================================================================================
SETTLEMENT & PAYMENT DETAILS:
Payment Method:  ${inv.paymentMethod || 'Razorpay B2B / Escrow'}
Transaction Ref: ${inv.id.replace('INV', 'TXN')}
Linked Reference:${inv.orderId || inv.planName || 'Annual Platform Fee'}
Notes:           ${inv.notes || 'Official computerized invoice valid without physical signature.'}
================================================================================
                Thank you for trading on PlastoShip Gujarat!
                    Regional Polymer Supply Chain Hub
================================================================================`;

    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${inv.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    if (onShowToast) {
      onShowToast('Invoice Downloaded', `${inv.id} text receipt saved to your downloads.`, 'success');
    }
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Paid
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            Overdue
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <FileText className="w-3 h-3" />
            Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div id="invoice-screen-container" className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 id="invoice-screen-title" className="text-2xl font-extrabold text-[#0B1F3A] tracking-tight">
            Invoices
          </h2>
          <p id="invoice-screen-subtitle" className="text-sm font-semibold text-[#5A6B82] mt-1">
            Billing records for membership subscriptions and order sales, in one place.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL (SUBSCRIPTION) */}
        <div
          id="kpi-total-subscription"
          className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5A6B82] tracking-wider uppercase">
              TOTAL (SUBSCRIPTION)
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF7A18]">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold font-mono text-[#0B1F3A]">
              {formatINR(totalSubscription)}
            </span>
          </div>
          <div className="mt-2 text-xs font-semibold text-[#5A6B82] flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Annual & monthly recurring plans</span>
          </div>
        </div>

        {/* OUTSTANDING */}
        <div
          id="kpi-outstanding"
          className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5A6B82] tracking-wider uppercase">
              OUTSTANDING
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold font-mono text-rose-600">
              {formatINR(totalOutstanding)}
            </span>
          </div>
          <div className="mt-2 text-xs font-semibold text-[#5A6B82]">
            <span>{overdueCount} overdue</span>
            <span className="mx-1.5">•</span>
            <span>{pendingCount} awaiting clearance</span>
          </div>
        </div>

        {/* TOTAL SALES INVOICES */}
        <div
          id="kpi-total-sales"
          className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5A6B82] tracking-wider uppercase">
              TOTAL (SALES)
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold font-mono text-[#0B1F3A]">
              {formatINR(totalSales)}
            </span>
          </div>
          <div className="mt-2 text-xs font-semibold text-[#5A6B82]">
            <span>Commercial resin orders & escrows</span>
          </div>
        </div>

        {/* SETTLED INVOICES */}
        <div
          id="kpi-settled"
          className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5A6B82] tracking-wider uppercase">
              ALL INVOICES
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold font-mono text-[#0B1F3A]">
              {invoices.length} Records
            </span>
          </div>
          <div className="mt-2 text-xs font-semibold text-emerald-700">
            <span>{invoices.filter((i) => i.status === 'Paid').length} Paid & Verified</span>
          </div>
        </div>
      </div>

      {/* Main Card with Tabs, Filters, and Invoices Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="border-b border-[#E2E8F0] px-6 pt-4 bg-[#FAFBFD] flex items-center gap-2">
          <button
            id="tab-subscription-invoices"
            type="button"
            onClick={() => {
              setActiveTab('Subscription');
              setStatusFilter('All');
              setEntityFilter('All');
            }}
            className={`pb-3.5 px-4 font-bold text-sm cursor-pointer transition-all border-b-2 flex items-center gap-2.5 ${
              activeTab === 'Subscription'
                ? 'border-[#FF7A18] text-[#FF7A18]'
                : 'border-transparent text-[#5A6B82] hover:text-[#0B1F3A]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Subscription Invoices</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                activeTab === 'Subscription'
                  ? 'bg-orange-100 text-[#FF7A18]'
                  : 'bg-slate-200/70 text-[#5A6B82]'
              }`}
            >
              {invoices.filter((i) => i.type === 'Subscription').length}
            </span>
          </button>

          <button
            id="tab-sales-invoices"
            type="button"
            onClick={() => {
              setActiveTab('Sales');
              setStatusFilter('All');
              setEntityFilter('All');
            }}
            className={`pb-3.5 px-4 font-bold text-sm cursor-pointer transition-all border-b-2 flex items-center gap-2.5 ${
              activeTab === 'Sales'
                ? 'border-[#FF7A18] text-[#FF7A18]'
                : 'border-transparent text-[#5A6B82] hover:text-[#0B1F3A]'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Sales Invoices</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                activeTab === 'Sales'
                  ? 'bg-orange-100 text-[#FF7A18]'
                  : 'bg-slate-200/70 text-[#5A6B82]'
              }`}
            >
              {invoices.filter((i) => i.type === 'Sales').length}
            </span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between bg-white">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#5A6B82] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="invoice-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoice ID, company, plan, order..."
              className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#0B1F3A] placeholder-[#5A6B82] focus:outline-none focus:border-[#FF7A18] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5A6B82] hover:text-[#0B1F3A]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Entity Filters: All, Manufacturers, Distributors */}
            <div className="flex items-center gap-1 bg-[#F4F7FC] p-1 rounded-xl border border-[#E2E8F0]">
              <span className="text-[11px] font-bold text-[#5A6B82] px-2 uppercase tracking-wide">
                Entity:
              </span>
              {(['All', 'Manufacturers', 'Distributors'] as const).map((ent) => (
                <button
                  key={ent}
                  id={`filter-entity-${ent.toLowerCase()}`}
                  type="button"
                  onClick={() => setEntityFilter(ent)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    entityFilter === ent
                      ? 'bg-[#0B1F3A] text-white shadow-xs'
                      : 'text-[#5A6B82] hover:text-[#0B1F3A]'
                  }`}
                >
                  {ent}
                </button>
              ))}
            </div>

            {/* Status Filters: All, Paid, Pending, Overdue, Draft */}
            <div className="flex items-center gap-1 bg-[#F4F7FC] p-1 rounded-xl border border-[#E2E8F0]">
              <span className="text-[11px] font-bold text-[#5A6B82] px-2 uppercase tracking-wide">
                Status:
              </span>
              {['All', 'Paid', 'Pending', 'Overdue', 'Draft'].map((st) => (
                <button
                  key={st}
                  id={`filter-status-${st.toLowerCase()}`}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#0B1F3A] text-white shadow-xs'
                      : 'text-[#5A6B82] hover:text-[#0B1F3A]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="overflow-x-auto">
          <table id="invoice-management-table" className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
                <th className="py-3.5 px-5">Invoice ID</th>
                <th className="py-3.5 px-5">Entity & Type</th>
                <th className="py-3.5 px-5">
                  {activeTab === 'Subscription' ? 'Plan' : 'Order / Consignment'}
                </th>
                <th className="py-3.5 px-5">Billing Period</th>
                <th className="py-3.5 px-5">Amount</th>
                <th className="py-3.5 px-5">Issued</th>
                <th className="py-3.5 px-5">Due</th>
                <th className="py-3.5 px-5 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-xs font-semibold text-[#0B1F3A]">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-[#5A6B82]">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-[#F4F7FC] flex items-center justify-center text-[#5A6B82] mb-3">
                        <FileText className="w-6 h-6" />
                      </div>
                      <p className="text-base font-bold text-[#0B1F3A]">No invoices found</p>
                      <p className="text-xs text-[#5A6B82] mt-1">
                        No records match your active search and filter criteria.
                      </p>
                      {(searchQuery || statusFilter !== 'All' || entityFilter !== 'All') && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('All');
                            setEntityFilter('All');
                          }}
                          className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-[#FF7A18] bg-orange-50 hover:bg-orange-100 transition-colors"
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    id={`invoice-row-${inv.id}`}
                    className="hover:bg-[#F8FAFC] transition-colors"
                  >
                    {/* Invoice ID */}
                    <td className="py-4 px-5">
                      <span className="font-mono font-bold text-[#0B1F3A] bg-[#F4F7FC] px-2.5 py-1 rounded-md border border-[#E2E8F0]">
                        {inv.id}
                      </span>
                    </td>

                    {/* Entity & Type */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-extrabold text-[#0B1F3A]">{inv.entityName}</div>
                          <div className="mt-0.5 flex items-center gap-1.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                inv.entityType === 'Manufacturer'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {inv.entityType === 'Manufacturer' ? (
                                <Building2 className="w-2.5 h-2.5" />
                              ) : (
                                <Store className="w-2.5 h-2.5" />
                              )}
                              {inv.entityType}
                            </span>
                            {inv.entityId && (
                              <span className="font-mono text-[10px] text-[#5A6B82]">
                                {inv.entityId}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Plan / Item */}
                    <td className="py-4 px-5">
                      {activeTab === 'Subscription' ? (
                        <div>
                          <span className="font-bold text-[#0B1F3A]">{inv.planName}</span>
                          <div className="text-[11px] text-[#5A6B82]">B2B Membership Tier</div>
                        </div>
                      ) : (
                        <div>
                          <span className="font-bold text-[#0B1F3A]">
                            {inv.productDescription || 'Polymer Consignment'}
                          </span>
                          <div className="font-mono text-[11px] text-[#5A6B82]">
                            PO: {inv.orderId || 'Direct'}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Billing Period */}
                    <td className="py-4 px-5">
                      <span className="text-[#0B1F3A]">{inv.billingPeriod}</span>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-5 font-mono font-bold text-[#0B1F3A]">
                      {formatINR(inv.amount)}
                      {inv.outstandingAmount && inv.outstandingAmount > 0 ? (
                        <div className="text-[10px] font-normal text-rose-600">
                          Due: {formatINR(inv.outstandingAmount)}
                        </div>
                      ) : null}
                    </td>

                    {/* Issued Date */}
                    <td className="py-4 px-5 text-[#5A6B82]">{inv.issuedDate}</td>

                    {/* Due Date */}
                    <td className="py-4 px-5">
                      <span
                        className={
                          inv.status === 'Overdue'
                            ? 'text-rose-600 font-bold'
                            : 'text-[#5A6B82]'
                        }
                      >
                        {inv.dueDate}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5 text-center">{getStatusBadge(inv.status)}</td>

                    {/* Actions: View & Download */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {/* View Invoice */}
                        <button
                          id={`btn-view-${inv.id}`}
                          type="button"
                          onClick={() => setSelectedInvoice(inv)}
                          title="View Invoice"
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F4F7FC] text-[#0B1F3A] hover:text-[#FF7A18] transition-colors cursor-pointer inline-flex items-center gap-1 text-xs font-bold shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        {/* Download Invoice */}
                        <button
                          id={`btn-download-${inv.id}`}
                          type="button"
                          onClick={() => handleDownloadInvoice(inv)}
                          title="Download Invoice File"
                          className="px-2.5 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-orange-50 hover:border-orange-200 text-[#5A6B82] hover:text-[#FF7A18] transition-colors cursor-pointer inline-flex items-center gap-1 text-xs font-bold"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Summary Status */}
        <div className="px-6 py-3.5 bg-[#FAFBFD] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#5A6B82] font-semibold gap-2">
          <div>
            Showing <span className="text-[#0B1F3A] font-bold">{filteredInvoices.length}</span> of{' '}
            <span className="text-[#0B1F3A] font-bold">{tabInvoices.length}</span> {activeTab} invoices
          </div>
          <div className="flex items-center gap-4">
            <span>
              Total Value:{' '}
              <strong className="text-[#0B1F3A] font-mono">
                {formatINR(filteredInvoices.reduce((sum, i) => sum + i.amount, 0))}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* VIEW INVOICE FULL MODAL */}
      {selectedInvoice && (
        <Modal
          isOpen={Boolean(selectedInvoice)}
          onClose={() => setSelectedInvoice(null)}
          title={`Invoice ${selectedInvoice.id}`}
          subtitle={`Official Tax Invoice for ${selectedInvoice.entityName}`}
          maxWidth="3xl"
        >
          <div id="invoice-printable-modal" className="space-y-6">
            {/* Invoice Printable Sheet */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 space-y-6 text-[#0B1F3A]">
              {/* Header: Company & Tax Details */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FF7A18] text-white tracking-wider uppercase">
                      PLASTOSHIP
                    </span>
                    <span className="text-xs font-bold text-[#5A6B82]">Gujarat B2B Portal</span>
                  </div>
                  <h4 className="text-lg font-black text-[#0B1F3A] mt-1.5">
                    PlastoShip Gujarat Regional Hub Pvt Ltd
                  </h4>
                  <p className="text-xs text-[#5A6B82] mt-0.5 leading-relaxed">
                    Tower 4, GIDC Infocity Complex, Gandhinagar, Gujarat 382009
                    <br />
                    GSTIN: <strong className="font-mono text-[#0B1F3A]">24AAACP9921D1ZQ</strong> | CIN: U25209GJ2024PTC109920
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs font-bold uppercase tracking-wide text-[#5A6B82]">
                    Tax Invoice / Bill
                  </div>
                  <div className="font-mono text-xl font-black text-[#0B1F3A] mt-0.5">
                    {selectedInvoice.id}
                  </div>
                  <div className="mt-2">{getStatusBadge(selectedInvoice.status)}</div>
                </div>
              </div>

              {/* Invoice Metadata Grid: Dates, Billing Period, Billed To */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F8FAFC] p-4.5 rounded-xl border border-[#E2E8F0] text-xs">
                {/* Billed To */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                    Billed To (Customer / Entity)
                  </span>
                  <div className="font-extrabold text-sm text-[#0B1F3A]">
                    {selectedInvoice.entityName}
                  </div>
                  <div className="flex items-center gap-2 text-[#5A6B82]">
                    <span>Type: <strong>{selectedInvoice.entityType}</strong></span>
                    <span>•</span>
                    <span className="font-mono">ID: {selectedInvoice.entityId || 'N/A'}</span>
                  </div>
                  <div className="font-mono text-[#5A6B82]">
                    GSTIN: <strong>{selectedInvoice.gstin || '24AAXXX0000X1XX'}</strong>
                  </div>
                  <div className="text-[#5A6B82]">State / Code: Gujarat (24)</div>
                </div>

                {/* Billing Specs */}
                <div className="space-y-1 md:text-right">
                  <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                    Invoice Details
                  </span>
                  <div>
                    <span className="text-[#5A6B82]">Issued Date:</span>{' '}
                    <strong className="text-[#0B1F3A]">{selectedInvoice.issuedDate}</strong>
                  </div>
                  <div>
                    <span className="text-[#5A6B82]">Payment Due Date:</span>{' '}
                    <strong className={selectedInvoice.status === 'Overdue' ? 'text-rose-600' : 'text-[#0B1F3A]'}>
                      {selectedInvoice.dueDate}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#5A6B82]">Billing Period:</span>{' '}
                    <strong className="text-[#0B1F3A]">{selectedInvoice.billingPeriod}</strong>
                  </div>
                  <div>
                    <span className="text-[#5A6B82]">Payment Method:</span>{' '}
                    <strong className="text-[#0B1F3A]">{selectedInvoice.paymentMethod || 'Razorpay B2B'}</strong>
                  </div>
                </div>
              </div>

              {/* Line Items Breakdown Table */}
              <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#5A6B82] uppercase tracking-wide">
                      <th className="py-2.5 px-4">Item Description</th>
                      <th className="py-2.5 px-4 font-mono text-center">HSN/SAC</th>
                      <th className="py-2.5 px-4 text-center">Qty / Period</th>
                      <th className="py-2.5 px-4 text-right">Taxable Rate (₹)</th>
                      <th className="py-2.5 px-4 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                      selectedInvoice.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-3 px-4">
                            <div className="font-bold text-[#0B1F3A]">{item.description}</div>
                            {selectedInvoice.orderId && (
                              <div className="text-[10px] text-[#5A6B82] font-mono">
                                PO Reference: {selectedInvoice.orderId}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-center text-[#5A6B82]">
                            {item.hsnSac}
                          </td>
                          <td className="py-3 px-4 text-center font-medium">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-medium">
                            {item.unitPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-[#0B1F3A]">
                            {item.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-3 px-4 font-bold text-[#0B1F3A]">
                          {selectedInvoice.planName || selectedInvoice.productDescription || 'Platform Service'}
                        </td>
                        <td className="py-3 px-4 font-mono text-center text-[#5A6B82]">
                          {selectedInvoice.hsnSacCode || '998313'}
                        </td>
                        <td className="py-3 px-4 text-center">1</td>
                        <td className="py-3 px-4 text-right font-mono">
                          {formatINR(selectedInvoice.taxableAmount || selectedInvoice.amount * 0.82)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold">
                          {formatINR(selectedInvoice.taxableAmount || selectedInvoice.amount * 0.82)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Financial Totals & Tax Breakdown */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 text-xs pt-2">
                <div className="max-w-xs space-y-1.5 text-[#5A6B82]">
                  <span className="text-[11px] font-bold text-[#0B1F3A] uppercase tracking-wide block">
                    Notes & Terms
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    {selectedInvoice.notes ||
                      '18% Integrated Goods and Services Tax applied under Section 9 of the CGST Act. All payments are electronically reconciled against your GSTIN.'}
                  </p>
                </div>

                <div className="w-full sm:w-72 space-y-2 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                  <div className="flex justify-between text-[#5A6B82]">
                    <span>Taxable Value:</span>
                    <span className="font-mono text-[#0B1F3A]">
                      {formatINR(selectedInvoice.taxableAmount || Math.round(selectedInvoice.amount / 1.18))}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#5A6B82]">
                    <span>CGST (9%):</span>
                    <span className="font-mono text-[#0B1F3A]">
                      {formatINR(
                        selectedInvoice.taxAmount
                          ? Math.round(selectedInvoice.taxAmount / 2)
                          : Math.round((selectedInvoice.amount - selectedInvoice.amount / 1.18) / 2)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#5A6B82]">
                    <span>SGST (9%):</span>
                    <span className="font-mono text-[#0B1F3A]">
                      {formatINR(
                        selectedInvoice.taxAmount
                          ? Math.round(selectedInvoice.taxAmount / 2)
                          : Math.round((selectedInvoice.amount - selectedInvoice.amount / 1.18) / 2)
                      )}
                    </span>
                  </div>
                  <div className="border-t border-[#E2E8F0] pt-2 flex justify-between font-bold text-sm text-[#0B1F3A]">
                    <span>Total Amount:</span>
                    <span className="font-mono text-base text-[#FF7A18]">
                      {formatINR(selectedInvoice.amount)}
                    </span>
                  </div>
                  {selectedInvoice.outstandingAmount && selectedInvoice.outstandingAmount > 0 ? (
                    <div className="flex justify-between text-xs font-bold text-rose-600 pt-1">
                      <span>Outstanding Due:</span>
                      <span className="font-mono">
                        {formatINR(selectedInvoice.outstandingAmount)}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Digital Seal & Authorizer */}
              <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5A6B82]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#0B1F3A]">Authorized Digital Seal</div>
                    <div className="text-[10px]">PlastoShip Regional Settlement Authority</div>
                  </div>
                </div>

                <div className="text-right text-[11px]">
                  <div>Automated GST E-Invoice IRN Verified</div>
                  <div className="font-mono text-[10px] text-[#5A6B82]">IRN: 8a7f920bc4...79e1</div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0B1F3A] hover:bg-[#F8FAFC] text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadInvoice(selectedInvoice)}
                className="px-4 py-2.5 rounded-xl bg-[#0B1F3A] text-white hover:bg-[#142B4C] text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download File</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2.5 rounded-xl bg-[#F4F7FC] hover:bg-[#E2E8F0] text-[#0B1F3A] text-xs font-bold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
