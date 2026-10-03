import React from 'react';
import { useLedger } from '../../context/LedgerContext';
import { X, ShieldCheck, Lock, ArrowRightLeft, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../../utils/audio';

export const ConfigureRulesModal: React.FC = () => {
  const { isRulesModalOpen, setIsRulesModalOpen, heuristicRules, toggleRule } = useLedger();

  if (!isRulesModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono animate-fadeIn">
      <div className="bg-[#0c121e] border border-[#202f4a] rounded-lg w-full max-w-lg shadow-2xl overflow-hidden">
        
        <div className="flex items-center justify-between px-4 py-3 bg-[#0a0f19] border-b border-[#162136]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00f0ff]" />
            <span className="text-xs font-bold text-white tracking-wider uppercase font-display">
              HEURISTIC ENGINE ENGINE RULES & THRESHOLDS
            </span>
          </div>
          <button 
            onClick={() => {
              soundFx.playClick();
              setIsRulesModalOpen(false);
            }}
            className="text-[#64748b] hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3.5 text-xs">
          <p className="text-[#94a3b8] text-[11px] leading-relaxed">
            Configure automated guardrails, risk throttles, and surplus reallocation rules across your liquid envelopes.
          </p>

          <div className="space-y-2.5">
            {heuristicRules.map((rule) => (
              <div 
                key={rule.id}
                onClick={() => toggleRule(rule.id)}
                className={`p-3 rounded border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  rule.isEnabled 
                    ? 'bg-[#0e1726] border-[#00f0ff]/40 shadow-glow-cyan-sm' 
                    : 'bg-[#090d15] border-[#162136] opacity-60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-white">
                    {rule.icon === 'lock' ? <Lock className="w-3.5 h-3.5 text-[#ff3366]" /> : <ArrowRightLeft className="w-3.5 h-3.5 text-[#00ff9d]" />}
                    <span>{rule.title}</span>
                  </div>
                  <p className="text-[10px] text-[#94a3b8] leading-normal">
                    {rule.description}
                  </p>
                </div>

                <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                  rule.isEnabled ? 'bg-[#00f0ff] text-[#080b11] border-[#00f0ff]' : 'border-[#22334e]'
                }`}>
                  {rule.isEnabled && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                soundFx.playCommit();
                setIsRulesModalOpen(false);
              }}
              className="w-full py-2 rounded bg-[#10192a] hover:bg-[#18263e] border border-[#202f4a] hover:border-[#00f0ff] text-white font-bold text-xs"
            >
              APPLY & SYNC ENGINE
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
