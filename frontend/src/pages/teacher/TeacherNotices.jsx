import { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingState from '../../components/LoadingState';
import { getTeacherNotices } from '../../services/teacherService';
import { formatDate, getErrorMessage } from '../../utils/formatters';

export default function TeacherNotices() {
  const [notices, setNotices] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getTeacherNotices().then(setNotices).catch((loadError) => setError(getErrorMessage(loadError)));
  }, []);

  if (error) return <ErrorMessage message={error} />;
  if (!notices) return <LoadingState message="Loading notices..." />;

  return (
    <DashboardShell title="Notices" description="Announcements from the admin.">
      {!notices.length ? (
        <EmptyState title="No notices" message="There are no notices for you right now." />
      ) : (
        <div className="notes-grid">
          {notices.map((notice) => (
            <article className="note-card" key={notice.id}>
              <div className="note-card-heading">
                <div>
                  <span className="eyebrow">Notice</span>
                  <h2>{notice.title}</h2>
                </div>
                <time>{formatDate(notice.createdAt?.slice(0, 10))}</time>
              </div>
              <p>{notice.content}</p>
              <span className="note-author">By {notice.authorName}</span>
            </article>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}