import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

const navigationByRole = {
  ADMIN: [
    { label: 'Dashboard', to: '/admin', end: true },
    { label: 'Classes', to: '/admin/classes' },
    { label: 'Teachers', to: '/admin/teachers' },
    { label: 'Students', to: '/admin/students' },
    { label: 'Fees', to: '/admin/fees' },
    { label: 'Payments', to: '/admin/payments' },
  ],
  TEACHER: [
    { label: 'Dashboard', to: '/teacher', end: true },
    { label: 'Attendance', to: '/teacher/attendance' },
    { label: 'Notes', to: '/teacher/notes' },
  ],
  STUDENT: [
    { label: 'Dashboard', to: '/student', end: true },
    { label: 'Attendance', to: '/student/attendance' },
    { label: 'Fees', to: '/student/fees' },
    { label: 'Payments', to: '/student/payments' },
    { label: 'Notes', to: '/student/notes' },
  ],
};

function Navigation({ role, onNavigate }) {
  return (
    <nav className="sidebar-navigation" aria-label="Main navigation">
      {navigationByRole[role].map((item) => (
        <NavLink
          className={({ isActive }) =>
            isActive ? 'sidebar-link sidebar-link-active' : 'sidebar-link'
          }
          end={item.end}
          key={item.to}
          onClick={onNavigate}
          to={item.to}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <p className="brand-mark">EduFlow</p>
          <span className="brand-badge">Lite</span>
        </div>

        <div className="sidebar-user">
          <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
          <div>
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </div>
        </div>

        <Navigation role={user.role} />

        <button className="sidebar-logout" onClick={handleLogout} type="button">
          Log out
        </button>
      </aside>

      <div className="app-content">
        <header className="mobile-header">
          <div>
            <p className="brand-mark">EduFlow <span>Lite</span></p>
            <span>{user.role} portal</span>
          </div>
          <button className="button button-light" onClick={handleLogout} type="button">
            Log out
          </button>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
