

// // src/pages/Reports/components/ReportFilters.jsx
// import { useState, useEffect, useRef } from 'react';
// import { useTranslation } from 'react-i18next';
// import { searchUsers }    from '../../services/user.api';

// import '../../style/Reports.css';
// /* ── static ─────────────────────────────────────────────── */
// const CURRENT_YEAR = new Date().getFullYear();
// const YEARS  = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);
// const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

// /** Extract array safely from any API response shape */
// function extractArray(res) {
//   if (!res) return [];
//   const d = res.data ?? res;
//   if (Array.isArray(d))        return d;
//   if (Array.isArray(d.users))  return d.users;
//   if (Array.isArray(d.data))   return d.data;
//   return [];
// }

// /* ═══════════════════════════════════════════════════════════
//    ReportFilters
//    props:
//      activeTab        — 'companyMonth' | 'companyYear' | 'employee'
//      branches         — [{ _id, name }]
//      departments      — [{ _id, name }]
//      adminScope       — { type:'GLOBAL'|'BRANCH', branches:[...ids] }
//      onGenerate       — (params) => void
//      onDownload       — (format) => void
//      hasReport        — bool
//      loading          — bool
//      downloadLoading  — bool
// ═══════════════════════════════════════════════════════════ */
// export default function ReportFilters({
//   activeTab,
//   branches     = [],
//   departments  = [],
//   adminScope,
//   onGenerate,
//   onDownload,
//   hasReport,
//   loading,
//   downloadLoading,
// }) {
//   const { t, i18n } = useTranslation('companyReport');
//   const isRTL = i18n.language === 'ar';

//   /* ── form state ──────────────────────────────────────── */
//   const [year,         setYear]         = useState(CURRENT_YEAR);
//   const [month,        setMonth]        = useState(new Date().getMonth() + 1);
//   const [branchId,     setBranchId]     = useState('');
//   const [deptId,       setDeptId]       = useState('');
//   const [approvedOnly, setApprovedOnly] = useState(true);

//   /* ── employee search state ───────────────────────────── */
//   const [empSearch,   setEmpSearch]   = useState('');
//   const [empResults,  setEmpResults]  = useState([]);
//   const [empSelected, setEmpSelected] = useState(null); // { id, name }
//   const [empOpen,     setEmpOpen]     = useState(false);
//   const [empLoading,  setEmpLoading]  = useState(false);
//   const empRef = useRef(null);

//   /* ── scope: always arrays ────────────────────────────── */
//   const safeBranches    = Array.isArray(branches)    ? branches    : [];
//   const safeDepartments = Array.isArray(departments) ? departments : [];

//   /* ── branch scope enforcement ────────────────────────── */
//   const isBranchLocked  = adminScope?.type === 'BRANCH';
//   const scopeBranchIds  = (adminScope?.branches || []).map(String);

//   // Branches visible to this admin
//   const allowedBranches = isBranchLocked
//     ? safeBranches.filter(b => scopeBranchIds.includes(String(b._id)))
//     : safeBranches;

//   // Auto-select if only one branch
//   useEffect(() => {
//     if (isBranchLocked && allowedBranches.length === 1 && !branchId) {
//       setBranchId(String(allowedBranches[0]._id));
//     }
//   }, [isBranchLocked, allowedBranches.length]); // eslint-disable-line

//   /* ── Employee search — debounced ─────────────────────── */
//   useEffect(() => {
//     if (activeTab !== 'employee') return;
//     if (empSearch.length < 2) { setEmpResults([]); return; }

//     const timer = setTimeout(async () => {
//       setEmpLoading(true);
//       try {
//         // ✅ pass branchId so backend enforces scope
//         const res = await searchUsers(empSearch, branchId || '');
//         // ✅ robust extraction — handles any response shape
//         setEmpResults(extractArray(res));
//       } catch {
//         setEmpResults([]);
//       } finally {
//         setEmpLoading(false);
//       }
//     }, 350);
//     return () => clearTimeout(timer);
//   }, [empSearch, branchId, activeTab]);

//   /* ── close dropdown on outside click ────────────────── */
//   useEffect(() => {
//     const h = e => {
//       if (empRef.current && !empRef.current.contains(e.target)) setEmpOpen(false);
//     };
//     document.addEventListener('mousedown', h);
//     return () => document.removeEventListener('mousedown', h);
//   }, []);

//   /* ── Generate ────────────────────────────────────────── */
//   const handleGenerate = () => {
//     if (activeTab === 'employee' && !empSelected) {
//       alert(t('errors.noEmployee')); return;
//     }
//     onGenerate({
//       year,
//       month:                activeTab === 'companyYear' ? undefined : month,
//       branchId:             branchId  || undefined,
//       departmentId:         deptId    || undefined,
//       userId:               empSelected?.id,
//       payrollApprovedOnly:  approvedOnly,
//       requireApprovedPayroll: approvedOnly,
//       page:  1,
//       limit: 50,
//     });
//   };

//   /* ── helpers ─────────────────────────────────────────── */
//   const clearEmployee = () => { setEmpSelected(null); setEmpSearch(''); setEmpResults([]); };

//   return (
//     <div className="report-filters-card" dir={isRTL ? 'rtl' : 'ltr'}>
//       <div className="filter-row">

//         {/* Year */}
//         <div className="filter-group">
//           <label>{t('filters.year')}</label>
//           <select value={year} onChange={e => setYear(Number(e.target.value))}>
//             {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
//           </select>
//         </div>

//         {/* Month */}
//         {activeTab !== 'companyYear' && (
//           <div className="filter-group">
//             <label>{t('filters.month')}</label>
//             <select value={month} onChange={e => setMonth(Number(e.target.value))}>
//               {MONTHS.map(m => (
//                 <option key={m} value={m}>{t(`months.${m}`)}</option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Branch — locked for BRANCH admin */}
//         <div className="filter-group">
//           <label>
//             {t('filters.branch')}
//             {isBranchLocked && (
//               <span style={{ marginInlineStart: 4, color:'#fd7e14', fontSize:'0.7rem' }}>
//                 <i className="fa-solid fa-lock" />
//               </span>
//             )}
//           </label>
//           <select
//             value={branchId}
//             onChange={e => { setBranchId(e.target.value); setDeptId(''); clearEmployee(); }}
//             disabled={isBranchLocked && allowedBranches.length === 1}
//           >
//             {!isBranchLocked && <option value="">{t('filters.allBranches')}</option>}
//             {allowedBranches.length === 0 && (
//               <option value="" disabled>No branches available</option>
//             )}
//             {allowedBranches.map(b => (
//               <option key={b._id} value={b._id}>{b.name}</option>
//             ))}
//           </select>
//         </div>

//         {/* Department */}
//         <div className="filter-group">
//           <label>{t('filters.department')}</label>
//           <select value={deptId} onChange={e => setDeptId(e.target.value)}>
//             <option value="">{t('filters.allDepts')}</option>
//             {safeDepartments.map(d => (
//               <option key={d._id} value={d._id}>{d.name}</option>
//             ))}
//           </select>
//         </div>

//         {/* Employee search — only for employee tab */}
//         {activeTab === 'employee' && (
//           <div
//             className="filter-group employee-search-wrap"
//             ref={empRef}
//             style={{ minWidth: 230, position: 'relative' }}
//           >
//             <label>{t('filters.employee')}</label>
//             <div style={{ position:'relative' }}>
//               <input
//                 value={empSelected ? empSelected.name : empSearch}
//                 onChange={e => {
//                   if (empSelected) clearEmployee();
//                   setEmpSearch(e.target.value);
//                   setEmpOpen(true);
//                 }}
//                 onFocus={() => { if (!empSelected) setEmpOpen(true); }}
//                 placeholder={t('filters.searchEmployee')}
//                 style={{ width:'100%', paddingRight: 28 }}
//                 autoComplete="off"
//               />
//               {/* Clear button */}
//               {(empSelected || empSearch) && (
//                 <button
//                   onClick={clearEmployee}
//                   style={{
//                     position:'absolute', right:6, top:'50%',
//                     transform:'translateY(-50%)',
//                     background:'none', border:'none',
//                     color:'#aaa', cursor:'pointer', padding:0, lineHeight:1,
//                   }}
//                 >
//                   <i className="fa-solid fa-xmark" />
//                 </button>
//               )}
//             </div>

//             {/* Dropdown */}
//             {empOpen && !empSelected && (
//               <div className="employee-dropdown">
//                 {empLoading && (
//                   <div className="employee-option" style={{ color:'#aaa' }}>
//                     <i className="fa-solid fa-spinner fa-spin me-2" />
//                     Loading...
//                   </div>
//                 )}
//                 {!empLoading && empSearch.length < 2 && (
//                   <div className="employee-option" style={{ color:'#aaa', fontSize:'0.8rem' }}>
//                     {t('filters.searchEmployee')}
//                   </div>
//                 )}
//                 {!empLoading && empSearch.length >= 2 && empResults.length === 0 && (
//                   <div className="employee-option" style={{ color:'#aaa' }}>
//                     {t('empty.noEmployees')}
//                   </div>
//                 )}
//                 {empResults.map(u => (
//                   <div
//                     key={u._id}
//                     className="employee-option"
//                     onMouseDown={() => {
//                       setEmpSelected({ id: u._id, name: u.name });
//                       setEmpSearch('');
//                       setEmpOpen(false);
//                     }}
//                   >
//                     <div style={{ fontWeight:500 }}>{u.name}</div>
//                     <small style={{ color:'#aaa' }}>
//                       {u.email || ''}
//                       {u.currentEmploymentStatus && u.currentEmploymentStatus !== 'active'
//                         ? ` · ${u.currentEmploymentStatus}` : ''}
//                     </small>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Approved-only toggle + action buttons */}
//         <div className="filter-actions">
//           <button
//             className={`approved-toggle ${approvedOnly ? 'active' : ''}`}
//             onClick={() => setApprovedOnly(p => !p)}
//             title={t('filters.approvedOnly')}
//           >
//             <i className={`fa-solid ${approvedOnly ? 'fa-square-check' : 'fa-square'}`} />
//             <span className="d-none d-md-inline">{t('filters.approvedOnly')}</span>
//           </button>

//           <button className="btn-generate" onClick={handleGenerate} disabled={loading}>
//             {loading
//               ? <><i className="fa-solid fa-spinner fa-spin" /> {t('filters.generating')}</>
//               : <><i className="fa-solid fa-chart-bar" /> {t('filters.generate')}</>
//             }
//           </button>

//           {hasReport && (
//             <>
//               {/* <button
//                 className="btn-download pdf"
//                 disabled={downloadLoading}
//                 onClick={() => onDownload('pdf')}
//                 title="Download PDF"
//               >
//                 <i className="fa-solid fa-file-pdf" />
//                 <span className="d-none d-sm-inline">{t('filters.downloadPdf')}</span>
//               </button> */}
//               <button
//                 className="btn-download excel"
//                 disabled={downloadLoading}
//                 onClick={() => onDownload('excel')}
//                 title="Download Excel"
//               >
//                 <i className="fa-solid fa-file-excel" />
//                 <span className="d-none d-sm-inline">{t('filters.downloadExcel')}</span>
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Scope warning for BRANCH admin */}
//       {isBranchLocked && (
//         <div style={{
//           marginTop: '0.6rem',
//           fontSize: '0.78rem',
//           color: '#856404',
//           background: '#fff3cd',
//           border: '1px solid #ffc107',
//           borderRadius: 6,
//           padding: '0.3rem 0.75rem',
//           display: 'flex',
//           alignItems: 'center',
//           gap: '0.4rem',
//         }}>
//           <i className="fa-solid fa-circle-info" />
//           Reports are limited to your assigned branches only.
//           {allowedBranches.length === 0 && (
//             <strong style={{ color:'#dc3545' }}> No branches assigned to your account.</strong>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }




//--------------------css 


// src/pages/Reports/components/ReportFilters.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { searchUsers }    from '../../services/user.api';

import '../../style/Reports.css';
/* ── static ─────────────────────────────────────────────── */
const CURRENT_YEAR = new Date().getFullYear();
const YEARS  = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

/** Extract array safely from any API response shape */
function extractArray(res) {
  if (!res) return [];
  const d = res.data ?? res;
  if (Array.isArray(d))        return d;
  if (Array.isArray(d.users))  return d.users;
  if (Array.isArray(d.data))   return d.data;
  return [];
}

/* ═══════════════════════════════════════════════════════════
   ReportFilters
   props:
     activeTab        — 'companyMonth' | 'companyYear' | 'employee'
     branches         — [{ _id, name }]
     departments      — [{ _id, name }]
     adminScope       — { type:'GLOBAL'|'BRANCH', branches:[...ids] }
     onGenerate       — (params) => void
     onDownload       — (format) => void
     hasReport        — bool
     loading          — bool
     downloadLoading  — bool
═══════════════════════════════════════════════════════════ */
export default function ReportFilters({
  activeTab,
  branches     = [],
  departments  = [],
  adminScope,
  onGenerate,
  onDownload,
  hasReport,
  loading,
  downloadLoading,
}) {
  const { t, i18n } = useTranslation('companyReport');
  const isRTL = i18n.language === 'ar';

  /* ── form state ──────────────────────────────────────── */
  const [year,         setYear]         = useState(CURRENT_YEAR);
  const [month,        setMonth]        = useState(new Date().getMonth() + 1);
  const [branchId,     setBranchId]     = useState('');
  const [deptId,       setDeptId]       = useState('');
  const [approvedOnly, setApprovedOnly] = useState(true);

  /* ── employee search state ───────────────────────────── */
  const [empSearch,   setEmpSearch]   = useState('');
  const [empResults,  setEmpResults]  = useState([]);
  const [empSelected, setEmpSelected] = useState(null); // { id, name }
  const [empOpen,     setEmpOpen]     = useState(false);
  const [empLoading,  setEmpLoading]  = useState(false);
  const empRef = useRef(null);

  /* ── scope: always arrays ────────────────────────────── */
  const safeBranches    = Array.isArray(branches)    ? branches    : [];
  const safeDepartments = Array.isArray(departments) ? departments : [];

  /* ── branch scope enforcement ────────────────────────── */
  const isBranchLocked  = adminScope?.type === 'BRANCH';
  const scopeBranchIds  = (adminScope?.branches || []).map(String);

  // Branches visible to this admin
  const allowedBranches = isBranchLocked
    ? safeBranches.filter(b => scopeBranchIds.includes(String(b._id)))
    : safeBranches;

  // Auto-select if only one branch
  useEffect(() => {
    if (isBranchLocked && allowedBranches.length === 1 && !branchId) {
      setBranchId(String(allowedBranches[0]._id));
    }
  }, [isBranchLocked, allowedBranches.length]); // eslint-disable-line

  /* ── Employee search — debounced ─────────────────────── */
  useEffect(() => {
    if (activeTab !== 'employee') return;
    if (empSearch.length < 2) { setEmpResults([]); return; }

    const timer = setTimeout(async () => {
      setEmpLoading(true);
      try {
        // ✅ pass branchId so backend enforces scope
        const res = await searchUsers(empSearch, branchId || '');
        // ✅ robust extraction — handles any response shape
        setEmpResults(extractArray(res));
      } catch {
        setEmpResults([]);
      } finally {
        setEmpLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [empSearch, branchId, activeTab]);

  /* ── close dropdown on outside click ────────────────── */
  useEffect(() => {
    const h = e => {
      if (empRef.current && !empRef.current.contains(e.target)) setEmpOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  /* ── Generate ────────────────────────────────────────── */
  const handleGenerate = () => {
    if (activeTab === 'employee' && !empSelected) {
      alert(t('errors.noEmployee')); return;
    }
    onGenerate({
      year,
      month:                activeTab === 'companyYear' ? undefined : month,
      branchId:             branchId  || undefined,
      departmentId:         deptId    || undefined,
      userId:               empSelected?.id,
      payrollApprovedOnly:  approvedOnly,
      requireApprovedPayroll: approvedOnly,
      page:  1,
      limit: 50,
    });
  };

  /* ── helpers ─────────────────────────────────────────── */
  const clearEmployee = () => { setEmpSelected(null); setEmpSearch(''); setEmpResults([]); };

  return (
    <div className="report-filters-card" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="filter-row">

        {/* Year */}
        <div className="filter-group">
          <label>{t('filters.year')}</label>
          <select value={year} onChange={e => setYear(Number(e.target.value))}>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Month */}
        {activeTab !== 'companyYear' && (
          <div className="filter-group">
            <label>{t('filters.month')}</label>
            <select value={month} onChange={e => setMonth(Number(e.target.value))}>
              {MONTHS.map(m => (
                <option key={m} value={m}>{t(`months.${m}`)}</option>
              ))}
            </select>
          </div>
        )}

        {/* Branch — locked for BRANCH admin */}
        <div className="filter-group">
          <label>
            {t('filters.branch')}
            {isBranchLocked && (
              <span className="rf-branch-lock-icon">
                <i className="fa-solid fa-lock" />
              </span>
            )}
          </label>
          <select
            value={branchId}
            onChange={e => { setBranchId(e.target.value); setDeptId(''); clearEmployee(); }}
            disabled={isBranchLocked && allowedBranches.length === 1}
          >
            {!isBranchLocked && <option value="">{t('filters.allBranches')}</option>}
            {allowedBranches.length === 0 && (
              <option value="" disabled>No branches available</option>
            )}
            {allowedBranches.map(b => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Department */}
        <div className="filter-group">
          <label>{t('filters.department')}</label>
          <select value={deptId} onChange={e => setDeptId(e.target.value)}>
            <option value="">{t('filters.allDepts')}</option>
            {safeDepartments.map(d => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Employee search — only for employee tab */}
        {activeTab === 'employee' && (
          <div
            className="filter-group employee-search-wrap"
            ref={empRef}
          >
            <label>{t('filters.employee')}</label>
            <div className="rf-emp-input-wrap">
              <input
                value={empSelected ? empSelected.name : empSearch}
                onChange={e => {
                  if (empSelected) clearEmployee();
                  setEmpSearch(e.target.value);
                  setEmpOpen(true);
                }}
                onFocus={() => { if (!empSelected) setEmpOpen(true); }}
                placeholder={t('filters.searchEmployee')}
                className="rf-emp-input"
                autoComplete="off"
              />
              {/* Clear button */}
              {(empSelected || empSearch) && (
                <button
                  onClick={clearEmployee}
                  className="rf-emp-clear-btn"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              )}
            </div>

            {/* Dropdown */}
            {empOpen && !empSelected && (
              <div className="employee-dropdown">
                {empLoading && (
                  <div className="employee-option rf-emp-option-muted">
                    <i className="fa-solid fa-spinner fa-spin me-2" />
                    Loading...
                  </div>
                )}
                {!empLoading && empSearch.length < 2 && (
                  <div className="employee-option rf-emp-option-hint">
                    {t('filters.searchEmployee')}
                  </div>
                )}
                {!empLoading && empSearch.length >= 2 && empResults.length === 0 && (
                  <div className="employee-option rf-emp-option-muted">
                    {t('empty.noEmployees')}
                  </div>
                )}
                {empResults.map(u => (
                  <div
                    key={u._id}
                    className="employee-option"
                    onMouseDown={() => {
                      setEmpSelected({ id: u._id, name: u.name });
                      setEmpSearch('');
                      setEmpOpen(false);
                    }}
                  >
                    <div className="rf-emp-name">{u.name}</div>
                    <small className="rf-emp-meta">
                      {u.email || ''}
                      {u.currentEmploymentStatus && u.currentEmploymentStatus !== 'active'
                        ? ` · ${u.currentEmploymentStatus}` : ''}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Approved-only toggle + action buttons */}
        <div className="filter-actions">
          <button
            className={`approved-toggle ${approvedOnly ? 'active' : ''}`}
            onClick={() => setApprovedOnly(p => !p)}
            title={t('filters.approvedOnly')}
          >
            <i className={`fa-solid ${approvedOnly ? 'fa-square-check' : 'fa-square'}`} />
            <span className="d-none d-md-inline">{t('filters.approvedOnly')}</span>
          </button>

          <button className="btn-generate" onClick={handleGenerate} disabled={loading}>
            {loading
              ? <><i className="fa-solid fa-spinner fa-spin" /> {t('filters.generating')}</>
              : <><i className="fa-solid fa-chart-bar" /> {t('filters.generate')}</>
            }
          </button>

          {hasReport && (
            <>
              {/* <button
                className="btn-download pdf"
                disabled={downloadLoading}
                onClick={() => onDownload('pdf')}
                title="Download PDF"
              >
                <i className="fa-solid fa-file-pdf" />
                <span className="d-none d-sm-inline">{t('filters.downloadPdf')}</span>
              </button> */}
              <button
                className="btn-download excel"
                disabled={downloadLoading}
                onClick={() => onDownload('excel')}
                title="Download Excel"
              >
                <i className="fa-solid fa-file-excel" />
                <span className="d-none d-sm-inline">{t('filters.downloadExcel')}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Scope warning for BRANCH admin */}
      {isBranchLocked && (
        <div className="rf-scope-warning">
          <i className="fa-solid fa-circle-info" />
          Reports are limited to your assigned branches only.
          {allowedBranches.length === 0 && (
            <strong className="rf-scope-warning-error"> No branches assigned to your account.</strong>
          )}
        </div>
      )}
    </div>
  );
}