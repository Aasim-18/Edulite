import { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import DataTable from '../../components/DataTable';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingState from '../../components/LoadingState';
import StatCard from '../../components/StatCard';
import { getStudentAttendance, getStudentAttendanceSummary } from '../../services/studentService';
import { formatDate, getErrorMessage } from '../../utils/formatters';

export default function StudentAttendance() {
  const [attendance, setAttendance] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAttendance() {
      try {
        const [attendanceData, summaryData] = await Promise.all([
          getStudentAttendance(),
          getStudentAttendanceSummary(),
        ]);
        setAttendance(attendanceData);
        setSummary(summaryData);
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      }
    }

    loadAttendance();
  }, []);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!attendance || !summary) {
    return <LoadingState message="Loading attendance..." />;
  }

  return (
    <DashboardShell
      title="Attendance"
      description="Review your attendance record and attendance percentage."
    >
      <div className="stat-grid">
        <StatCard label="Attendance percentage" value={`${summary.percentage}%`} />
        <StatCard label="Present days" value={summary.presentDays} accent="dark" />
        <StatCard label="Absent days" value={summary.absentDays} accent="light" />
      </div>
      <div className="section-block">
        <h2 className="section-title">Attendance history</h2>
        <DataTable
          columns={[
            { key: 'date', label: 'Date', render: (row) => formatDate(row.date) },
            { key: 'status', label: 'Status', render: (row) => <span className={`status-pill status-${row.status.toLowerCase()}`}>{row.status}</span> },
          ]}
          rows={attendance}
          emptyMessage="No attendance records are available."
        />
      </div>
    </DashboardShell>
  );
}
