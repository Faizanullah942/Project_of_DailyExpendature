import React, { useState } from 'react';
import { useLedger } from '../../context/LedgerContext';
import { X, Download, FileSpreadsheet, FileCode, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../../utils/audio';

export const ExportModal: React.FC = () => {
  const { isExportModalOpen, setIsExportModalOpen, transactions } = useLedger();
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [isExported, setIsExported] = useState(false);

  if (!isExportModalOpen) return null;

  const handleDownload = () => {
    soundFx.playCommit();
    let content = '';
    let filename = '';
    let mime = '';

    if (format === 'csv') {
      const headers = ['ID', 'Timestamp', 'Date', 'Merchant', 'Category', 'Amount', 'Account', 'Status', 'Tags'];
      const rows = transactions.map(t => [
        t.id,
        t.timestamp,
        t.fullDate,
        `"${t.merchant}"`,
        `"${t.category}"`,
        t.amount,
        `"${t.account}"`,
        `"${t.statusTag}"`,
        `"${t.tags.join(' ')}"`
      ]);
      content = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      filename = `chronos_ledger_${Date.now()}.csv`;
      mime = 'text/csv;charset=utf-8;';
    } else {
      content = JSON.stringify(transactions, null, 2);
      filename = `chronos_ledger_${Date.now()}.json`;
      mime = 'application/json;charset=utf-8;';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExported(true);
    setTimeout(() => {
      setIsExported(false);
      setIsExportModalOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono animate-fadeIn">
      <div className="bg-[#0c121e] border border-[#202f4a] rounded-lg w-full max-w-md shadow-2xl overflow-hidden">
        
        <div className="flex items-center justify-between px-4 py-3 bg-[#0a0f19] border-b border-[#162136]">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-[#00f0ff]" />
            <span className="text-xs font-bold text-white tracking-wider uppercase font-display">
              TELEMETRY & LEDGER DATA EXPORT
            </span>
          </div>
          <button 
            onClick={() => {
              soundFx.playClick();
              setIsExportModalOpen(false);
            }}
            className="text-[#64748b] hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs">
          <p className="text-[#94a3b8] text-[11px]">
            Export verified transaction blocks, split allocations, and cryptographic verification logs.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => {
                soundFx.playClick();
                setFormat('csv');
              }}
              className={`p-3 rounded border cursor-pointer transition-all flex flex-col items-center gap-2 text-center ${
                format === 'csv'
                  ? 'bg-[#132338] border-[#00f0ff] text-white shadow-glow-cyan-sm'
                  : 'bg-[#090d15] border-[#182338] text-[#94a3b8] hover:border-[#2a3b5c]'
              }`}
            >
              <FileSpreadsheet className="w-6 h-6 text-[#00ff9d]" />
              <div>
                <div className="font-bold">CSV TABLE</div>
                <div className="text-[9px] text-[#64748b]">Spreadsheets & Accounting</div>
              </div>
            </div>

            <div
              onClick={() => {
                soundFx.playClick();
                setFormat('json');
              }}
              className={`p-3 rounded border cursor-pointer transition-all flex flex-col items-center gap-2 text-center ${
                format === 'json'
                  ? 'bg-[#132338] border-[#00f0ff] text-white shadow-glow-cyan-sm'
                  : 'bg-[#090d15] border-[#182338] text-[#94a3b8] hover:border-[#2a3b5c]'
              }`}
            >
              <FileCode className="w-6 h-6 text-[#ff3366]" />
              <div>
                <div className="font-bold">JSON LEDGER</div>
                <div className="text-[9px] text-[#64748b]">Full Cryptographic Payload</div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleDownload}
              disabled={isExported}
              className={`w-full py-2.5 rounded font-bold text-xs tracking-wider uppercase transition-all shadow-glow-pink flex items-center justify-center gap-2 ${
                isExported 
                  ? 'bg-[#00ff9d] text-[#080b11]' 
                  : 'bg-[#ff3366] hover:bg-[#ff1753] text-white'
              }`}
            >
              {isExported ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>EXPORT GENERATED</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>GENERATE & DOWNLOAD {format.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
