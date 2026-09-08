import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Building,
  Factory,
  Store,
  PieChart,
  FileSpreadsheet,
  IndianRupee,
  Layers,
  MapPin,
} from 'lucide-react';
import { Manufacturer, Distributor, Product, Order, Rfq } from '../types';

interface ReportsScreenProps {
  manufacturers: Manufacturer[];
  distributors: Distributor[];
  products: Product[];
  orders: Order[];
  rfqs: Rfq[];
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({
  manufacturers,
  distributors,
  products,
  orders,
  rfqs,
}) => {
  const [dateRange, setDateRange] = useState('Last 30 Days (August 2026)');

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalOrderVolume = orders.reduce((acc, curr) => acc + curr.amount, 0);

  // Region breakdown
  const clusterData = [
    { city: 'Ahmedabad & Sanand', mfr: 4, dst: 8, volume: '₹14.2 Cr', share: '32%' },
    { city: 'Morbi Industrial Cluster', mfr: 5, dst: 3, volume: '₹11.8 Cr', share: '26%' },
    { city: 'Vapi & Valsad GIDC', mfr: 3, dst: 4, volume: '₹9.4 Cr', share: '21%' },
    { city: 'Surat & Sachin Zone', mfr: 3, dst: 5, volume: '₹5.6 Cr', share: '13%' },
    { city: 'Dahej Petrochemical Corridor', mfr: 2, dst: 2, volume: '₹3.5 Cr', share: '8%' },
  ];

  // Resin category share
  const resinCategories = [
    { name: 'HDPE Granules & Blow Resins', share: 34, avgPrice: '₹108.5/kg', demand: 'High' },
    { name: 'PP Woven Sacks & Raffia', share: 28, avgPrice: '₹96.2/kg', demand: 'Very High' },
    { name: 'Masterbatch & Pigments', share: 18, avgPrice: '₹142.0/kg', demand: 'Moderate' },
    { name: 'PVC Rigid & Conduit Resins', share: 12, avgPrice: '₹84.5/kg', demand: 'High' },
    { name: 'PET Preforms & Engineering', share: 8, avgPrice: '₹165.0/kg', demand: 'Growing' },
  ];

  const handleExportCSV = (reportName: string) => {
    let csvData = `Report: ${reportName}\nDate Range: ${dateRange}\nGenerated: ${new Date().toISOString()}\n\n`;

    if (reportName.includes('Cluster')) {
      csvData += `Cluster,Manufacturers,Distributors,Trade Volume,Market Share\n`;
      clusterData.forEach((c) => {
        csvData += `"${c.city}",${c.mfr},${c.dst},"${c.volume}","${c.share}"\n`;
      });
    } else {
      csvData += `Category,Share %,Average Price,Demand Trend\n`;
      resinCategories.forEach((r) => {
        csvData += `"${r.name}",${r.share}%,"${r.avgPrice}","${r.demand}"\n`;
      });
    }

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-[#0B1F3A] tracking-tight">
              Reports & Market Intelligence
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-[#0B1F3A] text-white rounded-lg">
              Gujarat Region
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#5A6B82] mt-1 font-medium">
            Analytical insights, regional trade distribution, pricing indices, and volume metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#E2E8F0] shadow-xs text-xs font-bold text-[#0B1F3A]">
            <Calendar className="w-4 h-4 text-[#FF7A18]" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option>Last 30 Days (August 2026)</option>
              <option>Q2 2026 (Apr - Jun)</option>
              <option>Q1 2026 (Jan - Mar)</option>
              <option>Full FY 2025-26</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => handleExportCSV('PlastoShip_Gujarat_Comprehensive_Report')}
            className="px-4 py-2.5 bg-[#FF7A18] hover:bg-[#E56A10] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-bold text-[#5A6B82] uppercase">Gross Trade Volume</span>
          <p className="text-2xl font-extrabold text-[#0B1F3A] mt-2">{formatINR(totalOrderVolume)}</p>
          <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700">
            ↑ +18.4% month-over-month
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-bold text-[#5A6B82] uppercase">RFQ Fulfillment Rate</span>
          <p className="text-2xl font-extrabold text-[#0B1F3A] mt-2">
            {Math.round((rfqs.filter((r) => r.status === 'Awarded' || r.status === 'Closed').length / (rfqs.length || 1)) * 100)}%
          </p>
          <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700">
            Average 4.2 quotes per RFQ
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-bold text-[#5A6B82] uppercase">Average Plant Capacity</span>
          <p className="text-2xl font-extrabold text-[#0B1F3A] mt-2">
            {Math.round(
              manufacturers.reduce((acc, curr) => acc + curr.capacityMt, 0) / (manufacturers.length || 1)
            ).toLocaleString('en-IN')}{' '}
            MT
          </p>
          <span className="inline-block mt-1 text-[11px] font-semibold text-blue-700">
            Across 14 GIDC Estates
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <span className="text-xs font-bold text-[#5A6B82] uppercase">Distributor Credit Active</span>
          <p className="text-2xl font-extrabold text-[#0B1F3A] mt-2">₹1.15 Cr</p>
          <span className="inline-block mt-1 text-[11px] font-semibold text-purple-700">
            99.2% On-time Escrow Settlement
          </span>
        </div>
      </div>

      {/* Regional Cluster & Demand Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gujarat Cluster Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-[#0B1F3A]">Gujarat GIDC Cluster Breakdown</h3>
              <p className="text-xs text-[#5A6B82]">Market share and volume density by regional corridor</p>
            </div>
            <button
              type="button"
              onClick={() => handleExportCSV('GIDC_Cluster_Breakdown')}
              className="p-1.5 text-[#5A6B82] hover:text-[#0B1F3A] hover:bg-[#F4F7FC] rounded-lg"
              title="Download table"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {clusterData.map((cluster) => (
              <div key={cluster.city} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#0B1F3A]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#FF7A18]" />
                    <span>{cluster.city}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#5A6B82] font-semibold">{cluster.volume}</span>
                    <span className="text-[#0B1F3A]">{cluster.share}</span>
                  </div>
                </div>
                {/* Visual Progress Bar */}
                <div className="h-2 w-full bg-[#F4F7FC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0B1F3A] rounded-full"
                    style={{ width: cluster.share }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resin Category Share & Pricing */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-[#0B1F3A]">Resin Category Pricing Index</h3>
              <p className="text-xs text-[#5A6B82]">Volume demand split and spot rate benchmarks</p>
            </div>
            <button
              type="button"
              onClick={() => handleExportCSV('Resin_Pricing_Index')}
              className="p-1.5 text-[#5A6B82] hover:text-[#0B1F3A] hover:bg-[#F4F7FC] rounded-lg"
              title="Download table"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {resinCategories.map((cat) => (
              <div
                key={cat.name}
                className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-[#0B1F3A]">{cat.name}</p>
                  <p className="text-[11px] text-[#5A6B82] mt-0.5">Spot Price: {cat.avgPrice}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 bg-[#FF7A18]/10 text-[#FF7A18] rounded text-[10px] font-extrabold uppercase">
                    {cat.demand} Demand
                  </span>
                  <p className="text-xs font-extrabold text-[#0B1F3A] mt-1">{cat.share}% Market Share</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
