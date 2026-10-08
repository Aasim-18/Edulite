import { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingState from '../../components/LoadingState';
import StatCard from '../../components/StatCard';
import { getAdminDashboard } from '../../services/adminService';
import { formatCurrency, getErrorMessage } from '../../utils/formatters';

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminDashboard().then(setDashboard).catch((loadError) => setError(getErrorMessage(loadError)));
  }, []);

  if (error) return <ErrorMessage message={error} />;
  if (!dashboard) return <LoadingState message="Loading admin dashboard..." />;

  return (
    <DashboardShell title="Admin dashboard" description="Monitor the main school operations from one place.">
      <div className="stat-grid">
        <StatCard label="Total students" value={dashboard.totalStudents} />
        <StatCard label="Total teachers" value={dashboard.totalTeachers} accent="dark" />
        <StatCard label="Today's attendance" value={`${dashboard.todayAttendancePercentage}%`} accent="light" />
        <StatCard label="Pending fees" value={formatCurrency(dashboard.pendingFees)} />
      </div>
    </DashboardShell>
  );
}
