import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Edit3,
  CheckCircle2,
  Calendar,
  CreditCard,
  Layers,
  Award,
  Download,
  ExternalLink,
  Plus,
  Save,
  X,
  User,
  Store,
  Briefcase,
  Hash,
  Truck,
  Check,
  Upload,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { DistributorProfileData } from '../../types';
import { INITIAL_DISTRIBUTOR_PROFILE } from '../../mockData';

interface DistributorProfileScreenProps {
  profile?: DistributorProfileData;
  onUpdateProfile?: (updated: Partial<DistributorProfileData>) => void;
  onNavigate?: (screen: string) => void;
}

export const DistributorProfileScreen: React.FC<DistributorProfileScreenProps> = ({
  profile = INITIAL_DISTRIBUTOR_PROFILE,
  onUpdateProfile,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'legal' | 'contacts' | 'depots' | 'banking'>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  const [formData, setFormData] = useState({
    companyName: profile.companyName || 'Apex Polymers & Distributors LLP',
    businessType: profile.businessType || 'Wholesaler & Stockist',
    gstin: profile.gstin || '24AAKCA5423E1Z4',
    pan: profile.pan || profile.panNumber || 'AAKCA5423E',
    primaryContactPerson: profile.primaryContactPerson || profile.contactPerson || 'Rajesh Singhania',
    designation: 'Managing Partner & Procurement Head',
    phone: profile.phone || '+91 98250 11422',
    alternatePhone: '+91 79 2583 4400',
    email: profile.email || 'procure@apexpolymers.in',
    officeAddress: profile.officeAddress || 'Plot 42, GIDC Vatva Phase IV',
    city: profile.city || 'Ahmedabad',
    state: profile.state || 'Gujarat',
    pincode: profile.pincode || '382445',
    annualTurnover: profile.annualTurnover || profile.annualSourcingVolume || '₹4.85 Crore',
    establishedYear: profile.establishedYear || 2018,
    website: 'https://apexpolymers.gujarat.in',
    msmeRegNo: 'UDYAM-GJ-01-0042918',
    targetSourcingVolume: '150 MT / Month',
    preferredPaymentTerm: 'Escrow / Razorpay B2B Net-15',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile(formData);
    }
    setIsEditModalOpen(false);
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl md:text-2xl font-extrabold text-[#1E293B] tracking-tight">
              Profile
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-[#6F42C1]/10 text-[#6F42C1] rounded-full border border-[#6F42C1]/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6F42C1]" />
              Verified Wholesaler & Stockist
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#5A6B82] font-medium">
            Manage your registered corporate identity, statutory identifiers, regional warehouse depots, and procurement contacts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const printContent = `Wholesaler Business Card: ${formData.companyName}\nGSTIN: ${formData.gstin}\nContact: ${formData.primaryContactPerson} (${formData.phone})\nCity: ${formData.city}, Gujarat`;
              const blob = new Blob([printContent], { type: 'text/plain;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${formData.companyName.replace(/\s+/g, '_')}_Profile_Card.txt`;
              link.click();
            }}
            className="px-3.5 py-2 rounded-xl border border-[#E2E8F0] hover:bg-[#6F42C1]/10 hover:border-[#6F42C1]/20 hover:text-[#6F42C1] text-[#1E293B] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-[#5A6B82]" />
            <span>Export Card</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#6F42C1] hover:bg-[#5C35A5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {showSavedNotification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Company profile details updated and synchronized with Gujarat B2B registry.</span>
        </div>
      )}

      {/* Hero Overview Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E2E8F0]">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#6F42C1] text-white flex items-center justify-center font-black text-2xl shrink-0 shadow-sm border border-[#5C35A5]">
              {formData.companyName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-xl font-extrabold text-[#1E293B]">{formData.companyName}</h3>
                <span className="font-mono text-xs font-bold text-[#5A6B82] bg-[#F4F7FC] px-2.5 py-0.5 rounded-md border border-[#E2E8F0]">
                  {profile.id || 'DST-GJ-9021'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20">
                  {profile.subscriptionTier || 'PLATINUM PRO'}
                </span>
              </div>
              <p className="text-xs text-[#5A6B82] font-medium flex flex-wrap items-center gap-2">
                <span>{formData.businessType}</span>
                <span>•</span>
                <span>Established {formData.establishedYear}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#6F42C1] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6F42C1]" />
                  GPCB & GST Compliant
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl min-w-[130px]">
              <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                Escrow Credit Line
              </span>
              <span className="text-sm font-extrabold text-[#1E293B]">{profile.creditLimit || '₹45,00,000'}</span>
            </div>
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl min-w-[130px]">
              <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                Annual Sourcing
              </span>
              <span className="text-sm font-extrabold text-[#6F42C1]">{formData.annualTurnover}</span>
            </div>
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl min-w-[130px]">
              <span className="text-[10px] font-bold text-[#5A6B82] uppercase tracking-wider block">
                Procured Orders
              </span>
              <span className="text-sm font-extrabold text-[#1E293B]">{profile.totalOrdersPlaced || 28} Consignments</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-4 border-b border-[#E2E8F0] overflow-x-auto">
          {[
            { id: 'overview', label: 'Company Overview', icon: Store },
            { id: 'legal', label: 'Legal & Tax Identification', icon: FileText },
            { id: 'contacts', label: 'Authorized Personnel', icon: User },
            { id: 'depots', label: 'Warehouse & Delivery Depots', icon: MapPin },
            { id: 'banking', label: 'Bank & Settlement Mandate', icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#6F42C1] text-[#6F42C1] bg-[#6F42C1]/10 rounded-t-lg'
                    : 'border-transparent text-[#5A6B82] hover:text-[#1E293B]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#6F42C1]" />
                <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
                  Tax & Commercial ID
                </h4>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[#5A6B82]">GSTIN:</span>
                  <span className="font-mono font-bold text-[#1E293B]">{formData.gstin}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[#5A6B82]">PAN Number:</span>
                  <span className="font-mono font-bold text-[#1E293B]">{formData.pan}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[#5A6B82]">MSME Reg:</span>
                  <span className="font-mono font-bold text-[#1E293B]">{formData.msmeRegNo}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#6F42C1]" />
                <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
                  Key Contact Person
                </h4>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[#5A6B82]">Name:</span>
                  <span className="font-bold text-[#1E293B]">{formData.primaryContactPerson}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[#5A6B82]">Mobile:</span>
                  <span className="font-bold text-[#1E293B]">{formData.phone}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[#5A6B82]">Email:</span>
                  <span className="font-bold text-[#1E293B]">{formData.email}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#6F42C1]" />
                <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
                  Registered Headquarters
                </h4>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1">
                <p className="font-bold text-[#1E293B]">{formData.officeAddress}</p>
                <p className="text-[#5A6B82]">{formData.city}, {formData.state} - {formData.pincode}</p>
                <p className="text-[#5A6B82] font-mono text-[11px] pt-1">Zone: Vatva Industrial Cluster</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Legal & Tax */}
        {activeTab === 'legal' && (
          <div className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1E293B]">GSTIN Certificate (Gujarat State)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20">
                    Active & Verified
                  </span>
                </div>
                <p className="font-mono text-sm font-bold text-[#1E293B]">{formData.gstin}</p>
                <p className="text-[#5A6B82] text-[11px]">Valid across all Gujarat GIDC zones (Vatva, Sanand, Dahej, Morbi)</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1E293B]">Permanent Account Number (PAN)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20">
                    NSDL Verified
                  </span>
                </div>
                <p className="font-mono text-sm font-bold text-[#1E293B]">{formData.pan}</p>
                <p className="text-[#5A6B82] text-[11px]">Registered entity: {formData.companyName}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1E293B]">MSME / Udyam Certificate</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20">
                    Category: Medium Enterprise
                  </span>
                </div>
                <p className="font-mono text-sm font-bold text-[#1E293B]">{formData.msmeRegNo}</p>
                <p className="text-[#5A6B82] text-[11px]">Priority B2B vendor status across Gujarat ports and inland depots</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1E293B]">GPCB Plastic Waste Authorization</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20">
                    EPR Certified
                  </span>
                </div>
                <p className="font-mono text-sm font-bold text-[#1E293B]">GPCB/PWM/DIS/2026/8910</p>
                <p className="text-[#5A6B82] text-[11px]">Authorized for bulk polymer handling and storage</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Authorized Contacts */}
        {activeTab === 'contacts' && (
          <div className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1E293B]">Primary Procurement Officer</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20">
                    Chief Buyer
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1E293B]">{formData.primaryContactPerson}</h4>
                  <p className="text-[#5A6B82] text-[11px]">{formData.designation}</p>
                </div>
                <div className="pt-2 border-t border-[#E2E8F0] space-y-1">
                  <p className="text-[#5A6B82]"><Phone className="w-3 h-3 inline mr-1" /> {formData.phone}</p>
                  <p className="text-[#5A6B82]"><Mail className="w-3 h-3 inline mr-1" /> {formData.email}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1E293B]">Logistics & Dispatch Liaison</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20">
                    Fleet Ops
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1E293B]">Vikram Patel</h4>
                  <p className="text-[#5A6B82] text-[11px]">Warehouse & Transporter Incharge</p>
                </div>
                <div className="pt-2 border-t border-[#E2E8F0] space-y-1">
                  <p className="text-[#5A6B82]"><Phone className="w-3 h-3 inline mr-1" /> +91 97241 88320</p>
                  <p className="text-[#5A6B82]"><Mail className="w-3 h-3 inline mr-1" /> logistics@apexpolymers.in</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Depots */}
        {activeTab === 'depots' && (
          <div className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1E293B]">Central Vatva Depot (Hub 01)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20">
                    Primary Receiving Depot
                  </span>
                </div>
                <p className="text-[#5A6B82]">Plot 42, Phase IV, GIDC Industrial Estate, Vatva, Ahmedabad - 382445</p>
                <p className="font-semibold text-[#1E293B]">Storage Capacity: 400 Metric Tonnes (Covered Warehouse)</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1E293B]">Sanand Logistics Dock (Hub 02)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20">
                    Rail/Road Transshipment
                  </span>
                </div>
                <p className="text-[#5A6B82]">Shed 18-B, Auto Ancillary Zone, GIDC Sanand II, Ahmedabad - 382110</p>
                <p className="font-semibold text-[#1E293B]">Storage Capacity: 250 Metric Tonnes (High-Bay Racking)</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Banking */}
        {activeTab === 'banking' && (
          <div className="pt-6 space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#6F42C1]" />
                  <h4 className="text-sm font-extrabold text-[#1E293B]">Linked Escrow Settlement Bank Account</h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#6F42C1]/10 text-[#6F42C1] border border-[#6F42C1]/20">
                  e-NACH Mandate Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[#5A6B82] block mb-1">Bank Name</span>
                  <span className="font-bold text-[#1E293B]">HDFC Bank Limited</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[#5A6B82] block mb-1">Account Number</span>
                  <span className="font-mono font-bold text-[#1E293B]">50200088912401</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[#5A6B82] block mb-1">IFSC Code</span>
                  <span className="font-mono font-bold text-[#1E293B]">HDFC0000006</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Polymer Sourcing Preferences Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#6F42C1]" />
              <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
                Target Sourcing Categories
              </h3>
            </div>
            <span className="text-xs font-bold text-[#5A6B82]">High Volume Consumer</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              'Storage Containers',
              'Lunch Boxes',
              'Kitchenware',
              'Cleaning Products',
              'Industrial Crates',
              'HDPE/PP Raw Resins',
            ].map((cat, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F4F7FC] text-[#1E293B] border border-[#E2E8F0]"
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
            <span className="text-[#5A6B82]">Monthly Target Sourcing:</span>
            <span className="font-extrabold text-[#1E293B]">{formData.targetSourcingVolume}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6F42C1]" />
              <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
                Wholesaler Compliance Score
              </h3>
            </div>
            <span className="text-xs font-black text-[#6F42C1] bg-[#6F42C1]/10 px-2.5 py-1 rounded-lg border border-[#6F42C1]/20">
              Score: 98 / 100
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#5A6B82]">GST Returns (GSTR-3B):</span>
              <span className="font-bold text-[#6F42C1]">100% On-Time Filing</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#5A6B82]">Escrow Settlement History:</span>
              <span className="font-bold text-[#6F42C1]">Zero Disputes (28 Orders)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#5A6B82]">Credit Repayment Score:</span>
              <span className="font-bold text-[#6F42C1]">A+ (Prime Buyer)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <h3 className="text-base font-extrabold text-[#1E293B]">
                Edit Wholesaler Business Profile
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#F4F7FC] text-[#5A6B82] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#1E293B] block mb-1">Company Legal Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#6F42C1] font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1E293B] block mb-1">Business Constitution</label>
                  <input
                    type="text"
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#6F42C1] font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1E293B] block mb-1">Primary Contact Person</label>
                  <input
                    type="text"
                    value={formData.primaryContactPerson}
                    onChange={(e) => setFormData({ ...formData, primaryContactPerson: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#6F42C1] font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1E293B] block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#6F42C1] font-medium"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-[#1E293B] block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#6F42C1] font-medium"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-[#1E293B] block mb-1">Registered Office Address</label>
                  <input
                    type="text"
                    value={formData.officeAddress}
                    onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#6F42C1] font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1E293B] block mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#6F42C1] font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1E293B] block mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#6F42C1] font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1E293B] block mb-1">Annual Turnover</label>
                  <input
                    type="text"
                    value={formData.annualTurnover}
                    onChange={(e) => setFormData({ ...formData, annualTurnover: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#6F42C1] font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1E293B] block mb-1">Monthly Target Volume</label>
                  <input
                    type="text"
                    value={formData.targetSourcingVolume}
                    onChange={(e) => setFormData({ ...formData, targetSourcingVolume: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] focus:border-[#6F42C1] font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-[#1E293B] font-bold hover:bg-[#F4F7FC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6F42C1] text-white font-bold hover:bg-[#5C35A5] flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
