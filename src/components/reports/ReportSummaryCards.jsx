// src/pages/Reports/components/ReportSummaryCards.jsx
import { useTranslation } from 'react-i18next';

/** فمت الأرقام */
function fmt(v, dec = 0) {
  if (v == null) return '—';
  const n = Number(v);
  if (isNaN(n)) return '—';
  return n.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function fmtMin(m) {
  if (!m) return '—';
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

/**
 * KPI Cards للتقرير الجماعي (company month / year)
 * props:
 *   totals  — report.totals
 *   empCount — عدد الموظفين
 */
export function CompanyKpiCards({ totals = {}, empCount = 0 , multiBranch = 0}) {
  const { t } = useTranslation('companyReport');


 

  const cards = [
    { key: 'employees',       val: fmt(empCount),                      color: 'blue',   icon: 'fa-users' },
    {
  key:'multiBranch',
  val: fmt(multiBranch,0),
  color:'purple',
  icon:'fa-code-branch'
},

    // { key: 'workingDays',     val: fmt(totals.workingDays),            color: 'green',  icon: 'fa-calendar-check' },
    // { key: 'absentDays',      val: fmt(totals.absentDays),             color: 'red',    icon: 'fa-calendar-xmark' },

    // { key: 'paidLeaveDays',   val: fmt(totals.paidLeaveDays),          color: 'teal',   icon: 'fa-umbrella-beach' },
    // { key: 'lateMinutes',     val: fmtMin(totals.totalLateMinutes),    color: 'orange', icon: 'fa-clock' },
    { key: 'baseSalary',      val: fmt(totals.baseSalary, 2),          color: '',       icon: 'fa-money-bill' },
    { key: 'totalDeductions', val: fmt(totals.totalDeductions, 2),     color: 'red',    icon: 'fa-minus-circle' },
    { key: 'overtimeTotal',   val: fmt(totals.overtimeTotal, 2),       color: 'purple', icon: 'fa-bolt' },
    { key: 'bonusTotal',      val: fmt(totals.bonusTotal, 2),          color: 'purple', icon: 'fa-star' },
    { key: 'netSalary',       val: fmt(totals.netSalary, 2),           color: 'green',  icon: 'fa-sack-dollar' },
  ];

  return (
    <div className="kpi-grid">
      {cards.map(c => (
        <div key={c.key} className={`kpi-card ${c.color}`}>
          <div className="kpi-label">
            <i className={`fa-solid ${c.icon} me-1`} />
            {t(`kpi.${c.key}`)}
          </div>
          <div className="kpi-value">{c.val}</div>
        </div>
      ))}
    </div>
  );
}

/**
 * KPI Cards للموظف الواحد
 * props:
 *   att     — attendanceStats
 *   payroll — payrollRun (normalised)
 */
export function UserKpiCards({ att = {}, payroll = null }) {
  const { t } = useTranslation('companyReport');

  const cards = [
    { key: 'workingDays',     val: fmt(att.workingDays),              color: 'green',  icon: 'fa-calendar-check' },
    { key: 'absentDays',      val: fmt(att.absentDays),               color: 'red',    icon: 'fa-calendar-xmark' },
    { key: 'paidLeaveDays',   val: fmt(att.paidLeaveDays),            color: 'teal',   icon: 'fa-umbrella-beach' },
    { key: 'unpaidLeaveDays', val: fmt(att.unpaidLeaveDays),          color: 'orange', icon: 'fa-ban' },
    { key: 'lateMinutes',     val: fmtMin(att.totalLateMinutes),      color: 'orange', icon: 'fa-clock' },
    { key: 'remoteDays',      val: fmt(att.remoteWorkDays),           color: 'blue',   icon: 'fa-house-laptop' },
    ...(payroll ? [
      { key: 'baseSalary',      val: fmt(payroll.baseSalary, 2),      color: '',       icon: 'fa-money-bill' },
      { key: 'totalDeductions', val: fmt(payroll.deductions?.total, 2),color:'red',    icon: 'fa-minus-circle' },
      { key: 'overtimeTotal',   val: fmt(payroll.overtime?.total, 2), color: 'purple', icon: 'fa-bolt' },
      { key: 'netSalary',       val: fmt(payroll.netSalary, 2),       color: 'green',  icon: 'fa-sack-dollar' },
    ] : []),
  ];

  return (
    <div className="kpi-grid">
      {cards.map(c => (
        <div key={c.key} className={`kpi-card ${c.color}`}>
          <div className="kpi-label">
            <i className={`fa-solid ${c.icon} me-1`} />
            {t(`kpi.${c.key}`)}
          </div>
          <div className="kpi-value">{c.val}</div>
        </div>
      ))}
    </div>
  );
}