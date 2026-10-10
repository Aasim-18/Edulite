import { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingState from '../../components/LoadingState';
import Modal from '../../components/Modal';
import { createTeacherNote, getTeacherClasses, getTeacherNotes } from '../../services/teacherService';
import { formatDate, getErrorMessage } from '../../utils/formatters';

export default function TeacherNotes() {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState('');
  const [notes, setNotes] = useState(null);
  const [form, setForm] = useState({ title: '', content: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function loadNotes(id) {
    setNotes(await getTeacherNotes(id));
  }

  useEffect(() => {
    getTeacherClasses()
      .then((items) => {
        setClasses(items);
        if (items.length) {
          setClassId(String(items[0].id));
          return loadNotes(items[0].id);
        }
        setNotes([]);
      })
      .catch((loadError) => setError(getErrorMessage(loadError)));
  }, []);

  async function handleClassChange(event) {
    const id = event.target.value;
    setClassId(id);
    try {
      setNotes(await getTeacherNotes(id));
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await createTeacherNote({ classId: Number(classId), ...form });
      setForm({ title: '', content: '' });
      setShowForm(false);
      await loadNotes(classId);
      setMessage('Note posted successfully.');
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  if (!notes) return <LoadingState message="Loading notes..." />;
  if (error && !classes.length) return <ErrorMessage message={error} />;

  return (
    <DashboardShell title="Class notes" description="Post and review notes for your classes.">
      <div className="filter-bar">
        <label>
          Class
          <select value={classId} onChange={handleClassChange}>
            {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
      </div>
      {error && <div className="inline-error">{error}</div>}
      {message && <div className="inline-success">{message}</div>}
      <div className="toolbar">
        <button className="button button-primary compact-button" onClick={() => setShowForm(true)} type="button">Post a note</button>
      </div>
      {showForm && (
        <Modal title="Post a note" onClose={() => setShowForm(false)}>
          <form className="record-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>Title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
              <label className="full-field">Content<textarea required rows="4" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} /></label>
            </div>
            <button className="button button-primary compact-button" disabled={saving} type="submit">{saving ? 'Posting...' : 'Post note'}</button>
          </form>
        </Modal>
      )}
      {!notes.length ? <EmptyState title="No notes posted" /> : (
        <div className="notes-grid">
          {notes.map((note) => (
            <article className="note-card" key={note.id}>
              <div className="note-card-heading"><div><span className="eyebrow">{note.className}</span><h2>{note.title}</h2></div><time>{formatDate(note.createdAt?.slice(0, 10))}</time></div>
              <p>{note.content}</p>
            </article>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
