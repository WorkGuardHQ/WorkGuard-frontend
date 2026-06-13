
// import { useState, useMemo, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';

// import { submitLeave, getMyBranches } from '../../components/leave/services/leave.api';
// import Toast from '../../components/ui/Toast';

// /**
//  * ================================
//  * SubmitLeavePage
//  * ================================
//  * - Employee submits new leave
//  * - Branch is REQUIRED
//  * - Uses /branches/mybranches (same logic as profile)
//  */
// function SubmitLeavePage() {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     leaveType: '',
//     startDate: '',
//     endDate: '',
//     reason: ''
//   });

//   const [branches, setBranches] = useState([]);
//   const [branchId, setBranchId] = useState('');
//   const [loading, setLoading] = useState(false);

//   const [toast, setToast] = useState({
//     show: false,
//     message: '',
//     type: 'success'
//   });

//   const showToast = (message, type = 'success') =>
//     setToast({ show: true, message, type });

//   const closeToast = () =>
//     setToast(t => ({ ...t, show: false }));

//   /* ======================
//      Load my branches
//   ====================== */
//   useEffect(() => {
//     getMyBranches()
//       .then(res => {
//         const list = res.data?.data || [];
//         setBranches(list);

//         // لو فرع واحد → auto select
//         if (list.length === 1) {
//           setBranchId(list[0]._id);
//         }
//       })
//       .catch(() => {
//         showToast(t('Failed to load branches'), 'error');
//       });
//   }, []);

//   /* ======================
//      Estimated days (UI only)
//   ====================== */
//   const estimatedDays = useMemo(() => {
//     if (!form.startDate || !form.endDate) return null;

//     const start = new Date(form.startDate);
//     const end = new Date(form.endDate);

//     if (isNaN(start) || isNaN(end)) return null;
//     if (end < start) return null;

//     const msPerDay = 24 * 60 * 60 * 1000;
//     return Math.floor((end - start) / msPerDay) + 1;
//   }, [form.startDate, form.endDate]);

//   /* ======================
//      Submit
//   ====================== */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!branchId) {
//       showToast(t('leave.form.branchRequired'), 'error');
//       return;
//     }

//     if (!form.leaveType || !form.startDate || !form.endDate) {
//       showToast(t('leave.form.required'), 'error');
//       return;
//     }

//     if (estimatedDays <= 0) {
//       showToast(t('leave.form.invalidDates'), 'error');
//       return;
//     }

//     try {
//       setLoading(true);

//       await submitLeave({
//         leaveType: form.leaveType,
//         startDate: form.startDate,
//         endDate: form.endDate,
//         reason: form.reason,
//         branchId
//       });

//       showToast(t('leave.toastSubmitted'));
//       setTimeout(() => navigate('/leaves'), 1200);

//     } catch (err) {
//       showToast(
//         err.response?.data?.message || t('leave.toastError'),
//         'error'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container py-4">

//       {/* Header */}
//       <div className="mb-4">
//         <h4 className="fw-semibold mb-1">
//           <i className="fa-solid fa-calendar-plus me-2 text-primary" />
//           {t('leave.submit.title')}
//         </h4>
//         <div className="text-muted small">
//           {t('leave.submit.subtitle')}
//         </div>
//       </div>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="card shadow-sm">
//         <div className="card-body row g-3">

//           {/* Leave Type */}
//           <div className="col-md-6">
//             <label className="form-label">{t('leave.type')}</label>
//             <select
//               className="form-select"
//               value={form.leaveType}
//               onChange={e =>
//                 setForm(f => ({ ...f, leaveType: e.target.value }))
//               }
//             >
//               <option value="">{t('select')}</option>
//               <option value="annual">{t('leave.types.annual')}</option>
//               <option value="sick">{t('leave.types.sick')}</option>
//               <option value="unpaid">{t('leave.types.unpaid')}</option>
//             </select>
//           </div>

//           {/* Branch */}
//           {branches.length === 1 && (
//             <div className="col-md-6">
//               <label className="form-label">{t('branch')}</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={branches[0].name}
//                 disabled
//               />
//             </div>
//           )}

//           {branches.length > 1 && (
//             <div className="col-md-6">
//               <label className="form-label">{t('branch')}</label>
//               <select
//                 className="form-select"
//                 value={branchId}
//                 onChange={e => setBranchId(e.target.value)}
//                 required
//               >
//                 <option value="">{t('select')}</option>
//                 {branches.map(b => (
//                   <option key={b._id} value={b._id}>
//                     {b.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {/* Start Date */}
//           <div className="col-md-3">
//             <label className="form-label">{t('leave.from')}</label>
//             <input
//               type="date"
//               className="form-control"
//               value={form.startDate}
//               onChange={e =>
//                 setForm(f => ({ ...f, startDate: e.target.value }))
//               }
//             />
//           </div>

//           {/* End Date */}
//           <div className="col-md-3">
//             <label className="form-label">{t('leave.to')}</label>
//             <input
//               type="date"
//               className="form-control"
//               value={form.endDate}
//               onChange={e =>
//                 setForm(f => ({ ...f, endDate: e.target.value }))
//               }
//             />
//           </div>

//           {/* Estimated Days */}
//           {estimatedDays && (
//             <div className="col-12">
//               <div className="alert alert-info py-2 mb-0">
//                 <i className="fa-solid fa-clock me-2" />
//                 {t('leave.estimatedDays')}:
//                 <strong className="ms-1">{estimatedDays}</strong>
//               </div>
//             </div>
//           )}

//           {/* Reason */}
//           <div className="col-12">
//             <label className="form-label">{t('leave.reason')}</label>
//             <textarea
//               className="form-control"
//               rows="3"
//               value={form.reason}
//               onChange={e =>
//                 setForm(f => ({ ...f, reason: e.target.value }))
//               }
//             />
//           </div>

//         </div>

//         {/* Actions */}
//         <div className="card-footer d-flex justify-content-end gap-2">
//           <button
//             type="button"
//             className="btn btn-outline-secondary"
//             onClick={() => navigate(-1)}
//           >
//             {t('cancel')}
//           </button>

//           <button
//             type="submit"
//             className="btn btn-primary"
//             disabled={loading}
//           >
//             {loading ? t('loading') : t('leave.submit.action')}
//           </button>
//         </div>
//       </form>

//       {/* Toast */}
//       <Toast
//         show={toast.show}
//         message={toast.message}
//         type={toast.type}
//         onClose={closeToast}
//       />
//     </div>
//   );
// }

// export default SubmitLeavePage;

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTodayString } from '../../helpers/dateHelpers';
import { calculateDays } from '../../helpers/dateHelpers';

import {
  submitLeave,
  getMyBranches
} from '../../services/Leave-services/leave.api';
import Toast from '../../components/ui/Toast';

/**
 * ================================
 * SubmitLeavePage
 * ================================
 * - Employee submits new leave
 * - Branch is REQUIRED
 * - Past dates blocked by backend (UI assists only)
 * - Holidays & balance validated by backend
 */
function SubmitLeavePage() {
  const { t } = useTranslation('leave');
const { t: tCommon } = useTranslation('translation');
  const navigate = useNavigate();

  /* ======================
     State
  ====================== */
  const [form, setForm] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState('');
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const selectedBranch = branches.find(b => b._id === branchId);
const branchTZ = selectedBranch?.timezone || 'UTC';

  /* ======================
     Toast helpers
  ====================== */
  const showToast = (message, type = 'success') =>
    setToast({ show: true, message, type });

  const closeToast = () =>
    setToast(t => ({ ...t, show: false }));

  /* ======================
     Load my branches
  ====================== */
  useEffect(() => {
    let mounted = true;

    getMyBranches()
      .then(res => {
        if (!mounted) return;

        const list =
          res.data?.data ||
          res.data?.branches ||
          [];

        setBranches(list);

        // Auto-select if only one branch
        if (list.length === 1) {
          setBranchId(list[0]._id);
        }
      })
      .catch(() => {
        showToast(t('leave.form.branchLoadFailed'), 'error');
      });

    return () => {
      mounted = false;
    };
  }, [t]);

  /* ======================
     Estimated days (UI only)
  ====================== */
  // const estimatedDays = useMemo(() => {
  //   if (!form.startDate || !form.endDate) return null;


  const estimatedDays = useMemo(() => {
  if (!form.startDate || !form.endDate) return null;

  return calculateDays(form.startDate, form.endDate, branchTZ);
}, [form.startDate, form.endDate, branchTZ]);

  //   const start = new Date(form.startDate);
  //   const end = new Date(form.endDate);

  //   if (isNaN(start) || isNaN(end)) return null;
  //   if (end < start) return null;

  //   const msPerDay = 24 * 60 * 60 * 1000;
  //   return Math.floor((end - start) / msPerDay) + 1;
  // }, [form.startDate, form.endDate]);

  /* ======================
     Disable submit (UX only)
  ====================== */
  const isSubmitDisabled =
    loading ||
    !branchId ||
    !form.leaveType ||
    !form.startDate ||
    !form.endDate ||
    !estimatedDays ||
    estimatedDays <= 0;

  /* ======================
     Submit handler
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      await submitLeave({
        leaveType: form.leaveType,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
        branchId
      });

      showToast(t('leave.toastSubmitted'), 'success');

      setTimeout(() => {
        navigate('/my-leaves');
      }, 1200);

    } catch (err) {
      showToast(
        err?.response?.data?.message ||
        t('leave.toastError'),
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     Render
  ====================== */
  return (
    <div className="container py-4">

      {/* ===== Header ===== */}
      <div className="mb-4">
        <h4 className="fw-semibold mb-1">
          <i className="fa-solid fa-calendar-plus me-2 text-primary" />
          {t('leave.submit.title')}
        </h4>
        <div className="text-muted small">
          {t('leave.submit.subtitle')}
        </div>
      </div>

      {/* ===== Form ===== */}
      <form onSubmit={handleSubmit} className="card shadow-sm">
        <div className="card-body row g-3">

          {/* Leave Type */}
          <div className="col-md-6">
            <label className="form-label">
              {t('leave.type')}
            </label>
            <select
              className="form-select"
              value={form.leaveType}
              onChange={e =>
                setForm(f => ({
                  ...f,
                  leaveType: e.target.value
                }))
              }
            >
              <option value="">
                {t('leave.selectLeaveType')}
              </option>
              <option value="annual">
                {t('leave.types.annual')}
              </option>
              <option value="sick">
                {t('leave.types.sick')}
              </option>
              <option value="unpaid">
                {t('leave.types.unpaid')}
              </option>
            </select>
          </div>

          {/* Branch (single) */}
          {branches.length === 1 && (
            <div className="col-md-6">
              <label className="form-label">
               
                {tCommon('branch')}
              </label>
              <input
                type="text"
                className="form-control"
                value={branches[0].name}
                disabled
              />
            </div>
          )}

          {/* Branch (multiple) */}
          {branches.length > 1 && (
            <div className="col-md-6">
              <label className="form-label">
                {tCommon('branch')}
              </label>
              <select
                className="form-select"
                value={branchId}
                onChange={e =>
                  setBranchId(e.target.value)
                }
                required
              >
                <option value="">
                  {t('leave.selectLeaveBranch')}
                </option>
                {branches.map(b => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Start Date */}
          <div className="col-md-3">
            <label className="form-label">
              {t('leave.from')}
            </label>
            <input
              type="date"
              className="form-control"
              value={form.startDate}
              //min={new Date().toISOString().slice(0, 10)}
min={getTodayString(branchTZ || 'UTC')}
// min={branchTZ ? getTodayString(branchTZ) : undefined}
              onChange={e =>
                setForm(f => ({
                  ...f,
                  startDate: e.target.value,
                  endDate:
                    f.endDate &&
                    f.endDate < e.target.value
                      ? ''
                      : f.endDate
                }))
              }
            />
          </div>

          {/* End Date */}
          <div className="col-md-3">
            <label className="form-label">
              {t('leave.to')}
            </label>
            <input
              type="date"
              className="form-control"
              value={form.endDate}
              min={form.startDate || undefined}
              onChange={e =>
                setForm(f => ({
                  ...f,
                  endDate: e.target.value
                }))
              }
            />
          </div>


<div className="form-text">
  <i className="fas fa-globe me-1"></i>
  Timezone: <strong>{branchTZ || '—'}</strong>
</div>

          {/* Estimated Days */}
          {estimatedDays && (
            <div className="col-12">
              <div className="alert alert-info py-2 mb-0">
                <i className="fa-solid fa-clock me-2" />
                {t('leave.estimatedDays')}:
                <strong className="ms-1">
                  {estimatedDays}
                </strong>
              </div>
            </div>
          )}

          {/* Reason */}
          <div className="col-12">
            <label className="form-label">
              {t('leave.reason')}
            </label>
            <textarea
              className="form-control"
              rows="3"
              value={form.reason}
              onChange={e =>
                setForm(f => ({
                  ...f,
                  reason: e.target.value
                }))
              }
            />
          </div>

        </div>

        {/* ===== Actions ===== */}
        <div className="card-footer d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            {t('cancel')}
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitDisabled}
          >
            {loading
              ? t('loading')
              : t('leave.submit.action')}
          </button>
        </div>
      </form>

      {/* ===== Toast ===== */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />
    </div>
  );
}

export default SubmitLeavePage;
