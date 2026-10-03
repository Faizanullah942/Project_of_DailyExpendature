import React from 'react';
import { LedgerFilterBar } from './LedgerFilterBar';
import { TransactionList } from './TransactionList';
import { AuditRecordInspector } from './AuditRecordInspector';

export const LedgerView: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Top Filter Bar & Summary */}
      <LedgerFilterBar />

      {/* Split Grid: Left Transactions List, Right Audit Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <TransactionList />
        </div>
        <div className="lg:col-span-5">
          <AuditRecordInspector />
        </div>
      </div>
    </div>
  );
};
