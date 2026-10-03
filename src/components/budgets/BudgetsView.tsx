import React, { useState } from 'react';
import { useLedger } from '../../context/LedgerContext';
import { 
  Plus, 
  Server, 
  Utensils, 
  Box, 
  Car, 
  Lock, 
  Bell, 
  FileText, 
  ArrowRightLeft, 
  Sliders, 
  Users, 
  Code, 
  Coffee, 
  Shield, 
  MoreVertical, 
  Clock, 
  Target, 
  ChevronDown
} from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { getCurrentCycleString } from '../../utils/date';

export const BudgetsView: React.FC = () => {
  const { 
    categoryEnvelopes, 
    updateEnvelopeLimit, 
    recurringCommitments, 
    heuristicRules, 
    toggleRule,
    setIsNewCategoryModalOpen,
    setIsNewSubModalOpen,
    setIsRulesModalOpen
  } = useLedger();

  const [sortBy, setSortBy] = useState<'utilization' | 'alpha' | 'residual'>('utilization');
  const [expandedEnvelopeId, setExpandedEnvelopeId] = useState<string | null>(null);
  const [tempLimit, setTempLimit] = useState<string>('');

  const sortedEnvelopes = [...categoryEnvelopes].sort((a, b) => {
    if (sortBy === 'utilization') return b.percentage - a.percentage;
    if (sortBy === 'alpha') return a.name.localeCompare(b.name);
    return (b.budget - b.spent) - (a.budget - a.spent);
  });

  const getEnvelopeIcon = (name: string) => {
    switch (name) {
      case 'server': return <Server className="w-4 h-4 text-[#ff3366]" />;
      case 'utensils': return <Utensils className="w-4 h-4 text-[#00f0ff]" />;
      case 'box': return <Box className="w-4 h-4 text-[#00ff9d]" />;
      case 'car': return <Car className="w-4 h-4 text-[#00ff9d]" />;
      default: return <Server className="w-4 h-4 text-[#ff3366]" />;
    }
  };

  const getCommitmentIcon = (type: string) => {
    switch (type) {
      case 'users': return <Users className="w-4 h-4 text-[#38bdf8]" />;
      case 'code': return <Code className="w-4 h-4 text-[#f43f5e]" />;
      case 'coffee': return <Coffee className="w-4 h-4 text-[#a855f7]" />;
      case 'shield': return <Shield className="w-4 h-4 text-[#00ff9d]" />;
      default: return <Code className="w-4 h-4 text-[#94a3b8]" />;
    }
  };

  const handleSaveLimit = (id: string) => {
    const num = parseFloat(tempLimit);
    if (num > 0) {
      updateEnvelopeLimit(id, num);
      setTempLimit('');
      setExpandedEnvelopeId(null);
    }
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#162136]">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-[#00f0ff] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
            <span>LEDGER SUBSYSTEM: FISCAL_CAPS_MONITOR</span>
            <span className="text-[#64748b]">[LTC-CYCLE: {getCurrentCycleString()}]</span>
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <h1 className="text-xl font-display font-black text-white tracking-wider">
              BUDGETS & ALLOCATION
            </h1>
            <span className="text-[10px] text-[#64748b]">[SYS_ID: 0x7B9-ALLOC]</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-[11px] text-[#94a3b8]">
            CYCLE RESET: <strong className="text-white">Nov 01</strong> <span className="text-[#00f0ff]">(8d remain)</span>
          </div>

          <button
            onClick={() => setIsNewCategoryModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#ff3366] hover:bg-[#ff1753] active:scale-95 text-white font-bold px-3 py-1.5 rounded shadow-glow-pink transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>NEW CATEGORY LIMIT</span>
          </button>
        </div>
      </div>

      {/* Top Overview Cards (Aggregate Reservoir + Safe Spend Telemetry) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Aggregate Monthly Reservoir (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-[#0c121e] border border-[#1b253b] rounded-md p-4 shadow-card-glow space-y-3">
          
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#7e8fa6] uppercase font-semibold">
                AGGREGATE MONTHLY RESERVOIR
              </span>
              <span className="bg-[#122438] text-[#00f0ff] border border-[#00f0ff]/30 text-[10px] font-bold px-1.5 py-0.2 rounded">
                75.8% CONSUMED
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <div>
                <span className="text-[#64748b]">RESIDUAL DELTA </span>
                <strong className="text-[#00ff9d]">+$2,050.00</strong>
              </div>
              <div>
                <span className="text-[#64748b]">BURN VELOCITY </span>
                <strong className="text-white">1.04x Target</strong>
              </div>
            </div>
          </div>

          {/* Large Main Amount */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-jetbrains">
              $6,450.00
            </span>
            <span className="text-sm text-[#64748b]">
              / $8,500.00 CAP
            </span>
          </div>

          {/* Multi-Segment Gradient Burndown Bar */}
          <div className="space-y-1">
            <div className="w-full bg-[#151f33] h-3.5 rounded overflow-hidden flex">
              {/* Surplus Band (Green) */}
              <div 
                className="h-full bg-gradient-to-r from-[#00ff9d] to-[#10b981] border-r border-[#080b11]"
                style={{ width: '64.7%' }}
                title="Surplus Band: $5,500"
              />
              {/* Burndown Threshold (Cyan) */}
              <div 
                className="h-full bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] border-r border-[#080b11]"
                style={{ width: '11.1%' }}
                title="Burndown Zone: $7,650"
              />
              {/* Alert Zone (Pink) */}
              <div 
                className="h-full bg-gradient-to-r from-[#ff3366] to-[#ff6b8b]"
                style={{ width: '10%' }}
                title="Critical Warning Threshold"
              />
            </div>

            <div className="flex justify-between text-[10px] text-[#64748b] pt-0.5">
              <span>$0.00</span>
              <span className="text-[#00ff9d]">SURPLUS BAND &lt; $5,500</span>
              <span className="text-[#00f0ff]">BURNDOWN THRESHOLD $7,650</span>
              <span>$8,500.00 MAX</span>
            </div>
          </div>

          {/* Bottom projection footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#162136] text-[10px]">
            <div className="flex items-center gap-1.5 text-[#00ff9d]">
              <Shield className="w-3 h-3 text-[#00ff9d]" />
              <span>Optimal burn model intact. Projected cycle close at $8,190.00 (under ceiling).</span>
            </div>
            <div className="flex items-center gap-1 text-[#64748b]">
              <Clock className="w-3 h-3" />
              <span>Refreshed 2m ago</span>
            </div>
          </div>

        </div>

        {/* Right: Safe Spend Telemetry (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-[#0c121e] border border-[#1b253b] rounded-md p-4 shadow-card-glow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] text-[#7e8fa6] mb-1">
              <span className="uppercase font-semibold">SAFE SPEND TELEMETRY</span>
              <Target className="w-3.5 h-3.5 text-[#00f0ff]" />
            </div>
            <div className="text-[10px] text-[#00f0ff] font-bold tracking-wider uppercase">
              DYNAMIC 24H CEILING
            </div>

            <div className="flex items-center justify-between my-2">
              <div>
                <div className="text-3xl font-bold text-white font-jetbrains">
                  $256.25
                </div>
                <div className="text-[10px] text-[#64748b] uppercase tracking-wider mt-0.5">
                  PER DAY / 8 DAYS REMAINING
                </div>
              </div>

              {/* Hex Radar Icon */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12" viewBox="0 0 100 100">
                  <polygon points="50,5 93,27 93,73 50,95 7,73 7,27" fill="none" stroke="#2a3b5c" strokeWidth="4" />
                  <polygon points="50,18 80,33 80,67 50,82 20,67 20,33" fill="none" stroke="#00f0ff" strokeWidth="2" strokeDasharray="3 3" />
                  <circle cx="50" cy="50" r="8" fill="#ff3366" className="animate-pulse" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t border-[#162136]">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#94a3b8]">Allocated Today:</span>
              <span className="text-white font-bold font-jetbrains">$94.50</span>
            </div>
            <div className="w-full bg-[#151f33] h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] rounded-full w-[36.8%]" />
            </div>
            <div className="text-right text-[9px] text-[#00ff9d]">
              $161.75 headroom remaining
            </div>
          </div>
        </div>

      </div>

      {/* Category Envelopes & Limits Section */}
      <div className="space-y-3">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-[#00f0ff]">❖</span>
            <span className="text-xs font-bold text-white tracking-wider">
              CATEGORY ENVELOPES & LIMITS
            </span>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-[#64748b]">SORT BY:</span>
            <button
              onClick={() => {
                soundFx.playClick();
                setSortBy('utilization');
              }}
              className={`px-2 py-0.5 rounded transition-colors ${
                sortBy === 'utilization' ? 'bg-[#15233c] text-white font-bold' : 'text-[#64748b] hover:text-[#94a3b8]'
              }`}
            >
              Highest Utilization
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setSortBy('alpha');
              }}
              className={`px-2 py-0.5 rounded transition-colors ${
                sortBy === 'alpha' ? 'bg-[#15233c] text-white font-bold' : 'text-[#64748b] hover:text-[#94a3b8]'
              }`}
            >
              Alpha
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setSortBy('residual');
              }}
              className={`px-2 py-0.5 rounded transition-colors ${
                sortBy === 'residual' ? 'bg-[#15233c] text-white font-bold' : 'text-[#64748b] hover:text-[#94a3b8]'
              }`}
            >
              Residual
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {sortedEnvelopes.map((env) => {
            const isBurnt = env.percentage >= 90;
            const isMedium = env.percentage >= 75 && env.percentage < 90;
            const isExpanded = expandedEnvelopeId === env.id;

            return (
              <div 
                key={env.id}
                className={`bg-[#0c121e] border rounded-md p-3.5 shadow-card-glow transition-all flex flex-col justify-between ${
                  isBurnt 
                    ? 'border-[#ff3366]/40 hover:border-[#ff3366]' 
                    : isMedium 
                    ? 'border-[#00f0ff]/30 hover:border-[#00f0ff]' 
                    : 'border-[#1b253b] hover:border-[#2a3b5c]'
                }`}
              >
                <div>
                  {/* Top: Icon + Name + Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-[#101828] border border-[#1a273f] flex items-center justify-center shrink-0">
                        {getEnvelopeIcon(env.iconName)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white leading-tight">
                          {env.name}
                        </div>
                        <div className="text-[9px] text-[#64748b] font-mono">
                          {env.code}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                      env.statusBadgeColor === 'red' ? 'bg-[#4a1525] text-[#ff3366] border border-[#ff3366]/40' :
                      env.statusBadgeColor === 'cyan' ? 'bg-[#122438] text-[#00f0ff] border border-[#00f0ff]/40' :
                      'bg-[#0d3829] text-[#00ff9d] border border-[#00ff9d]/40'
                    }`}>
                      {env.statusBadge}
                    </span>
                  </div>

                  {/* Amount & Budget */}
                  <div className="my-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-white font-jetbrains">
                        ${env.spent.toFixed(2)}
                      </span>
                      <span className="text-xs text-[#64748b]">
                        / ${env.budget.toFixed(2)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#151f33] h-1.5 rounded-full overflow-hidden my-2">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isBurnt 
                            ? 'bg-gradient-to-r from-[#ff3366] to-[#ff6b8b] shadow-glow-pink-sm' 
                            : isMedium 
                            ? 'bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] shadow-glow-cyan-sm' 
                            : 'bg-gradient-to-r from-[#00ff9d] to-[#10b981]'
                        }`}
                        style={{ width: `${Math.min(100, env.percentage)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className={isBurnt ? 'text-[#ff3366] font-semibold' : 'text-[#00ff9d]'}>
                        {env.subtextLeft}
                      </span>
                      <span className="text-[#64748b]">
                        {env.subtextRight}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Adjust Parameters Drawer */}
                {isExpanded && (
                  <div className="pt-2.5 pb-1 border-t border-[#162136] space-y-2 mt-2">
                    <div className="text-[10px] text-[#94a3b8] font-bold">
                      Edit Envelope Limit:
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input 
                        type="number"
                        placeholder={String(env.budget)}
                        value={tempLimit}
                        onChange={(e) => setTempLimit(e.target.value)}
                        className="w-full bg-[#090e17] border border-[#182338] text-white px-2 py-1 rounded text-xs"
                      />
                      <button 
                        onClick={() => handleSaveLimit(env.id)}
                        className="bg-[#00f0ff] hover:bg-[#00d2df] text-[#080b11] px-2 py-1 rounded font-bold text-xs"
                      >
                        SET
                      </button>
                    </div>
                  </div>
                )}

                {/* Bottom Footer Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-[#162136] text-[10px] text-[#64748b] mt-2">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setExpandedEnvelopeId(isExpanded ? null : env.id);
                      setTempLimit(String(env.budget));
                    }}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>ADJUST PARAMETERS</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {env.id === 'env-1' && <Lock className="w-3 h-3 text-[#ff3366]" />}
                    {env.id === 'env-2' && <Bell className="w-3 h-3 text-[#00f0ff]" />}
                    {env.id === 'env-3' && <FileText className="w-3 h-3 text-[#00ff9d]" />}
                    {env.id === 'env-4' && <ArrowRightLeft className="w-3 h-3 text-[#00ff9d]" />}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Bottom Section: Scheduled Commitments + Heuristic Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1">
        
        {/* Left: Scheduled & Recurring Commitments (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-[#0c121e] border border-[#1b253b] rounded-md p-4 shadow-card-glow space-y-3">
          
          <div className="flex items-center justify-between pb-2 border-b border-[#162136]">
            <div className="flex items-center gap-2">
              <span className="text-[#00f0ff]">📅</span>
              <span className="text-xs font-bold text-white tracking-wider uppercase">
                SCHEDULED & RECURRING COMMITMENTS
              </span>
            </div>
            <span className="text-[10px] text-[#00ff9d] bg-[#0c2a1e] border border-[#00ff9d]/30 px-1.5 py-0.2 rounded font-semibold">
              AUTO_EXEC: 6 DISPATCHES ACTIVE
            </span>
          </div>

          <div className="space-y-2">
            {recurringCommitments.map((com) => (
              <div 
                key={com.id}
                className="flex items-center justify-between p-2.5 rounded bg-[#090e17] hover:bg-[#101828] border border-[#151f33] hover:border-[#22334e] transition-colors"
              >
                {/* Left: Icon + Title + Meta */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded bg-[#101828] border border-[#1a273f] flex items-center justify-center shrink-0">
                    {getCommitmentIcon(com.iconType)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">
                        {com.title}
                      </span>
                      <span className="bg-[#121c2e] text-[#64748b] text-[9px] px-1 py-0.2 rounded border border-[#1a263c]">
                        {com.recurrenceTag}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#64748b] mt-0.5 truncate">
                      {com.scheduleText}
                    </div>
                  </div>
                </div>

                {/* Right: Amount + Status Tag + More */}
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <div className="text-right">
                    <div className="text-xs font-bold text-white font-jetbrains">
                      ${com.amount.toFixed(2)}
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 inline-block ${
                      com.statusColor === 'green' ? 'bg-[#0d3829] text-[#00ff9d] border border-[#00ff9d]/30' :
                      com.statusColor === 'cyan' ? 'bg-[#122438] text-[#00f0ff] border border-[#00f0ff]/30' :
                      'bg-[#4a1525] text-[#ff3366]'
                    }`}>
                      {com.statusTag}
                    </span>
                  </div>

                  <button className="text-[#64748b] hover:text-white p-1">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#162136] text-xs">
            <button
              onClick={() => setIsNewSubModalOpen(true)}
              className="text-[#00f0ff] hover:text-white flex items-center gap-1 font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>REGISTER AUTOMATED SUBSCRIPTION</span>
            </button>
            <span className="text-[#94a3b8]">
              Monthly Recurring Total: <strong className="text-white font-jetbrains">$1,248.29</strong>
            </span>
          </div>

        </div>

        {/* Right: Heuristic Rules (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-[#0c121e] border border-[#1b253b] rounded-md p-4 shadow-card-glow flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#162136]">
              <span className="text-xs font-bold text-white tracking-wider uppercase">
                HEURISTIC RULES
              </span>
              <span className="text-[10px] text-[#00f0ff] bg-[#122438] px-1.5 py-0.2 rounded border border-[#00f0ff]/30 font-semibold">
                ACTIVE ENGINE
              </span>
            </div>

            <div className="my-2.5">
              <h3 className="text-sm font-bold text-white">Auto-Cap Escalations</h3>
              <p className="text-[10px] text-[#94a3b8] mt-1 leading-relaxed">
                Chronos auto-throttles downstream debit cards when an allocation hits 95% threshold to safeguard aggregate reserves.
              </p>
            </div>

            {/* Rules items */}
            <div className="space-y-2 mt-3">
              {heuristicRules.map(rule => (
                <div 
                  key={rule.id}
                  onClick={() => toggleRule(rule.id)}
                  className={`p-2.5 rounded border transition-all cursor-pointer ${
                    rule.isEnabled 
                      ? 'bg-[#090f19] border-[#1f304d]' 
                      : 'bg-[#090d15] border-[#141c2c] opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      {rule.icon === 'lock' ? <Lock className="w-3 h-3 text-[#ff3366]" /> : <ArrowRightLeft className="w-3 h-3 text-[#00ff9d]" />}
                      <span>{rule.title}</span>
                    </div>
                    <span className={`text-[9px] font-bold px-1 rounded ${
                      rule.isEnabled ? 'text-[#00ff9d] bg-[#0c2a1e]' : 'text-[#64748b] bg-[#141a26]'
                    }`}>
                      {rule.isEnabled ? 'ENABLED' : 'PAUSED'}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#64748b] leading-tight">
                    {rule.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#162136] text-[11px]">
            <span className="text-[#64748b]">
              Smart Rules: <strong className="text-[#00ff9d]">4 of 6 ON</strong>
            </span>
            <button
              onClick={() => setIsRulesModalOpen(true)}
              className="text-[#00f0ff] hover:text-white font-semibold transition-colors"
            >
              CONFIGURE RULES
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
