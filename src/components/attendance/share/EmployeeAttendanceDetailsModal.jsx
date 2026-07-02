
// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiPut } from '../../helpers/api';

// const toInputDateTimeLocal = (value) => {
//   if (!value) return '';
//   const d = new Date(value);
//   if (isNaN(d.getTime())) return '';
//   const pad = (n) => n.toString().padStart(2, '0');
//   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
//     d.getDate()
//   )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
// };

// // const formatTime = (value, lang) => {
// //   if (!value) return '—';
// //   return new Date(value).toLocaleTimeString(
// //     lang === 'ar' ? 'ar-EG' : 'en-GB',
// //     { hour: '2-digit', minute: '2-digit' }
// //   );
// // };
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
//   transits = [],
//   onClose,
//   onSaved
// }) => {
//   const { t, i18n } = useTranslation();
//   const lang = i18n.language;

//   const [editingId, setEditingId] = useState(null);
//   const [form, setForm] = useState({});
//   const [saving, setSaving] = useState(false);

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
//         checkInTime: form.checkInTime
//           ? new Date(form.checkInTime).toISOString()
//           : null,
//         checkOutTime: form.checkOutTime
//           ? new Date(form.checkOutTime).toISOString()
//           : null,
//         invalidated: form.invalidated,
//         notes: form.notes
//       });

//       setEditingId(null);
//       onSaved?.();
//     } catch (err) {
//       console.error(err);
//       alert(t('error'));
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div
//       className="modal fade show"
//       style={{ display: 'block', background: '#00000066' }}
//     >
//       <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
//         <div className="modal-content">

//           {/* ===== Header ===== */}
//           <div className="modal-header bg-dark text-white">
//             <h5 className="modal-title">
//               <i className="fas fa-user-clock me-2" />
//               {user?.name || t('deletedUser')} –{' '}
//               {date ? new Date(date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB') : ''}
//             </h5>
//             <button className="btn-close btn-close-white" onClick={onClose} />
//           </div>

//           {/* ===== Body ===== */}
//           <div className="modal-body">

//             {loading ? (
//               <div className="text-center py-5">
//                 <div className="spinner-border text-primary" />
//               </div>
//             ) : records.length === 0 ? (
//               <div className="text-center text-muted py-4">
//                 {t('noAttendanceForDay')}
//               </div>
//             ) : (
//               <>
//                 {/* ===== Attendance Table ===== */}
//                 <div className="table-responsive">
//                   <table className="table table-bordered align-middle">
//                     <thead className="table-light">
//                       <tr>
//                         <th>{t('branch')}</th>
//                         <th>{t('checkIn')}</th>
//                         <th>{t('checkOut')}</th>
//                         <th>{t('late')}</th>
//                         <th>{t('earlyLeave')}</th>
//                         <th>{t('notes')}</th>
//                         <th className="text-center">{t('actions')}</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {records.map((rec) => {
//                         const isEditing = editingId === rec._id;

//                         return (
//                           <tr
//                             key={rec._id}
//                             className={rec.invalidated ? 'table-danger' : ''}
//                           >
//                             {/* Branch */}
//                             <td>
//                               <strong>{rec.branch?.name || '—'}</strong>
//                               {rec.invalidated && (
//                                 <span className="badge bg-danger ms-2">
//                                   {t('invalidated')}
//                                 </span>
//                               )}
//                             </td>

//                             {/* Check-in */}
//                             <td>
//                               {isEditing ? (
//                                 <input
//                                   type="datetime-local"
//                                   className="form-control form-control-sm"
//                                   value={form.checkInTime}
//                                   onChange={(e) =>
//                                     setForm({ ...form, checkInTime: e.target.value })
//                                   }
//                                 />
//                               ) : (
//                                 formatTime(rec.checkInTime, lang)
//                               )}
//                             </td>

//                             {/* Check-out */}
//                             <td>
//                               {isEditing ? (
//                                 <input
//                                   type="datetime-local"
//                                   className="form-control form-control-sm"
//                                   value={form.checkOutTime}
//                                   onChange={(e) =>
//                                     setForm({ ...form, checkOutTime: e.target.value })
//                                   }
//                                 />
//                               ) : (
//                                 formatTime(rec.checkOutTime, lang)
//                               )}
//                             </td>

//                             {/* Late */}
//                             <td className="text-warning">
//                               {rec.lateMinutes
//                                 ? `${rec.lateMinutes} ${t('minutes')}`
//                                 : '—'}
//                             </td>

//                             {/* Early Leave */}
//                             <td className="text-danger">
//                               {rec.earlyLeaveMinutes
//                                 ? `${rec.earlyLeaveMinutes} ${t('minutes')}`
//                                 : '—'}
//                             </td>

//                             {/* Notes */}
//                             <td>
//                               {isEditing ? (
//                                 <>
//                                   <textarea
//                                     className="form-control form-control-sm mb-2"
//                                     rows="2"
//                                     value={form.notes}
//                                     onChange={(e) =>
//                                       setForm({ ...form, notes: e.target.value })
//                                     }
//                                   />
//                                   <div className="form-check">
//                                     <input
//                                       className="form-check-input"
//                                       type="checkbox"
//                                       checked={form.invalidated}
//                                       id={`inv-${rec._id}`}
//                                       onChange={(e) =>
//                                         setForm({
//                                           ...form,
//                                           invalidated: e.target.checked
//                                         })
//                                       }
//                                     />
//                                     <label
//                                       className="form-check-label"
//                                       htmlFor={`inv-${rec._id}`}
//                                     >
//                                       {t('invalidateRecord')}
//                                     </label>
//                                   </div>
//                                 </>
//                               ) : (
//                                 <span className="text-muted">
//                                   {rec.notes || '—'}
//                                 </span>
//                               )}
//                             </td>

//                             {/* Actions */}
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
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* ===== Transit Section ===== */}
//                 {transits.length > 0 && (
//                   <div className="mt-4">
//                     <h6 className="mb-2">
//                       <i className="fas fa-route me-2" />
//                       {t('transitDetails')}
//                     </h6>
//                     <ul className="list-group">
//                       {transits.map((tr, idx) => (
//                         <li key={idx} className="list-group-item">
//                           {t('from')} <strong>{tr.fromBranchName}</strong>{' '}
//                           {t('to')} <strong>{tr.toBranchName}</strong> —{' '}
//                           {t('transitTime')}: {tr.gapMinutes} {t('minutes')}{' '}
//                           {tr.deductionMinutes > 0 ? (
//                             <span className="text-danger">
//                               ({t('deduction')} {tr.deductionMinutes}{' '}
//                               {t('minutes')})
//                             </span>
//                           ) : (
//                             <span className="text-success">
//                               ({t('noDeduction')})
//                             </span>
//                           )}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>

//           {/* ===== Footer ===== */}
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


// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiPut } from '../../helpers/api';

// const toInputDateTimeLocal = (value) => {
//   if (!value) return '';
//   const d = new Date(value);
//   if (isNaN(d.getTime())) return '';
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
//   transits = [],
//   onClose,
//   onSaved
// }) => {
//   const { t, i18n } = useTranslation();
//   const isRTL = i18n.language === 'ar';

//   const [editingId, setEditingId] = useState(null);
//   const [form, setForm] = useState({});
//   const [saving, setSaving] = useState(false);

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
//     } catch (err) {
//       console.error(err);
//       alert(t('error') || 'حدث خطأ أثناء الحفظ');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const headerDate = date
//     ? new Date(date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-GB', {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       })
//     : '';

//   return (
//     <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.75)' }} dir={isRTL ? 'rtl' : 'ltr'}>
//       <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
//         <div className="modal-content shadow-lg border-0 overflow-hidden">

//           {/* Header - Gradient Professional */}
//           <div className="modal-header bg-gradient bg-primary text-white py-4">
//             <h5 className="modal-title fw-bold fs-4 d-flex align-items-center">
//               <i className="fas fa-user-clock fa-2x me-3" />
//               <div>
//                 <div>{user?.name || t('deletedUser')}</div>
//                 <small className="opacity-90">{headerDate}</small>
//               </div>
//             </h5>
//             <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close" />
//           </div>

//           {/* Body */}
//           <div className="modal-body p-4 p-lg-5 bg-light">

//             {loading ? (
//               <div className="text-center py-5">
//                 <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }} />
//                 <p className="mt-4 fs-5 text-muted">{t('loading')}...</p>
//               </div>
//             ) : records.length === 0 ? (
//               <div className="text-center py-5">
//                 <i className="fas fa-calendar-times fa-5x text-muted opacity-50 mb-4" />
//                 <p className="fs-4 text-muted">{t('noAttendanceForDay')}</p>
//               </div>
//             ) : (
//               <>
//                 {/* Attendance Records Card */}
//                 <div className="card border-0 shadow-sm mb-5">
//                   <div className="card-header bg-primary text-white rounded-top">
//                     <h5 className="mb-0 fw-bold">
//                       <i className="fas fa-list-alt me-3" />
//                       {t('attendanceRecords')}
//                     </h5>
//                   </div>
//                   <div className="card-body p-0">
//                     <div className="table-responsive">
//                       <table className="table table-hover mb-0">
//                         <thead className="bg-light">
//                           <tr>
//                             <th className="text-nowrap">{t('branch')}</th>
//                             <th>{t('checkIn')}</th>
//                             <th>{t('checkOut')}</th>
//                             <th>{t('late')}</th>
//                             <th>{t('earlyLeave')}</th>
//                             <th>{t('notes')}</th>
//                             <th className="text-center">{t('actions')}</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {records.map((rec) => {
//                             const isEditing = editingId === rec._id;

//                             return (
//                               <tr key={rec._id} className={rec.invalidated ? 'table-danger opacity-80' : ''}>
//                                 <td>
//                                   <div className="d-flex align-items-center">
//                                     <i className="fas fa-building text-primary me-3" />
//                                     <strong>{rec.branch?.name || '—'}</strong>
//                                     {rec.invalidated && (
//                                       <span className="badge bg-danger ms-3">
//                                         <i className="fas fa-ban me-1" />
//                                         {t('invalidated')}
//                                       </span>
//                                     )}
//                                   </div>
//                                 </td>

//                                 <td className="fw-bold text-success">
//                                   {isEditing ? (
//                                     <input type="datetime-local" className="form-control form-control-sm" value={form.checkInTime} onChange={(e) => setForm({ ...form, checkInTime: e.target.value })} />
//                                   ) : formatTime(rec.checkInTime)}
//                                 </td>

//                                 <td className="fw-bold text-info">
//                                   {isEditing ? (
//                                     <input type="datetime-local" className="form-control form-control-sm" value={form.checkOutTime} onChange={(e) => setForm({ ...form, checkOutTime: e.target.value })} />
//                                   ) : formatTime(rec.checkOutTime)}
//                                 </td>

//                                 <td>
//                                   {rec.lateMinutes > 0 ? (
//                                     <span className="badge bg-warning text-dark fs-6">
//                                       <i className="fas fa-clock me-1" />
//                                       {rec.lateMinutes} {t('minutes')}
//                                     </span>
//                                   ) : '—'}
//                                 </td>

//                                 <td>
//                                   {rec.earlyLeaveMinutes > 0 ? (
//                                     <span className="badge bg-danger fs-6">
//                                       <i className="fas fa-sign-out-alt me-1" />
//                                       {rec.earlyLeaveMinutes} {t('minutes')}
//                                     </span>
//                                   ) : '—'}
//                                 </td>

//                                 <td style={{ minWidth: '220px' }}>
//                                   {isEditing ? (
//                                     <>
//                                       <textarea
//                                         className="form-control mb-2"
//                                         rows="3"
//                                         value={form.notes}
//                                         onChange={(e) => setForm({ ...form, notes: e.target.value })}
//                                         placeholder={t('addNote')}
//                                       />
//                                       <div className="form-check">
//                                         <input
//                                           className="form-check-input"
//                                           type="checkbox"
//                                           id={`inv-${rec._id}`}
//                                           checked={form.invalidated}
//                                           onChange={(e) => setForm({ ...form, invalidated: e.target.checked })}
//                                         />
//                                         <label className="form-check-label text-danger" htmlFor={`inv-${rec._id}`}>
//                                           {t('invalidateRecord')}
//                                         </label>
//                                       </div>
//                                     </>
//                                   ) : (
//                                     <span className={rec.notes ? 'text-dark' : 'text-muted'}>
//                                       {rec.notes || '—'}
//                                     </span>
//                                   )}
//                                 </td>

//                                 <td className="text-center">
//                                   {isEditing ? (
//                                     <div className="d-flex flex-column gap-2">
//                                       <div className="btn-group" role="group">
//                                         <button
//                                           className="btn btn-success btn-sm"
//                                           disabled={saving}
//                                           onClick={() => saveEdit(rec._id)}
//                                         >
//                                           <i className="fas fa-save me-1" />
//                                           {saving ? t('saving') : t('save')}
//                                         </button>
//                                         <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>
//                                           <i className="fas fa-times" />
//                                         </button>
//                                       </div>
//                                     </div>
//                                   ) : (
//                                     <button className="btn btn-outline-primary btn-sm rounded-pill px-4" onClick={() => startEdit(rec)}>
//                                       <i className="fas fa-edit me-1" />
//                                       {t('edit')}
//                                     </button>
//                                   )}
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Transit Card */}
//                 {transits.length > 0 && (
//                   <div className="card border-0 shadow-lg">
//                     <div className="card-header bg-gradient bg-info text-white">
//                       <h5 className="mb-0 fw-bold">
//                         <i className="fas fa-route fa-lg me-3" />
//                         {t('transitDetails')}
//                       </h5>
//                     </div>
//                     <div className="card-body p-4">
//                       {transits.map((tr, idx) => (
//                         <div key={idx} className="d-flex justify-content-between align-items-center py-3 border-bottom">
//                           <div>
//                             <div className="fw-bold fs-5">
//                               {tr.fromBranchName} <i className="fas fa-arrow-right mx-2 text-primary" /> {tr.toBranchName}
//                             </div>
//                             <small className="text-muted">
//                               <i className="fas fa-clock me-1" />
//                               {t('transitTime')}: {tr.gapMinutes} {t('minutes')}
//                             </small>
//                           </div>
//                           <div>
//                             {tr.deductionMinutes > 0 ? (
//                               <span className="badge bg-danger fs-4 px-4 py-3 rounded-pill">
//                                 <i className="fas fa-minus-circle me-2" />
//                                 -{tr.deductionMinutes} {t('min')}
//                               </span>
//                             ) : (
//                               <span className="badge bg-success fs-4 px-4 py-3 rounded-pill">
//                                 <i className="fas fa-check-circle me-2" />
//                                 {t('noDeduction')}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="modal-footer bg-white border-top-0 py-4">
//             <button className="btn btn-lg btn-outline-danger px-5 rounded-pill" onClick={onClose}>
//               <i className="fas fa-times me-2" />
//               {t('close')}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeAttendanceDetailsModal;
// //1
// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiPut } from '../../helpers/api';
// import '../../style/EmployeeAttendanceDetailsModal.css';

// const toInputDateTimeLocal = (value) => {
//   if (!value) return '';
//   const d = new Date(value);
//   if (isNaN(d.getTime())) return '';
//   const pad = (n) => n.toString().padStart(2, '0');
//   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
// };

// const formatTime = (value) => {
//   if (!value) return '—';
//   return new Date(value).toLocaleTimeString('en-US', {
//     hour: 'numeric',
//     minute: '2-digit',
//     hour12: true
//   });
// };

// const Toast = ({ show, message, type, onClose }) => {
//   if (!show) return null;

//   const bgColors = {
//     success: 'bg-success',
//     error: 'bg-danger',
//     info: 'bg-info'
//   };

//   const icons = {
//     success: 'fa-check-circle',
//     error: 'fa-exclamation-circle',
//     info: 'fa-info-circle'
//   };

//   return (
//     <div 
//       className="position-fixed top-0 end-0 p-3" 
//       style={{ zIndex: 9999 }}
//     >
//       <div 
//         className={`toast show ${bgColors[type]} text-white shadow-lg`}
//         role="alert"
//         style={{ minWidth: '300px' }}
//       >
//         <div className="toast-header text-white border-0" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
//           <i className={`fas ${icons[type]} me-2`} />
//           <strong className="me-auto">
//             {type === 'success' && 'نجح'}
//             {type === 'error' && 'خطأ'}
//             {type === 'info' && 'معلومة'}
//           </strong>
//           <button 
//             type="button" 
//             className="btn-close btn-close-white" 
//             onClick={onClose}
//           />
//         </div>
//         <div className="toast-body fw-bold">
//           {message}
//         </div>
//       </div>
//     </div>
//   );
// };

// const EmployeeAttendanceDetailsModal = ({
//   show,
//   loading,
//   records = [],
//   user,
//   date,
//   transits = [],
//   onClose,
//   onSaved
// }) => {
//   const { t, i18n } = useTranslation();
//   const isRTL = i18n.language === 'ar';

//   const [editingId, setEditingId] = useState(null);
//   const [form, setForm] = useState({});
//   const [saving, setSaving] = useState(false);
//   const [localRecords, setLocalRecords] = useState(records);
//   const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

//   // Update local records when props change
//   useState(() => {
//     setLocalRecords(records);
//   }, [records]);

//   const showToast = (message, type = 'success') => {
//     setToast({ show: true, message, type });
//     setTimeout(() => {
//       setToast({ show: false, message: '', type: 'success' });
//     }, 4000);
//   };

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
//       const updatedData = {
//         checkInTime: form.checkInTime ? new Date(form.checkInTime).toISOString() : null,
//         checkOutTime: form.checkOutTime ? new Date(form.checkOutTime).toISOString() : null,
//         invalidated: form.invalidated,
//         notes: form.notes.trim()
//       };
      
//       await apiPut(`/admin/attendance/${id}`, updatedData);
      
//       // Update local state without reload
//       setLocalRecords(prevRecords => 
//         prevRecords.map(rec => 
//           rec._id === id 
//             ? { 
//                 ...rec, 
//                 checkInTime: updatedData.checkInTime,
//                 checkOutTime: updatedData.checkOutTime,
//                 invalidated: updatedData.invalidated,
//                 notes: updatedData.notes
//               }
//             : rec
//         )
//       );
      
//       setEditingId(null);
//       showToast(t('savedSuccessfully') || 'تم الحفظ بنجاح', 'success');
//       onSaved?.();
//     } catch (err) {
//       console.error(err);
//       showToast(t('error') || 'حدث خطأ أثناء الحفظ', 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const headerDate = date
//     ? new Date(date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-GB', {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       })
//     : '';

//   return (
//     <>
//       <Toast 
//         show={toast.show}
//         message={toast.message}
//         type={toast.type}
//         onClose={() => setToast({ ...toast, show: false })}
//       />
      
//       <div 
//         className="modal fade show" 
//         style={{ 
//           display: 'block', 
//           backgroundColor: 'rgba(0,0,0,0.75)',
//           backdropFilter: 'blur(8px)'
//         }} 
//         dir={isRTL ? 'rtl' : 'ltr'}
//       >
//         <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
//           <div 
//             className="modal-content border-0 shadow-lg" 
//             style={{ 
//               borderRadius: '24px',
//               overflow: 'hidden',
//               animation: 'slideDown 0.4s ease-out'
//             }}
//           >
//             <style>{`
//               @keyframes slideDown {
//                 from {
//                   opacity: 0;
//                   transform: translateY(-30px) scale(0.95);
//                 }
//                 to {
//                   opacity: 1;
//                   transform: translateY(0) scale(1);
//                 }
//               }
              
//               @keyframes pulse {
//                 0%, 100% { opacity: 1; }
//                 50% { opacity: 0.5; }
//               }
              
//               .table-hover tbody tr:hover {
//                 background-color: rgba(13, 110, 253, 0.05);
//                 transform: scale(1.01);
//                 transition: all 0.2s ease;
//                 box-shadow: 0 2px 8px rgba(0,0,0,0.08);
//               }
              
//               .btn {
//                 transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//               }
              
//               .btn:hover {
//                 transform: translateY(-2px);
//                 box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//               }
              
//               .btn:active {
//                 transform: translateY(0);
//               }
              
//               .badge {
//                 transition: all 0.3s ease;
//               }
              
//               .badge:hover {
//                 transform: scale(1.05);
//               }
              
//               .form-control:focus {
//                 border-color: #0d6efd;
//                 box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
//               }
              
//               .modal-header {
//                 background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//                 position: relative;
//                 overflow: hidden;
//               }
              
//               .modal-header::before {
//                 content: '';
//                 position: absolute;
//                 top: -50%;
//                 right: -50%;
//                 width: 200%;
//                 height: 200%;
//                 background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
//                 animation: rotate 20s linear infinite;
//               }
              
//               @keyframes rotate {
//                 from { transform: rotate(0deg); }
//                 to { transform: rotate(360deg); }
//               }
              
//               .card {
//                 transition: all 0.3s ease;
//               }
              
//               .card:hover {
//                 transform: translateY(-4px);
//                 box-shadow: 0 8px 24px rgba(0,0,0,0.12);
//               }
              
//               .spinner-border {
//                 animation: spin 0.8s linear infinite;
//               }
              
//               @keyframes spin {
//                 to { transform: rotate(360deg); }
//               }
//             `}</style>

//             {/* Premium Header */}
//             <div className="modal-header text-white py-4 px-5" style={{ position: 'relative', zIndex: 1 }}>
//               <div className="d-flex align-items-center">
//                 <div 
//                   className="bg-white rounded-circle p-3 me-4 shadow-lg"
//                   style={{
//                     background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
//                   }}
//                 >
//                   <i className="fas fa-user-clock fa-2x" style={{ 
//                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                     WebkitBackgroundClip: 'text',
//                     WebkitTextFillColor: 'transparent'
//                   }} />
//                 </div>
//                 <div>
//                   <h4 className="mb-1 fw-bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
//                     {user?.name || t('deletedUser')}
//                   </h4>
//                   <p className="mb-0 opacity-90">
//                     <i className="fas fa-calendar-day me-2" />
//                     {headerDate}
//                   </p>
//                 </div>
//               </div>
//               <button 
//                 type="button" 
//                 className="btn-close btn-close-white" 
//                 onClick={onClose}
//                 style={{ 
//                   opacity: 0.9,
//                   transition: 'all 0.3s ease'
//                 }}
//                 onMouseEnter={(e) => e.target.style.opacity = 1}
//                 onMouseLeave={(e) => e.target.style.opacity = 0.9}
//               />
//             </div>

//             {/* Body with gradient background */}
//             <div className="modal-body p-4" style={{ 
//               background: 'linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)'
//             }}>
//               {loading ? (
//                 <div className="text-center py-5">
//                   <div 
//                     className="spinner-border text-primary mb-3" 
//                     style={{ width: '4rem', height: '4rem' }}
//                   />
//                   <p className="fs-5 text-muted fw-bold">{t('loading')}...</p>
//                 </div>
//               ) : localRecords.length === 0 ? (
//                 <div className="text-center py-5">
//                   <div 
//                     className="mb-4"
//                     style={{
//                       animation: 'pulse 2s ease-in-out infinite'
//                     }}
//                   >
//                     <i className="fas fa-calendar-times text-muted opacity-25" style={{ fontSize: '6rem' }} />
//                   </div>
//                   <p className="fs-4 text-muted fw-bold">{t('noAttendanceForDay')}</p>
//                 </div>
//               ) : (
//                 <>
//                   {/* Premium Table */}
//                   <div className="mb-5">
//                     <div className="table-responsive" style={{ borderRadius: '16px', overflow: 'hidden' }}>
//                       <table className="table table-hover align-middle mb-0 shadow-sm">
//                         <thead style={{ 
//                           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                           color: 'white'
//                         }}>
//                           <tr>
//                             <th className="py-3">{t('branch')}</th>
//                             <th className="py-3">{t('checkIn')}</th>
//                             <th className="py-3">{t('checkOut')}</th>
//                             <th className="py-3">{t('late')}</th>
//                             <th className="py-3">{t('earlyLeave')}</th>
//                             <th className="py-3">{t('notes')}</th>
//                             <th className="text-center py-3">{t('actions')}</th>
//                           </tr>
//                         </thead>
//                         <tbody className="bg-white">
//                           {localRecords.map((rec) => {
//                             const isEditing = editingId === rec._id;

//                             return (
//                               <tr 
//                                 key={rec._id} 
//                                 className={rec.invalidated ? 'bg-danger bg-opacity-10' : ''}
//                                 style={{ transition: 'all 0.2s ease' }}
//                               >
//                                 <td className="py-3">
//                                   <div className="d-flex align-items-center">
//                                     <div 
//                                       className="rounded-circle p-2 me-3"
//                                       style={{
//                                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                                         width: '40px',
//                                         height: '40px',
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         justifyContent: 'center'
//                                       }}
//                                     >
//                                       <i className="fas fa-building text-white" />
//                                     </div>
//                                     <div>
//                                       <div className="fw-bold">{rec.branch?.name || '—'}</div>
//                                       {rec.invalidated && (
//                                         <span className="badge bg-danger rounded-pill mt-1">
//                                           <i className="fas fa-ban me-1" />
//                                           {t('invalidated')}
//                                         </span>
//                                       )}
//                                     </div>
//                                   </div>
//                                 </td>

//                                 <td className="py-3">
//                                   {isEditing ? (
//                                     <input
//                                       type="datetime-local"
//                                       className="form-control form-control-sm shadow-sm"
//                                       style={{ maxWidth: '180px' }}
//                                       value={form.checkInTime}
//                                       onChange={(e) => setForm({ ...form, checkInTime: e.target.value })}
//                                     />
//                                   ) : (
//                                     <span className="badge bg-success bg-opacity-75 px-3 py-2 fw-bold">
//                                       <i className="fas fa-sign-in-alt me-2" />
//                                       {formatTime(rec.checkInTime)}
//                                     </span>
//                                   )}
//                                 </td>

//                                 <td className="py-3">
//                                   {isEditing ? (
//                                     <input
//                                       type="datetime-local"
//                                       className="form-control form-control-sm shadow-sm"
//                                       style={{ maxWidth: '180px' }}
//                                       value={form.checkOutTime}
//                                       onChange={(e) => setForm({ ...form, checkOutTime: e.target.value })}
//                                     />
//                                   ) : (
//                                     <span className="badge bg-info bg-opacity-75 px-3 py-2 fw-bold">
//                                       <i className="fas fa-sign-out-alt me-2" />
//                                       {formatTime(rec.checkOutTime)}
//                                     </span>
//                                   )}
//                                 </td>

//                                 <td className="py-3">
//                                   {rec.lateMinutes > 0 ? (
//                                     <span className="badge bg-warning text-dark px-3 py-2 rounded-pill shadow-sm">
//                                       <i className="fas fa-clock me-1" />
//                                       {rec.lateMinutes} {t('minutes')}
//                                     </span>
//                                   ) : (
//                                     <span className="text-muted">—</span>
//                                   )}
//                                 </td>

//                                 <td className="py-3">
//                                   {rec.earlyLeaveMinutes > 0 ? (
//                                     <span className="badge bg-danger px-3 py-2 rounded-pill shadow-sm">
//                                       <i className="fas fa-door-open me-1" />
//                                       {rec.earlyLeaveMinutes} {t('minutes')}
//                                     </span>
//                                   ) : (
//                                     <span className="text-muted">—</span>
//                                   )}
//                                 </td>

//                                 <td className="py-3" style={{ minWidth: '200px', maxWidth: '250px' }}>
//                                   {isEditing ? (
//                                     <div className="d-flex flex-column gap-2">
//                                       <textarea
//                                         className="form-control form-control-sm shadow-sm"
//                                         rows="3"
//                                         style={{ resize: 'none' }}
//                                         value={form.notes}
//                                         onChange={(e) => setForm({ ...form, notes: e.target.value })}
//                                         placeholder={t('addNote')}
//                                       />
//                                       <div className="form-check">
//                                         <input
//                                           className="form-check-input"
//                                           type="checkbox"
//                                           id={`inv-${rec._id}`}
//                                           checked={form.invalidated}
//                                           onChange={(e) => setForm({ ...form, invalidated: e.target.checked })}
//                                         />
//                                         <label className="form-check-label text-danger small fw-bold" htmlFor={`inv-${rec._id}`}>
//                                           <i className="fas fa-ban me-1" />
//                                           {t('invalidateRecord')}
//                                         </label>
//                                       </div>
//                                     </div>
//                                   ) : (
//                                     <div className={rec.notes ? 'text-dark' : 'text-muted fst-italic'}>
//                                       {t('noNotes')}
//                                     </div>
//                                   )}
//                                 </td>

//                                 <td className="text-center py-3">
//                                   {isEditing ? (
//                                     <div className="d-flex gap-2 justify-content-center">
//                                       <button
//                                         className="btn btn-success btn-sm px-4 rounded-pill shadow-sm"
//                                         disabled={saving}
//                                         onClick={() => saveEdit(rec._id)}
//                                       >
//                                         {saving ? (
//                                           <>
//                                             <span className="spinner-border spinner-border-sm me-2" />
//                                             {t('saving')}
//                                           </>
//                                         ) : (
//                                           <>
//                                             <i className="fas fa-check me-2" />
//                                             {t('save')}
//                                           </>
//                                         )}
//                                       </button>
//                                       <button
//                                         className="btn btn-outline-secondary btn-sm px-4 rounded-pill"
//                                         onClick={cancelEdit}
//                                         disabled={saving}
//                                       >
//                                         <i className="fas fa-times me-2" />
//                                         {t('cancel')}
//                                       </button>
//                                     </div>
//                                   ) : (
//                                     <button
//                                       className="btn btn-primary btn-sm px-4 rounded-pill shadow-sm"
//                                       onClick={() => startEdit(rec)}
//                                       style={{
//                                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                                         border: 'none'
//                                       }}
//                                     >
//                                       <i className="fas fa-edit me-2" />
//                                       {t('edit')}
//                                     </button>
//                                   )}
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>

//                   {/* Premium Transit Section */}
//                   {transits.length > 0 && (
//                     <div 
//                       className="card border-0 shadow-sm"
//                       style={{ 
//                         borderRadius: '16px',
//                         overflow: 'hidden'
//                       }}
//                     >
//                       <div 
//                         className="card-header text-white py-3"
//                         style={{
//                           background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)'
//                         }}
//                       >
//                         <h5 className="mb-0 fw-bold">
//                           <i className="fas fa-route me-2" />
//                           {t('transitDetails')}
//                         </h5>
//                       </div>
//                       <div className="card-body p-4 bg-white">
//                         {transits.map((tr, idx) => (
//                           <div 
//                             key={idx} 
//                             className="d-flex justify-content-between align-items-center py-3 px-3 mb-2 rounded-3"
//                             style={{
//                               background: 'linear-gradient(90deg, rgba(23,162,184,0.05) 0%, rgba(255,255,255,0) 100%)',
//                               transition: 'all 0.3s ease'
//                             }}
//                             onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, rgba(23,162,184,0.1) 0%, rgba(255,255,255,0) 100%)'}
//                             onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, rgba(23,162,184,0.05) 0%, rgba(255,255,255,0) 100%)'}
//                           >
//                             <div className="d-flex align-items-center">
//                               <div 
//                                 className="rounded-circle p-3 me-3 shadow-sm"
//                                 style={{
//                                   background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)'
//                                 }}
//                               >
//                                 <i className="fas fa-exchange-alt text-white fa-lg" />
//                               </div>
//                               <div>
//                                 <div className="fw-bold fs-6">
//                                   {tr.fromBranchName} 
//                                   <i className="fas fa-arrow-right mx-2 text-info" />
//                                   {tr.toBranchName}
//                                 </div>
//                                 <small className="text-muted">
//                                   <i className="fas fa-clock me-1" />
//                                   {t('transitTime')}: <span className="fw-bold">{tr.gapMinutes}</span> {t('minutes')}
//                                 </small>
//                               </div>
//                             </div>
//                             <div>
//                               {tr.deductionMinutes > 0 ? (
//                                 <span className="badge bg-danger px-4 py-2 rounded-pill shadow-sm">
//                                   <i className="fas fa-minus-circle me-1" />
//                                   خصم {tr.deductionMinutes} دقيقة
//                                 </span>
//                               ) : (
//                                 <span className="badge bg-success px-4 py-2 rounded-pill shadow-sm">
//                                   <i className="fas fa-check-circle me-1" />
//                                  {t('noDeduction')} 
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>

//             {/* Premium Footer */}
//             <div 
//               className="modal-footer border-top-0 py-4 justify-content-center"
//               style={{
//                 background: 'linear-gradient(to top, #f8f9fa 0%, #ffffff 100%)'
//               }}
//             >
//               <button 
//                 className="btn btn-lg px-5 py-3 rounded-pill shadow-sm"
//                 onClick={onClose}
//                 style={{
//                   background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
//                   border: 'none',
//                   color: 'white',
//                   fontWeight: 'bold'
//                 }}
//               >
//                 <i className="fas fa-times-circle me-2" />
//                 {t('close')}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EmployeeAttendanceDetailsModal;




































// // src/pages/admin/EmployeeAttendanceDetailsModal.jsx
// // ► uses Toast from ui/Toast.jsx
// // ► dayDetails = full backend response from getAttendanceDayDetails
// // ► no calculations here — display only + edit/create via API
// import { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { getRowTimezone, formatDisplayTime,formatDisplayDate } from '../../helpers/timezone';

// import Toast from '../../components/ui/Toast';
// import {
//   //  adminUpdateAttendance,
//     createManualAttendance } from '../../services/admin.api';

// import {adminUpdateAttendance} from '../../services/attendance.api';




// import { apiGet } from '../../helpers/api';

// // ── helpers ───────────────────────────────────────────────────────
// const toInputDTL = (value) => {
//   if (!value) return '';
//   const d = new Date(value);
//   if (isNaN(d.getTime())) return '';
//   const p = n => String(n).padStart(2, '0');
//   return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
// };

// // const fmtTime = (value) => {
// //   if (!value) return '—';
// //   return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  
// // ;
// //  // formatDisplayTime(value, locale)

// // };
// const fmtTime = (value, rec) => {
//   if (!value) return '—';
  
//   const tz = getRowTimezone(rec);


  
//   return formatDisplayTime(value, tz);



// };

// // ── Day summary strip ─────────────────────────────────────────────
// const DaySummaryStrip = ({ details, t }) => {
//   if (!details) return null;
//   const chips = [];

//   if (details.firstCheckInTime)
//     chips.push({ cls: 'timing', icon: 'fa-sign-in-alt',
//       label: `${t('firstIn')}: ${fmtTime(details.firstCheckInTime, details)}` });
//   if (details.lastCheckOutTime)
//     chips.push({ cls: 'timing', icon: 'fa-sign-out-alt',
//      label: `${t('lastOut')}: ${fmtTime(details.lastCheckOutTime, details)}` });
//   if (details.totalLateMinutes > 0)
//     chips.push({ cls: 'penalty', icon: 'fa-clock',
//       label: `${t('late')}: ${details.totalLateMinutes} ${t('min')}` });
//   if (details.totalEarlyLeaveMinutes > 0)
//     chips.push({ cls: 'penalty', icon: 'fa-door-open',
//       label: `${t('earlyLeave')}: ${details.totalEarlyLeaveMinutes} ${t('min')}` });
//   if (details.totalTransitDeductionMinutes > 0)
//     chips.push({ cls: 'transit', icon: 'fa-route',
//       label: `${t('transitDeduction')}: ${details.totalTransitDeductionMinutes} ${t('min')}` });
//   if (details.earlyArrivalMinutes > 0)
//     chips.push({ cls: 'bonus', icon: 'fa-star',
//       label: `${t('earlyArrival')}: ${details.earlyArrivalMinutes} ${t('min')}` });
//   if (details.lateDepartureMinutes > 0)
//     chips.push({ cls: 'bonus', icon: 'fa-star-half-alt',
//       label: `${t('lateDeparture')}: ${details.lateDepartureMinutes} ${t('min')}` });

//   if (!chips.length) return null;

//   return (
//     <div className="att-day-summary-strip">
//       {chips.map((c, i) => (
//         <span key={i} className={`att-day-chip ${c.cls}`}>
//           <i className={`fas ${c.icon}`} />
//           {c.label}
//         </span>
//       ))}
//     </div>
//   );
// };

// // ── Main ──────────────────────────────────────────────────────────
// const EmployeeAttendanceDetailsModal = ({
//   show,
//   loading,
//   dayDetails,   // full backend response: { records, transits, totalLateMinutes, ... }
//   user,
//   date,         // "yyyy-mm-dd" — already timezone-safe from parent
//   isAdmin,
//   onClose,
//   onSaved,
// }) => {
//   const { t, i18n } = useTranslation("Attendance");
//   const isRTL        = i18n.language === 'ar';
//   const locale       = isRTL ? 'ar-EG' : 'en-GB';

//   const records  = dayDetails?.records  || [];
//   const transits = dayDetails?.transits || [];

//   // ── edit state ────────────────────────────────────────────────
//   const [editingId,     setEditingId]     = useState(null);
//   const [form,          setForm]          = useState({});
//   const [saving,        setSaving]        = useState(false);
//   const [localRecords,  setLocalRecords]  = useState([]);

//   // ── create form ───────────────────────────────────────────────
//   const [showCreate,      setShowCreate]      = useState(false);
//   const [createForm,      setCreateForm]      = useState({
//     checkInTime: '', checkOutTime: '', branchId: '', invalidated: false, notes: '',
//   });
//   const [branches,        setBranches]        = useState([]);
//   const [loadingBranches, setLoadingBranches] = useState(false);

//   // ── toast ─────────────────────────────────────────────────────
//   const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
//   const showToast = (message, type = 'success') => {
//     setToast({ show: true, message, type });
//   };
//   const closeToast = () => setToast(t => ({ ...t, show: false }));

//   // sync records
//   useEffect(() => { setLocalRecords(records.length ? [...records] : []); }, [dayDetails]);

//   // load branches
//   useEffect(() => {
//     if (!show || !user?._id) return;
//     setLoadingBranches(true);
//     apiGet(`/branches/user/${user._id}`)
//       .then(res => {
//         const list = res.data?.data || res.data || [];
//         setBranches(list);
//         if (list.length === 1)
//           setCreateForm(f => ({ ...f, branchId: list[0]._id }));
//       })
//       .catch(() => setBranches([]))
//       .finally(() => setLoadingBranches(false));
//   }, [show, user?._id]);

//   // reset on close
//   useEffect(() => {
//     if (!show) {
//       setEditingId(null);
//       setForm({});
//       setShowCreate(false);
//       setCreateForm({ checkInTime:'', checkOutTime:'', branchId:'', invalidated:false, notes:'' });
//     }
//   }, [show]);

//   // ── edit handlers ─────────────────────────────────────────────
//   const startEdit = (rec) => {
//     setEditingId(rec._id);
//     setForm({
//       checkInTime:  toInputDTL(rec.checkInTime),
//       checkOutTime: toInputDTL(rec.checkOutTime),
//       invalidated:  !!rec.invalidated,
//       notes:        rec.notes || '',
//     });
//   };

//   const cancelEdit = () => { setEditingId(null); setForm({}); };

//   const saveEdit = async (id) => {
//     setSaving(true);
//     try {
//       const payload = {
//         checkInTime:  form.checkInTime  ? new Date(form.checkInTime).toISOString()  : null,
//         checkOutTime: form.checkOutTime ? new Date(form.checkOutTime).toISOString() : null,
//         invalidated:  form.invalidated,
//         notes:        String(form.notes ?? '').trim(),
//       };
//       await adminUpdateAttendance(id, payload);
//       setLocalRecords(prev => prev.map(r => r._id === id ? { ...r, ...payload } : r));
//       setEditingId(null);
//       showToast(t('savedSuccessfully'), 'success');
//       onSaved?.();
//     } catch (err) {
//       console.error(err);
//       showToast(t('errorSaving'), 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── create handler ────────────────────────────────────────────
//   const handleCreate = async () => {
//     if (!createForm.branchId) {
//       showToast(t('selectBranchFirst'), 'error');
//       return;
//     }
//     try {
//       await createManualAttendance({
//         userId:      user._id,
//         branchId:    createForm.branchId,
//         date,                              // ✅ "yyyy-mm-dd" — no conversion needed
//         checkInTime:  createForm.checkInTime
//           ? new Date(createForm.checkInTime).toISOString() : null,
//         checkOutTime: createForm.checkOutTime
//           ? new Date(createForm.checkOutTime).toISOString() : null,
//         invalidated: createForm.invalidated,
//         notes:       createForm.notes,
//       });
//       showToast(t('attendanceCreatedSuccessfully'), 'success');
//       setShowCreate(false);
//       setCreateForm({ checkInTime:'', checkOutTime:'',
//         branchId: branches.length === 1 ? branches[0]._id : '',
//         invalidated: false, notes: '' });
//       onSaved?.();
//     } catch (err) {
//       console.error(err);
//       showToast(t('errorSaving'), 'error');
//     }
//   };

//   if (!show) return null;
// //const tz = getRowTimezone(dayDetails || {});
// //const tz = getRowTimezone(dayDetails?.records?.[0] || {});


// // const tz =
// //   getRowTimezone(dayDetails?.records?.[0]) ||
// //   dayDetails?.branch?.timezone ||
// //   'UTC';
// //   const headerDate = date
// //     ?formatDisplayDate(date, tz, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
// //     : '';
// const tz = 
//   getRowTimezone(dayDetails?.records?.[0]) ||
//   dayDetails?.branch?.timezone ||
//   getRowTimezone(dayDetails) ||
//   'UTC';

// const headerDate = date 
//   ? formatDisplayDate(date, tz, { 
//       weekday: 'long', 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     })
//   : '';
  
//   return (
//     <>
//       {/* Toast — imported from ui/Toast.jsx */}
//       <Toast
//         show={toast.show}
//         message={toast.message}
//         type={toast.type}
//         onClose={closeToast}
//         delay={4000}
//       />

//       <div className="att-modal-overlay" dir={isRTL ? 'rtl' : 'ltr'}>
//         <div className="att-modal-dialog">

//           {/* Header */}
//           <div className="att-modal-header">
//             <div className="att-modal-icon">
//               <i className="fas fa-user-clock" />
//             </div>
//             <div className="att-modal-header-info">
//               <div className="att-modal-user-name">{user?.name || t('deletedUser')}</div>
//               <div className="att-modal-date">
//                 <i className="fas fa-calendar-day" />
//                 {headerDate}
//               </div>
//             </div>
//             <button className="att-modal-close" onClick={onClose} aria-label="Close">
//               <i className="fas fa-times" />
//             </button>
//           </div>

//           {/* Body */}
//           <div className="att-modal-body">

//             {/* Day summary strip — from backend directly */}
//             <DaySummaryStrip details={dayDetails} t={t} />

//             {/* Create form */}
//             {isAdmin && showCreate && (
//               <div className="att-create-card">
//                 <div className="att-create-title">
//                   <i className="fas fa-plus-circle" />
//                   {t('addManualAttendance')}
//                 </div>
//                 <div className="att-create-grid">

//                   <div className="att-create-field">
//                     <label>{t('branch')}</label>
//                     <select
//                       className="form-select"
//                       value={createForm.branchId}
//                       onChange={e => setCreateForm({ ...createForm, branchId: e.target.value })}
//                       disabled={loadingBranches}
//                     >
//                       <option value="">
//                         {loadingBranches ? t('loading') : t('selectBranch')}
//                       </option>
//                       {branches.map(b => (
//                         <option key={b._id} value={b._id}>{b.name}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="att-create-field">
//                     <label>{t('checkIn')}</label>
//                     <input
//                       type="datetime-local"
//                       className="form-control"
//                       value={createForm.checkInTime}
//                       onChange={e => setCreateForm({ ...createForm, checkInTime: e.target.value })}
//                     />
//                   </div>

//                   <div className="att-create-field">
//                     <label>{t('checkOut')}</label>
//                     <input
//                       type="datetime-local"
//                       className="form-control"
//                       value={createForm.checkOutTime}
//                       onChange={e => setCreateForm({ ...createForm, checkOutTime: e.target.value })}
//                     />
//                   </div>

//                   <div className="att-create-field" style={{ gridColumn: '1/-1' }}>
//                     <label>{t('notes')}</label>
//                     <textarea
//                       className="form-control"
//                       rows="2"
//                       placeholder={t('notes')}
//                       value={createForm.notes}
//                       onChange={e => setCreateForm({ ...createForm, notes: e.target.value })}
//                     />
//                   </div>

//                   <div className="att-create-field" style={{ gridColumn: '1/-1' }}>
//                     <label
//                       style={{ display:'flex', alignItems:'center', gap:'.4rem',
//                         textTransform:'none', fontSize:'.83rem', fontWeight:500, color:'var(--att-navy)' }}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={createForm.invalidated}
//                         onChange={e => setCreateForm({ ...createForm, invalidated: e.target.checked })}
//                         style={{ width:15, height:15, accentColor:'var(--att-danger)' }}
//                       />
//                       <i className="fas fa-ban" style={{ color:'var(--att-danger)' }} />
//                       {t('invalidateRecord')}
//                     </label>
//                   </div>
//                 </div>

//                 <div className="att-create-actions">
//                   <button
//                     className="att-btn att-btn-ghost att-btn-sm"
//                     onClick={() => setShowCreate(false)}
//                   >
//                     {t('cancel')}
//                   </button>
//                   <button
//                     className="att-btn att-btn-success att-btn-sm"
//                     onClick={handleCreate}
//                     disabled={!createForm.branchId}
//                   >
//                     <i className="fas fa-check" />
//                     {t('save')}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Loading */}
//             {loading ? (
//               <div className="att-loading">
//                 <div className="att-spinner" />
//                 <div className="att-empty-text">{t('loading')}…</div>
//               </div>

//             ) : localRecords.length === 0 ? (
//               <div className="att-empty">
//                 <div className="att-empty-icon"><i className="fas fa-calendar-times" /></div>
//                 <div className="att-empty-text">{t('noAttendanceForDay')}</div>
//               </div>

//             ) : (
//               <>
//                 {/* Records table */}
//                 <div className="att-section-label">
//                   <i className="fas fa-list" />
//                   {t('attendanceRecords')} ({localRecords.length})
//                 </div>
//                 <div style={{ overflowX: 'auto' }}>
//                   <table className="att-records-table">
//                     <thead>
//                       <tr>
//                         <th>{t('branch')}</th>
//                         <th>{t('checkIn')}</th>
//                         <th>{t('checkOut')}</th>
//                         <th>{t('late')}</th>
//                         <th>{t('earlyLeave')}</th>
//                         <th>{t('notes')}</th>
//                         {isAdmin && <th style={{ textAlign:'center' }}>{t('actions')}</th>}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {localRecords.map(rec => {
//                         const isEditing = editingId === rec._id;
//                         return (
//                           <tr
//                             key={rec._id}
//                             className={rec.invalidated ? 'att-rec-invalid' : ''}
//                           >
//                             {/* Branch */}
//                             <td>
//                               <strong>{rec.branch?.name || '—'}</strong>
//                               {rec.invalidated && (
//                                 <span
//                                   className="att-badge att-badge-ABSENT_NO_PERMISSION"
//                                   style={{ marginTop: 4, display:'inline-flex' }}
//                                 >
//                                   <i className="fas fa-ban" />{t('invalidated')}
//                                 </span>
//                               )}
//                               {rec.createdByAdmin && (
//                                 <div style={{ fontSize:'.68rem', color:'var(--att-muted)', marginTop:2 }}>
//                                   <i className="fas fa-user-shield" /> {t('addedByAdmin')}
//                                 </div>
//                               )}
//                             </td>

//                             {/* Check-in */}
//                             <td>
//                               {isEditing ? (
//                                 <input
//                                   type="datetime-local"
//                                   className="form-control form-control-sm"
//                                   style={{ minWidth: 170 }}
//                                   value={form.checkInTime}
//                                   onChange={e => setForm({ ...form, checkInTime: e.target.value })}
//                                 />
//                               ) : (
//                                 <span className="att-time-in">
//                                   <i className="fas fa-sign-in-alt" />
//                                   {fmtTime(rec.checkInTime)}
//                                 </span>
//                               )}
//                             </td>

//                             {/* Check-out */}
//                             <td>
//                               {isEditing ? (
//                                 <input
//                                   type="datetime-local"
//                                   className="form-control form-control-sm"
//                                   style={{ minWidth: 170 }}
//                                   value={form.checkOutTime}
//                                   onChange={e => setForm({ ...form, checkOutTime: e.target.value })}
//                                 />
//                               ) : (
//                                 <span className="att-time-out">
//                                   <i className="fas fa-sign-out-alt" />
//                                   {fmtTime(rec.checkOutTime)}
//                                 </span>
//                               )}
//                             </td>

//                             {/* Late */}
//                             <td>
//                               {rec.lateMinutes > 0
//                                 ? <span className="att-min-badge warn"><i className="fas fa-clock" />{rec.lateMinutes} {t('min')}</span>
//                                 : <span style={{ color:'var(--att-muted)' }}>—</span>}
//                             </td>

//                             {/* Early leave */}
//                             <td>
//                               {rec.earlyLeaveMinutes > 0
//                                 ? <span className="att-min-badge dang"><i className="fas fa-door-open" />{rec.earlyLeaveMinutes} {t('min')}</span>
//                                 : <span style={{ color:'var(--att-muted)' }}>—</span>}
//                             </td>

//                             {/* Notes */}
//                             <td style={{ maxWidth: 180 }}>
//                               {isEditing ? (
//                                 <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
//                                   <textarea
//                                     className="form-control form-control-sm"
//                                     rows="2"
//                                     value={form.notes}
//                                     onChange={e => setForm({ ...form, notes: e.target.value })}
//                                     placeholder={t('addNote')}
//                                   />
//                                   <label style={{ display:'flex', alignItems:'center', gap:'.35rem',
//                                     fontSize:'.78rem', color:'var(--att-danger)', cursor:'pointer' }}>
//                                     <input
//                                       type="checkbox"
//                                       checked={form.invalidated}
//                                       onChange={e => setForm({ ...form, invalidated: e.target.checked })}
//                                       style={{ accentColor:'var(--att-danger)' }}
//                                     />
//                                     <i className="fas fa-ban" />
//                                     {t('invalidateRecord')}
//                                   </label>
//                                 </div>
//                               ) : (
//                                 <span style={{ fontSize:'.78rem', color: rec.notes ? 'var(--att-navy)' : 'var(--att-muted)' }}>
//                                   {rec.notes || t('noNotes')}
                                  
//                                 </span>
//                               )}
//                             </td>

//                             {/* Actions */}
//                             {isAdmin && (
//                               <td style={{ textAlign:'center', whiteSpace:'nowrap' }}>
//                                 {isEditing ? (
//                                   <div style={{ display:'flex', gap:'.4rem', justifyContent:'center' }}>
//                                     <button
//                                       className="att-btn att-btn-success att-btn-sm"
//                                       disabled={saving}
//                                       onClick={() => saveEdit(rec._id)}
//                                     >
//                                       {saving
//                                         ? <><span className="spinner-border spinner-border-sm" /> {t('saving')}</>
//                                         : <><i className="fas fa-check" /> {t('save')}</>}
//                                     </button>
//                                     <button
//                                       className="att-btn att-btn-ghost att-btn-sm"
//                                       onClick={cancelEdit}
//                                       disabled={saving}
//                                     >
//                                       <i className="fas fa-times" />
//                                     </button>
//                                   </div>
//                                 ) : (
//                                   <button
//                                     className="att-btn att-btn-primary att-btn-sm"
//                                     onClick={() => startEdit(rec)}
//                                   >
//                                     <i className="fas fa-edit" /> {t('edit')}
//                                   </button>
//                                 )}
//                               </td>
//                             )}
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Transits — from backend directly */}
//                 {transits.length > 0 && (
//                   <div className="att-transit-card">
//                     <div className="att-transit-header">
//                       <i className="fas fa-route" />
//                       {t('transitDetails')}
//                     </div>
//                     {transits.map((tr, idx) => (
//                       <div key={idx} className="att-transit-row">
//                         <div>
//                           <div className="att-transit-route">
//                             {tr.fromBranchName}
//                             <i className="fas fa-arrow-right" />
//                             {tr.toBranchName}
//                           </div>
//                           <div className="att-transit-meta">
//                             <i className="fas fa-clock" />
//                             {t('transitTime')}: <strong>{tr.gapMinutes}</strong> {t('min')}
//                           </div>
//                         </div>
//                         <div>
//                           {tr.deductionMinutes > 0 ? (
//                             <span className="att-min-badge dang">
//                               <i className="fas fa-minus-circle" />
//                               {t('deduction')} {tr.deductionMinutes} {t('min')}
//                             </span>
//                           ) : (
//                             <span className="att-min-badge" style={{ background:'#d1fae5', color:'#065f46' }}>
//                               <i className="fas fa-check-circle" />
//                               {t('noDeduction')}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="att-modal-footer">
//             {isAdmin && !showCreate && (
//               <button
//                 className="att-btn att-btn-success"
//                 onClick={() => setShowCreate(true)}
//               >
//                 <i className="fas fa-plus-circle" />
//                 {t('addAttendance')}
//               </button>
//             )}
//             <button
//               className="att-btn att-btn-danger"
//               onClick={onClose}
//               style={{ marginInlineStart: 'auto' }}
//             >
//               <i className="fas fa-times-circle" />
//               {t('close')}
//             </button>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default EmployeeAttendanceDetailsModal;





















































//----------------tz2=--------------------------------



// import { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { getRowTimezone, formatDisplayTime, formatDisplayDate } from '../../helpers/timezone';

// import Toast from '../../components/ui/Toast';
// import { createManualAttendance } from '../../services/admin.api';
// import { adminUpdateAttendance } from '../../services/attendance.api';
// import { apiGet } from '../../helpers/api';

// // ── helpers ───────────────────────────────────────────────────────
// const toInputDTL = (value) => {
//   if (!value) return '';
//   const d = new Date(value);
//   if (isNaN(d.getTime())) return '';
//   const p = n => String(n).padStart(2, '0');
//   return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
// };

// // fmtTime محسنة وآمنة
// const fmtTime = (value, recOrDetails) => {
//   if (!value) return '—';
//   const tz = getRowTimezone(recOrDetails) || 'UTC';
//   return formatDisplayTime(value, tz);
// };

// // ── Day summary strip ─────────────────────────────────────────────
// const DaySummaryStrip = ({ details, t }) => {
//   if (!details) return null;
//   const chips = [];

//   if (details.firstCheckInTime)
//     chips.push({ 
//       cls: 'timing', 
//       icon: 'fa-sign-in-alt',
//       label: `${t('firstIn')}: ${fmtTime(details.firstCheckInTime, details)}` 
//     });

//   if (details.lastCheckOutTime)
//     chips.push({ 
//       cls: 'timing', 
//       icon: 'fa-sign-out-alt',
//       label: `${t('lastOut')}: ${fmtTime(details.lastCheckOutTime, details)}` 
//     });

//   if (details.totalLateMinutes > 0)
//     chips.push({ cls: 'penalty', icon: 'fa-clock', label: `${t('late')}: ${details.totalLateMinutes} ${t('min')}` });

//   if (details.totalEarlyLeaveMinutes > 0)
//     chips.push({ cls: 'penalty', icon: 'fa-door-open', label: `${t('earlyLeave')}: ${details.totalEarlyLeaveMinutes} ${t('min')}` });

//   if (details.totalTransitDeductionMinutes > 0)
//     chips.push({ cls: 'transit', icon: 'fa-route', label: `${t('transitDeduction')}: ${details.totalTransitDeductionMinutes} ${t('min')}` });

//   if (details.earlyArrivalMinutes > 0)
//     chips.push({ cls: 'bonus', icon: 'fa-star', label: `${t('earlyArrival')}: ${details.earlyArrivalMinutes} ${t('min')}` });

//   if (details.lateDepartureMinutes > 0)
//     chips.push({ cls: 'bonus', icon: 'fa-star-half-alt', label: `${t('lateDeparture')}: ${details.lateDepartureMinutes} ${t('min')}` });

//   if (!chips.length) return null;

//   return (
//     <div className="att-day-summary-strip">
//       {chips.map((c, i) => (
//         <span key={i} className={`att-day-chip ${c.cls}`}>
//           <i className={`fas ${c.icon}`} />
//           {c.label}
//         </span>
//       ))}
//     </div>
//   );
// };

// // ── Main Component ──────────────────────────────────────────────────────────
// const EmployeeAttendanceDetailsModal = ({
//   show,
//   loading,
//   dayDetails,
//   user,
//   date,           // "yyyy-mm-dd" — تم تمريره مع tz من الـ parent
//   isAdmin,
//   onClose,
//   onSaved,
// }) => {
//   const { t, i18n } = useTranslation("Attendance");
//   const isRTL = i18n.language === 'ar';

//   const records = dayDetails?.records || [];
//   const transits = dayDetails?.transits || [];

//   // ── edit state ────────────────────────────────────────────────
//   const [editingId, setEditingId] = useState(null);
//   const [form, setForm] = useState({});
//   const [saving, setSaving] = useState(false);
//   const [localRecords, setLocalRecords] = useState([]);

//   // ── create form ───────────────────────────────────────────────
//   const [showCreate, setShowCreate] = useState(false);
//   const [createForm, setCreateForm] = useState({
//     checkInTime: '', 
//     checkOutTime: '', 
//     branchId: '', 
//     invalidated: false, 
//     notes: '',
//   });
//   const [branches, setBranches] = useState([]);
//   const [loadingBranches, setLoadingBranches] = useState(false);

//   // ── toast ─────────────────────────────────────────────────────
//   const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
//   const showToast = (message, type = 'success') => setToast({ show: true, message, type });
//   const closeToast = () => setToast(t => ({ ...t, show: false }));

//   // sync records
//   useEffect(() => {
//     setLocalRecords(records.length ? [...records] : []);
//   }, [dayDetails]);

//   // load branches
//   useEffect(() => {
//     if (!show || !user?._id) return;
//     setLoadingBranches(true);
//     apiGet(`/branches/user/${user._id}`)
//       .then(res => {
//         const list = res.data?.data || res.data || [];
//         setBranches(list);
//         if (list.length === 1) {
//           setCreateForm(f => ({ ...f, branchId: list[0]._id }));
//         }
//       })
//       .catch(() => setBranches([]))
//       .finally(() => setLoadingBranches(false));
//   }, [show, user?._id]);

//   // reset on close
//   useEffect(() => {
//     if (!show) {
//       setEditingId(null);
//       setForm({});
//       setShowCreate(false);
//       setCreateForm({ checkInTime: '', checkOutTime: '', branchId: '', invalidated: false, notes: '' });
//     }
//   }, [show]);


// //
//      const normalizeNote = (note) => {
//   if (note === null || note === undefined) return '';

//     // لو array فاضية
//   if (Array.isArray(note)) {
//     return note.length ? note.join(', ') : '';
//   }

//   // لو object (حصلت عند ناس كتير)
//   if (typeof note === 'object') {
//     return note.text || note.note || JSON.stringify(note);
//   }

//   return String(note);
// };

//   // ── edit handlers ─────────────────────────────────────────────

//   const startEdit = (rec) => {
//     setEditingId(rec._id);
//     setForm({
//       checkInTime: toInputDTL(rec.checkInTime),
//       checkOutTime: toInputDTL(rec.checkOutTime),
//       invalidated: !!rec.invalidated,
// notes: normalizeNote(rec.notes),

// });
//   };

//   const cancelEdit = () => { 
//     setEditingId(null); 
//     setForm({}); 
//   };

//   const saveEdit = async (id) => {
//     setSaving(true);
//     try {
//       const payload = {
//         checkInTime: form.checkInTime ? new Date(form.checkInTime).toISOString() : null,
//         checkOutTime: form.checkOutTime ? new Date(form.checkOutTime).toISOString() : null,
//         invalidated: form.invalidated,
//         notes: form.notes?.trim() || null,
//       };
//       await adminUpdateAttendance(id, payload);
//       setLocalRecords(prev => prev.map(r => r._id === id ? { ...r, ...payload } : r));
//       setEditingId(null);
//       showToast(t('savedSuccessfully'), 'success');
//       onSaved?.();
//     } catch (err) {
//       console.error(err);
//       showToast(t('errorSaving'), 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── create handler ────────────────────────────────────────────
//   const handleCreate = async () => {
//     if (!createForm.branchId) {
//       showToast(t('selectBranchFirst'), 'error');
//       return;
//     }
//     try {
//       await createManualAttendance({
//         userId: user._id,
//         branchId: createForm.branchId,
//         date,
//         checkInTime: createForm.checkInTime ? new Date(createForm.checkInTime).toISOString() : null,
//         checkOutTime: createForm.checkOutTime ? new Date(createForm.checkOutTime).toISOString() : null,
//         invalidated: createForm.invalidated,
//         notes: createForm.notes,
//       });
//       showToast(t('attendanceCreatedSuccessfully'), 'success');
//       setShowCreate(false);
//       setCreateForm({ 
//         checkInTime: '', 
//         checkOutTime: '', 
//         branchId: branches.length === 1 ? branches[0]._id : '', 
//         invalidated: false, 
//         notes: '' 
//       });
//       onSaved?.();
//     } catch (err) {
//       console.error(err);
//       showToast(t('errorSaving'), 'error');
//     }
//   };

//   if (!show) return null;

//   // ── حساب التايم زون بشكل آمن ومبكر ─────────────────────────────
//   // const tz = 
//   //   getRowTimezone(dayDetails?.records?.[0]) ||
//   //   dayDetails?.branch?.timezone ||
//   //   getRowTimezone(dayDetails) ||
//   //   'UTC';

//   const tz = 
//   dayDetails?.effectiveTimezone || 
//   getRowTimezone(dayDetails?.records?.[0]) ||
//   getRowTimezone(dayDetails) ||
//   dayDetails?.branch?.timezone ||
//   'UTC';

//   const headerDate = date 
//     ? formatDisplayDate(date, tz, { 
//         weekday: 'long', 
//         year: 'numeric', 
//         month: 'long', 
//         day: 'numeric' 
//       })
//     : '';


 

//   return (
//     <>
//       <Toast show={toast.show} message={toast.message} type={toast.type} onClose={closeToast} delay={4000} />

//       <div className="att-modal-overlay" dir={isRTL ? 'rtl' : 'ltr'}>
//         <div className="att-modal-dialog">

//           {/* Header */}
//           <div className="att-modal-header">
//             <div className="att-modal-icon">
//               <i className="fas fa-user-clock" />
//             </div>
//             <div className="att-modal-header-info">
//               <div className="att-modal-user-name">{user?.name || t('deletedUser')}</div>
//               <div className="att-modal-date">
//                 <i className="fas fa-calendar-day" />
//                 {headerDate}
//               </div>
//             </div>
//             <button className="att-modal-close" onClick={onClose} aria-label="Close">
//               <i className="fas fa-times" />
//             </button>
//           </div>

//           {/* Body */}
//          <div className="att-modal-body">

//             {/* Day summary strip — from backend directly */}
//             <DaySummaryStrip details={dayDetails} t={t} />

//             {/* Create form */}
//             {isAdmin && showCreate && (
//               <div className="att-create-card">
//                 <div className="att-create-title">
//                   <i className="fas fa-plus-circle" />
//                   {t('addManualAttendance')}
//                 </div>
//                 <div className="att-create-grid">

//                   <div className="att-create-field">
//                     <label>{t('branch')}</label>
//                     <select
//                       className="form-select"
//                       value={createForm.branchId}
//                       onChange={e => setCreateForm({ ...createForm, branchId: e.target.value })}
//                       disabled={loadingBranches}
//                     >
//                       <option value="">
//                         {loadingBranches ? t('loading') : t('selectBranch')}
//                       </option>
//                       {branches.map(b => (
//                         <option key={b._id} value={b._id}>{b.name}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="att-create-field">
//                     <label>{t('checkIn')}</label>
//                     <input
//                       type="datetime-local"
//                       className="form-control"
//                       value={createForm.checkInTime}
//                       onChange={e => setCreateForm({ ...createForm, checkInTime: e.target.value })}
//                     />
//                   </div>

//                   <div className="att-create-field">
//                     <label>{t('checkOut')}</label>
//                     <input
//                       type="datetime-local"
//                       className="form-control"
//                       value={createForm.checkOutTime}
//                       onChange={e => setCreateForm({ ...createForm, checkOutTime: e.target.value })}
//                     />
//                   </div>

//                   <div className="att-create-field" style={{ gridColumn: '1/-1' }}>
//                     <label>{t('notes')}</label>
//                     <textarea
//                       className="form-control"
//                       rows="2"
//                       placeholder={t('notes')}
//                       value={createForm.notes}
//                       onChange={e => setCreateForm({ ...createForm, notes: e.target.value })}
//                     />
//                   </div>

//                   <div className="att-create-field" style={{ gridColumn: '1/-1' }}>
//                     <label
//                       style={{ display:'flex', alignItems:'center', gap:'.4rem',
//                         textTransform:'none', fontSize:'.83rem', fontWeight:500, color:'var(--att-navy)' }}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={createForm.invalidated}
//                         onChange={e => setCreateForm({ ...createForm, invalidated: e.target.checked })}
//                         style={{ width:15, height:15, accentColor:'var(--att-danger)' }}
//                       />
//                       <i className="fas fa-ban" style={{ color:'var(--att-danger)' }} />
//                       {t('invalidateRecord')}
//                     </label>
//                   </div>
//                 </div>

//                 <div className="att-create-actions">
//                   <button
//                     className="att-btn att-btn-ghost att-btn-sm"
//                     onClick={() => setShowCreate(false)}
//                   >
//                     {t('cancel')}
//                   </button>
//                   <button
//                     className="att-btn att-btn-success att-btn-sm"
//                     onClick={handleCreate}
//                     disabled={!createForm.branchId}
//                   >
//                     <i className="fas fa-check" />
//                     {t('save')}
//                   </button>
//                 </div>
//               </div>
//             )}


//             {/* Loading & Records Table */}
//             {loading ? (
//               <div className="att-loading">
//                 <div className="att-spinner" />
//                 <div className="att-empty-text">{t('loading')}…</div>
//               </div>
//             ) : localRecords.length === 0 ? (
//               <div className="att-empty">
//                 <div className="att-empty-icon"><i className="fas fa-calendar-times" /></div>
//                 <div className="att-empty-text">{t('noAttendanceForDay')}</div>
//               </div>
//             ) : (
//               <>
//                 <div className="att-section-label">
//                   <i className="fas fa-list" />
//                   {t('attendanceRecords')} ({localRecords.length})
//                 </div>

//                 <div style={{ overflowX: 'auto' }}>
//                   <table className="att-records-table">
//                     {/* thead نفسها */}
//                     <thead>
//                       <tr>
//                         <th>{t('branch')}</th>
//                         <th>{t('checkIn')}</th>
//                         <th>{t('checkOut')}</th>
//                         <th>{t('late')}</th>
//                         <th>{t('earlyLeave')}</th>
//                         <th>{t('notes')}</th>
//                         {isAdmin && <th style={{ textAlign: 'center' }}>{t('actions')}</th>}


//                       </tr>
//                     </thead>
//                     <tbody>
//                       {localRecords.map(rec => {
//                         const isEditing = editingId === rec._id;
//                         return (
//                           <tr key={rec._id} className={rec.invalidated ? 'att-rec-invalid' : ''}>
//                             <td>
//   <strong>{rec.branch?.name || '—'}</strong>
// </td>
//                             <td>
//                               {isEditing ? (
//                                 <input type="datetime-local" className="form-control form-control-sm" style={{ minWidth: 170 }} value={form.checkInTime} onChange={e => setForm({ ...form, checkInTime: e.target.value })} />
//                               ) : (
//                                 <span className="att-time-in">
//                                   <i className="fas fa-sign-in-alt" />
//                                   {fmtTime(rec.checkInTime, rec)}
//                                 </span>
//                               )}
//                             </td>

//                             {/* Check-out */}
//                             <td>
//                               {isEditing ? (
//                                 <input type="datetime-local" className="form-control form-control-sm" style={{ minWidth: 170 }} value={form.checkOutTime} onChange={e => setForm({ ...form, checkOutTime: e.target.value })} />
//                               ) : (
//                                 <span className="att-time-out">
//                                   <i className="fas fa-sign-out-alt" />
//                                   {fmtTime(rec.checkOutTime, rec)}
//                                 </span>
//                               )}
//                             </td>

//                             {/* Late */}
// <td>
//   {rec.lateMinutes > 0
//     ? <span className="att-min-badge warn">
//         {rec.lateMinutes} {t('min')}
//       </span>
//     : '—'}
// </td>

// {/* Early Leave */}
// <td>
//   {rec.earlyLeaveMinutes > 0
//     ? <span className="att-min-badge dang">
//         {rec.earlyLeaveMinutes} {t('min')}
//       </span>
//     : '—'}
// </td>

// {/* Notes */}
// {/* <td>
//   {rec.notes || '—'}
// </td> */}
// <td style={{ maxWidth: 220 }}>
//   {isEditing ? (
//  <textarea
//   className="form-control"
//   rows="3"
//   onInput={(e) => {
//   e.target.style.height = 'auto';
//   e.target.style.height = e.target.scrollHeight + 'px';
// }}
//   value={form.notes}
//   onChange={e => setForm({ ...form, notes: e.target.value })}
//   placeholder={t('notes')}
//   style={{
//     width: '100%',
//     minWidth: 220,
//     minHeight: 70,
//     fontSize: '.8rem',
//     resize: 'vertical'
//   }}
// />
//   ) : (
//     <span
//       style={{
//         fontSize: '.78rem',
//         color: normalizeNote(rec.notes)
//           ? 'var(--att-navy)'
//           : 'var(--att-muted)',
//         whiteSpace: 'pre-wrap',
//         wordBreak: 'break-word'
//       }}
//     >
//       {normalizeNote(rec.notes) || t('noNotes')}
//     </span>
//   )}
// </td>


// {isAdmin && (
//   <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
//     {isEditing ? (
//       <div style={{ display: 'flex', gap: '.4rem', justifyContent: 'center' }}>
//         <button
//           className="att-btn att-btn-success att-btn-sm"
//           disabled={saving}
//           onClick={() => saveEdit(rec._id)}
//         >
//           {saving ? 'Saving...' : 'Save'}
//         </button>

//         <button
//           className="att-btn att-btn-ghost att-btn-sm"
//           onClick={cancelEdit}
//           disabled={saving}
//         >
//           Cancel
//         </button>
//       </div>
//     ) : (
//       <button
//         className="att-btn att-btn-primary att-btn-sm"
//         onClick={() => startEdit(rec)}
//       >
//         Edit
//       </button>
//     )}
//   </td>
// )}

//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Transits */}
//                 {transits.length > 0 && (
//                   <div className="att-transit-card">
//                     <div className="att-transit-header">
//                       <i className="fas fa-route" />
//                       {t('transitDetails')}
//                     </div>
//                     {transits.map((tr, idx) => (
//                       <div key={idx} className="att-transit-row">
//                         <div>
//                           <div className="att-transit-route">
//                             {tr.fromBranchName}
//                             <i className="fas fa-arrow-right" />
//                             {tr.toBranchName}
//                           </div>
//                           <div className="att-transit-meta">
//                             <i className="fas fa-clock" />
//                             {t('transitTime')}: <strong>{tr.gapMinutes}</strong> {t('min')}
//                           </div>
//                         </div>
//                         <div>
//                           {tr.deductionMinutes > 0 ? (
//                             <span className="att-min-badge dang">
//                               <i className="fas fa-minus-circle" />
//                               {t('deduction')} {tr.deductionMinutes} {t('min')}
//                             </span>
//                           ) : (
//                             <span className="att-min-badge" style={{ background:'#d1fae5', color:'#065f46' }}>
//                               <i className="fas fa-check-circle" />
//                               {t('noDeduction')}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="att-modal-footer">
//             {isAdmin && !showCreate && (
//               <button className="att-btn att-btn-success" onClick={() => setShowCreate(true)}>
//                 <i className="fas fa-plus-circle" />
//                 {t('addAttendance')}
//               </button>
//             )}
//             <button className="att-btn att-btn-danger" onClick={onClose} style={{ marginInlineStart: 'auto' }}>
//               <i className="fas fa-times-circle" />
//               {t('close')}
//             </button>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default EmployeeAttendanceDetailsModal;










// // EmployeeAttendanceDetailsModal.jsx
// //شغال لكن بطئ
// import { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { getRowTimezone, formatDisplayTime, formatDisplayDate } from '../../helpers/timezone';

// import Toast from '../../components/ui/Toast';
// import { createManualAttendance } from '../../services/admin.api';
// import { adminUpdateAttendance } from '../../services/attendance.api';
// import { apiGet } from '../../helpers/api';

// // ── helpers ───────────────────────────────────────────────────────
// const toInputDTL = (value) => {
//   if (!value) return '';
//   const d = new Date(value);
//   if (isNaN(d.getTime())) return '';
//   const p = n => String(n).padStart(2, '0');
//   return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
// };

// // fmtTime المُحسَّنة — أهم تصليح
// const fmtTime = (value, recOrDetails, modalDayDetails = null) => {
//   if (!value) return '—';

//   // أولوية 1: effectiveTimezone من الـ Modal ككل (dayDetails)
//   // أولوية 2: effectiveTimezone من الـ record
//   // أولوية 3: getRowTimezone
//   let tz = modalDayDetails?.effectiveTimezone 
//         || recOrDetails?.effectiveTimezone 
//         || getRowTimezone(recOrDetails) 
//         || getRowTimezone(modalDayDetails)
//         || 'UTC';

//   console.log('[fmtTime Debug] value:', value, 
//               '| modal effective:', modalDayDetails?.effectiveTimezone,
//               '| rec effective:', recOrDetails?.effectiveTimezone,
//               '| getRowTimezone(rec):', getRowTimezone(recOrDetails),
//               '| Final TZ used:', tz);

//   return formatDisplayTime(value, tz);
// };

// // ── Day summary strip ─────────────────────────────────────────────
// const DaySummaryStrip = ({ details, t, modalDayDetails }) => {
//   if (!details) return null;
//   const chips = [];

//   if (details.firstCheckInTime)
//     chips.push({ 
//       cls: 'timing', 
//       icon: 'fa-sign-in-alt',
//       label: `${t('firstIn')}: ${fmtTime(details.firstCheckInTime, details, modalDayDetails)}` 
//     });

//   if (details.lastCheckOutTime)
//     chips.push({ 
//       cls: 'timing', 
//       icon: 'fa-sign-out-alt',
//       label: `${t('lastOut')}: ${fmtTime(details.lastCheckOutTime, details, modalDayDetails)}` 
//     });

//   if (details.totalLateMinutes > 0)
//     chips.push({ cls: 'penalty', icon: 'fa-clock', label: `${t('late')}: ${details.totalLateMinutes} ${t('min')}` });

//   if (details.totalEarlyLeaveMinutes > 0)
//     chips.push({ cls: 'penalty', icon: 'fa-door-open', label: `${t('earlyLeave')}: ${details.totalEarlyLeaveMinutes} ${t('min')}` });

//   if (details.totalTransitDeductionMinutes > 0)
//     chips.push({ cls: 'transit', icon: 'fa-route', label: `${t('transitDeduction')}: ${details.totalTransitDeductionMinutes} ${t('min')}` });

//   if (details.earlyArrivalMinutes > 0)
//     chips.push({ cls: 'bonus', icon: 'fa-star', label: `${t('earlyArrival')}: ${details.earlyArrivalMinutes} ${t('min')}` });

//   if (details.lateDepartureMinutes > 0)
//     chips.push({ cls: 'bonus', icon: 'fa-star-half-alt', label: `${t('lateDeparture')}: ${details.lateDepartureMinutes} ${t('min')}` });

//   if (!chips.length) return null;

//   return (
//     <div className="att-day-summary-strip">
//       {chips.map((c, i) => (
//         <span key={i} className={`att-day-chip ${c.cls}`}>
//           <i className={`fas ${c.icon}`} />
//           {c.label}
//         </span>
//       ))}
//     </div>
//   );
// };

// // ── Main Component ──────────────────────────────────────────────────────────
// const EmployeeAttendanceDetailsModal = ({
//   show,
//   loading,
//   dayDetails,
//   user,
//   date,
//   isAdmin,
//   onClose,
//   onSaved,
// }) => {
//   const { t, i18n } = useTranslation("Attendance");
//   const isRTL = i18n.language === 'ar';

//   const records = dayDetails?.records || [];
//   const transits = dayDetails?.transits || [];

//   // ... (كل state الـ editing, create, toast, useEffects تبقى كما هي بدون تغيير)

//   const [editingId, setEditingId] = useState(null);
//   const [form, setForm] = useState({});
//   const [saving, setSaving] = useState(false);
//   const [localRecords, setLocalRecords] = useState([]);

//   const [showCreate, setShowCreate] = useState(false);
//   const [createForm, setCreateForm] = useState({
//     checkInTime: '', 
//     checkOutTime: '', 
//     branchId: '', 
//     invalidated: false, 
//     notes: '',
//   });
//   const [branches, setBranches] = useState([]);
//   const [loadingBranches, setLoadingBranches] = useState(false);

//   const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
//   const showToast = (message, type = 'success') => setToast({ show: true, message, type });
//   const closeToast = () => setToast(t => ({ ...t, show: false }));

//   useEffect(() => {
//     setLocalRecords(records.length ? [...records] : []);
//   }, [dayDetails]);

//   useEffect(() => {
//     if (!show || !user?._id) return;
//     setLoadingBranches(true);
//     apiGet(`/branches/user/${user._id}`)
//       .then(res => {
//         const list = res.data?.data || res.data || [];
//         setBranches(list);
//         if (list.length === 1) setCreateForm(f => ({ ...f, branchId: list[0]._id }));
//       })
//       .catch(() => setBranches([]))
//       .finally(() => setLoadingBranches(false));
//   }, [show, user?._id]);

//   useEffect(() => {
//     if (!show) {
//       setEditingId(null);
//       setForm({});
//       setShowCreate(false);
//       setCreateForm({ checkInTime: '', checkOutTime: '', branchId: '', invalidated: false, notes: '' });
//     }
//   }, [show]);

//   const normalizeNote = (note) => {
//     if (note === null || note === undefined) return '';
//     if (Array.isArray(note)) return note.length ? note.join(', ') : '';
//     if (typeof note === 'object') return note.text || note.note || JSON.stringify(note);
//     return String(note);
//   };

//   const startEdit = (rec) => {
//     setEditingId(rec._id);
//     setForm({
//       checkInTime: toInputDTL(rec.checkInTime),
//       checkOutTime: toInputDTL(rec.checkOutTime),
//       invalidated: !!rec.invalidated,
//       notes: normalizeNote(rec.notes),
//     });
//   };

//   const cancelEdit = () => { 
//     setEditingId(null); 
//     setForm({}); 
//   };

//   const saveEdit = async (id) => { /* نفس الكود السابق */ };
//   const handleCreate = async () => { /* نفس الكود السابق */ };

//   if (!show) return null;

//   // ── حساب التايم زون النهائي ─────────────────────────────
//   const modalEffectiveTZ = dayDetails?.effectiveTimezone || 'UTC';

//   console.log('[Modal Debug] dayDetails received:', {
//     effectiveTimezone: dayDetails?.effectiveTimezone,
//     branchTimezone: dayDetails?.branch?.timezone,
//     records0Timezone: dayDetails?.records?.[0]?.branch?.timezone,
//     getRowTimezoneResult: getRowTimezone(dayDetails)
//   });

//   console.log('[Modal Debug] Final Modal TZ:', modalEffectiveTZ);

//   const headerDate = date 
//     ? formatDisplayDate(date, modalEffectiveTZ, { 
//         weekday: 'long', 
//         year: 'numeric', 
//         month: 'long', 
//         day: 'numeric' 
//       })
//     : '';

//   return (
//     <>
//       <Toast show={toast.show} message={toast.message} type={toast.type} onClose={closeToast} delay={4000} />

//       <div className="att-modal-overlay" dir={isRTL ? 'rtl' : 'ltr'}>
//         <div className="att-modal-dialog">

//           {/* Header */}
//           <div className="att-modal-header">
//             <div className="att-modal-icon">
//               <i className="fas fa-user-clock" />
//             </div>
//             <div className="att-modal-header-info">
//               <div className="att-modal-user-name">{user?.name || t('deletedUser')}</div>
//               <div className="att-modal-date">
//                 <i className="fas fa-calendar-day" />
//                 {headerDate}
//               </div>
//             </div>
//             <button className="att-modal-close" onClick={onClose} aria-label="Close">
//               <i className="fas fa-times" />
//             </button>
//           </div>

//           {/* Body */}
//           <div className="att-modal-body">

//             {/* Day summary strip — نرسل modalDayDetails */}
//             <DaySummaryStrip details={dayDetails} t={t} modalDayDetails={dayDetails} />

//             {/* Create form ... (يفضل كما هو) */}

//             {/* Records Table */}
//             {loading ? (
//               <div className="att-loading">...</div>
//             ) : localRecords.length === 0 ? (
//               <div className="att-empty">...</div>
//             ) : (
//               <>
//                 <div className="att-section-label">
//                   <i className="fas fa-list" />
//                   {t('attendanceRecords')} ({localRecords.length})
//                 </div>

//                 <div style={{ overflowX: 'auto' }}>
//                   <table className="att-records-table">
//                     <thead>
//                       <tr>
//                         <th>{t('branch')}</th>
//                         <th>{t('checkIn')}</th>
//                         <th>{t('checkOut')}</th>
//                         <th>{t('late')}</th>
//                         <th>{t('earlyLeave')}</th>
//                         <th>{t('notes')}</th>
//                         {isAdmin && <th style={{ textAlign: 'center' }}>{t('actions')}</th>}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {localRecords.map(rec => {
//                         const isEditing = editingId === rec._id;
//                         return (
//                           <tr key={rec._id} className={rec.invalidated ? 'att-rec-invalid' : ''}>
//                             <td><strong>{rec.branch?.name || '—'}</strong></td>

//                             <td>
//                               {isEditing ? (
//                                 <input type="datetime-local" className="form-control form-control-sm" style={{ minWidth: 170 }} value={form.checkInTime} onChange={e => setForm({ ...form, checkInTime: e.target.value })} />
//                               ) : (
//                                 <span className="att-time-in">
//                                   <i className="fas fa-sign-in-alt" />
//                                   {fmtTime(rec.checkInTime, rec, dayDetails)}   {/* ← تمرير dayDetails */}
//                                 </span>
//                               )}
//                             </td>

//                             <td>
//                               {isEditing ? (
//                                 <input type="datetime-local" className="form-control form-control-sm" style={{ minWidth: 170 }} value={form.checkOutTime} onChange={e => setForm({ ...form, checkOutTime: e.target.value })} />
//                               ) : (
//                                 <span className="att-time-out">
//                                   <i className="fas fa-sign-out-alt" />
//                                   {fmtTime(rec.checkOutTime, rec, dayDetails)}   {/* ← تمرير dayDetails */}
//                                 </span>
//                               )}
//                             </td>

//                             {/* Late & Early Leave & Notes تبقى كما هي */}

//                             <td>
//                               {rec.lateMinutes > 0 ? <span className="att-min-badge warn">{rec.lateMinutes} {t('min')}</span> : '—'}
//                             </td>
//                             <td>
//                               {rec.earlyLeaveMinutes > 0 ? <span className="att-min-badge dang">{rec.earlyLeaveMinutes} {t('min')}</span> : '—'}
//                             </td>

//                             <td style={{ maxWidth: 220 }}>
//                               {isEditing ? (
//                                 <textarea className="form-control" rows="3" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder={t('notes')} style={{ width: '100%', minWidth: 220, minHeight: 70, fontSize: '.8rem', resize: 'vertical' }} />
//                               ) : (
//                                 <span style={{ fontSize: '.78rem', color: normalizeNote(rec.notes) ? 'var(--att-navy)' : 'var(--att-muted)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
//                                   {normalizeNote(rec.notes) || t('noNotes')}
//                                 </span>
//                               )}
//                             </td>

//                             {isAdmin && (
//                               <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
//                                 {isEditing ? (
//                                   <div style={{ display: 'flex', gap: '.4rem', justifyContent: 'center' }}>
//                                     <button className="att-btn att-btn-success att-btn-sm" disabled={saving} onClick={() => saveEdit(rec._id)}>
//                                       {saving ? 'Saving...' : 'Save'}
//                                     </button>
//                                     <button className="att-btn att-btn-ghost att-btn-sm" onClick={cancelEdit} disabled={saving}>
//                                       Cancel
//                                     </button>
//                                   </div>
//                                 ) : (
//                                   <button className="att-btn att-btn-primary att-btn-sm" onClick={() => startEdit(rec)}>
//                                     Edit
//                                   </button>
//                                 )}
//                               </td>
//                             )}
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Transits تبقى كما هي */}
//               </>
//             )}
//           </div>

//           {/* Footer تبقى كما هي */}
//           <div className="att-modal-footer">
//             {isAdmin && !showCreate && (
//               <button className="att-btn att-btn-success" onClick={() => setShowCreate(true)}>
//                 <i className="fas fa-plus-circle" />
//                 {t('addAttendance')}
//               </button>
//             )}
//             <button className="att-btn att-btn-danger" onClick={onClose} style={{ marginInlineStart: 'auto' }}>
//               <i className="fas fa-times-circle" />
//               {t('close')}
//             </button>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default EmployeeAttendanceDetailsModal;


























// // EmployeeAttendanceDetailsModal.jsx
// // Final Optimized Version - Fast + Correct Timezone Handling
// // This component handles the detailed view of a single attendance day for an employee (Admin & Self view)

// import { useState, useEffect, useMemo } from 'react';
// import { useTranslation } from 'react-i18next';
// import { getRowTimezone, formatDisplayTime, formatDisplayDate } from '../../helpers/timezone';

// import Toast from '../../components/ui/Toast';
// import { createManualAttendance } from '../../services/admin.api';
// import { adminUpdateAttendance } from '../../services/attendance.api';
// import { apiGet } from '../../helpers/api';

// // ─────────────────────────────────────────────────────────────
// // Helper: Convert date to datetime-local input format
// // ─────────────────────────────────────────────────────────────
// const toInputDTL = (value) => {
//   if (!value) return '';
//   const d = new Date(value);
//   if (isNaN(d.getTime())) return '';
//   const p = n => String(n).padStart(2, '0');
//   return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
// };

// // ─────────────────────────────────────────────────────────────
// // fmtTime - Optimized & Safe Time Formatter
// // Priority:
// // 1. modalEffectiveTZ (from dayDetails.effectiveTimezone)
// // 2. record.effectiveTimezone
// // 3. getRowTimezone fallback
// // 4. 'UTC' as last resort
// // ─────────────────────────────────────────────────────────────
// const fmtTime = (value, record, modalEffectiveTZ) => {
//   if (!value) return '—';

//   const tz = modalEffectiveTZ || 
//              record?.effectiveTimezone || 
//              getRowTimezone(record) || 
//              getRowTimezone({ effectiveTimezone: modalEffectiveTZ }) || 
//              'UTC';

//   return formatDisplayTime(value, tz);
// };

// // ─────────────────────────────────────────────────────────────
// // DaySummaryStrip - Shows first check-in, last check-out, penalties, bonuses
// // We pass modalEffectiveTZ to ensure consistent timezone across all times
// // ─────────────────────────────────────────────────────────────
// const DaySummaryStrip = ({ details, t, modalEffectiveTZ }) => {
//   if (!details) return null;

//   const chips = [];

//   if (details.firstCheckInTime) {
//     chips.push({
//       cls: 'timing',
//       icon: 'fa-sign-in-alt',
//       label: `${t('firstIn')}: ${fmtTime(details.firstCheckInTime, details, modalEffectiveTZ)}`
//     });
//   }

//   if (details.lastCheckOutTime) {
//     chips.push({
//       cls: 'timing',
//       icon: 'fa-sign-out-alt',
//       label: `${t('lastOut')}: ${fmtTime(details.lastCheckOutTime, details, modalEffectiveTZ)}`
//     });
//   }

//   if (details.totalLateMinutes > 0) {
//     chips.push({
//       cls: 'penalty',
//       icon: 'fa-clock',
//       label: `${t('late')}: ${details.totalLateMinutes} ${t('min')}`
//     });
//   }

//   if (details.totalEarlyLeaveMinutes > 0) {
//     chips.push({
//       cls: 'penalty',
//       icon: 'fa-door-open',
//       label: `${t('earlyLeave')}: ${details.totalEarlyLeaveMinutes} ${t('min')}`
//     });
//   }

//   if (details.totalTransitDeductionMinutes > 0) {
//     chips.push({
//       cls: 'transit',
//       icon: 'fa-route',
//       label: `${t('transitDeduction')}: ${details.totalTransitDeductionMinutes} ${t('min')}`
//     });
//   }

//   if (details.earlyArrivalMinutes > 0) {
//     chips.push({
//       cls: 'bonus',
//       icon: 'fa-star',
//       label: `${t('earlyArrival')}: ${details.earlyArrivalMinutes} ${t('min')}`
//     });
//   }

//   if (details.lateDepartureMinutes > 0) {
//     chips.push({
//       cls: 'bonus',
//       icon: 'fa-star-half-alt',
//       label: `${t('lateDeparture')}: ${details.lateDepartureMinutes} ${t('min')}`
//     });
//   }

//   if (!chips.length) return null;

//   return (
//     <div className="att-day-summary-strip">
//       {chips.map((c, i) => (
//         <span key={i} className={`att-day-chip ${c.cls}`}>
//           <i className={`fas ${c.icon}`} />
//           {c.label}
//         </span>
//       ))}
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // Main Component: EmployeeAttendanceDetailsModal
// // This is the detailed modal shown when clicking "Details" in the attendance table
// // ─────────────────────────────────────────────────────────────
// const EmployeeAttendanceDetailsModal = ({
//   show,
//   loading,
//   dayDetails,        // Full day data from backend (contains effectiveTimezone)
//   user,
//   date,              // "YYYY-MM-DD" string
//   isAdmin,
//   onClose,
//   onSaved,
// }) => {
//   const { t, i18n } = useTranslation("Attendance");
//   const isRTL = i18n.language === 'ar';

//   const records = dayDetails?.records || [];
//   const transits = dayDetails?.transits || [];

//   // ── Local State ───────────────────────────────────────────────
//   const [editingId, setEditingId] = useState(null);
//   const [form, setForm] = useState({});
//   const [saving, setSaving] = useState(false);
//   const [localRecords, setLocalRecords] = useState([]);

//   // Create new attendance form state
//   const [showCreate, setShowCreate] = useState(false);
//   const [createForm, setCreateForm] = useState({
//     checkInTime: '', 
//     checkOutTime: '', 
//     branchId: '', 
//     invalidated: false, 
//     notes: '',
//   });

//   const [branches, setBranches] = useState([]);
//   const [loadingBranches, setLoadingBranches] = useState(false);

//   // Toast notification
//   const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

//   const showToast = (message, type = 'success') => setToast({ show: true, message, type });
//   const closeToast = () => setToast(t => ({ ...t, show: false }));

//   // ── Effects ───────────────────────────────────────────────────
//   // Sync local records when dayDetails changes
//   useEffect(() => {
//     setLocalRecords(records.length ? [...records] : []);
//   }, [dayDetails]);

//   // Load user's branches for manual attendance creation
//   useEffect(() => {
//     if (!show || !user?._id) return;
//     setLoadingBranches(true);
//     apiGet(`/branches/user/${user._id}`)
//       .then(res => {
//         const list = res.data?.data || res.data || [];
//         setBranches(list);
//         if (list.length === 1) {
//           setCreateForm(f => ({ ...f, branchId: list[0]._id }));
//         }
//       })
//       .catch(() => setBranches([]))
//       .finally(() => setLoadingBranches(false));
//   }, [show, user?._id]);

//   // Reset form when modal closes
//   useEffect(() => {
//     if (!show) {
//       setEditingId(null);
//       setForm({});
//       setShowCreate(false);
//       setCreateForm({ checkInTime: '', checkOutTime: '', branchId: '', invalidated: false, notes: '' });
//     }
//   }, [show]);

//   // ── Memoized Effective Timezone (Performance Optimization)
//   // We calculate it once and reuse it everywhere to avoid repeated calculations
//   // ─────────────────────────────────────────────────────────────
//   const modalEffectiveTZ = useMemo(() => {
//     return dayDetails?.effectiveTimezone || 
//            getRowTimezone(dayDetails) || 
//            'UTC';
//   }, [dayDetails]);

//   // ── Utility: Normalize notes (handles different data types) ─────
//   const normalizeNote = (note) => {
//     if (note === null || note === undefined) return '';
//     if (Array.isArray(note)) return note.length ? note.join(', ') : '';
//     if (typeof note === 'object') return note.text || note.note || JSON.stringify(note);
//     return String(note);
//   };

//   // ── Edit Handlers ─────────────────────────────────────────────
//   const startEdit = (rec) => {
//     setEditingId(rec._id);
//     setForm({
//       checkInTime: toInputDTL(rec.checkInTime),
//       checkOutTime: toInputDTL(rec.checkOutTime),
//       invalidated: !!rec.invalidated,
//       notes: normalizeNote(rec.notes),
//     });
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setForm({});
//   };

//   const saveEdit = async (id) => {
//     setSaving(true);
//     try {
//       const payload = {
//         checkInTime: form.checkInTime ? new Date(form.checkInTime).toISOString() : null,
//         checkOutTime: form.checkOutTime ? new Date(form.checkOutTime).toISOString() : null,
//         invalidated: form.invalidated,
//         notes: form.notes?.trim() || null,
//       };
//       await adminUpdateAttendance(id, payload);
//       setLocalRecords(prev => prev.map(r => r._id === id ? { ...r, ...payload } : r));
//       setEditingId(null);
//       showToast(t('savedSuccessfully'), 'success');
//       onSaved?.();
//     } catch (err) {
//       console.error(err);
//       showToast(t('errorSaving'), 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Create Manual Attendance Handler ───────────────────────────
//   const handleCreate = async () => {
//     if (!createForm.branchId) {
//       showToast(t('selectBranchFirst'), 'error');
//       return;
//     }
//     try {
//       await createManualAttendance({
//         userId: user._id,
//         branchId: createForm.branchId,
//         date,
//         checkInTime: createForm.checkInTime ? new Date(createForm.checkInTime).toISOString() : null,
//         checkOutTime: createForm.checkOutTime ? new Date(createForm.checkOutTime).toISOString() : null,
//         invalidated: createForm.invalidated,
//         notes: createForm.notes,
//       });
//       showToast(t('attendanceCreatedSuccessfully'), 'success');
//       setShowCreate(false);
//       setCreateForm({ 
//         checkInTime: '', 
//         checkOutTime: '', 
//         branchId: branches.length === 1 ? branches[0]._id : '', 
//         invalidated: false, 
//         notes: '' 
//       });
//       onSaved?.();
//     } catch (err) {
//       console.error(err);
//       showToast(t('errorSaving'), 'error');
//     }
//   };

//   if (!show) return null;

//   // Format header date using the correct timezone
//   const headerDate = date 
//     ? formatDisplayDate(date, modalEffectiveTZ, { 
//         weekday: 'long', 
//         year: 'numeric', 
//         month: 'long', 
//         day: 'numeric' 
//       })
//     : '';

//   return (
//     <>
//       <Toast show={toast.show} message={toast.message} type={toast.type} onClose={closeToast} delay={4000} />

//       <div className="att-modal-overlay" dir={isRTL ? 'rtl' : 'ltr'}>
//         <div className="att-modal-dialog">

//           {/* Header */}
//           <div className="att-modal-header">
//             <div className="att-modal-icon">
//               <i className="fas fa-user-clock" />
//             </div>
//             <div className="att-modal-header-info">
//               <div className="att-modal-user-name">{user?.name || t('deletedUser')}</div>
//               <div className="att-modal-date">
//                 <i className="fas fa-calendar-day" />
//                 {headerDate}
//               </div>
//             </div>
//             <button className="att-modal-close" onClick={onClose} aria-label="Close">
//               <i className="fas fa-times" />
//             </button>
//           </div>

//           {/* Body */}
//           <div className="att-modal-body">

//             {/* Day Summary Strip - Uses modalEffectiveTZ for consistent timezone */}
//             <DaySummaryStrip 
//               details={dayDetails} 
//               t={t} 
//               modalEffectiveTZ={modalEffectiveTZ} 
//             />

//             {/* Create Manual Attendance Form (Admin only) */}
//             {isAdmin && showCreate && (
//               <div className="att-create-card">
//                 <div className="att-create-title">
//                   <i className="fas fa-plus-circle" />
//                   {t('addManualAttendance')}
//                 </div>
//                 <div className="att-create-grid">

//                   <div className="att-create-field">
//                     <label>{t('branch')}</label>
//                     <select
//                       className="form-select"
//                       value={createForm.branchId}
//                       onChange={e => setCreateForm({ ...createForm, branchId: e.target.value })}
//                       disabled={loadingBranches}
//                     >
//                       <option value="">
//                         {loadingBranches ? t('loading') : t('selectBranch')}
//                       </option>
//                       {branches.map(b => (
//                         <option key={b._id} value={b._id}>{b.name}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="att-create-field">
//                     <label>{t('checkIn')}</label>
//                     <input
//                       type="datetime-local"
//                       className="form-control"
//                       value={createForm.checkInTime}
//                       onChange={e => setCreateForm({ ...createForm, checkInTime: e.target.value })}
//                     />
//                   </div>

//                   <div className="att-create-field">
//                     <label>{t('checkOut')}</label>
//                     <input
//                       type="datetime-local"
//                       className="form-control"
//                       value={createForm.checkOutTime}
//                       onChange={e => setCreateForm({ ...createForm, checkOutTime: e.target.value })}
//                     />
//                   </div>

//                   <div className="att-create-field" style={{ gridColumn: '1/-1' }}>
//                     <label>{t('notes')}</label>
//                     <textarea
//                       className="form-control"
//                       rows="2"
//                       placeholder={t('notes')}
//                       value={createForm.notes}
//                       onChange={e => setCreateForm({ ...createForm, notes: e.target.value })}
//                     />
//                   </div>

//                   <div className="att-create-field" style={{ gridColumn: '1/-1' }}>
//                     <label style={{ display:'flex', alignItems:'center', gap:'.4rem', textTransform:'none', fontSize:'.83rem', fontWeight:500, color:'var(--att-navy)' }}>
//                       <input
//                         type="checkbox"
//                         checked={createForm.invalidated}
//                         onChange={e => setCreateForm({ ...createForm, invalidated: e.target.checked })}
//                         style={{ width:15, height:15, accentColor:'var(--att-danger)' }}
//                       />
//                       <i className="fas fa-ban" style={{ color:'var(--att-danger)' }} />
//                       {t('invalidateRecord')}
//                     </label>
//                   </div>
//                 </div>

//                 <div className="att-create-actions">
//                   <button
//                     className="att-btn att-btn-ghost att-btn-sm"
//                     onClick={() => setShowCreate(false)}
//                   >
//                     {t('cancel')}
//                   </button>
//                   <button
//                     className="att-btn att-btn-success att-btn-sm"
//                     onClick={handleCreate}
//                     disabled={!createForm.branchId}
//                   >
//                     <i className="fas fa-check" />
//                     {t('save')}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Loading State */}
//             {loading ? (
//               <div className="att-loading">
//                 <div className="att-spinner" />
//                 <div className="att-empty-text">{t('loading')}…</div>
//               </div>
//             ) : localRecords.length === 0 ? (
//               <div className="att-empty">
//                 <div className="att-empty-icon"><i className="fas fa-calendar-times" /></div>
//                 <div className="att-empty-text">{t('noAttendanceForDay')}</div>
//               </div>
//             ) : (
//               <>
//                 <div className="att-section-label">
//                   <i className="fas fa-list" />
//                   {t('attendanceRecords')} ({localRecords.length})
//                 </div>

//                 <div style={{ overflowX: 'auto' }}>
//                   <table className="att-records-table">
//                     <thead>
//                       <tr>
//                         <th>{t('branch')}</th>
//                         <th>{t('checkIn')}</th>
//                         <th>{t('checkOut')}</th>
//                         <th>{t('late')}</th>
//                         <th>{t('earlyLeave')}</th>
//                         <th>{t('notes')}</th>
//                         {isAdmin && <th style={{ textAlign: 'center' }}>{t('actions')}</th>}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {localRecords.map(rec => {
//                         const isEditing = editingId === rec._id;
//                         return (
//                           <tr key={rec._id} className={rec.invalidated ? 'att-rec-invalid' : ''}>
//                             <td><strong>{rec.branch?.name || '—'}</strong></td>

//                             <td>
//                               {isEditing ? (
//                                 <input 
//                                   type="datetime-local" 
//                                   className="form-control form-control-sm" 
//                                   style={{ minWidth: 170 }} 
//                                   value={form.checkInTime} 
//                                   onChange={e => setForm({ ...form, checkInTime: e.target.value })} 
//                                 />
//                               ) : (
//                                 <span className="att-time-in">
//                                   <i className="fas fa-sign-in-alt" />
//                                   {fmtTime(rec.checkInTime, rec, modalEffectiveTZ)}
//                                 </span>
//                               )}
//                             </td>

//                             <td>
//                               {isEditing ? (
//                                 <input 
//                                   type="datetime-local" 
//                                   className="form-control form-control-sm" 
//                                   style={{ minWidth: 170 }} 
//                                   value={form.checkOutTime} 
//                                   onChange={e => setForm({ ...form, checkOutTime: e.target.value })} 
//                                 />
//                               ) : (
//                                 <span className="att-time-out">
//                                   <i className="fas fa-sign-out-alt" />
//                                   {fmtTime(rec.checkOutTime, rec, modalEffectiveTZ)}
//                                 </span>
//                               )}
//                             </td>

//                             <td>
//                               {rec.lateMinutes > 0 ? (
//                                 <span className="att-min-badge warn">{rec.lateMinutes} {t('min')}</span>
//                               ) : '—'}
//                             </td>

//                             <td>
//                               {rec.earlyLeaveMinutes > 0 ? (
//                                 <span className="att-min-badge dang">{rec.earlyLeaveMinutes} {t('min')}</span>
//                               ) : '—'}
//                             </td>

//                             <td style={{ maxWidth: 220 }}>
//                               {isEditing ? (
//                                 <textarea
//                                   className="form-control"
//                                   rows="3"
//                                   value={form.notes}
//                                   onChange={e => setForm({ ...form, notes: e.target.value })}
//                                   placeholder={t('notes')}
//                                   style={{ width: '100%', minWidth: 220, minHeight: 70, fontSize: '.8rem', resize: 'vertical' }}
//                                 />
//                               ) : (
//                                 <span style={{ fontSize: '.78rem', color: normalizeNote(rec.notes) ? 'var(--att-navy)' : 'var(--att-muted)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
//                                   {normalizeNote(rec.notes) || t('noNotes')}
//                                 </span>
//                               )}
//                             </td>

//                             {isAdmin && (
//                               <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
//                                 {isEditing ? (
//                                   <div style={{ display: 'flex', gap: '.4rem', justifyContent: 'center' }}>
//                                     <button 
//                                       className="att-btn att-btn-success att-btn-sm" 
//                                       disabled={saving} 
//                                       onClick={() => saveEdit(rec._id)}
//                                     >
//                                       {saving ? 'Saving...' : 'Save'}
//                                     </button>
//                                     <button 
//                                       className="att-btn att-btn-ghost att-btn-sm" 
//                                       onClick={cancelEdit} 
//                                       disabled={saving}
//                                     >
//                                       Cancel
//                                     </button>
//                                   </div>
//                                 ) : (
//                                   <button 
//                                     className="att-btn att-btn-primary att-btn-sm" 
//                                     onClick={() => startEdit(rec)}
//                                   >
//                                     Edit
//                                   </button>
//                                 )}
//                               </td>
//                             )}
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Transit Details */}
//                 {transits.length > 0 && (
//                   <div className="att-transit-card">
//                     <div className="att-transit-header">
//                       <i className="fas fa-route" />
//                       {t('transitDetails')}
//                     </div>
//                     {transits.map((tr, idx) => (
//                       <div key={idx} className="att-transit-row">
//                         <div>
//                           <div className="att-transit-route">
//                             {tr.fromBranchName}
//                             <i className="fas fa-arrow-right" />
//                             {tr.toBranchName}
//                           </div>
//                           <div className="att-transit-meta">
//                             <i className="fas fa-clock" />
//                             {t('transitTime')}: <strong>{tr.gapMinutes}</strong> {t('min')}
//                           </div>
//                         </div>
//                         <div>
//                           {tr.deductionMinutes > 0 ? (
//                             <span className="att-min-badge dang">
//                               <i className="fas fa-minus-circle" />
//                               {t('deduction')} {tr.deductionMinutes} {t('min')}
//                             </span>
//                           ) : (
//                             <span className="att-min-badge" style={{ background: '#d1fae5', color: '#065f46' }}>
//                               <i className="fas fa-check-circle" />
//                               {t('noDeduction')}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="att-modal-footer">
//             {isAdmin && !showCreate && (
//               <button className="att-btn att-btn-success" onClick={() => setShowCreate(true)}>
//                 <i className="fas fa-plus-circle" />
//                 {t('addAttendance')}
//               </button>
//             )}
//             <button className="att-btn att-btn-danger" onClick={onClose} style={{ marginInlineStart: 'auto' }}>
//               <i className="fas fa-times-circle" />
//               {t('close')}
//             </button>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default EmployeeAttendanceDetailsModal;




















//share file: 
// EmployeeAttendanceDetailsModal.jsx
// Fixed version for Employee Profile + Admin
// Unified Modal for both Admin and Employee Profile
// Supports: View Details + Edit (Admin only) + Manual Create (Admin only) + Rich Transit Details

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';

import {  formatDisplayTime, formatDisplayDate } from '../../../helpers/timezone';

import Toast from '../../ui/Toast';
import { createManualAttendance } from '../../../services/admin.api';
import { adminUpdateAttendance } from '../../../services/attendance.api';
import { apiGet } from '../../../helpers/api';
import { toUTCFromTimezone } from '../../../helpers/dateHelpers';
import '../../../style/Employeeattendance.css';

// ─────────────────────────────────────────────────────────────
// Helper: Convert ISO date to datetime-local input value
// ─────────────────────────────────────────────────────────────
const toInputDTL = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

// ─────────────────────────────────────────────────────────────
// fmtTime - Safe & Fast Time Formatter with proper timezone priority
// Priority: modalEffectiveTZ → record.effectiveTimezone → getRowTimezone → UTC
// ─────────────────────────────────────────────────────────────
// const fmtTime = (value, record, modalEffectiveTZ) => {
//   if (!value) return '—';

//   const tz = modalEffectiveTZ ||
//              record?.effectiveTimezone ||
//              getRowTimezone(record) ||
//              getRowTimezone({ effectiveTimezone: modalEffectiveTZ }) ||
//              'UTC';

//   return formatDisplayTime(value, tz);
// };

// ─────────────────────────────────────────────────────────────
// fmtTime - النسخة النهائية (per-record TZ)
// Priority: record._tz → record.displayTimezone → getRowTimezone → UTC
// ─────────────────────────────────────────────────────────────
const fmtTime = (value, record) => {
  if (!value) return '—';

  // const tz = 
  //   record?._tz || 
  //   record?.displayTimezone || 
  //   record?.effectiveTimezone ||
  //   modalEffectiveTZ ||
  //   getRowTimezone(record) || 
  //   'UTC';

  const tz = 
  record?._tz || 
  record?.displayTimezone ||
  //record?.effectiveTimezone ||
  'UTC';

  return formatDisplayTime(value, tz);
};

// ─────────────────────────────────────────────────────────────
// DaySummaryStrip - First In / Last Out + Penalties + Bonuses
// ─────────────────────────────────────────────────────────────
const DaySummaryStrip = ({ details, t, modalEffectiveTZ }) => {
  if (!details) return null;

  const chips = [];

  if (details.firstCheckInTime) {
    chips.push({
      cls: 'timing',
      icon: 'fa-sign-in-alt',
      label: `${t('firstIn')}: ${fmtTime(details.firstCheckInTime, details, modalEffectiveTZ)}`
    });
  }

  if (details.lastCheckOutTime) {
    chips.push({
      cls: 'timing',
      icon: 'fa-sign-out-alt',
      label: `${t('lastOut')}: ${fmtTime(details.lastCheckOutTime, details, modalEffectiveTZ)}`
    });
  }

  if (details.totalLateMinutes > 0) {
    chips.push({ cls: 'penalty', icon: 'fa-clock', label: `${t('late')}: ${details.totalLateMinutes} ${t('min')}` });
  }

  if (details.totalEarlyLeaveMinutes > 0) {
    chips.push({ cls: 'penalty', icon: 'fa-door-open', label: `${t('earlyLeave')}: ${details.totalEarlyLeaveMinutes} ${t('min')}` });
  }

  if (details.totalTransitDeductionMinutes > 0) {
    chips.push({ cls: 'transit', icon: 'fa-route', label: `${t('transitDeduction')}: ${details.totalTransitDeductionMinutes} ${t('min')}` });
  }

  if (details.totalGapMinutes > 0) {

  chips.push({
    cls: 'penalty',
    icon: 'fa-mug-hot',

    label:
      `${t('breakDeduction')}: ` +
      `${details.totalGapMinutes} ${t('min')}`
  });

}

  if (details.earlyArrivalMinutes > 0) {
    chips.push({ cls: 'bonus', icon: 'fa-star', label: `${t('earlyArrival')}: ${details.earlyArrivalMinutes} ${t('min')}` });
  }

  if (details.lateDepartureMinutes > 0) {
    chips.push({ cls: 'bonus', icon: 'fa-star-half-alt', label: `${t('lateDeparture')}: ${details.lateDepartureMinutes} ${t('min')}` });
  }

  if (!chips.length) return null;

  return (
    <div className="att-day-summary-strip">
      {chips.map((c, i) => (
        <span key={i} className={`att-day-chip ${c.cls}`}>
          <i className={`fas ${c.icon}`} />
          {c.label}
        </span>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Main Modal Component
// Can be used in both Admin Dashboard and Employee Profile
// ─────────────────────────────────────────────────────────────
const EmployeeAttendanceDetailsModal = ({
  show,
  loading,
  dayDetails,        // Full object from getAttendanceDayDetails (contains effectiveTimezone, records, transits, summary fields)
  user,
  date,              // "YYYY-MM-DD"
  isAdmin = false,
  onClose,
  onSaved,
}) => {
  const { t, i18n } = useTranslation("attendance");
  const isRTL = i18n.language === 'ar';

  const records = dayDetails?.records || [];
  const transits = dayDetails?.transits || [];
const gaps = dayDetails?.gaps || [];
  // ── Local State ───────────────────────────────────────────────
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [localRecords, setLocalRecords] = useState([]);

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    checkInTime: '',
    checkOutTime: '',
    branchId: '',
    invalidated: false,
    notes: '',
  });

  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => setToast({ show: true, message, type });
  const closeToast = () => setToast(t => ({ ...t, show: false }));

  // ── Effects ───────────────────────────────────────────────────
  useEffect(() => {
    setLocalRecords(records.length ? [...records] : []);
  }, [dayDetails]);

  // Load branches for manual attendance (Admin only)
  useEffect(() => {
    if (!show || !isAdmin || !user?._id) return;


    setLoadingBranches(true);
    apiGet(`/branches/user/${user._id}`)
      .then(res => {
        const list = res.data?.data || res.data || [];
        setBranches(list);
        if (list.length === 1) {
          setCreateForm(f => ({ ...f, branchId: list[0]._id }));
        }
      })
      .catch(() => setBranches([]))
      .finally(() => setLoadingBranches(false));
  }, [show, isAdmin, user?._id]);

  // Reset state when modal closes
  useEffect(() => {
    if (!show) {
      setEditingId(null);
      setForm({});
      setShowCreate(false);
    }
  }, [show]);

  // ── Memoized Effective Timezone (Performance) ─────────────────
  // const modalEffectiveTZ = useMemo(() => {
  //   return dayDetails?.effectiveTimezone ||
  //         // getRowTimezone(dayDetails) ||
  //          'UTC';
  // }, [dayDetails]);

  const modalEffectiveTZ = useMemo(() => {
  return (
    dayDetails?.effectiveTimezone ||
    dayDetails?.firstCheckInTimezone ||
    dayDetails?.lastCheckOutTimezone ||
    'UTC'
  );
}, [dayDetails]);

  // ── Utility Functions ─────────────────────────────────────────
  const normalizeNote = (note) => {
    if (note === null || note === undefined) return '';
    if (Array.isArray(note)) return note.length ? note.join(', ') : '';
    if (typeof note === 'object') return note.text || note.note || JSON.stringify(note);
    return String(note);
  };

  // ── Edit Handlers ─────────────────────────────────────────────
  const startEdit = (rec) => {
    setEditingId(rec._id);
    setForm({
      checkInTime: toInputDTL(rec.checkInTime),
      checkOutTime: toInputDTL(rec.checkOutTime),
      invalidated: !!rec.invalidated,
      notes: normalizeNote(rec.notes),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const saveEdit = async (id) => {
    setSaving(true);
    try {
      const payload = {
        checkInTime: form.checkInTime ? new Date(form.checkInTime).toISOString() : null,
        checkOutTime: form.checkOutTime ? new Date(form.checkOutTime).toISOString() : null,
        invalidated: form.invalidated,
        notes: form.notes?.trim() || null,
      };
      await adminUpdateAttendance(id, payload);
      setLocalRecords(prev => prev.map(r => r._id === id ? { ...r, ...payload } : r));
      setEditingId(null);
      showToast(t('savedSuccessfully'), 'success');
      onSaved?.();
    } catch (err) {
      console.error(err);
      showToast(t('errorSaving'), 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Create Manual Attendance ──────────────────────────────────
    const selectedBranch =
    branches.find(b => b._id === createForm.branchId);

  const handleCreate = async () => {
    if (saving) return;

    if (!createForm.branchId) {
      showToast(t('selectBranchFirst'), 'error');
      return;

    }
   
  setSaving(true);

  const branchTZ =
    selectedBranch?.timezone || 'UTC';

    try {
      await createManualAttendance({
        userId: user._id,
        branchId: createForm.branchId,
        date,
        // checkInTime: createForm.checkInTime ? new Date(createForm.checkInTime).toISOString() : null,

        // checkOutTime: createForm.checkOutTime ? new Date(createForm.checkOutTime).toISOString() : null,
checkInTime: createForm.checkInTime
  ? toUTCFromTimezone(
      createForm.checkInTime,
      branchTZ
    )
  : null,

checkOutTime: createForm.checkOutTime
  ? toUTCFromTimezone(
      createForm.checkOutTime,
      branchTZ
    )
  : null,
        invalidated: createForm.invalidated,
        notes: createForm.notes,
      });
      showToast(t('attendanceCreatedSuccessfully'), 'success');
      setShowCreate(false);
      setCreateForm({
        checkInTime: '',
        checkOutTime: '',
        branchId: branches.length === 1 ? branches[0]._id : '',
        invalidated: false,
        notes: '',
      });
      onSaved?.();
    } catch (err) {
      console.error(err);
      showToast(t('errorSaving'), 'error');
    }finally {
    setSaving(false);
  }
  };

  if (!show) return null;

  const headerDate = date
    ? formatDisplayDate(date, modalEffectiveTZ, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

    // console.log('DAY DETAILS', dayDetails);

  return createPortal(
    <div className="att-modal-overlay" dir={isRTL ? 'rtl' : 'ltr'} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="att-modal-dialog">

        {/* Header */}
        <div className="att-modal-header">
          <div className="att-modal-icon">
            <i className="fas fa-user-clock" />
          </div>
          <div className="att-modal-header-info">
            <div className="att-modal-user-name">{user?.name || t('deletedUser')}</div>
            <div className="att-modal-date">
              <i className="fas fa-calendar-day" />
              {headerDate}
            </div>
          </div>
          <button className="att-modal-close" onClick={onClose} aria-label="Close">
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Body */}
        <div className="att-modal-body">

          {/* Day Summary Strip */}
          <DaySummaryStrip details={dayDetails} t={t} modalEffectiveTZ={modalEffectiveTZ} />

          {/* Create Manual Attendance (Admin only) */}
          {isAdmin && showCreate && (
            <div className="att-create-card">
              <div className="att-create-title">
                <i className="fas fa-plus-circle" />
                {t('addManualAttendance')}
             </div>
                 <div className="att-create-grid">

                   <div className="att-create-field">
                     <label>{t('branch')}</label>
                     <select
                      className="form-select"
                      value={createForm.branchId}
                      onChange={e => setCreateForm({ ...createForm, branchId: e.target.value })}
                      disabled={loadingBranches}
                    >
                      <option value="">
                        {loadingBranches ? t('loading') : t('selectBranch')}
                      </option>
                      {branches.map(b => (
                        <option key={b._id} value={b._id}>{b.name}</option>
                      ))}
                    </select>

                    {createForm.branchId && (
  <small className="text-muted">
    Times are entered using branch timezone ({selectedBranch?.timezone})
  </small>
)}
                  </div>

                  <div className="att-create-field">
                    <label>{t('checkIn')}</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={createForm.checkInTime}
                      onChange={e => setCreateForm({ ...createForm, checkInTime: e.target.value })}
                    />
                  </div>

                  <div className="att-create-field">
                    <label>{t('checkOut')}</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={createForm.checkOutTime}
                      onChange={e => setCreateForm({ ...createForm, checkOutTime: e.target.value })}
                    />
                  </div>

                  <div className="att-create-field" style={{ gridColumn: '1/-1' }}>
                    <label>{t('notes')}</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder={t('notes')}
                      value={createForm.notes}
                      onChange={e => setCreateForm({ ...createForm, notes: e.target.value })}
                    />
                  </div>

                  <div className="att-create-field" style={{ gridColumn: '1/-1' }}>
                    <label style={{ display:'flex', alignItems:'center', gap:'.4rem', textTransform:'none', fontSize:'.83rem', fontWeight:500, color:'var(--att-navy)' }}>
                      <input
                        type="checkbox"
                        checked={createForm.invalidated}
                        onChange={e => setCreateForm({ ...createForm, invalidated: e.target.checked })}
                        style={{ width:15, height:15, accentColor:'var(--att-danger)' }}
                      />
                      <i className="fas fa-ban" style={{ color:'var(--att-danger)' }} />
                      {t('invalidateRecord')}
                    </label>
                  </div>
                </div>

                <div className="att-create-actions">
                  <button
                    className="att-btn att-btn-ghost att-btn-sm"
                    onClick={() => setShowCreate(false)}
                  >
                    {t('cancel')}
                  </button>
                 <button
  className="att-btn att-btn-success att-btn-sm"
  onClick={handleCreate}
  disabled={!createForm.branchId || saving}
>
  <i className="fas fa-check" />
  {saving ? 'Saving...' : t('save')}
</button>
                </div>
              </div>
            

          )}

          {/* Records Table */}
          {loading ? (
            <div className="att-loading">
              <div className="att-spinner" />
              <div className="att-empty-text">{t('loading')}…</div>
            </div>
          ) : records.length === 0 ? (
            <div className="att-empty">
              <div className="att-empty-icon"><i className="fas fa-calendar-times" /></div>
              <div className="att-empty-text">{t('noAttendanceForDay')}</div>
            </div>
          ) : (
            <>
              <div className="att-section-label">
                <i className="fas fa-list" />
                {t('attendanceRecords')} ({records.length})
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
                      <th className="text-center">
 {t('invalidated')}
</th>
                      {isAdmin && <th style={{ textAlign: 'center' }}>{t('actions')}</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((rec) => {
                      const isEditing = editingId === rec._id;
                      return (
                        <tr key={rec._id} className={rec.invalidated ? 'att-rec-invalid' : ''}>
                          <td><strong>{rec.branch?.name || '—'}</strong></td>

                          <td>
                            {isEditing ? (
                              <input type="datetime-local" className="form-control form-control-sm" style={{ minWidth: 170 }} value={form.checkInTime} onChange={e => setForm({ ...form, checkInTime: e.target.value })} />
                            ) : (
                              <span className="att-time-in">
                                <i className="fas fa-sign-in-alt" />
                                {
                                //fmtTime(rec.checkInTime, rec, modalEffectiveTZ)
                                
                                fmtTime(rec.checkInTime, rec)}
                                {/* <small style={{ marginLeft: '6px', opacity: 0.7 }}>
    ({rec._tz || rec.displayTimezone || 'UTC'})
  </small> */}
                              </span>
                            )}
                          </td>

                          <td>
                            {isEditing ? (
                              <input type="datetime-local" className="form-control form-control-sm" style={{ minWidth: 170 }} value={form.checkOutTime} onChange={e => setForm({ ...form, checkOutTime: e.target.value })} />
                            ) : (
                              <span className="att-time-out">
                                <i className="fas fa-sign-out-alt" />
                                {fmtTime(rec.checkOutTime, rec)}
                                {/* {fmtTime(rec.checkOutTime, rec, modalEffectiveTZ)} */}
                              </span>
                            )}
                          </td>

                          <td>{rec.lateMinutes > 0 ? <span className="att-min-badge warn">{rec.lateMinutes} {t('min')}</span> : '—'}</td>
                          <td>{rec.earlyLeaveMinutes > 0 ? <span className="att-min-badge dang">{rec.earlyLeaveMinutes} {t('min')}</span> : '—'}</td>

                          <td style={{ maxWidth: 220 }}>
                            {isEditing ? (
                              <textarea className="form-control" rows="3" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder={t('notes')} style={{ width: '100%', minWidth: 220, minHeight: 70, fontSize: '.8rem', resize: 'vertical' }} />
                            ) : (
                              <span style={{ fontSize: '.78rem', color: normalizeNote(rec.notes) ? 'var(--att-navy)' : 'var(--att-muted)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {normalizeNote(rec.notes) || t('noNotes')}
                              </span>
                            )}

                            
                          </td>
<td className="text-center">
 {isEditing ? (
   <label
    style={{
      display:'inline-flex',
      alignItems:'center',
      gap:8,
      cursor:'pointer'
    }}
   >
    <input
      type="checkbox"
      checked={form.invalidated}
      onChange={(e)=>
        setForm({
          ...form,
          invalidated:e.target.checked
        })
      }
      style={{
       width:18,
       height:18,
       accentColor:'#dc3545'
      }}
    />

    <span className="text-danger fw-bold">
      {t('invalidateRecord')}
    </span>

   </label>
 ) : rec.invalidated ? (
   <span className="badge bg-danger">
      {t('invalidated')}
   </span>
 ) : (
   "—"
 )}
</td>
                          {isAdmin && (
                            <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                              {isEditing ? (
                                <div style={{ display: 'flex', gap: '.4rem', justifyContent: 'center' }}>
                                  <button className="att-btn att-btn-success att-btn-sm" disabled={saving} onClick={() => saveEdit(rec._id)}>
                                    {saving ? 'Saving...' : 'Save'}
                                  </button>
                                  <button className="att-btn att-btn-ghost att-btn-sm" onClick={cancelEdit} disabled={saving}>
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button className="att-btn att-btn-primary att-btn-sm" onClick={() => startEdit(rec)}>
                                  Edit
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

              {/* Rich Transit Details - From To | Gap | Threshold | Deduction */}
              {transits.length > 0 && (
                <div className="att-transit-card">
                  <div className="att-transit-header">
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
                      {transits.map((tr, idx) => (
                        <tr key={idx}>
                          <td>{tr.fromBranchName || '—'}</td>
                          <td>{tr.toBranchName || '—'}</td>
                          <td><strong>{tr.gapMinutes}</strong> {t('min')}</td>
                          <td>{tr.threshold || 0} {t('min')}</td>
                          <td className={tr.deductionMinutes > 0 ? 'att-transit-deduction' : ''}>
                            {tr.deductionMinutes > 0 ? `−${tr.deductionMinutes} ${t('min')}` : '0'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}


              {/* Break / Gap Details */}
{gaps.length > 0 && (
  <div className="att-transit-card">

    <div className="att-transit-header">
      <i className="fas fa-mug-hot" />
      {t('breakDetails')}
    </div>

    <table className="att-transit-table">
      <thead>
        <tr>
          <th>{t('breakDuration')}</th>
          <th>{t('allowedMinutes')}</th>
          <th>{t('deductionMinutes')}</th>
        </tr>
      </thead>

      <tbody>
        {gaps.map((gap, idx) => {

          const allowed =
            (gap.gapMinutes || 0) -
            (gap.deductionMinutes || 0);

          return (
            <tr key={idx}>

              <td>
                <strong>
                  {gap.gapMinutes || 0}
                </strong> {t('min')}
              </td>

              <td>
                {allowed > 0
                  ? `${allowed} ${t('min')}`
                  : `0 ${t('min')}`
                }
              </td>

              <td
                className={
                  gap.deductionMinutes > 0
                    ? 'att-transit-deduction'
                    : ''
                }
              >
                {gap.deductionMinutes > 0
                  ? `−${gap.deductionMinutes} ${t('min')}`
                  : `0 ${t('min')}`
                }
              </td>

            </tr>
          );
        })}
      </tbody>
    </table>

  </div>
)}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="att-modal-footer">
          {isAdmin && !showCreate && (
            <button className="att-btn att-btn-success" onClick={() => setShowCreate(true)}>
              <i className="fas fa-plus-circle" />
              {t('addAttendance')}
            </button>
          )}
          <button className="att-btn att-btn-danger" onClick={onClose} style={{ marginInlineStart: 'auto' }}>
            <i className="fas fa-times-circle" />
            {t('close')}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default EmployeeAttendanceDetailsModal;