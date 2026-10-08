import { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingState from '../../components/LoadingState';
import StatCard from '../../components/StatCard';
import {
  getStudentAttendanceSummary,
  getStudentFees,
  getStudentNotes,
  getStudentProfile,
} from '../../services/studentService';
import { formatCurrency, getErrorMessage } from '../../utils/formatters';

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [profile, attendance, fees, notes] = await Promise.all([
          getStudentProfile(),
          getStudentAttendanceSummary(),
          getStudentFees(),
          getStudentNotes(),
        ]);
        setData({ profile, attendance, fees, notes });
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      }
    }

    loadDashboard();
  }, []);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!data) {
    return <LoadingState message="Loading your dashboard..." />;
  }

  return (
    <DashboardShell
      title={`Welcome, ${data.profile.name}`}
      description="Here is a quick view of your academic and fee information."
    >
      <div className="profile-card">
        <div>
          <p className="eyebrow">Student profile</p>
          <h2>{data.profile.name}</h2>
          <p>{data.profile.email}</p>
        </div>
        <div className="profile-meta">
          <span><strong>Roll number</strong>{data.profile.rollNumber}</span>
          <span><strong>Class</strong>{data.profile.className}</span>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard
          label="Attendance"
          value={`${data.attendance.percentage}%`}
          detail={`${data.attendance.presentDays} present days`}
        />
        <StatCard
          label="Pending fees"
          value={formatCurrency(data.fees.pendingAmount)}
          detail={data.fees.status}
          accent="dark"
        />
        <StatCard
          label="Class notes"
          value={data.notes.length}
          detail="Available notes"
          accent="light"
        />
      </div>
    </DashboardShell>
  );
}
