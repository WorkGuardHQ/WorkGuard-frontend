

// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import Toast from '../ui/Toast';

// import {
//   createAttendancePolicy,
//   updateAttendancePolicy
// } from '../../services/attendancePolicy.api';
// import { apiGet } from '../../helpers/api';



// const initialForm = {
//   scope: 'global', // global | branch | role
//   role: '',
//   branch: '',

//   grace: {
//     lateMinutes: 0,
//     earlyLeaveMinutes: 0,
//   },

//   rates: {
//     latePerMinute: 0,
//     earlyLeavePerMinute: 0,
//     transitPerMinute: 0
//   },

//   absence: {
//     markDayAbsent: true,
//     paid: false,
//     dayRate: 1 // نسبة من أجر اليوم (1 = 100%)
//   },

//   effectiveFrom: '',
//   active: true
// };

// const AttendancePolicyFormModal = ({
//   show,
//   editingPolicy,
//   onClose,
//   onSuccess
// }) => {
//   const { t } = useTranslation();

//   const [form, setForm] = useState(initialForm);
//   const [saving, setSaving] = useState(false);
//   const [branches, setBranches] = useState([]);
// const [toast, setToast] = useState({
//   show: false,
//   type: 'error',
//   message: ''
// });


// const showToast = (message, type = 'error') => {
//   setToast({
//     show: true,
//     type,
//     message
//   });
// };

//   const isEdit = Boolean(editingPolicy);

//   /* =========================
//      Load branches
//   ========================= */
//   useEffect(() => {
//     apiGet('/branches')
//       .then(res => setBranches(res.data || []))
//       .catch(() => setBranches([]));
//   }, []);

//   /* =========================
//      Load edit data
//   ========================= */
//   useEffect(() => {
//     if (editingPolicy) {
//       setForm({
//         ...initialForm,
//         ...editingPolicy,
//         role: editingPolicy.scope === 'role' ? editingPolicy.role : '',
//         // branch: editingPolicy.scope === 'branch' ? editingPolicy.scopeId  : '',
// branch:
//   editingPolicy.scope === 'branch'
//     ? editingPolicy.scopeId?._id
//     : ''
// ,

//         effectiveFrom: editingPolicy.effectiveFrom?.slice(0, 10)
//       });
//     } else {
//       setForm(initialForm);
//     }
//   }, [editingPolicy]);

//   if (!show) return null;

//   /* =========================
//      Validation
//   ========================= */
//   const validate = () => {
//   if (!form.effectiveFrom) {
//   showToast(t('attendancePolicy.errors.effectiveFrom'));
//   return false;
// }


//     if (form.scope === 'role' && !form.role) {
//        showToast(t('attendancePolicy.errors.roleRequired'));
//       return false;
//     }

//     if (form.scope === 'branch' && !form.branch) {
//       showToast(t('attendancePolicy.errors.branchRequired'));
//       return false;
//     }

//     if (
//       form.grace.lateMinutes < 0 ||
//       form.grace.earlyLeaveMinutes < 0
//     ) {
//       showToast(t('attendancePolicy.errors.negativeNumbers'));
//       return false;
//     }

//     if (
//       form.rates.latePerMinute < 0 ||
//       form.rates.earlyLeavePerMinute < 0
//     ) {
//        showToast(t('attendancePolicy.errors.negativeNumbers'));
//       return false;
//     }
// if (form.rates.transitPerMinute < 0) {
//   showToast(t('attendancePolicy.errors.negativeNumbers'));
//   return false;
// }

//     if (form.absence.dayRate < 0 || form.absence.dayRate > 1) {
//       showToast(t('attendancePolicy.errors.invalidDayRate'));
//       return false;
//     }

//     return true;
//   };

//   /* =========================
//      Submit
//   ========================= */

// const submit = async () => {
//   if (!validate()) return;

//   // 🧼 build clean payload
//   const payload = {
//     scope: form.scope,
//     grace: form.grace,
//     rates: form.rates,
//     absence: form.absence,
//     effectiveFrom: form.effectiveFrom,
//     active: form.active
//   };

//   if (form.scope === 'branch') {
//     payload.branch = form.branch;
//   }

//   if (form.scope === 'role') {
//     payload.role = form.role;
//   }

//   try {
//     setSaving(true);

//     if (isEdit) {
//       await updateAttendancePolicy(editingPolicy._id, payload);
//     } else {
//       await createAttendancePolicy(payload);
//     }
// showToast(t('attendancePolicy.saved'), 'success');

//     onSuccess();
//   } catch (err) {
//   const backendMessage =
//     err?.response?.data?.message ||
//     t('common.unexpectedError');

//   showToast(backendMessage, 'error');
// }
//  finally {
//     setSaving(false);
//   }
// };

//   return (
//     <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,.5)' }}>
//       <div className="modal-dialog modal-xl modal-dialog-centered">
//         <div className="modal-content">

//           {/* Header */}
//           <div className="modal-header">
//             <h5 className="modal-title">
//               {isEdit
//                 ? t('attendancePolicy.editTitle')
//                 : t('attendancePolicy.createTitle')}
//             </h5>
//             <button className="btn-close" onClick={onClose} />
//           </div>

//           {/* Body */}
//           <div className="modal-body">

//             {/* Scope */}
//             <div className="mb-3">
//               <label className="form-label">
//                 {t('attendancePolicy.scope')}
//               </label>
//               <select
//                 className="form-select"
//                 value={form.scope}
//                 disabled={isEdit}
//                 onChange={(e) =>
//                   setForm({ ...form, scope: e.target.value })
//                 }
//               >
//                 <option value="global">{t('scope.global')}</option>
//                 <option value="branch">{t('scope.branch')}</option>
//                 <option value="role">{t('scope.role')}</option>
//               </select>
//               <small className="text-muted">
//                 السياسة هتتطبق على مين
//               </small>
//             </div>

//             {/* Role */}
//             {form.scope === 'role' && (
//               <div className="mb-3">
//                 <label className="form-label">
//                   {t('attendancePolicy.role')}
//                 </label>
//                 <select
//                   className="form-select"
//                   value={form.role}
//                   onChange={(e) =>
//                     setForm({ ...form, role: e.target.value })
//                   }
//                 >
//                   <option value="">{t('common.select')}</option>
//                   <option value="admin">Admin</option>
//                   <option value="staff">Staff</option>
//                 </select>
//               </div>
//             )}

//             {/* Branch */}
//             {form.scope === 'branch' && (
//               <div className="mb-3">
//                 <label className="form-label">
//                   {t('attendancePolicy.branch')}
//                 </label>
//                 <select
//                   className="form-select"
//                   value={form.branch}
//                   onChange={(e) =>
//                     setForm({ ...form, branch: e.target.value })
//                   }
//                 >
//                   <option value="">{t('common.select')}</option>
//                   {branches.map(b => (
//                     <option key={b._id} value={b._id}>
//                       {b.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}

//             {/* Grace */}
//             <div className="row g-3">
//               <div className="col-md-6">
//                 <label className="form-label">
//                   {t('attendancePolicy.lateGrace')}
//                 </label>
//                 <input
//                   type="number"
//                   min={0}
//                   className="form-control"
//                   value={form.grace.lateMinutes}
//                   onChange={(e) =>
//                     setForm({
//                       ...form,
//                       grace: {
//                         ...form.grace,
//                         lateMinutes: Number(e.target.value)
//                       }
//                     })
//                   }
//                 />
//                 <small className="text-muted">
//                   عدد دقائق التأخير المسموح بدون خصم
//                 </small>
//               </div>

//               <div className="col-md-6">
//                 <label className="form-label">
//                   {t('attendancePolicy.earlyGrace')}
//                 </label>
//                 <input
//                   type="number"
//                   min={0}
//                   className="form-control"
//                   value={form.grace.earlyLeaveMinutes}
//                   onChange={(e) =>
//                     setForm({
//                       ...form,
//                       grace: {
//                         ...form.grace,
//                         earlyLeaveMinutes: Number(e.target.value)
//                       }
//                     })
//                   }
//                 />
//                 <small className="text-muted">
//                   عدد دقائق الانصراف المبكر المسموح
//                 </small>
//               </div>
//             </div>

//             {/* Rates */}
//             <div className="row g-3 mt-2">
//               <div className="col-md-6">
//                 <label className="form-label">
//                   {t('attendancePolicy.lateRate')}
//                 </label>
//                 <input
//                   type="number"
//                   min={0}
//                   step="0.01"
//                   className="form-control"
//                   value={form.rates.latePerMinute}
//                   onChange={(e) =>
//                     setForm({
//                       ...form,
//                       rates: {
//                         ...form.rates,
//                         latePerMinute: Number(e.target.value)
//                       }
//                     })
//                   }
//                 />
//                 <small className="text-muted">
//                  نسبة من أجر الساعة عن كل ساعة تأخير (تُحسب بالدقائق)
//                 </small>
//               </div>

//               <div className="col-md-6">
//                 <label className="form-label">
//                   {t('attendancePolicy.earlyRate')}
//                 </label>
//                 <input
//                   type="number"
//                   min={0}
//                   step="0.01"
//                   className="form-control"
//                   value={form.rates.earlyLeavePerMinute}
//                   onChange={(e) =>
//                     setForm({
//                       ...form,
//                       rates: {
//                         ...form.rates,
//                         earlyLeavePerMinute: Number(e.target.value)
//                       }
//                     })
//                   }
//                 />
//                 <small className="text-muted">
//                  نسبة من أجر الساعة عن كل ساعة انصراف مبكر (تُحسب بالدقائق)

//                 </small>
//               </div>
//             </div>
// {/* Transit */}
//   <div className="col-md-4">
//     <label className="form-label">
//       {t('attendancePolicy.transitRate')}
//     </label>
//     <input
//       type="number"
//       min={0}
//       step="0.01"
//       className="form-control"
//       value={form.rates.transitPerMinute}
//       onChange={(e) =>
//         setForm({
//           ...form,
//           rates: {
//             ...form.rates,
//             transitPerMinute: Number(e.target.value)
//           }
//         })
//       }
//     />
//     <small className="text-muted">
//       {t('attendancePolicy.transitRateHint')}
//     </small>
//   </div>
//             {/* Absence */}
//             <fieldset className="border rounded p-3 mt-3">
//               <legend className="float-none w-auto px-2">
//                 {t('attendancePolicy.absence')}
//               </legend>

//               <div className="form-check mb-2">
//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   checked={form.absence.markDayAbsent}
//                   onChange={(e) =>
//                     setForm({
//                       ...form,
//                       absence: {
//                         ...form.absence,
//                         markDayAbsent: e.target.checked
//                       }
//                     })
//                   }
//                 />
//                 <label className="form-check-label">
//                   خصم يوم كامل عند الغياب
//                 </label>
//               </div>

//               <div className="form-check mb-2">
//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   checked={form.absence.paid}
//                   onChange={(e) =>
//                     setForm({
//                       ...form,
//                       absence: {
//                         ...form.absence,
//                         paid: e.target.checked
//                       }
//                     })
//                   }
//                 />
//                 <label className="form-check-label">
//                   الغياب مدفوع
//                 </label>
//               </div>

//               {!form.absence.paid && (
//                 <div>
//                   <label className="form-label">
//                     نسبة الخصم من أجر اليوم
//                   </label>
//                   <input
//                     type="number"
//                     min={0}
//                     max={1}
//                     step="0.1"
//                     className="form-control"
//                     value={form.absence.dayRate}
//                     onChange={(e) =>
//                       setForm({
//                         ...form,
//                         absence: {
//                           ...form.absence,
//                           dayRate: Number(e.target.value)
//                         }
//                       })
//                     }
//                   />
//                   <small className="text-muted">
//                     1 = خصم يوم كامل / 0.5 = نصف يوم
//                   </small>
//                 </div>
//               )}
//             </fieldset>

//             {/* Effective */}
//             <div className="mt-3">
//               <label className="form-label">
//                 {t('attendancePolicy.effectiveFrom')}
//               </label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={form.effectiveFrom}
//                 onChange={(e) =>
//                   setForm({ ...form, effectiveFrom: e.target.value })
//                 }
//               />
//             </div>

//           </div>

//           {/* Footer */}
//           <div className="modal-footer">
//             <button className="btn btn-secondary" onClick={onClose}>
//               {t('common.cancel')}
//             </button>
//             <button
//               className="btn btn-primary"
//               disabled={saving}
//               onClick={submit}
//             >
//               {saving ? t('common.saving') : t('common.save')}
//             </button>
//           </div>

//         </div>
//       </div>
//       {toast.show && (
//   <Toast
//     show={toast.show}
//     type={toast.type}
//     message={toast.message}
//     onClose={() =>
//       setToast(prev => ({ ...prev, show: false }))
//     }
//   />
// )}

//     </div>
//   );
// };

// export default AttendancePolicyFormModal;




//ui 
import { useEffect, useState ,useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import Toast from '../ui/Toast';
import {
  createAttendancePolicy,
  updateAttendancePolicy
} from '../../services/attendancePolicy.api';
import { apiGet } from '../../helpers/api';
import '../../style/AttendancePoliciesPage.css';
import {
  toDateInputValue,
  toUTCFromTimezone
} from '../../helpers/dateHelpers';
import { getPolicyTimezone } from '../../helpers/timezone';


const initialForm = {
  scope: 'global',
  role: '',
  branch: '',
  grace: {
    lateMinutes: 0,
    earlyLeaveMinutes: 0,
    gapMinutes: 0 
  },
  rates: {
    latePerMinute: 0,
    earlyLeavePerMinute: 0,
    transitPerMinute: 0,
    gapPerMinute: 0 
  },
  absence: {
    // markDayAbsent: true,
    deductSalary: true,
    paid: false,
    dayRate: 1
  },
  effectiveFrom: '',
  active: true
};

const AttendancePolicyFormModal = ({
  show,
  editingPolicy,
  onClose,
  onSuccess,
   tenantTimezone
}) => {
  const { t } = useTranslation();

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [branches, setBranches] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    type: 'error',
    message: ''
  });

  const showToast = (message, type = 'error') => {
    setToast({
      show: true,
      type,
      message
    });
  };

  const isEdit = Boolean(editingPolicy);

  useEffect(() => {
    apiGet('/branches')
      .then(res => setBranches(res.data || []))
      .catch(() => setBranches([]));
  }, []);



  const policyTZ = useMemo(() => {
  if (editingPolicy) {
    return getPolicyTimezone(editingPolicy, branches, tenantTimezone);
  }
  return getPolicyTimezone(form, branches, tenantTimezone);
}, [
  editingPolicy,
  branches,
  tenantTimezone,
  form.scope,
  form.branch
]);

  // useEffect(() => {
  //   if (editingPolicy) {
  //     setForm({
  //       ...initialForm,
  //       ...editingPolicy,
  //       role: editingPolicy.scope === 'role' ? editingPolicy.role : '',
  //       // branch: editingPolicy.scope === 'branch' ? editingPolicy.scopeId?._id : '',

  //       branch: editingPolicy.scope === 'branch'
  // ? (editingPolicy.scopeId?._id || editingPolicy.scopeId)
  // : '',

  //       // effectiveFrom: editingPolicy.effectiveFrom?.slice(0, 10)

  //       effectiveFrom: toDateInputValue(editingPolicy.effectiveFrom, policyTZ)

  //     });
  //   } else {
  //     setForm(initialForm);
  //   }
  // }, [editingPolicy,policyTZ, branches]);
useEffect(() => {
  if (!editingPolicy) {
    // setForm(initialForm);
    return;
  }

  setForm(prev => {
    const nextDate = toDateInputValue(editingPolicy.effectiveFrom, policyTZ);

    // 🧠 يمنع re-render لو مفيش تغيير
    if (
      prev.effectiveFrom === nextDate &&
      prev.branch === (editingPolicy.scopeId?._id || editingPolicy.scopeId)
    ) {
      return prev;
    }

    return {
      ...initialForm,
      ...editingPolicy,
      role: editingPolicy.scope === 'role' ? editingPolicy.role : '',
      branch: editingPolicy.scope === 'branch'
        ? (editingPolicy.scopeId?._id || editingPolicy.scopeId)
        : '',
      effectiveFrom: nextDate
    };
  });
}, [editingPolicy, policyTZ]);

  if (!show) return null;

  const validate = () => {
    if (!form.effectiveFrom) {
      showToast(t('attendancePolicy.errors.effectiveFrom'));
      return false;
    }

    if (form.scope === 'role' && !form.role) {
      showToast(t('attendancePolicy.errors.roleRequired'));
      return false;
    }

    if (form.scope === 'branch' && !form.branch) {
      showToast(t('attendancePolicy.errors.branchRequired'));
      return false;
    }

    if (form.grace.lateMinutes < 0 || form.grace.earlyLeaveMinutes < 0) {
      showToast(t('attendancePolicy.errors.negativeNumbers'));
      return false;
    }

    if (form.rates.latePerMinute < 0 || form.rates.earlyLeavePerMinute < 0 || form.rates.transitPerMinute < 0) {
      showToast(t('attendancePolicy.errors.negativeNumbers'));
      return false;
    }

    if (
  form.grace.gapMinutes < 0 ||
  form.rates.gapPerMinute < 0
) {
  showToast(t('attendancePolicy.errors.negativeNumbers'));
  return false;
}

if (form.absence.paid && !form.absence.deductSalary) {
  showToast('Paid absence requires salary deduction enabled');
  return false;
}

if (form.absence.deductSalary && !form.absence.paid) {
  if (form.absence.dayRate < 0 || form.absence.dayRate > 1) {
    showToast(t('attendancePolicy.errors.invalidDayRate'));
    return false;
  }
}

    if (form.absence.dayRate < 0 || form.absence.dayRate > 1) {
      showToast(t('attendancePolicy.errors.invalidDayRate'));
      return false;
    }

    return true;
  };

  const submit = async () => {
    if (!validate()) return;

    const payload = {
      scope: form.scope,
      grace: form.grace,
      rates: form.rates,
      absence: form.absence,
      // effectiveFrom: form.effectiveFrom,
     effectiveFrom: toUTCFromTimezone(form.effectiveFrom, policyTZ)

      // effectiveFrom: toUTCMidnight(form.effectiveFrom)
,
      active: form.active
    };
 console.log('PAYLOAD BEFORE SEND:', JSON.stringify(payload));
 
    if (form.scope === 'branch') {
      payload.branch = form.branch;
    }

    if (form.scope === 'role') {
      payload.role = form.role;
    }

    try {
      setSaving(true);

      if (isEdit) {
        await updateAttendancePolicy(editingPolicy._id, payload);
      } else {
        await createAttendancePolicy(payload);
      }
      
      showToast(t('attendancePolicy.saved'), 'success');
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err) {
      const backendMessage = err?.response?.data?.message || t('common.unexpectedError');
      showToast(backendMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

//  const policyTZ = getPolicyTimezone(form, branches, tenantTimezone);

// hooks الأول
// eslint-disable-next-line react-hooks/exhaustive-deps


// const policyTZ = editingPolicy
//   ? getPolicyTimezone(editingPolicy, branches, tenantTimezone)
//   : getPolicyTimezone(form, branches, tenantTimezone);


  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>
      
      <div className="policy-modal">
        <div className="policy-modal-dialog">
          <div className="policy-modal-content">

            {/* Header */}
            <div className="policy-modal-header">
              <div className="modal-header-icon">
                <i className="fas fa-sliders-h"></i>
              </div>
              <div>
                <h4 className="modal-title">
                  {isEdit ? t('attendancePolicy.editTitle') : t('attendancePolicy.createTitle')}
                </h4>
                <p className="modal-subtitle">
                  {isEdit ? t('attendancePolicy.editSubtitle') || 'Update policy settings' : t('attendancePolicy.createSubtitle') || 'Configure attendance rules'}
                </p>
              </div>
              <button className="modal-close-btn" onClick={onClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Body */}
            <div className="policy-modal-body">

              {/* Scope Section */}
              <div className="form-section">
                <div className="section-header">
                  <i className="fas fa-bullseye me-2"></i>
                  <span>{t('attendancePolicy.policyScope') || 'Policy Scope'}</span>
                </div>
                
                <div className="form-group">
                  <label className="form-label-modern">
                    <i className="fas fa-layer-group me-2"></i>
                    {t('attendancePolicy.scope')}
                  </label>
                  <select
                    className="form-control-modern"
                    value={form.scope}
                    disabled={isEdit}
                    onChange={(e) => setForm({ ...form, 
                      
                      scope: e.target.value })}
                  >
                    <option value="global">{t('scope.global') || 'Global - All Company'}</option>
                    <option value="branch">{t('scope.branch') || 'Branch Specific'}</option>
                    <option value="role">{t('scope.role') || 'Role Based'}</option>
                  </select>
                  <small className="form-hint">
                    {t('attendancePolicy.scopeHint') || 'Who will this policy apply to?'}
                  </small>
                </div>

                {form.scope === 'role' && (
                  <div className="form-group">
                    <label className="form-label-modern">
                      <i className="fas fa-user-shield me-2"></i>
                      {t('attendancePolicy.role')}
                    </label>
                    <select
                      className="form-control-modern"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                      <option value="">{t('common.select')}</option>
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                )}

                {form.scope === 'branch' && (
                  <div className="form-group">
                    <label className="form-label-modern">
                      <i className="fas fa-building me-2"></i>
                      {t('attendancePolicy.branch')}
                    </label>
                    <select
                      className="form-control-modern"
                      value={form.branch}
                      onChange={(e) => setForm(prev => ({ 
  ...prev,
  scope: 'branch', 
  branch: e.target.value
}))}
                      // onChange={(e) => setForm({ ...form, 
                        
                      //   branch: e.target.value })}
                    >
                      <option value="">{t('common.select')}</option>
                      {branches.map(b => (
                        <option key={b._id} value={b._id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Grace Periods Section */}
              <div className="form-section">
                <div className="section-header">
                  <i className="fas fa-clock me-2"></i>
                  <span>{t('attendancePolicy.gracePeriods') || 'Grace Periods'}</span>
                </div>
                
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-modern">
                      <i className="fas fa-hourglass-start me-2"></i>
                      {t('attendancePolicy.lateGrace')}
                    </label>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        min={0}
                        className="form-control-modern"
                        value={form.grace.lateMinutes}
                        onChange={(e) => setForm({
                          ...form,
                          grace: { ...form.grace, lateMinutes: Number(e.target.value) }
                        })}
                      />
                      <span className="input-unit">{t('common.minutes') || 'min'}</span>
                    </div>
                    <small className="form-hint">
                      {t('attendancePolicy.lateGraceHint') || 'Allowed late minutes without deduction'}
                    </small>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label-modern">
                      <i className="fas fa-hourglass-end me-2"></i>
                      {t('attendancePolicy.earlyGrace')}
                    </label>
                    
                    <div className="input-with-unit">
                      <input
                        type="number"
                        min={0}
                        className="form-control-modern"
                        value={form.grace.earlyLeaveMinutes}
                        onChange={(e) => setForm({
                          ...form,
                          grace: { ...form.grace, earlyLeaveMinutes: Number(e.target.value) }
                        })}
                      />
                      <span className="input-unit">{t('common.minutes') || 'min'}</span>
                    </div>
                    <small className="form-hint">
                      {t('attendancePolicy.earlyGraceHint') || 'Allowed early leave minutes without deduction'}
                    </small>
                  </div>
                  <div className="col-md-6">
  <label className="form-label-modern">
    <i className="fas fa-coffee me-2"></i>
    {t('attendancePolicy.BreakAllowed') || 'Break Allowed'}
  </label>
  <div className="input-with-unit">
    <input
      type="number"
      min={0}
      className="form-control-modern"
      value={form.grace.gapMinutes}
      onChange={(e) => setForm({
        ...form,
        grace: { ...form.grace, gapMinutes: Number(e.target.value) }
      })}
    />
    <span className="input-unit">{t('common.minutes') || 'min'}</span>
  </div>
  <small className="form-hint">
   {t('attendancePolicy.BreakAllowedHint')|| 'Total allowed break per day without deduction'}
  </small>
</div>
                </div>
              </div>



              {/* Deduction Rates Section */}
              <div className="form-section">
                <div className="section-header">
                  <i className="fas fa-percentage me-2"></i>
                  <span>{t('attendancePolicy.deductionRates') || 'Deduction Rates'}</span>
                </div>
                
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label-modern">
                      <i className="fas fa-arrow-down me-2 text-danger"></i>
                      {t('attendancePolicy.lateRate')}
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      className="form-control-modern"
                      value={form.rates.latePerMinute}
                      onChange={(e) => setForm({
                        ...form,
                        rates: { ...form.rates, latePerMinute: Number(e.target.value) }
                      })}
                    />
                    <small className="form-hint">
                      {t('attendancePolicy.lateRateHint') || 'Percentage of hourly wage per late hour (calculated by minute)'}
                    </small>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label-modern">
                      <i className="fas fa-arrow-up me-2 text-warning"></i>
                      {t('attendancePolicy.earlyRate')}
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      className="form-control-modern"
                      value={form.rates.earlyLeavePerMinute}
                      onChange={(e) => setForm({
                        ...form,
                        rates: { ...form.rates, earlyLeavePerMinute: Number(e.target.value) }
                      })}
                    />
                    <small className="form-hint">
                      {t('attendancePolicy.earlyRateHint') || 'Percentage of hourly wage per early leave hour (calculated by minute)'}
                    </small>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label-modern">
                      <i className="fas fa-exchange-alt me-2 text-info"></i>
                      {t('attendancePolicy.transitRate')}
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      className="form-control-modern"
                      value={form.rates.transitPerMinute}
                      onChange={(e) => setForm({
                        ...form,
                        rates: { ...form.rates, transitPerMinute: Number(e.target.value) }
                      })}
                    />
                    <small className="form-hint">
                      {t('attendancePolicy.transitRateHint') || 'Deduction rate for time in transit between locations'}
                    </small>
                  </div>
                               <div className="col-md-4">
  <label className="form-label-modern">
    <i className="fas fa-coffee me-2 text-dark"></i>
    {t('attendancePolicy.gapRate') || 'Gap Rate'}
  </label>
  <input
    type="number"
    min={0}
    step="0.01"
    className="form-control-modern"
    value={form.rates.gapPerMinute}
    onChange={(e) => setForm({
      ...form,
      rates: { ...form.rates, gapPerMinute: Number(e.target.value) }
    })}
  />
  <small className="form-hint">
    {t('attendancePolicy.gapRateHint') || 'Deduction per minute after allowed break'}
  </small>
</div>
                </div>
   
              </div>

              {/* Absence Policy Section */}
              <div className="form-section">
                <div className="section-header">
                  <i className="fas fa-user-times me-2"></i>
                  <span>{t('attendancePolicy.absencePolicy') || 'Absence Policy'}</span>
                </div>
                
                <div className="absence-options">
                  {/* <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={form.absence.markDayAbsent}
                      onChange={(e) => setForm({
                        ...form,
                        absence: { ...form.absence, markDayAbsent: e.target.checked }
                      })}
                    />
                    <span className="checkbox-mark"></span>
                    <span className="checkbox-label">
                      {t('attendancePolicy.markDayAbsent') || 'Deduct full day on absence'}
                    </span>
                  </label> */}

<label className="custom-checkbox">
  <input
  type="checkbox"
  checked={form.absence.deductSalary}
  onChange={(e) => {
    const checked = e.target.checked;

    setForm({
      ...form,
      absence: {
        ...form.absence,
        deductSalary: checked,
        paid: checked ? form.absence.paid : false // 🔥 reset
      }
    });
  }}
/>
  <span className="checkbox-label">
    {t('attendancePolicy.deductSalary')}
  </span>
</label>
                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={form.absence.paid}
                      disabled={!form.absence.deductSalary}
                      onChange={(e) => setForm({
                        ...form,
                        absence: { ...form.absence, paid: e.target.checked }
                      })}
                    />
                    <span className="checkbox-mark"></span>
                    <span className="checkbox-label">
                      {t('attendancePolicy.paidAbsence') || 'Paid absence'}
                    </span>
                  </label>

                  
{form.absence.deductSalary &&!form.absence.paid && (
                    <div className="form-group mt-3">
                      <label className="form-label-modern">
                        <i className="fas fa-calculator me-2"></i>
                        {t('attendancePolicy.deductionRate') || 'Deduction Rate'}
                      </label>
                      <div className="input-with-unit">
                        <input
                          type="number"
                          min={0}
                          max={1}
                          step="0.1"
                          className="form-control-modern"
                          value={form.absence.dayRate}
                          onChange={(e) => setForm({
                            ...form,
                            absence: { ...form.absence, dayRate: Number(e.target.value) }
                          })}
                        />
                        <span className="input-unit">× {t('common.dailyWage') || 'daily wage'}</span>
                      </div>
                      <small className="form-hint">
                        {t('attendancePolicy.deductionHint') || '1 = full day / 0.5 = half day'}
                      </small>
                    </div>
                  )}
                </div>
              </div>

              {/* Effective Date Section */}
              <div className="form-section">
                <div className="section-header">
                  <i className="fas fa-calendar-check me-2"></i>
                  <span>{t('attendancePolicy.effectiveDate') || 'Effective Date'}</span>
                </div>
                
                <div className="form-group">
                  <label className="form-label-modern">
                    <i className="fas fa-calendar-alt me-2"></i>
                    {t('attendancePolicy.effectiveFrom')} ({policyTZ})

                    {/* //{t('attendancePolicy.effectiveFrom')} */}
                  </label>
                  <input
                    type="date"
                    className="form-control-modern"
                    value={form.effectiveFrom}
                    onChange={(e) => setForm({ ...form, effectiveFrom: e.target.value })}
                  />
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="policy-modal-footer">
              <button className="btn-modal btn-cancel" onClick={onClose}>
                <i className="fas fa-times me-2"></i>
                {t('common.cancel')}
              </button>
              <button
                className="btn-modal btn-save"
                disabled={saving}
                onClick={submit}
              >
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    {t('common.saving')}
                  </>
                ) : (
                  <>
                    <i className="fas fa-check me-2"></i>
                    {t('common.save')}
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>

      {toast.show && (
        <Toast
          show={toast.show}
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      )}
    </>
  );
};

export default AttendancePolicyFormModal;