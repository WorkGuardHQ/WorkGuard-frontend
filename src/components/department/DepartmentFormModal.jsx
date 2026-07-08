

// import { useEffect, useState } from 'react';
// import Toast from '../ui/Toast';
// import { createDepartment, updateDepartment } from '../../services/department.api';
// import { getBranchLookup } from '../../services/branch.api';
// import { searchUsers } from '../../services/user.api';
// const initialForm = {
//   name: '',
//   description: '',
//   branches: [],
//   manager: '',
//   managerName: ''
// };

// const DepartmentFormModal = ({ show, editingDept, onClose, onSuccess }) => {
//   const [form, setForm] = useState(initialForm);
//   const [saving, setSaving] = useState(false);
//   const [branches, setBranches] = useState([]);

//   // Manager search
//   const [managerSearch, setManagerSearch] = useState('');
//   const [managerBranch, setManagerBranch] = useState('');
//   const [managerResults, setManagerResults] = useState([]);
//   const [searchingManager, setSearchingManager] = useState(false);
//   const [showManagerSearch, setShowManagerSearch] = useState(false);

//   const [toast, setToast] = useState({ show: false, type: 'error', message: '' });
//   const isEdit = Boolean(editingDept);
//   const showToast = (msg, type = 'error') => setToast({ show: true, type, message: msg });

//   /* Load branches */
//   useEffect(() => {
//     getBranchLookup()
//       .then(r => setBranches(r.data?.data || r.data || []))
//       .catch(() => {});
//   }, []);

//   /* Load edit data */
//   useEffect(() => {
//     if (editingDept) {
//       setForm({
//         name: editingDept.name || '',
//         description: editingDept.description || '',
//         branches: editingDept.branches?.map(b => b._id || b) || [],
//         manager: editingDept.manager?._id || editingDept.manager || '',
//         managerName: editingDept.manager?.name || ''
//       });
//     } else {
//       setForm(initialForm);
//       setManagerSearch('');
//       setManagerResults([]);
//     }
//   }, [editingDept, show]);

//   /* Manager search with debounce */
//   useEffect(() => {
//     if (!showManagerSearch) return;
//     if (!managerSearch.trim() && !managerBranch) {
//       setManagerResults([]);
//       return;
//     }
//     const timer = setTimeout(async () => {
//       try {
//         setSearchingManager(true);
//         const res = await searchUsers(managerSearch, managerBranch);
//         setManagerResults(res.data?.data || res.data || []);
//       } catch {
//         setManagerResults([]);
//       } finally {
//         setSearchingManager(false);
//       }
//     }, 350);
//     return () => clearTimeout(timer);
//   }, [managerSearch, managerBranch, showManagerSearch]);

//   if (!show) return null;

//   const validate = () => {
//     if (!form.name.trim()) {
//       showToast('Department name is required');
//       return false;
//     }
//     return true;
//   };

//   const toggleBranch = (branchId) => {
//     setForm(prev => ({
//       ...prev,
//       branches: prev.branches.includes(branchId)
//         ? prev.branches.filter(b => b !== branchId)
//         : [...prev.branches, branchId]
//     }));
//   };

//   const selectManager = (user) => {
//     setForm(prev => ({ ...prev, manager: user._id, managerName: user.name }));
//     setShowManagerSearch(false);
//     setManagerSearch('');
//     setManagerResults([]);
//   };

//   const clearManager = () => {
//     setForm(prev => ({ ...prev, manager: '', managerName: '' }));
//   };

//   const submit = async () => {
//     if (!validate()) return;
//     const payload = {
//       name: form.name.trim(),
//       description: form.description.trim(),
//       branches: form.branches,
//       manager: form.manager || null
//     };
//     try {
//       setSaving(true);
//       if (isEdit) {
//         await updateDepartment(editingDept._id, payload);
//       } else {
//         await createDepartment(payload);
//       }
//       onSuccess();
//     } catch (err) {
//       showToast(err?.response?.data?.message || 'Something went wrong');
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <>
//       <div className="modal-backdrop" onClick={onClose} />
//       <div className="policy-modal">
//         <div className="policy-modal-dialog">
//           <div className="policy-modal-content">

//             {/* Header */}
//             <div className="policy-modal-header">
//               <div className="modal-header-icon"><i className="fas fa-sitemap" /></div>
//               <div>
//                 <h4 className="modal-title">{isEdit ? 'Edit Department' : 'Create Department'}</h4>
//                 <p className="modal-subtitle">{isEdit ? 'Update department details' : 'Set up a new department'}</p>
//               </div>
//               <button className="modal-close-btn" onClick={onClose}><i className="fas fa-times" /></button>
//             </div>

//             <div className="policy-modal-body">

//               {/* Basic Info */}
//               <div className="form-section">
//                 <div className="section-header">
//                   <i className="fas fa-info-circle me-2" /><span>Basic Information</span>
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label-modern">
//                     <i className="fas fa-tag me-2" />Department Name <span className="text-danger">*</span>
//                   </label>
//                   <input type="text" className="form-control-modern"
//                     placeholder="e.g. Engineering, HR, Finance"
//                     value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label-modern">
//                     <i className="fas fa-align-left me-2" />Description
//                   </label>
//                   <textarea className="form-control-modern" rows={3}
//                     placeholder="Optional description..."
//                     value={form.description}
//                     onChange={e => setForm({ ...form, description: e.target.value })}
//                     style={{ resize: 'vertical' }} />
//                 </div>
//               </div>

//               {/* Branches */}
//               <div className="form-section">
//                 <div className="section-header">
//                   <i className="fas fa-building me-2" /><span>Assigned Branches</span>
//                 </div>
//                 {branches.length === 0 ? (
//                   <p className="text-muted small">No branches available</p>
//                 ) : (
//                   <div className="d-flex flex-wrap gap-2">
//                     {branches.map(b => {
//                       const selected = form.branches.includes(b._id);
//                       return (
//                         <button key={b._id} type="button"
//                           className={`btn btn-sm ${selected ? 'btn-primary' : 'btn-outline-secondary'}`}
//                           onClick={() => toggleBranch(b._id)}>
//                           <i className={`fas fa-${selected ? 'check' : 'plus'} me-1`} />
//                           {b.name}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 )}
//                 <small className="form-hint mt-2 d-block">Select which branches this department belongs to</small>
//               </div>

//               {/* Manager */}
//               <div className="form-section">
//                 <div className="section-header">
//                   <i className="fas fa-user-tie me-2" /><span>Department Manager</span>
//                 </div>

//                 {/* Selected manager display */}
//                 {form.manager ? (
//                   <div className="d-flex align-items-center justify-content-between p-2 rounded bg-primary bg-opacity-10 mb-2">
//                     <div className="d-flex align-items-center gap-2">
//                       <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center flex-shrink-0"
//                         style={{ width: 34, height: 34, fontSize: 13 }}>
//                         {form.managerName?.[0]?.toUpperCase() || '?'}
//                       </div>
//                       <div>
//                         <div className="fw-semibold small">{form.managerName}</div>
//                         <div className="text-muted" style={{ fontSize: 11 }}>Selected as manager</div>
//                       </div>
//                     </div>
//                     <button className="btn btn-sm btn-outline-danger" onClick={clearManager}>
//                       <i className="fas fa-times" />
//                     </button>
//                   </div>
//                 ) : (
//                   <p className="text-muted small mb-2">No manager selected</p>
//                 )}

//                 {/* Toggle search */}
//                 <button type="button"
//                   className="btn btn-sm btn-outline-primary mb-2"
//                   onClick={() => setShowManagerSearch(v => !v)}>
//                   <i className={`fas fa-${showManagerSearch ? 'chevron-up' : 'search'} me-1`} />
//                   {showManagerSearch ? 'Hide Search' : form.manager ? 'Change Manager' : 'Search Manager'}
//                 </button>

//                 {showManagerSearch && (
//                   <div className="border rounded p-3 bg-light">
//                     {/* Branch filter for manager */}
//                     <div className="mb-2">
//                       <select className="form-select form-select-sm" value={managerBranch}
//                         onChange={e => { setManagerBranch(e.target.value); setManagerSearch(''); }}>
//                         <option value="">All branches</option>
//                         {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
//                       </select>
//                     </div>

//                     {/* Search input */}
//                     <div className="input-group mb-2">
//                       <span className="input-group-text bg-white border-end-0">
//                         {searchingManager
//                           ? <i className="fas fa-spinner fa-spin text-primary" />
//                           : <i className="fas fa-search text-muted" />}
//                       </span>
//                       <input type="text" className="form-control border-start-0 form-control-sm"
//                         placeholder="Search by name or email..."
//                         value={managerSearch} onChange={e => setManagerSearch(e.target.value)} />
//                     </div>

//                     <small className="text-muted d-block mb-2" style={{ fontSize: 11 }}>
//                       <i className="fas fa-info-circle me-1" />Only active employees shown
//                     </small>

//                     {/* Results */}
//                     {managerResults.length === 0 && !searchingManager ? (
//                       <p className="text-muted small text-center py-2 mb-0">
//                         {managerSearch || managerBranch ? 'No employees found' : 'Select branch or type to search'}
//                       </p>
//                     ) : (
//                       <div style={{ maxHeight: 200, overflowY: 'auto' }}>
//                         {managerResults.map(user => (
//                           <div key={user._id}
//                             className="d-flex align-items-center justify-content-between p-2 rounded mb-1 bg-white border"
//                             style={{ cursor: 'pointer' }}
//                             onClick={() => selectManager(user)}>
//                             <div className="d-flex align-items-center gap-2">
//                               <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center flex-shrink-0"
//                                 style={{ width: 28, height: 28, fontSize: 12 }}>
//                                 {user.name?.[0]?.toUpperCase() || '?'}
//                               </div>
//                               <div>
//                                 <div className="small fw-semibold">{user.name}</div>
//                                 <div className="text-muted" style={{ fontSize: 11 }}>{user.email}</div>
//                               </div>
//                             </div>
//                             <i className="fas fa-plus text-primary" />
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 <small className="form-hint mt-1 d-block">Optional — assign a manager to this department</small>
//               </div>

//             </div>

//             {/* Footer */}
//             <div className="policy-modal-footer">
//               <button className="btn-modal btn-cancel" onClick={onClose}>
//                 <i className="fas fa-times me-2" />Cancel
//               </button>
//               <button className="btn-modal btn-save" disabled={saving} onClick={submit}>
//                 {saving
//                   ? <><i className="fas fa-spinner fa-spin me-2" />Saving...</>
//                   : <><i className="fas fa-check me-2" />{isEdit ? 'Update' : 'Create'}</>}
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

// export default DepartmentFormModal;

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from '../ui/Toast';
import { createDepartment, updateDepartment } from '../../services/department.api';
import { getBranchLookup } from '../../services/branch.api';
import { searchUsers } from '../../services/user.api';
import '../../style/departments.css';
const initialForm = {
  name: '',
  description: '',
  branches: [],
  manager: '',
  managerName: ''
};

const DepartmentFormModal = ({ show, editingDept, onClose, onSuccess }) => {
  const { t } = useTranslation('department');
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [branches, setBranches] = useState([]);

  // Manager search
  const [managerSearch, setManagerSearch] = useState('');
  const [managerBranch, setManagerBranch] = useState('');
  const [managerResults, setManagerResults] = useState([]);
  const [searchingManager, setSearchingManager] = useState(false);
  const [showManagerSearch, setShowManagerSearch] = useState(false);

  const [toast, setToast] = useState({ show: false, type: 'error', message: '' });
  const isEdit = Boolean(editingDept);
  const showToast = (msg, type = 'error') => setToast({ show: true, type, message: msg });

  /* Load branches */
  useEffect(() => {
    getBranchLookup()
      .then(r => setBranches(r.data?.data || r.data || []))
      .catch(() => {});
  }, []);

  /* Load edit data */
  useEffect(() => {
    if (editingDept) {
      setForm({
        name: editingDept.name || '',
        description: editingDept.description || '',
        branches: editingDept.branches?.map(b => b._id || b) || [],
        manager: editingDept.manager?._id || editingDept.manager || '',
        managerName: editingDept.manager?.name || ''
      });
    } else {
      setForm(initialForm);
      setManagerSearch('');
      setManagerResults([]);
    }
  }, [editingDept, show]);

  /* Manager search with debounce */
  useEffect(() => {
    if (!showManagerSearch) return;
    if (!managerSearch.trim() && !managerBranch) {
      setManagerResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setSearchingManager(true);
        const res = await searchUsers(managerSearch, managerBranch);
        setManagerResults(res.data?.data || res.data || []);
      } catch {
        setManagerResults([]);
      } finally {
        setSearchingManager(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [managerSearch, managerBranch, showManagerSearch]);

  if (!show) return null;

  const validate = () => {
    if (!form.name.trim()) {
      showToast(t('departments.formModal.nameRequired'));
      return false;
    }
    return true;
  };

  const toggleBranch = (branchId) => {
    setForm(prev => ({
      ...prev,
      branches: prev.branches.includes(branchId)
        ? prev.branches.filter(b => b !== branchId)
        : [...prev.branches, branchId]
    }));
  };

  const selectManager = (user) => {
    setForm(prev => ({ ...prev, manager: user._id, managerName: user.name }));
    setShowManagerSearch(false);
    setManagerSearch('');
    setManagerResults([]);
  };

  const clearManager = () => {
    setForm(prev => ({ ...prev, manager: '', managerName: '' }));
  };

  const submit = async () => {
    if (!validate()) return;
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      branches: form.branches,
      manager: form.manager || null
    };
    try {
      setSaving(true);
      if (isEdit) {
        await updateDepartment(editingDept._id, payload);
      } else {
        await createDepartment(payload);
      }
      onSuccess();
    } catch (err) {
      showToast(err?.response?.data?.message || t('departments.formModal.genericError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="policy-modal">
        <div className="policy-modal-dialog">
          <div className="policy-modal-content">

            {/* Header */}
            <div className="policy-modal-header">
              <div className="modal-header-icon"><i className="fas fa-sitemap" /></div>
              <div>
                <h4 className="modal-title">{isEdit ? t('departments.formModal.editTitle') : t('departments.formModal.createTitle')}</h4>
                <p className="modal-subtitle">{isEdit ? t('departments.formModal.editSubtitle') : t('departments.formModal.createSubtitle')}</p>
              </div>
              <button className="modal-close-btn" onClick={onClose}><i className="fas fa-times" /></button>
            </div>

            <div className="policy-modal-body">

              {/* Basic Info */}
              <div className="form-section">
                <div className="section-header">
                  <i className="fas fa-info-circle me-2" /><span>{t('departments.formModal.basicInfo')}</span>
                </div>

                <div className="form-group">
                  <label className="form-label-modern">
                    <i className="fas fa-tag me-2" />{t('departments.formModal.nameLabel')} <span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control-modern"
                    placeholder={t('departments.formModal.namePlaceholder')}
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>

                <div className="form-group">
                  <label className="form-label-modern">
                    <i className="fas fa-align-left me-2" />{t('departments.formModal.descriptionLabel')}
                  </label>
                  <textarea className="form-control-modern form-textarea-resize-v" rows={3}
                    placeholder={t('departments.formModal.descriptionPlaceholder')}
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>

              {/* Branches */}
              <div className="form-section">
                <div className="section-header">
                  <i className="fas fa-building me-2" /><span>{t('departments.formModal.assignedBranches')}</span>
                </div>
                {branches.length === 0 ? (
                  <p className="text-muted small">{t('departments.formModal.noBranches')}</p>
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {branches.map(b => {
                      const selected = form.branches.includes(b._id);
                      return (
                        <button key={b._id} type="button"
                          className={`btn btn-sm ${selected ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={() => toggleBranch(b._id)}>
                          <i className={`fas fa-${selected ? 'check' : 'plus'} me-1`} />
                          {b.name}
                        </button>
                      );
                    })}
                  </div>
                )}
                <small className="form-hint mt-2 d-block">{t('departments.formModal.branchesHint')}</small>
              </div>

              {/* Manager */}
              <div className="form-section">
                <div className="section-header">
                  <i className="fas fa-user-tie me-2" /><span>{t('departments.formModal.manager')}</span>
                </div>

                {/* Selected manager display */}
                {form.manager ? (
                  <div className="d-flex align-items-center justify-content-between p-2 rounded bg-primary bg-opacity-10 mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center flex-shrink-0 form-avatar">
                        {form.managerName?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="fw-semibold small">{form.managerName}</div>
                        <div className="text-muted form-text-fs-11">{t('departments.formModal.selectedAsManager')}</div>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-outline-danger" onClick={clearManager}>
                      <i className="fas fa-times" />
                    </button>
                  </div>
                ) : (
                  <p className="text-muted small mb-2">{t('departments.formModal.noManagerSelected')}</p>
                )}

                {/* Toggle search */}
                <button type="button"
                  className="btn btn-sm btn-outline-primary mb-2"
                  onClick={() => setShowManagerSearch(v => !v)}>
                  <i className={`fas fa-${showManagerSearch ? 'chevron-up' : 'search'} me-1`} />
                  {showManagerSearch ? t('departments.formModal.hideSearch') : form.manager ? t('departments.formModal.changeManager') : t('departments.formModal.searchManager')}
                </button>

                {showManagerSearch && (
                  <div className="border rounded p-3 bg-light">
                    {/* Branch filter for manager */}
                    <div className="mb-2">
                      <select className="form-select form-select-sm" value={managerBranch}
                        onChange={e => { setManagerBranch(e.target.value); setManagerSearch(''); }}>
                        <option value="">{t('departments.formModal.allBranches')}</option>
                        {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                      </select>
                    </div>

                    {/* Search input */}
                    <div className="input-group mb-2">
                      <span className="input-group-text bg-white border-end-0">
                        {searchingManager
                          ? <i className="fas fa-spinner fa-spin text-primary" />
                          : <i className="fas fa-search text-muted" />}
                      </span>
                      <input type="text" className="form-control border-start-0 form-control-sm"
                        placeholder={t('departments.formModal.searchPlaceholder')}
                        value={managerSearch} onChange={e => setManagerSearch(e.target.value)} />
                    </div>

                    <small className="text-muted d-block mb-2 form-text-fs-11">
                      <i className="fas fa-info-circle me-1" />{t('departments.formModal.onlyActiveShown')}
                    </small>

                    {/* Results */}
                    {managerResults.length === 0 && !searchingManager ? (
                      <p className="text-muted small text-center py-2 mb-0">
                        {managerSearch || managerBranch ? t('departments.formModal.noEmployeesFound') : t('departments.formModal.selectBranchOrType')}
                      </p>
                    ) : (
                      <div className="form-manager-results-list">
                        {managerResults.map(user => (
                          <div key={user._id}
                            className="d-flex align-items-center justify-content-between p-2 rounded mb-1 bg-white border form-manager-result-item"
                            onClick={() => selectManager(user)}>
                            <div className="d-flex align-items-center gap-2">
                              <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center flex-shrink-0 form-avatar-sm">
                                {user.name?.[0]?.toUpperCase() || '?'}
                              </div>
                              <div>
                                <div className="small fw-semibold">{user.name}</div>
                                <div className="text-muted form-text-fs-11">{user.email}</div>
                              </div>
                            </div>
                            <i className="fas fa-plus text-primary" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <small className="form-hint mt-1 d-block">{t('departments.formModal.managerHint')}</small>
              </div>

            </div>

            {/* Footer */}
            <div className="policy-modal-footer">
              <button className="btn-modal btn-cancel" onClick={onClose}>
                <i className="fas fa-times me-2" />{t('departments.formModal.cancel')}
              </button>
              <button className="btn-modal btn-save" disabled={saving} onClick={submit}>
                {saving
                  ? <><i className="fas fa-spinner fa-spin me-2" />{t('departments.formModal.saving')}</>
                  : <><i className="fas fa-check me-2" />{isEdit ? t('departments.formModal.update') : t('departments.formModal.create')}</>}
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

export default DepartmentFormModal;