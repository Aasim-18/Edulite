import { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import ErrorMessage from '../../components/ErrorMessage';
import FeeReceipt from '../../components/FeeReceipt';
import LoadingState from '../../components/LoadingState';
import StatCard from '../../components/StatCard';
import { getStudentFees, getStudentReceipt } from '../../services/studentService';
import { formatCurrency, getErrorMessage } from '../../utils/formatters';

export default function StudentFees() {
  const [fees, setFees] = useState(null);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [receiptError, setReceiptError] = useState('');

  useEffect(() => {
    getStudentFees().then(setFees).catch((loadError) => setError(getErrorMessage(loadError)));
  }, []);

  async function showReceipt() {
    setReceiptError('');
    setReceipt(null);
    try {
      setReceipt(await getStudentReceipt());
    } catch (loadError) {
      setReceiptError(getErrorMessage(loadError));
    }
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!fees) {
    return <LoadingState message="Loading fee details..." />;
  }

  const paidPercentage = fees.totalAmount
    ? Math.min((fees.paidAmount / fees.totalAmount) * 100, 100)
    : 0;

  return (
    <DashboardShell
      title="Fee status"
      description="View your total fee, payments made, and remaining balance."
    >
      <div className="stat-grid">
        <StatCard label="Total fee" value={formatCurrency(fees.totalAmount)} />
        <StatCard label="Paid amount" value={formatCurrency(fees.paidAmount)} accent="dark" />
        <StatCard label="Pending amount" value={formatCurrency(fees.pendingAmount)} accent="light" />
      </div>
      <div className="fee-summary-card">
        <div>
          <span className="stat-label">Current status</span>
          <strong className={`status-pill status-${fees.status.toLowerCase()}`}>{fees.status}</strong>
        </div>
        <div className="progress-track" aria-label={`Paid ${fees.paidAmount} of ${fees.totalAmount}`}>
          <span style={{ width: `${paidPercentage}%` }} />
        </div>
      </div>
      <div className="toolbar">
        <button className="button button-primary compact-button" onClick={showReceipt} type="button">
          Print receipt
        </button>
      </div>
      {receiptError && <div className="inline-error">{receiptError}</div>}
      {receipt && <FeeReceipt receipt={receipt} onClose={() => setReceipt(null)} />}
    </DashboardShell>
  );
}
