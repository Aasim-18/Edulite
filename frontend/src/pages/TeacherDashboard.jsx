import DashboardShell from '../components/DashboardShell';
import StatCard from '../components/StatCard';

export default function TeacherDashboard() {
  return (
    <DashboardShell
      title="Teacher Dashboard"
      description="Your teaching workspace will appear here."
    >
      <div className="stat-grid">
        <StatCard label="Assigned classes" value="--" detail="Loading from API" />
        <StatCard label="Today's attendance" value="--" detail="Loading from API" accent="dark" />
        <StatCard label="Uploaded notes" value="--" detail="Loading from API" accent="light" />
      </div>
    </DashboardShell>
  );
}
