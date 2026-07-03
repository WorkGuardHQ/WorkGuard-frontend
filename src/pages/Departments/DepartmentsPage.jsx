// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { getDepartments, deactivateDepartment, deleteDepartment } from '../../services/department.api';
// import DepartmentFormModal from '../../components/department/DepartmentFormModal';
// import AssignEmployeesModal from '../../components/department/AssignEmployeesModal';
// import Toast from '../../components/ui/Toast';

// const DepartmentsPage = () => {
//   const { t } = useTranslation();

//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [activeFilter, setActiveFilter] = useState(null);

//   const [showFormModal, setShowFormModal] = useState(false);
//   const [editingDept, setEditingDept] = useState(null);

//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [assigningDept, setAssigningDept] = useState(null);

//   const [toast, setToast] = useState(null);
//   const [confirmDelete, setConfirmDelete] = useState(null); // { id, name, type: 'delete' | 'deactivate' }

//   /* =========================
//      Load
//   ========================= */
//   const loadDepartments = async () => {
//     try {
//       setLoading(true);
//       const res = await getDepartments({ limit: 50 });
//       setDepartments(res.data?.departments || []);
//     } catch {
//       setToast({ type: 'error', message: 'Failed to load departments' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadDepartments();
//   }, []);

//   /* =========================
//      Stats
//   ========================= */
//   const stats = [
//     {
//       label: 'Total Departments',
//       value: departments.length,
//       icon: 'fa-sitemap',
//       color: 'primary',
//       filterKey: null
//     },
//     {
//       label: 'Active',
//       value: departments.filter(d => d.isActive).length,
//       icon: 'fa-check-circle',
//       color: 'success',
//       filterKey: 'active'
//     },
//     {
//       label: 'Inactive',
//       value: departments.filter(d => !d.isActive).length,
//       icon: 'fa-pause-circle',
//       color: 'warning',
//       filterKey: 'inactive'
//     },
//     {
//       label: 'Total Employees',
//       value: departments.reduce((sum, d) => sum + (d.employeeCount || 0), 0),
//       icon: 'fa-users',
//       color: 'info',
//       filterKey: null
//     }
//   ];

//   /* =========================
//      Filter + Search
//   ========================= */
//   const filtered = departments.filter(d => {
//     const matchSearch = !search || d.name?.toLowerCase().includes(search.toLowerCase());
//     const matchFilter =
//       !activeFilter ||
//       (activeFilter === 'active' && d.isActive) ||
//       (activeFilter === 'inactive' && !d.isActive);
//     return matchSearch && matchFilter;
//   });

//   /* =========================
//      Actions
//   ========================= */
//   const handleDeactivate = async (dept) => {
//     try {
//       await deactivateDepartment(dept._id);
//       setToast({ type: 'success', message: 'Department deactivated' });
//       loadDepartments();
//     } catch (err) {
//       setToast({ type: 'error', message: err?.response?.data?.message || 'Failed to deactivate' });
//     } finally {
//       setConfirmDelete(null);
//     }
//   };

//   const handleDelete = async (dept) => {
//     try {
//       await deleteDepartment(dept._id);
//       setToast({ type: 'success', message: 'Department deleted' });
//       loadDepartments();
//     } catch (err) {
//       setToast({ type: 'error', message: err?.response?.data?.message || 'Failed to delete' });
//     } finally {
//       setConfirmDelete(null);
//     }
//   };

//   /* =========================
//      Render
//   ========================= */
//   return (
//     <div className="attendance-policies-page">
//       <div className="container-fluid">

//         {/* Header */}
//         <div className="page-header mb-4">
//           <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
//             <div>
//               <h2 className="page-title mb-1">
//                 <i className="fas fa-sitemap me-2" />
//                 Departments
//               </h2>
//               <p className="page-subtitle mb-0">
//                 Manage company departments and employee assignments
//               </p>
//             </div>
//             <button
//               className="btn btn-primary btn-create"
//               onClick={() => { setEditingDept(null); setShowFormModal(true); }}
//             >
//               <i className="fas fa-plus me-2" />
//               New Department
//             </button>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="row g-3 mb-4">
//           {stats.map((stat, i) => {
//             const isActive = activeFilter === stat.filterKey && stat.filterKey !== null;
//             return (
//               <div key={i} className="col-6 col-lg-3">
//                 <div
//                   className={`stat-card stat-card-${stat.color} ${isActive ? 'stat-card-active' : ''}`}
//                   role={stat.filterKey ? 'button' : undefined}
//                   onClick={() => {
//                     if (!stat.filterKey) return;
//                     setActiveFilter(prev => prev === stat.filterKey ? null : stat.filterKey);
//                   }}
//                 >
//                   <div className="stat-icon">
//                     <i className={`fas ${stat.icon}`} />
//                   </div>
//                   <div className="stat-content">
//                     <div className="stat-value">{stat.value}</div>
//                     <div className="stat-label">{stat.label}</div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Search */}
//         <div className="mb-3">
//           <div className="input-group" style={{ maxWidth: 340 }}>
//             <span className="input-group-text bg-white border-end-0">
//               <i className="fas fa-search text-muted" />
//             </span>
//             <input
//               type="text"
//               className="form-control border-start-0"
//               placeholder="Search departments..."
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//             />
//             {search && (
//               <button className="btn btn-outline-secondary" onClick={() => setSearch('')}>
//                 <i className="fas fa-times" />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Table */}
//         <div className="card border-0 shadow-sm">
//           <div className="card-body p-0">
//             {loading ? (
//               <div className="text-center py-5">
//                 <div className="spinner-border text-primary" />
//                 <p className="mt-2 text-muted">Loading departments...</p>
//               </div>
//             ) : filtered.length === 0 ? (
//               <div className="text-center py-5 text-muted">
//                 <i className="fas fa-sitemap fa-3x mb-3 opacity-25" />
//                 <p>No departments found</p>
//                 <button
//                   className="btn btn-sm btn-outline-primary"
//                   onClick={() => { setEditingDept(null); setShowFormModal(true); }}
//                 >
//                   <i className="fas fa-plus me-1" /> Create First Department
//                 </button>
//               </div>
//             ) : (
//               <div className="table-responsive">
//                 <table className="table table-hover align-middle mb-0">
//                   <thead className="table-light">
//                     <tr>
//                       <th>Department</th>
//                       <th>Branches</th>
//                       <th>Manager</th>
//                       <th className="text-center">Employees</th>
//                       <th className="text-center">Status</th>
//                       <th className="text-center">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filtered.map(dept => (
//                       <tr key={dept._id}>
//                         {/* Name + Description */}
//                         <td>
//                           <div className="fw-semibold">{dept.name}</div>
//                           {dept.description && (
//                             <small className="text-muted">{dept.description}</small>
//                           )}
//                         </td>

//                         {/* Branches */}
//                         <td>
//                           {dept.branches?.length > 0 ? (
//                             <div className="d-flex flex-wrap gap-1">
//                               {dept.branches.map(b => (
//                                 <span key={b._id} className="badge bg-light text-dark border">
//                                   <i className="fas fa-building me-1 text-primary" style={{ fontSize: 10 }} />
//                                   {b.name}
//                                 </span>
//                               ))}
//                             </div>
//                           ) : (
//                             <span className="text-muted small">—</span>
//                           )}
//                         </td>

//                         {/* Manager */}
//                         <td>
//                           {dept.manager ? (
//                             <div className="d-flex align-items-center gap-2">
//                               <div
//                                 className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
//                                 style={{ width: 28, height: 28, fontSize: 12, flexShrink: 0 }}
//                               >
//                                 {dept.manager.name?.[0]?.toUpperCase() || '?'}
//                               </div>
//                               <div>
//                                 <div className="small fw-semibold">{dept.manager.name}</div>
//                                 <div className="text-muted" style={{ fontSize: 11 }}>{dept.manager.email}</div>
//                               </div>
//                             </div>
//                           ) : (
//                             <span className="text-muted small">No manager</span>
//                           )}
//                         </td>

//                         {/* Employee Count */}
//                         <td className="text-center">
//                           <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1">
//                             <i className="fas fa-users me-1" style={{ fontSize: 10 }} />
//                             {dept.employeeCount || 0}
//                           </span>
//                         </td>

//                         {/* Status */}
//                         <td className="text-center">
//                           {dept.isActive ? (
//                             <span className="badge bg-success-subtle text-success">
//                               <i className="fas fa-circle me-1" style={{ fontSize: 8 }} />
//                               Active
//                             </span>
//                           ) : (
//                             <span className="badge bg-secondary-subtle text-secondary">
//                               <i className="fas fa-circle me-1" style={{ fontSize: 8 }} />
//                               Inactive
//                             </span>
//                           )}
//                         </td>

//                         {/* Actions */}
//                         <td className="text-center">
//                           <div className="d-flex justify-content-center gap-1">
//                             {/* Assign Employees */}
//                             <button
//                               className="btn btn-sm btn-outline-info"
//                               title="Assign Employees"
//                               onClick={() => { setAssigningDept(dept); setShowAssignModal(true); }}
//                             >
//                               <i className="fas fa-user-plus" />
//                             </button>

//                             {/* Edit */}
//                             <button
//                               className="btn btn-sm btn-outline-primary"
//                               title="Edit"
//                               onClick={() => { setEditingDept(dept); setShowFormModal(true); }}
//                             >
//                               <i className="fas fa-edit" />
//                             </button>

//                             {/* Deactivate (soft delete) */}
//                             {dept.isActive && (
//                               <button
//                                 className="btn btn-sm btn-outline-warning"
//                                 title="Deactivate"
//                                 onClick={() => setConfirmDelete({ dept, type: 'deactivate' })}
//                               >
//                                 <i className="fas fa-pause" />
//                               </button>
//                             )}

//                             {/* Hard Delete */}
//                             <button
//                               className="btn btn-sm btn-outline-danger"
//                               title="Delete"
//                               onClick={() => setConfirmDelete({ dept, type: 'delete' })}
//                             >
//                               <i className="fas fa-trash" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Confirm Modal */}
//         {confirmDelete && (
//           <>
//             <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} onClick={() => setConfirmDelete(null)} />
//             <div className="modal fade show d-block" style={{ zIndex: 1055 }}>
//               <div className="modal-dialog modal-dialog-centered modal-sm">
//                 <div className="modal-content">
//                   <div className="modal-header border-0">
//                     <h6 className="modal-title">
//                       {confirmDelete.type === 'delete' ? '🗑️ Delete Department' : '⏸️ Deactivate Department'}
//                     </h6>
//                     <button className="btn-close" onClick={() => setConfirmDelete(null)} />
//                   </div>
//                   <div className="modal-body text-center py-3">
//                     <p className="mb-1">
//                       {confirmDelete.type === 'delete'
//                         ? 'Are you sure you want to permanently delete'
//                         : 'Are you sure you want to deactivate'}
//                     </p>
//                     <strong>"{confirmDelete.dept.name}"</strong>?
//                     {confirmDelete.type === 'delete' && (
//                       <p className="text-danger small mt-2 mb-0">
//                         This will also remove all employee assignments.
//                       </p>
//                     )}
//                   </div>
//                   <div className="modal-footer border-0 justify-content-center gap-2">
//                     <button className="btn btn-sm btn-secondary" onClick={() => setConfirmDelete(null)}>
//                       Cancel
//                     </button>
//                     <button
//                       className={`btn btn-sm ${confirmDelete.type === 'delete' ? 'btn-danger' : 'btn-warning'}`}
//                       onClick={() =>
//                         confirmDelete.type === 'delete'
//                           ? handleDelete(confirmDelete.dept)
//                           : handleDeactivate(confirmDelete.dept)
//                       }
//                     >
//                       {confirmDelete.type === 'delete' ? 'Delete' : 'Deactivate'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {/* Form Modal */}
//         <DepartmentFormModal
//           show={showFormModal}
//           editingDept={editingDept}
//           onClose={() => setShowFormModal(false)}
//           onSuccess={() => {
//             setShowFormModal(false);
//             loadDepartments();
//             setToast({ type: 'success', message: editingDept ? 'Department updated' : 'Department created' });
//           }}
//         />

//         {/* Assign Employees Modal */}
//         {showAssignModal && assigningDept && (
//           <AssignEmployeesModal
//             dept={assigningDept}
//             onClose={() => { setShowAssignModal(false); setAssigningDept(null); }}
//             onSuccess={() => {
//               setShowAssignModal(false);
//               loadDepartments();
//               setToast({ type: 'success', message: 'Employees assigned successfully' });
//             }}
//           />
//         )}

//         {/* Toast */}
//         {toast && (
//           <Toast
//             show={true}
//             type={toast.type}
//             message={toast.message}
//             onClose={() => setToast(null)}
//           />
//         )}

//       </div>
//     </div>
//   );
// };

// export default DepartmentsPage;

// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { getDepartments, deactivateDepartment, deleteDepartment } from '../../services/department.api';
// import DepartmentFormModal from '../../components/department/DepartmentFormModal';
// import AssignEmployeesModal from '../../components/department/AssignEmployeesModal';
// import Toast from '../../components/ui/Toast';

// const DepartmentsPage = () => {
//   const { t } = useTranslation();

//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [activeFilter, setActiveFilter] = useState(null);

//   const [showFormModal, setShowFormModal] = useState(false);
//   const [editingDept, setEditingDept] = useState(null);

//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [assigningDept, setAssigningDept] = useState(null);

//   const [toast, setToast] = useState(null);
//   const [confirmDelete, setConfirmDelete] = useState(null); // { id, name, type: 'delete' | 'deactivate' }

//   /* =========================
//      Load
//   ========================= */
//   const loadDepartments = async () => {
//     try {
//       setLoading(true);
//       const res = await getDepartments({ limit: 50 });
//       setDepartments(res.data?.departments || []);
//     } catch {
//       setToast({ type: 'error', message: 'Failed to load departments' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadDepartments();
//   }, []);

//   /* =========================
//      Stats
//   ========================= */
//   const stats = [
//     {
//       label: 'Total Departments',
//       value: departments.length,
//       icon: 'fa-sitemap',
//       color: 'primary',
//       filterKey: null
//     },
//     {
//       label: 'Active',
//       value: departments.filter(d => d.isActive).length,
//       icon: 'fa-check-circle',
//       color: 'success',
//       filterKey: 'active'
//     },
//     {
//       label: 'Inactive',
//       value: departments.filter(d => !d.isActive).length,
//       icon: 'fa-pause-circle',
//       color: 'warning',
//       filterKey: 'inactive'
//     },
//     {
//       label: 'Total Employees',
//       value: departments.reduce((sum, d) => sum + (d.employeeCount || 0), 0),
//       icon: 'fa-users',
//       color: 'info',
//       filterKey: null
//     }
//   ];

//   /* =========================
//      Filter + Search
//   ========================= */
//   const filtered = departments.filter(d => {
//     const matchSearch = !search || d.name?.toLowerCase().includes(search.toLowerCase());
//     const matchFilter =
//       !activeFilter ||
//       (activeFilter === 'active' && d.isActive) ||
//       (activeFilter === 'inactive' && !d.isActive);
//     return matchSearch && matchFilter;
//   });

//   /* =========================
//      Actions
//   ========================= */
//   const handleDeactivate = async (dept) => {
//     try {
//       await deactivateDepartment(dept._id);
//       setToast({ type: 'success', message: 'Department deactivated' });
//       loadDepartments();
//     } catch (err) {
//       setToast({ type: 'error', message: err?.response?.data?.message || 'Failed to deactivate' });
//     } finally {
//       setConfirmDelete(null);
//     }
//   };

//   const handleDelete = async (dept) => {
//     try {
//       await deleteDepartment(dept._id);
//       setToast({ type: 'success', message: 'Department deleted' });
//       loadDepartments();
//     } catch (err) {
//       setToast({ type: 'error', message: err?.response?.data?.message || 'Failed to delete' });
//     } finally {
//       setConfirmDelete(null);
//     }
//   };

//   /* =========================
//      Render
//   ========================= */
//   return (
//     <div className="attendance-policies-page">
//       <div className="container-fluid">

//         {/* Header */}
//         <div className="page-header mb-4">
//           <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
//             <div>
//               <h2 className="page-title mb-1">
//                 <i className="fas fa-sitemap me-2" />
//                 Departments
//               </h2>
//               <p className="page-subtitle mb-0">
//                 Manage company departments and employee assignments
//               </p>
//             </div>
//             <button
//               className="btn btn-primary btn-create"
//               onClick={() => { setEditingDept(null); setShowFormModal(true); }}
//             >
//               <i className="fas fa-plus me-2" />
//               New Department
//             </button>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="row g-3 mb-4">
//           {stats.map((stat, i) => {
//             const isActive = activeFilter === stat.filterKey && stat.filterKey !== null;
//             return (
//               <div key={i} className="col-6 col-lg-3">
//                 <div
//                   className={`stat-card stat-card-${stat.color} ${isActive ? 'stat-card-active' : ''}`}
//                   role={stat.filterKey ? 'button' : undefined}
//                   onClick={() => {
//                     if (!stat.filterKey) return;
//                     setActiveFilter(prev => prev === stat.filterKey ? null : stat.filterKey);
//                   }}
//                 >
//                   <div className="stat-icon">
//                     <i className={`fas ${stat.icon}`} />
//                   </div>
//                   <div className="stat-content">
//                     <div className="stat-value">{stat.value}</div>
//                     <div className="stat-label">{stat.label}</div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Search */}
//         <div className="mb-3">
//           <div className="input-group" style={{ maxWidth: 340 }}>
//             <span className="input-group-text bg-white border-end-0">
//               <i className="fas fa-search text-muted" />
//             </span>
//             <input
//               type="text"
//               className="form-control border-start-0"
//               placeholder="Search departments..."
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//             />
//             {search && (
//               <button className="btn btn-outline-secondary" onClick={() => setSearch('')}>
//                 <i className="fas fa-times" />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Table */}
//         <div className="card border-0 shadow-sm">
//           <div className="card-body p-0">
//             {loading ? (
//               <div className="text-center py-5">
//                 <div className="spinner-border text-primary" />
//                 <p className="mt-2 text-muted">Loading departments...</p>
//               </div>
//             ) : filtered.length === 0 ? (
//               <div className="text-center py-5 text-muted">
//                 <i className="fas fa-sitemap fa-3x mb-3 opacity-25" />
//                 <p>No departments found</p>
//                 <button
//                   className="btn btn-sm btn-outline-primary"
//                   onClick={() => { setEditingDept(null); setShowFormModal(true); }}
//                 >
//                   <i className="fas fa-plus me-1" /> Create First Department
//                 </button>
//               </div>
//             ) : (
//               <div className="table-responsive">
//                 <table className="table table-hover align-middle mb-0">
//                   <thead className="table-light">
//                     <tr>
//                       <th>Department</th>
//                       <th>Branches</th>
//                       <th>Manager</th>
//                       <th className="text-center">Employees</th>
//                       <th className="text-center">Status</th>
//                       <th className="text-center">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filtered.map(dept => (
//                       <tr key={dept._id}>
//                         {/* Name + Description */}
//                         <td>
//                           <div className="fw-semibold">{dept.name}</div>
//                           {dept.description && (
//                             <small className="text-muted">{dept.description}</small>
//                           )}
//                         </td>

//                         {/* Branches */}
//                         <td>
//                           {dept.branches?.length > 0 ? (
//                             <div className="d-flex flex-wrap gap-1">
//                               {dept.branches.map(b => (
//                                 <span key={b._id} className="badge bg-light text-dark border">
//                                   <i className="fas fa-building me-1 text-primary" style={{ fontSize: 10 }} />
//                                   {b.name}
//                                 </span>
//                               ))}
//                             </div>
//                           ) : (
//                             <span className="text-muted small">—</span>
//                           )}
//                         </td>

//                         {/* Manager */}
//                         <td>
//                           {dept.manager ? (
//                             <div className="d-flex align-items-center gap-2">
//                               <div
//                                 className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
//                                 style={{ width: 28, height: 28, fontSize: 12, flexShrink: 0 }}
//                               >
//                                 {dept.manager.name?.[0]?.toUpperCase() || '?'}
//                               </div>
//                               <div>
//                                 <div className="small fw-semibold">{dept.manager.name}</div>
//                                 <div className="text-muted" style={{ fontSize: 11 }}>{dept.manager.email}</div>
//                               </div>
//                             </div>
//                           ) : (
//                             <span className="text-muted small">No manager</span>
//                           )}
//                         </td>

//                         {/* Employee Count */}
//                         <td className="text-center">
//                           <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1">
//                             <i className="fas fa-users me-1" style={{ fontSize: 10 }} />
//                             {dept.employeeCount || 0}
//                           </span>
//                         </td>

//                         {/* Status */}
//                         <td className="text-center">
//                           {dept.isActive ? (
//                             <span className="badge bg-success-subtle text-success">
//                               <i className="fas fa-circle me-1" style={{ fontSize: 8 }} />
//                               Active
//                             </span>
//                           ) : (
//                             <span className="badge bg-secondary-subtle text-secondary">
//                               <i className="fas fa-circle me-1" style={{ fontSize: 8 }} />
//                               Inactive
//                             </span>
//                           )}
//                         </td>

//                         {/* Actions */}
//                         <td className="text-center">
//                           <div className="d-flex justify-content-center gap-1">
//                             {/* Assign Employees */}
//                             <button
//                               className="btn btn-sm btn-outline-info"
//                               title="Assign Employees"
//                               onClick={() => { setAssigningDept(dept); setShowAssignModal(true); }}
//                             >
//                               <i className="fas fa-user-plus" />
//                             </button>

//                             {/* Edit */}
//                             <button
//                               className="btn btn-sm btn-outline-primary"
//                               title="Edit"
//                               onClick={() => { setEditingDept(dept); setShowFormModal(true); }}
//                             >
//                               <i className="fas fa-edit" />
//                             </button>

//                             {/* Deactivate (soft delete) */}
//                             {dept.isActive && (
//                               <button
//                                 className="btn btn-sm btn-outline-warning"
//                                 title="Deactivate"
//                                 onClick={() => setConfirmDelete({ dept, type: 'deactivate' })}
//                               >
//                                 <i className="fas fa-pause" />
//                               </button>
//                             )}

//                             {/* Hard Delete */}
//                             <button
//                               className="btn btn-sm btn-outline-danger"
//                               title="Delete"
//                               onClick={() => setConfirmDelete({ dept, type: 'delete' })}
//                             >
//                               <i className="fas fa-trash" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Confirm Modal */}
//         {confirmDelete && (
//           <>
//             <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} onClick={() => setConfirmDelete(null)} />
//             <div className="modal fade show d-block" style={{ zIndex: 1055 }}>
//               <div className="modal-dialog modal-dialog-centered modal-sm">
//                 <div className="modal-content">
//                   <div className="modal-header border-0">
//                     <h6 className="modal-title">
//                       {confirmDelete.type === 'delete' ? '🗑️ Delete Department' : '⏸️ Deactivate Department'}
//                     </h6>
//                     <button className="btn-close" onClick={() => setConfirmDelete(null)} />
//                   </div>
//                   <div className="modal-body text-center py-3">
//                     <p className="mb-1">
//                       {confirmDelete.type === 'delete'
//                         ? 'Are you sure you want to permanently delete'
//                         : 'Are you sure you want to deactivate'}
//                     </p>
//                     <strong>"{confirmDelete.dept.name}"</strong>?
//                     {confirmDelete.type === 'delete' && (
//                       <p className="text-danger small mt-2 mb-0">
//                         This will also remove all employee assignments.
//                       </p>
//                     )}
//                   </div>
//                   <div className="modal-footer border-0 justify-content-center gap-2">
//                     <button className="btn btn-sm btn-secondary" onClick={() => setConfirmDelete(null)}>
//                       Cancel
//                     </button>
//                     <button
//                       className={`btn btn-sm ${confirmDelete.type === 'delete' ? 'btn-danger' : 'btn-warning'}`}
//                       onClick={() =>
//                         confirmDelete.type === 'delete'
//                           ? handleDelete(confirmDelete.dept)
//                           : handleDeactivate(confirmDelete.dept)
//                       }
//                     >
//                       {confirmDelete.type === 'delete' ? 'Delete' : 'Deactivate'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {/* Form Modal */}
//         <DepartmentFormModal
//           show={showFormModal}
//           editingDept={editingDept}
//           onClose={() => setShowFormModal(false)}
//           onSuccess={() => {
//             setShowFormModal(false);
//             loadDepartments();
//             setToast({ type: 'success', message: editingDept ? 'Department updated' : 'Department created' });
//           }}
//         />

//         {/* Assign Employees Modal */}
//         {showAssignModal && assigningDept && (
//           <AssignEmployeesModal
//             dept={assigningDept}
//             onClose={() => { setShowAssignModal(false); setAssigningDept(null); }}
//             onSuccess={() => {
//               setShowAssignModal(false);
//               loadDepartments();
//               setToast({ type: 'success', message: 'Employees assigned successfully' });
//             }}
//           />
//         )}

//         {/* Toast */}
//         {toast && (
//           <Toast
//             show={true}
//             type={toast.type}
//             message={toast.message}
//             onClose={() => setToast(null)}
//           />
//         )}

//       </div>
//     </div>
//   );
// };

// export default DepartmentsPage;

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRegisterOverlay } from '../../helpers/keyboardActions';

import { getDepartments, deactivateDepartment, reactivateDepartment, deleteDepartment } from '../../services/department.api';
import DepartmentFormModal from '../../components/department/DepartmentFormModal';
import AssignEmployeesModal from '../../components/department/AssignEmployeesModal';
import Toast from '../../components/ui/Toast';

const DepartmentsPage = () => {
  const { t } = useTranslation();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningDept, setAssigningDept] = useState(null);

  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);


  //closeFormModal
  const closeFormModal = () => {
  setShowFormModal(false);
};

useRegisterOverlay(showFormModal, closeFormModal);


// closeAssignModal
const closeAssignModal = () => {
  setShowAssignModal(false);
  setAssigningDept(null);
};

useRegisterOverlay(showAssignModal, closeAssignModal);



  /* =========================
     Load
  ========================= */
  const loadDepartments = async () => {
    try {
      setLoading(true);
      const res = await getDepartments({ limit: 50 });
      console.table(res.data.departments);

      setDepartments(res.data?.departments || []);
    } catch {
      setToast({ type: 'error', message: 'Failed to load departments' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  /* =========================
     Stats
  ========================= */
  const stats = [
    {
      label: 'Total Departments',
      value: departments.length,
      icon: 'fa-sitemap',
      color: 'primary',
      filterKey: null
    },
    {
      label: 'Active',
      value: departments.filter(d => d.isActive).length,
      icon: 'fa-check-circle',
      color: 'success',
      filterKey: 'active'
    },
    {
      label: 'Inactive',
      value: departments.filter(d => !d.isActive).length,
      icon: 'fa-pause-circle',
      color: 'warning',
      filterKey: 'inactive'
    },
    {
      label: 'Total Employees',
      value: departments.reduce((sum, d) => sum + (d.employeeCount || 0), 0),
      icon: 'fa-users',
      color: 'info',
      filterKey: null
    }
  ];

  /* =========================
     Filter + Search
  ========================= */
  const filtered = departments.filter(d => {
    const matchSearch = !search || d.name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      !activeFilter ||
      (activeFilter === 'active' && d.isActive) ||
      (activeFilter === 'inactive' && !d.isActive);
    return matchSearch && matchFilter;
  });

  /* =========================
     Actions
  ========================= */
  const handleToggleActive = async (dept, type) => {
    try {
      if (type === 'deactivate') {
        await deactivateDepartment(dept._id);
        setToast({ type: 'success', message: 'Department deactivated' });
      } else if (type === 'reactivate') {
        await reactivateDepartment(dept._id);
        setToast({ type: 'success', message: 'Department reactivated' });
      }
      loadDepartments();
    } catch (err) {
      setToast({ type: 'error', message: err?.response?.data?.message || 'Failed' });
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleDelete = async (dept) => {
    try {
      await deleteDepartment(dept._id);
      setToast({ type: 'success', message: 'Department deleted' });
      loadDepartments();
    } catch (err) {
      setToast({ type: 'error', message: err?.response?.data?.message || 'Failed to delete' });
    } finally {
      setConfirmDelete(null);
    }
  };

  /* =========================
     Confirm Modal helpers
  ========================= */
  const confirmTitle = {
    delete: '🗑️ Delete Department',
    deactivate: '⏸️ Deactivate Department',
    reactivate: '▶️ Reactivate Department'
  };

  const confirmBody = {
    delete: 'Are you sure you want to permanently delete',
    deactivate: 'Are you sure you want to deactivate',
    reactivate: 'Are you sure you want to reactivate'
  };

  const confirmBtnClass = {
    delete: 'btn-danger',
    deactivate: 'btn-warning',
    reactivate: 'btn-success'
  };

  const confirmBtnLabel = {
    delete: 'Delete',
    deactivate: 'Deactivate',
    reactivate: 'Reactivate'
  };

  /* =========================
     Render
  ========================= */
  return (
    <div className="attendance-policies-page">
      <div className="container-fluid">

        {/* Header */}
        <div className="page-header mb-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="page-title mb-1">
                <i className="fas fa-sitemap me-2" />
                Departments
              </h2>
              <p className="page-subtitle mb-0">
                Manage company departments and employee assignments
              </p>
            </div>
            <button
              className="btn btn-primary btn-create"
              onClick={() => { setEditingDept(null); setShowFormModal(true); }}
            >
              <i className="fas fa-plus me-2" />
              New Department
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4">
          {stats.map((stat, i) => {
            const isActive = activeFilter === stat.filterKey && stat.filterKey !== null;
            return (
              <div key={i} className="col-6 col-lg-3">
                <div
                  className={`stat-card stat-card-${stat.color} ${isActive ? 'stat-card-active' : ''}`}
                  role={stat.filterKey ? 'button' : undefined}
                  onClick={() => {
                    if (!stat.filterKey) return;
                    setActiveFilter(prev => prev === stat.filterKey ? null : stat.filterKey);
                  }}
                >
                  <div className="stat-icon">
                    <i className={`fas ${stat.icon}`} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search */}
        <div className="mb-3">
          <div className="input-group" style={{ maxWidth: 340 }}>
            <span className="input-group-text bg-white border-end-0 ">
              <i className="fas fa-search text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search departments..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="btn btn-outline-secondary" onClick={() => setSearch('')}>
                <i className="fas fa-times" />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" />
                <p className="mt-2 text-muted">Loading departments...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="fas fa-sitemap fa-3x mb-3 opacity-25" />
                <p>No departments found</p>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => { setEditingDept(null); setShowFormModal(true); }}
                >
                  <i className="fas fa-plus me-1" /> Create First Department
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Department</th>
                      <th>Branches</th>
                      <th>Manager</th>
                      <th className="text-center">Employees</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(dept => (
                      <tr key={dept._id} className={!dept.isActive ? 'table-secondary opacity-75' : ''}>

                        {/* Name + Description */}
                        <td>
                          <div className="fw-semibold">{dept.name}</div>
                          {dept.description && (
                            <small className="text-muted">{dept.description}</small>
                          )}
                        </td>

                        {/* Branches */}
                        <td>
                          {dept.branches?.length > 0 ? (
                            <div className="d-flex flex-wrap gap-1">
                              {dept.branches.map(b => (
                                <span key={b._id} className="badge bg-light text-dark border">
                                  <i className="fas fa-building me-1 text-primary" style={{ fontSize: 10 }} />
                                  {b.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted small">—</span>
                          )}
                        </td>

                        {/* Manager */}
                        <td>
                          {dept.manager ? (
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className="rounded-circle bg-primary text-muted d-flex align-items-center justify-content-center"
                                style={{ width: 28, height: 28, fontSize: 12, flexShrink: 0 }}
                              >
                                {dept.manager.name?.[0]?.toUpperCase() || '?'}
                              </div>
                              <div>
                                <div className="small fw-semibold">{dept.manager.name}</div>
                                <div className="text-muted" style={{ fontSize: 11 }}>{dept.manager.email}</div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted small">No manager</span>
                          )}
                        </td>

                        {/* Employee Count */}
                        <td className="text-center">
                          <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1">
                            <i className="fas fa-users me-1" style={{ fontSize: 10 }} />
                            {dept.employeeCount || 0}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="text-center">
                          {dept.isActive ? (
                            <span className="badge bg-success-subtle text-success">
                              <i className="fas fa-circle me-1" style={{ fontSize: 8 }} />
                              Active
                            </span>
                          ) : (
                            <span className="badge bg-secondary-subtle text-secondary">
                              <i className="fas fa-circle me-1" style={{ fontSize: 8 }} />
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-1">

                            {/* Assign Employees */}
                            <button
                              className="btn btn-sm btn-outline-info"
                              title="Assign Employees"
                              onClick={() => { setAssigningDept(dept); setShowAssignModal(true); }}
                            >
                              <i className="fas fa-user-plus" />
                            </button>

                            {/* Edit */}
                            <button
                              className="btn btn-sm btn-outline-primary"
                              title="Edit"
                              onClick={() => { setEditingDept(dept); setShowFormModal(true); }}
                            >
                              <i className="fas fa-edit" />
                            </button>

                            {/* Deactivate / Reactivate */}
                            <button
                              className={`btn btn-sm ${dept.isActive ? 'btn-outline-warning' : 'btn-outline-success'}`}
                              title={dept.isActive ? 'Deactivate' : 'Reactivate'}
                              onClick={() => setConfirmDelete({
                                dept,
                                type: dept.isActive ? 'deactivate' : 'reactivate'
                              })}
                            >
                              <i className={`fas fa-${dept.isActive ? 'pause' : 'play'}`} />
                            </button>

                            {/* Hard Delete */}
                            <button
                              className="btn btn-sm btn-outline-danger"
                              title="Delete"
                              onClick={() => setConfirmDelete({ dept, type: 'delete' })}
                            >
                              <i className="fas fa-trash" />
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Confirm Modal */}
        {confirmDelete && (
          <>
            <div
              className="modal-backdrop fade show"
              style={{ zIndex: 1050 }}
              onClick={() => setConfirmDelete(null)}
            />
            <div className="modal fade show d-block" style={{ zIndex: 1055 }}>
              <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content">

                  <div className="modal-header border-0">
                    <h6 className="modal-title">
                      {confirmTitle[confirmDelete.type]}
                    </h6>
                    <button className="btn-close" onClick={() => setConfirmDelete(null)} />
                  </div>

                  <div className="modal-body text-center py-3">
                    <p className="mb-1">{confirmBody[confirmDelete.type]}</p>
                    <strong>"{confirmDelete.dept.name}"</strong>?
                    {confirmDelete.type === 'delete' && (
                      <p className="text-danger small mt-2 mb-0">
                        This will also remove all employee assignments.
                      </p>
                    )}
                  </div>

                  <div className="modal-footer border-0 justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setConfirmDelete(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className={`btn btn-sm ${confirmBtnClass[confirmDelete.type]}`}
                      onClick={() =>
                        confirmDelete.type === 'delete'
                          ? handleDelete(confirmDelete.dept)
                          : handleToggleActive(confirmDelete.dept, confirmDelete.type)
                      }
                    >
                      {confirmBtnLabel[confirmDelete.type]}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </>
        )}

        {/* Form Modal */}
        <DepartmentFormModal
          show={showFormModal}
          editingDept={editingDept}
          // onClose={() => setShowFormModal(false)}
          onClose={closeFormModal}

          onSuccess={() => {
            // setShowFormModal(false);
            closeFormModal();
            loadDepartments();
            setToast({ type: 'success', message: editingDept ? 'Department updated' : 'Department created' });
          }}
        />

        {/* Assign Employees Modal */}
        {showAssignModal && assigningDept && (
          <AssignEmployeesModal
            dept={assigningDept}
            // onClose={() => { setShowAssignModal(false);
            //    setAssigningDept(null); }}
            
            onClose={closeAssignModal}

            onSuccess={() => {
              // setShowAssignModal(false);
               closeAssignModal();
              loadDepartments();
              setToast({ type: 'success', message: 'Employees assigned successfully' });
            }}
          />
        )}

        {/* Toast */}
        {toast && (
          <Toast
            show={true}
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

      </div>
    </div>
  );
};

export default DepartmentsPage;