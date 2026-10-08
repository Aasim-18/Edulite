export default function StatCard({ label, value, detail, accent = 'gold' }) {
  return (
    <article className={`stat-card stat-card-${accent}`}>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      {detail && <span className="stat-detail">{detail}</span>}
    </article>
  );
}
