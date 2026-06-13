// // CloseOpenAttendancesCard.jsx

// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// // import toast from 'react-hot-toast';

// import {
//   adminCloseOpenAttendance,
//   adminBulkCloseOpenAttendances
// } from '../../../services/admin.api';
// import '../../../style/AttendanceRepair.css';
// const CloseOpenAttendancesCard = ({
//   users = [],
//   branches = [],
//   departments = [],
//   openAttendances = [],
//   tenantTimezone = 'UTC',
//   onSuccess
// }) => {

//   const { t } = useTranslation('attendanceRepair');

//   const [mode, setMode] = useState('single');

//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     attendanceId: '',
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

//     // ─────────────────────
//     // Validation
//     // ─────────────────────

//     if (mode === 'single') {

//       if (!form.attendanceId) {
//         toast.error(
//           t('validation.attendanceRequired')
//         );
//         return;
//       }

//     } else {

//       if (!form.date) {
//         toast.error(
//           t('validation.dateRequired')
//         );
//         return;
//       }

//       if (
//         !form.userId &&
//         !form.branchId &&
//         !form.departmentId
//       ) {
//         toast.error(
//           t(
//             'validation.userBranchDepartmentRequired'
//           )
//         );
//         return;
//       }
//     }

//     // ─────────────────────
//     // Confirm
//     // ─────────────────────

//     const confirmed = window.confirm(
//       t('confirmations.closeOpen')
//     );

//     if (!confirmed) return;

//     setLoading(true);

//     try {

//       // ─────────────────────
//       // Single
//       // ─────────────────────

//       if (mode === 'single') {

//         await adminCloseOpenAttendance({
//           attendanceId: form.attendanceId
//         });

//       } else {

//         // ─────────────────────
//         // Bulk
//         // ─────────────────────

//         await adminBulkCloseOpenAttendances({
//           date: form.date,
//           userId:
//             form.userId || undefined,
//           branchId:
//             form.branchId || undefined,
//           departmentId:
//             form.departmentId || undefined
//         });
//       }

//       toast.success(
//         t('messages.closeSuccess')
//       );

//       onSuccess?.();

//     } catch (err) {

//       console.error(err);

//       toast.error(
//         err?.response?.data?.message ||
//         t('messages.closeFailed')
//       );

//     } finally {

//       setLoading(false);

//     }
//   };

//   return (
//     <div className="repair-card repair-card-danger">

//       {/* Header */}
//       <div className="repair-card-header">

//         <div>

//           <h5 className="repair-card-title text-danger">

//             <i className="fas fa-ban" />

//             {t('closeOpen.title')}

//           </h5>

//           <p className="repair-card-subtitle">

//             {t('closeOpen.subtitle')}

//           </p>

//         </div>

//         <span className="repair-timezone-badge">

//           <i className="fas fa-globe" />

//           {tenantTimezone}

//         </span>

//       </div>

//       {/* Warning */}
//       <div className="repair-warning repair-warning-danger">

//         <i className="fas fa-exclamation-circle" />

//         <span>

//           {t('closeOpen.warning')}

//         </span>

//       </div>

//       {/* Mode Switch */}
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

//           {t('closeOpen.single')}

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

//           {t('closeOpen.bulk')}

//         </button>

//       </div>

//       {/* Form */}
//       <div className="row g-3">

//         {/* Single */}
//         {mode === 'single' && (
//           <div className="col-12">

//             <label className="form-label">

//               {t('fields.openAttendance')}

//             </label>

//             <select
//               className="form-select"
//               value={form.attendanceId}
//               onChange={(e) =>
//                 handleChange(
//                   'attendanceId',
//                   e.target.value
//                 )
//               }
//             >

//               <option value="">
//                 {t('fields.selectOpenAttendance')}
//               </option>

//               {openAttendances.map(record => (
//                 <option
//                   key={record._id}
//                   value={record._id}
//                 >

//                   {record.user?.name}
//                   {' — '}
//                   {record.checkInLocal}
//                   {' — '}
//                   {record.branch?.name || 'N/A'}

//                 </option>
//               ))}

//             </select>

//           </div>
//         )}

//         {/* Bulk */}
//         {mode === 'bulk' && (
//           <>
//             {/* User */}
//             <div className="col-md-4">

//               <label className="form-label">
//                 {t('fields.employee')}
//               </label>

//               <select
//                 className="form-select"
//                 value={form.userId}
//                 onChange={(e) =>
//                   handleChange(
//                     'userId',
//                     e.target.value
//                   )
//                 }
//               >

//                 <option value="">
//                   {t('fields.allEmployees')}
//                 </option>

//                 {users.map(user => (
//                   <option
//                     key={user._id}
//                     value={user._id}
//                   >
//                     {user.name}
//                   </option>
//                 ))}

//               </select>

//             </div>

//             {/* Branch */}
//             <div className="col-md-4">

//               <label className="form-label">
//                 {t('fields.branch')}
//               </label>

//               <select
//                 className="form-select"
//                 value={form.branchId}
//                 onChange={(e) =>
//                   handleChange(
//                     'branchId',
//                     e.target.value
//                   )
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

//             {/* Department */}
//             <div className="col-md-4">

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

//             {/* Date */}
//             <div className="col-md-6">

//               <label className="form-label">
//                 {t('fields.date')}
//               </label>

//               <input
//                 type="date"
//                 className="form-control"
//                 value={form.date}
//                 onChange={(e) =>
//                   handleChange(
//                     'date',
//                     e.target.value
//                   )
//                 }
//               />

//             </div>
//           </>
//         )}

//       </div>

//       {/* Footer */}
//       <div className="repair-card-footer">

//         <button
//           type="button"
//           className="btn btn-outline-danger repair-submit-btn"
//           disabled={loading}
//           onClick={handleSubmit}
//         >

//           {loading ? (
//             <>
//               <span className="spinner-border spinner-border-sm me-2" />

//               {t('closeOpen.processing')}
//             </>
//           ) : (
//             <>
//               <i className="fas fa-ban me-2" />

//               {t('closeOpen.submit')}
//             </>
//           )}

//         </button>

//       </div>

//     </div>
//   );
// };

// export default CloseOpenAttendancesCard;

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { searchUsers }          from '../../../services/user.api';
import { getBranchLookup }      from '../../../services/branch.api';
import { getDepartments }       from '../../../services/department.api';
import { adminBulkCloseOpenAttendances } from '../../../services/admin.api';
import Toast from '../../../components/ui/Toast';
import { getTodayString } from '../../../helpers/dateHelpers';

export default function CloseOpenAttendancesCard() {
  const { t, i18n } = useTranslation('attendanceRepair');
  const isRTL = i18n.language === 'ar';

  const [mode,       setMode]       = useState('single');
  const [bulkBy,     setBulkBy]     = useState('branch');
 const [date, setDate] =
  useState(getTodayString());
  const [submitting, setSubmitting] = useState(false);
  const [results,    setResults]    = useState(null);

  const [userQuery,    setUserQuery]    = useState('');
  const [userOptions,  setUserOptions]  = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLoading,  setUserLoading]  = useState(false);

  const [branches,       setBranches]       = useState([]);
  const [departments,    setDepartments]    = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedDept,   setSelectedDept]   = useState('');
  const [bulkDataLoaded, setBulkDataLoaded] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') =>
    setToast({ show: true, message, type });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) return;

    setSubmitting(true);
    setResults(null);

    try {
      if (mode === 'single') {
        if (!selectedUser) return;
        const res = await adminBulkCloseOpenAttendances({ userId: selectedUser._id, date });
        if (res.data?.results?.total === 0)
          showToast(t('closeOpen.noRecords'), 'warning');
        else {
          setResults(res.data?.results);
          showToast(t('closeOpen.success'), 'success');
        }
      } else {
        const payload = { date };
        if (bulkBy === 'branch'     && selectedBranch) payload.branchId     = selectedBranch;
        if (bulkBy === 'department' && selectedDept)   payload.departmentId = selectedDept;
        const res = await adminBulkCloseOpenAttendances(payload);
        if (res.data?.results?.total === 0)
          showToast(t('closeOpen.noRecords'), 'warning');
        else {
          setResults(res.data?.results);
          showToast(t('closeOpen.successBulk'), 'success');
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="repair-card" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="repair-card-header">
          <i className="fas fa-door-closed" />
          <div>
            <h3>{t('closeOpen.title')}</h3>
            <p>{t('closeOpen.description')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="repair-form">

          <div className="repair-mode-toggle">
            {['single', 'bulk'].map(m => (
              <button
                key={m}
                type="button"
                className={`repair-mode-btn ${mode === m ? 'active' : ''}`}
                onClick={() => handleModeChange(m)}
              >
                {t(`closeOpen.${m}`)}
              </button>
            ))}
          </div>

          <div className="repair-field">
            <label>{t('closeOpen.date')}</label>

            <div className="repair-timezone-note">
  <i className="fas fa-globe" />

  {t('closeOpen.timezoneNote')}
</div>

            <input
              type="date"
              value={date}
              max={getTodayString()}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>

          {mode === 'single' && (
            <div className="repair-field">
              <label>{t('closeOpen.selectEmployee')}</label>
              <div className="repair-search-wrap">
                <input
                  type="text"
                  value={userQuery}
                  placeholder={t('closeOpen.selectEmployee')}
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
                    {t(`closeOpen.select${b.charAt(0).toUpperCase() + b.slice(1)}`)}
                  </button>
                ))}
              </div>

              {bulkBy === 'branch' && (
                <div className="repair-field">
                  <label>{t('closeOpen.selectBranch')}</label>
                  <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} required>
                    <option value="">{t('closeOpen.selectBranch')}</option>
                    {branches.map(b => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {bulkBy === 'department' && (
                <div className="repair-field">
                  <label>{t('closeOpen.selectDepartment')}</label>
                  <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)} required>
                    <option value="">{t('closeOpen.selectDepartment')}</option>
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
            className="repair-submit-btn danger"
            disabled={submitting ||
              (mode === 'single' && !selectedUser) ||
              (mode === 'bulk' && !selectedBranch && !selectedDept)}
          >
            {submitting
              ? <><span className="repair-spinner" /> {t('closeOpen.submitting')}</>
              : <><i className="fas fa-door-closed" /> {t('closeOpen.submit')}</>}
          </button>
        </form>

        {results && (
          <div className="repair-results">
            <h4>{t('closeOpen.results')}</h4>
            <div className="repair-results-grid">
              <div className="repair-result-item total">
                <span>{t('closeOpen.total')}</span>
                <strong>{results.total}</strong>
              </div>
              <div className="repair-result-item success">
                <span>{t('closeOpen.succeeded')}</span>
                <strong>{results.success?.length ?? 0}</strong>
              </div>
              <div className="repair-result-item skipped">
                <span>{t('closeOpen.skipped')}</span>
                <strong>{results.skipped?.length ?? 0}</strong>
              </div>
              <div className="repair-result-item failed">
                <span>{t('closeOpen.failed')}</span>
                <strong>{results.failed?.length ?? 0}</strong>
              </div>
            </div>

            {results.skipped?.length > 0 && (
              <ul className="repair-skipped-list">
                {results.skipped.map((s, i) => (
                  <li key={i}>
                    <i className="fas fa-lock" />
                    {t(`closeOpen.skippedReason_${s.reason}`, { defaultValue: s.reason })}
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