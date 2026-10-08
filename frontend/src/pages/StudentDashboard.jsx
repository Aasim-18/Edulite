import DashboardShell from '../components/DashboardShell';
import StatCard from '../components/StatCard';

export default function StudentDashboard() {
  return (
    <DashboardShell
      title="Student Dashboard"
      description="Your attendance, fees, and learning resources will appear here."
    >
      <div className="stat-grid">
        <StatCard label="Attendance percentage" value="--" detail="Loading from API" />
        <StatCard label="Fee status" value="--" detail="Loading from API" accent="dark" />
        <StatCard label="Available notes" value="--" detail="Loading from API" accent="light" />
      </div>
    </DashboardShell>
  );
}
