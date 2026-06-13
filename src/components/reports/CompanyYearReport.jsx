// // src/pages/Reports/components/CompanyYearReport.jsx
// import { useState }          from 'react';
// import { useTranslation }    from 'react-i18next';
// import { CompanyKpiCards }   from './ReportSummaryCards';
// import EmployeesTable from './EmployeesTable';
// import '../../style/Reports.css';

// function fmt(v, dec = 2) {
//   if (v == null) return '—';
//   const n = Number(v);
//   if (isNaN(n)) return '—';
//   return n.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
// }
// // function fmtMin(m) { if (!m) return '—'; return `${Math.floor(m/60)}h ${m%60}m`; }

// /* Monthly breakdown table */
// function MonthlyBreakdown({ months = [], yearTotals = {} }) {
//   const { t } = useTranslation('companyReport');

//   return (
//     <div className="report-table-wrap">
//       <table className="report-table">
//         <thead>
//           <tr>
//             {/* <th>{t('table.month')}</th>
//             <th>{t('table.workDays')}</th>
//             <th>{t('table.absent')}</th>
//             <th>{t('table.paidLeave')}</th>
//             <th>{t('table.unpaidLeave')}</th>
//             <th>{t('table.late')}</th>
//             <th>{t('table.baseSalary')}</th>
//             <th>{t('table.deductions')}</th>
//             <th>{t('table.overtime')}</th>
//             <th>{t('table.netSalary')}</th> */}
//     <th>{t('table.month')}</th>
// <th>{t('table.employees')}</th>
// <th>{t('table.baseSalaryyear')}</th>
// <th>{t('table.deductionsyear')}</th>
// <th>{t('table.overtimeyear')}</th>
// <th>{t('table.bonusyear')}</th>
// <th>{t('table.netSalaryyear')}</th>
// <th>{t('table.netPercentageyear')}</th>
//           </tr>
//         </thead>
//         <tbody>
//           {months.map(mo => (
//             mo.error ? (
//               <tr key={mo.month} style={{ background:'#fce4d6' }}>
//                 <td style={{ fontWeight:700 }}>{t(`months.${mo.month}`)}</td>
//                 <td colSpan={8} style={{ color:'#dc3545', fontSize:'0.8rem' }}>
//                   Error: {mo.error}
//                 </td>
//               </tr>
//             ) : (
//               <tr key={mo.month}>
//                 <td style={{ fontWeight:700 }}>{t(`months.${mo.month}`)}</td>
//                 {/* <td>{fmt(mo.totals?.workingDays, 0)}</td>
//                 <td style={{ color: mo.totals?.absentDays > 0 ? '#dc3545' : 'inherit' }}>
//                   {fmt(mo.totals?.absentDays, 0)}
//                 </td>
//                 <td>{fmt(mo.totals?.paidLeaveDays, 0)}</td>
//                 <td>{fmt(mo.totals?.unpaidLeaveDays, 0)}</td>
//                 <td style={{ color: mo.totals?.totalLateMinutes > 0 ? '#fd7e14' : 'inherit' }}>
//                   {fmtMin(mo.totals?.totalLateMinutes)}
//                 </td> */}
//                 <td>{fmt(mo.meta?.totalUsersIncluded, 0)}</td>

// <td>{fmt(mo.totals?.baseSalary)}</td>

// <td style={{ color:'#dc3545' }}>
//   {fmt(mo.totals?.totalDeductions)}
// </td>

// <td style={{ color:'#6f42c1' }}>
//   {fmt(mo.totals?.overtimeTotal)}
// </td>

// <td style={{ color:'#0d6efd' }}>
//   {fmt(mo.totals?.bonusTotal)}
// </td>

// <td style={{ fontWeight:700, color:'#1F3864' }}>
//   {fmt(mo.totals?.netSalary)}
// </td>

// <td>
//   {(
//     ((mo.totals?.netSalary || 0) /
//       Math.max(mo.totals?.baseSalary || 1, 1))
//     * 100
//   ).toFixed(1)}%
// </td>
//                 {/* <td>{fmt(mo.totals?.baseSalary)}</td>
//                 <td style={{ color:'#dc3545' }}>{fmt(mo.totals?.totalDeductions)}</td>
//                 <td style={{ color:'#6f42c1' }}>{fmt(mo.totals?.overtimeTotal)}</td>
//                 <td style={{ fontWeight:700, color:'#1F3864' }}>{fmt(mo.totals?.netSalary)}</td> */}
//               </tr>
//             )
//           ))}
//           {/* Totals row */}
//           <tr className="month-totals-row">
//             <td>{t('table.total')}</td>
//             {/* <td>{fmt(yearTotals.workingDays, 0)}</td>
//             <td>{fmt(yearTotals.absentDays, 0)}</td>
//             <td>{fmt(yearTotals.paidLeaveDays, 0)}</td>
//             <td>{fmt(yearTotals.unpaidLeaveDays, 0)}</td>
//             <td>{fmtMin(yearTotals.totalLateMinutes)}</td> */}
//             <td>—</td>

// <td>{fmt(yearTotals.baseSalary)}</td>

// <td>{fmt(yearTotals.totalDeductions)}</td>

// <td>{fmt(yearTotals.overtimeTotal)}</td>

// <td>{fmt(yearTotals.bonusTotal)}</td>

// <td>{fmt(yearTotals.netSalary)}</td>

// <td>
//   {(
//     ((yearTotals.netSalary || 0) /
//       Math.max(yearTotals.baseSalary || 1, 1))
//     * 100
//   ).toFixed(1)}%
// </td>
//             {/* <td>{fmt(yearTotals.baseSalary)}</td>
//             <td>{fmt(yearTotals.totalDeductions)}</td>
//             <td>{fmt(yearTotals.overtimeTotal)}</td>
//             <td>{fmt(yearTotals.netSalary)}</td> */}
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════
//    MAIN
// ═══════════════════════════════════════════ */
// export default function CompanyYearReport({ report, onPageChange, }) {
//   const { t } = useTranslation('companyReport');
//   const [showMonths, setShowMonths] = useState(true);

//   if (!report) return null;

//   const { totals = {}, months = [], employees = [], meta = {} } = report;

//   return (
//     <div>
//       {/* Title */}
//       <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
//         <div>
//           <h5 style={{ fontWeight:700, color:'#1F3864', margin:0 }}>
//             {t('tabs.companyYear')} — {report.period?.year}
//           </h5>
//           {/* <small style={{ color:'#aaa' }}>
//             {meta.payrollApprovedOnly && t('meta.approvedOnly')}
//           </small> */}
//           <small style={{ color:'#aaa' }}>
//   {meta.branchName || 'All Branches'}

//   {' · '}

//   {meta.departmentName || 'All Departments'}

//   {' · '}

//   {meta.totalUsersIncluded} Employees

//   {' · '}

//   TZ: {meta.timezone}

//   {meta.totalUsersSkipped > 0 &&
//     ` · ${meta.totalUsersSkipped} Skipped`}

//   {meta.payrollApprovedOnly &&
//     ' · Approved Payroll Only'}
// </small>

// {meta.generatedBy?.name && (
//   <div
//     style={{
//       fontSize:'0.8rem',
//       color:'#888',
//       marginTop:'4px'
//     }}
//   >
//     Generated by: {meta.generatedBy.name}
//   </div>
// )}
//         </div>
//       </div>

//       {/* KPI */}
//       <CompanyKpiCards totals={totals} empCount={meta.totalUsersIncluded}
//         multiBranch={meta.multibranchEmployees}
//  />

//       {/* Monthly breakdown */}
//       <div className="report-section">
//         <div className="section-title">
//           <i className="fa-solid fa-table" />
//           {t('sections.monthlyBreakdown')}
//           <button
//             className="btn btn-sm btn-link ms-auto p-0"
//             style={{ fontSize:'0.8rem' }}
//             onClick={() => setShowMonths(p => !p)}
//           >
//             {showMonths ? 'Hide' : 'Show'}
//           </button>
//         </div>
//         {showMonths && <MonthlyBreakdown months={months} yearTotals={totals} />}
//       </div>

//       {/* Employees */}
//       <div className="report-section">
//         <div className="section-title">
//           <i className="fa-solid fa-users" />
//           {t('sections.employeesList')}
//           <span className="ms-2" style={{ color:'#aaa', fontWeight:400, fontSize:'0.8rem' }}>
//             {report.pagination?.total ??
//  employees.length} {t('meta.employees')}
//           </span>
//         </div>
//        <EmployeesTable
//   employees={employees}
//   pagination={report.pagination}
//   onPageChange={onPageChange}
//   // onSelectUser={onSelectUser}
// />
//       </div>
//     </div>
//   );
// }











//--------------------------css
// src/pages/Reports/components/CompanyYearReport.jsx
import { useState }          from 'react';
import { useTranslation }    from 'react-i18next';
import { CompanyKpiCards }   from './ReportSummaryCards';
import EmployeesTable from './EmployeesTable';
import '../../style/Reports.css';

function fmt(v, dec = 2) {
  if (v == null) return '—';
  const n = Number(v);
  if (isNaN(n)) return '—';
  return n.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
// function fmtMin(m) { if (!m) return '—'; return `${Math.floor(m/60)}h ${m%60}m`; }

/* Monthly breakdown table */
function MonthlyBreakdown({ months = [], yearTotals = {} }) {
  const { t } = useTranslation('companyReport');

  return (
    <div className="report-table-wrap">
      <table className="report-table">
        <thead>
          <tr>
            {/* <th>{t('table.month')}</th>
            <th>{t('table.workDays')}</th>
            <th>{t('table.absent')}</th>
            <th>{t('table.paidLeave')}</th>
            <th>{t('table.unpaidLeave')}</th>
            <th>{t('table.late')}</th>
            <th>{t('table.baseSalary')}</th>
            <th>{t('table.deductions')}</th>
            <th>{t('table.overtime')}</th>
            <th>{t('table.netSalary')}</th> */}
    <th>{t('table.month')}</th>
<th>{t('table.employees')}</th>
<th>{t('table.baseSalaryyear')}</th>
<th>{t('table.deductionsyear')}</th>
<th>{t('table.overtimeyear')}</th>
<th>{t('table.bonusyear')}</th>
<th>{t('table.netSalaryyear')}</th>
<th>{t('table.netPercentageyear')}</th>
          </tr>
        </thead>
        <tbody>
          {months.map(mo => (
            mo.error ? (
              <tr key={mo.month} className="cyr-row-error">
                <td className="cyr-td-month">{t(`months.${mo.month}`)}</td>
                <td colSpan={8} className="cyr-td-error">
                  Error: {mo.error}
                </td>
              </tr>
            ) : (
              <tr key={mo.month}>
                <td className="cyr-td-month">{t(`months.${mo.month}`)}</td>
                {/* <td>{fmt(mo.totals?.workingDays, 0)}</td>
                <td style={{ color: mo.totals?.absentDays > 0 ? '#dc3545' : 'inherit' }}>
                  {fmt(mo.totals?.absentDays, 0)}
                </td>
                <td>{fmt(mo.totals?.paidLeaveDays, 0)}</td>
                <td>{fmt(mo.totals?.unpaidLeaveDays, 0)}</td>
                <td style={{ color: mo.totals?.totalLateMinutes > 0 ? '#fd7e14' : 'inherit' }}>
                  {fmtMin(mo.totals?.totalLateMinutes)}
                </td> */}
                <td>{fmt(mo.meta?.totalUsersIncluded, 0)}</td>

<td>{fmt(mo.totals?.baseSalary)}</td>

<td className="cyr-td-deductions">
  {fmt(mo.totals?.totalDeductions)}
</td>

<td className="cyr-td-overtime">
  {fmt(mo.totals?.overtimeTotal)}
</td>

<td className="cyr-td-bonus">
  {fmt(mo.totals?.bonusTotal)}
</td>

<td className="cyr-td-net">
  {fmt(mo.totals?.netSalary)}
</td>

<td>
  {(
    ((mo.totals?.netSalary || 0) /
      Math.max(mo.totals?.baseSalary || 1, 1))
    * 100
  ).toFixed(1)}%
</td>
                {/* <td>{fmt(mo.totals?.baseSalary)}</td>
                <td style={{ color:'#dc3545' }}>{fmt(mo.totals?.totalDeductions)}</td>
                <td style={{ color:'#6f42c1' }}>{fmt(mo.totals?.overtimeTotal)}</td>
                <td style={{ fontWeight:700, color:'#1F3864' }}>{fmt(mo.totals?.netSalary)}</td> */}
              </tr>
            )
          ))}
          {/* Totals row */}
          <tr className="month-totals-row">
            <td>{t('table.total')}</td>
            {/* <td>{fmt(yearTotals.workingDays, 0)}</td>
            <td>{fmt(yearTotals.absentDays, 0)}</td>
            <td>{fmt(yearTotals.paidLeaveDays, 0)}</td>
            <td>{fmt(yearTotals.unpaidLeaveDays, 0)}</td>
            <td>{fmtMin(yearTotals.totalLateMinutes)}</td> */}
            <td>—</td>

<td>{fmt(yearTotals.baseSalary)}</td>

<td>{fmt(yearTotals.totalDeductions)}</td>

<td>{fmt(yearTotals.overtimeTotal)}</td>

<td>{fmt(yearTotals.bonusTotal)}</td>

<td>{fmt(yearTotals.netSalary)}</td>

<td>
  {(
    ((yearTotals.netSalary || 0) /
      Math.max(yearTotals.baseSalary || 1, 1))
    * 100
  ).toFixed(1)}%
</td>
            {/* <td>{fmt(yearTotals.baseSalary)}</td>
            <td>{fmt(yearTotals.totalDeductions)}</td>
            <td>{fmt(yearTotals.overtimeTotal)}</td>
            <td>{fmt(yearTotals.netSalary)}</td> */}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN
═══════════════════════════════════════════ */
export default function CompanyYearReport({ report, onPageChange, }) {
  const { t } = useTranslation('companyReport');
  const [showMonths, setShowMonths] = useState(true);

  if (!report) return null;

  const { totals = {}, months = [], employees = [], meta = {} } = report;

  return (
    <div>
      {/* Title */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div>
          <h5 className="cyr-report-title">
            {t('tabs.companyYear')} — {report.period?.year}
          </h5>
          {/* <small style={{ color:'#aaa' }}>
            {meta.payrollApprovedOnly && t('meta.approvedOnly')}
          </small> */}
          <small className="cyr-report-meta">
  {meta.branchName || 'All Branches'}

  {' · '}

  {meta.departmentName || 'All Departments'}

  {' · '}

  {meta.totalUsersIncluded} Employees

  {' · '}

  TZ: {meta.timezone}

  {meta.totalUsersSkipped > 0 &&
    ` · ${meta.totalUsersSkipped} Skipped`}

  {meta.payrollApprovedOnly &&
    ' · Approved Payroll Only'}
</small>

{meta.generatedBy?.name && (
  <div className="cyr-generated-by">
    Generated by: {meta.generatedBy.name}
  </div>
)}
        </div>
      </div>

      {/* KPI */}
      <CompanyKpiCards totals={totals} empCount={meta.totalUsersIncluded}
        multiBranch={meta.multibranchEmployees}
 />

      {/* Monthly breakdown */}
      <div className="report-section">
        <div className="section-title">
          <i className="fa-solid fa-table" />
          {t('sections.monthlyBreakdown')}
          <button
            className="btn btn-sm btn-link ms-auto p-0 cyr-toggle-btn"
            onClick={() => setShowMonths(p => !p)}
          >
            {showMonths ? 'Hide' : 'Show'}
          </button>
        </div>
        {showMonths && <MonthlyBreakdown months={months} yearTotals={totals} />}
      </div>

      {/* Employees */}
      <div className="report-section">
        <div className="section-title">
          <i className="fa-solid fa-users" />
          {t('sections.employeesList')}
          <span className="ms-2 cyr-emp-count">
            {report.pagination?.total ??
 employees.length} {t('meta.employees')}
          </span>
        </div>
       <EmployeesTable
  employees={employees}
  pagination={report.pagination}
  onPageChange={onPageChange}
  // onSelectUser={onSelectUser}
/>
      </div>
    </div>
  );
}