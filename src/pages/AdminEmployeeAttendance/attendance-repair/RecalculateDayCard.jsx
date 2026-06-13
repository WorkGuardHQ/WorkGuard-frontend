// // RecalculateDayCard.jsx

// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// // import toast from 'react-hot-toast';

// import {
//   adminRecalculateDay,
//   adminBulkRecalculateDay
// } from '../../../services/admin.api';
// import '../../../style/AttendanceRepair.css';
// const RecalculateDayCard = ({
//   users = [],
//   branches = [],
//   departments = [],
//   tenantTimezone = 'UTC',
//   onSuccess
// }) => {

//   const { t, i18n } = useTranslation('attendanceRepair');

//   const isRTL = i18n.language === 'ar';

//   const [mode, setMode] = useState('single');

//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     userId: '',
//     branchId: '',
//     departmentId: '',
//     date: ''
//   });

//   const handleChange = (key, value) => {
//     setForm(prev => ({
//       ...prev,
//       [key]: value
//     }));
//   };

//   const handleSubmit = async () => {

//     if (!form.date) {
//       toast.error(t('validation.dateRequired'));
//       return;
//     }

//     if (mode === 'single' && !form.userId) {
//       toast.error(t('validation.userRequired'));
//       return;
//     }

//     if (
//       mode === 'bulk' &&
//       !form.branchId &&
//       !form.departmentId
//     ) {
//       toast.error(
//         t('validation.branchOrDepartmentRequired')
//       );
//       return;
//     }

//     const confirmed = window.confirm(
//       t('confirmations.recalculate')
//     );

//     if (!confirmed) return;

//     setLoading(true);

//     try {

//       if (mode === 'single') {

//         await adminRecalculateDay({
//           userId: form.userId,
//           date: form.date
//         });

//       } else {

//         await adminBulkRecalculateDay({
//           date: form.date,
//           branchId: form.branchId || undefined,
//           departmentId:
//             form.departmentId || undefined
//         });
//       }

//       toast.success(
//         t('messages.recalculateSuccess')
//       );

//       onSuccess?.();

//     } catch (err) {

//       console.error(err);

//       toast.error(
//         err?.response?.data?.message ||
//         t('messages.recalculateFailed')
//       );

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="repair-card">

//       {/* Header */}
//       <div className="repair-card-header">

//         <div>
//           <h5 className="repair-card-title">
//             <i className="fas fa-sync-alt" />
//             {t('recalculate.title')}
//           </h5>

//           <p className="repair-card-subtitle">
//             {t('recalculate.subtitle')}
//           </p>
//         </div>

//         <span className="repair-timezone-badge">
//           <i className="fas fa-globe" />
//           {tenantTimezone}
//         </span>

//       </div>

//       {/* Warning */}
//       <div className="repair-warning">

//         <i className="fas fa-exclamation-triangle" />

//         <span>
//           {t('recalculate.warning')}
//         </span>

//       </div>

//       {/* Mode Toggle */}
//       <div className="repair-mode-switch">

//         <button
//           type="button"
//           className={`repair-mode-btn ${
//             mode === 'single'
//               ? 'active'
//               : ''
//           }`}
//           onClick={() => setMode('single')}
//         >
//           <i className="fas fa-user" />
//           {t('recalculate.single')}
//         </button>

//         <button
//           type="button"
//           className={`repair-mode-btn ${
//             mode === 'bulk'
//               ? 'active'
//               : ''
//           }`}
//           onClick={() => setMode('bulk')}
//         >
//           <i className="fas fa-users" />
//           {t('recalculate.bulk')}
//         </button>

//       </div>

//       {/* Form */}
//       <div className="row g-3">

//         {/* Single User */}
//         {mode === 'single' && (
//           <div className="col-12">

//             <label className="form-label">
//               {t('fields.employee')}
//             </label>

//             <select
//               className="form-select"
//               value={form.userId}
//               onChange={(e) =>
//                 handleChange('userId', e.target.value)
//               }
//             >
//               <option value="">
//                 {t('fields.selectEmployee')}
//               </option>

//               {users.map(user => (
//                 <option
//                   key={user._id}
//                   value={user._id}
//                 >
//                   {user.name}
//                 </option>
//               ))}

//             </select>

//           </div>
//         )}

//         {/* Bulk */}
//         {mode === 'bulk' && (
//           <>
//             <div className="col-md-6">

//               <label className="form-label">
//                 {t('fields.branch')}
//               </label>

//               <select
//                 className="form-select"
//                 value={form.branchId}
//                 onChange={(e) =>
//                   handleChange('branchId', e.target.value)
//                 }
//               >
//                 <option value="">
//                   {t('fields.allBranches')}
//                 </option>

//                 {branches.map(branch => (
//                   <option
//                     key={branch._id}
//                     value={branch._id}
//                   >
//                     {branch.name}
//                   </option>
//                 ))}

//               </select>

//             </div>

//             <div className="col-md-6">

//               <label className="form-label">
//                 {t('fields.department')}
//               </label>

//               <select
//                 className="form-select"
//                 value={form.departmentId}
//                 onChange={(e) =>
//                   handleChange(
//                     'departmentId',
//                     e.target.value
//                   )
//                 }
//               >
//                 <option value="">
//                   {t('fields.allDepartments')}
//                 </option>

//                 {departments.map(dept => (
//                   <option
//                     key={dept._id}
//                     value={dept._id}
//                   >
//                     {dept.name}
//                   </option>
//                 ))}

//               </select>

//             </div>
//           </>
//         )}

//         {/* Date */}
//         <div className="col-md-6">

//           <label className="form-label">
//             {t('fields.date')}
//           </label>

//           <input
//             type="date"
//             className="form-control"
//             value={form.date}
//             onChange={(e) =>
//               handleChange('date', e.target.value)
//             }
//           />

//         </div>

//       </div>

//       {/* Footer */}
//       <div className="repair-card-footer">

//         <button
//           type="button"
//           className="btn btn-outline-primary repair-submit-btn"
//           disabled={loading}
//           onClick={handleSubmit}
//         >
//           {loading ? (
//             <>
//               <span className="spinner-border spinner-border-sm me-2" />
//               {t('recalculate.processing')}
//             </>
//           ) : (
//             <>
//               <i className="fas fa-sync-alt me-2" />
//               {t('recalculate.submit')}
//             </>
//           )}
//         </button>

//       </div>

//     </div>
//   );
// };

// export default RecalculateDayCard;


import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { searchUsers }          from '../../../services/user.api';
import { getBranchLookup }      from '../../../services/branch.api';
import { getDepartments }       from '../../../services/department.api';
import { adminRecalculateDay, adminBulkRecalculateDay } from '../../../services/admin.api';
import Toast from '../../../components/ui/Toast';
import { getTodayString } from '../../../helpers/dateHelpers';

export default function RecalculateDayCard() {
  const { t, i18n } = useTranslation('attendanceRepair');
  const isRTL = i18n.language === 'ar';

  const [mode,       setMode]       = useState('single'); // 'single' | 'bulk'
  const [bulkBy,     setBulkBy]     = useState('branch'); // 'branch' | 'department'
 const [date, setDate] =
  useState(getTodayString());
  const [submitting, setSubmitting] = useState(false);
  const [results,    setResults]    = useState(null);

  // single
  const [userQuery,    setUserQuery]    = useState('');
  const [userOptions,  setUserOptions]  = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLoading,  setUserLoading]  = useState(false);

  // bulk
  const [branches,        setBranches]        = useState([]);
  const [departments,     setDepartments]     = useState([]);
  const [selectedBranch,  setSelectedBranch]  = useState('');
  const [selectedDept,    setSelectedDept]    = useState('');
  const [bulkDataLoaded,  setBulkDataLoaded]  = useState(false);

  // toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') =>
    setToast({ show: true, message, type });

  // ── User search ──
  const handleUserSearch = useCallback(async (q) => {
    setUserQuery(q);
    if (q.length < 2) { setUserOptions([]); return; }
    setUserLoading(true);
    try {
      const res = await searchUsers(q);
      setUserOptions(res.data?.data || res.data || []);
    } catch { setUserOptions([]); }
    finally  { setUserLoading(false); }
  }, []);

  // ── Load bulk data once ──
  const loadBulkData = useCallback(async () => {
    if (bulkDataLoaded) return;
    try {
      const [br, dp] = await Promise.all([
        getBranchLookup(),
        getDepartments({ limit: 100 }),
      ]);
       setBranches(Array.isArray(br.data)       ? br.data
          : Array.isArray(br.data?.data) ? br.data.data
          : []);
   setDepartments(
  Array.isArray(dp.data?.departments) ? dp.data.departments : []
);
      setBulkDataLoaded(true);
    } catch { /* silent */ }
  }, [bulkDataLoaded]);

  const handleModeChange = (m) => {
    setMode(m);
    setResults(null);
    if (m === 'bulk') loadBulkData();
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) return;
    if (mode === 'single' && !selectedUser) return;
    if (mode === 'bulk'   && !selectedBranch && !selectedDept) return;

    setSubmitting(true);
    setResults(null);
setSelectedUser(null);
setUserQuery('');

    try {
      if (mode === 'single') {
        await adminRecalculateDay({ userId: selectedUser._id, date });
        showToast(t('recalculate.success'), 'success');
      } else {
        const payload = { date };
        if (bulkBy === 'branch'     && selectedBranch) payload.branchId     = selectedBranch;
        if (bulkBy === 'department' && selectedDept)   payload.departmentId = selectedDept;
        const res = await adminBulkRecalculateDay(payload);
        setResults(res.data?.results);
        showToast(t('recalculate.successBulk'), 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.message || t('recalculate.failed', { defaultValue: 'Failed' });
      if (err.response?.status === 423)
        showToast(t('recalculate.payrollLocked'), 'error');
      else
        showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="repair-card" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="repair-card-header">
          <i className="fas fa-sync-alt" />
          <div>
            <h3>{t('recalculate.title')}</h3>
            <p>{t('recalculate.description')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="repair-form">

          {/* Mode toggle */}
          <div className="repair-mode-toggle">
            {['single', 'bulk'].map(m => (
              <button
                key={m}
                type="button"
                className={`repair-mode-btn ${mode === m ? 'active' : ''}`}
                onClick={() => handleModeChange(m)}
              >
                {t(`recalculate.${m}`)}
              </button>
            ))}
          </div>

          {/* Date */}
          <div className="repair-field">
            <label>{t('recalculate.date')}</label>
<div className="repair-timezone-note">

  <i className="fas fa-globe" />

  {t('recalculate.timezoneNote')}

</div>

            <input
              type="date"
              value={date}
              max={getTodayString()}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>

          {/* Single — user search */}
          {mode === 'single' && (
            <div className="repair-field">
              <label>{t('recalculate.selectEmployee')}</label>
              <div className="repair-search-wrap">
                <input
                  type="text"
                  value={userQuery}
                  placeholder={t('recalculate.selectEmployee')}
                  onChange={e => handleUserSearch(e.target.value)}
                  autoComplete="off"
                />
                {userLoading && <span className="repair-spinner" />}
                {userOptions.length > 0 && (
                  <ul className="repair-dropdown">
                    {userOptions.map(u => (
                      <li key={u._id} onClick={() => {
                        setSelectedUser(u);
                        setUserQuery(u.name);
                        setUserOptions([]);
                      }}>
                        {u.name}
                        {u.branches?.length > 1 &&
                          <span className="repair-badge-multi">{t('recalculate.multiBranch')}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {selectedUser && (
                <div className="repair-selected-user">
                  <i className="fas fa-user-check" /> {selectedUser.name}
                  <button type="button" onClick={() => { setSelectedUser(null); setUserQuery(''); }}>
                    <i className="fas fa-times" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bulk — branch or department */}
          {mode === 'bulk' && (
            <>
              <div className="repair-mode-toggle sub">
                {['branch', 'department'].map(b => (
                  <button
                    key={b}
                    type="button"
                    className={`repair-mode-btn ${bulkBy === b ? 'active' : ''}`}
                    onClick={() => { setBulkBy(b); setSelectedBranch(''); setSelectedDept(''); }}
                  >
                    {t(`recalculate.select${b.charAt(0).toUpperCase() + b.slice(1)}`)}
                  </button>
                ))}
              </div>

              {bulkBy === 'branch' && (
                
                <div className="repair-field">
                  <label>{t('recalculate.selectBranch')}</label>
                  <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} required>
                    <option value="">{t('recalculate.selectBranch')}</option>
                    {branches.map(b => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {bulkBy === 'department' && (
                <div className="repair-field">
                  <label>{t('recalculate.selectDepartment')}</label>
                  <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)} required>
                    <option value="">{t('recalculate.selectDepartment')}</option>
                    {departments.map(d => (
                      <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            className="repair-submit-btn"
            disabled={submitting ||
              (mode === 'single' && !selectedUser) ||
              (mode === 'bulk' && !selectedBranch && !selectedDept)}
          >
            {submitting
              ? <><span className="repair-spinner" /> {t('recalculate.submitting')}</>
              : <><i className="fas fa-sync-alt" /> {t('recalculate.submit')}</>}
          </button>
        </form>

        {/* Results */}
        {results && (
          <div className="repair-results">
            <h4>{t('recalculate.results')}</h4>
            <div className="repair-results-grid">
              <div className="repair-result-item total">
                <span>{t('recalculate.total')}</span>
                <strong>{results.total}</strong>
              </div>
              <div className="repair-result-item success">
                <span>{t('recalculate.succeeded')}</span>
                <strong>{results.success?.length ?? 0}</strong>
              </div>
              <div className="repair-result-item skipped">
                <span>{t('recalculate.skipped')}</span>
                <strong>{results.skipped?.length ?? 0}</strong>
              </div>
              <div className="repair-result-item failed">
                <span>{t('recalculate.failed')}</span>
                <strong>{results.failed?.length ?? 0}</strong>
              </div>
            </div>

            {results.skipped?.length > 0 && (
              <ul className="repair-skipped-list">
                {results.skipped.map((s, i) => (
                  <li key={i}>
                    <i className="fas fa-lock" />
                    {t(`recalculate.skippedReason_${s.reason}`, { defaultValue: s.reason })}
                    {s.period && ` — ${s.period.year}/${s.period.month}`}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(t => ({ ...t, show: false }))}
      />
    </>
  );
}