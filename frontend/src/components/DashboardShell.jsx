export default function DashboardShell({ title, description, children }) {
  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>{title}</h1>
          <p className="dashboard-description">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
