export default function ErrorMessage({ message = 'Something went wrong.' }) {
  return (
    <div className="state-card error-state" role="alert">
      {message}
    </div>
  );
}
