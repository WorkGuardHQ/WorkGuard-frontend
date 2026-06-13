

// import React, { useState } from "react";
// import { useTranslation } from "react-i18next";
// import useYearlyLeaveReset from "../hooks/useYearlyLeaveReset";
// import YearlyResetPreviewTable from "./YearlyResetPreviewTable";
// import Toast from "../../../ui/Toast";

// export default function YearlyLeaveResetModal({ show, onClose }) {
//   const { t } = useTranslation();
//   const nextYear = new Date().getFullYear() + 1;

//   /* =========================
//      Local State
//   ========================= */
//   const [year, setYear] = useState(nextYear);
//   const [types, setTypes] = useState(["annual", "sick"]);
//   const [hasRun, setHasRun] = useState(false);
// const [confirmForce, setConfirmForce] = useState(false);

//   /* =========================
//      API Hook
//   ========================= */
//   const {
//     loading,
//     preview,
//     pagination,
//     fetchPreview,
//     runReset
//   } = useYearlyLeaveReset();

//   /* =========================
//      Toast
//   ========================= */
//   const [toast, setToast] = useState({
//     show: false,
//     message: "",
//     type: "success"
//   });

//   if (!show) return null;

//   /* =========================
//      Handlers
//   ========================= */
//   const toggleType = (type) => {
//     setTypes(prev =>
//       prev.includes(type)
//         ? prev.filter(t => t !== type)
//         : [...prev, type]
//     );
//   };

//   const handlePreview = async () => {
//     setHasRun(false); // reset لو السنة أو النوع اتغير
//     await fetchPreview({
//       year,
//       types,
//       page: 1,
//       limit: 20
//     });
//   };

//   const handleRun = async () => {
//     try {
//       const res = await runReset({ year, types });

//       if (res?.skippedUsers?.length) {
//         setToast({
//           show: true,
//           type: "warning",
//           message: t("leaveReset.partialSuccess", {
//             count: res.skippedUsers.length
//           })
//         });
//       } else {
//         setToast({
//           show: true,
//           type: "success",
//           message: t("leaveReset.success")
//         });
//       }

//       setHasRun(true);

//       // Refresh preview after run
//       await fetchPreview({
//         year,
//         types,
//         page: 1,
//         limit: 20
//       });

//     } catch (err) {
//       setToast({
//         show: true,
//         type: "danger",
//         message:
//           err.response?.data?.message ||
//           t("common.somethingWentWrong")
//       });
//     }
//   };

//   /* =========================
//      Render
//   ========================= */
//   return (
//     <>
//       <div className="modal-backdrop show" />

//       <div className="modal show d-block">
//         <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
//           <div className="modal-content">

//             {/* Header */}
//             <div className="modal-header">
//               <h5 className="modal-title">
//                 <i className="fas fa-sync-alt me-2"></i>
//                 {t("leaveReset.title")}
//               </h5>
//               <button
//                 type="button"
//                 className="btn-close"
//                 onClick={onClose}
//               />
//             </div>

//             {/* Body */}
//             <div className="modal-body">

//               {/* Controls */}
//               <div className="row g-3 mb-4">
//                 <div className="col-md-4">
//                   <label className="form-label">
//                     {t("leaveReset.year")}
//                   </label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     value={year}
//                     onChange={(e) =>
//                       setYear(Number(e.target.value))
//                     }
//                   />
//                 </div>

//                 <div className="col-md-8 d-flex align-items-end gap-4">
//                   <div className="form-check">
//                     <input
//                       type="checkbox"
//                       checked={types.includes("annual")}
//                       onChange={() => toggleType("annual")}
//                     />
//                     <label className="ms-1">
//                       {t("leaveReset.annual")}
//                     </label>
//                   </div>

//                   <div className="form-check">
//                     <input
//                       type="checkbox"
//                       checked={types.includes("sick")}
//                       onChange={() => toggleType("sick")}
//                     />
//                     <label className="ms-1">
//                       {t("leaveReset.sick")}
//                     </label>
//                   </div>

//                   <button
//                     className="btn btn-primary"
//                     disabled={!types.length || loading}
//                     onClick={handlePreview}
//                   >
//                     <i className="fas fa-eye me-2"></i>
//                     {t("leaveReset.preview")}
//                   </button>
//                 </div>
//               </div>

//               {/* Info Box */}
//               <div className="alert alert-info mb-4">
//                 <i className="fas fa-info-circle me-2"></i>
//                 <strong>
//                   {t("leaveReset.howItWorks.title")}
//                 </strong>
//                 <ul className="mb-0 mt-2">
//                   <li>{t("leaveReset.howItWorks.point1")}</li>
//                   <li>{t("leaveReset.howItWorks.point2")}</li>
//                   <li>{t("leaveReset.howItWorks.point3")}</li>
//                 </ul>
//               </div>

//               {/* Preview Table */}
//               <YearlyResetPreviewTable
//                 data={preview}
//                 pagination={pagination}
//                 loading={loading}
//                 onRun={handleRun}
//                 disableRun={hasRun}
//               />

//             </div>
//           </div>
//         </div>
//       </div>

//       <Toast
//         {...toast}
//         onClose={() =>
//           setToast(prev => ({ ...prev, show: false }))
//         }
//       />
//     </>
//   );
// }


import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  getBranchLookup
} from '../../../../services/branch.api';
import useYearlyLeaveReset from "../hooks/useYearlyLeaveReset";
import YearlyResetPreviewTable from "./YearlyResetPreviewTable";
import LastResetInfo from "./LastResetInfo";
import Toast from "../../../ui/Toast";

export default function YearlyLeaveResetModal({ show, onClose }) {
  const { t } = useTranslation();
  // const nextYear = new Date().getFullYear() + 1;

  /* =========================
     Local State
  ========================= */
  //const [year, setYear] = useState(nextYear);
  const [year, setYear] = useState(null);
  const [types, setTypes] = useState(["annual", "sick"]);
  const [hasRun, setHasRun] = useState(false);
const [branches, setBranches] =
  useState([]);
  /* Filters for table */
 
const [filters, setFilters] = useState({
  search: "",
  status: "",
  branchId: ""
});
  /* =========================
     API Hook
  ========================= */
  const {
    loading,
    preview,
    pagination,
    stats,
    yearResetStatus,
    
    fetchPreview,
    runReset
  } = useYearlyLeaveReset();



useEffect(() => {
  if (!show) {
    setFilters({
      search: "",
      status: "",
      branchId: ""
    });
  }
}, [show]);

 useEffect(() => {
  if (
    yearResetStatus?.tenantCurrentYear &&
    year === null
  ) {
    setYear(
      yearResetStatus.tenantCurrentYear + 1
    );
  }
}, [yearResetStatus, year]);
  /* =========================
     Toast
  ========================= */
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });


  /* =========================
     Helpers
  ========================= */
  const loadPreview = async ({
    page = 1,
    newFilters = filters
  } = {}) => {
    await fetchPreview({
      year,
      types,
      page,
      limit: 20,
      search: newFilters.search,
      status: newFilters.status,
      branchId: newFilters.branchId
    });
  };

  /* =========================
     Handlers
  ========================= */
  const toggleType = (type) => {
    setTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handlePreview = async () => {
    setHasRun(false);
    await loadPreview({ page: 1 });
  };



  //
const loadBranches = async () => {
  try {

    const res =
      await getBranchLookup();

    setBranches(
      res.data?.data || []
    );

  } catch (err) {
    console.error(err);
  }
};
useEffect(() => {
  loadBranches();
}, []);

//   const handleRun = async () => {
//     try {
//       const res = await runReset({ year, types });

//       setToast({
//         show: true,
//         type: res?.summary?.skippedUsers > 0 ? "warning" : "success",
//         message:
//           res?.summary?.skippedUsers > 0
//             ? t("leaveReset.partialSuccess", {
//                 count: res.summary.skippedUsers
//               })
//             : t("leaveReset.success")
//       });

//       setHasRun(true);
//       await loadPreview({ page: pagination?.page || 1 });

//     } catch (err) {
//       setToast({
//         show: true,
//         type: "danger",
//         message:
//           err.response?.data?.message ||
//           t("common.somethingWentWrong")
//       });
//     }
//   };

const handleRun = async () => {

try {

await runReset({
  year,
  types
});

setToast({
  show: true,
  type: "success",
  message: t("leaveReset.success")
});

setHasRun(true);

await loadPreview({
  page: pagination?.page || 1
});

} catch (err) {

const code =
  err.response?.data?.code;

if (code === "YEAR_ALREADY_RESET") {

  const confirm =
    window.confirm(
      t("leaveReset.confirmForce")
    );

  if (confirm) {

    try {

      await runReset({
        year,
        types,
        force: true
      });

      setToast({
        show: true,
        type: "warning",
        message: t("leaveReset.forceSuccess")
      });

      setHasRun(true);

      await loadPreview({
        page: pagination?.page || 1
      });

    } catch (forceErr) {

      setToast({
        show: true,
        type: "danger",
        message:
          forceErr.response?.data?.message ||
          t("common.somethingWentWrong")
      });
    }
  }

  return;
}

setToast({
  show: true,
  type: "danger",
  message:
    err.response?.data?.message ||
    t("common.somethingWentWrong")
});

}
};



  const handleFilterChange = async (newFilters) => {
    const merged = { ...filters, ...newFilters };
    setFilters(merged);
    
    await loadPreview({ page: 1, newFilters: merged });
  };

  const handlePageChange = async (page) => {
    await loadPreview({ page });
  };
  if (!show) return null;

  /* =========================
     Render
  ========================= */
  return (
    <>
      <div className="modal-backdrop show" />

      <div className="modal show d-block">
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">

            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="fas fa-sync-alt me-2"></i>
                {t("leaveReset.title")}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              />
            </div>

            {/* Body */}
            <div className="modal-body">

              {/* Year & Types */}
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label className="form-label">
                    {t("leaveReset.year")}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={year || ""}
                    onChange={(e) =>
                      setYear(Number(e.target.value))
                    }
                  />
                </div>

                <div className="col-md-8 d-flex align-items-end gap-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      checked={types.includes("annual")}
                      onChange={() => toggleType("annual")}
                    />
                    <label className="ms-1">
                      {t("leaveReset.annual")}
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      type="checkbox"
                      checked={types.includes("sick")}
                      onChange={() => toggleType("sick")}
                    />
                    <label className="ms-1">
                      {t("leaveReset.sick")}
                    </label>
                  </div>

                  <button
                    className="btn btn-primary"
                   disabled={
  !types.length ||
  loading ||
  !year
}
                    onClick={handlePreview}
                  >
                    <i className="fas fa-eye me-2"></i>
                    {t("leaveReset.preview")}
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="alert alert-info mb-4">
                <i className="fas fa-info-circle me-2"></i>
                <strong>{t("leaveReset.howItWorks.title")}</strong>
                <ul className="mb-0 mt-2">
                  <li>{t("leaveReset.howItWorks.point1")}</li>
                  <li>{t("leaveReset.howItWorks.point2")}</li>
                  <li>{t("leaveReset.howItWorks.point3")}</li>
                  <li>
  {t("leaveReset.howItWorks.multiBranch")}
</li>
                  
                </ul>
              </div>

 {/* Last Reset Info */}
<LastResetInfo
  yearResetStatus={yearResetStatus}
/>
              {/* Preview Table */}
              <YearlyResetPreviewTable
              canRun={
  !!preview?.length &&
  !!year &&
  !loading
}
 branches={branches}
                data={preview}
                loading={loading}
                pagination={pagination}
                stats={stats}
                yearResetStatus=
                {yearResetStatus}
                onRun={handleRun}
                onPageChange={handlePageChange}
                onFilterChange={handleFilterChange}
              />

            </div>
          </div>
        </div>
      </div>

      <Toast
        {...toast}
        onClose={() =>
          setToast(prev => ({ ...prev, show: false }))
        }
      />
    </>
  );
}
