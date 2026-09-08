import React, { useState } from 'react';
import {
  Package,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Tag,
  Boxes,
  IndianRupee,
  Layers,
  Sparkles,
  Ban,
} from 'lucide-react';
import { Product, ProductStatus } from '../types';
import { Modal } from '../components/Modal';

interface ProductScreenProps {
  products: Product[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onUpdateProduct?: (updated: Product) => void;
}

// Helper to format MOQ (removes metric tons/MT)
const formatMoq = (moq: string) => {
  if (!moq) return '';
  return moq
    .replace(/\s*Metric\s+Tons?\s*\((?:MT|mt)\)/gi, '')
    .replace(/\s*Metric\s+Tons?/gi, '')
    .trim();
};

export const ProductScreen: React.FC<ProductScreenProps> = ({
  products,
  onApprove,
  onReject,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ProductStatus>('All');

  // Modal states
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [rejectProduct, setRejectProduct] = useState<Product | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filtered = products.filter((p) => {
    const q = (search || '').toLowerCase().trim();
    if (!q) return statusFilter === 'All' || p.status === statusFilter;

    const matchesSearch =
      (p.productName || p.name || '').toLowerCase().includes(q) ||
      (p.manufacturerName || p.manufacturer || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.id || '').toLowerCase().includes(q) ||
      (p.polymerGrade || p.grade || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleConfirmReject = () => {
    if (!rejectProduct) return;
    if (!rejectReason.trim()) {
      alert('Please enter a rejection reason.');
      return;
    }
    onReject(rejectProduct.id, rejectReason.trim());
    setRejectProduct(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0B1F3A] tracking-tight">
            Product Management
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
            placeholder="Search product, grade, manufacturer..."
            className="w-full h-10 pl-9.5 pr-4 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium placeholder-[#5A6B82] focus:outline-none focus:border-[#0B1F3A] focus:bg-white transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4F7FC] rounded-xl border border-[#E2E8F0] w-full md:w-auto overflow-x-auto">
          {(['All', 'Pending', 'Approved', 'Rejected', 'Suspended'] as const).map((tab) => {
            const count =
              tab === 'All'
                ? products.length
                : products.filter((p) => p.status === tab).length;
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

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
                <th className="py-4 px-6 w-20">Image</th>
                <th className="py-4 px-4 w-[28%]">Product Name</th>
                <th className="py-4 px-4 w-[22%]">Manufacturer</th>
                <th className="py-4 px-4 w-[18%]">Category</th>
                <th className="py-4 px-4 w-[16%]">Status</th>
                <th className="py-4 px-6 w-[16%] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#5A6B82]">
                    <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-sm text-[#0B1F3A]">No products found</p>
                    <p className="text-xs text-[#5A6B82] mt-0.5">Try changing your search filters.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((prd) => (
                  <tr key={prd.id} className="hover:bg-[#F4F7FC]/70 transition-colors">
                    {/* Product Image */}
                    <td className="py-4 px-6">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                        <img
                          src={prd.image}
                          alt={prd.productName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </td>

                    {/* Product Name + ID */}
                    <td className="py-4 px-4">
                      <div>
                        <span className="font-bold text-[#0B1F3A] hover:text-[#FF7A18] transition-colors block text-xs leading-snug">
                          {prd.productName}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono-code text-[10px] text-[#5A6B82] bg-[#F4F7FC] px-1.5 py-0.5 rounded border border-slate-200">
                            {prd.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Manufacturer */}
                    <td className="py-4 px-4">
                      <p className="font-semibold text-[#0B1F3A] text-xs">
                        {prd.manufacturerName}
                      </p>
                      <p className="font-mono-code text-[10px] text-[#5A6B82] mt-0.5">{prd.manufacturerId}</p>
                    </td>

                    {/* Category & Sub Category */}
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-[#0B1F3A] rounded-lg font-medium text-[11px] border border-slate-200 inline-block whitespace-nowrap">
                        {prd.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {prd.status === 'Approved' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Approved</span>
                        </span>
                      )}
                      {prd.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                          <span>Pending Review</span>
                        </span>
                      )}
                      {prd.status === 'Rejected' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                          <XCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Rejected</span>
                        </span>
                      )}
                      {prd.status === 'Suspended' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                          <Ban className="w-3.5 h-3.5 shrink-0" />
                          <span>Suspended</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Approve and Reject Buttons (Only shown for Pending / Rejected, never once Approved) */}
                        {prd.status === 'Pending' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => onApprove(prd.id)}
                              className="px-2.5 py-1 text-xs font-bold rounded-lg transition-colors shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                              title="Approve Listing"
                            >
                              Approve
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setRejectProduct(prd);
                                setRejectReason(prd.rejectionReason || '');
                              }}
                              className="px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 cursor-pointer"
                              title="Reject Listing"
                            >
                              Reject
                            </button>
                          </>
                        ) : prd.status === 'Rejected' ? (
                          <button
                            type="button"
                            onClick={() => onApprove(prd.id)}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                            title="Re-approve Listing"
                          >
                            Approve
                          </button>
                        ) : null}

                        {/* View Details */}
                        <button
                          type="button"
                          onClick={() => setViewProduct(prd)}
                          className="p-1.5 text-[#0B1F3A] hover:bg-[#F4F7FC] hover:text-[#FF7A18] rounded-lg border border-[#E2E8F0] transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW PRODUCT DETAILS MODAL */}
      <Modal
        isOpen={!!viewProduct}
        onClose={() => setViewProduct(null)}
        title={viewProduct?.productName || 'Product Details'}
        subtitle={`ID: ${viewProduct?.id}`}
        maxWidth="2xl"
      >
        {viewProduct && (
          <div className="space-y-5">
            {/* Basic Details Card */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider">
                Basic Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#5A6B82] block text-[11px] font-semibold mb-1">
                    Product Name
                  </span>
                  <p className="font-bold text-[#0B1F3A] text-sm">
                    {viewProduct.productName}
                  </p>
                </div>

                <div>
                  <span className="text-[#5A6B82] block text-[11px] font-semibold mb-1">
                    Manufacturer
                  </span>
                  <p className="font-bold text-[#0B1F3A] text-sm">
                    {viewProduct.manufacturerName}{' '}
                    <span className="font-normal text-[11px] text-[#5A6B82]">({viewProduct.manufacturerId})</span>
                  </p>
                </div>

                <div>
                  <span className="text-[#5A6B82] block text-[11px] font-semibold mb-1">
                    Category
                  </span>
                  <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0B1F3A] text-white">
                    {viewProduct.category}
                  </span>
                </div>

                <div>
                  <span className="text-[#5A6B82] block text-[11px] font-semibold mb-1">
                    Sub Category
                  </span>
                  <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-200 text-[#0B1F3A]">
                    {viewProduct.subCategory || 'General Goods'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[#5A6B82] block text-[11px] font-semibold mb-1">
                  Product Description
                </span>
                <p className="text-xs text-[#0B1F3A] leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                  {viewProduct.description || 'No detailed description provided.'}
                </p>
              </div>
            </div>

            {/* Product Images Card */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider">
                Product Images
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="relative aspect-square rounded-xl bg-white border border-[#E2E8F0] overflow-hidden p-1 shadow-2xs group">
                  <img
                    src={viewProduct.image}
                    alt="Product 1"
                    className="w-full h-full object-cover rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-[#0B1F3A]/80 text-white rounded text-[10px] font-semibold">
                    Product 1 (Cover)
                  </span>
                </div>

                <div className="relative aspect-square rounded-xl bg-white border border-[#E2E8F0] overflow-hidden p-1 shadow-2xs group">
                  <img
                    src={viewProduct.image}
                    alt="Product 2"
                    className="w-full h-full object-cover rounded-lg filter brightness-95"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-[#0B1F3A]/80 text-white rounded text-[10px] font-semibold">
                    Product 2
                  </span>
                </div>

                <div className="relative aspect-square rounded-xl bg-white border border-[#E2E8F0] overflow-hidden p-1 shadow-2xs group">
                  <img
                    src={viewProduct.image}
                    alt="Product 3"
                    className="w-full h-full object-cover rounded-lg filter brightness-90"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-[#0B1F3A]/80 text-white rounded text-[10px] font-semibold">
                    Product 3
                  </span>
                </div>
              </div>
            </div>

            {/* Rejection Note if any */}
            {viewProduct.rejectionReason && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                <p className="font-bold">Rejection Note on Record:</p>
                <p className="mt-1">{viewProduct.rejectionReason}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setViewProduct(null)}
                className="px-4 py-2 text-xs font-bold text-[#5A6B82] hover:text-[#0B1F3A] rounded-xl cursor-pointer"
              >
                Close
              </button>
              {viewProduct.status === 'Pending' && (
                <button
                  type="button"
                  onClick={() => {
                    const p = viewProduct;
                    setViewProduct(null);
                    setRejectProduct(p);
                    setRejectReason(p.rejectionReason || '');
                  }}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Reject Listing
                </button>
              )}
              {viewProduct.status !== 'Approved' && (
                <button
                  type="button"
                  onClick={() => {
                    onApprove(viewProduct.id);
                    setViewProduct(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Approve Product Listing
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* REJECT PRODUCT MODAL */}
      <Modal
        isOpen={!!rejectProduct}
        onClose={() => setRejectProduct(null)}
        title="Reject Product Listing"
        subtitle={rejectProduct?.productName}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
              Rejection Reason / Technical Deficiency
            </label>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Incomplete TDS laboratory test parameters or invalid pricing..."
              className="w-full p-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A] focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setRejectProduct(null)}
              className="px-4 py-2 text-xs font-bold text-[#5A6B82] hover:text-[#0B1F3A] rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmReject}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
