import React, { useState } from 'react';
import { useLedger } from '../../context/LedgerContext';
import { 
  TrendingDown, 
  TrendingUp, 
  Download, 
  ChevronDown, 
  RefreshCw, 
  Radio, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck
} from 'lucide-react';
import { soundFx } from '../../utils/audio';

export const AnalyticsView: React.FC = () => {
  const { 
    setSelectedTransaction, 
    transactions, 
    setActiveTab, 
    deprecateDormantSubs, 
    areSubsDeprecated,
    setIsExportModalOpen
  } = useLedger();

  const [timeframe, setTimeframe] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YTD'>('DAILY');

  const timeframes: ('DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YTD')[] = [
    'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YTD'
  ];

  const categoryDonutData = [
    { name: 'Cloud Infrastructure', amount: 16305.80, percentage: 38, color: '#00f0ff' },
    { name: 'Dining & Operations', amount: 10298.40, percentage: 24, color: '#ff3366' },
    { name: 'Hardware & Systems', amount: 7723.80, percentage: 18, color: '#00ff9d' },
    { name: 'Logistics & Courier', amount: 5149.20, percentage: 12, color: '#38bdf8' },
    { name: 'Misc Deprecations', amount: 3432.80, percentage: 8, color: '#e11d48' },
  ];

  // Heatmap table matrix
  const heatmapData = [
    {
      slot: '00:00 - 06:00',
      days: [
        { day: 'MON', amount: 42, count: 1, intensity: 'low' },
        { day: 'TUE', amount: 12, count: 1, intensity: 'low' },
        { day: 'WED', amount: 0, count: 0, intensity: 'none' },
        { day: 'THU', amount: 180, count: 2, intensity: 'medium' },
        { day: 'FRI', amount: 65, count: 1, intensity: 'low' },
        { day: 'SAT', amount: 0, count: 0, intensity: 'none' },
        { day: 'SUN', amount: 0, count: 0, intensity: 'none' }
      ]
    },
    {
      slot: '06:00 - 12:00',
      days: [
        { day: 'MON', amount: 620, count: 8, intensity: 'medium' },
        { day: 'TUE', amount: 890, count: 12, intensity: 'high' },
        { day: 'WED', amount: 410, count: 5, intensity: 'medium' },
        { day: 'THU', amount: 1120, count: 14, intensity: 'high' },
        { day: 'FRI', amount: 740, count: 9, intensity: 'high' },
        { day: 'SAT', amount: 120, count: 2, intensity: 'low' },
        { day: 'SUN', amount: 40, count: 1, intensity: 'low' }
      ]
    },
    {
      slot: '12:00 - 18:00',
      days: [
        { day: 'MON', amount: 1420, count: 16, intensity: 'high' },
        { day: 'TUE', amount: 2840, count: 28, tag: '[PEAK]', intensity: 'surge' },
        { day: 'WED', amount: 1690, count: 19, intensity: 'high' },
        { day: 'THU', amount: 2940, count: 31, tag: '[AWS]', intensity: 'surge' },
        { day: 'FRI', amount: 1890, count: 21, intensity: 'high' },
        { day: 'SAT', amount: 480, count: 3, intensity: 'medium' },
        { day: 'SUN', amount: 210, count: 3, intensity: 'low' }
      ]
    },
    {
      slot: '18:00 - 24:00',
      days: [
        { day: 'MON', amount: 310, count: 4, intensity: 'low' },
        { day: 'TUE', amount: 540, count: 6, intensity: 'medium' },
        { day: 'WED', amount: 720, count: 9, intensity: 'high' },
        { day: 'THU', amount: 880, count: 11, intensity: 'high' },
        { day: 'FRI', amount: 2310, count: 26, tag: '[DINING]', intensity: 'surge' },
        { day: 'SAT', amount: 820, count: 8, intensity: 'high' },
        { day: 'SUN', amount: 390, count: 4, intensity: 'medium' }
      ]
    }
  ];

  const dayTotals = [
    { day: 'MON', total: 2392 },
    { day: 'TUE', total: 4282 },
    { day: 'WED', total: 2820 },
    { day: 'THU', total: 5120 },
    { day: 'FRI', total: 5005 },
    { day: 'SAT', total: 1420 },
    { day: 'SUN', total: 640 },
  ];

  const getCellBg = (intensity: string) => {
    switch (intensity) {
      case 'surge': return 'bg-[#3d1223] border border-[#ff3366] text-white shadow-glow-pink-sm';
      case 'high': return 'bg-[#0f2838] border border-[#00f0ff]/50 text-[#00f0ff]';
      case 'medium': return 'bg-[#0e2133] border border-[#1e3b5c] text-[#94a3b8]';
      case 'low': return 'bg-[#09121f] border border-[#152033] text-[#64748b]';
      default: return 'bg-[#060a12] border border-[#101724] text-[#475569]';
    }
  };

  const handleAuditSpike = () => {
    soundFx.playClick();
    const awsTx = transactions.find(t => t.id === 'TX-9904') || transactions[0];
    setSelectedTransaction(awsTx);
    setActiveTab('ledger');
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#162136]">
        
        {/* Left: Title + Sync */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-glow-cyan-sm" />
          <h1 className="text-sm font-bold text-white tracking-wider">
            ANALYTICS & TRENDS
          </h1>
          <span className="bg-[#122438] text-[#00f0ff] text-[10px] px-1.5 py-0.2 rounded font-semibold border border-[#00f0ff]/30">
            ENG_SYNC: LIVE
          </span>
        </div>

        {/* Center: Timeframe Switcher */}
        <div className="flex items-center bg-[#090e17] p-0.5 rounded border border-[#182338]">
          {timeframes.map(tf => (
            <button
              key={tf}
              onClick={() => {
                soundFx.playClick();
                setTimeframe(tf);
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                timeframe === tf 
                  ? 'bg-[#ff3366] text-white shadow-glow-pink-sm' 
                  : 'text-[#64748b] hover:text-[#94a3b8]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Right: Window + Actions */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#64748b] hidden md:inline">
            TELEMETRY WINDOW: 30D ROLLING (REALTIME)
          </span>

          <div className="flex items-center gap-1.5 bg-[#0c121e] border border-[#1b253b] hover:border-[#2a3b5c] text-[#94a3b8] hover:text-white px-2.5 py-1 rounded text-[11px] cursor-pointer">
            <TrendingDown className="w-3 h-3 text-[#00f0ff]" />
            <span>VS PREVIOUS PERIOD</span>
            <ChevronDown className="w-3 h-3" />
          </div>

          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="p-1 text-[#94a3b8] hover:text-white bg-[#0c121e] border border-[#1b253b] rounded hover:border-[#38bdf8]"
          >
            <Download className="w-3.5 h-3.5 text-[#00f0ff]" />
          </button>
        </div>

      </div>

      {/* Quantum Velocity Diagnostic Banner */}
      <div className="bg-[#0c121e] border border-[#1b253b] rounded-md p-3.5 shadow-card-glow flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Glowing hexagon icon */}
          <div className="w-9 h-9 rounded bg-[#10192a] border border-[#203152] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 100 100">
              <polygon points="50,5 93,27 93,73 50,95 7,73 7,27" stroke="#ff3366" strokeWidth="6" fill="none" />
              <circle cx="50" cy="50" r="14" fill="#00f0ff" className="animate-pulse" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wider font-display">
                QUANTUM VELOCITY DIAGNOSTIC
              </span>
              <span className="bg-[#0d3829] text-[#00ff9d] border border-[#00ff9d]/40 text-[9px] font-bold px-1.5 py-0.2 rounded">
                AGGREGATOR NOM
              </span>
            </div>
            <p className="text-[10px] text-[#94a3b8] mt-0.5 max-w-xl leading-relaxed">
              Continuous fiscal stream computed against high-frequency transactions. Observed burn velocity represents a <strong className="text-[#00ff9d]">-3.8% deceleration</strong> over the previous fiscal interval.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-[10px] text-[#64748b]">GROSS AGGREGATE RATE</div>
          <div className="text-xl font-bold text-white font-jetbrains">
            $14,290.40
          </div>
          <div className="text-[10px] text-[#00f0ff] font-semibold mt-0.5">
            FLUX CLEARANCE: 99.84% Verified
          </div>
        </div>
      </div>

      {/* Middle Row: Expenditure Velocity Wave + Category Allocation Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Expenditure Velocity Wave (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-[#0c121e] border border-[#1b253b] rounded-md p-4 shadow-card-glow space-y-3 relative">
          
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-[#00f0ff] rounded-xs" />
                <span className="text-xs font-bold text-white tracking-wider uppercase">
                  EXPENDITURE VELOCITY WAVE
                </span>
              </div>
              <div className="text-[10px] text-[#64748b] mt-0.5">
                Hourly diurnal spend pattern mapping peak execution thresholds
              </div>
            </div>

            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-[#00f0ff]">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
                INTRADAY RATE
              </span>
              <span className="flex items-center gap-1 text-[#ff3366]">
                <span className="w-2 h-2 rounded-full bg-[#ff3366]" />
                PEAK ANOMALY ZONE
              </span>
            </div>
          </div>

          {/* Interactive SVG Curved Velocity Wave Chart */}
          <div className="relative h-[210px] w-full pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 680 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#00f0ff" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
                </linearGradient>

                <linearGradient id="peakGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff3366" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#ff3366" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="680" y2="40" stroke="#152033" strokeDasharray="3 3" />
              <line x1="0" y1="90" x2="680" y2="90" stroke="#152033" strokeDasharray="3 3" />
              <line x1="0" y1="140" x2="680" y2="140" stroke="#152033" strokeDasharray="3 3" />

              {/* Shaded Red Peak Zone behind 12:00-14:00 */}
              <rect x="230" y="20" width="130" height="150" fill="url(#peakGradient)" opacity="0.4" />
              
              {/* Shaded Red Peak Zone behind 21:00 */}
              <rect x="530" y="30" width="80" height="140" fill="url(#peakGradient)" opacity="0.4" />

              {/* Main Bezier Wave Area Fill */}
              <path
                d="M 0,145 C 50,140 80,148 130,135 C 180,120 220,110 260,35 C 300,45 330,115 370,120 C 420,125 460,95 510,75 C 540,40 570,45 610,130 C 640,140 660,145 680,145 L 680,175 L 0,175 Z"
                fill="url(#waveGradient)"
              />

              {/* Main Glowing Bezier Wave Stroke */}
              <path
                d="M 0,145 C 50,140 80,148 130,135 C 180,120 220,110 260,35 C 300,45 330,115 370,120 C 420,125 460,95 510,75 C 540,40 570,45 610,130 C 640,140 660,145 680,145"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="3"
                className="drop-shadow-[0_0_8px_#00f0ff]"
              />

              {/* Peak marker 1 at lunch rush (x=260, y=35) */}
              <circle cx="260" cy="35" r="5" fill="#ff3366" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />

              {/* Peak marker 2 at 21:00 rush (x=555, y=42) */}
              <circle cx="555" cy="42" r="5" fill="#ff3366" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
            </svg>

            {/* Hover Tooltip Box on Lunch Rush Peak */}
            <div className="absolute top-2 left-[20%] bg-[#080d16]/95 border border-[#ff3366]/60 rounded p-2 text-xs shadow-2xl backdrop-blur-md pointer-events-none">
              <div className="flex items-center justify-between gap-3 text-[10px] text-[#ff3366] font-bold">
                <span>PEAK: LUNCH RUSH</span>
                <span className="text-white">13:14 UTC</span>
              </div>
              <div className="text-sm font-bold text-white font-jetbrains my-0.5">
                $1,482.50 <span className="text-[10px] font-normal text-[#94a3b8]">/ hr</span>
              </div>
              <div className="text-[9px] text-[#64748b]">
                Predominant: Executive Dining – Cloud Autoscale
              </div>
            </div>

            {/* Bottom X-Axis Hour Labels */}
            <div className="flex justify-between text-[10px] text-[#64748b] pt-1 px-1 border-t border-[#162136]">
              <span>00:00</span>
              <span>03:00</span>
              <span>06:00</span>
              <span>09:00</span>
              <span className="text-[#ff3366] font-bold">12:00 [Rush]</span>
              <span>15:00</span>
              <span>18:00</span>
              <span className="text-[#ff3366] font-bold">21:00 [Rush]</span>
              <span>23:59</span>
            </div>

          </div>

          {/* Bottom stats */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#162136] text-[10px]">
            <div>
              <span className="text-[#64748b]">PEAK INTERVAL DELTA: </span>
              <strong className="text-[#ff3366]">+182% above basal</strong>
            </div>
            <div>
              <span className="text-[#64748b]">QUIET HOURS: </span>
              <strong className="text-[#00ff9d]">02:00 - 05:30 UTC</strong>
            </div>
            <div className="text-[#00f0ff] flex items-center gap-1 font-semibold">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>POLLED 1,440 TELEMETRY EVENTS</span>
            </div>
          </div>

        </div>

        {/* Right: Category Allocation Donut (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-[#0c121e] border border-[#1b253b] rounded-md p-4 shadow-card-glow flex flex-col justify-between space-y-3">
          
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#162136]">
              <div>
                <span className="text-xs font-bold text-white tracking-wider uppercase">
                  CATEGORY ALLOCATION
                </span>
                <div className="text-[10px] text-[#64748b]">
                  Telemetry slice across core modules
                </div>
              </div>
              <button 
                onClick={() => soundFx.playClick()}
                className="text-[#64748b] hover:text-[#00f0ff] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Donut Chart Representation */}
            <div className="relative my-3 flex items-center justify-center">
              <svg className="w-36 h-36" viewBox="0 0 100 100">
                {/* Segment 1: Cloud 38% */}
                <circle
                  cx="50" cy="50" r="38"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="10"
                  strokeDasharray="90.7 238.7"
                  strokeDashoffset="0"
                  className="hover:stroke-width-12 transition-all cursor-pointer"
                />
                {/* Segment 2: Dining 24% */}
                <circle
                  cx="50" cy="50" r="38"
                  fill="none"
                  stroke="#ff3366"
                  strokeWidth="10"
                  strokeDasharray="57.3 238.7"
                  strokeDashoffset="-90.7"
                  className="hover:stroke-width-12 transition-all cursor-pointer"
                />
                {/* Segment 3: Hardware 18% */}
                <circle
                  cx="50" cy="50" r="38"
                  fill="none"
                  stroke="#00ff9d"
                  strokeWidth="10"
                  strokeDasharray="43.0 238.7"
                  strokeDashoffset="-148.0"
                  className="hover:stroke-width-12 transition-all cursor-pointer"
                />
                {/* Segment 4: Logistics 12% */}
                <circle
                  cx="50" cy="50" r="38"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="10"
                  strokeDasharray="28.6 238.7"
                  strokeDashoffset="-191.0"
                  className="hover:stroke-width-12 transition-all cursor-pointer"
                />
                {/* Segment 5: Misc 8% */}
                <circle
                  cx="50" cy="50" r="38"
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="10"
                  strokeDasharray="19.1 238.7"
                  strokeDashoffset="-219.6"
                  className="hover:stroke-width-12 transition-all cursor-pointer"
                />
              </svg>

              {/* Center Donut Label */}
              <div className="absolute text-center leading-tight pointer-events-none">
                <div className="text-[9px] text-[#64748b] uppercase tracking-wider">TOTAL TRACKED</div>
                <div className="text-base font-bold text-white font-jetbrains">$42,910</div>
                <div className="text-[9px] text-[#00f0ff] font-semibold">5 BUCKETS</div>
              </div>
            </div>
          </div>

          {/* Breakdown Legend Items */}
          <div className="space-y-1.5 pt-2 border-t border-[#162136] text-[11px]">
            {categoryDonutData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[#94a3b8]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: item.color }} />
                  <span className="text-white truncate max-w-[130px]">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 font-jetbrains">
                  <span className="text-white font-medium">${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  <span className="text-[#64748b] w-7 text-right font-bold">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Middle Matrix: Diurnal Intensity Matrix [Day-of-Week Heatmap] */}
      <div className="bg-[#0c121e] border border-[#1b253b] rounded-md p-4 shadow-card-glow space-y-3">
        
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-[#ff3366] rounded-xs" />
              <span className="text-xs font-bold text-white tracking-wider uppercase">
                DIURNAL INTENSITY MATRIX [DAY-OF-WEEK HEATMAP]
              </span>
            </div>
            <div className="text-[10px] text-[#64748b] mt-0.5">
              Mapping disbursement frequency and transaction density per 6-hour cycle
            </div>
          </div>

          {/* Heatmap Legend */}
          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-[#64748b]">INTENSITY LEVEL:</span>
            <span className="text-[#64748b]">Low</span>
            <span className="w-3 h-3 bg-[#09121f] border border-[#152033] rounded-xs" />
            <span className="w-3 h-3 bg-[#0e2133] border border-[#1e3b5c] rounded-xs" />
            <span className="w-3 h-3 bg-[#0f2838] border border-[#00f0ff]/50 rounded-xs" />
            <span className="w-3 h-3 bg-[#3d1223] border border-[#ff3366] rounded-xs" />
            <span className="text-[#ff3366] font-bold">Surge</span>
          </div>
        </div>

        {/* Matrix Table Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="text-[10px] text-[#64748b] border-b border-[#162136]">
                <th className="py-2 px-3 text-left font-semibold w-28"></th>
                <th className="py-2 px-2 font-bold text-white">MON</th>
                <th className="py-2 px-2 font-bold text-white">TUE</th>
                <th className="py-2 px-2 font-bold text-white">WED</th>
                <th className="py-2 px-2 font-bold text-white">THU</th>
                <th className="py-2 px-2 font-bold text-white">FRI</th>
                <th className="py-2 px-2 font-bold text-white">SAT</th>
                <th className="py-2 px-2 font-bold text-white">SUN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#131d2e] text-[11px]">
              {heatmapData.map((row, rIdx) => (
                <tr key={rIdx}>
                  <td className="py-2.5 px-3 text-left font-medium text-[#64748b] whitespace-nowrap">
                    {row.slot}
                  </td>
                  {row.days.map((cell, cIdx) => (
                    <td key={cIdx} className="p-1">
                      <div 
                        className={`p-2 rounded flex flex-col justify-center items-center transition-all cursor-pointer ${getCellBg(cell.intensity)}`}
                      >
                        <span className="font-bold font-jetbrains text-xs">
                          ${cell.amount}
                        </span>
                        <span className="text-[9px] opacity-80 mt-0.5">
                          {cell.count} tx {cell.tag && <span className="font-bold text-[#ff3366]">{cell.tag}</span>}
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}

              {/* Day Totals Footer Row */}
              <tr className="text-[10px] font-bold text-white border-t border-[#1e2e47] bg-[#090e17]">
                <td className="py-2 px-3 text-left text-[#64748b]">Daily Total</td>
                {dayTotals.map((tot, idx) => (
                  <td key={idx} className="py-2 px-2 font-jetbrains">
                    ${tot.total.toLocaleString()}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Matrix Footer Metrics */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#162136] text-[10px]">
          <div>
            <span className="text-[#64748b]">Highest Daily Outflow: </span>
            <strong className="text-[#ff3366]">Thursday ($5,120.00)</strong>
          </div>
          <div>
            <span className="text-[#64748b]">Average Daily Run-Rate: </span>
            <strong className="text-[#00f0ff]">$3,101.43 / day</strong>
          </div>
          <div>
            <span className="text-[#64748b]">Weekend Quiescence Factor: </span>
            <strong className="text-[#00ff9d]">68.2% drop</strong>
          </div>
        </div>

      </div>

      {/* Bottom Diagnostic & Forecast Trio (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Top Expense Spike Anomaly */}
        <div className="bg-[#0c121e] border border-[#ff3366]/30 hover:border-[#ff3366] rounded-md p-3.5 shadow-card-glow flex flex-col justify-between space-y-2.5 transition-all">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[#64748b] uppercase font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-[#ff3366]" />
                TOP EXPENSE SPIKE
              </span>
              <span className="bg-[#4a1525] text-[#ff3366] border border-[#ff3366]/40 text-[9px] font-bold px-1.5 py-0.2 rounded">
                ANOMALY DETECTED
              </span>
            </div>

            <h3 className="text-sm font-bold text-white uppercase mt-2">
              AWS CLUSTER AUTO-SCALE
            </h3>
            <div className="text-sm font-bold text-[#ff3366] font-jetbrains my-0.5">
              +$45.20 <span className="text-[10px] font-normal text-[#94a3b8]">higher than baseline</span>
            </div>

            <p className="text-[10px] text-[#94a3b8] leading-relaxed mt-1">
              Automated elasticity trigger spawned 4x c6g.4xlarge instances in us-east-1 during the 13:00 UTC database query load test.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#162136] text-[10px]">
            <span className="text-[#64748b]">HASH: #0x8F92...B3</span>
            <button 
              onClick={handleAuditSpike}
              className="text-[#ff3366] hover:underline font-bold flex items-center gap-1"
            >
              <span>AUDIT EVENT</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 2: Daily Burn Rate Forecast */}
        <div className="bg-[#0c121e] border border-[#00f0ff]/30 hover:border-[#00f0ff] rounded-md p-3.5 shadow-card-glow flex flex-col justify-between space-y-2.5 transition-all">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[#64748b] uppercase font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[#00f0ff]" />
                DAILY BURN RATE FORECAST
              </span>
              <span className="bg-[#122438] text-[#00f0ff] border border-[#00f0ff]/40 text-[9px] font-bold px-1.5 py-0.2 rounded">
                CONFIDENCE: 94.2%
              </span>
            </div>

            <h3 className="text-sm font-bold text-white uppercase mt-2">
              PROJECTED MONTH-END
            </h3>
            <div className="text-base font-bold text-white font-jetbrains my-0.5">
              $98,450 <span className="text-[10px] font-normal text-[#64748b]">est. gross</span>
            </div>

            {/* Ceiling progress */}
            <div className="my-2 space-y-1">
              <div className="w-full bg-[#151f33] h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] rounded-full w-[44%]" />
              </div>
              <div className="flex justify-between text-[9px] text-[#64748b]">
                <span>Current Incurred: $43,910</span>
                <span>Ceiling: $110,000</span>
              </div>
            </div>

            <p className="text-[10px] text-[#00ff9d] leading-relaxed">
              Expected safe envelope clearance: +$11,550 runway surplus.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#162136] text-[10px]">
            <span className="text-[#64748b]">Burn Vel: $3,281/day</span>
            <button 
              onClick={() => soundFx.playClick()}
              className="text-[#00f0ff] hover:underline font-bold"
            >
              MODEL SCENARIOS ⇄
            </button>
          </div>
        </div>

        {/* Card 3: Optimization Engine (Killswitch) */}
        <div className="bg-[#0c121e] border border-[#00ff9d]/30 hover:border-[#00ff9d] rounded-md p-3.5 shadow-card-glow flex flex-col justify-between space-y-2.5 transition-all">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[#64748b] uppercase font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#00ff9d]" />
                OPTIMIZATION ENGINE
              </span>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                areSubsDeprecated ? 'bg-[#122438] text-[#00f0ff]' : 'bg-[#0d3829] text-[#00ff9d] border border-[#00ff9d]/40'
              }`}>
                {areSubsDeprecated ? '0 DORMANT' : '2 DORMANT SUBS'}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white uppercase mt-2">
              RECURRING INACTIVITY
            </h3>
            <div className="text-sm font-bold text-[#00ff9d] font-jetbrains my-0.5">
              -$840.00 <span className="text-[10px] font-normal text-[#94a3b8]">potential monthly savings</span>
            </div>

            {/* Inactive Subscriptions List */}
            <div className="space-y-1.5 my-2">
              <div className="flex items-center justify-between text-[10px] bg-[#090e17] p-1.5 rounded border border-[#162136]">
                <div>
                  <div className="text-white font-bold">DataDog Enterprise APM</div>
                  <div className="text-[9px] text-[#64748b]">0 telemetry pings / 45 days</div>
                </div>
                <span className="text-[#ff3366] font-bold font-jetbrains">$590/mo</span>
              </div>

              <div className="flex items-center justify-between text-[10px] bg-[#090e17] p-1.5 rounded border border-[#162136]">
                <div>
                  <div className="text-white font-bold">Figma Org Tier Seat (x2)</div>
                  <div className="text-[9px] text-[#64748b]">0 logins recorded in 60+ days</div>
                </div>
                <span className="text-[#ff3366] font-bold font-jetbrains">$250/mo</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#162136] text-[10px]">
            <span className="text-[#64748b]">
              ACTION: {areSubsDeprecated ? 'DEPRECATED' : 'KILLSWITCH READY'}
            </span>
            <button 
              onClick={deprecateDormantSubs}
              disabled={areSubsDeprecated}
              className={`px-2 py-1 rounded font-bold transition-all ${
                areSubsDeprecated 
                  ? 'bg-[#15233c] text-[#64748b]' 
                  : 'bg-[#00ff9d] hover:bg-[#00d2df] text-[#080b11] shadow-glow-green active:scale-95'
              }`}
            >
              {areSubsDeprecated ? 'SAVED +$840/MO' : 'DEPRECATE BOTH ⚡'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
