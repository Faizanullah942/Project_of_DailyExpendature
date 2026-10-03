import React, { useState } from 'react';
import { useLedger } from '../../context/LedgerContext';
import type { Transaction } from '../../types';
import { 
  Cloud, 
  PenTool, 
  Coffee, 
  Cpu, 
  GitBranch, 
  Code, 
  ChevronRight,
  Utensils,
  Car
} from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { formatDateDisplay, getRelativeDateString } from '../../utils/date';

export const TransactionList: React.FC = () => {
  const { 
    transactions, 
    selectedTransaction, 
    setSelectedTransaction,
    searchQuery,
    typeFilter
  } = useLedger();

  const [currentPage, setCurrentPage] = useState(1);

  // Group transactions by Date header
  const filtered = transactions.filter(t => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchMerchant = t.merchant.toLowerCase().includes(q);
      const matchCategory = t.category.toLowerCase().includes(q);
      const matchTags = t.tags.some(tag => tag.toLowerCase().includes(q));
      const matchId = t.id.toLowerCase().includes(q);
      const matchAccount = t.account.toLowerCase().includes(q);
      return matchMerchant || matchCategory || matchTags || matchId || matchAccount;
    }
    return true;
  });

  // Dynamic Date Groupings
  const todayStr = getRelativeDateString(0);
  const yesterdayStr = getRelativeDateString(1);

  const dateMap = new Map<string, Transaction[]>();
  filtered.forEach(t => {
    const list = dateMap.get(t.fullDate) || [];
    list.push(t);
    dateMap.set(t.fullDate, list);
  });

  const sortedDates = Array.from(dateMap.keys()).sort((a, b) => b.localeCompare(a));

  const groups = sortedDates.map(date => {
    const items = dateMap.get(date) || [];
    let title = formatDateDisplay(date);
    if (date === todayStr) {
      title = `TODAY — ${title}`;
    } else if (date === yesterdayStr) {
      title = `YESTERDAY — ${title}`;
    }
    return {
      title,
      items,
      total: items.reduce((acc, i) => acc + i.amount, 0),
      count: items.length
    };
  }).filter(g => g.items.length > 0);

  const getCategoryDot = (category: string) => {
    if (category.toLowerCase().includes('infra') || category.toLowerCase().includes('cloud')) return 'bg-[#38bdf8]';
    if (category.toLowerCase().includes('saas') || category.toLowerCase().includes('sub')) return 'bg-[#f43f5e]';
    if (category.toLowerCase().includes('food') || category.toLowerCase().includes('beverage') || category.toLowerCase().includes('dining')) return 'bg-[#a855f7]';
    if (category.toLowerCase().includes('eng') || category.toLowerCase().includes('dev')) return 'bg-[#10b981]';
    return 'bg-[#00f0ff]';
  };

  const getIcon = (item: Transaction) => {
    switch (item.iconType) {
      case 'cloud': return <Cloud className="w-4 h-4 text-[#38bdf8]" />;
      case 'figma': return <PenTool className="w-4 h-4 text-[#f43f5e]" />;
      case 'coffee': return <Coffee className="w-4 h-4 text-[#a855f7]" />;
      case 'anthropic': return <Cpu className="w-4 h-4 text-[#10b981]" />;
      case 'github': return <GitBranch className="w-4 h-4 text-[#38bdf8]" />;
      case 'cursor': return <Code className="w-4 h-4 text-[#00f0ff]" />;
      case 'sushi': return <Utensils className="w-4 h-4 text-[#ff3366]" />;
      case 'transit': return <Car className="w-4 h-4 text-[#00ff9d]" />;
      default: return <Code className="w-4 h-4 text-[#94a3b8]" />;
    }
  };

  const handleSelect = (item: Transaction) => {
    soundFx.playClick();
    setSelectedTransaction(item);
  };

  return (
    <div className="space-y-4 font-mono">
      
      {groups.length === 0 ? (
        <div className="bg-[#0c121e] border border-[#1b253b] rounded-md p-8 text-center text-[#64748b]">
          No matching transaction records located in ledger.
        </div>
      ) : (
        groups.map((group, gIdx) => (
          <div key={gIdx} className="bg-[#0c121e] border border-[#1b253b] rounded-md overflow-hidden shadow-card-glow">
            
            {/* Group Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0a0f19] border-b border-[#162136] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff3366]" />
                <span className="font-bold text-white tracking-wider">
                  {group.title}
                </span>
                <span className="bg-[#141f33] text-[#00f0ff] text-[10px] px-1.5 py-0.2 rounded border border-[#1e2e47]">
                  {group.count} TRANSACTED
                </span>
              </div>
              <div className="text-[#94a3b8] text-xs font-semibold">
                DAILY TOTAL: <strong className="text-white font-jetbrains">${group.total.toFixed(2)}</strong>
              </div>
            </div>

            {/* Group Items */}
            <div className="divide-y divide-[#141d2e]">
              {group.items.map((item) => {
                const isSelected = selectedTransaction?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`flex items-center justify-between p-3 cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-[#121c2e] border-l-2 border-[#00f0ff] shadow-inner' 
                        : 'hover:bg-[#0e1626]'
                    }`}
                  >
                    {/* Left: Icon + Name + Category + Meta */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded bg-[#101828] border border-[#1a273f] flex items-center justify-center shrink-0">
                        {getIcon(item)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold truncate transition-colors ${
                            isSelected ? 'text-[#00f0ff]' : 'text-white'
                          }`}>
                            {item.merchant}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#94a3b8]">
                            <span className={`w-1.5 h-1.5 rounded-full ${getCategoryDot(item.category)}`} />
                            {item.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-[#64748b] mt-0.5 flex-wrap">
                          <span>{item.timestamp}</span>
                          <span>•</span>
                          <span>{item.account}</span>
                          {item.tags.length > 0 && (
                            <>
                              <span>•</span>
                              <span className="bg-[#101726] px-1 py-0.2 rounded text-[#94a3b8] border border-[#192438]">
                                {item.tags[0]}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Amount + Status Tag + Arrow */}
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#ff3366] font-jetbrains">
                          -${item.amount.toFixed(2)}
                        </div>
                        <div className={`text-[9px] font-semibold uppercase tracking-wider mt-0.5 ${
                          item.statusColor === 'green' ? 'text-[#00ff9d]' : 
                          item.statusColor === 'cyan' ? 'text-[#00f0ff]' : 'text-[#94a3b8]'
                        }`}>
                          {item.statusTag}
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-[#00f0ff] translate-x-0.5' : 'text-[#475569]'
                      }`} />
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        ))
      )}

      {/* Pagination Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748b] pt-1">
        <div>
          Showing 6 of 142 records <span className="text-[#94a3b8]">[Ledger Block 0x48A02]</span>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => soundFx.playClick()}
            className="px-2 py-0.5 rounded bg-[#0c121e] hover:bg-[#141e30] border border-[#1b253b] text-[#94a3b8]"
          >
            PREV
          </button>
          <button 
            onClick={() => {
              soundFx.playClick();
              setCurrentPage(1);
            }}
            className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
              currentPage === 1 
                ? 'bg-[#ff3366] text-white shadow-glow-pink-sm' 
                : 'bg-[#0c121e] text-[#94a3b8] border border-[#1b253b]'
            }`}
          >
            1
          </button>
          <button 
            onClick={() => {
              soundFx.playClick();
              setCurrentPage(2);
            }}
            className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
              currentPage === 2 
                ? 'bg-[#ff3366] text-white' 
                : 'bg-[#0c121e] text-[#94a3b8] border border-[#1b253b] hover:text-white'
            }`}
          >
            2
          </button>
          <button 
            onClick={() => {
              soundFx.playClick();
              setCurrentPage(3);
            }}
            className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
              currentPage === 3 
                ? 'bg-[#ff3366] text-white' 
                : 'bg-[#0c121e] text-[#94a3b8] border border-[#1b253b] hover:text-white'
            }`}
          >
            3
          </button>
          <button 
            onClick={() => soundFx.playClick()}
            className="px-2 py-0.5 rounded bg-[#0c121e] hover:bg-[#141e30] border border-[#1b253b] text-[#94a3b8]"
          >
            NEXT
          </button>
        </div>
      </div>

    </div>
  );
};
