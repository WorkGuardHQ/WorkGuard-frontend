// import { useState } from "react";
// import {
//   previewYearlyLeaveResetUnified,
//   runYearlyLeaveResetUnified
// } from "../../services/leave.api";

// export default function useYearlyLeaveReset() {
//   const [loading, setLoading] = useState(false);
//   const [preview, setPreview] = useState([]);
//   const [pagination, setPagination] = useState(null);


// const fetchPreview = async (params) => {
//   setLoading(true);
//   try {
//     const res = await previewYearlyLeaveResetUnified(params);

//  setPreview(res.data.data || []);

//     setPagination(res.data.pagination || null);

//     return res.data;
//   } finally {
//     setLoading(false);
//   }
// };

//   const runReset = async ({ year, types }) => {
//     setLoading(true);
//     try {
//       const res = await runYearlyLeaveResetUnified({ year, types });
//       return res.data;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     loading,
//     preview,
//     pagination,
//     fetchPreview,
//     runReset
//   };
// }


//src/components/leave/yearly-reset/hooks/useYearlyLeaveReset.js
import { useState } from "react";
import {
  previewYearlyLeaveResetUnified,
  runYearlyLeaveResetUnified
} from "../../../../services/Leave-services/leave.api";

export default function useYearlyLeaveReset() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [stats, setStats] = useState(null);
  const [yearResetStatus, setYearResetStatus] = useState(null);

 const fetchPreview = async (params) => {
  setLoading(true);
  try {
    const res = await previewYearlyLeaveResetUnified({
      year: params.year,
      types: params.types,
      page: params.page,
      limit: params.limit,
      search: params.search || "",
      status: params.status || "",
      branchId: params.branchId || ""
    });

    setPreview(res.data.data || []);
    setPagination(res.data.pagination || null);
    setStats(res.data.stats || null);
    setYearResetStatus(res.data.yearResetStatus || null);

    return res.data;
  } finally {
    setLoading(false);
  }
};


const runReset = async ({ year, types, force = false }) => {
  setLoading(true);
  try {
    const res = await runYearlyLeaveResetUnified({
      year,
      types,
      force
    });
    return res.data;
  } finally {
    setLoading(false);
  }
};


  return {
    loading,
    preview,
    pagination,
    stats,
    yearResetStatus,
    fetchPreview,
    runReset
  };
}
