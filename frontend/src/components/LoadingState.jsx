export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="state-card" role="status">
      <span className="loading-dot" />
      <span>{message}</span>
    </div>
  );
}
