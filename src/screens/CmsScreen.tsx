import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Sparkles,
  Layers,
  Search,
} from 'lucide-react';
import { CMSBanner, CMSAnnouncement, CMSFeaturedItem } from '../types';
import { Modal } from '../components/Modal';

interface CmsScreenProps {
  banners: CMSBanner[];
  announcements: CMSAnnouncement[];
  featuredItems: CMSFeaturedItem[];
  onToggleBanner: (id: string) => void;
  onToggleAnnouncement: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onAddAnnouncement: (announcement: Omit<CMSAnnouncement, 'id' | 'updatedAt'>) => void;
  onAddBanner: (banner: Omit<CMSBanner, 'id'>) => void;
}

export const CmsScreen: React.FC<CmsScreenProps> = ({
  banners,
  announcements,
  featuredItems,
  onToggleBanner,
  onToggleAnnouncement,
  onToggleFeatured,
  onAddAnnouncement,
  onAddBanner,
}) => {
  const [activeTab, setActiveTab] = useState<'banners' | 'announcements' | 'featured'>('banners');

  // New banner modal state
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerBadge, setNewBannerBadge] = useState('Gujarat Highlight');
  const [newBannerCta, setNewBannerCta] = useState('Explore Catalog');
  const [newBannerColor, setNewBannerColor] = useState<'Navy' | 'Orange' | 'Slate'>('Navy');
  const [newBannerAudience, setNewBannerAudience] = useState<'All' | 'Manufacturers' | 'Distributors'>('All');

  // New announcement modal state
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnType, setNewAnnType] = useState<'Notice' | 'Update' | 'Alert'>('Notice');

  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle.trim()) return;
    onAddBanner({
      title: newBannerTitle.trim(),
      subtitle: newBannerSubtitle.trim() || 'Direct verified Gujarat polymer trade.',
      badge: newBannerBadge.trim(),
      ctaText: newBannerCta.trim(),
      ctaLink: '/products',
      active: true,
      colorScheme: newBannerColor,
      targetAudience: newBannerAudience,
    });
    setShowBannerModal(false);
    setNewBannerTitle('');
    setNewBannerSubtitle('');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;
    onAddAnnouncement({
      title: newAnnTitle.trim(),
      content: newAnnContent.trim(),
      type: newAnnType,
      active: true,
    });
    setShowAnnouncementModal(false);
    setNewAnnTitle('');
    setNewAnnContent('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0B1F3A] tracking-tight">
            CMS & Portal Management
          </h2>
          <p className="text-xs md:text-sm text-[#5A6B82] mt-1 font-medium">
            Control marketplace banners, GIDC trade advisories, and curated spotlight items
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'banners' && (
            <button
              type="button"
              onClick={() => setShowBannerModal(true)}
              className="px-4 py-2.5 bg-[#FF7A18] hover:bg-[#E56A10] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign Banner</span>
            </button>
          )}

          {activeTab === 'announcements' && (
            <button
              type="button"
              onClick={() => setShowAnnouncementModal(true)}
              className="px-4 py-2.5 bg-[#0B1F3A] hover:bg-[#122B4E] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Circular / Alert</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('banners')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'banners'
              ? 'bg-[#0B1F3A] text-white shadow-xs'
              : 'text-[#5A6B82] hover:text-[#0B1F3A] hover:bg-[#F4F7FC]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Home & Portal Banners ({banners.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'announcements'
              ? 'bg-[#0B1F3A] text-white shadow-xs'
              : 'text-[#5A6B82] hover:text-[#0B1F3A] hover:bg-[#F4F7FC]'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Announcements & Advisories ({announcements.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('featured')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'featured'
              ? 'bg-[#0B1F3A] text-white shadow-xs'
              : 'text-[#5A6B82] hover:text-[#0B1F3A] hover:bg-[#F4F7FC]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Featured Showcases ({featuredItems.length})</span>
        </button>
      </div>

      {/* TAB 1: BANNERS */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all p-5 flex flex-col justify-between shadow-xs hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                        {banner.badge}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          banner.colorScheme === 'Navy'
                            ? 'bg-[#EEEDFD] text-[#4B49AC] border-[#D6D4F7]'
                            : banner.colorScheme === 'Orange'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {banner.colorScheme} Theme
                      </span>
                    </div>

                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 ${
                        banner.active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          banner.active ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                      {banner.active ? 'Active on Portal' : 'Inactive'}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 mb-1.5 leading-snug">
                    {banner.title}
                  </h3>

                  <p className="text-xs text-[#5A6B82] leading-relaxed mb-4">
                    {banner.subtitle}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-[#F1F5F9] flex items-center justify-between">
                  <span className="text-xs text-[#5A6B82]">
                    Audience: <strong className="text-slate-800 font-semibold">{banner.targetAudience}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => onToggleBanner(banner.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      banner.active
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60'
                        : 'bg-[#0B1F3A] text-white hover:bg-[#122B4E] shadow-xs'
                    }`}
                  >
                    {banner.active ? 'Deactivate' : 'Publish Live'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        ann.type === 'Alert'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : ann.type === 'Update'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {ann.type}
                    </span>

                    <span className="text-[11px] text-[#5A6B82]">Updated: {ann.updatedAt}</span>
                  </div>

                  <h3 className="font-extrabold text-sm text-[#0B1F3A] mb-1.5 leading-snug">
                    {ann.title}
                  </h3>

                  <p className="text-xs text-[#5A6B82] leading-relaxed mb-4">{ann.content}</p>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      ann.active ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {ann.active ? '● Broadcast Active' : '○ Draft Only'}
                  </span>

                  <button
                    type="button"
                    onClick={() => onToggleAnnouncement(ann.id)}
                    className="px-3 py-1.5 bg-[#F4F7FC] hover:bg-[#E2E8F0] text-[#0B1F3A] text-xs font-bold rounded-xl transition-colors"
                  >
                    {ann.active ? 'Unpublish' : 'Broadcast Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FEATURED SHOWCASES */}
      {activeTab === 'featured' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#5A6B82] uppercase tracking-wider">
                  <th className="py-4 px-5">Showcase Item</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Location / Price</th>
                  <th className="py-4 px-4">Badge Title</th>
                  <th className="py-4 px-5 text-right">Marketplace Display</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-xs">
                {featuredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F4F7FC]/70">
                    <td className="py-4 px-5 font-bold text-[#0B1F3A]">{item.name}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 font-semibold rounded text-[11px] text-[#0B1F3A]">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[#5A6B82]">{item.category}</td>
                    <td className="py-4 px-4 font-bold text-[#0B1F3A]">{item.locationOrPrice}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 bg-[#FF7A18]/10 text-[#FF7A18] font-bold rounded text-[10px]">
                        {item.badge}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => onToggleFeatured(item.id)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                          item.isFeatured
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {item.isFeatured ? 'Featured on Home' : 'Promote to Home'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE BANNER MODAL */}
      <Modal
        isOpen={showBannerModal}
        onClose={() => setShowBannerModal(false)}
        title="Create Campaign Banner"
        subtitle="Set up regional polymer promotion or announcement banner"
      >
        <form onSubmit={handleCreateBanner} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0B1F3A] mb-1 uppercase">Banner Headline</label>
            <input
              type="text"
              value={newBannerTitle}
              onChange={(e) => setNewBannerTitle(e.target.value)}
              placeholder="e.g. Morbi Pipe Resin Festival 2026"
              className="w-full h-10 px-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B1F3A] mb-1 uppercase">Subtitle / Copy</label>
            <textarea
              rows={2}
              value={newBannerSubtitle}
              onChange={(e) => setNewBannerSubtitle(e.target.value)}
              placeholder="Brief description explaining terms or benefits..."
              className="w-full p-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1 uppercase">Color Theme</label>
              <select
                value={newBannerColor}
                onChange={(e) => setNewBannerColor(e.target.value as any)}
                className="w-full h-10 px-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A]"
              >
                <option value="Navy">Ink Navy</option>
                <option value="Orange">Dispatch Orange</option>
                <option value="Slate">Subtle Slate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1 uppercase">Audience</label>
              <select
                value={newBannerAudience}
                onChange={(e) => setNewBannerAudience(e.target.value as any)}
                className="w-full h-10 px-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A]"
              >
                <option value="All">All Portal Users</option>
                <option value="Manufacturers">Manufacturers Only</option>
                <option value="Distributors">Distributors Only</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setShowBannerModal(false)}
              className="px-4 py-2 bg-[#F4F7FC] text-[#5A6B82] font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FF7A18] text-white font-bold text-xs rounded-xl"
            >
              Publish Banner
            </button>
          </div>
        </form>
      </Modal>

      {/* CREATE ANNOUNCEMENT MODAL */}
      <Modal
        isOpen={showAnnouncementModal}
        onClose={() => setShowAnnouncementModal(false)}
        title="Publish Circular / Alert"
        subtitle="Broadcast regulatory or logistical notifications across Gujarat GIDCs"
      >
        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0B1F3A] mb-1 uppercase">Notice Title</label>
            <input
              type="text"
              value={newAnnTitle}
              onChange={(e) => setNewAnnTitle(e.target.value)}
              placeholder="e.g. BIS Compliance QCO Advisory for HDPE"
              className="w-full h-10 px-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B1F3A] mb-1 uppercase">Advisory Type</label>
            <select
              value={newAnnType}
              onChange={(e) => setNewAnnType(e.target.value as any)}
              className="w-full h-10 px-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A]"
            >
              <option value="Notice">General Notice</option>
              <option value="Update">System Update</option>
              <option value="Alert">Urgent Regulatory Alert</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B1F3A] mb-1 uppercase">Full Content</label>
            <textarea
              rows={4}
              value={newAnnContent}
              onChange={(e) => setNewAnnContent(e.target.value)}
              placeholder="Enter detailed notification information..."
              className="w-full p-3 bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-xs text-[#0B1F3A] font-medium"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setShowAnnouncementModal(false)}
              className="px-4 py-2 bg-[#F4F7FC] text-[#5A6B82] font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0B1F3A] text-white font-bold text-xs rounded-xl"
            >
              Broadcast Live
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
