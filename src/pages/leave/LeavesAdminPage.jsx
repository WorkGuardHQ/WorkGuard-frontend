// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';

// import {
//   getAllLeaves,
//   approveLeave,
//   rejectLeave,
//   cancelLeave
// } from '../../components/leave/services/leave.api';

// import LeaveCard from '../../components/leave/components/LeaveCard';
// import LeavePagination from '../../components/leave/components/LeavePagination';
// import Toast from '../../components/ui/Toast';

// /**
//  * ================================
//  * LeavesAdminPage
//  * ================================
//  * - Admin-only page
//  * - Backend-driven pagination
//  * - Filters: status
//  * - Actions: approve / reject / cancel
//  */
// function LeavesAdminPage() {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const [leaves, setLeaves] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // pagination (from backend)
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);

//   // filters
//   const [status, setStatus] = useState('');

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
//      Load leaves
//   ====================== */
//   const loadLeaves = async () => {
//     try {
//       setLoading(true);

//       const res = await getAllLeaves({
//         page,
//         limit: 10,
//         status
//       });

//       setLeaves(res.data.leaves || []);
//       setPages(res.data.pagination?.pages || 1);
//     } catch {
//       showToast(t('leave.loadError'), 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadLeaves();
//   }, [page, status]);

//   // reset page when filter changes
//   useEffect(() => {
//     setPage(1);
//   }, [status]);

//   /* ======================
//      Admin Actions
//   ====================== */
//   const handleApprove = async (id) => {
//     try {
//       await approveLeave(id);
//       showToast(t('leave.toastApproved'));
//       loadLeaves();
//     } catch {
//       showToast(t('leave.toastError'), 'error');
//     }
//   };

//   const handleReject = async (id) => {
//     const reason = prompt(t('leave.rejectReason'));
//     if (!reason) return;

//     try {
//       await rejectLeave(id, reason);
//       showToast(t('leave.toastRejected'));
//       loadLeaves();
//     } catch {
//       showToast(t('leave.toastError'), 'error');
//     }
//   };

//   const handleCancel = async (id) => {
//     setToast({
//       show: true,
//       type: 'warning',
//       message: t('leave.confirmCancel'),
//       onConfirm: async () => {
//         try {
//           await cancelLeave(id);
//           showToast(t('leave.toastCancelled'));
//           loadLeaves();
//         } catch {
//           showToast(t('leave.toastError'), 'error');
//         }
//       }
//     });
//   };

//   /* ======================
//      UI
//   ====================== */
//   return (
//     <div className="container py-4">

//       {/* ================= Header ================= */}
//       <div className="mb-4">
//         <h4 className="fw-semibold mb-1">
//           <i className="fa-solid fa-user-shield me-2 text-primary" />
//           {t('leave.admin.title')}
//         </h4>
//         <div className="text-muted small">
//           {t('leave.admin.subtitle')}
//         </div>
//       </div>

//       {/* ================= Filters ================= */}
//       <div className="card mb-4 shadow-sm">
//         <div className="card-body row g-3 align-items-end">

//           <div className="col-md-4">
//             <label className="form-label">
//               {t('leave.filter.status')}
//             </label>
//             <select
//               className="form-select"
//               value={status}
//               onChange={e => setStatus(e.target.value)}
//             >
//               <option value="">{t('all')}</option>
//               <option value="pending">{t('leave.statuses.pending')}</option>
//               <option value="approved">{t('leave.statuses.approved')}</option>
//               <option value="rejected">{t('leave.statuses.rejected')}</option>
//               <option value="cancelled">{t('leave.statuses.cancelled')}</option>
//             </select>
//           </div>

//         </div>
//       </div>

//       {/* ================= List ================= */}
//       {loading ? (
//         <div className="text-center py-5">
//           {t('loading')}...
//         </div>
//       ) : leaves.length === 0 ? (
//         <div className="alert alert-light text-center">
//           {t('leave.empty')}
//         </div>
//       ) : (
//         <>
//           {leaves.map(leave => (
//             <LeaveCard
//               key={leave._id}
//               leave={leave}
//               isAdmin
//               onApprove={handleApprove}
//               onReject={handleReject}
//               onCancel={handleCancel}
//               onOpenDetails={(id) => navigate(`/leaves/${id}`)}
              
//             />
//           ))}

//           {/* ================= Pagination ================= */}
//           <LeavePagination
//             page={page}
//             pages={pages}
//             onChange={setPage}
//           />
//         </>
//       )}

//       {/* ================= Toast ================= */}
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

// export default LeavesAdminPage;


//1
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  getAllLeaves,
  approveLeave,
  rejectLeave,
  cancelLeave
} from '../../services/Leave-services/leave.api';

import LeaveCard from '../../components/leave/components/LeaveCard';
import LeavePagination from '../../components/leave/components/LeavePagination';
import LeavePoliciesPage from '../LeavePoliciesPage';
import Toast from '../../components/ui/Toast';
import { isGlobalAdmin } from '../../helpers/auth';
/**
 * ================================
 * LeavesAdminPage
 * ================================
 * - Admin only
 * - Backend pagination
 * - Status filter
 * - Actions: approve / reject / cancel
 */
function LeavesAdminPage() {
  const { t } = useTranslation('leave');
const { t: tCommon } = useTranslation('translation');

  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // filters
  const [status, setStatus] = useState('');

  // toast
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
    onConfirm: null
  });

  const showToast = (message, type = 'success') =>
    setToast({ show: true, message, type, onConfirm: null });

  const closeToast = () =>
    setToast(t => ({ ...t, show: false, onConfirm: null }));

  /* ======================
     Load Leaves
  ====================== */
  const loadLeaves = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getAllLeaves({
        page,
        limit: 10,
        status
      });

      setLeaves(res.data.leaves || []);
      setPages(res.data.pagination?.pages || 1);
    } catch (err) {
      showToast(
        err?.response?.data?.message || t('leave.loadError'),
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [page, status, t]);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  useEffect(() => {
    setPage(1);
  }, [status]);

  /* ======================
     Admin Actions
  ====================== */
  // const handleApprove = async (id) => {
  //   if (actionLoading) return;

  //   try {
  //     setActionLoading(true);
  //     await approveLeave(id);
  //     showToast(t('leave.toastApproved'));
  //     loadLeaves();
  //   } catch (err) {
  //     showToast(
  //       err?.response?.data?.message || t('leave.toastError'),
  //       'error'
  //     );
  //   } finally {
  //     setActionLoading(false);
  //   }
  // };

const handleApprove = async (id) => {
  if (actionLoading) return;

  try {
    setActionLoading(true);
    const res = await approveLeave(id);

    // ✅ لو محتاج confirmation
    if (res.data?.requiresConfirmation) {
      const { lockedDays, message } = res.data;
      setToast({
        show: true,
        type: 'warning',
        message: `⚠️ ${message}\n\nLocked days: ${lockedDays.join(', ')}\n\nThese days will NOT be recalculated.`,
        onConfirm: async () => {
          try {
            setActionLoading(true);
            await approveLeave(id, { forceApprove: true });
            showToast(t('leave.toastApproved'));
            loadLeaves();
          } catch (err) {
            showToast(err?.response?.data?.message || t('leave.toastError'), 'error');
          } finally {
            setActionLoading(false);
          }
        }
      });
      return;
    }

    showToast(t('leave.toastApproved'));
    loadLeaves();
  } catch (err) {
    showToast(err?.response?.data?.message || t('leave.toastError'), 'error');
  } finally {
    setActionLoading(false);
  }
};

// const handleCancel = (id) => {
//   setToast({
//     show: true,
//     type: 'warning',
//     message: t('leave.confirmCancel'),
//     onConfirm: async () => {
//       try {
//         setActionLoading(true);
//         const res = await cancelLeave(id);

//         // ✅ لو محتاج confirmation
//         if (res.data?.requiresConfirmation) {
//           const { lockedDays, message } = res.data;
//           setToast({
//             show: true,
//             type: 'warning',
//             message: `⚠️ ${message}\n\nLocked days: ${lockedDays.join(', ')}\n\nThese days will NOT be recalculated.`,
//             onConfirm: async () => {
//               try {
//                 setActionLoading(true);
//                 await cancelLeave(id, { forceCancel: true });
//                 showToast(t('leave.toastCancelled'));
//                 loadLeaves();
//               } catch (err) {
//                 showToast(err?.response?.data?.message || t('leave.toastError'), 'error');
//               } finally {
//                 setActionLoading(false);
//               }
//             }
//           });
//           return;
//         }

//         showToast(t('leave.toastCancelled'));
//         loadLeaves();
//       } catch (err) {
//         showToast(err?.response?.data?.message || t('leave.toastError'), 'error');
//       } finally {
//         setActionLoading(false);
//       }
//     }
//   });
// };
// ─── في LeavesAdminPage ───

const handleCancel = (id) => {
  setToast({
    show: true,
    type: 'warning',
    message: t('leave.confirmCancel'),
    onConfirm: async () => {
      closeToast(); // ← أغلق التوست الأول الأول
      try {
        setActionLoading(true);
        const res = await cancelLeave(id);

        if (res.data?.requiresConfirmation) {
          const { lockedDays, message } = res.data;
          setToast({
            show: true,
            type: 'warning',
            message: `⚠️ ${message}\n\nLocked days: ${lockedDays.join(', ')}`,
            onConfirm: async () => {
              closeToast();
              try {
                setActionLoading(true);
                await cancelLeave(id, { forceCancel: true });
                showToast(t('leave.toastCancelled'));
                loadLeaves();
              } catch (err) {
                showToast(
                  err?.response?.data?.message || t('leave.toastError'),
                  'error'
                );
              } finally {
                setActionLoading(false);
              }
            }
          });
          return;
        }

        showToast(t('leave.toastCancelled'));
        loadLeaves();

      } catch (err) {
        // ✅ هنا بيظهر الـ message من الباك في التوست
        showToast(
          err?.response?.data?.message || t('leave.toastError'),
          'error'
        );
      } finally {
        setActionLoading(false);
      }
    }
  });
};

  const handleReject = async (id) => {
    const reason = prompt(t('leave.rejectReason'));
    if (!reason || actionLoading) return;

    try {
      setActionLoading(true);
      await rejectLeave(id, reason);
      showToast(t('leave.toastRejected'));
      loadLeaves();
    } catch (err) {
      showToast(
        err?.response?.data?.message || t('leave.toastError'),
        'error'
      );
    } finally {
      setActionLoading(false);
    }
  };

  // const handleCancel = (id) => {
  //   setToast({
  //     show: true,
  //     type: 'warning',
  //     message: t('leave.confirmCancel'),
  //     onConfirm: async () => {
  //       try {
  //         setActionLoading(true);
  //         await cancelLeave(id);
  //         showToast(t('leave.toastCancelled'));
  //         loadLeaves();
  //       } catch (err) {
  //         showToast(
  //           err?.response?.data?.message || t('leave.toastError'),
  //           'error'
  //         );
  //       } finally {
  //         setActionLoading(false);
  //       }
  //     }
  //   });
  // };

  /* ======================
     UI
  ====================== */
  return (
    <div className="container py-4">

      {/* Header */}
      {/* <div className="mb-4">
        <h4 className="fw-semibold mb-1">
          <i className="fa-solid fa-user-shield me-2 text-primary" />
          {t('leave.admin.title')}
        </h4>
        <div className="text-muted small">
          {t('leave.admin.subtitle')}
        </div>
      </div> */}
<div className="d-flex align-items-center justify-content-between mb-4">
  <div>
    <h4 className="fw-semibold mb-1">
      <i className="fa-solid fa-user-shield me-2 text-primary" />
      {t('leave.admin.title')}
    </h4>
    <div className="text-light small">
      {t('leave.admin.subtitle')}
    </div>
  </div>

  {/* 🔗 زر سياسات الإجازات */}

{isGlobalAdmin() && (
  <button
    className="btn btn-primary"
    onClick={() => navigate('/admin/leave-policies')}
  >
    <i className="fa-solid fa-gear me-2" />
    {t('leave.policies.manage')}
  </button>
)}

</div>
<button
  className="btn btn-outline-primary"
  onClick={() => navigate('/my-leaves')}
>
  <i className="fa-solid fa-umbrella-beach me-1" />
  {t('leave.my.title')}
</button>
      {/* Filters */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label">
              {t('leave.filter.status')}
            </label>
            <select
              className="form-select"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="">{tCommon('all')}</option>
              <option value="pending">{t('leave.statuses.pending')}</option>
              <option value="approved">{t('leave.statuses.approved')}</option>
              <option value="rejected">{t('leave.statuses.rejected')}</option>
              <option value="cancelled">{t('leave.statuses.cancelled')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-5">{tCommon('loading')}...</div>
      ) : leaves.length === 0 ? (
        <div className="alert alert-light text-center">
          {t('leave.empty')}
        </div>
      ) : (
        <>
          {leaves.map(leave => (
            <LeaveCard
              key={leave._id}
              leave={leave}
              isAdmin
              onApprove={handleApprove}
              onReject={handleReject}
              onCancel={handleCancel}
              onOpenDetails={(id) => navigate(`/leaves/${id}`)}
            />
          ))}

          <LeavePagination
            page={page}
            pages={pages}
            onChange={setPage}
          />
        </>
      )}

      {/* Toast */}
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

export default LeavesAdminPage;
