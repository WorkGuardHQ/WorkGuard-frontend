
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// import {
//   getLeavePolicyById,
//   updateLeavePolicy
// } from "../services/leavePolicy.api";

// import Toast from "../../ui/Toast";

// /**
//  * EditLeavePolicyPage
//  *
//  * ✔ Edit values ONLY (no scope change)
//  * ✔ Does NOT affect existing leave balances
//  * ✔ HR-safe
//  */
// export default function EditLeavePolicyPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   /* =========================
//      State
//   ========================= */
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [toast, setToast] = useState({
//     show: false,
//     message: "",
//     type: "success"
//   });

//   const [policy, setPolicy] = useState(null);

//   const [form, setForm] = useState({
//     annualDays: 0,
//     sickDays: 0,
//     unpaidAllowed: false,
//     effectiveFrom: "",
//     effectiveTo: "",
//     note: ""
//   });

//   /* =========================
//      Load policy
//   ========================= */
//   useEffect(() => {
//     async function loadPolicy() {
//       try {
//         const res = await getLeavePolicyById(id);
//         const p = res.data.data;

//         setPolicy(p);

//         setForm({
//           annualDays: p.values?.annualDays ?? 0,
//           sickDays: p.values?.sickDays ?? 0,
//           unpaidAllowed: Boolean(p.values?.unpaidAllowed),
//           effectiveFrom: p.effectiveFrom
//             ? p.effectiveFrom.slice(0, 10)
//             : "",
//           effectiveTo: p.effectiveTo
//             ? p.effectiveTo.slice(0, 10)
//             : "",
//           note: p.note || ""
//         });
//       } catch (err) {
//         setToast({
//           show: true,
//           type: "error",
//           message:
//             err.response?.data?.message ||
//             t("leavePolicies.errors.loadFailed")
//         });
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadPolicy();
//   }, [id, t]);

//   /* =========================
//      Helpers
//   ========================= */
//   const updateField = (key, value) => {
//     setForm(prev => ({ ...prev, [key]: value }));
//   };

//   /* =========================
//      Submit
//   ========================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.effectiveFrom) {
//       return setToast({
//         show: true,
//         type: "warning",
//         message: t("leavePolicies.errors.effectiveFromRequired")
//       });
//     }

//     try {
//       setSaving(true);

//       await updateLeavePolicy(id, {
//         values: {
//           annualDays: Number(form.annualDays),
//           sickDays: Number(form.sickDays),
//           unpaidAllowed: Boolean(form.unpaidAllowed)
//         },
//         effectiveFrom: form.effectiveFrom,
//         effectiveTo: form.effectiveTo || null,
//         note: form.note
//       });

//       setToast({
//         show: true,
//         type: "success",
//         message: t("leavePolicies.updated")
//       });

//       setTimeout(() => {
//         navigate("/admin/leave-policies");
//       }, 800);

//     } catch (err) {
//       setToast({
//         show: true,
//         type: "error",
//         message:
//           err.response?.data?.message ||
//           t("leavePolicies.errors.updateFailed")
//       });
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* =========================
//      Render
//   ========================= */
//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         {t("common.loading")}
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid py-4">
//       <Toast
//         {...toast}
//         onClose={() => setToast(t => ({ ...t, show: false }))}
//       />

//       <div className="card shadow-sm">
//         <div className="card-header">
//           <h4 className="mb-0">
//             {t("leavePolicies.editTitle")}
//           </h4>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="card-body row g-3">

//             {/* ⚠️ HR Notice */}
//             <div className="col-12">
//               <div className="alert alert-warning">
//                 <strong>
//                   {t("leavePolicies.notice.title")}
//                 </strong>
//                 <div>
//                   {t("leavePolicies.notice.noBalanceImpact")}
//                 </div>
//               </div>
//             </div>

//             {/* Annual */}
//             <div className="col-md-4">
//               <label className="form-label">
//                 {t("leavePolicies.annualDays")}
//               </label>
//               <input
//                 type="number"
//                 min="0"
//                 className="form-control"
//                 value={form.annualDays}
//                 onChange={e =>
//                   updateField("annualDays", e.target.value)
//                 }
//               />
//             </div>

//             {/* Sick */}
//             <div className="col-md-4">
//               <label className="form-label">
//                 {t("leavePolicies.sickDays")}
//               </label>
//               <input
//                 type="number"
//                 min="0"
//                 className="form-control"
//                 value={form.sickDays}
//                 onChange={e =>
//                   updateField("sickDays", e.target.value)
//                 }
//               />
//             </div>

//             {/* Unpaid */}
//             <div className="col-md-4 d-flex align-items-end">
//               <div className="form-check form-switch">
//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   checked={form.unpaidAllowed}
//                   onChange={e =>
//                     updateField("unpaidAllowed", e.target.checked)
//                   }
//                 />
//                 <label className="form-check-label">
//                   {t("leavePolicies.unpaidAllowed")}
//                 </label>
//               </div>
//             </div>

//             {/* Dates */}
//             <div className="col-md-4">
//               <label className="form-label">
//                 {t("leavePolicies.effectiveFrom")}
//               </label>
//               <input
//                 type="date"
//                 required
//                 className="form-control"
//                 value={form.effectiveFrom}
//                 onChange={e =>
//                   updateField("effectiveFrom", e.target.value)
//                 }
//               />
//             </div>

//             <div className="col-md-4">
//               <label className="form-label">
//                 {t("leavePolicies.effectiveTo")}
//               </label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={form.effectiveTo}
//                 onChange={e =>
//                   updateField("effectiveTo", e.target.value)
//                 }
//               />
//             </div>

//             {/* Note */}
//             <div className="col-12">
//               <label className="form-label">
//                 {t("common.note")}
//               </label>
//               <textarea
//                 rows="3"
//                 className="form-control"
//                 value={form.note}
//                 onChange={e =>
//                   updateField("note", e.target.value)
//                 }
//               />
//             </div>

//           </div>

//           <div className="card-footer d-flex justify-content-end gap-2">
//             <button
//               type="button"
//               className="btn btn-outline-secondary"
//               onClick={() => navigate("/admin/leave-policies")}
//             >
//               {t("common.cancel")}
//             </button>

//             <button
//               type="submit"
//               className="btn btn-primary"
//               disabled={saving}
//             >
//               {saving
//                 ? t("common.saving")
//                 : t("common.save")}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import { toUTCMidnight } from "../../../helpers/dateHelpers";
import {
  toDateInputValue
} from "../../../helpers/dateHelpers";
import {
  formatDisplayDate,
  getPolicyTimezone
} from "../../../helpers/timezone";

import {
  getLeavePolicyById,
  updateLeavePolicy
} from "../../../services/Leave-services/leavePolicy.api";

import Toast from "../../ui/Toast";
import "../../../style/LeavePolicyForm.css";

export default function EditLeavePolicyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const [policy, setPolicy] = useState(null);

  const [form, setForm] = useState({
    annualDays: 0,
    sickDays: 0,
    carryoverLimit: 0,
    unpaidAllowed: false,
    effectiveFrom: "",
    effectiveTo: "",
    note: ""
  });

  useEffect(() => {
    async function loadPolicy() {
      try {
        const res = await getLeavePolicyById(id);
        const p = res.data.data;

        setPolicy(p);

        setForm({
          annualDays: p.values?.annualDays ?? 0,
          sickDays: p.values?.sickDays ?? 0,
          unpaidAllowed: Boolean(p.values?.unpaidAllowed),
          carryoverLimit: p.values?.carryoverLimit ?? 0,
          effectiveFrom: p.effectiveFrom
  ? toDateInputValue(
      p.effectiveFrom,
      p.timezone
    )
  : "",
         effectiveTo: p.effectiveTo
  ? toDateInputValue(
      p.effectiveTo,
      p.timezone
    )
  : "",
          note: p.note || ""
        });
      } catch (err) {
        setToast({
          show: true,
          type: "error",
          message: err.response?.data?.message || t("leavePolicies.errors.loadFailed")
        });
      } finally {
        setLoading(false);
      }
    }

    loadPolicy();
  }, [id, t]);

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.effectiveFrom) {
      return setToast({
        show: true,
        type: "warning",
        message: t("leavePolicies.errors.effectiveFromRequired")
      });
    }

    try {
      setSaving(true);

      await updateLeavePolicy(id, {
        values: {
          annualDays: Number(form.annualDays),
          sickDays: Number(form.sickDays),
          unpaidAllowed: Boolean(form.unpaidAllowed),
           carryoverLimit: Number(form.carryoverLimit)
        },
       effectiveFrom: form.effectiveFrom,
effectiveTo: form.effectiveTo || null,

        note: form.note
      });

      setToast({
        show: true,
        type: "success",
        message: t("leavePolicies.updated")
      });

      setTimeout(() => {
        navigate("/admin/leave-policies");
      }, 800);

    } catch (err) {
      setToast({
        show: true,
        type: "error",
        message: err.response?.data?.message || t("leavePolicies.errors.updateFailed")
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="leave-policy-form-page">
        <div className="container-fluid">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">{t("common.loading")}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="leave-policy-form-page">
      <div className="container-fluid">
        <Toast
          {...toast}
          onClose={() => setToast(t => ({ ...t, show: false }))}
        />

        <div className="form-card">
          
          {/* Header */}
          <div className="form-header">
            <div>
              <h4 className="form-title">
                <i className="fas fa-edit me-2"></i>
                {t("leavePolicies.editTitle")}
              </h4>
              <p className="form-subtitle">
                {t("leavePolicies.editSubtitle") || "Update leave policy settings"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-body">

              {/* Warning Notice */}
              <div className="warning-alert">
                <div className="warning-alert-title">
                  <i className="fas fa-exclamation-triangle"></i>
                  {t("leavePolicies.notice.title")}
                </div>
                <div className="warning-alert-body">
                  {t("leavePolicies.notice.noBalanceImpact")}
                </div>
              </div>

              {/* Leave Days Section */}
              <div className="form-section">
                <div className="section-header">
                  <i className="fas fa-calendar-day me-2"></i>
                  {t("leavePolicies.leaveDays") || "Leave Days"}
                </div>

                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label-modern">
                      <i className="fas fa-umbrella-beach me-2"></i>
                      {t("leavePolicies.annualDays")}
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control-modern"
                      value={form.annualDays}
                      onChange={e => updateField("annualDays", e.target.value)}
                    />
                  </div>
<div className="col-md-4">
  <label className="form-label-modern">
    <i className="fas fa-redo me-2"></i>
    {t("leavePolicies.carryoverLimit")}
  </label>
  <input
    type="number"
    min="0"
    className="form-control-modern"
    value={form.carryoverLimit}
    onChange={(e) =>
      updateField("carryoverLimit", e.target.value)
    }
  />
  <small className="text-muted">
    {t("leavePolicies.carryoverHint")} 
    **
    {t("leavePolicies.carryoverAppliedOnReset")}
  </small>
  
</div>

                  <div className="col-md-4">
                    <label className="form-label-modern">
                      <i className="fas fa-briefcase-medical me-2"></i>
                      {t("leavePolicies.sickDays")}
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control-modern"
                      value={form.sickDays}
                      onChange={e => updateField("sickDays", e.target.value)}
                    />
                  </div>

                  <div className="col-md-4 d-flex align-items-end">
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        checked={form.unpaidAllowed}
                        onChange={e => updateField("unpaidAllowed", e.target.checked)}
                      />
                      <span className="switch-slider"></span>
                      <span className="switch-label">
                        {t("leavePolicies.unpaidAllowed")}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Effective Dates Section */}
              <div className="form-section">
                <div className="section-header">
                  <i className="fas fa-calendar-check me-2"></i>
                  {t("leavePolicies.effectivePeriod") || "Effective Period"}
                </div>

                <div className="row g-3">
                <div className="text-muted small mt-2">
  🌍 Policy timezone: {policy?.timezone }
</div>
                  <div className="col-md-6">
                    <label className="form-label-modern">
                      <i className="fas fa-calendar-alt me-2"></i>
                      {t("leavePolicies.effectiveFrom")} *
                    </label>
                    <input
                      type="date"
                      required
                      className="form-control-modern"
                      value={form.effectiveFrom}
                      onChange={e => updateField("effectiveFrom", e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label-modern">
                      <i className="fas fa-calendar-times me-2"></i>
                      {t("leavePolicies.effectiveTo")}
                    </label>
                    <input
                      type="date"
                      className="form-control-modern"
                      value={form.effectiveTo}
                      onChange={e => updateField("effectiveTo", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Note Section */}
              <div className="form-section">
                <div className="section-header">
                  <i className="fas fa-sticky-note me-2"></i>
                  {t("common.note")}
                </div>

                <textarea
                  className="form-control-modern"
                  rows="3"
                  value={form.note}
                  onChange={e => updateField("note", e.target.value)}
                  placeholder={t("leavePolicies.notePlaceholder") || "Add any additional notes..."}
                />
              </div>

            </div>

            <div className="form-footer">
              <button
                type="button"
                className="btn-form btn-cancel"
                onClick={() => navigate("/admin/leave-policies")}
              >
                <i className="fas fa-times me-2"></i>
                {t("common.cancel")}
              </button>

              <button
                type="submit"
                className="btn-form btn-save"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    {t("common.saving")}
                  </>
                ) : (
                  <>
                    <i className="fas fa-check me-2"></i>
                    {t("common.save")}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}