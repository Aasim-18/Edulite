import { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import DataTable from '../../components/DataTable';
import ErrorMessage from '../../components/ErrorMessage';
import FeeReceipt from '../../components/FeeReceipt';
import LoadingState from '../../components/LoadingState';
import { createFee, getFeeReceipt, getFees, getStudents } from '../../services/adminService';
import { formatCurrency, getErrorMessage } from '../../utils/formatters';

export default function FeesPage() {
  const [fees, setFees] = useState(null);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', totalAmount: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [receiptError, setReceiptError] = useState('');

  async function load() {
    const [feeItems, studentItems] = await Promise.all([getFees(), getStudents()]);
    setFees(feeItems);
    setStudents(studentItems);
  }
  useEffect(() => { load().catch((loadError) => setError(getErrorMessage(loadError))); }, []);

  async function showReceipt(studentId) {
    setReceiptError('');
    setReceipt(null);
    try {
      setReceipt(await getFeeReceipt(studentId));
    } catch (loadError) {
      setReceiptError(getErrorMessage(loadError));
    }
  }

  async function submit(event) {
    event.preventDefault();
    try {
      await createFee({ studentId: Number(form.studentId), totalAmount: Number(form.totalAmount) });
      setForm({ studentId: '', totalAmount: '' });
      setMessage('Fee created successfully.');
      await load();
    } catch (saveError) { setError(getErrorMessage(saveError)); }
  }
  if (error && !fees) return <ErrorMessage message={error} />;
  if (!fees) return <LoadingState message="Loading fees..." />;
  return (
    <DashboardShell title="Fees" description="Create fee records and monitor outstanding balances.">
      {error && <div className="inline-error">{error}</div>}{message && <div className="inline-success">{message}</div>}
      <form className="record-form" onSubmit={submit}><h2>Create fee record</h2><div className="form-grid">
        <label>Student<select required value={form.studentId} onChange={(event) => setForm({ ...form, studentId: event.target.value })}><option value="">Select student</option>{students.map((item) => <option key={item.id} value={item.id}>{item.name} - {item.rollNumber}</option>)}</select></label>
        <label>Total amount<input required min="0.01" step="0.01" type="number" value={form.totalAmount} onChange={(event) => setForm({ ...form, totalAmount: event.target.value })} /></label>
      </div><button className="button button-primary compact-button" type="submit">Create fee</button></form>
      <DataTable columns={[{ key: 'studentName', label: 'Student' }, { key: 'rollNumber', label: 'Roll number' }, { key: 'totalAmount', label: 'Total', render: (row) => formatCurrency(row.totalAmount) }, { key: 'paidAmount', label: 'Paid', render: (row) => formatCurrency(row.paidAmount) }, { key: 'pendingAmount', label: 'Pending', render: (row) => formatCurrency(row.pendingAmount) }, { key: 'status', label: 'Status', render: (row) => <span className={`status-pill status-${row.status.toLowerCase()}`}>{row.status}</span> }, { key: 'actions', label: 'Actions', render: (row) => <button className="text-button" onClick={() => showReceipt(row.studentId)} type="button">Receipt</button> }]} rows={fees} />
      {receiptError && <div className="inline-error">{receiptError}</div>}
      {receipt && <FeeReceipt receipt={receipt} onClose={() => setReceipt(null)} />}
    </DashboardShell>
  );
}
