// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiPut } from '../../helpers/api';
// const UserEmploymentStatus = ({ user, isAdmin, onUpdated }) => {
//   const { t } = useTranslation();

//   if (!user) return null;

// //states
// const [loading, setLoading] = useState(false);
// const [showModal, setShowModal] = useState(false);
// const [newStatus, setNewStatus] = useState('terminated');
// const [reason, setReason] = useState('');

// const currentStatus = user?.employmentHistory?.at(-1)?.status;

// // API call to update employment status
// const updateStatus = async (status, reason = '') => {
//   try {
//     setLoading(true);

//     await apiPut(`/users/${user._id}/employment-status`, {
//       status,
//       reason
//     });

//     onUpdated?.(); // refresh profile data

//   } catch (err) {
//     console.error(err);
//     alert(t('common.error'));
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <div className="card mb-3">
//       <div className="card-header fw-semibold">
//        {t(`employment.status.${currentStatus}`)}

//       </div>

//       <div className="card-body">
//         {/* Status Display */}
//         <div className="mb-3">
//   <div className="d-flex align-items-center gap-3">
//     <span className="fw-semibold">  {t('employment.currentStatus')}:</span>

//     <span className={`badge ${
//       currentStatus === 'active'
//         ? 'bg-success'
//         : currentStatus === 'terminated'
//         ? 'bg-danger'
//         : currentStatus === 'suspended'
//         ? 'bg-warning text-dark'
//         : 'bg-secondary'
//     }`}>
//     {t(`employment.status.${currentStatus}`)}

//     </span>
//   </div>

//   {/* {user.employmentEndReason && (
//     <div className="text-muted small mt-1">
//       {t('employment.reason')}: {user.employmentEndReason}
//     </div>
    
//   )} */}

// </div>
// {showModal && (
//   <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,.5)' }}>
//     <div className="modal-dialog modal-dialog-centered">
//       <div className="modal-content">

//         <div className="modal-header">
//           <h5 className="modal-title">
//             {t('employment.changeStatus')}
//           </h5>
//           <button className="btn-close" onClick={() => setShowModal(false)} />
//         </div>

//         <div className="modal-body">
//           {/* Status */}
//           <div className="mb-3">
//             <label className="form-label">
//               {t('employment.newStatus')}
//             </label>
//             <select
//               className="form-select"
//               value={newStatus}
//               onChange={(e) => setNewStatus(e.target.value)}
//             >
//               <option value="terminated">
//                 {t('employment.status.terminated')}
//               </option>
//               <option value="resigned">
//                 {t('employment.status.resigned')}
//               </option>
//               <option value="suspended">
//                 {t('employment.status.suspended')}
//               </option>
//             </select>
//           </div>

//           {/* Reason */}
//           <div className="mb-3">
//             <label className="form-label">
//               {t('employment.reason')}
//             </label>
//             <textarea
//               className="form-control"
//               rows={3}
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//               placeholder={t('employment.reasonPlaceholder')}
//             />
//           </div>
//         </div>

//         <div className="modal-footer">
//           <button
//             className="btn btn-secondary"
//             onClick={() => setShowModal(false)}
//           >
//             {t('common.cancel')}
//           </button>

//           <button
//             className="btn btn-danger"
//             disabled={!reason.trim() || loading}
//             onClick={async () => {
//               await updateStatus(newStatus, reason);
//               setShowModal(false);
//             }}
//           >
//             {t('common.confirm')}
//           </button>
//         </div>

//       </div>
//     </div>
//   </div>
// )}


// {Array.isArray(user.employmentHistory) && user.employmentHistory.length > 0 && (
//   <div className="mt-4">
//     <h6 className="fw-semibold mb-3">
//       {t('employment.history')}
//     </h6>

//     <ul className="list-group list-group-flush">
//       {user.employmentHistory.map((item, index) => (
//         <li key={index} className="list-group-item px-0">
//           <div className="d-flex justify-content-between align-items-center">
//             <div>
//               <span className="fw-semibold">
//                {t(`employment.status.${item.status}`)}

//               </span>

//               <div className="text-muted small">
//                 {new Date(item.startDate).toLocaleDateString()}
//                 {' '}
//                 {item.endDate && (
//                   <>→ {new Date(item.endDate).toLocaleDateString()}</>
//                 )}
//               </div>

//               {item.reason && (
//                 <div className="text-muted small">
//                   {t('employment.reason')}: {item.reason}
//                 </div>
//               )}
//             </div>
//           </div>
//         </li>
//       ))}
//     </ul>
//   </div>
// )}


//         {/* Admin Actions */}
// {isAdmin && currentStatus === 'active' && (
//   <button
//     className="btn btn-outline-danger"
//     disabled={loading}
//    onClick={() => {
//   setNewStatus('terminated');
//   setReason('');
//   setShowModal(true);
// }}

//   >
//     {t('employment.actions.deactivate')}
//   </button>
// )}

// {isAdmin && currentStatus !== 'active' && (
//   <button
//     className="btn btn-outline-success"
//     disabled={loading}
//     onClick={() => updateStatus('active')}
//   >
//     {t('employment.actions.rehire')}
//   </button>
// )}


//       </div>
//     </div>
//   );
// };

// export default UserEmploymentStatus;





///-----------------ui ---------------








// src/components/userProfile/UserEmploymentStatus.jsx
import { createPortal } from 'react-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRegisterOverlay } from '../../helpers/keyboardActions';

import {
  formatDisplayDate,
  formatDisplayTime
} from '../../helpers/timezone';

import { updateEmploymentStatus } from '../../services/user.api';
import OverageConfirmationToast from '../subscription/OverageConfirmationToast';
import { isAdmin } from '../../helpers/auth';

// ── Status config ──────────────────────────────────────────
const STATUS_CONFIG = {
  active:     { color: '#16a34a', bg: '#dcfce7', icon: 'fa-circle-check',  label: 'active' },
  terminated: { color: '#dc2626', bg: '#fee2e2', icon: 'fa-circle-xmark',  label: 'terminated' },
  suspended:  { color: '#d97706', bg: '#fef3c7', icon: 'fa-circle-pause',  label: 'suspended' },
  resigned:   { color: '#6366f1', bg: '#ede9fe', icon: 'fa-right-from-bracket', label: 'resigned' },
};

const getConfig = (status) => STATUS_CONFIG[status] || { color: '#64748b', bg: '#f1f5f9', icon: 'fa-circle-question', label: status };

// ── Sub-components ─────────────────────────────────────────
function StatusBadge({ status }) {
  const { t } = useTranslation();
  const cfg = getConfig(status);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: cfg.bg, color: cfg.color,
      fontSize: '0.78rem', fontWeight: 600,
      padding: '4px 12px', borderRadius: 20,
    }}>
      <i className={`fa-solid ${cfg.icon}`} style={{ fontSize: 11 }} />
      {t(`employment.status.${status}`)}
    </span>
  );
}

function HistoryTimeline({ history, user, t }) {
  if (!Array.isArray(history) || history.length === 0) return null;
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {t('employment.history')}
      </div>
      <div style={{ position: 'relative', paddingLeft: 20 }}>
        {/* vertical line */}
        <div style={{ position: 'absolute', left: 7, top: 0, bottom: 0, width: 1, background: '#e2e8f0' }} />
        {[...history]
  .sort(
    (a, b) =>
      new Date(b.startDate) -
      new Date(a.startDate)
  ).map((item, i) => {
          const cfg = getConfig(item.status);
          return (
            <div key={i} style={{ position: 'relative', marginBottom: 16, paddingLeft: 20 }}>
              {/* dot */}
              <div style={{
                position: 'absolute', left: -13, top: 3,
                width: 10, height: 10, borderRadius: '50%',
                background: cfg.color, border: '2px solid #fff',
                boxShadow: `0 0 0 2px ${cfg.bg}`,
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <StatusBadge status={item.status} />
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {/* {new Date(item.startDate).toLocaleDateString()} */}
                  {formatDisplayDate(
  item.startDate,
  user?.workTimezone
)}
 {' • '}
{formatDisplayTime(item.startDate, user?.workTimezone)}

{item.endDate && (
    <>
      {' → '}

      {formatDisplayDate(
        item.endDate,
        user?.workTimezone
      )}

      {' • '}

      {formatDisplayTime(
        item.endDate,
        user?.workTimezone
      )}
    </>
  )}

</span>
              </div>
              {item.reason && (
                
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 3 }}>
                  {t('employment.reason')}: {item.reason}
                </div>
              )}

              {item.changedBy && (
  <div
    style={{
      fontSize: '0.72rem',
      color: '#94a3b8',
      marginTop: 2,
    }}
  >
    {t('employment.changedBy')}:
    {' '}
    {item.changedBy.name}
  </div>
)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChangeStatusModal({ show, onClose, onConfirm, loading, t }) {
  const [newStatus, setNewStatus] = useState('terminated');
  const [reason, setReason]       = useState('');

  if (!show) return null;

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1050,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: 440,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
            <i className="fa-solid fa-pen-to-square me-2 text-primary" />
            {t('employment.changeStatus')}
          </span>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1.1rem' }}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
              {t('employment.newStatus')}
            </label>
            <select
              className="form-select form-select-sm"
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
              style={{ borderRadius: 8 }}
            >
              <option value="terminated">{t('employment.status.terminated')}</option>
              <option value="resigned">{t('employment.status.resigned')}</option>
              <option value="suspended">{t('employment.status.suspended')}</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
              {t('employment.reason')} <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              className="form-control form-control-sm"
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder={t('employment.reasonPlaceholder')}
              style={{ borderRadius: 8, resize: 'none' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px', borderTop: '1px solid #f1f5f9',
          display: 'flex', gap: 8, justifyContent: 'flex-end',
        }}>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose} style={{ borderRadius: 8 }}>
            {t('common.cancel')}
          </button>
          <button
            className="btn btn-sm btn-danger"
            disabled={!reason.trim() || loading}
            onClick={() => onConfirm(newStatus, reason)}
            style={{ borderRadius: 8, minWidth: 90 }}
          >
            {loading
              ? <><i className="fa-solid fa-spinner fa-spin me-1" />{t('common.saving')}</>
              : t('common.confirm')
            }
          </button>
        </div>
      </div>
    </div>,document.body

  );
}

// ── Main component ─────────────────────────────────────────
const UserEmploymentStatus = ({ user, onUpdated }) => {
  const { t }    = useTranslation();
  const adminUser = isAdmin(); // ✅ من الـ token مباشرة

  const [loading,   setLoading]   = useState(false);
  const [showModal, setShowModal] = useState(false);
const [overageWarning, setOverageWarning] = useState(null);
const [pendingAction, setPendingAction] = useState(null);
  //
  const closeModal = () => {
  setShowModal(false);
};
useRegisterOverlay(showModal, closeModal);

  if (!user || !adminUser) return null; // ✅ مش للادمن = مش يظهر

  // const currentStatus = user?.employmentHistory?.at(-1)?.status || 'active';
  const currentStatus =
  user?.currentEmploymentStatus ||
  user?.employmentHistory?.at(-1)?.status ||
  'active';

  const cfg           = getConfig(currentStatus);

  const updateStatus = async (status, reason = '' , confirmOverage = false) => {
    try {
      setLoading(true);
    await updateEmploymentStatus(user._id, { status, reason,    confirmOverage,
 });
closeModal();
      onUpdated?.();
    } catch (err) {
      console.error(err);

const response = err?.response?.data;

if (
    err?.response?.status === 409 &&
    response?.requiresConfirmation
) {
    setOverageWarning(response.warning);

    setPendingAction({
        status,
        reason,
    });

    return;
}

alert(t('common.error'));
    } finally {
      setLoading(false);
      // closeModal();
      // setShowModal(false);
    }
  };
  
  //console.log(user.employmentHistory)

  return (
    <>
      <div style={{
        background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1rem',
        overflow: 'hidden',
      }}>
        {/* Top accent */}
        <div style={{ height: 4, background: cfg.color, opacity: 0.7 }} />

        <div style={{ padding: '16px 20px' }}>

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className={`fa-solid ${cfg.icon}`} style={{ color: cfg.color, fontSize: '1rem' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('employment.currentStatus')}
                </div>
                <StatusBadge status={currentStatus} />
              </div>
            </div>

            {/* Action button */}
            {currentStatus === 'active' ? (
              <button
                className="btn btn-sm btn-outline-danger"
                disabled={loading}
                onClick={() => setShowModal(true)}
                style={{ borderRadius: 8, fontSize: '0.8rem' }}
              >
                <i className="fa-solid fa-user-slash me-1" />
                {t('employment.actions.deactivate')}
              </button>
            ) : (
              <button
                className="btn btn-sm btn-outline-success"
                disabled={loading}
                onClick={() => updateStatus('active')}
                style={{ borderRadius: 8, fontSize: '0.8rem' }}
              >
                {loading
                  ? <i className="fa-solid fa-spinner fa-spin" />
                  : <><i className="fa-solid fa-rotate-left me-1" />
                  
                  {/* {t('employment.actions.rehire')} */}
                  
                  {
  currentStatus === 'suspended'
    ? t('employment.actions.reactivate')
    : t('employment.actions.rehire')
}
                  </>
                }
              </button>
            )}
          </div>

          {/* History timeline */}
          <HistoryTimeline 
          history={user.employmentHistory}
          user={user} 
          t={t} />
        </div>
      </div>

      <ChangeStatusModal
        show={showModal}
        // onClose={() => setShowModal(false)}
          onClose={closeModal}
        onConfirm={updateStatus}
        loading={loading}
        t={t}
      />
      <OverageConfirmationToast
  warning={overageWarning}
  onClose={() => {
    setOverageWarning(null);
    setPendingAction(null);
  }}
 onConfirm={async () => {
    if (!pendingAction) return;

    const action = pendingAction;

    setPendingAction(null);
    setOverageWarning(null);

    await updateStatus(
        action.status,
        action.reason,
        true
    );
}}
/>
    </>
  );
};

export default UserEmploymentStatus;