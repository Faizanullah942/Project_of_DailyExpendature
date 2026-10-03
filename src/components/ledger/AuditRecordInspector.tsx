import React, { useState } from 'react';
import { useLedger } from '../../context/LedgerContext';
import { 
  ShieldCheck, 
  ChevronDown, 
  FileText, 
  CheckCircle2, 
  Sliders, 
  Flag, 
  Share2, 
  Copy, 
  Check 
} from 'lucide-react';
import { soundFx } from '../../utils/audio';

export const AuditRecordInspector: React.FC = () => {
  const { 
    selectedTransaction, 
    reassignCategory, 
    updateSplitAllocation, 
    disputeTransaction 
  } = useLedger();

  const [isAdjustingSplit, setIsAdjustingSplit] = useState(false);
  const [splitRatio, setSplitRatio] = useState(75); // 75% department 1
  const [isCopied, setIsCopied] = useState(false);
  const [isSplitSaved, setIsSplitSaved] = useState(false);

  if (!selectedTransaction) {
    return (
      <div className="bg-[#0c121e] border border-[#1b253b] rounded-md p-8 text-center text-[#64748b] font-mono">
        Select a transaction record to inspect cryptographic audit details.
      </div>
    );
  }

  const tx = selectedTransaction;
  const preTax = tx.preTax || tx.amount * 0.92;
  const taxAmount = tx.taxAmount !== undefined ? tx.taxAmount : tx.amount * 0.08;
  const taxLabel = tx.taxLabel || 'TAX JURIS / RATE (CA STATE 9.0%)';
  const deductibility = tx.deductibilityStatus || '100% Corp Write-off (Sec. 174)';
  const invoiceNum = tx.invoiceNumber || `INVOICE-${tx.id}-US`;
  const cryptoHash = tx.cryptoHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const dept1Name = tx.splitAllocation?.departments[0]?.name || 'Core Infrastructure';
  const dept2Name = tx.splitAllocation?.departments[1]?.name || 'Client Sandbox Env';

  const dept1Amount = ((tx.amount * splitRatio) / 100).toFixed(2);
  const dept2Amount = ((tx.amount * (100 - splitRatio)) / 100).toFixed(2);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    reassignCategory(tx.id, e.target.value);
  };

  const handleApplySplit = () => {
    soundFx.playCommit();
    updateSplitAllocation(tx.id, {
      departments: [
        { name: dept1Name, percentage: splitRatio, amount: Number(dept1Amount) },
        { name: dept2Name, percentage: 100 - splitRatio, amount: Number(dept2Amount) }
      ]
    });
    setIsSplitSaved(true);
    setTimeout(() => {
      setIsSplitSaved(false);
      setIsAdjustingSplit(false);
    }, 1500);
  };

  const handleCopyHash = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(cryptoHash);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShareLink = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(window.location.href);
    alert('Cryptographic audit receipt link copied to clipboard.');
  };

  return (
    <div className="bg-[#0c121e] border border-[#1b253b] rounded-md p-4 shadow-card-glow font-mono space-y-4">
      
      {/* Header: Audit Record ID + Status */}
      <div className="flex items-center justify-between pb-3 border-b border-[#162136]">
        <div className="flex items-center gap-2 text-xs font-bold text-[#00f0ff]">
          <ShieldCheck className="w-4 h-4 text-[#00f0ff]" />
          <span>AUDIT RECORD #{tx.id}</span>
        </div>

        <span className="bg-[#0d3829] text-[#00ff9d] border border-[#00ff9d]/30 text-[10px] font-bold px-2 py-0.5 rounded tracking-wider">
          STATUS: SETTLED
        </span>
      </div>

      {/* Big Title & Amount */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-xl font-display font-black text-white tracking-wide">
            {tx.merchant.replace('AWS Cloud Infrastructure', 'AWS Infrastructure')}
          </h2>
          <div className="text-[10px] text-[#64748b] mt-0.5">
            {tx.isoTimestamp || `${tx.fullDate}T${tx.timestamp.replace(' UTC', '')}.419Z`}
          </div>
        </div>

        <div className="text-2xl font-bold text-[#ff3366] font-jetbrains">
          -${tx.amount.toFixed(2)}
        </div>
      </div>

      {/* Category Re-assignment Dropdown */}
      <div>
        <label className="block text-[10px] text-[#64748b] uppercase font-semibold mb-1">
          CATEGORY RE-ASSIGNMENT
        </label>
        <div className="relative">
          <select
            value={tx.category}
            onChange={handleCategoryChange}
            className="w-full bg-[#090e17] border border-[#182338] hover:border-[#2a3b5c] text-white text-xs rounded px-3 py-2 appearance-none focus:outline-none focus:border-[#00f0ff] cursor-pointer"
          >
            <option value="Infrastructure">Infrastructure (Current: 64% budget)</option>
            <option value="SaaS Subscriptions">SaaS Subscriptions (Current: 75% budget)</option>
            <option value="Food & Beverage">Food & Beverage (Current: 82% budget)</option>
            <option value="Engineering">Engineering (Current: 58% budget)</option>
            <option value="Transit & Travel">Transit & Travel (Current: 42% budget)</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Digital Receipt & Ledger Verification Card */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[#64748b] uppercase font-semibold">
            DIGITAL RECEIPT & LEDGER VERIFICATION
          </span>
          <button 
            onClick={handleCopyHash}
            className="text-[#00f0ff] hover:text-white flex items-center gap-1 transition-colors"
          >
            {isCopied ? <Check className="w-3 h-3 text-[#00ff9d]" /> : <Copy className="w-3 h-3" />}
            <span>{isCopied ? 'COPIED' : 'VIEW RAW HASH'}</span>
          </button>
        </div>

        {/* High-Tech Holographic Hash Box */}
        <div className="bg-gradient-to-br from-[#0e1726] to-[#090d16] border border-[#202f4a] rounded p-3 relative overflow-hidden group">
          {/* Subtle circuit overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
          
          <div className="relative z-10 flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <FileText className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span>{invoiceNum}</span>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-[#00ff9d] bg-[#0c2a1e] border border-[#00ff9d]/30 px-1.5 py-0.2 rounded font-semibold">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>CRYPTOGRAPHICALLY SIGNED</span>
            </div>
          </div>

          <div className="relative z-10 text-[9px] text-[#64748b] break-all leading-tight font-mono bg-[#06090f]/80 p-1.5 rounded border border-[#141c2c]">
            <span className="text-[#94a3b8]">SHA256: </span>
            {cryptoHash.slice(0, 48)}...
          </div>
        </div>
      </div>

      {/* Financial Breakdown Table */}
      <div className="bg-[#090e17] border border-[#182338] rounded p-3 space-y-2 text-xs">
        <div className="flex items-center justify-between text-[#94a3b8]">
          <span>SUBTOTAL (PRE-TAX):</span>
          <span className="text-white font-jetbrains">${preTax.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-[#94a3b8]">
          <span className="text-[11px]">{taxLabel}:</span>
          <span className="text-[#00f0ff] font-jetbrains">+${taxAmount.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-[#94a3b8] text-[11px]">
          <span>DEDUCTIBILITY STATUS:</span>
          <span className="text-[#00ff9d] font-semibold">{deductibility}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#162136] text-sm font-bold text-white">
          <span>Final Billed:</span>
          <span className="font-jetbrains">${tx.amount.toFixed(2)} USD</span>
        </div>
      </div>

      {/* Split Allocation Tool */}
      <div className="bg-[#090e17] border border-[#182338] rounded p-3 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <Sliders className="w-3.5 h-3.5 text-[#ff3366]" />
            <span>SPLIT ALLOCATION TOOL</span>
          </div>
          <span className="text-[10px] text-[#00f0ff] bg-[#122238] px-1.5 py-0.2 rounded border border-[#1e3250]">
            2 Departments
          </span>
        </div>

        {/* Department amounts */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#94a3b8]">
              {dept1Name} ({splitRatio}%)
            </span>
            <span className="text-white font-bold font-jetbrains">${dept1Amount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#94a3b8]">
              {dept2Name} ({100 - splitRatio}%)
            </span>
            <span className="text-white font-bold font-jetbrains">${dept2Amount}</span>
          </div>
        </div>

        {/* Dual Color Split Progress Bar */}
        <div className="w-full bg-[#151f33] h-2 rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] transition-all duration-200"
            style={{ width: `${splitRatio}%` }}
          />
          <div 
            className="h-full bg-gradient-to-r from-[#ff3366] to-[#ff6b8b] transition-all duration-200"
            style={{ width: `${100 - splitRatio}%` }}
          />
        </div>

        {/* Interactive Slider if adjusting */}
        {isAdjustingSplit && (
          <div className="pt-2 border-t border-[#162136] space-y-2">
            <div className="flex items-center justify-between text-[10px] text-[#64748b]">
              <span>Adjust Ratio:</span>
              <span className="text-[#00f0ff] font-bold">{splitRatio}% / {100 - splitRatio}%</span>
            </div>
            <input 
              type="range"
              min="10"
              max="90"
              step="5"
              value={splitRatio}
              onChange={(e) => setSplitRatio(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        {/* Split Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setIsAdjustingSplit(!isAdjustingSplit);
            }}
            className="bg-[#10192a] hover:bg-[#18263e] text-[#94a3b8] hover:text-white border border-[#1e2f4a] py-1.5 rounded text-xs transition-all font-semibold"
          >
            {isAdjustingSplit ? 'HIDE CONTROLS' : 'ADJUST RATIOS'}
          </button>

          <button
            type="button"
            onClick={handleApplySplit}
            className={`py-1.5 rounded text-xs font-bold transition-all ${
              isSplitSaved 
                ? 'bg-[#00ff9d] text-[#080b11]' 
                : 'bg-[#ff3366] hover:bg-[#ff1753] active:scale-95 text-white shadow-glow-pink-sm'
            }`}
          >
            {isSplitSaved ? 'SPLIT APPLIED' : 'APPLY SPLIT'}
          </button>
        </div>

      </div>

      {/* Footer Action Links */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <button
          onClick={() => disputeTransaction(tx.id)}
          className="flex items-center gap-1.5 text-[#64748b] hover:text-[#ff3366] transition-colors"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>DISPUTE / FLAG CHARGE</span>
        </button>

        <button
          onClick={handleShareLink}
          className="flex items-center gap-1.5 text-[#64748b] hover:text-[#00f0ff] transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>SHARE RECEIPT LINK</span>
        </button>
      </div>

    </div>
  );
};
