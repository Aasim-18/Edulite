export const mockUsers = [
  {
    id: 1,
    name: 'Ava Admin',
    email: 'admin@test.com',
    role: 'ADMIN',
  },
  {
    id: 2,
    name: 'Tara Teacher',
    email: 'teacher@test.com',
    role: 'TEACHER',
  },
  {
    id: 3,
    name: 'Sam Student',
    email: 'student@test.com',
    role: 'STUDENT',
  },
];

export const mockLoginResponse = (user) => ({
  token: `mock-token-${user.role.toLowerCase()}`,
  user,
});

export const mockDashboardCards = {
  ADMIN: ['Total students', 'Total teachers', 'Pending fees'],
  TEACHER: ['Assigned classes', "Today's attendance", 'Uploaded notes'],
  STUDENT: ['Attendance percentage', 'Fee status', 'Available notes'],
};
