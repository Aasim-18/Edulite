import { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingState from '../../components/LoadingState';
import { downloadStudentMaterial, getStudentMaterial } from '../../services/studentService';
import { formatBytes, formatDate, getErrorMessage } from '../../utils/formatters';

export default function StudentMaterial() {
  const [materials, setMaterials] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getStudentMaterial().then(setMaterials).catch((loadError) => setError(getErrorMessage(loadError)));
  }, []);

  if (error) return <ErrorMessage message={error} />;
  if (!materials) return <LoadingState message="Loading study material..." />;

  return (
    <DashboardShell title="Study material" description="PDFs shared by your teachers.">
      {!materials.length ? (
        <EmptyState title="No study material yet" message="Your teachers have not uploaded any PDFs yet." />
      ) : (
        <div className="notes-grid">
          {materials.map((item) => (
            <article className="note-card" key={item.id}>
              <div className="note-card-heading">
                <div>
                  <span className="eyebrow">{item.className}</span>
                  <h2>{item.title}</h2>
                </div>
                <time>{formatDate(item.createdAt?.slice(0, 10))}</time>
              </div>
              <p>{item.fileName} · {formatBytes(item.fileSize)}</p>
              <span className="note-author">Posted by {item.teacherName}</span>
              <button
                className="button button-primary compact-button material-download"
                onClick={() => downloadStudentMaterial(item.id, item.fileName)}
                type="button"
              >
                Download PDF
              </button>
            </article>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}