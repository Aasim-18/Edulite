import { useEffect, useState } from 'react';
import { hasPendingRequests, subscribe } from '../services/requestProgress';

// Thin animated bar shown at the top while any API request is in flight.
// It disappears only after every request has finished, so a page's data is
// never hidden behind it once the frontend has received the response.
export default function LoadingBar() {
  const [loading, setLoading] = useState(hasPendingRequests());

  useEffect(() => subscribe(setLoading), []);

  if (!loading) return null;
  return <div className="app-loading-bar" role="status" aria-label="Loading" />;
}