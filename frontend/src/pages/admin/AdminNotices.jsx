import { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingState from '../../components/LoadingState';
import Modal from '../../components/Modal';
import { createAdminNotice, getAdminNotices } from '../../services/adminService';
import { formatDate, getErrorMessage } from '../../utils/formatters';

export default function AdminNotices() {
  const [notices, setNotices] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', audience: 'ALL' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminNotices().then(setNotices).catch((loadError) => setError(getErrorMessage(loadError)));
  }, []);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await createAdminNotice(form);
      setForm({ title: '', content: '', audience: 'ALL' });
      setShowForm(false);
      setNotices(await getAdminNotices());
      setMessage('Notice published.');
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  if (error && !notices) return <ErrorMessage message={error} />;
  if (!notices) return <LoadingState message="Loading notices..." />;

  return (
    <DashboardShell title="Notices" description="Publish announcements for students and teachers.">
      {error && <div className="inline-error">{error}</div>}
      {message && <div className="inline-success">{message}</div>}
      <div className="toolbar">
        <button className="button button-primary compact-button" onClick={() => setShowForm(true)} type="button">Post a notice</button>
      </div>
      {showForm && (
        <Modal title="Post a notice" onClose={() => setShowForm(false)}>
          <form className="record-form" onSubmit={submit}>
            <div className="form-grid">
              <label>Audience
                <select value={form.audience} onChange={(event) => setForm({ ...form, audience: event.target.value })}>
                  <option value="ALL">Everyone</option>
                  <option value="STUDENTS">Students only</option>
                  <option value="TEACHERS">Teachers only</option>
                </select>
              </label>
              <label>Title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
              <label className="full-field">Content<textarea required rows="4" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} /></label>
            </div>
            <button className="button button-primary compact-button" disabled={saving} type="submit">{saving ? 'Publishing...' : 'Publish notice'}</button>
          </form>
        </Modal>
      )}
      {!notices.length ? <EmptyState title="No notices published" /> : (
        <div className="notes-grid">
          {notices.map((notice) => (
            <article className="note-card" key={notice.id}>
              <div className="note-card-heading">
                <div>
                  <span className="eyebrow">{notice.audience === 'ALL' ? 'Everyone' : notice.audience === 'STUDENTS' ? 'Students' : 'Teachers'}</span>
                  <h2>{notice.title}</h2>
                </div>
                <time>{formatDate(notice.createdAt?.slice(0, 10))}</time>
              </div>
              <p>{notice.content}</p>
              <span className="note-author">Posted by {notice.authorName}</span>
            </article>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}