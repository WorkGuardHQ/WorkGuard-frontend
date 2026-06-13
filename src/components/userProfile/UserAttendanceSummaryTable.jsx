





// import { useTranslation } from 'react-i18next';

// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// // UserAttendanceSummaryTable
// // Source: DailyAttendanceSummary (من /admin/user-monthly-report)
// //
// // ✅ FIX 1 — field names صح:
// //   ❌ day.dayType                   → ✅ day.dayStatus
// //   ❌ day.lateMinutes               → ✅ day.totalLateMinutes
// //   ❌ day.earlyLeaveMinutes         → ✅ day.totalEarlyLeaveMinutes
// //   ❌ day.transitDeductionMinutes   → ✅ day.totalTransitDeductionMinutes
// //   ❌ day.adminNote (string)        → ✅ day.adminNotes (array)
// //
// // ✅ FIX 2 — date string للـ openDetails:
// //   ❌ day.date (ISO string قد يكون UTC)
// //   ✅ localDateStr(day.date) → yyyy-mm-dd بـ local time دايماً
// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// const localDateStr = (value) => {
//   const d = new Date(value);
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, '0');
//   const day = String(d.getDate()).padStart(2, '0');
//   return `${y}-${m}-${day}`;
// };

// // dayStatus → badge color (من DailyAttendanceSummary schema)
// const STATUS_COLOR = {
//   working:         'success',
//   holiday:         'info',
//   leave_paid:      'primary',
//   leave_unpaid:    'warning',
//   absent:          'danger',
//   non_working_day: 'secondary',
//   no_data:         'light'
// };

// const STATUS_ICON = {
//   working:         '🟢',
//   holiday:         '🎉',
//   leave_paid:      '🏖️',
//   leave_unpaid:    '⚠️',
//   absent:          '❌',
//   non_working_day: '📅',
//   no_data:         '—'
// };

// function UserAttendanceSummaryTable({ days = [], loading = false, onOpenDetails }) {
//   const { t } = useTranslation();

//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <div className="spinner-border text-primary" />
//       </div>
//     );
//   }

//   if (!Array.isArray(days) || days.length === 0) {
//     return <div className="text-center py-5 text-muted">{t('noData')}</div>;
//   }

//   return (
//     <div className="table-responsive">
//       <table className="table table-hover align-middle">
//         <thead className="table-primary">
//           <tr>
//             <th>{t('date')}</th>
//             <th>{t('branches')}</th>
//             <th>{t('dayStatus')}</th>
//             <th>{t('summary')}</th>
//             <th className="text-center">👁️</th>
//           </tr>
//         </thead>

//         <tbody>
//           {days.map(day => {
//             const dateObj = new Date(day.date);

//             // ✅ FIX: dayStatus مش dayType
//             const status = day.dayStatus || 'no_data';

//             // ✅ FIX: الأسماء الصح من DailyAttendanceSummary
//             const lateMin       = day.totalLateMinutes             || 0;
//             const earlyMin      = day.totalEarlyLeaveMinutes       || 0;
//             const transitMin    = day.totalTransitDeductionMinutes || 0;
//             const earlyArrival  = day.earlyArrivalMinutes          || 0;
//             const lateDeparture = day.lateDepartureMinutes         || 0;

//             const hasPenalty = lateMin > 0 || earlyMin > 0 || transitMin > 0;
//             const hasBonus   = earlyArrival > 0 || lateDeparture > 0;

//             return (
//               <tr key={day._id || day.date}>

//                 {/* Date */}
//                 <td>
//                   {dateObj.toLocaleDateString()}
//                   <br />
//                   <small className="text-muted">
//                     {dateObj.toLocaleString('en-US', { weekday: 'long' })}
//                   </small>
//                 </td>

//                 {/* Branches */}
//                 <td>
//                   {day.branchesVisited?.length ? (
//                     day.branchesVisited.map(b => (
//                       <div key={b.branch} className="d-flex align-items-center">
//                         <i className="fas fa-building text-secondary me-2" />
//                         <span>{b.name}</span>
//                         {b.hasInvalid && (
//                           <i className="fas fa-exclamation-circle text-danger ms-2"
//                             title="Invalidated attendance" />
//                         )}
//                       </div>
//                     ))
//                   ) : (
//                     <span className="text-muted">—</span>
//                   )}
//                 </td>

//                 {/* Day Status — ✅ dayStatus */}
//                 <td>
//                   <span className={`badge bg-${STATUS_COLOR[status] || 'secondary'}`}>
//                     {STATUS_ICON[status] || ''} {t(status)}
//                   </span>

//                   {/* ✅ FIX: adminNotes هو array مش string */}
//                   {day.adminNotes?.length > 0 && (
//                     <div className="small text-muted mt-1">
//                       <i className="fas fa-info-circle me-1" />
//                       {day.adminNotes.join(' · ')}
//                     </div>
//                   )}
//                 </td>

//                 {/* Summary */}
//                 <td>
//                   {day.firstCheckInTime && (
//                     <div className="small">
//                       <strong>{t('firstIn')}:</strong>{' '}
//                       {new Date(day.firstCheckInTime).toLocaleTimeString()}
//                     </div>
//                   )}
//                   {day.lastCheckOutTime && (
//                     <div className="small">
//                       <strong>{t('lastOut')}:</strong>{' '}
//                       {new Date(day.lastCheckOutTime).toLocaleTimeString()}
//                     </div>
//                   )}

//                   {/* ✅ FIX: totalLateMinutes */}
//                   {lateMin > 0 && (
//                     <div className="small text-warning">
//                       ⏰ {t('late')}: {lateMin} {t('minutes')}
//                     </div>
//                   )}

//                   {/* ✅ FIX: totalEarlyLeaveMinutes */}
//                   {earlyMin > 0 && (
//                     <div className="small text-danger">
//                       🚪 {t('earlyLeave')}: {earlyMin} {t('minutes')}
//                     </div>
//                   )}

//                   {earlyArrival > 0 && (
//                     <div className="small text-success">
//                       ⬅️ {t('earlyArrival')}: {earlyArrival} {t('minutes')}
//                     </div>
//                   )}

//                   {lateDeparture > 0 && (
//                     <div className="small text-success">
//                       ➡️ {t('lateDeparture')}: {lateDeparture} {t('minutes')}
//                     </div>
//                   )}

//                   {/* ✅ FIX: totalTransitDeductionMinutes */}
//                   {transitMin > 0 && (
//                     <div className="small text-danger">
//                       🚕 {t('transitDeduction')}: {transitMin} {t('minutes')}
//                     </div>
//                   )}

//                   {!hasPenalty && !hasBonus && (
//                     <span className="small text-muted">{t('noPenalties')}</span>
//                   )}
//                 </td>

//                 {/* Details — ✅ FIX: localDateStr بدل day.date مباشرة */}
//                 <td className="text-center">
//                   <button
//                     className="btn btn-sm btn-outline-primary"
//                     onClick={() => onOpenDetails?.({ date: localDateStr(day.date) })}
//                   >
//                     <i className="fas fa-eye" />
//                   </button>
//                 </td>

//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default UserAttendanceSummaryTable;




//--------------------------ui 1

import { useTranslation } from 'react-i18next';
import "/src/style/attendanceProfile.css";

/* ══════════════════════════════════════════════════════════════
   UserAttendanceSummaryTable
   ─────────────────────────────────────────────────────────────
   Source  : DailyAttendanceSummary  (backend)
   Endpoint: GET /admin/attendance/:userId
             GET /admin/user-monthly-report
   ─────────────────────────────────────────────────────────────
   ✅ Schema-correct field names:
        dayStatus  /  totalLateMinutes  /  totalEarlyLeaveMinutes
        totalTransitDeductionMinutes  /  adminNotes[]
   ✅ localDateStr() — yyyy-mm-dd local time (never toISOString)
   ✅ Pagination props from backend: page / pages / total / limit
   ✅ Zero front-end calculation — display only
══════════════════════════════════════════════════════════════ */

/* ── Helpers ─────────────────────────────────────────────────*/
const localDateStr = (value) => {
  const d = new Date(value);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });

const formatWeekday = (value) =>
  new Date(value).toLocaleDateString('en-US', { weekday: 'long' });

const formatTime = (value) =>
  value
    ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

/* ── Status configuration ────────────────────────────────────*/
const STATUS_CFG = {
  working:         { dot: true, label: 'working' },
  holiday:         { dot: true, label: 'holiday' },
  leave_paid:      { dot: true, label: 'leavePaid' },
  leave_unpaid:    { dot: true, label: 'leaveUnpaid' },
  absent:          { dot: true, label: 'absent' },
  non_working_day: { dot: true, label: 'nonWorkingDay' },
  no_data:         { dot: true, label: 'noData' },
};

/* ── Skeleton row ────────────────────────────────────────────*/
function SkeletonRow() {
  const widths = [80, 110, 90, 130, 32];
  return (
    <tr>
      {widths.map((w, i) => (
        <td key={i} style={{ padding: '14px 16px' }}>
          <div className="att-skeleton att-skeleton-cell" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

/* ── Pagination ──────────────────────────────────────────────*/
function Pagination({ page, pages, total, limit, onPageChange }) {
  const { t } = useTranslation();
  if (!pages || pages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);

  const buildRange = () => {
    const range = [];
    const delta = 2;
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== '…') {
        range.push('…');
      }
    }
    return range;
  };

  return (
    <div className="att-pagination">
      <span className="att-pagination__info">
        {t('showing', { from, to, total })}
      </span>
      <div className="att-pagination__controls">
        <button
          className="att-page-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label={t('previous')}
        >
          <i className="fas fa-chevron-left" style={{ fontSize: '.7rem' }} />
        </button>

        {buildRange().map((p, i) =>
          p === '…' ? (
            <span key={`e${i}`} className="att-page-ellipsis">…</span>
          ) : (
            <button
              key={p}
              className={`att-page-btn${p === page ? ' att-page-btn--active' : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}

        <button
          className="att-page-btn"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
          aria-label={t('next')}
        >
          <i className="fas fa-chevron-right" style={{ fontSize: '.7rem' }} />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main component
══════════════════════════════════════════════════════════════ */
function UserAttendanceSummaryTable({
  days         = [],    // DailyAttendanceSummary[]
  loading      = false,
  page         = 1,     // ← from backend
  pages        = 1,     // ← from backend
  total        = 0,     // ← from backend
  limit        = 20,    // ← from backend
  onPageChange,         // (newPage: number) => void
  onOpenDetails,        // ({ userId, date }) => void

}) {
  const { t } = useTranslation();

  return (
    <div className="att-table-card">

      {/* Toolbar */}
      <div className="att-table-toolbar">
        <div className="att-table-toolbar__title">
          <i className="fas fa-calendar-check" />
          {t('attendanceSummary')}
        </div>
        {total > 0 && (
          <span className="att-record-count">
            {total} {t('records')}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="att-table-scroll">
        <table className="att-table">
          <thead>
            <tr>
              <th>{t('date')}</th>
              <th>{t('branches')}</th>
              <th>{t('dayStatus')}</th>
              <th>{t('summary')}</th>
              <th style={{ textAlign: 'center', width: 52 }}>{t('details')}</th>
            </tr>
          </thead>

          <tbody>
            {/* Loading skeleton */}
            {loading && Array.from({ length: Math.min(limit, 8) }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}

            {/* Empty */}
            {!loading && days.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <div className="att-state">
                    <div className="att-state__icon">📋</div>
                    <div className="att-state__text">{t('noData')}</div>
                  </div>
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!loading && days.map((day) => {
              const status  = day.dayStatus || 'no_data';
              const cfg     = STATUS_CFG[status] || STATUS_CFG.no_data;

              /* ✅ correct field names from DailyAttendanceSummary schema */
              const lateMin    = day.totalLateMinutes             || 0;
              const earlyMin   = day.totalEarlyLeaveMinutes       || 0;
              const transitMin = day.totalTransitDeductionMinutes || 0;
              const earlyArr   = day.earlyArrivalMinutes          || 0;
              const lateDep    = day.lateDepartureMinutes         || 0;

              const hasPenalty = lateMin > 0 || earlyMin > 0 || transitMin > 0;
              const hasBonus   = earlyArr > 0 || lateDep > 0;

              const cIn  = formatTime(day.firstCheckInTime);
              const cOut = formatTime(day.lastCheckOutTime);

              /* ✅ localDateStr — never toISOString */
              const dateStr = localDateStr(day.date);
              const userId  = day.user?._id || day.user;

              return (
                <tr
                  key={day._id || day.date}
                  onClick={() => onOpenDetails?.({ userId, date: dateStr })}
                  style={{ cursor: 'pointer' }}
                >

                  {/* Date */}
                  <td>
                    <div className="att-date-main">{formatDate(day.date)}</div>
                    <div className="att-date-sub">{formatWeekday(day.date)}</div>
                  </td>

                  {/* Branches — branchesVisited from backend */}
                  <td>
                    {day.branchesVisited?.length ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {day.branchesVisited.map((b, i) => (
                          <span
                            key={b.branch || i}
                            className={`att-branch-tag${b.hasInvalid ? ' att-branch-tag--invalid' : ''}`}
                          >
                            <i className="fas fa-building" />
                            {b.name}
                            {b.hasInvalid && (
                              <i className="fas fa-exclamation-circle" title={t('invalidatedAttendance')} />
                            )}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--att-ink-4)', fontSize: '.8rem' }}>—</span>
                    )}
                  </td>

                  {/* Day Status */}
                  <td>
                    <span className={`att-status-badge ${status}`}>
                      {cfg.dot && <span className="att-status-dot" />}
                      {t(cfg.label)}
                    </span>

                    {/* nonWorkingReason chip */}
                    {day.nonWorkingReason && (
                      <div style={{ marginTop: 4 }}>
                        <span
                          style={{
                            background: '#f0f9ff',
                            color: '#075985',
                            borderRadius: 5,
                            padding: '1px 8px',
                            fontSize: '.7rem',
                            fontWeight: 600,
                            display: 'inline-block',
                          }}
                        >
                          {day.nonWorkingReason === 'HOLIDAY' ? t('holiday') : t('weeklyOff')}
                        </span>
                      </div>
                    )}

                    {/* ✅ adminNotes — array from backend */}
                    {day.adminNotes?.length > 0 && (
                      <div style={{ marginTop: 5, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {day.adminNotes.map((note, i) => (
                          <span key={i} className="att-note-chip">
                            <i className="fas fa-sticky-note" style={{ fontSize: '.6rem' }} />
                            {note}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Summary */}
                  <td>
                    {(cIn || cOut) && (
                      <div style={{ marginBottom: 5 }}>
                        {cIn  && <div className="att-time-row"><span className="att-time-label">{t('in')}</span><span className="att-time-val">{cIn}</span></div>}
                        {cOut && <div className="att-time-row"><span className="att-time-label">{t('out')}</span><span className="att-time-val">{cOut}</span></div>}
                      </div>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {/* ✅ totalLateMinutes */}
                      {lateMin > 0    && <span className="att-chip att-chip--late">⏰ {lateMin}{t('min')}</span>}
                      {/* ✅ totalEarlyLeaveMinutes */}
                      {earlyMin > 0   && <span className="att-chip att-chip--early">🚪 {earlyMin}{t('min')}</span>}
                      {/* ✅ totalTransitDeductionMinutes */}
                      {transitMin > 0 && <span className="att-chip att-chip--transit">🚕 {transitMin}{t('min')}</span>}
                      {earlyArr > 0   && <span className="att-chip att-chip--bonus">↙ +{earlyArr}{t('min')}</span>}
                      {lateDep > 0    && <span className="att-chip att-chip--bonus">↗ +{lateDep}{t('min')}</span>}

                      {!hasPenalty && !hasBonus && (
                        <span className="att-no-penalty">
                          <i className="fas fa-check" />
                          {t('noPenalties')}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Eye button — ✅ localDateStr */}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="att-eye-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDetails?.({ userId, date: dateStr });
                      }}
                      title={t('viewDetails')}
                    >
                      <i className="fas fa-eye" />
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination — page/pages/total all from backend */}
      {!loading && (
        <Pagination
          page={page}
          pages={pages}
          total={total}
          limit={limit}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

export default UserAttendanceSummaryTable;











