import { apiClient } from './api';

async function get(path) {
  const response = await apiClient.get(path);
  return response.data;
}

async function create(path, payload) {
  const response = await apiClient.post(path, payload);
  return response.data;
}

async function update(path, payload) {
  const response = await apiClient.put(path, payload);
  return response.data;
}

export const getAdminDashboard = () => get('/admin/dashboard');
export const getClasses = () => get('/admin/classes');
export const createClass = (payload) => create('/admin/classes', payload);
export const updateClass = (id, payload) => update(`/admin/classes/${id}`, payload);
export const deleteClass = (id) => apiClient.delete(`/admin/classes/${id}`);
export const getTeachers = () => get('/admin/teachers');
export const createTeacher = (payload) => create('/admin/teachers', payload);
export const updateTeacher = (id, payload) => update(`/admin/teachers/${id}`, payload);
export const deleteTeacher = (id) => apiClient.delete(`/admin/teachers/${id}`);
export const getStudents = () => get('/admin/students');
export const createStudent = (payload) => create('/admin/students', payload);
export const updateStudent = (id, payload) => update(`/admin/students/${id}`, payload);
export const deleteStudent = (id) => apiClient.delete(`/admin/students/${id}`);
export const getFees = () => get('/admin/fees');
export const createFee = (payload) => create('/admin/fees', payload);
export const getPayments = (studentId) =>
  get(studentId ? `/admin/payments?studentId=${studentId}` : '/admin/payments');
export const createPayment = (payload) => create('/admin/payments', payload);
