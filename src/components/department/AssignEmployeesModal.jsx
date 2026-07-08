

// import { useEffect, useState ,useCallback } from 'react';
// import { assignEmployees, removeEmployee } from '../../services/department.api';
// import { searchUsers,getDepartmentUsers } from '../../services/user.api';
// import { getBranchLookup } from '../../services/branch.api';
// // import { apiGet } from '../../helpers/api';
// import Toast from '../ui/Toast';

// const AssignEmployeesModal = ({ dept, onClose, onSuccess }) => {
//   const [branches, setBranches] = useState([]);
//   const [selectedBranch, setSelectedBranch] = useState('');
//   const [searchQ, setSearchQ] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [searching, setSearching] = useState(false);
//   const [assignedEmployees, setAssignedEmployees] = useState([]);
//   // const [ setAssignedIds] = useState(new Set());
//   const [loadingAssigned, setLoadingAssigned] = useState(true);
//   const [showDeptList, setShowDeptList] = useState(false);
//   // const [deptPage, setDeptPage] = useState(1);
//   const [deptBranchFilter, setDeptBranchFilter] = useState('');
//   const [saving, setSaving] = useState(null);
//   const [toast, setToast] = useState({ show: false, type: 'error', message: '' });
// const [deptPage, setDeptPage] = useState(1);

// const PAGE_SIZE = 8;

// const [deptPagination, setDeptPagination] = useState(null);

//   // const DEPT_PAGE_SIZE = 8;
//   const showToast = (msg, type = 'error') => setToast({ show: true, type, message: msg });

//   /* Load branches */
//   useEffect(() => {
//     getBranchLookup()
//       .then(r => setBranches(r.data?.data || r.data || []))
//       .catch(() => {});
//   }, []);

//   /* Load dept members */

// const loadAssignedEmployees = useCallback(async () => {
//   try {
//     setLoadingAssigned(true);

    
//     const res = await getDepartmentUsers({
//   department: dept._id,
//   page: deptPage,
//   limit: PAGE_SIZE,
//   branch: deptBranchFilter || undefined,
// });

//     setAssignedEmployees(res.users || []);

//    const pagination = {
//   page: res.currentPage,
//   pages: res.totalPages,
//   total: res.totalUsers
// };

// setDeptPagination(pagination);

// return pagination;

//   } catch {
    
//     setAssignedEmployees([]);
//     // setAssignedIds(new Set());
//     setDeptPagination(null);
//   } finally {
//     setLoadingAssigned(false);
//   }
// }, [dept._id, deptPage, deptBranchFilter]);




// useEffect(() => {
//     loadAssignedEmployees();
// }, [loadAssignedEmployees]);
//   /* Search with debounce */

// useEffect(() => {

//   if (!searchQ.trim() && !selectedBranch) {
//     setSearchResults([]);
//     return;
//   }

//   const timer = setTimeout(async () => {

//     try {

//       setSearching(true);

//       const res = await searchUsers(
//         searchQ,
//         selectedBranch,
//         dept._id
//       );

//       setSearchResults(res.data.data);

//     } catch {

//       setSearchResults([]);

//     } finally {

//       setSearching(false);

//     }

//   },350);

//   return ()=>clearTimeout(timer);

// },[searchQ,selectedBranch,dept._id]);


// const refreshSearch = async () => {
//   if (!searchQ.trim() && !selectedBranch) return;

//   try {
//     const res = await searchUsers(
//       searchQ,
//       selectedBranch,
//       dept._id
//     );

//     setSearchResults(res.data.data);

//   } catch {
//     setSearchResults([]);
//   }
// };

// const refreshDepartment = async () => {
//   try {
//     const pagination = await loadAssignedEmployees();

//     if (pagination && pagination.page !== deptPage) {
//       setDeptPage(pagination.page);
//     }
//   } catch {}
// };

//   /* Toggle assign/remove */
//   const handleToggle = async (user,isAssigned) => {
//     setSaving(user._id);
//     try {
//       if (isAssigned)  {
//        await removeEmployee(dept._id, user._id);

       
 
// await Promise.all([
//   refreshDepartment(),
//   refreshSearch(),
// ]);

// showToast(`${user.name} removed`, "success");

      
//       } else {
      
//         await assignEmployees(dept._id, [user._id]);


// await refreshDepartment();
// await refreshSearch();

// showToast(`${user.name} assigned`, "success");
//       }
//     } catch (err) {
//       showToast(err?.response?.data?.message || 'Action failed');
//     } finally {
//       setSaving(null);
//     }
//   };

  

//   useEffect(() => {
//   setDeptPage(1);
//   setDeptBranchFilter('');
// }, [dept._id]);

//   const Avatar = ({ name, color = '#0d6efd' }) => (
//     <div className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
//       style={{ width: 34, height: 34, fontSize: 13, background: color }}>
//       {name?.[0]?.toUpperCase() || '?'}
//     </div>
//   );

//   return (
//     <>
//       <div className="modal-backdrop" onClick={onClose} />
//       <div className="policy-modal">
//         <div className="policy-modal-dialog" style={{ maxWidth: 620 }}>
//           <div className="policy-modal-content">

//             {/* Header */}
//             <div className="policy-modal-header">
//               <div className="modal-header-icon"><i className="fas fa-user-plus" /></div>
//               <div>
//                 <h4 className="modal-title">Assign Employees</h4>
//                 <p className="modal-subtitle">
//                   <strong>{dept.name}</strong> ·{' '}
//                   <span className="text-primary" style={{ cursor: 'pointer', textDecoration: 'underline dotted' }}
//                     onClick={() => { setShowDeptList(v => !v); setDeptPage(1); }}>
//                     {loadingAssigned ? '...' : deptPagination?.total || 0} assigned
//                     <i className={`fas fa-chevron-${showDeptList ? 'up' : 'down'} ms-1`} style={{ fontSize: 10 }} />
//                   </span>
//                 </p>
//               </div>
//               <button className="modal-close-btn" onClick={onClose}><i className="fas fa-times" /></button>
//             </div>

//             <div className="policy-modal-body">

//               {/* ── Current Members (collapsible) ── */}
//               {showDeptList && (
//                 <div className="form-section mb-3">
//                   <div className="section-header">
//                     <i className="fas fa-users me-2" />
//                     <span>Current Members ({deptPagination?.total || 0})</span>
//                   </div>

//                   <select className="form-select form-select-sm mb-2"
//                     value={deptBranchFilter}
//                     onChange={e => { setDeptBranchFilter(e.target.value); setDeptPage(1); }}>
//                     <option value="">All branches</option>
//                     {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
//                   </select>

//                   {loadingAssigned ? (
//                     <div className="text-center py-3"><div className="spinner-border spinner-border-sm text-primary" /></div>
//                   ) : assignedEmployees.length === 0 ? (
//                     <p className="text-muted small text-center py-2">No members in this filter</p>
//                   ) : (
//                     <>
//                       {assignedEmployees.map(user => (
//                         <div key={user._id} className="d-flex align-items-center justify-content-between p-2 rounded mb-1 bg-primary bg-opacity-10">
//                           <div className="d-flex align-items-center gap-2">
//                             <Avatar name={user.name} color="#0d6efd" />
//                             <div>
//                               <div className="fw-semibold small">{user.name}</div>
//                               <div className="text-muted" style={{ fontSize: 11 }}>{user.email}</div>
//                             </div>
//                           </div>
//                           <button className="btn btn-sm btn-outline-danger"
//                             disabled={saving === user._id} onClick={() => handleToggle(user, true)}>
//                             {saving === user._id ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-user-minus" />}
//                           </button>
//                         </div>
//                       ))}

//                       {deptPagination?.pages > 1 && (
//                         <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
//                           <button className="btn btn-sm btn-outline-secondary"
//                             disabled={deptPage === 1} onClick={() => setDeptPage(p => p - 1)}>
//                             <i className="fas fa-chevron-right" />
//                           </button>
//                           <span className="small text-muted">  {deptPage} / {deptPagination?.pages || 1}
// </span>
//                           <button className="btn btn-sm btn-outline-secondary"
//                             disabled={deptPage === deptPagination?.pages} onClick={() => setDeptPage(p => p + 1)}>
//                             <i className="fas fa-chevron-left" />
//                           </button>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               )}

//               {/* ── Search & Add ── */}
//               <div className="form-section">
//                 <div className="section-header">
//                   <i className="fas fa-search me-2" /><span>Search & Add Employees</span>
//                 </div>

//                 {/* Branch filter */}
//                 <div className="mb-2">
//                   <label className="form-label-modern">
//                     <i className="fas fa-building me-1" /> Filter by Branch
//                   </label>
//                   <select className="form-control-modern" value={selectedBranch}
//                     onChange={e => { setSelectedBranch(e.target.value); setSearchQ(''); setSearchResults([]); }}>
//                     <option value="">All branches</option>
//                     {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
//                   </select>
//                 </div>

//                 {/* Search input */}
//                 <div className="input-group mb-1">
//                   <span className="input-group-text bg-white border-end-0">
//                     {searching
//                       ? <i className="fas fa-spinner fa-spin text-primary" />
//                       : <i className="fas fa-search text-muted" />}
//                   </span>
//                   <input type="text" className="form-control border-start-0"
//                     placeholder="Search by name or email..."
//                     value={searchQ} onChange={e => setSearchQ(e.target.value)} />
//                   {searchQ && (
//                     <button className="btn btn-outline-secondary" onClick={() => { setSearchQ(''); setSearchResults([]); }}>
//                       <i className="fas fa-times" />
//                     </button>
//                   )}
//                 </div>

//                 <small className="form-hint d-block mb-3">
//                   <i className="fas fa-info-circle me-1" />
//                   Only active employees shown. Select a branch for better results.
//                 </small>

//                 {/* Results */}
//                 {!searchQ && !selectedBranch ? (
//                   <div className="text-center py-3 text-muted">
//                     <i className="fas fa-filter fa-2x mb-2 opacity-25" />
//                     <p className="small mb-0">Select a branch or type a name to search</p>
//                   </div>
//                 ) : !searching && searchResults.length === 0 ? (
//                   <div className="text-center py-3 text-muted">
//                     <i className="fas fa-user-slash fa-2x mb-2 opacity-25" />
//                     <p className="small mb-0">No active employees found</p>
//                   </div>
//                 ) : (
//                   <div style={{ maxHeight: 300, overflowY: 'auto' }}>
//                     {searchResults.map(user => {
//                       const isAssigned =
//     !!user.isAssignedToDepartment;
//                       return (
//                         <div key={user._id}
//                           className={`d-flex align-items-center justify-content-between p-2 rounded mb-1 ${isAssigned ? 'bg-success bg-opacity-10' : 'bg-light'}`}>
//                           <div className="d-flex align-items-center gap-2">
//                             <Avatar name={user.name} color={isAssigned ? '#198754' : '#6c757d'} />
//                             <div>
//                               <div className="fw-semibold small">
//                                 {user.name}
//                                 {isAssigned && <span className="badge bg-success ms-1" style={{ fontSize: 9 }}>assigned</span>}
//                               </div>
//                               <div className="text-muted" style={{ fontSize: 11 }}>{user.email}</div>
//                             </div>
//                           </div>
//                           <button
//                             className={`btn btn-sm ${isAssigned ? 'btn-outline-danger' : 'btn-outline-primary'}`}
//                             disabled={saving === user._id} onClick={() => handleToggle(user, isAssigned)}>
//                             {saving === user._id
//                               ? <i className="fas fa-spinner fa-spin" />
//                               : <i className={`fas fa-user-${isAssigned ? 'minus' : 'plus'}`} />}
//                           </button>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>

//             </div>

//             {/* Footer */}
//             <div className="policy-modal-footer">
//               <button className="btn-modal btn-cancel" onClick={onClose}>
//                 <i className="fas fa-times me-2" />Close
//               </button>
//               <button className="btn-modal btn-save" onClick={onSuccess}>
//                 <i className="fas fa-check me-2" />Done
//               </button>
//             </div>

//           </div>
//         </div>
//       </div>

//       {toast.show && (
//         <Toast show={toast.show} type={toast.type} message={toast.message}
//           onClose={() => setToast(prev => ({ ...prev, show: false }))} />
//       )}
//     </>
//   );
// };

// export default AssignEmployeesModal;

import { useEffect, useState ,useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { assignEmployees, removeEmployee } from '../../services/department.api';
import { searchUsers,getDepartmentUsers } from '../../services/user.api';
import { getBranchLookup } from '../../services/branch.api';
// import { apiGet } from '../../helpers/api';
import Toast from '../ui/Toast';
import '../../style/departments.css';

const AssignEmployeesModal = ({ dept, onClose, onSuccess }) => {
  const { t } = useTranslation('department');
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  // const [ setAssignedIds] = useState(new Set());
  const [loadingAssigned, setLoadingAssigned] = useState(true);
  const [showDeptList, setShowDeptList] = useState(false);
  // const [deptPage, setDeptPage] = useState(1);
  const [deptBranchFilter, setDeptBranchFilter] = useState('');
  const [saving, setSaving] = useState(null);
  const [toast, setToast] = useState({ show: false, type: 'error', message: '' });
const [deptPage, setDeptPage] = useState(1);

const PAGE_SIZE = 8;

const [deptPagination, setDeptPagination] = useState(null);

  // const DEPT_PAGE_SIZE = 8;
  const showToast = (msg, type = 'error') => setToast({ show: true, type, message: msg });

  /* Load branches */
  useEffect(() => {
    getBranchLookup()
      .then(r => setBranches(r.data?.data || r.data || []))
      .catch(() => {});
  }, []);

  /* Load dept members */

const loadAssignedEmployees = useCallback(async () => {
  try {
    setLoadingAssigned(true);

    
    const res = await getDepartmentUsers({
  department: dept._id,
  page: deptPage,
  limit: PAGE_SIZE,
  branch: deptBranchFilter || undefined,
});

    setAssignedEmployees(res.users || []);

   const pagination = {
  page: res.currentPage,
  pages: res.totalPages,
  total: res.totalUsers
};

setDeptPagination(pagination);

return pagination;

  } catch {
    
    setAssignedEmployees([]);
    // setAssignedIds(new Set());
    setDeptPagination(null);
  } finally {
    setLoadingAssigned(false);
  }
}, [dept._id, deptPage, deptBranchFilter]);




useEffect(() => {
    loadAssignedEmployees();
}, [loadAssignedEmployees]);
  /* Search with debounce */

useEffect(() => {

  if (!searchQ.trim() && !selectedBranch) {
    setSearchResults([]);
    return;
  }

  const timer = setTimeout(async () => {

    try {

      setSearching(true);

      const res = await searchUsers(
        searchQ,
        selectedBranch,
        dept._id
      );

      setSearchResults(res.data.data);

    } catch {

      setSearchResults([]);

    } finally {

      setSearching(false);

    }

  },350);

  return ()=>clearTimeout(timer);

},[searchQ,selectedBranch,dept._id]);


const refreshSearch = async () => {
  if (!searchQ.trim() && !selectedBranch) return;

  try {
    const res = await searchUsers(
      searchQ,
      selectedBranch,
      dept._id
    );

    setSearchResults(res.data.data);

  } catch {
    setSearchResults([]);
  }
};

const refreshDepartment = async () => {
  try {
    const pagination = await loadAssignedEmployees();

    if (pagination && pagination.page !== deptPage) {
      setDeptPage(pagination.page);
    }
  } catch {}
};

  /* Toggle assign/remove */
  const handleToggle = async (user,isAssigned) => {
    setSaving(user._id);
    try {
      if (isAssigned)  {
       await removeEmployee(dept._id, user._id);

       
 
await Promise.all([
  refreshDepartment(),
  refreshSearch(),
]);

showToast(t('departments.assignModal.removedToast', { name: user.name }), "success");

      
      } else {
      
        await assignEmployees(dept._id, [user._id]);


await refreshDepartment();
await refreshSearch();

showToast(t('departments.assignModal.assignedToast', { name: user.name }), "success");
      }
    } catch (err) {
      showToast(err?.response?.data?.message || t('departments.assignModal.actionFailed'));
    } finally {
      setSaving(null);
    }
  };

  

  useEffect(() => {
  setDeptPage(1);
  setDeptBranchFilter('');
}, [dept._id]);

  const Avatar = ({ name, color = '#0d6efd' }) => (
    <div className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0 assign-avatar"
      style={{ background: color }}>
      {name?.[0]?.toUpperCase() || '?'}
    </div>
  );

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="policy-modal">
        <div className="policy-modal-dialog assign-modal-dialog">
          <div className="policy-modal-content">

            {/* Header */}
            <div className="policy-modal-header">
              <div className="modal-header-icon"><i className="fas fa-user-plus" /></div>
              <div>
                <h4 className="modal-title">{t('departments.assignModal.title')}</h4>
                <p className="modal-subtitle">
                  <strong>{dept.name}</strong> ·{' '}
                  <span className="text-primary" style={{ cursor: 'pointer', textDecoration: 'underline dotted' }}
                    onClick={() => { setShowDeptList(v => !v); setDeptPage(1); }}>
                    {loadingAssigned ? '...' : deptPagination?.total || 0} {t('departments.assignModal.assignedCount')}
                    <i className={`fas fa-chevron-${showDeptList ? 'up' : 'down'} ms-1 assign-chevron-xs`} />
                  </span>
                </p>
              </div>
              <button className="modal-close-btn" onClick={onClose}><i className="fas fa-times" /></button>
            </div>

            <div className="policy-modal-body">

              {/* ── Current Members (collapsible) ── */}
              {showDeptList && (
                <div className="form-section mb-3">
                  <div className="section-header">
                    <i className="fas fa-users me-2" />
                    <span>{t('departments.assignModal.currentMembers')} ({deptPagination?.total || 0})</span>
                  </div>

                  <select className="form-select form-select-sm mb-2"
                    value={deptBranchFilter}
                    onChange={e => { setDeptBranchFilter(e.target.value); setDeptPage(1); }}>
                    <option value="">{t('departments.assignModal.allBranches')}</option>
                    {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </select>

                  {loadingAssigned ? (
                    <div className="text-center py-3"><div className="spinner-border spinner-border-sm text-primary" /></div>
                  ) : assignedEmployees.length === 0 ? (
                    <p className="text-muted small text-center py-2">{t('departments.assignModal.noMembersFilter')}</p>
                  ) : (
                    <>
                      {assignedEmployees.map(user => (
                        <div key={user._id} className="d-flex align-items-center justify-content-between p-2 rounded mb-1 bg-primary bg-opacity-10">
                          <div className="d-flex align-items-center gap-2">
                            <Avatar name={user.name} color="#0d6efd" />
                            <div>
                              <div className="fw-semibold small">{user.name}</div>
                              <div className="text-muted assign-text-fs-11">{user.email}</div>
                            </div>
                          </div>
                          <button className="btn btn-sm btn-outline-danger"
                            disabled={saving === user._id} onClick={() => handleToggle(user, true)}>
                            {saving === user._id ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-user-minus" />}
                          </button>
                        </div>
                      ))}

                      {deptPagination?.pages > 1 && (
                        <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
                          <button className="btn btn-sm btn-outline-secondary"
                            disabled={deptPage === 1} onClick={() => setDeptPage(p => p - 1)}>
                            <i className="fas fa-chevron-right" />
                          </button>
                          <span className="small text-muted">  {deptPage} / {deptPagination?.pages || 1}
</span>
                          <button className="btn btn-sm btn-outline-secondary"
                            disabled={deptPage === deptPagination?.pages} onClick={() => setDeptPage(p => p + 1)}>
                            <i className="fas fa-chevron-left" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ── Search & Add ── */}
              <div className="form-section">
                <div className="section-header">
                  <i className="fas fa-search me-2" /><span>{t('departments.assignModal.searchAndAdd')}</span>
                </div>

                {/* Branch filter */}
                <div className="mb-2">
                  <label className="form-label-modern">
                    <i className="fas fa-building me-1" /> {t('departments.assignModal.filterByBranch')}
                  </label>
                  <select className="form-control-modern" value={selectedBranch}
                    onChange={e => { setSelectedBranch(e.target.value); setSearchQ(''); setSearchResults([]); }}>
                    <option value="">{t('departments.assignModal.allBranches')}</option>
                    {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </select>
                </div>

                {/* Search input */}
                <div className="input-group mb-1">
                  <span className="input-group-text bg-white border-end-0">
                    {searching
                      ? <i className="fas fa-spinner fa-spin text-primary" />
                      : <i className="fas fa-search text-muted" />}
                  </span>
                  <input type="text" className="form-control border-start-0"
                    placeholder={t('departments.assignModal.searchPlaceholder')}
                    value={searchQ} onChange={e => setSearchQ(e.target.value)} />
                  {searchQ && (
                    <button className="btn btn-outline-secondary" onClick={() => { setSearchQ(''); setSearchResults([]); }}>
                      <i className="fas fa-times" />
                    </button>
                  )}
                </div>

                <small className="form-hint d-block mb-3">
                  <i className="fas fa-info-circle me-1" />
                  {t('departments.assignModal.hint')}
                </small>

                {/* Results */}
                {!searchQ && !selectedBranch ? (
                  <div className="text-center py-3 text-muted">
                    <i className="fas fa-filter fa-2x mb-2 opacity-25" />
                    <p className="small mb-0">{t('departments.assignModal.selectBranchOrType')}</p>
                  </div>
                ) : !searching && searchResults.length === 0 ? (
                  <div className="text-center py-3 text-muted">
                    <i className="fas fa-user-slash fa-2x mb-2 opacity-25" />
                    <p className="small mb-0">{t('departments.assignModal.noActiveFound')}</p>
                  </div>
                ) : (
                  <div className="assign-results-list">
                    {searchResults.map(user => {
                      const isAssigned =
    !!user.isAssignedToDepartment;
                      return (
                        <div key={user._id}
                          className={`d-flex align-items-center justify-content-between p-2 rounded mb-1 ${isAssigned ? 'bg-success bg-opacity-10' : 'bg-light'}`}>
                          <div className="d-flex align-items-center gap-2">
                            <Avatar name={user.name} color={isAssigned ? '#198754' : '#6c757d'} />
                            <div>
                              <div className="fw-semibold small">
                                {user.name}
                                {isAssigned && <span className="badge bg-success ms-1 assign-badge-fs-9">{t('departments.assignModal.assignedBadge')}</span>}
                              </div>
                              <div className="text-muted assign-text-fs-11">{user.email}</div>
                            </div>
                          </div>
                          <button
                            className={`btn btn-sm ${isAssigned ? 'btn-outline-danger' : 'btn-outline-primary'}`}
                            disabled={saving === user._id} onClick={() => handleToggle(user, isAssigned)}>
                            {saving === user._id
                              ? <i className="fas fa-spinner fa-spin" />
                              : <i className={`fas fa-user-${isAssigned ? 'minus' : 'plus'}`} />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="policy-modal-footer">
              <button className="btn-modal btn-cancel" onClick={onClose}>
                <i className="fas fa-times me-2" />{t('departments.assignModal.close')}
              </button>
              <button className="btn-modal btn-save" onClick={onSuccess}>
                <i className="fas fa-check me-2" />{t('departments.assignModal.done')}
              </button>
            </div>

          </div>
        </div>
      </div>

      {toast.show && (
        <Toast show={toast.show} type={toast.type} message={toast.message}
          onClose={() => setToast(prev => ({ ...prev, show: false }))} />
      )}
    </>
  );
};

export default AssignEmployeesModal;