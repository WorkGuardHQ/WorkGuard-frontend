// import { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { adjustLeaveBalance } from '../../../services/Leave-services/leave.api';
// /**
//  * ======================================================
//  * AdjustBalanceModal
//  * ======================================================
//  * - Admin only
//  * - Adjust annual / sick balances
//  * - Add or deduct days
//  * - Calls adjustLeaveBalance API
//  */
// function AdjustBalanceModal({
//   show,
//   onClose,
//   userId,
//   year,
//   onSubmit,
//   loading = false
// }) {
//   const { t } = useTranslation();

//   const [type, setType] = useState('annual'); // annual | sick
//   const [mode, setMode] = useState('add');   // add | deduct
//   const [days, setDays] = useState('');
//   const [reason, setReason] = useState('');

//   /* ======================
//      Reset on open
//   ====================== */
//   useEffect(() => {
//     if (show) {
//       setType('annual');
//       setMode('add');
//       setDays('');
//       setReason('');
//     }
//   }, [show]);

//   if (!show) return null;

//   const parsedDays = Number(days);

//   const isValid =
//     parsedDays > 0 &&
//     Number.isFinite(parsedDays) &&
//     reason.trim().length >= 3;


    
//   /* ======================
//      Submit
//   ====================== */
//   const handleSubmit = async () => {
//     if (!isValid || loading) return;

//     const payload = {
//       year,
//       type,
//       action: mode,          // add | deduct
//       days: parsedDays,
//       reason
//     };

//     await onSubmit(payload);
//     onClose();
//   };

//   return (
//     <div className="modal fade show d-block" tabIndex="-1">
//       <div className="modal-dialog modal-md modal-dialog-centered">
//         <div className="modal-content">

//           {/* ===== Header ===== */}
//           <div className="modal-header">
//             <h5 className="modal-title">
//               {t('leave.adjustBalance')}
//             </h5>
//             <button
//               type="button"
//               className="btn-close"
//               onClick={onClose}
//             />
//           </div>

//           {/* ===== Body ===== */}
//           <div className="modal-body">

//             {/* Leave Type */}
//             <div className="mb-3">
//               <label className="form-label">
//                 {t('leave.type')}
//               </label>
//               <select
//                 className="form-select"
//                 value={type}
//                 onChange={e => setType(e.target.value)}
//               >
//                 <option value="annual">
//                   {t('leave.types.annual')}
//                 </option>
//                 <option value="sick">
//                   {t('leave.types.sick')}
//                 </option>
//               </select>
//             </div>

//             {/* Action */}
//             <div className="mb-3">
//               <label className="form-label">
//                 {t('action')}
//               </label>
//               <select
//                 className="form-select"
//                 value={mode}
//                 onChange={e => setMode(e.target.value)}
//               >
//                 <option value="add">
//                   ➕ {t('add')}
//                 </option>
//                 <option value="deduct">
//                   ➖ {t('deduct')}
//                 </option>
//               </select>
//             </div>

//             {/* Days */}
//             <div className="mb-3">
//               <label className="form-label">
//                 {t('leave.days')}
//               </label>
//               <input
//                 type="number"
//                 min="1"
//                 className="form-control"
//                 value={days}
//                 onChange={e => setDays(e.target.value)}
//                 placeholder={t('leave.enterDays')}
//               />
//             </div>

//             {/* Reason */}
//             <div className="mb-3">
//               <label className="form-label">
//                 {t('reason')}
//               </label>
//               <textarea
//                 className="form-control"
//                 rows="3"
//                 value={reason}
//                 onChange={e => setReason(e.target.value)}
//                 placeholder={t('leave.adjustReason')}
//               />
//               <div className="form-text text-muted">
//                 {t('leave.adjustReasonHint')}
//               </div>
//             </div>

//             {/* Warning */}
//             {mode === 'deduct' && (
//               <div className="alert alert-warning small">
//                 <i className="fa-solid fa-triangle-exclamation me-1" />
//                 {t('leave.adjustDeductWarning')}
//               </div>
//             )}
//           </div>

//           {/* ===== Footer ===== */}
//           <div className="modal-footer">
//             <button
//               className="btn btn-secondary"
//               onClick={onClose}
//               disabled={loading}
//             >
//               {t('cancel')}
//             </button>

//             <button
//               className="btn btn-primary"
//               disabled={!isValid || loading}
//               onClick={handleSubmit}
//             >
//               {loading
//                 ? t('saving') + '...'
//                 : t('confirm')}
//             </button>
//           </div>

//         </div>
//       </div>

//       {/* backdrop */}
//       <div className="modal-backdrop fade show" />
//     </div>
//   );
// }

// export default AdjustBalanceModal;


















import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * ======================================================
 * AdjustBalanceModal
 * ======================================================
 * - Admin only
 * - Adjust annual / sick balances
 * - Add or deduct days
 */
function AdjustBalanceModal({
  show,
  onClose,
  userId,
  year,
  onSubmit,
  loading = false
}) {
const { t } = useTranslation('leave');
const { t: tCommon } = useTranslation('translation');


  const [type, setType] = useState('annual');
  const [mode, setMode] = useState('add');
  const [days, setDays] = useState('');
  const [reason, setReason] = useState('');

  /* ======================
     Reset on open
  ====================== */
  useEffect(() => {
    if (show) {
      setType('annual');
      setMode('add');
      setDays('');
      setReason('');
    }
  }, [show]);

  /* ======================
     Fix Modal Scroll / Freeze
  ====================== */
useEffect(() => {
  if (show) {
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  } else {
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');   // ← بدل ''
  }

  return () => {
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');   // ← بدل ''
  };
}, [show]);

  if (!show) return null;

  const parsedDays = Number(days);

  const isValid =
    parsedDays > 0 &&
    Number.isFinite(parsedDays) &&
    reason.trim().length >= 3;

  /* ======================
     Submit
  ====================== */
 const handleSubmit = async () => {
  if (!isValid || loading) return;

  const payload = {
   
    year,
    type,
    operation: mode,
    amount: parsedDays,
    reason
  };

  // console.log('SENDING 👉', payload);

  await onSubmit(payload); // 👈 الصح

  // onClose();
};

  return (
    <>
      {/* ================= Modal ================= */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ zIndex: 1055 }}
      >
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">

            {/* ===== Header ===== */}
            <div className="modal-header">
              <h5 className="modal-title">
                {t('leave.adjustBalance')}({year})
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              />
            </div>

            {/* ===== Body ===== */}
            <div className="modal-body">

              {/* Leave Type */}
              <div className="mb-3">
                <label className="form-label">
                  {t('leave.type')}
                </label>
                <select
                  className="form-select"
                  value={type}
                  onChange={e => setType(e.target.value)}
                >
                  <option value="annual">
                    {t('leave.types.annual')}
                  </option>
                  <option value="sick">
                    {t('leave.types.sick')}
                  </option>
                </select>
              </div>

              {/* Action */}
              <div className="mb-3">
                <label className="form-label">
                  {t('action')}
                </label>
                <select
                  className="form-select "
                  value={mode}
                  onChange={e => setMode(e.target.value)}
                >
                  <option value="add">
                    ➕ {t('add')}
                  </option>
                  <option value="deduct">
                    ➖ {t('deduct')}
                  </option>
                </select>
              </div>

              {/* Days */}
              <div className="mb-3">
                <label className="form-label">
                  {t('leave.days')}
                </label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={days}
                  onChange={e => setDays(e.target.value)}
                  placeholder={t('leave.enterDays')}
                />
              </div>

              {/* Reason */}
              <div className="mb-3">
                <label className="form-label">
                  {t('reason')}
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder={t('leave.adjustReason')}
                />
                <div className="form-text text-muted">
                  {t('leave.adjustReasonHint')}
                </div>
              </div>

              {/* Warning */}
              {mode === 'deduct' && (
                <div className="alert alert-warning small">
                  <i className="fa-solid fa-triangle-exclamation me-1" />
                  {t('leave.adjustDeductWarning')}
                </div>
              )}

            </div>

            {/* ===== Footer ===== */}
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                {t('cancel')}
              </button>

              <button
                className="btn btn-primary"
                disabled={!isValid || loading}
                onClick={handleSubmit}
              >
                {loading
                  ? t('saving') + '...'
                  : t('confirm')}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ================= Backdrop ================= */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1050 }}
      />
    </>
  );
}

export default AdjustBalanceModal;