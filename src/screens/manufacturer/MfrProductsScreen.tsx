import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Edit2,
  X,
  Layers,
  Box,
  Trash2,
  Check,
  Building,
  ArrowLeft,
  Upload,
} from 'lucide-react';
import { Product } from '../../types';
import { Modal } from '../../components/Modal';

interface MfrProductsScreenProps {
  products: Product[];
  manufacturerId: string;
  manufacturerName: string;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

interface ProductItem {
  id: string;
  image?: string;
  images?: string[];
  productName: string;
  category: string;
  subCategory?: string;
  sku?: string;
  price?: number;
  stockStatus?: 'In Stock' | 'Out of Stock';
  approvalStatus: 'Active' | 'Pending' | 'Rejected';
  description?: string;
}

export const MfrProductsScreen: React.FC<MfrProductsScreenProps> = ({
  products,
  manufacturerId,
  manufacturerName,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  // Sample initial items matching the design mock exactly
  const [productList, setProductList] = useState<ProductItem[]>([
    {
      id: 'prod-1',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=120&auto=format&fit=crop&q=80',
      productName: 'Premium Kitchen Storage Box Set (3 Pcs)',
      category: 'Storage Containers',
      subCategory: 'Airtight Containers',
      approvalStatus: 'Active',
      description: 'BPA-free airtight food storage container set with modular stackable design.',
    },
    {
      id: 'prod-2',
      image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=120&auto=format&fit=crop&q=80',
      productName: 'Modular Drawer Organizer (Large)',
      category: 'Organizers',
      subCategory: 'Kitchen Organizers',
      approvalStatus: 'Active',
      description: 'Durable multi-compartment drawer organizer for pantry and kitchen utensils.',
    },
    {
      id: 'prod-3',
      image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=120&auto=format&fit=crop&q=80',
      productName: 'Insulated Lunch Tiffin (4 Tier)',
      category: 'Tiffins & Lunchware',
      subCategory: 'Food Storage',
      approvalStatus: 'Pending',
      description: 'Thermal insulated multi-layer lunch container with leak-lock silicon seals.',
    },
    {
      id: 'prod-4',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=120&auto=format&fit=crop&q=80',
      productName: 'Microwave Safe Bowls (Set of 6)',
      category: 'Tableware',
      subCategory: 'Tableware',
      approvalStatus: 'Rejected',
      description: 'Food-grade microwave safe polymer bowl set for everyday dining.',
    },
  ]);

  // View mode: list view or full Add Product page matching design
  const [viewMode, setViewMode] = useState<'list' | 'add'>('list');

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<ProductItem>({
    id: '',
    productName: '',
    category: 'Storage Containers',
    subCategory: '',
    approvalStatus: 'Pending',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
    description: '',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Stat metrics
  const totalProductsCount = 145;
  const activeProductsCount = 120;
  const pendingApprovalCount = 18;
  const underReviewCount = 7;

  const handleOpenAdd = () => {
    setFormData({
      id: `prod-${Date.now()}`,
      productName: '',
      category: 'Storage Containers',
      subCategory: '',
      approvalStatus: 'Pending',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
      description: '',
    });
    setViewMode('add');
  };

  const handleOpenEdit = (prod: ProductItem) => {
    setSelectedProduct(prod);
    setFormData({ ...prod });
    setIsEditModalOpen(true);
  };

  const handleOpenView = (prod: ProductItem) => {
    setSelectedProduct(prod);
    setIsViewModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName.trim()) return;

    setProductList([formData, ...productList]);
    setViewMode('list');
    showToast(`Product "${formData.productName}" added successfully.`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName.trim()) return;

    setProductList(productList.map((p) => (p.id === formData.id ? formData : p)));
    setIsEditModalOpen(false);
    showToast(`Product "${formData.productName}" updated successfully.`);
  };

  if (viewMode === 'add') {
    return (
      <div className="space-y-6 pb-16 max-w-4xl">
        {/* Header with Back Arrow */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-700 transition-colors cursor-pointer"
            title="Back to products"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Add Product
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6B82] mt-0.5 font-normal">
              Create a new product listing in your catalog
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveAdd} className="space-y-6">
          {/* 1. Basic Details Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900">
              Basic Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Product Name
              </label>
              <input
                type="text"
                required
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                placeholder="e.g. Classic Airtight Container (5 Ltrs)"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4B49AC] focus:ring-1 focus:ring-[#4B49AC]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-slate-900 bg-white focus:outline-none focus:border-[#4B49AC] focus:ring-1 focus:ring-[#4B49AC]"
                >
                  <option value="Storage Containers">Storage Containers</option>
                  <option value="Organizers">Organizers</option>
                  <option value="Tiffins & Lunchware">Tiffins & Lunchware</option>
                  <option value="Tableware">Tableware</option>
                  <option value="Household Plastics">Household Plastics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Sub Category
                </label>
                <select
                  value={formData.subCategory || ''}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-slate-900 bg-white focus:outline-none focus:border-[#4B49AC] focus:ring-1 focus:ring-[#4B49AC]"
                >
                  <option value="">Select Sub Category</option>
                  <option value="Airtight Containers">Airtight Containers</option>
                  <option value="Kitchen Organizers">Kitchen Organizers</option>
                  <option value="Modular Storage">Modular Storage</option>
                  <option value="Food Storage">Food Storage</option>
                  <option value="Dry Storage Jars">Dry Storage Jars</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Product Description
              </label>
              <textarea
                rows={4}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of your product..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4B49AC] focus:ring-1 focus:ring-[#4B49AC]"
              />
            </div>
          </div>

          {/* 2. Product Images Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900">
              Product Images
            </h3>

            {/* Upload Drop Area */}
            <div className="border-2 border-dashed border-[#CBD5E1] rounded-2xl p-8 sm:p-10 text-center hover:border-[#4B49AC] bg-[#F8FAFC] transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-[#5A6B82] group-hover:text-[#4B49AC] group-hover:bg-[#EEEDFD] transition-colors">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-900">
                Click or drag to upload images
              </p>
              <p className="text-xs text-[#5A6B82] mt-1 font-normal">
                PNG, JPG up to 5MB (Max 5 images)
              </p>
            </div>

            {/* Uploaded Images Gallery Row */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
              <div className="aspect-square rounded-xl bg-slate-100 border border-[#E2E8F0] overflow-hidden relative group shadow-2xs">
                <img
                  src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80"
                  alt="Product 1"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1.5 left-1.5 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                  Product 1
                </span>
              </div>

              <div className="aspect-square rounded-xl bg-slate-100 border border-[#E2E8F0] overflow-hidden relative group shadow-2xs">
                <img
                  src="https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=300&auto=format&fit=crop&q=80"
                  alt="Product 2"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1.5 left-1.5 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                  Product 2
                </span>
              </div>

              <div className="aspect-square rounded-xl bg-slate-100 border border-[#E2E8F0] overflow-hidden relative group shadow-2xs">
                <img
                  src="https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=300&auto=format&fit=crop&q=80"
                  alt="Product 3"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1.5 left-1.5 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                  Product 3
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-[#5A6B82] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#4B49AC] hover:bg-[#3F3D99] text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Save Product
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Products
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6B82] mt-1 font-normal">
            Manage your product range and availability
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#4B49AC] hover:bg-[#3F3D99] text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stat Cards Grid (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Products */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-[#5A6B82]">
              Total Products
            </span>
            <div className="w-7 h-7 rounded-full bg-[#EEEDFD] text-[#4B49AC] flex items-center justify-center">
              <Box className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalProductsCount}
            </span>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-[#5A6B82]">
              Active Products
            </span>
            <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeProductsCount}
            </span>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-[#5A6B82]">
              Pending Approval
            </span>
            <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {pendingApprovalCount}
            </span>
          </div>
        </div>

        {/* Under Review */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-[#5A6B82]">
              Under Review
            </span>
            <div className="w-7 h-7 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {underReviewCount}
            </span>
          </div>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-xs font-semibold text-[#5A6B82] bg-[#F8FAFC]">
                <th className="py-4 px-6 w-20">Image</th>
                <th className="py-4 px-6">Product Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Sub Category</th>
                <th className="py-4 px-6">Approval Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-xs sm:text-sm text-slate-900">
              {productList.map((product) => {
                const isActive = product.approvalStatus === 'Active';
                const isPending = product.approvalStatus === 'Pending';
                const isRejected = product.approvalStatus === 'Rejected';

                return (
                  <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Image */}
                    <td className="py-4 px-6">
                      <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden flex items-center justify-center shrink-0">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.productName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Package className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </td>

                    {/* Product Name */}
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {product.productName}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 text-[#5A6B82] font-normal">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg font-medium text-xs border border-slate-200 inline-block">
                        {product.category}
                      </span>
                    </td>

                    {/* Sub Category */}
                    <td className="py-4 px-6 text-[#5A6B82] text-xs font-medium">
                      {product.subCategory || 'General'}
                    </td>

                    {/* Approval Status */}
                    <td className="py-4 px-6">
                      {isActive && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                          <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                          Active
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Pending
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
                          <AlertCircle className="w-3 h-3 text-rose-500" />
                          Rejected
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3 text-slate-500">
                        <button
                          type="button"
                          onClick={() => handleOpenView(product)}
                          className="hover:text-slate-900 p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="View Product"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(product)}
                          className="hover:text-slate-900 p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Product">
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                required
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-slate-900 focus:outline-none focus:border-[#4B49AC]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-slate-900 focus:outline-none focus:border-[#4B49AC]"
                >
                  <option value="Storage Containers">Storage Containers</option>
                  <option value="Organizers">Organizers</option>
                  <option value="Tiffins & Lunchware">Tiffins & Lunchware</option>
                  <option value="Tableware">Tableware</option>
                  <option value="Household Plastics">Household Plastics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sub Category
                </label>
                <select
                  value={formData.subCategory || ''}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-slate-900 focus:outline-none focus:border-[#4B49AC]"
                >
                  <option value="">Select Sub Category</option>
                  <option value="Airtight Containers">Airtight Containers</option>
                  <option value="Kitchen Organizers">Kitchen Organizers</option>
                  <option value="Modular Storage">Modular Storage</option>
                  <option value="Food Storage">Food Storage</option>
                  <option value="Dry Storage Jars">Dry Storage Jars</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Product Description
              </label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-slate-900 focus:outline-none focus:border-[#4B49AC]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#4B49AC] hover:bg-[#3F3D99] text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Update Product
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && selectedProduct && (
        <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Product Details" maxWidth="lg">
          <div className="space-y-4">
            {/* Basic Details */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Basic Details
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#5A6B82] block text-[11px] mb-0.5 font-medium">Product Name</span>
                  <p className="font-bold text-slate-900">{selectedProduct.productName}</p>
                </div>
                <div>
                  <span className="text-[#5A6B82] block text-[11px] mb-0.5 font-medium">Approval Status</span>
                  <span className="font-bold text-slate-900">{selectedProduct.approvalStatus}</span>
                </div>
                <div>
                  <span className="text-[#5A6B82] block text-[11px] mb-0.5 font-medium">Category</span>
                  <span className="inline-block px-2 py-0.5 rounded bg-[#4B49AC] text-white text-xs font-semibold">
                    {selectedProduct.category}
                  </span>
                </div>
                <div>
                  <span className="text-[#5A6B82] block text-[11px] mb-0.5 font-medium">Sub Category</span>
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-xs font-semibold">
                    {selectedProduct.subCategory || 'General'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[#5A6B82] block text-[11px] mb-1 font-medium">Product Description</span>
                <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                  {selectedProduct.description || 'No description provided.'}
                </p>
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Product Images
              </h4>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="aspect-square rounded-xl bg-white border border-[#E2E8F0] overflow-hidden relative shadow-2xs">
                  <img
                    src={selectedProduct.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80"}
                    alt="Product 1"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[9px] px-1.5 py-0.5 rounded font-medium">
                    Product 1
                  </span>
                </div>
                <div className="aspect-square rounded-xl bg-white border border-[#E2E8F0] overflow-hidden relative shadow-2xs">
                  <img
                    src="https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=300&auto=format&fit=crop&q=80"
                    alt="Product 2"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[9px] px-1.5 py-0.5 rounded font-medium">
                    Product 2
                  </span>
                </div>
                <div className="aspect-square rounded-xl bg-white border border-[#E2E8F0] overflow-hidden relative shadow-2xs">
                  <img
                    src="https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=300&auto=format&fit=crop&q=80"
                    alt="Product 3"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[9px] px-1.5 py-0.5 rounded font-medium">
                    Product 3
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
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
