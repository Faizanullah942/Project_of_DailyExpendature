import React, { useState } from 'react';
import { useLedger } from '../../context/LedgerContext';
import { 
  Clock, 
  ChevronDown, 
  Landmark, 
  Paperclip, 
  Upload, 
  Send, 
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../utils/audio';
import { getUtcTimeOnly, getUtcDateOnly } from '../../utils/date';

export const FastTelemetryLogger: React.FC = () => {
  const { addTransaction, safeRemainder, currentUtcTime } = useLedger();

  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('Dining & Provisioning');
  const [instrument, setInstrument] = useState<string>('Corporate Visa •••• 4092 [Main Liquidity]');
  const [merchantNotes, setMerchantNotes] = useState<string>('');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const categories = [
    { label: '🍱 Dining & Provisioning ($161.50 Remaining)', value: 'Dining & Provisioning', spentPct: 64 },
    { label: '☁️ Cloud Infrastructure ($80.00 Remaining)', value: 'Cloud Infrastructure', spentPct: 94 },
    { label: '🛠 SaaS & Tooling ($150.00 Remaining)', value: 'SaaS Subscriptions', spentPct: 75 },
    { label: '🚆 Transit & Commute ($290.00 Remaining)', value: 'Transit & Travel', spentPct: 42 },
  ];

  const instruments = [
    '💳 Corporate Visa •••• 4092 [Main Liquidity]',
    '🏛 Mercury Operating Vault #9824',
    '💳 American Express Corporate #7743',
    '💵 Petty Cash Reserve'
  ];

  const autoTags = ['#lunch', '#client', '#aws', '#ops'];

  const handleQuickAdd = (value: number) => {
    soundFx.playClick();
    const current = parseFloat(amount) || 0;
    setAmount((current + value).toFixed(2));
  };

  const handleSetNow = () => {
    soundFx.playClick();
  };

  const handleAddTag = (tag: string) => {
    soundFx.playClick();
    if (!merchantNotes.includes(tag)) {
      setMerchantNotes(prev => prev ? `${prev} ${tag}` : tag);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      soundFx.playBeep(1000, 0.05);
      setAttachedFile(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      soundFx.playBeep(300, 0.1, 'sawtooth');
      return;
    }

    // Extract tags from merchant notes
    const extractedTags = merchantNotes.match(/#[a-zA-Z0-9_-]+/g) || ['#expense'];
    const cleanMerchant = merchantNotes.replace(/#[a-zA-Z0-9_-]+/g, '').trim() || 'Fast Disbursement';
    const now = new Date();

    addTransaction({
      timestamp: getUtcTimeOnly(now),
      fullDate: getUtcDateOnly(now),
      merchant: cleanMerchant,
      category: category,
      amount: numAmount,
      type: 'debit',
      account: instrument.includes('Visa') ? 'CORP VISA • 4092' : (instrument.includes('Mercury') ? 'Mercury #9824' : 'CORP AMEX'),
      tags: extractedTags,
      isReceiptAttached: Boolean(attachedFile)
    });

    // Fire glowing confetti
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ff3366', '#00f0ff', '#00ff9d']
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setAmount('');
      setMerchantNotes('');
      setAttachedFile(null);
    }, 1800);
  };

  const selectedCategoryObj = categories.find(c => c.value === category) || categories[0];

  return (
    <div className="bg-[#0c121e] border border-[#1b253b] rounded-md p-4 shadow-card-glow font-mono relative">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-[#162136]">
        <div>
          <h2 className="text-base font-display font-black tracking-wider text-white">
            FAST TELEMETRY LOGGER
          </h2>
          <div className="text-[10px] text-[#64748b] tracking-wider uppercase font-semibold flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
            INSTANT DISBURSEMENT TRANSMITTER
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-glow-cyan-sm animate-ping" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        
        {/* Timestamp */}
        <div>
          <div className="flex items-center justify-between text-[10px] text-[#64748b] mb-1">
            <span className="uppercase font-semibold">TIMESTAMP</span>
            <button 
              type="button" 
              onClick={handleSetNow}
              className="text-[#00f0ff] hover:text-white flex items-center gap-1 transition-colors"
            >
              <Clock className="w-3 h-3" />
              <span>SET_NOW</span>
            </button>
          </div>
          <div className="flex items-center gap-2 bg-[#090e17] border border-[#182338] rounded px-3 py-1.5 text-xs text-[#94a3b8]">
            <Clock className="w-3.5 h-3.5 text-[#64748b]" />
            <span>{currentUtcTime}</span>
          </div>
        </div>

        {/* Amount */}
        <div>
          <div className="flex items-center justify-between text-[10px] text-[#64748b] mb-1">
            <span className="uppercase font-semibold">AMOUNT</span>
            <span className="text-[#94a3b8]">
              BAL._AVAILABLE: <strong className="text-white">${safeRemainder.toFixed(2)}</strong>
            </span>
          </div>
          
          <div className="flex items-center bg-[#090e17] border border-[#182338] focus-within:border-[#ff3366] rounded overflow-hidden transition-colors">
            <div className="bg-[#121c2e] px-3 py-2 text-xs font-bold text-[#00f0ff] border-r border-[#182338] shrink-0">
              USD ($)
            </div>
            <input 
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent px-3 py-2 text-xl font-bold text-white font-jetbrains focus:outline-none placeholder-[#334155]"
            />
          </div>

          {/* Quick Add Pills */}
          <div className="grid grid-cols-4 gap-1.5 mt-2">
            {[10, 25, 50, 100].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAdd(val)}
                className="bg-[#101828] hover:bg-[#18263e] active:scale-95 text-[#94a3b8] hover:text-[#00f0ff] border border-[#1a273f] hover:border-[#00f0ff]/40 py-1 rounded text-xs transition-all font-semibold"
              >
                + ${val}
              </button>
            ))}
          </div>
        </div>

        {/* Disbursement Category */}
        <div>
          <div className="text-[10px] text-[#64748b] uppercase font-semibold mb-1">
            DISBURSEMENT CATEGORY
          </div>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => {
                soundFx.playClick();
                setCategory(e.target.value);
              }}
              className="w-full bg-[#090e17] border border-[#182338] hover:border-[#2a3b5c] text-white text-xs rounded px-3 py-2 appearance-none focus:outline-none focus:border-[#00f0ff] cursor-pointer"
            >
              {categories.map((c, i) => (
                <option key={i} value={c.value} className="bg-[#0d131f] text-white">
                  {c.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Category Progress Bar */}
          <div className="mt-2">
            <div className="w-full bg-[#151f33] h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] rounded-full transition-all duration-300"
                style={{ width: `${selectedCategoryObj.spentPct}%` }}
              />
            </div>
            <div className="flex justify-end text-[9px] text-[#64748b] mt-1">
              {selectedCategoryObj.spentPct}% SPENT
            </div>
          </div>
        </div>

        {/* Sourced Financial Instrument */}
        <div>
          <div className="text-[10px] text-[#64748b] uppercase font-semibold mb-1">
            SOURCED FINANCIAL INSTRUMENT
          </div>
          <div className="relative">
            <select
              value={instrument}
              onChange={(e) => {
                soundFx.playClick();
                setInstrument(e.target.value);
              }}
              className="w-full bg-[#090e17] border border-[#182338] hover:border-[#2a3b5c] text-white text-xs rounded pl-3 pr-8 py-2 appearance-none focus:outline-none focus:border-[#00f0ff] cursor-pointer truncate"
            >
              {instruments.map((inst, i) => (
                <option key={i} value={inst} className="bg-[#0d131f] text-white">
                  {inst}
                </option>
              ))}
            </select>
            <Landmark className="w-3.5 h-3.5 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Merchant Reference & Notes */}
        <div>
          <div className="flex items-center justify-between text-[10px] text-[#64748b] mb-1">
            <span className="uppercase font-semibold">MERCHANT REFERENCE & NOTES</span>
            <span className="text-[#00ff9d] text-[9px] font-semibold">PARSER ACTIVE</span>
          </div>
          <input
            type="text"
            placeholder="e.g. Blue Bottle Cafe #lunch #client"
            value={merchantNotes}
            onChange={(e) => setMerchantNotes(e.target.value)}
            className="w-full bg-[#090e17] border border-[#182338] focus:border-[#ff3366] text-white text-xs rounded px-3 py-2 focus:outline-none placeholder-[#334155]"
          />
          <div className="flex items-center gap-1.5 text-[9px] text-[#64748b] mt-1.5 flex-wrap">
            <span>AUTO-TAGS:</span>
            {autoTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                className="hover:text-[#00f0ff] bg-[#101828] px-1 py-0.5 rounded border border-[#18253a] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Attach Optical Receipt (OCR) */}
        <div>
          <label className="block text-[10px] text-[#64748b] uppercase font-semibold mb-1">
            Attach Optical Receipt (OCR)
          </label>
          <label className="flex items-center justify-between bg-[#090e17] hover:bg-[#101828] border border-dashed border-[#1e2e47] hover:border-[#00f0ff]/50 rounded px-3 py-2 cursor-pointer transition-colors group">
            <input 
              type="file" 
              className="hidden" 
              accept=".jpg,.jpeg,.png,.pdf" 
              onChange={handleFileUpload}
            />
            <div className="flex items-center gap-2 text-xs text-[#94a3b8] truncate">
              <Paperclip className="w-3.5 h-3.5 text-[#64748b] group-hover:text-[#00f0ff]" />
              <span className="truncate">
                {attachedFile || 'JPG, PNG, PDF UP TO 10MB'}
              </span>
            </div>
            <Upload className="w-3.5 h-3.5 text-[#64748b] group-hover:text-white shrink-0 ml-2" />
          </label>
        </div>

        {/* Commit Button */}
        <button
          type="submit"
          disabled={isSuccess}
          className={`w-full py-2.5 px-4 rounded font-display font-bold text-sm tracking-wider uppercase transition-all shadow-glow-pink flex items-center justify-center gap-2 ${
            isSuccess 
              ? 'bg-[#00ff9d] text-[#080b11] shadow-glow-green' 
              : 'bg-gradient-to-r from-[#ff3366] via-[#ff4d79] to-[#ff1753] hover:brightness-110 active:scale-[0.98] text-white'
          }`}
        >
          {isSuccess ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>TRANSACTION COMMITTED TO LEDGER</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 -rotate-45" />
              <span>COMMIT & LOG TRANSACTION</span>
            </>
          )}
        </button>

        {/* Encryption & Pipeline Status */}
        <div className="flex items-center justify-between text-[9px] text-[#64748b] pt-1">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse" />
            <span>ENCRYPTION: AES-256 GCM</span>
          </div>
          <span className="text-[#94a3b8]">TX_PIPELINE #READY</span>
        </div>

      </form>

    </div>
  );
};
