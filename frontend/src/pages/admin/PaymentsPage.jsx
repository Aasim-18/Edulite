import { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import DataTable from '../../components/DataTable';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingState from '../../components/LoadingState';
import Modal from '../../components/Modal';
import { createPayment, getPayments, getStudents } from '../../services/adminService';
import { formatCurrency, formatDate, getErrorMessage } from '../../utils/formatters';

export default function PaymentsPage() {
  const [payments, setPayments] = useState(null);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', amount: '', paymentDate: new Date().toISOString().slice(0, 10), method: 'CASH' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  async function load() { const [paymentItems, studentItems] = await Promise.all([getPayments(), getStudents()]); setPayments(paymentItems); setStudents(studentItems); }
  useEffect(() => { load().catch((loadError) => setError(getErrorMessage(loadError))); }, []);
  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try { await createPayment({ ...form, studentId: Number(form.studentId), amount: Number(form.amount) }); setMessage('Payment recorded successfully.'); setForm({ ...form, studentId: '', amount: '' }); setShowForm(false); await load(); }
    catch (saveError) { setError(getErrorMessage(saveError)); }
    finally { setSaving(false); }
  }
  if (error && !payments) return <ErrorMessage message={error} />;
  if (!payments) return <LoadingState message="Loading payments..." />;
  return (
    <DashboardShell title="Payments" description="Record payments and review the payment history.">
      {error && <div className="inline-error">{error}</div>}{message && <div className="inline-success">{message}</div>}
      <div className="toolbar">
        <button className="button button-primary compact-button" onClick={() => setShowForm(true)} type="button">Record payment</button>
      </div>
      {showForm && (
        <Modal title="Record payment" onClose={() => setShowForm(false)}>
          <form className="record-form" onSubmit={submit}>
            <div className="form-grid">
              <label>Student<select required value={form.studentId} onChange={(event) => setForm({ ...form, studentId: event.target.value })}><option value="">Select student</option>{students.map((item) => <option key={item.id} value={item.id}>{item.name} - {item.rollNumber}</option>)}</select></label>
              <label>Amount<input required min="0.01" step="0.01" type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} /></label>
              <label>Payment date<input required type="date" value={form.paymentDate} onChange={(event) => setForm({ ...form, paymentDate: event.target.value })} /></label>
              <label>Method<select value={form.method} onChange={(event) => setForm({ ...form, method: event.target.value })}><option>CASH</option><option>UPI</option><option>CARD</option><option>NET_BANKING</option></select></label>
            </div>
            <button className="button button-primary compact-button" disabled={saving} type="submit">{saving ? 'Recording...' : 'Record payment'}</button>
          </form>
        </Modal>
      )}
      <DataTable columns={[{ key: 'paymentDate', label: 'Date', render: (row) => formatDate(row.paymentDate) }, { key: 'studentName', label: 'Student' }, { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) }, { key: 'method', label: 'Method' }, { key: 'receivedBy', label: 'Received by' }]} rows={payments} />
    </DashboardShell>
  );
}
