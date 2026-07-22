
// import { useState, useEffect, useCallback } from 'react';
// import { useNavigate }                       from 'react-router-dom';
// import { useTranslation }                    from 'react-i18next';
// import { TIMEZONES } from '../constants/timezones';
// import { addUser }        from '../services/user.api';
// import { getBranches }    from '../services/branch.api';
// import { getDepartments } from '../services/department.api';
// import { resolvePolicy }  from '../services/attendancePolicy.api';
// import { getTokenPayload, isGlobalAdmin } from '../helpers/auth';
// import OverageConfirmationToast from '../components/subscription/OverageConfirmationToast';
// import '../style/AddEmployee.css';

// /* ─── pure helpers ─────────────────────────────────────────────────────────── */
// const calcWorkingHours = (start, end, nightShift = false) => {
//   if (!start || !end) return 0;
//   const [sh, sm] = start.split(':').map(Number);
//   const [eh, em] = end.split(':').map(Number);
//   let s = sh * 60 + sm;
//   let e = eh * 60 + em;
//   if (nightShift && eh < sh) e += 24 * 60;
//   return Math.max(0, (e - s) / 60);
// };

// const calcMonthlyDays = (days) => Math.round((days?.length || 0) * 4.33);

// // const fmtTime = (val) => {
// //   if (!val) return '';
// //   const [h, m] = val.split(':').map(Number);
// //   return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
// // };

// const fmtTime = (val) => {
//   if (!val) return '';

//   // لو already HH:mm → رجعيه
//   if (/^\d{2}:\d{2}$/.test(val)) return val;

//   // لو ISO → نجيب الوقت بدون timezone conversion
//   const match = val.match(/T(\d{2}):(\d{2})/);
//   if (match) {
//     return `${match[1]}:${match[2]}`;
//   }

//   return '';
// };
// /* ─── constants ────────────────────────────────────────────────────────────── */
// const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// const DEFAULTS = {
//   name: '', email: '', role: 'staff',
//   branches: [], departments: [],
//   phone: '', address: '', salary: '',
//   workingDaysNames:     ['Sunday','Monday','Tuesday','Wednesday','Thursday'],
//   workStartTime:        '09:00',
//   workEndTime:          '17:00',
//   workTimezone: '',
//   isNightShift:         false,
//   allowRemoteAbsence:   false,
//   allowedTransitMinutes:0,
//   adminScopeType:       'BRANCH',
//   adminScopeBranches:   [],
// };

// /* ══════════════════════════════════════════════════════════════════════════════
//    Component
// ══════════════════════════════════════════════════════════════════════════════ */
// export default function AddEmployee() {
//   const { t }    = useTranslation('Addemployee');
//   const navigate = useNavigate();

//   const payload    = getTokenPayload();
//   const isGlobal   = isGlobalAdmin();
//   const adminScope = payload?.adminScope || null;

//   /* ── state ────────────────────────────────────────────────────────────── */
//   const [form,          setForm]          = useState(DEFAULTS);
//   const [branches,      setBranches]      = useState([]);
//   const [departments,   setDepartments]   = useState([]);
//   const [policy,        setPolicy]        = useState(null);
//   const [policyLoading, setPolicyLoading] = useState(false);
//   const [errors,        setErrors]        = useState({});
//   const [toast,         setToast]         = useState(null);
//   const [submitting,    setSubmitting]    = useState(false);
// const [overageWarning, setOverageWarning] = useState(null);
//   /* ── derived ──────────────────────────────────────────────────────────── */
//   const workingHours  = calcWorkingHours(form.workStartTime, form.workEndTime, form.isNightShift);
//   const monthlyDays   = calcMonthlyDays(form.workingDaysNames);
//   const dailySalary   = form.salary && monthlyDays  ? (form.salary / monthlyDays).toFixed(2)  : 0;
//   const hourlySalary  = dailySalary && workingHours ? (dailySalary / workingHours).toFixed(2) : 0;

//   const latePerHour       = policy ? +(policy.rates?.latePerMinute       * 60).toFixed(4) : null;
//   const earlyLeavePerHour = policy ? +(policy.rates?.earlyLeavePerMinute * 60).toFixed(4) : null;
//   const absenceDayRate    = policy?.absence?.dayRate        ?? null;
//   const graceLateMins     = policy?.grace?.lateMinutes      ?? null;
//   const graceEarlyMins    = policy?.grace?.earlyLeaveMinutes ?? null;

//   /* ── load branches ────────────────────────────────────────────────────── */
//   useEffect(() => {
//     getBranches()
//       .then(res => {
//         const all = res.data?.branches || res.data || [];
//         if (!isGlobal && adminScope?.branches?.length) {
//           const allowed = adminScope.branches.map(String);
//           setBranches(all.filter(b => allowed.includes(String(b._id))));
//         } else {
//           setBranches(all);
//         }
//       })
//       .catch(() => showToast('error', t('error')));
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   /* ── load departments ─────────────────────────────────────────────────── */
//   useEffect(() => {
//     getDepartments()
//       .then(res => setDepartments(res.data?.departments || res.data || []))
//       .catch(() => {});
//   }, []);

//   /* ── fetch policy when branch / role changes ──────────────────────────── */
//   const fetchPolicy = useCallback(async (branches, role) => {
//     setPolicyLoading(true);
//     try {
//       const res = await resolvePolicy({
//         role:     role || null,
//         branchId: branches.length === 1 ? branches[0] : null,
//       });
//       setPolicy(res.data?.data || null);
//     } catch {
//       setPolicy(null);
//     } finally {
//       setPolicyLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchPolicy(form.branches, form.role);
//   }, [form.branches.join(','), form.role]); // eslint-disable-line react-hooks/exhaustive-deps

//   /* ── helpers ──────────────────────────────────────────────────────────── */
//   const showToast = (type, msg) => {
//     setToast({ type, msg });
//     setTimeout(() => setToast(null), 4000);
//   };

//   const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

//   const toggle = (field, val) =>
//     setForm(prev => ({
//       ...prev,
//       [field]: prev[field].includes(val)
//         ? prev[field].filter(x => x !== val)
//         : [...prev[field], val],
//     }));

//   /* ── validation ───────────────────────────────────────────────────────── */
//   const validate = () => {
//     const e = {};
//     if (!form.name.trim())                 e.name             = t('nameRequired');
//     if (!form.email.trim())                e.email            = t('emailRequired');
//     if (!form.branches.length)             e.branches         = t('branchesRequired');
//     if (!form.salary || +form.salary <= 0) e.salary           = t('salaryRequired');
//     if (!form.workingDaysNames.length)     e.workingDaysNames = t('workingDaysRequired');
//     if (workingHours <= 0)                 e.time             = t('endTimeAfterStart');
//     if (!isGlobal && form.role === 'admin')
//       e.role = t('addEmployee.validation.branchAdminCannotCreateAdmin');
//     if (form.role === 'admin' && form.adminScopeType === 'BRANCH' && !form.adminScopeBranches.length)
//       e.adminScopeBranches = t('addEmployee.validation.adminScopeBranchesRequired');
//     return e;
//   };

//   /* ── submit ───────────────────────────────────────────────────────────── */
//   const handleSubmit = async (ev,
//     forceConfirm = false) => {
//     ev.preventDefault();
//     const errs = validate();
//     if (Object.keys(errs).length) { setErrors(errs); return; }

//     setSubmitting(true);
//     try {
//       const body = {
//         name:                 form.name,
//         email:                form.email,
//         role:                 form.role,
//         branches:             form.branches,
//         departments:          form.departments,
//         phone:                form.phone,
//         address:              form.address,
//         salary:               Number(form.salary),
//         workingDaysNames:     form.workingDaysNames,
//         workStartTime:        fmtTime(form.workStartTime),
//         workEndTime:          fmtTime(form.workEndTime),
//         workTimezone: form.workTimezone || null,
//         isNightShift:         form.isNightShift,
//         workingHoursPerDay:   workingHours,
//        // requiredWorkingDays:  monthlyDays,
// requiredWorkingDays: form.workingDaysNames.length,
//         allowRemoteAbsence:   form.allowRemoteAbsence,
//         allowedTransitMinutes:Number(form.allowedTransitMinutes),
//       };

//       if (form.role === 'admin') {
//         body.adminScope = {
//           type:     form.adminScopeType,
//           branches: form.adminScopeType === 'BRANCH' ? form.adminScopeBranches : [],
//         };
//       }

//     await addUser({
//     ...body,
//     confirmOverage: forceConfirm,
// });
//       showToast('success', t('success'));
//       setTimeout(() => navigate('/admin/employees'), 1800);
//     } catch (err) {

//     const response = err?.response?.data;

//     if (
//         err?.response?.status === 409 &&
//         response?.requiresConfirmation
//     ) {

//         setOverageWarning(response.warnings);
//         return;

//     }

//     showToast(
//         'error',
//         response?.message || t('error')
//     );

// } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ── policy stats array ───────────────────────────────────────────────── */
//   const policyStats = [
//     { label: t('addEmployee.policy.graceLate'),        value: graceLateMins     != null ? `${graceLateMins} ${t('minutes')}` : '—' },
//     { label: t('addEmployee.policy.graceEarly'),       value: graceEarlyMins    != null ? `${graceEarlyMins} ${t('minutes')}` : '—' },
//     { label: t('addEmployee.policy.latePerHour'),      value: latePerHour       != null ? `${latePerHour} ${t('addEmployee.salary.currency')}` : '—' },
//     { label: t('addEmployee.policy.earlyLeavePerHour'),value: earlyLeavePerHour != null ? `${earlyLeavePerHour} ${t('addEmployee.salary.currency')}` : '—' },
//     {
//       label: t('addEmployee.policy.absenceDayRate'),
//       value: absenceDayRate != null
//         ? (absenceDayRate === 1 ? t('addEmployee.policy.fullDay') : `${absenceDayRate * 100}%`)
//         : '—',
//     },
//   ];

//   /* ══════════════════════════════════════════════════════════════════════
//      Render
//   ══════════════════════════════════════════════════════════════════════ */
//   return (
//     <div className="container mt-4 mb-5">

//       {/* ── Toast ── */}
//       {toast && (
//         <div className={`alert alert-${toast.type === 'success' ? 'success' : 'danger'} alert-dismissible`}>
//           {toast.msg}
//           <button className="btn-close" onClick={() => setToast(null)} />
//         </div>
//       )}

//       <h2 className="mb-4">{t('addEmployee.title')}</h2>

//       <form onSubmit={handleSubmit} noValidate>

//         {/* ══ Basic Info ══════════════════════════════════════════════════ */}
//         <div className="card mb-3">
//           <div className="card-header fw-semibold">
//             {t('addEmployee.sections.basicInfo')}
//           </div>
//           <div className="card-body">
//             <div className="row">

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">{t('name')} *</label>
//                 <input
//                   className={`form-control ${errors.name ? 'is-invalid' : ''}`}
//                   value={form.name}
//                   onChange={e => set('name', e.target.value)}
//                 />
//                 {errors.name && <div className="invalid-feedback">{errors.name}</div>}
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">{t('email')} *</label>
//                 <input
//                   type="email"
//                   className={`form-control ${errors.email ? 'is-invalid' : ''}`}
//                   value={form.email}
//                   onChange={e => set('email', e.target.value)}
//                 />
//                 {errors.email && <div className="invalid-feedback">{errors.email}</div>}
//               </div>

//               <div className="col-md-4 mb-3">
//                 <label className="form-label">{t('role')}</label>
//                 {!isGlobal ? (
//                   <input className="form-control" value="Staff" disabled />
//                 ) : (
//                   <select
//                     className={`form-select ${errors.role ? 'is-invalid' : ''}`}
//                     value={form.role}
//                     onChange={e => {
//                       set('role', e.target.value);
//                       set('adminScopeType', 'BRANCH');
//                       set('adminScopeBranches', []);
//                     }}
//                   >
//                     <option value="staff">{t('addEmployee.roles.staff')}</option>
//                     <option value="admin">{t('addEmployee.roles.admin')}</option>
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
//                 <label className="form-label">
//                   {t('salary')} * <small className="text-muted">({t('addEmployee.salary.monthly')})</small>
//                 </label>
//                 <input
//                   type="number" min="0" step="0.01"
//                   className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
//                   value={form.salary}
//                   onChange={e => set('salary', e.target.value)}
//                 />
//                 {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
//               </div>

//             </div>
//           </div>
//         </div>

//         {/* ══ Admin Scope ═════════════════════════════════════════════════ */}
//         {isGlobal && form.role === 'admin' && (
//           <div className="card mb-3 border-warning">
//             <div className="card-header fw-semibold bg-warning bg-opacity-10">
//               🔐 {t('addEmployee.sections.adminScope')}
//             </div>
//             <div className="card-body">
//               <label className="form-label">{t('addEmployee.adminScope.label')}</label>
//               <div className="d-flex gap-4 mb-3">
//                 <div className="form-check">
//                   <input
//                     type="radio" className="form-check-input" id="scopeGlobal"
//                     checked={form.adminScopeType === 'GLOBAL'}
//                     onChange={() => { set('adminScopeType', 'GLOBAL'); set('adminScopeBranches', []); }}
//                   />
//                   <label className="form-check-label" htmlFor="scopeGlobal">
//                     {t('addEmployee.adminScope.globalLabel')}
//                   </label>
//                 </div>
//                 <div className="form-check">
//                   <input
//                     type="radio" className="form-check-input" id="scopeBranch"
//                     checked={form.adminScopeType === 'BRANCH'}
//                     onChange={() => set('adminScopeType', 'BRANCH')}
//                   />
//                   <label className="form-check-label" htmlFor="scopeBranch">
//                     {t('addEmployee.adminScope.branchLabel')}
//                   </label>
//                 </div>
//               </div>

//               {form.adminScopeType === 'BRANCH' && (
//                 <>
//                   <label className="form-label">{t('addEmployee.adminScope.selectBranches')}</label>
//                   <div className={`d-flex flex-wrap gap-3 border rounded p-3 ${errors.adminScopeBranches ? 'border-danger' : ''}`}>
//                     {branches.map(b => (
//                       <div key={b._id} className="form-check">
//                         <input
//                           type="checkbox" className="form-check-input" id={`asc-${b._id}`}
//                           checked={form.adminScopeBranches.includes(b._id)}
//                           onChange={() => toggle('adminScopeBranches', b._id)}
//                         />
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

//         {/* ══ Branches ════════════════════════════════════════════════════ */}
//         <div className="card mb-3">
//           <div className="card-header fw-semibold">
//             {t('addEmployee.sections.branches')} *
//           </div>
//           <div className="card-body">
//             <div className={`d-flex flex-wrap gap-3 ${errors.branches ? 'border border-danger rounded p-2' : ''}`}>
//               {branches.map(b => (
//                 <div key={b._id} className="form-check">
//                   <input
//                     type="checkbox" className="form-check-input" id={`br-${b._id}`}
//                     checked={form.branches.includes(b._id)}
//                     onChange={() => toggle('branches', b._id)}
//                   />
//                   <label className="form-check-label" htmlFor={`br-${b._id}`}>{b.name}</label>
//                 </div>
//               ))}
//             </div>
//             {errors.branches && <div className="text-danger small mt-1">{errors.branches}</div>}

//             {policyLoading && (
//               <div className="mt-2 text-muted small">
//                 <span className="spinner-border spinner-border-sm me-1" />
//                 {t('addEmployee.policy.loading')}
//               </div>
//             )}
//             {policy && !policyLoading && (
//               <div className="alert alert-info py-2 small mt-2 mb-0">
//                 ✅ {t('addEmployee.policy.applied')}:{' '}
//                 <strong>
//                   {policy.scopeName ? `${policy.scope} - ${policy.scopeName}` : policy.scope}
//                 </strong>
//                 {policy.note && <span className="ms-1 text-muted">({policy.note})</span>}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ══ Departments ═════════════════════════════════════════════════ */}
//         {departments.length > 0 && (
//           <div className="card mb-3">
//             <div className="card-header fw-semibold">
//               {t('addEmployee.sections.departments')}
//             </div>
//             <div className="card-body">
//               <div className="d-flex flex-wrap gap-3">
//                 {departments.map(d => (
//                   <div key={d._id} className="form-check">
//                     <input
//                       type="checkbox" className="form-check-input" id={`dep-${d._id}`}
//                       checked={form.departments.includes(d._id)}
//                       onChange={() => toggle('departments', d._id)}
//                     />
//                     <label className="form-check-label" htmlFor={`dep-${d._id}`}>{d.name}</label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ══ Work Schedule ═══════════════════════════════════════════════ */}
//         <div className="card mb-3">
//           <div className="card-header fw-semibold">
//             {t('addEmployee.sections.workSchedule')}
//           </div>
//           <div className="card-body">

//             <label className="form-label">{t('workingDaysNames')} *</label>
//             <div className="d-flex flex-wrap gap-3 mb-1">
//               {DAYS.map(day => (
//                 <div key={day} className="form-check">
//                   <input
//                     type="checkbox" className="form-check-input" id={`day-${day}`}
//                     checked={form.workingDaysNames.includes(day)}
//                     onChange={() => toggle('workingDaysNames', day)}
//                   />
//                   <label className="form-check-label" htmlFor={`day-${day}`}>
//                     {t(day.toLowerCase())}
//                   </label>
//                 </div>
//               ))}
//             </div>
//             {errors.workingDaysNames && (
//               <div className="text-danger small mb-2">{errors.workingDaysNames}</div>
//             )}
//             <div className="text-muted small mb-3">
//               {t('monthlyDaysNote')}: <strong>{monthlyDays}</strong>
//             </div>

//             <div className="row">
//               <div className="col-md-4 mb-3">
//                 <label className="form-label">{t('workStartTime')} *</label>
//                 <input
//                   type="time"
//                   className={`form-control ${errors.time ? 'is-invalid' : ''}`}
//                   value={form.workStartTime}
//                   onChange={e => set('workStartTime', e.target.value)}
//                 />
//               </div>
//               <div className="col-md-4 mb-3">
//                 <label className="form-label">{t('workEndTime')} *</label>
//                 <input
//                   type="time"
//                   className={`form-control ${errors.time ? 'is-invalid' : ''}`}
//                   value={form.workEndTime}
//                   onChange={e => set('workEndTime', e.target.value)}
//                 />
//                 {errors.time && <div className="invalid-feedback">{errors.time}</div>}
//               </div>
//               <div className="col-md-4 mb-3">
//                 <label className="form-label">{t('workingHoursNote')}</label>
//                 <input
//                   className="form-control" disabled
//                   value={workingHours.toFixed(1)}
//                   style={{ background: '#f8f9fa' }}
//                 />
//               </div>
//             </div>

//             <div className="form-check mb-3">
//               <input
//                 type="checkbox" className="form-check-input" id="nightShift"
//                 checked={form.isNightShift}
//                 onChange={e => set('isNightShift', e.target.checked)}
//               />
//               <label className="form-check-label" htmlFor="nightShift">
//                 {t('isNightShift')}
//               </label>
//             </div>

//             <div className="col-md-5 mb-2">
//               <label className="form-label">
//                 {t('addEmployee.fields.transitMinutes')}
//               </label>
//               <input
//                 type="number" min="0" className="form-control"
//                 value={form.allowedTransitMinutes}
//                 onChange={e => set('allowedTransitMinutes', +e.target.value)}
//               />
//               <small className="text-muted">{t('transitNote')}</small>
//             </div>

//           </div>
//         </div>



//        {/* workTimezone */}

// <div className="col-md-5 mb-2">
//   <label className="form-label">{t('addEmployee.fields.workTimezone')}</label>

//   <select
//     className="form-select"
//     value={form.workTimezone}
//     onChange={e => set('workTimezone', e.target.value)}
//   >
//     <option value="">Default (Branch / Tenant)</option>

//     {TIMEZONES.map(tz => (
//       <option key={tz.value} value={tz.value}>
//         {tz.label}
//       </option>
//     ))}
//   </select>

//     <small className="text-muted">{t('addEmployee.fields.workTimezoneNote')}</small>

// </div>

//         {/* ══ Salary Summary + Policy ══════════════════════════════════════ */}
//         <div className="card mb-4">
//           <div className="card-header fw-semibold">
//             {t('addEmployee.sections.salarySummary')}
//           </div>
//           <div className="card-body">

//             {form.salary > 0 && monthlyDays > 0 ? (
//               <div className="row text-center mb-3">
//                 {[
//                   { label: t('addEmployee.salary.monthly'), value: Number(form.salary).toLocaleString(), sub: null },
//                   { label: t('addEmployee.salary.daily'),   value: dailySalary,  sub: t('divDays',  { days: monthlyDays }) },
//                   { label: t('addEmployee.salary.hourly'),  value: hourlySalary, sub: t('divHours', { hours: workingHours.toFixed(1) }) },
//                 ].map(item => (
//                   <div key={item.label} className="col-md-4">
//                     <div className="text-muted small">{item.label}</div>
//                     <div className="fs-5 fw-bold">
//                       {item.value} {t('addEmployee.salary.currency')}
//                     </div>
//                     {item.sub && <div className="text-muted" style={{ fontSize: '0.73rem' }}>{item.sub}</div>}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-muted small mb-3">{t('fillPrompt')}</p>
//             )}

//             {policyLoading && (
//               <div className="text-muted small">
//                 <span className="spinner-border spinner-border-sm me-1" />
//                 {t('addEmployee.policy.loading')}
//               </div>
//             )}

//             {policy && !policyLoading && (
//               <>
//                 <hr />
//                 <div className="d-flex align-items-center gap-2 mb-3">
//                   <span className="badge bg-primary text-capitalize">
//                     {policy.scopeName ? `${policy.scope} - ${policy.scopeName}` : policy.scope}
//                   </span>
//                   <span className="text-muted small">{t('addEmployee.policy.applied')}</span>
//                   {policy.note && <span className="badge bg-light text-dark">{policy.note}</span>}
//                 </div>

//                 <div className="row text-center g-2 mb-3">
//                   {policyStats.map(item => (
//                     <div key={item.label} className="col-6 col-md">
//                       <div className="border rounded p-2 h-100">
//                         <div className="text-muted small">{item.label}</div>
//                         <div className="fw-bold">{item.value}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {form.salary > 0 && +hourlySalary > 0 && (
//                   <div className="alert alert-light border small mb-0">
//                     <strong>{t('addEmployee.policy.examplesTitle')}</strong>
//                     <ul className="mb-0 mt-1">
//                       {latePerHour != null && (
//                         <li>
//                           {t('addEmployee.policy.lateExample')}{' '}
//                           <strong>{(latePerHour * +hourlySalary).toFixed(2)} {t('addEmployee.salary.currency')}</strong>
//                         </li>
//                       )}
//                       {earlyLeavePerHour != null && (
//                         <li>
//                           {t('addEmployee.policy.earlyExample')}{' '}
//                           <strong>{(earlyLeavePerHour * +hourlySalary).toFixed(2)} {t('addEmployee.salary.currency')}</strong>
//                         </li>
//                       )}
//                       {absenceDayRate != null && (
//                         <li>
//                           {t('addEmployee.policy.absenceExample')}{' '}
//                           <strong>{(+dailySalary * absenceDayRate).toFixed(2)} {t('addEmployee.salary.currency')}</strong>
//                         </li>
//                       )}
//                     </ul>
//                   </div>
//                 )}
//               </>
//             )}

//             {!policy && !policyLoading && form.branches.length > 0 && (
//               <div className="alert alert-warning small mb-0">
//                 ⚠️ {t('addEmployee.policy.noPolicy')}
//               </div>
//             )}
//             {!policy && !policyLoading && !form.branches.length && (
//               <div className="text-muted small">{t('addEmployee.policy.selectBranchFirst')}</div>
//             )}

//           </div>
//         </div>

//         {/* ══ Actions ═════════════════════════════════════════════════════ */}
//         <div className="d-flex gap-2">
//           <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
//             {submitting ? (
//               <><span className="spinner-border spinner-border-sm me-2" />{t('addEmployee.actions.submitting')}</>
//             ) : (
//               <><i className="fas fa-user-plus me-2" />{t('submit')}</>
//             )}
//           </button>
//           <button
//             type="button" className="btn btn-secondary btn-lg"
//             onClick={() => navigate('/admin/employees')}
//           >
//             <i className="fas fa-arrow-left me-2" />{t('cancel')}
//           </button>
//         </div>

//       </form>
//       <OverageConfirmationToast
//     warning={overageWarning}
//     onClose={() => {
//         setOverageWarning(null);
//     }}
//    onConfirm={async () => {

//     setOverageWarning(null);

//     await handleSubmit(
//         { preventDefault() {} },
//         true
//     );

// }}
// />
//     </div>
//   );
// }


// //========================================2
// import { useState, useEffect, useCallback } from 'react';
// import { useNavigate }                       from 'react-router-dom';
// import { useTranslation }                    from 'react-i18next';
// import { TIMEZONES } from '../constants/timezones';
// import { addUser }        from '../services/user.api';
// import { getBranches }    from '../services/branch.api';
// import { getDepartments } from '../services/department.api';
// import { resolvePolicy }  from '../services/attendancePolicy.api';
// import { getTokenPayload, isGlobalAdmin } from '../helpers/auth';
// import OverageConfirmationToast from '../components/subscription/OverageConfirmationToast';
// import '../style/AddEmployee.css';

// /* ─── pure helpers ─────────────────────────────────────────────────────────────
//    ملاحظة: workingHours هنا بيتحسب في الفرونت **للـ validation والعرض الفوري بس**
//    (زي "endTimeAfterStart" وحقل workingHoursPerDay المعطّل تحت الفورم).
//    أي حساب مالي (رواتب/خصومات) بيجي حصريًا من preview اللي راجع من الباك.
// ──────────────────────────────────────────────────────────────────────────── */
// const calcWorkingHours = (start, end, nightShift = false) => {
//   if (!start || !end) return 0;
//   const [sh, sm] = start.split(':').map(Number);
//   const [eh, em] = end.split(':').map(Number);
//   let s = sh * 60 + sm;
//   let e = eh * 60 + em;
//   if (nightShift && eh < sh) e += 24 * 60;
//   return Math.max(0, (e - s) / 60);
// };

// const fmtTime = (val) => {
//   if (!val) return '';

//   // لو already HH:mm → رجعيه
//   if (/^\d{2}:\d{2}$/.test(val)) return val;

//   // لو ISO → نجيب الوقت بدون timezone conversion
//   const match = val.match(/T(\d{2}):(\d{2})/);
//   if (match) {
//     return `${match[1]}:${match[2]}`;
//   }

//   return '';
// };

// /* ─── constants ────────────────────────────────────────────────────────────── */
// const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// const DEFAULTS = {
//   name: '', email: '', role: 'staff',
//   branches: [], departments: [],
//   phone: '', address: '', salary: '',
//   workingDaysNames:     ['Sunday','Monday','Tuesday','Wednesday','Thursday'],
//   workStartTime:        '09:00',
//   workEndTime:          '17:00',
//   workTimezone: '',
//   isNightShift:         false,
//   allowRemoteAbsence:   false,
//   allowedTransitMinutes:0,
//   adminScopeType:       'BRANCH',
//   adminScopeBranches:   [],
// };

// /* ══════════════════════════════════════════════════════════════════════════════
//    Component
// ══════════════════════════════════════════════════════════════════════════════ */
// export default function AddEmployee() {
//   const { t }    = useTranslation('Addemployee');
//   const navigate = useNavigate();

//   const payload    = getTokenPayload();
//   const isGlobal   = isGlobalAdmin();
//   const adminScope = payload?.adminScope || null;

//   /* ── state ────────────────────────────────────────────────────────────── */
//   const [form,          setForm]          = useState(DEFAULTS);
//   const [branches,      setBranches]      = useState([]);
//   const [departments,   setDepartments]   = useState([]);
//   const [policy,        setPolicy]        = useState(null);
//   const [preview,       setPreview]       = useState(null); // 👈 جديد: أرقام جاهزة من الباك
//   const [policyLoading, setPolicyLoading] = useState(false);
//   const [errors,        setErrors]        = useState({});
//   const [toast,         setToast]         = useState(null);
//   const [submitting,    setSubmitting]    = useState(false);
//   const [overageWarning, setOverageWarning] = useState(null);

//   /* ── derived (validation/UI فوري فقط، مش حسابات مالية) ─────────────────── */
//   const workingHours = calcWorkingHours(form.workStartTime, form.workEndTime, form.isNightShift);

//   // كل الأرقام المالية بقت جايه من preview (اللي جاي من resolvePolicy في الباك)
//   const dailySalary       = preview?.dailySalary        ?? null;
//   const hourlySalary      = preview?.hourlySalary        ?? null;
//   const lateOneHour       = preview?.examples?.lateOneHour   ?? null;
//   const earlyOneHour      = preview?.examples?.earlyOneHour  ?? null;
//   const absenceOneDay     = preview?.examples?.absenceOneDay ?? null;

//   const absenceDayRate    = policy?.absence?.dayRate         ?? null;
//   const graceLateMins     = policy?.grace?.lateMinutes       ?? null;
//   const graceEarlyMins    = policy?.grace?.earlyLeaveMinutes ?? null;

//   /* ── load branches ────────────────────────────────────────────────────── */
//   useEffect(() => {
//     getBranches()
//       .then(res => {
//         const all = res.data?.branches || res.data || [];
//         if (!isGlobal && adminScope?.branches?.length) {
//           const allowed = adminScope.branches.map(String);
//           setBranches(all.filter(b => allowed.includes(String(b._id))));
//         } else {
//           setBranches(all);
//         }
//       })
//       .catch(() => showToast('error', t('error')));
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   /* ── load departments ─────────────────────────────────────────────────── */
//   useEffect(() => {
//     getDepartments()
//       .then(res => setDepartments(res.data?.departments || res.data || []))
//       .catch(() => {});
//   }, []);

//   /* ── fetch policy + preview when relevant fields change ────────────────── */
// const fetchPolicy = useCallback(async (branchesArg, roleArg, salaryArg, workingDaysNamesArg, workStartTimeArg, workEndTimeArg, isNightShiftArg) => {
//   setPolicyLoading(true);
//   try {
//     const hours = calcWorkingHours(workStartTimeArg, workEndTimeArg, isNightShiftArg);
//     const days  = workingDaysNamesArg.length; // أو * 4.33 لو عايزة تقريب شهري

//     const res = await resolvePolicy({
//       role:     roleArg || null,
//       branchId: branchesArg.length === 1 ? branchesArg[0] : null,
//       salary:             salaryArg || 0,
//       workingDaysCount:   days,
//       workingHoursPerDay: hours,
//     });
//     setPolicy(res.data?.data || null);
//     setPreview(res.data?.preview || null);
//   } catch {
//     setPolicy(null);
//     setPreview(null);
//   } finally {
//     setPolicyLoading(false);
//   }
// }, []);

//   useEffect(() => {
//     fetchPolicy(
//       form.branches,
//       form.role,
//       form.salary,
//       form.workingDaysNames,
//       form.workStartTime,
//       form.workEndTime,
//       form.isNightShift,
//     );
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     form.branches.join(','),
//     form.role,
//     form.salary,
//     form.workingDaysNames.join(','),
//     form.workStartTime,
//     form.workEndTime,
//     form.isNightShift,
//   ]);

//   /* ── helpers ──────────────────────────────────────────────────────────── */
//   const showToast = (type, msg) => {
//     setToast({ type, msg });
//     setTimeout(() => setToast(null), 4000);
//   };

//   const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

//   const toggle = (field, val) =>
//     setForm(prev => ({
//       ...prev,
//       [field]: prev[field].includes(val)
//         ? prev[field].filter(x => x !== val)
//         : [...prev[field], val],
//     }));

//   /* ── validation ───────────────────────────────────────────────────────── */
//   const validate = () => {
//     const e = {};
//     if (!form.name.trim())                 e.name             = t('nameRequired');
//     if (!form.email.trim())                e.email            = t('emailRequired');
//     if (!form.branches.length)             e.branches         = t('branchesRequired');
//     if (!form.salary || +form.salary <= 0) e.salary           = t('salaryRequired');
//     if (!form.workingDaysNames.length)     e.workingDaysNames = t('workingDaysRequired');
//     if (workingHours <= 0)                 e.time             = t('endTimeAfterStart');
//     if (!isGlobal && form.role === 'admin')
//       e.role = t('addEmployee.validation.branchAdminCannotCreateAdmin');
//     if (form.role === 'admin' && form.adminScopeType === 'BRANCH' && !form.adminScopeBranches.length)
//       e.adminScopeBranches = t('addEmployee.validation.adminScopeBranchesRequired');
//     return e;
//   };

//   /* ── submit ───────────────────────────────────────────────────────────── */
//   const handleSubmit = async (ev, forceConfirm = false) => {
//     ev.preventDefault();
//     const errs = validate();
//     if (Object.keys(errs).length) { setErrors(errs); return; }

//     setSubmitting(true);
//     try {
//       const body = {
//         name:                 form.name,
//         email:                form.email,
//         role:                 form.role,
//         branches:             form.branches,
//         departments:          form.departments,
//         phone:                form.phone,
//         address:              form.address,
//         salary:               Number(form.salary),
//         workingDaysNames:     form.workingDaysNames,
//         workStartTime:        fmtTime(form.workStartTime),
//         workEndTime:          fmtTime(form.workEndTime),
//         workTimezone:         form.workTimezone || null,
//         isNightShift:         form.isNightShift,
//         workingHoursPerDay:   workingHours, // بيتبعت للباك، الباك برضه بيحسبها تاني في calcPayrollForUser
//         requiredWorkingDays:  form.workingDaysNames.length,
//         allowRemoteAbsence:   form.allowRemoteAbsence,
//         allowedTransitMinutes:Number(form.allowedTransitMinutes),
//       };

//       if (form.role === 'admin') {
//         body.adminScope = {
//           type:     form.adminScopeType,
//           branches: form.adminScopeType === 'BRANCH' ? form.adminScopeBranches : [],
//         };
//       }

//       await addUser({
//         ...body,
//         confirmOverage: forceConfirm,
//       });
//       showToast('success', t('success'));
//       setTimeout(() => navigate('/admin/employees'), 1800);
//     } catch (err) {
//       const response = err?.response?.data;

//       if (err?.response?.status === 409 && response?.requiresConfirmation) {
//         setOverageWarning(response.warnings);
//         return;
//       }

//       showToast('error', response?.message || t('error'));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ── policy stats array ───────────────────────────────────────────────── */
//   const policyStats = [
//     { label: t('addEmployee.policy.graceLate'),  value: graceLateMins  != null ? `${graceLateMins} ${t('minutes')}` : '—' },
//     { label: t('addEmployee.policy.graceEarly'), value: graceEarlyMins != null ? `${graceEarlyMins} ${t('minutes')}` : '—' },
//     {
//       label: t('addEmployee.policy.latePerHour'),
//       value: policy?.rates?.latePerMinute != null
//         ? `${(policy.rates.latePerMinute * 100).toFixed(1)}%`
//         : '—',
//     },
//     {
//       label: t('addEmployee.policy.earlyLeavePerHour'),
//       value: policy?.rates?.earlyLeavePerMinute != null
//         ? `${(policy.rates.earlyLeavePerMinute * 100).toFixed(1)}%`
//         : '—',
//     },
//     {
//       label: t('addEmployee.policy.absenceDayRate'),
//       value: absenceDayRate != null
//         ? (absenceDayRate === 1 ? t('addEmployee.policy.fullDay') : `${absenceDayRate * 100}%`)
//         : '—',
//     },
//   ];

//   /* ══════════════════════════════════════════════════════════════════════
//      Render
//   ══════════════════════════════════════════════════════════════════════ */
//   return (
//     <div className="container mt-4 mb-5">

//       {/* ── Toast ── */}
//       {toast && (
//         <div className={`alert alert-${toast.type === 'success' ? 'success' : 'danger'} alert-dismissible`}>
//           {toast.msg}
//           <button className="btn-close" onClick={() => setToast(null)} />
//         </div>
//       )}

//       <h2 className="mb-4">{t('addEmployee.title')}</h2>

//       <form onSubmit={handleSubmit} noValidate>

//         {/* ══ Basic Info ══════════════════════════════════════════════════ */}
//         <div className="card mb-3">
//           <div className="card-header fw-semibold">
//             {t('addEmployee.sections.basicInfo')}
//           </div>
//           <div className="card-body">
//             <div className="row">

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">{t('name')} *</label>
//                 <input
//                   className={`form-control ${errors.name ? 'is-invalid' : ''}`}
//                   value={form.name}
//                   onChange={e => set('name', e.target.value)}
//                 />
//                 {errors.name && <div className="invalid-feedback">{errors.name}</div>}
//               </div>

//               <div className="col-md-6 mb-3">
//                 <label className="form-label">{t('email')} *</label>
//                 <input
//                   type="email"
//                   className={`form-control ${errors.email ? 'is-invalid' : ''}`}
//                   value={form.email}
//                   onChange={e => set('email', e.target.value)}
//                 />
//                 {errors.email && <div className="invalid-feedback">{errors.email}</div>}
//               </div>

//               <div className="col-md-4 mb-3">
//                 <label className="form-label">{t('role')}</label>
//                 {!isGlobal ? (
//                   <input className="form-control" value="Staff" disabled />
//                 ) : (
//                   <select
//                     className={`form-select ${errors.role ? 'is-invalid' : ''}`}
//                     value={form.role}
//                     onChange={e => {
//                       set('role', e.target.value);
//                       set('adminScopeType', 'BRANCH');
//                       set('adminScopeBranches', []);
//                     }}
//                   >
//                     <option value="staff">{t('addEmployee.roles.staff')}</option>
//                     <option value="admin">{t('addEmployee.roles.admin')}</option>
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
//                 <label className="form-label">
//                   {t('salary')} * <small className="text-muted">({t('addEmployee.salary.monthly')})</small>
//                 </label>
//                 <input
//                   type="number" min="0" step="0.01"
//                   className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
//                   value={form.salary}
//                   onChange={e => set('salary', e.target.value)}
//                 />
//                 {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
//               </div>

//             </div>
//           </div>
//         </div>

//         {/* ══ Admin Scope ═════════════════════════════════════════════════ */}
//         {isGlobal && form.role === 'admin' && (
//           <div className="card mb-3 border-warning">
//             <div className="card-header fw-semibold bg-warning bg-opacity-10">
//               🔐 {t('addEmployee.sections.adminScope')}
//             </div>
//             <div className="card-body">
//               <label className="form-label">{t('addEmployee.adminScope.label')}</label>
//               <div className="d-flex gap-4 mb-3">
//                 <div className="form-check">
//                   <input
//                     type="radio" className="form-check-input" id="scopeGlobal"
//                     checked={form.adminScopeType === 'GLOBAL'}
//                     onChange={() => { set('adminScopeType', 'GLOBAL'); set('adminScopeBranches', []); }}
//                   />
//                   <label className="form-check-label" htmlFor="scopeGlobal">
//                     {t('addEmployee.adminScope.globalLabel')}
//                   </label>
//                 </div>
//                 <div className="form-check">
//                   <input
//                     type="radio" className="form-check-input" id="scopeBranch"
//                     checked={form.adminScopeType === 'BRANCH'}
//                     onChange={() => set('adminScopeType', 'BRANCH')}
//                   />
//                   <label className="form-check-label" htmlFor="scopeBranch">
//                     {t('addEmployee.adminScope.branchLabel')}
//                   </label>
//                 </div>
//               </div>

//               {form.adminScopeType === 'BRANCH' && (
//                 <>
//                   <label className="form-label">{t('addEmployee.adminScope.selectBranches')}</label>
//                   <div className={`d-flex flex-wrap gap-3 border rounded p-3 ${errors.adminScopeBranches ? 'border-danger' : ''}`}>
//                     {branches.map(b => (
//                       <div key={b._id} className="form-check">
//                         <input
//                           type="checkbox" className="form-check-input" id={`asc-${b._id}`}
//                           checked={form.adminScopeBranches.includes(b._id)}
//                           onChange={() => toggle('adminScopeBranches', b._id)}
//                         />
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

//         {/* ══ Branches ════════════════════════════════════════════════════ */}
//         <div className="card mb-3">
//           <div className="card-header fw-semibold">
//             {t('addEmployee.sections.branches')} *
//           </div>
//           <div className="card-body">
//             <div className={`d-flex flex-wrap gap-3 ${errors.branches ? 'border border-danger rounded p-2' : ''}`}>
//               {branches.map(b => (
//                 <div key={b._id} className="form-check">
//                   <input
//                     type="checkbox" className="form-check-input" id={`br-${b._id}`}
//                     checked={form.branches.includes(b._id)}
//                     onChange={() => toggle('branches', b._id)}
//                   />
//                   <label className="form-check-label" htmlFor={`br-${b._id}`}>{b.name}</label>
//                 </div>
//               ))}
//             </div>
//             {errors.branches && <div className="text-danger small mt-1">{errors.branches}</div>}

//             {policyLoading && (
//               <div className="mt-2 text-muted small">
//                 <span className="spinner-border spinner-border-sm me-1" />
//                 {t('addEmployee.policy.loading')}
//               </div>
//             )}
//             {policy && !policyLoading && (
//               <div className="alert alert-info py-2 small mt-2 mb-0">
//                 ✅ {t('addEmployee.policy.applied')}:{' '}
//                 <strong>
//                   {policy.scopeName ? `${policy.scope} - ${policy.scopeName}` : policy.scope}
//                 </strong>
//                 {policy.note && <span className="ms-1 text-muted">({policy.note})</span>}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ══ Departments ═════════════════════════════════════════════════ */}
//         {departments.length > 0 && (
//           <div className="card mb-3">
//             <div className="card-header fw-semibold">
//               {t('addEmployee.sections.departments')}
//             </div>
//             <div className="card-body">
//               <div className="d-flex flex-wrap gap-3">
//                 {departments.map(d => (
//                   <div key={d._id} className="form-check">
//                     <input
//                       type="checkbox" className="form-check-input" id={`dep-${d._id}`}
//                       checked={form.departments.includes(d._id)}
//                       onChange={() => toggle('departments', d._id)}
//                     />
//                     <label className="form-check-label" htmlFor={`dep-${d._id}`}>{d.name}</label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ══ Work Schedule ═══════════════════════════════════════════════ */}
//         <div className="card mb-3">
//           <div className="card-header fw-semibold">
//             {t('addEmployee.sections.workSchedule')}
//           </div>
//           <div className="card-body">

//             <label className="form-label">{t('workingDaysNames')} *</label>
//             <div className="d-flex flex-wrap gap-3 mb-1">
//               {DAYS.map(day => (
//                 <div key={day} className="form-check">
//                   <input
//                     type="checkbox" className="form-check-input" id={`day-${day}`}
//                     checked={form.workingDaysNames.includes(day)}
//                     onChange={() => toggle('workingDaysNames', day)}
//                   />
//                   <label className="form-check-label" htmlFor={`day-${day}`}>
//                     {t(day.toLowerCase())}
//                   </label>
//                 </div>
//               ))}
//             </div>
//             {errors.workingDaysNames && (
//               <div className="text-danger small mb-2">{errors.workingDaysNames}</div>
//             )}
//             {/* ملاحظة: monthlyDays اتشالت من هنا. الرقم الرسمي لعدد أيام العمل بييجي من preview
//                 لو حابة تعرضيه، استخدمي preview?.expectedWorkingDays (لو ضفتيه في الباك). */}
//             {preview?.expectedWorkingDays != null && (
//               <div className="text-muted small mb-3">
//                 {t('monthlyDaysNote')}: <strong>{preview.expectedWorkingDays}</strong>
//               </div>
//             )}

//             <div className="row">
//               <div className="col-md-4 mb-3">
//                 <label className="form-label">{t('workStartTime')} *</label>
//                 <input
//                   type="time"
//                   className={`form-control ${errors.time ? 'is-invalid' : ''}`}
//                   value={form.workStartTime}
//                   onChange={e => set('workStartTime', e.target.value)}
//                 />
//               </div>
//               <div className="col-md-4 mb-3">
//                 <label className="form-label">{t('workEndTime')} *</label>
//                 <input
//                   type="time"
//                   className={`form-control ${errors.time ? 'is-invalid' : ''}`}
//                   value={form.workEndTime}
//                   onChange={e => set('workEndTime', e.target.value)}
//                 />
//                 {errors.time && <div className="invalid-feedback">{errors.time}</div>}
//               </div>
//               <div className="col-md-4 mb-3">
//                 <label className="form-label">{t('workingHoursNote')}</label>
//                 <input
//                   className="form-control" disabled
//                   value={workingHours.toFixed(1)}
//                   style={{ background: '#f8f9fa' }}
//                 />
//               </div>
//             </div>

//             <div className="form-check mb-3">
//               <input
//                 type="checkbox" className="form-check-input" id="nightShift"
//                 checked={form.isNightShift}
//                 onChange={e => set('isNightShift', e.target.checked)}
//               />
//               <label className="form-check-label" htmlFor="nightShift">
//                 {t('isNightShift')}
//               </label>
//             </div>

//             <div className="col-md-5 mb-2">
//               <label className="form-label">
//                 {t('addEmployee.fields.transitMinutes')}
//               </label>
//               <input
//                 type="number" min="0" className="form-control"
//                 value={form.allowedTransitMinutes}
//                 onChange={e => set('allowedTransitMinutes', +e.target.value)}
//               />
//               <small className="text-muted">{t('transitNote')}</small>
//             </div>

//           </div>
//         </div>

//         {/* workTimezone */}
//         <div className="col-md-5 mb-2">
//           <label className="form-label">{t('addEmployee.fields.workTimezone')}</label>

//           <select
//             className="form-select"
//             value={form.workTimezone}
//             onChange={e => set('workTimezone', e.target.value)}
//           >
//             <option value="">Default (Branch / Tenant)</option>

//             {TIMEZONES.map(tz => (
//               <option key={tz.value} value={tz.value}>
//                 {tz.label}
//               </option>
//             ))}
//           </select>

//           <small className="text-muted">{t('addEmployee.fields.workTimezoneNote')}</small>
//         </div>

//         {/* ══ Salary Summary + Policy ══════════════════════════════════════ */}
//         <div className="card mb-4">
//           <div className="card-header fw-semibold">
//             {t('addEmployee.sections.salarySummary')}
//           </div>
//           <div className="card-body">

//             {form.salary > 0 && preview ? (
//               <div className="row text-center mb-3">
//                 {[
//                   { label: t('addEmployee.salary.monthly'), value: Number(form.salary).toLocaleString(), sub: null },
//                   { label: t('addEmployee.salary.daily'),   value: dailySalary,  sub: null },
//                   { label: t('addEmployee.salary.hourly'),  value: hourlySalary, sub: t('divHours', { hours: workingHours.toFixed(1) }) },
//                 ].map(item => (
//                   <div key={item.label} className="col-md-4">
//                     <div className="text-muted small">{item.label}</div>
//                     <div className="fs-5 fw-bold">
//                       {item.value} {t('addEmployee.salary.currency')}
//                     </div>
//                     {item.sub && <div className="text-muted" style={{ fontSize: '0.73rem' }}>{item.sub}</div>}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-muted small mb-3">{t('fillPrompt')}</p>
//             )}

//             {policyLoading && (
//               <div className="text-muted small">
//                 <span className="spinner-border spinner-border-sm me-1" />
//                 {t('addEmployee.policy.loading')}
//               </div>
//             )}

//             {policy && !policyLoading && (
//               <>
//                 <hr />
//                 <div className="d-flex align-items-center gap-2 mb-3">
//                   <span className="badge bg-primary text-capitalize">
//                     {policy.scopeName ? `${policy.scope} - ${policy.scopeName}` : policy.scope}
//                   </span>
//                   <span className="text-muted small">{t('addEmployee.policy.applied')}</span>
//                   {policy.note && <span className="badge bg-light text-dark">{policy.note}</span>}
//                 </div>

//                 <div className="row text-center g-2 mb-3">
//                   {policyStats.map(item => (
//                     <div key={item.label} className="col-6 col-md">
//                       <div className="border rounded p-2 h-100">
//                         <div className="text-muted small">{item.label}</div>
//                         <div className="fw-bold">{item.value}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* الأمثلة دلوقتي جاية جاهزة من preview.examples، مفيش أي ضرب في الفرونت */}
//                 {preview?.examples && (
//                   <div className="alert alert-light border small mb-0">
//                     <strong>{t('addEmployee.policy.examplesTitle')}</strong>
//                     <ul className="mb-0 mt-1">
//                       {lateOneHour != null && (
//                         <li>
//                           {t('addEmployee.policy.lateExample')}{' '}
//                           <strong>{lateOneHour} {t('addEmployee.salary.currency')}</strong>
//                         </li>
//                       )}
//                       {earlyOneHour != null && (
//                         <li>
//                           {t('addEmployee.policy.earlyExample')}{' '}
//                           <strong>{earlyOneHour} {t('addEmployee.salary.currency')}</strong>
//                         </li>
//                       )}
//                       {absenceOneDay != null && (
//                         <li>
//                           {t('addEmployee.policy.absenceExample')}{' '}
//                           <strong>{absenceOneDay} {t('addEmployee.salary.currency')}</strong>
//                         </li>
//                       )}
//                     </ul>
//                   </div>
//                 )}
//               </>
//             )}

//             {!policy && !policyLoading && form.branches.length > 0 && (
//               <div className="alert alert-warning small mb-0">
//                 ⚠️ {t('addEmployee.policy.noPolicy')}
//               </div>
//             )}
//             {!policy && !policyLoading && !form.branches.length && (
//               <div className="text-muted small">{t('addEmployee.policy.selectBranchFirst')}</div>
//             )}

//           </div>
//         </div>

//         {/* ══ Actions ═════════════════════════════════════════════════════ */}
//         <div className="d-flex gap-2">
//           <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
//             {submitting ? (
//               <><span className="spinner-border spinner-border-sm me-2" />{t('addEmployee.actions.submitting')}</>
//             ) : (
//               <><i className="fas fa-user-plus me-2" />{t('submit')}</>
//             )}
//           </button>
//           <button
//             type="button" className="btn btn-secondary btn-lg"
//             onClick={() => navigate('/admin/employees')}
//           >
//             <i className="fas fa-arrow-left me-2" />{t('cancel')}
//           </button>
//         </div>

//       </form>
//       <OverageConfirmationToast
//         warning={overageWarning}
//         onClose={() => {
//           setOverageWarning(null);
//         }}
//         onConfirm={async () => {
//           setOverageWarning(null);
//           await handleSubmit({ preventDefault() {} }, true);
//         }}
//       />
//     </div>
//   );
// }

//===========toast

import { useState, useEffect, useCallback } from 'react';
import { useNavigate }                       from 'react-router-dom';
import { useTranslation }                    from 'react-i18next';
import { TIMEZONES } from '../constants/timezones';
import { addUser }        from '../services/user.api';
import { getBranches }    from '../services/branch.api';
import { getDepartments } from '../services/department.api';
import { resolvePolicy }  from '../services/attendancePolicy.api';
import { getTokenPayload, isGlobalAdmin } from '../helpers/auth';
import OverageConfirmationToast from '../components/subscription/OverageConfirmationToast';
import Toast from '../components/ui/Toast';
import '../style/AddEmployee.css';

/* ─── pure helpers ─────────────────────────────────────────────────────────────
   ملاحظة: workingHours هنا بيتحسب في الفرونت **للـ validation والعرض الفوري بس**
   (زي "endTimeAfterStart" وحقل workingHoursPerDay المعطّل تحت الفورم).
   أي حساب مالي (رواتب/خصومات) بيجي حصريًا من preview اللي راجع من الباك.
──────────────────────────────────────────────────────────────────────────── */
const calcWorkingHours = (start, end, nightShift = false) => {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let s = sh * 60 + sm;
  let e = eh * 60 + em;
  if (nightShift && eh < sh) e += 24 * 60;
  return Math.max(0, (e - s) / 60);
};

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
  const [preview,       setPreview]       = useState(null); // 👈 جديد: أرقام جاهزة من الباك
  const [policyLoading, setPolicyLoading] = useState(false);
  const [errors,        setErrors]        = useState({});
  const [toast,         setToast]         = useState({ show: false, message: '', type: 'success' });
  const [submitting,    setSubmitting]    = useState(false);
  const [overageWarning, setOverageWarning] = useState(null);

  /* ── derived (validation/UI فوري فقط، مش حسابات مالية) ─────────────────── */
  const workingHours = calcWorkingHours(form.workStartTime, form.workEndTime, form.isNightShift);

  // كل الأرقام المالية بقت جايه من preview (اللي جاي من resolvePolicy في الباك)
  const dailySalary       = preview?.dailySalary        ?? null;
  const hourlySalary      = preview?.hourlySalary        ?? null;
  const lateOneHour       = preview?.examples?.lateOneHour   ?? null;
  const earlyOneHour      = preview?.examples?.earlyOneHour  ?? null;
  const absenceOneDay     = preview?.examples?.absenceOneDay ?? null;

  const absenceDayRate    = policy?.absence?.dayRate         ?? null;
  const graceLateMins     = policy?.grace?.lateMinutes       ?? null;
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

  /* ── fetch policy + preview when relevant fields change ────────────────── */
const fetchPolicy = useCallback(async (branchesArg, roleArg, salaryArg, workingDaysNamesArg, workStartTimeArg, workEndTimeArg, isNightShiftArg) => {
  setPolicyLoading(true);
  try {
    const hours = calcWorkingHours(workStartTimeArg, workEndTimeArg, isNightShiftArg);
    const days  = workingDaysNamesArg.length; // أو * 4.33 لو عايزة تقريب شهري

    const res = await resolvePolicy({
      role:     roleArg || null,
      branchId: branchesArg.length === 1 ? branchesArg[0] : null,
      salary:             salaryArg || 0,
      workingDaysCount:   days,
      workingHoursPerDay: hours,
    });
    setPolicy(res.data?.data || null);
    setPreview(res.data?.preview || null);
  } catch {
    setPolicy(null);
    setPreview(null);
  } finally {
    setPolicyLoading(false);
  }
}, []);

  useEffect(() => {
    fetchPolicy(
      form.branches,
      form.role,
      form.salary,
      form.workingDaysNames,
      form.workStartTime,
      form.workEndTime,
      form.isNightShift,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    form.branches.join(','),
    form.role,
    form.salary,
    form.workingDaysNames.join(','),
    form.workStartTime,
    form.workEndTime,
    form.isNightShift,
  ]);

  /* ── helpers ──────────────────────────────────────────────────────────── */
  const showToast = (type, msg) => {
    setToast({ show: true, message: msg, type });
  };

  const closeToast = () => setToast(prev => ({ ...prev, show: false }));

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
  const handleSubmit = async (ev, forceConfirm = false) => {
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
        workTimezone:         form.workTimezone || null,
        isNightShift:         form.isNightShift,
        workingHoursPerDay:   workingHours, // بيتبعت للباك، الباك برضه بيحسبها تاني في calcPayrollForUser
        requiredWorkingDays:  form.workingDaysNames.length,
        allowRemoteAbsence:   form.allowRemoteAbsence,
        allowedTransitMinutes:Number(form.allowedTransitMinutes),
      };

      if (form.role === 'admin') {
        body.adminScope = {
          type:     form.adminScopeType,
          branches: form.adminScopeType === 'BRANCH' ? form.adminScopeBranches : [],
        };
      }

      await addUser({
        ...body,
        confirmOverage: forceConfirm,
      });
      showToast('success', t('success'));
      setTimeout(() => navigate('/admin/employees'), 1800);
    } catch (err) {
      const response = err?.response?.data;

      if (err?.response?.status === 409 && response?.requiresConfirmation) {
        setOverageWarning(response.warnings);
        return;
      }

      showToast('error', response?.message || t('error'));
    } finally {
      setSubmitting(false);
    }
  };

  /* ── policy stats array ───────────────────────────────────────────────── */
  const policyStats = [
    { label: t('addEmployee.policy.graceLate'),  value: graceLateMins  != null ? `${graceLateMins} ${t('minutes')}` : '—' },
    { label: t('addEmployee.policy.graceEarly'), value: graceEarlyMins != null ? `${graceEarlyMins} ${t('minutes')}` : '—' },
    {
      label: t('addEmployee.policy.latePerHour'),
      value: policy?.rates?.latePerMinute != null
        ? `${(policy.rates.latePerMinute * 100).toFixed(1)}%`
        : '—',
    },
    {
      label: t('addEmployee.policy.earlyLeavePerHour'),
      value: policy?.rates?.earlyLeavePerMinute != null
        ? `${(policy.rates.earlyLeavePerMinute * 100).toFixed(1)}%`
        : '—',
    },
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
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

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
            {/* ملاحظة: monthlyDays اتشالت من هنا. الرقم الرسمي لعدد أيام العمل بييجي من preview
                لو حابة تعرضيه، استخدمي preview?.expectedWorkingDays (لو ضفتيه في الباك). */}
            {preview?.expectedWorkingDays != null && (
              <div className="text-muted small mb-3">
                {t('monthlyDaysNote')}: <strong>{preview.expectedWorkingDays}</strong>
              </div>
            )}

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

            {form.salary > 0 && preview ? (
              <div className="row text-center mb-3">
                {[
                  { label: t('addEmployee.salary.monthly'), value: Number(form.salary).toLocaleString(), sub: null },
                  { label: t('addEmployee.salary.daily'),   value: dailySalary,  sub: null },
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

                {/* الأمثلة دلوقتي جاية جاهزة من preview.examples، مفيش أي ضرب في الفرونت */}
                {preview?.examples && (
                  <div className="alert alert-light border small mb-0">
                    <strong>{t('addEmployee.policy.examplesTitle')}</strong>
                    <ul className="mb-0 mt-1">
                      {lateOneHour != null && (
                        <li>
                          {t('addEmployee.policy.lateExample')}{' '}
                          <strong>{lateOneHour} {t('addEmployee.salary.currency')}</strong>
                        </li>
                      )}
                      {earlyOneHour != null && (
                        <li>
                          {t('addEmployee.policy.earlyExample')}{' '}
                          <strong>{earlyOneHour} {t('addEmployee.salary.currency')}</strong>
                        </li>
                      )}
                      {absenceOneDay != null && (
                        <li>
                          {t('addEmployee.policy.absenceExample')}{' '}
                          <strong>{absenceOneDay} {t('addEmployee.salary.currency')}</strong>
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
            onClick={() => navigate('/admin/employees')}
          >
            <i className="fas fa-arrow-left me-2" />{t('cancel')}
          </button>
        </div>

      </form>
      <OverageConfirmationToast
        warning={overageWarning}
        onClose={() => {
          setOverageWarning(null);
        }}
        onConfirm={async () => {
          setOverageWarning(null);
          await handleSubmit({ preventDefault() {} }, true);
        }}
      />
    </div>
  );
}