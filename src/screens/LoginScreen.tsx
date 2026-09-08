import React, { useState } from 'react';
import { Lock, Mail, CheckCircle2, ArrowRight, Loader2, Building2, Factory, Store } from 'lucide-react';
import { LogoIcon } from '../components/Logo';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (role: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('super_admin');
  const [email, setEmail] = useState('admin.gujarat@plastoship.com');
  const [password, setPassword] = useState('PlastoShip@GJ2026');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const roleConfigs = {
    super_admin: {
      badge: 'Super Admin',
      subtitle: 'Regional Marketplace Governance & Operations Portal',
      emailLabel: 'Admin Email',
      defaultEmail: 'admin@plastoship.com',
      defaultPass: 'PlastoShip@2026',
      btnText: 'Login to Super Admin',
      demoLabel: 'Use Super Admin Demo Credentials',
      successText: 'Authentication verified. Redirecting to Super Admin Dashboard...',
    },
    manufacturer: {
      badge: 'Manufacturer Portal',
      subtitle: 'Plant Operations, Direct RFQ Bidding & Escrow Dispatches',
      emailLabel: 'Plant / Representative Email',
      defaultEmail: 'jayesh@morbipolymers.in',
      defaultPass: 'Manufacturer@2026',
      btnText: 'Login to Manufacturer Portal',
      demoLabel: 'Use Morbi Polymers (MFR) Demo Credentials',
      successText: 'Authentication verified. Redirecting to Manufacturer Dashboard...',
    },
    distributor: {
      badge: 'Distributor Portal',
      subtitle: 'Polymer Procurement, Bulk RFQ & Escrow Orders',
      emailLabel: 'Buyer / Trading Entity Email',
      defaultEmail: 'mahesh@shreejipolymers.in',
      defaultPass: 'Distributor@2026',
      btnText: 'Login to Distributor Portal',
      demoLabel: 'Use Shreeji Polymers (Distributor) Demo Credentials',
      successText: 'Authentication verified. Redirecting to Distributor Dashboard...',
    },
  };

  const currentConfig = roleConfigs[selectedRole];

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    setEmail(roleConfigs[role].defaultEmail);
    setPassword(roleConfigs[role].defaultPass);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form validation
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please provide a valid email format (e.g. user@plastoship.com).');
      return;
    }

    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    // Simulate authentication delay with smooth success transition
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        onLoginSuccess(selectedRole);
      }, 700);
    }, 850);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        {/* Brand Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-6 sm:p-8 md:p-10 relative overflow-hidden">
          {/* Top Decorative Header Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0B1F3A]">
            <div
              className={`h-full w-24 transition-all duration-300 ${
                selectedRole === 'manufacturer'
                  ? 'bg-[#0284C7]'
                  : selectedRole === 'distributor'
                  ? 'bg-[#059669]'
                  : 'bg-[#FF7A18]'
              }`}
            />
          </div>

          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3">
              <LogoIcon size="lg" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
                PlastoShip
              </h1>
            </div>
          </div>

          {/* Role Selection Tabs */}
          <div className="mb-6 p-1 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => handleRoleChange('super_admin')}
              className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                selectedRole === 'super_admin'
                  ? 'bg-[#0B1F3A] text-white shadow-xs border-b-2 border-[#FF7A18]'
                  : 'text-[#5A6B82] hover:text-[#0B1F3A] hover:bg-white/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Super Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('manufacturer')}
              className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                selectedRole === 'manufacturer'
                  ? 'bg-[#0B1F3A] text-white shadow-xs border-b-2 border-sky-400'
                  : 'text-[#5A6B82] hover:text-[#0B1F3A] hover:bg-white/60'
              }`}
            >
              <Factory className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Manufacturer</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('distributor')}
              className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                selectedRole === 'distributor'
                  ? 'bg-[#0B1F3A] text-white shadow-xs border-b-2 border-emerald-400'
                  : 'text-[#5A6B82] hover:text-[#0B1F3A] hover:bg-white/60'
              }`}
            >
              <Store className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Distributor</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 animate-in fade-in duration-150 flex items-start gap-2">
                <span className="shrink-0 mt-0.5">•</span>
                <span>{error}</span>
              </div>
            )}

            {isSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2.5 animate-in zoom-in-95">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{currentConfig.successText}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#5A6B82] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={currentConfig.defaultEmail}
                  disabled={isLoading || isSuccess}
                  className="w-full h-11 pl-10 pr-4 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium placeholder-[#5A6B82] focus:outline-none focus:border-[#0B1F3A] focus:bg-white transition-all disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#5A6B82] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isLoading || isSuccess}
                  className="w-full h-11 pl-10 pr-4 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium placeholder-[#5A6B82] focus:outline-none focus:border-[#0B1F3A] focus:bg-white transition-all disabled:opacity-60"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className={`w-full h-12 mt-2 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed active:scale-[0.99] ${
                selectedRole === 'manufacturer'
                  ? 'bg-[#0284C7] hover:bg-[#0369A1] shadow-[#0284C7]/20'
                  : selectedRole === 'distributor'
                  ? 'bg-[#059669] hover:bg-[#047857] shadow-[#059669]/20'
                  : 'bg-[#FF7A18] hover:bg-[#E56A10] shadow-[#FF7A18]/20'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating Credentials...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Access Granted</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
