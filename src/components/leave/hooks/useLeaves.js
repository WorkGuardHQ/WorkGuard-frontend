// // الهـوك مسؤول عن:
// // fetch leaves
// // loading / error
// // pagination (page / pages / total)
// // filters (status / userId)
// // refresh بعد أي action
// // ❌ مش مسؤول عن:
// // approve / reject UI
// // forms
// // cards

// import { useCallback, useEffect, useState } from 'react';
// import {
//   getMyLeaves,
//   getAllLeaves
// } from '../../../services/Leave-services/leave.api';

// /**
//  * ================================
//  * useLeaves Hook
//  * ================================
//  * @param {Object} options
//  * @param {'employee'|'admin'} options.mode
//  * @param {number} options.initialPage
//  * @param {number} options.limit
//  * @param {string} options.status
//  * @param {string} options.userId (admin only)
//  */
// export default function useLeaves({
//   mode = 'employee',
//   initialPage = 1,
//   limit = 10,
//   status,
//   userId
// } = {}) {
//   /* ======================
//      State
//   ====================== */
//   const [leaves, setLeaves] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [page, setPage] = useState(initialPage);
//   const [pages, setPages] = useState(1);
//   const [total, setTotal] = useState(0);

//   /* ======================
//      Fetch function
//   ====================== */
//   const fetchLeaves = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const apiCall =
//         mode === 'admin'
//           ? getAllLeaves
//           : getMyLeaves;

//       const res = await apiCall({
//         page,
//         limit,
//         status,
//         userId
//       });

//       setLeaves(res.data.leaves || []);
//       setPages(res.data.pagination?.pages || 1);
//       setTotal(res.data.pagination?.total || 0);
//     } catch (err) {
//       console.error('useLeaves error:', err);
//       setError(
//         err?.response?.data?.message ||
//         'Failed to load leaves'
//       );
//       setLeaves([]);
//       setPages(1);
//       setTotal(0);
//     } finally {
//       setLoading(false);
//     }
//   }, [mode, page, limit, status, userId]);

//   /* ======================
//      Effects
//   ====================== */
//   useEffect(() => {
//     fetchLeaves();
//   }, [fetchLeaves]);

//   // reset page on filters change
//  useEffect(() => {
//   setLeaves([]);
//   setTotal(0);
//   setPages(1);
//   setPage(1);
// }, [status, userId, mode]);


//   /* ======================
//      Public API
//   ====================== */
//   return {
//     // data
//     leaves,

//     // states
//     loading,
//     error,

//     // pagination
//     page,
//     pages,
//     total,

//     // actions
//     setPage,
//     refresh: fetchLeaves
//   };
// }
















//--------------------------------------------------------------------------------------------



/**
 * =========================================================
 * useLeaves
 * =========================================================
 *
 * 🔹 Purpose:
 * This hook is responsible for fetching and managing
 * leave requests data.
 *
 * It handles:
 * - Fetching leave requests (employee / admin)
 * -pagination (backend-driven: page / pages / total)
 * - Filters (status, userId)
 * - Loading & error states
 * - Manual refresh
 *
 * ---------------------------------------------------------
 * 🔹 What this hook DOES:
 * ✔ Fetch leaves data from API
 * ✔ Manage loading & error states
 * ✔ Handle pagination logic
 * ✔ Reset state when filters change
 *
 * ---------------------------------------------------------
 * 🔹 What this hook DOES NOT do:
 * ❌ UI logic (buttons, cards, forms)
 * ❌ Approve / Reject actions
 * ❌ Rendering
 *
 * ---------------------------------------------------------
 * 🔹 When to use:
 * Use this hook when you need:
 * - Leave requests list
 * - Pagination support
 * - Filtering (status / userId)
 *
 * Example:
 * const { leaves, page, setPage } = useLeaves({ mode: 'admin' });
 *
 * =========================================================
 */

import { useCallback, useEffect, useState } from 'react';
import {
  getMyLeaves,
  getAllLeaves
} from '../../../services/Leave-services/leave.api';

export default function useLeaves({
  mode = 'employee',
  initialPage = 1,
  limit = 10,
  status,
  userId,
   year 
} = {}) {

  /**
   * =========================================================
   * State Management
   * =========================================================
   */
  const [leaves, setLeaves] = useState([]);   // Stores leave requests
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null);   // Error message

  const [page, setPage] = useState(initialPage); // Current page
  const [pages, setPages] = useState(1);         // Total pages
  const [total, setTotal] = useState(0);         // Total records


  /**
   * =========================================================
   * Fetch Function
   * =========================================================
   * Responsible for calling the correct API based on mode:
   * - admin → getAllLeaves
   * - employee → getMyLeaves
   */
  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      /**
       * Select API based on mode
       */
      const apiCall =
        mode === 'admin'
          ? getAllLeaves
          : getMyLeaves;

      /**
       * Call API with filters + pagination
       */
      const res = await apiCall({
        page,
        limit,
        status,
        userId,
         year 
      });

      /**
       * Update state with response data
       */
      setLeaves(res.data.leaves || []);
      setPages(res.data.pagination?.pages || 1);
      setTotal(res.data.pagination?.total || 0);

    } catch (err) {

      console.error('useLeaves error:', err);

      /**
       * Handle error safely
       */
      setError(
        err?.response?.data?.message ||
        'Failed to load leaves'
      );

      /**
       * Reset data on error
       */
      setLeaves([]);
      setPages(1);
      setTotal(0);

    } finally {
      setLoading(false);
    }
  },  [mode, page, limit, status, userId, year]); 


  /**
   * =========================================================
   * Effect: Fetch Data
   * =========================================================
   * Runs whenever fetchLeaves changes
   */
  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);


  /**
   * =========================================================
   * Effect: Reset on Filters Change
   * =========================================================
   * When filters change (status / userId / mode):
   * - Reset pagination
   * - Clear old data
   */
  useEffect(() => {
    setLeaves([]);
    setTotal(0);
    setPages(1);
    setPage(1);
  }, [status, userId, mode, year]);


  /**
   * =========================================================
   * Return Contract (Public API)
   * =========================================================
   */
  // console.log('useLeaves params:', { mode, userId, year, page });

  return {
    // Data
    leaves,

    // States
    loading,
    error,

    // Pagination
    page,
    pages,
    total,

    // Actions
    setPage,        // Change page
    refresh: fetchLeaves // Manually refetch data
  };
}