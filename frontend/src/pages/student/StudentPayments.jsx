import { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import DataTable from '../../components/DataTable';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingState from '../../components/LoadingState';
import { getStudentPayments } from '../../services/studentService';
import { formatCurrency, formatDate, getErrorMessage } from '../../utils/formatters';

export default function StudentPayments() {
  const [payments, setPayments] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getStudentPayments().then(setPayments).catch((loadError) => setError(getErrorMessage(loadError)));
  }, []);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!payments) {
    return <LoadingState message="Loading payment history..." />;
  }

  return (
    <DashboardShell
      title="Payment history"
      description="Review all payments recorded against your fee account."
    >
      <DataTable
        columns={[
          { key: 'paymentDate', label: 'Date', render: (row) => formatDate(row.paymentDate) },
          { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) },
          { key: 'method', label: 'Method' },
          { key: 'receivedBy', label: 'Received by' },
        ]}
        rows={payments}
        emptyMessage="No payments have been recorded yet."
      />
    </DashboardShell>
  );
}
