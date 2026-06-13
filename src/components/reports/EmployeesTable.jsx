// // // src/pages/Reports/components/EmployeesTable.jsx

// import React, { useState } from 'react';
// // src/pages/Reports/components/EmployeesTable.jsx
// import { useTranslation } from 'react-i18next';
// import '../../style/Reports.css';

// function fmt(v, dec = 0) {
//   if (v == null) return '—';
//   const n = Number(v);
//   if (isNaN(n)) return '—';
//   return n.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
// }
// // function fmtMin(m) {
// //   if (!m) return '—';
// //   return `${Math.floor(m / 60)}h ${m % 60}m`;
// // }

// /* Payroll status mini-badge */
// function PayrollStatusBadge({ status }) {
//   if (!status) return null;
//   const cfg = {
//     approved: {
//   bg:'#d1f5e0',
//   color:'#0a7a3e',
//   label:'✓ Approved'
// },
// draft: {
//   bg:'#fff3cd',
//   color:'#856404',
//   label:'⏳ Draft'
// },
// not_generated: {
//   bg:'#f8d7da',
//   color:'#842029',
//   label:'✗ Missing'
// },
//     // approved:      { bg:'#d1f5e0', color:'#0a7a3e', label:'✓' },
//     // draft:         { bg:'#fff3cd', color:'#856404', label:'⏳' },
//     // not_generated: { bg:'#f8d7da', color:'#842029', label:'✗' },
//   };
//   const c = cfg[status] || cfg.not_generated;
//   return (
//     <span style={{
//       background: c.bg, color: c.color,
//       borderRadius: 10, padding: '1px 7px',
//       fontSize: '0.72rem', fontWeight: 700,
//     }}>
//       {c.label}
//     </span>
//   );
// }

// /* Sort indicator */
// function SortTh({ label, skey, sortKey, sortAsc, onSort, style }) {
//   return (
//     <th style={{ cursor:'pointer', userSelect:'none', ...style }} onClick={() => onSort(skey)}>
//       {label}
//       {sortKey === skey && (
//         <i
//           className={`fa-solid fa-sort-${sortAsc ? 'up' : 'down'} ms-1`}
//           style={{ fontSize:'0.65rem', opacity:0.8 }}
//         />
//       )}
//     </th>
//   );
// }

// /* ═══════════════════════════════════════════════════════════
//    EmployeesTable
//    props:
//      employees   — report.employees[]
//      pagination  — { page, limit, total, totalPages, hasMore } from backend
//      onPageChange — (page) => void
//      onSelectUser — (userId) => void
// ═══════════════════════════════════════════════════════════ */
// export default function EmployeesTable({
//   employees   = [],
//   pagination  = null,
//   onPageChange,
//   onSelectUser,
// }) {
//   const { t } = useTranslation('companyReport');

//   // Client-side sort only (data for this page already from backend)
//   const [sortKey, setSortKey] = useState('name');
//   const [sortAsc, setSortAsc] = useState(true);

//   const toggleSort = key => {
//     if (sortKey === key) setSortAsc(p => !p);
//     else { setSortKey(key); setSortAsc(true); }
//   };

//   const sorted = [...employees].sort((a, b) => {
//     let av, bv;
//     if (sortKey === 'name') {
//       av = a.name || ''; bv = b.name || '';
//       return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
//     }
//     const metricKeys = ['workingDays','absentDays','paidLeaveDays',
//                         'unpaidLeaveDays','totalLateMinutes'];
//  if (metricKeys.includes(sortKey)) {
//   av = a.metrics?.[sortKey] ?? 0;
//   bv = b.metrics?.[sortKey] ?? 0;
// }
// else if (sortKey === 'deductions') {
//   av = a.payroll?.deductions?.total ?? 0;
//   bv = b.payroll?.deductions?.total ?? 0;
// }
// else if (sortKey === 'bonusTotal') {
//   av = a.payroll?.bonus?.total ?? 0;
//   bv = b.payroll?.bonus?.total ?? 0;
// }
// else if (sortKey === 'overtimeTotal') {
//   av = a.payroll?.overtime?.total ?? 0;
//   bv = b.payroll?.overtime?.total ?? 0;
// }
// else {
//   av = a.payroll?.[sortKey] ?? 0;
//   bv = b.payroll?.[sortKey] ?? 0;
// }
//     return sortAsc ? av - bv : bv - av;
//   });

//   if (!employees.length) {
//     return (
//       <div className="report-empty">
//         <i className="fa-solid fa-users-slash" />
//         <p>{t('empty.noEmployees')}</p>
//       </div>
//     );
//   }

//   const thProps = { sortKey, sortAsc, onSort: toggleSort };

//   return (
//     <div>
//       {/* Table */}
//       <div className="report-table-wrap">
//         <table className="report-table">
//           <thead>
//             <tr>
//               <th style={{ width:32 }}>#</th>
//               <SortTh label={t('table.name')}       skey="name"            {...thProps} style={{ textAlign:'left', minWidth:140 }} />
//               <th>{t('table.branch')}</th>
//               <th>{t('table.department')}</th>
//               <th>{t('table.payrollStatus')}</th>
//               {/* <SortTh label={t('table.workDays')}   skey="workingDays"     {...thProps} />
//               <SortTh label={t('table.absent')}     skey="absentDays"      {...thProps} />
//               <SortTh label={t('table.paidLeave')}  skey="paidLeaveDays"   {...thProps} />
//               <SortTh label={t('table.late')}       skey="totalLateMinutes"{...thProps} /> */}
//               <SortTh label={t('table.baseSalary')} skey="baseSalary"      {...thProps} />
//               <SortTh label={t('table.deductions')} skey="deductions"      {...thProps} />
//               <SortTh label={t('table.overtime')}   skey="overtimeTotal"   {...thProps} />
//               <SortTh
//   label={t('table.bonus')}
//   skey="bonusTotal"
//   {...thProps}
// />
//               <SortTh label={t('table.netSalary')}  skey="netSalary"       {...thProps} />
//               {onSelectUser && <th></th>}
//             </tr>
//           </thead>
//           <tbody>
//             {sorted.map((emp, idx) => {
//               // const m  = emp.metrics || {};
//               const p  = emp.payroll || null;
//               const page = pagination?.page ?? 1;
//               const limit= pagination?.limit ?? employees.length;
//               const rowNum = (page - 1) * limit + idx + 1;

//               // const branchStr = (emp.branches    || []).map(b => b.name).join(', ') || '—';
// const branchStr =
//   emp.branches?.length > 1
//     ? `${emp.branches[0].name} (+${emp.branches.length - 1})`
//     : emp.branches?.[0]?.name || '—';

//     const deptStr  =
//   emp.departments?.length > 1
//     ? `${emp.departments[0].name} (+${emp.departments.length - 1})`
//     : emp.departments?.[0]?.name || '—';

//               // const deptStr   = (emp.departments || []).map(d => d.name).join(', ') || '—';

//               return (
//                 <tr key={emp.userId}>
//                   <td style={{ color:'#aaa', fontSize:'0.72rem' }}>{rowNum}</td>

//                   <td className="text-start" style={{ fontWeight:600 }}>
//                     {emp.name}
//                   </td>

//                   <td style={{ fontSize:'0.8rem', color:'#495057' }}>{branchStr}</td>

//                   {/* ✅ Department column */}
//                   <td style={{ fontSize:'0.8rem', color:'#495057' }}>{deptStr}</td>

//                   {/* Payroll status badge */}
//                   <td>
//                     <PayrollStatusBadge status={emp.payrollStatus} />
//                   </td>

//                   {/* <td>{fmt(m.workingDays)}</td>

//                   <td>
//                     <span style={{
//                       color:      m.absentDays > 0 ? '#dc3545' : 'inherit',
//                       fontWeight: m.absentDays > 0 ? 700 : 400,
//                     }}>
//                       {fmt(m.absentDays)}
//                     </span>
//                   </td>

//                   <td>{fmt(m.paidLeaveDays)}</td>

//                   <td>
//                     <span style={{ color: m.totalLateMinutes > 0 ? '#fd7e14' : 'inherit' }}>
//                       {fmtMin(m.totalLateMinutes)}
//                     </span>
//                   </td> */}

//                   {/* Payroll figures — show '—' if no run */}
//                   <td>{p ? fmt(p.baseSalary, 2) : '—'}</td>

//                   <td>
//                     <span style={{ color: (p?.deductions?.total ?? 0) > 0 ? '#dc3545' : 'inherit' }}>
//                       {p ? fmt(p.deductions?.total, 2) : '—'}
//                     </span>
//                   </td>

//                   <td style={{ color: (p?.overtime?.total ?? 0) > 0 ? '#6f42c1' : 'inherit' }}>
//                     {p ? fmt(p.overtime?.total, 2) : '—'}
//                   </td>
// <td
//   style={{
//     color:
//       (p?.bonus?.total ?? 0) > 0
//         ? '#0d6efd'
//         : 'inherit'
//   }}
// >
//   {p ? fmt(p.bonus?.total, 2) : '—'}
// </td>
//                   <td style={{ fontWeight:700, color:'#1F3864' }}>
//                     {p ? fmt(p.netSalary, 2) : '—'}
//                   </td>

//                   {onSelectUser && (
//                     <td>
//                       <button
//                         className="btn btn-sm btn-outline-primary py-0 px-2"
//                         style={{ fontSize:'0.72rem' }}
//                         onClick={() => onSelectUser(emp.userId, emp.name)}
//                         title="View Employee Report"
//                       >
//                         <i className="fa-solid fa-arrow-right" />
//                       </button>
//                     </td>
//                   )}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* ── Backend Pagination ───────────────────────────── */}
//       {pagination && pagination.totalPages > 1 && (
//         <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap gap-2">
//           <span style={{ fontSize:'0.8rem', color:'#6c757d' }}>
//             {t('meta.employees')}: {pagination.total} &nbsp;|&nbsp;
//             Page {pagination.page} / {pagination.totalPages}
//           </span>
//           <div className="d-flex gap-1">
//             <button
//               className="btn btn-sm btn-outline-secondary"
//               disabled={pagination.page === 1}
//               onClick={() => onPageChange(1)}
//             >
//               <i className="fa-solid fa-angles-left" />
//             </button>
//             <button
//               className="btn btn-sm btn-outline-secondary"
//               disabled={pagination.page === 1}
//               onClick={() => onPageChange(pagination.page - 1)}
//             >
//               <i className="fa-solid fa-chevron-left" />
//             </button>

//             {/* Page numbers */}
//             {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
//               const start = Math.max(1, pagination.page - 2);
//               const pg    = start + i;
//               if (pg > pagination.totalPages) return null;
//               return (
//                 <button
//                   key={pg}
//                   className={`btn btn-sm ${pg === pagination.page ? 'btn-primary' : 'btn-outline-secondary'}`}
//                   onClick={() => onPageChange(pg)}
//                 >
//                   {pg}
//                 </button>
//               );
//             })}

//             <button
//               className="btn btn-sm btn-outline-secondary"
//               disabled={!pagination.hasMore}
//               onClick={() => onPageChange(pagination.page + 1)}
//             >
//               <i className="fa-solid fa-chevron-right" />
//             </button>
//             <button
//               className="btn btn-sm btn-outline-secondary"
//               disabled={!pagination.hasMore}
//               onClick={() => onPageChange(pagination.totalPages)}
//             >
//               <i className="fa-solid fa-angles-right" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }













//----------------css
// src/pages/Reports/components/EmployeesTable.jsx


import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import '../../style/Reports.css';

function fmt(v, dec = 0) {
  if (v == null) return '—';
  const n = Number(v);
  if (isNaN(n)) return '—';
  return n.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
// function fmtMin(m) {
//   if (!m) return '—';
//   return `${Math.floor(m / 60)}h ${m % 60}m`;
// }

/* Payroll status mini-badge */
function PayrollStatusBadge({ status }) {
  if (!status) return null;
  const cfg = {
    approved: {
  bg:'#d1f5e0',
  color:'#0a7a3e',
  label:'✓ Approved'
},
draft: {
  bg:'#fff3cd',
  color:'#856404',
  label:'⏳ Draft'
},
not_generated: {
  bg:'#f8d7da',
  color:'#842029',
  label:'✗ Missing'
},
    // approved:      { bg:'#d1f5e0', color:'#0a7a3e', label:'✓' },
    // draft:         { bg:'#fff3cd', color:'#856404', label:'⏳' },
    // not_generated: { bg:'#f8d7da', color:'#842029', label:'✗' },
  };
  const c = cfg[status] || cfg.not_generated;
  const cls = status === 'not_generated' ? 'not-generated' : (status || 'not-generated');
  return (
    <span className={`et-payroll-badge et-payroll-badge--${cls}`}>
      {c.label}
    </span>
  );
}

/* Sort indicator */
function SortTh({ label, skey, sortKey, sortAsc, onSort, className }) {
  return (
    <th className={`et-sort-th ${className || ''}`} onClick={() => onSort(skey)}>
      {label}
      {sortKey === skey && (
        <i className={`fa-solid fa-sort-${sortAsc ? 'up' : 'down'} ms-1 et-sort-icon`} />
      )}
    </th>
  );
}

/* ═══════════════════════════════════════════════════════════
   EmployeesTable
   props:
     employees   — report.employees[]
     pagination  — { page, limit, total, totalPages, hasMore } from backend
     onPageChange — (page) => void
     onSelectUser — (userId) => void
═══════════════════════════════════════════════════════════ */
export default function EmployeesTable({
  employees   = [],
  pagination  = null,
  onPageChange,
  onSelectUser,
}) {
  const { t } = useTranslation('companyReport');

  // Client-side sort only (data for this page already from backend)
  const [sortKey, setSortKey] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);

  const toggleSort = key => {
    if (sortKey === key) setSortAsc(p => !p);
    else { setSortKey(key); setSortAsc(true); }
  };

  const sorted = [...employees].sort((a, b) => {
    let av, bv;
    if (sortKey === 'name') {
      av = a.name || ''; bv = b.name || '';
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    const metricKeys = ['workingDays','absentDays','paidLeaveDays',
                        'unpaidLeaveDays','totalLateMinutes'];
 if (metricKeys.includes(sortKey)) {
  av = a.metrics?.[sortKey] ?? 0;
  bv = b.metrics?.[sortKey] ?? 0;
}
else if (sortKey === 'deductions') {
  av = a.payroll?.deductions?.total ?? 0;
  bv = b.payroll?.deductions?.total ?? 0;
}
else if (sortKey === 'bonusTotal') {
  av = a.payroll?.bonus?.total ?? 0;
  bv = b.payroll?.bonus?.total ?? 0;
}
else if (sortKey === 'overtimeTotal') {
  av = a.payroll?.overtime?.total ?? 0;
  bv = b.payroll?.overtime?.total ?? 0;
}
else {
  av = a.payroll?.[sortKey] ?? 0;
  bv = b.payroll?.[sortKey] ?? 0;
}
    return sortAsc ? av - bv : bv - av;
  });

  if (!employees.length) {
    return (
      <div className="report-empty">
        <i className="fa-solid fa-users-slash" />
        <p>{t('empty.noEmployees')}</p>
      </div>
    );
  }

  const thProps = { sortKey, sortAsc, onSort: toggleSort };

  return (
    <div>
      {/* Table */}
      <div className="report-table-wrap">
        <table className="report-table">
          <thead>
            <tr>
              <th className="et-th-num">#</th>
              <SortTh label={t('table.name')}       skey="name"            {...thProps} className="et-th-name" />
              <th>{t('table.branch')}</th>
              <th>{t('table.department')}</th>
              <th>{t('table.payrollStatus')}</th>
              {/* <SortTh label={t('table.workDays')}   skey="workingDays"     {...thProps} />
              <SortTh label={t('table.absent')}     skey="absentDays"      {...thProps} />
              <SortTh label={t('table.paidLeave')}  skey="paidLeaveDays"   {...thProps} />
              <SortTh label={t('table.late')}       skey="totalLateMinutes"{...thProps} /> */}
              <SortTh label={t('table.baseSalary')} skey="baseSalary"      {...thProps} />
              <SortTh label={t('table.deductions')} skey="deductions"      {...thProps} />
              <SortTh label={t('table.overtime')}   skey="overtimeTotal"   {...thProps} />
              <SortTh
  label={t('table.bonus')}
  skey="bonusTotal"
  {...thProps}
/>
              <SortTh label={t('table.netSalary')}  skey="netSalary"       {...thProps} />
              {onSelectUser && <th></th>}
            </tr>
          </thead>
          <tbody>
            {sorted.map((emp, idx) => {
              // const m  = emp.metrics || {};
              const p  = emp.payroll || null;
              const page = pagination?.page ?? 1;
              const limit= pagination?.limit ?? employees.length;
              const rowNum = (page - 1) * limit + idx + 1;

              // const branchStr = (emp.branches    || []).map(b => b.name).join(', ') || '—';
const branchStr =
  emp.branches?.length > 1
    ? `${emp.branches[0].name} (+${emp.branches.length - 1})`
    : emp.branches?.[0]?.name || '—';

    const deptStr  =
  emp.departments?.length > 1
    ? `${emp.departments[0].name} (+${emp.departments.length - 1})`
    : emp.departments?.[0]?.name || '—';

              // const deptStr   = (emp.departments || []).map(d => d.name).join(', ') || '—';

              return (
                <tr key={emp.userId}>
                  <td className="et-td-num">{rowNum}</td>

                  <td className="text-start et-td-name">
                    {emp.name}
                  </td>

                  <td className="et-td-meta">{branchStr}</td>

                  {/* ✅ Department column */}
                  <td className="et-td-meta">{deptStr}</td>

                  {/* Payroll status badge */}
                  <td>
                    <PayrollStatusBadge status={emp.payrollStatus} />
                  </td>

                  {/* <td>{fmt(m.workingDays)}</td>

                  <td>
                    <span style={{
                      color:      m.absentDays > 0 ? '#dc3545' : 'inherit',
                      fontWeight: m.absentDays > 0 ? 700 : 400,
                    }}>
                      {fmt(m.absentDays)}
                    </span>
                  </td>

                  <td>{fmt(m.paidLeaveDays)}</td>

                  <td>
                    <span style={{ color: m.totalLateMinutes > 0 ? '#fd7e14' : 'inherit' }}>
                      {fmtMin(m.totalLateMinutes)}
                    </span>
                  </td> */}

                  {/* Payroll figures — show '—' if no run */}
                  <td>{p ? fmt(p.baseSalary, 2) : '—'}</td>

                  <td>
                    <span className={(p?.deductions?.total ?? 0) > 0 ? 'et-val-deduction' : ''}>
                      {p ? fmt(p.deductions?.total, 2) : '—'}
                    </span>
                  </td>

                  <td className={(p?.overtime?.total ?? 0) > 0 ? 'et-val-overtime' : ''}>
                    {p ? fmt(p.overtime?.total, 2) : '—'}
                  </td>

                  <td className={(p?.bonus?.total ?? 0) > 0 ? 'et-val-bonus' : ''}>
                    {p ? fmt(p.bonus?.total, 2) : '—'}
                  </td>

                  <td className="et-td-net">
                    {p ? fmt(p.netSalary, 2) : '—'}
                  </td>

                  {onSelectUser && (
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary py-0 px-2 et-btn-view"
                        onClick={() => onSelectUser(emp.userId, emp.name)}
                        title="View Employee Report"
                      >
                        <i className="fa-solid fa-arrow-right" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Backend Pagination ───────────────────────────── */}
      {pagination && pagination.totalPages > 1 && (
        <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap gap-2">
          <span className="et-pagination-meta">
            {t('meta.employees')}: {pagination.total} &nbsp;|&nbsp;
            Page {pagination.page} / {pagination.totalPages}
          </span>
          <div className="d-flex gap-1">
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={pagination.page === 1}
              onClick={() => onPageChange(1)}
            >
              <i className="fa-solid fa-angles-left" />
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={pagination.page === 1}
              onClick={() => onPageChange(pagination.page - 1)}
            >
              <i className="fa-solid fa-chevron-left" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
              const start = Math.max(1, pagination.page - 2);
              const pg    = start + i;
              if (pg > pagination.totalPages) return null;
              return (
                <button
                  key={pg}
                  className={`btn btn-sm ${pg === pagination.page ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => onPageChange(pg)}
                >
                  {pg}
                </button>
              );
            })}

            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={!pagination.hasMore}
              onClick={() => onPageChange(pagination.page + 1)}
            >
              <i className="fa-solid fa-chevron-right" />
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={!pagination.hasMore}
              onClick={() => onPageChange(pagination.totalPages)}
            >
              <i className="fa-solid fa-angles-right" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}