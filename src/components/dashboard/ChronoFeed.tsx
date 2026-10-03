import React from 'react';
import { useLedger } from '../../context/LedgerContext';
import { Receipt } from 'lucide-react';
import { soundFx } from '../../utils/audio';

export const ChronoFeed: React.FC = () => {
  const { transactions, setSelectedTransaction, setActiveTab } = useLedger();

  // Filter transactions for today's feed
  const feedItems = transactions.slice(0, 4);

  const getAvatarLetter = (merchant: string) => {
    return merchant.charAt(0).toUpperCase();
  };

  const getAvatarColor = (idx: number) => {
    const colors = [
      'bg-[#3b1728] text-[#ff3366] border-[#ff3366]/40',
      'bg-[#12283a] text-[#00f0ff] border-[#00f0ff]/40',
      'bg-[#123324] text-[#00ff9d] border-[#00ff9d]/40',
      'bg-[#2d2238] text-[#c084fc] border-[#c084fc]/40'
    ];
    return colors[idx % colors.length];
  };

  const handleInspect = (tx: typeof transactions[0]) => {
    soundFx.playClick();
    setSelectedTransaction(tx);
    setActiveTab('ledger');
  };

  return (
    <div className="bg-[#0c121e] border border-[#1b253b] rounded-md p-3.5 shadow-card-glow font-mono">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#162136]">
        <div className="flex items-center gap-2">
          <span className="text-[#00f0ff] text-sm">❖</span>
          <span className="text-xs font-bold text-white tracking-wider">
            CHRONO-FEED // REAL-TIME DISPATCH
          </span>
        </div>
        <span className="text-[10px] text-[#64748b]">
          {feedItems.length} TRANSACTIONS TODAY
        </span>
      </div>

      {/* Feed List */}
      <div className="space-y-2">
        {feedItems.map((item, idx) => (
          <div 
            key={item.id}
            onClick={() => handleInspect(item)}
            className="flex items-center justify-between p-2 rounded bg-[#090e17] hover:bg-[#111928] border border-[#151f33] hover:border-[#22334e] transition-all cursor-pointer group"
          >
            {/* Left: Time + Avatar + Name + Tags */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-[#00f0ff] w-14 shrink-0 font-medium">
                {item.timestamp}
              </span>

              <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs border ${getAvatarColor(idx)} shrink-0`}>
                {getAvatarLetter(item.merchant)}
              </div>

              <div className="min-w-0">
                <div className="text-xs font-medium text-white group-hover:text-[#00f0ff] transition-colors truncate">
                  {item.merchant}
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-[#64748b] mt-0.5 flex-wrap">
                  {item.tags.map((tag, tIdx) => (
                    <span key={tIdx}>{tag}</span>
                  ))}
                  {item.isReceiptAttached && (
                    <Receipt className="w-2.5 h-2.5 text-[#00ff9d]" />
                  )}
                </div>
              </div>
            </div>

            {/* Right: Amount + Instrument */}
            <div className="text-right shrink-0 ml-3">
              <div className="text-xs font-bold text-[#ff3366] font-jetbrains">
                -${item.amount.toFixed(2)}
              </div>
              <div className="text-[9px] text-[#64748b] uppercase tracking-wider mt-0.5">
                {item.account}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
