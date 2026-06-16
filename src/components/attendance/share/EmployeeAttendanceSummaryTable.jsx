
// // src/pages/admin/EmployeeAttendanceSummaryTable.jsx
// // ► عارض فقط — مفيش حسابات أو فلترة أو pagination هنا
// // ► كل البيانات جاية من الباك عبر props

// // src/pages/admin/EmployeeAttendanceSummaryTable.jsx
// // ► عارض فقط — مفيش حسابات أو فلترة أو pagination هنا
// // ► كل البيانات جاية من الباك عبر props

// //كل وقت بيتعرض بالـ timezone بتاعه مش بتاع اليوزر ولا البراوزر

// import { useTranslation } from 'react-i18next';

// import { getRowTimezone, formatDisplayTime ,formatDisplayDate} from '../../helpers/timezone';

// // ── Decision badge ────────────────────────────────────────────────
// const DECISION_ICON = {
//   WORKING_DAY:           'fa-check-circle',
//   LEAVE_PAID:            'fa-umbrella-beach',
//   LEAVE_UNPAID:          'fa-calendar-minus',
//   ABSENT_NO_PERMISSION:  'fa-user-times',
//   NON_WORKING_DAY:       'fa-moon',
//   HOLIDAY:               'fa-star-and-crescent',
//   WEEKLY_OFF:            'fa-moon',
//   NO_DATA:               'fa-question-circle',
// };



// export const toAPIDate = (date, timezone) => {
//   const d = new Date(date);

//   const parts = new Intl.DateTimeFormat('en-CA', {
//     timeZone: timezone,
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   }).formatToParts(d);

//   const map = {};
//   parts.forEach(p => {
//     if (p.type !== 'literal') map[p.type] = p.value;
//   });

//   return `${map.year}-${map.month}-${map.day}`;
// };

// // ✅ FIX 2 — نفرق بين HOLIDAY و WEEKLY_OFF جوا NON_WORKING_DAY
// // الباك بيبعت nonWorkingReason: 'HOLIDAY' | 'WEEKLY_OFF' | null
// const getDisplayStatus = (row) => {
//   if (row.decisionType === 'NON_WORKING_DAY') {
//     return row.nonWorkingReason === 'HOLIDAY' ? 'HOLIDAY' : 'WEEKLY_OFF';
//   }
//   return row.decisionType;
// };

// const DecisionBadge = ({ row }) => {
//   const { t }      = useTranslation();
  
//   const status     = getDisplayStatus(row);
//   const icon       = DECISION_ICON[status] || 'fa-circle';
//   // الـ CSS class يبقى NON_WORKING_DAY دايماً للاتنين عشان نفس اللون
//   const badgeClass = row.decisionType === 'NON_WORKING_DAY'
//     ? 'att-badge-NON_WORKING_DAY'
//     : `att-badge-${status || 'NO_DATA'}`;
    
//   return (
//     <span className={`att-badge ${badgeClass}`}>
//       <i className={`fas ${icon}`} />
//       {t(status || 'NO_DATA')}
//     </span>
//   );
// };

// // ── Summary mini-rows ─────────────────────────────────────────────
// const SummaryCell = ({ row, t }) => {
//   const hasPenalty = row.totalLateMinutes > 0
//     || row.totalEarlyLeaveMinutes > 0
//     || row.totalTransitDeductionMinutes > 0;
    
// const tz = getRowTimezone(row);
//   return (
//     <>
//       {/* timing */}
//       {row.firstCheckInTime && (
//         <div className="att-sumrow timing">
//           <i className="fas fa-sign-in-alt" />
//           {t('firstIn')}:
          
//            {/* {formatDisplayTime(row.firstCheckInTime, tz)([], { hour: '2-digit', minute: '2-digit' })} */}
//            {formatDisplayTime(row.firstCheckInTime, tz)}
//         </div>
//       )}
//       {/* {formatDisplayTime(row.lastCheckOutTime , tz)&& (
//         <div className="att-sumrow timing">
//           <i className="fas fa-sign-out-alt" />
//           {t('lastOut')}: {new Date(row.lastCheckOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//         </div>
//       )} */}

// {row.lastCheckOutTime && (
//   <div className="att-sumrow timing">
//     <i className="fas fa-sign-out-alt" />
//     {t('lastOut')}:{formatDisplayTime(row.lastCheckOutTime, tz)}
//   </div>
// )}

//       {/* bonuses */}
//       {row.earlyArrivalMinutes > 0 && (
//         <div className="att-sumrow bonus">
//           <i className="fas fa-star" />
//           {t('earlyArrival')}: {row.earlyArrivalMinutes} {t('min')}
//         </div>
//       )}
//       {row.lateDepartureMinutes > 0 && (
//         <div className="att-sumrow bonus">
//           <i className="fas fa-star-half-alt" />
//           {t('lateDeparture')}: {row.lateDepartureMinutes} {t('min')}
//         </div>
//       )}

//       {/* penalties */}
//       {row.totalLateMinutes > 0 && (
//         <div className="att-sumrow penalty">
//           <i className="fas fa-clock" />
//           {t('late')}: {row.totalLateMinutes} {t('min')}
//         </div>
//       )}
//       {row.totalEarlyLeaveMinutes > 0 && (
//         <div className="att-sumrow penalty">
//           <i className="fas fa-sign-out-alt" />
//           {t('earlyLeave')}: {row.totalEarlyLeaveMinutes} {t('min')}
//         </div>
//       )}
//       {row.totalTransitDeductionMinutes > 0 && (
//         <div className="att-sumrow penalty">
//           <i className="fas fa-route" />
//           {t('transitDeduction')}: {row.totalTransitDeductionMinutes} {t('min')}
//         </div>
//       )}

//       {/* admin notes */}
//       {row.adminNotes?.length > 0 && (
//         <div className="att-sumrow note">
//           <i className="fas fa-sticky-note" />
//           {row.adminNotes.join(', ')}
//         </div>
//       )}

//       {/* no penalty */}
//       {!hasPenalty && !row.firstCheckInTime && (
//         <span className="att-no-penalty">
//           <i className="fas fa-check" /> {t('noPenalties')}
//         </span>
//       )}
//     </>
//   );
// };

// // ── Main component ────────────────────────────────────────────────
// const EmployeeAttendanceSummaryTable = ({ rows = [], loading, onOpenDetails }) => {
//   const { t, i18n } = useTranslation();
//   const locale       = i18n.language === 'ar' ? 'ar-EG' : 'en-GB';

//   if (loading) {
//     return (
//       <div className="att-table-card">
//         <div className="att-loading">
//           <div className="att-spinner" />
//           <div className="att-empty-text">{t('loading')}…</div>
//         </div>
//       </div>
//     );
//   }

//   if (!rows.length) {
//     return (
//       <div className="att-table-card">
//         <div className="att-empty">
//           <div className="att-empty-icon"><i className="fas fa-calendar-times" /></div>
//           <div className="att-empty-text">{t('noData')}</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="att-table-card">
//       <div style={{ overflowX: 'auto' }}>
//         <table className="att-table">
//           <thead>
//             <tr>
//               <th>{t('employee')}</th>
//               <th>{t('date')}</th>
//               <th>{t('branches')}</th>
//               <th>{t('dayStatus')}</th>
//               <th>{t('summary')}</th>
//               <th style={{ textAlign: 'center' }}>{t('details')}</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map(row => {
//               const dateObj = new Date(row.date);
//               const tz = getRowTimezone(row);

//               return (
//                 <tr
//                   key={row._id}
//                   className={row.allInvalid ? 'att-row-invalid' : ''}
//                 >
//                   {/* Employee */}
//                   <td>
//                     <div className="att-emp-name">{row.user?.name || t('deletedUser')}</div>
//                     <div className="att-emp-email">{row.user?.email}</div>
//                   </td>

//                   {/* Date */}
//                   <td>
//                     <div className="att-date-main">
//                       {
                      
//                       //dateObj.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })
//                       //formatDisplayDate(row.date, locale)
// formatDisplayDate(row.date, tz)

//                       // dateObj.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })

//                       }
//                     </div>
//                     <div className="att-date-day">
//                       {
                      
//                       //dateObj.toLocaleDateString(locale, { weekday: 'long' })

//                     formatDisplayDate(row.date,tz,{ weekday: 'long' })
  
//                       // dateObj.toLocaleDateString(locale, { weekday: 'long', timeZone: 'UTC' })

//                       }
//                     </div>
//                   </td>

//                   {/* Branches visited */}
//                   <td>
//                     {row.branchesVisited?.length ? (
//                       row.branchesVisited.map((b, idx) => (
//                         <div key={idx} className="att-branch-item">
//                           <i className="fas fa-building" />
//                           <span>{b.name || b.branch}</span>
//                           {b.invalidated && (
//                             <i
//                               className="fas fa-exclamation-circle"
//                               style={{ color: 'var(--att-danger)', fontSize: '.7rem' }}
//                               title={t('invalidated')}
//                             />
//                           )}
//                         </div>
//                       ))
//                     ) : (
//                       <span style={{ color: 'var(--att-muted)', fontSize: '.78rem' }}>—</span>
//                     )}
//                   </td>

//                   {/* Decision type */}
//                   <td><DecisionBadge row={row} /></td>

//                   {/* Summary */}
//                   <td><SummaryCell row={row} t={t} /></td>

//                   {/* Details button */}
//                   <td style={{ textAlign: 'center' }}>
//                     <button
//                       className="att-btn-details"
//                       onClick={() => {
//                         if (!row.user?._id || !row.date) return;
//                         onOpenDetails(row)
//                         ;
//                       }}
//                     >
//                       <i className="fas fa-eye" />
//                       {t('details')}
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default EmployeeAttendanceSummaryTable;





















// src/components/shared/EmployeeAttendanceSummaryTable.jsx
// Reusable Summary Table - Works for both Admin Dashboard and Employee Profile
// Uses proper timezone handling via getRowTimezone + formatDisplay* helpers

// import { useTranslation } from 'react-i18next';

// import { getRowTimezone, formatDisplayTime, formatDisplayDate } from '../../helpers/timezone';

// // ── Decision Badge ────────────────────────────────────────────────
// const DECISION_ICON = {
//   WORKING_DAY:           'fa-check-circle',
//   LEAVE_PAID:            'fa-umbrella-beach',
//   LEAVE_UNPAID:          'fa-calendar-minus',
//   ABSENT_NO_PERMISSION:  'fa-user-times',
//   NON_WORKING_DAY:       'fa-moon',
//   HOLIDAY:               'fa-star-and-crescent',
//   WEEKLY_OFF:            'fa-moon',
//   NO_DATA:               'fa-question-circle',
// };

// const getDisplayStatus = (row) => {
//   if (row.decisionType === 'NON_WORKING_DAY') {
//     return row.nonWorkingReason === 'HOLIDAY' ? 'HOLIDAY' : 'WEEKLY_OFF';
//   }
//   return row.decisionType;
// };

// const DecisionBadge = ({ row }) => {
//   const { t } = useTranslation();
  
//   const status = getDisplayStatus(row);
//   const icon = DECISION_ICON[status] || 'fa-circle';
  
//   const badgeClass = row.decisionType === 'NON_WORKING_DAY'
//     ? 'att-badge-NON_WORKING_DAY'
//     : `att-badge-${status || 'NO_DATA'}`;
    
//   return (
//     <span className={`att-badge ${badgeClass}`}>
//       <i className={`fas ${icon}`} />
//       {t(status || 'NO_DATA')}
//     </span>
//   );
// };

// // ── Summary Cell ─────────────────────────────────────────────────
// const SummaryCell = ({ row, t }) => {
//   const tz = getRowTimezone(row);
//   const hasPenalty = row.totalLateMinutes > 0 ||
//                      row.totalEarlyLeaveMinutes > 0 ||
//                      row.totalTransitDeductionMinutes > 0;

//   return (
//     <>
//       {/* Timing */}
//       {row.firstCheckInTime && (
//         <div className="att-sumrow timing">
//           <i className="fas fa-sign-in-alt" />
//           {t('firstIn')}: {formatDisplayTime(row.firstCheckInTime, tz)}
//         </div>
//       )}

//       {row.lastCheckOutTime && (
//         <div className="att-sumrow timing">
//           <i className="fas fa-sign-out-alt" />
//           {t('lastOut')}: {formatDisplayTime(row.lastCheckOutTime, tz)}
//         </div>
//       )}

//       {/* Bonuses */}
//       {row.earlyArrivalMinutes > 0 && (
//         <div className="att-sumrow bonus">
//           <i className="fas fa-star" />
//           {t('earlyArrival')}: {row.earlyArrivalMinutes} {t('min')}
//         </div>
//       )}

//       {row.lateDepartureMinutes > 0 && (
//         <div className="att-sumrow bonus">
//           <i className="fas fa-star-half-alt" />
//           {t('lateDeparture')}: {row.lateDepartureMinutes} {t('min')}
//         </div>
//       )}

//       {/* Penalties */}
//       {row.totalLateMinutes > 0 && (
//         <div className="att-sumrow penalty">
//           <i className="fas fa-clock" />
//           {t('late')}: {row.totalLateMinutes} {t('min')}
//         </div>
//       )}

//       {row.totalEarlyLeaveMinutes > 0 && (
//         <div className="att-sumrow penalty">
//           <i className="fas fa-sign-out-alt" />
//           {t('earlyLeave')}: {row.totalEarlyLeaveMinutes} {t('min')}
//         </div>
//       )}

//       {row.totalTransitDeductionMinutes > 0 && (
//         <div className="att-sumrow penalty">
//           <i className="fas fa-route" />
//           {t('transitDeduction')}: {row.totalTransitDeductionMinutes} {t('min')}
//         </div>
//       )}

//       {/* Admin Notes */}
//       {row.adminNotes?.length > 0 && (
//         <div className="att-sumrow note">
//           <i className="fas fa-sticky-note" />
//           {row.adminNotes.join(', ')}
//         </div>
//       )}

//       {/* No Penalty */}
//       {!hasPenalty && !row.firstCheckInTime && (
//         <span className="att-no-penalty">
//           <i className="fas fa-check" /> {t('noPenalties')}
//         </span>
//       )}
//     </>
//   );
// };

// // ── Main Reusable Table Component ───────────────────────────────
// const EmployeeAttendanceSummaryTable = ({
//   rows = [],
//   loading = false,
//   onOpenDetails,
//   showEmployeeColumn = true,   // true in Admin, false in Employee Profile
// }) => {
//   const { t, i18n } = useTranslation();
//   const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-GB';

//   if (loading) {
//     return (
//       <div className="att-table-card">
//         <div className="att-loading">
//           <div className="att-spinner" />
//           <div className="att-empty-text">{t('loading')}…</div>
//         </div>
//       </div>
//     );
//   }

//   if (!rows.length) {
//     return (
//       <div className="att-table-card">
//         <div className="att-empty">
//           <div className="att-empty-icon"><i className="fas fa-calendar-times" /></div>
//           <div className="att-empty-text">{t('noData')}</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="att-table-card">
//       <div style={{ overflowX: 'auto' }}>
//         <table className="att-table">
//           <thead>
//             <tr>
//               {showEmployeeColumn && <th>{t('employee')}</th>}
//               <th>{t('date')}</th>
//               <th>{t('branches')}</th>
//               <th>{t('dayStatus')}</th>
//               <th>{t('summary')}</th>
//               <th style={{ textAlign: 'center' }}>{t('details')}</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map(row => {
//               const tz = getRowTimezone(row);

//               return (
//                 <tr
//                   key={row._id}
//                   className={row.allInvalid ? 'att-row-invalid' : ''}
//                   onClick={() => onOpenDetails?.(row)}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   {/* Employee Column - Hidden in Employee Profile */}
//                   {showEmployeeColumn && (
//                     <td>
//                       <div className="att-emp-name">{row.user?.name || t('deletedUser')}</div>
//                       <div className="att-emp-email">{row.user?.email}</div>
//                     </td>
//                   )}

//                   {/* Date */}
//                   <td>
//                     <div className="att-date-main">
//                       {formatDisplayDate(row.date, tz)}
//                     </div>
//                     <div className="att-date-day">
//                       {formatDisplayDate(row.date, tz, { weekday: 'long' })}
//                     </div>
//                   </td>

//                   {/* Branches Visited */}
//                   <td>
//                     {row.branchesVisited?.length ? (
//                       row.branchesVisited.map((b, idx) => (
//                         <div key={idx} className="att-branch-item">
//                           <i className="fas fa-building" />
//                           <span>{b.name || b.branch}</span>
//                           {b.invalidated && (
//                             <i className="fas fa-exclamation-circle" style={{ color: 'var(--att-danger)', fontSize: '.7rem' }} title={t('invalidated')} />
//                           )}
//                         </div>
//                       ))
//                     ) : (
//                       <span style={{ color: 'var(--att-muted)', fontSize: '.78rem' }}>—</span>
//                     )}
//                   </td>

//                   {/* Decision Type */}
//                   <td><DecisionBadge row={row} /></td>

//                   {/* Summary */}
//                   <td><SummaryCell row={row} t={t} /></td>

//                   {/* Details Button */}
//                   <td style={{ textAlign: 'center' }}>
//                     <button
//                       className="att-btn-details"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onOpenDetails?.(row);
//                       }}
//                     >
//                       <i className="fas fa-eye" />
//                       {t('details')}
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default EmployeeAttendanceSummaryTable;










































































// // src/components/shared/EmployeeAttendanceSummaryTable.jsx
// // Fixed version for Employee Profile + Admin

// import { useTranslation } from 'react-i18next';

// import { getRowTimezone, formatDisplayTime, formatDisplayDate } from '../../helpers/timezone';

// // ── Decision Badge ────────────────────────────────────────────────
// const DECISION_ICON = {
//   WORKING_DAY:           'fa-check-circle',
//   LEAVE_PAID:            'fa-umbrella-beach',
//   LEAVE_UNPAID:          'fa-calendar-minus',
//   ABSENT_NO_PERMISSION:  'fa-user-times',
//   NON_WORKING_DAY:       'fa-moon',
//   HOLIDAY:               'fa-star-and-crescent',
//   WEEKLY_OFF:            'fa-moon',
//   NO_DATA:               'fa-question-circle',
// };

// const getDisplayStatus = (row) => {
//   if (row.decisionType === 'NON_WORKING_DAY') {
//     return row.nonWorkingReason === 'HOLIDAY' ? 'HOLIDAY' : 'WEEKLY_OFF';
//   }
//   return row.decisionType;
// };

// const DecisionBadge = ({ row }) => {
//   const { t } = useTranslation();
//   const status = getDisplayStatus(row);
//   const icon = DECISION_ICON[status] || 'fa-circle';
  
//   const badgeClass = row.decisionType === 'NON_WORKING_DAY'
//     ? 'att-badge-NON_WORKING_DAY'
//     : `att-badge-${status || 'NO_DATA'}`;
    
//   return (
//     <span className={`att-badge ${badgeClass}`}>
//       <i className={`fas ${icon}`} />
//       {t(status || 'NO_DATA')}
//     </span>
//   );
// };

// // ── Summary Cell - Fixed with fallbackTZ ───────────────────────
// const SummaryCell = ({ row, t, fallbackTZ = 'UTC' }) => {
//   // Final fix: use fallbackTZ from parent if row has no timezone info
//   const tz = getRowTimezone(row) || fallbackTZ;

//   const hasPenalty = row.totalLateMinutes > 0 ||
//                      row.totalEarlyLeaveMinutes > 0 ||
//                      row.totalTransitDeductionMinutes > 0;

//   return (
//     <>
//       {/* {row.firstCheckInTime && (
//         <div className="att-sumrow timing">
//           <i className="fas fa-sign-in-alt" />
//           {t('firstIn')}: {formatDisplayTime(row.firstCheckInTime, row.firstCheckInTimezone)}
          
          
      
//         </div>
//       )} */}

// {row.firstCheckInTime && (
//   <div className="att-sumrow timing">
//     <i className="fas fa-sign-in-alt" />
//     {t('firstIn')}: {
//    // formatDisplayTime(row.firstCheckInTime, getRowTimezone(row)
//    formatDisplayTime(
//   row.firstCheckInTime,
//   row.firstCheckInTimezone || 'UTC'
// )

// //     formatDisplayTime(
// //   row.firstCheckInTime,
// //   row.firstCheckInTimezone || getRowTimezone(row)
// // )

// }
//   </div>
// )}

//       {/* {row.lastCheckOutTime && (
//         <div className="att-sumrow timing">
//           <i className="fas fa-sign-out-alt" />
//           {t('lastOut')}: {formatDisplayTime(row.lastCheckOutTime, row.lastCheckOutTimezone)}
          
      
//         </div>
//       )} */}

// {row.lastCheckOutTime && (
//   <div className="att-sumrow timing">
//     <i className="fas fa-sign-out-alt" />
//     {t('lastOut')}: {
    
//     //formatDisplayTime(row.lastCheckOutTime, getRowTimezone(row) 
    
//     formatDisplayTime(row.lastCheckOutTime, row.lastCheckOutTimezone
//     || 'UTC')}
//   </div>
// )}
//       {row.earlyArrivalMinutes > 0 && (
//         <div className="att-sumrow bonus">
//           <i className="fas fa-star" />
//           {t('earlyArrival')}: {row.earlyArrivalMinutes} {t('min')}
//         </div>
//       )}

//       {row.lateDepartureMinutes > 0 && (
//         <div className="att-sumrow bonus">
//           <i className="fas fa-star-half-alt" />
//           {t('lateDeparture')}: {row.lateDepartureMinutes} {t('min')}
//         </div>
//       )}

//       {row.totalLateMinutes > 0 && (
//         <div className="att-sumrow penalty">
//           <i className="fas fa-clock" />
//           {t('late')}: {row.totalLateMinutes} {t('min')}
//         </div>
//       )}

//       {row.totalEarlyLeaveMinutes > 0 && (
//         <div className="att-sumrow penalty">
//           <i className="fas fa-sign-out-alt" />
//           {t('earlyLeave')}: {row.totalEarlyLeaveMinutes} {t('min')}
//         </div>
//       )}

//       {row.totalTransitDeductionMinutes > 0 && (
//         <div className="att-sumrow penalty">
//           <i className="fas fa-route" />
//           {t('transitDeduction')}: {row.totalTransitDeductionMinutes} {t('min')}
//         </div>
//       )}

//       {row.adminNotes?.length > 0 && (
//         <div className="att-sumrow note">
//           <i className="fas fa-sticky-note" />
//           {row.adminNotes.join(', ')}
//         </div>
//       )}

//       {!hasPenalty && !row.firstCheckInTime && (
//         <span className="att-no-penalty">
//           <i className="fas fa-check" /> {t('noPenalties')}
//         </span>
//       )}
//     </>
//   );
// };

// // ── Main Component ───────────────────────────────────────────────
// const EmployeeAttendanceSummaryTable = ({
//   rows = [],
//   loading = false,
//   showEmployeeColumn = true,
//   fallbackTZ = 'UTC',        // ← Tenant TZ from UserProfile
//   onOpenDetails,
// }) => {
//   const { t } = useTranslation();

//   if (loading) {
//     return (
//       <div className="att-table-card">
//         <div className="att-loading">
//           <div className="att-spinner" />
//           <div className="att-empty-text">{t('loading')}…</div>
//         </div>
//       </div>
//     );
//   }

//   if (!rows.length) {
//     return (
//       <div className="att-table-card">
//         <div className="att-empty">
//           <div className="att-empty-icon"><i className="fas fa-calendar-times" /></div>
//           <div className="att-empty-text">{t('noData')}</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="att-table-card">
//       <div style={{ overflowX: 'auto' }}>
//         <table className="att-table">
//           <thead>
//             <tr>
//               {showEmployeeColumn && <th>{t('employee')}</th>}
//               <th>{t('date')}</th>
//               <th>{t('branches')}</th>
//               <th>{t('dayStatus')}</th>
//               <th>{t('summary')}</th>
//               <th style={{ textAlign: 'center' }}>{t('details')}</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((row) => {
//               const tz = getRowTimezone(row) || fallbackTZ;   // ← Fixed priority

//               return (
//                 <tr
//                   key={row._id}
//                   className={row.allInvalid ? 'att-row-invalid' : ''}
//                   onClick={() => onOpenDetails?.(row)}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   {showEmployeeColumn && (
//                     <td>
//                       <div className="att-emp-name">{row.user?.name || t('deletedUser')}</div>
//                       <div className="att-emp-email">{row.user?.email}</div>
//                     </td>
//                   )}

//                   <td>
//                     <div className="att-date-main">
//                       {formatDisplayDate(row.date, tz)}
//                     </div>
//                     <div className="att-date-day">
//                       {formatDisplayDate(row.date, tz, { weekday: 'long' })}
//                     </div>
//                   </td>

//                   <td>
//                     {row.branchesVisited?.length ? (
//                       row.branchesVisited.map((b, idx) => (
//                         <div key={idx} className="att-branch-item">
//                           <i className="fas fa-building" />
//                           <span>{b.name || b.branch}</span>
//                           {b.invalidated && (
//                             <i className="fas fa-exclamation-circle" style={{ color: 'var(--att-danger)', fontSize: '.7rem' }} title="Invalidated" />
//                           )}
//                         </div>
//                       ))
//                     ) : (
//                       <span style={{ color: 'var(--att-muted)', fontSize: '.78rem' }}>—</span>
//                     )}
//                   </td>

//                   <td><DecisionBadge row={row} /></td>

//                   <td><SummaryCell row={row} t={t} fallbackTZ={fallbackTZ} /></td>

//                   <td style={{ textAlign: 'center' }}>
//                     <button
//                       className="att-btn-details"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onOpenDetails?.(row);
//                       }}
//                     >
//                       <i className="fas fa-eye" />
//                       {t('details')}
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default EmployeeAttendanceSummaryTable;


















// share file:
// Fixed version for Employee Profile + Admin
import { useTranslation } from 'react-i18next';
import { formatDisplayTime, formatDisplayDate } from '../../../helpers/timezone';
import '../../../style/Employeeattendance.css';

// ── Decision Badge ────────────────────────────────────────────────
const DECISION_ICON = {
  WORKING_DAY:           'fa-check-circle',
  LEAVE_PAID:            'fa-umbrella-beach',
  LEAVE_UNPAID:          'fa-calendar-minus',
  ABSENT_NO_PERMISSION:  'fa-user-times',
  NON_WORKING_DAY:       'fa-moon',
  HOLIDAY:               'fa-star-and-crescent',
  WEEKLY_OFF:            'fa-moon',
  NO_DATA:               'fa-question-circle',
};

const getDisplayStatus = (row) => {
  if (row.decisionType === 'NON_WORKING_DAY') {
    return row.nonWorkingReason === 'HOLIDAY' ? 'HOLIDAY' : 'WEEKLY_OFF';
  }
  return row.decisionType;
};

const DecisionBadge = ({ row }) => {
  const { t } = useTranslation('attendance');
  const status = getDisplayStatus(row);
  const icon = DECISION_ICON[status] || 'fa-circle';

  const badgeClass = row.decisionType === 'NON_WORKING_DAY'
    ? 'att-badge-NON_WORKING_DAY'
    : `att-badge-${status || 'NO_DATA'}`;

  return (
    <span className={`att-badge ${badgeClass}`}>
      <i className={`fas ${icon}`} />
      {t(status || 'NO_DATA')}
    </span>
  );
};

// ── Summary Cell (Backend-driven timezone ONLY) ───────────────────
const SummaryCell = ({ row, t }) => {

  const hasPenalty =
    row.totalLateMinutes > 0 ||
    row.totalEarlyLeaveMinutes > 0 ||
    row.totalTransitDeductionMinutes > 0;

  return (
    <>
      {row.firstCheckInTime && (
        <div className="att-sumrow timing">
          <i className="fas fa-sign-in-alt" />
          {t('firstIn')}:{' '}
          {formatDisplayTime(
            row.firstCheckInTime,
            row.firstCheckInTimezone || 'UTC'
          )}
        </div>
      )}

      {row.lastCheckOutTime && (
        <div className="att-sumrow timing">
          <i className="fas fa-sign-out-alt" />
          {t('lastOut')}:{' '}
          {formatDisplayTime(
            row.lastCheckOutTime,
            row.lastCheckOutTimezone || 'UTC'
          )}
        </div>
      )}

      {row.earlyArrivalMinutes > 0 && (
        <div className="att-sumrow bonus">
          <i className="fas fa-star" />
          {t('earlyArrival')}: {row.earlyArrivalMinutes} {t('min')}
        </div>
      )}

      {row.lateDepartureMinutes > 0 && (
        <div className="att-sumrow bonus">
          <i className="fas fa-star-half-alt" />
          {t('lateDeparture')}: {row.lateDepartureMinutes} {t('min')}
        </div>
      )}

      {row.totalLateMinutes > 0 && (
        <div className="att-sumrow penalty">
          <i className="fas fa-clock" />
          {t('late')}: {row.totalLateMinutes} {t('min')}
        </div>
      )}

      {row.totalEarlyLeaveMinutes > 0 && (
        <div className="att-sumrow penalty">
          <i className="fas fa-sign-out-alt" />
          {t('earlyLeave')}: {row.totalEarlyLeaveMinutes} {t('min')}
        </div>
      )}

      {row.totalTransitDeductionMinutes > 0 && (
        <div className="att-sumrow penalty">
          <i className="fas fa-route" />
          {t('transitDeduction')}: {row.totalTransitDeductionMinutes} {t('min')}
        </div>
      )}

      {row.adminNotes?.length > 0 && (
        <div className="att-sumrow note">
          <i className="fas fa-sticky-note" />
          {row.adminNotes.join(', ')}
        </div>
      )}

      {!hasPenalty && !row.firstCheckInTime && (
        <span className="att-no-penalty">
          <i className="fas fa-check" /> {t('noPenalties')}
        </span>
      )}
    </>
  );
};

// ── Main Component ───────────────────────────────────────────────
const EmployeeAttendanceSummaryTable = ({
  rows = [],
  loading = false,
  showEmployeeColumn = true,
  fallbackTZ = 'UTC',
  onOpenDetails,
}) => {
  const { t } = useTranslation('attendance');

  if (loading) {
    return (
      <div className="att-table-card">
        <div className="att-loading">
          <div className="att-spinner" />
          <div className="att-empty-text">{t('loading')}…</div>
        </div>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="att-table-card">
        <div className="att-empty">
          <div className="att-empty-icon">
            <i className="fas fa-calendar-times" />
          </div>
          <div className="att-empty-text">{t('noData')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="att-table-card">
      <div style={{ overflowX: 'auto' }}>
        <table className="att-table">
          <thead>
            <tr>
              {showEmployeeColumn && <th>{t('employee')}</th>}
              <th>{t('date')}</th>
              <th>{t('branches')}</th>
              <th>{t('dayStatus')}</th>
              <th>{t('summary')}</th>
              <th style={{ textAlign: 'center' }}>{t('details')}</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {

              // ✅ أهم سطر في الجدول كله
              const displayTZ =
                row.firstCheckInTimezone ||
                row.lastCheckOutTimezone ||
                fallbackTZ ||
                'UTC';

              return (
                <tr
                  key={row._id}
                  className={row.allInvalid ? 'att-row-invalid' : ''}
                  onClick={() => onOpenDetails?.(row)}
                  style={{ cursor: 'pointer' }}
                >
                  {showEmployeeColumn && (
                    <td>
                      <div className="att-emp-name">
                        {row.user?.name || t('deletedUser')}
                      </div>
                      <div className="att-emp-email">
                        {row.user?.email}
                      </div>
                    </td>
                  )}

                  <td>
                    <div className="att-date-main">
                      {formatDisplayDate(row.date, displayTZ)}
                    </div>
                    <div className="att-date-day">
                      {formatDisplayDate(row.date, displayTZ, { weekday: 'long' })}
                    </div>
                  </td>

                  <td>
                    {row.branchesVisited?.length ? (
                      row.branchesVisited.map((b, idx) => (
                        <div key={idx} className="att-branch-item">
                          <i className="fas fa-building" />
                          <span>{b.name || b.branch}</span>
                        </div>
                      ))
                    ) : (
                      <span style={{ color: 'var(--att-muted)', fontSize: '.78rem' }}>
                        —
                      </span>
                    )}
                  </td>

                  <td>
                    <DecisionBadge row={row} />
                  </td>

                  <td>
                    <SummaryCell row={row} t={t} />
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="att-btn-details"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDetails?.(row);
                      }}
                    >
                      <i className="fas fa-eye" />
                      {t('details')}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeAttendanceSummaryTable;