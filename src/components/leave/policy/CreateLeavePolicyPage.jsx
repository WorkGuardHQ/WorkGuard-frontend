
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// import {
//   createLeavePolicy
// } from "../services/leavePolicy.api";
// import { searchUsers } from "../../../services/user.api";
// import { getBranchLookup } from "../../../services/branch.api";
// import Toast from "../../ui/Toast";

// /**
//  * CreateLeavePolicyPage
//  *
//  * ✔ Fully aligned with backend LeaveSettingSchema
//  * ✔ No fake fields (NO accrual / NO carryover)
//  * ✔ HR-grade UX
//  */
// export default function CreateLeavePolicyPage() {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   /* =========================
//      State
//   ========================= */
//   const [loading, setLoading] = useState(false);

//   const [toast, setToast] = useState({
//     show: false,
//     message: "",
//     type: "success"
//   });
// const [userQuery, setUserQuery] = useState('');
// const [userOptions, setUserOptions] = useState([]);

//   const [branches, setBranches] = useState([]);
//   // const [users, setUsers] = useState([]);

//   const [form, setForm] = useState({
//     scope: "",
//     scopeId: "",
//     role: "",
//     annualDays: 21,
//     sickDays: 10,
//     unpaidAllowed: true,
//     effectiveFrom: "",
//     effectiveTo: "",
//     note: ""
//   });

//   /* =========================
//      Load data (branches / users)
//   ========================= */
// useEffect(() => {
//   if (!userQuery) return;

//   const timer = setTimeout(async () => {
//     const res = await searchUsers(userQuery);
//     setUserOptions(res.data.data);
//   }, 300);

//   return () => clearTimeout(timer);
// }, [userQuery]);

// useEffect(() => {
//   getBranchLookup().then(res => {
//     setBranches(res.data.data);
//   });
// }, []);




//   /* =========================
//      Handlers
//   ========================= */
//   const updateField = (key, value) => {
//     setForm((prev) => ({
//       ...prev,
//       [key]: value
//     }));
//   };

//   const handleScopeChange = (scope) => {
//     setForm((prev) => ({
//       ...prev,
//       scope,
//       scopeId: "",
//       role: ""
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.scope) {
//       return setToast({
//         show: true,
//         message: t("leavePolicies.errors.scopeRequired"),
//         type: "warning"
//       });
//     }

//     if (["branch", "user"].includes(form.scope) && !form.scopeId) {
//       return setToast({
//         show: true,
//         message: t("leavePolicies.errors.targetRequired"),
//         type: "warning"
//       });
//     }
// if (!form.effectiveFrom) {
//   return setToast({
//     show: true,
//     type: "warning",
//     message: t("leavePolicies.errors.effectiveFromRequired")
//   });
// }

//     if (form.scope === "role" && !form.role) {
//       return setToast({
//         show: true,
//         message: t("leavePolicies.errors.roleRequired"),
//         type: "warning"
//       });
//     }

//     try {
//       setLoading(true);
// // const payload = {
// //   scope: form.scope,
// //   scopeId: ["branch", "user"].includes(form.scope)
// //     ? form.scopeId
// //     : null,
// //   role: form.scope === "role" ? form.role : null,
// //   values: {
// //     annualDays: Number(form.annualDays),
// //     sickDays: Number(form.sickDays),
// //     unpaidAllowed: Boolean(form.unpaidAllowed)
// //   },
// //   effectiveFrom: new Date(form.effectiveFrom),
// //   effectiveTo: form.effectiveTo
// //     ? new Date(form.effectiveTo)
// //     : null,
// //   note: form.note
// // };

// const payload = {
//   scope: form.scope,

//   scopeId: ["branch", "user"].includes(form.scope)
//     ? form.scopeId
//     : null,

//   scopeModel:
//     form.scope === "branch"
//       ? "Branch"
//       : form.scope === "user"
//       ? "User"
//       : null,

//   role: form.scope === "role" ? form.role : null,

//   values: {
//     annualDays: Number(form.annualDays),
//     sickDays: Number(form.sickDays),
//     unpaidAllowed: Boolean(form.unpaidAllowed)
//   },

//   effectiveFrom: new Date(form.effectiveFrom),

//   effectiveTo: form.effectiveTo
//     ? new Date(form.effectiveTo)
//     : null,

//   note: form.note
// };

//       await createLeavePolicy(payload);

//       setToast({
//         show: true,
//         message: t("leavePolicies.created"),
//         type: "success"
//       });

//       setTimeout(() => {
//         navigate("/admin/leave-policies");
//       }, 800);

//     } catch (err) {
//       setToast({
//         show: true,
//         message:
//           err.response?.data?.message ||
//           t("leavePolicies.errors.createFailed"),
//         type: "error"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =========================
//      Render
//   ========================= */
//   return (
//     <div className="container-fluid py-4">
//       <Toast
//         {...toast}
//         onClose={() => setToast((t) => ({ ...t, show: false }))}
//       />

//       <div className="card shadow-sm">
//         <div className="card-header">
//           <h4 className="mb-0">{t("leavePolicies.createTitle")}</h4>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="card-body row g-3">

//             {/* Scope */}
//             <div className="col-md-4">
//               <label className="form-label">
//                 {t("leavePolicies.scope")}
//               </label>
//               <select
//                 className="form-select"
//                 value={form.scope}
//                 onChange={(e) => handleScopeChange(e.target.value)}
//               >
//                 <option value="">{t("common.select")}</option>
//                 <option value="global">{t("leavePolicies.scopes.global")}</option>
//                 <option value="branch">{t("leavePolicies.scopes.branch")}</option>
//                 <option value="role">{t("leavePolicies.scopes.role")}</option>
//                 <option value="user">{t("leavePolicies.scopes.user")}</option>
//               </select>
//             </div>

//             {/* Branch */}
//             {form.scope === "branch" && (
//               <div className="col-md-4">
//                 <label className="form-label">
//                   {t("leavePolicies.branch")}
//                 </label>
//               <select
//   className="form-select"
//   value={form.scopeId}
//   onChange={(e) => updateField("scopeId", e.target.value)}
// >
//   <option value="">{t("common.select")}</option>
//   {branches.map(b => (
//     <option key={b._id} value={b._id}>
//       {b.name}
//     </option>
//   ))}
// </select>

//               </div>
//             )}

//             {/* Role */}
//             {form.scope === "role" && (
//               <div className="col-md-4">
//                 <label className="form-label">
//                   {t("leavePolicies.role")}
//                 </label>
//                 <select
//                   className="form-select"
//                   value={form.role}
//                   onChange={(e) => updateField("role", e.target.value)}
//                 >
//                   <option value="">{t("common.select")}</option>
//                   <option value="admin">Admin</option>
//                   <option value="staff">Staff</option>
//                 </select>
//               </div>
//             )}

//             {/* User */}
//             {form.scope === "user" && (
//               <div className="col-md-6">
//                 <label className="form-label">
//                   {t("leavePolicies.user")}
//                 </label>
//                <input
//   className="form-control"
//   placeholder={t("leavePolicies.searchUser")}
//   value={userQuery}
//   onChange={(e) => setUserQuery(e.target.value)}
// />
//                 {userOptions.length > 0 && (
//   <div className="list-group position-absolute w-100 shadow">
//     {userOptions.map(u => (
//       <button
//         key={u._id}
//         type="button"
//         className="list-group-item list-group-item-action"
//         onClick={() => {
//           updateField('scopeId', u._id);
//           setUserQuery(`${u.name} (${u.email})`);
//           setUserOptions([]);
//         }}
//       >
//         {u.name} – {u.email}
//       </button>
//     ))}
//   </div>
// )}
//               </div>
//             )}

//             {/* Annual */}
//             <div className="col-md-3">
//               <label className="form-label">
//                 {t("leavePolicies.annualDays")}
//               </label>
//               <input
//                 type="number"
//                 min="0"
//                 className="form-control"
//                 value={form.annualDays}
//                 onChange={(e) =>
//                   updateField("annualDays", e.target.value)
//                 }
//               />
//             </div>

//             {/* Sick */}
//             <div className="col-md-3">
//               <label className="form-label">
//                 {t("leavePolicies.sickDays")}
//               </label>
//               <input
//                 type="number"
//                 min="0"
//                 className="form-control"
//                 value={form.sickDays}
//                 onChange={(e) =>
//                   updateField("sickDays", e.target.value)
//                 }
//               />
//             </div>

//             {/* Unpaid */}
//             <div className="col-md-3 d-flex align-items-end">
//               <div className="form-check form-switch">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   checked={form.unpaidAllowed}
//                   onChange={(e) =>
//                     updateField("unpaidAllowed", e.target.checked)
//                   }
//                 />
//                 <label className="form-check-label">
//                   {t("leavePolicies.unpaidAllowed")}
//                 </label>
//               </div>
//             </div>

//             {/* Dates */}
//             <div className="col-md-3">
//               <label className="form-label">
//                 {t("leavePolicies.effectiveFrom")}
//               </label>
//               <input
//                 type="date"
//                  required
//                 className="form-control"
//                 value={form.effectiveFrom}
//                 onChange={(e) =>
//                   updateField("effectiveFrom", e.target.value)
//                 }
//               />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">
//                 {t("leavePolicies.effectiveTo")}
//               </label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={form.effectiveTo}
//                 onChange={(e) =>
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
//                 className="form-control"
//                 rows="2"
//                 value={form.note}
//                 onChange={(e) => updateField("note", e.target.value)}
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
//               disabled={loading}
//             >
//               {loading
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
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import { toUTCMidnight } from "../../../helpers/dateHelpers";

import {
  createLeavePolicy,
  getLeavePolicies
} from "../../../services/Leave-services/leavePolicy.api";
import { searchUsers } from "../../../services/user.api";
import { getBranchLookup } from "../../../services/branch.api";

// import { toUTCFromTimezone } from '../../../helpers/dateHelpers';
import { getPolicyTimezone } from '../../../helpers/timezone';


import Toast from "../../ui/Toast";
import "../../../style/LeavePolicyForm.css";

export default function CreateLeavePolicyPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });
  
  const [userQuery, setUserQuery] = useState('');
  const [userOptions, setUserOptions] = useState([]);
  const [branches, setBranches] = useState([]);
const [tenantTimezone, setTenantTimezone] =
  useState('UTC');

  const [form, setForm] = useState({
    scope: "",
    scopeId: "",
    branch: "",
    role: "",
    annualDays: 21,
    sickDays: 10,
    carryoverLimit: 0,
    unpaidAllowed: true,
    effectiveFrom: "",
    effectiveTo: "",
    userTimezone: "",
    note: ""
  });

  useEffect(() => {
    if (!userQuery) return;

    const timer = setTimeout(async () => {
      const res = await searchUsers(userQuery);
      setUserOptions(res.data.data);
    }, 300);

    return () => clearTimeout(timer);
  }, [userQuery]);

  useEffect(() => {
    getBranchLookup().then(res => {
      setBranches(res.data.data);
    });
  }, []);


  useEffect(() => {
  getLeavePolicies({ page: 1, limit: 1 })
    .then((res) => {
      setTenantTimezone(
        res.data?.meta?.timezone || 'UTC'
      );
    })
    .catch(() => {
      setTenantTimezone('UTC');
    });
}, []);

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleScopeChange = (scope) => {
    setForm((prev) => ({
      ...prev,
      scope,
      scopeId: "",
      branch: "",
      role: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
// const tz = getPolicyTimezone(form, branches, tenant?.timezone);

    if (!form.scope) {
      return setToast({
        show: true,
        message: t("leavePolicies.errors.scopeRequired"),
        type: "warning"
      });
    }

    // if (["branch", "user"].includes(form.scope) && !form.scopeId)
    
    if (
  (form.scope === "branch" && !form.branch) ||
  (form.scope === "user" && !form.scopeId)
){
      return setToast({
        show: true,
        message: t("leavePolicies.errors.targetRequired"),
        type: "warning"
      });
    }
    
    if (!form.effectiveFrom) {
      return setToast({
        show: true,
        type: "warning",
        message: t("leavePolicies.errors.effectiveFromRequired")
      });
    }

    if (form.scope === "role" && !form.role) {
      return setToast({
        show: true,
        message: t("leavePolicies.errors.roleRequired"),
        type: "warning"
      });
    }

    try {
      setLoading(true);

      const payload = {
        scope: form.scope,
        // scopeId: ["branch", "user"].includes(form.scope) ? form.scopeId : null,

        scopeId:
  form.scope === "branch"
    ? form.branch
    : form.scope === "user"
      ? form.scopeId
      : null,

        scopeModel: form.scope === "branch" ? "Branch" : form.scope === "user" ? "User" : null,
        role: form.scope === "role" ? form.role : null,
        values: {
          annualDays: Number(form.annualDays),
          sickDays: Number(form.sickDays),
          unpaidAllowed: Boolean(form.unpaidAllowed),
          carryoverLimit: Number(form.carryoverLimit)
        },
        effectiveFrom: form.effectiveFrom,
effectiveTo: form.effectiveTo || null,

      //  effectiveFrom: toUTCMidnight(form.effectiveFrom)
//        ,
// effectiveTo: form.effectiveTo
//   ? toUTCMidnight(form.effectiveTo)
//   : null,

        note: form.note
      };

      await createLeavePolicy(payload);

      setToast({
        show: true,
        message: t("leavePolicies.created"),
        type: "success"
      });

      setTimeout(() => {
        navigate("/admin/leave-policies");
      }, 800);

    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || t("leavePolicies.errors.createFailed"),
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };
const policyTimezone = getPolicyTimezone(
  form,
  branches,
  tenantTimezone
);
  return (
    <div className="leave-policy-form-page">
      <div className="container-fluid">
        <Toast
          {...toast}
          onClose={() => setToast((t) => ({ ...t, show: false }))}
        />

        <div className="form-card">
          
          {/* Header */}
          <div className="form-header">
            <div>
              <h4 className="form-title">
                <i className="fas fa-plus-circle me-2"></i>
                {t("leavePolicies.createTitle")}
              </h4>
              <p className="form-subtitle">
                {t("leavePolicies.createSubtitle") || "Configure leave policy settings"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-body">

              {/* Scope Section */}
              <div className="form-section">
                <div className="section-header">
                  <i className="fas fa-bullseye me-2"></i>
                  {t("leavePolicies.policyScope") || "Policy Scope"}
                </div>

                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label-modern">
                      <i className="fas fa-layer-group me-2"></i>
                      {t("leavePolicies.scope")}
                    </label>
                    <select
                      className="form-control-modern"
                      value={form.scope}
                      onChange={(e) => handleScopeChange(e.target.value)}
                    >
                      <option value="">{t("common.select")}</option>
                      <option value="global">{t("leavePolicies.scopes.global")}</option>
                      <option value="branch">{t("leavePolicies.scopes.branch")}</option>
                      <option value="role">{t("leavePolicies.scopes.role")}</option>
                      <option value="user">{t("leavePolicies.scopes.user")}</option>
                    </select>
                  </div>

                  {form.scope === "branch" && (
                    <div className="col-md-4">
                      <label className="form-label-modern">
                        <i className="fas fa-building me-2"></i>
                        {t("leavePolicies.branch")}
                      </label>
                      <select
                        className="form-control-modern"
value={form.branch}                        onChange={(e) => updateField("branch", e.target.value)}
                      >
                        <option value="">{t("common.select")}</option>
                        {branches.map(b => (
                          <option key={b._id} value={b._id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {form.scope === "role" && (
                    <div className="col-md-4">
                      <label className="form-label-modern">
                        <i className="fas fa-user-shield me-2"></i>
                        {t("leavePolicies.role")}
                      </label>
                      <select
                        className="form-control-modern"
                        value={form.role}
                        onChange={(e) => updateField("role", e.target.value)}
                      >
                        <option value="">{t("common.select")}</option>
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                      </select>
                    </div>
                  )}

                  {form.scope === "user" && (
                    <div className="col-md-6">
                      <label className="form-label-modern">
                        <i className="fas fa-user me-2"></i>
                        {t("leavePolicies.user")}
                      </label>
                      <input
                        className="form-control-modern"
                        placeholder={t("leavePolicies.searchUser")}
                        value={userQuery}
                        onChange={(e) => setUserQuery(e.target.value)}
                      />
                      {userOptions.length > 0 && (
                        <div className="user-dropdown">
                          {userOptions.map(u => (
                            <button
                              key={u._id}
                              type="button"
                              className="user-option"
                              onClick={() => {
                                // updateField('scopeId', u._id);

                                 setForm(prev => ({
    ...prev,
    scopeId: u._id,
    userTimezone: u.workTimezone || tenantTimezone
  }));
                                setUserQuery(`${u.name} (${u.email})`);
                                setUserOptions([]);
                              }}
                            >
                              <div className="user-option-name">{u.name}</div>
                              <div className="user-option-email">{u.email}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
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
                      onChange={(e) => updateField("annualDays", e.target.value)}
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
                      onChange={(e) => updateField("sickDays", e.target.value)}
                    />
                  </div>

                  <div className="col-md-4 d-flex align-items-end">
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        checked={form.unpaidAllowed}
                        onChange={(e) => updateField("unpaidAllowed", e.target.checked)}
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
  🌍 Policy timezone: {policyTimezone}
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
                      onChange={(e) => updateField("effectiveFrom", e.target.value)}
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
                      onChange={(e) => updateField("effectiveTo", e.target.value)}
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
                  onChange={(e) => updateField("note", e.target.value)}
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
                disabled={loading}
              >
                {loading ? (
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