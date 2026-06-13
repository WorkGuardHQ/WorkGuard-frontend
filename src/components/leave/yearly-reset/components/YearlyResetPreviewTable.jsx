

// import React from "react";
// import { useTranslation } from "react-i18next";

// export default function YearlyResetPreviewTable({
//   data = [],
//   loading = false,
//   pagination,
//   onRun
// }) {
//   const { t } = useTranslation();

//   if (!loading && data.length === 0) {
//     return (
//       <div className="alert alert-info mt-4">
//         <i className="fas fa-info-circle me-2"></i>
//         {t("leaveReset.noPreview")}
//       </div>
//     );
//   }

//   return (
//     <div className="yearly-reset-preview mt-4">
//       <div className="card">

//         {/* Header */}
//         <div className="card-header d-flex justify-content-between align-items-center">
//           <h5 className="mb-0">
//             <i className="fas fa-eye me-2"></i>
//             {t("leaveReset.previewTitle")}
//           </h5>

//           {pagination && (
//             <span className="text-muted small">
//               {t("common.total")}: {pagination.total}
//             </span>
//           )}
//         </div>

//         {/* Table */}
//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0">
//             <thead className="table-light">
//               <tr>
//                 <th>{t("leaveReset.employee")}</th>
//                 <th className="text-center">{t("leaveReset.annual")}</th>
//                 <th className="text-center">{t("leaveReset.sick")}</th>
//                 <th className="text-center">{t("leaveReset.status")}</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading && (
//                 <tr>
//                   <td colSpan="4" className="text-center py-5">
//                     <div className="spinner-border text-primary" />
//                   </td>
//                 </tr>
//               )}

//               {!loading && data.map((row) => (
//                 <tr key={row.userId}>

//                   {/* Employee */}
//                   <td>
//                     <div className="fw-semibold">{row.name}</div>
//                     <div className="text-muted small">{row.email}</div>
//                   </td>

//                   {/* Annual */}
//                   <td className="text-center">
//                     {row.annual ? (
//                       <div className="annual-preview">
//                         <div>
//                           <small className="text-muted">
//                             {t("leaveReset.current")}
//                           </small>
//                           <div>{row.annual.currentTotal}</div>
//                         </div>

//                         <div>
//                           <small className="text-muted">
//                             {t("leaveReset.base")}
//                           </small>
//                           <div>{row.annual.base}</div>
//                         </div>

//                         <div>
//                           <small className="text-muted">
//                             {t("leaveReset.carried")}
//                           </small>
//                           <div>{row.annual.carriedOver}</div>
//                         </div>

//                         <div className="fw-bold text-primary">
//                           {row.annual.newTotal}
//                         </div>
//                       </div>
//                     ) : (
//                       <span className="text-muted">—</span>
//                     )}
//                   </td>

//                   {/* Sick */}
//                   <td className="text-center">
//                     {row.sick ? (
//                       <div>
//                         <small className="text-muted">
//                           {t("leaveReset.current")}
//                         </small>
//                         <div>{row.sick.currentTotal}</div>

//                         <small className="text-muted mt-1 d-block">
//                           {t("leaveReset.new")}
//                         </small>
//                         <div className="fw-semibold">
//                           {row.sick.newTotal}
//                         </div>
//                       </div>
//                     ) : (
//                       <span className="text-muted">—</span>
//                     )}
//                   </td>

//                   {/* Status */}
//                   <td className="text-center">
//                     {row.status === "SKIPPED" ? (
//                       <>
//                         <span className="badge bg-warning">
//                           {t("leaveReset.skipped")}
//                         </span>
//                         <div className="small text-muted mt-1">
//                           {t("leaveReset.skipReasons.payroll")}
//                         </div>
//                       </>
//                     ) : (
//                       <span className="badge bg-success">
//                         {t("leaveReset.ready")}
//                       </span>
//                     )}
//                   </td>

//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Footer */}
//         <div className="card-footer">
//           <div className="alert alert-warning mb-3">
//             <i className="fas fa-exclamation-triangle me-2"></i>
//             {t("leaveReset.warning")}
//           </div>

//           <div className="d-flex justify-content-between align-items-center">
//             <div className="text-muted small">
//               {t("leaveReset.affectedUsers", { count: data.length })}
//             </div>

//             <button
//               className="btn btn-danger"
//               onClick={onRun}
//               disabled={loading}
//               title={t("leaveReset.runTooltip")}
//             >
//               <i className="fas fa-play me-2"></i>
//               {t("leaveReset.run")}
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
// import {
//   getBranchLookup
// } from '../../../../services/branch.api';
export default function YearlyResetPreviewTable({
  data = [],
  loading = false,
  pagination,
  stats,
  yearResetStatus,
   branches = [],          // 👈 list of branches [{_id, name}]
  canRun = false,
  onRun,
  onPageChange,
  onFilterChange
}) {
  const { t } = useTranslation();

  /* =========================
     Local Filters State
  ========================= */
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  // const [branches, setBranches] = useState([]);

  const [branchId, setBranchId] = useState("");
// useEffect(() => {
//   loadBranches();
// }, []);
// const loadBranches = async () => {
//   try {

//     const res =
//       await getBranchLookup();

//     setBranches(
//       res.data?.data || []
//     );

//   } catch (err) {
//     console.error(
//       'Failed to load branches',
//       err
//     );
//   }
// };

  const applyFilters = () => {
    if (!onFilterChange) return;

    onFilterChange({
      search,
      status,
      branchId,
      // page: 1
    });
  };

const getPolicyLabel = (row) => {
  const policy = row.policy;

  if (!policy)
    return "—";

  switch (policy.scope) {

    case "global":
      return "Global Policy";

    case "branch": {

      const branch =
        branches.find(
          b => b._id === policy.scopeId
        );

      return branch
        ? `${branch.name} Branch Policy`
        : "Branch Policy";
    }

    case "role":
      return `${policy.role} Role Policy`;

    case "user":
      return `${row.name} Custom Policy`;

    default:
      return policy.scope;
  }
};



//   if (!loading && data.length === 0) {
//     return (
//    <div className="alert alert-info mt-4">
//   <i className="fas fa-info-circle me-2"></i>

//   <div className="small mt-2">
//     {t("leaveReset.howItWorks.multiBranch")}
//   </div>

//   <div className="mt-2">
//     {t("leaveReset.noPreview")}
//   </div>
// </div>
//     );
//   }

  return (
    <div className="yearly-reset-preview mt-4">
      <div className="card">

        {/* ================= Header ================= */}
        <div className="card-header">

          {/* Title */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">
              <i className="fas fa-eye me-2"></i>
              {t("leaveReset.previewTitle")}
            </h5>

            {pagination && (
              <span className="text-white small">
                {t("common.total")}: {pagination.total}
              </span>
            )}
          </div>

          {/* Reset Warning */}
          {yearResetStatus?.isReset && (
            <div className="alert alert-warning py-2 mb-3">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {t("leaveReset.alreadyReset", {
                date: new Date(yearResetStatus.resetAt).toLocaleDateString()
              })}
            </div>
          )}

          {/* ================= Filters ================= */}
          <div className="row g-2 align-items-end">

            {/* Search */}
            <div className="col-md-4">
              <label className="form-label small">
                {t("common.search")}
              </label>
              <input
                type="text"
                className="form-control"
                value={search}
                placeholder={t("leaveReset.searchPlaceholder")}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Branch */}
            <div className="col-md-3">
              <label className="form-label small">
                {t("common.branch")}
              </label>
              <select
  className="form-select"
  value={branchId}
  onChange={(e) =>
    setBranchId(e.target.value)
  }
>
  <option value="">
{t("common.allBranches")}  </option>

  {branches.map(branch => (
    <option
      key={branch._id}
      value={branch._id}
    >
      {branch.name}
    </option>
  ))}
</select>
            </div>

            {/* Status */}
            <div className="col-md-3">
              <label className="form-label small">
                {t("leaveReset.status")}
              </label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">{t("common.all")}</option>
                <option value="READY">{t("leaveReset.ready")}</option>
                <option value="SKIPPED">{t("leaveReset.skipped")}</option>
              </select>
            </div>

            {/* Apply */}
            <div className="col-md-2">
              <button
                className="btn btn-outline-primary w-100"
                onClick={applyFilters}
                disabled={loading}
              >
                <i className="fas fa-filter me-1"></i>
                {t("common.filter")}
              </button>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="d-flex gap-2 mt-3">
              <span className="badge bg-success">
                {t("leaveReset.ready")}: {stats.ready}
              </span>
              <span className="badge bg-warning text-dark">
                {t("leaveReset.skipped")}: {stats.skipped}
              </span>
            </div>
          )}
        </div>

        {/* ================= Table ================= */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>{t("leaveReset.employee")}</th>
                <th className="text-center">
  {t("leaveReset.policy")}
</th>
                <th className="text-center">
                  {t("leaveReset.annual")} <br />
                  <small className="text-muted">Before → After</small>
                </th>
                <th className="text-center">
                  {t("leaveReset.sick")} <br />
                  <small className="text-muted">Before → After</small>
                </th>
                <th className="text-center">
                  {t("leaveReset.status")}
                </th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <div className="spinner-border text-primary" />
                  </td>
                </tr>
              )}
{!loading && data.length === 0 && (
  <tr>
    <td
      colSpan="5"
      className="text-center py-4"
    >
      <div className="text-muted">
        {t("leaveReset.noResults")}
      </div>

    
    </td>
  </tr>
)}
              {!loading &&
                data.map(row => (
                  // <tr key={row.userId}>
                    <tr key={`${row.userId}-${row.status}`}>
                    <td>
                      <div className="fw-semibold">{row.name}</div>
                      <div className="text-muted small">{row.email}</div>
                    </td>
<td className="text-center">
  {/* <div className="small fw-semibold">
    {row.policy?.scope
  ? t(
      `leavePolicy.scope.${row.policy.scope}`,
      row.policy.scope
    )
  : "—"}
  </div> */}
<div className="small fw-semibold">
  {getPolicyLabel(row)}
</div>
  <div className="text-muted small">
🌍 {row.policy?.timezone || "—"}  </div>

  {row.multiBranch && (
    <div className="text-warning small">
      <span className="badge bg-info-subtle text-dark border">
  Multi-branch
</span>
    </div>
  )}
</td>
                    {/* Annual */}
                    <td className="text-center">
                      {row.annual ? (
                        <>
                          <div className="text-muted small">
                            {row.annual.before ?? "—"}
                          </div>
                          <div className="fw-bold text-primary">
                            {row.annual.after ?? "—"}
                          </div>
                        </>
                      ) : "—"}
                    </td>

                    {/* Sick */}
                    <td className="text-center">
                      {row.sick ? (
                        <>
                          <div className="text-muted small">
                           {row.sick.before ?? "—"}

                          </div>
                          <div className="fw-semibold">
                            {row.sick.after ?? "—"}
                          </div>
                        </>
                      ) : "—"}
                    </td>

                    {/* Status */}
                    {/* <td className="text-center">
                      {row.status === "SKIPPED" ? (
                        <span className="badge bg-warning text-dark">
                          {t("leaveReset.skipped")}
                        </span>
                      ) : (
                        <span className="badge bg-success">
                          {t("leaveReset.ready")}
                        </span>
                      )}
                    </td> */}

                    <td className="text-center">
  {row.status === "SKIPPED" ? (
    <>
      <span className="badge bg-warning text-dark">
        {t("leaveReset.skipped")}
      </span>

      <div className="small text-muted mt-1">
        {row.skipReason === "PAYROLL_LOCKED"
          ? t("leaveReset.payrollLocked")
          : row.skipReason || "—"}
      </div>
    </>
  ) : (
    <span className="badge bg-success">
      {t("leaveReset.ready")}
    </span>
  )}
</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* ================= Footer ================= */}
        <div className="card-footer d-flex justify-content-between align-items-center">

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="d-flex gap-2 align-items-center">
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={pagination.page === 1}
                onClick={() => onPageChange(pagination.page - 1)}
              >
                ‹
              </button>

              <span className="small">
                {pagination.page} / {pagination.pages}
              </span>

              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={pagination.page === pagination.pages}
                onClick={() => onPageChange(pagination.page + 1)}
              >
                ›
              </button>
            </div>
          )}

          {/* Run */}
          <button
            className="btn btn-danger"
            onClick={onRun}
            // disabled={loading}
            disabled={!canRun}
          >
            <i className="fas fa-play me-2"></i>
            {t("leaveReset.run")}
          </button>
        </div>

      </div>
    </div>
  );
}
