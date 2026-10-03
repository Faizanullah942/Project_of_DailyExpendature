import React from 'react';
import { useLedger } from '../../context/LedgerContext';
import { Download, Terminal, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  const { 
    activeTab, 
    setIsCliOpen, 
    setIsExportModalOpen,
    currentUtcTime
  } = useLedger();

  const timeOnly = currentUtcTime.split(' ')[1] || 'LIVE';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t border-[#1b2438] bg-[#06090e]/90 font-mono text-xs">
      {/* Secondary Terminal Utility Bar */}
      <div className="px-4 lg:px-6 py-2.5 border-b border-[#151d2f] flex flex-wrap items-center justify-between gap-3 text-[#94a3b8]">
        {activeTab === 'analytics' ? (
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="text-[#64748b]">FEED HEALTH:</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse" />
              <span className="text-white font-medium">KAFKA_CLUSTER_MAIN: 0.12ms LATENCY</span>
            </div>
            <div className="flex items-center gap-1.5 hidden sm:flex">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
              <span className="text-[#94a3b8]">LEDGER_STATE: HASH_CONSISTENT</span>
            </div>
            <div className="text-[#64748b] hidden md:inline">
              LAST EVAL: {timeOnly} UTC
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-1 text-[#00f0ff] hover:text-white transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>FORCE REFRESH</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-[#64748b]">AUDIT SYSTEM:</span>
            <div className="flex items-center gap-1 text-[#00ff9d]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse" />
              <span className="font-semibold tracking-wider">LEDGER INTEGRITY VERIFIED (0 ERROR NODES)</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#0e1626] hover:bg-[#15233c] hover:text-white border border-[#202f4a] hover:border-[#38bdf8] text-[#94a3b8] px-2.5 py-1 rounded text-[11px] transition-all"
          >
            <Download className="w-3 h-3 text-[#00f0ff]" />
            <span>EXPORT CSV/JSON</span>
          </button>
          <button
            onClick={() => setIsCliOpen(true)}
            className="flex items-center gap-1.5 bg-[#0e1626] hover:bg-[#15233c] hover:text-white border border-[#202f4a] hover:border-[#ff3366] text-[#94a3b8] px-2.5 py-1 rounded text-[11px] transition-all"
          >
            <Terminal className="w-3 h-3 text-[#ff3366]" />
            <span>CLI PROMPT</span>
          </button>
        </div>
      </div>

      {/* Primary Global Status Footer */}
      <div className="px-4 lg:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748b]">
        <div className="flex items-center gap-2">
          <span>STATUS: TELEMETRY SYNCED</span>
          <span className="text-[#00f0ff] font-bold">NODE_ONLINE #0x4E9</span>
        </div>
        <div>
          © {currentYear} Chronos Spend. High-Frequency Expenditure Engine.
        </div>
      </div>
    </footer>
  );
};
