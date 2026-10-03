import React, { useState, useRef, useEffect } from 'react';
import { useLedger } from '../../context/LedgerContext';
import { X, Terminal as TerminalIcon, CornerDownLeft } from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { getUtcTimeOnly, getUtcDateOnly } from '../../utils/date';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  text: string;
}

export const CliTerminalModal: React.FC = () => {
  const { 
    isCliOpen, 
    setIsCliOpen, 
    setActiveTab, 
    addTransaction, 
    transactions, 
    setSelectedTransaction,
    dailyDelta,
    cumulativeMtd,
    safeRemainder
  } = useLedger();

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'system', text: 'CHRONOS_SPEND CLI ENGINE V2.4 [NODE #0x4E9 INITIALIZED]' },
    { type: 'system', text: 'Type "help" to view available ledger operational commands.' }
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isCliOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isCliOpen]);

  if (!isCliOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputVal.trim();
    if (!raw) return;

    soundFx.playClick();
    const newHistory: TerminalLine[] = [...history, { type: 'input', text: `$ ${raw}` }];
    const parts = raw.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'help':
        newHistory.push(
          { type: 'output', text: 'AVAILABLE TERMINAL COMMANDS:' },
          { type: 'output', text: '  status                       - Display current telemetry metrics & node health' },
          { type: 'output', text: '  log <amount> <merchant>      - Commit immediate disbursement to ledger' },
          { type: 'output', text: '  audit <tx_id>                - Open and inspect cryptographic record' },
          { type: 'output', text: '  tab <dash|ledger|trends|budgets> - Switch primary interface tab' },
          { type: 'output', text: '  clear                        - Clear terminal scroll buffer' },
          { type: 'output', text: '  exit                         - Close CLI terminal' }
        );
        break;

      case 'status':
        newHistory.push(
          { type: 'success', text: `NODE_ONLINE #0x4E9 | INTEGRITY: 100% OK | ZERO ERROR NODES` },
          { type: 'output', text: `  Daily Delta:     $${dailyDelta.toFixed(2)}` },
          { type: 'output', text: `  Cumulative MTD:  $${cumulativeMtd.toFixed(2)}` },
          { type: 'output', text: `  Safe Remainder:  $${safeRemainder.toFixed(2)}` },
          { type: 'output', text: `  Total Entries:   ${transactions.length} records registered` }
        );
        break;

      case 'log':
        if (args.length < 2) {
          newHistory.push({ type: 'error', text: 'Usage: log <amount> <merchant_name> [category]' });
        } else {
          const amt = parseFloat(args[0]);
          const merch = args[1];
          const cat = args[2] || 'Infrastructure';
          if (isNaN(amt) || amt <= 0) {
            newHistory.push({ type: 'error', text: 'Invalid amount value.' });
          } else {
            const now = new Date();
            addTransaction({
              timestamp: getUtcTimeOnly(now),
              fullDate: getUtcDateOnly(now),
              merchant: merch,
              category: cat,
              amount: amt,
              type: 'debit',
              account: 'CLI_DISPATCH',
              tags: ['#cli', '#terminal']
            });
            newHistory.push({ type: 'success', text: `SUCCESS: Dispatched -$${amt.toFixed(2)} to ${merch} [${cat}].` });
          }
        }
        break;

      case 'audit':
        if (!args[0]) {
          newHistory.push({ type: 'error', text: 'Usage: audit <tx_id> (e.g. audit TX-9904)' });
        } else {
          const queryId = args[0].toUpperCase();
          const found = transactions.find(t => t.id === queryId);
          if (found) {
            setSelectedTransaction(found);
            setActiveTab('ledger');
            newHistory.push({ type: 'success', text: `Loaded audit record ${queryId}. Switched view to Transaction Ledger.` });
          } else {
            newHistory.push({ type: 'error', text: `Record ${queryId} not found in current ledger block.` });
          }
        }
        break;

      case 'tab':
        if (!args[0]) {
          newHistory.push({ type: 'error', text: 'Usage: tab <dash|ledger|trends|budgets>' });
        } else {
          const target = args[0].toLowerCase();
          if (target.includes('dash')) setActiveTab('dashboard');
          else if (target.includes('ledger')) setActiveTab('ledger');
          else if (target.includes('trend') || target.includes('ana')) setActiveTab('analytics');
          else if (target.includes('budg')) setActiveTab('budgets');
          newHistory.push({ type: 'success', text: `Viewport switched to ${target}.` });
        }
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
        setIsCliOpen(false);
        setInputVal('');
        return;

      default:
        newHistory.push({ type: 'error', text: `Command not recognized: "${cmd}". Type "help" for command list.` });
    }

    setHistory(newHistory);
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono animate-fadeIn">
      <div className="bg-[#080c14] border border-[#202f4a] rounded-lg w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[420px]">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#05080e] border-b border-[#162136]">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-[#00f0ff]" />
            <span className="text-xs font-bold text-white tracking-wider">
              CHRONOS_TERMINAL // CLI PROMPT [INTERACTIVE]
            </span>
          </div>

          <button 
            onClick={() => {
              soundFx.playClick();
              setIsCliOpen(false);
            }}
            className="text-[#64748b] hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Terminal Scroll Content */}
        <div className="flex-1 p-4 overflow-y-auto space-y-1.5 text-xs text-[#94a3b8]">
          {history.map((line, idx) => (
            <div key={idx} className="leading-relaxed">
              {line.type === 'input' && <span className="text-[#00f0ff] font-bold">{line.text}</span>}
              {line.type === 'output' && <span className="text-[#94a3b8]">{line.text}</span>}
              {line.type === 'success' && <span className="text-[#00ff9d] font-semibold">{line.text}</span>}
              {line.type === 'error' && <span className="text-[#ff3366] font-semibold">{line.text}</span>}
              {line.type === 'system' && <span className="text-[#64748b]">{line.text}</span>}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleCommand} className="flex items-center px-4 py-2.5 bg-[#05080e] border-t border-[#162136]">
          <span className="text-[#ff3366] font-bold mr-2 text-xs">$</span>
          <input
            type="text"
            autoFocus
            placeholder="Type 'help' or commands..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-transparent text-white text-xs font-mono focus:outline-none placeholder-[#475569]"
          />
          <button type="submit" className="text-[#00f0ff] hover:text-white p-1">
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
};
