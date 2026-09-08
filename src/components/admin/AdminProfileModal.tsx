import React, { useState } from 'react';
import {
  X,
  Shield,
  User,
  Phone,
  Mail,
  Building,
  Save,
  Edit3,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminProfileModal: React.FC<AdminProfileModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Super Admin',
    email: 'admin@plastoship.com',
    phone: '+91 79 4001 2200',
    department: 'Gujarat Polymer Operations & Compliance',
    roleTitle: 'Chief System Administrator',
    location: 'PlastoShip HQ, Gandhinagar, Gujarat',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    if (onShowToast) {
      onShowToast('Admin Profile Saved', 'Administrator profile information updated successfully.', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0B1F3A]">Admin Profile</h3>
              <p className="text-[11px] text-[#5A6B82]">System Administrator Credentials</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] hover:border-[#FF7A18] hover:text-[#FF7A18] text-[#0B1F3A] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] text-[#5A6B82] hover:text-[#0B1F3A] text-xs font-bold transition-all cursor-pointer bg-white"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#5A6B82] hover:text-[#0B1F3A] hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-[#0B1F3A] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-bold text-sm text-emerald-300">
                SA
              </div>
              <div>
                <p className="font-extrabold text-sm">{formData.name}</p>
                <p className="text-xs text-slate-300">{formData.email}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white">
              SUPER ADMIN
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-[#0B1F3A] uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] disabled:bg-[#F8FAFC] disabled:text-[#5A6B82] text-[#0B1F3A] font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#0B1F3A] uppercase tracking-wider mb-1">
                Official Email
              </label>
              <input
                type="email"
                disabled={!isEditing}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] disabled:bg-[#F8FAFC] disabled:text-[#5A6B82] text-[#0B1F3A] font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#0B1F3A] uppercase tracking-wider mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] disabled:bg-[#F8FAFC] disabled:text-[#5A6B82] text-[#0B1F3A] font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#0B1F3A] uppercase tracking-wider mb-1">
                Department & Scope
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] disabled:bg-[#F8FAFC] disabled:text-[#5A6B82] text-[#0B1F3A] font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#0B1F3A] uppercase tracking-wider mb-1">
                Office Location
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full h-9.5 px-3 rounded-xl border border-[#E2E8F0] disabled:bg-[#F8FAFC] disabled:text-[#5A6B82] text-[#0B1F3A] font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-[#0B1F3A] text-xs font-bold hover:bg-[#F4F7FC] cursor-pointer"
            >
              Close
            </button>
            {isEditing && (
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#142d4f] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
