// /**
//  * BulkGrantResult.jsx
//  * Modal يظهر بعد bulk grant لما يكون في تخطيات أو partial success
//  */

// import { useTranslation } from 'react-i18next';

// const Icon = ({ name, className = '' }) => (
//   <i className={`fas fa-${name} ${className}`} />
// );

// const StatusBadge = ({ status, t }) => {
//   const config = {
//     fully_granted: { cls: 'bg-success',           label: t('REMOTE_PERMISSION.BULK_RESULT.FULLY_GRANTED') },
//     partial:       { cls: 'bg-warning text-dark', label: t('REMOTE_PERMISSION.BULK_RESULT.PARTIAL')       },
//     all_skipped:   { cls: 'bg-secondary',         label: t('REMOTE_PERMISSION.BULK_RESULT.ALL_SKIPPED')   }
//   };
//   const { cls, label } = config[status] ?? config.all_skipped;
//   return <span className={`badge ${cls}`}>{label}</span>;
// };

// function BulkGrantResult({ result, onClose }) {
//   const { t } = useTranslation();
//   if (!result) return null;

//   const {
//     summary       = '',
//     successCount  = 0,
//     skippedCount  = 0,
//     totalExpected = 0,
//     results       = [],
//     allGranted    = false,
//     allSkipped    = false,
//   } = result;

//   const skippedUsers = results.filter(r => r.status !== 'fully_granted');
//   const grantedUsers = results.filter(r => r.status === 'fully_granted');

//   const headerCls  = allGranted ? 'bg-success text-white'
//                    : allSkipped ? 'bg-secondary text-white'
//                    : 'bg-warning text-dark';
//   const headerIcon = allGranted ? 'check-circle'
//                    : allSkipped ? 'ban'
//                    : 'exclamation-triangle';

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className="modal-backdrop fade show"
//         onClick={onClose}
//         style={{ zIndex: 1040 }}
//       />

//       {/* Modal */}
//       <div
//         className="modal fade show d-block"
//         tabIndex="-1"
//         style={{ zIndex: 1050 }}
//         aria-modal="true"
//         role="dialog"
//       >
//         <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
//           <div className="modal-content border-0 shadow-lg">

//             {/* Header */}
//             <div className={`modal-header ${headerCls}`}>
//               <h5 className="modal-title fw-bold">
//                 <Icon name={headerIcon} className="me-2" />
//                 {t('REMOTE_PERMISSION.BULK_RESULT.TITLE')}
//               </h5>
//               <button
//                 type="button"
//                 className="btn-close btn-close-white"
//                 onClick={onClose}
//                 aria-label="Close"
//               />
//             </div>

//             {/* Body */}
//             <div className="modal-body p-4">
//               <p className="text-muted fw-semibold mb-3">{summary}</p>

//               {/* Stats */}
//               <div className="row g-3 mb-4">
//                 {[
//                   { count: successCount, label: t('REMOTE_PERMISSION.BULK_RESULT.GRANTED'), color: 'success' },
//                   { count: skippedCount, label: t('REMOTE_PERMISSION.BULK_RESULT.SKIPPED'), color: 'warning' },
//                   { count: totalExpected, label: t('REMOTE_PERMISSION.BULK_RESULT.TOTAL'), color: 'secondary' }
//                 ].map(({ count, label, color }) => (
//                   <div className="col-4" key={label}>
//                     <div className={`card text-center border-0 bg-${color} bg-opacity-10 h-100`}>
//                       <div className="card-body py-3">
//                         <div className={`fs-2 fw-bold text-${color}`}>{count}</div>
//                         <div className="small text-muted">{label}</div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Skipped / Partial users */}
//               {skippedUsers.length > 0 && (
//                 <div className="mb-4">
//                   <h6 className="fw-semibold text-warning mb-3">
//                     <Icon name="exclamation-triangle" className="me-2" />
//                     {t('REMOTE_PERMISSION.BULK_RESULT.ALREADY_EXIST')}
//                     <span className="badge bg-warning text-dark ms-2">{skippedUsers.length}</span>
//                   </h6>

//                   <div className="table-responsive rounded border">
//                     <table className="table table-sm align-middle mb-0">
//                       <thead className="table-warning">
//                         <tr>
//                           <th>{t('REMOTE_PERMISSION.USER')}</th>
//                           <th>{t('REMOTE_PERMISSION.BULK_RESULT.GRANTED_DATES')}</th>
//                           <th>{t('REMOTE_PERMISSION.BULK_RESULT.SKIPPED_DATES')}</th>
//                           <th className="text-center">{t('REMOTE_PERMISSION.STATUS')}</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {skippedUsers.map((r) => (
//                           <tr key={r.userId}>
//                             <td className="fw-semibold">
//                               <Icon name="user" className="me-1 text-muted" />
//                               {r.userName}
//                             </td>
//                             <td>
//                               {r.grantedDates.length > 0 ? (
//                                 <div className="d-flex flex-wrap gap-1">
//                                   {r.grantedDates.map(d => (
//                                     <span key={d} className="badge bg-success-subtle text-success border border-success-subtle">
//                                       {d}
//                                     </span>
//                                   ))}
//                                 </div>
//                               ) : <span className="text-muted small">—</span>}
//                             </td>
//                             <td>
//                               {r.skippedDates.length > 0 ? (
//                                 <div className="d-flex flex-wrap gap-1">
//                                   {r.skippedDates.map(d => (
//                                     <span key={d} className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">
//                                       <Icon name="clock" className="me-1" />{d}
//                                     </span>
//                                   ))}
//                                 </div>
//                               ) : <span className="text-muted small">—</span>}
//                             </td>
//                             <td className="text-center">
//                               <StatusBadge status={r.status} t={t} />
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   <p className="small text-muted mt-2 mb-0">
//                     <Icon name="info-circle" className="me-1" />
//                     {t('REMOTE_PERMISSION.BULK_RESULT.SKIP_REASON')}
//                   </p>
//                 </div>
//               )}

//               {/* Fully granted — collapsible */}
//               {grantedUsers.length > 0 && (
//                 <details>
//                   <summary className="fw-semibold text-success" style={{ cursor: 'pointer', userSelect: 'none' }}>
//                     <Icon name="check-circle" className="me-2" />
//                     {t('REMOTE_PERMISSION.BULK_RESULT.FULLY_GRANTED_USERS')}
//                     <span className="badge bg-success ms-2">{grantedUsers.length}</span>
//                   </summary>
//                   <div className="d-flex flex-wrap gap-2 mt-3">
//                     {grantedUsers.map(r => (
//                       <span key={r.userId} className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
//                         <Icon name="user" className="me-1" />
//                         {r.userName} <span className="opacity-75">({r.grantedCount})</span>
//                       </span>
//                     ))}
//                   </div>
//                 </details>
//               )}
//             </div>

//             {/* Footer */}
//             <div className="modal-footer bg-light">
//               <button type="button" className="btn btn-primary px-4" onClick={onClose}>
//                 <Icon name="check" className="me-2" />
//                 {t('common.CLOSE')}
//               </button>
//             </div>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default BulkGrantResult;

/**
 * BulkGrantResult.jsx
 * Modal يظهر بعد bulk grant لما يكون في تخطيات أو partial success
 * كل موظف = صف واحد — الفروع والتواريخ متجمعة جوّاه
 */

import { useTranslation } from 'react-i18next';
import { formatDisplayDate } from '../../helpers/timezone';

const Icon = ({ name, className = '' }) => (
  <i className={`fas fa-${name} ${className}`} />
);

const StatusBadge = ({ status }) => {
  const { t } = useTranslation();
  const config = {
    fully_granted: { cls: 'bg-success',           icon: 'check-circle', key: 'FULLY_GRANTED' },
    partial:       { cls: 'bg-warning text-dark', icon: 'adjust',       key: 'PARTIAL'       },
    all_skipped:   { cls: 'bg-secondary',         icon: 'ban',          key: 'ALL_SKIPPED'   },
    no_access:     { cls: 'bg-danger',            icon: 'lock',         key: 'NO_ACCESS'     },
  };
  const c = config[status] ?? config.all_skipped;
  return (
    <span className={`badge ${c.cls}`}>
      <Icon name={c.icon} className="me-1" />
      {t(`REMOTE_PERMISSION.BULK_RESULT.${c.key}`)}
    </span>
  );
};

const DateBadges = ({ dates, variant, timezone }) => {
  if (!dates?.length) return <span className="text-muted small">—</span>;
  const cls = {
    success: 'bg-success-subtle text-success border border-success-subtle',
    warning: 'bg-warning-subtle text-warning-emphasis border border-warning-subtle',
  }[variant];
  return (
    <div className="d-flex flex-wrap gap-1">
      {dates.map(d => (
        <span key={d} className={`badge ${cls}`}> {formatDisplayDate(d, timezone)}</span>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════ */

function BulkGrantResult({ result, onClose }) {
  const { t } = useTranslation();
  if (!result) return null;

  const {
    summary       = '',
    successCount  = 0,
    skippedCount  = 0,
    totalExpected = 0,
    results       = [],
    allGranted    = false,
    allSkipped    = false,
  } = result;

  /* Split by outcome */
  // const problemUsers  = results.filter(r => r.status !== 'fully_granted');

  const problemUsers = results.filter(r =>
  r.status === 'partial' || r.status === 'all_skipped'
);

  const successUsers  = results.filter(r => r.status === 'fully_granted');
  const noAccessUsers = results.filter(r => r.status === 'no_access');

  const headerCls  = allGranted ? 'bg-success text-white'
                   : allSkipped ? 'bg-secondary text-white'
                   : 'bg-warning text-dark';
  const headerIcon = allGranted ? 'check-circle'
                   : allSkipped ? 'ban'
                   : 'exclamation-triangle';

                   console.log(result.results);
  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1040 }}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ zIndex: 1050 }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-xl modal-dialog-scrollable modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">

            {/* ── Header ── */}
            <div className={`modal-header ${headerCls}`}>
              <h5 className="modal-title fw-bold">
                <Icon name={headerIcon} className="me-2" />
                {t('REMOTE_PERMISSION.BULK_RESULT.TITLE')}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Close"
              />
            </div>

            {/* ── Body ── */}
            <div className="modal-body p-4">

              {/* Summary */}
              <p className="text-muted fw-semibold mb-4">{summary}</p>

              {/* Stats */}
              <div className="row g-3 mb-4">
                {[
                  { count: successCount,  label: t('REMOTE_PERMISSION.BULK_RESULT.GRANTED'),  color: 'success'   },
                  { count: skippedCount,  label: t('REMOTE_PERMISSION.BULK_RESULT.SKIPPED'),  color: 'warning'   },
                  { count: totalExpected, label: t('REMOTE_PERMISSION.BULK_RESULT.TOTAL'),    color: 'secondary' },
                ].map(({ count, label, color }) => (
                  <div className="col-4" key={label}>
                    <div className={`card text-center border-0 bg-${color} bg-opacity-10 h-100`}>
                      <div className="card-body py-3">
                        <div className={`fs-2 fw-bold text-${color}`}>{count}</div>
                        <div className="small text-muted">{label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── No-access users (no common branch) ── */}
              {noAccessUsers.length > 0 && (
                <div className="alert alert-danger mb-4">
                  <h6 className="fw-semibold mb-2">
                    <Icon name="lock" className="me-2" />
                    {t('REMOTE_PERMISSION.BULK_RESULT.NO_ACCESS_USERS')}
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                    {noAccessUsers.map(r => (
                      <span key={r.userId} className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">
                        <Icon name="user" className="me-1" />
                        {r.userName}
                      </span>
                    ))}
                  </div>
                  <p className="small mb-0 mt-2 text-danger-emphasis">
                    <Icon name="info-circle" className="me-1" />
                    {t('REMOTE_PERMISSION.BULK_RESULT.NO_ACCESS_REASON')}
                  </p>
                </div>
              )}

              {/* ── Skipped / Partial users — main table ── */}
              {problemUsers.filter(r => r.status !== 'no_access').length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-semibold text-warning mb-3">
                    <Icon name="exclamation-triangle" className="me-2" />
                    {t('REMOTE_PERMISSION.BULK_RESULT.ALREADY_EXIST')}
                    <span className="badge bg-warning text-dark ms-2">
                      {problemUsers.filter(r => r.status !== 'no_access').length}
                    </span>
                  </h6>

                  <div className="table-responsive rounded border">
                    <table className="table table-sm align-middle mb-0">
                      <thead className="table-warning">
                        <tr>
                          <th style={{ minWidth: 130 }}>{t('REMOTE_PERMISSION.USER')}</th>
                          <th style={{ minWidth: 140 }}>{t('REMOTE_PERMISSION.BRANCH')}</th>
                          <th>{t('REMOTE_PERMISSION.BULK_RESULT.GRANTED_DATES')}</th>
                          <th>{t('REMOTE_PERMISSION.BULK_RESULT.SKIPPED_DATES')}</th>
                          <th className="text-center" style={{ minWidth: 110 }}>
                            {t('REMOTE_PERMISSION.STATUS')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {problemUsers
                          .filter(r => r.status !== 'no_access')
                          .map((r) => (
                            <tr key={r.userId}>
                            <td className="fw-semibold">
  <div>
    <Icon name="user" className="me-1 text-muted" />
    {r.userName}
  </div>

  <small className="text-muted">
    🌍 {r.timezone || '—'}
  </small>
</td>

                              {/* Branches this user got permission for */}
                              <td>
                                {r.branches?.length > 0 ? (
                                  <div className="d-flex flex-wrap gap-1">
                                    {r.branches.map(b => (
                                      <span key={b} className="badge bg-info-subtle text-info border border-info-subtle">
                                        <Icon name="building" className="me-1" />
                                        {b === 'global'
                                          ? t('REMOTE_PERMISSION.ALL_BRANCHES')
                                          : b}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-muted small">—</span>
                                )}
                              </td>

                              <td><DateBadges
  dates={r.grantedDates}
  variant="success"
  timezone={r.timezone}
/></td>
                              <td><DateBadges
  dates={r.skippedDates}
  variant="warning"
  timezone={r.timezone}
/></td>

                              <td className="text-center">
                                <StatusBadge status={r.status} />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="small text-muted mt-2 mb-0">
                    <Icon name="info-circle" className="me-1" />
                    {t('REMOTE_PERMISSION.BULK_RESULT.SKIP_REASON')}
                  </p>
                </div>
              )}

              {/* ── Fully granted — collapsible ── */}
              {successUsers.length > 0 && (
                <details>
                  <summary
                    className="fw-semibold text-success"
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                  >
                    <Icon name="check-circle" className="me-2" />
                    {t('REMOTE_PERMISSION.BULK_RESULT.FULLY_GRANTED_USERS')}
                    <span className="badge bg-success ms-2">{successUsers.length}</span>
                  </summary>
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {successUsers.map(r => (
                      <span
                        key={r.userId}
                        className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1"
                      >
                        <Icon name="user" className="me-1" />
                        {r.userName}
                        <span className="ms-1 opacity-75">({r.grantedCount})</span>
                      </span>
                    ))}
                  </div>
                </details>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="modal-footer bg-light">
              <button
                type="button"
                className="btn btn-primary px-4"
                onClick={onClose}
              >
                <Icon name="check" className="me-2" />
                {t('common.close')}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default BulkGrantResult;