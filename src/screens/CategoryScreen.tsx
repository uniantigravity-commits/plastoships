import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Layers,
  Search,
  Check,
  X,
  Tag,
  IndianRupee,
} from 'lucide-react';
import { Category } from '../types';
import { Modal } from '../components/Modal';

interface CategoryScreenProps {
  categories: Category[];
  onAddCategory: (cat: Omit<Category, 'id'>) => void;
  onEditCategory: (cat: Category) => void;
  onToggleStatus: (id: string) => void;
}

export const CategoryScreen: React.FC<CategoryScreenProps> = ({
  categories,
  onAddCategory,
  onEditCategory,
  onToggleStatus,
}) => {
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states for adding
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newHsn, setNewHsn] = useState('');
  const [newAvgPrice, setNewAvgPrice] = useState('110');

  const filtered = categories.filter((c) => {
    const q = (search || '').toLowerCase().trim();
    if (!q) return true;
    return (
      (c.name || '').toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q) ||
      (c.hsnCode || '').includes(search)
    );
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddCategory({
      name: newName.trim(),
      slug: newName.trim().toLowerCase().replace(/\s+/g, '-'),
      description: newDescription.trim() || 'PlastoShip verified polymer marketplace classification.',
      hsnCode: newHsn.trim() || '39019000',
      productCount: 0,
      status: 'Active',
      iconName: 'Boxes',
      avgPricePerKg: parseFloat(newAvgPrice) || 100,
    });

    setNewName('');
    setNewDescription('');
    setNewHsn('');
    setNewAvgPrice('110');
    setIsAddOpen(false);
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    onEditCategory(editingCategory);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Add Category CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0B1F3A] tracking-tight">
            Category Management
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-[#FF7A18] hover:bg-[#E56A10] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#5A6B82] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search category name..."
            className="w-full h-10 pl-9.5 pr-4 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium placeholder-[#5A6B82] focus:outline-none focus:border-[#0B1F3A] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
                <th className="py-4 px-6 w-[50%]">Category Name</th>
                <th className="py-4 px-4 w-[20%]">Products Listed</th>
                <th className="py-4 px-4 w-[18%]">Status / Visibility</th>
                <th className="py-4 px-6 w-[12%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-xs">
              {filtered.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#F4F7FC]/70 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <span className="font-bold text-[#0B1F3A] text-sm block">
                        {cat.name}
                      </span>
                      <p className="text-[11px] text-[#5A6B82] mt-0.5">
                        {cat.description}
                      </p>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-extrabold text-[#0B1F3A] text-xs">
                      {cat.productCount} SKUs
                    </span>
                  </td>

                  {/* Active/Inactive Toggle */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(cat.id)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        cat.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-300'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          cat.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                      <span>{cat.status}</span>
                    </button>
                  </td>

                  {/* Edit Action */}
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingCategory(cat)}
                        className="px-3 py-1.5 text-xs font-bold text-[#0B1F3A] hover:bg-[#F4F7FC] rounded-lg border border-[#E2E8F0] transition-colors flex items-center gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5 text-[#5A6B82]" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD CATEGORY MODAL */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Category"
        maxWidth="md"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
              Category Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Polycarbonate Optical Resins"
              className="w-full h-10 px-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium focus:outline-none focus:border-[#0B1F3A] focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={3}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Brief description of category..."
              className="w-full p-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium focus:outline-none focus:border-[#0B1F3A] focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 text-xs font-bold text-[#5A6B82] hover:text-[#0B1F3A] rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FF7A18] hover:bg-[#E56A10] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Create Category
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT CATEGORY MODAL */}
      <Modal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title="Edit Category Details"
        maxWidth="md"
      >
        {editingCategory && (
          <form onSubmit={handleUpdateCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
                Category Name
              </label>
              <input
                type="text"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                className="w-full h-10 px-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium focus:outline-none focus:border-[#0B1F3A] focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
                Description
              </label>
              <textarea
                rows={3}
                value={editingCategory.description}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, description: e.target.value })
                }
                className="w-full p-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium focus:outline-none focus:border-[#0B1F3A] focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 text-xs font-bold text-[#5A6B82] hover:text-[#0B1F3A] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Save Category
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
