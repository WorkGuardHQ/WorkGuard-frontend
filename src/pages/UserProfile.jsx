

// /////////////////////////////////////////////////////////////////////
// // 1 good
// // export default UserProfile;
// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { apiGet } from '../helpers/api';

// import UserHeader from '../components/userProfile/ProfileHeader';
// import UserStats from '../components/userProfile/ProfileStats';
// import UserMonthSelector from '../components/userProfile/UserMonthSelector';
// import UserAttendanceSummaryTable from '../components/userProfile/UserAttendanceSummaryTable';

// import '../style/UserProfile.css';

// function UserProfile() {
//   const { t } = useTranslation();
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // =========================
//   // State
//   // =========================
//   const [user, setUser] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);

//   const [year, setYear] = useState(new Date().getFullYear());
//   const [month, setMonth] = useState(new Date().getMonth() + 1);

//   const [monthlySummary, setMonthlySummary] = useState(null);

//   const [selectedDay, setSelectedDay] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // =========================
//   // 1️⃣ Fetch User
//   // =========================
//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         setLoading(true);

//         const profileRes = await apiGet('/auth/profile');
//         const admin = profileRes.data.role === 'admin';
//         setIsAdmin(admin);

//         if (id === 'me') {
//           setUser(profileRes.data);
//         } else {
//           const res = await apiGet(`/users/${id}`);
//           setUser(res.data.user);
//         }
//       } catch (err) {
//         console.error(err);
//         setError(t('error'));
//         navigate('/');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUser();
//   }, [id, navigate, t]);

//   // =========================
//   // 2️⃣ Fetch Monthly Summary
//   // =========================
//   useEffect(() => {
//     if (!user?._id) return;

//     const fetchMonthlySummary = async () => {
//       try {
//         // const endpoint = isAdmin
//         //   ? `/admin/user-monthly-report?userId=${user._id}&year=${year}&month=${month}`
//         //   : `/users/${user._id}/monthly-summary?year=${year}&month=${month}`;
//         const endpoint = `/admin/user-monthly-report?userId=${user._id}&year=${year}&month=${month}`;


//         const res = await apiGet(endpoint);
//         setMonthlySummary(res.data.report);
//       } catch (err) {
//         console.error(err);
//         setMonthlySummary(null);
//       }
//     };

//     fetchMonthlySummary();
//   }, [user, year, month, isAdmin]);

//   // =========================
//   // UI States
//   // =========================
//   if (loading) {
//     return <div className="text-center p-5">{t('loading')}...</div>;
//   }

//   if (error) {
//     return <div className="alert alert-danger">{error}</div>;
//   }

//   if (!user) return null;

//   // =========================
//   // Render
//   // =========================
//   return (
//     <>
//       {/* Header */}
//       <UserHeader user={user} isAdmin={isAdmin} />

//       {/* Month Selector */}
//       <UserMonthSelector
//         year={year}
//         month={month}
//         onChange={({ year, month }) => {
//           setYear(year);
//           setMonth(month);
//         }}
//       />

//       {/* Monthly Stats */}
//       <UserStats
//         monthlyReport={monthlySummary}
//         showPayroll={isAdmin}
//       />

//       {/* Attendance Table */}
//       <UserAttendanceSummaryTable
//         days={monthlySummary?.days}
//         loading={!monthlySummary}
//         isAdmin={isAdmin}
//         onOpenDetails={(day) => {
//           setSelectedDay(day);
//           setShowDetails(true);
//         }}
//       />

//       {/* TODO: Day Details Modal */}
//       {/* {showDetails && (
//         <UserAttendanceDayDetails
//           day={selectedDay}
//           onClose={() => setShowDetails(false)}
//         />
//       )} */}
//     </>
//   );
// }

// // export default UserProfile;
// import { useEffect, useMemo, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { apiGet } from '../helpers/api';

// import UserHeader from '../components/userProfile/ProfileHeader';
// import UserStats from '../components/userProfile/ProfileStats';
// import UserMonthSelector from '../components/userProfile/UserMonthSelector';
// import UserAttendanceSummaryTable from '../components/userProfile/UserAttendanceSummaryTable';
// import EmployeeAttendanceDetailsModal from '../components/userProfile/EmployeeAttendanceDetailsModal';
// import '../style/UserProfile.css';

// const PAGE_SIZE = 7;

// function UserProfile() {
//   const { t } = useTranslation();
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);

//   const [year, setYear] = useState(new Date().getFullYear());
//   const [month, setMonth] = useState(new Date().getMonth() + 1);

//   const [monthlySummary, setMonthlySummary] = useState(null);
//   const [page, setPage] = useState(1);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   /* =========================
//      Load User
//   ========================= */
//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         setLoading(true);

//         const profileRes = await apiGet('/auth/profile');
//         setIsAdmin(profileRes.data.role === 'admin');

//         if (id === 'me') {
//           setUser(profileRes.data);
//         } else {
//           const res = await apiGet(`/users/${id}`);
//           setUser(res.data.user);
//         }
//       } catch {
//         setError(t('error'));
//         navigate('/');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUser();
//   }, [id, navigate, t]);

//   /* =========================
//      Load Monthly Summary
//   ========================= */
//   useEffect(() => {
//     if (!user?._id) return;

//     const loadMonth = async () => {
//       try {
//         setLoading(true);
//         setPage(1);

//         const res = await apiGet(
//           `/admin/user-monthly-report?userId=${user._id}&year=${year}&month=${month}`
//         );

//         setMonthlySummary(res.data.report);
//       } catch {
//         setMonthlySummary(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadMonth();
//   }, [user, year, month]);

//   /* =========================
//      Pagination Logic
//   ========================= */
//   const pagedDays = useMemo(() => {
//     if (!monthlySummary?.days) return [];
//     const start = (page - 1) * PAGE_SIZE;
//     return monthlySummary.days.slice(start, start + PAGE_SIZE);
//   }, [monthlySummary, page]);

//   const totalPages = useMemo(() => {
//     if (!monthlySummary?.days) return 0;
//     return Math.ceil(monthlySummary.days.length / PAGE_SIZE);
//   }, [monthlySummary]);

//   /* =========================
//      UI
//   ========================= */
//   if (loading) return <div className="text-center p-5">{t('loading')}...</div>;
//   if (error) return <div className="alert alert-danger">{error}</div>;
//   if (!user) return null;

//   return (
//     <>
//       <UserHeader user={user} isAdmin={isAdmin} />

//       <UserMonthSelector
//         year={year}
//         month={month}
//         onChange={({ year, month }) => {
//           setYear(year);
//           setMonth(month);
//         }}
//       />

//       <UserStats monthlyReport={monthlySummary} showPayroll={isAdmin} />

//       <UserAttendanceSummaryTable
//         days={pagedDays}
//         loading={loading}
//         isAdmin={isAdmin}
//       />

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="d-flex justify-content-center gap-2 my-3">
//           <button
//             className="btn btn-outline-secondary"
//             disabled={page === 1}
//             onClick={() => setPage(p => p - 1)}
//           >
//             ◀
//           </button>

//           <span className="align-self-center fw-semibold">
//             {t('page')} {page} / {totalPages}
//           </span>

//           <button
//             className="btn btn-outline-secondary"
//             disabled={page === totalPages}
//             onClick={() => setPage(p => p + 1)}
//           >
//             ▶
//           </button>
//         </div>


//       )}

//        <EmployeeAttendanceDetailsModal
//         show={!!detailsDate}
//         loading={loadingDetails}
//         records={detailsRecords}
//         user={user}
//         date={detailsDate}
//         isAdmin={isAdmin}
//         onClose={() => setDetailsDate(null)}
//         onSaved={() => openDetails({ date: detailsDate })}
//       />
//     </>
//   );
// }

// export default UserProfile;


































// // // //===========================================================
// import { useEffect, useMemo, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// // import { apiGet } from '../helpers/api';


// import { getProfile, getUserById } from '../services/user.api';
// import { getUserMonthlyReport } from '../services/admin.api';
// import { getAttendanceDayDetails } from '../services/admin.api'; 

// import {getUserDevices} from '../services/device.api' 
// import UserHeader from '../components/userProfile/ProfileHeader';
// import UserStats from '../components/userProfile/ProfileStats';
// import UserMonthSelector from '../components/userProfile/UserMonthSelector';
// import UserAttendanceSummaryTable from '../components/userProfile/UserAttendanceSummaryTable';
// import EmployeeAttendanceDetailsModal from '../components/userProfile/EmployeeAttendanceDetailsModal';
// import UserEmploymentStatus from '../components/userProfile/UserEmploymentStatus';
// import UserBiometricsSettings from '../components/userProfile/UserBiometricsSettings';
// import UserFeedbackSection from '../components/userProfile/UserFeedbackSection';
// import UserEffectiveAttendancePolicy from '../components/userProfile/UserEffectiveAttendancePolicy';
// import UserLeaveSummary from '../components/userProfile/UserLeaveSummary';

// import UserDevices from '../components/adminDevice/UserDevices';
// import '../style/UserProfile.css';
// import EmployeePayrollHistory from './payroll/EmployeePayrollHistory';
// import UserAssignedAttendancePolicies from '../components/userProfile/UserAssignedAttendancePolicies';
// import AttendancePolicyNotes from '../components/attendancePolicy/AttendancePolicyNotes'
// import EmployeeLeaveProfile from
//   './leave/EmployeeLeaveProfile';
// import AbsenceDetailsModal
//   from '../components/leave/absence/AbsenceDetailsModal';


// const PAGE_SIZE = 7;


// function UserProfile() {
//   const { t } = useTranslation();
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);
// const [showAbsenceDetails, setShowAbsenceDetails] = useState(false);

//   const [year, setYear] = useState(new Date().getFullYear());
//   const [month, setMonth] = useState(new Date().getMonth() + 1);

//   const [monthlySummary, setMonthlySummary] = useState(null);
//   const [page, setPage] = useState(1);

//   // const [loading, setLoading] = useState(true);
// const [loadingUser, setLoadingUser] = useState(true);
// const [loadingMonth, setLoadingMonth] = useState(false);
  
//   const [error, setError] = useState(null);
// const [showLeave, setShowLeave] = useState(false);

//   // 🔍 Details modal state
//   const [detailsDate, setDetailsDate] = useState(null);
//   const [detailsRecords, setDetailsRecords] = useState([]);
//   const [loadingDetails, setLoadingDetails] = useState(false);
// const [detailsTransits, setDetailsTransits] = useState([]);

// const [showEffectivePolicy, setShowEffectivePolicy] = useState(false);
 
// const reloadMonth = async () => {
//   if (!user?._id) return;

// setLoadingMonth(true);
//   try {
//    const res = await getUserMonthlyReport({
//   userId: user._id,
//   year,
//   month
// });
//     setMonthlySummary(res.data.report);
//   } finally {
// setLoadingMonth(false);  }
// };

//   /* =========================
//      Load User
//   ========================= */
//   useEffect(() => {
//     const loadUser = async () => {
//       try {
// setLoadingUser(true);

// const profileRes = await getProfile();

// setIsAdmin(profileRes.data.role === 'admin');

//         if (id === 'me') {
//           setUser(profileRes.data);
//         } else {
//           const res = await getUserById(id);
// setUser(res.data.user);
//         }
//       } catch {
//         setError(t('error'));
//         navigate('/');
//       } finally {
// setLoadingUser(false);      }
//     };

//     loadUser();
//   }, [id, navigate, t]);

//   /* =========================
//      Load Monthly Summary
//   ========================= */
//   useEffect(() => {
//     if (!user?._id) return;

//     const loadMonth = async () => {
//       try {
// setLoadingMonth(true);
// setMonthlySummary(null);
//         setPage(1);

//        const res = await getUserMonthlyReport({
//   userId: user._id,
//   year,
//   month
// });

//         setMonthlySummary(res.data.report);

//       }catch (err) {
//   console.error(err);
//   setMonthlySummary(null);
// } finally {
// setLoadingMonth(false);      }
//     };

//     loadMonth();
// }, [user?._id, year, month]);


// useEffect(() => {
//   setPage(1);
// }, [month, year]);
//   /* =========================
//      Open Details
//   ========================= */
//   // const openDetails = async ({ date }) => {
//   //   try {
//   //     setDetailsDate(date);
//   //     setLoadingDetails(true);

//   //     const res = await apiGet(
//   //       isAdmin
//   //         ? `/admin/attendance?userId=${user._id}&date=${date}&mode=dayDetails`
//   //         : `/attendance?date=${date}&mode=dayDetails`
//   //     );

//   //     setDetailsRecords(res.data.data || []);
//   //   } catch {
//   //     setDetailsRecords([]);
//   //   } finally {
//   //     setLoadingDetails(false);
//   //   }
//   // };
// const openDetails = async ({ date }) => {
//   try {

//     const currentDate = date;
// setDetailsDate(currentDate);
// setLoadingDetails(true);

//     // setDetailsDate(date);
//     // setLoadingDetails(true);

//    const res = await getAttendanceDayDetails(user._id, currentDate);
// setDetailsRecords(res.data.records || []);
// setDetailsTransits(res.data.transits || []);

//     // الفانكشن الجديدة بترجع object مش array
 
//   } catch {
//     setDetailsRecords([]);
//        setDetailsTransits([]);
//   } finally {
//     setLoadingDetails(false);
//   }
// };

//   /* =========================
//      Pagination
//   ========================= */
//   const pagedDays = useMemo(() => {
//     if (!monthlySummary?.days) return [];
//     const start = (page - 1) * PAGE_SIZE;
//     return monthlySummary.days.slice(start, start + PAGE_SIZE);
//   }, [monthlySummary, page]);

//   const totalPages = useMemo(() => {
//     if (!monthlySummary?.days) return 0;
//     return Math.ceil(monthlySummary.days.length / PAGE_SIZE);
//   }, [monthlySummary]);

//   /* =========================
//      UI
//   ========================= */
//   if (loadingUser) return <div className="text-center p-5">{t('common.loading')}...</div>;
//   if (error) return <div className="alert alert-danger">{error}</div>;
//   if (!user) return null;



//   return (
//     <>
//       <UserHeader user={user} isAdmin={isAdmin} />

//       {isAdmin && (

//   <UserBiometricsSettings
//     user={user}
//     isAdmin={isAdmin}
//     onUpdated={() => {
      
//     }}
//   />
// )}


// {/* <UserLeaveSummary userId={user._id} /> */}
// {/* <UserLeaveSummary userId={user._id} /> */}


// {/* // no need */}
// {/* Absence / Unpaid Section */}
// {/* <EmployeeLeaveProfile userId={user._id} isAdmin={isAdmin} /> */}


//  {/* Leave & Absence */}
// <button
//   className="btn btn-outline-warning"
//   onClick={() =>
//     navigate(`/admin/employees/${user._id}/leave-profile`)
//   }
// >
//   <i className="fa-solid fa-calendar-xmark me-1" />
//   Leave & Absence
// </button>
// <button
//   className="btn btn-outline-success"
//   onClick={() =>
//     navigate(`/employees/${user._id}/payroll/preview?year=${year}&month=${month}`)
//   }
// >
//   <i className="fas fa-calculator me-1" />
//   Payroll Preview
// </button>

// {isAdmin &&<UserEmploymentStatus
//   user={user}
//   isAdmin={isAdmin}
//   onUpdated={() => {
//     // reload user profile
//     window.location.reload();
//   }}
// />}

// {isAdmin && (
//   <>
//   {/* <AttendancePolicyNotes t={t} /> */}


//   {/* <button
//   className="btn btn-outline-info btn-sm mb-3"
//   onClick={() => setShowEffectivePolicy(v => !v)}
// >
//   <i className="fas fa-shield-alt me-1" />
//   {t('attendancePolicy.viewEffectiveToday')}
// </button> */}
// {isAdmin && (
//   <>
//     <UserAssignedAttendancePolicies userId={user._id} />
//     {/* <UserEffectiveAttendancePolicy userId={user._id} isAdmin /> */}
//   </>
// )}


//     {showEffectivePolicy && (
//       <UserEffectiveAttendancePolicy
//         userId={user._id}
//         isAdmin={isAdmin}
//       />
//     )}
//   </>
// )}
// {/* {isAdmin && <UserBranchPolicies userId={user._id} />} */}


// {isAdmin && <EmployeePayrollHistory userId={user._id} />}




// {/* <UserBiometricsSettings
//   user={user}
//   isAdmin={isAdmin}
//   onUpdated={() => {
//     // reload user
//   }}
// /> */}

// <UserFeedbackSection
//   userId={user._id}
//   isAdmin={isAdmin}
// />


// <UserDevices
//   user={user}
//   isAdmin={isAdmin}
//   onUpdated={async () => {
//    const res = await getUserById(user._id);
//     setUser(res.data.user);
//   }}
// />


//       <UserMonthSelector
//         year={year}
//         month={month}
//         onChange={({ year, month }) => {
//           setYear(year);
//           setMonth(month);
//         }}
//       />

//       <UserStats monthlyReport={monthlySummary} showPayroll={isAdmin} />

//       <UserAttendanceSummaryTable
//         days={pagedDays}
//         loading={loadingMonth}
//         isAdmin={isAdmin}
//         onOpenDetails={openDetails}
//       />

//       {totalPages > 1 && (
//         <div className="d-flex justify-content-center gap-2 my-3">
//           <button
//             className="btn btn-outline-secondary"
//             disabled={page === 1}
//             onClick={() => setPage(p => p - 1)}
//           >
//             ◀
//           </button>

//           <span className="align-self-center fw-semibold">
//             {t('common.page')} {page} / {totalPages}
//           </span>

//           <button
//             className="btn btn-outline-secondary"
//             disabled={page === totalPages}
//             onClick={() => setPage(p => p + 1)}
//           >
//             ▶
//           </button>
//         </div>
//       )}

//       <EmployeeAttendanceDetailsModal
//         show={!!detailsDate}
//         loading={loadingDetails}
//         records={detailsRecords}
//           transits={detailsTransits}
//         user={user}
//         date={detailsDate}
//         isAdmin={isAdmin}
//         onClose={() => setDetailsDate(null)}
//         onSaved={async () => {
//   await openDetails({ date: detailsDate }); 
  
//   // تحديث المودال
//   await reloadMonth();                     // تحديث الجداول
// }}

//       />
//     </>
//   );
// } 

// export default UserProfile;





//--------------------------ui---------------------------------


// import { useEffect, useMemo, useState, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';

// import { getProfile, getUserById } from '../services/user.api';
// import { getUserMonthlyReport }    from '../services/admin.api';
// import { getAttendanceDayDetails } from '../services/admin.api';
// import { getUserDevices }          from '../services/device.api';

// import UserHeader                      from '../components/userProfile/ProfileHeader';
// import UserStats                       from '../components/userProfile/ProfileStats';
// import UserMonthSelector               from '../components/userProfile/UserMonthSelector';
// import EmployeeAttendanceSummaryTable      from './AdminEmployeeAttendance/EmployeeAttendanceSummaryTable';

// //'../components/userProfile/UserAttendanceSummaryTable';
// import EmployeeAttendanceDetailsModal  from './AdminEmployeeAttendance/EmployeeAttendanceDetailsModal'

// //'../components/userProfile/EmployeeAttendanceDetailsModal';
// import UserEmploymentStatus            from '../components/userProfile/UserEmploymentStatus';
// import UserBiometricsSettings          from '../components/userProfile/UserBiometricsSettings';
// import UserFeedbackSection             from '../components/userProfile/UserFeedbackSection';
// import UserEffectiveAttendancePolicy   from '../components/userProfile/UserEffectiveAttendancePolicy';
// import UserDevices                     from '../components/adminDevice/UserDevices';
// import EmployeePayrollHistory          from './payroll/EmployeePayrollHistory';
// import UserAssignedAttendancePolicies  from '../components/userProfile/UserAssignedAttendancePolicies';

// import '../style/UserProfile.css';

// const PAGE_SIZE = 7;

// /* ─── Collapsible Section ──────────────────────────────────── */
// function Section({ icon, title, badge, defaultOpen = false, children, accent = '#6366f1' }) {
//   const [open, setOpen] = useState(defaultOpen);

//   return (
//     <div className="up-section">
//       <button
//         className="up-section__header"
//         onClick={() => setOpen(v => !v)}
//         style={{ '--accent': accent }}
//         aria-expanded={open}
//       >
//         <span className="up-section__left">
//           <span className="up-section__icon" style={{ background: accent + '18', color: accent }}>
//             <i className={icon} />
//           </span>
//           <span className="up-section__title">{title}</span>
//           {badge !== undefined && (
//             <span className="up-section__badge" style={{ background: accent + '22', color: accent }}>
//               {badge}
//             </span>
//           )}
//         </span>
//         <span className={`up-section__chevron ${open ? 'up-section__chevron--open' : ''}`}>
//           <i className="fas fa-chevron-down" />
//         </span>
//       </button>

//       <div className={`up-section__body ${open ? 'up-section__body--open' : ''}`}>
//         <div className="up-section__content">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── Quick Action Button ──────────────────────────────────── */
// function QuickBtn({ icon, label, onClick, variant = 'primary' }) {
//   const colors = {
//     primary:  { bg: '#6366f1', text: '#fff' },
//     warning:  { bg: '#f59e0b', text: '#fff' },
//     success:  { bg: '#10b981', text: '#fff' },
//     danger:   { bg: '#ef4444', text: '#fff' },
//     info:     { bg: '#0ea5e9', text: '#fff' },
//   };
//   const c = colors[variant] || colors.primary;
//   return (
//     <button
//       className="up-quick-btn"
//       onClick={onClick}
//       style={{ '--btn-bg': c.bg, '--btn-text': c.text }}
//     >
//       <i className={icon} />
//       <span>{label}</span>
//     </button>
//   );
// }

// /* ─── Main Component ───────────────────────────────────────── */
// function UserProfile() {
//   const { t }      = useTranslation();
//   const { id }     = useParams();
//   const navigate   = useNavigate();

//   const [user,           setUser]           = useState(null);
//   const [isAdmin,        setIsAdmin]        = useState(false);
//   const [year,           setYear]           = useState(new Date().getFullYear());
//   const [month,          setMonth]          = useState(new Date().getMonth() + 1);
//   const [monthlySummary, setMonthlySummary] = useState(null);
//   const [page,           setPage]           = useState(1);
//   const [loadingUser,    setLoadingUser]    = useState(true);
//   const [loadingMonth,   setLoadingMonth]   = useState(false);
//   const [error,          setError]          = useState(null);
//   const [detailsDate,    setDetailsDate]    = useState(null);
//   const [detailsRecords, setDetailsRecords] = useState([]);
//   const [detailsTransits,setDetailsTransits]= useState([]);
//   const [loadingDetails, setLoadingDetails] = useState(false);

//   /* ── Load User ─────────────────────────────────────────── */
//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoadingUser(true);
//         const profileRes = await getProfile();
//         setIsAdmin(profileRes.data.role === 'admin');
//         if (id === 'me') {
//           setUser(profileRes.data);
//         } else {
//           const res = await getUserById(id);
//           setUser(res.data.user);
//         }
//       } catch {
//         setError(t('error'));
//         navigate('/');
//       } finally {
//         setLoadingUser(false);
//       }
//     };
//     load();
//   }, [id, navigate, t]);

//   /* ── Load Month ────────────────────────────────────────── */
//   const reloadMonth = useCallback(async () => {
//     if (!user?._id) return;
//     setLoadingMonth(true);
//     try {
//       const res = await getUserMonthlyReport({ userId: user._id, year, month });
//       setMonthlySummary(res.data.report);
//     } finally {
//       setLoadingMonth(false);
//     }
//   }, [user?._id, year, month]);

//   useEffect(() => {
//     if (!user?._id) return;
//     setMonthlySummary(null);
//     setPage(1);
//     reloadMonth();
//   }, [user?._id, year, month]);

//   useEffect(() => { setPage(1); }, [month, year]);

//   /* ── Open Details ──────────────────────────────────────── */
//   const openDetails = async ({ date }) => {
//     try {
//       setDetailsDate(date);
//       setLoadingDetails(true);
//       const res = await getAttendanceDayDetails(user._id, date);
//       setDetailsRecords(res.data.records  || []);
//       setDetailsTransits(res.data.transits || []);
//     } catch {
//       setDetailsRecords([]);
//       setDetailsTransits([]);
//     } finally {
//       setLoadingDetails(false);
//     }
//   };

//   /* ── Pagination ────────────────────────────────────────── */
//   const pagedDays = useMemo(() => {
//     if (!monthlySummary?.days) return [];
//     const start = (page - 1) * PAGE_SIZE;
//     return monthlySummary.days.slice(start, start + PAGE_SIZE);
//   }, [monthlySummary, page]);

//   const totalPages = useMemo(() => {
//     if (!monthlySummary?.days) return 0;
//     return Math.ceil(monthlySummary.days.length / PAGE_SIZE);
//   }, [monthlySummary]);

//   /* ── Guards ────────────────────────────────────────────── */
//   if (loadingUser) return (
//     <div className="up-loader">
//       <div className="up-loader__spinner" />
//       <span>{t('common.loading')}…</span>
//     </div>
//   );
//   if (error)  return <div className="alert alert-danger m-4">{error}</div>;
//   if (!user)  return null;

//   /* ── Render ────────────────────────────────────────────── */
//   return (
//     <div className="up-root animate-fade-in">

//       {/* Header */}
//       <div className="up-header-wrap">
//         <UserHeader user={user} isAdmin={isAdmin} />
//       </div>

//       {/* Quick Actions */}
//       <div className="up-quick-actions">
//         <QuickBtn
//           icon="fa-solid fa-calendar-xmark"
//           label="Leave & Absence"
//           variant="warning"
//           onClick={() => navigate(`/admin/employees/${user._id}/leave-profile`)}
//         />
//         {isAdmin && (
//         <QuickBtn
//           icon="fas fa-calculator"
//           label="Payroll Preview"
//           variant="success"
//           onClick={() => navigate(`/employees/${user._id}/payroll/preview?year=${year}&month=${month}`)}
//         />)}
//       </div>

//       <div className="up-body">

//         {/* ── Admin-only sections ────────────────────────── */}
//         {isAdmin && (
//           <>
//             {/* Biometrics */}
//             <Section icon="fas fa-fingerprint" title="Biometrics Settings" accent="#8b5cf6">
//               <UserBiometricsSettings user={user} isAdmin={isAdmin} onUpdated={() => {}} />
//             </Section>

//             {/* Employment Status */}
//             <Section icon="fas fa-briefcase" title="Employment Status" accent="#f59e0b">
//               <UserEmploymentStatus
//                 user={user}
//                 isAdmin={isAdmin}
//                 onUpdated={() => window.location.reload()}
//               />
//             </Section>

//             {/* Attendance Policies */}
//             <Section icon="fas fa-shield-alt" title="Attendance Policies" accent="#0ea5e9">
//               <UserAssignedAttendancePolicies userId={user._id} />
//             </Section>

//             {/* Payroll History */}
//             <Section icon="fas fa-file-invoice-dollar" title="Payroll History" accent="#10b981">
//               <EmployeePayrollHistory userId={user._id} />
//             </Section>
//           </>
//         )}

//         {/* Feedback — visible for all, content filtered by role */}
//         <Section icon="fas fa-comments" title="Feedback & Warnings" accent="#ef4444">
//           <UserFeedbackSection userId={user._id} isAdmin={isAdmin} />
//         </Section>

//         {/* Devices */}
//         {isAdmin && (
//           <Section icon="fas fa-laptop" title="Registered Devices" accent="#6366f1">
//             <UserDevices
//               user={user}
//               isAdmin={isAdmin}
//               onUpdated={async () => {
//                 const res = await getUserById(user._id);
//                 setUser(res.data.user);
//               }}
//             />
//           </Section>
//         )}

//         {/* ── Attendance ─────────────────────────────────── */}
//         <div className="up-attendance">
//           <UserMonthSelector
//             year={year}
//             month={month}
//             onChange={({ year, month }) => { setYear(year); setMonth(month); }}
//           />

//           <UserStats monthlyReport={monthlySummary} showPayroll={isAdmin} />

//           <div className="up-table-wrap">
//             {/* <UserAttendanceSummaryTable
//               days={pagedDays}
//               loading={loadingMonth}
//               isAdmin={isAdmin}
//               onOpenDetails={openDetails}
//             /> */}

//             <EmployeeAttendanceSummaryTable
//   rows={pagedDays}
//   loading={loadingMonth}
//   showEmployeeColumn={false}     // مهم: إخفاء عمود الموظف في بروفايل الموظف
//   onOpenDetails={openDetails}
// />

//           </div>

//           {totalPages > 1 && (
//             <div className="up-pagination">
//               <button
//                 className="up-page-btn"
//                 disabled={page === 1}
//                 onClick={() => setPage(p => p - 1)}
//               >
//                 <i className="fas fa-chevron-left" />
//               </button>
//               <span className="up-page-info">
//                 {page} <span className="up-page-sep">/</span> {totalPages}
//               </span>
//               <button
//                 className="up-page-btn"
//                 disabled={page === totalPages}
//                 onClick={() => setPage(p => p + 1)}
//               >
//                 <i className="fas fa-chevron-right" />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Details Modal */}
//       {/* <EmployeeAttendanceDetailsModal
//         show={!!detailsDate}
//         loading={loadingDetails}
//         records={detailsRecords}
//         transits={detailsTransits}
//         user={user}
//         date={detailsDate}
//         isAdmin={isAdmin}
//         onClose={() => setDetailsDate(null)}
//         onSaved={async () => {
//           await openDetails({ date: detailsDate });
//           await reloadMonth();
//         }}
//       /> */}
//       <EmployeeAttendanceDetailsModal
//   show={!!detailsDate}
//   loading={loadingDetails}
//   dayDetails={{
//     records: detailsRecords,
//     transits: detailsTransits,
//     effectiveTimezone: user?.tenantTimezone || 'UTC',// أو من الـ API إذا كان موجود
//     // يمكنك إضافة أي بيانات أخرى من الـ summary إذا أردت
//   }}
//     //date={toDateInputValue(selectedDay.date, getRowTimezone(selectedDay))}   // ← التعديل المهم
//    user={user}
//   date={detailsDate}
//   isAdmin={isAdmin}
//   onClose={() => setDetailsDate(null)}
//   onSaved={async () => {
//     await openDetails({ date: detailsDate });
//     await reloadMonth();
//   }}
//   />

//     </div>
//   );
// }

// export default UserProfile;






































//----------------------------tz,فايلات مشتركه 



// UserProfile.jsx
import { useEffect, useMemo, useState, useCallback ,lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { getProfile, getUserById } from '../services/user.api';
import { getUserMonthlyReport }    from '../services/admin.api';
import { getAttendanceDayDetails } from '../services/admin.api';
import { getUserDevices }          from '../services/device.api';

import UserHeader                      from '../components/userProfile/ProfileHeader';
import UserStats                       from '../components/userProfile/ProfileStats';
import UserMonthSelector               from '../components/userProfile/UserMonthSelector';
import EmployeeAttendanceSummaryTable  from '../components/attendance/share/EmployeeAttendanceSummaryTable';
import EmployeeAttendanceDetailsModal  from '../components/attendance/share/EmployeeAttendanceDetailsModal';

import UserEmploymentStatus            from '../components/userProfile/UserEmploymentStatus';
import UserBiometricsSettings          from '../components/userProfile/UserBiometricsSettings';
import UserFeedbackSection             from '../components/userProfile/UserFeedbackSection';
import UserEffectiveAttendancePolicy   from '../components/userProfile/UserEffectiveAttendancePolicy';
// import UserDevices                     from '../components/adminDevice/UserDevices';
const UserDevices = lazy(() =>
  import('../components/adminDevice/UserDevices')
);
// import EmployeePayrollHistory          from './payroll/EmployeePayrollHistory';
const EmployeePayrollHistory = lazy(() =>
  import('./payroll/EmployeePayrollHistory')
);
import UserAssignedAttendancePolicies  from '../components/userProfile/UserAssignedAttendancePolicies';

import '../style/UserProfile.css';

const PAGE_SIZE = 7;

function Section({ icon, title, badge, defaultOpen = false, children, accent = '#6366f1', className = ''  }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
        <div className={`up-section ${className}`}>

      <button className="up-section__header" onClick={() => setOpen(v => !v)} style={{ '--accent': accent }} aria-expanded={open}>
        <span className="up-section__left">
          <span className="up-section__icon" style={{ background: accent + '18', color: accent }}>
            <i className={icon} />
          </span>
          <span className="up-section__title">{title}</span>
          {badge !== undefined && <span className="up-section__badge" style={{ background: accent + '22', color: accent }}>{badge}</span>}
        </span>
        <span className={`up-section__chevron ${open ? 'up-section__chevron--open' : ''}`}>
          <i className="fas fa-chevron-down" />
        </span>
      </button>
      <div className={`up-section__body ${open ? 'up-section__body--open' : ''}`}>
        <div className="up-section__content">{children}</div>
      </div>
    </div>
  );
}

function QuickBtn({ icon, label, onClick, variant = 'primary' }) {
  const colors = {
    primary: { bg: '#6366f1', text: '#fff' },
    warning: { bg: '#f59e0b', text: '#fff' },
    success: { bg: '#10b981', text: '#fff' },
    danger:  { bg: '#ef4444', text: '#fff' },
  };
  const c = colors[variant] || colors.primary;
  return (
    <button className="up-quick-btn" onClick={onClick} style={{ '--btn-bg': c.bg, '--btn-text': c.text }}>
      <i className={icon} />
      <span>{label}</span>
    </button>
  );
}

function UserProfile() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [page, setPage] = useState(1);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [error, setError] = useState(null);

  const [detailsDate, setDetailsDate] = useState(null);
  const [dayDetails, setDayDetails] = useState(null);        // ← مهم: نحفظ الـ dayDetails كامل
  const [loadingDetails, setLoadingDetails] = useState(false);

  /* Load User */
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingUser(true);
        const profileRes = await getProfile();
        setIsAdmin(profileRes.data.role === 'admin');

        if (id === 'me') {
          setUser(profileRes.data);
        } else {
          const res = await getUserById(id);
          setUser(res.data.user);
        }
      } catch {
        setError(t('error'));
        navigate('/');
      } finally {
        setLoadingUser(false);
      }
    };
    load();
  }, [id, navigate, t]);

  /* Load Monthly Report */
  const reloadMonth = useCallback(async () => {
    if (!user?._id) return;
    setLoadingMonth(true);
    try {
      const res = await getUserMonthlyReport({ userId: user._id, year, month });
      setMonthlySummary(res.data.report);
    } finally {
      setLoadingMonth(false);
    }
  }, [user?._id, year, month]);

  useEffect(() => {
    if (!user?._id) return;
    setMonthlySummary(null);
    setPage(1);
    reloadMonth();
  }, [user?._id, year, month]);

  /* Open Details - Get full dayDetails with effectiveTimezone */
  const openDetails = async (row) => {
    const dateStr = row.date;   // أو row.date.split('T')[0] لو محتاج
    try {
      setDetailsDate(dateStr);
      setLoadingDetails(true);

      const res = await getAttendanceDayDetails(user._id, dateStr);
      
      setDayDetails(res.data);   // ← نحفظ الـ object كامل (مهم جدًا)
    } catch (err) {
      console.error(err);
      setDayDetails({ records: [], transits: [] });
    } finally {
      setLoadingDetails(false);
    }
  };

  /* Pagination */
  const pagedDays = useMemo(() => {
    if (!monthlySummary?.days) return [];
    const start = (page - 1) * PAGE_SIZE;
    return monthlySummary.days.slice(start, start + PAGE_SIZE);
  }, [monthlySummary, page]);

  const totalPages = useMemo(() => {
    if (!monthlySummary?.days) return 0;
    return Math.ceil(monthlySummary.days.length / PAGE_SIZE);
  }, [monthlySummary]);

  if (loadingUser) return <div className="up-loader"><div className="up-loader__spinner" />{t('common.loading')}…</div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;
  if (!user) return null;

  return (
    <div className="up-root animate-fade-in">

      <div className="up-header-wrap">
        <UserHeader user={user} isAdmin={isAdmin} />
      </div>

      <div className="up-quick-actions">
        <QuickBtn icon="fa-solid fa-calendar-xmark" 
        
      label={t("LeaveAbsence")} variant="warning" onClick={() => navigate(`/admin/employees/${user._id}/leave-profile`)} />
        {isAdmin && <QuickBtn icon="fas fa-calculator"
        
    label={t("PayrollPreview")} variant="success" onClick={() => navigate(`/employees/${user._id}/payroll/preview?year=${year}&month=${month}`)} />}
      </div>

      <div className="up-body">

        {isAdmin && (
         <div className="up-admin-grid">
            <Section icon="fas fa-fingerprint" title={t("BiometricsSettings")}accent="#8b5cf6">
              <UserBiometricsSettings user={user} isAdmin={isAdmin} />
            </Section>
            <Section icon="fas fa-briefcase" title={t("EmploymentStatus")}  accent="#f59e0b">
              <UserEmploymentStatus user={user} isAdmin={isAdmin} onUpdated={() => window.location.reload()} />
            </Section>
            <Section icon="fas fa-shield-alt" title={t("AttendancePolicies")} accent="#0ea5e9">
              <UserAssignedAttendancePolicies userId={user._id} />
            </Section>
            <Section icon="fas fa-file-invoice-dollar"
             title={t("PayrollHistory")} accent="#10b981">
              {/* <EmployeePayrollHistory userId={user._id} /> */}
              <Suspense fallback={<div>Loading...</div>}>
  <EmployeePayrollHistory userId={user._id} />
</Suspense>

            </Section>
           </div>
        )}

        <Section icon="fas fa-comments" title={t("FeedbackWarnings")} accent="#ef4444">
          <UserFeedbackSection userId={user._id} isAdmin={isAdmin}
            timezone={user.workTimezone}
 />
        </Section>

        {isAdmin && (
          <Section icon="fas fa-laptop" title={t("RegisteredDevices")} accent="#6366f1">
<Suspense fallback={<div>Loading...</div>}>
  <UserDevices user={user} isAdmin={isAdmin} />
</Suspense>
          </Section>
        )}

        {/* Attendance Section */}
        <div className="up-attendance">
          <UserMonthSelector year={year} month={month} onChange={({ year, month }) => { setYear(year); setMonth(month); }} />

          <UserStats monthlyReport={monthlySummary} showPayroll={isAdmin} />

          <div className="up-table-wrap">
            <EmployeeAttendanceSummaryTable
              rows={pagedDays}
              loading={loadingMonth}
              showEmployeeColumn={false}           // مهم في بروفايل الموظف
              
              fallbackTZ={user?.tenantTimezone || 'UTC'}
              onOpenDetails={openDetails}
            />
          </div>

          {totalPages > 1 && (
            <div className="up-pagination">
              <button className="up-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                <i className="fas fa-chevron-left" />
              </button>
              <span className="up-page-info">{page} / {totalPages}</span>
              <button className="up-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                <i className="fas fa-chevron-right" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal - Using the shared component with full dayDetails */}
      <EmployeeAttendanceDetailsModal
        show={!!detailsDate}
        loading={loadingDetails}
        dayDetails={dayDetails}                    // ← مهم: نمرر الـ object كامل
        user={user}
        date={detailsDate}
        isAdmin={isAdmin}
        onClose={() => {
          setDetailsDate(null);
          setDayDetails(null);
        }}
        onSaved={async () => {
          await openDetails({ date: detailsDate });
          await reloadMonth();
        }}
      />
    </div>
  );
}

export default UserProfile;











// // src/pages/UserProfile.jsx
// import { useEffect, useMemo, useState } from 'react';
// import { useParams, useNavigate }       from 'react-router-dom';
// import { useTranslation }               from 'react-i18next';
// import { apiGet }                       from '../helpers/api';
// import { isAdmin }                      from '../helpers/auth';

// // ── Components ─────────────────────────────────────────────
// import UserHeader                    from '../components/userProfile/ProfileHeader';
// import UserStats                     from '../components/userProfile/ProfileStats';
// import UserMonthSelector             from '../components/userProfile/UserMonthSelector';
// import UserAttendanceSummaryTable    from '../components/userProfile/UserAttendanceSummaryTable';
// import EmployeeAttendanceDetailsModal from '../components/userProfile/EmployeeAttendanceDetailsModal';
// import UserEmploymentStatus          from '../components/userProfile/UserEmploymentStatus';
// import UserBiometricsSettings        from '../components/userProfile/UserBiometricsSettings';
// import UserFeedbackSection           from '../components/userProfile/UserFeedbackSection';
// import UserAssignedAttendancePolicies from '../components/userProfile/UserAssignedAttendancePolicies';
// import EmployeePayrollHistory        from './payroll/EmployeePayrollHistory';
// import UserDevices                   from '../components/adminDevice/UserDevices';
// import '../style/UserProfile.css';

// // ───────────────────────────────────────────────────────────
// const PAGE_SIZE = 7;
// const admin     = isAdmin(); // ✅ مرة واحدة بس خارج الـ component

// // ── Loading skeleton ───────────────────────────────────────
// function PageSkeleton() {
//   return (
//     <div style={{ padding: '2rem 1rem', maxWidth: 900, margin: '0 auto' }}>
//       {[120, 80, 200].map((h, i) => (
//         <div key={i} style={{
//           height: h, borderRadius: 14, background: '#f1f5f9',
//           marginBottom: 16, animation: 'pulse 1.5s ease-in-out infinite',
//         }} />
//       ))}
//       <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
//     </div>
//   );
// }

// // ── Action button ──────────────────────────────────────────
// function ActionButton({ icon, label, onClick, variant = 'primary' }) {
//   const colors = {
//     primary: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
//     warning: { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
//     success: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
//   };
//   const c = colors[variant] || colors.primary;
//   return (
//     <button
//       onClick={onClick}
//       style={{
//         display: 'inline-flex', alignItems: 'center', gap: 8,
//         padding: '8px 16px', borderRadius: 10, border: `1px solid ${c.border}`,
//         background: c.bg, color: c.color, fontWeight: 600, fontSize: '0.85rem',
//         cursor: 'pointer', transition: 'opacity .15s',
//       }}
//       onMouseEnter={e => e.currentTarget.style.opacity = '.8'}
//       onMouseLeave={e => e.currentTarget.style.opacity = '1'}
//     >
//       <i className={`fa-solid ${icon}`} style={{ fontSize: '0.8rem' }} />
//       {label}
//     </button>
//   );
// }

// // ── Section wrapper ────────────────────────────────────────
// function Section({ children, style }) {
//   return (
//     <div style={{ marginBottom: '1.25rem', ...style }}>
//       {children}
//     </div>
//   );
// }

// // ── Main page ──────────────────────────────────────────────
// function UserProfile() {
//   const { t }      = useTranslation();
//   const { id }     = useParams();
//   const navigate   = useNavigate();

//   // ── State ──────────────────────────────────────────────
//   const [user,           setUser]           = useState(null);
//   const [loading,        setLoading]        = useState(true);
//   const [error,          setError]          = useState(null);
//   const [year,           setYear]           = useState(new Date().getFullYear());
//   const [month,          setMonth]          = useState(new Date().getMonth() + 1);
//   const [monthlySummary, setMonthlySummary] = useState(null);
//   const [page,           setPage]           = useState(1);
//   const [detailsDate,    setDetailsDate]    = useState(null);
//   const [detailsRecords, setDetailsRecords] = useState([]);
//   const [detailsTransits,setDetailsTransits]= useState([]);
//   const [loadingDetails, setLoadingDetails] = useState(false);

//   // ── Load user (once) ───────────────────────────────────
//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         const profileRes  = await apiGet('/users/profile');
//         const targetUser  = id === 'me'
//           ? profileRes.data
//           : (await apiGet(`/users/${id}`)).data.user;
//         setUser(targetUser);

//         const res = await apiGet(
//           `/admin/user-monthly-report?userId=${targetUser._id}&year=${year}&month=${month}`
//         );
//         setMonthlySummary(res.data.report);
//       } catch {
//         setError(t('error'));
//         navigate('/');
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [id]); // ← id فقط

//   // ── Reload month when year/month changes ───────────────
//   useEffect(() => {
//     if (!user?._id) return;
//     const loadMonth = async () => {
//       try {
//         setLoading(true);
//         setPage(1);
//         const res = await apiGet(
//           `/admin/user-monthly-report?userId=${user._id}&year=${year}&month=${month}`
//         );
//         setMonthlySummary(res.data.report);
//       } catch { setMonthlySummary(null); }
//       finally  { setLoading(false); }
//     };
//     loadMonth();
//   }, [year, month]); // ← year/month فقط

//   // ── Reload month helper ────────────────────────────────
//   const reloadMonth = async () => {
//     if (!user?._id) return;
//     setLoading(true);
//     try {
//       const res = await apiGet(
//         `/admin/user-monthly-report?userId=${user._id}&year=${year}&month=${month}`
//       );
//       setMonthlySummary(res.data.report);
//     } finally { setLoading(false); }
//   };

//   // ── Open day details ───────────────────────────────────
//   const openDetails = async ({ date }) => {
//     try {
//       setDetailsDate(date);
//       setLoadingDetails(true);
//       const res = await apiGet(`/attendance/day-details?userId=${user._id}&date=${date}`);
//       setDetailsRecords(res.data.records  || []);
//       setDetailsTransits(res.data.transits || []);
//     } catch {
//       setDetailsRecords([]);
//       setDetailsTransits([]);
//     } finally { setLoadingDetails(false); }
//   };

//   // ── Pagination ─────────────────────────────────────────
//   const pagedDays = useMemo(() => {
//     if (!monthlySummary?.days) return [];
//     return monthlySummary.days.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
//   }, [monthlySummary, page]);

//   const totalPages = useMemo(() => {
//     if (!monthlySummary?.days) return 0;
//     return Math.ceil(monthlySummary.days.length / PAGE_SIZE);
//   }, [monthlySummary]);

//   // ── Guards ─────────────────────────────────────────────
//   if (loading && !user) return <PageSkeleton />;
//   if (error)            return <div className="alert alert-danger m-3">{error}</div>;
//   if (!user)            return null;

//   // ── Render ─────────────────────────────────────────────
//   return (
//     <div style={{ maxWidth: 960, margin: '0 auto', padding: '1rem' }}>

//       {/* ① Header */}
//       <Section>
//         <UserHeader user={user} isAdmin={admin} />
//       </Section>

//       {/* ② Action buttons */}
//       <Section>
//         <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
//           <ActionButton
//             icon="fa-calendar-xmark"
//             label="Leave & Absence"
//             variant="warning"
//             onClick={() => navigate(`/admin/employees/${user._id}/leave-profile`)}
//           />
//           {admin && (
//             <ActionButton
//               icon="fa-calculator"
//               label="Payroll Preview"
//               variant="success"
//               onClick={() => navigate(`/employees/${user._id}/payroll/preview?year=${year}&month=${month}`)}
//             />
//           )}
//         </div>
//       </Section>

//       {/* ③ Attendance */}
//       <Section>
//         <UserMonthSelector
//           year={year} month={month}
//           onChange={({ year, month }) => { setYear(year); setMonth(month); }}
//         />
//         <UserStats monthlyReport={monthlySummary} showPayroll={admin} />
//         <UserAttendanceSummaryTable
//           days={pagedDays} loading={loading}
//           isAdmin={admin} onOpenDetails={openDetails}
//         />
//         {totalPages > 1 && (
//           <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
//             <button className="btn btn-outline-secondary btn-sm" disabled={page === 1}          onClick={() => setPage(p => p - 1)}>◀</button>
//             <span style={{ alignSelf: 'center', fontWeight: 600, fontSize: '0.85rem' }}>{t('common.page')} {page} / {totalPages}</span>
//             <button className="btn btn-outline-secondary btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>▶</button>
//           </div>
//         )}
//       </Section>

//       {/* ④ Admin-only sections */}
//       {admin && (
//         <>
//           <Section>
//             <UserEmploymentStatus
//               user={user}
//               onUpdated={() => window.location.reload()}
//             />
//           </Section>

//           <Section>
//             <UserAssignedAttendancePolicies userId={user._id} />
//           </Section>

//           <Section>
//             <UserBiometricsSettings user={user} onUpdated={() => {}} />
//           </Section>

//           <Section>
//             <EmployeePayrollHistory userId={user._id} />
//           </Section>

//           <Section>
//             <UserDevices
//               user={user}
//               onUpdated={async () => {
//                 const res = await apiGet(`/users/${user._id}`);
//                 setUser(res.data.user);
//               }}
//             />
//           </Section>
//         </>
//       )}

//       {/* ⑤ Feedback — للجميع */}
//       <Section>
//         <UserFeedbackSection userId={user._id} isAdmin={admin} />
//       </Section>

//       {/* Details modal */}
//       <EmployeeAttendanceDetailsModal
//         show={!!detailsDate}   loading={loadingDetails}
//         records={detailsRecords} transits={detailsTransits}
//         user={user}            date={detailsDate}
//         isAdmin={admin}        onClose={() => setDetailsDate(null)}
//         onSaved={async () => {
//           await openDetails({ date: detailsDate });
//           await reloadMonth();
//         }}
//       />
//     </div>
//   );
// }

// export default UserProfile;