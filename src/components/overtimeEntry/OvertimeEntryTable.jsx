// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import {
//   approveOvertimeEntry,
//   rejectOvertimeEntry,
//   deleteOvertimeEntry
// } from '../../services/Overtime & Bonus/overtimeEntry.api';
// import { TypeBadge, StatusBadge, SourceBadge } from './OvertimeEntryBadges';

// /* ==============================================
//    📋 OvertimeEntryTable
//    Props:
//    - entries:     Array
//    - loading:     Boolean
//    - onReload:    () => void
//    - onToast:     ({ type, message, onConfirm? }) => void
// ============================================== */

// export default function OvertimeEntryTable({
//   entries = [],
//   loading,
//   onReload,
//   onToast
// }) {
//   const { t }  = useTranslation('overtimeEntry');
//   const [actionLoading, setActionLoading] = useState(null);
//   const [rejectModal,   setRejectModal]   = useState(null); // { entry }
//   const [rejectReason,  setRejectReason]  = useState('');

//   /* =========================
//      Approve
//   ========================= */
//   const handleApprove = (entry) => {
//     onToast({
//       type:      'warning',
//       message:   t('overtimeEntry.confirmApprove'),
//       onConfirm: async () => {
//         setActionLoading(entry._id + '_approve');
//         try {
//           await approveOvertimeEntry(entry._id);
//           onToast({ type: 'success', message: t('overtimeEntry.approved') });
//           onReload();
//         } catch {
//           onToast({ type: 'error', message: t('overtimeEntry.approveError') });
//         } finally {
//           setActionLoading(null);
//         }
//       }
//     });
//   };

//   /* =========================
//      Reject (inline modal)
//   ========================= */
//   const openRejectModal = (entry) => {
//     setRejectReason('');
//     setRejectModal(entry);
//   };

//   const handleRejectConfirm = async () => {
//     if (!rejectReason.trim()) return;
//     setActionLoading(rejectModal._id + '_reject');
//     try {
//       await rejectOvertimeEntry(rejectModal._id, rejectReason.trim());
//       onToast({ type: 'success', message: t('overtimeEntry.rejected') });
//       setRejectModal(null);
//       onReload();
//     } catch {
//       onToast({ type: 'error', message: t('overtimeEntry.rejectError') });
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   /* =========================
//      Delete
//   ========================= */
//   const handleDelete = (entry) => {
//     onToast({
//       type:      'error',
//       message:   t('overtimeEntry.confirmDelete'),
//       onConfirm: async () => {
//         setActionLoading(entry._id + '_delete');
//         try {
//           await deleteOvertimeEntry(entry._id);
//           onToast({ type: 'success', message: t('overtimeEntry.deleted') });
//           onReload();
//         } catch (err) {
//           onToast({
//             type:    'error',
//             message: err?.response?.data?.message || t('overtimeEntry.deleteError')
//           });
//         } finally {
//           setActionLoading(null);
//         }
//       }
//     });
//   };

//   /* =========================
//      Loading Skeleton
//   ========================= */
//   if (loading) {
//     return (
//       <div className="card shadow-sm">
//         <div className="card-body p-0">
//           <div className="table-responsive">
//             <table className="table table-hover mb-0">
//               <thead className="table-light">
//                 <tr>{[...Array(9)].map((_, i) => (
//                   <th key={i}><div className="placeholder-glow"><span className="placeholder col-8" /></div></th>
//                 ))}</tr>
//               </thead>
//               <tbody>
//                 {[...Array(5)].map((_, i) => (
//                   <tr key={i}>{[...Array(9)].map((_, j) => (
//                     <td key={j}><div className="placeholder-glow"><span className="placeholder col-10" /></div></td>
//                   ))}</tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /* =========================
//      Empty State
//   ========================= */
//   if (!entries.length) {
//     return (
//       <div className="card shadow-sm">
//         <div className="card-body text-center py-5">
//           <i className="fas fa-clock fa-3x text-muted mb-3 d-block" />
//           <h6 className="text-muted">{t('common.noData',{ ns: "translation" })}</h6>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="card shadow-sm">
//         <div className="card-body p-0">
//           <div className="table-responsive">
//             <table className="table table-hover align-middle mb-0">
//               <thead className="table-light">
//                 <tr>
//                   <th>{t('overtimeEntry.table.employee')}</th>
//                   <th>{t('overtimeEntry.table.date')}</th>
//                   <th>{t('overtimeEntry.table.type')}</th>
//                   <th>{t('overtimeEntry.table.source')}</th>
//                   <th className="text-center">{t('overtimeEntry.table.minutes')}</th>
//                   <th className="text-center">{t('overtimeEntry.table.multiplier')}</th>
//                   <th className="text-end">{t('overtimeEntry.table.amount')}</th>
//                   <th className="text-center">{t('overtimeEntry.table.status')}</th>
//                   <th className="text-center">{t('overtimeEntry.table.actions')}</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {entries.map(entry => {
//                   const isLoading = actionLoading?.startsWith(entry._id);

//                   return (
//                     <tr key={entry._id}>

//                       {/* Employee */}
//                       <td>
//                         <div className="d-flex align-items-center gap-2">
//                           <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
//                             style={{ width: 32, height: 32, fontSize: 12 }}>
//                             {(entry.user?.name || '?')[0].toUpperCase()}
//                           </div>
//                           <div>
//                             <div className="fw-semibold small">{entry.user?.name || '—'}</div>
//                             <div className="text-muted" style={{ fontSize: 11 }}>{entry.user?.email}</div>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Date */}
//                       <td>
//                         <span className="small">
//                           {new Date(entry.date).toLocaleDateString('en-GB')}
//                         </span>
//                       </td>

//                       {/* Type */}
//                       <td><TypeBadge type={entry.type} /></td>

//                       {/* Source */}
//                       <td><SourceBadge source={entry.source} /></td>

//                       {/* Minutes */}
//                       <td className="text-center">
//                         {entry.type === 'EXCEPTIONAL' ? (
//                           <span className="text-muted small">—</span>
//                         ) : (
//                           <span className="small fw-semibold">{entry.cappedMinutes}m</span>
//                         )}
//                       </td>

//                       {/* Multiplier */}
//                       <td className="text-center">
//                         {entry.type === 'EXCEPTIONAL' ? (
//                           <span className="text-muted small">—</span>
//                         ) : entry.rateType === 'fixed' ? (
//                           <span className="badge bg-light text-dark border small">fixed</span>
//                         ) : (
//                           <span className="badge bg-light text-dark border small">{entry.multiplier}x</span>
//                         )}
//                       </td>

//                       {/* Amount */}
//                       <td className="text-end">
//                         <span className="fw-semibold text-success">
//                           {Number(entry.amount).toFixed(2)} {t('common.currency',{ ns: "translation" })}
//                         </span>
//                       </td>

//                       {/* Status */}
//                       <td className="text-center">
//                         <StatusBadge status={entry.status} />
//                         {entry.status === 'rejected' && entry.rejectedReason && (
//                           <div className="text-danger mt-1" style={{ fontSize: 10 }}
//                             title={entry.rejectedReason}>
//                             <i className="fas fa-info-circle me-1" />
//                             {entry.rejectedReason.length > 20
//                               ? entry.rejectedReason.slice(0, 20) + '…'
//                               : entry.rejectedReason}
//                           </div>
//                         )}
//                       </td>

//                       {/* Actions */}
//                       <td className="text-center">
//                         <div className="d-flex justify-content-center gap-1">

//                           {/* Approve — بس للـ pending */}
//                           {entry.status === 'pending' && (
//                             <button className="btn btn-sm btn-outline-success"
//                               onClick={() => handleApprove(entry)}
//                               disabled={isLoading}
//                               title={t('overtimeEntry.approve')}>
//                               {actionLoading === entry._id + '_approve'
//                                 ? <span className="spinner-border spinner-border-sm" />
//                                 : <i className="fas fa-check" />}
//                             </button>
//                           )}

//                           {/* Reject — بس للـ pending */}
//                           {entry.status === 'pending' && (
//                             <button className="btn btn-sm btn-outline-warning"
//                               onClick={() => openRejectModal(entry)}
//                               disabled={isLoading}
//                               title={t('overtimeEntry.reject')}>
//                               <i className="fas fa-times" />
//                             </button>
//                           )}

//                           {/* Delete — بس للـ manual */}
//                           {entry.source === 'manual' && (
//                             <button className="btn btn-sm btn-outline-danger"
//                               onClick={() => handleDelete(entry)}
//                               disabled={isLoading}
//                               title={t('overtimeEntry.delete')}>
//                               {actionLoading === entry._id + '_delete'
//                                 ? <span className="spinner-border spinner-border-sm" />
//                                 : <i className="fas fa-trash" />}
//                             </button>
//                           )}

//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* ── Reject Modal (inline) ── */}
//       {rejectModal && (
//         <div className="modal fade show d-block" tabIndex="-1"
//           style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//           <div className="modal-dialog modal-sm modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h6 className="modal-title">
//                   <i className="fas fa-times-circle me-2 text-danger" />
//                   {t('overtimeEntry.reject')}
//                 </h6>
//                 <button className="btn-close" onClick={() => setRejectModal(null)} />
//               </div>
//               <div className="modal-body">
//                 <p className="small text-muted mb-2">{t('overtimeEntry.confirmReject')}</p>
//                 <textarea
//                   className="form-control form-control-sm"
//                   rows={3}
//                   placeholder={t('overtimeEntry.rejectReasonPlaceholder')}
//                   value={rejectReason}
//                   onChange={e => setRejectReason(e.target.value)}
//                 />
//               </div>
//               <div className="modal-footer py-2">
//                 <button className="btn btn-sm btn-outline-secondary"
//                   onClick={() => setRejectModal(null)}>
//                   {t('overtimeEntry.cancel')}
//                 </button>
//                 <button className="btn btn-sm btn-danger"
//                   onClick={handleRejectConfirm}
//                   disabled={!rejectReason.trim() || !!actionLoading}>
//                   {actionLoading?.includes('_reject')
//                     ? <span className="spinner-border spinner-border-sm" />
//                     : t('overtimeEntry.confirm')}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  formatDisplayDate
} from '../../helpers/timezone';

import { deleteOvertimeEntry } from '../../services/Overtime & Bonus/overtimeEntry.api';
import { TypeBadge, StatusBadge, SourceBadge } from './OvertimeEntryBadges';

/* ==============================================
   📋 OvertimeEntryTable

   - عرض فقط لكل الأنواع
   - Delete بس للـ EXCEPTIONAL + manual
     (لو الـ Payroll approved → الـ backend بيرفض)
   Props:
   - entries:  Array
   - loading:  Boolean
   - onReload: () => void
   - onToast:  ({ type, message, onConfirm? }) => void
============================================== */

export default function OvertimeEntryTable({
  entries = [],
  loading,
  onReload,
  onToast
}) {
  const { t }  = useTranslation('overtimeEntry');
  const [actionLoading, setActionLoading] = useState(null);

  //timezone helper
const getEntryTimezone = (entry) => {

  return (
    entry.timezoneSnapshot?.timezone ||
    entry.user?.workTimezone ||
    null
  );
};
  /* =========================
     Delete EXCEPTIONAL
  ========================= */
  const handleDelete = (entry) => {
    onToast({
      type:      'error',
      message:   t('overtimeEntry.confirmDelete'),
      onConfirm: async () => {
        setActionLoading(entry._id);
        try {
          await deleteOvertimeEntry(entry._id);
          onToast({ type: 'success', message: t('overtimeEntry.deleted') });
          onReload();
        } catch (err) {
          // لو الـ Payroll approved → الـ backend بيبعت رسالة واضحة
          onToast({
            type:    'error',
            message: err?.response?.data?.message || t('overtimeEntry.deleteError')
          });
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  /* =========================
     Loading Skeleton
  ========================= */
  if (loading) {
    return (
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>{[...Array(8)].map((_, i) => (
                  <th key={i}><div className="placeholder-glow"><span className="placeholder col-8" /></div></th>
                ))}</tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>{[...Array(8)].map((_, j) => (
                    <td key={j}><div className="placeholder-glow"><span className="placeholder col-10" /></div></td>
                  ))}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     Empty State
  ========================= */
  if (!entries.length) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <i className="fas fa-clock fa-3x text-muted mb-3 d-block" />
          <h6 className="text-muted">{t('common.noData',{ ns: "translation" })}</h6>
        </div>
      </div>
    );
  }

  /* =========================
     Table
  ========================= */
  return (
    <div className="card shadow-sm">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>{t('overtimeEntry.table.employee')}</th>
                <th>{t('overtimeEntry.table.date')}</th>
                <th>{t('overtimeEntry.table.type')}</th>
                <th>{t('overtimeEntry.table.source')}</th>
                <th className="text-center">{t('overtimeEntry.table.minutes')}</th>
                <th className="text-center">{t('overtimeEntry.table.multiplier')}</th>
                <th className="text-end">{t('overtimeEntry.table.amount')}</th>
                <th className="text-center">{t('overtimeEntry.table.notes')}</th>
                <th className="text-center">{t('overtimeEntry.table.actions')}</th>
              </tr>
            </thead>

            <tbody>
              {entries.map(entry => (
                <tr key={entry._id}>

                  {/* Employee */}
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                        style={{ width: 32, height: 32, fontSize: 12 }}>
                        {(entry.user?.name || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-semibold small">{entry.user?.name || '—'}</div>
                        <div className="text-muted" style={{ fontSize: 11 }}>{entry.user?.email}</div>
                      </div>
                    </div>
                  </td>

                 {/* Date */}
<td>

  <div className="small">

    <div className="fw-semibold">

      {/* {formatDisplayDate(
        entry.date,
        getEntryTimezone(entry)
      )} */}
{getEntryTimezone(entry)
  ? formatDisplayDate(
      entry.date,
      getEntryTimezone(entry)
    )
  : '—'}
    </div>

    <div
      className="text-muted"
      style={{ fontSize: 11 }}
    >
      <i className="fas fa-clock me-1" />

      {getEntryTimezone(entry) || '—'}
      
    </div>
{entry.timezoneSnapshot?.timezone && (
  <div
    className="text-info"
    style={{ fontSize: 10 }}
  >
    {t('overtimeEntry.timezoneSnapshot')}
  </div>
)}

  </div>

</td>


                  {/* Type */}
               <td>

  <TypeBadge type={entry.type} />

  {entry.policySnapshot?.name && (
    <div
      className="text-muted"
      style={{ fontSize: 11 }}
    >
      {entry.policySnapshot.name}
    </div>
  )}

</td>

                  {/* Source */}
                  <td><SourceBadge source={entry.source} /></td>

                  {/* Minutes */}
                  <td className="text-center">
                    {entry.type === 'EXCEPTIONAL' ? (
                      <span className="badge bg-warning-subtle text-warning border">
  {t('exceptional')}
</span>
                    ) : (
                      <span className="small fw-semibold">{entry.cappedMinutes}m</span>
                    )}
                  </td>

                  {/* Multiplier */}
                  <td className="text-center">
                    {entry.type === 'EXCEPTIONAL' ? (
                      <span className="badge bg-warning-subtle text-warning border">
  {t('exceptional')}
</span>
                    ) : entry.rateType === 'fixed' ? (
                      <span className="badge bg-light text-dark border small">fixed</span>
                    ) : (
                      <span className="badge bg-light text-dark border small">{entry.multiplier}x</span>
                    )}
                  </td>

                  {/* Amount */}
                  <td className="text-end">
                    <span className="fw-semibold text-success">
                      {Number(entry.amount|| 0).toFixed(2)} {t('common.currency',{ ns: "translation" })}
                    </span>
                  </td>

                  {/* Notes (للـ EXCEPTIONAL) */}
                  <td className="text-center">
                    {entry.notes ? (
                      <span className="text-muted small" title={entry.notes}>
                        <i className="fas fa-comment-alt me-1" />
                        {entry.notes.length > 25
                          ? entry.notes.slice(0, 25) + '…'
                          : entry.notes}
                      </span>
                    ) : (
                      <span className="text-muted small">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="text-center">
                    {/* Delete — بس للـ EXCEPTIONAL manual */}
                    {entry.type === 'EXCEPTIONAL' && entry.source === 'manual' ? (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(entry)}
                        disabled={actionLoading === entry._id}
                        title={t('overtimeEntry.delete')}
                      >
                        {actionLoading === entry._id
                          ? <span className="spinner-border spinner-border-sm" />
                          : <i className="fas fa-trash" />}
                      </button>
                    ) : (
                      <span className="text-muted small">—</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}