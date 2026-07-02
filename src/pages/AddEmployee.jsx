// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { apiGet, apiPost } from '../helpers/api';
// import { useTranslation } from 'react-i18next';
// import '../style/AddEmployee.css';

// function AddEmployee() {
//   const { t } = useTranslation();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     role: 'staff',
//     branches: [],
//     phone: '',
//     address: '',
//     salary: '',
//     workingDaysNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
//     workStartTime: '09:00',
//     workEndTime: '17:00',
//     absenceDeductionRate: 0,
//     lateDeductionRate: 0,
//     earlyLeaveDeductionRate: 0,
//     allowRemoteAbsence: false,
//     isNightShift: false,
//     // حقول محسوبة تلقائياً - للعرض فقط
//     calculatedWorkingHours: 8,
//     expectedMonthlyWorkingDays: 22
//   });
//   const [allowedTransitMinutes, setAllowedTransitMinutes] = useState(0);

//   const [branches, setBranches] = useState([]);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [formErrors, setFormErrors] = useState({});
//   const navigate = useNavigate();

//   const daysOfWeek = [
//     'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
//   ];

//   // حساب ساعات العمل تلقائياً
//   const calculateWorkingHours = (startTime, endTime, isNightShift = false) => {
//     if (!startTime || !endTime) return 0;
    
//     const [startHour, startMin] = startTime.split(':').map(Number);
//     const [endHour, endMin] = endTime.split(':').map(Number);
    
//     let startMinutes = startHour * 60 + startMin;
//     let endMinutes = endHour * 60 + endMin;
    
//     if (isNightShift && endHour < startHour) {
//       endMinutes += 24 * 60; // إضافة 24 ساعة للورديات الليلية
//     }
    
//     return Math.max(0, (endMinutes - startMinutes) / 60);
//   };

//   // حساب أيام العمل المتوقعة شهرياً
//   const calculateMonthlyWorkingDays = (workingDaysNames) => {
//     if (!workingDaysNames.length) return 0;
    
//     // حساب متوسط الأيام العاملة في الشهر (4.33 أسبوع تقريباً)
//     const weeksPerMonth = 4.33;
//     return Math.round(workingDaysNames.length * weeksPerMonth);
//   };

//   // تحديث الحسابات عند تغيير الأوقات أو الأيام
//   useEffect(() => {
//     const calculatedHours = calculateWorkingHours(
//       formData.workStartTime, 
//       formData.workEndTime, 
//       formData.isNightShift
//     );
    
//     const expectedDays = calculateMonthlyWorkingDays(formData.workingDaysNames);
    
//     setFormData(prev => ({
//       ...prev,
//       calculatedWorkingHours: calculatedHours,
//       expectedMonthlyWorkingDays: expectedDays
//     }));
//   }, [formData.workStartTime, formData.workEndTime, formData.isNightShift, formData.workingDaysNames]);

//   useEffect(() => {
//     const fetchBranches = async () => {
//       try {
//         const res = await apiGet('/branches');
//         setBranches(res.data);
//       } catch (err) {
//         setError(t('error'));
//       }
//     };
//     fetchBranches();
//   }, [t]);

//   const formatTime = (time) => {
//     if (!time) return '';
//     const [hours, minutes] = time.split(':').map(Number);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
//   };

//   const validateForm = () => {
//     const errors = {};
//     if (!formData.name) errors.name = t('nameRequired');
//     if (!formData.email) errors.email = t('emailRequired');
//     if (!formData.branches.length) errors.branches = t('branchesRequired');
//     if (!formData.salary || formData.salary <= 0) errors.salary = t('salaryRequired');
//     if (!formData.workingDaysNames.length) errors.workingDaysNames = t('workingDaysRequired');
    
//     if (!formData.workStartTime || !formData.workEndTime) {
//       errors.time = t('timeRequired');
//     } else {
//       const calculatedHours = calculateWorkingHours(
//         formData.workStartTime, 
//         formData.workEndTime, 
//         formData.isNightShift
//       );
      
//       if (calculatedHours <= 0) {
//         errors.time = formData.isNightShift 
//           ? t('invalidNightShiftTime')
//           : t('endTimeAfterStart');
//       }
//     }
    
//     // التحقق من معقولية معدلات الخصم (0-100%)
//     if (formData.absenceDeductionRate < 0 || formData.absenceDeductionRate > 100) {
//       errors.absenceDeductionRate = t('invalidDeductionRate');
//     }
//     if (formData.lateDeductionRate < 0 || formData.lateDeductionRate > 100) {
//       errors.lateDeductionRate = t('invalidDeductionRate');
//     }
//     if (formData.earlyLeaveDeductionRate < 0 || formData.earlyLeaveDeductionRate > 100) {
//       errors.earlyLeaveDeductionRate = t('invalidDeductionRate');
//     }
    
//     return errors;
//   };

//   const handleDayChange = (day) => {
//     setFormData((prev) => {
//       const workingDays = prev.workingDaysNames.includes(day)
//         ? prev.workingDaysNames.filter((d) => d !== day)
//         : [...prev.workingDaysNames, day];
//       return { ...prev, workingDaysNames: workingDays };
//     });
//     setFormErrors((prev) => ({ ...prev, workingDaysNames: '' }));
//   };

//   const handleBranchChange = (branchId) => {
//     setFormData((prev) => {
//       const branches = prev.branches.includes(branchId)
//         ? prev.branches.filter((id) => id !== branchId)
//         : [...prev.branches, branchId];
//       return { ...prev, branches };
//     });
//     setFormErrors((prev) => ({ ...prev, branches: '' }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setFormErrors({});

//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     try {
//       const dataToSend = {
//         ...formData,
//         workingDaysNames: formData.workingDaysNames,
//         // إرسال معدلات الخصم كنسب عشرية (0-1)
//         absenceDeductionRate: formData.absenceDeductionRate / 100,
//         lateDeductionRate: formData.lateDeductionRate / 100,
//         earlyLeaveDeductionRate: formData.earlyLeaveDeductionRate / 100,
//         workStartTime: formatTime(formData.workStartTime),
//         workEndTime: formatTime(formData.workEndTime),
//         // حفظ الساعات المحسوبة
//         workingHoursPerDay: formData.calculatedWorkingHours,
//         requiredWorkingDays: formData.expectedMonthlyWorkingDays,
//          allowedTransitMinutes,
//       };
      
//       const res = await apiPost('/users', dataToSend);
//       setSuccess(res.data.message || t('success'));
//       setTimeout(() => navigate('/admin/dashboard'), 2000);
//     } catch (err) {
//       setError(err.response?.data?.message || t('error'));
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2>{t('addEmployee')}</h2>
      
//       {/* Toast messages */}
//       <div className="toast-container position-fixed top-0 end-0 p-3">
//         {success && (
//           <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
//             <div className="toast-header bg-success text-white">
//               <i className="fas fa-check-circle me-2"></i>
//               <strong className="me-auto">{t('success')}</strong>
//               <button type="button" className="btn-close btn-close-white" onClick={() => setSuccess('')}></button>
//             </div>
//             <div className="toast-body">{success}</div>
//           </div>
//         )}
//         {error && (
//           <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
//             <div className="toast-header bg-danger text-white">
//               <i className="fas fa-exclamation-triangle me-2"></i>
//               <strong className="me-auto">{t('error')}</strong>
//               <button type="button" className="btn-close btn-close-white" onClick={() => setError('')}></button>
//             </div>
//             <div className="toast-body">{error}</div>
//           </div>
//         )}
//       </div>

//       <form onSubmit={handleSubmit}>
//         {/* البيانات الأساسية */}
//         <div className="row">
//           <div className="col-md-6 mb-3">
//             <label className="form-label">{t('name')} *</label>
//             <input
//               type="text"
//               className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               required
//             />
//             {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
//           </div>
          
//           <div className="col-md-6 mb-3">
//             <label className="form-label">{t('email')} *</label>
//             <input
//               type="email"
//               className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               required
//             />
//             {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
//           </div>
//         </div>

//         <div className="row">
//           <div className="col-md-6 mb-3">
//             <label className="form-label">{t('role')}</label>
//             <select
//               className="form-select"
//               value={formData.role}
//               onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//             >
//               <option value="staff">{t('staff')}</option>
//               <option value="admin">{t('admin')}</option>
//             </select>
//           </div>
          
//           <div className="col-md-6 mb-3">
//             <label className="form-label">{t('salary')} * (شهري)</label>
//             <input
//               type="number"
//               className={`form-control ${formErrors.salary ? 'is-invalid' : ''}`}
//               value={formData.salary}
//               onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
//               min="0"
//               step="0.01"
//             />
//             {formErrors.salary && <div className="invalid-feedback">{formErrors.salary}</div>}
//           </div>
//         </div>

//         {/* الفروع */}
//         <div className="mb-3">
//           <label className="form-label">{t('branches')} *</label>
//           <div className="checkbox-group border p-3 rounded">
//             {branches.map((branch) => (
//               <div key={branch._id} className="form-check form-check-inline">
//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   id={`branch-${branch._id}`}
//                   checked={formData.branches.includes(branch._id)}
//                   onChange={() => handleBranchChange(branch._id)}
//                 />
//                 <label className="form-check-label" htmlFor={`branch-${branch._id}`}>
//                   {branch.name}
//                 </label>
//               </div>
//             ))}
//           </div>
//           {formErrors.branches && <div className="text-danger mt-1">{formErrors.branches}</div>}
//         </div>

//         {/* أيام العمل */}
//         <div className="mb-3">
//           <label className="form-label">{t('workingDaysNames')} *</label>
//           <div className="checkbox-group border p-3 rounded">
//             {daysOfWeek.map((day) => (
//               <div key={day} className="form-check form-check-inline">
//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   id={`day-${day}`}
//                   checked={formData.workingDaysNames.includes(day)}
//                   onChange={() => handleDayChange(day)}
//                 />
//                 <label className="form-check-label" htmlFor={`day-${day}`}>
//                   {t(day.toLowerCase())}
//                 </label>
//               </div>
//             ))}
//           </div>
//           {formErrors.workingDaysNames && <div className="text-danger mt-1">{formErrors.workingDaysNames}</div>}
//           <small className="text-muted">
//   متوسط عدد أيام العمل شهرياً (تقريبي): {formData.expectedMonthlyWorkingDays} يوم
// </small>

//         </div>
// <div className="col-md-6 mb-3">
//   <label className="form-label">وقت التنقل المسموح بين الفروع (بالدقايق)</label>
//   <input
//     type="number"
//     className="form-control"
//     min="0"
//     value={allowedTransitMinutes}
//     onChange={(e) => setAllowedTransitMinutes(Number(e.target.value))}
//   />
//   <small className="text-muted">
// يستخدم اذا كان الموظف يعمل في اكثر من فرع , وقت التنقل المسموح بين الفروع والذي اذا تخطاه الموظف تخصم الدقائق الزائده عنه من راتبه  </small>
// </div>

//         {/* أوقات العمل */}
//         <div className="row">
//           <div className="col-md-4 mb-3">
//             <label className="form-label">{t('workStartTime')} *</label>
//             <input
//               type="time"
//               className={`form-control ${formErrors.time ? 'is-invalid' : ''}`}
//               value={formData.workStartTime}
//               onChange={(e) => setFormData({ ...formData, workStartTime: e.target.value })}
//               required
//             />
//             {formErrors.time && <div className="invalid-feedback">{formErrors.time}</div>}
//           </div>
          
//           <div className="col-md-4 mb-3">
//             <label className="form-label">{t('workEndTime')} *</label>
//             <input
//               type="time"
//               className={`form-control ${formErrors.time ? 'is-invalid' : ''}`}
//               value={formData.workEndTime}
//               onChange={(e) => setFormData({ ...formData, workEndTime: e.target.value })}
//               required
//             />
//             {formErrors.time && <div className="invalid-feedback">{formErrors.time}</div>}
//           </div>
          
//           <div className="col-md-4 mb-3">
//             <label className="form-label">ساعات العمل اليومية</label>
//             <input
//               type="number"
//               className="form-control"
//               value={formData.calculatedWorkingHours}
//               disabled
//               style={{ backgroundColor: '#f8f9fa' }}
//             />
//             <small className="text-muted">محسوبة تلقائياً</small>
//           </div>
//         </div>

//         <div className="mb-3 form-check">
//           <input
//             type="checkbox"
//             className="form-check-input"
//             id="isNightShift"
//             checked={formData.isNightShift}
//             onChange={(e) => setFormData({ ...formData, isNightShift: e.target.checked })}
//           />
//           <label className="form-check-label" htmlFor="isNightShift">
//             {t('isNightShift')} (العمل عبر منتصف الليل)
//           </label>
//         </div>

//         {/* معدلات الخصم */}
//         <div className="card mb-3">
//           <div className="card-header">
//             <h5 className="mb-0">معدلات الخصم (%)</h5>
//           </div>
//           <div className="card-body">
//             <div className="row">
//               <div className="col-md-4 mb-3">
//                 <label className="form-label">{t('absenceDeductionRate')} (%)</label>
//                 <input
//                   type="number"
//                   className={`form-control ${formErrors.absenceDeductionRate ? 'is-invalid' : ''}`}
//                   value={formData.absenceDeductionRate}
//                   onChange={(e) => setFormData({ ...formData, absenceDeductionRate: e.target.value })}
//                   min="0"
//                   max="100"
//                   step="0.1"
//                 />
//                 {formErrors.absenceDeductionRate && <div className="invalid-feedback">{formErrors.absenceDeductionRate}</div>}
//                 <small className="text-muted">نسبة الخصم من الراتب اليومي عن كل يوم غياب</small>
//               </div>
              
//               <div className="col-md-4 mb-3">
//                 <label className="form-label">{t('lateDeductionRate')} (%)</label>
//                 <input
//                   type="number"
//                   className={`form-control ${formErrors.lateDeductionRate ? 'is-invalid' : ''}`}
//                   value={formData.lateDeductionRate}
//                   onChange={(e) => setFormData({ ...formData, lateDeductionRate: e.target.value })}
//                   min="0"
//                   max="100"
//                   step="0.1"
//                 />
//                 {formErrors.lateDeductionRate && <div className="invalid-feedback">{formErrors.lateDeductionRate}</div>}
//                 <small className="text-muted">نسبة الخصم من الراتب الساعي عن كل ساعة تأخير</small>
//               </div>
              
//               <div className="col-md-4 mb-3">
//                 <label className="form-label">{t('earlyLeaveDeductionRate')} (%)</label>
//                 <input
//                   type="number"
//                   className={`form-control ${formErrors.earlyLeaveDeductionRate ? 'is-invalid' : ''}`}
//                   value={formData.earlyLeaveDeductionRate}
//                   onChange={(e) => setFormData({ ...formData, earlyLeaveDeductionRate: e.target.value })}
//                   min="0"
//                   max="100"
//                   step="0.1"
//                 />
//                 {formErrors.earlyLeaveDeductionRate && <div className="invalid-feedback">{formErrors.earlyLeaveDeductionRate}</div>}
//                 <small className="text-muted">نسبة الخصم من الراتب الساعي عن كل ساعة انصراف مبكر</small>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* باقي الحقول */}
//         <div className="row">
//           <div className="col-md-6 mb-3">
//             <label className="form-label">{t('phone')}</label>
//             <input
//               type="text"
//               className="form-control"
//               value={formData.phone}
//               onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//             />
//           </div>
          
//           <div className="col-md-6 mb-3">
//             <label className="form-label">{t('address')}</label>
//             <input
//               type="text"
//               className="form-control"
//               value={formData.address}
//               onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//             />
//           </div>
//         </div>

//         <div className="mb-3 form-check">
//           <input
//             type="checkbox"
//             className="form-check-input"
//             id="allowRemoteAbsence"
//             checked={formData.allowRemoteAbsence}
//             onChange={(e) => setFormData({ ...formData, allowRemoteAbsence: e.target.checked })}
//           />
//           <label className="form-check-label" htmlFor="allowRemoteAbsence">
//             {t('allowRemoteAbsence')}
//           </label>
//         </div>

//         {/* معلومات الراتب المحسوبة */}
//         <div className="card mb-3">
//           <div className="card-header">
//             <h5 className="mb-0">ملخص الراتب</h5>
//           </div>
//           <div className="card-body">
//             {formData.salary > 0 && formData.expectedMonthlyWorkingDays > 0 && (
//               <div className="row">
//                 <div className="col-md-4">
//                   <strong>الراتب الشهري:</strong> {formData.salary} جنيه
//                 </div>
//                 <div className="col-md-4">
//                   <strong>الراتب اليومي:</strong> {(formData.salary / formData.expectedMonthlyWorkingDays).toFixed(2)} جنيه
//                 </div>
//                 <div className="col-md-4">
//                   <strong>الراتب الساعي:</strong> {formData.calculatedWorkingHours > 0 ? 
//                     (formData.salary / (formData.expectedMonthlyWorkingDays * formData.calculatedWorkingHours)).toFixed(2) : '0'} جنيه
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <button type="submit" className="btn btn-primary btn-lg">
//           <i className="fas fa-user-plus me-2"></i>{t('submit')}
//         </button>
//         <button type="button" className="btn btn-secondary btn-lg ms-2" onClick={() => navigate('/admin/dashboard')}>
//           <i className="fas fa-arrow-left me-2"></i>{t('cancel')}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default AddEmployee;






























// import { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { addUser } from '../services/user.api';
// import { getBranches } from '../services/branch.api';
// import { getDepartments } from '../services/department.api';
// // import { getUserEffectiveAttendancePolicy } from '../services/attendancePolicy.api';

// import { resolvePolicy } from '../services/attendancePolicy.api';
// import { getTokenPayload, isGlobalAdmin } from '../helpers/auth';

// import '../style/AddEmployee.css';

// // ─── current admin from localStorage ─────────────────────────────────────────
// // const useCurrentAdmin = () => {
// //   try {
// //     const raw = localStorage.getItem('user');
// //     return raw ? JSON.parse(raw) : null;
// //   } catch { return null; }
// // };

// // ─── helpers ──────────────────────────────────────────────────────────────────
// const calcWorkingHours = (start, end, nightShift = false) => {
//   if (!start || !end) return 0;
//   const [sh, sm] = start.split(':').map(Number);
//   const [eh, em] = end.split(':').map(Number);
//   let s = sh * 60 + sm, e2 = eh * 60 + em;
//   if (nightShift && eh < sh) e2 += 24 * 60;
//   return Math.max(0, (e2 - s) / 60);
// };
// const calcMonthlyDays = (days) => Math.round((days?.length || 0) * 4.33);
// const fmt2 = (n) => String(n).padStart(2, '0');
// const fmtTime = (t) => {
//   if (!t) return '';
//   const [h, m] = t.split(':').map(Number);
//   return `${fmt2(h)}:${fmt2(m)}`;
// };

// const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// const DEFAULTS = {
//   name: '', email: '', role: 'staff',
//   branches: [], departments: [],
//   phone: '', address: '', salary: '',
//   workingDaysNames: ['Sunday','Monday','Tuesday','Wednesday','Thursday'],
//   workStartTime: '09:00', workEndTime: '17:00',
//   isNightShift: false, allowRemoteAbsence: false,
//   allowedTransitMinutes: 0,
//   adminScopeType: 'BRANCH',
//   adminScopeBranches: [],
// };

// // ─── component ────────────────────────────────────────────────────────────────
// export default function AddEmployee() {
//   const { t } = useTranslation("Addemployee");
//   const navigate = useNavigate();
//   // const currentAdmin = useCurrentAdmin();
//   // const isGlobal = currentAdmin?.adminScope?.type === 'GLOBAL';
//   const payload    = getTokenPayload();
// const isGlobal   = isGlobalAdmin();
// const adminScope = payload?.adminScope || null;

// // const isGlobal =
// //   currentAdmin?.adminScope?.type === 'GLOBAL' ||
// //   currentAdmin?.adminScopeType === 'GLOBAL';
//   const [form, setForm]               = useState(DEFAULTS);
//   const [branches, setBranches]       = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [policy, setPolicy]           = useState(null);
//   const [policyLoading, setPolicyLoading] = useState(false);
//   const [errors, setErrors]           = useState({});
//   const [toast, setToast]             = useState(null);
//   const [submitting, setSubmitting]   = useState(false);

//   // ── derived ────────────────────────────────────────────────────────────────
//   const workingHours = calcWorkingHours(form.workStartTime, form.workEndTime, form.isNightShift);
//   const monthlyDays  = calcMonthlyDays(form.workingDaysNames);
//   const dailySalary  = form.salary && monthlyDays  ? (form.salary / monthlyDays).toFixed(2)   : 0;
//   const hourlySalary = dailySalary && workingHours ? (dailySalary / workingHours).toFixed(2)  : 0;

//   // policy display values
//   const latePerHour       = policy ? +(policy.rates?.latePerMinute       * 60).toFixed(4) : null;
//   const earlyLeavePerHour = policy ? +(policy.rates?.earlyLeavePerMinute * 60).toFixed(4) : null;
//   const absenceDayRate    = policy?.absence?.dayRate ?? null;
//   const graceLateMins     = policy?.grace?.lateMinutes       ?? null;
//   const graceEarlyMins    = policy?.grace?.earlyLeaveMinutes ?? null;

//   // ── load branches ──────────────────────────────────────────────────────────
//   useEffect(() => {
//     getBranches().then(res => {
//       const all = res.data?.branches || res.data || [];
//       // if (!isGlobal && currentAdmin?.adminScope?.branches?.length) {
//       //   const allowed = currentAdmin.adminScope.branches.map(String);
//       if (!isGlobal && adminScope?.branches?.length) {
//   const allowed = adminScope.branches.map(String);

//         setBranches(all.filter(b => allowed.includes(String(b._id))));
//       } else {
//         setBranches(all);
//       }
//     }).catch(() => showToast('error', t('error')));
//   }, []);

//   // ── load departments ───────────────────────────────────────────────────────
//   useEffect(() => {
//     getDepartments()
//       .then(res => setDepartments(res.data?.departments || res.data || []))
//       .catch(() => {});
//   }, []);

//   // ── fetch effective policy when branch/role changes ────────────────────────
// // ── fetch effective policy when branch/role changes ──────────────────────────
// // بنستخدم getPolicies الموجودة — priority: branch → role → global
// const fetchPolicy = useCallback(async (branches, role) => {
//   setPolicyLoading(true);

//   try {
//     const res = await resolvePolicy({
//       role: role || null,
//       branchId: branches.length === 1 ? branches[0] : null
//     });

//     setPolicy(res.data?.data || null);

//   } catch {
//     setPolicy(null);
//   } finally {
//     setPolicyLoading(false);
//   }
// }, []);


// //  useEffect(() => {
// //   fetchPolicy(form.branches, form.role);
// // }, [form.branches.join(','), form.role]);

// // ✅ حطي — بتمنع infinite loop
// useEffect(() => {
//   fetchPolicy(form.branches, form.role);
// }, [form.branches.join(','), form.role]);

// // useEffect(() => {
// //   fetchPolicy(form.branches, form.role);
// // }, [form.branches, form.role]);


// // const fetchPolicy = useCallback(async (branchId, role) => {
// //   if (!branchId) { setPolicy(null); return; }
// //   setPolicyLoading(true);
// //   try {
// //     const { getAttendancePolicies } = await import('../services/attendancePolicy.api');

// //     // 1️⃣ branch policy
// //     const branchRes = await getAttendancePolicies({ scope: 'branch', branchId, active: true, limit: 1 });
// //     if (branchRes?.data?.[0]) {
// //       setPolicy({ ...branchRes.data[0], _resolvedScope: 'branch' }); return;
// //     }

// //     // 2️⃣ role policy
// //     const roleRes = await getAttendancePolicies({ scope: 'role', role: role || 'staff', active: true, limit: 1 });
// //     if (roleRes?.data?.[0]) {
// //       setPolicy({ ...roleRes.data[0], _resolvedScope: 'role' }); return;
// //     }

// //     // 3️⃣ global fallback
// //     const globalRes = await getAttendancePolicies({ scope: 'global', active: true, limit: 1 });
// //     setPolicy(globalRes?.data?.[0] ? { ...globalRes.data[0], _resolvedScope: 'global' } : null);

// //   } catch {
// //     setPolicy(null);
// //   } finally {
// //     setPolicyLoading(false);
// //   }
// // }, []);

// //   useEffect(() => {
// //     fetchPolicy(form.branches[0], form.role);
// //   }, [form.branches[0], form.role]);

//   // ── helpers ────────────────────────────────────────────────────────────────
//   const showToast = (type, msg) => {
//     setToast({ type, msg });
//     setTimeout(() => setToast(null), 4000);
//   };
//   const set    = (key, val)  => setForm(prev => ({ ...prev, [key]: val }));
//  const toggle = (field, val) => {
//   setForm(prev => {
//     const arr = prev[field];
//     const updated = arr.includes(val)
//       ? arr.filter(x => x !== val)
//       : [...arr, val];

//     return { ...prev, [field]: updated };
//   });
// };

//   // ── validation ─────────────────────────────────────────────────────────────
//   const validate = () => {
//     const e = {};
//     if (!form.name.trim())                  e.name             = t('nameRequired');
//     if (!form.email.trim())                 e.email            = t('emailRequired');
//     if (!form.branches.length)              e.branches         = t('branchesRequired');
//     if (!form.salary || +form.salary <= 0)  e.salary           = t('salaryRequired');
//     if (!form.workingDaysNames.length)      e.workingDaysNames = t('workingDaysRequired');
//     if (workingHours <= 0)                  e.time             = t('endTimeAfterStart');
//     if (!isGlobal && form.role === 'admin') e.role = 'Branch admin cannot create another admin';
//     if (form.role === 'admin' && form.adminScopeType === 'BRANCH' && !form.adminScopeBranches.length)
//       e.adminScopeBranches = 'يجب تحديد فرع واحد على الأقل';
//     return e;
//   };

//   // ── submit ─────────────────────────────────────────────────────────────────
//   const handleSubmit = async (ev) => {
//     ev.preventDefault();
//     const errs = validate();
//     if (Object.keys(errs).length) { setErrors(errs); return; }
//     setSubmitting(true);
//     try {
//       const payload = {
//         name: form.name, email: form.email,
//         role: form.role,
//         branches: form.branches,
//         departments: form.departments,
//         phone: form.phone, address: form.address,
//         salary: Number(form.salary),
//         workingDaysNames: form.workingDaysNames,
//         workStartTime: fmtTime(form.workStartTime),
//         workEndTime:   fmtTime(form.workEndTime),
//         isNightShift: form.isNightShift,
//         workingHoursPerDay:    workingHours,
//         requiredWorkingDays:   monthlyDays,
//         allowRemoteAbsence:    form.allowRemoteAbsence,
//         allowedTransitMinutes: Number(form.allowedTransitMinutes),
//         // ⚠️ معدلات الخصم مش بتتبعت — بتيجي من AttendancePolicy على السيرفر
//       };

//       if (form.role === 'admin') {
//         payload.adminScope = {
//           type: form.adminScopeType,
//           branches: form.adminScopeType === 'BRANCH' ? form.adminScopeBranches : [],
//         };
//       }

//       await addUser(payload);
//       showToast('success', t('success'));
//       setTimeout(() => navigate('/admin/dashboard'), 1800);
//     } catch (err) {
//       showToast('error', err.response?.data?.message || t('error'));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ── render ─────────────────────────────────────────────────────────────────
//   return (
//     <div className="container mt-4 mb-5">

//       {/* Toast */}
//       {toast && (
//         <div className={`alert alert-${toast.type === 'success' ? 'success' : 'danger'} alert-dismissible`}>
//           {toast.msg}
//           <button className="btn-close" onClick={() => setToast(null)} />
//         </div>
//       )}

//       <h2 className="mb-4">
//         {t('addEmployee.title')}</h2>

//       <form onSubmit={handleSubmit} noValidate>

//         {/* ══ Basic Info ═══════════════════════════════════════════════════ */}
//         <div className="card mb-3">
//           <div className="card-header fw-semibold">البيانات الأساسية</div>
//           <div className="card-body">
//             <div className="row">

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">{t('name')} *</label>
//                 <input className={`form-control ${errors.name ? 'is-invalid':''}`}
//                   value={form.name} onChange={e => set('name', e.target.value)} />
//                 {errors.name && <div className="invalid-feedback">{errors.name}</div>}
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">{t('email')} *</label>
//                 <input type="email" className={`form-control ${errors.email ? 'is-invalid':''}`}
//                   value={form.email} onChange={e => set('email', e.target.value)} />
//                 {errors.email && <div className="invalid-feedback">{errors.email}</div>}
//               </div>

//               {/* Role */}
//               <div className="col-md-4 mb-3">
//                 <label className="form-label">{t('role')}</label>
//                 {!isGlobal ? (
//                   /* Branch admin يشوف staff فقط — read only */
//                   <input className="form-control" value="Staff" disabled />
//                 ) : (
//                   <select className={`form-select ${errors.role ? 'is-invalid':''}`}
//                     value={form.role} onChange={e => { set('role', e.target.value); set('adminScopeType','BRANCH'); set('adminScopeBranches',[]); }}>
//                     <option value="staff">Staff</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                 )}
//                 {errors.role && <div className="invalid-feedback d-block">{errors.role}</div>}
//               </div>

//               <div className="col-md-4 mb-3">
//                 <label className="form-label">{t('phone')}</label>
//                 <input className="form-control" value={form.phone}
//                   onChange={e => set('phone', e.target.value)} />
//               </div>

//               <div className="col-md-4 mb-3">
//                 <label className="form-label">{t('address')}</label>
//                 <input className="form-control" value={form.address}
//                   onChange={e => set('address', e.target.value)} />
//               </div>

//               <div className="col-md-4 mb-3">
//                 <label className="form-label">{t('salary')} * (شهري)</label>
//                 <input type="number" min="0" step="0.01"
//                   className={`form-control ${errors.salary ? 'is-invalid':''}`}
//                   value={form.salary} onChange={e => set('salary', e.target.value)} />
//                 {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
//               </div>

//             </div>
//           </div>
//         </div>

//         {/* ══ Admin Scope (فقط إذا isGlobal + role=admin) ══════════════════ */}
//         {isGlobal && form.role === 'admin' && (
//           <div className="card mb-3 border-warning">
//             <div className="card-header fw-semibold bg-warning bg-opacity-10">
//               🔐 صلاحيات الأدمن الجديد
//             </div>
//             <div className="card-body">
//               <label className="form-label">نوع الصلاحية</label>
//               <div className="d-flex gap-4 mb-3">
//                 <div className="form-check">
//                   <input type="radio" className="form-check-input" id="scopeGlobal"
//                     checked={form.adminScopeType === 'GLOBAL'}
//                     onChange={() => { set('adminScopeType','GLOBAL'); set('adminScopeBranches',[]); }} />
//                   <label className="form-check-label" htmlFor="scopeGlobal">
//                     🌍 <strong>Super Admin</strong> — صلاحية على جميع الفروع
//                   </label>
//                 </div>
//                 <div className="form-check">
//                   <input type="radio" className="form-check-input" id="scopeBranch"
//                     checked={form.adminScopeType === 'BRANCH'}
//                     onChange={() => set('adminScopeType','BRANCH')} />
//                   <label className="form-check-label" htmlFor="scopeBranch">
//                     🏢 <strong>Branch Admin</strong> — فروع محددة فقط
//                   </label>
//                 </div>
//               </div>

//               {form.adminScopeType === 'BRANCH' && (
//                 <>
//                   <label className="form-label">اختر الفروع المسموح بها *</label>
//                   <div className={`d-flex flex-wrap gap-3 border rounded p-3 ${errors.adminScopeBranches ? 'border-danger':''}`}>
//                     {branches.map(b => (
//                       <div key={b._id} className="form-check">
//                         <input type="checkbox" className="form-check-input" id={`asc-${b._id}`}
//                           checked={form.adminScopeBranches.includes(b._id)}
//                           onChange={() => toggle('adminScopeBranches', b._id)} />
//                         <label className="form-check-label" htmlFor={`asc-${b._id}`}>{b.name}</label>
//                       </div>
//                     ))}
//                   </div>
//                   {errors.adminScopeBranches && (
//                     <div className="text-danger small mt-1">{errors.adminScopeBranches}</div>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//         )}

//         {/* ══ Branches ═════════════════════════════════════════════════════ */}
//         <div className="card mb-3">
//           <div className="card-header fw-semibold">{t('branches')} *</div>
//           <div className="card-body">
//             <div className={`d-flex flex-wrap gap-3 ${errors.branches ? 'border border-danger rounded p-2':''}`}>
//               {branches.map(b => (
//                 <div key={b._id} className="form-check">
//                   <input type="checkbox" className="form-check-input" id={`br-${b._id}`}
//                     checked={form.branches.includes(b._id)}
//                     onChange={() => toggle('branches', b._id)} />
//                   <label className="form-check-label" htmlFor={`br-${b._id}`}>{b.name}</label>
//                 </div>
//               ))}
//             </div>
//             {errors.branches && <div className="text-danger small mt-1">{errors.branches}</div>}
//             {policyLoading && (
//               <div className="mt-2 text-muted small">
//                 <span className="spinner-border spinner-border-sm me-1"/>جاري جلب سياسة الحضور...
//               </div>
//             )}
//             {policy && !policyLoading && (
//               <div className="alert alert-info py-2 small mt-2 mb-0">
//                 ✅ سياسة حضور فعّالة: <strong>
//   {policy.scopeName
//     ? `${policy.scope} - ${policy.scopeName}`
//     : policy.scope}
// </strong>
//                 {policy.note && <span className="ms-1 text-muted">({policy.note})</span>}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ══ Departments ══════════════════════════════════════════════════ */}
//         {departments.length > 0 && (
//           <div className="card mb-3">
//             <div className="card-header fw-semibold">الأقسام</div>
//             <div className="card-body">
//               <div className="d-flex flex-wrap gap-3">
//                 {departments.map(d => (
//                   <div key={d._id} className="form-check">
//                     <input type="checkbox" className="form-check-input" id={`dep-${d._id}`}
//                       checked={form.departments.includes(d._id)}
//                       onChange={() => toggle('departments', d._id)} />
//                     <label className="form-check-label" htmlFor={`dep-${d._id}`}>{d.name}</label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ══ Work Schedule ════════════════════════════════════════════════ */}
//         <div className="card mb-3">
//           <div className="card-header fw-semibold">جدول العمل</div>
//           <div className="card-body">

//             <label className="form-label">{t('workingDaysNames')} *</label>
//             <div className="d-flex flex-wrap gap-3 mb-1">
//               {DAYS.map(day => (
//                 <div key={day} className="form-check">
//                   <input type="checkbox" className="form-check-input" id={`day-${day}`}
//                     checked={form.workingDaysNames.includes(day)}
//                     onChange={() => toggle('workingDaysNames', day)} />
//                   <label className="form-check-label" htmlFor={`day-${day}`}>{t(day.toLowerCase())}</label>
//                 </div>
//               ))}
//             </div>
//             {errors.workingDaysNames && <div className="text-danger small mb-2">{errors.workingDaysNames}</div>}
//             <div className="text-muted small mb-3">متوسط أيام العمل شهرياً: <strong>{monthlyDays}</strong> يوم</div>

//             <div className="row">
//               <div className="col-md-4 mb-3">
//                 <label className="form-label">{t('workStartTime')} *</label>
//                 <input type="time" className={`form-control ${errors.time ? 'is-invalid':''}`}
//                   value={form.workStartTime} onChange={e => set('workStartTime', e.target.value)} />
//               </div>
//               <div className="col-md-4 mb-3">
//                 <label className="form-label">{t('workEndTime')} *</label>
//                 <input type="time" className={`form-control ${errors.time ? 'is-invalid':''}`}
//                   value={form.workEndTime} onChange={e => set('workEndTime', e.target.value)} />
//                 {errors.time && <div className="invalid-feedback">{errors.time}</div>}
//               </div>
//               <div className="col-md-4 mb-3">
//                 <label className="form-label">ساعات العمل اليومية</label>
//                 <input className="form-control" value={workingHours.toFixed(1)} disabled style={{background:'#f8f9fa'}}/>
//                 <small className="text-muted">محسوبة تلقائياً</small>
//               </div>
//             </div>

//             <div className="form-check mb-3">
//               <input type="checkbox" className="form-check-input" id="nightShift"
//                 checked={form.isNightShift} onChange={e => set('isNightShift', e.target.checked)} />
//               <label className="form-check-label" htmlFor="nightShift">{t('isNightShift')}</label>
//             </div>

//             <div className="col-md-5 mb-2">
//               <label className="form-label">وقت التنقل المسموح بين الفروع (دقيقة)</label>
//               <input type="number" min="0" className="form-control"
//                 value={form.allowedTransitMinutes}
//                 onChange={e => set('allowedTransitMinutes', +e.target.value)} />
//               <small className="text-muted">الدقائق الزائدة تُخصم من الراتب</small>
//             </div>

//             {/* <div className="form-check mt-2">
//               <input type="checkbox" className="form-check-input" id="remote"
//                 checked={form.allowRemoteAbsence} onChange={e => set('allowRemoteAbsence', e.target.checked)} />
//               <label className="form-check-label" htmlFor="remote">{t('allowRemoteAbsence')}</label>
//             </div> */}
//           </div>
//         </div>

//         {/* ══ Salary Summary + Policy Preview ══════════════════════════════ */}
//         <div className="card mb-4">
//           <div className="card-header fw-semibold">ملخص الراتب والسياسة المطبّقة</div>
//           <div className="card-body">

//             {form.salary > 0 && monthlyDays > 0 ? (
//               <div className="row text-center mb-3">
//                 <div className="col-md-4">
//                   <div className="text-muted small">الراتب الشهري</div>
//                   <div className="fs-5 fw-bold">{Number(form.salary).toLocaleString()} جنيه</div>
//                 </div>
//                 <div className="col-md-4">
//                   <div className="text-muted small">الراتب اليومي</div>
//                   <div className="fs-5 fw-bold">{dailySalary} جنيه</div>
//                   <div className="text-muted" style={{fontSize:'0.73rem'}}>÷ {monthlyDays} يوم</div>
//                 </div>
//                 <div className="col-md-4">
//                   <div className="text-muted small">الراتب الساعي</div>
//                   <div className="fs-5 fw-bold">{hourlySalary} جنيه</div>
//                   <div className="text-muted" style={{fontSize:'0.73rem'}}>÷ {workingHours.toFixed(1)} ساعة</div>
//                 </div>
//               </div>
//             ) : (
//               <p className="text-muted small mb-3">أدخل الراتب وجدول العمل لعرض الأرقام</p>
//             )}

//             {/* Policy section */}
//             {policyLoading && (
//               <div className="text-muted small">
//                 <span className="spinner-border spinner-border-sm me-1"/>جاري تحميل سياسة الحضور...
//               </div>
//             )}

//             {policy && !policyLoading && (
//               <>
//                 <hr/>
//                 <div className="d-flex align-items-center gap-2 mb-3">
//                   <span className="badge bg-primary text-capitalize">

                    
//   {policy.scopeName
//     ? `${policy.scope} - ${policy.scopeName}`
//     : policy.scope}

//                   </span>
//                   <span className="text-muted small">السياسة الفعّالة المطبّقة</span>
//                   {policy.note && <span className="badge bg-light text-dark">{policy.note}</span>}
//                 </div>

//                 <div className="row text-center g-2 mb-3">
//                   {[
//                     { label: 'سماح التأخير',      value: graceLateMins     != null ? `${graceLateMins} د`     : '—' },
//                     { label: 'سماح الانصراف',     value: graceEarlyMins    != null ? `${graceEarlyMins} د`    : '—' },
//                     { label: 'خصم التأخير/ساعة',  value: latePerHour       != null ? `${latePerHour} ج`       : '—' },
//                     { label: 'خصم الانصراف/ساعة', value: earlyLeavePerHour != null ? `${earlyLeavePerHour} ج` : '—' },
//                     { label: 'خصم الغياب',        value: absenceDayRate    != null ? (absenceDayRate === 1 ? 'يوم كامل' : `${absenceDayRate*100}%`) : '—' },
//                   ].map(item => (
//                     <div key={item.label} className="col-6 col-md">
//                       <div className="border rounded p-2 h-100">
//                         <div className="text-muted small">{item.label}</div>
//                         <div className="fw-bold">{item.value}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* أمثلة خصم */}
//                 {form.salary > 0 && +hourlySalary > 0 && (
//                   <div className="alert alert-light border small mb-0">
//                     <strong>أمثلة تقديرية للخصومات:</strong>
//                     <ul className="mb-0 mt-1">
//                       {latePerHour != null && (
//                         <li>تأخير ساعة ← خصم <strong>{(latePerHour * +hourlySalary).toFixed(2)} جنيه</strong></li>
//                       )}
//                       {earlyLeavePerHour != null && (
//                         <li>انصراف مبكر ساعة ← خصم <strong>{(earlyLeavePerHour * +hourlySalary).toFixed(2)} جنيه</strong></li>
//                       )}
//                       {absenceDayRate != null && (
//                         <li>يوم غياب ← خصم <strong>{(+dailySalary * absenceDayRate).toFixed(2)} جنيه</strong></li>
//                       )}
//                     </ul>
//                   </div>
//                 )}
//               </>
//             )}

//             {!policy && !policyLoading && form.branches.length > 0 && (
//               <div className="alert alert-warning small mb-0">
//                 ⚠️ لا توجد سياسة حضور مضبوطة لهذا الفرع — ستُطبّق القيم الافتراضية
//               </div>
//             )}
//             {!policy && !policyLoading && !form.branches.length && (
//               <div className="text-muted small">اختر فرعاً لعرض سياسة الحضور المطبّقة</div>
//             )}

//           </div>
//         </div>

//         {/* ══ Actions ══════════════════════════════════════════════════════ */}
//         <div className="d-flex gap-2">
//           <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
//             {submitting
//               ? <><span className="spinner-border spinner-border-sm me-2"/>جاري الحفظ...</>
//               : <><i className="fas fa-user-plus me-2"/>{t('submit')}</>}
//           </button>
//           <button type="button" className="btn btn-secondary btn-lg"
//             onClick={() => navigate('/admin/dashboardx')}>
//             <i className="fas fa-arrow-left me-2"/>{t('cancel')}
//           </button>
//         </div>

//       </form>
//     </div>
//   );
// }





import { useState, useEffect, useCallback } from 'react';
import { useNavigate }                       from 'react-router-dom';
import { useTranslation }                    from 'react-i18next';
import { TIMEZONES } from '../constants/timezones';
import { addUser }        from '../services/user.api';
import { getBranches }    from '../services/branch.api';
import { getDepartments } from '../services/department.api';
import { resolvePolicy }  from '../services/attendancePolicy.api';
import { getTokenPayload, isGlobalAdmin } from '../helpers/auth';

import '../style/AddEmployee.css';

/* ─── pure helpers ─────────────────────────────────────────────────────────── */
const calcWorkingHours = (start, end, nightShift = false) => {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let s = sh * 60 + sm;
  let e = eh * 60 + em;
  if (nightShift && eh < sh) e += 24 * 60;
  return Math.max(0, (e - s) / 60);
};

const calcMonthlyDays = (days) => Math.round((days?.length || 0) * 4.33);

// const fmtTime = (val) => {
//   if (!val) return '';
//   const [h, m] = val.split(':').map(Number);
//   return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
// };

const fmtTime = (val) => {
  if (!val) return '';

  // لو already HH:mm → رجعيه
  if (/^\d{2}:\d{2}$/.test(val)) return val;

  // لو ISO → نجيب الوقت بدون timezone conversion
  const match = val.match(/T(\d{2}):(\d{2})/);
  if (match) {
    return `${match[1]}:${match[2]}`;
  }

  return '';
};
/* ─── constants ────────────────────────────────────────────────────────────── */
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const DEFAULTS = {
  name: '', email: '', role: 'staff',
  branches: [], departments: [],
  phone: '', address: '', salary: '',
  workingDaysNames:     ['Sunday','Monday','Tuesday','Wednesday','Thursday'],
  workStartTime:        '09:00',
  workEndTime:          '17:00',
  workTimezone: '',
  isNightShift:         false,
  allowRemoteAbsence:   false,
  allowedTransitMinutes:0,
  adminScopeType:       'BRANCH',
  adminScopeBranches:   [],
};

/* ══════════════════════════════════════════════════════════════════════════════
   Component
══════════════════════════════════════════════════════════════════════════════ */
export default function AddEmployee() {
  const { t }    = useTranslation('Addemployee');
  const navigate = useNavigate();

  const payload    = getTokenPayload();
  const isGlobal   = isGlobalAdmin();
  const adminScope = payload?.adminScope || null;

  /* ── state ────────────────────────────────────────────────────────────── */
  const [form,          setForm]          = useState(DEFAULTS);
  const [branches,      setBranches]      = useState([]);
  const [departments,   setDepartments]   = useState([]);
  const [policy,        setPolicy]        = useState(null);
  const [policyLoading, setPolicyLoading] = useState(false);
  const [errors,        setErrors]        = useState({});
  const [toast,         setToast]         = useState(null);
  const [submitting,    setSubmitting]    = useState(false);

  /* ── derived ──────────────────────────────────────────────────────────── */
  const workingHours  = calcWorkingHours(form.workStartTime, form.workEndTime, form.isNightShift);
  const monthlyDays   = calcMonthlyDays(form.workingDaysNames);
  const dailySalary   = form.salary && monthlyDays  ? (form.salary / monthlyDays).toFixed(2)  : 0;
  const hourlySalary  = dailySalary && workingHours ? (dailySalary / workingHours).toFixed(2) : 0;

  const latePerHour       = policy ? +(policy.rates?.latePerMinute       * 60).toFixed(4) : null;
  const earlyLeavePerHour = policy ? +(policy.rates?.earlyLeavePerMinute * 60).toFixed(4) : null;
  const absenceDayRate    = policy?.absence?.dayRate        ?? null;
  const graceLateMins     = policy?.grace?.lateMinutes      ?? null;
  const graceEarlyMins    = policy?.grace?.earlyLeaveMinutes ?? null;

  /* ── load branches ────────────────────────────────────────────────────── */
  useEffect(() => {
    getBranches()
      .then(res => {
        const all = res.data?.branches || res.data || [];
        if (!isGlobal && adminScope?.branches?.length) {
          const allowed = adminScope.branches.map(String);
          setBranches(all.filter(b => allowed.includes(String(b._id))));
        } else {
          setBranches(all);
        }
      })
      .catch(() => showToast('error', t('error')));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── load departments ─────────────────────────────────────────────────── */
  useEffect(() => {
    getDepartments()
      .then(res => setDepartments(res.data?.departments || res.data || []))
      .catch(() => {});
  }, []);

  /* ── fetch policy when branch / role changes ──────────────────────────── */
  const fetchPolicy = useCallback(async (branches, role) => {
    setPolicyLoading(true);
    try {
      const res = await resolvePolicy({
        role:     role || null,
        branchId: branches.length === 1 ? branches[0] : null,
      });
      setPolicy(res.data?.data || null);
    } catch {
      setPolicy(null);
    } finally {
      setPolicyLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicy(form.branches, form.role);
  }, [form.branches.join(','), form.role]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── helpers ──────────────────────────────────────────────────────────── */
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const toggle = (field, val) =>
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(val)
        ? prev[field].filter(x => x !== val)
        : [...prev[field], val],
    }));

  /* ── validation ───────────────────────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (!form.name.trim())                 e.name             = t('nameRequired');
    if (!form.email.trim())                e.email            = t('emailRequired');
    if (!form.branches.length)             e.branches         = t('branchesRequired');
    if (!form.salary || +form.salary <= 0) e.salary           = t('salaryRequired');
    if (!form.workingDaysNames.length)     e.workingDaysNames = t('workingDaysRequired');
    if (workingHours <= 0)                 e.time             = t('endTimeAfterStart');
    if (!isGlobal && form.role === 'admin')
      e.role = t('addEmployee.validation.branchAdminCannotCreateAdmin');
    if (form.role === 'admin' && form.adminScopeType === 'BRANCH' && !form.adminScopeBranches.length)
      e.adminScopeBranches = t('addEmployee.validation.adminScopeBranchesRequired');
    return e;
  };

  /* ── submit ───────────────────────────────────────────────────────────── */
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const body = {
        name:                 form.name,
        email:                form.email,
        role:                 form.role,
        branches:             form.branches,
        departments:          form.departments,
        phone:                form.phone,
        address:              form.address,
        salary:               Number(form.salary),
        workingDaysNames:     form.workingDaysNames,
        workStartTime:        fmtTime(form.workStartTime),
        workEndTime:          fmtTime(form.workEndTime),
        workTimezone: form.workTimezone || null,
        isNightShift:         form.isNightShift,
        workingHoursPerDay:   workingHours,
       // requiredWorkingDays:  monthlyDays,
requiredWorkingDays: form.workingDaysNames.length,
        allowRemoteAbsence:   form.allowRemoteAbsence,
        allowedTransitMinutes:Number(form.allowedTransitMinutes),
      };

      if (form.role === 'admin') {
        body.adminScope = {
          type:     form.adminScopeType,
          branches: form.adminScopeType === 'BRANCH' ? form.adminScopeBranches : [],
        };
      }

      await addUser(body);
      showToast('success', t('success'));
      setTimeout(() => navigate('/admin/dashboard'), 1800);
    } catch (err) {
      showToast('error', err.response?.data?.message || t('error'));
    } finally {
      setSubmitting(false);
    }
  };

  /* ── policy stats array ───────────────────────────────────────────────── */
  const policyStats = [
    { label: t('addEmployee.policy.graceLate'),        value: graceLateMins     != null ? `${graceLateMins} ${t('minutes')}` : '—' },
    { label: t('addEmployee.policy.graceEarly'),       value: graceEarlyMins    != null ? `${graceEarlyMins} ${t('minutes')}` : '—' },
    { label: t('addEmployee.policy.latePerHour'),      value: latePerHour       != null ? `${latePerHour} ${t('addEmployee.salary.currency')}` : '—' },
    { label: t('addEmployee.policy.earlyLeavePerHour'),value: earlyLeavePerHour != null ? `${earlyLeavePerHour} ${t('addEmployee.salary.currency')}` : '—' },
    {
      label: t('addEmployee.policy.absenceDayRate'),
      value: absenceDayRate != null
        ? (absenceDayRate === 1 ? t('addEmployee.policy.fullDay') : `${absenceDayRate * 100}%`)
        : '—',
    },
  ];

  /* ══════════════════════════════════════════════════════════════════════
     Render
  ══════════════════════════════════════════════════════════════════════ */
  return (
    <div className="container mt-4 mb-5">

      {/* ── Toast ── */}
      {toast && (
        <div className={`alert alert-${toast.type === 'success' ? 'success' : 'danger'} alert-dismissible`}>
          {toast.msg}
          <button className="btn-close" onClick={() => setToast(null)} />
        </div>
      )}

      <h2 className="mb-4">{t('addEmployee.title')}</h2>

      <form onSubmit={handleSubmit} noValidate>

        {/* ══ Basic Info ══════════════════════════════════════════════════ */}
        <div className="card mb-3">
          <div className="card-header fw-semibold">
            {t('addEmployee.sections.basicInfo')}
          </div>
          <div className="card-body">
            <div className="row">

              <div className="col-md-6 mb-3">
                <label className="form-label">{t('name')} *</label>
                <input
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">{t('email')} *</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">{t('role')}</label>
                {!isGlobal ? (
                  <input className="form-control" value="Staff" disabled />
                ) : (
                  <select
                    className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                    value={form.role}
                    onChange={e => {
                      set('role', e.target.value);
                      set('adminScopeType', 'BRANCH');
                      set('adminScopeBranches', []);
                    }}
                  >
                    <option value="staff">{t('addEmployee.roles.staff')}</option>
                    <option value="admin">{t('addEmployee.roles.admin')}</option>
                  </select>
                )}
                {errors.role && <div className="invalid-feedback d-block">{errors.role}</div>}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">{t('phone')}</label>
                <input className="form-control" value={form.phone}
                  onChange={e => set('phone', e.target.value)} />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">{t('address')}</label>
                <input className="form-control" value={form.address}
                  onChange={e => set('address', e.target.value)} />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  {t('salary')} * <small className="text-muted">({t('addEmployee.salary.monthly')})</small>
                </label>
                <input
                  type="number" min="0" step="0.01"
                  className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
                  value={form.salary}
                  onChange={e => set('salary', e.target.value)}
                />
                {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
              </div>

            </div>
          </div>
        </div>

        {/* ══ Admin Scope ═════════════════════════════════════════════════ */}
        {isGlobal && form.role === 'admin' && (
          <div className="card mb-3 border-warning">
            <div className="card-header fw-semibold bg-warning bg-opacity-10">
              🔐 {t('addEmployee.sections.adminScope')}
            </div>
            <div className="card-body">
              <label className="form-label">{t('addEmployee.adminScope.label')}</label>
              <div className="d-flex gap-4 mb-3">
                <div className="form-check">
                  <input
                    type="radio" className="form-check-input" id="scopeGlobal"
                    checked={form.adminScopeType === 'GLOBAL'}
                    onChange={() => { set('adminScopeType', 'GLOBAL'); set('adminScopeBranches', []); }}
                  />
                  <label className="form-check-label" htmlFor="scopeGlobal">
                    {t('addEmployee.adminScope.globalLabel')}
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio" className="form-check-input" id="scopeBranch"
                    checked={form.adminScopeType === 'BRANCH'}
                    onChange={() => set('adminScopeType', 'BRANCH')}
                  />
                  <label className="form-check-label" htmlFor="scopeBranch">
                    {t('addEmployee.adminScope.branchLabel')}
                  </label>
                </div>
              </div>

              {form.adminScopeType === 'BRANCH' && (
                <>
                  <label className="form-label">{t('addEmployee.adminScope.selectBranches')}</label>
                  <div className={`d-flex flex-wrap gap-3 border rounded p-3 ${errors.adminScopeBranches ? 'border-danger' : ''}`}>
                    {branches.map(b => (
                      <div key={b._id} className="form-check">
                        <input
                          type="checkbox" className="form-check-input" id={`asc-${b._id}`}
                          checked={form.adminScopeBranches.includes(b._id)}
                          onChange={() => toggle('adminScopeBranches', b._id)}
                        />
                        <label className="form-check-label" htmlFor={`asc-${b._id}`}>{b.name}</label>
                      </div>
                    ))}
                  </div>
                  {errors.adminScopeBranches && (
                    <div className="text-danger small mt-1">{errors.adminScopeBranches}</div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ══ Branches ════════════════════════════════════════════════════ */}
        <div className="card mb-3">
          <div className="card-header fw-semibold">
            {t('addEmployee.sections.branches')} *
          </div>
          <div className="card-body">
            <div className={`d-flex flex-wrap gap-3 ${errors.branches ? 'border border-danger rounded p-2' : ''}`}>
              {branches.map(b => (
                <div key={b._id} className="form-check">
                  <input
                    type="checkbox" className="form-check-input" id={`br-${b._id}`}
                    checked={form.branches.includes(b._id)}
                    onChange={() => toggle('branches', b._id)}
                  />
                  <label className="form-check-label" htmlFor={`br-${b._id}`}>{b.name}</label>
                </div>
              ))}
            </div>
            {errors.branches && <div className="text-danger small mt-1">{errors.branches}</div>}

            {policyLoading && (
              <div className="mt-2 text-muted small">
                <span className="spinner-border spinner-border-sm me-1" />
                {t('addEmployee.policy.loading')}
              </div>
            )}
            {policy && !policyLoading && (
              <div className="alert alert-info py-2 small mt-2 mb-0">
                ✅ {t('addEmployee.policy.applied')}:{' '}
                <strong>
                  {policy.scopeName ? `${policy.scope} - ${policy.scopeName}` : policy.scope}
                </strong>
                {policy.note && <span className="ms-1 text-muted">({policy.note})</span>}
              </div>
            )}
          </div>
        </div>

        {/* ══ Departments ═════════════════════════════════════════════════ */}
        {departments.length > 0 && (
          <div className="card mb-3">
            <div className="card-header fw-semibold">
              {t('addEmployee.sections.departments')}
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-3">
                {departments.map(d => (
                  <div key={d._id} className="form-check">
                    <input
                      type="checkbox" className="form-check-input" id={`dep-${d._id}`}
                      checked={form.departments.includes(d._id)}
                      onChange={() => toggle('departments', d._id)}
                    />
                    <label className="form-check-label" htmlFor={`dep-${d._id}`}>{d.name}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ Work Schedule ═══════════════════════════════════════════════ */}
        <div className="card mb-3">
          <div className="card-header fw-semibold">
            {t('addEmployee.sections.workSchedule')}
          </div>
          <div className="card-body">

            <label className="form-label">{t('workingDaysNames')} *</label>
            <div className="d-flex flex-wrap gap-3 mb-1">
              {DAYS.map(day => (
                <div key={day} className="form-check">
                  <input
                    type="checkbox" className="form-check-input" id={`day-${day}`}
                    checked={form.workingDaysNames.includes(day)}
                    onChange={() => toggle('workingDaysNames', day)}
                  />
                  <label className="form-check-label" htmlFor={`day-${day}`}>
                    {t(day.toLowerCase())}
                  </label>
                </div>
              ))}
            </div>
            {errors.workingDaysNames && (
              <div className="text-danger small mb-2">{errors.workingDaysNames}</div>
            )}
            <div className="text-muted small mb-3">
              {t('monthlyDaysNote')}: <strong>{monthlyDays}</strong>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">{t('workStartTime')} *</label>
                <input
                  type="time"
                  className={`form-control ${errors.time ? 'is-invalid' : ''}`}
                  value={form.workStartTime}
                  onChange={e => set('workStartTime', e.target.value)}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">{t('workEndTime')} *</label>
                <input
                  type="time"
                  className={`form-control ${errors.time ? 'is-invalid' : ''}`}
                  value={form.workEndTime}
                  onChange={e => set('workEndTime', e.target.value)}
                />
                {errors.time && <div className="invalid-feedback">{errors.time}</div>}
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">{t('workingHoursNote')}</label>
                <input
                  className="form-control" disabled
                  value={workingHours.toFixed(1)}
                  style={{ background: '#f8f9fa' }}
                />
              </div>
            </div>

            <div className="form-check mb-3">
              <input
                type="checkbox" className="form-check-input" id="nightShift"
                checked={form.isNightShift}
                onChange={e => set('isNightShift', e.target.checked)}
              />
              <label className="form-check-label" htmlFor="nightShift">
                {t('isNightShift')}
              </label>
            </div>

            <div className="col-md-5 mb-2">
              <label className="form-label">
                {t('addEmployee.fields.transitMinutes')}
              </label>
              <input
                type="number" min="0" className="form-control"
                value={form.allowedTransitMinutes}
                onChange={e => set('allowedTransitMinutes', +e.target.value)}
              />
              <small className="text-muted">{t('transitNote')}</small>
            </div>

          </div>
        </div>



       {/* workTimezone */}

<div className="col-md-5 mb-2">
  <label className="form-label">{t('addEmployee.fields.workTimezone')}</label>

  <select
    className="form-select"
    value={form.workTimezone}
    onChange={e => set('workTimezone', e.target.value)}
  >
    <option value="">Default (Branch / Tenant)</option>

    {TIMEZONES.map(tz => (
      <option key={tz.value} value={tz.value}>
        {tz.label}
      </option>
    ))}
  </select>

    <small className="text-muted">{t('addEmployee.fields.workTimezoneNote')}</small>

</div>

        {/* ══ Salary Summary + Policy ══════════════════════════════════════ */}
        <div className="card mb-4">
          <div className="card-header fw-semibold">
            {t('addEmployee.sections.salarySummary')}
          </div>
          <div className="card-body">

            {form.salary > 0 && monthlyDays > 0 ? (
              <div className="row text-center mb-3">
                {[
                  { label: t('addEmployee.salary.monthly'), value: Number(form.salary).toLocaleString(), sub: null },
                  { label: t('addEmployee.salary.daily'),   value: dailySalary,  sub: t('divDays',  { days: monthlyDays }) },
                  { label: t('addEmployee.salary.hourly'),  value: hourlySalary, sub: t('divHours', { hours: workingHours.toFixed(1) }) },
                ].map(item => (
                  <div key={item.label} className="col-md-4">
                    <div className="text-muted small">{item.label}</div>
                    <div className="fs-5 fw-bold">
                      {item.value} {t('addEmployee.salary.currency')}
                    </div>
                    {item.sub && <div className="text-muted" style={{ fontSize: '0.73rem' }}>{item.sub}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted small mb-3">{t('fillPrompt')}</p>
            )}

            {policyLoading && (
              <div className="text-muted small">
                <span className="spinner-border spinner-border-sm me-1" />
                {t('addEmployee.policy.loading')}
              </div>
            )}

            {policy && !policyLoading && (
              <>
                <hr />
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="badge bg-primary text-capitalize">
                    {policy.scopeName ? `${policy.scope} - ${policy.scopeName}` : policy.scope}
                  </span>
                  <span className="text-muted small">{t('addEmployee.policy.applied')}</span>
                  {policy.note && <span className="badge bg-light text-dark">{policy.note}</span>}
                </div>

                <div className="row text-center g-2 mb-3">
                  {policyStats.map(item => (
                    <div key={item.label} className="col-6 col-md">
                      <div className="border rounded p-2 h-100">
                        <div className="text-muted small">{item.label}</div>
                        <div className="fw-bold">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {form.salary > 0 && +hourlySalary > 0 && (
                  <div className="alert alert-light border small mb-0">
                    <strong>{t('addEmployee.policy.examplesTitle')}</strong>
                    <ul className="mb-0 mt-1">
                      {latePerHour != null && (
                        <li>
                          {t('addEmployee.policy.lateExample')}{' '}
                          <strong>{(latePerHour * +hourlySalary).toFixed(2)} {t('addEmployee.salary.currency')}</strong>
                        </li>
                      )}
                      {earlyLeavePerHour != null && (
                        <li>
                          {t('addEmployee.policy.earlyExample')}{' '}
                          <strong>{(earlyLeavePerHour * +hourlySalary).toFixed(2)} {t('addEmployee.salary.currency')}</strong>
                        </li>
                      )}
                      {absenceDayRate != null && (
                        <li>
                          {t('addEmployee.policy.absenceExample')}{' '}
                          <strong>{(+dailySalary * absenceDayRate).toFixed(2)} {t('addEmployee.salary.currency')}</strong>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </>
            )}

            {!policy && !policyLoading && form.branches.length > 0 && (
              <div className="alert alert-warning small mb-0">
                ⚠️ {t('addEmployee.policy.noPolicy')}
              </div>
            )}
            {!policy && !policyLoading && !form.branches.length && (
              <div className="text-muted small">{t('addEmployee.policy.selectBranchFirst')}</div>
            )}

          </div>
        </div>

        {/* ══ Actions ═════════════════════════════════════════════════════ */}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
            {submitting ? (
              <><span className="spinner-border spinner-border-sm me-2" />{t('addEmployee.actions.submitting')}</>
            ) : (
              <><i className="fas fa-user-plus me-2" />{t('submit')}</>
            )}
          </button>
          <button
            type="button" className="btn btn-secondary btn-lg"
            onClick={() => navigate('/admin/dashboard')}
          >
            <i className="fas fa-arrow-left me-2" />{t('cancel')}
          </button>
        </div>

      </form>
    </div>
  );
}