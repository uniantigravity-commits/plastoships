import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Smartphone,
  Laptop,
  Tablet,
  Globe,
  Clock,
  AlertTriangle,
  RotateCcw,
  Save,
  Check,
  LogOut,
  HelpCircle,
  Key,
} from 'lucide-react';

interface DistributorChangePasswordScreenProps {
  onShowToast?: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
}

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
  type: 'desktop' | 'mobile' | 'tablet';
}

export const DistributorChangePasswordScreen: React.FC<DistributorChangePasswordScreenProps> = ({
  onShowToast,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Two-Factor Auth State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [twoFactorMethod, setTwoFactorMethod] = useState<'sms' | 'whatsapp' | 'authenticator'>('sms');

  // Active Sessions
  const [sessions, setSessions] = useState<ActiveSession[]>([
    {
      id: 'sess-1',
      device: 'MacBook Pro / Chrome 128.0',
      browser: 'Google Chrome 128',
      location: 'Ahmedabad, Gujarat, India',
      ip: '103.24.120.45',
      lastActive: 'Active Now',
      isCurrent: true,
      type: 'desktop',
    },
    {
      id: 'sess-2',
      device: 'Samsung Galaxy S24 / PlastoShip App v2.4',
      browser: 'PlastoShip Android App',
      location: 'Surat Logistics Depot, Gujarat',
      ip: '157.34.89.12',
      lastActive: '3 hours ago',
      isCurrent: false,
      type: 'mobile',
    },
    {
      id: 'sess-3',
      device: 'Apple iPad Air / Safari',
      browser: 'Mobile Safari 17.5',
      location: 'Sanand Fulfillment Center, Gujarat',
      ip: '103.24.120.90',
      lastActive: '2 days ago',
      isCurrent: false,
      type: 'tablet',
    },
  ]);

  // Password validation checks
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  const passedChecksCount = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
  ].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (!newPassword) return { label: 'Empty', color: 'bg-slate-200 text-slate-500', width: '0%' };
    if (passedChecksCount <= 2) return { label: 'Weak', color: 'bg-rose-500 text-rose-700', width: '25%' };
    if (passedChecksCount === 3) return { label: 'Medium', color: 'bg-amber-500 text-amber-700', width: '55%' };
    if (passedChecksCount === 4) return { label: 'Strong', color: 'bg-blue-600 text-blue-700', width: '80%' };
    return { label: 'Very Strong', color: 'bg-emerald-600 text-emerald-700', width: '100%' };
  };

  const strength = getStrengthLabel();
  const passwordsMatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentPassword) {
      setErrorMessage('Please enter your current account password.');
      return;
    }

    if (passedChecksCount < 4) {
      setErrorMessage('New password does not meet minimum security requirements.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage('New password cannot be the same as your current password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('Your password has been successfully updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      if (onShowToast) {
        onShowToast('Password Updated', 'Your account credentials have been successfully updated.', 'success');
      }

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }, 800);
  };

  const handleRevokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (onShowToast) {
      onShowToast('Session Revoked', 'The selected device has been logged out.', 'info');
    }
  };

  const handleRevokeAllOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    if (onShowToast) {
      onShowToast('All Other Sessions Terminated', 'All other active sessions have been logged out.', 'success');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl md:text-2xl font-extrabold text-[#0B1F3A] tracking-tight">
              Change Password & Security
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secured Wholesaler Account
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#5A6B82] font-medium">
            Manage your login credentials, multi-factor authentication, and connected procurement sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] px-3.5 py-2 rounded-xl text-right">
            <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
              Last Password Change
            </span>
            <span className="text-xs font-bold text-[#0B1F3A]">42 Days Ago (Verified)</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Password Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0B1F3A]">Update Account Password</h3>
                  <p className="text-xs text-[#5A6B82]">Enter your current password followed by a secure new password</p>
                </div>
              </div>
            </div>

            {successMessage && (
              <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3 animate-in fade-in duration-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-sm text-emerald-900">Password Updated Successfully!</p>
                  <p className="text-xs text-emerald-700 mt-0.5">{successMessage}</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-3 animate-in fade-in duration-300">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-sm text-rose-900">Action Required</p>
                  <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Current Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider">
                    Current Password <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (onShowToast) {
                        onShowToast('Password Reset Link Sent', 'A verification OTP has been sent to your registered mobile and email.', 'info');
                      }
                    }}
                    className="text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full h-11 pl-4 pr-11 rounded-xl border border-[#E2E8F0] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-medium text-[#0B1F3A] bg-white transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#5A6B82] hover:text-[#0B1F3A] transition-colors cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create a strong new password"
                    className="w-full h-11 pl-4 pr-11 rounded-xl border border-[#E2E8F0] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-medium text-[#0B1F3A] bg-white transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#5A6B82] hover:text-[#0B1F3A] transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {newPassword.length > 0 && (
                  <div className="mt-2.5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5A6B82] font-semibold">Password Strength:</span>
                      <span className="font-extrabold text-[#0B1F3A]">{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strength.label === 'Weak'
                            ? 'bg-rose-500'
                            : strength.label === 'Medium'
                            ? 'bg-amber-500'
                            : strength.label === 'Strong'
                            ? 'bg-blue-600'
                            : 'bg-emerald-600'
                        }`}
                        style={{ width: strength.width }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
                  Confirm New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full h-11 pl-4 pr-11 rounded-xl border border-[#E2E8F0] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-medium text-[#0B1F3A] bg-white transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#5A6B82] hover:text-[#0B1F3A] transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {confirmPassword.length > 0 && (
                  <p className="mt-1.5 text-xs font-semibold flex items-center gap-1">
                    {passwordsMatch ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-rose-600 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Passwords do not match
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Password Requirements Checklist */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
                <p className="font-bold text-[#0B1F3A] uppercase text-[10px] tracking-wider mb-2">
                  Security Checklist
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    {hasMinLength ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span className={hasMinLength ? 'text-emerald-800 font-semibold' : 'text-[#5A6B82]'}>
                      Minimum 8 characters
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasUppercase ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span className={hasUppercase ? 'text-emerald-800 font-semibold' : 'text-[#5A6B82]'}>
                      1+ Uppercase letter (A-Z)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasLowercase ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span className={hasLowercase ? 'text-emerald-800 font-semibold' : 'text-[#5A6B82]'}>
                      1+ Lowercase letter (a-z)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasNumber ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span className={hasNumber ? 'text-emerald-800 font-semibold' : 'text-[#5A6B82]'}>
                      1+ Number (0-9)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 sm:col-span-2">
                    {hasSpecialChar ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span className={hasSpecialChar ? 'text-emerald-800 font-semibold' : 'text-[#5A6B82]'}>
                      1+ Special character (!@#$%^&*)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setErrorMessage(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-[#5A6B82] hover:text-[#0B1F3A] hover:bg-[#F4F7FC] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#142d4f] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving Password...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Two-Factor Authentication Settings */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#0B1F3A]">Two-Factor Authentication (2FA)</h3>
                  <p className="text-xs text-[#5A6B82]">Protect your procurement wallet and purchase orders with OTP verification</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={() => {
                    const next = !twoFactorEnabled;
                    setTwoFactorEnabled(next);
                    if (onShowToast) {
                      onShowToast(
                        next ? '2FA Enabled' : '2FA Disabled',
                        next ? 'OTP verification is now required for order approvals.' : 'Two-factor protection disabled.',
                        next ? 'success' : 'info'
                      );
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {twoFactorEnabled ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold">2FA Active on Verified Phone (+91 98250 11422)</span>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-200 text-emerald-800">
                    Primary
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setTwoFactorMethod('sms')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      twoFactorMethod === 'sms'
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <span className="font-bold text-[#0B1F3A] block">SMS OTP</span>
                    <span className="text-[11px] text-[#5A6B82]">Instant SMS to registered phone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTwoFactorMethod('whatsapp')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      twoFactorMethod === 'whatsapp'
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <span className="font-bold text-[#0B1F3A] block">WhatsApp Business</span>
                    <span className="text-[11px] text-[#5A6B82]">Receive OTP on WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTwoFactorMethod('authenticator')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      twoFactorMethod === 'authenticator'
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <span className="font-bold text-[#0B1F3A] block">Authenticator App</span>
                    <span className="text-[11px] text-[#5A6B82]">Google or Microsoft TOTP</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-rose-600 font-medium">
                ⚠️ Two-factor authentication is currently disabled. We strongly recommend enabling it for high-value resin transactions.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Active Sessions & Audit (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Sessions Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-sm font-extrabold text-[#0B1F3A]">Connected Devices & Sessions</h3>
                <p className="text-[11px] text-[#5A6B82]">Devices currently logged in with your credentials</p>
              </div>
              <button
                type="button"
                onClick={handleRevokeAllOtherSessions}
                className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Log Out Others
              </button>
            </div>

            <div className="space-y-3">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    sess.isCurrent
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : 'border-[#E2E8F0] bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-lg bg-white border border-[#E2E8F0] text-[#0B1F3A] shrink-0 mt-0.5">
                        {sess.type === 'desktop' && <Laptop className="w-4 h-4" />}
                        {sess.type === 'mobile' && <Smartphone className="w-4 h-4" />}
                        {sess.type === 'tablet' && <Tablet className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-[#0B1F3A]">{sess.device}</span>
                          {sess.isCurrent && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.2 rounded bg-emerald-600 text-white">
                              This Device
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#5A6B82] mt-0.5">{sess.location}</p>
                        <p className="text-[10px] font-mono text-[#5A6B82] mt-0.5">
                          IP: {sess.ip} • <Clock className="w-3 h-3 inline mr-0.5" /> {sess.lastActive}
                        </p>
                      </div>
                    </div>

                    {!sess.isCurrent && (
                      <button
                        type="button"
                        onClick={() => handleRevokeSession(sess.id)}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Best Practices */}
          <div className="bg-[#0B1F3A] text-white rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-extrabold">PlastoShip Security Tips</h3>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>Never share your Wholesaler ERP login password with third-party logistics agents.</li>
              <li>PlastoShip representatives will never ask for your password or OTP over the phone.</li>
              <li>Always check for the green verification padlock in your browser address bar.</li>
              <li>Set up unique passwords for tender negotiations and fund release authorizations.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
