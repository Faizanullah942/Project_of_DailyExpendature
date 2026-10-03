import React from 'react';
import { useLedger } from '../../context/LedgerContext';
import { TrendingDown, Zap, Shield, AlertOctagon } from 'lucide-react';

export const TelemetryCards: React.FC = () => {
  const { dailyDelta, dailyMax, cumulativeMtd, velocityHourly, safeRemainder } = useLedger();

  const deltaPercentage = ((dailyDelta / dailyMax) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5 font-mono">
      
      {/* Card 1: Daily Delta */}
      <div className="bg-[#0c121e] border border-[#1b253b] hover:border-[#ff3366]/60 rounded-md p-3.5 shadow-card-glow transition-all group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-[#7e8fa6] tracking-wider uppercase font-semibold">
            TELEMETRY • DAILY DELTA
          </span>
          <span className="bg-[#4a1525] border border-[#ff3366]/40 text-[#ff3366] text-[10px] font-bold px-1.5 py-0.2 rounded">
            {deltaPercentage}%
          </span>
        </div>
        
        <div className="flex items-baseline gap-1.5 my-1">
          <span className="text-2xl lg:text-3xl font-bold text-white tracking-tight font-jetbrains">
            ${dailyDelta.toFixed(2)}
          </span>
          <span className="text-xs text-[#64748b]">
            / ${dailyMax.toFixed(2)} Max
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#151f33] h-1.5 rounded-full overflow-hidden my-2.5">
          <div 
            className="h-full bg-gradient-to-r from-[#ff3366] to-[#ff6b8b] rounded-full shadow-glow-pink-sm transition-all duration-500"
            style={{ width: `${Math.min(100, Number(deltaPercentage))}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#162136]">
          <span className="text-[#64748b]">BURNDOWN TARGET</span>
          <span className="text-[#ff3366] font-bold tracking-wider flex items-center gap-1">
            <AlertOctagon className="w-2.5 h-2.5" />
            WARNING ZONE
          </span>
        </div>
      </div>

      {/* Card 2: Cumulative MTD */}
      <div className="bg-[#0c121e] border border-[#1b253b] hover:border-[#00f0ff]/60 rounded-md p-3.5 shadow-card-glow transition-all group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-[#7e8fa6] tracking-wider uppercase font-semibold">
            CUMULATIVE MTD
          </span>
          <div className="text-[#00f0ff]">
            <TrendingDown className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 my-1">
          <span className="text-2xl lg:text-3xl font-bold text-white tracking-tight font-jetbrains">
            ${cumulativeMtd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-[#00ff9d] font-semibold flex items-center">
            ↓ 4.2%
          </span>
        </div>

        <div className="w-full bg-[#151f33] h-1.5 rounded-full overflow-hidden my-2.5">
          <div className="h-full bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] rounded-full shadow-glow-cyan-sm w-[48%]" />
        </div>

        <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#162136]">
          <span className="text-[#00f0ff] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
            PACE: $91.60/DAY EXP. RUN-RATE
          </span>
        </div>
      </div>

      {/* Card 3: Velocity Frequency */}
      <div className="bg-[#0c121e] border border-[#1b253b] hover:border-[#00ff9d]/60 rounded-md p-3.5 shadow-card-glow transition-all group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-[#7e8fa6] tracking-wider uppercase font-semibold">
            VELOCITY FREQUENCY
          </span>
          <div className="text-[#00ff9d]">
            <Zap className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 my-1">
          <span className="text-2xl lg:text-3xl font-bold text-white tracking-tight font-jetbrains">
            ${velocityHourly.toFixed(2)}
          </span>
          <span className="text-xs text-[#64748b]">
            / hr awake
          </span>
        </div>

        <div className="w-full bg-[#151f33] h-1.5 rounded-full overflow-hidden my-2.5">
          <div className="h-full bg-gradient-to-r from-[#00ff9d] to-[#10b981] rounded-full shadow-glow-green w-[62%]" />
        </div>

        <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#162136]">
          <span className="text-[#00ff9d] font-semibold">NODE STABLE</span>
          <span className="text-[#94a3b8]">9.2 HRS ACTIVE</span>
        </div>
      </div>

      {/* Card 4: Safe Remainder */}
      <div className="bg-[#0c121e] border border-[#1b253b] hover:border-[#38bdf8]/60 rounded-md p-3.5 shadow-card-glow transition-all group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-[#7e8fa6] tracking-wider uppercase font-semibold">
            SAFE REMAINDER
          </span>
          <div className="text-[#38bdf8]">
            <Shield className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 my-1">
          <span className="text-2xl lg:text-3xl font-bold text-white tracking-tight font-jetbrains">
            ${safeRemainder.toFixed(2)}
          </span>
          <span className="text-xs text-[#94a3b8]">
            Available
          </span>
        </div>

        <div className="w-full bg-[#151f33] h-1.5 rounded-full overflow-hidden my-2.5">
          <div 
            className="h-full bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] rounded-full w-[26.2%]"
          />
        </div>

        <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#162136]">
          <span className="text-[#64748b]">CEILING: $250.00</span>
          <span className="text-[#94a3b8]">REFRESH @ 00:00</span>
        </div>
      </div>

    </div>
  );
};
