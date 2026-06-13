

// import React from "react";
// import { useTranslation } from "react-i18next";

// export default function LeavePolicyTable({
//   data = [],
//   loading = false,
//   pagination,
//   filters,
//   onFilterChange,
//   onPageChange,
//   onEdit,
//   onToggleActive,
//   onDelete
// }) {
//   const { t } = useTranslation();

//   const renderTarget = (p) => {
//     if (p.scope === "global") {
//       return (
//         <span className="text-muted">
//           <i className="bi bi-globe me-1" />
//           {t("leavePolicies.scopes.global")}
//         </span>
//       );
//     }

//     if (p.scope === "role") {
//       return (
//         <span className="badge bg-info text-dark text-capitalize">
//           {p.role}
//         </span>
//       );
//     }

//     if (p.scope === "branch") {
//       if (typeof p.scopeId === "object" && p.scopeId?.name) {
//         return (
//           <span>
//             <i className="bi bi-building me-1" />
//             {p.scopeId.name}
//           </span>
//         );
//       }
//       return (
//         <span className="text-muted">
//           <i className="bi bi-building me-1" />
//           {t("leavePolicies.branch")} #{String(p.scopeId).slice(-4)}
//         </span>
//       );
//     }

//     if (p.scope === "user") {
//       if (typeof p.scopeId === "object") {
//         return (
//           <div>
//             <div>{p.scopeId.name}</div>
//             <small className="text-muted">
//               {p.scopeId.email}
//             </small>
//           </div>
//         );
//       }
//       return (
//         <span className="text-muted">
//           <i className="bi bi-person me-1" />
//           {t("leavePolicies.user")} #{String(p.scopeId).slice(-4)}
//         </span>
//       );
//     }

//     return "—";
//   };

//   return (
//     <div className="card shadow-sm">
//       {/* Header + Filters */}
//       <div className="card-header d-flex flex-wrap gap-2 align-items-center">
//         <h5 className="mb-0 me-auto">
//           <i className="bi bi-calendar-check me-2" />
//           {t("leavePolicies.title")}
//         </h5>

//         <select
//           className="form-select form-select-sm w-auto"
//           value={filters.scope || ""}
//           onChange={(e) =>
//             onFilterChange({ ...filters, scope: e.target.value })
//           }
//         >
//           <option value="">{t("common.all")}</option>
//           <option value="global">{t("leavePolicies.scopes.global")}</option>
//           <option value="branch">{t("leavePolicies.scopes.branch")}</option>
//           <option value="role">{t("leavePolicies.scopes.role")}</option>
//           <option value="user">{t("leavePolicies.scopes.user")}</option>
//         </select>

//         <select
//           className="form-select form-select-sm w-auto"
//           value={filters.active ?? ""}
//           onChange={(e) =>
//             onFilterChange({
//               ...filters,
//               active:
//                 e.target.value === ""
//                   ? null
//                   : e.target.value === "true"
//             })
//           }
//         >
//           <option value="">{t("common.allStatus")}</option>
//           <option value="true">{t("common.active")}</option>
//           <option value="false">{t("common.inactive")}</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="table-responsive">
//         <table className="table table-hover align-middle mb-0">
//           <thead className="table-light">
//             <tr>
//               <th>{t("leavePolicies.scope")}</th>
//               <th>{t("leavePolicies.target")}</th>
//               <th>{t("leavePolicies.annualDays")}</th>
//               <th>{t("leavePolicies.sickDays")}</th>
//               <th>{t("leavePolicies.unpaid")}</th>
//               <th>{t("leavePolicies.status")}</th>
//               <th className="text-center">{t("common.actions")}</th>
//             </tr>
//           </thead>

//           <tbody>
//             {loading && (
//               <tr>
//                 <td colSpan="7" className="text-center py-4">
//                   {t("common.loading")}
//                 </td>
//               </tr>
//             )}

//             {!loading && data.length === 0 && (
//               <tr>
//                 <td colSpan="7" className="text-center py-4 text-muted">
//                   {t("leavePolicies.noData")}
//                 </td>
//               </tr>
//             )}

//             {!loading &&
//               data.map((p) => (
//                 <tr key={p._id}>
//                  <td className="text-capitalize">
//   {t(`leavePolicies.scopes.${p.scope}`)}
// </td>

//                   <td>{renderTarget(p)}</td>

//                   <td>{p.values?.annualDays}</td>
//                   <td>{p.values?.sickDays}</td>

//                   <td>
//                     <span
//                       className={`badge ${
//                         p.values?.unpaidAllowed
//                           ? "bg-success"
//                           : "bg-danger"
//                       }`}
//                     >
//                       {p.values?.unpaidAllowed
//                         ? t("common.allowed")
//                         : t("common.notAllowed")}
//                     </span>
//                   </td>

//                   <td>
//                     <span
//                       className={`badge ${
//                         p.active ? "bg-success" : "bg-secondary"
//                       }`}
//                     >
//                       {p.active
//                         ? t("common.active")
//                         : t("common.inactive")}
//                     </span>
//                   </td>

//                   <td className="text-center">
//                     <div className="btn-group btn-group-sm">
//                       <button
//                         className="btn btn-outline-primary"
//                         onClick={() => onEdit(p)}
//                       >
//                         <i className="bi bi-pencil" />
//                       </button>

//                       <button
//                         className="btn btn-outline-warning"
//                         onClick={() => onToggleActive(p)}
//                       >
//                         <i
//                           className={`bi ${
//                             p.active
//                               ? "bi-toggle-off"
//                               : "bi-toggle-on"
//                           }`}
//                         />
//                       </button>

//                       <button
//                         className="btn btn-outline-danger"
//                         onClick={() => onDelete(p)}
//                       >
//                         <i className="bi bi-trash" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>

//       {pagination?.pages > 1 && (
//         <div className="card-footer d-flex justify-content-between">
//           <small className="text-muted">
//             {t("common.page")} {pagination.page} /{" "}
//             {pagination.pages}
//           </small>

//           <div className="btn-group btn-group-sm">
//             <button
//               className="btn btn-outline-secondary"
//               disabled={pagination.page <= 1}
//               onClick={() => onPageChange(pagination.page - 1)}
//             >
//               {t("common.prev")}
//             </button>
//             <button
//               className="btn btn-outline-secondary"
//               disabled={pagination.page >= pagination.pages}
//               onClick={() => onPageChange(pagination.page + 1)}
//             >
//               {t("common.next")}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React from "react";
import { useTranslation } from "react-i18next";
import "../../../style/LeavePolicyTable.css";
import { formatDisplayDate }
from "../../../helpers/timezone";
export default function LeavePolicyTable({
  data = [],
  loading = false,
  pagination,
  filters,
  onFilterChange,
  onPageChange,
  onEdit,
  onToggleActive,
  onDelete
}) {
  const { t } = useTranslation();

  const renderTarget = (p) => {
    if (p.scope === "global") {
      return (
        <span className="target-badge target-global">
          <i className="fas fa-globe me-1"></i>
          {t("leavePolicies.scopes.global")}
        </span>
      );
    }

    if (p.scope === "role") {
      return (
        <span className="target-badge target-role">
          <i className="fas fa-user-shield me-1"></i>
          <span className="text-capitalize">{p.role}</span>
        </span>
      );
    }

    if (p.scope === "branch") {
      if (typeof p.scopeId === "object" && p.scopeId?.name) {
        return (
          <span className="target-badge target-branch">
            <i className="fas fa-building me-1"></i>
            {p.scopeId.name}
          </span>
        );
      }
      return (
        <span className="target-badge target-branch">
          <i className="fas fa-building me-1"></i>
          {t("leavePolicies.branch")} #{String(p.scopeId).slice(-4)}
        </span>
      );
    }

   if (p.scope === "user") {
  if (p.scopeId && typeof p.scopeId === "object") {
    return (
      <div className="target-user">
        <div className="user-name">{p.scopeId.name || '-'}</div>
        <small className="user-email">{p.scopeId.email || '-'}</small>
      </div>
    );
  }
      return (
        <span className="target-badge target-user">
          <i className="fas fa-user me-1"></i>
          {t("leavePolicies.user")} #{String(p.scopeId).slice(-4)}
        </span>
      );
    }

    return "—";
  };

  return (
    <div className="leave-policy-table-container">
      <div className="table-card">
        
        {/* Header + Filters */}
        <div className="table-header">
          <div className="table-title">
            <i className="fas fa-list me-2"></i>
            {t("leavePolicies.policies") || "Policies"}
          </div>

          <div className="table-filters">
            <select
              className="filter-select"
              value={filters.scope || ""}
              onChange={(e) =>
                onFilterChange({ ...filters, scope: e.target.value })
              }
            >
              <option value="">{t("common.allScopes") || "All Scopes"}</option>
              <option value="global">{t("leavePolicies.scopes.global")}</option>
              <option value="branch">{t("leavePolicies.scopes.branch")}</option>
              <option value="role">{t("leavePolicies.scopes.role")}</option>
              <option value="user">{t("leavePolicies.scopes.user")}</option>
            </select>

            <select
              className="filter-select"
              value={filters.active ?? ""}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  active:
                    e.target.value === ""
                      ? null
                      : e.target.value === "true"
                })
              }
            >
              <option value="">{t("common.allStatus")}</option>
              <option value="true">{t("common.active")}</option>
              <option value="false">{t("common.inactive")}</option>
            </select>
          </div>
        </div>

        {/* Table - Desktop View */}
        <div className="table-responsive desktop-table">
          <table className="policy-table">
            <thead>
              <tr>
                <th>{t("leavePolicies.scope")}</th>
                <th>{t("leavePolicies.target")}</th>
                <th className="text-center">{t("leavePolicies.annualDays")}</th>
                <th className="text-center">
  {t("leavePolicies.carryover")}
</th>

                <th className="text-center">{t("leavePolicies.sickDays")}</th>
                <th className="text-center">{t("leavePolicies.unpaid")}</th>
                <th className="text-center">{t("leavePolicies.status")}</th>
                <th className="text-center">
  {t("leavePolicies.effectivePeriod") || "Effective Period"}
</th>
                <th className="text-center">{t("common.actions")}</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan="9" className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">{t("common.loading")}</span>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && data.length === 0 && (
                <tr>
                  <td colSpan="9" className="empty-state">
                    <i className="fas fa-inbox empty-icon"></i>
                    <p>{t("leavePolicies.noData")}</p>
                  </td>
                </tr>
              )}

              {!loading &&
                data.map((p) => (
                  <tr key={p._id} className="table-row">
                    <td>
                      <span className="scope-badge">
                        {t(`leavePolicies.scopes.${p.scope}`)}
                      </span>
                    </td>

                    <td>{renderTarget(p)}</td>

                    <td className="text-center">
                      <span className="days-badge days-annual">
                        {p.values?.annualDays}
                      </span>
                    </td>
                    <td className="text-center">
  <span className="days-badge days-carryover">
    {p.values?.carryoverLimit > 0
  ? p.values.carryoverLimit
  : t("leavePolicies.noCarryover")}

  </span>
</td>

                    <td className="text-center">
                      <span className="days-badge days-sick">
                        {p.values?.sickDays}
                      </span>
                    </td>

                    <td className="text-center">
                      <span
                        className={`status-badge ${
                          p.values?.unpaidAllowed
                            ? "status-allowed"
                            : "status-not-allowed"
                        }`}
                      >
                        {p.values?.unpaidAllowed
                          ? t("common.allowed")
                          : t("common.notAllowed")}
                      </span>
                    </td>

                    <td className="text-center">
                      <span
                        className={`status-badge ${
                          p.active ? "status-active" : "status-inactive"
                        }`}
                      >
                        {p.active
                          ? t("common.active")
                          : t("common.inactive")}
                      </span>
                    </td>
<td className="text-center">
  <div className="small text-muted">
    <div>
      🌍 {p.timezoneSnapshot?.timezone || 'UTC'}
    </div>

    <div>
      From:
      {" "}
      {p.effectiveFrom
        ? formatDisplayDate(
            p.effectiveFrom,
            p.timezoneSnapshot?.timezone
          )
        : "—"}
    </div>

    <div>
      To:
      {" "}
      {p.effectiveTo
        ? formatDisplayDate(
            p.effectiveTo,
            p.timezoneSnapshot?.timezone
          )
        : "No Expiry"}
    </div>
  </div>
</td>
                    <td className="text-center">
                      <div className="action-buttons">
                        <button
                          className="action-btn action-btn-edit"
                          onClick={() => onEdit(p)}
                          title={t("common.edit")}
                        >
                          <i className="fas fa-edit"></i>
                        </button>

                        <button
                          className="action-btn action-btn-toggle"
                          onClick={() => onToggleActive(p)}
                          title={t("common.toggleStatus")}
                        >
                          <i className={`fas ${p.active ? "fa-toggle-on" : "fa-toggle-off"}`}></i>
                        </button>

                        <button
                          className="action-btn action-btn-delete"
                          onClick={() => onDelete(p)}
                          title={t("common.delete")}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="mobile-cards">
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{t("common.loading")}</span>
              </div>
            </div>
          )}

          {!loading && data.length === 0 && (
            <div className="empty-state">
              <i className="fas fa-inbox empty-icon"></i>
              <p>{t("leavePolicies.noData")}</p>
            </div>
          )}

          {!loading && data.map((p) => (
            <div key={p._id} className="mobile-card">
              <div className="mobile-card-header">
                <span className="scope-badge">
                  {t(`leavePolicies.scopes.${p.scope}`)}
                </span>
                <span className={`status-badge ${p.active ? "status-active" : "status-inactive"}`}>
                  {p.active ? t("common.active") : t("common.inactive")}
                </span>
              </div>
<div className="mobile-row">
  <span className="mobile-label">
    {t("common.timezone")}:
  </span>

<div className="mobile-value text-muted small">
  <div>
    🌍 {p.timezoneSnapshot?.timezone || 'UTC'}
  </div>

  <div>
    From:
    {" "}
    {p.effectiveFrom
      ? formatDisplayDate(
          p.effectiveFrom,
          p.timezoneSnapshot?.timezone
        )
      : "—"}
  </div>

  <div>
    To:
    {" "}
    {p.effectiveTo
      ? formatDisplayDate(
          p.effectiveTo,
          p.timezoneSnapshot?.timezone
        )
      : "No Expiry"}
  </div>
</div>
</div>
              <div className="mobile-card-body">
                <div className="mobile-row">
                  <span className="mobile-label">{t("leavePolicies.target")}:</span>
                  <span className="mobile-value">{renderTarget(p)}</span>
                </div>

                <div className="mobile-row">
                  <div className="mobile-days">
                    <div className="day-item">
                      <span className="day-label">{t("leavePolicies.annualDays")}</span>
                      <span className="days-badge days-annual">{p.values?.annualDays}</span>
                    </div>
                
  <div className="day-item">
                      <span className="day-label">{t("leavePolicies.carryover")}</span>
                      <span className="days-badge days-carryover">  {p.values?.carryoverLimit > 0
  ? p.values.carryoverLimit
  : t("leavePolicies.noCarryover")}</span>
                    </div>


                    
                    <div className="day-item">
                      <span className="day-label">{t("leavePolicies.sickDays")}</span>
                      <span className="days-badge days-sick">{p.values?.sickDays}</span>
                    </div>
                  </div>
                </div>

                <div className="mobile-row">
                  <span className="mobile-label">{t("leavePolicies.unpaid")}:</span>
                  <span className={`status-badge ${
                    p.values?.unpaidAllowed ? "status-allowed" : "status-not-allowed"
                  }`}>
                    {p.values?.unpaidAllowed ? t("common.allowed") : t("common.notAllowed")}
                  </span>
                </div>
              </div>

              <div className="mobile-card-footer">
                <button
                  className="action-btn action-btn-edit"
                  onClick={() => onEdit(p)}
                >
                  <i className="fas fa-edit"></i>
                  <span>{t("common.edit")}</span>
                </button>

                <button
                  className="action-btn action-btn-toggle"
                  onClick={() => onToggleActive(p)}
                >
                  <i className={`fas ${p.active ? "fa-toggle-on" : "fa-toggle-off"}`}></i>
                  <span>{t("common.toggleStatus")}</span>
                </button>

                <button
                  className="action-btn action-btn-delete"
                  onClick={() => onDelete(p)}
                >
                  <i className="fas fa-trash"></i>
                  <span>{t("common.delete")}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination?.pages > 1 && (
          <div className="table-footer">
            <div className="pagination-info">
              {t("common.page")} {pagination.page} / {pagination.pages}
              <span className="ms-2 text-muted">
                ({pagination.total} {t("common.total")})
              </span>
            </div>

            <div className="pagination-buttons">
              <button
                className="pagination-btn"
                disabled={pagination.page <= 1}
                onClick={() => onPageChange(pagination.page - 1)}
              >
                <i className="fas fa-chevron-left"></i>
                <span className="d-none d-sm-inline">{t("common.prev")}</span>
              </button>
              <button
                className="pagination-btn"
                disabled={pagination.page >= pagination.pages}
                onClick={() => onPageChange(pagination.page + 1)}
              >
                <span className="d-none d-sm-inline">{t("common.next")}</span>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}