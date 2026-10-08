import ErrorMessage from './ErrorMessage';
import LoadingState from './LoadingState';

export default function PageState({ loading, error, children }) {
  if (loading) {
    return <LoadingState message="Loading..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return children;
}
