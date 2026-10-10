import { apiClient } from './api';
import { saveBlob } from '../utils/download';

export async function getStudentProfile() {
  const response = await apiClient.get('/student/profile');
  return response.data;
}

export async function getStudentAttendance() {
  const response = await apiClient.get('/student/attendance');
  return response.data;
}

export async function getStudentAttendanceSummary() {
  const response = await apiClient.get('/student/attendance/summary');
  return response.data;
}

export async function getStudentFees() {
  const response = await apiClient.get('/student/fees');
  return response.data;
}

export async function getStudentPayments() {
  const response = await apiClient.get('/student/payments');
  return response.data;
}

export async function getStudentNotes() {
  const response = await apiClient.get('/student/notes');
  return response.data;
}

export async function getStudentReceipt() {
  const response = await apiClient.get('/student/receipt');
  return response.data;
}

export async function getStudentMaterial() {
  const response = await apiClient.get('/student/material');
  return response.data;
}

export async function downloadStudentMaterial(id, fileName) {
  const response = await apiClient.get(`/student/material/${id}/download`, { responseType: 'blob' });
  saveBlob(response.data, fileName);
}

export async function getStudentNotices() {
  const response = await apiClient.get('/student/notices');
  return response.data;
}
