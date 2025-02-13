'use client';

import { FinancialRecordsProvider } from '@/app/contexts/financial-record-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FinancialRecordsProvider>
      {children}
    </FinancialRecordsProvider>
  );
}