import { useEffect, useRef } from 'react';

// Reusable popup dialog for the add/edit record forms.
// Closes on Esc, backdrop click, or the close button; focuses the first
// text field when it opens.
//
// The effect runs only once on open. It must NOT depend on `onClose`: the
// parent passes a fresh inline function on every render, so depending on it
// would re-focus on every keystroke and steal the cursor out of the field
// being typed in (moving it to the first control in the form).
export default function Modal({ title, onClose, children }) {
  const contentRef = useRef(null);

  useEffect(() => {
    contentRef.current?.querySelector('input:not([type="file"]), textarea')?.focus();

    function onKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}