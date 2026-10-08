export default function ComingSoon({ title }) {
  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Workspace</p>
          <h1>{title}</h1>
          <p className="dashboard-description">
            This section will be connected to the backend in the next implementation task.
          </p>
        </div>
      </div>
      <div className="state-card">
        <strong>Coming next</strong>
        <span>The page structure is ready for its API-backed workflow.</span>
      </div>
    </section>
  );
}
