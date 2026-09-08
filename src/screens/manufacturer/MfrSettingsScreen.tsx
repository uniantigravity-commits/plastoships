import React, { useState } from 'react';
import {
  User,
  Camera,
  Smartphone,
  Mail,
  Shield,
  KeyRound,
  CheckCircle2,
  Check,
  X,
} from 'lucide-react';
import { ManufacturerProfileData } from '../../types';
import { Modal } from '../../components/Modal';

interface MfrSettingsScreenProps {
  profile?: ManufacturerProfileData;
  onUpdateProfile?: (updated: ManufacturerProfileData) => void;
}

export const MfrSettingsScreen: React.FC<MfrSettingsScreenProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile Form State
  const [contactName, setContactName] = useState(
    profile?.directorName || 'Ramesh Patel'
  );
  const [designation, setDesignation] = useState('Managing Director');
  const [mobileNumber, setMobileNumber] = useState(
    profile?.phone || '+919876543210'
  );
  const [emailAddress, setEmailAddress] = useState(
    profile?.email || 'ramesh@metroplastics.in'
  );

  // Change Password Modal State
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile && profile) {
      onUpdateProfile({
        ...profile,
        directorName: contactName,
        phone: mobileNumber,
        email: emailAddress,
      });
    }
    showToast('Profile settings updated successfully!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match. Please try again.');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters long.');
      return;
    }
    setIsChangePasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password changed successfully!');
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
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Screen Title & Subtitle */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Settings
        </h2>
        <p className="text-xs sm:text-sm text-[#5A6B82] mt-1 font-normal">
          Manage your account preferences and security
        </p>
      </div>

      {/* 2-Column Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 Cols): Profile Settings & Security */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Profile Settings Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-4 h-4 text-[#4B49AC]" />
              <h3 className="text-base font-bold text-slate-900">
                Profile Settings
              </h3>
            </div>

            {/* Profile Image Section */}
            <div className="flex items-center gap-4 mb-7">
              <div className="relative">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#F1F5F9] border-2 border-[#E2E8F0] flex items-center justify-center text-slate-400">
                  <User className="w-8 h-8 sm:w-9 sm:h-9" />
                </div>
                <label className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#4B49AC] hover:bg-[#3F3D99] text-white flex items-center justify-center shadow-xs cursor-pointer transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={() => showToast('Profile image updated successfully!')}
                  />
                </label>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Upload Profile Image
                </h4>
                <p className="text-xs text-[#5A6B82] mt-0.5">
                  Recommended size: 400x400px (JPG, PNG)
                </p>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Contact Person Name */}
                <div>
                  <label className="block text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider mb-1.5">
                    CONTACT PERSON NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-slate-900 font-medium focus:outline-none focus:border-[#4B49AC] transition-colors"
                  />
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider mb-1.5">
                    DESIGNATION
                  </label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-slate-900 font-medium focus:outline-none focus:border-[#4B49AC] transition-colors"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider mb-1.5">
                    MOBILE NUMBER
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-slate-900 font-medium focus:outline-none focus:border-[#4B49AC] transition-colors"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider mb-1.5">
                    EMAIL ADDRESS
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-slate-900 font-medium focus:outline-none focus:border-[#4B49AC] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4B49AC] hover:bg-[#3F3D99] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Update Profile</span>
                </button>
              </div>
            </form>
          </div>

          {/* 2. Security Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-4 h-4 text-[#4B49AC]" />
              <h3 className="text-base font-bold text-slate-900">
                Security
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Change Password
                </h4>
                <p className="text-xs text-[#5A6B82] mt-0.5">
                  Update your login information and password securely.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsChangePasswordModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#4B49AC] bg-white hover:bg-[#EEEDFD] text-[#4B49AC] text-xs font-semibold transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Change Password</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 Cols): Account Status */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Card: Account Status */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  ACCOUNT STATUS
                </span>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-lg font-bold text-white">Active</span>
                </div>
              </div>

              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                <Check className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/60">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                MANUFACTURER ID
              </span>
              <span className="text-base font-extrabold font-mono text-white mt-1 block tracking-wider">
                PLS-MFG-8802
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <Modal
          isOpen={isChangePasswordModalOpen}
          onClose={() => setIsChangePasswordModalOpen(false)}
          title="Change Password"
        >
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-slate-900 focus:outline-none focus:border-[#4B49AC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-slate-900 focus:outline-none focus:border-[#4B49AC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-slate-900 focus:outline-none focus:border-[#4B49AC]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setIsChangePasswordModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#4B49AC] hover:bg-[#3F3D99] text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Save New Password
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
