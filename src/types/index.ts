export type TabType = 'dashboard' | 'ledger' | 'analytics' | 'budgets';

export interface SplitDepartment {
  name: string;
  percentage: number;
  amount: number;
}

export interface SplitAllocation {
  departments: SplitDepartment[];
}

export interface Transaction {
  id: string; // e.g. TX-9904
  timestamp: string; // e.g. '14:12:05 UTC'
  fullDate: string; // e.g. '2025-10-24'
  isoTimestamp: string; // e.g. '2025-10-24T14:12:05.419Z'
  merchant: string;
  category: string;
  categoryCode?: string;
  categoryBadgeColor?: string;
  amount: number; // positive number, rendered with -
  type: 'debit' | 'credit' | 'transfer';
  account: string; // e.g. 'Mercury #9824', 'Corporate Visa •••• 4092'
  accountType?: string;
  tags: string[];
  isReceiptAttached?: boolean;
  isAutoRenew?: boolean;
  statusTag: string; // 'CONFIRMED (TX-9904)', 'AUTO-RENEW', 'RECEIPT_ATTACHED', 'CONFIRMED (API_BILL)', 'RECURRING', 'CONFIRMED (TX-8831)'
  statusColor?: 'green' | 'cyan' | 'pink' | 'amber';
  iconType?: 'cloud' | 'figma' | 'coffee' | 'anthropic' | 'github' | 'cursor' | 'sushi' | 'transit' | 'generic';
  
  // Audit details
  preTax?: number;
  taxAmount?: number;
  taxLabel?: string;
  deductibilityStatus?: string;
  invoiceNumber?: string;
  cryptoHash?: string;
  splitAllocation?: SplitAllocation;
}

export interface CategoryEnvelope {
  id: string;
  name: string;
  code: string; // e.g. 'OPS_SYS_AWS_HETZ'
  budget: number;
  spent: number;
  percentage: number;
  statusBadge: string; // '94% BURNT', '82% USED', '75% USED', '42% USED'
  statusBadgeColor: 'red' | 'cyan' | 'green' | 'amber';
  subtextLeft: string; // '⚠️ $80.00 Left', '⏱ $180.00 Margin', etc.
  subtextRight: string; // 'Est. overrun in 36h', 'Safe: $22.50/day', etc.
  iconName: 'server' | 'utensils' | 'box' | 'car';
  isLocked?: boolean;
  alertEnabled?: boolean;
}

export interface ScheduledCommitment {
  id: string;
  title: string;
  recurrenceTag: 'RECUR_MONTHLY' | 'DAILY_CRON' | 'ANNUAL_INSTALLMENT';
  scheduleText: string; // 'EXEC: Oct 28 • 00:01 UTC • SRC: Treasury Main [USD]'
  amount: number;
  statusTag: 'CLEARED_PREAUTH' | 'QUEUE_STANDBY' | 'AUTO_RELEASE' | 'SCHEDULED';
  statusColor: 'green' | 'cyan' | 'pink';
  iconType: 'users' | 'code' | 'coffee' | 'shield';
  isActive: boolean;
}

export interface HeuristicRule {
  id: string;
  title: string;
  description: string;
  icon: 'lock' | 'refresh';
  isEnabled: boolean;
}

export interface HeatmapCell {
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
  timeSlot: '00:00 - 06:00' | '06:00 - 12:00' | '12:00 - 18:00' | '18:00 - 24:00';
  amount: number;
  txCount: number;
  isPeak?: boolean;
  tag?: string; // '[PEAK]', '[AWS]', '[DINING]'
  intensity: 'none' | 'low' | 'medium' | 'high' | 'surge';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'info' | 'success';
  isRead: boolean;
}
