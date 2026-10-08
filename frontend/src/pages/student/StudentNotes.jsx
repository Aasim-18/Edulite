import { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingState from '../../components/LoadingState';
import { getStudentNotes } from '../../services/studentService';
import { formatDate, getErrorMessage } from '../../utils/formatters';

export default function StudentNotes() {
  const [notes, setNotes] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getStudentNotes().then(setNotes).catch((loadError) => setError(getErrorMessage(loadError)));
  }, []);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!notes) {
    return <LoadingState message="Loading class notes..." />;
  }

  return (
    <DashboardShell
      title="Class notes"
      description="Read notes and announcements shared by your teachers."
    >
      {!notes.length ? (
        <EmptyState title="No notes available" message="Your teachers have not posted any notes yet." />
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <article className="note-card" key={note.id}>
              <div className="note-card-heading">
                <div>
                  <span className="eyebrow">{note.className}</span>
                  <h2>{note.title}</h2>
                </div>
                <time>{formatDate(note.createdAt?.slice(0, 10))}</time>
              </div>
              <p>{note.content}</p>
              <span className="note-author">Posted by {note.teacherName}</span>
            </article>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
