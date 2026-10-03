import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  TabType, 
  Transaction, 
  CategoryEnvelope, 
  ScheduledCommitment, 
  HeuristicRule, 
  NotificationItem,
  SplitAllocation
} from '../types';
import { soundFx } from '../utils/audio';
import { 
  getLiveUtcTimeString, 
  getUtcTimeOnly, 
  getUtcDateOnly, 
  getRelativeDateString, 
  getFormattedCurrentDate 
} from '../utils/date';

interface LedgerContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  
  // Transactions & Ledger
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (tx: Transaction | null) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'statusTag' | 'isoTimestamp'>) => void;
  updateSplitAllocation: (txId: string, split: SplitAllocation) => void;
  reassignCategory: (txId: string, newCategory: string) => void;
  disputeTransaction: (txId: string) => void;
  
  // Filtering
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  typeFilter: 'all' | 'debit' | 'credit' | 'transfer';
  setTypeFilter: (filter: 'all' | 'debit' | 'credit' | 'transfer') => void;
  dateRangeFilter: string;
  setDateRangeFilter: (range: string) => void;
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  vaultFilter: string;
  setVaultFilter: (vault: string) => void;
  activeFilterTags: { key: string; label: string; value: string }[];
  removeFilterTag: (key: string) => void;
  resetAllFilters: () => void;

  // Accounts & Metrics
  selectedAccount: string;
  setSelectedAccount: (acc: string) => void;
  dailyDelta: number;
  dailyMax: number;
  cumulativeMtd: number;
  velocityHourly: number;
  safeRemainder: number;
  
  // Budgets & Rules
  categoryEnvelopes: CategoryEnvelope[];
  updateEnvelopeLimit: (id: string, newLimit: number) => void;
  recurringCommitments: ScheduledCommitment[];
  addRecurringCommitment: (commitment: Omit<ScheduledCommitment, 'id'>) => void;
  heuristicRules: HeuristicRule[];
  toggleRule: (id: string) => void;
  deprecateDormantSubs: () => void;
  areSubsDeprecated: boolean;

  // Global UI & Modals
  isExpenseModalOpen: boolean;
  setIsExpenseModalOpen: (open: boolean) => void;
  isCliOpen: boolean;
  setIsCliOpen: (open: boolean) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  isNewCategoryModalOpen: boolean;
  setIsNewCategoryModalOpen: (open: boolean) => void;
  isNewSubModalOpen: boolean;
  setIsNewSubModalOpen: (open: boolean) => void;
  isRulesModalOpen: boolean;
  setIsRulesModalOpen: (open: boolean) => void;
  
  // Time & Audio
  currentUtcTime: string;
  currentDateFormatted: string;
  isSoundEnabled: boolean;
  toggleSound: () => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

const todayStr = getRelativeDateString(0);
const yesterdayStr = getRelativeDateString(1);
const twoDaysAgoStr = getRelativeDateString(2);

const INITIAL_TRANSACTIONS: Transaction[] = [
  // Today's records
  {
    id: 'TX-9904',
    timestamp: '14:12:05 UTC',
    fullDate: todayStr,
    isoTimestamp: `${todayStr}T14:12:05.419Z`,
    merchant: 'AWS Cloud Infrastructure',
    category: 'Infrastructure',
    categoryCode: 'OPS_SYS_AWS_HETZ',
    categoryBadgeColor: '#38bdf8',
    amount: 124.80,
    type: 'debit',
    account: 'Mercury #9824',
    tags: ['#us-east-1', '#cloud', '#prod-core'],
    statusTag: 'CONFIRMED (TX-9904)',
    statusColor: 'green',
    iconType: 'cloud',
    isReceiptAttached: true,
    preTax: 114.50,
    taxAmount: 10.30,
    taxLabel: 'TAX JURIS / RATE (CA STATE 9.0%)',
    deductibilityStatus: '100% Corp Write-off (Sec. 174)',
    invoiceNumber: 'INVOICE-AWS-7489-US',
    cryptoHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    splitAllocation: {
      departments: [
        { name: 'Core Infrastructure', percentage: 75, amount: 93.60 },
        { name: 'Client Sandbox Env', percentage: 25, amount: 31.20 }
      ]
    }
  },
  {
    id: 'TX-9882',
    timestamp: '11:28:44 UTC',
    fullDate: todayStr,
    isoTimestamp: `${todayStr}T11:28:44.102Z`,
    merchant: 'Figma Enterprise Org',
    category: 'SaaS Subscriptions',
    categoryCode: 'RECUR_DEV_STACK',
    categoryBadgeColor: '#f43f5e',
    amount: 45.00,
    type: 'debit',
    account: 'Amex #7743',
    tags: ['Seats: 12', '#design', '#seats'],
    statusTag: 'AUTO-RENEW',
    statusColor: 'cyan',
    iconType: 'figma',
    isAutoRenew: true,
    preTax: 45.00,
    taxAmount: 0.00,
    taxLabel: 'TAX JURIS (EXEMPT)',
    deductibilityStatus: '100% Software License (Sec. 162)',
    invoiceNumber: `INV-FIGMA-${todayStr.slice(0, 7)}-88`,
    cryptoHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    splitAllocation: {
      departments: [
        { name: 'Product Design', percentage: 80, amount: 36.00 },
        { name: 'Marketing Org', percentage: 20, amount: 9.00 }
      ]
    }
  },
  {
    id: 'TX-9841',
    timestamp: '08:45:10 UTC',
    fullDate: todayStr,
    isoTimestamp: `${todayStr}T08:45:10.004Z`,
    merchant: 'Blue Bottle Coffee - SoMa HQ',
    category: 'Food & Beverage',
    categoryCode: 'FOOD_GROCERY_DISCRET',
    categoryBadgeColor: '#a855f7',
    amount: 14.70,
    type: 'debit',
    account: 'Chase Corp #0112',
    tags: ['Client Sync', '#morning', '#caffeine'],
    statusTag: 'RECEIPT_ATTACHED',
    statusColor: 'green',
    iconType: 'coffee',
    isReceiptAttached: true,
    preTax: 13.50,
    taxAmount: 1.20,
    taxLabel: 'SF LOCAL MEAL SURCHARGE (8.88%)',
    deductibilityStatus: '50% Business Meal (Sec. 274)',
    invoiceNumber: 'BB-SOMA-9921',
    cryptoHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    splitAllocation: {
      departments: [
        { name: 'Executive Relations', percentage: 100, amount: 14.70 }
      ]
    }
  },
  // Yesterday's records
  {
    id: 'TX-9750',
    timestamp: '19:40:12 UTC',
    fullDate: yesterdayStr,
    isoTimestamp: `${yesterdayStr}T19:40:12.891Z`,
    merchant: 'Anthropic API Compute',
    category: 'Engineering',
    categoryCode: 'OPS_SYS_AWS_HETZ',
    categoryBadgeColor: '#10b981',
    amount: 298.50,
    type: 'debit',
    account: 'Mercury #9824',
    tags: ['Tokens: 4.8M', '#claude', '#inference'],
    statusTag: 'CONFIRMED (API_BILL)',
    statusColor: 'green',
    iconType: 'anthropic',
    isReceiptAttached: true,
    preTax: 298.50,
    taxAmount: 0.00,
    taxLabel: 'TAX EXEMPT (CLOUD COMPUTE)',
    deductibilityStatus: '100% R&D Expense (Sec. 174)',
    invoiceNumber: `INV-ANTHROPIC-${yesterdayStr.slice(0, 7)}`,
    cryptoHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    splitAllocation: {
      departments: [
        { name: 'AI Core Research', percentage: 70, amount: 208.95 },
        { name: 'Production Backend', percentage: 30, amount: 89.55 }
      ]
    }
  },
  {
    id: 'TX-9712',
    timestamp: '10:14:02 UTC',
    fullDate: yesterdayStr,
    isoTimestamp: `${yesterdayStr}T10:14:02.115Z`,
    merchant: 'GitHub Actions CI Runners',
    category: 'Engineering',
    categoryCode: 'RECUR_DEV_STACK',
    categoryBadgeColor: '#10b981',
    amount: 43.60,
    type: 'debit',
    account: 'Chase Corp #0112',
    tags: ['Linux-x64', '#devops', '#ci-cd'],
    statusTag: 'RECURRING',
    statusColor: 'cyan',
    iconType: 'github',
    isAutoRenew: true,
    preTax: 43.60,
    taxAmount: 0.00,
    taxLabel: 'TAX EXEMPT',
    deductibilityStatus: '100% Developer Tooling',
    invoiceNumber: 'GH-CI-88902',
    cryptoHash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    splitAllocation: {
      departments: [
        { name: 'Core Platform Engineering', percentage: 100, amount: 43.60 }
      ]
    }
  },
  // 2 days ago records
  {
    id: 'TX-8831',
    timestamp: '16:05:33 UTC',
    fullDate: twoDaysAgoStr,
    isoTimestamp: `${twoDaysAgoStr}T16:05:33.742Z`,
    merchant: 'Cursor IDE Team Seat License',
    category: 'SaaS Subscriptions',
    categoryCode: 'RECUR_DEV_STACK',
    categoryBadgeColor: '#f43f5e',
    amount: 95.00,
    type: 'debit',
    account: 'Mercury #9824',
    tags: ['Seats: 5', '#ai-ide', '#developer'],
    statusTag: 'CONFIRMED (TX-8831)',
    statusColor: 'green',
    iconType: 'cursor',
    isReceiptAttached: true,
    preTax: 95.00,
    taxAmount: 0.00,
    taxLabel: 'TAX EXEMPT',
    deductibilityStatus: '100% Corp Software',
    invoiceNumber: 'INV-CURSOR-7731',
    cryptoHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    splitAllocation: {
      departments: [
        { name: 'Engineering Core', percentage: 100, amount: 95.00 }
      ]
    }
  },
  // Additional feed items from Screen 1
  {
    id: 'TX-9901',
    timestamp: '12:45 PM',
    fullDate: todayStr,
    isoTimestamp: `${todayStr}T12:45:00.000Z`,
    merchant: 'Kura Sushi Shibuya',
    category: 'Dining & Provisioning',
    categoryCode: 'FOOD_GROCERY_DISCRET',
    categoryBadgeColor: '#ff3366',
    amount: 64.20,
    type: 'debit',
    account: 'CORP VISA • 4092',
    tags: ['#lunch', '#client'],
    statusTag: 'CONFIRMED',
    statusColor: 'pink',
    iconType: 'sushi',
    isReceiptAttached: true
  },
  {
    id: 'TX-9890',
    timestamp: '08:50 AM',
    fullDate: todayStr,
    isoTimestamp: `${todayStr}T08:50:00.000Z`,
    merchant: 'Tokyo Metro Transit IC',
    category: 'Transit & Travel',
    categoryCode: 'COMMUTE_FLIGHT_TRANS',
    categoryBadgeColor: '#10b981',
    amount: 31.00,
    type: 'debit',
    account: 'CASH RESERVE',
    tags: ['#transit', '#commute'],
    statusTag: 'CONFIRMED',
    statusColor: 'cyan',
    iconType: 'transit'
  },
  {
    id: 'TX-9875',
    timestamp: '08:12 AM',
    fullDate: todayStr,
    isoTimestamp: `${todayStr}T08:12:00.000Z`,
    merchant: 'Blue Bottle Espresso',
    category: 'Dining & Provisioning',
    categoryCode: 'FOOD_GROCERY_DISCRET',
    categoryBadgeColor: '#a855f7',
    amount: 24.30,
    type: 'debit',
    account: 'REVOLUT PERS',
    tags: ['#caffeine', '#morning'],
    statusTag: 'CONFIRMED',
    statusColor: 'green',
    iconType: 'coffee'
  }
];

const INITIAL_ENVELOPES: CategoryEnvelope[] = [
  {
    id: 'env-1',
    name: 'Cloud & Infra',
    code: 'OPS_SYS_AWS_HETZ',
    budget: 1500.00,
    spent: 1420.00,
    percentage: 94.6,
    statusBadge: '94% BURNT',
    statusBadgeColor: 'red',
    subtextLeft: '⚠️ $80.00 Left',
    subtextRight: 'Est. overrun in 36h',
    iconName: 'server',
    isLocked: true,
    alertEnabled: true
  },
  {
    id: 'env-2',
    name: 'Dining & Sustenance',
    code: 'FOOD_GROCERY_DISCRET',
    budget: 1000.00,
    spent: 820.00,
    percentage: 82.0,
    statusBadge: '82% USED',
    statusBadgeColor: 'cyan',
    subtextLeft: '⏱ $180.00 Margin',
    subtextRight: 'Safe: $22.50/day',
    iconName: 'utensils',
    isLocked: false,
    alertEnabled: true
  },
  {
    id: 'env-3',
    name: 'SaaS & Tooling',
    code: 'RECUR_DEV_STACK',
    budget: 600.00,
    spent: 450.00,
    percentage: 75.0,
    statusBadge: '75% USED',
    statusBadgeColor: 'green',
    subtextLeft: '🛡 $150.00 Left',
    subtextRight: 'Predictable Burn',
    iconName: 'box',
    isLocked: false,
    alertEnabled: false
  },
  {
    id: 'env-4',
    name: 'Transit & Travel',
    code: 'COMMUTE_FLIGHT_TRANS',
    budget: 500.00,
    spent: 210.00,
    percentage: 42.0,
    statusBadge: '42% USED',
    statusBadgeColor: 'green',
    subtextLeft: '🛡 $290.00 Left',
    subtextRight: 'High Surplus',
    iconName: 'car',
    isLocked: false,
    alertEnabled: false
  }
];

const INITIAL_COMMITMENTS: ScheduledCommitment[] = [
  {
    id: 'com-1',
    title: 'Amazon Web Services EU-Central',
    recurrenceTag: 'RECUR_MONTHLY',
    scheduleText: 'EXEC: Oct 28 • 00:01 UTC • SRC: Treasury Main [USD]',
    amount: 724.80,
    statusTag: 'CLEARED_PREAUTH',
    statusColor: 'green',
    iconType: 'users',
    isActive: true
  },
  {
    id: 'com-2',
    title: 'GitHub Enterprise & Copilot Seats',
    recurrenceTag: 'RECUR_MONTHLY',
    scheduleText: 'EXEC: Oct 30 • 08:00 UTC • SRC: Corporate Operating [USD]',
    amount: 126.00,
    statusTag: 'QUEUE_STANDBY',
    statusColor: 'cyan',
    iconType: 'code',
    isActive: true
  },
  {
    id: 'com-3',
    title: 'HQ Pantry & Espresso Micro-Batch',
    recurrenceTag: 'DAILY_CRON',
    scheduleText: 'EXEC: Daily • 06:30 UTC • SRC: Petty Cash Buffer',
    amount: 14.50,
    statusTag: 'AUTO_RELEASE',
    statusColor: 'green',
    iconType: 'coffee',
    isActive: true
  },
  {
    id: 'com-4',
    title: '1Password Vault Protocol',
    recurrenceTag: 'ANNUAL_INSTALLMENT',
    scheduleText: 'EXEC: Nov 04 • 12:00 UTC • SRC: Treasury Main [USD]',
    amount: 19.99,
    statusTag: 'SCHEDULED',
    statusColor: 'cyan',
    iconType: 'shield',
    isActive: true
  }
];

const INITIAL_RULES: HeuristicRule[] = [
  {
    id: 'rule-1',
    title: 'Overdraft Quarantine',
    description: 'Rejects single transactions exceeding $250 if residual category margin is under 10%.',
    icon: 'lock',
    isEnabled: true
  },
  {
    id: 'rule-2',
    title: 'Dynamic Surplus Roll',
    description: 'Transit surplus automatically sweeps to Cloud Infrastructure at T-48h to cycle end.',
    icon: 'refresh',
    isEnabled: true
  }
];

const LedgerContext = createContext<LedgerContextType | undefined>(undefined);

export const LedgerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<TabType>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(INITIAL_TRANSACTIONS[0]);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('AWS Cloud');
  const [typeFilter, setTypeFilter] = useState<'all' | 'debit' | 'credit' | 'transfer'>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('Last 7 Days');
  const [categoryFilter, setCategoryFilter] = useState('Categories (3)');
  const [vaultFilter, setVaultFilter] = useState('Mercury Vault');
  const [activeFilterTags, setActiveFilterTags] = useState([
    { key: 'type', label: 'Type', value: 'Debit' },
    { key: 'org', label: 'Org', value: 'Prod Core' }
  ]);

  // Account & Metric state
  const [selectedAccount, setSelectedAccount] = useState('Treasury Main [USD]');
  const [dailyDelta, setDailyDelta] = useState(184.50);
  const dailyMax = 250.00;
  const [cumulativeMtd, setCumulativeMtd] = useState(2840.10);
  const velocityHourly = 14.20;
  const [safeRemainder, setSafeRemainder] = useState(65.50);

  // Budgets & Rules
  const [categoryEnvelopes, setCategoryEnvelopes] = useState<CategoryEnvelope[]>(INITIAL_ENVELOPES);
  const [recurringCommitments, setRecurringCommitments] = useState<ScheduledCommitment[]>(INITIAL_COMMITMENTS);
  const [heuristicRules, setHeuristicRules] = useState<HeuristicRule[]>(INITIAL_RULES);
  const [areSubsDeprecated, setAreSubsDeprecated] = useState(false);

  // Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isCliOpen, setIsCliOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [isNewSubModalOpen, setIsNewSubModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  // Live time ticker
  const [currentUtcTime, setCurrentUtcTime] = useState(getLiveUtcTimeString());
  const [currentDateFormatted, setCurrentDateFormatted] = useState(getFormattedCurrentDate());

  // Sound
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  useEffect(() => {
    setIsSoundEnabled(soundFx.isEnabled());
    
    // Update live clock ticking
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentUtcTime(getLiveUtcTimeString(now));
      setCurrentDateFormatted(getFormattedCurrentDate(now));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: '94% Burn Alert: Cloud & Infra',
      message: 'Estimated overrun in 36 hours based on current autoscaling velocity.',
      time: '12m ago',
      type: 'alert',
      isRead: false
    },
    {
      id: 'notif-2',
      title: 'Disbursement Verified',
      message: 'AWS Cloud Infrastructure $124.80 cryptographically confirmed [TX-9904].',
      time: '24m ago',
      type: 'success',
      isRead: false
    },
    {
      id: 'notif-3',
      title: 'Ledger State Verified',
      message: 'Zero error nodes across 142 cleared entries.',
      time: '1h ago',
      type: 'info',
      isRead: true
    }
  ]);

  const setActiveTab = (tab: TabType) => {
    soundFx.playClick();
    setActiveTabState(tab);
  };

  const toggleSound = () => {
    const newState = soundFx.toggle();
    setIsSoundEnabled(newState);
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'statusTag' | 'isoTimestamp'>) => {
    soundFx.playCommit();
    const newId = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const nowIso = now.toISOString();
    
    const newTx: Transaction = {
      ...tx,
      timestamp: tx.timestamp || getUtcTimeOnly(now),
      fullDate: tx.fullDate || getUtcDateOnly(now),
      id: newId,
      statusTag: `CONFIRMED (${newId})`,
      isoTimestamp: nowIso,
      statusColor: 'green',
      preTax: tx.amount * 0.92,
      taxAmount: tx.amount * 0.08,
      taxLabel: 'ESTIMATED TAX JURIS (8.0%)',
      deductibilityStatus: '100% Operational Expense',
      invoiceNumber: `INV-${newId}-AUTO`,
      cryptoHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      splitAllocation: {
        departments: [
          { name: 'Core Operations', percentage: 100, amount: tx.amount }
        ]
      }
    };

    setTransactions(prev => [newTx, ...prev]);
    setSelectedTransaction(newTx);
    
    // Update metrics
    setDailyDelta(prev => +(prev + tx.amount).toFixed(2));
    setCumulativeMtd(prev => +(prev + tx.amount).toFixed(2));
    setSafeRemainder(prev => Math.max(0, +(prev - tx.amount).toFixed(2)));

    // Update envelope if matching category
    setCategoryEnvelopes(prev => prev.map(env => {
      if (env.name.toLowerCase().includes(tx.category.toLowerCase()) || tx.category.toLowerCase().includes(env.name.toLowerCase())) {
        const newSpent = +(env.spent + tx.amount).toFixed(2);
        const newPct = +((newSpent / env.budget) * 100).toFixed(1);
        return {
          ...env,
          spent: newSpent,
          percentage: newPct,
          statusBadge: `${Math.round(newPct)}% USED`
        };
      }
      return env;
    }));

    // Add notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Logged: ${tx.merchant}`,
        message: `Disbursement -$${tx.amount.toFixed(2)} dispatched to ${tx.category}.`,
        time: 'Just now',
        type: 'success',
        isRead: false
      },
      ...prev
    ]);
  };

  const updateSplitAllocation = (txId: string, split: SplitAllocation) => {
    soundFx.playBeep(900, 0.06);
    setTransactions(prev => prev.map(t => {
      if (t.id === txId) {
        return { ...t, splitAllocation: split };
      }
      return t;
    }));

    if (selectedTransaction?.id === txId) {
      setSelectedTransaction(prev => prev ? { ...prev, splitAllocation: split } : null);
    }
  };

  const reassignCategory = (txId: string, newCategory: string) => {
    soundFx.playClick();
    setTransactions(prev => prev.map(t => {
      if (t.id === txId) {
        return { ...t, category: newCategory };
      }
      return t;
    }));

    if (selectedTransaction?.id === txId) {
      setSelectedTransaction(prev => prev ? { ...prev, category: newCategory } : null);
    }
  };

  const disputeTransaction = (txId: string) => {
    soundFx.playBeep(440, 0.15, 'sawtooth');
    setTransactions(prev => prev.map(t => {
      if (t.id === txId) {
        return { ...t, statusTag: 'FLAGGED / DISPUTE_PENDING', statusColor: 'pink' };
      }
      return t;
    }));

    if (selectedTransaction?.id === txId) {
      setSelectedTransaction(prev => prev ? { ...prev, statusTag: 'FLAGGED / DISPUTE_PENDING', statusColor: 'pink' } : null);
    }

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Dispute Initiated: #${txId}`,
        message: `Cryptographic audit hold applied. Node freeze broadcast to ledger.`,
        time: 'Just now',
        type: 'alert',
        isRead: false
      },
      ...prev
    ]);
  };

  const updateEnvelopeLimit = (id: string, newLimit: number) => {
    soundFx.playClick();
    setCategoryEnvelopes(prev => prev.map(env => {
      if (env.id === id) {
        const newPct = +((env.spent / newLimit) * 100).toFixed(1);
        return {
          ...env,
          budget: newLimit,
          percentage: newPct,
          statusBadge: `${Math.round(newPct)}% USED`
        };
      }
      return env;
    }));
  };

  const addRecurringCommitment = (commitment: Omit<ScheduledCommitment, 'id'>) => {
    soundFx.playCommit();
    const newCom: ScheduledCommitment = {
      ...commitment,
      id: `com-${Date.now()}`
    };
    setRecurringCommitments(prev => [...prev, newCom]);
  };

  const toggleRule = (id: string) => {
    soundFx.playClick();
    setHeuristicRules(prev => prev.map(r => r.id === id ? { ...r, isEnabled: !r.isEnabled } : r));
  };

  const deprecateDormantSubs = () => {
    soundFx.playCommit();
    setAreSubsDeprecated(true);
    // Remove dormant subs or mark deprecated
    setRecurringCommitments(prev => prev.filter(c => !c.title.includes('DataDog') && !c.title.includes('Figma')));
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Killswitch Triggered: 2 Subscriptions Deprecated',
        message: 'DataDog APM and Figma Org seats terminated. Saved +$840.00/mo.',
        time: 'Just now',
        type: 'success',
        isRead: false
      },
      ...prev
    ]);
  };

  const removeFilterTag = (key: string) => {
    soundFx.playClick();
    setActiveFilterTags(prev => prev.filter(t => t.key !== key));
  };

  const resetAllFilters = () => {
    soundFx.playClick();
    setSearchQuery('');
    setTypeFilter('all');
    setActiveFilterTags([]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearNotifications = () => {
    soundFx.playClick();
    setNotifications([]);
  };

  return (
    <LedgerContext.Provider
      value={{
        activeTab,
        setActiveTab,
        transactions,
        selectedTransaction,
        setSelectedTransaction,
        addTransaction,
        updateSplitAllocation,
        reassignCategory,
        disputeTransaction,
        searchQuery,
        setSearchQuery,
        typeFilter,
        setTypeFilter,
        dateRangeFilter,
        setDateRangeFilter,
        categoryFilter,
        setCategoryFilter,
        vaultFilter,
        setVaultFilter,
        activeFilterTags,
        removeFilterTag,
        resetAllFilters,
        selectedAccount,
        setSelectedAccount,
        dailyDelta,
        dailyMax,
        cumulativeMtd,
        velocityHourly,
        safeRemainder,
        categoryEnvelopes,
        updateEnvelopeLimit,
        recurringCommitments,
        addRecurringCommitment,
        heuristicRules,
        toggleRule,
        deprecateDormantSubs,
        areSubsDeprecated,
        isExpenseModalOpen,
        setIsExpenseModalOpen,
        isCliOpen,
        setIsCliOpen,
        isExportModalOpen,
        setIsExportModalOpen,
        isNewCategoryModalOpen,
        setIsNewCategoryModalOpen,
        isNewSubModalOpen,
        setIsNewSubModalOpen,
        isRulesModalOpen,
        setIsRulesModalOpen,
        currentUtcTime,
        currentDateFormatted,
        isSoundEnabled,
        toggleSound,
        notifications,
        markNotificationRead,
        clearNotifications
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
};

export const useLedger = () => {
  const context = useContext(LedgerContext);
  if (!context) {
    throw new Error('useLedger must be used within a LedgerProvider');
  }
  return context;
};
