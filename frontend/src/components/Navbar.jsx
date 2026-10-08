import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="navbar">
      <div>
        <p className="navbar-brand">EduFlow Lite</p>
        <p className="navbar-subtitle">School management system</p>
      </div>
      <div className="navbar-user">
        <div>
          <strong>{user.name}</strong>
          <span>{user.role}</span>
        </div>
        <button className="button button-light" type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
