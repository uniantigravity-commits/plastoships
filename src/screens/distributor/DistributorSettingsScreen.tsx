import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  MapPin,
  Users,
  Shield,
  Lock,
  Plus,
  Trash2,
  CheckCircle2,
  Check,
  Building2,
  Smartphone,
  Mail,
  X,
} from 'lucide-react';
import { DistributorProfileData, DistributorDeliveryAddress } from '../../types';
import { INITIAL_DISTRIBUTOR_PROFILE } from '../../mockData';

interface DistributorSettingsScreenProps {
  profile?: DistributorProfileData;
  addresses?: DistributorDeliveryAddress[];
  onAddAddress: (newAddr: DistributorDeliveryAddress) => void;
  onDeleteAddress: (id: string) => void;
  onSetDefaultAddress: (id: string) => void;
}

export const DistributorSettingsScreen: React.FC<DistributorSettingsScreenProps> = ({
  profile = INITIAL_DISTRIBUTOR_PROFILE,
  addresses = [],
  onAddAddress,
  onDeleteAddress,
  onSetDefaultAddress,
}) => {
  const [activeTab, setActiveTab] = useState<'warehouses' | 'notifications' | 'team' | 'security'>('warehouses');
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);

  // Address Form
  const [addressForm, setAddressForm] = useState({
    label: '',
    contactName: '',
    phone: '',
    address: '',
    city: 'Ahmedabad',
    pincode: '382445',
  });

  // Notification Preferences
  const [notifState, setNotifState] = useState({
    whatsappQuotes: true,
    whatsappDispatches: true,
    emailInvoices: true,
    emailPriceTrends: false,
    smsOtp: true,
  });

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState(false);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.label || !addressForm.address) return;

    const newAddr: DistributorDeliveryAddress = {
      id: `ADDR-${Math.floor(10 + Math.random() * 90)}`,
      label: addressForm.label,
      contactName: addressForm.contactName || profile.contactPerson,
      phone: addressForm.phone || profile.phone,
      address: addressForm.address,
      city: addressForm.city,
      pincode: addressForm.pincode,
      isDefault: false,
    };

    onAddAddress(newAddr);
    setIsAddAddressOpen(false);
    setAddressForm({
      label: '',
      contactName: '',
      phone: '',
      address: '',
      city: 'Ahmedabad',
      pincode: '382445',
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    setSecuritySuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSecuritySuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#1E293B] tracking-tight mb-1">
            Buyer Account & Logistics Settings
          </h2>
          <p className="text-xs text-[#5A6B82] font-medium">
            Manage your delivery depot addresses, WhatsApp notification alerts, and authorized procurement buyers.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('warehouses')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'warehouses'
              ? 'bg-[#6F42C1] text-white shadow-xs'
              : 'text-[#5A6B82] hover:text-[#1E293B] hover:bg-[#F4F7FC]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Warehouse Addresses ({addresses.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'notifications'
              ? 'bg-[#6F42C1] text-white shadow-xs'
              : 'text-[#5A6B82] hover:text-[#1E293B] hover:bg-[#F4F7FC]'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Alert Preferences</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('team')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'team'
              ? 'bg-[#6F42C1] text-white shadow-xs'
              : 'text-[#5A6B82] hover:text-[#1E293B] hover:bg-[#F4F7FC]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Buyer Team</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'security'
              ? 'bg-[#6F42C1] text-white shadow-xs'
              : 'text-[#5A6B82] hover:text-[#1E293B] hover:bg-[#F4F7FC]'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security & Access</span>
        </button>
      </div>

      {/* TAB 1: WAREHOUSE ADDRESSES */}
      {activeTab === 'warehouses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
                Authorized Delivery Depots & Siding Points
              </h3>
              <p className="text-xs text-[#5A6B82]">
                These addresses will be available during RFQ creation and instant order dispatch routing.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddAddressOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Warehouse</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`bg-white rounded-2xl border shadow-xs p-5 flex flex-col justify-between transition-all ${
                  addr.isDefault ? 'border-[#6F42C1] ring-1 ring-[#6F42C1]' : 'border-[#E2E8F0]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-[#5A6B82] bg-[#F4F7FC] px-2 py-0.5 rounded border border-[#E2E8F0]">
                      {addr.id}
                    </span>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6F42C1] text-white">
                        Primary Default
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-sm text-[#1E293B]">{addr.label}</h4>
                  <p className="text-xs text-[#5A6B82] mt-2 leading-relaxed">{addr.address}</p>
                  <p className="text-xs font-semibold text-[#1E293B] mt-1">
                    {addr.city}, Gujarat — {addr.pincode}
                  </p>

                  <div className="pt-3 mt-3 border-t border-[#E2E8F0] text-[11px] text-[#5A6B82]">
                    <p>In-Charge: <span className="font-bold text-[#1E293B]">{addr.contactName}</span></p>
                    <p>Phone: <span className="font-bold text-[#1E293B]">{addr.phone}</span></p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  {!addr.isDefault ? (
                    <button
                      type="button"
                      onClick={() => onSetDefaultAddress(addr.id)}
                      className="text-xs font-bold text-[#1E293B] hover:text-[#6F42C1] cursor-pointer"
                    >
                      Make Default
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-[#6F42C1] flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Default Depot
                    </span>
                  )}

                  {addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteAddress(addr.id)}
                      className="p-1.5 text-[#5A6B82] hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 max-w-2xl space-y-6">
          <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider border-b border-[#E2E8F0] pb-4">
            Instant Alerts & Notification Channels
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-[#6F42C1]" />
                <div>
                  <p className="font-bold text-[#1E293B]">WhatsApp Quote Alerts</p>
                  <p className="text-[11px] text-[#5A6B82]">Instant WhatsApp message whenever a plant bids on your RFQ</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifState.whatsappQuotes}
                onChange={(e) => setNotifState({ ...notifState, whatsappQuotes: e.target.checked })}
                className="w-4 h-4 text-[#6F42C1] focus:ring-[#6F42C1] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-[#6F42C1]" />
                <div>
                  <p className="font-bold text-[#1E293B]">WhatsApp Dispatch & LR Tracking</p>
                  <p className="text-[11px] text-[#5A6B82]">Receive truck number, LR copy, and driver contact directly on WhatsApp</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifState.whatsappDispatches}
                onChange={(e) => setNotifState({ ...notifState, whatsappDispatches: e.target.checked })}
                className="w-4 h-4 text-[#6F42C1] focus:ring-[#6F42C1] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#6F42C1]" />
                <div>
                  <p className="font-bold text-[#1E293B]">Email GST Tax Invoices & COA</p>
                  <p className="text-[11px] text-[#5A6B82]">Automated PDF delivery to accounts@shreejipolymers.in</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifState.emailInvoices}
                onChange={(e) => setNotifState({ ...notifState, emailInvoices: e.target.checked })}
                className="w-4 h-4 text-[#6F42C1] focus:ring-[#6F42C1] rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => alert('Notification preferences saved successfully.')}
              className="px-5 py-2.5 rounded-xl bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: BUYER TEAM */}
      {activeTab === 'team' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-4">
            <div>
              <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
                Authorized Procurement Team
              </h3>
              <p className="text-xs text-[#5A6B82]">
                Members with permissions to view quotes, place escrow orders, and confirm warehouse deliveries.
              </p>
            </div>
          </div>

          <div className="divide-y divide-[#E2E8F0] text-xs">
            <div className="py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#6F42C1] text-white flex items-center justify-center font-bold text-xs">
                  MS
                </div>
                <div>
                  <p className="font-extrabold text-[#1E293B]">Mahesh Solanki</p>
                  <p className="text-[11px] text-[#5A6B82]">Managing Partner • Primary Admin</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20">
                Full Access
              </span>
            </div>

            <div className="py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#6F42C1]/10 text-[#6F42C1] flex items-center justify-center font-bold text-xs">
                  RP
                </div>
                <div>
                  <p className="font-extrabold text-[#1E293B]">Ramesh Patel</p>
                  <p className="text-[11px] text-[#5A6B82]">Warehouse In-Charge • Delivery Verification Only</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20">
                Logistics Role
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 max-w-lg space-y-6">
          <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider border-b border-[#E2E8F0] pb-4">
            Account Security & Password
          </h3>

          {securitySuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Password successfully updated.</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-[#1E293B] mb-1 uppercase">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] focus:outline-none focus:border-[#6F42C1]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E293B] mb-1 uppercase">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] focus:outline-none focus:border-[#6F42C1]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E293B] mb-1 uppercase">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] focus:outline-none focus:border-[#6F42C1]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Update Password
            </button>
          </form>
        </div>
      )}

      {/* ADD WAREHOUSE MODAL */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#1E293B]">Add Delivery Warehouse Depot</h3>
                <p className="text-xs text-[#5A6B82] font-semibold">
                  Register a secondary factory or warehouse receiving location.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddAddressOpen(false)}
                className="p-2 rounded-xl text-[#5A6B82] hover:bg-[#F4F7FC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddressSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-[#1E293B] mb-1 uppercase">Depot / Warehouse Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sanand Rail Siding Warehouse"
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#6F42C1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E293B] mb-1 uppercase">Full Physical Address</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Plot/Shed number, Industrial Estate..."
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] focus:outline-none focus:border-[#6F42C1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E293B] mb-1 uppercase">City</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#6F42C1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1E293B] mb-1 uppercase">Pincode</label>
                  <input
                    type="text"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#6F42C1]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#F4F7FC] text-[#1E293B] text-xs font-bold hover:bg-[#E2E8F0] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Save Warehouse Depot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
