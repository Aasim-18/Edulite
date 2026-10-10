import { formatCurrency } from '../utils/formatters';

// Change these two lines to your college name and address
const SCHOOL_NAME = 'EduFlow Lite';
const SCHOOL_ADDRESS = 'Knowledge Park, Noida, Uttar Pradesh';

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function twoDigitsToWords(number) {
  if (number < 20) return ONES[number];
  return `${TENS[Math.floor(number / 10)]}${number % 10 ? ` ${ONES[number % 10]}` : ''}`;
}

function threeDigitsToWords(number) {
  const hundreds = Math.floor(number / 100);
  const rest = number % 100;
  const hundredPart = hundreds ? `${ONES[hundreds]} Hundred` : '';
  if (hundreds && rest) return `${hundredPart} ${twoDigitsToWords(rest)}`;
  return hundredPart || twoDigitsToWords(rest);
}

// Indian numbering system: crore, lakh, thousand
function numberToWords(number) {
  if (number === 0) return 'Zero';
  const crore = Math.floor(number / 10000000);
  const lakh = Math.floor((number % 10000000) / 100000);
  const thousand = Math.floor((number % 100000) / 1000);
  const rest = number % 1000;
  const parts = [];
  if (crore) parts.push(`${numberToWords(crore)} Crore`);
  if (lakh) parts.push(`${twoDigitsToWords(lakh)} Lakh`);
  if (thousand) parts.push(`${twoDigitsToWords(thousand)} Thousand`);
  if (rest) parts.push(threeDigitsToWords(rest));
  return parts.join(' ');
}

function amountInWords(amount) {
  const value = Number(amount || 0);
  const rupees = Math.floor(value);
  const paise = Math.round((value - rupees) * 100);
  let words = `Rupees ${numberToWords(rupees)}`;
  if (paise) words += ` and ${twoDigitsToWords(paise)} Paise`;
  return `${words} Only`;
}

export default function FeeReceipt({ receipt, onClose }) {
  const printedOn = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="receipt-panel">
      <div className="receipt-heading">
        <p className="receipt-school">{SCHOOL_NAME}</p>
        <p className="receipt-address">{SCHOOL_ADDRESS}</p>
        <p className="receipt-title">Fee Receipt</p>
        <div className="receipt-numbers">
          <span><strong>Receipt No:</strong> {receipt.receiptId}</span>
          <span><strong>Date:</strong> {printedOn}</span>
        </div>
      </div>
      <div className="receipt-meta">
        <div><span>Student name</span><strong>{receipt.studentName}</strong></div>
        <div><span>Roll number</span><strong>{receipt.rollNumber}</strong></div>
        <div><span>Class</span><strong>{receipt.className}</strong></div>
        <div><span>Email</span><strong>{receipt.email}</strong></div>
      </div>
      <table className="receipt-table">
        <thead>
          <tr><th>Description</th><th className="amount-cell">Amount</th></tr>
        </thead>
        <tbody>
          <tr><td>Total fee</td><td className="amount-cell">{formatCurrency(receipt.totalAmount)}</td></tr>
          <tr><td>Paid amount</td><td className="amount-cell">{formatCurrency(receipt.paidAmount)}</td></tr>
          <tr><td>Pending amount</td><td className="amount-cell">{formatCurrency(receipt.pendingAmount)}</td></tr>
          <tr>
            <td>Status</td>
            <td className="amount-cell"><span className={`status-pill status-${receipt.status.toLowerCase()}`}>{receipt.status}</span></td>
          </tr>
        </tbody>
      </table>
      <p className="receipt-words"><strong>Amount in words:</strong> {amountInWords(receipt.totalAmount)}</p>
      <p className="receipt-thanks">Received with thanks</p>
      <div className="receipt-sign">
        <span>Prepared by</span>
        <span>Authorised signatory</span>
      </div>
      <div className="receipt-actions">
        <button className="button button-primary compact-button" onClick={() => window.print()} type="button">
          Print receipt
        </button>
        {onClose && <button className="button button-light compact-button" onClick={onClose} type="button">Close</button>}
      </div>
    </div>
  );
}
