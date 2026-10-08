import { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import DataTable from '../../components/DataTable';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingState from '../../components/LoadingState';
import {
  editAttendance,
  getAttendance,
  getClassStudents,
  getTeacherClasses,
  markAttendance,
} from '../../services/teacherService';
import { getErrorMessage } from '../../utils/formatters';

const today = new Date().toISOString().slice(0, 10);

export default function TeacherAttendance() {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState('');
  const [date, setDate] = useState(today);
  const [students, setStudents] = useState([]);
  const [entries, setEntries] = useState({});
  const [marked, setMarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getTeacherClasses()
      .then((items) => {
        setClasses(items);
        if (items.length) setClassId(String(items[0].id));
      })
      .catch((loadError) => setError(getErrorMessage(loadError)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!classId || !date) return;
    async function loadRoster() {
      setLoading(true);
      try {
        const [roster, existing] = await Promise.all([
          getClassStudents(classId),
          getAttendance(classId, date),
        ]);
        const existingEntries = Object.fromEntries(existing.map((item) => [item.studentId, item.status]));
        setStudents(roster);
        setEntries(Object.fromEntries(roster.map((student) => [student.id, existingEntries[student.id] || 'PRESENT'])));
        setMarked(existing.length > 0);
        setError('');
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        setLoading(false);
      }
    }
    loadRoster();
  }, [classId, date]);

  function setStatus(studentId, status) {
    setEntries((current) => ({ ...current, [studentId]: status }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    const payload = {
      date,
      entries: students.map((student) => ({ studentId: student.id, status: entries[student.id] })),
    };
    try {
      if (marked) {
        await editAttendance(payload);
      } else {
        await markAttendance({ ...payload, classId: Number(classId) });
      }
      setMarked(true);
      setMessage('Attendance saved successfully.');
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  if (loading && !classes.length) return <LoadingState message="Loading classes..." />;
  if (error && !students.length && !classes.length) return <ErrorMessage message={error} />;

  return (
    <DashboardShell title="Attendance" description="Mark or edit attendance for a class and date.">
      <div className="filter-bar">
        <label>
          Class
          <select value={classId} onChange={(event) => setClassId(event.target.value)}>
            {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label>
          Date
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
      </div>
      {error && <div className="inline-error">{error}</div>}
      {message && <div className="inline-success">{message}</div>}
      {students.length ? (
        <form className="section-block" onSubmit={handleSubmit}>
          <DataTable
            columns={[
              { key: 'rollNumber', label: 'Roll number' },
              { key: 'name', label: 'Student' },
              {
                key: 'status',
                label: 'Status',
                render: (student) => (
                  <select value={entries[student.id]} onChange={(event) => setStatus(student.id, event.target.value)}>
                    <option value="PRESENT">Present</option>
                    <option value="ABSENT">Absent</option>
                    <option value="LATE">Late</option>
                  </select>
                ),
              },
            ]}
            rows={students}
          />
          <button className="button button-primary compact-button form-submit-button" disabled={saving} type="submit">
            {saving ? 'Saving...' : marked ? 'Update attendance' : 'Save attendance'}
          </button>
        </form>
      ) : (
        <div className="state-card">No students found for the selected class.</div>
      )}
    </DashboardShell>
  );
}
