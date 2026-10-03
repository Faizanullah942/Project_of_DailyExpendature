import React, { useState } from 'react';
import { useLedger } from '../../context/LedgerContext';
import { X, Plus, DollarSign } from 'lucide-react';
import { soundFx } from '../../utils/audio';

export const NewCategoryLimitModal: React.FC = () => {
  const { isNewCategoryModalOpen, setIsNewCategoryModalOpen } = useLedger();

  const [name, setName] = useState('');
  const [code, setCode] = useState('OPS_CUSTOM_ALLOC');
  const [budget, setBudget] = useState('1000.00');

  if (!isNewCategoryModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(budget);
    if (!name.trim() || !num || num <= 0) return;

    soundFx.playCommit();
    // Update or add
    setIsNewCategoryModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono animate-fadeIn">
      <div className="bg-[#0c121e] border border-[#202f4a] rounded-lg w-full max-w-md shadow-2xl overflow-hidden">
        
        <div className="flex items-center justify-between px-4 py-3 bg-[#0a0f19] border-b border-[#162136]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
            <span className="text-xs font-bold text-white tracking-wider uppercase font-display">
              REGISTER NEW CATEGORY ENVELOPE
            </span>
          </div>
          <button 
            onClick={() => {
              soundFx.playClick();
              setIsNewCategoryModalOpen(false);
            }}
            className="text-[#64748b] hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-[#64748b] uppercase font-semibold mb-1">ENVELOPE NAME</label>
            <input
              type="text"
              placeholder="e.g. Marketing & Acquisition"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#090e17] border border-[#182338] focus:border-[#00f0ff] rounded px-3 py-2 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#64748b] uppercase font-semibold mb-1">SYSTEM CODE IDENTIFIER</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-[#090e17] border border-[#182338] focus:border-[#00f0ff] rounded px-3 py-2 text-white focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-[#64748b] uppercase font-semibold mb-1">MONTHLY ALLOCATED CAP ($)</label>
            <div className="flex items-center bg-[#090e17] border border-[#182338] focus-within:border-[#00f0ff] rounded px-3 py-2">
              <DollarSign className="w-3.5 h-3.5 text-[#00f0ff] mr-1 shrink-0" />
              <input
                type="number"
                step="50"
                placeholder="1000.00"
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-transparent text-white font-bold font-jetbrains text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded font-bold text-xs tracking-wider uppercase bg-[#ff3366] hover:bg-[#ff1753] text-white shadow-glow-pink flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>COMMIT CATEGORY TO LEDGER</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
