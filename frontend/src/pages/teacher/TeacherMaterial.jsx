import { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingState from '../../components/LoadingState';
import Modal from '../../components/Modal';
import {
  downloadTeacherMaterial,
  getTeacherClasses,
  getTeacherMaterial,
  uploadTeacherMaterial,
} from '../../services/teacherService';
import { formatBytes, formatDate, getErrorMessage } from '../../utils/formatters';

export default function TeacherMaterial() {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState('');
  const [materials, setMaterials] = useState(null);
  const [form, setForm] = useState({ title: '', file: null });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function loadMaterials(id) {
    setMaterials(await getTeacherMaterial(id));
  }

  useEffect(() => {
    getTeacherClasses()
      .then((items) => {
        setClasses(items);
        if (items.length) {
          setClassId(String(items[0].id));
          return loadMaterials(items[0].id);
        }
        setMaterials([]);
      })
      .catch((loadError) => setError(getErrorMessage(loadError)));
  }, []);

  async function handleClassChange(event) {
    const id = event.target.value;
    setClassId(id);
    try {
      setMaterials(await getTeacherMaterial(id));
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.file) {
      setError('Please choose a PDF file to upload.');
      return;
    }
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await uploadTeacherMaterial({ classId: Number(classId), ...form });
      setForm({ title: '', file: null });
      setShowForm(false);
      await loadMaterials(classId);
      setMessage('Study material uploaded successfully.');
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  if (!materials) return <LoadingState message="Loading study material..." />;
  if (error && !classes.length) return <ErrorMessage message={error} />;

  return (
    <DashboardShell title="Study material" description="Upload PDF notes and share them with a class.">
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
        <button className="button button-primary compact-button" onClick={() => setShowForm(true)} type="button">Upload material</button>
      </div>
      {showForm && (
        <Modal title="Upload study material" onClose={() => setShowForm(false)}>
          <form className="record-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="full-field">Title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. Unit 3 notes" /></label>
              <label className="full-field">PDF file<input required type="file" accept=".pdf,application/pdf" onChange={(event) => setForm({ ...form, file: event.target.files[0] || null })} /></label>
            </div>
            <button className="button button-primary compact-button" disabled={saving} type="submit">{saving ? 'Uploading...' : 'Upload'}</button>
          </form>
        </Modal>
      )}
      {!materials.length ? <EmptyState title="No study material yet" message="Upload a PDF to share it with this class." /> : (
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
                onClick={() => downloadTeacherMaterial(item.id, item.fileName)}
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