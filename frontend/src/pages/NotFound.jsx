import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="page-shell">
      <p className="eyebrow">EduFlow Lite</p>
      <h1>Page not found</h1>
      <p className="intro">The page you requested does not exist.</p>
      <Link className="secondary-link" to="/">
        Go home
      </Link>
    </main>
  );
}
