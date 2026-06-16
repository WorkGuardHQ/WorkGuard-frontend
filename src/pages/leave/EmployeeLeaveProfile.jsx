



// // used in user profile (leave and absence button)
// import { useParams } from 'react-router-dom';
// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';

// /* ===================== Hooks ===================== */
// import useLeaveProfileSnapshot from '../../components/leave/hooks/useLeaveProfileSnapshot';

// /* ===================== UI ===================== */
// import LeaveBalanceSummary from '../../components/leave/components/LeaveBalanceSummary';
// import LeaveRequestsTable from '../../components/leave/profile/LeaveRequestsTable';
// import AbsenceDetailsModal from '../../components/leave/absence/AbsenceDetailsModal';
// import Toast from '../../components/ui/Toast';
// import LeaveTabs from '../../components/leave/profile/LeaveTabs';
// import AdjustBalanceModal from '../../components/leave/profile/AdjustBalanceModal';

// /* ===================== API ===================== */
// import { adjustLeaveBalance } from '../../services/Leave-services/adminLeaveApi';

// function EmployeeLeaveProfile() {
//   const { userId } = useParams();
//   const { t } = useTranslation();
//   const isAdmin = true;

//   /* ======================
//      Adjust Balance State
//   ====================== */
//   const [showAdjust, setShowAdjust] = useState(false);
//   const [adjustLoading, setAdjustLoading] = useState(false);

//   /* ======================
//      Filters (UI state)
//   ====================== */
//   const today = new Date();
//   const [year, setYear] = useState(today.getFullYear());
//   const [month, setMonth] = useState(today.getMonth() + 1);
//   const [activeTab, setActiveTab] = useState('summary');

//   /* ======================
//      Snapshot (DATA SOURCE)
//   ====================== */
//   const {
//     loading,
//     error,
//     summary,
//     leaveYear,
//     leaves,
//     page,
//     pages,
//     setPage,
//     absenceMonth,
//     refresh
//   } = useLeaveProfileSnapshot({
//     userId,
//     year,
//     month,
//     isAdmin,
//     activeTab
//   });

//   /* ======================
//      Toast
//   ====================== */
//   const [toast, setToast] = useState(null);

//   /* ======================
//      States
//   ====================== */
//   if (loading) {
//     return <div className="text-center py-5">{t('loading')}...</div>;
//   }

//   if (error) {
//     return <div className="alert alert-danger">{error}</div>;
//   }

//   return (
//     <div className="container py-4">

//       {/* ================= Header ================= */}
//       <div className="d-flex justify-content-between mb-4">
//         <div>
//           <h4>{t('employee.leaveProfile')}</h4>
//           <div className="text-muted small">
//             {t('employee.leaveProfileDesc')}
//           </div>
//         </div>

//         <div className="d-flex gap-2">
//           <select
//             className="form-select"
//             value={year}
//             onChange={e => setYear(Number(e.target.value))}
//           >
//             {[0, 1, 2].map(i => {
//               const y = today.getFullYear() - i;
//               return <option key={y} value={y}>{y}</option>;
//             })}
//           </select>

//           <select
//             className="form-select"
//             value={month}
//             onChange={e => setMonth(Number(e.target.value))}
//           >
//             {Array.from({ length: 12 }).map((_, i) => (
//               <option key={i + 1} value={i + 1}>
//                 {t(`months.${i + 1}`)}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* ================= Tabs ================= */}
//       <LeaveTabs
//         active={activeTab}
//         onChange={setActiveTab}
//       />

//       {/* ================= Summary ================= */}
//       {activeTab === 'summary' && summary && (
//         <>
//           {/* 🔥 Adjust Button */}
//           {isAdmin && (
//             <button
//               className="btn btn-primary mb-3"
//               onClick={() => setShowAdjust(true)}
//             >
//               {t('leave.adjustBalance')}
//             </button>
//           )}

//           <LeaveBalanceSummary summary={summary} />
//         </>
//       )}

//       {/* ================= Requests ================= */}
//       {activeTab === 'requests' && (
//         <LeaveRequestsTable
//           leaves={leaves}
//           loading={loading}
//           page={page}
//           pages={pages}
//           onPageChange={setPage}
//           onViewDetails={(id) =>
//             window.open(`/leaves/${id}`, '_blank')
//           }
//         />
//       )}

//       {/* ================= Absence ================= */}
//       {activeTab === 'absence' && (
//         <AbsenceDetailsModal
//           data={absenceMonth}
//           year={year}
//           month={month}
//         />
//       )}

//       {/* ================= Adjust Modal ================= */}
//       <AdjustBalanceModal
//         show={showAdjust}
//         onClose={() => setShowAdjust(false)}
//         userId={userId}
//         year={year}
//         loading={adjustLoading}
//         onSubmit={async (payload) => {
//           try {
//             setAdjustLoading(true);

//             await adjustLeaveBalance({
//   userId,
//   ...payload
// });

//             await refresh(); // 🔥 refresh data

//             setToast({
//               type: 'success',
//               message: t('leave.balanceUpdated')
//             });

//           } catch (err) {
//             setToast({
//               type: 'error',
//               message:
//                 err?.response?.data?.message ||
//                 t('leave.updateFailed')
//             });
//           } finally {
//             setAdjustLoading(false);
//           }
//         }}
//       />

//       {/* ================= Toast ================= */}
//       {toast && (
//         <Toast {...toast} onClose={() => setToast(null)} />
//       )}
//     </div>
//   );
// }

// export default EmployeeLeaveProfile;





import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getTokenPayload } from '../../helpers/auth';

/* ===================== Hooks ===================== */
import useLeaveProfileSnapshot from '../../components/leave/hooks/useLeaveProfileSnapshot';

/* ===================== UI ===================== */
import LeaveBalanceSummary from '../../components/leave/components/LeaveBalanceSummary';
import LeaveRequestsTable from '../../components/leave/profile/LeaveRequestsTable';
import AbsenceDetailsModal from '../../components/leave/absence/AbsenceDetailsModal';
import Toast from '../../components/ui/Toast';
import LeaveTabs from '../../components/leave/profile/LeaveTabs';
import AdjustBalanceModal from '../../components/leave/profile/AdjustBalanceModal';
import AdjustmentHistoryTable from '../../components/leave/profile/AdjustmentHistoryTable'; 

/* ===================== API ===================== */
import { adjustLeaveBalance } from '../../services/Leave-services/adminLeaveApi';

function EmployeeLeaveProfile() {
  const { userId } = useParams();
 const { t } = useTranslation('leave');
const { t: tCommon } = useTranslation('translation');

// const isAdmin = true;
const payload = getTokenPayload();
const isAdmin = payload?.role === 'admin';
  const [showAdjust, setShowAdjust] = useState(false);
  const [adjustLoading, setAdjustLoading] = useState(false);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [activeTab, setActiveTab] = useState('summary');

  const {
    loading,
    error,
    summary,
    leaveYear,
    adjustmentHistory, 
    historyPage,   // ✅ أضف
    historyPages,  // ✅ أضف
    historyTotal, 
    leaves,
    page,
    pages,
    setPage,
    absenceMonth,
    refresh,
      setHistoryPage, // ✅

  } = useLeaveProfileSnapshot({ userId, year, month, isAdmin, activeTab });

  const [toast, setToast] = useState(null);

  if (loading) return <div className="text-center py-5">{t('loading')}...</div>;
  if (error)   return <div className="alert alert-danger">{error}</div>;
// console.log('userId:', userId);
  return (
    <div className="container py-4">

      {/* ================= Header ================= */}
  <div className="d-flex justify-content-between mb-4">
  <div>
    <h4>{t('employee.leaveProfile')}</h4>
    <div className="text-white small">
      {t('employee.leaveProfileDesc')}
    </div>
  </div>

  <div className="d-flex gap-2">
    {/* ✅ Year فقط في الـ header */}
    <select
      className="form-select"
      value={year}
      onChange={e => setYear(Number(e.target.value))}
    >
      {[0, 1, 2].map(i => {
        const y = today.getFullYear() - i;
        return <option key={y} value={y}>{y}</option>;
      })}
    </select>
  </div>
</div>

      {/* ================= Tabs ================= */}
      <LeaveTabs active={activeTab} onChange={setActiveTab} />

      {/* ================= Summary ================= */}
      {activeTab === 'summary' && summary && (
        <>
          {isAdmin && (
            <button className="btn btn-primary mb-3" onClick={() => setShowAdjust(true)}>
              {t('leave.adjustBalance')}
            </button>
          )}

          <LeaveBalanceSummary summary={summary} />

          {/* ✅ Adjustment History */}
          {isAdmin && adjustmentHistory?.length > 0 && (
            <AdjustmentHistoryTable
    history={adjustmentHistory}
    page={historyPage}
    pages={historyPages}
    total={historyTotal}
    onPageChange={setHistoryPage}
  />
          )}
        </>
      )}

      {/* ================= Requests ================= */}
      {activeTab === 'requests' && (
        <LeaveRequestsTable
          leaves={leaves}
          loading={loading}
          page={page}
          pages={pages}
          onPageChange={setPage}
          onViewDetails={(id) => window.open(`/leaves/${id}`, '_blank')}
            isAdmin={isAdmin} 
        />
      )}

      {/* ================= Absence ================= */}
     {activeTab === 'absence' && (
  <>
    {/* ✅ Month selector جوه تاب الـ absence بس */}
    <div className="d-flex gap-2 mb-3">
      <select
        className="form-select"
        value={month}
        onChange={e => setMonth(Number(e.target.value))}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {t(`months.${i + 1}`)}
          </option>
        ))}
      </select>
    </div>

    <AbsenceDetailsModal
      data={absenceMonth}
      year={year}
      month={month}
    />
  </>
)}

      {/* ================= Adjust Modal ================= */}
      <AdjustBalanceModal
        show={showAdjust}
        onClose={() => setShowAdjust(false)}
        userId={userId}
        year={year}
        loading={adjustLoading}
        onSubmit={async (payload) => {
          try {
            setAdjustLoading(true);
            await adjustLeaveBalance({ userId, ...payload });
            await refresh();
            setToast({ type: 'success', message: t('leave.balanceUpdated') });
            setShowAdjust(false); // ✅ أغلق الـ modal بعد النجاح
          } catch (err) {
            setToast({ type: 'error', message: err?.response?.data?.message || t('leave.updateFailed') });
          } finally {
            setAdjustLoading(false);
          }
        }}
      />

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default EmployeeLeaveProfile;