// import { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiPut } from '../../helpers/api';

// const toInputDateTimeLocal = (value) => {
//   if (!value) return '';
//   const d = new Date(value);
//   const pad = (n) => n.toString().padStart(2, '0');
//   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
// };

// const formatTime = (value) => {
//   if (!value) return '—';
//   return new Date(value).toLocaleTimeString('en-US', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true
//   });
// };

// const EmployeeAttendanceDetailsModal = ({
//   show,
//   loading,
//   records = [],
//   user,
//   date,
//   isAdmin = false,
//   onClose,
//   onSaved
// }) => {
//   const { t } = useTranslation();
//   const [editingId, setEditingId] = useState(null);
//   const [form, setForm] = useState({});
//   const [saving, setSaving] = useState(false);
//   const [localRecords, setLocalRecords] = useState([]);

//   useEffect(() => {
//     setLocalRecords(records || []);
//   }, [records]);

//   if (!show) return null;

//   const startEdit = (rec) => {
//     setEditingId(rec._id);
//     setForm({
//       checkInTime: toInputDateTimeLocal(rec.checkInTime),
//       checkOutTime: toInputDateTimeLocal(rec.checkOutTime),
//       invalidated: !!rec.invalidated,
//       notes: rec.notes || ''
//     });
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setForm({});
//   };

//   const saveEdit = async (id) => {
//     try {
//       setSaving(true);
//       await apiPut(`/admin/attendance/${id}`, {
//         checkInTime: form.checkInTime ? new Date(form.checkInTime).toISOString() : null,
//         checkOutTime: form.checkOutTime ? new Date(form.checkOutTime).toISOString() : null,
//         invalidated: form.invalidated,
//         notes: form.notes.trim()
//       });
//       setEditingId(null);
//       onSaved?.();
//     } catch (e) {
//       alert(t('error'));
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="modal fade show d-block" style={{ background: '#00000066' }}>
//       <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
//         <div className="modal-content">

//           {/* Header */}
//           <div className="modal-header bg-primary text-white">
//             <h5 className="modal-title">
//               {user?.name} – {new Date(date).toLocaleDateString()}
//             </h5>
//             <button className="btn-close btn-close-white" onClick={onClose} />
//           </div>

//           {/* Body */}
//           <div className="modal-body">
//             {loading ? (
//               <div className="text-center py-5">
//                 <div className="spinner-border text-primary" />
//               </div>
//             ) : localRecords.length === 0 ? (
//               <div className="text-center text-muted py-4">
//                 {t('noAttendanceForDay')}
//               </div>
//             ) : (
//               <div className="table-responsive">
//                 <table className="table table-bordered align-middle">
//                   <thead className="table-light">
//                     <tr>
//                       <th>{t('branch')}</th>
//                       <th>{t('checkIn')}</th>
//                       <th>{t('checkOut')}</th>
//                       <th>{t('late')}</th>
//                       <th>{t('earlyLeave')}</th>
//                       <th>{t('notes')}</th>
//                       {isAdmin && <th className="text-center">{t('actions')}</th>}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {localRecords.map((rec) => {
//                       const isEditing = editingId === rec._id;
//                       return (
//                         <tr key={rec._id} className={rec.invalidated ? 'table-danger' : ''}>
//                           <td>{rec.branch?.name || '—'}</td>

//                           <td>
//                             {isEditing ? (
//                               <input
//                                 type="datetime-local"
//                                 className="form-control form-control-sm"
//                                 value={form.checkInTime}
//                                 onChange={(e) => setForm({ ...form, checkInTime: e.target.value })}
//                               />
//                             ) : formatTime(rec.checkInTime)}
//                           </td>

//                           <td>
//                             {isEditing ? (
//                               <input
//                                 type="datetime-local"
//                                 className="form-control form-control-sm"
//                                 value={form.checkOutTime}
//                                 onChange={(e) => setForm({ ...form, checkOutTime: e.target.value })}
//                               />
//                             ) : formatTime(rec.checkOutTime)}
//                           </td>

//                           <td className="text-warning">
//                             {rec.lateMinutes ? `${rec.lateMinutes} ${t('minutes')}` : '—'}
//                           </td>

//                           <td className="text-danger">
//                             {rec.earlyLeaveMinutes ? `${rec.earlyLeaveMinutes} ${t('minutes')}` : '—'}
//                           </td>

//                           <td>
//                             {isEditing ? (
//                               <>
//                                 <textarea
//                                   className="form-control form-control-sm mb-2"
//                                   rows="2"
//                                   value={form.notes}
//                                   onChange={(e) => setForm({ ...form, notes: e.target.value })}
//                                 />
//                                 <div className="form-check">
//                                   <input
//                                     className="form-check-input"
//                                     type="checkbox"
//                                     checked={form.invalidated}
//                                     onChange={(e) => setForm({ ...form, invalidated: e.target.checked })}
//                                   />
//                                   <label className="form-check-label">
//                                     {t('invalidateRecord')}
//                                   </label>
//                                 </div>
//                               </>
//                             ) : (
//                               <span className="text-muted">{rec.notes || '—'}</span>
//                             )}
//                           </td>

//                           {isAdmin && (
//                             <td className="text-center">
//                               {isEditing ? (
//                                 <>
//                                   <button
//                                     className="btn btn-sm btn-success me-2"
//                                     disabled={saving}
//                                     onClick={() => saveEdit(rec._id)}
//                                   >
//                                     {t('save')}
//                                   </button>
//                                   <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>
//                                     {t('cancel')}
//                                   </button>
//                                 </>
//                               ) : (
//                                 <button
//                                   className="btn btn-sm btn-outline-primary"
//                                   onClick={() => startEdit(rec)}
//                                 >
//                                   {t('edit')}
//                                 </button>
//                               )}
//                             </td>
//                           )}
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="modal-footer">
//             <button className="btn btn-secondary" onClick={onClose}>
//               {t('close')}
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeAttendanceDetailsModal;



















// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// // import { apiGet, apiPut, apiPost } from '../../helpers/api';

// import {
//   // adminUpdateAttendance,
//   createManualAttendance
// } from '../../services/admin.api';

// import { adminUpdateAttendance} from '../../services/attendance.api';

// import { getUserBranches } from '../../services/branch.api';

// const toInputDateTimeLocal = (value) => {
//   if (!value) return '';
//   const d = new Date(value);
//   const pad = (n) => String(n).padStart(2, '0');
//   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
// };

// const formatTime = (value) => {
//   if (!value) return '—';
//   return new Date(value).toLocaleTimeString('en-US', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true
//   });
// };

// const EmployeeAttendanceDetailsModal = ({
//   show,
//   loading,
//   records = [],
//    transits = [],
//   user,
//   date,
//   isAdmin = false,
//   onClose,
//   onSaved
// }) => {
//   const { t } = useTranslation();

//   const [editingId, setEditingId] = useState(null);
//   const [form, setForm] = useState({});
//   const [saving, setSaving] = useState(false);
// const [showCreate, setShowCreate] = useState(false);
// const [createForm, setCreateForm] = useState({
//   branchId: '',
//   checkInTime: '',
//   checkOutTime: '',
//   invalidated: false,
//   notes: ''
// });
// const [availableBranches, setAvailableBranches] = useState([]);
// const [loadingBranches, setLoadingBranches] = useState(false);




// useEffect(() => {
//   if (!show || !isAdmin || !user?._id) return;

//   const loadBranches = async () => {
//     try {
//       setLoadingBranches(true);

//      const res = await getUserBranches(user._id);


//       setAvailableBranches(res.data?.data || []);
//     } catch (e) {
//       setAvailableBranches([]);
//     } finally {
//       setLoadingBranches(false);
//     }
//   };

//   loadBranches();
// }, [show, isAdmin, user?._id]);

// useEffect(() => {
//   if (availableBranches.length === 1) {
//     setCreateForm(f => ({
//       ...f,
//       branchId: availableBranches[0]._id
//     }));
//   }
// }, [availableBranches]);

//   useEffect(() => {
//     setEditingId(null);
//     setForm({});
//   }, [records]);

//   if (!show) return null;

//   const startEdit = (rec) => {
//     setEditingId(rec._id);
//     setForm({
//       checkInTime: toInputDateTimeLocal(rec.checkInTime),
//       checkOutTime: toInputDateTimeLocal(rec.checkOutTime),
//       invalidated: !!rec.invalidated,
//       notes: rec.notes || ''
//     });
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setForm({});
//   };

//   const saveEdit = async (id) => {
//     try {
//       setSaving(true);

//      await adminUpdateAttendance(id, {
//   checkInTime: form.checkInTime
//     ? new Date(form.checkInTime).toISOString()
//     : null,
//   checkOutTime: form.checkOutTime
//     ? new Date(form.checkOutTime).toISOString()
//     : null,
//   invalidated: form.invalidated,
//   notes: String(form.notes || '').trim()
// });

//       setEditingId(null);
//       onSaved?.();
//     } catch (err) {
//       console.error(err);
//       alert(t('error'));
//     } finally {
//       setSaving(false);
//     }
//   };
// const handleCreateAttendance = async () => {
//   if (!createForm.branchId) return;

//   try {
// await createManualAttendance({
//   userId: user._id,
//   branchId: createForm.branchId,
//   date: new Date(date).toISOString().slice(0, 10),
//   checkInTime: createForm.checkInTime
//     ? new Date(createForm.checkInTime).toISOString()
//     : null,
//   checkOutTime: createForm.checkOutTime
//     ? new Date(createForm.checkOutTime).toISOString()
//     : null,
//   invalidated: createForm.invalidated,
//   notes: createForm.notes
// });

//     setShowCreate(false);
//     setCreateForm({
//      branchId:
//         availableBranches.length === 1
//           ? availableBranches[0]._id
//           : '',
//       checkInTime: '',
//       checkOutTime: '',
//       invalidated: false,
//       notes: ''
//     });

//     onSaved?.();

//   } catch (err) {
//     console.error(err);
//     alert(t('errorSaving'));
//   }
// };



//   return (
//     <div className="modal fade show d-block" style={{ background: '#00000066' }}>
//       <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
//         <div className="modal-content">

//           {/* Header */}
//           <div className="modal-header bg-dark text-white">
//             <h5 className="modal-title">
//               {user?.name} — {new Date(date).toLocaleDateString()}
//             </h5>
//             <button className="btn-close btn-close-white" onClick={onClose} />
//           </div>

//           {/* Body */}
//           <div className="modal-body">
//                   {isAdmin && showCreate && (
//   <div className="card border-success mb-4 shadow-sm">
//     <div className="card-header bg-success text-white fw-bold">
//       <i className="fas fa-plus-circle me-2" />
//       {t('addManualAttendance')}
//     </div>

//     <div className="card-body">
//       <div className="row g-3">

//         {/* Branch */}
//         <div className="col-md-4">
//           <label className="form-label">{t('branch')}</label>
//           <select
//             className="form-select"
//             value={createForm.branchId}
//             onChange={(e) =>
//               setCreateForm({ ...createForm, branchId: e.target.value })
//             }
//             disabled={loadingBranches}
//           >
//             <option value="">
//               {loadingBranches ? t('loading') : t('selectBranch')}
//             </option>
//             {availableBranches.map(b => (
//               <option key={b._id} value={b._id}>
//                 {b.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Check-in */}
//         <div className="col-md-4">
//           <label className="form-label">{t('checkIn')}</label>
//           <input
//             type="datetime-local"
//             className="form-control"
//             value={createForm.checkInTime}
//             onChange={(e) =>
//               setCreateForm({ ...createForm, checkInTime: e.target.value })
//             }
//           />
//         </div>

//         {/* Check-out */}
//         <div className="col-md-4">
//           <label className="form-label">{t('checkOut')}</label>
//           <input
//             type="datetime-local"
//             className="form-control"
//             value={createForm.checkOutTime}
//             onChange={(e) =>
//               setCreateForm({ ...createForm, checkOutTime: e.target.value })
//             }
//           />
//         </div>
// {/* Invalidated */}
// <div className="col-md-12">
//   <div className="form-check mt-2">
//     <input
//       className="form-check-input"
//       type="checkbox"
//       id="create-invalidated"
//       checked={createForm.invalidated}
//       onChange={(e) =>
//         setCreateForm({
//           ...createForm,
//           invalidated: e.target.checked
//         })
//       }
//     />
//     <label
//       className="form-check-label"
//       htmlFor="create-invalidated"
//     >
//       <i className="fas fa-ban me-1 text-danger" />
//       {t('invalidateRecord')}
//     </label>
//   </div>
// </div>

//         {/* Notes */}
//         <div className="col-md-12">
//           <label className="form-label">{t('notes')}</label>
//           <textarea
//             className="form-control"
//             rows="2"
//             value={createForm.notes}
//             onChange={(e) =>
//               setCreateForm({ ...createForm, notes: e.target.value })
//             }
//           />
//         </div>
//       </div>

//       <div className="mt-4 d-flex gap-2">
//         <button
//           className="btn btn-success"
//           onClick={handleCreateAttendance}
//           disabled={!createForm.branchId}
//         >
//           <i className="fas fa-check me-2" />
//           {t('save')}
//         </button>

//         <button
//           className="btn btn-outline-secondary"
//           onClick={() => setShowCreate(false)}
//         >
//           {t('cancel')}
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//             {loading ? (
//               <div className="text-center py-5">
//                 <div className="spinner-border text-primary" />
//               </div>
//             ) : records.length === 0 && !showCreate ? (
//               <div className="text-center text-muted py-4">
//                 {t('noAttendanceForDay')}
//               </div>
//             ) : (

              
//               <div className="table-responsive">
         

//                 <table className="table table-bordered align-middle">
//                   <thead className="table-light">
//                     <tr>
//                       <th>{t('branch')}</th>
//                       <th>{t('checkIn')}</th>
//                       <th>{t('checkOut')}</th>
//                       <th>{t('late')}</th>
//                       <th>{t('earlyLeave')}</th>
//                       <th>{t('notes')}</th>
//                       {isAdmin && <th className="text-center">{t('actions')}</th>}
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {records.map((rec) => {
//                       const isEditing = editingId === rec._id;

//                       return (
//                         <tr
//                           key={rec._id}
//                           className={rec.invalidated ? 'table-danger' : ''}
//                         >
//                           <td>{rec.branch?.name || '—'}</td>

//                           <td>
//                             {isEditing ? (
//                               <input
//                                 type="datetime-local"
//                                 className="form-control form-control-sm"
//                                 value={form.checkInTime}
//                                 onChange={(e) =>
//                                   setForm({ ...form, checkInTime: e.target.value })
//                                 }
//                               />
//                             ) : (
//                               formatTime(rec.checkInTime)
//                             )}
//                           </td>

//                           <td>
//                             {isEditing ? (
//                               <input
//                                 type="datetime-local"
//                                 className="form-control form-control-sm"
//                                 value={form.checkOutTime}
//                                 onChange={(e) =>
//                                   setForm({ ...form, checkOutTime: e.target.value })
//                                 }
//                               />
//                             ) : (
//                               formatTime(rec.checkOutTime)
//                             )}
//                           </td>

//                           <td className="text-warning">
//                             {rec.lateMinutes
//                               ? `${rec.lateMinutes} ${t('minutes')}`
//                               : '—'}
//                           </td>

//                           <td className="text-danger">
//                             {rec.earlyLeaveMinutes
//                               ? `${rec.earlyLeaveMinutes} ${t('minutes')}`
//                               : '—'}
//                           </td>

//                           <td>
//                             {isEditing ? (
//                               <>
//                                 <textarea
//                                   className="form-control form-control-sm mb-2"
//                                   rows="2"
//                                   value={form.notes}
//                                   onChange={(e) =>
//                                     setForm({ ...form, notes: e.target.value })
//                                   }
//                                 />
//                                 <div className="form-check">
//                                   <input
//                                     className="form-check-input"
//                                     type="checkbox"
//                                     checked={form.invalidated}
//                                     onChange={(e) =>
//                                       setForm({
//                                         ...form,
//                                         invalidated: e.target.checked
//                                       })
//                                     }
//                                   />
//                                   <label className="form-check-label">
//                                     {t('invalidateRecord')}
//                                   </label>
//                                 </div>
//                               </>
//                             ) : (
//                               <span className="text-muted">
//                                 {rec.notes || '—'}
//                               </span>
//                             )}
//                           </td>

//                           {isAdmin && (
//                             <td className="text-center">
//                               {isEditing ? (
//                                 <>
//                                   <button
//                                     className="btn btn-sm btn-success me-2"
//                                     disabled={saving}
//                                     onClick={() => saveEdit(rec._id)}
//                                   >
//                                     {t('save')}
//                                   </button>
//                                   <button
//                                     className="btn btn-sm btn-secondary"
//                                     onClick={cancelEdit}
//                                   >
//                                     {t('cancel')}
//                                   </button>
//                                 </>
//                               ) : (
//                                 <button
//                                   className="btn btn-sm btn-outline-primary"
//                                   onClick={() => startEdit(rec)}
//                                 >
//                                   {t('edit')}
//                                 </button>
//                               )}
//                             </td>
//                           )}
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//                 {isAdmin && transits.length > 0 && (
//   <div className="mt-4">
//     <h6 className="fw-semibold text-muted mb-2">
//       Transit Details
//     </h6>

//     <div className="table-responsive">
//       <table className="table table-sm table-bordered">
//         <thead className="table-light">
//           <tr>
//             <th>From</th>
//             <th>To</th>
//             <th>Gap (min)</th>
//             <th>Deduction (min)</th>
//           </tr>
//         </thead>
//         <tbody>
//           {transits.map((t, i) => (
//             <tr key={i}>
//               <td>{t.fromBranchName}</td>
//               <td>{t.toBranchName}</td>
//               <td>{t.gapMinutes}</td>
//               <td className="text-danger fw-semibold">
//                 {t.deductionMinutes}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </div>
// )}

//               </div>
//             )}
            
//           </div>

//           {/* Footer */}
//          <div className="modal-footer attendance-modal-footer d-flex justify-content-between">
  
// {isAdmin && (
//   <button
//     type="button"
//     className="btn btn-lg btn-success rounded-pill px-4 shadow-sm"
//     onClick={() => setShowCreate(true)}
//   >
//     <i className="fas fa-plus-circle me-2" />
//     {t('addAttendance')}
//   </button>
// )}


//   <button
//     type="button"
//     className="btn btn-lg btn-danger rounded-pill px-5 shadow-sm"
//     onClick={onClose}
//   >
//     <i className="fas fa-times-circle me-2" />
//     {t('close')}
//   </button>

// </div>


//         </div>
//       </div>
//     </div>
    
//   );
// };

// export default EmployeeAttendanceDetailsModal;


























//no need استخدمنا الفايل المشترك في جدول الكبير 
//-------------------------------------------------------------ui 1 
// أضيفي الـ import ده
import { createPortal } from 'react-dom';

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { adminUpdateAttendance } from '../../services/attendance.api';
import { createManualAttendance } from '../../services/admin.api';
import { getUserBranches }        from '../../services/branch.api';

import "/src/style/attendanceProfile.css";

/* ══════════════════════════════════════════════════════════════
   EmployeeAttendanceDetailsModal
   ─────────────────────────────────────────────────────────────
   ✅ records   — raw Attendance[]        from getAttendanceDayDetails
   ✅ transits  — DailyAttendanceSummary.transits[]
   ✅ summary   — DailyAttendanceSummary fields (times, penalties)
   ✅ Edit      — PUT  /admin/attendance/:id   via adminUpdateAttendance
   ✅ Create    — POST /admin/attendance/manual via createManualAttendance
   ✅ Branches  — GET  /branches/user/:id      via getUserBranches
   ✅ onSaved() — parent re-fetches (cache bust handled upstream)
   ✅ Zero front-end calculation
══════════════════════════════════════════════════════════════ */

/* ── Helpers ─────────────────────────────────────────────────*/
const toInputDTL = (value) => {
  if (!value) return '';
  const d = new Date(value);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

const formatTime = (value) =>
  value
    ? new Date(value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    : '—';

const formatDateLong = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : '';


/* ════════════════════════════════════════════════════════════
   Main component
════════════════════════════════════════════════════════════ */
function EmployeeAttendanceDetailsModal({
  show,
  loading,
  records  = [],     // raw Attendance[] from getAttendanceDayDetails
  transits = [],     // DailyAttendanceSummary.transits[]
  summary  = null,   // DailyAttendanceSummary fields
  user,
  date,              // "yyyy-mm-dd"
  isAdmin  = false,
  onClose,
  onSaved,           // () => void — parent re-fetches with bust
}) {
  const { t } = useTranslation();

  /* ── Edit state ──────────────────────────────────────────── */
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState({});
  const [saving, setSaving]       = useState(false);

  /* ── Create state ────────────────────────────────────────── */
  const [showCreate, setShowCreate]   = useState(false);
  const [createForm, setCreateForm]   = useState({
    branchId: '', checkInTime: '', checkOutTime: '', invalidated: false, notes: '',
  });
  const [creating, setCreating]       = useState(false);
  const [createError, setCreateError] = useState('');

  /* ── Branches ────────────────────────────────────────────── */
  const [branches, setBranches]               = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);

  /* ── Fetch branches (getUserBranches from branch.api) ──── */
  const fetchBranches = useCallback(async () => {
    if (!user?._id) return;
    try {
      setLoadingBranches(true);
      const res  = await getUserBranches(user._id);
      const list = res.data?.data || [];
      setBranches(list);
      if (list.length === 1) {
        setCreateForm((f) => ({ ...f, branchId: list[0]._id }));
      }
    } catch {
      setBranches([]);
    } finally {
      setLoadingBranches(false);
    }
  }, [user?._id]);

  useEffect(() => {
    if (show && isAdmin) fetchBranches();
  }, [show, isAdmin, fetchBranches]);

  /* Reset on close */
  useEffect(() => {
    if (!show) {
      setEditingId(null);
      setForm({});
      setShowCreate(false);
      setCreateError('');
    }
  }, [show]);

  /* Reset inline edit when records refresh */
  useEffect(() => {
    setEditingId(null);
    setForm({});
  }, [records]);

  if (!show) return null;

  /* ── Edit ─────────────────────────────────────────────────*/
  const startEdit = (rec) => {
    setEditingId(rec._id);
    setForm({
      checkInTime:  toInputDTL(rec.checkInTime),
      checkOutTime: toInputDTL(rec.checkOutTime),
      invalidated:  !!rec.invalidated,
      notes:        rec.notes || '',
    });
  };

  const cancelEdit = () => { setEditingId(null); setForm({}); };

  const saveEdit = async (id) => {
    try {
      setSaving(true);
      await adminUpdateAttendance(id, {
        checkInTime:  form.checkInTime  ? new Date(form.checkInTime).toISOString()  : null,
        checkOutTime: form.checkOutTime ? new Date(form.checkOutTime).toISOString() : null,
        invalidated:  form.invalidated,
        notes:        String(form.notes || '').trim(),
      });
      setEditingId(null);
      onSaved?.();   // ✅ parent re-fetches (bust cache)
    } catch (err) {
      console.error(err);
      alert(t('error'));
    } finally {
      setSaving(false);
    }
  };

  /* ── Create ───────────────────────────────────────────────*/
  const handleCreate = async () => {
    if (!createForm.branchId) { setCreateError(t('selectBranch')); return; }
    setCreateError('');
    try {
      setCreating(true);
      await createManualAttendance({
        userId:       user._id,
        branchId:     createForm.branchId,
        date,
        checkInTime:  createForm.checkInTime  ? new Date(createForm.checkInTime).toISOString()  : null,
        checkOutTime: createForm.checkOutTime ? new Date(createForm.checkOutTime).toISOString() : null,
        invalidated:  createForm.invalidated,
        notes:        createForm.notes,
      });
      setShowCreate(false);
      setCreateForm({
        branchId:    branches.length === 1 ? branches[0]._id : '',
        checkInTime: '', checkOutTime: '', invalidated: false, notes: '',
      });
      onSaved?.();   // ✅ parent re-fetches
    } catch (err) {
      console.error(err);
      setCreateError(t('errorSaving'));
    } finally {
      setCreating(false);
    }
  };

  /* ══════════════════════════════════════════════════════════
     Render
  ══════════════════════════════════════════════════════════ */
  return createPortal(
    <div
      className="att-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div className="att-modal-dialog">

        {/* ── Header ── */}
        <div className="att-modal-header">
          <div className="att-modal-avatar">
            <i className="fas fa-user" />
          </div>
          <div>
            <p className="att-modal-user-name">{user?.name || '—'}</p>
            <p className="att-modal-date-str">{formatDateLong(date)}</p>
          </div>
          <button className="att-modal-close" onClick={onClose} title={t('close')}>
            <i className="fas fa-times" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="att-modal-body">

          {/* Summary strip — from DailyAttendanceSummary */}
          {summary && !loading && (
            <div className="att-summary-strip">
              {summary.firstCheckInTime && (
                <span className="att-summary-pill att-summary-pill--blue">
                  <i className="fas fa-sign-in-alt" />
                  {t('in')}: {formatTime(summary.firstCheckInTime)}
                </span>
              )}
              {summary.lastCheckOutTime && (
                <span className="att-summary-pill att-summary-pill--green">
                  <i className="fas fa-sign-out-alt" />
                  {t('out')}: {formatTime(summary.lastCheckOutTime)}
                </span>
              )}
              {(summary.totalLateMinutes || 0) > 0 && (
                <span className="att-summary-pill att-summary-pill--amber">
                  <i className="fas fa-clock" />
                  {t('late')}: {summary.totalLateMinutes}{t('min')}
                </span>
              )}
              {(summary.totalEarlyLeaveMinutes || 0) > 0 && (
                <span className="att-summary-pill att-summary-pill--red">
                  <i className="fas fa-door-open" />
                  {t('earlyLeave')}: {summary.totalEarlyLeaveMinutes}{t('min')}
                </span>
              )}
              {(summary.totalTransitDeductionMinutes || 0) > 0 && (
                <span className="att-summary-pill att-summary-pill--violet">
                  <i className="fas fa-route" />
                  {t('transit')}: {summary.totalTransitDeductionMinutes}{t('min')}
                </span>
              )}
            </div>
          )}

          {/* ── Create form ── */}
          {isAdmin && showCreate && (
            <div className="att-create-card">
              <div className="att-create-card__header">
                <i className="fas fa-plus-circle" />
                {t('addManualAttendance')}
              </div>

              <div className="att-create-card__body">

                {/* Branch */}
                <div className="att-form-group">
                  <label className="att-form-label">{t('branch')} *</label>
                  <select
                    className="att-form-control att-form-control--select"
                    value={createForm.branchId}
                    disabled={loadingBranches}
                    onChange={(e) => setCreateForm({ ...createForm, branchId: e.target.value })}
                  >
                    <option value="">
                      {loadingBranches ? t('loading') : t('selectBranch')}
                    </option>
                    {branches.map((b) => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Check-in */}
                <div className="att-form-group">
                  <label className="att-form-label">{t('checkIn')}</label>
                  <input
                    type="datetime-local"
                    className="att-form-control"
                    value={createForm.checkInTime}
                    onChange={(e) => setCreateForm({ ...createForm, checkInTime: e.target.value })}
                  />
                </div>

                {/* Check-out */}
                <div className="att-form-group">
                  <label className="att-form-label">{t('checkOut')}</label>
                  <input
                    type="datetime-local"
                    className="att-form-control"
                    value={createForm.checkOutTime}
                    onChange={(e) => setCreateForm({ ...createForm, checkOutTime: e.target.value })}
                  />
                </div>

                {/* Notes — full width */}
                <div className="att-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="att-form-label">{t('notes')}</label>
                  <textarea
                    className="att-form-control"
                    rows={2}
                    value={createForm.notes}
                    onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                  />
                </div>

                {/* Invalidate — full width */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="att-checkbox-row">
                    <input
                      type="checkbox"
                      checked={createForm.invalidated}
                      onChange={(e) => setCreateForm({ ...createForm, invalidated: e.target.checked })}
                    />
                    <i className="fas fa-ban" style={{ color: 'var(--att-red)', fontSize: '.85rem' }} />
                    {t('invalidateRecord')}
                  </label>
                </div>
              </div>

              {createError && (
                <div style={{ padding: '0 18px' }}>
                  <div className="att-form-error">
                    <i className="fas fa-exclamation-triangle" />
                    {createError}
                  </div>
                </div>
              )}

              <div className="att-create-card__footer">
                <button
                  className="att-btn-save"
                  onClick={handleCreate}
                  disabled={creating || !createForm.branchId}
                >
                  {creating
                    ? <i className="fas fa-circle-notch fa-spin" />
                    : <i className="fas fa-check" />
                  }
                  {t('save')}
                </button>
                <button
                  className="att-btn-cancel"
                  onClick={() => { setShowCreate(false); setCreateError(''); }}
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          )}

          {/* ── Loading ── */}
          {loading && (
            <div className="att-state">
              <div className="att-spinner" />
              <div className="att-state__text">{t('loading')}</div>
            </div>
          )}

          {/* ── Empty ── */}
          {!loading && records.length === 0 && !showCreate && (
            <div className="att-state">
              <div className="att-state__icon">🗓️</div>
              <div className="att-state__text">{t('noAttendanceForDay')}</div>
            </div>
          )}

          {/* ── Records table ── */}
          {!loading && records.length > 0 && (
            <>
              <div className="att-section-label">
                <i className="fas fa-list-alt" />
                {t('attendanceRecords')}
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="att-records-table">
                  <thead>
                    <tr>
                      <th>{t('branch')}</th>
                      <th>{t('checkIn')}</th>
                      <th>{t('checkOut')}</th>
                      <th>{t('late')}</th>
                      <th>{t('earlyLeave')}</th>
                      <th>{t('notes')}</th>
                      {isAdmin && <th style={{ textAlign: 'center' }}>{t('actions')}</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((rec) => {
                      const isEditing = editingId === rec._id;
                      return (
                        <tr
                          key={rec._id}
                          className={rec.invalidated ? 'att-row--invalid' : ''}
                        >
                          {/* Branch */}
                          <td>
                            <span style={{ fontWeight: 600, fontSize: '.84rem' }}>
                              {rec.branch?.name || '—'}
                            </span>
                            {rec.invalidated && (
                              <span className="att-invalid-badge">
                                <i className="fas fa-ban" />{t('invalid')}
                              </span>
                            )}
                            {rec.createdByAdmin && (
                              <span className="att-manual-badge">
                                <i className="fas fa-user-shield" />{t('manual')}
                              </span>
                            )}
                          </td>

                          {/* Check-in */}
                          <td>
                            {isEditing ? (
                              <input
                                type="datetime-local"
                                className="att-edit-input"
                                value={form.checkInTime}
                                onChange={(e) => setForm({ ...form, checkInTime: e.target.value })}
                              />
                            ) : (
                              <span style={{ fontWeight: 500 }}>{formatTime(rec.checkInTime)}</span>
                            )}
                          </td>

                          {/* Check-out */}
                          <td>
                            {isEditing ? (
                              <input
                                type="datetime-local"
                                className="att-edit-input"
                                value={form.checkOutTime}
                                onChange={(e) => setForm({ ...form, checkOutTime: e.target.value })}
                              />
                            ) : (
                              <span style={{ fontWeight: 500 }}>{formatTime(rec.checkOutTime)}</span>
                            )}
                          </td>

                          {/* Late */}
                          <td>
                            {(rec.lateMinutes || 0) > 0 ? (
                              <span style={{ color: 'var(--att-amber)', fontWeight: 600 }}>
                                {rec.lateMinutes}{t('min')}
                              </span>
                            ) : '—'}
                          </td>

                          {/* Early leave */}
                          <td>
                            {(rec.earlyLeaveMinutes || 0) > 0 ? (
                              <span style={{ color: 'var(--att-red)', fontWeight: 600 }}>
                                {rec.earlyLeaveMinutes}{t('min')}
                              </span>
                            ) : '—'}
                          </td>

                          {/* Notes / Invalidate toggle when editing */}
                          <td>
                            {isEditing ? (
                              <div>
                                <textarea
                                  className="att-edit-input"
                                  rows={2}
                                  value={form.notes}
                                  style={{ marginBottom: 8 }}
                                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                />
                                <label className="att-checkbox-row" style={{ fontSize: '.8rem' }}>
                                  <input
                                    type="checkbox"
                                    checked={form.invalidated}
                                    onChange={(e) => setForm({ ...form, invalidated: e.target.checked })}
                                  />
                                  <i className="fas fa-ban" style={{ color: 'var(--att-red)', fontSize: '.8rem' }} />
                                  {t('invalidateRecord')}
                                </label>
                              </div>
                            ) : (
                              <span className="att-notes-italic">{rec.notes || '—'}</span>
                            )}
                          </td>

                          {/* Actions */}
                          {isAdmin && (
                            <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                              {isEditing ? (
                                <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                                  <button
                                    className="att-btn-save"
                                    disabled={saving}
                                    onClick={() => saveEdit(rec._id)}
                                  >
                                    {saving
                                      ? <i className="fas fa-circle-notch fa-spin" />
                                      : <i className="fas fa-check" />
                                    }
                                    {t('save')}
                                  </button>
                                  <button className="att-btn-cancel" onClick={cancelEdit}>
                                    {t('cancel')}
                                  </button>
                                </div>
                              ) : (
                                <button className="att-btn-edit" onClick={() => startEdit(rec)}>
                                  <i className="fas fa-pen" />
                                  {t('edit')}
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── Transit details — DailyAttendanceSummary.transits[] ── */}
          {isAdmin && transits.length > 0 && (
            <div className="att-transit-section">
              <div className="att-section-label">
                <i className="fas fa-route" />
                {t('transitDetails')}
              </div>
              <table className="att-transit-table">
                <thead>
                  <tr>
                    <th>{t('from')}</th>
                    <th>{t('to')}</th>
                    <th>{t('gapMinutes')}</th>
                    <th>{t('threshold')}</th>
                    <th>{t('deductionMinutes')}</th>
                  </tr>
                </thead>
                <tbody>
                  {transits.map((tr, i) => (
                    <tr key={i}>
                      <td>{tr.fromBranchName || '—'}</td>
                      <td>{tr.toBranchName   || '—'}</td>
                      <td>{tr.gapMinutes}</td>
                      <td>{tr.threshold || 0}</td>
                      <td className="att-transit-deduction">
                        {(tr.deductionMinutes || 0) > 0 ? `−${tr.deductionMinutes}` : '0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* ── Footer ── */}
        <div className="att-modal-footer">
          {isAdmin && !showCreate ? (
            <button className="att-btn-add" onClick={() => setShowCreate(true)}>
              <i className="fas fa-plus-circle" />
              {t('addAttendance')}
            </button>
          ) : (
            <span />
          )}
          <button className="att-btn-close" onClick={onClose}>
            <i className="fas fa-times" />
            {t('close')}
          </button>
        </div>

      </div>
    </div>,
      document.body

  );
}

export default EmployeeAttendanceDetailsModal;