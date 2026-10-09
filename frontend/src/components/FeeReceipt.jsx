import { formatCurrency } from '../utils/formatters';

export default function FeeReceipt({ receipt, onClose }) {
  return (
    <div className="receipt-panel">
      <div className="receipt-heading">
        <div>
          <p className="eyebrow">EduFlow Lite</p>
          <h2>Fee Receipt</h2>
        </div>
        <strong>Receipt #{receipt.receiptId}</strong>
      </div>
      <div className="receipt-meta">
        <div><span>Student</span><strong>{receipt.studentName}</strong></div>
        <div><span>Roll number</span><strong>{receipt.rollNumber}</strong></div>
        <div><span>Class</span><strong>{receipt.className}</strong></div>
        <div><span>Email</span><strong>{receipt.email}</strong></div>
      </div>
      <table className="receipt-table">
        <tbody>
          <tr><th>Total fee</th><td>{formatCurrency(receipt.totalAmount)}</td></tr>
          <tr><th>Paid amount</th><td>{formatCurrency(receipt.paidAmount)}</td></tr>
          <tr><th>Pending amount</th><td>{formatCurrency(receipt.pendingAmount)}</td></tr>
          <tr>
            <th>Status</th>
            <td><span className={`status-pill status-${receipt.status.toLowerCase()}`}>{receipt.status}</span></td>
          </tr>
        </tbody>
      </table>
      <div className="receipt-actions">
        <button className="button button-primary compact-button" onClick={() => window.print()} type="button">
          Print receipt
        </button>
        {onClose && <button className="button button-light compact-button" onClick={onClose} type="button">Close</button>}
      </div>
    </div>
  );
}