import { useEffect, useState } from 'react';
import DashboardShell from './DashboardShell';
import DataTable from './DataTable';
import Modal from './Modal';
import PageState from './PageState';
import { getErrorMessage } from '../utils/formatters';

export default function CrudPage({
  title,
  description,
  columns,
  loadItems,
  createItem,
  updateItem,
  deleteItem,
  formFields,
  initialForm,
  renderFormField,
  getEditForm,
  getCreatePayload,
  getUpdatePayload,
  rowKey = 'id',
}) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function refresh() {
    setLoading(true);
    try {
      setItems(await loadItems());
      setError('');
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function startCreate() {
    setEditingId(null);
    setForm(initialForm);
    setMessage('');
    setFormOpen(true);
  }

  function startEdit(item) {
    setEditingId(item[rowKey]);
    setForm(getEditForm(item));
    setMessage('');
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(initialForm);
    setError('');
    setMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      if (editingId) {
        await updateItem(editingId, getUpdatePayload(form));
        setMessage('Record updated successfully.');
      } else {
        await createItem(getCreatePayload(form));
        setMessage('Record created successfully.');
      }
      setForm(initialForm);
      setEditingId(null);
      setFormOpen(false);
      await refresh();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete ${item.name || 'this record'}?`)) return;
    try {
      await deleteItem(item[rowKey]);
      setMessage('Record deleted successfully.');
      await refresh();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  }

  return (
    <DashboardShell title={title} description={description}>
      <div className="toolbar">
        <button className="button button-primary compact-button" onClick={startCreate} type="button">
          Add record
        </button>
      </div>
      {(message || error) && <div className={error ? 'inline-error' : 'inline-success'}>{error || message}</div>}
      <PageState loading={loading} error={error && !items.length ? error : ''}>
        <DataTable
          columns={[
            ...columns,
            {
              key: 'actions',
              label: 'Actions',
              render: (item) => (
                <div className="table-actions">
                  <button className="text-button" onClick={() => startEdit(item)} type="button">Edit</button>
                  <button className="text-button danger-text" onClick={() => handleDelete(item)} type="button">Delete</button>
                </div>
              ),
            },
          ]}
          rows={items}
          rowKey={rowKey}
        />
      </PageState>
      {formOpen && (
        <Modal title={editingId ? 'Edit record' : 'Add record'} onClose={closeForm}>
          <form className="record-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              {formFields.map((field) => (
                <label key={field.name}>
                  {field.label}
                  {renderFormField(field, form, updateField)}
                </label>
              ))}
            </div>
            <div className="form-actions">
              <button className="button button-primary compact-button" disabled={saving} type="submit">
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button className="button button-light compact-button" onClick={closeForm} type="button">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardShell>
  );
}
