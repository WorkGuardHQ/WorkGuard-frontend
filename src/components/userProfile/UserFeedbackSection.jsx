// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiGet, apiPost, apiPut, apiDelete } from '../../helpers/api';
// import Toast from '../ui/Toast';

// function UserFeedbackSection({ userId, isAdmin }) {
//   const { t } = useTranslation();

//   const [feedbacks, setFeedbacks] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // form state (admin)
//   const [form, setForm] = useState({
//     message: '',
//     isWarning: false,
//     visibleToEmployee: true
//   });

//   const [editingId, setEditingId] = useState(null);
// const [page, setPage] = useState(1);
// const [pages, setPages] = useState(1);

//   // toast
//   const [toast, setToast] = useState({
//     show: false,
//     message: '',
//     type: 'success',
//     onConfirm: null
//   });

//   const showToast = (message, type = 'success') =>
//     setToast({ show: true, message, type, onConfirm: null });

//   const closeToast = () =>
//     setToast(t => ({ ...t, show: false, onConfirm: null }));

//   /* ======================
//      Load Feedback
//   ====================== */
//   const loadFeedback = async () => {
//     try {
//       setLoading(true);
//       const res = await apiGet(
//   `/users/${userId}/feedback?page=${page}&limit=5`
// );

// setFeedbacks(res.data.data || []);
// setPages(res.data.pagination.pages || 1);
//     } catch {
//       setFeedbacks([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//  useEffect(() => {
//   loadFeedback();
// }, [userId, page]);

//   /* ======================
//      Add / Update
//   ====================== */
//   const submitFeedback = async () => {
//     if (!form.message.trim()) return;

//     try {
//       if (editingId) {
//         await apiPut(`/users/${userId}/feedback/${editingId}`, form);
//         showToast(t('feedback.toastUpdated'));
//       } else {
//         await apiPost(`/users/${userId}/feedback`, form);
//         showToast(t('feedback.toastAdded'));
//       }

//       setForm({
//         message: '',
//         isWarning: false,
//         visibleToEmployee: true
//       });
//       setEditingId(null);
//       loadFeedback();
//     } catch {
//       showToast(t('feedback.toastError'), 'error');
//     }
//   };

//   /* ======================
//      Delete
//   ====================== */
//   const confirmDelete = (feedbackId) => {
//     setToast({
//       show: true,
//       type: 'warning',
//       message: t('feedback.confirmDelete'),
//       onConfirm: async () => {
//         try {
//           await apiDelete(`/users/${userId}/feedback/${feedbackId}`);
//           showToast(t('feedback.toastDeleted'));
//           loadFeedback();
//         } catch {
//           showToast(t('feedback.toastError'), 'error');
//         }
//       }
//     });
//   };

//   return (
//     <div className="card shadow-sm mb-4">
//       <div className="card-header fw-semibold">
//         📝 {t('feedback.title')}
//       </div>

//       <div className="card-body">
//         {/* Admin form */}
//         {isAdmin && (
//           <div className="mb-4 border-bottom pb-3">
//             <textarea
//               className="form-control mb-2"
//               placeholder={t('feedback.placeholder')}
//               value={form.message}
//               onChange={e =>
//                 setForm(f => ({ ...f, message: e.target.value }))
//               }
//             />

//             <div className="d-flex gap-3 mb-2">
//               <div className="form-check">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   checked={form.isWarning}
//                   onChange={e =>
//                     setForm(f => ({ ...f, isWarning: e.target.checked }))
//                   }
//                 />
//                 <label className="form-check-label">
//                   {t('feedback.warning')}
//                 </label>
//               </div>

//               <div className="form-check">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   checked={form.visibleToEmployee}
//                   onChange={e =>
//                     setForm(f => ({
//                       ...f,
//                       visibleToEmployee: e.target.checked
//                     }))
//                   }
//                 />
//                 <label className="form-check-label">
//                   {t('feedback.visible')}
//                 </label>
//               </div>
//             </div>

//             <div className="d-flex gap-2">
//   <button
//     className="btn btn-primary btn-sm"
//     onClick={submitFeedback}
//   >
//     {editingId
//       ? t('feedback.update')
//       : t('feedback.add')}
//   </button>

//   {editingId && (
//     <button
//       className="btn btn-outline-secondary btn-sm"
//       onClick={() => {
//         setEditingId(null);
//         setForm({
//           message: '',
//           isWarning: false,
//           visibleToEmployee: true
//         });
//       }}
//     >
//       {t('feedback.cancel')}
//     </button>
//   )}
// </div>

//           </div>
//         )}

//         {/* List */}
//         {loading ? (
//           <div className="text-muted">{t('loading')}...</div>
//         ) : feedbacks.length === 0 ? (
//           <div className="text-muted">{t('feedback.empty')}</div>
//         ) : (
//           feedbacks.map(f => (
//             <div
//               key={f._id}
//               className={`alert ${
//                 f.isWarning ? 'alert-warning' : 'alert-secondary'
//               }`}
//             >
//               <div className="d-flex justify-content-between">
//                 <div>
//                   <div>{f.message}</div>

//                   <div className="small text-muted mt-1">
//                     {f.createdAt
//                       ? new Date(f.createdAt).toLocaleString()
//                       : ''}
//                   </div>

//                   {!f.visibleToEmployee && isAdmin && (
//                     <span className="badge bg-dark mt-1">
//                       {t('feedback.hidden')}
//                     </span>
//                   )}
//                 </div>

//                 {isAdmin && (
//                   <div className="d-flex gap-2">
//                     <button
//                       className="btn btn-sm btn-outline-secondary"
//                       onClick={() => {
//                         setEditingId(f._id);
//                         setForm({
//                           message: f.message,
//                           isWarning: f.isWarning,
//                           visibleToEmployee: f.visibleToEmployee
//                         });
//                       }}
//                     >

//                       ✏️
//                     </button>

//                     <button
//                       className="btn btn-sm btn-outline-danger"
//                       onClick={() => confirmDelete(f._id)}
//                     >
//                       🗑️
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       <Toast
//         show={toast.show}
//         message={toast.message}
//         type={toast.type}
//         onConfirm={toast.onConfirm}
//         onClose={closeToast}
//       />
//     </div>
//   );
// }

// export default UserFeedbackSection;


import { useEffect,useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  formatDisplayDate,
  formatDisplayTime
} from '../../helpers/timezone';

import {
  addFeedback,
  getUserFeedbacks,
  updateFeedback,
  deleteFeedback
} from '../../services/feedback.api';

import Toast from '../ui/Toast';

function UserFeedbackSection({ userId, isAdmin ,timezone = 'UTC'}) {
  const { t } = useTranslation();
const formRef = useRef(null);
  /* ======================
     State
  ====================== */
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    message: '',
    isWarning: false,
    visibleToEmployee: true
  });

  const [editingId, setEditingId] = useState(null);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [onlyWarnings, setOnlyWarnings] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
    onConfirm: null
  });

  /* ======================
     Toast helpers
  ====================== */
  const showToast = (message, type = 'success') =>
    setToast({ show: true, message, type, onConfirm: null });

  const closeToast = () =>
    setToast(t => ({ ...t, show: false, onConfirm: null }));

  /* ======================
     Load feedback
  ====================== */
  const loadFeedback = async () => {
    try {
      setLoading(true);

   const res = await getUserFeedbacks(userId, {
  page,
  limit: 5,
  onlyWarnings
});

      setFeedbacks(res.data.data || []);
      setPages(res.data.pagination?.pages || 1);
    } catch {
      setFeedbacks([]);
      setPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, [userId, page, onlyWarnings]);

  useEffect(() => {
    setPage(1);
  }, [onlyWarnings]);

  /* ======================
     Add / Update
  ====================== */
  const submitFeedback = async () => {
    if (!form.message.trim()) return;

    try {
      if (editingId) {
          await updateFeedback(userId, editingId, form);

        showToast(t('feedback.toastUpdated'));
      } else {
          await addFeedback(userId, form);

        showToast(t('feedback.toastAdded'));
      }

      setForm({
        message: '',
        isWarning: false,
        visibleToEmployee: true
      });
      setEditingId(null);
      loadFeedback();
    } catch {
      showToast(t('feedback.toastError'), 'error');
    }
  };

  /* ======================
     Delete
  ====================== */
  const confirmDelete = (feedbackId) => {
    setToast({
      show: true,
      type: 'warning',
      message: t('feedback.confirmDelete'),
      onConfirm: async () => {
        try {
          await deleteFeedback(userId, feedbackId);
          showToast(t('feedback.toastDeleted'));
          loadFeedback();
        } catch {
          showToast(t('feedback.toastError'), 'error');
        }
      }
    });
  };

  /* ======================
     UI
  ====================== */
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header fw-semibold">
        📝 {t('feedback.title')}
      </div>

      <div className="card-body">
        {/* Admin Form */}
        {isAdmin && (
           <div
    ref={formRef}
    className={`mb-4 border-bottom pb-3 ${
      editingId ? 'bg-light p-3 rounded' : ''
    }`}
  >
            <textarea
              className="form-control mb-2"
              placeholder={t('feedback.placeholder')}
              value={form.message}
              onChange={e =>
                setForm(f => ({ ...f, message: e.target.value }))
              }
            />

            <div className="d-flex gap-3 mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={form.isWarning}
                  onChange={e =>
                    setForm(f => ({ ...f, isWarning: e.target.checked }))
                  }
                />
                <label className="form-check-label">
                  {t('feedback.warning')}
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={form.visibleToEmployee}
                  onChange={e =>
                    setForm(f => ({
                      ...f,
                      visibleToEmployee: e.target.checked
                    }))
                  }
                />
                <label className="form-check-label">
                  {t('feedback.visible')}
                </label>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={submitFeedback}
              >
                {editingId ? t('feedback.update') : t('feedback.add')}
              </button>

              {editingId && (
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setEditingId(null);
                    setForm({
                      message: '',
                      isWarning: false,
                      visibleToEmployee: true
                    });
                  }}
                >
                  {t('feedback.cancel')}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filter */}
        {isAdmin && (
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={onlyWarnings}
              onChange={e => setOnlyWarnings(e.target.checked)}
              id="onlyWarnings"
            />
            <label className="form-check-label" htmlFor="onlyWarnings">
              {t('feedback.onlyWarnings')}
            </label>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="text-muted">{t('loading')}...</div>
        ) : feedbacks.length === 0 ? (
          <div className="text-muted">{t('feedback.empty')}</div>
        ) : (
          feedbacks.map(f => (
            <div
              key={f._id}
              className={`alert ${
                f.isWarning ? 'alert-warning' : 'alert-secondary'
              }`}
            >
              <div className="d-flex justify-content-between">
                <div>
                  <div>{f.message}</div>

                  {/* <div className="small text-muted mt-1">
                    {f.createdAt
                      ? new Date(f.createdAt).toLocaleString()
                      : ''}
                  </div> */}
<div className="small text-muted mt-1">

  {f.createdAt && (
    <>
      {formatDisplayDate(
        f.createdAt,
        timezone
      )}

      {' • '}

      {formatDisplayTime(
        f.createdAt,
        timezone
      )}
    </>
  )}

  {f.isEdited && f.editedAt && (
    <div className="text-warning mt-1">

      <i className="fas fa-pen me-1" />

      {t('feedback.edited')}

      {' • '}

      {formatDisplayDate(
        f.editedAt,
        timezone
      )}

      {' • '}

      {formatDisplayTime(
        f.editedAt,
        timezone
      )}

    </div>
  )}

</div>
                  {!f.visibleToEmployee && isAdmin && (
                    <span className="badge bg-dark mt-1">
                      {t('feedback.hidden')}
                    </span>
                  )}
                </div>

                {isAdmin && (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        setEditingId(f._id);
                        setForm({
                          message: f.message,
                          isWarning: f.isWarning,
                          visibleToEmployee: f.visibleToEmployee
                        });
                          // ✨ scroll للفورم
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
                      }}
                    >
                      ✏️
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => confirmDelete(f._id)}
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="d-flex justify-content-center gap-2 mt-3">
            <button
              className="btn btn-outline-secondary btn-sm"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              ◀
            </button>

            <span className="align-self-center fw-semibold">
              {page} / {pages}
            </span>

            <button
              className="btn btn-outline-secondary btn-sm"
              disabled={page === pages}
              onClick={() => setPage(p => p + 1)}
            >
              ▶
            </button>
          </div>
        )}
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onConfirm={toast.onConfirm}
        onClose={closeToast}
      />
    </div>
  );
}

export default UserFeedbackSection;
