// // src/pages/Reports/components/DailyDetailsTable.jsx
// import { useTranslation } from 'react-i18next';
// import {
//   formatDisplayTime,
// } from '../../helpers/timezone';


// const fmtTime = (ts, timezone) =>
//   formatDisplayTime(ts, timezone);

// function fmtMin(m) {
//   if (!m) return '—';
//   return `${Math.floor(m / 60)}h ${m % 60}m`;
// }

// const ROW_CLASS = {
//   WORKING_DAY:          'day-row-working',
//   ABSENT_NO_PERMISSION: 'day-row-absent',
//   LEAVE_PAID:           'day-row-paid-leave',
//   LEAVE_UNPAID:         'day-row-unpaid',
//   NON_WORKING_DAY:      'day-row-off',
//   NO_DATA:              'day-row-no-data',
// };

// export default function DailyDetailsTable({
//   days = [],
//   timezone = 'UTC',
// }) {
//   const { t } = useTranslation('companyReport');

//   if (!days.length) return (
//     <div className="report-empty">
//       <i className="fa-solid fa-calendar-days" />
//       <p>{t('empty.noData')}</p>
//     </div>
//   );

//   const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));

//   return (
//     <div className="report-table-wrap">
//       <table className="report-table">
//         <thead>
//           <tr>
//             <th>{t('table.date')}</th>
//             <th>{t('table.day')}</th>
//             <th>{t('table.status')}</th>
//             <th>{t('table.checkIn')}</th>
//             <th>{t('table.checkOut')}</th>
//          <th>Deductions</th>
// <th>Break Time</th>

//             <th>OT In</th>
//             <th>OT Out</th>
//             <th>{t('table.mode')}</th>
//             <th>{t('table.notes')}</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sorted.map(d => {
//             const rowCls = ROW_CLASS[d.decisionType] || '';
//             const statusLabel = t(`dayStatus.${d.decisionType}`, { defaultValue: d.dayStatus || d.decisionType });


//             const deductionsStr = [
//   d.totalLateMinutes > 0 &&
//     `Late: ${fmtMin(d.totalLateMinutes)}`,

//   d.totalEarlyLeaveMinutes > 0 &&
//     `Early: ${fmtMin(d.totalEarlyLeaveMinutes)}`,

//   d.totalTransitDeductionMinutes > 0 &&
//     `Transit: ${fmtMin(d.totalTransitDeductionMinutes)}`,

//   d.totalGapDeductionMinutes > 0 &&
//     `Break Ded.: ${fmtMin(d.totalGapDeductionMinutes)}`,
// ]
// .filter(Boolean)
// .join('\n');

//          const adminNotes = Array.isArray(d.adminNotes)
//   ? d.adminNotes
//   : d.adminNotes
//     ? [String(d.adminNotes)]
//     : [];

// const notesStr = [
//   ...adminNotes,

//   d.adminOverride
//     ? `Override: ${d.adminOverride.decision}`
//     : null,

//   ...(d.transits || []).map(tr =>
//     tr.deductionMinutes
//       ? `Transit ${tr.fromBranchName || ''} → ${tr.toBranchName || ''} (${tr.deductionMinutes}m)`
//       : null
//   ),

//  (d.branchesVisited || []).length
//   ? `Branches: ${(d.branchesVisited || [])
//       .map(b => b.name)
//       .join(', ')}`
//   : null,

// ].filter(Boolean).join(' | ') || '—';

//             return (
//               <tr key={d.date} className={rowCls}>
//                 <td style={{ fontWeight: 600 }}>{d.date}</td>
//                 <td style={{ color: '#6c757d' }}>{(d.weekday || '').slice(0, 3)}</td>
//                 <td>
//                   <span style={{
//                     fontSize: '0.75rem',
//                     fontWeight: 600,
//                     padding: '2px 8px',
//                     borderRadius: 10,
//                     background: 'rgba(0,0,0,0.06)'
//                   }}>
//                     {statusLabel}
//                   </span>
//                 </td>
//                 <td>{d.hasCheckIn ? fmtTime(
//   d.firstCheckInTime,
//   d.firstCheckInTimezone || d.shiftTimezone || timezone
// ) : '—'}</td>
//                 <td>{d.hasCheckOut ? fmtTime(
//   d.lastCheckOutTime,
//   d.lastCheckOutTimezone || d.shiftTimezone || timezone
// ) : '—'}</td>
//                 {/* <td>
//                   <span style={{ color: d.totalLateMinutes ? '#fd7e14' : 'inherit', fontWeight: d.totalLateMinutes ? 600 : 400 }}>
//                     {fmtMin(d.totalLateMinutes)}
//                   </span>
//                 </td>
//                 <td>{fmtMin(d.totalEarlyLeaveMinutes)}</td>
//                 <td>
//                   <span style={{ color: d.totalTransitDeductionMinutes ? '#dc3545' : 'inherit' }}>
//                     {fmtMin(d.totalTransitDeductionMinutes)}
//                   </span>
//                 </td>
//                 <td>
//   <span style={{
//     color: d.totalGapMinutes ? '#0d6efd' : 'inherit',
//     fontWeight: d.totalGapMinutes ? 600 : 400,
//   }}>
//     {fmtMin(d.totalGapMinutes)}
//   </span>
// </td>

// <td>
//   <span style={{
//     color: d.totalGapDeductionMinutes ? '#dc3545' : 'inherit',
//     fontWeight: d.totalGapDeductionMinutes ? 600 : 400,
//   }}>
//     {fmtMin(d.totalGapDeductionMinutes)}
//   </span>
// </td> */}
// <td
//   style={{
//     whiteSpace: 'pre-line',
//     fontSize: '0.78rem',
//     minWidth: 180,
//     color: '#495057',
//     fontWeight: deductionsStr ? 600 : 400,
//   }}
// >
//   {deductionsStr || '—'}
// </td>

// <td>
//   <span style={{
//     color: d.totalGapMinutes ? '#0d6efd' : 'inherit',
//     fontWeight: d.totalGapMinutes ? 600 : 400,
//   }}>
//     {fmtMin(d.totalGapMinutes)}
//   </span>
// </td>

//                 <td style={{ color: d.earlyArrivalMinutes ? '#198754' : '#aaa' }}>
//                   {fmtMin(d.earlyArrivalMinutes)}
//                 </td>
//                 <td style={{ color: d.lateDepartureMinutes ? '#6f42c1' : '#aaa' }}>
//                   {fmtMin(d.lateDepartureMinutes)}
//                 </td>
//                 <td>
//                   <span style={{
//                     fontSize: '0.72rem',
//                     background: d.workMode === 'REMOTE' ? '#e8f4fd' : '#f0f4ff',
//                     color: d.workMode === 'REMOTE' ? '#0d6efd' : '#1F3864',
//                     padding: '2px 6px', borderRadius: 8, fontWeight: 600
//                   }}>
//                     {d.workMode === 'REMOTE' ? 'Remote' : 'Onsite'}
//                   </span>
//                 </td>
//                 <td className="text-start" style={{ color: '#6c757d', fontSize: '0.78rem', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                   {notesStr}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>

//       {/* Legend */}
//       <div className="d-flex flex-wrap gap-3 p-2 mt-2" style={{ fontSize: '0.75rem', color: '#6c757d' }}>
//         {[
//           ['day-row-working',    t('dayStatus.WORKING_DAY')],
//           ['day-row-absent',     t('dayStatus.ABSENT_NO_PERMISSION')],
//           ['day-row-paid-leave', t('dayStatus.LEAVE_PAID')],
//           ['day-row-unpaid',     t('dayStatus.LEAVE_UNPAID')],
//           ['day-row-off',        t('dayStatus.NON_WORKING_DAY')],
//         ].map(([cls, lbl]) => (
//           <div key={cls} className="d-flex align-items-center gap-1">
//             <span className={cls} style={{ width: 14, height: 14, borderRadius: 3, display: 'inline-block', border: '1px solid #ddd' }} />
//             {lbl}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }











//-------------------------css

// src/pages/Reports/components/DailyDetailsTable.jsx
import { useTranslation } from 'react-i18next';
import {
  formatDisplayTime,
} from '../../helpers/timezone';

import '../../style/Reports.css';

const fmtTime = (ts, timezone) =>
  formatDisplayTime(ts, timezone);

function fmtMin(m) {
  if (!m) return '—';
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

const ROW_CLASS = {
  WORKING_DAY:          'day-row-working',
  ABSENT_NO_PERMISSION: 'day-row-absent',
  LEAVE_PAID:           'day-row-paid-leave',
  LEAVE_UNPAID:         'day-row-unpaid',
  NON_WORKING_DAY:      'day-row-off',
  NO_DATA:              'day-row-no-data',
};

export default function DailyDetailsTable({
  days = [],
  timezone = 'UTC',
}) {
  const { t } = useTranslation('companyReport');

  if (!days.length) return (
    <div className="report-empty">
      <i className="fa-solid fa-calendar-days" />
      <p>{t('empty.noData')}</p>
    </div>
  );

  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="report-table-wrap">
      <table className="report-table">
        <thead>
          <tr>
            <th>{t('table.date')}</th>
            <th>{t('table.day')}</th>
            <th>{t('table.status')}</th>
            <th>{t('table.checkIn')}</th>
            <th>{t('table.checkOut')}</th>
         <th>Deductions</th>
<th>Break Time</th>

            <th>OT In</th>
            <th>OT Out</th>
            <th>{t('table.mode')}</th>
            <th>{t('table.notes')}</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(d => {
            const rowCls = ROW_CLASS[d.decisionType] || '';
            const statusLabel = t(`dayStatus.${d.decisionType}`, { defaultValue: d.dayStatus || d.decisionType });


            const deductionsStr = [
  d.totalLateMinutes > 0 &&
    `Late: ${fmtMin(d.totalLateMinutes)}`,

  d.totalEarlyLeaveMinutes > 0 &&
    `Early: ${fmtMin(d.totalEarlyLeaveMinutes)}`,

  d.totalTransitDeductionMinutes > 0 &&
    `Transit: ${fmtMin(d.totalTransitDeductionMinutes)}`,

  d.totalGapDeductionMinutes > 0 &&
    `Break Ded.: ${fmtMin(d.totalGapDeductionMinutes)}`,
]
.filter(Boolean)
.join('\n');

         const adminNotes = Array.isArray(d.adminNotes)
  ? d.adminNotes
  : d.adminNotes
    ? [String(d.adminNotes)]
    : [];

const notesStr = [
  ...adminNotes,

  d.adminOverride
    ? `Override: ${d.adminOverride.decision}`
    : null,

  ...(d.transits || []).map(tr =>
    tr.deductionMinutes
      ? `Transit ${tr.fromBranchName || ''} → ${tr.toBranchName || ''} (${tr.deductionMinutes}m)`
      : null
  ),

 (d.branchesVisited || []).length
  ? `Branches: ${(d.branchesVisited || [])
      .map(b => b.name)
      .join(', ')}`
  : null,

].filter(Boolean).join(' | ') || '—';

            return (
              <tr key={d.date} className={rowCls}>
                <td className="ddt-td-date">{d.date}</td>
                <td className="ddt-td-weekday">{(d.weekday || '').slice(0, 3)}</td>
                <td>
                  <span className="ddt-status-badge">
                    {statusLabel}
                  </span>
                </td>
                <td>{d.hasCheckIn ? fmtTime(
  d.firstCheckInTime,
  d.firstCheckInTimezone || d.shiftTimezone || timezone
) : '—'}</td>
                <td>{d.hasCheckOut ? fmtTime(
  d.lastCheckOutTime,
  d.lastCheckOutTimezone || d.shiftTimezone || timezone
) : '—'}</td>
                {/* <td>
                  <span style={{ color: d.totalLateMinutes ? '#fd7e14' : 'inherit', fontWeight: d.totalLateMinutes ? 600 : 400 }}>
                    {fmtMin(d.totalLateMinutes)}
                  </span>
                </td>
                <td>{fmtMin(d.totalEarlyLeaveMinutes)}</td>
                <td>
                  <span style={{ color: d.totalTransitDeductionMinutes ? '#dc3545' : 'inherit' }}>
                    {fmtMin(d.totalTransitDeductionMinutes)}
                  </span>
                </td>
                <td>
  <span style={{
    color: d.totalGapMinutes ? '#0d6efd' : 'inherit',
    fontWeight: d.totalGapMinutes ? 600 : 400,
  }}>
    {fmtMin(d.totalGapMinutes)}
  </span>
</td>

<td>
  <span style={{
    color: d.totalGapDeductionMinutes ? '#dc3545' : 'inherit',
    fontWeight: d.totalGapDeductionMinutes ? 600 : 400,
  }}>
    {fmtMin(d.totalGapDeductionMinutes)}
  </span>
</td> */}
<td className={`ddt-td-deductions ${deductionsStr ? 'ddt-td-deductions--active' : ''}`}>
  {deductionsStr || '—'}
</td>

<td>
  <span className={d.totalGapMinutes ? 'ddt-gap-active' : 'ddt-gap-empty'}>
    {fmtMin(d.totalGapMinutes)}
  </span>
</td>

                <td className={d.earlyArrivalMinutes ? 'ddt-early-arrival' : 'ddt-val-muted'}>
                  {fmtMin(d.earlyArrivalMinutes)}
                </td>
                <td className={d.lateDepartureMinutes ? 'ddt-late-departure' : 'ddt-val-muted'}>
                  {fmtMin(d.lateDepartureMinutes)}
                </td>
                <td>
                  <span className={`ddt-work-mode ${d.workMode === 'REMOTE' ? 'ddt-work-mode--remote' : 'ddt-work-mode--onsite'}`}>
                    {d.workMode === 'REMOTE' ? 'Remote' : 'Onsite'}
                  </span>
                </td>
                <td className="text-start ddt-td-notes">
                  {notesStr}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div className="d-flex flex-wrap gap-3 p-2 mt-2 ddt-legend">
        {[
          ['day-row-working',    t('dayStatus.WORKING_DAY')],
          ['day-row-absent',     t('dayStatus.ABSENT_NO_PERMISSION')],
          ['day-row-paid-leave', t('dayStatus.LEAVE_PAID')],
          ['day-row-unpaid',     t('dayStatus.LEAVE_UNPAID')],
          ['day-row-off',        t('dayStatus.NON_WORKING_DAY')],
        ].map(([cls, lbl]) => (
          <div key={cls} className="d-flex align-items-center gap-1">
            <span className={`${cls} ddt-legend-swatch`} />
            {lbl}
          </div>
        ))}
      </div>
    </div>
  );
}