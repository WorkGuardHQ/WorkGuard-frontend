// import { useEffect, useState } from 'react';
// import {
//   getUserLeaveSummary,
//   getUserLeaveYear
// } from '../../../services/Leave-services/leave.api';

// export default function useLeaveMeta({ userId, year }) {
//   const [summary, setSummary] = useState(null);
//   const [leaveYear, setLeaveYear] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!userId || !year) {
//       setSummary(null);
//       setLeaveYear(null);
//       return;
//     }

//     let mounted = true;

//     const load = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const [sRes, yRes] = await Promise.all([
//           getUserLeaveSummary({ userId, year }),
//           getUserLeaveYear({ userId, year })
//         ]);

//         if (!mounted) return;

//         setSummary(sRes.data || null);
//         setLeaveYear(yRes.data?.exists ? yRes.data : null);

//       } catch (err) {
//         if (!mounted) return;
//         setError(
//           err?.response?.data?.message ||
//           'Failed to load leave data'
//         );
//         setSummary(null);
//         setLeaveYear(null);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     load();
//     return () => { mounted = false; };

//   }, [userId, year]);

//   return { summary, leaveYear, loading, error };
// }
















//----------------------------------------------------------------

/**
 * =========================================================
 * useLeaveMeta
 * =========================================================
 *
 * 🔹 Purpose:
 * This hook is responsible for fetching and managing
 * leave-related metadata for a user.
 *
 * It retrieves:
 * - Leave Summary (annual / sick balances)
 * - Leave Year information
 *
 * ---------------------------------------------------------
 * 🔹 Why this hook exists:
 * To encapsulate all logic related to leave summary
 * and leave year into a reusable and isolated hook.
 *
 * This avoids duplicating:
 * - API calls
 * - loading/error handling
 * - state management
 *
 * ---------------------------------------------------------
 * 🔹 When to use:
 * Use this hook when you need:
 * - User leave balances
 * - Leave year existence/details
 *
 * Example:
 * const { summary, leaveYear } = useLeaveMeta({ userId, year });
 * =========================================================
 */
import { useEffect, useState, useCallback } from 'react';
import {
  getUserLeaveSummary,
  getUserLeaveYear
} from '../../../services/Leave-services/leave.api';

import { getYearlyAbsence } from '../../../services/attendance.api';

export default function useLeaveMeta({ userId, year }) {

  const [summary, setSummary]                     = useState(null);
  const [leaveYear, setLeaveYear]                 = useState(null);
  const [adjustmentHistory, setAdjustmentHistory] = useState([]);
  const [historyPage, setHistoryPage]             = useState(1);
  const [historyPages, setHistoryPages]           = useState(1);
  const [historyTotal, setHistoryTotal]           = useState(0);
  const [loading, setLoading]                     = useState(false);
  const [error, setError]                         = useState(null);

  const load = useCallback(async (page = 1) => {
    if (!userId || !year) {
      setSummary(null);
      setLeaveYear(null);
      setAdjustmentHistory([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [sRes, yRes, absRes] = await Promise.all([
        getUserLeaveSummary({ userId, year }),
        getUserLeaveYear({ userId, year, historyPage: page }),
        getYearlyAbsence({ userId, year })
      ]);

      // ✅ ابدأ بالـ summary الأساسي
      const summaryData = sRes.data || null;

      // ✅ ادمج absence من DailyAttendanceSummary
      const absData = absRes?.data?.summary;
      if (summaryData && absData) {
        summaryData.unpaid = {
          absentDays:      absData.absentWithoutPermissionDays || 0,
          unpaidLeaveDays: absData.unpaidLeaveDays             || 0,
        };
      }

      setSummary(summaryData);
      setLeaveYear(yRes.data?.exists ? yRes.data : null);

      // ✅ adjustmentHistory pagination
      const h = yRes.data?.adjustmentHistory;
      setAdjustmentHistory(h?.data  || []);
      // setHistoryPage(h?.page        || 1);
      setHistoryPages(h?.pages      || 1);
      setHistoryTotal(h?.total      || 0);

    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load leave data');
      setSummary(null);
      setLeaveYear(null);
      setAdjustmentHistory([]);
    } finally {
      setLoading(false);
    }
  }, [userId, year]);

  useEffect(() => {
    load(1);
  }, [load]);

  const handleHistoryPageChange = useCallback((p) => {
    setHistoryPage(p);
    load(p);
  }, [load]);

  return {
    summary,
    leaveYear,
    adjustmentHistory,
    historyPage,
    historyPages,
    historyTotal,
    loading,
    error,
    refresh:        () => load(historyPage),
    setHistoryPage: handleHistoryPageChange,
  };
}










//1--------------------------------------------------------------------------------------------------









// import { useEffect, useState } from 'react';
// import {
//   getUserLeaveSummary,
//   getUserLeaveYear
// } from '../../../services/Leave-services/leave.api';

// export default function useLeaveMeta({ userId, year }) {

//   /**
//    * =========================================================
//    * State Management
//    * =========================================================
//    */
//   const [summary, setSummary] = useState(null); // Stores leave balances
//   const [leaveYear, setLeaveYear] = useState(null); // Stores leave year info
//   const [loading, setLoading] = useState(false); // Indicates API loading state
//   const [error, setError] = useState(null); // Stores error message


//   /**
//    * =========================================================
//    * Data Fetching Effect
//    * =========================================================
//    * Triggered when:
//    * - userId changes
//    * - year changes
//    */
//   useEffect(() => {

//     /**
//      * Guard Clause:
//      * If required params are missing, reset state and exit.
//      */
//     if (!userId || !year) {
//       setSummary(null);
//       setLeaveYear(null);
//       return;
//     }

//     /**
//      * mounted flag:
//      * Prevents state updates after component unmount
//      * (avoids memory leaks / React warnings)
//      */
//     let mounted = true;

//     /**
//      * Async loader function
//      */
//     const load = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         /**
//          * Fetch both APIs in parallel:
//          * - Leave Summary
//          * - Leave Year
//          */
//         const [sRes, yRes] = await Promise.all([
//           getUserLeaveSummary({ userId, year }),
//           getUserLeaveYear({ userId, year })
//         ]);

//         /**
//          * Stop if component is unmounted
//          */
//         if (!mounted) return;

//         /**
//          * Update state with API results
//          */
//         setSummary(sRes.data || null);

//         /**
//          * Only set leaveYear if it exists
//          */
//         setLeaveYear(yRes.data?.exists ? yRes.data : null);

//       } catch (err) {

//         /**
//          * Stop if component is unmounted
//          */
//         if (!mounted) return;

//         /**
//          * Handle error safely
//          */
//         setError(
//           err?.response?.data?.message ||
//           'Failed to load leave data'
//         );

//         /**
//          * Reset data on error
//          */
//         setSummary(null);
//         setLeaveYear(null);

//       } finally {

//         /**
//          * Ensure loading stops only if still mounted
//          */
//         if (mounted) setLoading(false);
//       }
//     };

//     /**
//      * Execute data loading
//      */
//     load();

//     /**
//      * Cleanup:
//      * Prevent future state updates after unmount
//      */
//     return () => {
//       mounted = false;
//     };

//   }, [userId, year]);


//   /**
//    * =========================================================
//    * Return Contract
//    * =========================================================
//    */
//   return {
//     summary,     // Leave balances (annual, sick, etc.)
//     leaveYear,   // Leave year data (if exists)
//     loading,     // Loading state
//     error        // Error message (if any)
//   };
// }