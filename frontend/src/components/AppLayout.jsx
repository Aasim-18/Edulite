import { useState } from 'react';
import {
  BookOpen,
  CalendarCheck,
  CreditCard,
  Receipt,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  StickyNote,
  Users,
  X,
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

const navigationByRole = {
  ADMIN: [
    { label: 'Dashboard', to: '/admin', end: true, icon: LayoutDashboard },
    { label: 'Classes', to: '/admin/classes', icon: BookOpen },
    { label: 'Teachers', to: '/admin/teachers', icon: GraduationCap },
    { label: 'Students', to: '/admin/students', icon: Users },
    { label: 'Fees', to: '/admin/fees', icon: Receipt },
    { label: 'Payments', to: '/admin/payments', icon: CreditCard },
  ],
  TEACHER: [
    { label: 'Dashboard', to: '/teacher', end: true, icon: LayoutDashboard },
    { label: 'Attendance', to: '/teacher/attendance', icon: CalendarCheck },
    { label: 'Notes', to: '/teacher/notes', icon: StickyNote },
  ],
  STUDENT: [
    { label: 'Dashboard', to: '/student', end: true, icon: LayoutDashboard },
    { label: 'Attendance', to: '/student/attendance', icon: CalendarCheck },
    { label: 'Fees', to: '/student/fees', icon: Receipt },
    { label: 'Payments', to: '/student/payments', icon: CreditCard },
    { label: 'Notes', to: '/student/notes', icon: StickyNote },
  ],
};

function Navigation({ role, onNavigate }) {
  return (
    <nav className="sidebar-navigation" aria-label="Main navigation">
      {navigationByRole[role].map(({ icon: Icon, ...item }) => (
        <NavLink
          className={({ isActive }) =>
            isActive ? 'sidebar-link sidebar-link-active' : 'sidebar-link'
          }
          end={item.end}
          key={item.to}
          onClick={onNavigate}
          to={item.to}
        >
          <span className="sidebar-icon" aria-hidden="true">
            <Icon size={18} strokeWidth={1.75} />
          </span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className={`app-layout ${isSidebarOpen ? 'sidebar-is-open' : ''}`}>
      <button
        aria-label="Close navigation menu"
        className="sidebar-backdrop"
        onClick={() => setSidebarOpen(false)}
        type="button"
      />
      <aside className="sidebar" aria-label="Application sidebar">
        <div className="sidebar-header">
          <p className="brand-mark">EduFlow</p>
          <span className="brand-badge">Lite</span>
          <button
            aria-label="Close navigation menu"
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-user">
          <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
          <div>
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </div>
        </div>

        <Navigation role={user.role} onNavigate={() => setSidebarOpen(false)} />

        <button className="sidebar-logout" onClick={handleLogout} type="button">
          <LogOut size={18} aria-hidden="true" />
          Log out
        </button>
      </aside>

      <div className="app-content">
        <header className="mobile-header">
          <button
            aria-expanded={isSidebarOpen}
            aria-label="Open navigation menu"
            className="mobile-menu-button"
            onClick={() => setSidebarOpen(true)}
            type="button"
          >
            <Menu size={22} />
          </button>
          <div className="mobile-header-brand">
            <p className="brand-mark">EduFlow <span>Lite</span></p>
            <span>{user.role} portal</span>
          </div>
          <span className="mobile-header-spacer" aria-hidden="true" />
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
