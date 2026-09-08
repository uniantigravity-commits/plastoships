import React, { useState } from 'react';
import { Save } from 'lucide-react';

interface SettingsScreenProps {
  onShowToast: (title: string, desc?: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onShowToast }) => {
  const [adminName, setAdminName] = useState('Admin');
  const [adminEmail, setAdminEmail] = useState('admin@plastoship.com');
  const [adminPhone, setAdminPhone] = useState('+91 79 4900 1200');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Profile Settings Updated', 'Admin credentials and contact details successfully saved.');
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#0B1F3A] tracking-tight">
          Admin Settings
        </h2>
      </div>

      {/* Admin Profile Details */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-[#E2E8F0]">
          <div className="w-9 h-9 rounded-xl bg-[#0B1F3A] text-white flex items-center justify-center font-bold text-sm">
            A
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#0B1F3A]">Admin Profile</h3>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase">
                Admin Display Name
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full h-10 px-3.5 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#0B1F3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase">
                Official Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full h-10 px-3.5 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#0B1F3A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase">
              Direct Contact Phone
            </label>
            <input
              type="text"
              value={adminPhone}
              onChange={(e) => setAdminPhone(e.target.value)}
              className="w-full h-10 px-3.5 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#0B1F3A]"
            />
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0B1F3A] hover:bg-[#122B4E] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
