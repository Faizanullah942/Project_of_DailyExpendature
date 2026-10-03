import React, { useState } from 'react';
import { useLedger } from '../../context/LedgerContext';
import { X, Plus, DollarSign } from 'lucide-react';
import { soundFx } from '../../utils/audio';

export const RegisterSubscriptionModal: React.FC = () => {
  const { isNewSubModalOpen, setIsNewSubModalOpen, addRecurringCommitment } = useLedger();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [recurrence, setRecurrence] = useState<'RECUR_MONTHLY' | 'DAILY_CRON' | 'ANNUAL_INSTALLMENT'>('RECUR_MONTHLY');
  const [source, setSource] = useState('Treasury Main [USD]');

  if (!isNewSubModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!title.trim() || !num || num <= 0) return;

    soundFx.playCommit();
    addRecurringCommitment({
      title: title.trim(),
      recurrenceTag: recurrence,
      scheduleText: `EXEC: 1st of month • 00:00 UTC • SRC: ${source}`,
      amount: num,
      statusTag: 'SCHEDULED',
      statusColor: 'cyan',
      iconType: 'code',
      isActive: true
    });

    setIsNewSubModalOpen(false);
    setTitle('');
    setAmount('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono animate-fadeIn">
      <div className="bg-[#0c121e] border border-[#202f4a] rounded-lg w-full max-w-md shadow-2xl overflow-hidden">
        
        <div className="flex items-center justify-between px-4 py-3 bg-[#0a0f19] border-b border-[#162136]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff9d]" />
            <span className="text-xs font-bold text-white tracking-wider uppercase font-display">
              REGISTER AUTOMATED DISPATCH / RECURRING
            </span>
          </div>
          <button 
            onClick={() => {
              soundFx.playClick();
              setIsNewSubModalOpen(false);
            }}
            className="text-[#64748b] hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-[#64748b] uppercase font-semibold mb-1">SERVICE / ENTITY TITLE</label>
            <input
              type="text"
              placeholder="e.g. OpenAI Enterprise API"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#090e17] border border-[#182338] focus:border-[#00f0ff] rounded px-3 py-2 text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#64748b] uppercase font-semibold mb-1">RECURRENCE CYCLE</label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as any)}
                className="w-full bg-[#090e17] border border-[#182338] rounded px-3 py-2 text-white focus:outline-none"
              >
                <option value="RECUR_MONTHLY">Monthly</option>
                <option value="DAILY_CRON">Daily Cron</option>
                <option value="ANNUAL_INSTALLMENT">Annual Installment</option>
              </select>
            </div>

            <div>
              <label className="block text-[#64748b] uppercase font-semibold mb-1">RECURRING AMOUNT ($)</label>
              <div className="flex items-center bg-[#090e17] border border-[#182338] focus-within:border-[#00ff9d] rounded px-3 py-2">
                <DollarSign className="w-3.5 h-3.5 text-[#00ff9d] mr-1 shrink-0" />
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
          </div>

          <div>
            <label className="block text-[#64748b] uppercase font-semibold mb-1">SETTLEMENT SOURCE</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-[#090e17] border border-[#182338] rounded px-3 py-2 text-white focus:outline-none"
            >
              <option value="Treasury Main [USD]">Treasury Main [USD]</option>
              <option value="Corporate Operating [USD]">Corporate Operating [USD]</option>
              <option value="Petty Cash Buffer">Petty Cash Buffer</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded font-bold text-xs tracking-wider uppercase bg-[#00ff9d] hover:bg-[#00d2df] text-[#080b11] shadow-glow-green flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>QUEUE AUTOMATED RECURRING COMMITMENT</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
