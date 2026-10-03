import React, { useEffect } from 'react';
import { LedgerProvider, useLedger } from './context/LedgerContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { DashboardView } from './components/dashboard/DashboardView';
import { LedgerView } from './components/ledger/LedgerView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { BudgetsView } from './components/budgets/BudgetsView';

import { RecordExpenseModal } from './components/modals/RecordExpenseModal';
import { CliTerminalModal } from './components/modals/CliTerminalModal';
import { NewCategoryLimitModal } from './components/modals/NewCategoryLimitModal';
import { RegisterSubscriptionModal } from './components/modals/RegisterSubscriptionModal';
import { ConfigureRulesModal } from './components/modals/ConfigureRulesModal';
import { ExportModal } from './components/modals/ExportModal';

const MainLayout: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsCliOpen, 
    setIsExpenseModalOpen 
  } = useLedger();

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle CLI on / or `
      if ((e.key === '/' || e.key === '`') && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setIsCliOpen(true);
      }
      // Tab switches on Alt+1..4 or Cmd+1..4
      if (e.altKey || e.metaKey) {
        if (e.key === '1') { e.preventDefault(); setActiveTab('dashboard'); }
        if (e.key === '2') { e.preventDefault(); setActiveTab('ledger'); }
        if (e.key === '3') { e.preventDefault(); setActiveTab('analytics'); }
        if (e.key === '4') { e.preventDefault(); setActiveTab('budgets'); }
        if (e.key === 'e' || e.key === 'E') { e.preventDefault(); setIsExpenseModalOpen(true); }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab, setIsCliOpen, setIsExpenseModalOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-[#080b11] text-[#e2e8f0] relative scanlines">
      
      {/* Top Terminal Navigation Header */}
      <Header />

      {/* Main View Container */}
      <main className="flex-1 max-w-[1520px] w-full mx-auto px-4 lg:px-6 py-4">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'ledger' && <LedgerView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'budgets' && <BudgetsView />}
      </main>

      {/* Global Status & Audit Footer */}
      <Footer />

      {/* Interactive Modals */}
      <RecordExpenseModal />
      <CliTerminalModal />
      <NewCategoryLimitModal />
      <RegisterSubscriptionModal />
      <ConfigureRulesModal />
      <ExportModal />

    </div>
  );
};

export default function App() {
  return (
    <LedgerProvider>
      <MainLayout />
    </LedgerProvider>
  );
}
