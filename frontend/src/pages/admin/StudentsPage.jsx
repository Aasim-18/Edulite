import CrudPage from '../../components/CrudPage';
import { createStudent, deleteStudent, getClasses, getStudents, updateStudent } from '../../services/adminService';
import { useEffect, useState } from 'react';

const fields = [
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'rollNumber', label: 'Roll number' },
  { name: 'classId', label: 'Class', type: 'select' },
];

export default function StudentsPage() {
  const [classes, setClasses] = useState([]);
  const [classError, setClassError] = useState('');
  useEffect(() => {
    getClasses().then(setClasses).catch((loadError) => setClassError(loadError.response?.data?.message || loadError.message));
  }, []);

  function renderField(field, form, onChange) {
    if (field.type === 'select') {
      return <select name={field.name} required value={form[field.name]} onChange={onChange}><option value="">Select class</option>{classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>;
    }
    return <input name={field.name} required={field.name !== 'password' || !form.id} type={field.type || 'text'} value={form[field.name]} onChange={onChange} placeholder={field.name === 'password' && form.id ? 'Leave blank to keep current' : ''} />;
  }

  return (
    <>
      {classError && <div className="inline-error">{classError}</div>}
      <CrudPage
        title="Students"
        description="Manage student records, classes, and roll numbers."
        columns={[{ key: 'name', label: 'Name' }, { key: 'rollNumber', label: 'Roll number' }, { key: 'className', label: 'Class' }, { key: 'email', label: 'Email' }]}
        loadItems={getStudents}
        createItem={createStudent}
        updateItem={updateStudent}
        deleteItem={deleteStudent}
        formFields={fields}
        initialForm={{ name: '', email: '', password: '', classId: '', rollNumber: '' }}
        renderFormField={renderField}
        getEditForm={(item) => ({ id: item.id, name: item.name, email: item.email, password: '', classId: item.classId, rollNumber: item.rollNumber })}
        getCreatePayload={(form) => ({ ...form, classId: Number(form.classId) })}
        getUpdatePayload={(form) => ({ name: form.name, email: form.email, classId: Number(form.classId), rollNumber: form.rollNumber })}
      />
    </>
  );
}
