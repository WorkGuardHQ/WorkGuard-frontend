
// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import {
//   deleteOvertimePolicy,
//   activateOvertimePolicy,
//   hardDeleteOvertimePolicy
// } from '../../services/Overtime & Bonus/overtimePolicy.api';

// /* ==============================================
//    📋 OvertimePolicyTable

//    Props:
//    - policies:    Array
//    - loading:     Boolean
//    - onEdit:      (policy) => void
//    - onReload:    () => void
//    - onToast:     ({ type, message, onConfirm? }) => void
//    - isSuperAdmin: Boolean  ← يظهر زرار Hard Delete
// ============================================== */

// const SCOPE_COLORS = {
//   global:     'primary',
//   branch:     'info',
//   department: 'warning',
//   role:       'secondary',
//   user:       'success'
// };

// export default function OvertimePolicyTable({
//   policies = [],
//   loading,
//   onEdit,
//   onReload,
//   onToast,
//   isSuperAdmin = false
// }) {
//   const { t } = useTranslation('overtimePolicy');
//   const [actionLoading, setActionLoading] = useState(null);

//   /* =========================
//      Soft Delete (Deactivate)
//   ========================= */
//   const handleDeactivate = (policy) => {
//     onToast({
//       type:        'warning',
//       message:     t('overtimePolicy.confirmDelete'),
//       onConfirm:   async () => {
//         setActionLoading(policy._id + '_deactivate');
//         try {
//           await deleteOvertimePolicy(policy._id);
//           onToast({ type: 'success', message: t('overtimePolicy.deleted') });
//           onReload();
//         } catch {
//           onToast({ type: 'error', message: t('overtimePolicy.deleteError') });
//         } finally {
//           setActionLoading(null);
//         }
//       }
//     });
//   };

//   /* =========================
//      Activate
//   ========================= */
//   const handleActivate = async (policy) => {
//     setActionLoading(policy._id + '_activate');
//     try {
//       await activateOvertimePolicy(policy._id);
//       onToast({ type: 'success', message: t('overtimePolicy.activated') });
//       onReload();
//     } catch (err) {
//       onToast({
//         type:    'error',
//         message: err?.response?.data?.message || t('overtimePolicy.activateError')
//       });
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   /* =========================
//      Hard Delete (SuperAdmin only)
//   ========================= */
//   const handleHardDelete = (policy) => {
//     onToast({
//       type:      'error',
//       message:   t('overtimePolicy.confirmHardDelete'),
//       onConfirm: async () => {
//         setActionLoading(policy._id + '_hard');
//         try {
//           await hardDeleteOvertimePolicy(policy._id);
//           onToast({ type: 'success', message: t('overtimePolicy.hardDeleted') });
//           onReload();
//         } catch {
//           onToast({ type: 'error', message: t('overtimePolicy.deleteError') });
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
//                 <tr>
//                   {[...Array(7)].map((_, i) => (
//                     <th key={i}>
//                       <div className="placeholder-glow">
//                         <span className="placeholder col-8" />
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {[...Array(4)].map((_, i) => (
//                   <tr key={i}>
//                     {[...Array(7)].map((_, j) => (
//                       <td key={j}>
//                         <div className="placeholder-glow">
//                           <span className="placeholder col-10" />
//                         </div>
//                       </td>
//                     ))}
//                   </tr>
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
//   if (!policies.length) {
//     return (
//       <div className="card shadow-sm">
//         <div className="card-body text-center py-5">
//           <i className="fas fa-clock fa-3x text-muted mb-3 d-block" />
//           <h6 className="text-muted">{t('common.noData')}</h6>
//           <p className="text-muted small mb-0">{t('overtimePolicy.pageSubtitle')}</p>
//         </div>
//       </div>
//     );
//   }

//   /* =========================
//      Table
//   ========================= */
//   return (
//     <div className="card shadow-sm">
//       <div className="card-body p-0">
//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0">
//             <thead className="table-light">
//               <tr>
//                 <th>{t('overtimePolicy.table.name')}</th>
//                 <th>{t('overtimePolicy.table.scope')}</th>
//                 <th>{t('overtimePolicy.table.nightShift')}</th>
//                 <th>{t('overtimePolicy.table.monthlyCap')}</th>
//                 <th className="text-center">{t('overtimePolicy.table.status')}</th>
//                 <th className="text-center">{t('overtimePolicy.table.version')}</th>
//                 <th className="text-center">{t('overtimePolicy.table.actions')}</th>
//               </tr>
//             </thead>

//             <tbody>
//               {policies.map(policy => {
//                 const scopeColor = SCOPE_COLORS[policy.scope] || 'secondary';

//                 return (
//                   <tr key={policy._id}>

//                     {/* Name */}
//                     <td>
//                       <div className="fw-semibold">{policy.name}</div>
//                     </td>

//                     {/* Scope */}
//                     <td>
//                       <span className={`badge bg-${scopeColor} bg-opacity-10 text-${scopeColor} border border-${scopeColor} border-opacity-25`}>
//                         <i className={`fas ${SCOPE_ICONS[policy.scope]} me-1`} />
//                         {t(`overtimePolicy.scopes.${policy.scope}`)}
//                       </span>
//                     </td>

//                     {/* Night Shift */}
//                     <td>
//                       {policy.nightShift?.startTime ? (
//                         <span className="text-secondary small">
//                           <i className="fas fa-moon me-1 text-primary" />
//                           {policy.nightShift.startTime} → {policy.nightShift.endTime}
//                         </span>
//                       ) : (
//                         <span className="text-muted small">—</span>
//                       )}
//                     </td>

//                     {/* Monthly Cap */}
//                     <td>
//                       {policy.monthlyCap?.enabled ? (
//                         <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25">
//                           <i className="fas fa-hourglass-half me-1" />
//                           {policy.monthlyCap.maxHours}h
//                         </span>
//                       ) : (
//                         <span className="text-muted small">—</span>
//                       )}
//                     </td>

//                     {/* Status */}
//                     <td className="text-center">
//                       {policy.isActive ? (
//                         <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">
//                           <i className="fas fa-check-circle me-1" />
//                           {t('common.active')}
//                         </span>
//                       ) : (
//                         <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25">
//                           <i className="fas fa-times-circle me-1" />
//                           {t('common.inactive')}
//                         </span>
//                       )}
//                     </td>

//                     {/* Version */}
//                     <td className="text-center">
//                       <span className="badge bg-light text-dark border">
//                         v{policy.version || 1}
//                       </span>
//                     </td>

//                     {/* Actions */}
//                     <td className="text-center">
//                       <div className="d-flex justify-content-center gap-2">

//                         {/* Edit */}
//                         <button
//                           className="btn btn-sm btn-outline-primary"
//                           onClick={() => onEdit(policy)}
//                           disabled={!!actionLoading}
//                           title={t('overtimePolicy.edit')}
//                         >
//                           <i className="fas fa-edit" />
//                         </button>

//                         {/* Activate / Deactivate */}
//                         {policy.isActive ? (
//                           <button
//                             className="btn btn-sm btn-outline-warning"
//                             onClick={() => handleDeactivate(policy)}
//                             disabled={!!actionLoading}
//                             title={t('overtimePolicy.delete')}
//                           >
//                             {actionLoading === policy._id + '_deactivate'
//                               ? <span className="spinner-border spinner-border-sm" />
//                               : <i className="fas fa-ban" />
//                             }
//                           </button>
//                         ) : (
//                           <button
//                             className="btn btn-sm btn-outline-success"
//                             onClick={() => handleActivate(policy)}
//                             disabled={!!actionLoading}
//                             title={t('overtimePolicy.activate')}
//                           >
//                             {actionLoading === policy._id + '_activate'
//                               ? <span className="spinner-border spinner-border-sm" />
//                               : <i className="fas fa-check" />
//                             }
//                           </button>
//                         )}

//                         {/* Hard Delete — SuperAdmin فقط */}
//                         {isSuperAdmin && (
//                           <button
//                             className="btn btn-sm btn-outline-danger"
//                             onClick={() => handleHardDelete(policy)}
//                             disabled={!!actionLoading}
//                             title={t('overtimePolicy.hardDelete')}
//                           >
//                             {actionLoading === policy._id + '_hard'
//                               ? <span className="spinner-border spinner-border-sm" />
//                               : <i className="fas fa-trash" />
//                             }
//                           </button>
//                         )}

//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// const SCOPE_ICONS = {
//   global:     'fa-globe',
//   branch:     'fa-building',
//   department: 'fa-sitemap',
//   role:       'fa-user-tag',
//   user:       'fa-user'
// };

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
   
  deleteOvertimePolicy,
  activateOvertimePolicy,
  hardDeleteOvertimePolicy
} from '../../services/Overtime & Bonus/overtimePolicy.api';

/* ==============================================
   📋 OvertimePolicyTable

   Props:
   - policies:    Array
   - loading:     Boolean
   - onEdit:      (policy) => void
   - onReload:    () => void
   - onToast:     ({ type, message, onConfirm? }) => void
   - isSuperAdmin: Boolean  ← يظهر زرار Hard Delete
============================================== */

// const SCOPE_COLORS = {
//   global:     'primary',
//   branch:     'info',
//   department: 'warning',
//   role:       'dark',
//   user:       'bg-successbadge bg-light bg-opacity-10 text-success border border-success border-opacity-25'
// };

const SCOPE_CLASSES = {
  global:
    'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25',

  branch:
    'bg-info bg-opacity-10 text-info border border-info border-opacity-25',

  department:
    'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25',

  role:
    'bg-dark bg-opacity-10 text-dark border border-dark border-opacity-25',

  user:
    'bg-success bg-opacity-10 text-success border border-success border-opacity-25'
};

export default function OvertimePolicyTable({
  policies = [],
  loading,
  onEdit,
  onReload,
  onToast,
   pagination,
  page,
  onPageChange,
  isSuperAdmin = false
}) {
  const { t } = useTranslation("overtimePolicy");
  const [actionLoading, setActionLoading] = useState(null);








  /* =========================
     Soft Delete (Deactivate)
  ========================= */
  const handleDeactivate = (policy) => {
    onToast({
      type:        'warning',
      message:     t('overtimePolicy.confirmDelete'),
      onConfirm:   async () => {
        setActionLoading(policy._id + '_deactivate');
        try {
          await deleteOvertimePolicy(policy._id);
          onToast({ type: 'success', message: t('overtimePolicy.deleted') });
          onReload();
        } catch {
          onToast({ type: 'error', message: t('overtimePolicy.deleteError') });
        } finally {
          setActionLoading(null);
        }
      }
    });
  };

  /* =========================
     Activate
  ========================= */
  const handleActivate = async (policy) => {
    setActionLoading(policy._id + '_activate');
    try {
      await activateOvertimePolicy(policy._id);
      onToast({ type: 'success', message: t('overtimePolicy.activated') });
      onReload();
    } catch (err) {
      onToast({
        type:    'error',
        message: err?.response?.data?.message || t('overtimePolicy.activateError')
      });
    } finally {
      setActionLoading(null);
    }
  };

  /* =========================
     Hard Delete (SuperAdmin only)
  ========================= */
  const handleHardDelete = (policy) => {
    onToast({
      type:      'error',
      message:   t('overtimePolicy.confirmHardDelete'),
      onConfirm: async () => {
        setActionLoading(policy._id + '_hard');
        try {
          await hardDeleteOvertimePolicy(policy._id);
          onToast({ type: 'success', message: t('overtimePolicy.hardDeleted') });
          onReload();
        } catch {
          onToast({ type: 'error', message: t('overtimePolicy.deleteError') });
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
                <tr>
                  {[...Array(8)].map((_, i) => (
                    <th key={i}>
                      <div className="placeholder-glow">
                        <span className="placeholder col-8" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(4)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j}>
                        <div className="placeholder-glow">
                          <span className="placeholder col-10" />
                        </div>
                      </td>
                    ))}
                  </tr>
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
  if (!policies.length) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <i className="fas fa-clock fa-3x text-muted mb-3 d-block" />
          <h6 className="text-muted">{t('common.noData', { ns: "translation" })}</h6>
          <p className="text-muted small mb-0">{t('overtimePolicy.pageSubtitle')}</p>
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
                <th>{t('overtimePolicy.table.name')}</th>
                <th>{t('overtimePolicy.table.scope')}</th>
                <th>{t('overtimePolicy.table.nightShift')}</th>
                <th>
  {t('overtimePolicy.table.timezone')}
</th>

                <th>{t('overtimePolicy.table.monthlyCap')}</th>
                <th className="text-center">{t('overtimePolicy.table.status')}</th>
                <th className="text-center">{t('overtimePolicy.table.version')}</th>
                <th className="text-center">{t('overtimePolicy.table.actions')}</th>
              </tr>
            </thead>

            <tbody>
              {policies.map(policy => {
                // const scopeColor = SCOPE_COLORS[policy.scope] || 'secondary';

                const scopeClass =
  SCOPE_CLASSES[policy.scope] ||
  'bg-secondary';

                return (
                  <tr key={policy._id}>

                    {/* Name */}
                    <td>
                      <div className="fw-semibold">{policy.name}</div>
                    </td>

                    {/* Scope */}
                    <td>
                      <span className={`badge ${scopeClass}
                      
                      `}>
                        <i className={`fas ${SCOPE_ICONS[policy.scope]} me-1`} />
                        {/* {t(`overtimePolicy.scopes.${policy.scope}`)} */}
                        {/* <div> */}
                          <span className="d-flex flex-column">
  <span>
      {t(`overtimePolicy.scopes.${policy.scope}`)}
    </span>
    {policy.scopeName && (
      <small className="text-muted">
        {policy.scopeName}
      </small>
    )}
  </span>
{/* </div> */}
                      </span>
                    </td>

                    {/* Night Shift */}
                    <td>
                      {policy.nightShift?.startTime ? (
                        <span className="text-secondary small">
                          <i className="fas fa-moon me-1 text-primary" />
                          {policy.nightShift.startTime} → {policy.nightShift.endTime}
                        </span>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>

                    {/* timezone */}
<td>
  <div className="small">
    <i className="fas fa-globe me-1 text-info" />
    {policy.timezoneSnapshot?.timezone }
  </div>

  <div className="small text-muted">
    {policy.timezoneSnapshot?.source}
  </div>
</td>
                    {/* Monthly Cap */}
                    <td>
                      {policy.monthlyCap?.enabled ? (
                        <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25">
                          <i className="fas fa-hourglass-half me-1" />
                          {policy.monthlyCap.maxHours}h
                        </span>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="text-center">
                      {policy.isActive ? (
                        <span className="badge  bg-opacity-10 text-success border border-success border-opacity-25">
                          <i className="fas fa-check-circle me-1" />
                          {t('common.active', { ns: "translation" })}
                        </span>
                      ) : (
                        <span className="badge  bg-warning bg-opacity-10 text-secondary border border-secondary border-opacity-25">
                          <i className="fas fa-times-circle me-1" />
                          {t('common.inactive', { ns: "translation" })}
                        </span>
                      )}
                    </td>

                    {/* Version */}
                    <td className="text-center">
                      <span className="badge bg-light text-dark border">
                        v{policy.version || 1}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">

                        {/* Edit */}
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => onEdit(policy)}
                          disabled={!!actionLoading}
                          title={t('overtimePolicy.edit')}
                        >
                          <i className="fas fa-edit" />
                        </button>

                        {/* Activate / Deactivate */}
                        {policy.isActive ? (
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleDeactivate(policy)}
                            disabled={!!actionLoading}
                            title={t('overtimePolicy.delete')}
                          >
                            {actionLoading === policy._id + '_deactivate'
                              ? <span className="spinner-border spinner-border-sm" />
                              : <i className="fas fa-ban" />
                            }
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleActivate(policy)}
                            disabled={!!actionLoading}
                            title={t('overtimePolicy.activate')}
                          >
                            {actionLoading === policy._id + '_activate'
                              ? <span className="spinner-border spinner-border-sm" />
                              : <i className="fas fa-check" />
                            }
                          </button>
                        )}

                        {/* Hard Delete — SuperAdmin فقط */}
                        {isSuperAdmin && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleHardDelete(policy)}
                            disabled={!!actionLoading}
                            title={t('overtimePolicy.hardDelete')}
                          >
                            {actionLoading === policy._id + '_hard'
                              ? <span className="spinner-border spinner-border-sm" />
                              : <i className="fas fa-trash" />
                            }
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="d-flex justify-content-between align-items-center mt-3">

  <div className="small text-muted">
    Total: {pagination?.total || 0}
  </div>

  <div className="btn-group">

    <button
      className="btn btn-sm btn-outline-secondary"
      disabled={!pagination?.hasPrevPage}
      onClick={() => onPageChange(page - 1)}
    >
      Prev
    </button>

    <button
      className="btn btn-sm btn-outline-secondary"
      disabled={!pagination?.hasNextPage}
      onClick={() => onPageChange(page + 1)}
    >
      Next
    </button>

  </div>
</div>
        </div>
      </div>
    </div>
  );
}

const SCOPE_ICONS = {
  global:     'fa-globe',
  branch:     'fa-building',
  department: 'fa-sitemap',
  role:       'fa-user-tag',
  user:       'fa-user'
};