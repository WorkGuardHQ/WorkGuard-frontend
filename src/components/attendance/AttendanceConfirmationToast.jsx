// src/components/attendance/AttendanceConfirmationToast.jsx
//
// Pure React confirmation card for the Attendance page.
// Visually similar to the shared Bootstrap-based Toast (fixed bottom-right,
// rounded corners, shadow, warning/yellow accent) but rendered entirely
// with React state — no `bootstrap` Toast JS, no show()/hide()/dispose().
//
// This component is intentionally local to Attendance and does not touch
// or replace src/components/ui/Toast.jsx, which keeps handling all
// success/error toasts exactly as before.

function AttendanceConfirmationToast({
  show,
  message,
  confirmText = 'Continue',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) {
  if (!show) return null;

  return (
    <div
      className="position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1080 }}
    >
      <div
        role="alertdialog"
        aria-live="assertive"
        aria-atomic="true"
        style={{
          backgroundColor: '#fffbeb',
          borderLeft: '4px solid #ffc107',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
          overflow: 'hidden',
          minWidth: '320px',
          maxWidth: '90vw',
          padding: '1rem',
        }}
      >
        <div className="d-flex align-items-start gap-2">
          <div className="mt-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#ffc107" />
              <path
                d="M12 7v6"
                stroke="#78350f"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="16.5" r="1" fill="#78350f" />
            </svg>
          </div>

          <div className="flex-grow-1" style={{ color: '#78350f' }}>
            <div
              className="mb-2"
              style={{ fontSize: '0.95rem', fontWeight: 500 }}
            >
              {message}
            </div>

            <div className="d-flex justify-content-end gap-2 mt-2">
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #ffc10755',
                  color: '#78350f',
                  borderRadius: '8px',
                  padding: '4px 14px',
                }}
                onClick={onCancel}
              >
                {cancelText}
              </button>
              <button
                type="button"
                className="btn btn-sm text-white"
                style={{
                  backgroundColor: '#ffc107',
                  borderRadius: '8px',
                  padding: '4px 14px',
                  border: 'none',
                }}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceConfirmationToast;