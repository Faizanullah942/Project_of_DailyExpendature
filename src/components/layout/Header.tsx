import React, { useState } from 'react';
import { useLedger } from '../../context/LedgerContext';
import type { TabType } from '../../types';
import { 
  Clock, 
  Plus, 
  Bell, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ChevronDown 
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    selectedAccount, 
    setSelectedAccount, 
    setIsExpenseModalOpen,
    notifications,
    markNotificationRead,
    clearNotifications,
    isSoundEnabled,
    toggleSound,
    currentUtcTime,
    currentDateFormatted
  } = useLedger();

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);

  const accounts = [
    'Treasury Main [USD]',
    'Mercury Vault',
    'Corporate Operating [USD]',
    'Petty Cash Buffer'
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const tabs: { id: TabType; label: string }[] = [
    { id: 'dashboard', label: 'DASHBOARD &\nQUICK LOGGER' },
    { id: 'ledger', label: 'TRANSACTION\nLEDGER' },
    { id: 'analytics', label: 'ANALYTICS\n& TRENDS' },
    { id: 'budgets', label: 'BUDGETS &\nCATEGORIES' },
  ];

  const dateParts = currentDateFormatted.split(',');
  const monthDay = dateParts[0] ? `${dateParts[0]},` : 'Live,';
  const yearStr = dateParts[1] ? dateParts[1].trim() : String(new Date().getFullYear());
  const timeOnly = currentUtcTime.split(' ')[1] || currentUtcTime;

  return (
    <header className="sticky top-0 z-40 bg-[#080b11]/95 backdrop-blur-md border-b border-[#1b2438] px-4 lg:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#0e1526] border border-[#2a3b5c] shadow-glow-pink-sm cursor-pointer hover:border-[#ff3366] transition-colors" onClick={() => setActiveTab('dashboard')}>
            {/* Hexagon & Core Cyber Icon */}
            <svg className="w-5 h-5" viewBox="0 0 100 100" fill="none">
              <polygon points="50,5 93,27 93,73 50,95 7,73 7,27" stroke="#ff3366" strokeWidth="6" className="drop-shadow-[0_0_6px_#ff3366]" />
              <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" stroke="#00f0ff" strokeWidth="4" className="drop-shadow-[0_0_4px_#00f0ff]" />
              <circle cx="50" cy="50" r="10" fill="#ff3366" className="animate-pulse" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black tracking-wider text-base text-white">CHRONOS</span>
              <span className="text-[#ff3366] font-display font-bold text-sm">/</span>
              <span className="font-display font-bold tracking-wider text-sm text-[#ff3366]">SPEND</span>
            </div>
            <div className="font-mono text-[9px] tracking-[0.2em] text-[#64748b] -mt-0.5">
              TERMINAL LEDGER V2.4
            </div>
          </div>
        </div>

        {/* Date / UTC Capsule Pill */}
        <div className="hidden md:flex items-center bg-[#0d131f] border border-[#1e293b] rounded-md px-2.5 py-1 text-xs font-mono text-[#94a3b8] gap-2.5 shadow-inner">
          <div className="flex flex-col items-start leading-tight">
            <span className="text-[10px] text-[#64748b]">{monthDay}</span>
            <span className="text-white font-medium text-xs">{yearStr}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#131d2e] px-2 py-0.5 rounded border border-[#23334d]">
            <Clock className="w-3 h-3 text-[#00f0ff] animate-pulse" />
            <span className="text-[#00f0ff] font-bold text-[11px] tracking-wider font-jetbrains">{timeOnly}</span>
            <span className="text-[9px] text-[#64748b] font-bold">UTC</span>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-wider text-center transition-all whitespace-pre-line leading-tight rounded-t-sm
                  ${isActive 
                    ? 'text-white bg-[#0e1626]/80' 
                    : 'text-[#64748b] hover:text-[#94a3b8] hover:bg-[#0d131f]/50'
                  }`}
              >
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#ff3366] via-[#ff4d79] to-[#00f0ff] shadow-glow-pink" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Account Selector Dropdown */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="flex items-center gap-2 bg-[#0e1526] hover:bg-[#131d33] border border-[#23334d] hover:border-[#38bdf8] text-white px-3 py-1.5 rounded text-xs font-mono transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
              <span className="truncate max-w-[130px]">{selectedAccount}</span>
              <ChevronDown className="w-3 h-3 text-[#64748b]" />
            </button>

            {isAccountMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0d131f] border border-[#2a3b5c] rounded-md shadow-2xl p-1 z-50 font-mono text-xs">
                <div className="px-2 py-1 text-[10px] text-[#64748b] uppercase tracking-wider border-b border-[#1b2438]">
                  Select Liquid Vault
                </div>
                {accounts.map(acc => (
                  <button
                    key={acc}
                    onClick={() => {
                      setSelectedAccount(acc);
                      setIsAccountMenuOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between ${
                      selectedAccount === acc 
                        ? 'bg-[#15233c] text-[#00f0ff]' 
                        : 'text-[#94a3b8] hover:bg-[#111928] hover:text-white'
                    }`}
                  >
                    <span>{acc}</span>
                    {selectedAccount === acc && <span className="text-[10px] text-[#00ff9d]">ACTIVE</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Record Expense CTA */}
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#ff3366] hover:bg-[#ff1753] active:scale-95 text-white font-mono font-bold text-xs px-3.5 py-1.5 rounded shadow-glow-pink transition-all tracking-wider"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">RECORD EXPENSE</span>
            <span className="sm:hidden">EXPENSE</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={isSoundEnabled ? 'Sound FX Enabled' : 'Sound FX Muted'}
            className="p-1.5 text-[#64748b] hover:text-[#00f0ff] hover:bg-[#0e1526] rounded border border-transparent hover:border-[#1e293b] transition-colors"
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4 text-[#00f0ff]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
              className="relative p-1.5 text-[#94a3b8] hover:text-white hover:bg-[#0e1526] rounded border border-[#1e293b] transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ff3366] rounded-full border-2 border-[#080b11] animate-pulse" />
              )}
            </button>

            {isNotifMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#0d131f] border border-[#2a3b5c] rounded-md shadow-2xl p-2 z-50 font-mono text-xs">
                <div className="flex items-center justify-between px-2 py-1 border-b border-[#1b2438] pb-1.5 mb-1.5">
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider">Telemetry Alerts</span>
                  {notifications.length > 0 && (
                    <button 
                      onClick={clearNotifications}
                      className="text-[10px] text-[#64748b] hover:text-[#ff3366]"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-4 text-[#64748b] text-[11px]">
                      No active telemetry alerts.
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2 rounded border transition-colors cursor-pointer ${
                          n.isRead 
                            ? 'bg-[#090d15] border-[#151c2d] opacity-60' 
                            : 'bg-[#101726] border-[#22314d]'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {n.type === 'alert' && <AlertTriangle className="w-3.5 h-3.5 text-[#ff3366] shrink-0 mt-0.5" />}
                          {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff9d] shrink-0 mt-0.5" />}
                          {n.type === 'info' && <Info className="w-3.5 h-3.5 text-[#00f0ff] shrink-0 mt-0.5" />}
                          <div className="flex-1">
                            <div className="text-[11px] font-bold text-white">{n.title}</div>
                            <div className="text-[10px] text-[#94a3b8] mt-0.5 leading-snug">{n.message}</div>
                            <div className="text-[9px] text-[#64748b] mt-1">{n.time}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="relative w-8 h-8 rounded-full border border-[#2a3b5c] overflow-hidden bg-gradient-to-tr from-[#131d33] to-[#203152] flex items-center justify-center cursor-pointer hover:border-[#00f0ff] transition-colors">
            <span className="text-[11px] font-mono font-bold text-[#00f0ff]">HP</span>
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#00ff9d] rounded-full border border-[#080b11]" />
          </div>

        </div>

      </div>
    </header>
  );
};
