import { apiClient } from './api';
import { saveBlob } from '../utils/download';

export async function getTeacherClasses() {
  const response = await apiClient.get('/teacher/classes');
  return response.data;
}

export async function getClassStudents(classId) {
  const response = await apiClient.get(`/teacher/classes/${classId}/students`);
  return response.data;
}

export async function getAttendance(classId, date) {
  const response = await apiClient.get('/teacher/attendance', { params: { classId, date } });
  return response.data;
}

export async function markAttendance(payload) {
  const response = await apiClient.post('/teacher/attendance', payload);
  return response.data;
}

export async function editAttendance(payload) {
  const response = await apiClient.put('/teacher/attendance', payload);
  return response.data;
}

export async function getTeacherNotes(classId) {
  const response = await apiClient.get(`/teacher/notes/${classId}`);
  return response.data;
}

export async function createTeacherNote(payload) {
  const response = await apiClient.post('/teacher/notes', payload);
  return response.data;
}

export async function getTeacherMaterial(classId) {
  const response = await apiClient.get('/teacher/material', { params: { classId } });
  return response.data;
}

export async function uploadTeacherMaterial({ classId, title, file }) {
  const formData = new FormData();
  formData.append('classId', Number(classId));
  formData.append('title', title);
  formData.append('file', file);
  const response = await apiClient.post('/teacher/material', formData);
  return response.data;
}

export async function downloadTeacherMaterial(id, fileName) {
  const response = await apiClient.get(`/teacher/material/${id}/download`, { responseType: 'blob' });
  saveBlob(response.data, fileName);
}

export async function getTeacherNotices() {
  const response = await apiClient.get('/teacher/notices');
  return response.data;
}
