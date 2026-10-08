import CrudPage from '../../components/CrudPage';
import { createTeacher, deleteTeacher, getTeachers, updateTeacher } from '../../services/adminService';

const fields = [
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
];

function renderField(field, form, onChange) {
  return <input name={field.name} required={field.name !== 'password' || !form.id} type={field.type || 'text'} value={form[field.name]} onChange={onChange} placeholder={field.name === 'password' && form.id ? 'Leave blank to keep current' : ''} />;
}

export default function TeachersPage() {
  return (
    <CrudPage
      title="Teachers"
      description="Manage teacher accounts and access."
      columns={[{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }]}
      loadItems={getTeachers}
      createItem={createTeacher}
      updateItem={updateTeacher}
      deleteItem={deleteTeacher}
      formFields={fields}
      initialForm={{ name: '', email: '', password: '' }}
      renderFormField={renderField}
      getEditForm={(item) => ({ id: item.id, name: item.name, email: item.email, password: '' })}
      getCreatePayload={(form) => ({ name: form.name, email: form.email, password: form.password })}
      getUpdatePayload={(form) => ({ name: form.name, email: form.email, ...(form.password ? { password: form.password } : {}) })}
    />
  );
}
