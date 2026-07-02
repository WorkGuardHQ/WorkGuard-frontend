// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';

// import {
//   getMyLeaves,
//   cancelLeave
// } from '../../components/leave/services/leave.api';

// import LeaveCard from '../../components/leave/components/LeaveCard';
// import LeavePagination from '../../components/leave/components/LeavePagination';
// import Toast from '../../components/ui/Toast';

// /**
//  * ================================
//  * MyLeavesPage
//  * ================================
//  * - Employee view
//  * - Backend pagination
//  * - Status filtering
//  * - Cancel pending / future approved leaves
//  */
// function MyLeavesPage() {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const [leaves, setLeaves] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // pagination
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
//      Load my leaves
//   ====================== */
//   const loadLeaves = async () => {
//     try {
//       setLoading(true);

//       const res = await getMyLeaves({
//         page,
//         limit: 6,
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

//   useEffect(() => {
//     setPage(1);
//   }, [status]);

//   /* ======================
//      Cancel leave
//   ====================== */
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
//           <i className="fa-solid fa-umbrella-beach me-2 text-primary" />
//           {t('leave.my.title')}
//         </h4>
//         <div className="text-muted small">
//           {t('leave.my.subtitle')}
//         </div>
//       </div>

//       {/* ================= Filters ================= */}
//       <div className="card shadow-sm mb-4">
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

//           <div className="col-md-4 ms-auto text-end">
//             <button
//               className="btn btn-primary"
//               onClick={() => navigate('/request-leave')}
//             >
//               <i className="fa-solid fa-plus me-1" />
//               {t('leave.submit.action')}
//             </button>
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
//               isAdmin={false}
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

// export default MyLeavesPage;

import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  getMyLeaves,
  cancelLeave
} from '../../services/Leave-services/leave.api';

import LeaveCard from '../../components/leave/components/LeaveCard';
import LeavePagination from '../../components/leave/components/LeavePagination';
import Toast from '../../components/ui/Toast';

/**
 * ================================
 * MyLeavesPage
 * ================================
 * - Employee view ONLY
 * - Uses /leaves/my (backend-enforced ownership)
 * - Backend pagination
 * - Status filtering
 * - Cancel pending / approved leaves (rules enforced by backend)
 */
function MyLeavesPage() {
  const { t } = useTranslation('leave');
const { t: tCommon } = useTranslation('translation');
  const navigate = useNavigate();

  /* ======================
     State
  ====================== */
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // filters
  const [status, setStatus] = useState('');

  // toast (confirm-aware)
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
     Load my leaves
     (ownership enforced by backend)
  ====================== */
  const loadLeaves = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getMyLeaves({
        page,
        limit: 6,
        status
      });

      setLeaves(res.data?.leaves || []);
      setPages(res.data?.pagination?.pages || 1);

    } catch (err) {
      showToast(
        err?.response?.data?.message ||
        t('leave.loadError'),
        'error'
      );
      setLeaves([]);
      setPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, status, t]);

  /* ======================
     Effects
  ====================== */
  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  // reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [status]);

  /* ======================
     Cancel leave
     (rules validated by backend)
  ====================== */
  const handleCancel = (leaveId) => {
    setToast({
      show: true,
      type: 'warning',
      message: t('leave.confirmCancel'),
      onConfirm: async () => {
        try {
          await cancelLeave(leaveId);
          showToast(t('leave.toastCancelled'), 'success');
          loadLeaves();
        } catch (err) {
          showToast(
            err?.response?.data?.message ||
            t('leave.toastError'),
            'error'
          );
        }
      }
    });
  };

  /* ======================
     Render
  ====================== */
  return (
    <div className="container py-4">

      {/* ===== Header ===== */}
      <div className="mb-4">
        <h4 className="fw-semibold mb-1">
          <i className="fa-solid fa-umbrella-beach me-2 text-primary" />
          {t('leave.my.title')}
        </h4>
        <div className="text-muted small">
          {t('leave.my.subtitle')}
        </div>
      </div>

      {/* ===== Filters ===== */}
      <div className="card shadow-sm mb-4">
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
              <option value="">{t('all')}</option>
              <option value="pending">{t('leave.status.pending')}</option>
              <option value="approved">{t('leave.status.approved')}</option>
              <option value="rejected">{t('leave.status.rejected')}</option>
              <option value="cancelled">{t('leave.status.cancelled')}</option>
            </select>
          </div>

          <div className="col-md-4 ms-auto text-end">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/request-leave')}
            >
              <i className="fa-solid fa-plus me-1" />
              {t('leave.submit.action')}
            </button>
          </div>

        </div>
      </div>

      {/* ===== List ===== */}
      {loading ? (
        <div className="text-center py-5">
          {t('loading')}...
        </div>
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
              isAdmin={false}
              onCancel={handleCancel}
              onOpenDetails={(id) =>
                navigate(`/leaves/${id}`)
              }
            />
          ))}

          <LeavePagination
            page={page}
            pages={pages}
            onChange={setPage}
          />
        </>
      )}

      {/* ===== Toast ===== */}
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

export default MyLeavesPage;
