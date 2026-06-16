// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { getPayrollRuns } from '../../services/payroll.api';
// import Toast from '../../components/ui/Toast';

// const PayrollRunsListPage = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const [runs, setRuns] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [toast, setToast] = useState(null);

//   const [filters, setFilters] = useState({
//     year: new Date().getFullYear(),
//     month: '',
//     status: ''
//   });

//   const loadRuns = async () => {
//     try {
//       setLoading(true);
//       const res = await getPayrollRuns(filters);
//       setRuns(res.data || []);
//     } catch {
//       setToast({ type: 'error', message: t('payroll.loadError') });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadRuns();
//   }, []);

//   return (
//     <div className="container-fluid">

//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3>
//           <i className="fas fa-file-invoice-dollar me-2" />
//           {t('payroll.runsTitle')}
//         </h3>
//       </div>

//       {/* Filters */}
//       <div className="card mb-3">
//         <div className="card-body row g-3 align-items-end">
//           <div className="col-md-3">
//             <label className="form-label">{t('common.year')}</label>
//             <input
//               type="number"
//               className="form-control"
//               value={filters.year}
//               onChange={(e) =>
//                 setFilters({ ...filters, year: e.target.value })
//               }
//             />
//           </div>

//           <div className="col-md-3">
//             <label className="form-label">{t('common.month')}</label>
//             <input
//               type="number"
//               min="1"
//               max="12"
//               className="form-control"
//               value={filters.month}
//               onChange={(e) =>
//                 setFilters({ ...filters, month: e.target.value })
//               }
//             />
//           </div>

//           <div className="col-md-3">
//             <label className="form-label">{t('common.status')}</label>
//             <select
//               className="form-select"
//               value={filters.status}
//               onChange={(e) =>
//                 setFilters({ ...filters, status: e.target.value })
//               }
//             >
//               <option value="">{t('common.all')}</option>
//               <option value="draft">{t('common.draft')}</option>
//               <option value="approved">{t('common.approved')}</option>
//             </select>
//           </div>

//           <div className="col-md-3">
//             <button
//               className="btn btn-primary w-100"
//               onClick={loadRuns}
//             >
//               {t('common.search')}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       {loading ? (
//         <div className="text-center py-5">{t('common.loading')}...</div>
//       ) : (
//         <table className="table table-bordered table-hover align-middle">
//           <thead className="table-light">
//             <tr>
//               <th>{t('common.name')}</th>
//               <th>{t('payroll.period')}</th>
//               <th>{t('payroll.netSalary')}</th>
//               <th>{t('common.status')}</th>
//               <th>{t('common.actions')}</th>
//             </tr>
//           </thead>

//           <tbody>
//             {runs.length === 0 && (
//               <tr>
//                 <td colSpan="5" className="text-center text-muted">
//                   {t('payroll.noRuns')}
//                 </td>
//               </tr>
//             )}

//             {runs.map(run => (
//               <tr key={run._id}>
//                 <td>{run.user?.name}</td>
//                 {/* <td>{run.period.month}/{run.period.year}</td> */}
//                 <td>
//   {run.period.month}/{run.period.year}
//   {run.policyTimeline?.length > 1 && (
//     <span className="badge bg-warning ms-1">
//       {t('payroll.multiplePolicies')}
//     </span>
//   )}
// </td>

//                 <td className="fw-bold">{run.netSalary}</td>
//                 <td>
//                   <span
//                     className={`badge ${
//                       run.status === 'approved'
//                         ? 'bg-success'
//                         : 'bg-secondary'
//                     }`}
//                   >
//                     {t(`common.${run.status}`)}
//                   </span>
//                 </td>
//                 <td>
//                   <button
//                     className="btn btn-sm btn-outline-primary"
//                     onClick={() => navigate(`/payroll/${run._id}`)}
//                   >
//                     {t('common.view')}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
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

// export default PayrollRunsListPage;

//===========================================================ot bonus add












// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { getPayrollRuns } from '../../services/payroll.api';
// import Toast from '../../components/ui/Toast';

// /* ==============================================
//    PayrollRunsListPage
// ============================================== */
// const PayrollRunsListPage = () => {
//   const { t }      = useTranslation();
//   const navigate   = useNavigate();

//   const [runs,    setRuns]    = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [toast,   setToast]   = useState(null);

//   const [filters, setFilters] = useState({
//     year:   new Date().getFullYear(),
//     month:  '',
//     status: ''
//   });

//   /* =========================
//      Load
//   ========================= */
//   const loadRuns = async () => {
//     try {
//       setLoading(true);
//       const res = await getPayrollRuns(filters);
//       setRuns(res.data || []);
//       console.log(res.data); 
//     } catch {
//       setToast({ type: 'error', message: t('payroll.loadError') });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { loadRuns(); }, []);

//   /* =========================
//      JSX
//   ========================= */
//   return (
//     <div className="container-fluid">

//       {/* ── Header ── */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3>
//           <i className="fas fa-file-invoice-dollar me-2" />
//           {t('payroll.runsTitle')}
//         </h3>
//       </div>

//       {/* ── Filters ── */}
//       <div className="card mb-3">
//         <div className="card-body row g-3 align-items-end">
//           <div className="col-md-3">
//             <label className="form-label">{t('common.year')}</label>
//             <input type="number" className="form-control"
//               value={filters.year}
//               onChange={e => setFilters({ ...filters, year: e.target.value })} />
//           </div>

//           <div className="col-md-3">
//             <label className="form-label">{t('common.month')}</label>
//             <input type="number" min="1" max="12" className="form-control"
//               value={filters.month}
//               onChange={e => setFilters({ ...filters, month: e.target.value })} />
//           </div>

//           <div className="col-md-3">
//             <label className="form-label">{t('common.status')}</label>
//             <select className="form-select"
//               value={filters.status}
//               onChange={e => setFilters({ ...filters, status: e.target.value })}>
//               <option value="">{t('common.all')}</option>
//               <option value="draft">{t('common.draft')}</option>
//               <option value="approved">{t('common.approved')}</option>
//             </select>
//           </div>

//           <div className="col-md-3">
//             <button className="btn btn-primary w-100" onClick={loadRuns}>
//               {t('common.search')}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ── Table ── */}
//       {loading ? (
//         <div className="text-center py-5">{t('common.loading')}...</div>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-bordered table-hover align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th>{t('common.name')}</th>
//                 <th>{t('payroll.period')}</th>
//                 <th className="text-end">{t('payroll.baseSalary')}</th>
//                 <th className="text-end text-danger">{t('payroll.totalDeductions')}</th>
//                 <th className="text-end text-success">{t('payroll.overtime')}</th>
//                 <th className="text-end text-info">{t('payroll.bonus')}</th>
//                 <th className="text-end fw-bold">{t('payroll.netSalary')}</th>
//                 <th className="text-center">{t('common.status')}</th>
//                 <th className="text-center">{t('common.actions')}</th>
//               </tr>
//             </thead>

//             <tbody>
//               {runs.length === 0 && (
//                 <tr>
//                   <td colSpan="9" className="text-center text-muted py-4">
//                     {t('payroll.noRuns')}
//                   </td>
//                 </tr>
//               )}

//               {runs.map(run => (
//                 <tr key={run._id}>

//                   {/* Name */}
//                   <td>
//                     <div className="fw-semibold">{run.user?.name}</div>
//                     <div className="text-muted small">{run.user?.email}</div>
//                   </td>

//                   {/* Period */}
//                   <td>
//                     {run.period.month}/{run.period.year}
//                     {run.policyTimeline?.length > 1 && (
//                       <span className="badge bg-warning ms-1 small">
//                         {t('payroll.multiplePolicies')}
//                       </span>
//                     )}
//                   </td>

//                   {/* Base Salary */}
//                   <td className="text-end">{run.baseSalary}</td>

//                   {/* Deductions */}
//                   <td className="text-end text-danger">
//                     {run.deductions?.total > 0 ? `- ${run.deductions.total}` : '—'}
//                   </td>

//                   {/* Overtime */}
//                   <td className="text-end text-success">
//                     {run.overtime?.total > 0 ? (
//                       <span className="fw-semibold">+ {run.overtime.total}</span>
//                     ) : (
//                       <span className="text-muted">—</span>
//                     )}
//                   </td>

//                   {/* Bonus */}
//                   <td className="text-end text-info">
//                     {run.bonus?.total > 0 ? (
//                       <span className="fw-semibold">+ {run.bonus.total}</span>
//                     ) : (
//                       <span className="text-muted">—</span>
//                     )}
//                   </td>

//                   {/* Net Salary */}
//                   <td className="text-end fw-bold text-success fs-6">
//                     {run.netSalary}
//                   </td>

//                   {/* Status */}
//                   <td className="text-center">
//                     <span className={`badge ${run.status === 'approved' ? 'bg-success' : 'bg-warning text-dark'}`}>
//                       {t(`common.${run.status}`)}
//                     </span>
//                   </td>

//                   {/* Actions */}
//                   <td className="text-center">
//                     <button className="btn btn-sm btn-outline-primary"
//                       onClick={() => navigate(`/payroll/${run._id}`)}>
//                       <i className="fas fa-eye me-1" />
//                       {t('common.view')}
//                     </button>
//                   </td>

//                 </tr>
//               ))}
//             </tbody>

//             {/* Totals Footer */}
//             {runs.length > 0 && (
//               <tfoot className="table-light fw-bold">
//                 <tr>
//                   <td colSpan="2">{t('payroll.totals')}</td>
//                   <td className="text-end">
//                     {runs.reduce((s, r) => s + (r.baseSalary || 0), 0).toFixed(2)}
//                   </td>
//                   <td className="text-end text-danger">
//                     - {runs.reduce((s, r) => s + (r.deductions?.total || 0), 0).toFixed(2)}
//                   </td>
//                   <td className="text-end text-success">
//                     + {runs.reduce((s, r) => s + (r.overtime?.total || 0), 0).toFixed(2)}
//                   </td>
//                   <td className="text-end text-info">
//                     + {runs.reduce((s, r) => s + (r.bonus?.total || 0), 0).toFixed(2)}
//                   </td>
//                   <td className="text-end text-success">
//                     {runs.reduce((s, r) => s + (r.netSalary || 0), 0).toFixed(2)}
//                   </td>
//                   <td colSpan="2" />
//                 </tr>
//               </tfoot>
//             )}
//           </table>
//         </div>
//       )}

//       {toast && (
//         <Toast show={true} type={toast.type} message={toast.message} onClose={() => setToast(null)} />
//       )}
//     </div>
//   );
// };

// export default PayrollRunsListPage;


//===============================================================













// src/pages/payroll/PayrollRunsListPage.jsx
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  getPayrollRuns, getPayrollStats,
  bulkGeneratePayroll, bulkApprovePayroll,
} from '../../services/payroll.api';
import { getBranchLookup }  from '../../services/branch.api';
import { getDepartments }   from '../../services/department.api';
import { searchUsers }      from '../../services/user.api';
import Toast                from '../../components/ui/Toast';
import { isGlobalAdmin }    from '../../helpers/auth';
import '../../style/payroll.css';

const PAGE_SIZE = 50;

function useDebounce(value, delay = 400) {
  const [deb, setDeb] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDeb(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return deb;
}

/* ── Stats Bar ── */
function StatsBar({ stats, loading }) {
  if (loading) return (
    <div className="row g-3 mb-4">
      {[...Array(6)].map((_, i) => (
        <div className="col-6 col-md" key={i}>
          <div className="card h-100" style={{ minHeight: 76 }}>
            <div className="card-body d-flex align-items-center justify-content-center">
              <span className="spinner-border spinner-border-sm text-secondary" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  if (!stats) return null;
  const tiles = [
    { label: 'Total',         value: stats.totalUsers,   color: 'primary',   icon: 'fa-users'         },
    { label: 'Generated',     value: stats.generated,    color: 'info',      icon: 'fa-file-invoice'  },
    { label: 'Approved',      value: stats.approved,     color: 'success',   icon: 'fa-check-circle'  },
    { label: 'Draft',         value: stats.draft,        color: 'warning',   icon: 'fa-clock'         },
    { label: 'Not Generated', value: stats.notGenerated, color: 'secondary', icon: 'fa-minus-circle'  },
    { label: 'Approval Rate', value: `${stats.completionRate ?? 0}%`, color: 'success', icon: 'fa-percent' },
  ];
  return (
    <div className="row g-3 mb-4">
      {tiles.map(({ label, value, color, icon }) => (
        <div className="col-6 col-md" key={label}>
          <div className={`card border-${color} border-opacity-50 h-100`}>
            <div className="card-body py-3 text-center">
              <i className={`fas ${icon} text-${color} mb-1`} style={{ fontSize: 18 }} />
              <div className={`fw-bold fs-5 text-${color}`}>{value ?? '—'}</div>
              <div className="text-muted" style={{ fontSize: 11 }}>{label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Bulk Result Modal ── */
function BulkResultModal({ result, onClose }) {
  if (!result) return null;
  const { summary, results = [] } = result;
  const successKey = summary.generated != null ? 'generated' : 'approved';
  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.45)' }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"><i className="fas fa-list-check me-2" />Bulk Result</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <div className="row g-2 mb-3">
              {[
                { label: 'Total',   value: summary.total,             color: 'primary' },
                { label: 'Success', value: summary[successKey] ?? 0,  color: 'success' },
                { label: 'Skipped', value: summary.skipped    ?? 0,   color: 'warning' },
                { label: 'Errors',  value: summary.errors     ?? 0,   color: 'danger'  },
              ].map(({ label, value, color }) => (
                <div className="col-3" key={label}>
                  <div className={`card border-${color} text-center py-2`}>
                    <div className={`fw-bold fs-4 text-${color}`}>{value}</div>
                    <div className="text-muted small">{label}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="table-responsive" style={{ maxHeight: 320 }}>
              <table className="table table-sm table-bordered mb-0">
                <thead className="table-light sticky-top">
                  <tr><th>#</th><th>Employee</th><th>Status</th><th>Details</th></tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className={r.status === 'error' ? 'table-danger' : r.status === 'skipped' ? 'table-warning' : ''}>
                      <td>{i + 1}</td>
                      <td>
                        <div className="fw-semibold small">{r.userName || r.userId}</div>
                      </td>
                      <td>
                        <span className={`badge bg-${r.status === 'generated' || r.status === 'approved' ? 'success' : r.status === 'skipped' ? 'warning text-dark' : 'danger'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="small">{r.reason || (r.netSalary != null ? `Net: ${Number(r.netSalary).toFixed(2)}` : '—')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Run Row Component ── */
function RunRow({ run, navigate, t, isMultiBranch = false }) {
  const branchNames = (run.user?.branches || []).map(b => b?.name || b).filter(Boolean).join(', ') || '—';
  const deptNames   = (run.user?.departments || []).map(d => d?.name || d).filter(Boolean).join(', ') || '—';

  return (
    <tr className={isMultiBranch ? 'table-warning' : ''}>
      <td>
        <div className="fw-semibold">{run.user?.name}</div>
        <div className="text-muted small">{run.user?.email}</div>
      </td>
      <td className="small">{branchNames}</td>
      <td className="small text-muted">{deptNames}</td>
      <td>
        {String(run.period.month).padStart(2,'0')}/{run.period.year}
        {(run.policyTimeline?.length || 0) > 1 && (
          <span className="badge bg-warning ms-1" style={{ fontSize: 10 }}>Multi-Policy</span>
        )}
      </td>
      <td className="text-end">{run.baseSalary?.toFixed(2)}</td>
      <td className="text-end text-danger">
        {(run.deductions?.total || 0) > 0 ? `- ${run.deductions.total.toFixed(2)}` : '—'}
      </td>
      <td className="text-end text-success">
        {(run.overtime?.total || 0) > 0 ? <strong>+ {run.overtime.total.toFixed(2)}</strong> : <span className="text-muted">—</span>}
      </td>
      <td className="text-end text-info">
        {(run.bonus?.total || 0) > 0 ? <strong>+ {run.bonus.total.toFixed(2)}</strong> : <span className="text-muted">—</span>}
      </td>
      <td className="text-end fw-bold text-success">{run.netSalary?.toFixed(2)}</td>
      <td className="text-center">
        <span className={`badge ${run.status === 'approved' ? 'bg-success' : 'bg-warning text-dark'}`}>
          {run.status === 'approved' ? '✓ Approved' : '⏳ Draft'}
        </span>
      </td>
      <td className="text-center">
        <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/payroll/${run._id}`)}>
          <i className="fas fa-eye" />
        </button>
      </td>
    </tr>
  );
}

/* ══════════════════════════════════════════════════
   Main
══════════════════════════════════════════════════ */
const PayrollRunsListPage = () => {
  const { t }    = useTranslation("Payroll");;
  const navigate = useNavigate();
  const isGlobal = isGlobalAdmin();
  const now      = new Date();

  const [filters, setFilters] = useState({
    year: now.getFullYear(), month: now.getMonth() + 1,
    status: '', branchId: '', departmentId: '', userId: '',
  });
  const [userSearch,    setUserSearch]    = useState('');
  const debouncedUser                     = useDebounce(userSearch, 400);
  const [branches,      setBranches]      = useState([]);
  const [departments,   setDepartments]   = useState([]);
  const [userOptions,   setUserOptions]   = useState([]);
  const [userSearching, setUserSearching] = useState(false);
  const [runs,          setRuns]          = useState([]);
  const [pagination,    setPagination]    = useState({ page: 1, pages: 1, total: 0 });
  const [stats,         setStats]         = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [statsLoading,  setStatsLoading]  = useState(false);
  const [bulkLoading,   setBulkLoading]   = useState(false);
  const [page,          setPage]          = useState(1);
  const [toast,         setToast]         = useState(null);
  const [bulkResult,    setBulkResult]    = useState(null);
  const [confirmAction, setConfirmAction]  = useState(null); // { label, action }
  const prevRef = useRef(null);

  /* ── lookups ── */
  useEffect(() => {
    // branches → r.data.data = [...]
    getBranchLookup().then(r => {
      const d = r?.data?.data ?? [];
      setBranches(Array.isArray(d) ? d : []);
    }).catch(() => {});
    // departments → r.data.departments = [...]
    getDepartments({ limit: 200 }).then(r => {
      const d = r?.data?.departments ?? [];
      setDepartments(Array.isArray(d) ? d : []);
    }).catch(() => {});
  }, []);

  /* ── user search ── */
  useEffect(() => {
    if (!debouncedUser.trim()) { setUserOptions([]); return; }
    setUserSearching(true);
    searchUsers(debouncedUser, filters.branchId || '')
      .then(r => setUserOptions(r?.data?.data ?? r?.data ?? []))
      .catch(() => {})
      .finally(() => setUserSearching(false));
  }, [debouncedUser, filters.branchId]);

  /* ── load ── */
  const loadRuns = useCallback(async (p, f) => {
    try {
      setLoading(true);
      const res = await getPayrollRuns({
        ...f,
        branchId:     f.branchId     || undefined,
        departmentId: f.departmentId || undefined,
        userId:       f.userId       || undefined,
        page: p, limit: PAGE_SIZE,
      });
      setRuns(res.data || []);
      setPagination(res.pagination || { page: 1, pages: 1, total: 0 });
    } catch { setToast({ type: 'error', message: t('payroll.loadError') }); }
    finally { setLoading(false); }
  }, []);

  const loadStats = useCallback(async (f) => {
    if (!f.year || !f.month) return;
    setStatsLoading(true);
    try {
      const res = await getPayrollStats({ year: f.year, month: f.month, branchId: f.branchId || undefined, departmentId: f.departmentId || undefined });
      setStats(res);
    } catch {} finally { setStatsLoading(false); }
  }, []);

  /* ── initial ── */
  useEffect(() => { prevRef.current = JSON.stringify(filters); loadRuns(1, filters); loadStats(filters); }, []);

  /* ── auto-search on filter change ── */
  useEffect(() => {
    const cur = JSON.stringify(filters);
    if (prevRef.current !== null && prevRef.current !== cur) {
      prevRef.current = cur;
      setPage(1); loadRuns(1, filters); loadStats(filters);
    }
  }, [filters]);

  const setF = (k, v) => setFilters(f => ({ ...f, [k]: v }));

  /* ── bulk ── */
  const payload = () => ({ year: filters.year, month: filters.month, branchId: filters.branchId || undefined, departmentId: filters.departmentId || undefined, page: 1, limit: 200 });

  const handleBulkGenerate = () => {
    const filterParts = [
      filters.branchId     && `Branch: ${branches.find(b => b._id === filters.branchId)?.name     || filters.branchId}`,
      filters.departmentId && `Dept: ${departments.find(d => d._id === filters.departmentId)?.name || filters.departmentId}`,
      // filters.userId       && `Employee: ${userSearch}`
      filters.userId && `Search Filter: ${userSearch}`,
    ].filter(Boolean);
    const label = filterParts.length
  ? `Generate payroll for matching employees

Month: ${String(filters.month).padStart(2,'0')}/${filters.year}

Filters:
${filterParts.join(' | ')}


Existing payroll runs will be skipped.`
  : `Generate payroll for ALL employees

Month: ${String(filters.month).padStart(2,'0')}/${filters.year}

,Existing payroll runs will be skipped.`;

    // const label = filterParts.length
    //   ? `Generate payroll for ${String(filters.month).padStart(2,'0')}/${filters.year}\n📌 Filters: ${filterParts.join(' | ')}\nExisting runs will be skipped.`
    //   : `Generate payroll for ALL employees\nMonth: ${String(filters.month).padStart(2,'0')}/${filters.year}\nExisting runs will be skipped.`;
    setConfirmAction({
      label,
      action: async () => {
        try {
          setBulkLoading(true);
          const res = await bulkGeneratePayroll(payload());
          setBulkResult(res); loadRuns(1, filters); loadStats(filters);
        } catch (err) { setToast({ type: 'error', message: err.response?.data?.message || 'Failed' }); }
        finally { setBulkLoading(false); }
      },
    });
  };

  const handleBulkApprove = () => {
    const filterParts = [
      filters.branchId     && `Branch: ${branches.find(b => b._id === filters.branchId)?.name     || filters.branchId}`,
      filters.departmentId && `Dept: ${departments.find(d => d._id === filters.departmentId)?.name || filters.departmentId}`,
      // filters.userId       && `Employee: ${userSearch}`,
      filters.userId && `Search Filter: ${userSearch}`,
    ].filter(Boolean);
    const label = filterParts.length
  ? `Approve matching payroll records

Month: ${String(filters.month).padStart(2,'0')}/${filters.year}

Filters:
${filterParts.join(' | ')}


,This action cannot be undone.`
  : `Approve ALL draft payrolls

Month: ${String(filters.month).padStart(2,'0')}/${filters.year}

This action cannot be undone.`;

    // const label = filterParts.length
    //   ? `Approve DRAFT payrolls for ${String(filters.month).padStart(2,'0')}/${filters.year}\n📌 Filters: ${filterParts.join(' | ')}\nThis cannot be undone.`
    //   : `Approve ALL draft payrolls\nMonth: ${String(filters.month).padStart(2,'0')}/${filters.year}\nThis cannot be undone.`;
    setConfirmAction({
      label,
      action: async () => {
        try {
          setBulkLoading(true);
          const res = await bulkApprovePayroll(payload());
          setBulkResult(res); loadRuns(1, filters); loadStats(filters);
        } catch (err) { setToast({ type: 'error', message: err.response?.data?.message || 'Failed' }); }
        finally { setBulkLoading(false); }
      },
    });
  };

  // ✅ فصل الموظفين العاديين عن multi-branch
  const multiBranchRuns = runs.filter(r => (r.user?.branches?.length || 0) > 1);
  const singleRuns      = runs.filter(r => (r.user?.branches?.length || 0) <= 1);

  const calcTotals = (arr) => arr.reduce((a, r) => ({
    base:       a.base       + (r.baseSalary        || 0),
    deductions: a.deductions + (r.deductions?.total || 0),
    overtime:   a.overtime   + (r.overtime?.total   || 0),
    bonus:      a.bonus      + (r.bonus?.total      || 0),
    net:        a.net        + (r.netSalary          || 0),
  }), { base: 0, deductions: 0, overtime: 0, bonus: 0, net: 0 });

  const totals = calcTotals(singleRuns);

  return (
    <div className="container-fluid">

      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h3 className="mb-0">
          <i className="fas fa-file-invoice-dollar me-2 text-primary" />
          {t('payroll.runsTitle')}
        </h3>
        <div className="d-flex gap-2 flex-wrap">
        </div>
      </div>

      {/* Auto-generate note */}
      {/* <div className="alert alert-info d-flex align-items-center gap-2 py-2 px-3 mb-3" style={{ fontSize: 14}}> */}
<div
  className="payroll-notes-card mb-3"
>

        <i className="fas fa-robot" />
      

        <ul className="mb-0" style={{ paddingLeft: 18 }}>

          <li>
{t('payroll.autoGenerateNote1')}
</li>
 <li>{t('payroll.autoGenerateNote2')}
 </li>
 <li>{t('payroll.autoGenerateNote3')}
 </li>
 <li><strong>🔐 {t('payroll.autoGenerateNote4')}</strong> 
          </li>
         
          </ul>
      </div>

      {/* Stats */}
      <StatsBar stats={stats} loading={statsLoading} />

      <div className="d-flex gap-2 flex-wrap mb-3">

<button className="btn btn-light btn-sm payroll-action-btn" disabled={bulkLoading} onClick={handleBulkGenerate}>
            {bulkLoading ? <span className="spinner-border spinner-border-sm me-1" /> : <i className="fas fa-magic me-1" />}
            {/* Bulk Generate */}

            {t('payroll.bulkGenerate')}
          </button>
          <button className="btn btn-outline-warning btn-sm payroll-action-btn" disabled={bulkLoading} onClick={handleBulkApprove}>
            {bulkLoading ? <span className="spinner-border spinner-border-sm me-1" /> : <i className="fas fa-check-double me-1" />}
            {/* Bulk Approve */}
            {t('payroll.bulkApprove')}
          </button></div>

        
          <div
 className="payroll-notes-card payroll-notes-card-sm mb-3"
>

        <div className="fw-semibold mb-2 d-flex align-items-center gap-2">
  <i className="fas fa-robot" />
{t('payroll.AutoApprovalRules')}</div>

        <ul className="mb-0" style={{ paddingLeft: 18 }}>

      
          <li>
            {t('payroll.bulkGenerateNote')}
          </li>
            <li>
            {t('payroll.bulkApproveNote')}
          </li>
          </ul>
      </div>

      {/* Filters */}
      <div className="card mb-3 border-0 shadow-sm">
        <div className="card-body py-3">
          <div className="row g-2 align-items-end">

            <div className="col-6 col-sm-3 col-md-2">
              <label className="form-label small fw-semibold mb-1">{t('common.year')}</label>
              <input type="number" className="form-control form-control-sm"
                value={filters.year} onChange={e => setF('year', +e.target.value)} />
            </div>

            <div className="col-6 col-sm-3 col-md-2">
              <label className="form-label small fw-semibold mb-1">{t('common.month')}</label>
              <select className="form-select form-select-sm"
                value={filters.month} onChange={e => setF('month', +e.target.value)}>
                {[...Array(12)].map((_, i) => (
                  <option key={i+1} value={i+1}>
                    {new Date(2000, i).toLocaleString('en', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-6 col-sm-3 col-md-2">
              <label className="form-label small fw-semibold mb-1">{t('common.status')}</label>
              <select className="form-select form-select-sm"
                value={filters.status} onChange={e => setF('status', e.target.value)}>
                <option value="">{t('common.all')}</option>
                <option value="draft">Draft</option>
                <option value="approved">Approved</option>
              </select>
            </div>

            {/* Branch — Global only */}
            {isGlobal && (
              <div className="col-6 col-sm-3 col-md-2">
                <label className="form-label small fw-semibold mb-1">{t('common.branch')}</label>
                <select className="form-select form-select-sm"
                  value={filters.branchId} onChange={e => setF('branchId', e.target.value)}>
                  <option value="">All Branches</option>
                  {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </div>
            )}

            {/* Department */}
            <div className="col-6 col-sm-3 col-md-2">
              <label className="form-label small fw-semibold mb-1">{t('common.department')}</label>
              <select className="form-select form-select-sm"
                value={filters.departmentId} onChange={e => setF('departmentId', e.target.value)}>
                <option value="">All Departments</option>
                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>

            {/* User search */}
            <div className="col-12 col-md-3">
              <label className="form-label small fw-semibold mb-1">{t('common.employee')}</label>
              <div className="position-relative">
                <input type="text" className="form-control form-control-sm"
                  placeholder="Search by name..."
                  value={userSearch}
                  onChange={e => { setUserSearch(e.target.value); if (!e.target.value) setF('userId', ''); }} />
                {userSearching && (
                  <span className="position-absolute top-50 end-0 translate-middle-y me-2">
                    <span className="spinner-border spinner-border-sm text-secondary" style={{ width: 14, height: 14 }} />
                  </span>
                )}
                {userOptions.length > 0 && userSearch && !filters.userId && (
                  <ul className="list-group position-absolute w-100 mt-1 shadow-sm z-3 border" style={{ maxHeight: 200, overflowY: 'auto' }}>
                    {userOptions.map(u => (
                      <li key={u._id}
                        className="list-group-item list-group-item-action py-2 px-3"
                        style={{ cursor: 'pointer', fontSize: 12 }}
                        onMouseDown={() => { setF('userId', u._id); setUserSearch(u.name); setUserOptions([]); }}>
                        <div className="fw-semibold">{u.name}</div>
                        <div className="text-muted" style={{ fontSize: 11 }}>{u.email}</div>
                      </li>
                    ))}
                  </ul>
                )}
                {filters.userId && (
                  <button className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-1 p-0 text-muted"
                    style={{ fontSize: 11 }}
                    onClick={() => { setF('userId', ''); setUserSearch(''); setUserOptions([]); }}>
                    <i className="fas fa-times" />
                  </button>
                )}
              </div>
              {filters.userId && (
  <div className="col-12">
    <div className="alert alert-info py-2 px-3 mb-0 small">
      <i className="fas fa-info-circle me-2" />
      Employee filter affects search results only.
      Bulk Generate and Bulk Approve remain bulk operations.
    </div>
  </div>
)}
            </div>

          </div>
        </div>
          
      </div>

      {/* Table */}

      <div className="d-flex align-items-center justify-content-between mb-2">

  <div className="small ">

    <i className="fas fa-globe me-1" />

{t('payroll.timezone')}
    <span className="badge bg-light text-dark border ms-2">

      {Intl.DateTimeFormat().resolvedOptions().timeZone}

    </span>

  </div>

</div>

      {loading ? (
        <div className="text-center py-5"><span className="spinner-border text-primary" /></div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>{t('common.name')}</th>
                  <th>{t('common.branch')}</th>
                  <th>{t('common.department')}</th>
                  <th>{t('payroll.period')}</th>
                  <th className="text-end">{t('payroll.baseSalary')}</th>
                  <th className="text-end text-danger">{t('payroll.totalDeductions')}</th>
                  <th className="text-end text-success">{t('payroll.overtime')}</th>
                  <th className="text-end text-info">{t('payroll.bonus')}</th>
                  <th className="text-end fw-bold">{t('payroll.netSalary')}</th>
                  <th className="text-center">{t('common.status')}</th>
                  <th className="text-center">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {singleRuns.length === 0 && multiBranchRuns.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center text-muted py-5">
                      <i className="fas fa-inbox fa-2x mb-2 d-block opacity-25" />
                      {t('payroll.noRuns')}
                    </td>
                  </tr>
                ) : singleRuns.map(run => (
                  <RunRow key={run._id} run={run} navigate={navigate} t={t} />
                ))}
              </tbody>
              {singleRuns.length > 0 && (
                <tfoot className="table-light fw-bold">
                  <tr>
                    <td colSpan="4" className="text-muted fw-normal small">
                      Totals — {singleRuns.length} employees
                    </td>
                    <td className="text-end">{totals.base.toFixed(2)}</td>
                    <td className="text-end text-danger">- {totals.deductions.toFixed(2)}</td>
                    <td className="text-end text-success">+ {totals.overtime.toFixed(2)}</td>
                    <td className="text-end text-info">+ {totals.bonus.toFixed(2)}</td>
                    <td className="text-end text-success">{totals.net.toFixed(2)}</td>
                    <td colSpan="2" />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted small">Page {page} of {pagination.pages} — {pagination.total} records</div>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => { const p = page - 1; setPage(p); loadRuns(p, filters); }}>‹</button>
                  </li>
                  {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => i + 1).map(p => (
                    <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => { setPage(p); loadRuns(p, filters); }}>{p}</button>
                    </li>
                  ))}
                  <li className={`page-item ${page >= pagination.pages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => { const p = page + 1; setPage(p); loadRuns(p, filters); }}>›</button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}

      {/* ── Multi-Branch Employees Section ── */}
      {multiBranchRuns.length > 0 && (
        <div className="mt-4">
        <div className="payroll-multi-branch-alert mb-3">
  <div className="d-flex align-items-start gap-2">
    
    <i className="fas fa-exclamation-triangle mt-1" />

    <div>
      <div className="fw-semibold mb-1">
        {t('payroll.listpagemultiBranchTitle', {
          count: multiBranchRuns.length
        })}
      </div>

      <div className="small opacity-90">
        {t('payroll.listpagemultiBranchNote')}
      </div>
    </div>

  </div>
</div>
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle" style={{ borderColor: '#ffc107' }}>
              <thead style={{ background: '#fff3cd' }}>
                <tr>
                  <th>{t('common.name')}</th>
                  <th>{t('common.branch')}</th>
                  <th>{t('common.department')}</th>
                  <th>{t('payroll.period')}</th>
                  <th className="text-end">{t('payroll.baseSalary')}</th>
                  <th className="text-end text-danger">{t('payroll.totalDeductions')}</th>
                  <th className="text-end text-success">{t('payroll.overtime')}</th>
                  <th className="text-end text-info">{t('payroll.bonus')}</th>
                  <th className="text-end fw-bold">{t('payroll.netSalary')}</th>
                  <th className="text-center">{t('common.status')}</th>
                  <th className="text-center">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {multiBranchRuns.map(run => (
                  <RunRow key={run._id} run={run} navigate={navigate} t={t} isMultiBranch />
                ))}
              </tbody>
              <tfoot style={{ background: '#fff3cd' }} className="fw-bold">
                <tr>
                  <td colSpan="4" className="text-muted fw-normal small">
                    Multi-branch totals (not included above)
                  </td>
                  {(() => { const mt = calcTotals(multiBranchRuns); return (<>
                    <td className="text-end">{mt.base.toFixed(2)}</td>
                    <td className="text-end text-danger">- {mt.deductions.toFixed(2)}</td>
                    <td className="text-end text-success">+ {mt.overtime.toFixed(2)}</td>
                    <td className="text-end text-info">+ {mt.bonus.toFixed(2)}</td>
                    <td className="text-end text-success">{mt.net.toFixed(2)}</td>
                  </>); })()}
                  <td colSpan="2" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {bulkResult && <BulkResultModal result={bulkResult} onClose={() => setBulkResult(null)} />}

      {/* Confirm Toast */}
      {confirmAction && (
        <Toast
          show={true}
          type="warning"
          message={confirmAction.label}
          confirmText="Confirm"
          cancelText="Cancel"
          onConfirm={async () => { await confirmAction.action(); setConfirmAction(null); }}
          onClose={() => setConfirmAction(null)}
        />
      )}

      {/* Notification Toast */}
      {toast && (
        <Toast show={true} type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default PayrollRunsListPage;









// // src/pages/payroll/PayrollRunsListPage.jsx
// import { useEffect, useState, useCallback, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import {
//   getPayrollRuns, getPayrollStats,
//   bulkGeneratePayroll, bulkApprovePayroll,
// } from '../../services/payroll.api';
// import { getBranchLookup }  from '../../services/branch.api';
// import { getDepartments }   from '../../services/department.api';
// import { searchUsers }      from '../../services/user.api';
// import Toast                from '../../components/ui/Toast';
// import { isGlobalAdmin }    from '../../helpers/auth';

// const PAGE_SIZE = 50;

// function useDebounce(value, delay = 400) {
//   const [deb, setDeb] = useState(value);
//   useEffect(() => { const t = setTimeout(() => setDeb(value), delay); return () => clearTimeout(t); }, [value, delay]);
//   return deb;
// }

// /* ── Stats Bar ── */
// function StatsBar({ stats, loading }) {
//   if (loading) return (
//     <div className="row g-3 mb-4">
//       {[...Array(6)].map((_, i) => (
//         <div className="col-6 col-md" key={i}>
//           <div className="card h-100" style={{ minHeight: 76 }}>
//             <div className="card-body d-flex align-items-center justify-content-center">
//               <span className="spinner-border spinner-border-sm text-secondary" />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
//   if (!stats) return null;
//   const tiles = [
//     { label: 'Total',         value: stats.totalUsers,   color: 'primary',   icon: 'fa-users'         },
//     { label: 'Generated',     value: stats.generated,    color: 'info',      icon: 'fa-file-invoice'  },
//     { label: 'Approved',      value: stats.approved,     color: 'success',   icon: 'fa-check-circle'  },
//     { label: 'Draft',         value: stats.draft,        color: 'warning',   icon: 'fa-clock'         },
//     { label: 'Not Generated', value: stats.notGenerated, color: 'secondary', icon: 'fa-minus-circle'  },
//     { label: 'Approval Rate', value: `${stats.completionRate ?? 0}%`, color: 'success', icon: 'fa-percent' },
//   ];
//   return (
//     <div className="row g-3 mb-4">
//       {tiles.map(({ label, value, color, icon }) => (
//         <div className="col-6 col-md" key={label}>
//           <div className={`card border-${color} border-opacity-50 h-100`}>
//             <div className="card-body py-3 text-center">
//               <i className={`fas ${icon} text-${color} mb-1`} style={{ fontSize: 18 }} />
//               <div className={`fw-bold fs-5 text-${color}`}>{value ?? '—'}</div>
//               <div className="text-muted" style={{ fontSize: 11 }}>{label}</div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// /* ── Bulk Result Modal ── */
// function BulkResultModal({ result, onClose }) {
//   if (!result) return null;
//   const { summary, results = [] } = result;
//   const successKey = summary.generated != null ? 'generated' : 'approved';
//   return (
//     <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.45)' }}>
//       <div className="modal-dialog modal-lg modal-dialog-scrollable">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title"><i className="fas fa-list-check me-2" />Bulk Result</h5>
//             <button className="btn-close" onClick={onClose} />
//           </div>
//           <div className="modal-body">
//             <div className="row g-2 mb-3">
//               {[
//                 { label: 'Total',   value: summary.total,             color: 'primary' },
//                 { label: 'Success', value: summary[successKey] ?? 0,  color: 'success' },
//                 { label: 'Skipped', value: summary.skipped    ?? 0,   color: 'warning' },
//                 { label: 'Errors',  value: summary.errors     ?? 0,   color: 'danger'  },
//               ].map(({ label, value, color }) => (
//                 <div className="col-3" key={label}>
//                   <div className={`card border-${color} text-center py-2`}>
//                     <div className={`fw-bold fs-4 text-${color}`}>{value}</div>
//                     <div className="text-muted small">{label}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="table-responsive" style={{ maxHeight: 320 }}>
//               <table className="table table-sm table-bordered mb-0">
//                 <thead className="table-light sticky-top">
//                   <tr><th>#</th><th>User ID</th><th>Status</th><th>Details</th></tr>
//                 </thead>
//                 <tbody>
//                   {results.map((r, i) => (
//                     <tr key={i} className={r.status === 'error' ? 'table-danger' : r.status === 'skipped' ? 'table-warning' : ''}>
//                       <td>{i + 1}</td>
//                       <td className="small font-monospace text-muted">{r.userId}</td>
//                       <td>
//                         <span className={`badge bg-${r.status === 'generated' || r.status === 'approved' ? 'success' : r.status === 'skipped' ? 'warning text-dark' : 'danger'}`}>
//                           {r.status}
//                         </span>
//                       </td>
//                       <td className="small">{r.reason || (r.netSalary != null ? `Net: ${r.netSalary}` : '—')}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//           <div className="modal-footer">
//             <button className="btn btn-secondary" onClick={onClose}>Close</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════
//    Main
// ══════════════════════════════════════════════════ */
// const PayrollRunsListPage = () => {
//   const { t }    = useTranslation();
//   const navigate = useNavigate();
//   const isGlobal = isGlobalAdmin();
//   const now      = new Date();

//   const [filters, setFilters] = useState({
//     year: now.getFullYear(), month: now.getMonth() + 1,
//     status: '', branchId: '', departmentId: '', userId: '',
//   });
//   const [userSearch,    setUserSearch]    = useState('');
//   const debouncedUser                     = useDebounce(userSearch, 400);
//   const [branches,      setBranches]      = useState([]);
//   const [departments,   setDepartments]   = useState([]);
//   const [userOptions,   setUserOptions]   = useState([]);
//   const [userSearching, setUserSearching] = useState(false);
//   const [runs,          setRuns]          = useState([]);
//   const [pagination,    setPagination]    = useState({ page: 1, pages: 1, total: 0 });
//   const [stats,         setStats]         = useState(null);
//   const [loading,       setLoading]       = useState(true);
//   const [statsLoading,  setStatsLoading]  = useState(false);
//   const [bulkLoading,   setBulkLoading]   = useState(false);
//   const [page,          setPage]          = useState(1);
//   const [toast,         setToast]         = useState(null);
//   const [bulkResult,    setBulkResult]    = useState(null);
//   const prevRef = useRef(null);

//   /* ── lookups ── */
//   useEffect(() => {
//     // branches → r.data.data = [...]
//     getBranchLookup().then(r => {
//       const d = r?.data?.data ?? [];
//       setBranches(Array.isArray(d) ? d : []);
//     }).catch(() => {});
//     // departments → r.data.departments = [...]
//     getDepartments({ limit: 200 }).then(r => {
//       const d = r?.data?.departments ?? [];
//       setDepartments(Array.isArray(d) ? d : []);
//     }).catch(() => {});
//   }, []);

//   /* ── user search ── */
//   useEffect(() => {
//     if (!debouncedUser.trim()) { setUserOptions([]); return; }
//     setUserSearching(true);
//     searchUsers(debouncedUser, filters.branchId || '')
//       .then(r => setUserOptions(r?.data?.data ?? r?.data ?? []))
//       .catch(() => {})
//       .finally(() => setUserSearching(false));
//   }, [debouncedUser, filters.branchId]);

//   /* ── load ── */
//   const loadRuns = useCallback(async (p, f) => {
//     try {
//       setLoading(true);
//       const res = await getPayrollRuns({
//         ...f,
//         branchId:     f.branchId     || undefined,
//         departmentId: f.departmentId || undefined,
//         userId:       f.userId       || undefined,
//         page: p, limit: PAGE_SIZE,
//       });
//       setRuns(res.data || []);
//       setPagination(res.pagination || { page: 1, pages: 1, total: 0 });
//     } catch { setToast({ type: 'error', message: t('payroll.loadError') }); }
//     finally { setLoading(false); }
//   }, []);

//   const loadStats = useCallback(async (f) => {
//     if (!f.year || !f.month) return;
//     setStatsLoading(true);
//     try {
//       const res = await getPayrollStats({ year: f.year, month: f.month, branchId: f.branchId || undefined, departmentId: f.departmentId || undefined });
//       setStats(res);
//     } catch {} finally { setStatsLoading(false); }
//   }, []);

//   /* ── initial ── */
//   useEffect(() => { prevRef.current = JSON.stringify(filters); loadRuns(1, filters); loadStats(filters); }, []);

//   /* ── auto-search on filter change ── */
//   useEffect(() => {
//     const cur = JSON.stringify(filters);
//     if (prevRef.current !== null && prevRef.current !== cur) {
//       prevRef.current = cur;
//       setPage(1); loadRuns(1, filters); loadStats(filters);
//     }
//   }, [filters]);

//   const setF = (k, v) => setFilters(f => ({ ...f, [k]: v }));

//   /* ── bulk ── */
//   const payload = () => ({ year: filters.year, month: filters.month, branchId: filters.branchId || undefined, departmentId: filters.departmentId || undefined, page: 1, limit: 200 });

//   const handleBulkGenerate = async () => {
//     if (!window.confirm(`Generate payroll for ${String(filters.month).padStart(2,'0')}/${filters.year}?\nExisting runs will be skipped.`)) return;
//     try {
//       setBulkLoading(true);
//       const res = await bulkGeneratePayroll(payload());
//       setBulkResult(res); loadRuns(1, filters); loadStats(filters);
//     } catch (err) { setToast({ type: 'error', message: err.response?.data?.message || 'Failed' }); }
//     finally { setBulkLoading(false); }
//   };

//   const handleBulkApprove = async () => {
//     if (!window.confirm(`Approve ALL draft payrolls for ${String(filters.month).padStart(2,'0')}/${filters.year}?\nThis cannot be undone.`)) return;
//     try {
//       setBulkLoading(true);
//       const res = await bulkApprovePayroll(payload());
//       setBulkResult(res); loadRuns(1, filters); loadStats(filters);
//     } catch (err) { setToast({ type: 'error', message: err.response?.data?.message || 'Failed' }); }
//     finally { setBulkLoading(false); }
//   };

//   const totals = runs.reduce((a, r) => ({
//     base: a.base + (r.baseSalary || 0), deductions: a.deductions + (r.deductions?.total || 0),
//     overtime: a.overtime + (r.overtime?.total || 0), bonus: a.bonus + (r.bonus?.total || 0),
//     net: a.net + (r.netSalary || 0),
//   }), { base: 0, deductions: 0, overtime: 0, bonus: 0, net: 0 });

//   return (
//     <div className="container-fluid">

//       {/* Header */}
//       <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
//         <h3 className="mb-0">
//           <i className="fas fa-file-invoice-dollar me-2 text-primary" />
//           {t('payroll.runsTitle')}
//         </h3>
//         <div className="d-flex gap-2 flex-wrap">
//           <button className="btn btn-outline-primary btn-sm" disabled={bulkLoading} onClick={handleBulkGenerate}>
//             {bulkLoading ? <span className="spinner-border spinner-border-sm me-1" /> : <i className="fas fa-magic me-1" />}
//             Bulk Generate
//           </button>
//           <button className="btn btn-success btn-sm" disabled={bulkLoading} onClick={handleBulkApprove}>
//             {bulkLoading ? <span className="spinner-border spinner-border-sm me-1" /> : <i className="fas fa-check-double me-1" />}
//             Bulk Approve
//           </button>
//         </div>
//       </div>

//       {/* Auto-generate note */}
//       <div className="alert alert-info d-flex align-items-center gap-2 py-2 px-3 mb-3" style={{ fontSize: 13 }}>
//         <i className="fas fa-robot" />
//         <span>
//           Payroll is <strong>auto-generated on the 1st of every month at 2:00 AM</strong> for the previous month.
//           You can also generate or approve manually.
//         </span>
//       </div>

//       {/* Stats */}
//       <StatsBar stats={stats} loading={statsLoading} />

//       {/* Filters */}
//       <div className="card mb-3 border-0 shadow-sm">
//         <div className="card-body py-3">
//           <div className="row g-2 align-items-end">

//             <div className="col-6 col-sm-3 col-md-2">
//               <label className="form-label small fw-semibold mb-1">{t('common.year')}</label>
//               <input type="number" className="form-control form-control-sm"
//                 value={filters.year} onChange={e => setF('year', +e.target.value)} />
//             </div>

//             <div className="col-6 col-sm-3 col-md-2">
//               <label className="form-label small fw-semibold mb-1">{t('common.month')}</label>
//               <select className="form-select form-select-sm"
//                 value={filters.month} onChange={e => setF('month', +e.target.value)}>
//                 {[...Array(12)].map((_, i) => (
//                   <option key={i+1} value={i+1}>
//                     {new Date(2000, i).toLocaleString('en', { month: 'long' })}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-6 col-sm-3 col-md-2">
//               <label className="form-label small fw-semibold mb-1">{t('common.status')}</label>
//               <select className="form-select form-select-sm"
//                 value={filters.status} onChange={e => setF('status', e.target.value)}>
//                 <option value="">{t('common.all')}</option>
//                 <option value="draft">Draft</option>
//                 <option value="approved">Approved</option>
//               </select>
//             </div>

//             {/* Branch — Global only */}
//             {isGlobal && (
//               <div className="col-6 col-sm-3 col-md-2">
//                 <label className="form-label small fw-semibold mb-1">Branch</label>
//                 <select className="form-select form-select-sm"
//                   value={filters.branchId} onChange={e => setF('branchId', e.target.value)}>
//                   <option value="">All Branches</option>
//                   {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
//                 </select>
//               </div>
//             )}

//             {/* Department */}
//             <div className="col-6 col-sm-3 col-md-2">
//               <label className="form-label small fw-semibold mb-1">Department</label>
//               <select className="form-select form-select-sm"
//                 value={filters.departmentId} onChange={e => setF('departmentId', e.target.value)}>
//                 <option value="">All Departments</option>
//                 {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
//               </select>
//             </div>

//             {/* User search */}
//             <div className="col-12 col-md-3">
//               <label className="form-label small fw-semibold mb-1">Employee</label>
//               <div className="position-relative">
//                 <input type="text" className="form-control form-control-sm"
//                   placeholder="Search by name..."
//                   value={userSearch}
//                   onChange={e => { setUserSearch(e.target.value); if (!e.target.value) setF('userId', ''); }} />
//                 {userSearching && (
//                   <span className="position-absolute top-50 end-0 translate-middle-y me-2">
//                     <span className="spinner-border spinner-border-sm text-secondary" style={{ width: 14, height: 14 }} />
//                   </span>
//                 )}
//                 {userOptions.length > 0 && userSearch && !filters.userId && (
//                   <ul className="list-group position-absolute w-100 mt-1 shadow-sm z-3 border" style={{ maxHeight: 200, overflowY: 'auto' }}>
//                     {userOptions.map(u => (
//                       <li key={u._id}
//                         className="list-group-item list-group-item-action py-2 px-3"
//                         style={{ cursor: 'pointer', fontSize: 12 }}
//                         onMouseDown={() => { setF('userId', u._id); setUserSearch(u.name); setUserOptions([]); }}>
//                         <div className="fw-semibold">{u.name}</div>
//                         <div className="text-muted" style={{ fontSize: 11 }}>{u.email}</div>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//                 {filters.userId && (
//                   <button className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-1 p-0 text-muted"
//                     style={{ fontSize: 11 }}
//                     onClick={() => { setF('userId', ''); setUserSearch(''); setUserOptions([]); }}>
//                     <i className="fas fa-times" />
//                   </button>
//                 )}
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       {loading ? (
//         <div className="text-center py-5"><span className="spinner-border text-primary" /></div>
//       ) : (
//         <>
//           <div className="table-responsive">
//             <table className="table table-bordered table-hover align-middle">
//               <thead className="table-light">
//                 <tr>
//                   <th>{t('common.name')}</th>
//                   <th>{t('payroll.period')}</th>
//                   <th className="text-end">{t('payroll.baseSalary')}</th>
//                   <th className="text-end text-danger">{t('payroll.totalDeductions')}</th>
//                   <th className="text-end text-success">{t('payroll.overtime')}</th>
//                   <th className="text-end text-info">{t('payroll.bonus')}</th>
//                   <th className="text-end fw-bold">{t('payroll.netSalary')}</th>
//                   <th className="text-center">{t('common.status')}</th>
//                   <th className="text-center">{t('common.actions')}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {runs.length === 0 ? (
//                   <tr>
//                     <td colSpan="9" className="text-center text-muted py-5">
//                       <i className="fas fa-inbox fa-2x mb-2 d-block opacity-25" />
//                       {t('payroll.noRuns')}
//                     </td>
//                   </tr>
//                 ) : runs.map(run => (
//                   <tr key={run._id}>
//                     <td>
//                       <div className="fw-semibold">{run.user?.name}</div>
//                       <div className="text-muted small">{run.user?.email}</div>
//                     </td>
//                     <td>
//                       {String(run.period.month).padStart(2,'0')}/{run.period.year}
//                       {(run.policyTimeline?.length || 0) > 1 && (
//                         <span className="badge bg-warning ms-1" style={{ fontSize: 10 }}>Multi-Policy</span>
//                       )}
//                     </td>
//                     <td className="text-end">{run.baseSalary?.toFixed(2)}</td>
//                     <td className="text-end text-danger">
//                       {(run.deductions?.total || 0) > 0 ? `- ${run.deductions.total.toFixed(2)}` : '—'}
//                     </td>
//                     <td className="text-end text-success">
//                       {(run.overtime?.total || 0) > 0 ? <strong>+ {run.overtime.total.toFixed(2)}</strong> : <span className="text-muted">—</span>}
//                     </td>
//                     <td className="text-end text-info">
//                       {(run.bonus?.total || 0) > 0 ? <strong>+ {run.bonus.total.toFixed(2)}</strong> : <span className="text-muted">—</span>}
//                     </td>
//                     <td className="text-end fw-bold text-success">{run.netSalary?.toFixed(2)}</td>
//                     <td className="text-center">
//                       <span className={`badge ${run.status === 'approved' ? 'bg-success' : 'bg-warning text-dark'}`}>
//                         {run.status === 'approved' ? '✓ Approved' : '⏳ Draft'}
//                       </span>
//                     </td>
//                     <td className="text-center">
//                       <button className="btn btn-sm btn-outline-primary"
//                         onClick={() => navigate(`/payroll/${run._id}`)}>
//                         <i className="fas fa-eye" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//               {runs.length > 0 && (
//                 <tfoot className="table-light fw-bold">
//                   <tr>
//                     <td colSpan="2" className="text-muted fw-normal small">
//                       Page totals ({pagination.total} total)
//                     </td>
//                     <td className="text-end">{totals.base.toFixed(2)}</td>
//                     <td className="text-end text-danger">- {totals.deductions.toFixed(2)}</td>
//                     <td className="text-end text-success">+ {totals.overtime.toFixed(2)}</td>
//                     <td className="text-end text-info">+ {totals.bonus.toFixed(2)}</td>
//                     <td className="text-end text-success">{totals.net.toFixed(2)}</td>
//                     <td colSpan="2">
//                       {runs.some(r => (r.user?.branches?.length || 0) > 1) && (
//                         <span className="badge bg-warning text-dark" style={{fontSize:10}}
//                           title="Some employees work in multiple branches — their salary may appear in both branch filters">
//                           ⚠ Multi-branch
//                         </span>
//                       )}
//                     </td>
//                   </tr>
//                 </tfoot>
//               )}
//             </table>
//           </div>

//           {/* Pagination */}
//           {pagination.pages > 1 && (
//             <div className="d-flex justify-content-between align-items-center mt-3">
//               <div className="text-muted small">Page {page} of {pagination.pages} — {pagination.total} records</div>
//               <nav>
//                 <ul className="pagination pagination-sm mb-0">
//                   <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
//                     <button className="page-link" onClick={() => { const p = page - 1; setPage(p); loadRuns(p, filters); }}>‹</button>
//                   </li>
//                   {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => i + 1).map(p => (
//                     <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
//                       <button className="page-link" onClick={() => { setPage(p); loadRuns(p, filters); }}>{p}</button>
//                     </li>
//                   ))}
//                   <li className={`page-item ${page >= pagination.pages ? 'disabled' : ''}`}>
//                     <button className="page-link" onClick={() => { const p = page + 1; setPage(p); loadRuns(p, filters); }}>›</button>
//                   </li>
//                 </ul>
//               </nav>
//             </div>
//           )}
//         </>
//       )}

//       {bulkResult && <BulkResultModal result={bulkResult} onClose={() => setBulkResult(null)} />}

//       {toast && (
//         <Toast show={true} type={toast.type} message={toast.message} onClose={() => setToast(null)} />
//       )}
//     </div>
//   );
// };

// export default PayrollRunsListPage;