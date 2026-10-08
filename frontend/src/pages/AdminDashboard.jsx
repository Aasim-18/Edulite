import DashboardShell from '../components/DashboardShell';
import StatCard from '../components/StatCard';

export default function AdminDashboard() {
  return (
    <DashboardShell
      title="Admin Dashboard"
      description="Manage the school and keep track of the main operations."
    >
      <div className="stat-grid">
        <StatCard label="Total students" value="--" detail="Loading from API" />
        <StatCard label="Total teachers" value="--" detail="Loading from API" accent="dark" />
        <StatCard label="Pending fees" value="--" detail="Loading from API" accent="light" />
      </div>
    </DashboardShell>
  );
}
