// // src/pages/Reports/components/UserMonthReport.jsx
// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import DailyDetailsTable from './DailyDetailsTable';
// import {
//   formatDisplayDate,
// } from '../../helpers/timezone';


// /* ── utils ──────────────────────────────────────────────── */
// function fmt(v, dec = 2) {
//   if (v == null || v === '') return '—';
//   const n = Number(v);
//   if (isNaN(n)) return '—';
//   return n.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
// }
// function fmtMin(m) {
//   if (!m && m !== 0) return '—';
//   if (m === 0) return '0m';
//   const h = Math.floor(Math.abs(m) / 60);
//   const min = Math.abs(m) % 60;
//   return h ? `${h}h ${min}m` : `${min}m`;
// }

// const fmtDate = (d, tz) =>
//   formatDisplayDate(d, tz);

// const fmtDateShort = (d, tz) =>
//   formatDisplayDate(d, tz, {
//     day: '2-digit',
//     month: 'short',
//   });


// // function fmtDate(d, timezone = 'UTC') {
// //   if (!d) return '—';

// //   try {
// //     return new Date(d).toLocaleDateString('en-GB', {
// //       timeZone: timezone,
// //       day: '2-digit',
// //       month: 'short',
// //       year: 'numeric',
// //     });
// //   } catch {
// //     return String(d);
// //   }
// // }
// // function fmtDateShort(d, timezone = 'UTC') {
// //   if (!d) return '—';

// //   try {
// //     return new Date(d).toLocaleDateString('en-GB', {
// //       timeZone: timezone,
// //       day: '2-digit',
// //       month: 'short',
// //     });
// //   } catch {
// //     return String(d);
// //   }
// // }

// /* ── sub-components ─────────────────────────────────────── */

// /** Collapsible section wrapper */
// function Section({ title, icon, color = '#1F3864', badge, defaultOpen = true, children }) {
//   const [open, setOpen] = useState(defaultOpen);
//   return (
//     <div className="umr-section">
//       <button
//         className="umr-section-header"
//         onClick={() => setOpen(p => !p)}
//         style={{ '--accent': color }}
//       >
//         <span className="umr-section-icon" style={{ color }}>{icon}</span>
//         <span className="umr-section-title">{title}</span>
//         {badge != null && <span className="umr-badge">{badge}</span>}
//         <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'} umr-chevron`} />
//       </button>
//       {open && <div className="umr-section-body">{children}</div>}
//     </div>
//   );
// }

// /** KPI pill */
// function Kpi({ label, value, sub, color, icon, danger }) {
//   return (
//     <div className={`umr-kpi ${danger ? 'danger' : ''}`} style={{ '--kc': color || '#1F3864' }}>
//       {icon && <span className="umr-kpi-icon">{icon}</span>}
//       <div className="umr-kpi-body">
//         <div className="umr-kpi-value">{value}</div>
//         <div className="umr-kpi-label">{label}</div>
//         {sub && <div className="umr-kpi-sub">{sub}</div>}
//       </div>
//     </div>
//   );
// }

// /* ── Payroll status badge ────────────────────────────────── */
// function PayrollBadge({ status }) {
//   const map = {
//     approved:      { bg:'#d1fae5', color:'#065f46', label:'Approved', icon:'✓' },
//     draft:         { bg:'#fef9c3', color:'#854d0e', label:'Draft',    icon:'⏳' },
//     not_generated: { bg:'#fee2e2', color:'#991b1b', label:'Not Generated', icon:'✗' },
//   };
//   const c = map[status] || map.not_generated;
//   return (
//     <span style={{
//       background:c.bg, color:c.color,
//       borderRadius:20, padding:'3px 12px',
//       fontWeight:700, fontSize:'0.78rem',
//       display:'inline-flex', alignItems:'center', gap:5,
//     }}>
//       {c.icon} {c.label}
//     </span>
//   );
// }

// /* ═══════════════════════════════════════════════════════════
//    EMPLOYEE INFO CARD
// ═══════════════════════════════════════════════════════════ */
// function EmployeeInfoCard({ user, period, payrollStatus, payrollRun , timezone = 'UTC',}) {
//   if (!user) return null;
//   const monthName = new Date(period.year, period.month - 1, 1)
//     .toLocaleString('en-US', { month: 'long' });

//   return (
//     <div className="umr-info-card">
//       <div className="umr-info-avatar">
//         {(user.name || '?').charAt(0).toUpperCase()}
//       </div>
//       <div className="umr-info-main">
//         <div className="umr-info-name">{user.name}</div>
//         <div className="umr-info-meta">
//           <span><i className="fa-solid fa-envelope" /> {user.email || '—'}</span>
//           {(user.branches||[]).map(b => (
//             <span key={b.id}><i className="fa-solid fa-building" /> {b.name}</span>
//           ))}
//           {(user.departments||[]).map(d => (
//             <span key={d.id}><i className="fa-solid fa-sitemap" /> {d.name}</span>
//           ))}
//           <span><i className="fa-solid fa-briefcase" /> {user.role || '—'}</span>
//         </div>
//         <div className="umr-info-period">
//           <i className="fa-solid fa-calendar-days" />
//           {monthName} {period.year}
//           <PayrollBadge status={payrollStatus} />
// {payrollRun?.generatedAt && (
//   <span style={{ fontSize:'0.72rem', color:'#6c757d' }}>
//     Generated: {fmtDate(payrollRun.generatedAt, timezone)}
//   </span>
// )}

// {payrollRun?.generatedBy?.name && (
//   <span style={{ fontSize:'0.72rem', color:'#6c757d' }}>
//     By: {payrollRun.generatedBy.name}
//   </span>
// )}

// {payrollRun?.approvedBy?.name && (
//   <span style={{ fontSize:'0.72rem', color:'#6c757d' }}>
//     Approved By: {payrollRun.approvedBy.name}
//   </span>
// )}

// <span style={{ fontSize:'0.72rem', color:'#6c757d' }}>
//   TZ: {timezone}
// </span>

//           {payrollRun?.approvedAt && (
//             <span style={{ fontSize:'0.72rem', color:'#6c757d' }}>
//               Approved: {fmtDate(payrollRun.approvedAt, timezone)}
//             </span>
//           )}
//         </div>
//       </div>
//       <div className="umr-info-salary">
//         <div className="umr-salary-label">Base Salary</div>
//         <div className="umr-salary-value">{fmt(user.salary)}</div>
//         <div className="umr-salary-sub">
//           {user.workStartTime && user.workEndTime
//             ? `${user.workStartTime} – ${user.workEndTime}`
//             : `${user.workingHoursPerDay || 8}h / day`}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════
//    SALARY SUMMARY — net salary breakdown
// ═══════════════════════════════════════════════════════════ */
// function SalarySummary({ payrollRun }) {
//   if (!payrollRun) return (
//     <div className="umr-no-payroll">
//       <i className="fa-solid fa-triangle-exclamation" style={{ color:'#f59e0b' }} />
//       No payroll run found for this period.
//     </div>
//   );

//   const p = payrollRun;
//   const rows = [
//     { label:'Base Salary',        value: p.baseSalary,             sign:'+', color:'#1e40af' },
//     { label:'Overtime',           value: p.overtime?.total,         sign:'+', color:'#7c3aed', hide: !p.overtime?.total },
//     { label:'Bonus',              value: p.bonus?.total,            sign:'+', color:'#059669', hide: !p.bonus?.total },
//     { label:'Deductions',         value: p.deductions?.total,       sign:'−', color:'#dc2626' },
//   ];

//   return (
//     <div className="umr-salary-summary">
//       {/* Top figures */}
//       <div className="umr-salary-grid">
//         <Kpi label="Daily Rate"   value={fmt(p.dailySalary)}   icon={<i className="fa-solid fa-coins" />}   color="#1e40af" />
//         <Kpi label="Hourly Rate"  value={fmt(p.hourlySalary)}  icon={<i className="fa-solid fa-clock" />}   color="#1e40af" />
//         <Kpi label="Expected Days" value={p.expectedWorkingDays} icon={<i className="fa-solid fa-calendar-check" />} color="#0369a1" />
//         <Kpi label="Actual Days"  value={p.actualWorkingDays}  icon={<i className="fa-solid fa-calendar-day" />} color="#0369a1" />
//       </div>

//       {/* Waterfall */}
//       <div className="umr-waterfall">
//         {rows.filter(r => !r.hide).map((r, i) => (
//           <div key={i} className="umr-wf-row">
//             <span className="umr-wf-sign" style={{ color: r.sign === '+' ? '#059669' : '#dc2626' }}>{r.sign}</span>
//             <span className="umr-wf-label">{r.label}</span>
//             <span className="umr-wf-value" style={{ color: r.color }}>{fmt(r.value)}</span>
//           </div>
//         ))}
//         <div className="umr-wf-divider" />
//         <div className="umr-wf-net">
//           <span>Net Salary</span>
//           <span className="umr-wf-net-value">{fmt(p.netSalary)}</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════
//    DEDUCTIONS DETAIL
// ═══════════════════════════════════════════════════════════ */
// function DeductionsDetail({ deductions, details, days = [] }) {
//   if (!deductions) return null;
//   const d = deductions;

//   // Aggregate late/early minutes from days
//   const totalLateMin  = (days || []).reduce((s, day) => s + (day.totalLateMinutes || 0), 0);
//   const totalEarlyMin = (days || []).reduce((s, day) => s + (day.totalEarlyLeaveMinutes || 0), 0);
//   const totalEarlyArr = (days || []).reduce((s, day) => s + (day.earlyArrivalMinutes || 0), 0);
//   const totalLateDep  = (days || []).reduce((s, day) => s + (day.lateDepartureMinutes || 0), 0);
//   const totalTransMin = (days || []).reduce((s, day) => s + (day.totalTransitDeductionMinutes || 0), 0);
// const totalBreakDed =
//   (days || []).reduce(
//     (s, day) => s + (day.totalGapDeductionMinutes || 0),
//     0
//   );

//   const items = [
//     {
//       label: 'Absence',
//       amount: d.absence,
//       icon: '🚫',
//       color: '#dc2626',
//       detail: `${details?.absences || 0} absent day(s)`,
//     },
//     {
//       label: 'Late Arrivals',
//       amount: d.late,
//       icon: '⏰',
//       color: '#f59e0b',
//       detail: `${fmtMin(totalLateMin)} total · ${details?.lateDeductionDays || 0} day(s)`,
//     },
//     {
//       label: 'Early Leave',
//       amount: d.earlyLeave,
//       icon: '🏃',
//       color: '#f97316',
//       detail: `${fmtMin(totalEarlyMin)} total`,
//     },
//     {
//       label: 'Transit',
//       amount: d.transit,
//       icon: '🔄',
//       color: '#8b5cf6',
//       detail: `${fmtMin(totalTransMin)} total`,
//     },
//     {
//   label: 'Break Deductions',
//   amount: d.gap,
//   icon: '☕',
//   color: '#7c3aed',
//   detail: `${fmtMin(totalBreakDed)} total`,
// },
//   ];

//   return (
//     <div>
//       <div className="umr-deduct-grid">
//         {items.map(item => (
//           <div key={item.label} className="umr-deduct-card" style={{ '--dc': item.color }}>
//             <div className="umr-deduct-icon">{item.icon}</div>
//             <div className="umr-deduct-body">
//               <div className="umr-deduct-amount" style={{ color: item.color }}>
//                 − {fmt(item.amount)}
//               </div>
//               <div className="umr-deduct-label">{item.label}</div>
//               <div className="umr-deduct-detail">{item.detail}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Total */}
//       <div className="umr-deduct-total">
//         <span>Total Deductions</span>
//         <span style={{ color:'#dc2626', fontWeight:700 }}>− {fmt(d.total)}</span>
//       </div>

//       {/* Attendance summary row */}
//       <div className="umr-att-summary">
//         {totalEarlyArr > 0 && (
//           <span className="umr-att-pill green">
//             <i className="fa-solid fa-arrow-left" /> Early Arrival: {fmtMin(totalEarlyArr)}
//           </span>
//         )}
//         {totalLateDep > 0 && (
//           <span className="umr-att-pill purple">
//             <i className="fa-solid fa-arrow-right" /> Late Departure: {fmtMin(totalLateDep)}
//           </span>
//         )}
//         {details?.paidLeaveDays > 0 && (
//           <span className="umr-att-pill blue">
//             <i className="fa-solid fa-umbrella-beach" /> Paid Leave: {details.paidLeaveDays}d
//           </span>
//         )}
//         {details?.approvedUnpaidDays > 0 && (
//           <span className="umr-att-pill red">
//             <i className="fa-solid fa-ban" /> Unpaid: {details.approvedUnpaidDays}d
//           </span>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════
//    OVERTIME DETAIL
// ═══════════════════════════════════════════════════════════ */
// function OvertimeDetail({ overtime, timezone = 'UTC' }) {
//   if (!overtime) return null;

//   const regular     = (overtime.breakdown || []).filter(e => e.type !== 'EXCEPTIONAL');
//   const exceptional = (overtime.breakdown || []).filter(e => e.type === 'EXCEPTIONAL');

//   const OT_TYPE_LBL = {
//     BEFORE_SHIFT:      'Before Shift',
//     AFTER_SHIFT_DAY:   'After Shift (Day)',
//     AFTER_SHIFT_NIGHT: 'After Shift (Night)',
//     WEEKLY_OFF:        'Weekly Off',
//     HOLIDAY:           'Holiday',
//     EXCEPTIONAL:       'Exceptional',
//   };

//   return (
//     <div>
//       <div className="umr-ot-summary">
//         <div className="umr-ot-pill">
//           <span className="umr-ot-pill-label">Total Earned</span>
//           <span className="umr-ot-pill-value green">{fmt(overtime.total)}</span>
//         </div>
//       </div>

//       {regular.length > 0 && (
//         <div className="umr-ot-block">
//           <div className="umr-ot-block-title">
//             <i className="fa-solid fa-bolt" style={{ color: '#7c3aed' }} /> Regular Overtime
//             <span className="umr-ot-count">{regular.length} entries</span>
//           </div>
//           <table className="umr-mini-table">
//             <thead>
//               <tr>
//                 <th>Date</th>
//                 <th>Type</th>          {/* ✅ جديد */}
//                 <th>Source</th>
//                 <th>Rate Type</th>
//                 <th>Multiplier</th>
//                 <th>Policy</th>
//                 <th>Minutes</th>
//                 <th>Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {regular.map((e, i) => (
//                 <tr key={i}>
//                   <td>{fmtDateShort(e.date, timezone)}</td>
//                   <td>                  {/* ✅ جديد */}
//                     <span className="umr-source-badge">
//                       {OT_TYPE_LBL[e.type] || e.type || '—'}
//                     </span>
//                   </td>
//                   <td><span className="umr-source-badge">{e.source || '—'}</span></td>
//                   <td>{e.rateType || '—'}</td>
//                   <td>{e.multiplier ? `×${e.multiplier}` : '—'}</td>
//                   <td>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
//                       <span className="umr-source-badge">
//                         {e.policySnapshot?.name || e.policyName || '—'}
//                       </span>
//                       {e.policySnapshot?.scope && (
//                         <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>
//                           {e.policySnapshot.scope}
//                         </span>
//                       )}
//                       {e.policySnapshot?.monthlyCap?.enabled && (
//                         <span style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 600 }}>
//                           Cap: {e.policySnapshot.monthlyCap.maxHours}h
//                         </span>
//                       )}
//                     </div>
//                   </td>
//                   <td>{fmtMin(e.minutes)}</td>
//                   <td style={{ fontWeight: 600, color: '#7c3aed' }}>{fmt(e.amount)}</td>
//                 </tr>
//               ))}
//             </tbody>
//             <tfoot>
//               <tr>
//                 <td colSpan={6} style={{ textAlign: 'right', fontWeight: 700 }}>Subtotal</td>
//                 <td style={{ fontWeight: 700, color: '#7c3aed' }}>
//                   {fmt(regular.reduce((s, e) => s + (e.amount || 0), 0))}
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       )}

//       {exceptional.length > 0 && (
//         <div className="umr-ot-block exceptional">
//           <div className="umr-ot-block-title">
//             <i className="fa-solid fa-star" style={{ color: '#d97706' }} /> Exceptional Bonus
//             <span className="umr-ot-count orange">{exceptional.length} entries</span>
//           </div>
//           <table className="umr-mini-table">
//             <thead>
//               <tr><th>Date</th><th>Notes</th><th>Amount</th></tr>
//             </thead>
//             <tbody>
//               {exceptional.map((e, i) => (
//                 <tr key={i}>
//                   <td>{fmtDateShort(e.date, timezone)}</td>
//                   <td style={{ color: '#6b7280', fontSize: '0.82rem' }}>{e.notes || '—'}</td>
//                   <td style={{ fontWeight: 600, color: '#d97706' }}>{fmt(e.amount)}</td>
//                 </tr>
//               ))}
//             </tbody>
//             <tfoot>
//               <tr>
//                 <td colSpan={2} style={{ textAlign: 'right', fontWeight: 700 }}>Subtotal</td>
//                 <td style={{ fontWeight: 700, color: '#d97706' }}>
//                   {fmt(exceptional.reduce((s, e) => s + (e.amount || 0), 0))}
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       )}

//       {!regular.length && !exceptional.length && (
//         <p className="umr-empty-note">No overtime entries this period.</p>
//       )}
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════
//    BONUS DETAIL
// ═══════════════════════════════════════════════════════════ */
// function BonusDetail({ bonus, timezone = 'UTC' }) {
//   if (!bonus) return null;

//   const regularBonus     = (bonus.breakdown || []).filter(b => b.type !== 'EXCEPTIONAL');
//   const exceptionalBonus = (bonus.breakdown || []).filter(b => b.type === 'EXCEPTIONAL');

//   const typeConfig = {
//     ATTENDANCE_BONUS: { icon: '🏆', label: 'Attendance Bonus', color: '#059669' },
//     FIXED_BONUS:      { icon: '💰', label: 'Fixed Bonus',       color: '#0369a1' },
//     EXCEPTIONAL:      { icon: '⭐', label: 'Exceptional Bonus', color: '#d97706' },
//   };

//   return (
//     <div>
//       <div className="umr-bonus-total">
//         Total Bonus{' '}
//         <span style={{ color: '#059669', fontWeight: 700 }}>{fmt(bonus.total)}</span>
//       </div>

//       {regularBonus.length > 0 && (
//         <div className="umr-ot-block">
//           <div className="umr-ot-block-title">
//             <i className="fa-solid fa-gift" style={{ color: '#059669' }} /> Bonus Entries
//             <span className="umr-ot-count">{regularBonus.length} entries</span>
//           </div>
//           <table className="umr-mini-table">
//             <thead>
//               <tr>
//                 <th>Date</th>
//                 <th>Type</th>
//                 <th>Policy</th>
//                 <th>Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {regularBonus.map((b, i) => {
//                 const cfg = typeConfig[b.type] || { icon: '🎁', label: b.type, color: '#6b7280' };
//                 return (
//                   <tr key={i}>
//                     <td>{b.date ? fmtDateShort(b.date, timezone) : '—'}</td>
//                     <td>
//                       <span className="umr-source-badge">
//                         {cfg.icon} {cfg.label}
//                       </span>
//                     </td>
//                     <td>
//                       <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//                         <span className="umr-source-badge">
//                           {b.policySnapshot?.name || b.policyName || '—'}
//                         </span>
//                         {b.policySnapshot?.scope && (
//                           <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>
//                             {b.policySnapshot.scope}
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td style={{ fontWeight: 600, color: cfg.color }}>
//                       + {fmt(b.amount)}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//             <tfoot>
//               <tr>
//                 <td colSpan={3} style={{ textAlign: 'right', fontWeight: 700 }}>Subtotal</td>
//                 <td style={{ fontWeight: 700, color: '#059669' }}>
//                   + {fmt(regularBonus.reduce((s, b) => s + (b.amount || 0), 0))}
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       )}

//       {exceptionalBonus.length > 0 && (
//         <div className="umr-ot-block exceptional" style={{ marginTop: '1rem' }}>
//           <div className="umr-ot-block-title">
//             <i className="fa-solid fa-star" style={{ color: '#d97706' }} /> Exceptional Bonuses
//             <span className="umr-ot-count orange">{exceptionalBonus.length} entries</span>
//           </div>
//           <table className="umr-mini-table">
//             <thead>
//               <tr><th>Date</th><th>Notes</th><th>Amount</th></tr>
//             </thead>
//             <tbody>
//               {exceptionalBonus.map((b, i) => (
//                 <tr key={i}>
//                   <td>{b.date ? fmtDateShort(b.date, timezone) : '—'}</td>
//                   <td style={{ color: '#6b7280', fontSize: '0.82rem' }}>{b.notes || '—'}</td>
//                   <td style={{ fontWeight: 600, color: '#d97706' }}>+ {fmt(b.amount)}</td>
//                 </tr>
//               ))}
//             </tbody>
//             <tfoot>
//               <tr>
//                 <td colSpan={2} style={{ textAlign: 'right', fontWeight: 700 }}>Subtotal</td>
//                 <td style={{ fontWeight: 700, color: '#d97706' }}>
//                   + {fmt(exceptionalBonus.reduce((s, b) => s + (b.amount || 0), 0))}
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       )}

//       {!bonus.breakdown?.length && (
//         <p className="umr-empty-note">No bonus this period.</p>
//       )}
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════
//    POLICY TIMELINE
//    Shows: attendance policy (grace/rates/absence)
//          overtime policy (monthlyCap)
//          bonus policy (conditions)
// ═══════════════════════════════════════════════════════════ */
// function PolicyTimeline({
//   attendancePolicies = [],
//   overtimePolicies = [],
//   bonusPolicies = [],
//   timezone = 'UTC',
// }) {
//   const scopeLabel = s => {
//     if (!s) return '—';
//     if (s === 'global') return '🌐 Global';
//     if (s === 'branch') return '🏢 Branch';
//     if (s === 'department') return '📂 Department';
//     if (s === 'role') return '👤 Role';
//     return s;
//   };

//   const fmtPolicyRate = v => {
//     if (v == null) return '—';
//     return `${(Number(v) * 100).toFixed(0)}% / min`;
//   };

//   const renderOTTypes = (rules = {}) => {
//     const entries = [
//       { key: 'beforeShift',      label: 'Before Shift' },
//       { key: 'afterShiftDay',    label: 'After Shift (Day)' },
//       { key: 'afterShiftNight',  label: 'After Shift (Night)' },
//       { key: 'weeklyOff',        label: 'Weekly Off' },
//       { key: 'holiday',          label: 'Holiday' },
//     ];
//     return entries
//       .filter(e => rules[e.key]?.enabled)
//       .map(e => {
//         const r = rules[e.key];
//         return r.rateType === 'multiplier'
//           ? `${e.label} (×${r.multiplier})`
//           : `${e.label} (${r.fixedRatePerHour}/h)`;
//       })
//       .join(' • ') || '—';
//   };

//   const renderBonusConditions = (conditions = {}) => {
//     const out = [];
//     if (conditions.maxAbsences        != null) out.push(`Absences ≤ ${conditions.maxAbsences}`);
//     if (conditions.maxLateDays        != null) out.push(`Late Days ≤ ${conditions.maxLateDays}`);
//     if (conditions.maxLateMinutesTotal!= null) out.push(`Late Minutes ≤ ${conditions.maxLateMinutesTotal}`);
//     if (conditions.maxUnpaidDays      != null) out.push(`Unpaid ≤ ${conditions.maxUnpaidDays}`);
//     return out.length ? out.join(' • ') : 'Always';
//   };

//   if (!attendancePolicies.length && !overtimePolicies.length && !bonusPolicies.length)
//     return <p className="umr-empty-note">No policy data recorded for this period.</p>;

//   return (
//     <div className="umr-policy-timeline">

//       {/* ── Attendance Policies ── */}
//       {attendancePolicies.map((p, i) => (
//         <div key={`att-${i}`} className="umr-policy-card">
//           <div className="umr-policy-header">
//             <div className="umr-policy-scope">{scopeLabel(p.scope)}</div>
//             <div className="umr-policy-version">
//               {p.name || 'Attendance Policy'} • v{p.version || 1}
//             </div>
//             <div className="umr-policy-period">
//               {fmtDateShort(p.effectiveFrom || p.from, timezone)} →{' '}
//               {p.effectiveTo || p.to ? fmtDateShort(p.effectiveTo || p.to, timezone) : 'Active'}
//             </div>
//           </div>

//           <div className="umr-policy-body">
//             {/* Grace */}
//             {p.grace && (
//               <div className="umr-policy-rule">
//                 <span className="umr-policy-rule-label">
//                   <i className="fa-solid fa-clock" style={{ color: '#f59e0b' }} /> Grace Period
//                 </span>
//                 <span className="umr-policy-rule-value rates-row">
//                   <span className="umr-rate-chip orange">Late: {p.grace.lateMinutes || 0}m</span>
//                   <span className="umr-rate-chip red">Early: {p.grace.earlyLeaveMinutes || 0}m</span>
//                   <span className="umr-rate-chip purple">Break: {p.grace.gapMinutes || 0}m</span>
//                 </span>
//               </div>
//             )}

//             {/* Rates */}
//             {p.rates && (
//               <div className="umr-policy-rule">
//                 <span className="umr-policy-rule-label">
//                   <i className="fa-solid fa-percent" style={{ color: '#6366f1' }} /> Deduction Rates
//                 </span>
//                 <span className="umr-policy-rule-value rates-row">
//                   {p.rates.latePerMinute      != null && <span className="umr-rate-chip orange">Late {fmtPolicyRate(p.rates.latePerMinute)}</span>}
//                   {p.rates.earlyLeavePerMinute!= null && <span className="umr-rate-chip red">Early {fmtPolicyRate(p.rates.earlyLeavePerMinute)}</span>}
//                   {p.rates.transitPerMinute   != null && <span className="umr-rate-chip purple">Transit {fmtPolicyRate(p.rates.transitPerMinute)}</span>}
//                   {p.rates.gapPerMinute       != null && <span className="umr-rate-chip purple">Break {fmtPolicyRate(p.rates.gapPerMinute)}</span>}
//                 </span>
//               </div>
//             )}

//             {/* Absence */}
//             {p.absence && (
//               <div className="umr-policy-rule">
//                 <span className="umr-policy-rule-label">
//                   <i className="fa-solid fa-ban" style={{ color: '#dc2626' }} /> Absence Rule
//                 </span>
//                 <span className="umr-policy-rule-value">
//                   {p.absence.deductSalary
//                     ? <span className="umr-rate-chip red">Deduct {p.absence.dayRate ?? 1}× daily</span>
//                     : <span className="umr-rate-chip green">No deduction</span>}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       ))}

//       {/* ── Overtime Policies ── */}
//       {overtimePolicies.length > 0 && (
//         <div className="umr-policy-block">
//           <div className="umr-policy-title">⚡ Applied Overtime Policies</div>
//           <table className="umr-mini-table">
//             <thead>
//               <tr><th>Policy</th><th>Scope</th><th>Timezone</th><th>Types</th><th>Cap</th></tr>
//             </thead>
//             <tbody>
//               {overtimePolicies.map((p, i) => {
//                 const scopeLbl = [p.scope, p.role || p.branchName || null]
//                   .filter(Boolean).join(' • ');
//                 return (
//                   <tr key={i}>
//                     <td>{p.name || 'Overtime Policy'} v{p.version || 1}</td>
//                     <td>{scopeLbl || 'Global'}</td>
//                     <td>{p.timezone || timezone}</td>
//                     <td style={{ whiteSpace: 'pre-line' }}>{renderOTTypes(p.rules)}</td>
//                     <td>{p.monthlyCap?.enabled ? `${p.monthlyCap.maxHours}h` : 'Unlimited'}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* ── Bonus Policies ── */}
//       {bonusPolicies.length > 0 && (
//         <div className="umr-policy-block">
//           <div className="umr-policy-title">🎁 Applied Bonus Policies</div>
//           <table className="umr-mini-table">
//             <thead>
//               <tr><th>Policy</th><th>Scope</th><th>Timezone</th><th>Type</th><th>Value</th><th>Conditions</th></tr>
//             </thead>
//             <tbody>
//               {bonusPolicies.map((p, i) => {
//                 const scopeLbl = [p.scope, p.role || p.branchName || null]
//                   .filter(Boolean).join(' • ');

//                 const enabledRules = [];
//                 if (p.rules?.attendanceBonus?.enabled) {
//                   const r = p.rules.attendanceBonus;
//                   enabledRules.push({
//                     type: 'Attendance Bonus',
//                     value: r.reward?.type === 'fixed'
//                       ? fmt(r.reward.value)
//                       : `${r.reward?.value}%`,
//                     conditions: renderBonusConditions(r.condition || {}),
//                   });
//                 }
//                 if (p.rules?.fixedBonus?.enabled) {
//                   enabledRules.push({
//                     type: 'Fixed Bonus',
//                     value: fmt(p.rules.fixedBonus.amount),
//                     conditions: 'Always',
//                   });
//                 }

//                 return enabledRules.map((rule, j) => (
//                   <tr key={`${i}-${j}`}>
//                     {j === 0 && <td rowSpan={enabledRules.length}>{p.name || 'Bonus Policy'} v{p.version || 1}</td>}
//                     {j === 0 && <td rowSpan={enabledRules.length}>{scopeLbl || 'Global'}</td>}
//                     {j === 0 && <td rowSpan={enabledRules.length}>{p.timezone || timezone}</td>}
//                     <td>{rule.type}</td>
//                     <td>{rule.value}</td>
//                     <td>{rule.conditions}</td>
//                   </tr>
//                 ));
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════
//    LEAVES SECTION
// ═══════════════════════════════════════════════════════════ */
// function LeavesSection({ leaves = [], leaveBalance, timezone = 'UTC' }) {
//   const statusColor = s => ({
//     approved:'#059669', pending:'#d97706', rejected:'#dc2626'
//   }[s] || '#6b7280');

//   return (
//     <div>
//       {/* Balance */}
//       <small className="umr-section-note">
//   Yearly leave balances and usage up to current month
// </small>
//       {leaveBalance && (
//         <div className="umr-leave-balance">
//           <div className="umr-lb-card">
//             <div className="umr-lb-label">Annual Leave Balance (Yearly)
// </div>
//             <div className="umr-lb-bar">
//               <div
//                 className="umr-lb-fill"
//                 style={{
//                   width: `${leaveBalance.annual.total
//                     ? Math.min(100, (leaveBalance.annual.usedPaid / leaveBalance.annual.total) * 100)
//                     : 0}%`,
//                   background: '#3b82f6',
//                 }}
//               />
//             </div>
//             <div className="umr-lb-nums">
//               <span>{leaveBalance.annual.usedPaid} used</span>
//               <span style={{ color:'#059669', fontWeight:600 }}>
//                 {leaveBalance.annual.remaining} remaining
//               </span>
//               <span style={{ color:'#6b7280' }}>of {leaveBalance.annual.total}</span>
//             </div>
//           </div>
//           <div className="umr-lb-card">
//             <div className="umr-lb-label">Sick Leave Balance (Yearly)</div>
//             <div className="umr-lb-bar">
//               <div
//                 className="umr-lb-fill"
//                 style={{
//                   width: `${leaveBalance.sick.total
//                     ? Math.min(100, (leaveBalance.sick.usedPaid / leaveBalance.sick.total) * 100)
//                     : 0}%`,
//                   background: '#f59e0b',
//                 }}
//               />
//             </div>
//             <div className="umr-lb-nums">
//               <span>{leaveBalance.sick.usedPaid} used</span>
//               <span style={{ color:'#059669', fontWeight:600 }}>
//                 {leaveBalance.sick.remaining} remaining
//               </span>
//               <span style={{ color:'#6b7280' }}>of {leaveBalance.sick.total}</span>
//             </div>
//           </div>
//        <div className="umr-lb-card">
//   <div className="umr-lb-label"> Yearly Unpaid / Absence</div>

//   <div className="umr-lb-nums" style={{ marginTop:12 }}>
//     <span>
//       Unpaid Leave:
//       <strong style={{ marginLeft:6 }}>
//         {leaveBalance.unpaid?.unpaidLeaveDays || 0}
//       </strong>
//     </span>

//     <span>
//       Absent:
//       <strong style={{
//         marginLeft:6,
//         color:'#dc2626',
//       }}>
//         {leaveBalance.unpaid?.absentDays || 0}
//       </strong>
//     </span>
//   </div>
// </div> </div>
        
//       )}



//       {/* Leave list */}
//       {leaves.length > 0 ? (
//         <table className="umr-mini-table" style={{ marginTop:'1rem' }}>
//           <thead>
//             <tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Paid</th><th>Status</th></tr>
//           </thead>
//           <tbody>
//             {leaves.map(l => (
//               <tr key={l.id}>
//                 <td>{l.leaveType}</td>
//                 <td>{fmtDateShort(l.startDate, timezone)}</td>
//                 <td>{fmtDateShort(l.endDate, timezone)}</td>
//                 <td>{l.totalDays}</td>
//                 <td>{l.isPaid ? '✓' : '✗'}</td>
//                 <td>
//                   <span style={{
//                     color: statusColor(l.status),
//                     fontWeight:600, fontSize:'0.78rem',
//                     textTransform:'capitalize',
//                   }}>
//                     {l.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p className="umr-empty-note">No leave requests this period.</p>
//       )}
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════
//    MAIN — UserMonthReport
//    report = buildUserReportData() output
// ═══════════════════════════════════════════════════════════ */
// export default function UserMonthReport({ report }) {
//   if (!report) return null;

//   const {
//     userBasic, period, payrollStatus, payrollRun,
//     attendanceStats, days = [],
//     leaves = [], overtime: _ot, leaveBalance,
//   } = report;
// const TZ = report?.timezone || 'UTC';
//   // ✅ Overtime/Bonus come from payrollRun (stored) when available,
//   //    fallback to any recalculated data
//   const overtime = payrollRun?.overtime || null;
//   const bonus    = payrollRun?.bonus    || null;
//   const deductions = payrollRun?.deductions || null;
//   const details    = payrollRun?.details    || null;
// const attendancePolicies =
//   report?.attendancePolicies || [];

// const overtimePolicies =
//   report?.overtimePolicies || [];

// const bonusPolicies =
//   report?.bonusPolicies || [];

//   const hasOT    = (overtime?.total || 0) > 0 || (overtime?.breakdown?.length || 0) > 0;
//   const hasBonus = (bonus?.total    || 0) > 0 || (bonus?.breakdown?.length    || 0) > 0;

//   return (
//     <div className="user-month-report">

//       {/* ── Employee header ── */}
//       <EmployeeInfoCard
//         user={userBasic}
//         period={period}
//         payrollStatus={payrollStatus}
//         payrollRun={payrollRun}
//          timezone={TZ}
//       />

//       {/* ── Salary summary ── */}
//       <Section title="Salary Summary" icon={<i className="fa-solid fa-coins" />} color="#1e40af">
//         <SalarySummary payrollRun={payrollRun} />
//       </Section>

//       {/* ── Attendance KPIs ── */}
//       <Section title="Attendance Overview" icon={<i className="fa-solid fa-calendar-check" />} color="#0369a1">
//         <div className="umr-att-kpi-grid">
//           <Kpi icon={<i className="fa-solid fa-check-circle" />}  label="Working Days"  value={attendanceStats?.workingDays ?? '—'}    color="#059669" />
//           <Kpi icon={<i className="fa-solid fa-calendar-xmark" />} label="Absent"        value={attendanceStats?.absentDays ?? '—'}     color="#dc2626" danger={attendanceStats?.absentDays > 0} />
//           <Kpi icon={<i className="fa-solid fa-umbrella-beach" />} label="Paid Leave"    value={attendanceStats?.paidLeaveDays ?? '—'}  color="#3b82f6" />
//           <Kpi icon={<i className="fa-solid fa-ban" />}           label="Unpaid Leave"  value={attendanceStats?.unpaidLeaveDays ?? '—'} color="#6b7280" />
//           <Kpi icon={<i className="fa-solid fa-sun" />}           label="Holidays"      value={attendanceStats?.holidayDays ?? '—'}    color="#f59e0b" />
//           <Kpi icon={<i className="fa-solid fa-laptop-house" />}  label="Remote Days"   value={attendanceStats?.remoteWorkDays ?? '—'} color="#8b5cf6" />
//           <Kpi icon={<i className="fa-solid fa-building" />}      label="On-site"       value={attendanceStats?.onsiteWorkDays ?? '—'} color="#0369a1" />
//           <Kpi
//             icon={<i className="fa-solid fa-clock" />}
            
//             label="Total Late"
//             value={fmtMin(attendanceStats?.totalLateMinutes)}
//             color="#f59e0b"
//             danger={attendanceStats?.totalLateMinutes > 0}
//           />
//           <Kpi
//   icon={<i className="fa-solid fa-mug-hot" />}
//   label="Break Violations"
//   value={attendanceStats?.daysWithBreakViolations ?? 0}
//   color="#7c3aed"
// />

// <Kpi
//   icon={<i className="fa-solid fa-route" />}
//   label="Transit Ded."
//   value={fmtMin(attendanceStats?.totalTransitDeductionMinutes)}
//   color="#8b5cf6"
// />

// <Kpi
//   icon={<i className="fa-solid fa-circle-check" />}
//   label="Days Without Invalid Attendance Records"
//   value={attendanceStats?.perfectAttendanceDays ?? 0}
//   color="#059669"
// />

// <Kpi
//   icon={<i className="fa-solid fa-triangle-exclamation" />}
//   label="Days With Incomplete Records"
//   value={attendanceStats?.daysWithIncompleteRecords ?? 0}
//   color="#dc2626"
//   danger={attendanceStats?.daysWithIncompleteRecords > 0}
// />
// <Kpi
//   icon={<i className="fa-solid fa-circle-xmark" />}
//   label="Fully Invalid Attendance Days"
//   value={attendanceStats?.daysWithInvalidRecords ?? 0}
//   color="#991b1b"
//   danger={attendanceStats?.daysWithInvalidRecords > 0}
// />
//         </div>
//       </Section>

//       {/* ── Deductions ── */}
//       {deductions && (
//         <Section
//           title="Deductions"
//           icon={<i className="fa-solid fa-circle-minus" />}
//           color="#dc2626"
//           badge={deductions.total > 0 ? `− ${fmt(deductions.total)}` : '0'}
//         >
//           <DeductionsDetail deductions={deductions} details={details} days={days} />
//         </Section>
//       )}

//       {/* ── Overtime ── */}
//       <Section
//         title="Overtime"
//         icon={<i className="fa-solid fa-bolt" />}
//         color="#7c3aed"
//         badge={hasOT ? `+ ${fmt(overtime?.total)}` : '0'}
//         defaultOpen={hasOT}
//       >
//        <OvertimeDetail
//   overtime={overtime}
//   timezone={TZ}
// />
//       </Section>

//       {/* ── Bonus ── */}
//       <Section
//         title="Bonus"
//         icon={<i className="fa-solid fa-gift" />}
//         color="#059669"
//         badge={hasBonus ? `+ ${fmt(bonus?.total)}` : '0'}
//         defaultOpen={hasBonus}
//       >
//         <BonusDetail
//   bonus={bonus}
//   timezone={TZ}
// />
//       </Section>

//       {/* ── Leaves ── */}
//       <Section
//         title="Leaves"
//         icon={<i className="fa-solid fa-umbrella-beach" />}
//         color="#0369a1"
//         badge={leaves.length || 0}
//         defaultOpen={false}
//       >
//         <LeavesSection
//   leaves={leaves}
//   leaveBalance={leaveBalance}
//   timezone={TZ}
// />
//       </Section>

//       {/* ── Policy Timeline ── */}
//       <Section
//         title="Applied Policies"
//         icon={<i className="fa-solid fa-shield-halved" />}
//         color="#6366f1"
//         badge={
//   attendancePolicies.length +
//   overtimePolicies.length +
//   bonusPolicies.length
// }
//         defaultOpen={false}
//       >
//   <PolicyTimeline
//   attendancePolicies={attendancePolicies}
//   overtimePolicies={overtimePolicies}
//   bonusPolicies={bonusPolicies}
//   timezone={TZ}
// />
//       </Section>

//       {/* ── Daily Details ── */}
//       <Section
//         title="Daily Details"
//         icon={<i className="fa-solid fa-table-list" />}
//         color="#374151"
//         badge={days.length}
//         defaultOpen={false}
//       >
//  <DailyDetailsTable
//   days={days}
//   timezone={TZ}
// />      

// </Section>

//     </div>
//   );
// }




















//------------------------css


// src/pages/Reports/components/UserMonthReport.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DailyDetailsTable from './DailyDetailsTable';
import {
  formatDisplayDate,
} from '../../helpers/timezone';
import '../../style/Reports.css';

/* ── utils ──────────────────────────────────────────────── */
function fmt(v, dec = 2) {
  if (v == null || v === '') return '—';
  const n = Number(v);
  if (isNaN(n)) return '—';
  return n.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function fmtMin(m) {
  if (!m && m !== 0) return '—';
  if (m === 0) return '0m';
  const h = Math.floor(Math.abs(m) / 60);
  const min = Math.abs(m) % 60;
  return h ? `${h}h ${min}m` : `${min}m`;
}

const fmtDate = (d, tz) =>
  formatDisplayDate(d, tz);

const fmtDateShort = (d, tz) =>
  formatDisplayDate(d, tz, {
    day: '2-digit',
    month: 'short',
  });


// function fmtDate(d, timezone = 'UTC') {
//   if (!d) return '—';

//   try {
//     return new Date(d).toLocaleDateString('en-GB', {
//       timeZone: timezone,
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//     });
//   } catch {
//     return String(d);
//   }
// }
// function fmtDateShort(d, timezone = 'UTC') {
//   if (!d) return '—';

//   try {
//     return new Date(d).toLocaleDateString('en-GB', {
//       timeZone: timezone,
//       day: '2-digit',
//       month: 'short',
//     });
//   } catch {
//     return String(d);
//   }
// }

/* ── sub-components ─────────────────────────────────────── */

/** Collapsible section wrapper */
function Section({ title, icon, color = '#1F3864', badge, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="umr-section">
      <button
        className="umr-section-header"
        onClick={() => setOpen(p => !p)}
        style={{ '--accent': color }}
      >
        <span className="umr-section-icon" style={{ color }}>{icon}</span>
        <span className="umr-section-title">{title}</span>
        {badge != null && <span className="umr-badge">{badge}</span>}
        <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'} umr-chevron`} />
      </button>
      {open && <div className="umr-section-body">{children}</div>}
    </div>
  );
}

/** KPI pill */
function Kpi({ label, value, sub, color, icon, danger }) {
  return (
    <div className={`umr-kpi ${danger ? 'danger' : ''}`} style={{ '--kc': color || '#1F3864' }}>
      {icon && <span className="umr-kpi-icon">{icon}</span>}
      <div className="umr-kpi-body">
        <div className="umr-kpi-value">{value}</div>
        <div className="umr-kpi-label">{label}</div>
        {sub && <div className="umr-kpi-sub">{sub}</div>}
      </div>
    </div>
  );
}

/* ── Payroll status badge ────────────────────────────────── */
function PayrollBadge({ status }) {
  const map = {
    approved:      { label:'Approved',     icon:'✓' },
    draft:         { label:'Draft',        icon:'⏳' },
    not_generated: { label:'Not Generated',icon:'✗' },
  };
  const c = map[status] || map.not_generated;
  const cls = status === 'not_generated' ? 'not-generated' : (status || 'not-generated');
  return (
    <span className={`umr-payroll-badge umr-payroll-badge--${cls}`}>
      {c.icon} {c.label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   EMPLOYEE INFO CARD
═══════════════════════════════════════════════════════════ */
function EmployeeInfoCard({ user, period, payrollStatus, payrollRun , timezone = 'UTC',}) {
  if (!user) return null;
  const monthName = new Date(period.year, period.month - 1, 1)
    .toLocaleString('en-US', { month: 'long' });

  return (
    <div className="umr-info-card">
      <div className="umr-info-avatar">
        {(user.name || '?').charAt(0).toUpperCase()}
      </div>
      <div className="umr-info-main">
        <div className="umr-info-name">{user.name}</div>
        <div className="umr-info-meta">
          <span><i className="fa-solid fa-envelope" /> {user.email || '—'}</span>
          {(user.branches||[]).map(b => (
            <span key={b.id}><i className="fa-solid fa-building" /> {b.name}</span>
          ))}
          {(user.departments||[]).map(d => (
            <span key={d.id}><i className="fa-solid fa-sitemap" /> {d.name}</span>
          ))}
          <span><i className="fa-solid fa-briefcase" /> {user.role || '—'}</span>
        </div>
        <div className="umr-info-period">
          <i className="fa-solid fa-calendar-days" />
          {monthName} {period.year}
          <PayrollBadge status={payrollStatus} />
{payrollRun?.generatedAt && (
  <span className="umr-payroll-meta">
    Generated: {fmtDate(payrollRun.generatedAt, timezone)}
  </span>
)}

{payrollRun?.generatedBy?.name && (
  <span className="umr-payroll-meta">
    By: {payrollRun.generatedBy.name}
  </span>
)}

{payrollRun?.approvedBy?.name && (
  <span className="umr-payroll-meta">
    Approved By: {payrollRun.approvedBy.name}
  </span>
)}

<span className="umr-payroll-meta">
  TZ: {timezone}
</span>

          {payrollRun?.approvedAt && (
            <span className="umr-payroll-meta">
              Approved: {fmtDate(payrollRun.approvedAt, timezone)}
            </span>
          )}
        </div>
      </div>
      <div className="umr-info-salary">
        <div className="umr-salary-label">Base Salary</div>
        <div className="umr-salary-value">{fmt(user.salary)}</div>
        <div className="umr-salary-sub">
          {user.workStartTime && user.workEndTime
            ? `${user.workStartTime} – ${user.workEndTime}`
            : `${user.workingHoursPerDay || 8}h / day`}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SALARY SUMMARY — net salary breakdown
═══════════════════════════════════════════════════════════ */
function SalarySummary({ payrollRun }) {
  if (!payrollRun) return (
    <div className="umr-no-payroll">
      <i className="fa-solid fa-triangle-exclamation umr-no-payroll-icon" />
      No payroll run found for this period.
    </div>
  );

  const p = payrollRun;
  const rows = [
    { label:'Base Salary',        value: p.baseSalary,             sign:'+', color:'#1e40af' },
    { label:'Overtime',           value: p.overtime?.total,         sign:'+', color:'#7c3aed', hide: !p.overtime?.total },
    { label:'Bonus',              value: p.bonus?.total,            sign:'+', color:'#059669', hide: !p.bonus?.total },
    { label:'Deductions',         value: p.deductions?.total,       sign:'−', color:'#dc2626' },
  ];

  return (
    <div className="umr-salary-summary">
      {/* Top figures */}
      <div className="umr-salary-grid">
        <Kpi label="Daily Rate"   value={fmt(p.dailySalary)}   icon={<i className="fa-solid fa-coins" />}   color="#1e40af" />
        <Kpi label="Hourly Rate"  value={fmt(p.hourlySalary)}  icon={<i className="fa-solid fa-clock" />}   color="#1e40af" />
        <Kpi label="Expected Days" value={p.expectedWorkingDays} icon={<i className="fa-solid fa-calendar-check" />} color="#0369a1" />
        <Kpi label="Actual Days"  value={p.actualWorkingDays}  icon={<i className="fa-solid fa-calendar-day" />} color="#0369a1" />
      </div>

      {/* Waterfall */}
      <div className="umr-waterfall">
        {rows.filter(r => !r.hide).map((r, i) => (
          <div key={i} className="umr-wf-row">
            <span className={`umr-wf-sign ${r.sign === '+' ? 'umr-wf-sign--plus' : 'umr-wf-sign--minus'}`}>{r.sign}</span>
            <span className="umr-wf-label">{r.label}</span>
            <span className="umr-wf-value" style={{ '--wc': r.color }}>{fmt(r.value)}</span>
          </div>
        ))}
        <div className="umr-wf-divider" />
        <div className="umr-wf-net">
          <span>Net Salary</span>
          <span className="umr-wf-net-value">{fmt(p.netSalary)}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DEDUCTIONS DETAIL
═══════════════════════════════════════════════════════════ */
function DeductionsDetail({ deductions, details, days = [] }) {
  if (!deductions) return null;
  const d = deductions;

  // Aggregate late/early minutes from days
  const totalLateMin  = (days || []).reduce((s, day) => s + (day.totalLateMinutes || 0), 0);
  const totalEarlyMin = (days || []).reduce((s, day) => s + (day.totalEarlyLeaveMinutes || 0), 0);
  const totalEarlyArr = (days || []).reduce((s, day) => s + (day.earlyArrivalMinutes || 0), 0);
  const totalLateDep  = (days || []).reduce((s, day) => s + (day.lateDepartureMinutes || 0), 0);
  const totalTransMin = (days || []).reduce((s, day) => s + (day.totalTransitDeductionMinutes || 0), 0);
const totalBreakDed =
  (days || []).reduce(
    (s, day) => s + (day.totalGapDeductionMinutes || 0),
    0
  );

  const items = [
    {
      label: 'Absence',
      amount: d.absence,
      icon: '🚫',
      color: '#dc2626',
      detail: `${details?.absences || 0} absent day(s)`,
    },
    {
      label: 'Late Arrivals',
      amount: d.late,
      icon: '⏰',
      color: '#f59e0b',
      detail: `${fmtMin(totalLateMin)} total · ${details?.lateDeductionDays || 0} day(s)`,
    },
    {
      label: 'Early Leave',
      amount: d.earlyLeave,
      icon: '🏃',
      color: '#f97316',
      detail: `${fmtMin(totalEarlyMin)} total`,
    },
    {
      label: 'Transit',
      amount: d.transit,
      icon: '🔄',
      color: '#8b5cf6',
      detail: `${fmtMin(totalTransMin)} total`,
    },
    {
  label: 'Break Deductions',
  amount: d.gap,
  icon: '☕',
  color: '#7c3aed',
  detail: `${fmtMin(totalBreakDed)} total`,
},
  ];

  return (
    <div>
      <div className="umr-deduct-grid">
        {items.map(item => (
          <div key={item.label} className="umr-deduct-card" style={{ '--dc': item.color }}>
            <div className="umr-deduct-icon">{item.icon}</div>
            <div className="umr-deduct-body">
              <div className="umr-deduct-amount">
                − {fmt(item.amount)}
              </div>
              <div className="umr-deduct-label">{item.label}</div>
              <div className="umr-deduct-detail">{item.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="umr-deduct-total">
        <span>Total Deductions</span>
        <span className="umr-deduct-total-amount">− {fmt(d.total)}</span>
      </div>

      {/* Attendance summary row */}
      <div className="umr-att-summary">
        {totalEarlyArr > 0 && (
          <span className="umr-att-pill green">
            <i className="fa-solid fa-arrow-left" /> Early Arrival: {fmtMin(totalEarlyArr)}
          </span>
        )}
        {totalLateDep > 0 && (
          <span className="umr-att-pill purple">
            <i className="fa-solid fa-arrow-right" /> Late Departure: {fmtMin(totalLateDep)}
          </span>
        )}
        {details?.paidLeaveDays > 0 && (
          <span className="umr-att-pill blue">
            <i className="fa-solid fa-umbrella-beach" /> Paid Leave: {details.paidLeaveDays}d
          </span>
        )}
        {details?.approvedUnpaidDays > 0 && (
          <span className="umr-att-pill red">
            <i className="fa-solid fa-ban" /> Unpaid: {details.approvedUnpaidDays}d
          </span>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   OVERTIME DETAIL
═══════════════════════════════════════════════════════════ */
function OvertimeDetail({ overtime, timezone = 'UTC' }) {
  if (!overtime) return null;

  const regular     = (overtime.breakdown || []).filter(e => e.type !== 'EXCEPTIONAL');
  const exceptional = (overtime.breakdown || []).filter(e => e.type === 'EXCEPTIONAL');

  const OT_TYPE_LBL = {
    BEFORE_SHIFT:      'Before Shift',
    AFTER_SHIFT_DAY:   'After Shift (Day)',
    AFTER_SHIFT_NIGHT: 'After Shift (Night)',
    WEEKLY_OFF:        'Weekly Off',
    HOLIDAY:           'Holiday',
    EXCEPTIONAL:       'Exceptional',
  };

  return (
    <div>
      <div className="umr-ot-summary">
        <div className="umr-ot-pill">
          <span className="umr-ot-pill-label">Total Earned</span>
          <span className="umr-ot-pill-value green">{fmt(overtime.total)}</span>
        </div>
      </div>

      {regular.length > 0 && (
        <div className="umr-ot-block">
          <div className="umr-ot-block-title">
            <i className="fa-solid fa-bolt umr-icon-purple" /> Regular Overtime
            <span className="umr-ot-count">{regular.length} entries</span>
          </div>
          <table className="umr-mini-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>          {/* ✅ جديد */}
                <th>Source</th>
                <th>Rate Type</th>
                <th>Multiplier</th>
                <th>Policy</th>
                <th>Minutes</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {regular.map((e, i) => (
                <tr key={i}>
                  <td>{fmtDateShort(e.date, timezone)}</td>
                  <td>                  {/* ✅ جديد */}
                    <span className="umr-source-badge">
                      {OT_TYPE_LBL[e.type] || e.type || '—'}
                    </span>
                  </td>
                  <td><span className="umr-source-badge">{e.source || '—'}</span></td>
                  <td>{e.rateType || '—'}</td>
                  <td>{e.multiplier ? `×${e.multiplier}` : '—'}</td>
                  <td>
                    <div className="umr-ot-policy-cell">
                      <span className="umr-source-badge">
                        {e.policySnapshot?.name || e.policyName || '—'}
                      </span>
                      {e.policySnapshot?.scope && (
                        <span className="umr-ot-policy-scope">
                          {e.policySnapshot.scope}
                        </span>
                      )}
                      {e.policySnapshot?.monthlyCap?.enabled && (
                        <span className="umr-ot-policy-cap">
                          Cap: {e.policySnapshot.monthlyCap.maxHours}h
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{fmtMin(e.minutes)}</td>
                  <td className="umr-ot-amount-purple">{fmt(e.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={6} className="umr-tfoot-label">Subtotal</td>
                <td className="umr-ot-amount-purple">
                  {fmt(regular.reduce((s, e) => s + (e.amount || 0), 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {exceptional.length > 0 && (
        <div className="umr-ot-block exceptional">
          <div className="umr-ot-block-title">
            <i className="fa-solid fa-star umr-icon-orange" /> Exceptional Bonus
            <span className="umr-ot-count orange">{exceptional.length} entries</span>
          </div>
          <table className="umr-mini-table">
            <thead>
              <tr><th>Date</th><th>Notes</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {exceptional.map((e, i) => (
                <tr key={i}>
                  <td>{fmtDateShort(e.date, timezone)}</td>
                  <td className="umr-notes-cell">{e.notes || '—'}</td>
                  <td className="umr-ot-amount-orange">{fmt(e.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="umr-tfoot-label">Subtotal</td>
                <td className="umr-ot-amount-orange">
                  {fmt(exceptional.reduce((s, e) => s + (e.amount || 0), 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {!regular.length && !exceptional.length && (
        <p className="umr-empty-note">No overtime entries this period.</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BONUS DETAIL
═══════════════════════════════════════════════════════════ */
function BonusDetail({ bonus, timezone = 'UTC' }) {
  if (!bonus) return null;

  const regularBonus     = (bonus.breakdown || []).filter(b => b.type !== 'EXCEPTIONAL');
  const exceptionalBonus = (bonus.breakdown || []).filter(b => b.type === 'EXCEPTIONAL');

  const typeConfig = {
    ATTENDANCE_BONUS: { icon: '🏆', label: 'Attendance Bonus', color: '#059669' },
    FIXED_BONUS:      { icon: '💰', label: 'Fixed Bonus',       color: '#0369a1' },
    EXCEPTIONAL:      { icon: '⭐', label: 'Exceptional Bonus', color: '#d97706' },
  };

  return (
    <div>
      <div className="umr-bonus-total">
        Total Bonus{' '}
        <span className="umr-bonus-total-amount">{fmt(bonus.total)}</span>
      </div>

      {regularBonus.length > 0 && (
        <div className="umr-ot-block">
          <div className="umr-ot-block-title">
            <i className="fa-solid fa-gift umr-icon-green" /> Bonus Entries
            <span className="umr-ot-count">{regularBonus.length} entries</span>
          </div>
          <table className="umr-mini-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Policy</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {regularBonus.map((b, i) => {
                const cfg = typeConfig[b.type] || { icon: '🎁', label: b.type, color: '#6b7280' };
                return (
                  <tr key={i}>
                    <td>{b.date ? fmtDateShort(b.date, timezone) : '—'}</td>
                    <td>
                      <span className="umr-source-badge">
                        {cfg.icon} {cfg.label}
                      </span>
                    </td>
                    <td>
                      <div className="umr-bonus-policy-cell">
                        <span className="umr-source-badge">
                          {b.policySnapshot?.name || b.policyName || '—'}
                        </span>
                        {b.policySnapshot?.scope && (
                          <span className="umr-bonus-policy-scope">
                            {b.policySnapshot.scope}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="umr-bonus-amount" style={{ '--bc': cfg.color }}>
                      + {fmt(b.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="umr-tfoot-label">Subtotal</td>
                <td className="umr-bonus-amount-green">
                  + {fmt(regularBonus.reduce((s, b) => s + (b.amount || 0), 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {exceptionalBonus.length > 0 && (
        <div className="umr-ot-block exceptional umr-bonus-block-top">
          <div className="umr-ot-block-title">
            <i className="fa-solid fa-star umr-icon-orange" /> Exceptional Bonuses
            <span className="umr-ot-count orange">{exceptionalBonus.length} entries</span>
          </div>
          <table className="umr-mini-table">
            <thead>
              <tr><th>Date</th><th>Notes</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {exceptionalBonus.map((b, i) => (
                <tr key={i}>
                  <td>{b.date ? fmtDateShort(b.date, timezone) : '—'}</td>
                  <td className="umr-notes-cell">{b.notes || '—'}</td>
                  <td className="umr-bonus-amount-orange">+ {fmt(b.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="umr-tfoot-label">Subtotal</td>
                <td className="umr-bonus-amount-orange">
                  + {fmt(exceptionalBonus.reduce((s, b) => s + (b.amount || 0), 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {!bonus.breakdown?.length && (
        <p className="umr-empty-note">No bonus this period.</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   POLICY TIMELINE
   Shows: attendance policy (grace/rates/absence)
         overtime policy (monthlyCap)
         bonus policy (conditions)
═══════════════════════════════════════════════════════════ */
function PolicyTimeline({
  attendancePolicies = [],
  overtimePolicies = [],
  bonusPolicies = [],
  timezone = 'UTC',
}) {
  const scopeLabel = s => {
    if (!s) return '—';
    if (s === 'global') return '🌐 Global';
    if (s === 'branch') return '🏢 Branch';
    if (s === 'department') return '📂 Department';
    if (s === 'role') return '👤 Role';
    return s;
  };

  const fmtPolicyRate = v => {
    if (v == null) return '—';
    return `${(Number(v) * 100).toFixed(0)}% / min`;
  };

  const renderOTTypes = (rules = {}) => {
    const entries = [
      { key: 'beforeShift',      label: 'Before Shift' },
      { key: 'afterShiftDay',    label: 'After Shift (Day)' },
      { key: 'afterShiftNight',  label: 'After Shift (Night)' },
      { key: 'weeklyOff',        label: 'Weekly Off' },
      { key: 'holiday',          label: 'Holiday' },
    ];
    return entries
      .filter(e => rules[e.key]?.enabled)
      .map(e => {
        const r = rules[e.key];
        return r.rateType === 'multiplier'
          ? `${e.label} (×${r.multiplier})`
          : `${e.label} (${r.fixedRatePerHour}/h)`;
      })
      .join(' • ') || '—';
  };

  const renderBonusConditions = (conditions = {}) => {
    const out = [];
    if (conditions.maxAbsences        != null) out.push(`Absences ≤ ${conditions.maxAbsences}`);
    if (conditions.maxLateDays        != null) out.push(`Late Days ≤ ${conditions.maxLateDays}`);
    if (conditions.maxLateMinutesTotal!= null) out.push(`Late Minutes ≤ ${conditions.maxLateMinutesTotal}`);
    if (conditions.maxUnpaidDays      != null) out.push(`Unpaid ≤ ${conditions.maxUnpaidDays}`);
    return out.length ? out.join(' • ') : 'Always';
  };

  if (!attendancePolicies.length && !overtimePolicies.length && !bonusPolicies.length)
    return <p className="umr-empty-note">No policy data recorded for this period.</p>;

  return (
    <div className="umr-policy-timeline">

      {/* ── Attendance Policies ── */}
      {attendancePolicies.map((p, i) => (
        <div key={`att-${i}`} className="umr-policy-card">
          <div className="umr-policy-header">
            <div className="umr-policy-scope">{scopeLabel(p.scope)}</div>
            <div className="umr-policy-version">
              {p.name || 'Attendance Policy'} • v{p.version || 1}
            </div>
            <div className="umr-policy-period">
              {fmtDateShort(p.effectiveFrom || p.from, timezone)} →{' '}
              {p.effectiveTo || p.to ? fmtDateShort(p.effectiveTo || p.to, timezone) : 'Active'}
            </div>
          </div>

          <div className="umr-policy-body">
            {/* Grace */}
            {p.grace && (
              <div className="umr-policy-rule">
                <span className="umr-policy-rule-label">
                  <i className="fa-solid fa-clock umr-icon-yellow" /> Grace Period
                </span>
                <span className="umr-policy-rule-value rates-row">
                  <span className="umr-rate-chip orange">Late: {p.grace.lateMinutes || 0}m</span>
                  <span className="umr-rate-chip red">Early: {p.grace.earlyLeaveMinutes || 0}m</span>
                  <span className="umr-rate-chip purple">Break: {p.grace.gapMinutes || 0}m</span>
                </span>
              </div>
            )}

            {/* Rates */}
            {p.rates && (
              <div className="umr-policy-rule">
                <span className="umr-policy-rule-label">
                  <i className="fa-solid fa-percent umr-icon-indigo" /> Deduction Rates
                </span>
                <span className="umr-policy-rule-value rates-row">
                  {p.rates.latePerMinute      != null && <span className="umr-rate-chip orange">Late {fmtPolicyRate(p.rates.latePerMinute)}</span>}
                  {p.rates.earlyLeavePerMinute!= null && <span className="umr-rate-chip red">Early {fmtPolicyRate(p.rates.earlyLeavePerMinute)}</span>}
                  {p.rates.transitPerMinute   != null && <span className="umr-rate-chip purple">Transit {fmtPolicyRate(p.rates.transitPerMinute)}</span>}
                  {p.rates.gapPerMinute       != null && <span className="umr-rate-chip purple">Break {fmtPolicyRate(p.rates.gapPerMinute)}</span>}
                </span>
              </div>
            )}

            {/* Absence */}
            {p.absence && (
              <div className="umr-policy-rule">
                <span className="umr-policy-rule-label">
                  <i className="fa-solid fa-ban umr-icon-red" /> Absence Rule
                </span>
                <span className="umr-policy-rule-value">
                  {p.absence.deductSalary
                    ? <span className="umr-rate-chip red">Deduct {p.absence.dayRate ?? 1}× daily</span>
                    : <span className="umr-rate-chip green">No deduction</span>}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* ── Overtime Policies ── */}
      {overtimePolicies.length > 0 && (
        <div className="umr-policy-block">
          <div className="umr-policy-title">⚡ Applied Overtime Policies</div>
          <table className="umr-mini-table">
            <thead>
              <tr><th>Policy</th><th>Scope</th><th>Timezone</th><th>Types</th><th>Cap</th></tr>
            </thead>
            <tbody>
              {overtimePolicies.map((p, i) => {
                const scopeLbl = [p.scope, p.role || p.branchName || null]
                  .filter(Boolean).join(' • ');
                return (
                  <tr key={i}>
                    <td>{p.name || 'Overtime Policy'} v{p.version || 1}</td>
                    <td>{scopeLbl || 'Global'}</td>
                    <td>{p.timezone || timezone}</td>
                    <td className="umr-pre-line">{renderOTTypes(p.rules)}</td>
                    <td>{p.monthlyCap?.enabled ? `${p.monthlyCap.maxHours}h` : 'Unlimited'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Bonus Policies ── */}
      {bonusPolicies.length > 0 && (
        <div className="umr-policy-block">
          <div className="umr-policy-title">🎁 Applied Bonus Policies</div>
          <table className="umr-mini-table">
            <thead>
              <tr><th>Policy</th><th>Scope</th><th>Timezone</th><th>Type</th><th>Value</th><th>Conditions</th></tr>
            </thead>
            <tbody>
              {bonusPolicies.map((p, i) => {
                const scopeLbl = [p.scope, p.role || p.branchName || null]
                  .filter(Boolean).join(' • ');

                const enabledRules = [];
                if (p.rules?.attendanceBonus?.enabled) {
                  const r = p.rules.attendanceBonus;
                  enabledRules.push({
                    type: 'Attendance Bonus',
                    value: r.reward?.type === 'fixed'
                      ? fmt(r.reward.value)
                      : `${r.reward?.value}%`,
                    conditions: renderBonusConditions(r.condition || {}),
                  });
                }
                if (p.rules?.fixedBonus?.enabled) {
                  enabledRules.push({
                    type: 'Fixed Bonus',
                    value: fmt(p.rules.fixedBonus.amount),
                    conditions: 'Always',
                  });
                }

                return enabledRules.map((rule, j) => (
                  <tr key={`${i}-${j}`}>
                    {j === 0 && <td rowSpan={enabledRules.length}>{p.name || 'Bonus Policy'} v{p.version || 1}</td>}
                    {j === 0 && <td rowSpan={enabledRules.length}>{scopeLbl || 'Global'}</td>}
                    {j === 0 && <td rowSpan={enabledRules.length}>{p.timezone || timezone}</td>}
                    <td>{rule.type}</td>
                    <td>{rule.value}</td>
                    <td>{rule.conditions}</td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LEAVES SECTION
═══════════════════════════════════════════════════════════ */
function LeavesSection({ leaves = [], leaveBalance, timezone = 'UTC' }) {
  const statusCls = s => ({
    approved: 'umr-leave-status--approved',
    pending:  'umr-leave-status--pending',
    rejected: 'umr-leave-status--rejected',
  }[s] || 'umr-leave-status--default');

  return (
    <div>
      {/* Balance */}
      <small className="umr-section-note">
  Yearly leave balances and usage up to current month
</small>
      {leaveBalance && (
        <div className="umr-leave-balance">
          <div className="umr-lb-card">
            <div className="umr-lb-label">Annual Leave Balance (Yearly)
</div>
            <div className="umr-lb-bar">
              <div
                className="umr-lb-fill umr-lb-fill--annual"
                style={{
                  width: `${leaveBalance.annual.total
                    ? Math.min(100, (leaveBalance.annual.usedPaid / leaveBalance.annual.total) * 100)
                    : 0}%`,
                }}
              />
            </div>
            <div className="umr-lb-nums">
              <span>{leaveBalance.annual.usedPaid} used</span>
              <span className="umr-lb-remaining">
                {leaveBalance.annual.remaining} remaining
              </span>
              <span className="umr-lb-muted">of {leaveBalance.annual.total}</span>
            </div>
          </div>
          <div className="umr-lb-card">
            <div className="umr-lb-label">Sick Leave Balance (Yearly)</div>
            <div className="umr-lb-bar">
              <div
                className="umr-lb-fill umr-lb-fill--sick"
                style={{
                  width: `${leaveBalance.sick.total
                    ? Math.min(100, (leaveBalance.sick.usedPaid / leaveBalance.sick.total) * 100)
                    : 0}%`,
                }}
              />
            </div>
            <div className="umr-lb-nums">
              <span>{leaveBalance.sick.usedPaid} used</span>
              <span className="umr-lb-remaining">
                {leaveBalance.sick.remaining} remaining
              </span>
              <span className="umr-lb-muted">of {leaveBalance.sick.total}</span>
            </div>
          </div>
       <div className="umr-lb-card">
  <div className="umr-lb-label"> Yearly Unpaid / Absence</div>

  <div className="umr-lb-nums umr-lb-nums--spaced">
    <span>
      Unpaid Leave:
      <strong className="umr-lb-value">
        {leaveBalance.unpaid?.unpaidLeaveDays || 0}
      </strong>
    </span>

    <span>
      Absent:
      <strong className="umr-lb-value umr-lb-value--absent">
        {leaveBalance.unpaid?.absentDays || 0}
      </strong>
    </span>
  </div>
</div> </div>
        
      )}



      {/* Leave list */}
      {leaves.length > 0 ? (
        <table className="umr-mini-table umr-leaves-table">
          <thead>
            <tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Paid</th><th>Status</th></tr>
          </thead>
          <tbody>
            {leaves.map(l => (
              <tr key={l.id}>
                <td>{l.leaveType}</td>
                <td>{fmtDateShort(l.startDate, timezone)}</td>
                <td>{fmtDateShort(l.endDate, timezone)}</td>
                <td>{l.totalDays}</td>
                <td>{l.isPaid ? '✓' : '✗'}</td>
                <td>
                  <span className={statusCls(l.status)}>
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="umr-empty-note">No leave requests this period.</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN — UserMonthReport
   report = buildUserReportData() output
═══════════════════════════════════════════════════════════ */
export default function UserMonthReport({ report }) {
  if (!report) return null;

  const {
    userBasic, period, payrollStatus, payrollRun,
    attendanceStats, days = [],
    leaves = [], overtime: _ot, leaveBalance,
  } = report;
const TZ = report?.timezone || 'UTC';
  // ✅ Overtime/Bonus come from payrollRun (stored) when available,
  //    fallback to any recalculated data
  const overtime = payrollRun?.overtime || null;
  const bonus    = payrollRun?.bonus    || null;
  const deductions = payrollRun?.deductions || null;
  const details    = payrollRun?.details    || null;
const attendancePolicies =
  report?.attendancePolicies || [];

const overtimePolicies =
  report?.overtimePolicies || [];

const bonusPolicies =
  report?.bonusPolicies || [];

  const hasOT    = (overtime?.total || 0) > 0 || (overtime?.breakdown?.length || 0) > 0;
  const hasBonus = (bonus?.total    || 0) > 0 || (bonus?.breakdown?.length    || 0) > 0;

  return (
    <div className="user-month-report">

      {/* ── Employee header ── */}
      <EmployeeInfoCard
        user={userBasic}
        period={period}
        payrollStatus={payrollStatus}
        payrollRun={payrollRun}
         timezone={TZ}
      />

      {/* ── Salary summary ── */}
      <Section title="Salary Summary" icon={<i className="fa-solid fa-coins" />} color="#1e40af">
        <SalarySummary payrollRun={payrollRun} />
      </Section>

      {/* ── Attendance KPIs ── */}
      <Section title="Attendance Overview" icon={<i className="fa-solid fa-calendar-check" />} color="#0369a1">
        <div className="umr-att-kpi-grid">
          <Kpi icon={<i className="fa-solid fa-check-circle" />}  label="Working Days"  value={attendanceStats?.workingDays ?? '—'}    color="#059669" />
          <Kpi icon={<i className="fa-solid fa-calendar-xmark" />} label="Absent"        value={attendanceStats?.absentDays ?? '—'}     color="#dc2626" danger={attendanceStats?.absentDays > 0} />
          <Kpi icon={<i className="fa-solid fa-umbrella-beach" />} label="Paid Leave"    value={attendanceStats?.paidLeaveDays ?? '—'}  color="#3b82f6" />
          <Kpi icon={<i className="fa-solid fa-ban" />}           label="Unpaid Leave"  value={attendanceStats?.unpaidLeaveDays ?? '—'} color="#6b7280" />
          <Kpi icon={<i className="fa-solid fa-sun" />}           label="Holidays"      value={attendanceStats?.holidayDays ?? '—'}    color="#f59e0b" />
          <Kpi icon={<i className="fa-solid fa-laptop-house" />}  label="Remote Days"   value={attendanceStats?.remoteWorkDays ?? '—'} color="#8b5cf6" />
          <Kpi icon={<i className="fa-solid fa-building" />}      label="On-site"       value={attendanceStats?.onsiteWorkDays ?? '—'} color="#0369a1" />
          <Kpi
            icon={<i className="fa-solid fa-clock" />}
            
            label="Total Late"
            value={fmtMin(attendanceStats?.totalLateMinutes)}
            color="#f59e0b"
            danger={attendanceStats?.totalLateMinutes > 0}
          />
          <Kpi
  icon={<i className="fa-solid fa-mug-hot" />}
  label="Break Violations"
  value={attendanceStats?.daysWithBreakViolations ?? 0}
  color="#7c3aed"
/>

<Kpi
  icon={<i className="fa-solid fa-route" />}
  label="Transit Ded."
  value={fmtMin(attendanceStats?.totalTransitDeductionMinutes)}
  color="#8b5cf6"
/>

<Kpi
  icon={<i className="fa-solid fa-circle-check" />}
  label="Days Without Invalid Attendance Records"
  value={attendanceStats?.perfectAttendanceDays ?? 0}
  color="#059669"
/>

<Kpi
  icon={<i className="fa-solid fa-triangle-exclamation" />}
  label="Days With Incomplete Records"
  value={attendanceStats?.daysWithIncompleteRecords ?? 0}
  color="#dc2626"
  danger={attendanceStats?.daysWithIncompleteRecords > 0}
/>
<Kpi
  icon={<i className="fa-solid fa-circle-xmark" />}
  label="Fully Invalid Attendance Days"
  value={attendanceStats?.daysWithInvalidRecords ?? 0}
  color="#991b1b"
  danger={attendanceStats?.daysWithInvalidRecords > 0}
/>
        </div>
      </Section>

      {/* ── Deductions ── */}
      {deductions && (
        <Section
          title="Deductions"
          icon={<i className="fa-solid fa-circle-minus" />}
          color="#dc2626"
          badge={deductions.total > 0 ? `− ${fmt(deductions.total)}` : '0'}
        >
          <DeductionsDetail deductions={deductions} details={details} days={days} />
        </Section>
      )}

      {/* ── Overtime ── */}
      <Section
        title="Overtime"
        icon={<i className="fa-solid fa-bolt" />}
        color="#7c3aed"
        badge={hasOT ? `+ ${fmt(overtime?.total)}` : '0'}
        defaultOpen={hasOT}
      >
       <OvertimeDetail
  overtime={overtime}
  timezone={TZ}
/>
      </Section>

      {/* ── Bonus ── */}
      <Section
        title="Bonus"
        icon={<i className="fa-solid fa-gift" />}
        color="#059669"
        badge={hasBonus ? `+ ${fmt(bonus?.total)}` : '0'}
        defaultOpen={hasBonus}
      >
        <BonusDetail
  bonus={bonus}
  timezone={TZ}
/>
      </Section>

      {/* ── Leaves ── */}
      <Section
        title="Leaves"
        icon={<i className="fa-solid fa-umbrella-beach" />}
        color="#0369a1"
        badge={leaves.length || 0}
        defaultOpen={false}
      >
        <LeavesSection
  leaves={leaves}
  leaveBalance={leaveBalance}
  timezone={TZ}
/>
      </Section>

      {/* ── Policy Timeline ── */}
      <Section
        title="Applied Policies"
        icon={<i className="fa-solid fa-shield-halved" />}
        color="#6366f1"
        badge={
  attendancePolicies.length +
  overtimePolicies.length +
  bonusPolicies.length
}
        defaultOpen={false}
      >
  <PolicyTimeline
  attendancePolicies={attendancePolicies}
  overtimePolicies={overtimePolicies}
  bonusPolicies={bonusPolicies}
  timezone={TZ}
/>
      </Section>

      {/* ── Daily Details ── */}
      <Section
        title="Daily Details"
        icon={<i className="fa-solid fa-table-list" />}
        color="#374151"
        badge={days.length}
        defaultOpen={false}
      >
 <DailyDetailsTable
  days={days}
  timezone={TZ}
/>      

</Section>

    </div>
  );
}