// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';

// import {
//   previewPayroll,
//   generatePayroll
// } from '../../services/payroll.api';

// import Toast from '../../components/ui/Toast';

// const PayrollPreviewPage = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   // userId جاي من بروفايل الموظف
//   const { userId } = useParams();

//   const now = new Date();
//   const [year, setYear] = useState(now.getFullYear());
//   const [month, setMonth] = useState(now.getMonth() + 1);

//   const [loading, setLoading] = useState(false);
//   const [generating, setGenerating] = useState(false);
//   const [payroll, setPayroll] = useState(null);
//   const [toast, setToast] = useState(null);

//   /* =========================
//      Load Preview
//   ========================= */
//   const loadPreview = async () => {
//     try {
//       setLoading(true);

//       const res = await previewPayroll({
//         userId,
//         year,
//         month
//       });

//       setPayroll(res.payroll);
//     } catch (err) {
//       setToast({
//         type: 'error',
//         message:
//           err.response?.data?.message ||
//           t('payroll.previewError')
//       });
//     } finally {
//       setLoading(false);
//     }
//   };


//   useEffect(() => {
//     if (userId) {
//       loadPreview();
//     }
//   }, [userId, year, month]);
// useEffect(() => {
//   console.log('PAYROLL PREVIEW:', payroll);
//   console.log('POLICIES:', payroll?.audit?.policies);
// }, [payroll]);
//   /* =========================
//      Generate Payroll
//   ========================= */
//   // const handleGenerate = async () => {
//   //   if (!window.confirm(t('payroll.confirmGenerate'))) return;

//   //   try {
//   //     setGenerating(true);

//   //     const res = await generatePayroll({
//   //       userId,
//   //       year,
//   //       month
//   //     });

//   //     navigate(`/payroll/${res.payrollRun._id}`);
//   //   } catch (err) {
//   //     setToast({
//   //       type: 'error',
//   //       message:
//   //         err.response?.data?.message ||
//   //         t('payroll.generateError')
//   //     });
//   //   } finally {
//   //     setGenerating(false);
//   //   }
//   // };
//   const policies = payroll?.audit?.policies || [];

// const handleGenerate = async () => {
// if (policies.length > 1) {
//     const ok = window.confirm(
//       t('payroll.confirmGenerateMultiplePolicies')
//     );
//     if (!ok) return;
//   } else {
//     if (!window.confirm(t('payroll.confirmGenerate'))) return;
//   }

//   try {
//     setGenerating(true);
//     const res = await generatePayroll({ userId, year, month });
//     navigate(`/payroll/${res.payrollRun._id}`);
//   } catch (err) {
//     setToast({
//       type: 'error',
//       message:
//         err.response?.data?.message ||
//         t('payroll.generateError')
//     });
//   } finally {
//     setGenerating(false);
//   }
// };
// // const renderDayStatus = (d) => {
// //   if (d.status === 'NON_WORKING_DAY') {
// //     if (d.nonWorkingReason === 'WEEKLY_OFF') return 'Weekly Off';
// //     if (d.nonWorkingReason === 'HOLIDAY') return 'Holiday';
// //     return 'Non Working Day';
// //   }

// //   return d.status;
// // };
// const renderDayStatus = (d) => {
//   if (d.decisionType === 'NON_WORKING_DAY') {
//     if (d.nonWorkingReason === 'WEEKLY_OFF') return 'Weekly Off';
//     if (d.nonWorkingReason === 'HOLIDAY') return 'Holiday';
//     return 'Non Working Day';
//   }

//   return d.decisionType;
// };

//   return (
//     <div className="container-fluid">

//       {/* =========================
//          Header
//       ========================= */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3>
//           <i className="fas fa-receipt me-2" />
//           {t('payroll.previewTitle')}
//         </h3>

//         <div className="d-flex gap-2">
//           <select
//             className="form-select"
//             value={month}
//             onChange={(e) => setMonth(Number(e.target.value))}
//           >
//             {Array.from({ length: 12 }).map((_, i) => (
//               <option key={i + 1} value={i + 1}>
//                 {i + 1}
//               </option>
//             ))}
//           </select>

//           <input
//             type="number"
//             className="form-control"
//             value={year}
//             onChange={(e) => setYear(Number(e.target.value))}
//           />
//         </div>
//       </div>

//       {loading && (
//         <div className="text-center py-5">
//           {t('common.loading')}
//         </div>
//       )}

//       {!loading && payroll && (
//         <>
//           {/* =========================
//              Salary Summary
//           ========================= */}
//           <div className="card mb-4">
//             <div className="card-body">
//               <h5 className="mb-3">{t('payroll.summary')}</h5>

//               <div className="row">
//                 <div className="col-md-3">
//                   <strong>{t('payroll.baseSalary')}</strong>
//                   <div>{payroll.baseSalary}</div>
//                 </div>

//                 <div className="col-md-3">
//                   <strong>{t('payroll.dailySalary')}</strong>
//                   <div>{payroll.dailySalary}</div>
//                 </div>

//                 <div className="col-md-3">
//                   <strong>{t('payroll.hourlySalary')}</strong>
//                   <div>{payroll.hourlySalary}</div>
//                 </div>

//                 <div className="col-md-3">
//                   <strong>{t('payroll.netSalary')}</strong>
//                   <div className="text-success fw-bold">
//                     {payroll.netSalary}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* =========================
//              Deductions Summary
//           ========================= */}
//           <div className="card mb-4">
//             <div className="card-body">
//               <h5 className="mb-3">{t('payroll.deductions')}</h5>

//               <table className="table table-bordered">
//                 <tbody>
//                   <tr>
//                     <td>{t('payroll.absence')}</td>
//                     <td>{payroll.deductions.absence}</td>
//                   </tr>
//                   <tr>
//                     <td>{t('payroll.late')}</td>
//                     <td>{payroll.deductions.late}</td>
//                   </tr>
//                   <tr>
//                     <td>{t('payroll.earlyLeave')}</td>
//                     <td>{payroll.deductions.earlyLeave}</td>
//                   </tr>
//                   <tr>
//                     <td>{t('payroll.transit')}</td>
//                     <td>{payroll.deductions.transit}</td>
//                   </tr>
//                   <tr className="table-light">
//                     <td>
//                       <strong>{t('payroll.totalDeductions')}</strong>
//                     </td>
//                     <td>
//                       <strong>{payroll.deductions.total}</strong>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
// {/* =========================
//    Attendance Policy Timeline
// ========================= */}
// {policies.length > 0 && (
//   <div className="card mb-4">
//     <div className="card-body">
//       <h5 className="mb-3">
//         {t('payroll.policyTimeline')}
//         {policies.length > 1 && (
//           <span className="badge bg-warning ms-2">
//             {t('payroll.multiplePolicies')}
//           </span>
//         )}
//       </h5>

//       <table className="table table-sm table-bordered">
//         <thead className="table-light">
//           <tr>
//             {/* <th>{t('payroll.policyVersion')}</th> */}
//                   <th>{t('payroll.policyScope')}</th>

//             <th>{t('payroll.from')}</th>
//             <th>{t('payroll.to')}</th>
//              <th>سماحية التأخير</th>
//     <th>سماحية الانصراف المبكر</th>
//             <th>{t('payroll.lateRate')}</th>
//             <th>{t('payroll.earlyRate')}</th>
//             <th>{t('payroll.transitRate')}</th>
//                <th>سياسة الغياب</th>
//           </tr>
//         </thead>
//         <tbody>
//           {policies.map((p, idx) => (
//             <tr key={idx}>
//                 <td>
//           {p.scope === 'global' && (
//             <span className="badge bg-primary">
//               <i className="fas fa-globe me-1"></i>
//               Global Policy
//             </span>
//           )}
//           {p.scope === 'branch' && (
//             <span className="badge bg-info">
//               <i className="fas fa-building me-1"></i>
//               {p.branchName || 'Branch Policy'}
//             </span>
//           )}
//           {p.scope === 'role' && (
//             <span className="badge bg-warning">
//               <i className="fas fa-user-shield me-1"></i>
//           {p.role === 'admin' ? 'Admin' : 'Staff'} Policy
//             </span>
//           )}
//           {p.scope === 'user' && (
//             <span className="badge bg-success">
//               <i className="fas fa-user me-1"></i>
//               User-Specific
//             </span>
//           )}
//           {!p.scope && (
//             <span className="badge bg-secondary">
//               Unknown
//             </span>
//           )}
//         </td>
//               <td>{new Date(p.from).toLocaleDateString()}</td>
//               <td>{new Date(p.to).toLocaleDateString()}</td>
//               <td>{p.grace?.lateMinutes} min</td>
// <td>{p.grace?.earlyLeaveMinutes} min</td>
//               <td>{p.rates?.latePerMinute ?? 0}</td>
//               <td>{p.rates?.earlyLeavePerMinute ?? 0}</td>
//               {/* <td>{p.rates?.transitPerMinute ?? 0}</td> */}
//               <td>{p.rates?.transitPerMinute}</td>

//                   {/* <td>
//   {p.absence?.deductSalary
//     ? p.absence.deductionType === 'percentage'
//       ? `Unpaid / ${p.absence.percentage ?? 100}%`
//       : `Unpaid / ${p.absence.dayRate ?? 1} day`
//     : 'Paid'}
// </td> */}
//   <td>
//   {p.absence?.deductSalary === false
//     ? 'No Deduction'
//     : p.absence?.paid
//     ? 'Paid Absence'
//     : `Unpaid / ${((p.absence?.dayRate ?? 1) * 100).toFixed(0)}%`}
// </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </div>
// )}


//           {/* =========================
//              Daily Breakdown
//           ========================= */}
//           <div className="card">
//             <div className="card-body">
//               <h5 className="mb-3">
//                 {t('payroll.dailyBreakdown')}
//               </h5>

//               <table className="table table-sm table-bordered">
//                 <thead>
//                   <tr>
//                     <th>Date</th>
//                     <th>Status</th>
//                     <th>Late</th>
//                     <th>Early</th>
//                     <th>Transit</th>
//                     <th>Absence</th>
//                     <th>Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {payroll.audit.daily.map((d, idx) => {
//                     // const total =
//                     //   d.deductions.absence +
//                     //   d.deductions.late +
//                     //   d.deductions.early +
//                     //   d.deductions.transit;

//                     return (
//                       <tr key={idx}>
//                         <td>
//                           {new Date(d.date).toLocaleDateString()}
//                         </td>
// {/* <td>{d.status}</td> */}
// <td>{renderDayStatus(d)}</td>

//                         <td>{d.deductions.late}</td>
//                         <td>{d.deductions.earlyLeave}</td>

//                         <td>{d.deductions.transit}</td>
//                         <td>{d.deductions.absence}</td>
//                         <td className="fw-bold">{d.total}</td>

//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* =========================
//              Actions
//           ========================= */}
//           {/* {payroll.audit.policies.length > 1 && (
//   <div className="alert alert-warning">
//     {t('payroll.multiplePoliciesWarning')}
//   </div>
// )} */}
// {policies.length > 1 && (
//   <div className="alert alert-warning">
//     {t('payroll.multiplePoliciesWarning')}
//   </div>
// )}

//           <div className="d-flex justify-content-end mt-4">
//             <button
//               className="btn btn-success"
//               disabled={generating}
//               onClick={handleGenerate}
//             >
//               <i className="fas fa-lock me-1" />
//               {t('payroll.generate')}
//             </button>
//           </div>
//         </>
//       )}

//       {toast && (
//         <Toast
//           type={toast.type}
//           message={toast.message}
//           onClose={() => setToast(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default PayrollPreviewPage;


























































//==========================================
//ot -bonus add
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDisplayDate } from '../../helpers/timezone';
import {
  previewPayroll,
  generatePayroll
} from '../../services/payroll.api';

import Toast from '../../components/ui/Toast';

// const fmtDate = (value, tz = 'UTC') => {
//   if (!value) return '—';

//   const formatted = new Date(value).toLocaleDateString('en-GB', {
//     timeZone: tz
//   });

//   return `${formatted} (${tz})`;
// };
/* ==============================================
   OT Type Config (colors + icons)
============================================== */
const OT_TYPE_CONFIG = {
  BEFORE_SHIFT:      { color: 'warning',  icon: 'fa-sun'            },
  AFTER_SHIFT_DAY:   { color: 'primary',  icon: 'fa-cloud-sun'      },
  AFTER_SHIFT_NIGHT: { color: 'info',     icon: 'fa-moon'           },
  WEEKLY_OFF:        { color: 'success',  icon: 'fa-calendar-times'  },
  HOLIDAY:           { color: 'danger',   icon: 'fa-umbrella-beach'  },
  EXCEPTIONAL:       { color: 'purple',   icon: 'fa-star'            }
};

const BONUS_TYPE_CONFIG = {
  ATTENDANCE_BONUS: { color: 'success', icon: 'fa-user-check' },
  FIXED_BONUS:      { color: 'info',    icon: 'fa-coins'      },
  EXCEPTIONAL:      { color: 'warning', icon: 'fa-star'       }
};


const renderDayStatus = (d) => {
  if (d.decisionType === 'NON_WORKING_DAY') {
    if (d.nonWorkingReason === 'WEEKLY_OFF') return 'Weekly Off';
    if (d.nonWorkingReason === 'HOLIDAY')   return 'Holiday';
    return 'Non Working Day';
  }
  return d.decisionType;
};

/* ==============================================
   PayrollPreviewPage
============================================== */
const PayrollPreviewPage = () => {
  const { t }= useTranslation("Payroll");
  const navigate = useNavigate();
  const { userId } = useParams();

  const now = new Date();
  const [year,       setYear]       = useState(now.getFullYear());
  const [month,      setMonth]      = useState(now.getMonth() + 1);
  const [loading,    setLoading]    = useState(false);
  const [generating, setGenerating] = useState(false);
  const [payroll,    setPayroll]    = useState(null);
  const [toast,      setToast]      = useState(null);

  /* =========================
     Load Preview
  ========================= */
  const loadPreview = async () => {
    try {
      setLoading(true);
      const res = await previewPayroll({ userId, year, month });
    //  setPayroll(res.payroll);
      setPayroll({
  ...res.payroll,
  timezone: res.meta?.timezone // 🔥
});
    } catch (err) {
      setToast({
        type:    'error',
        message: err.response?.data?.message || t('payroll.previewError')
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) loadPreview();
  }, [userId, year, month]);

  /* =========================
     Generate
  ========================= */
  const policies = payroll?.audit?.policies || [];

  const handleGenerate = async () => {
    const msg = policies.length > 1
      ? t('payroll.confirmGenerateMultiplePolicies')
      : t('payroll.confirmGenerate');

    if (!window.confirm(msg)) return;

    try {
      setGenerating(true);
      const res = await generatePayroll({ userId, year, month });
      navigate(`/payroll/${res.payrollRun._id}`);
    } catch (err) {
      setToast({
        type:    'error',
        message: err.response?.data?.message || t('payroll.generateError')
      });
    } finally {
      setGenerating(false);
    }
  };
 const tz = payroll?.timezone || 'UTC';

  return (
    <div className="container-fluid">

      {/* ── Header ── */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          <i className="fas fa-receipt me-2" />
          {t('payroll.previewTitle')}
        </h3>


        <div className="d-flex gap-2">
          <select className="form-select" value={month}
            onChange={e => setMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>

          <input type="number" className="form-control" value={year}
            onChange={e => setYear(Number(e.target.value))} />
        </div>
      </div>

      {loading && <div className="text-center py-5">{t('common.loading')}</div>}

      {!loading && payroll && (() => {
        // const tz = payroll?.timezone || 'UTC'; 
        
       

  return (
  <>
          {/* ── Salary Summary ── */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="mb-3">{t('payroll.summary')}</h5>
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <div className="text-muted small">{t('payroll.baseSalary')}</div>
                  <div className="fw-semibold">{payroll.baseSalary}</div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="text-muted small">{t('payroll.dailySalary')}</div>
                  <div className="fw-semibold">{payroll.dailySalary}</div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="text-muted small">{t('payroll.hourlySalary')}</div>
                  <div className="fw-semibold">{payroll.hourlySalary}</div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="text-muted small">{t('payroll.netSalary')}</div>
                  <div className="fw-bold text-success fs-5">{payroll.netSalary}</div>
                </div>
                
              </div>

              {/* Net Salary Formula */}
              <div className="alert alert-light border mt-3 mb-0 small">
                <i className="fas fa-calculator me-2 text-primary" />
                <strong>{t('payroll.netSalary')}:</strong>{' '}
                {payroll.baseSalary}
                {' − '}<span className="text-danger">{payroll.deductions?.total ?? 0}</span>
                {payroll.overtime?.total > 0 && (
                  <> + <span className="text-success">{payroll.overtime.total} OT</span></>
                )}
                {payroll.bonus?.total > 0 && (
                  <> + <span className="text-info">{payroll.bonus.total} Bonus</span></>
                )}
                {' = '}<strong className="text-success">{payroll.netSalary}</strong>
              </div>
            </div>
          </div>

          {/* ── Deductions ── */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="mb-3">{t('payroll.deductions')}</h5>
              <table className="table table-bordered">
                <tbody>
                  <tr><td>{t('payroll.absence')}</td><td className="text-danger">{payroll.deductions.absence}</td></tr>
                  <tr><td>{t('payroll.late')}</td><td className="text-danger">{payroll.deductions.late}</td></tr>
                  <tr><td>{t('payroll.earlyLeave')}</td><td className="text-danger">{payroll.deductions.earlyLeave}</td></tr>
                  <tr><td>{t('payroll.transit')}</td><td className="text-danger">{payroll.deductions.transit}</td></tr>
                  <tr>
  <td>{t('payroll.gap') || 'Gap'}</td>
  <td className="text-danger">{payroll.deductions.gap}</td>
</tr>
                  <tr className="table-light">
                    <td><strong>{t('payroll.totalDeductions')}</strong></td>
                    <td><strong className="text-danger">{payroll.deductions.total}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Overtime ── */}
          {payroll.overtime?.total > 0 && (
            <div className="card mb-4 border-success border-opacity-50">
              <div className="card-header bg-success bg-opacity-10">
                <h5 className="mb-0 text-success">
                  <i className="fas fa-clock me-2" />
                  {t('payroll.overtime')}
                  <span className="badge bg-success ms-2 fs-6">
                    + {payroll.overtime.total}
                  </span>
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>{t('payroll.otDate')}</th>
                        <th>{t('payroll.otType')}</th>
                        <th>{t('payroll.otSource')}</th>
                        <th className="text-center">{t('payroll.otMinutes')}</th>
                        <th className="text-center">{t('payroll.otRate')}</th>
                        <th className="text-end">{t('payroll.otAmount')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payroll.overtime.breakdown.map((entry, i) => {
                        const cfg = OT_TYPE_CONFIG[entry.type] || { color: 'secondary', icon: 'fa-circle' };
                        
                        const isCustom = cfg.color === 'purple';

                        return (
                          <tr key={i}>
                           
      {/* <td className="small">
  {
  
  
  formatDisplayDate(entry.date, tz)
  }
</td>
                            */}
                            <td className="small">

  <div>
    {formatDisplayDate(entry.date, tz)}
  </div>

  <span className="badge bg-light text-dark border small mt-1">
    {tz}
  </span>

</td>
                   <td>

  {isCustom ? (
    <span className="badge border"
      style={{
        background: '#f3e8ff',
        color: '#7c3aed',
        borderColor: '#c4b5fd'
      }}>
      <i className={`fas ${cfg.icon} me-1`} />
      {t(`overtimeEntry.types.${entry.type}`)}
    </span>
  ) : (
    <span className={`badge bg-${cfg.color} bg-opacity-10 text-${cfg.color} border border-${cfg.color} border-opacity-25`}>
      <i className={`fas ${cfg.icon} me-1`} />
      {t(`overtimeEntry.types.${entry.type}`)}
    </span>
  )}

  {entry.policySnapshot?.name && (
    <div className="small text-muted mt-1">

      <i className="fas fa-file-contract me-1" />

      {entry.policySnapshot.name}

    </div>
  )}

</td>
                            <td>
                              <span className="badge bg-light text-secondary border small">
                                {t(`overtimeEntry.sources.${entry.source || 'auto'}`)}
                              </span>


                              
                            </td>
                            <td className="text-center small">
                              {entry.type === 'EXCEPTIONAL' ? '—' : `${entry.minutes}m`}
                            </td>
                            <td className="text-center small">
                              {entry.type === 'EXCEPTIONAL' ? '—'
                                : entry.rateType === 'fixed'
                                  ? <span className="badge bg-light text-dark border">fixed</span>
                                  : `${entry.multiplier}x`}
                            </td>
                            <td className="text-end fw-semibold text-success">
                              + {Number(entry.amount).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="table-light">
                      <tr>
                        <td colSpan="5" className="text-end fw-bold">
                          {t('payroll.totalOT')}
                        </td>
                        <td className="text-end fw-bold text-success">
                          + {payroll.overtime.total}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── Bonus ── */}
          {payroll.bonus?.total > 0 && (
            <div className="card mb-4 border-info border-opacity-50">
              <div className="card-header bg-info bg-opacity-10">
                <h5 className="mb-0 text-info">
                  <i className="fas fa-gift me-2" />
                  {t('payroll.bonus')}
                  <span className="badge bg-info ms-2 fs-6">
                    + {payroll.bonus.total}
                  </span>
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>{t('payroll.bonusType')}</th>
                        <th>{t('payroll.bonusNotes')}</th>
                        <th className="text-end">{t('payroll.bonusAmount')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payroll.bonus.breakdown.map((entry, i) => {
                        const cfg = BONUS_TYPE_CONFIG[entry.type] || { color: 'secondary', icon: 'fa-circle' };
                        return (
                          <tr key={i}>
                            <td>
                              <span className={`badge bg-${cfg.color} bg-opacity-10 text-${cfg.color} border border-${cfg.color} border-opacity-25`}>
                                <i className={`fas ${cfg.icon} me-1`} />
                                {t(`payroll.bonusTypes.${entry.type}`)}
                              </span>
                            </td>
                            {/* <td className="small text-muted">
                              {entry.notes || (entry.date ? new Date(entry.date).toLocaleDateString('en-GB') : '—')}
                            </td> */}
                            {/* <td className="small text-muted">
  {entry.notes || (entry.date ?
  // fmtDate(entry.date, tz)
  
  formatDisplayDate(entry.date, tz): '—')}
</td> */}


<td className="small text-muted">

  {entry.notes || (
    entry.date ? (
      <>
        <div>
          {formatDisplayDate(entry.date, tz)}
        </div>

        <span className="badge bg-light text-dark border small mt-1">
          {tz}
        </span>
      </>
    ) : '—'
  )}

</td>

                            <td className="text-end fw-semibold text-info">
                              + {Number(entry.amount).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="table-light">
                      <tr>
                        <td colSpan="2" className="text-end fw-bold">
                          {t('payroll.totalBonus')}
                        </td>
                        <td className="text-end fw-bold text-info">
                          + {payroll.bonus.total}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── Policy Timeline ── */}
          {/* {policies.length > 0 && (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="mb-3">
                  {t('payroll.policyTimeline')}
                  {policies.length > 1 && (
                    <span className="badge bg-warning ms-2">{t('payroll.multiplePolicies')}</span>
                  )}
                </h5>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>{t('payroll.policyScope')}</th>
                        <th>{t('payroll.from')}</th>
                        <th>{t('payroll.to')}</th>
                        <th>

                          {t('payroll.LateGrace')}
                        </th>
                        <th>
                          {t('payroll.EarlyGrace')}
                          
                        </th>
                        <th>{t('payroll.lateRate')}</th>
                        <th>{t('payroll.earlyRate')}</th>
                        <th>{t('payroll.transitRate')}</th>

           <th>{t('payroll.GapGrace')}</th>
            <th>{t('payroll.GapRate')}</th>


                        <th>

                          {t('payroll.Absence')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                     {policies.map((p, idx) => {
  // const policyTZ = p.timezone || tz;
// const policyTZ = p.timezone || 'UTC';
const policyTZ = tz; // 🔥 tenant timezone
  return (
    <tr key={idx}>
      <td>
        {p.scope === 'global' && <span className="badge bg-primary">Global</span>}
        {p.scope === 'branch' && <span className="badge bg-info">{p.branchName || 'Branch'}</span>}
        {p.scope === 'role' && <span className="badge bg-warning text-dark">{p.role === 'admin' ? 'Admin' : 'Staff'}</span>}
        {p.scope === 'user' && <span className="badge bg-success">User</span>}
      </td>

      <td className="small">
        <div>{formatDisplayDate(p.from, policyTZ)}</div>
        <span className="badge bg-light text-dark border small mt-1">
          {policyTZ}
        </span>
      </td>

      <td className="small">
        <div>{formatDisplayDate(p.to, policyTZ)}</div>
        <span className="badge bg-light text-dark border small mt-1">
          {policyTZ}
        </span>
      </td>

      <td>{p.grace?.lateMinutes ?? 0} min</td>
      <td>{p.grace?.earlyLeaveMinutes ?? 0} min</td>
      <td>{p.rates?.latePerMinute ?? 0}</td>
      <td>{p.rates?.earlyLeavePerMinute ?? 0}</td>
      <td>{p.rates?.transitPerMinute ?? 0}</td>
<td>{p.grace?.gapMinutes ?? 0} min</td>
<td>{p.rates?.gapPerMinute ?? 0}</td>
      <td>
        {p.absence?.deductSalary === false
          ? 'No Deduction'
          : p.absence?.paid
            ? 'Paid Absence'
            : `Unpaid / ${((p.absence?.dayRate ?? 1) * 100).toFixed(0)}%`}
      </td>
    </tr>
  );
})}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )} */}



{policies.length > 0 && (
  <div className="card mb-4">
    <div className="card-header bg-white border-0 py-3 d-flex align-items-center justify-content-between">
      <h5 className="mb-0 fw-semibold">
        <i className="fas fa-history me-2 text-primary" />{t('payroll.policyTimeline')}
      </h5>
      {policies.length > 1 && (
        <span className="badge bg-warning text-dark">{t('payroll.multiplePolicies')}</span>
      )}
    </div>

    {/* ── Grace Table ── */}
    <div className="px-3 pt-3">
      <h6 className="text-muted mb-2">{t('payroll.allowedMinutes')}</h6>
    </div>
    <div className="table-responsive px-3">
      <table className="table table-sm table-bordered mb-3">
        <thead className="table-light">
          <tr>
            <th>{t('payroll.policyScope')}</th>
            <th>{t('payroll.from')}</th>
            <th>{t('payroll.to')}</th>
            <th>{t('payroll.LateGrace')}</th>
            <th>{t('payroll.EarlyGrace')}</th>
            <th>{t('payroll.GapGrace')}</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((p, idx) => {
            const policyTZ = tz;
            return (
              <tr key={idx}>
                <td>
                  {p.scope === 'global' && <span className="badge bg-primary">Global</span>}
                  {p.scope === 'branch' && <span className="badge bg-info">{p.branchName || 'Branch'}</span>}
                  {p.scope === 'role' && <span className="badge bg-warning text-dark">{p.role === 'admin' ? 'Admin' : 'Staff'}</span>}
                  {p.scope === 'user' && <span className="badge bg-success">User</span>}
                </td>
                <td className="small">
                  <div>{formatDisplayDate(p.from, policyTZ)}</div>
                  <span className="badge bg-light text-dark border small mt-1">{policyTZ}</span>
                </td>
                <td className="small">
                  <div>{formatDisplayDate(p.to, policyTZ)}</div>
                  <span className="badge bg-light text-dark border small mt-1">{policyTZ}</span>
                </td>
                <td>{p.late?.grace ?? p.grace?.lateMinutes ?? 0} min</td>
                <td>{p.earlyLeave?.grace ?? p.grace?.earlyLeaveMinutes ?? 0} min</td>
                <td>{p.gap?.minutes ?? p.grace?.gapMinutes ?? 0} min</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {/* ── Rates Table ── */}
    <div className="px-3">
      <h6 className="text-muted mb-2">{t('payroll.deductionsRates')}</h6>
    </div>
    <div className="table-responsive px-3 pb-3">
      <table className="table table-sm table-bordered mb-0">
        <thead className="table-light">
          <tr>
            <th>{t('payroll.policyScope')}</th>
            <th>{t('payroll.from')}</th>
            <th>{t('payroll.to')}</th>
            <th>{t('payroll.lateRate')}</th>
            <th>{t('payroll.earlyRate')}</th>
            <th>{t('payroll.transitRate')}</th>
            <th>{t('payroll.GapRate')}</th>
            <th>{t('payroll.Absence')}</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((p, idx) => {
            const policyTZ = tz;
            return (
              <tr key={idx}>
                <td>
                  {p.scope === 'global' && <span className="badge bg-primary">Global</span>}
                  {p.scope === 'branch' && <span className="badge bg-info">{p.branchName || 'Branch'}</span>}
                  {p.scope === 'role' && <span className="badge bg-warning text-dark">{p.role === 'admin' ? 'Admin' : 'Staff'}</span>}
                  {p.scope === 'user' && <span className="badge bg-success">User</span>}
                </td>
                <td className="small">
                  <div>{formatDisplayDate(p.from, policyTZ)}</div>
                  <span className="badge bg-light text-dark border small mt-1">{policyTZ}</span>
                </td>
                <td className="small">
                  <div>{formatDisplayDate(p.to, policyTZ)}</div>
                  <span className="badge bg-light text-dark border small mt-1">{policyTZ}</span>
                </td>
                <td>{p.late?.rate ?? p.rates?.latePerMinute ?? 0}</td>
                <td>{p.earlyLeave?.rate ?? p.rates?.earlyLeavePerMinute ?? 0}</td>
                <td>{p.transit?.rate ?? p.rates?.transitPerMinute ?? 0}</td>
                <td>{p.gap?.rate ?? p.rates?.gapPerMinute ?? 0}</td>
                <td className="small">
                  {p.absence?.deductSalary === false
                    ? t('payroll.noDeduction')
                    : p.absence?.paid
                      ? t('payroll.paidAbsence')
                      : `${((p.absence?.dayRate ?? 1) * 100).toFixed(0)}%`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {/* Warning */}
    {policies.length > 1 && (
      <div className="alert alert-warning mx-3 mb-3">
        {t('payroll.multiplePoliciesWarning')}
      </div>
    )}
  </div>
)}


          {/* ── Daily Breakdown ── */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="mb-3">{t('payroll.dailyBreakdown')}<span className="badge bg-light text-dark border small">
  {tz}
</span></h5>
              <div className="table-responsive">
                <table className="table table-sm table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                      {/* <th className="text-danger">Late</th>
                      <th className="text-danger">Early</th>
                      <th className="text-danger">Transit</th>
                      <th className="text-danger">Gap</th>
                      <th className="text-danger">Absence</th> */}


                      <th>{t('payroll.deductions')}</th>

                      <th className="text-success">OT</th>
<th className="text-info">Bonus</th>

                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payroll?.audit?.daily?.map((d, idx) => (
                      <tr key={idx}
                        className={
                          d.decisionType === 'NON_WORKING_DAY' ? 'table-light text-muted' :
                          d.decisionType === 'ABSENT_NO_PERMISSION' ? 'table-danger' :
                          d.decisionType === 'LEAVE_UNPAID' ? 'table-warning' :
                          ''
                        }>

                        {/* <td>{new Date(d.date).toLocaleDateString('en-GB')}</td> */}
                       {/* // <td>{fmtDate(d.date)}</td> */}

                       <td>{formatDisplayDate(d.date, tz)}</td>

{/* <td>{fmtDate(d.date, tz)}</td> */}
                        <td>
                          
                          <span className="small">{renderDayStatus(d)}</span></td>
                        {/* <td className="text-danger">{d.deductions.late || '—'}</td>
                        <td className="text-danger">{d.deductions.earlyLeave || '—'}</td>
                        <td className="text-danger">{d.deductions.transit || '—'}</td>
                        <td className="text-danger">{d.deductions.gap || '—'}</td>
                        <td className="text-danger">{d.deductions.absence || '—'}</td> */}
                        <td className="small">
  {(
    d.deductions?.late ||
    d.deductions?.earlyLeave ||
    d.deductions?.transit ||
    d.deductions?.gap ||
    d.deductions?.absence
  ) ? (
    <div className="d-flex flex-column gap-1">

      {d.deductions?.late > 0 && (
        <div className="d-flex justify-content-between text-warning">
          <span className="text-muted small">Late</span>
          <span>{d.deductions.late}</span>
        </div>
      )}

      {d.deductions?.earlyLeave > 0 && (
        <div className="d-flex justify-content-between text-warning">
          <span className="text-muted small">Early</span>
          <span>{d.deductions.earlyLeave}</span>
        </div>
      )}

      {d.deductions?.transit > 0 && (
        <div className="d-flex justify-content-between text-warning">
          <span className="text-muted small">Transit</span>
          <span>{d.deductions.transit}</span>
        </div>
      )}

      {d.deductions?.gap > 0 && (
        <div className="d-flex justify-content-between text-warning">
          <span className="text-muted small">Gap</span>
          <span>{d.deductions.gap}</span>
        </div>
      )}

      {d.deductions?.absence > 0 && (
        <div className="d-flex justify-content-between text-danger">
          <span className="text-muted small">Absence</span>
          <span>{d.deductions.absence}</span>
        </div>
      )}

    </div>
  ) : '—'}
</td>
                        <td className="text-success">
  {d.overtime?.total > 0 ? `+${d.overtime.total}` : '—'}
</td>

<td className="text-info">
  {d.bonus?.total > 0 ? `+${d.bonus.total}` : '—'}
</td>

                        <td className="fw-bold">{d.total || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Warning ── */}
          {policies.length > 1 && (
            <div className="alert alert-warning">
              {t('payroll.multiplePoliciesWarning')}
            </div>
          )}

          {/* ── Actions ── */}
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-success" disabled={generating} onClick={handleGenerate}>
              <i className="fas fa-lock me-1" />
              {t('payroll.generate')}
            </button>
          </div>
        </>
      );
    })()}

      {toast && (
        <Toast show={true} type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
);
};

export default PayrollPreviewPage;
