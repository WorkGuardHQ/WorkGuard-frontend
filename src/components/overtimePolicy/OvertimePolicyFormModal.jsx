// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import {
//   createOvertimePolicy,
//   updateOvertimePolicy
// } from '../../services/Overtime & Bonus/overtimePolicy.api';

// /* ==============================================
//    📝 OvertimePolicyFormModal
//    Props:
//    - show: Boolean
//    - editingPolicy: Object | null
//    - onClose: () => void
//    - onSuccess: () => void
//    - onToast: ({ type, message }) => void
// ============================================== */

// const SCOPES       = ['global', 'branch', 'department', 'role', 'user'];
// const RATE_TYPES   = ['multiplier', 'fixed'];
// const SHIFT_RULES  = ['beforeShift', 'afterShiftDay', 'afterShiftNight'];
// const DAYOFF_RULES = ['weeklyOff', 'holiday'];

// /* =========================
//    Default Rule Shape
// ========================= */
// const defaultShiftRule = () => ({
//   enabled:          false,
//   minMinutes:       15,
//   maxMinutes:       '',
//   rateType:         'multiplier',
//   multiplier:       1.25,
//   fixedRatePerHour: ''
// });

// const defaultDayOffRule = () => ({
//   enabled:          false,
//   maxHours:         '',
//   rateType:         'multiplier',
//   multiplier:       2.0,
//   fixedRatePerHour: ''
// });

// const defaultForm = () => ({
//   name:       '',
//   scope:      'global',
//   scopeId:    '',
//   nightShift: { startTime: '22:00', endTime: '06:00' },
//   rules: {
//     beforeShift:     defaultShiftRule(),
//     afterShiftDay:   defaultShiftRule(),
//     afterShiftNight: { ...defaultShiftRule(), multiplier: 1.35 },
//     weeklyOff:       defaultDayOffRule(),
//     holiday:         defaultDayOffRule()
//   },
//   monthlyCap: { enabled: false, maxHours: '' }
// });

// export default function OvertimePolicyFormModal({
//   show,
//   editingPolicy,
//   onClose,
//   onSuccess,
//   onToast
// }) {
//    const { t } = useTranslation("overtimePolicy");

//   const [form, setForm]       = useState(defaultForm());
//   const [saving, setSaving]   = useState(false);
//   const [errors, setErrors]   = useState({});

//   const isEdit = !!editingPolicy;

//   /* =========================
//      Populate form on edit
//   ========================= */
//   useEffect(() => {
//     if (!show) return;

//     if (editingPolicy) {
//       setForm({
//         name:       editingPolicy.name       || '',
//         scope:      editingPolicy.scope      || 'global',
//         scopeId:    editingPolicy.scopeId    || '',
//         nightShift: editingPolicy.nightShift || { startTime: '22:00', endTime: '06:00' },
//         rules: {
//           beforeShift:     { ...defaultShiftRule(),  ...(editingPolicy.rules?.beforeShift     || {}) },
//           afterShiftDay:   { ...defaultShiftRule(),  ...(editingPolicy.rules?.afterShiftDay   || {}) },
//           afterShiftNight: { ...defaultShiftRule(),  multiplier: 1.35, ...(editingPolicy.rules?.afterShiftNight || {}) },
//           weeklyOff:       { ...defaultDayOffRule(), ...(editingPolicy.rules?.weeklyOff       || {}) },
//           holiday:         { ...defaultDayOffRule(), ...(editingPolicy.rules?.holiday         || {}) }
//         },
//         monthlyCap: editingPolicy.monthlyCap || { enabled: false, maxHours: '' }
//       });
//     } else {
//       setForm(defaultForm());
//     }

//     setErrors({});
//   }, [show, editingPolicy]);

//   /* =========================
//      Validate
//   ========================= */
//   const validate = () => {
//     const e = {};

//     if (!form.name.trim())
//       e.name = t('common.required');

//     if (form.scope !== 'global' && !form.scopeId?.toString().trim())
//       e.scopeId = t('common.required');

//     if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(form.nightShift.startTime))
//       e.nightShiftStart = t('common.invalidTime');

//     if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(form.nightShift.endTime))
//       e.nightShiftEnd = t('common.invalidTime');

//     // Shift rules
//     SHIFT_RULES.forEach(key => {
//       const rule = form.rules[key];
//       if (!rule.enabled) return;

//       if (rule.rateType === 'multiplier' && (!rule.multiplier || rule.multiplier < 1))
//         e[`${key}_multiplier`] = t('overtimePolicy.rules.multiplier') + ' >= 1';

//       if (rule.rateType === 'fixed' && (!rule.fixedRatePerHour || rule.fixedRatePerHour <= 0))
//         e[`${key}_fixedRate`] = t('common.required');

//       if (rule.maxMinutes && rule.minMinutes && Number(rule.maxMinutes) < Number(rule.minMinutes))
//         e[`${key}_maxMin`] = 'max >= min';
//     });

//     // DayOff rules
//     DAYOFF_RULES.forEach(key => {
//       const rule = form.rules[key];
//       if (!rule.enabled) return;

//       if (rule.rateType === 'multiplier' && (!rule.multiplier || rule.multiplier < 1))
//         e[`${key}_multiplier`] = t('overtimePolicy.rules.multiplier') + ' >= 1';

//       if (rule.rateType === 'fixed' && (!rule.fixedRatePerHour || rule.fixedRatePerHour <= 0))
//         e[`${key}_fixedRate`] = t('common.required');
//     });

//     if (form.monthlyCap.enabled && (!form.monthlyCap.maxHours || form.monthlyCap.maxHours <= 0))
//       e.monthlyCapHours = t('common.required');

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   /* =========================
//      Helpers: nested setters
//   ========================= */
//   const setField = (path, value) => {
//     setForm(prev => {
//       const next = structuredClone(prev);
//       const keys = path.split('.');
//       let obj = next;
//       for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
//       obj[keys[keys.length - 1]] = value;
//       return next;
//     });
//   };

//   /* =========================
//      Submit
//   ========================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setSaving(true);
//     try {
//       const payload = {
//         name:       form.name.trim(),
//         nightShift: form.nightShift,
//         rules:      buildRulesPayload(),
//         monthlyCap: {
//           enabled:  form.monthlyCap.enabled,
//           maxHours: form.monthlyCap.enabled
//             ? Number(form.monthlyCap.maxHours)
//             : null
//         }
//       };

//       // scope و scopeId بس في الـ create
//       if (!isEdit) {
//         payload.scope   = form.scope;
//         payload.scopeId = form.scope !== 'global' ? form.scopeId : null;
//       }

//       if (isEdit) {
//         await updateOvertimePolicy(editingPolicy._id, payload);
//       } else {
//         await createOvertimePolicy(payload);
//       }

//       onSuccess();
//     } catch (err) {
//       onToast({
//         type:    'error',
//         message: err?.response?.data?.message || t('overtimePolicy.saveError')
//       });
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* =========================
//      Build rules payload (clean nulls)
//   ========================= */
//   const buildRulesPayload = () => {
//     const rules = {};

//     SHIFT_RULES.forEach(key => {
//       const r = form.rules[key];
//       rules[key] = {
//         enabled:          r.enabled,
//         minMinutes:       Number(r.minMinutes) || 0,
//         maxMinutes:       r.maxMinutes !== '' ? Number(r.maxMinutes) : null,
//         rateType:         r.rateType,
//         multiplier:       r.rateType === 'multiplier' ? Number(r.multiplier) : 1,
//         fixedRatePerHour: r.rateType === 'fixed'      ? Number(r.fixedRatePerHour) : null
//       };
//     });

//     DAYOFF_RULES.forEach(key => {
//       const r = form.rules[key];
//       rules[key] = {
//         enabled:          r.enabled,
//         maxHours:         r.maxHours !== '' ? Number(r.maxHours) : null,
//         rateType:         r.rateType,
//         multiplier:       r.rateType === 'multiplier' ? Number(r.multiplier) : 1,
//         fixedRatePerHour: r.rateType === 'fixed'      ? Number(r.fixedRatePerHour) : null
//       };
//     });

//     return rules;
//   };

//   if (!show) return null;

//   /* =========================
//      Render: Shift Rule Row
//   ========================= */
//   const renderShiftRule = (key) => {
//     const rule = form.rules[key];
//     return (
//       <div key={key} className="ot-rule-card mb-3">
//         <div className="d-flex align-items-center justify-content-between mb-2">
//           <label className="fw-semibold text-capitalize mb-0">
//             {t(`overtimePolicy.rules.${key}`)}
//           </label>
//           <div className="form-check form-switch mb-0">
//             <input
//               className="form-check-input"
//               type="checkbox"
//               checked={rule.enabled}
//               onChange={e => setField(`rules.${key}.enabled`, e.target.checked)}
//             />
//           </div>
//         </div>

//         {rule.enabled && (
//           <div className="row g-2">
//             {/* Min Minutes */}
//             <div className="col-6 col-md-3">
//               <label className="form-label small">{t('overtimePolicy.rules.minMinutes')}</label>
//               <input
//                 type="number" min="0"
//                 className="form-control form-control-sm"
//                 value={rule.minMinutes}
//                 onChange={e => setField(`rules.${key}.minMinutes`, e.target.value)}
//               />
//             </div>

//             {/* Max Minutes */}
//             <div className="col-6 col-md-3">
//               <label className="form-label small">{t('overtimePolicy.rules.maxMinutes')}</label>
//               <input
//                 type="number" min="0"
//                 className={`form-control form-control-sm ${errors[`${key}_maxMin`] ? 'is-invalid' : ''}`}
//                 value={rule.maxMinutes}
//                 placeholder="∞"
//                 onChange={e => setField(`rules.${key}.maxMinutes`, e.target.value)}
//               />
//             </div>

//             {/* Rate Type */}
//             <div className="col-6 col-md-3">
//               <label className="form-label small">{t('overtimePolicy.rules.rateType')}</label>
//               <select
//                 className="form-select form-select-sm"
//                 value={rule.rateType}
//                 onChange={e => setField(`rules.${key}.rateType`, e.target.value)}
//               >
//                 {RATE_TYPES.map(rt => (
//                   <option key={rt} value={rt}>
//                     {t(`overtimePolicy.rules.rateTypes.${rt}`)}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Multiplier or Fixed */}
//             <div className="col-6 col-md-3">
//               {rule.rateType === 'multiplier' ? (
//                 <>
//                   <label className="form-label small">{t('overtimePolicy.rules.multiplier')}</label>
//                   <input
//                     type="number" min="1" step="0.05"
//                     className={`form-control form-control-sm ${errors[`${key}_multiplier`] ? 'is-invalid' : ''}`}
//                     value={rule.multiplier}
//                     onChange={e => setField(`rules.${key}.multiplier`, e.target.value)}
//                   />
//                   {errors[`${key}_multiplier`] && (
//                     <div className="invalid-feedback">{errors[`${key}_multiplier`]}</div>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   <label className="form-label small">{t('overtimePolicy.rules.fixedRatePerHour')}</label>
//                   <input
//                     type="number" min="0" step="0.5"
//                     className={`form-control form-control-sm ${errors[`${key}_fixedRate`] ? 'is-invalid' : ''}`}
//                     value={rule.fixedRatePerHour}
//                     onChange={e => setField(`rules.${key}.fixedRatePerHour`, e.target.value)}
//                   />
//                   {errors[`${key}_fixedRate`] && (
//                     <div className="invalid-feedback">{errors[`${key}_fixedRate`]}</div>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   /* =========================
//      Render: DayOff Rule Row
//   ========================= */
//   const renderDayOffRule = (key) => {
//     const rule = form.rules[key];
//     return (
//       <div key={key} className="ot-rule-card mb-3">
//         <div className="d-flex align-items-center justify-content-between mb-2">
//           <label className="fw-semibold text-capitalize mb-0">
//             {t(`overtimePolicy.rules.${key}`)}
//           </label>
//           <div className="form-check form-switch mb-0">
//             <input
//               className="form-check-input"
//               type="checkbox"
//               checked={rule.enabled}
//               onChange={e => setField(`rules.${key}.enabled`, e.target.checked)}
//             />
//           </div>
//         </div>

//         {rule.enabled && (
//           <div className="row g-2">
//             {/* Max Hours */}
//             <div className="col-6 col-md-4">
//               <label className="form-label small">{t('overtimePolicy.rules.maxHours')}</label>
//               <input
//                 type="number" min="0" step="0.5"
//                 className="form-control form-control-sm"
//                 value={rule.maxHours}
//                 placeholder="∞"
//                 onChange={e => setField(`rules.${key}.maxHours`, e.target.value)}
//               />
//             </div>

//             {/* Rate Type */}
//             <div className="col-6 col-md-4">
//               <label className="form-label small">{t('overtimePolicy.rules.rateType')}</label>
//               <select
//                 className="form-select form-select-sm"
//                 value={rule.rateType}
//                 onChange={e => setField(`rules.${key}.rateType`, e.target.value)}
//               >
//                 {RATE_TYPES.map(rt => (
//                   <option key={rt} value={rt}>
//                     {t(`overtimePolicy.rules.rateTypes.${rt}`)}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Multiplier or Fixed */}
//             <div className="col-6 col-md-4">
//               {rule.rateType === 'multiplier' ? (
//                 <>
//                   <label className="form-label small">{t('overtimePolicy.rules.multiplier')}</label>
//                   <input
//                     type="number" min="1" step="0.05"
//                     className={`form-control form-control-sm ${errors[`${key}_multiplier`] ? 'is-invalid' : ''}`}
//                     value={rule.multiplier}
//                     onChange={e => setField(`rules.${key}.multiplier`, e.target.value)}
//                   />
//                 </>
//               ) : (
//                 <>
//                   <label className="form-label small">{t('overtimePolicy.rules.fixedRatePerHour')}</label>
//                   <input
//                     type="number" min="0" step="0.5"
//                     className={`form-control form-control-sm ${errors[`${key}_fixedRate`] ? 'is-invalid' : ''}`}
//                     value={rule.fixedRatePerHour}
//                     onChange={e => setField(`rules.${key}.fixedRatePerHour`, e.target.value)}
//                   />
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   /* =========================
//      JSX
//   ========================= */
//   return (
//     <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//       <div className="modal-dialog modal-lg modal-dialog-scrollable">
//         <div className="modal-content">

//           {/* Header */}
//           <div className="modal-header">
//             <h5 className="modal-title">
//               <i className="fas fa-clock me-2 text-primary" />
//               {isEdit ? t('overtimePolicy.edit') : t('overtimePolicy.create')}
//             </h5>
//             <button className="btn-close" onClick={onClose} disabled={saving} />
//           </div>

//           {/* Body */}
//           <div className="modal-body">
//             <form onSubmit={handleSubmit} id="ot-policy-form" noValidate>

//               {/* ── Basic Info ── */}
//               <div className="row g-3 mb-4">

//                 {/* Name */}
//                 <div className="col-12 col-md-6">
//                   <label className="form-label fw-semibold">
//                     {t('overtimePolicy.fields.name')} <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className={`form-control ${errors.name ? 'is-invalid' : ''}`}
//                     value={form.name}
//                     onChange={e => setField('name', e.target.value)}
//                     placeholder={t('overtimePolicy.fields.name')}
//                   />
//                   {errors.name && <div className="invalid-feedback">{errors.name}</div>}
//                 </div>

//                 {/* Scope (readonly on edit) */}
//                 <div className="col-6 col-md-3">
//                   <label className="form-label fw-semibold">
//                     {t('overtimePolicy.fields.scope')} <span className="text-danger">*</span>
//                   </label>
//                   <select
//                     className="form-select"
//                     value={form.scope}
//                     onChange={e => setField('scope', e.target.value)}
//                     disabled={isEdit}
//                   >
//                     {SCOPES.map(s => (
//                       <option key={s} value={s}>
//                         {t(`overtimePolicy.scopes.${s}`)}
//                       </option>
//                     ))}
//                   </select>
//                   {isEdit && (
//                     <div className="form-text text-muted">
//                       <i className="fas fa-lock me-1" />
//                       {t('common.readOnly')}
//                     </div>
//                   )}
//                 </div>

//                 {/* ScopeId */}
//                 {form.scope !== 'global' && (
//                   <div className="col-6 col-md-3">
//                     <label className="form-label fw-semibold">
//                       {t('overtimePolicy.fields.scopeId')} <span className="text-danger">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       className={`form-control ${errors.scopeId ? 'is-invalid' : ''}`}
//                       value={form.scopeId}
//                       onChange={e => setField('scopeId', e.target.value)}
//                       disabled={isEdit}
//                       placeholder="ID"
//                     />
//                     {errors.scopeId && <div className="invalid-feedback">{errors.scopeId}</div>}
//                   </div>
//                 )}
//               </div>

//               {/* ── Night Shift ── */}
//               <div className="mb-4">
//                 <h6 className="fw-semibold mb-3">
//                   <i className="fas fa-moon me-2 text-primary" />
//                   {t('overtimePolicy.fields.nightShiftStart')} / {t('overtimePolicy.fields.nightShiftEnd')}
//                 </h6>
//                 <div className="row g-3">
//                   <div className="col-6 col-md-3">
//                     <label className="form-label small">{t('overtimePolicy.fields.nightShiftStart')}</label>
//                     <input
//                       type="time"
//                       className={`form-control ${errors.nightShiftStart ? 'is-invalid' : ''}`}
//                       value={form.nightShift.startTime}
//                       onChange={e => setField('nightShift.startTime', e.target.value)}
//                     />
//                     {errors.nightShiftStart && (
//                       <div className="invalid-feedback">{errors.nightShiftStart}</div>
//                     )}
//                   </div>
//                   <div className="col-6 col-md-3">
//                     <label className="form-label small">{t('overtimePolicy.fields.nightShiftEnd')}</label>
//                     <input
//                       type="time"
//                       className={`form-control ${errors.nightShiftEnd ? 'is-invalid' : ''}`}
//                       value={form.nightShift.endTime}
//                       onChange={e => setField('nightShift.endTime', e.target.value)}
//                     />
//                     {errors.nightShiftEnd && (
//                       <div className="invalid-feedback">{errors.nightShiftEnd}</div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* ── Shift OT Rules ── */}
//               <div className="mb-4">
//                 <h6 className="fw-semibold mb-3">
//                   <i className="fas fa-business-time me-2 text-primary" />
//                   {t('overtimePolicy.rules.title')}
//                 </h6>
//                 {SHIFT_RULES.map(renderShiftRule)}
//                 {DAYOFF_RULES.map(renderDayOffRule)}
//               </div>

//               {/* ── Monthly Cap ── */}
//               <div className="mb-2">
//                 <h6 className="fw-semibold mb-3">
//                   <i className="fas fa-hourglass-half me-2 text-warning" />
//                   {t('overtimePolicy.fields.monthlyCap')}
//                 </h6>
//                 <div className="d-flex align-items-center gap-3">
//                   <div className="form-check form-switch mb-0">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       checked={form.monthlyCap.enabled}
//                       onChange={e => setField('monthlyCap.enabled', e.target.checked)}
//                     />
//                     <label className="form-check-label small">
//                       {t('overtimePolicy.fields.monthlyCapEnabled')}
//                     </label>
//                   </div>

//                   {form.monthlyCap.enabled && (
//                     <div style={{ width: 140 }}>
//                       <input
//                         type="number" min="1" step="0.5"
//                         className={`form-control form-control-sm ${errors.monthlyCapHours ? 'is-invalid' : ''}`}
//                         value={form.monthlyCap.maxHours}
//                         placeholder="hours"
//                         onChange={e => setField('monthlyCap.maxHours', e.target.value)}
//                       />
//                       {errors.monthlyCapHours && (
//                         <div className="invalid-feedback">{errors.monthlyCapHours}</div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>

//             </form>
//           </div>

//           {/* Footer */}
//           <div className="modal-footer">
//             <button
//               type="button"
//               className="btn btn-outline-secondary"
//               onClick={onClose}
//               disabled={saving}
//             >
//               {t('overtimePolicy.cancel')}
//             </button>
//             <button
//               type="submit"
//               form="ot-policy-form"
//               className="btn btn-primary"
//               disabled={saving}
//             >
//               {saving
//                 ? <><span className="spinner-border spinner-border-sm me-2" />{t('common.saving')}</>
//                 : <><i className="fas fa-save me-2" />{t('overtimePolicy.save')}</>
//               }
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  createOvertimePolicy,
  updateOvertimePolicy
}from '../../services/Overtime & Bonus/overtimePolicy.api';
import ScopeSelector from '../ui/ScopeSelector';
import {
  getPolicyTimezone
} from '../../helpers/timezone';
/* ==============================================
   📝 OvertimePolicyFormModal
   Props:
   - show: Boolean
   - editingPolicy: Object | null
   - onClose: () => void
   - onSuccess: () => void
   - onToast: ({ type, message }) => void
============================================== */

const RATE_TYPES   = ['multiplier', 'fixed'];
const SHIFT_RULES  = ['beforeShift', 'afterShiftDay', 'afterShiftNight'];
const DAYOFF_RULES = ['weeklyOff', 'holiday'];

/* =========================
   Default Rule Shapes
========================= */
const defaultShiftRule = () => ({
  enabled:          false,
  minMinutes:       15,
  maxMinutes:       '',
  rateType:         'multiplier',
  multiplier:       1.25,
  fixedRatePerHour: ''
});

const defaultDayOffRule = () => ({
  enabled:          false,
  maxHours:         '',
  rateType:         'multiplier',
  multiplier:       2.0,
  fixedRatePerHour: ''
});

const defaultForm = () => ({
  name:       '',
  scope:      'global',
  scopeId:    '',
  scopeLabel: '',
  nightShift: { startTime: '22:00', endTime: '06:00' },
  rules: {
    beforeShift:     defaultShiftRule(),
    afterShiftDay:   defaultShiftRule(),
    afterShiftNight: { ...defaultShiftRule(), multiplier: 1.35 },
    weeklyOff:       defaultDayOffRule(),
    holiday:         defaultDayOffRule()
  },
  monthlyCap: { enabled: false, maxHours: '' }
});

export default function OvertimePolicyFormModal({
  show,
  editingPolicy,
  onClose,
  onSuccess,
  onToast,
    branches = [],
  tenantTimezone 
}) {
   const { t } = useTranslation("overtimePolicy");
  const [form,   setForm]   = useState(defaultForm());
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!editingPolicy;


  //helpers
const resolvedTimezone = isEdit
  ? (
      editingPolicy?.timezoneSnapshot?.timezone ||
      tenantTimezone
    )
  : getPolicyTimezone(
      {
        scope: form.scope,
        branch: form.scopeId
      },
      branches,
      tenantTimezone
    );
  /* =========================
     Populate on edit
  ========================= */
  useEffect(() => {
    if (!show) return;

    if (editingPolicy) {
      setForm({
        name:       editingPolicy.name       || '',
        scope:      editingPolicy.scope      || 'global',
        scopeId:    editingPolicy.scopeId    || '',
        //scopeLabel: '',
        scopeLabel: editingPolicy.scopeName || '',
        nightShift: editingPolicy.nightShift || { startTime: '22:00', endTime: '06:00' },
        rules: {
          beforeShift:     { ...defaultShiftRule(),                    ...(editingPolicy.rules?.beforeShift     || {}) },
          afterShiftDay:   { ...defaultShiftRule(),                    ...(editingPolicy.rules?.afterShiftDay   || {}) },
          afterShiftNight: { ...defaultShiftRule(), multiplier: 1.35,  ...(editingPolicy.rules?.afterShiftNight || {}) },
          weeklyOff:       { ...defaultDayOffRule(),                   ...(editingPolicy.rules?.weeklyOff       || {}) },
          holiday:         { ...defaultDayOffRule(),                   ...(editingPolicy.rules?.holiday         || {}) }
        },
        monthlyCap: editingPolicy.monthlyCap || { enabled: false, maxHours: '' }
      });
    } else {
      setForm(defaultForm());
    }

    setErrors({});
  }, [show, editingPolicy]);

  /* =========================
     setField (dot-path)
  ========================= */
  const setField = (path, value) => {
    setForm(prev => {
      // const next = structuredClone(prev);
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  /* =========================
     ScopeSelector handler
  ========================= */
  const handleScopeChange = ({ scope, scopeId, scopeLabel }) => {
    setForm(prev => ({ ...prev, scope, scopeId, scopeLabel }));
    // clear scope error
    setErrors(prev => ({ ...prev, scopeId: undefined }));
  };

  /* =========================
     Validate
  ========================= */
  const validate = () => {
    const e = {};

    if (!form.name.trim())
      e.name = t('common.required', { ns: "translation" });

if (form.name.trim().length < 3)
  e.name = t('common.minLength', {
    ns: 'translation',
    count: 3
  });

    if (form.scope !== 'global' && !form.scopeId?.toString().trim())
      e.scopeId = t('common.required', { ns: "translation" });

    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(form.nightShift.startTime))
      e.nightShiftStart = t('common.invalidTime', { ns: "translation" });

    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(form.nightShift.endTime))
      e.nightShiftEnd = t('common.invalidTime', { ns: "translation" });

    SHIFT_RULES.forEach(key => {
      const rule = form.rules[key];
      if (!rule.enabled) return;
      if (rule.rateType === 'multiplier' && (!rule.multiplier || rule.multiplier < 1))
        e[`${key}_multiplier`] = `>= 1`;
      if (rule.rateType === 'fixed' && (!rule.fixedRatePerHour || rule.fixedRatePerHour <= 0))
        e[`${key}_fixedRate`] = t('common.required', { ns: "translation" });
      if (rule.maxMinutes && rule.minMinutes && Number(rule.maxMinutes) < Number(rule.minMinutes))
        e[`${key}_maxMin`] = 'max >= min';
    });

    DAYOFF_RULES.forEach(key => {
      const rule = form.rules[key];
      if (!rule.enabled) return;
      if (rule.rateType === 'multiplier' && (!rule.multiplier || rule.multiplier < 1))
        e[`${key}_multiplier`] = `>= 1`;
      if (rule.rateType === 'fixed' && (!rule.fixedRatePerHour || rule.fixedRatePerHour <= 0))
        e[`${key}_fixedRate`] = t('common.required', { ns: "translation" });
    });

    if (form.monthlyCap.enabled && (!form.monthlyCap.maxHours || form.monthlyCap.maxHours <= 0))
      e.monthlyCapHours = t('common.required', { ns: "translation" });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* =========================
     Build Rules Payload
  ========================= */
  const buildRulesPayload = () => {
    const rules = {};

    SHIFT_RULES.forEach(key => {
      const r = form.rules[key];
      rules[key] = {
        enabled:          r.enabled,
        minMinutes:       Number(r.minMinutes) || 0,
       maxMinutes:
  r.maxMinutes !== '' && Number(r.maxMinutes) > 0
    ? Number(r.maxMinutes)
    : null,
        rateType:         r.rateType,
        multiplier:       r.rateType === 'multiplier' ? Number(r.multiplier) : 1,
        fixedRatePerHour: r.rateType === 'fixed'      ? Number(r.fixedRatePerHour) : null
      };
    });

    DAYOFF_RULES.forEach(key => {
      const r = form.rules[key];
      rules[key] = {
        enabled:          r.enabled,
        maxHours:         r.maxHours !== '' ? Number(r.maxHours) : null,
        rateType:         r.rateType,
        multiplier:       r.rateType === 'multiplier' ? Number(r.multiplier) : 1,
        fixedRatePerHour: r.rateType === 'fixed'      ? Number(r.fixedRatePerHour) : null
      };
    });

    return rules;
  };

  /* =========================
     Submit
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        name:       form.name.trim(),
        nightShift: form.nightShift,
        rules:      buildRulesPayload(),
        monthlyCap: {
          enabled:  form.monthlyCap.enabled,
          maxHours: form.monthlyCap.enabled ? Number(form.monthlyCap.maxHours) : null
        }
      };

      if (!isEdit) {
        payload.scope   = form.scope;
        payload.scopeId = form.scope !== 'global' ? form.scopeId : null;
      }

      if (isEdit) {
        await updateOvertimePolicy(editingPolicy._id, payload);
      } else {
        await createOvertimePolicy(payload);
      }

      onSuccess();
    } catch (err) {

      // console.log("UPDATE ERROR:", err.response);

      onToast({
        type:    'error',
        message: err?.response?.data?.message || t('overtimePolicy.saveError')
      });
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  /* =========================
     Render: Shift Rule
  ========================= */
  const renderShiftRule = (key) => {
    const rule = form.rules[key];
    return (
      <div key={key} className="ot-rule-card mb-3">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <label className="fw-semibold small mb-0">
            {t(`overtimePolicy.rules.${key}`)}
          </label>
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              checked={rule.enabled}
              onChange={e => setField(`rules.${key}.enabled`, e.target.checked)}
            />
          </div>
        </div>

        {rule.enabled && (
          <div className="row g-2">
            <div className="col-6 col-md-3">
              <label className="form-label small">{t('overtimePolicy.rules.minMinutes')}</label>
              <input type="number" min="0" className="form-control form-control-sm"
                value={rule.minMinutes}
                onChange={e => setField(`rules.${key}.minMinutes`, e.target.value)} />
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label small">{t('overtimePolicy.rules.maxMinutes')}</label>
              <input type="number" min="0" placeholder="∞"
                className={`form-control form-control-sm ${errors[`${key}_maxMin`] ? 'is-invalid' : ''}`}
                value={rule.maxMinutes}
                onChange={e => setField(`rules.${key}.maxMinutes`, e.target.value)} />
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label small">{t('overtimePolicy.rules.rateType')}</label>
              <select className="form-select form-select-sm"
                value={rule.rateType}
                onChange={e => setField(`rules.${key}.rateType`, e.target.value)}>
                {RATE_TYPES.map(rt => (
                  <option key={rt} value={rt}>{t(`overtimePolicy.rules.rateTypes.${rt}`)}</option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-3">
              {rule.rateType === 'multiplier' ? (
                <>
                  <label className="form-label small">{t('overtimePolicy.rules.multiplier')}</label>
                  <input type="number" min="1" step="0.05"
                    className={`form-control form-control-sm ${errors[`${key}_multiplier`] ? 'is-invalid' : ''}`}
                    value={rule.multiplier}
                    onChange={e => setField(`rules.${key}.multiplier`, e.target.value)} />
                  {errors[`${key}_multiplier`] && (
                    <div className="invalid-feedback">{errors[`${key}_multiplier`]}</div>
                  )}
                </>
              ) : (
                <>
                  <label className="form-label small">{t('overtimePolicy.rules.fixedRatePerHour')}</label>
                  <input type="number" min="0" step="0.5"
                    className={`form-control form-control-sm ${errors[`${key}_fixedRate`] ? 'is-invalid' : ''}`}
                    value={rule.fixedRatePerHour}
                    onChange={e => setField(`rules.${key}.fixedRatePerHour`, e.target.value)} />
                  {errors[`${key}_fixedRate`] && (
                    <div className="invalid-feedback">{errors[`${key}_fixedRate`]}</div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  /* =========================
     Render: DayOff Rule
  ========================= */
  const renderDayOffRule = (key) => {
    const rule = form.rules[key];
    return (
      <div key={key} className="ot-rule-card mb-3">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <label className="fw-semibold small mb-0">
            {t(`overtimePolicy.rules.${key}`)}
          </label>
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              checked={rule.enabled}
              onChange={e => setField(`rules.${key}.enabled`, e.target.checked)}
            />
          </div>
        </div>

        {rule.enabled && (
          <div className="row g-2">
            <div className="col-6 col-md-4">
              <label className="form-label small">{t('overtimePolicy.rules.maxHours')}</label>
              <input type="number" min="0" step="0.5" placeholder="∞"
                className="form-control form-control-sm"
                value={rule.maxHours}
                onChange={e => setField(`rules.${key}.maxHours`, e.target.value)} />
            </div>

            <div className="col-6 col-md-4">
              <label className="form-label small">{t('overtimePolicy.rules.rateType')}</label>
              <select className="form-select form-select-sm"
                value={rule.rateType}
                onChange={e => setField(`rules.${key}.rateType`, e.target.value)}>
                {RATE_TYPES.map(rt => (
                  <option key={rt} value={rt}>{t(`overtimePolicy.rules.rateTypes.${rt}`)}</option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-4">
              {rule.rateType === 'multiplier' ? (
                <>
                  <label className="form-label small">{t('overtimePolicy.rules.multiplier')}</label>
                  <input type="number" min="1" step="0.05"
                    className={`form-control form-control-sm ${errors[`${key}_multiplier`] ? 'is-invalid' : ''}`}
                    value={rule.multiplier}
                    onChange={e => setField(`rules.${key}.multiplier`, e.target.value)} />
                </>
              ) : (
                <>
                  <label className="form-label small">{t('overtimePolicy.rules.fixedRatePerHour')}</label>
                  <input type="number" min="0" step="0.5"
                    className={`form-control form-control-sm ${errors[`${key}_fixedRate`] ? 'is-invalid' : ''}`}
                    value={rule.fixedRatePerHour}
                    onChange={e => setField(`rules.${key}.fixedRatePerHour`, e.target.value)} />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
const timezoneSource = isEdit
  ? (
      editingPolicy?.timezoneSnapshot?.source ||
      'tenant'
    )
  : (
      form.scope === 'branch'
        ? 'branch'
        : form.scope === 'user'
          ? 'user'
          : 'tenant'
    );
  /* =========================
     JSX
  ========================= */
  return (
    <div className="modal fade show d-block" tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-clock me-2 text-primary" />
              {isEdit ? t('overtimePolicy.edit') : t('overtimePolicy.create')}
            </h5>
            <button className="btn-close" onClick={onClose} disabled={saving} />
          </div>

          {/* Body */}
          <div className="modal-body">
            <form onSubmit={handleSubmit} id="ot-policy-form" noValidate>

              {/* ── Name ── */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  {t('overtimePolicy.fields.name')} <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  placeholder={t('overtimePolicy.fields.name')}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              {/* ── Scope Selector ── */}
         {!isEdit ? (
  <div className="mb-4">
    <ScopeSelector
      scope={form.scope}
      scopeId={form.scopeId}
      onChange={handleScopeChange}
      error={errors.scopeId}
    />


  </div>
) : (
  <div className="mb-4 alert alert-light border py-2 px-3 small">
    <i className="fas fa-lock me-2 text-muted" />
    <strong>{t('overtimePolicy.fields.scope')}:</strong>{' '}
    {t(`overtimePolicy.scopes.${form.scope}`)}

    {editingPolicy?.scopeName && (
      <span className="ms-2 text-muted">
        ({editingPolicy.scopeName})
      </span>
    )}
  </div>
)}


{/* timezone */}
{(form.scope || isEdit) && (
  <div className="alert alert-info py-2 px-3 small mb-4">

    
  <i className="fas fa-clock me-2" />

  Timezone:
  <strong className="ms-1">
    {resolvedTimezone}
  </strong>

  <span className="ms-2 text-muted">
    ({timezoneSource})
  </span>
</div>)}


              {/* ── Night Shift ── */}
              <div className="mb-4">
                <h6 className="fw-semibold mb-3">
                  <i className="fas fa-moon me-2 text-primary" />
                  {t('overtimePolicy.fields.nightShiftStart')} / {t('overtimePolicy.fields.nightShiftEnd')}
                </h6>
                <div className="row g-3">
                  <div className="col-6 col-md-3">
                    <label className="form-label small">{t('overtimePolicy.fields.nightShiftStart')}</label>
                    <input type="time"
                      className={`form-control ${errors.nightShiftStart ? 'is-invalid' : ''}`}
                      value={form.nightShift.startTime}
                      onChange={e => setField('nightShift.startTime', e.target.value)} />
                    {errors.nightShiftStart && (
                      <div className="invalid-feedback">{errors.nightShiftStart}</div>
                    )}
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label small">{t('overtimePolicy.fields.nightShiftEnd')}</label>
                    <input type="time"
                      className={`form-control ${errors.nightShiftEnd ? 'is-invalid' : ''}`}
                      value={form.nightShift.endTime}
                      onChange={e => setField('nightShift.endTime', e.target.value)} />
                    {errors.nightShiftEnd && (
                      <div className="invalid-feedback">{errors.nightShiftEnd}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── OT Rules ── */}
              <div className="mb-4">
                <h6 className="fw-semibold mb-3">
                  <i className="fas fa-business-time me-2 text-primary" />
                  {t('overtimePolicy.rules.title')}
                </h6>
                {SHIFT_RULES.map(renderShiftRule)}
                {DAYOFF_RULES.map(renderDayOffRule)}
              </div>

              {/* ── Monthly Cap ── */}
              <div className="mb-2">
                <h6 className="fw-semibold mb-3">
                  <i className="fas fa-hourglass-half me-2 text-warning" />
                  {t('overtimePolicy.fields.monthlyCap')}
                </h6>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <div className="form-check form-switch mb-0">
                    <input className="form-check-input" type="checkbox"
                      checked={form.monthlyCap.enabled}
                      onChange={e => setField('monthlyCap.enabled', e.target.checked)} />
                    <label className="form-check-label small">
                      {t('overtimePolicy.fields.monthlyCapEnabled')}
                    </label>
                  </div>

                  {form.monthlyCap.enabled && (
                    <div style={{ width: 150 }}>
                      <input type="number" min="1" step="0.5" placeholder="hours"
                        className={`form-control form-control-sm ${errors.monthlyCapHours ? 'is-invalid' : ''}`}
                        value={form.monthlyCap.maxHours}
                        onChange={e => setField('monthlyCap.maxHours', e.target.value)} />
                      {errors.monthlyCapHours && (
                        <div className="invalid-feedback">{errors.monthlyCapHours}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </form>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary"
              onClick={onClose} disabled={saving}>
              {t('overtimePolicy.cancel')}
            </button>
            <button type="submit" form="ot-policy-form"
              className="btn btn-primary" disabled={saving}>
              {saving
                ? <><span className="spinner-border spinner-border-sm me-2" />{t('common.saving', { ns: "translation" })}</>
                : <><i className="fas fa-save me-2" />{t('overtimePolicy.save')}</>
              }
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}