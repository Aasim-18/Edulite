import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event) {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password) {
      setError('Email and password are required.');
      return;
    }

    setIsLoading(true);

    try {
      const user = await login(form.email, form.password);
      navigate(`/${user.role.toLowerCase()}`, { replace: true });
    } catch (loginError) {
      setError(loginError.response?.data?.message || loginError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">EduFlow Lite</p>
        <h1>Sign in</h1>
        <p className="intro">Use a demo account to explore each role.</p>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Any password in mock mode"
          autoComplete="current-password"
        />

        {error && <p className="form-error">{error}</p>}

        <button className="button button-primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="demo-hint">
          Demo emails: admin@test.com, teacher@test.com, student@test.com
        </p>
      </form>
    </main>
  );
}
