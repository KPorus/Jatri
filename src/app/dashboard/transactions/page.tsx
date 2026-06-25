'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Transaction } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { formatBDT, formatDateTime } from '@/lib/utils';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/bookings/transactions')
      .then(({ data }) => setTransactions(data.transactions))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-9 w-9" /></div>;

  return (
    <div id="transactions-page">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transaction History</h1>

      {transactions.length === 0 ? (
        <p className="py-16 text-center text-slate-500">No transactions yet.</p>
      ) : (
        <Card className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 font-medium">Transaction ID</th>
                <th className="px-4 py-3 font-medium">Ticket</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-400">{t.transactionId}</td>
                  <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{t.ticketTitle}</td>
                  <td className="px-4 py-3 font-semibold text-brand-600 dark:text-brand-400">{formatBDT(t.amount)}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{formatDateTime(t.paymentDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
