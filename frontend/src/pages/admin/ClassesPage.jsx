import CrudPage from '../../components/CrudPage';
import { createClass, deleteClass, getClasses, updateClass } from '../../services/adminService';

const fields = [{ name: 'name', label: 'Class name' }];
const input = (field, form, onChange) => <input name={field.name} required value={form[field.name]} onChange={onChange} />;

export default function ClassesPage() {
  return (
    <CrudPage
      title="Classes"
      description="Create and maintain the classes used across the school."
      columns={[{ key: 'name', label: 'Class name' }, { key: 'createdAt', label: 'Created' }]}
      loadItems={getClasses}
      createItem={createClass}
      updateItem={updateClass}
      deleteItem={deleteClass}
      formFields={fields}
      initialForm={{ name: '' }}
      renderFormField={input}
      getEditForm={(item) => ({ name: item.name })}
      getCreatePayload={(form) => form}
      getUpdatePayload={(form) => form}
    />
  );
}
