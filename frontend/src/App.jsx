import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import StudentPortalDashboard from './pages/student/StudentDashboard';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentFees from './pages/student/StudentFees';
import StudentPayments from './pages/student/StudentPayments';
import StudentNotes from './pages/student/StudentNotes';
import StudentMaterial from './pages/student/StudentMaterial';
import StudentNotices from './pages/student/StudentNotices';
import TeacherAttendance from './pages/teacher/TeacherAttendance';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherNotes from './pages/teacher/TeacherNotes';
import TeacherMaterial from './pages/teacher/TeacherMaterial';
import TeacherNotices from './pages/teacher/TeacherNotices';
import AdminDashboard from './pages/admin/AdminDashboard';
import ClassesPage from './pages/admin/ClassesPage';
import TeachersPage from './pages/admin/TeachersPage';
import StudentsPage from './pages/admin/StudentsPage';
import FeesPage from './pages/admin/FeesPage';
import PaymentsPage from './pages/admin/PaymentsPage';
import AdminNotices from './pages/admin/AdminNotices';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/AuthContext';

function HomeRedirect() {
  const { user } = useAuth();

  return <Navigate replace to={user ? `/${user.role.toLowerCase()}` : '/login'} />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();

  return user ? <HomeRedirect /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="classes" element={<ClassesPage />} />
        <Route path="teachers" element={<TeachersPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="fees" element={<FeesPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="notices" element={<AdminNotices />} />
      </Route>
      <Route
        path="/teacher"
        element={
          <ProtectedRoute role="TEACHER">
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TeacherDashboard />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="notes" element={<TeacherNotes />} />
        <Route path="material" element={<TeacherMaterial />} />
        <Route path="notices" element={<TeacherNotices />} />
      </Route>
      <Route
        path="/student"
        element={
          <ProtectedRoute role="STUDENT">
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentPortalDashboard />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="fees" element={<StudentFees />} />
        <Route path="payments" element={<StudentPayments />} />
        <Route path="notes" element={<StudentNotes />} />
        <Route path="material" element={<StudentMaterial />} />
        <Route path="notices" element={<StudentNotices />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
