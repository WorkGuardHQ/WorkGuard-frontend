

// // src/components/ui/Toast.jsx
// import { useEffect, useRef } from 'react';
// import { Toast as BsToast } from 'bootstrap';

// function Toast({
//   show,
//   message,
//   type = 'success',
//   onClose,
//   onConfirm,
//   confirmText = 'Confirm',
//   cancelText = 'Cancel',
//   delay = 5000
// }) {
//   const toastRef = useRef(null);
//   const bsToast = useRef(null);

//   const onCloseRef = useRef(onClose);

//   useEffect(() => {
//     onCloseRef.current = onClose;
//   }, [onClose]);

//   useEffect(() => {
//     if (!toastRef.current) return;

//     const config = {
//       autohide: !onConfirm
//     };

//     if (!onConfirm) {
//       config.delay = delay;
//     }

//     bsToast.current = new BsToast(toastRef.current, config);

//     const el = toastRef.current;
//     const handleHidden = () => {
//       onCloseRef.current?.();
//     };

//     el.addEventListener('hidden.bs.toast', handleHidden);


//       if (show) {
//       bsToast.current.show();
//     }
    
//     return () => {
//       el.removeEventListener('hidden.bs.toast', handleHidden);

//       if (bsToast.current) {
//         bsToast.current.dispose();
//         bsToast.current = null;
//       }
//     };
//   }, [message, type, onConfirm, delay]);

//   useEffect(() => {
//     if (!toastRef.current) return;

//     if (show && bsToast.current) {
//       bsToast.current.show();
//     }
//   }, [show]);

//   const handleClose = () => {
//     bsToast.current?.hide();
//   };

//   // ---- Style-only additions below ----
//   const typeStyles = {
//     success: {
//       accent: '#198754',
//       bg: '#f0fdf4',
//       text: '#14532d',
//       icon: (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//           <circle cx="12" cy="12" r="10" fill="#198754" />
//           <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//         </svg>
//       )
//     },
//     error: {
//       accent: '#dc3545',
//       bg: '#fef2f2',
//       text: '#7f1d1d',
//       icon: (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//           <circle cx="12" cy="12" r="10" fill="#dc3545" />
//           <path d="M9 9l6 6M15 9l-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
//         </svg>
//       )
//     },
//     warning: {
//       accent: '#ffc107',
//       bg: '#fffbeb',
//       text: '#78350f',
//       icon: (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//           <circle cx="12" cy="12" r="10" fill="#ffc107" />
//           <path d="M12 7v6" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
//           <circle cx="12" cy="16.5" r="1" fill="#78350f" />
//         </svg>
//       )
//     }
//   };

//   const styles = typeStyles[type] || typeStyles.success;

//   return (
//     <div className="toast-container position-fixed bottom-0 end-0 p-3">
//       <div
//         ref={toastRef}
//         className="toast border-0"
//         style={{
//           backgroundColor: styles.bg,
//           borderLeft: `4px solid ${styles.accent}`,
//           borderRadius: '12px',
//           boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
//           overflow: 'hidden',
//           minWidth: '320px'
//         }}
//       >
//         <div className="toast-body p-3">
//           <div className="d-flex align-items-start gap-2">
//             <div className="mt-1">{styles.icon}</div>

//             <div className="flex-grow-1" style={{ color: styles.text }}>
//               <div className="mb-2" style={{ fontSize: '0.95rem', fontWeight: 500 }}>
//                 {message}
//               </div>

//               {onConfirm ? (
//                 <div className="d-flex justify-content-end gap-2 mt-2">
//                   <button
//                     className="btn btn-sm"
//                     style={{
//                       backgroundColor: 'transparent',
//                       border: `1px solid ${styles.accent}55`,
//                       color: styles.text,
//                       borderRadius: '8px',
//                       padding: '4px 14px'
//                     }}
//                     onClick={handleClose}
//                   >
//                     {cancelText}
//                   </button>
//                   <button
//                     className="btn btn-sm text-white"
//                     style={{
//                       backgroundColor: styles.accent,
//                       borderRadius: '8px',
//                       padding: '4px 14px',
//                       border: 'none'
//                     }}
//                     onClick={async () => {
//                       await onConfirm();
//                       bsToast.current?.hide();
//                     }}
//                   >
//                     {confirmText}
//                   </button>
//                 </div>
//               ) : null}
//             </div>

//             {!onConfirm && (
//               <button
//                 className="btn-close"
//                 style={{ fontSize: '0.7rem', opacity: 0.6 }}
//                 onClick={handleClose}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Toast;


// src/components/ui/Toast.jsx
import { useEffect, useRef } from 'react';
import { Toast as BsToast } from 'bootstrap';

function Toast({
  show,
  message,
  type = 'success',
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  delay = 5000
}) {
  const toastRef = useRef(null);
  const bsToast = useRef(null);

  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Single source of truth: (re)build the Bootstrap Toast instance and
  // decide whether to show it, all in one effect. Including `show` in the
  // dependency array avoids the previous bug where a second, separate
  // effect could call `.show()` on an instance built with stale
  // autohide/delay config (e.g. a leftover instance from a normal toast
  // being reused for a confirmation toast, or vice versa).
  useEffect(() => {
    if (!toastRef.current) return;

    const config = {
      autohide: !onConfirm,
      ...(!onConfirm ? { delay } : {}),
    };

    // bsToast.current = new BsToast(toastRef.current, config);

    BsToast.getInstance(toastRef.current)?.dispose();
    
    bsToast.current = new BsToast(toastRef.current, config);


    const el = toastRef.current;
    const handleHidden = () => {
      onCloseRef.current?.();
    };

    el.addEventListener('hidden.bs.toast', handleHidden);

    if (show) {
      bsToast.current.show();
    }

    return () => {
      el.removeEventListener('hidden.bs.toast', handleHidden);

      if (bsToast.current) {
        bsToast.current.dispose();
        bsToast.current = null;
      }
    };
  }, [message, type, onConfirm, delay, show]);

  const handleClose = () => {
    bsToast.current?.hide();
  };

  // ---- Style-only additions below ----
  const typeStyles = {
    success: {
      accent: '#198754',
      bg: '#f0fdf4',
      text: '#14532d',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#198754" />
          <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    error: {
      accent: '#dc3545',
      bg: '#fef2f2',
      text: '#7f1d1d',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#dc3545" />
          <path d="M9 9l6 6M15 9l-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    warning: {
      accent: '#ffc107',
      bg: '#fffbeb',
      text: '#78350f',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#ffc107" />
          <path d="M12 7v6" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16.5" r="1" fill="#78350f" />
        </svg>
      )
    }
  };

  const styles = typeStyles[type] || typeStyles.success;

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        ref={toastRef}
        className="toast border-0"
        style={{
          backgroundColor: styles.bg,
          borderLeft: `4px solid ${styles.accent}`,
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
          overflow: 'hidden',
          minWidth: '320px'
        }}
      >
        <div className="toast-body p-3">
          <div className="d-flex align-items-start gap-2">
            <div className="mt-1">{styles.icon}</div>

            <div className="flex-grow-1" style={{ color: styles.text }}>
              <div className="mb-2" style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                {message}
              </div>

              {onConfirm ? (
                <div className="d-flex justify-content-end gap-2 mt-2">
                  <button
                    className="btn btn-sm"
                    style={{
                      backgroundColor: 'transparent',
                      border: `1px solid ${styles.accent}55`,
                      color: styles.text,
                      borderRadius: '8px',
                      padding: '4px 14px'
                    }}
                    onClick={handleClose}
                  >
                    {cancelText}
                  </button>
                  <button
                    className="btn btn-sm text-white"
                    style={{
                      backgroundColor: styles.accent,
                      borderRadius: '8px',
                      padding: '4px 14px',
                      border: 'none'
                    }}
                    onClick={async () => {
                      await onConfirm();
                      bsToast.current?.hide();
                    }}
                  >
                    {confirmText}
                  </button>
                </div>
              ) : null}
            </div>

            {!onConfirm && (
              <button
                className="btn-close"
                style={{ fontSize: '0.7rem', opacity: 0.6 }}
                onClick={handleClose}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Toast;