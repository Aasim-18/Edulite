import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div className="ui-empty-state">
      <span className="ui-empty-state-icon" aria-hidden="true">
        <Inbox size={20} />
      </span>
      <strong>{title}</strong>
      {message && <span>{message}</span>}
      {action}
    </div>
  );
}
