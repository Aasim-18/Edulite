export default function EmptyState({ title = 'Nothing here yet', message }) {
  return (
    <div className="state-card empty-state">
      <strong>{title}</strong>
      {message && <span>{message}</span>}
    </div>
  );
}
