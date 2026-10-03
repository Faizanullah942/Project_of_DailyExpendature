import React, { useState } from 'react';
import { useLedger } from '../../context/LedgerContext';
import { X, Send, Upload, DollarSign, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../utils/audio';
import { getUtcTimeOnly, getUtcDateOnly } from '../../utils/date';

export const RecordExpenseModal: React.FC = () => {
  const { isExpenseModalOpen, setIsExpenseModalOpen, addTransaction } = useLedger();

  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('Infrastructure');
  const [account, setAccount] = useState('Mercury #9824');
  const [tags, setTags] = useState('#ops #prod');
  const [receiptName, setReceiptName] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isExpenseModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0 || !merchant.trim()) {
      soundFx.playBeep(300, 0.1, 'sawtooth');
      return;
    }

    const tagArray = tags.split(' ').filter(t => t.startsWith('#'));
    const now = new Date();

    addTransaction({
      timestamp: getUtcTimeOnly(now),
      fullDate: getUtcDateOnly(now),
      merchant: merchant.trim(),
      category: category,
      amount: num,
      type: 'debit',
      account: account,
      tags: tagArray.length > 0 ? tagArray : ['#disbursement'],
      isReceiptAttached: Boolean(receiptName)
    });

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#ff3366', '#00f0ff', '#00ff9d']
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsExpenseModalOpen(false);
      setAmount('');
      setMerchant('');
      setReceiptName(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono animate-fadeIn">
      <div className="bg-[#0c121e] border border-[#202f4a] rounded-lg w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0a0f19] border-b border-[#162136]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff3366] animate-pulse" />
            <span className="text-sm font-bold text-white tracking-wider uppercase font-display">
              DISBURSEMENT ENTRY PROTOCOL
            </span>
          </div>
          <button 
            onClick={() => {
              soundFx.playClick();
              setIsExpenseModalOpen(false);
            }}
            className="text-[#64748b] hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#64748b] uppercase font-semibold mb-1">AMOUNT (USD)</label>
              <div className="flex items-center bg-[#090e17] border border-[#182338] focus-within:border-[#ff3366] rounded px-3 py-2">
                <DollarSign className="w-3.5 h-3.5 text-[#ff3366] mr-1 shrink-0" />
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent text-white font-bold font-jetbrains text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#64748b] uppercase font-semibold mb-1">MERCHANT / ENTITY</label>
              <input
                type="text"
                placeholder="e.g. AWS, Stripe, Uber"
                required
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full bg-[#090e17] border border-[#182338] focus:border-[#00f0ff] rounded px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#64748b] uppercase font-semibold mb-1">CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#090e17] border border-[#182338] rounded px-3 py-2 text-white focus:outline-none"
              >
                <option value="Infrastructure">Infrastructure</option>
                <option value="SaaS Subscriptions">SaaS Subscriptions</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Engineering">Engineering</option>
                <option value="Transit & Travel">Transit & Travel</option>
              </select>
            </div>

            <div>
              <label className="block text-[#64748b] uppercase font-semibold mb-1">SETTLEMENT INSTRUMENT</label>
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full bg-[#090e17] border border-[#182338] rounded px-3 py-2 text-white focus:outline-none"
              >
                <option value="Mercury #9824">Mercury #9824</option>
                <option value="CORP VISA • 4092">CORP VISA • 4092</option>
                <option value="Amex #7743">Amex #7743</option>
                <option value="CASH RESERVE">CASH RESERVE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#64748b] uppercase font-semibold mb-1">TAGS & NOTES</label>
            <input
              type="text"
              placeholder="#project #client #monthly"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-[#090e17] border border-[#182338] focus:border-[#00f0ff] rounded px-3 py-2 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#64748b] uppercase font-semibold mb-1">ATTACH RECEIPT / INVOICE</label>
            <label className="flex items-center justify-between bg-[#090e17] hover:bg-[#101828] border border-dashed border-[#1e2e47] rounded px-3 py-2 cursor-pointer transition-colors">
              <input 
                type="file" 
                className="hidden" 
                onChange={(e) => e.target.files?.[0] && setReceiptName(e.target.files[0].name)}
              />
              <span className="text-xs text-[#94a3b8] truncate">
                {receiptName || 'Drop optical document or browse (PNG, PDF)'}
              </span>
              <Upload className="w-3.5 h-3.5 text-[#00f0ff]" />
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSuccess}
              className={`w-full py-2.5 rounded font-bold text-sm tracking-wider uppercase transition-all shadow-glow-pink flex items-center justify-center gap-2 ${
                isSuccess 
                  ? 'bg-[#00ff9d] text-[#080b11]' 
                  : 'bg-gradient-to-r from-[#ff3366] to-[#ff1753] hover:brightness-110 text-white'
              }`}
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>TRANSACTION RECORDED</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 -rotate-45" />
                  <span>BROADCAST DISBURSEMENT</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
