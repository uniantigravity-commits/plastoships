import React, { useState } from 'react';
import {
  Box,
  Check,
  AlertTriangle,
  XCircle,
  Search,
  Edit2,
  CheckCircle2,
  X,
} from 'lucide-react';
import { ManufacturerInventoryItem } from '../../types';
import { Modal } from '../../components/Modal';

interface MfrInventoryScreenProps {
  inventory?: ManufacturerInventoryItem[];
  onAddStock?: (item: ManufacturerInventoryItem) => void;
  onUpdateStock?: (item: ManufacturerInventoryItem) => void;
}

interface ProductStockItem {
  id: string;
  name: string;
  sku: string;
  image: string;
  category: string;
  availableQty: number;
  status: 'Available' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
}

export const MfrInventoryScreen: React.FC<MfrInventoryScreenProps> = ({
  inventory,
  onAddStock,
  onUpdateStock,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Stock items matching screenshot data
  const [stockItems, setStockItems] = useState<ProductStockItem[]>([
    {
      id: 'PLS-STO-101',
      name: 'Premium Kitchen Storage Box Set (3 Pcs)',
      sku: 'PLS-STO-101',
      image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=120&auto=format&fit=crop&q=80',
      category: 'Storage & Containers',
      availableQty: 2500,
      status: 'Available',
      lastUpdated: 'Oct 14, 2026',
    },
    {
      id: 'PLS-ORG-204',
      name: 'Modular Drawer Organizer (Large)',
      sku: 'PLS-ORG-204',
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=120&auto=format&fit=crop&q=80',
      category: 'Home Organisers',
      availableQty: 18,
      status: 'Low Stock',
      lastUpdated: 'Oct 12, 2026',
    },
    {
      id: 'PLS-LNC-005',
      name: 'Insulated Lunch Tiffin (4 Tier)',
      sku: 'PLS-LNC-005',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
      category: 'Kids & Lunch / Tiffins',
      availableQty: 1200,
      status: 'Available',
      lastUpdated: 'Oct 10, 2026',
    },
    {
      id: 'PLS-TBL-112',
      name: 'Microwave Safe Bowls (Set of 6)',
      sku: 'PLS-TBL-112',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=120&auto=format&fit=crop&q=80',
      category: 'Tableware & Serveware',
      availableQty: 0,
      status: 'Out of Stock',
      lastUpdated: 'Oct 09, 2026',
    },
    {
      id: 'PLS-STO-305',
      name: 'Stackable Vegetable Basket',
      sku: 'PLS-STO-305',
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=120&auto=format&fit=crop&q=80',
      category: 'Storage & Containers',
      availableQty: 45,
      status: 'Low Stock',
      lastUpdated: 'Oct 08, 2026',
    },
  ]);

  // Modal State for "Update Stock"
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductStockItem | null>(null);
  const [stockQuantityInput, setStockQuantityInput] = useState<string>('2500');
  const [stockRemarks, setStockRemarks] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenUpdateModal = (product?: ProductStockItem) => {
    const target = product || stockItems[0];
    setSelectedProduct(target);
    setStockQuantityInput(String(target.availableQty));
    setStockRemarks('');
    setIsUpdateModalOpen(true);
  };

  const handleSaveStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const newQty = parseInt(stockQuantityInput, 10) || 0;
    const newStatus: 'Available' | 'Low Stock' | 'Out of Stock' =
      newQty <= 0 ? 'Out of Stock' : newQty < 50 ? 'Low Stock' : 'Available';

    setStockItems((prev) =>
      prev.map((item) =>
        item.id === selectedProduct.id
          ? {
              ...item,
              availableQty: newQty,
              status: newStatus,
              lastUpdated: 'Oct 14, 2026',
            }
          : item
      )
    );

    setIsUpdateModalOpen(false);
    showToast(`Stock updated successfully for ${selectedProduct.name}`);
  };

  // Metrics
  const totalProductsCount = 45;
  const availableStockCount = stockItems.reduce((acc, curr) => acc + curr.availableQty, 14737); // sum up towards 18,500
  const lowStockItemsCount = stockItems.filter((i) => i.status === 'Low Stock').length + 1; // 3
  const outOfStockItemsCount = stockItems.filter((i) => i.status === 'Out of Stock').length; // 1

  // Low Stock Alert items for banner
  const lowStockAlerts = [
    {
      id: 'PLS-ORG-204',
      name: 'Modular Drawer Organizer (Large)',
      sku: 'PLS-ORG-204',
      units: '18 Units',
      unitColor: 'text-amber-600',
      product: stockItems.find((i) => i.id === 'PLS-ORG-204'),
    },
    {
      id: 'PLS-TBL-112',
      name: 'Microwave Safe Bowls (Set of 6)',
      sku: 'PLS-TBL-112',
      units: '0 Units',
      unitColor: 'text-red-600',
      product: stockItems.find((i) => i.id === 'PLS-TBL-112'),
    },
    {
      id: 'PLS-STO-305',
      name: 'Stackable Vegetable Basket',
      sku: 'PLS-STO-305',
      units: '45 Units',
      unitColor: 'text-amber-600',
      product: stockItems.find((i) => i.id === 'PLS-STO-305'),
    },
  ];

  const filteredItems = stockItems.filter((item) => {
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

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

      {/* Top Header with Update Stock Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Inventory
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6B82] mt-1 font-normal">
            Monitor product availability and manage stock levels
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenUpdateModal(stockItems[0])}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4B49AC] hover:bg-[#3F3D99] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Edit2 className="w-4 h-4" />
          <span>Update Stock</span>
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL PRODUCTS */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
              TOTAL PRODUCTS
            </span>
            <div className="w-6 h-6 rounded-full bg-[#EEEDFD] text-[#4B49AC] flex items-center justify-center">
              <Box className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-slate-900">
              {totalProductsCount}
            </span>
          </div>
        </div>

        {/* AVAILABLE STOCK */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
              AVAILABLE STOCK
            </span>
            <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-slate-900">
              18,500
            </span>
          </div>
        </div>

        {/* LOW STOCK ITEMS */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
              LOW STOCK ITEMS
            </span>
            <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-slate-900">
              {lowStockItemsCount}
            </span>
          </div>
        </div>

        {/* OUT OF STOCK */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
              OUT OF STOCK
            </span>
            <div className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-slate-900">
              {outOfStockItemsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts Section Card */}
      <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Low Stock Alerts
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {lowStockAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-2xs flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  {alert.name}
                </h4>
                <p className="text-xs text-[#5A6B82] font-mono mt-0.5">
                  {alert.sku}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-xs sm:text-sm font-bold block ${alert.unitColor}`}>
                  {alert.units}
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenUpdateModal(alert.product)}
                  className="text-xs font-semibold text-[#4B49AC] hover:text-[#3F3D99] hover:underline mt-0.5 cursor-pointer block"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Stock Listing Table Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {/* Card Header with Search Input */}
        <div className="p-5 sm:p-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#F1F5F9]">
          <h3 className="text-base font-bold text-slate-900">
            Product Stock Listing
          </h3>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product or SKU..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs sm:text-sm text-slate-900 placeholder-[#94A3B8] focus:outline-none focus:border-[#4B49AC]"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider bg-white">
                <th className="py-4 px-5">PRODUCT</th>
                <th className="py-4 px-5">DETAILS</th>
                <th className="py-4 px-5">CATEGORY</th>
                <th className="py-4 px-5 text-right">AVAILABLE QTY</th>
                <th className="py-4 px-5 text-center">STATUS</th>
                <th className="py-4 px-5">LAST UPDATED</th>
                <th className="py-4 px-5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-xs sm:text-sm text-slate-800">
              {filteredItems.map((item) => {
                const isAvailable = item.status === 'Available';
                const isLowStock = item.status === 'Low Stock';
                const isOutOfStock = item.status === 'Out of Stock';

                return (
                  <tr key={item.id} className="hover:bg-[#EEEDFD]/30 transition-colors">
                    {/* PRODUCT IMAGE */}
                    <td className="py-4 px-5">
                      <div className="w-11 h-11 rounded-lg border border-[#E2E8F0] bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* DETAILS */}
                    <td className="py-4 px-5">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-xs text-[#5A6B82] font-mono mt-0.5">{item.sku}</p>
                    </td>

                    {/* CATEGORY */}
                    <td className="py-4 px-5 text-[#5A6B82] font-normal">
                      {item.category}
                    </td>

                    {/* AVAILABLE QTY */}
                    <td className="py-4 px-5 text-right font-bold text-slate-900">
                      {item.availableQty.toLocaleString()}
                    </td>

                    {/* STATUS */}
                    <td className="py-4 px-5 text-center">
                      {isAvailable && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                          <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                          Available
                        </span>
                      )}
                      {isLowStock && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Low Stock
                        </span>
                      )}
                      {isOutOfStock && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          Out of Stock
                        </span>
                      )}
                    </td>

                    {/* LAST UPDATED */}
                    <td className="py-4 px-5 text-[#5A6B82] font-normal">
                      {item.lastUpdated}
                    </td>

                    {/* ACTIONS */}
                    <td className="py-4 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenUpdateModal(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D6D4F7] bg-white hover:bg-[#EEEDFD] text-[#4B49AC] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#4B49AC]" />
                        <span>Update Stock</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Stock Modal */}
      {isUpdateModalOpen && selectedProduct && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          title="Update Stock"
        >
          <form onSubmit={handleSaveStock} className="space-y-4">
            {/* Product Information Card */}
            <div>
              <label className="block text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider mb-1.5">
                PRODUCT INFORMATION
              </label>
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  {selectedProduct.name}
                </h4>
                <p className="text-xs text-[#5A6B82] font-mono mt-0.5">
                  SKU: {selectedProduct.sku}
                </p>
              </div>
            </div>

            {/* Current Stock vs New Stock Quantity */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider mb-1.5">
                  CURRENT STOCK
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedProduct.availableQty.toLocaleString()}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-slate-50 text-xs sm:text-sm text-[#5A6B82] font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider mb-1.5">
                  NEW STOCK QUANTITY
                </label>
                <input
                  type="number"
                  required
                  value={stockQuantityInput}
                  onChange={(e) => setStockQuantityInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:border-[#4B49AC]"
                />
              </div>
            </div>

            {/* Remarks (Optional) */}
            <div>
              <label className="block text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider mb-1.5">
                REMARKS (OPTIONAL)
              </label>
              <textarea
                rows={3}
                value={stockRemarks}
                onChange={(e) => setStockRemarks(e.target.value)}
                placeholder="e.g. New production batch arrived..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs sm:text-sm text-slate-900 placeholder-[#94A3B8] focus:outline-none focus:border-[#4B49AC]"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={() => setIsUpdateModalOpen(false)}
                className="px-5 py-2 rounded-xl border border-[#CBD5E1] bg-white text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#4B49AC] hover:bg-[#3F3D99] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Update Stock
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
