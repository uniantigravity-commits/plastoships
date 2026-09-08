import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  Plus,
  CheckCircle2,
  FileText,
  Building,
} from 'lucide-react';
import { ManufacturerProfileData } from '../../types';

interface MfrProfileScreenProps {
  profile: ManufacturerProfileData;
  onUpdateProfile: (updated: ManufacturerProfileData) => void;
  onNavigate: (screen: string) => void;
}

export const MfrProfileScreen: React.FC<MfrProfileScreenProps> = ({
  profile,
  onUpdateProfile,
  onNavigate,
}) => {
  // Initialize form state with profile or default matching design
  const [formData, setFormData] = useState({
    companyName: profile.companyName || 'Apex Plastics Ltd.',
    contactPerson: profile.contactPerson || 'Rajesh Kumar',
    designation: profile.designation || 'Managing Director',
    mobileNumber: profile.phone || '+919876543210',
    emailAddress: profile.email || 'rajesh@apexplastics.in',
    altPhone: profile.altPhone || '',
    line1: profile.line1 || '14, Industrial Estate Phase 2',
    line2: profile.line2 || 'GIDC Area',
    city: profile.city || 'Rajkot',
    district: profile.district || 'Rajkot',
    state: profile.state || 'Gujarat',
    pincode: profile.pincode || '360002',
    country: profile.country || 'India',
    factoryAddress: profile.factoryAddress || 'Same as Registered Address',
    website: profile.website || 'www.apexplastics.in',
    categories: profile.productCategories && profile.productCategories.length > 0 
      ? profile.productCategories 
      : ['Storage Containers', 'Kitchen Tools'],
    yearsInBusiness: profile.yearsInBusiness || 12,
    capacityUnits: profile.manufacturingCapacityUnits || 50000,
    logoFileName: profile.logoFileName || '',
    brochureFileName: profile.brochureFileName || '',
  });

  const [categoryInput, setCategoryInput] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const brochureInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaveSuccess(false);
  };

  const handleAddCategory = (cat: string) => {
    const trimmed = cat.trim();
    if (trimmed && !formData.categories.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, trimmed],
      }));
    }
    setCategoryInput('');
    setIsAddingCategory(false);
  };

  const handleRemoveCategory = (catToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== catToRemove),
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logoFileName: file.name }));
    }
  };

  const handleBrochureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, brochureFileName: file.name }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ManufacturerProfileData = {
      ...profile,
      companyName: formData.companyName,
      contactPerson: formData.contactPerson,
      designation: formData.designation,
      phone: formData.mobileNumber,
      email: formData.emailAddress,
      altPhone: formData.altPhone,
      line1: formData.line1,
      line2: formData.line2,
      city: formData.city,
      district: formData.district,
      state: formData.state,
      pincode: formData.pincode,
      country: formData.country,
      factoryAddress: formData.factoryAddress,
      website: formData.website,
      productCategories: formData.categories,
      yearsInBusiness: Number(formData.yearsInBusiness) || 0,
      manufacturingCapacityUnits: Number(formData.capacityUnits) || 0,
      logoFileName: formData.logoFileName,
      brochureFileName: formData.brochureFileName,
    };
    onUpdateProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleCancel = () => {
    // Reset to current profile
    setFormData({
      companyName: profile.companyName || 'Apex Plastics Ltd.',
      contactPerson: profile.contactPerson || 'Rajesh Kumar',
      designation: profile.designation || 'Managing Director',
      mobileNumber: profile.phone || '+919876543210',
      emailAddress: profile.email || 'rajesh@apexplastics.in',
      altPhone: profile.altPhone || '',
      line1: profile.line1 || '14, Industrial Estate Phase 2',
      line2: profile.line2 || 'GIDC Area',
      city: profile.city || 'Rajkot',
      district: profile.district || 'Rajkot',
      state: profile.state || 'Gujarat',
      pincode: profile.pincode || '360002',
      country: profile.country || 'India',
      factoryAddress: profile.factoryAddress || 'Same as Registered Address',
      website: profile.website || 'www.apexplastics.in',
      categories: profile.productCategories && profile.productCategories.length > 0 
        ? profile.productCategories 
        : ['Storage Containers', 'Kitchen Tools'],
      yearsInBusiness: profile.yearsInBusiness || 12,
      capacityUnits: profile.manufacturingCapacityUnits || 50000,
      logoFileName: profile.logoFileName || '',
      brochureFileName: profile.brochureFileName || '',
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Company Profile
        </h2>
        <p className="text-xs sm:text-sm text-[#5A6B82] mt-1 font-normal">
          Manage your manufacturer business information
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Company profile details have been saved successfully.</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccess(false)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Profile Completion Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Profile Completion
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6B82] mt-0.5">
              Complete all mandatory fields to activate your profile.
            </p>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-sm sm:text-base font-bold text-slate-900">
              75%
            </span>
            <div className="w-36 sm:w-48 h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
              <div
                className="h-full bg-[#4B49AC] rounded-full transition-all duration-500"
                style={{ width: '75%' }}
              />
            </div>
          </div>
        </div>

        {/* 2. Basic Company Details Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900">
            Basic Company Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                placeholder="Enter company name"
              />
            </div>

            {/* Contact Person Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Contact Person Name
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                placeholder="Enter contact person name"
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Designation
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                placeholder="Enter designation"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mobile Number
              </label>
              <input
                type="text"
                value={formData.mobileNumber}
                onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                placeholder="+91..."
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.emailAddress}
                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                placeholder="name@company.com"
              />
            </div>

            {/* Alternate Contact Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alternate Contact Number
              </label>
              <input
                type="text"
                value={formData.altPhone}
                onChange={(e) => handleInputChange('altPhone', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Subheading: Registered Address */}
          <div className="pt-4 border-t border-[#E2E8F0]">
            <h4 className="text-sm font-bold text-slate-900 mb-4">
              Registered Address
            </h4>

            <div className="space-y-4">
              {/* Line 1 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Line 1
                </label>
                <input
                  type="text"
                  value={formData.line1}
                  onChange={(e) => handleInputChange('line1', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                  placeholder="Street address, building, floor"
                />
              </div>

              {/* Line 2 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Line 2
                </label>
                <input
                  type="text"
                  value={formData.line2}
                  onChange={(e) => handleInputChange('line2', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                  placeholder="Industrial area, landmark, locality"
                />
              </div>

              {/* City & District */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    District
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                  />
                </div>
              </div>

              {/* State & Pincode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                  />
                </div>
              </div>

              {/* Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subheading: Other Details */}
          <div className="pt-4 border-t border-[#E2E8F0]">
            <h4 className="text-sm font-bold text-slate-900 mb-4">
              Other Details
            </h4>

            <div className="space-y-4">
              {/* Factory / Warehouse Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Factory / Warehouse Address
                </label>
                <input
                  type="text"
                  value={formData.factoryAddress}
                  onChange={(e) => handleInputChange('factoryAddress', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                />
              </div>

              {/* Website / Social Media Links */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Website / Social Media Links
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Business Details Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900">
            Business Details
          </h3>

          {/* Product Categories Dealt In */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Product Categories Dealt In
            </label>
            <div className="w-full min-h-[44px] p-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap items-center gap-2">
              {formData.categories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-[#E2E8F0] text-xs font-medium text-slate-800 shadow-2xs"
                >
                  {category}
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(category)}
                    className="text-[#94A3B8] hover:text-rose-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}

              {isAddingCategory ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCategory(categoryInput);
                      } else if (e.key === 'Escape') {
                        setIsAddingCategory(false);
                      }
                    }}
                    autoFocus
                    placeholder="Type & press Enter"
                    className="text-xs bg-white px-2 py-1 rounded border border-[#4B49AC] text-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCategory(categoryInput)}
                    className="px-2 py-1 bg-[#4B49AC] hover:bg-[#3F3D99] text-white rounded text-xs font-medium"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(true)}
                  className="text-xs text-[#94A3B8] hover:text-[#4B49AC] px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Select categories...</span>
                </button>
              )}
            </div>
          </div>

          {/* Years in Business & Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Years in Business
              </label>
              <input
                type="number"
                value={formData.yearsInBusiness}
                onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Manufacturing Capacity (Units/month)
              </label>
              <input
                type="number"
                value={formData.capacityUnits}
                onChange={(e) => handleInputChange('capacityUnits', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#4B49AC] transition-colors"
              />
            </div>
          </div>

          {/* Upload Row: Company Logo & Company Profile / Brochure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Logo Upload Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Company Logo
              </label>
              <input
                type="file"
                ref={logoInputRef}
                onChange={handleLogoUpload}
                accept="image/png, image/jpeg"
                className="hidden"
              />
              <div
                onClick={() => logoInputRef.current?.click()}
                className="border border-dashed border-[#CBD5E1] bg-[#F8FAFC] rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[120px]"
              >
                <Upload className="w-5 h-5 text-slate-500 mb-1" />
                <span className="text-xs font-bold text-slate-900">
                  {formData.logoFileName ? formData.logoFileName : 'Upload Logo'}
                </span>
                <span className="text-[11px] text-[#5A6B82] mt-0.5">
                  PNG, JPG up to 5MB
                </span>
              </div>
            </div>

            {/* Brochure Upload Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Company Profile / Brochure
              </label>
              <input
                type="file"
                ref={brochureInputRef}
                onChange={handleBrochureUpload}
                accept="application/pdf"
                className="hidden"
              />
              <div
                onClick={() => brochureInputRef.current?.click()}
                className="border border-dashed border-[#CBD5E1] bg-[#F8FAFC] rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[120px]"
              >
                <Upload className="w-5 h-5 text-slate-500 mb-1" />
                <span className="text-xs font-bold text-slate-900">
                  {formData.brochureFileName ? formData.brochureFileName : 'Upload Brochure'}
                </span>
                <span className="text-[11px] text-[#5A6B82] mt-0.5">
                  PDF up to 10MB
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bottom Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#4B49AC] hover:bg-[#3F3D99] text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
