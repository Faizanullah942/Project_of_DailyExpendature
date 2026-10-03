import React from 'react';
import { useLedger } from '../../context/LedgerContext';
import { 
  Search, 
  Calendar, 
  Tag, 
  Landmark, 
  Download, 
  ChevronDown, 
  X 
} from 'lucide-react';
import { soundFx } from '../../utils/audio';

export const LedgerFilterBar: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    typeFilter, 
    setTypeFilter,
    dateRangeFilter,
    setDateRangeFilter,
    categoryFilter,
    setCategoryFilter,
    vaultFilter,
    setVaultFilter,
    activeFilterTags,
    removeFilterTag,
    resetAllFilters,
    setIsExportModalOpen
  } = useLedger();

  const typeOptions: { id: 'all' | 'debit' | 'credit' | 'transfer'; label: string }[] = [
    { id: 'all', label: 'ALL' },
    { id: 'debit', label: 'DEBIT / OUTFLOW' },
    { id: 'credit', label: 'CREDIT / REFUND' },
    { id: 'transfer', label: 'TRANSFER' }
  ];

  return (
    <div className="space-y-2.5 font-mono text-xs">
      
      {/* Top Header Metrics Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#162136]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ff3366] shadow-glow-pink-sm" />
          <span className="text-sm font-bold text-white tracking-wider">
            LEDGER / REALTIME FEED
          </span>
          <span className="text-[10px] bg-[#0f2334] text-[#00f0ff] border border-[#00f0ff]/30 px-1.5 py-0.5 rounded font-medium">
            SYNC_OK 1.2MS
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#94a3b8]">
          <div>
            <span>30-DAY OUTFLOW: </span>
            <strong className="text-white">$14,892.40</strong>
            <span className="text-[#ff3366] font-semibold ml-1">▲ 4.2%</span>
          </div>
          <div>
            <span>CLEARED VOL: </span>
            <strong className="text-[#00ff9d]">142 Entries</strong>
          </div>
          <div>
            <span>AUDITED: </span>
            <strong className="text-[#00f0ff]">99.8%</strong>
          </div>
        </div>
      </div>

      {/* Main Filter Controls Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2">
        
        {/* Search Input */}
        <div className="lg:col-span-4 relative">
          <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search merchants, hashes, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0c121e] border border-[#1b253b] focus:border-[#00f0ff] text-white text-xs rounded pl-8 pr-8 py-1.5 focus:outline-none placeholder-[#475569]"
          />
          <span className="text-[10px] text-[#64748b] absolute right-2.5 top-1/2 -translate-y-1/2 bg-[#141e30] px-1 py-0.2 rounded border border-[#1e2e47]">
            ⌘K
          </span>
        </div>

        {/* Date Range Dropdown */}
        <div className="lg:col-span-2 relative">
          <div className="flex items-center gap-1.5 bg-[#0c121e] border border-[#1b253b] hover:border-[#2a3b5c] text-white text-xs rounded px-2.5 py-1.5 cursor-pointer">
            <Calendar className="w-3 h-3 text-[#00f0ff] shrink-0" />
            <select
              value={dateRangeFilter}
              onChange={(e) => {
                soundFx.playClick();
                setDateRangeFilter(e.target.value);
              }}
              className="bg-transparent text-white text-xs appearance-none focus:outline-none w-full cursor-pointer pr-4"
            >
              <option value="Last 7 Days" className="bg-[#0c121e]">Last 7 Days</option>
              <option value="Last 30 Days" className="bg-[#0c121e]">Last 30 Days</option>
              <option value="Month to Date" className="bg-[#0c121e]">Month to Date</option>
              <option value="All Time" className="bg-[#0c121e]">All Time</option>
            </select>
            <ChevronDown className="w-3 h-3 text-[#64748b] absolute right-2 pointer-events-none" />
          </div>
        </div>

        {/* Categories Dropdown */}
        <div className="lg:col-span-2 relative">
          <div className="flex items-center gap-1.5 bg-[#0c121e] border border-[#1b253b] hover:border-[#2a3b5c] text-white text-xs rounded px-2.5 py-1.5 cursor-pointer">
            <Tag className="w-3 h-3 text-[#00ff9d] shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => {
                soundFx.playClick();
                setCategoryFilter(e.target.value);
              }}
              className="bg-transparent text-white text-xs appearance-none focus:outline-none w-full cursor-pointer pr-4 truncate"
            >
              <option value="Categories (3)" className="bg-[#0c121e]">Categories (3)</option>
              <option value="Infrastructure" className="bg-[#0c121e]">Infrastructure</option>
              <option value="SaaS Subscriptions" className="bg-[#0c121e]">SaaS Subscriptions</option>
              <option value="Food & Beverage" className="bg-[#0c121e]">Food & Beverage</option>
              <option value="Engineering" className="bg-[#0c121e]">Engineering</option>
            </select>
            <ChevronDown className="w-3 h-3 text-[#64748b] absolute right-2 pointer-events-none" />
          </div>
        </div>

        {/* Vault Dropdown */}
        <div className="lg:col-span-2 relative">
          <div className="flex items-center gap-1.5 bg-[#0c121e] border border-[#1b253b] hover:border-[#2a3b5c] text-white text-xs rounded px-2.5 py-1.5 cursor-pointer">
            <Landmark className="w-3 h-3 text-[#f59e0b] shrink-0" />
            <select
              value={vaultFilter}
              onChange={(e) => {
                soundFx.playClick();
                setVaultFilter(e.target.value);
              }}
              className="bg-transparent text-white text-xs appearance-none focus:outline-none w-full cursor-pointer pr-4 truncate"
            >
              <option value="Mercury Vault" className="bg-[#0c121e]">Mercury Vault</option>
              <option value="Corporate Visa" className="bg-[#0c121e]">Corporate Visa</option>
              <option value="Amex Primary" className="bg-[#0c121e]">Amex Primary</option>
              <option value="All Accounts" className="bg-[#0c121e]">All Accounts</option>
            </select>
            <ChevronDown className="w-3 h-3 text-[#64748b] absolute right-2 pointer-events-none" />
          </div>
        </div>

        {/* Export Dropdown Button */}
        <div className="lg:col-span-2">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="w-full flex items-center justify-center gap-1.5 bg-[#10192a] hover:bg-[#18263e] text-[#94a3b8] hover:text-white border border-[#202f4a] hover:border-[#38bdf8] text-xs rounded py-1.5 transition-all"
          >
            <Download className="w-3 h-3 text-[#00f0ff]" />
            <span>EXPORT</span>
            <ChevronDown className="w-3 h-3 text-[#64748b]" />
          </button>
        </div>

      </div>

      {/* Pill Filters & Active Filter Tags */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
        
        {/* Type Filter Pills */}
        <div className="flex items-center gap-1 bg-[#090e17] p-0.5 rounded border border-[#182338]">
          {typeOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => {
                soundFx.playClick();
                setTypeFilter(opt.id);
              }}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                typeFilter === opt.id
                  ? 'bg-[#15233c] text-[#00f0ff] border border-[#00f0ff]/40 shadow-glow-cyan-sm'
                  : 'text-[#64748b] hover:text-[#94a3b8]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Active Filter Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#64748b]">ACTIVE FILTERS:</span>
          {activeFilterTags.map(tag => (
            <span 
              key={tag.key}
              className="inline-flex items-center gap-1 bg-[#101a2c] text-[#00f0ff] border border-[#1e2f4a] px-2 py-0.5 rounded text-[10px]"
            >
              <span>{tag.label}: {tag.value}</span>
              <button 
                onClick={() => removeFilterTag(tag.key)}
                className="hover:text-[#ff3366] ml-0.5"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}

          <button
            onClick={resetAllFilters}
            className="text-[10px] text-[#ff3366] hover:underline font-semibold ml-1 uppercase"
          >
            RESET ALL
          </button>
        </div>

      </div>

    </div>
  );
};
