// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiGet } from '../../helpers/api';

// import EmployeeAttendanceFilters from './EmployeeAttendanceFilters';
// import EmployeeAttendanceSummaryTable from './EmployeeAttendanceSummaryTable';
// import EmployeeAttendanceDetailsModal from './EmployeeAttendanceDetailsModal';

// const EmployeeAttendancePage = () => {
//   const { t } = useTranslation();

//   // ===== Filters (ثابتة) =====
//   const [filters, setFilters] = useState({
//     branchId: '',
//     name: '',
//     status: '',
//     from: '',
//     to: ''
//   });

//   // ===== Data =====
//   const [rows, setRows] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);
//   const [total, setTotal] = useState(0);

//   // ===== UI =====
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [selectedDay, setSelectedDay] = useState(null);

//   // ===== Fetch =====
//   const fetchAttendance = async () => {
//     try {
//       setLoading(true);
//       setError('');

//       const params = new URLSearchParams();
//       params.append('page', page);
//       params.append('limit', 10);

//       if (filters.branchId) params.append('branchId', filters.branchId);
//       if (filters.name) params.append('name', filters.name);
//       if (filters.status) params.append('status', filters.status);
//       if (filters.from) params.append('from', filters.from);
//       if (filters.to) params.append('to', filters.to);

//       const res = await apiGet(`/admin/attendance?${params.toString()}`);

//       setRows(res.data.data || []);
//       setPages(res.data.pages || 1);
//       setTotal(res.data.total || 0);
//     } catch (err) {
//       console.error(err);
//       setError(t('error'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendance();
//     // eslint-disable-next-line
//   }, [page, filters]);

//   return (
//     <div className="container-fluid">
//       <h3 className="mb-4">
//         <i className="fas fa-clipboard-check me-2" />
//         {t('employeeAttendance')}
//       </h3>

//       <EmployeeAttendanceFilters
//         filters={filters}
//         onApply={(newFilters) => {
//           setPage(1);
//           setFilters(newFilters);
//         }}
//       />

//       <EmployeeAttendanceSummaryTable
//         rows={rows}
//         loading={loading}
//         onOpenDetails={setSelectedDay}
//       />

//       {/* Pagination (backend) */}
//       <nav className="mt-3">
//         <ul className="pagination justify-content-center">
//           <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
//             <button
//               className="page-link"
//               onClick={() => setPage(p => Math.max(1, p - 1))}
//             >
//               {t('previous')}
//             </button>
//           </li>

//           <li className="page-item disabled">
//             <span className="page-link">
//               {page} / {pages}
//             </span>
//           </li>

//           <li className={`page-item ${page >= pages ? 'disabled' : ''}`}>
//             <button
//               className="page-link"
//               onClick={() => setPage(p => Math.min(pages, p + 1))}
//             >
//               {t('next')}
//             </button>
//           </li>
//         </ul>

//         <small className="text-muted d-block text-center">
//           {t('total')}: {total}
//         </small>
//       </nav>

//       {selectedDay && (
//         <EmployeeAttendanceDetailsModal
//           dayRow={selectedDay}
//           show
//           onClose={() => setSelectedDay(null)}
//           onRefresh={fetchAttendance}
//         />
//       )}

//       {error && (
//         <div className="alert alert-danger mt-3">{error}</div>
//       )}
//     </div>
//   );
// };

// export default EmployeeAttendancePage;

// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiGet } from '../../helpers/api';

// // components
// import EmployeeAttendanceFilters from './EmployeeAttendanceFilters';
// import EmployeeAttendanceSummaryTable from './EmployeeAttendanceSummaryTable';
// import EmployeeAttendanceDetailsModal from './EmployeeAttendanceDetailsModal';

// // helper (نفس منطق الادمن داش)
// import { groupAttendanceByUserAndDate } from '../../helpers/attendance/groupAttendanceByUserAndDate';

// const EmployeeAttendancePage = () => {
//   const { t } = useTranslation();

//   // ===== Filters =====
//   const [filters, setFilters] = useState({});

//   // ===== Data =====
//   const [rows, setRows] = useState([]);

//   // ===== Pagination (BACKEND) =====
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);
//   const [total, setTotal] = useState(0);

//   // ===== UI =====
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [selectedDay, setSelectedDay] = useState(null);

//   // ===== Fetch Attendance =====
//   // const fetchAttendance = async () => {
//   //   try {
//   //     setLoading(true);
//   //     setError('');

//   //     const params = new URLSearchParams({
//   //       page,
//   //       limit: 10,
//   //       ...filters
//   //     });

//   //     const res = await apiGet(`/admin/attendance?${params.toString()}`);

//   //     /**
//   //      * 👇 أهم سطر
//   //      * نفس اللي بيحصل في Admin Dashboard
//   //      */
//   //     const grouped = groupAttendanceByUserAndDate(res.data.data || []);

//   //     setRows(grouped);
//   //     setPages(res.data.pages || 1);
//   //     setTotal(res.data.total || 0);
//   //   } catch (err) {
//   //     console.error(err);
//   //     setError(t('error'));
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
// const fetchAttendance = async () => {
//   try {
//     setLoading(true);
//     setError('');

//     const params = new URLSearchParams();
//     params.append('page', page);
//     params.append('limit', 10);

//     if (filters.branchId) params.append('branchId', filters.branchId);
//     if (filters.name) params.append('name', filters.name);
//     if (filters.status) params.append('status', filters.status);

//     // 👈 نفس منطق AdminDashboard
//     if (filters.date) {
//       params.append('from', filters.date);
//       params.append('to', filters.date);
//     }

//     if (filters.invalidated) params.append('invalidated', 'true');
//     if (filters.remoteOnly) params.append('remoteOnly', 'true');
//     if (filters.outOfLocation) params.append('outOfLocation', 'true');

//     const res = await apiGet(`/admin/attendance?${params.toString()}`);

//     const grouped = groupAttendanceByUserAndDate(res.data.data || []);

//     setRows(grouped);
//     setPages(res.data.pages || 1);
//     setTotal(res.data.total || 0);
//   } catch (err) {
//     console.error(err);
//     setError(t('error'));
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     fetchAttendance();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filters, page]);

//   return (
//     <div className="container-fluid">
//       {/* ===== Header ===== */}
//       <h3 className="mb-4">
//         <i className="fas fa-clipboard-check me-2" />
//         {t('employeeAttendance')}
//       </h3>

//       {/* ===== Filters ===== */}
//       <EmployeeAttendanceFilters
//         onChange={(newFilters) => {
//           setPage(1);
//           setFilters(newFilters);
//         }}
//       />

//       {/* ===== Table ===== */}
//       <EmployeeAttendanceSummaryTable
//         rows={rows}
//         loading={loading}
//         onOpenDetails={setSelectedDay}
//       />

//       {/* ===== Pagination ===== */}
//       <nav className="mt-3">
//         <ul className="pagination justify-content-center">
//           <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
//             <button
//               className="page-link"
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//             >
//               {t('previous')}
//             </button>
//           </li>

//           <li className="page-item disabled">
//             <span className="page-link">
//               {page} / {pages}
//             </span>
//           </li>

//           <li className={`page-item ${page >= pages ? 'disabled' : ''}`}>
//             <button
//               className="page-link"
//               onClick={() => setPage((p) => Math.min(pages, p + 1))}
//             >
//               {t('next')}
//             </button>
//           </li>
//         </ul>

//         <small className="text-muted d-block text-center">
//           {t('total')}: {total}
//         </small>
//       </nav>

//       {/* ===== Details Modal ===== */}
//       {selectedDay && (
//         <EmployeeAttendanceDetailsModal
//           dayRow={selectedDay}
//           show={true}
//           onClose={() => setSelectedDay(null)}
//           onRefresh={fetchAttendance}
//         />
//       )}

//       {/* ===== Error ===== */}
//       {error && (
//         <div className="alert alert-danger mt-3">{error}</div>
//       )}
//     </div>
//   );
// };

// export default EmployeeAttendancePage;




//row data
// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiGet } from '../../helpers/api';

// import EmployeeAttendanceFilters from './EmployeeAttendanceFilters';
// import EmployeeAttendanceSummaryTable from './EmployeeAttendanceSummaryTable';
// import EmployeeAttendanceDetailsModal from './EmployeeAttendanceDetailsModal';

// import { groupAttendanceByUserAndDate } from '../../helpers/attendance/groupAttendanceByUserAndDate';

// const EmployeeAttendancePage = () => {
//   const { t } = useTranslation();

//   // ===== Filters =====
//   const [branches, setBranches] = useState([]);
//   const [selectedBranch, setSelectedBranch] = useState('');
//   const [selectedDate, setSelectedDate] = useState('');
//   const [filterName, setFilterName] = useState('');
//   const [status, setStatus] = useState('');

//   const [invalidOnly, setInvalidOnly] = useState(false);
//   const [remoteOnly, setRemoteOnly] = useState(false);
//   const [outOfLocationOnly, setOutOfLocationOnly] = useState(false);

//   // ===== Data =====
//   const [rows, setRows] = useState([]);

//   // ===== Pagination =====
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);
//   const [total, setTotal] = useState(0);

//   // ===== UI =====
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // ⭐ المهم
//   const [selectedAttendance, setSelectedAttendance] = useState(null);
//   // { row, record }

//   // ===== branches =====
//   useEffect(() => {
//     apiGet('/branches')
//       .then((res) => setBranches(res.data || []))
//       .catch(() => {});
//   }, []);

//   // ===== fetch attendance (نفس الأدمن) =====
//   const fetchAttendance = async () => {
//     try {
//       setLoading(true);
//       setError('');

//       const params = new URLSearchParams();
//       params.append('page', page);
//       params.append('limit', 10);

//       if (selectedBranch) params.append('branchId', selectedBranch);
//       if (filterName) params.append('name', filterName);
//       if (status) params.append('status', status);

//       if (selectedDate) {
//         params.append('from', selectedDate);
//         params.append('to', selectedDate);
//       }

//       if (invalidOnly) params.append('invalidated', 'true');
//       if (remoteOnly) params.append('remoteOnly', 'true');
//       if (outOfLocationOnly) params.append('outOfLocation', 'true');

//       const res = await apiGet(`/admin/attendance?${params.toString()}`);

//       const grouped = groupAttendanceByUserAndDate(res.data.data || []);

//       setRows(grouped);
//       setPages(res.data.pages || 1);
//       setTotal(res.data.total || 0);
//     } catch (err) {
//       console.error(err);
//       setError(t('error'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendance();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     page,
//     selectedBranch,
//     selectedDate,
//     filterName,
//     status,
//     invalidOnly,
//     remoteOnly,
//     outOfLocationOnly
//   ]);

//   return (
//     <div className="container-fluid">
//       <h3 className="mb-4">
//         <i className="fas fa-clipboard-check me-2" />
//         {t('employeeAttendance')}
//       </h3>

//       <EmployeeAttendanceFilters
//         branches={branches}
//         selectedBranch={selectedBranch}
//         selectedDate={selectedDate}
//         name={filterName}
//         status={status}
//         invalidOnly={invalidOnly}
//         remoteOnly={remoteOnly}
//         outOfLocationOnly={outOfLocationOnly}
//         total={total}
//         onBranchChange={(v) => {
//           setPage(1);
//           setSelectedBranch(v);
//         }}
//         onDateChange={(v) => {
//           setPage(1);
//           setSelectedDate(v);
//         }}
//         onNameChange={(v) => {
//           setPage(1);
//           setFilterName(v);
//         }}
//         onStatusChange={(v) => {
//           setPage(1);
//           setStatus(v);
//         }}
//         onInvalidChange={(v) => {
//           setPage(1);
//           setInvalidOnly(v);
//         }}
//         onRemoteChange={(v) => {
//           setPage(1);
//           setRemoteOnly(v);
//         }}
//         onOutOfLocationChange={(v) => {
//           setPage(1);
//           setOutOfLocationOnly(v);
//         }}
//       />

//       <EmployeeAttendanceSummaryTable
//         rows={rows}
//         loading={loading}
//         onEdit={(row, record) =>
//           setSelectedAttendance({ row, record })
//         }
//       />

//       {/* pagination */}
//       <nav className="mt-3">
//         <ul className="pagination justify-content-center">
//           <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
//             <button
//               className="page-link"
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//             >
//               {t('previous')}
//             </button>
//           </li>

//           <li className="page-item disabled">
//             <span className="page-link">
//               {page} / {pages}
//             </span>
//           </li>

//           <li className={`page-item ${page >= pages ? 'disabled' : ''}`}>
//             <button
//               className="page-link"
//               onClick={() => setPage((p) => Math.min(pages, p + 1))}
//             >
//               {t('next')}
//             </button>
//           </li>
//         </ul>

//         <small className="text-muted d-block text-center">
//           {t('total')}: {total}
//         </small>
//       </nav>

//       {/* ✅ Details Modal */}
//       {selectedAttendance && (
//         <EmployeeAttendanceDetailsModal
//           show
//           row={selectedAttendance.row}
//           record={selectedAttendance.record}
//           onClose={() => setSelectedAttendance(null)}
//           onSaved={fetchAttendance}
//         />
//       )}

//       {error && <div className="alert alert-danger mt-3">{error}</div>}
//     </div>
//   );
// };

// export default EmployeeAttendancePage;








//1
// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiGet } from '../../helpers/api';

// import EmployeeAttendanceFilters from './EmployeeAttendanceFilters';
// import EmployeeAttendanceSummaryTable from './EmployeeAttendanceSummaryTable';
// import EmployeeAttendanceDetailsModal from './EmployeeAttendanceDetailsModal';

// const EmployeeAttendancePage = () => {
//   const { t } = useTranslation();

//   // ===== Filters =====
//   const [branches, setBranches] = useState([]);
//   const [filters, setFilters] = useState({
//     branchId: '',
//     date: '',
//     name: '',
//     status: ''
//   });

//   // ===== Data =====
//   const [rows, setRows] = useState([]);

//   // ===== Pagination =====
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);
//   const [total, setTotal] = useState(0);

//   // ===== UI =====
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // ===== Details =====
//   const [selectedDay, setSelectedDay] = useState(null);
//   const [dayDetails, setDayDetails] = useState(null);
//   const [detailsLoading, setDetailsLoading] = useState(false);

//   // ===== branches =====
//   useEffect(() => {
//     apiGet('/branches')
//       .then(res => setBranches(res.data || []))
//       .catch(() => {});
//   }, []);

//   // ===== fetch SUMMARY (DailyAttendanceSummary) =====
//   const fetchSummary = async () => {
//     try {
//       setLoading(true);
//       setError('');

//       const params = new URLSearchParams({
//         page,
//         limit: 10
//       });

//       if (filters.branchId) params.append('branchId', filters.branchId);
//       if (filters.name) params.append('name', filters.name);
//       if (filters.status) params.append('status', filters.status);
//       if (filters.date) {
//         params.append('from', filters.date);
//         params.append('to', filters.date);
//       }

//       const res = await apiGet(`/admin/attendance-summary?${params.toString()}`);

//       setRows(res.data.data || []);
//       setPages(res.data.pages || 1);
//       setTotal(res.data.total || 0);
//     } catch (err) {
//       console.error(err);
//       setError(t('error'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSummary();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page, filters]);

//   // ===== open details (RAW Attendance) =====
//   const openDetails = async (row) => {
//     try {
//       setDetailsLoading(true);
//       setSelectedDay(row);

//       const res = await apiGet(
//         `/admin/attendance/day-details?userId=${row.user._id}&date=${row.date.slice(0,10)}`
//       );

//       setDayDetails(res.data);
//     } catch (err) {
//       console.error(err);
//       alert(t('error'));
//     } finally {
//       setDetailsLoading(false);
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <h3 className="mb-4">
//         <i className="fas fa-clipboard-check me-2" />
//         {t('employeeAttendance')}
//       </h3>

//       <EmployeeAttendanceFilters
//         branches={branches}
//         filters={filters}
//         onChange={(newFilters) => {
//           setPage(1);
//           setFilters(newFilters);
//         }}
//         total={total}
//       />

//       <EmployeeAttendanceSummaryTable
//         rows={rows}
//         loading={loading}
//         onOpenDetails={openDetails}
//       />

//       {/* Pagination */}
//       <nav className="mt-3">
//         <ul className="pagination justify-content-center">
//           <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
//             <button
//               className="page-link"
//               onClick={() => setPage(p => Math.max(1, p - 1))}
//             >
//               {t('previous')}
//             </button>
//           </li>

//           <li className="page-item disabled">
//             <span className="page-link">
//               {page} / {pages}
//             </span>
//           </li>

//           <li className={`page-item ${page >= pages ? 'disabled' : ''}`}>
//             <button
//               className="page-link"
//               onClick={() => setPage(p => Math.min(pages, p + 1))}
//             >
//               {t('next')}
//             </button>
//           </li>
//         </ul>
//       </nav>

//       {/* Details Modal */}
//       {selectedDay && (
//         <EmployeeAttendanceDetailsModal
//           show
//           loading={detailsLoading}
//           summaryRow={selectedDay}
//           data={dayDetails}
//           onClose={() => {
//             setSelectedDay(null);
//             setDayDetails(null);
//           }}
//           onSaved={fetchSummary}
//         />
//       )}

//       {error && <div className="alert alert-danger mt-3">{error}</div>}
//     </div>
//   );
// };

// export default EmployeeAttendancePage;

// src/pages/admin/EmployeeAttendancePage.jsx
// 



























import { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toDateInputValue } from '../../helpers/dateHelpers';

import {
  getAttendanceSummary,
  getAttendanceDayDetails,
} from '../../services/admin.api';

import EmployeeAttendanceFilters      from './EmployeeAttendanceFilters';
import EmployeeAttendanceSummaryTable from './EmployeeAttendanceSummaryTable';
import EmployeeAttendanceDetailsModal from './EmployeeAttendanceDetailsModal';
import '../../style/Employeeattendance.css';

import AttendanceRepair from './attendance-repair/AttendanceRepairPage';


const PAGE_LIMIT = 10;

const EmployeeAttendancePage = () => {
  const { t, i18n } = useTranslation('attendance');
  const navigate     = useNavigate();
  const isRTL        = i18n.language === 'ar';

  const [filters, setFilters] = useState({
    branchId: '', from: '', to: '', name: '', decisionType: '', invalidated: '',
  });

  const [rows,    setRows]    = useState([]);
  const [page,    setPage]    = useState(1);
  const [pages,   setPages]   = useState(1);
  // const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const [selectedDay,    setSelectedDay]    = useState(null);
  const [dayDetails,     setDayDetails]     = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const nameTimer = useRef(null);

  // ─────────────────────────────────────────
  // Fetch Summary
  // ─────────────────────────────────────────
  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = { page, limit: PAGE_LIMIT };

      if (filters.branchId)     params.branchId     = filters.branchId;
      if (filters.from)         params.from         = filters.from;
      if (filters.to)           params.to           = filters.to;
      if (filters.name)         params.name         = filters.name;
      if (filters.decisionType) params.decisionType = filters.decisionType;
      if (filters.invalidated)  params.invalidated  = filters.invalidated;

      const res = await getAttendanceSummary(params);

      setRows(res.data?.data   || []);
      setPages(res.data?.pages || 1);
      // setTotal(res.data?.total || 0);

    } catch (err) {
      console.error('fetchSummary:', err);
      setError(t('fetchError'));
    } finally {
      setLoading(false);
    }
  }, [page, filters, t]);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  // ─────────────────────────────────────────
  // Filters
  // ─────────────────────────────────────────
  const handleFiltersChange = (newFilters) => {
    setPage(1);

    if (newFilters.name !== filters.name) {
      clearTimeout(nameTimer.current);
      nameTimer.current = setTimeout(() => setFilters(newFilters), 500);
    } else {
      setFilters(newFilters);
    }
  };

  // ─────────────────────────────────────────
  // 🔥 OPEN DETAILS (FIXED 100%)
  // ─────────────────────────────────────────
  const openDetails = async (row) => {
    if (!row?.user?._id || !row?.date) return;

    // ✅ أهم تعديل: استخدم timezone من الباك فقط
    const tz =
      row.firstCheckInTimezone ||
      row.lastCheckOutTimezone ||
      'UTC';

    const dateStr = toDateInputValue(row.date, tz);

    setSelectedDay(row);
    setDayDetails(null);
    setDetailsLoading(true);

    try {
      const res = await getAttendanceDayDetails(row.user._id, dateStr);
      setDayDetails(res.data);
    } catch (err) {
      console.error('openDetails:', err);
      setDayDetails({ records: [], transits: [] });
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedDay(null);
    setDayDetails(null);
  };

  return (
    <div className="att-page" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Header */}
      <div className="att-page-header">
        <h2 className="att-page-title">
          <i className="fas fa-clipboard-check" />
          {t('employeeAttendance')}
        </h2>

        <div className="att-page-header-right">
          {/* <span className="att-total-badge">
            {t('total')}: {total}
          </span> */}

          <button
            className="att-btn-policy"
            onClick={() => navigate('/admin/attendance-policies')}
          >
            <i className="fas fa-sliders-h" />
            {t('attendancePolicy.manage')}
          </button>

          <button
  className="att-btn-policy"
  onClick={() => navigate('/admin/attendance-repair')}
>
  <i className="fas fa-tools" />
  {t('attendanceRepair.title')}
</button>
        </div>
      </div>

      {/* Filters */}
      <EmployeeAttendanceFilters
        filters={filters}
        onChange={handleFiltersChange}
      />

      {/* Table */}
      <EmployeeAttendanceSummaryTable
        rows={rows}
        loading={loading}
        onOpenDetails={openDetails}
      />

      {/* Pagination */}
      {pages > 1 && (
        <div className="att-pagination">
          <button
            className="att-pagination-btn"
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            <i className={`fas fa-chevron-${isRTL ? 'right' : 'left'}`} />
            {t('previous')}
          </button>

          <span className="att-pagination-info">{page} / {pages}</span>

          <button
            className="att-pagination-btn"
            disabled={page >= pages}
            onClick={() => setPage(p => Math.min(pages, p + 1))}
          >
            {t('next')}
            <i className={`fas fa-chevron-${isRTL ? 'left' : 'right'}`} />
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="att-error">
          <i className="fas fa-exclamation-triangle" />
          {error}
        </div>
      )}

      {/* 🔥 Modal */}
      {selectedDay && (
        <EmployeeAttendanceDetailsModal
          show
          loading={detailsLoading}
          dayDetails={dayDetails}
          user={selectedDay.user}

          // ✅ نفس الفكرة هنا
          date={toDateInputValue(
            selectedDay.date,
            selectedDay.firstCheckInTimezone ||
            selectedDay.lastCheckOutTimezone ||
            'UTC'
          )}

          isAdmin
          onClose={closeModal}

          onSaved={async () => {
            fetchSummary();

            if (selectedDay) {
              setDetailsLoading(true);

              try {
                const tz =
                  selectedDay.firstCheckInTimezone ||
                  selectedDay.lastCheckOutTimezone ||
                  'UTC';

                const dateStr = toDateInputValue(selectedDay.date, tz);

                const res = await getAttendanceDayDetails(
                  selectedDay.user._id,
                  dateStr,
                  true
                );

                setDayDetails(res.data);

              } catch (err) {
                console.error('onSaved re-fetch:', err);
              } finally {
                setDetailsLoading(false);
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default EmployeeAttendancePage;






































// // src/pages/admin/EmployeeAttendancePage.jsx



// import { useEffect, useState, useCallback, useRef } from 'react';
// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';
// import { toDateInputValue } from '../../helpers/dateHelpers';
// import { getRowTimezone } from '../../helpers/timezone';

// import {
//   getAttendanceSummary,
//   getAttendanceDayDetails,
// } from '../../services/admin.api';

// import EmployeeAttendanceFilters      from './EmployeeAttendanceFilters';
// import EmployeeAttendanceSummaryTable from './EmployeeAttendanceSummaryTable';
// import EmployeeAttendanceDetailsModal from './EmployeeAttendanceDetailsModal';
// import '../../style/Employeeattendance.css';

// // ✅ timezone-safe — مش toISOString() (UTC bug)
// // const localDateStr = (value) => {
// //   const d = new Date(value);
// //   return [
// //     d.getFullYear(),
// //     String(d.getMonth() + 1).padStart(2, '0'),
// //     String(d.getDate()).padStart(2, '0'),
// //   ].join('-');
// // };

// // const localDateStr = (value) => {
// //   const d = new Date(value);
// //   return [
// //     d.getUTCFullYear(),
// //     String(d.getUTCMonth() + 1).padStart(2, '0'),
// //     String(d.getUTCDate()).padStart(2, '0'),
// //   ].join('-');
// // };


// const PAGE_LIMIT = 10;

// const EmployeeAttendancePage = () => {
//   const { t, i18n } = useTranslation('attendance');
//   const navigate     = useNavigate();
//   const isRTL        = i18n.language === 'ar';

//   // ── filters (all logic on backend) ──────────────────────────
//   const [filters, setFilters] = useState({
//     branchId: '', from: '', to: '', name: '', decisionType: '', invalidated: '',
//   });

//   // ── server-driven table state ────────────────────────────────
//   const [rows,    setRows]    = useState([]);
//   const [page,    setPage]    = useState(1);
//   const [pages,   setPages]   = useState(1);
//   const [total,   setTotal]   = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error,   setError]   = useState('');

//   // ── modal state ──────────────────────────────────────────────
//   const [selectedDay,    setSelectedDay]    = useState(null);
//   const [dayDetails,     setDayDetails]     = useState(null);  // full API response
//   const [detailsLoading, setDetailsLoading] = useState(false);

//   // debounce ref for name search
//   const nameTimer = useRef(null);

//   // ── fetch (everything from backend) ─────────────────────────
//   const fetchSummary = useCallback(async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const params = { page, limit: PAGE_LIMIT };
//       if (filters.branchId)     params.branchId     = filters.branchId;
//       if (filters.from)         params.from         = filters.from;
//       if (filters.to)           params.to           = filters.to;
//       if (filters.name)         params.name         = filters.name;
//       if (filters.decisionType) params.decisionType = filters.decisionType;
//       if (filters.invalidated)  params.invalidated  = filters.invalidated;

//       const res = await getAttendanceSummary(params);
//       setRows(res.data?.data   || []);
//       setPages(res.data?.pages || 1);
//       setTotal(res.data?.total || 0);
//     } catch (err) {
//       console.error('fetchSummary:', err);
//       setError(t('fetchError'));
//     } finally {
//       setLoading(false);
//     }
//   }, [page, filters, t]);

//   useEffect(() => { fetchSummary(); }, [fetchSummary]);

//   // ── filter change ────────────────────────────────────────────
//   const handleFiltersChange = (newFilters) => {
//     setPage(1);
//     if (newFilters.name !== filters.name) {
//       // debounce name search 500ms
//       clearTimeout(nameTimer.current);
//       nameTimer.current = setTimeout(() => setFilters(newFilters), 500);
//     } else {
//       setFilters(newFilters);
//     }
//   };

//   // ── open details modal ───────────────────────────────────────
//   // const openDetails = async (row) => {
//   //     const tz = getRowTimezone(row);
//   // //const dateStr = toDateInputValue(row.date, getRowTimezone(row))

//   //  const dateStr = row.date.split('T')[0];
  
//   // //const dateStr =toDateInputValue(row.date, tz); // ✅
  

//   //   if (!row?.user?._id || !row?.date) return;
//   //   setSelectedDay(row);
//   //   setDayDetails(null);
//   //   setDetailsLoading(true);
//   //   try {
//   //     const res = await getAttendanceDayDetails(row.user._id, dateStr);

//   //     // const res = await getAttendanceDayDetails(row.user._id, toDateInputValue (row.date));
//   //     setDayDetails(res.data);
//   //   } catch (err) {
//   //     console.error('openDetails:', err);
//   //     setDayDetails({ records: [], transits: [] });
//   //   } finally {
//   //     setDetailsLoading(false);
//   //   }
//   // };

//   // ── open details modal ───────────────────────────────────────
// const openDetails = async (row) => {
//   if (!row?.user?._id || !row?.date) return;

//   const tz = getRowTimezone(row);           // ← مهم جداً
//   const dateStr = toDateInputValue(row.date, tz);   // ← استخدم الـ helper الصحيح (مش split('T')[0])

//   setSelectedDay(row);
//   setDayDetails(null);
//   setDetailsLoading(true);

//   try {
//     const res = await getAttendanceDayDetails(row.user._id, dateStr);
//     setDayDetails(res.data);
//   } catch (err) {
//     console.error('openDetails:', err);
//     setDayDetails({ records: [], transits: [] });
//   } finally {
//     setDetailsLoading(false);
//   }
// };


//   const closeModal = () => { setSelectedDay(null); setDayDetails(null); };

//   return (
//     <div className="att-page" dir={isRTL ? 'rtl' : 'ltr'}>

//       {/* Header */}
//       <div className="att-page-header">
//         <h2 className="att-page-title">
//           <i className="fas fa-clipboard-check" />
//           {t('employeeAttendance')}
//         </h2>
//         <div className="att-page-header-right">
//           <span className="att-total-badge">
//             {t('total')}: {total}
//           </span>
//           <button
//             className="att-btn-policy"
//             onClick={() => navigate('/admin/attendance-policies')}
//           >
//             <i className="fas fa-sliders-h" />
//             {t('attendancePolicy.manage')}
//           </button>
//         </div>
//       </div>

//       {/* Filters — branches from backend inside child */}
//       <EmployeeAttendanceFilters
//         filters={filters}
//         onChange={handleFiltersChange}
//       />

//       {/* Table */}
//       <EmployeeAttendanceSummaryTable
//         rows={rows}
//         loading={loading}
//         onOpenDetails={openDetails}
//       />

//       {/* Pagination — server-driven only */}
//       {pages > 1 && (
//         <div className="att-pagination">
//           <button
//             className="att-pagination-btn"
//             disabled={page <= 1}
//             onClick={() => setPage(p => Math.max(1, p - 1))}
//           >
//             <i className={`fas fa-chevron-${isRTL ? 'right' : 'left'}`} />
//             {t('previous')}
//           </button>

//           <span className="att-pagination-info">{page} / {pages}</span>

//           <button
//             className="att-pagination-btn"
//             disabled={page >= pages}
//             onClick={() => setPage(p => Math.min(pages, p + 1))}
//           >
//             {t('next')}
//             <i className={`fas fa-chevron-${isRTL ? 'left' : 'right'}`} />
//           </button>
//         </div>
//       )}

//       {/* Error */}
//       {error && (
//         <div className="att-error">
//           <i className="fas fa-exclamation-triangle" />
//           {error}
//         </div>
//       )}

//       {/* Details Modal */}
//       {/* {selectedDay && (
//         <EmployeeAttendanceDetailsModal
//           show
//           loading={detailsLoading}
//           dayDetails={dayDetails}
//           user={selectedDay.user}
//           date={toDateInputValue (selectedDay.date)}
//           isAdmin
//           onClose={closeModal}
//           onSaved={async () => {
//             // ✅ حدّث الجدول
//             fetchSummary();
//             // ✅ أعد جلب الـ dayDetails للصف ده بالذات (بدل ما نقفل ونخلي الكاش القديم)
//             if (selectedDay) {
//               setDetailsLoading(true);
//               try {
//                 const res = await getAttendanceDayDetails(
//                   selectedDay.user._id,
//                   toDateInputValue (selectedDay.date),
//                   true  // ✅ bust cache — يتجاوز الـ Redis cache بعد التعديل
//                 );
//                 setDayDetails(res.data);
//               } catch (err) {
//                 console.error('onSaved re-fetch:', err);
//               } finally {
//                 setDetailsLoading(false);
//               }
//             }
//           }}
//         />
//       )} */}


//       {/* Details Modal */}
// {selectedDay && (
//   <EmployeeAttendanceDetailsModal
//     show
//     loading={detailsLoading}
//     dayDetails={dayDetails}
//     user={selectedDay.user}
//     date={toDateInputValue(selectedDay.date, getRowTimezone(selectedDay))}   // ← التعديل المهم
//     isAdmin
//     onClose={closeModal}
//     onSaved={async () => {
//       fetchSummary();
//       if (selectedDay) {
//         setDetailsLoading(true);
//         try {
//           const tz = getRowTimezone(selectedDay);
//           const dateStr = toDateInputValue(selectedDay.date, tz);
//           const res = await getAttendanceDayDetails(selectedDay.user._id, dateStr, true);
//           setDayDetails(res.data);
//         } catch (err) {
//           console.error('onSaved re-fetch:', err);
//         } finally {
//           setDetailsLoading(false);
//         }
//       }
//     }}
//   />
// )}
//     </div>
//   );
// };

// export default EmployeeAttendancePage;



















































//1
// import { useEffect, useState, useCallback } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiGet } from '../../helpers/api';
// import { useNavigate } from 'react-router-dom';

// import EmployeeAttendanceFilters from './EmployeeAttendanceFilters';
// import EmployeeAttendanceSummaryTable from './EmployeeAttendanceSummaryTable';
// import EmployeeAttendanceDetailsModal from './EmployeeAttendanceDetailsModal';

// const PAGE_LIMIT = 10;

// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// // ✅ FIX: timezone bug
// // ❌ القديم: new Date(date).toISOString().slice(0,10)
// //    → Cairo UTC+2: 10 مارس 00:00 local = 9 مارس 22:00 UTC
// //    → يبعت "2026-03-09" للـ API بدل "2026-03-10" !!!
// // ✅ الجديد: بنستخدم local getFullYear/getMonth/getDate
// //    → دايماً يوم الجهاز الصح بغض النظر عن الـ timezone
// // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// const localDateStr = (value) => {
//   const d = new Date(value);
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, '0');
//   const day = String(d.getDate()).padStart(2, '0');
//   return `${y}-${m}-${day}`;
// };

// const EmployeeAttendancePage = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const [branches, setBranches] = useState([]);
//   const [filters, setFilters] = useState({
//     branchId: '', date: '', name: '', status: '', invalidated: ''
//   });

//   const [rows, setRows]   = useState([]);
//   const [page, setPage]   = useState(1);
//   const [pages, setPages] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError]     = useState('');

//   // Modal
//   const [selectedDay, setSelectedDay]         = useState(null);
//   const [detailsData, setDetailsData]         = useState(null);
//   const [detailsTransits, setDetailsTransits] = useState([]);
//   const [detailsLoading, setDetailsLoading]   = useState(false);

//   useEffect(() => {
//     apiGet('/branches').then(res => setBranches(res.data || [])).catch(() => {});
//   }, []);

//   const buildParams = () => {
//     const p = new URLSearchParams({ page, limit: PAGE_LIMIT });
//     if (filters.branchId)    p.append('branchId',    filters.branchId);
//     if (filters.name)        p.append('name',        filters.name);
//     if (filters.status)      p.append('status',      filters.status);
//     if (filters.invalidated) p.append('invalidated', filters.invalidated);
//     if (filters.date) { p.append('from', filters.date); p.append('to', filters.date); }
//     return p.toString();
//   };

//   // ✅ Performance: DailyAttendanceSummary → 1 query / page
//   // مش بيجيب raw Attendance هنا خالص
//   const fetchSummary = useCallback(async () => {
//     try {
//       setLoading(true); setError('');
//       const res = await apiGet(`/admin/attendance-summary?${buildParams()}`);
//       setRows(Array.isArray(res.data?.data) ? res.data.data : []);
//       setPages(res.data?.pages || 1);
//       setTotal(res.data?.total || 0);
//     } catch (err) {
//       console.error(err);
//       setError(t('error'));
//     } finally {
//       setLoading(false);
//     }
//   }, [page, filters, t]);

//   useEffect(() => { fetchSummary(); }, [fetchSummary]);

//   // ✅ FIX: localDateStr بدل toISOString bug
//   const openDetails = async (row) => {
//     if (!row?.user?._id || !row?.date) return;

//     setSelectedDay(row);
//     setDetailsData(null);
//     setDetailsTransits([]);
//     setDetailsLoading(true);

//     try {
//       const dateStr = localDateStr(row.date); // ✅ "2026-03-10" صح

//       const res = await apiGet(
//         `/admin/attendance/day-details?userId=${row.user._id}&date=${dateStr}`
//       );
//       setDetailsData(res.data?.records    || []);
//       setDetailsTransits(res.data?.transits || []);
//     } catch (err) {
//       console.error(err);
//       setDetailsData([]);
//       setDetailsTransits([]);
//     } finally {
//       setDetailsLoading(false);
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3 className="mb-0">
//           <i className="fas fa-clipboard-check me-2" />
//           {t('employeeAttendance')}
//         </h3>
//         <div className="d-flex gap-2">
//           <button className="btn btn-outline-secondary"
//             onClick={() => navigate('/admin/attendance-policies')}>
//             <i className="fas fa-sliders-h me-1" />
//             {t('attendancePolicy.manage')}
//           </button>
//           <span className="text-muted small align-self-center">
//             {t('total')}: {total}
//           </span>
//         </div>
//       </div>

//       <EmployeeAttendanceFilters
//         branches={branches}
//         filters={filters}
//         total={total}
//         onChange={(newFilters) => { setPage(1); setFilters(newFilters); }}
//       />

//       <EmployeeAttendanceSummaryTable
//         rows={rows}
//         loading={loading}
//         onOpenDetails={openDetails}
//         onSaved={fetchSummary}
//       />

//       {pages > 1 && (
//         <nav className="mt-4">
//           <ul className="pagination justify-content-center">
//             <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
//               <button className="page-link"
//                 onClick={() => setPage(p => Math.max(1, p - 1))}>{t('previous')}</button>
//             </li>
//             <li className="page-item disabled">
//               <span className="page-link">{page} / {pages}</span>
//             </li>
//             <li className={`page-item ${page >= pages ? 'disabled' : ''}`}>
//               <button className="page-link"
//                 onClick={() => setPage(p => Math.min(pages, p + 1))}>{t('next')}</button>
//             </li>
//           </ul>
//         </nav>
//       )}

//       {selectedDay && (
//         <EmployeeAttendanceDetailsModal
//           show
//           loading={detailsLoading}
//           records={detailsData || []}
//           transits={detailsTransits}
//           user={selectedDay.user}
//           date={localDateStr(selectedDay.date)} // ✅ local date للـ modal header والـ create
//           isAdmin={true}
//           onClose={() => { setSelectedDay(null); setDetailsData(null); setDetailsTransits([]); }}
//           onSaved={fetchSummary}
//         />
//       )}

//       {error && <div className="alert alert-danger mt-3">{error}</div>}
//     </div>
//   );
// };

// export default EmployeeAttendancePage;

// import { useEffect, useState, useCallback } from 'react';
// import { useTranslation } from 'react-i18next';
// import { apiGet } from '../../helpers/api';
// import { useNavigate } from 'react-router-dom';

// import EmployeeAttendanceFilters from './EmployeeAttendanceFilters';
// import EmployeeAttendanceSummaryTable from './EmployeeAttendanceSummaryTable';
// import EmployeeAttendanceDetailsModal from './EmployeeAttendanceDetailsModal';

// const PAGE_LIMIT = 10;

// const EmployeeAttendancePage = () => {
//   const { t } = useTranslation();
// const navigate = useNavigate();
//   // =========================
//   // State
//   // =========================
//   const [branches, setBranches] = useState([]);

//   const [filters, setFilters] = useState({
//     branchId: '',
//     date: '',
//     name: '',
//     status: '',
//     invalidated: ''
//   });

//   const [rows, setRows] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);
//   const [total, setTotal] = useState(0);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Details
//   const [selectedDay, setSelectedDay] = useState(null);
//   const [detailsData, setDetailsData] = useState(null);
//   const [detailsLoading, setDetailsLoading] = useState(false);

//   // =========================
//   // Fetch branches
//   // =========================
//   useEffect(() => {
//     apiGet('/branches')
//       .then(res => setBranches(res.data || []))
//       .catch(() => {});
//   }, []);

//   // =========================
//   // Build query params
//   // =========================
//   const buildParams = () => {
//     const params = new URLSearchParams({
//       page,
//       limit: PAGE_LIMIT
//     });

//     if (filters.branchId) params.append('branchId', filters.branchId);
//     if (filters.name) params.append('name', filters.name);
//     if (filters.status) params.append('status', filters.status);
//     if (filters.invalidated) params.append('invalidated', filters.invalidated);

//     if (filters.date) {
//       params.append('from', filters.date);
//       params.append('to', filters.date);
//     }

//     return params.toString();
//   };

//   // =========================
//   // Fetch summary
//   // =========================
//   const fetchSummary = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError('');

//       const res = await apiGet(
//         `/admin/attendance-summary?${buildParams()}`
//       );

//       setRows(Array.isArray(res.data?.data) ? res.data.data : []);
//       setPages(res.data?.pages || 1);
//       setTotal(res.data?.total || 0);
//     } catch (err) {
//       console.error(err);
//       setError(t('error'));
//     } finally {
//       setLoading(false);
//     }
//   }, [page, filters, t]);

//   useEffect(() => {
//     fetchSummary();
//   }, [fetchSummary]);

//   // =========================
//   // Open details (RAW attendance)
//   // =========================
//  const openDetails = async (row) => {
//   if (!row?.user?._id || !row?.date) return;

//   setSelectedDay(row);
//   setDetailsData(null);
//   setDetailsLoading(true);

//   try {
//     const dateStr = new Date(row.date).toISOString().slice(0, 10);

//     // ✅ نفس الـ API اللي شغالة في UserProfile
//     const res = await apiGet(
//       `/admin/attendance/day-details?userId=${row.user._id}&date=${dateStr}`
//     );

//     setDetailsData(res.data?.records || []);
//     // ✅ حدّثي الـ transits من الـ API
//     setSelectedDay(prev => ({
//       ...prev,
//       transits: res.data?.transits || []
//     }));

//   } catch (err) {
//     console.error(err);
//     setDetailsData([]);
//   } finally {
//     setDetailsLoading(false);
//   }
// };
// //   const openDetails = (row) => {
// //   if (!row?.user?._id || !row?.date) return;

// //   setSelectedDay(row);
// //   setDetailsData(row.records || []);
// //   setDetailsLoading(false); // لأن الداتا جاهزة من الـ summary
// // };


//   // =========================
//   // Render
//   // =========================
//   return (
//     <div className="container-fluid">
//       {/* Header */}
//      <div className="d-flex justify-content-between align-items-center mb-4">
//   <h3 className="mb-0">
//     <i className="fas fa-clipboard-check me-2" />
//     {t('employeeAttendance')}
//   </h3>

//   <div className="d-flex gap-2">
//    <button
//   className="btn btn-outline-secondary"
//   onClick={() => navigate('/admin/attendance-policies')}
// >
//   <i className="fas fa-sliders-h me-1" />
//   {t('attendancePolicy.manage')}
// </button>


//     <span className="text-muted small">
//       {t('total')}: {total}
//     </span>
//   </div>
// </div>


//       {/* Filters */}
//       <EmployeeAttendanceFilters
//         branches={branches}
//         filters={filters}
//         total={total}
//         onChange={(newFilters) => {
//           setPage(1); // reset pagination
//           setFilters(newFilters);
//         }}
//       />

//       {/* Table */}
//       <EmployeeAttendanceSummaryTable
//         rows={rows}
//         loading={loading}
//         onOpenDetails={openDetails}
//         onSaved={fetchSummary}
//       />

//       {/* Pagination */}
//       {pages > 1 && (
//         <nav className="mt-4">
//           <ul className="pagination justify-content-center">
//             <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
//               <button
//                 className="page-link"
//                 onClick={() => setPage(p => Math.max(1, p - 1))}
//               >
//                 {t('previous')}
//               </button>
//             </li>

//             <li className="page-item disabled">
//               <span className="page-link">
//                 {page} / {pages}
//               </span>
//             </li>

//             <li className={`page-item ${page >= pages ? 'disabled' : ''}`}>
//               <button
//                 className="page-link"
//                 onClick={() => setPage(p => Math.min(pages, p + 1))}
//               >
//                 {t('next')}
//               </button>
//             </li>
//           </ul>
//         </nav>
//       )}

//       {/* Details Modal */}
//       {selectedDay && (
  
// <EmployeeAttendanceDetailsModal
//   show
//   // loading={false}
//   loading={detailsLoading}
//   records={detailsData || []}   // RAW Attendance
//   user={selectedDay.user}
//   date={selectedDay.date}
//   // transits={selectedDay.transits}
//   transits={selectedDay.transits || []}
//   isAdmin={true}
//   onClose={() => {
//     setSelectedDay(null);
//     setDetailsData(null);
//   }}
//   onSaved={fetchSummary}
// />


//       )}

//       {/* Error */}
//       {error && (
//         <div className="alert alert-danger mt-3">
//           {error}
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmployeeAttendancePage;
