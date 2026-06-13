// import { useTranslation } from 'react-i18next';

// const EmployeeAttendanceFilters = ({
//   branches = [],
//   filters,
//   onChange
// }) => {
//   const { t } = useTranslation();

//   const handleChange = (key, value) => {
//     onChange({ ...filters, [key]: value });
//   };

//   return (
//     <div className="card shadow-sm mb-4">
//       <div className="card-body">
//         <h5 className="card-title mb-3">
//           <i className="fas fa-filter me-2" />
//           {t('attendanceFilters')}
//         </h5>

//         <div className="row">
//           {/* Branch */}
//           <div className="col-md-3 mb-3">
//             <label className="form-label">{t('selectBranch')}</label>
//             <select
//               className="form-select"
//               value={filters.branchId}
//               onChange={(e) => handleChange('branchId', e.target.value)}
//             >
//               <option value="">{t('allBranches')}</option>
//               {branches.map((b) => (
//                 <option key={b._id} value={b._id}>
//                   {b.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Date */}
//           <div className="col-md-3 mb-3">
//             <label className="form-label">{t('selectDate')}</label>
//             <input
//               type="date"
//               className="form-control"
//               value={filters.date}
//               onChange={(e) => handleChange('date', e.target.value)}
//             />
//           </div>

//           {/* Employee name */}
//           <div className="col-md-3 mb-3">
//             <label className="form-label">{t('name')}</label>
//             <input
//               type="text"
//               className="form-control"
//               value={filters.name}
//               placeholder={t('searchByName')}
//               onChange={(e) => handleChange('name', e.target.value)}
//             />
//           </div>

//           {/* Day Status */}
//           <div className="col-md-3 mb-3">
//             <label className="form-label">{t('status')}</label>
//             <select
//               className="form-select"
//               value={filters.status}
//               onChange={(e) => handleChange('status', e.target.value)}
//             >
//               <option value="">{t('all')}</option>
//               <option value="working">{t('working')}</option>
//               <option value="holiday">{t('holiday')}</option>
//               <option value="leave_paid">{t('leave_paid')}</option>
//               <option value="partial_leave">{t('partial_leave')}</option>
//               <option value="absent">{t('absent')}</option>
//               <option value="invalidated">{t('invalidated')}</option>
//             </select>
//           </div>
//         </div>

//         {/* Extra flags */}
//         <div className="row mt-2">
//           <div className="col-md-4">
//             <div className="form-check">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 checked={filters.invalidatedOnly}
//                 onChange={(e) =>
//                   handleChange('invalidatedOnly', e.target.checked)
//                 }
//                 id="invalidatedOnly"
//               />
//               <label className="form-check-label" htmlFor="invalidatedOnly">
//                 {t('invalidatedOnly')}
//               </label>
//             </div>
//           </div>

//           <div className="col-md-4">
//             <div className="form-check">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 checked={filters.remoteOnly}
//                 onChange={(e) =>
//                   handleChange('remoteOnly', e.target.checked)
//                 }
//                 id="remoteOnly"
//               />
//               <label className="form-check-label" htmlFor="remoteOnly">
//                 {t('remoteOnly')}
//               </label>
//             </div>
//           </div>

//           <div className="col-md-4">
//             <div className="form-check">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 checked={filters.outOfLocationOnly}
//                 onChange={(e) =>
//                   handleChange('outOfLocationOnly', e.target.checked)
//                 }
//                 id="outOfLocationOnly"
//               />
//               <label className="form-check-label" htmlFor="outOfLocationOnly">
//                 {t('outOfLocationOnly')}
//               </label>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeAttendanceFilters;
// import { useEffect, useState } from 'react';
// import { apiGet } from '../../helpers/api';

// const EmployeeAttendanceFilters = ({ onChange }) => {
//   // ✅ state داخلي آمن
//   const [branches, setBranches] = useState([]);

//   const [filters, setFilters] = useState({
//     branchId: '',
//     date: '',
//     name: '',
//     status: '',
//     invalidated: false,
//     remoteOnly: false,
//     outOfLocation: false
//   });

//   // ===== Fetch branches =====
//   useEffect(() => {
//     const fetchBranches = async () => {
//       try {
//         const res = await apiGet('/branches');
//         setBranches(res.data || []);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchBranches();
//   }, []);

//   // ===== Emit filters to parent =====
//   // useEffect(() => {
//   //   /**
//   //    * نطلع object نظيف للباك
//   //    */
//   //   const payload = {};

//   //   if (filters.branchId) payload.branchId = filters.branchId;
//   //   if (filters.date) {
//   //     payload.from = filters.date;
//   //     payload.to = filters.date;
//   //   }
//   //   if (filters.name) payload.name = filters.name;
//   //   if (filters.status) payload.status = filters.status;
//   //   if (filters.invalidated) payload.invalidated = 'true';
//   //   if (filters.remoteOnly) payload.remoteOnly = 'true';
//   //   if (filters.outOfLocation) payload.outOfLocation = 'true';

//   //   onChange(payload);
//   // }, [filters, onChange]);
// const applyFilters = () => {
//   const payload = {};

//   if (filters.branchId) payload.branchId = filters.branchId;
//   if (filters.date) {
//     payload.from = filters.date;
//     payload.to = filters.date;
//   }
//   if (filters.name) payload.name = filters.name;
//   if (filters.status) payload.status = filters.status;
//   if (filters.invalidated) payload.invalidated = 'true';
//   if (filters.remoteOnly) payload.remoteOnly = 'true';
//   if (filters.outOfLocation) payload.outOfLocation = 'true';

//   onChange(payload);
// };

//   return (
//     <div className="card shadow-sm mb-4">
//       <div className="card-body">
//         <h5 className="mb-3">
//           <i className="fas fa-filter me-2" />
//           فلترة الحضور
//         </h5>

//         <div className="row">
//           {/* Branch */}
//           <div className="col-md-3 mb-3">
//             <label className="form-label">الفرع</label>
//             <select
//               className="form-select"
//               value={filters.branchId}
//               onChange={(e) =>
//                 setFilters((p) => ({ ...p, branchId: e.target.value }))
//               }
//             >
//               <option value="">كل الفروع</option>
//               {branches.map((b) => (
//                 <option key={b._id} value={b._id}>
//                   {b.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Date */}
//           <div className="col-md-3 mb-3">
//             <label className="form-label">التاريخ</label>
//             <input
//               type="date"
//               className="form-control"
//               value={filters.date}
//               onChange={(e) =>
//                 setFilters((p) => ({ ...p, date: e.target.value }))
//               }
//             />
//           </div>

//           {/* Name */}
//           <div className="col-md-3 mb-3">
//             <label className="form-label">اسم الموظف</label>
//             <input
//               type="text"
//               className="form-control"
//               value={filters.name}
//               onChange={(e) =>
//                 setFilters((p) => ({ ...p, name: e.target.value }))
//               }
//             />
//           </div>

//           {/* Status */}
//           <div className="col-md-3 mb-3">
//             <label className="form-label">حالة اليوم</label>
//             <select
//               className="form-select"
//               value={filters.status}
//               onChange={(e) =>
//                 setFilters((p) => ({ ...p, status: e.target.value }))
//               }
//             >
//               <option value="">كل الحالات</option>
//               <option value="working">Working</option>
//               <option value="holiday">Holiday</option>
//               <option value="leave_paid">Leave Paid</option>
//               <option value="partial_leave">Partial Leave</option>
//               <option value="absent">Absent</option>
//               <option value="invalidated">Invalidated</option>
//             </select>
//           </div>
//         </div>

//         <div className="row mt-2">
//           <div className="col-md-4">
//             <div className="form-check">
//               <input
//                 type="checkbox"
//                 className="form-check-input"
//                 checked={filters.invalidated}
//                 onChange={(e) =>
//                   setFilters((p) => ({
//                     ...p,
//                     invalidated: e.target.checked
//                   }))
//                 }
//               />
//               <label className="form-check-label">
//                 السجلات المُبطلة فقط
//               </label>
//             </div>
//           </div>

//           <div className="col-md-4">
//             <div className="form-check">
//               <input
//                 type="checkbox"
//                 className="form-check-input"
//                 checked={filters.outOfLocation}
//                 onChange={(e) =>
//                   setFilters((p) => ({
//                     ...p,
//                     outOfLocation: e.target.checked
//                   }))
//                 }
//               />
//               <label className="form-check-label">
//                 خارج نطاق الفرع
//               </label>
//             </div>
//           </div>

//           <div className="col-md-4">
//             <div className="form-check">
//               <input
//                 type="checkbox"
//                 className="form-check-input"
//                 checked={filters.remoteOnly}
//                 onChange={(e) =>
//                   setFilters((p) => ({
//                     ...p,
//                     remoteOnly: e.target.checked
//                   }))
//                 }
//               />
//               <label className="form-check-label">
//                 تسجيلات عن بُعد
//               </label>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeAttendanceFilters;
// import { useMemo } from 'react';
// import { useTranslation } from 'react-i18next';

// /**
//  * نفس منطق AdminDashboard بالظبط
//  * UI فقط – المابينج الحقيقي بيحصل في EmployeeAttendancePage
//  */
// const DEFAULT_FILTERS = {
//   branchId: '',
//   date: '',
//   name: '',
//   status: '',
//   invalidated: false,
//   remoteOnly: false,
//   outOfLocation: false
// };

// const EmployeeAttendanceFilters = ({
//   filters = DEFAULT_FILTERS,
//   branches = [],
//   onChange
// }) => {
//   const { t } = useTranslation();

//   // 🔐 Safe object – يمنع أي crash
//   const safeFilters = useMemo(
//     () => ({ ...DEFAULT_FILTERS, ...(filters || {}) }),
//     [filters]
//   );

//   const update = (key, value) => {
//     if (!onChange) return;
//     onChange({
//       ...safeFilters,
//       [key]: value
//     });
//   };

//   return (
//     <div className="card shadow-sm mb-4">
//       <div className="card-body">
//         <h5 className="card-title mb-3">
//           <i className="fas fa-filter me-2" />
//           {t('attendanceFilters') || 'Attendance Filters'}
//         </h5>

//         {/* ===== Row 1 ===== */}
//         <div className="row">
//           {/* Branch */}
//           <div className="col-md-3 mb-3">
//             <label className="form-label">{t('selectBranch')}</label>
//             <select
//               className="form-select"
//               value={safeFilters.branchId}
//               onChange={(e) => update('branchId', e.target.value)}
//             >
//               <option value="">{t('allBranches')}</option>
//               {branches.map((b) => (
//                 <option key={b._id} value={b._id}>
//                   {b.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Date */}
//           <div className="col-md-3 mb-3">
//             <label className="form-label">{t('selectDate')}</label>
//             <input
//               type="date"
//               className="form-control"
//               value={safeFilters.date}
//               onChange={(e) => update('date', e.target.value)}
//             />
//           </div>

//           {/* Name */}
//           <div className="col-md-3 mb-3">
//             <label className="form-label">{t('name')}</label>
//             <input
//               type="text"
//               className="form-control"
//               placeholder={t('searchByName') || 'Search by name'}
//               value={safeFilters.name}
//               onChange={(e) => update('name', e.target.value)}
//             />
//           </div>

//           {/* Status */}
//           <div className="col-md-3 mb-3">
//             <label className="form-label">{t('status')}</label>
//             <select
//               className="form-select"
//               value={safeFilters.status}
//               onChange={(e) => update('status', e.target.value)}
//             >
//               <option value="">{t('allStatuses') || 'All statuses'}</option>
//               <option value="working">{t('working') || 'Working'}</option>
//               <option value="holiday">{t('holiday') || 'Holiday'}</option>
//               <option value="leave_paid">{t('leave_paid') || 'Paid leave'}</option>
//               <option value="partial_leave">
//                 {t('partial_leave') || 'Partial leave'}
//               </option>
//               <option value="absent">{t('absent') || 'Absent'}</option>
//               <option value="invalidated">
//                 {t('invalidated') || 'Invalidated'}
//               </option>
//             </select>
//           </div>
//         </div>

//         {/* ===== Row 2 ===== */}
//         <div className="row mt-2">
//           <div className="col-md-4 mb-2">
//             <div className="form-check">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 checked={safeFilters.invalidated}
//                 onChange={(e) => update('invalidated', e.target.checked)}
//                 id="filter-invalidated"
//               />
//               <label className="form-check-label" htmlFor="filter-invalidated">
//                 عرض السجلات المُبطلة فقط
//               </label>
//             </div>
//           </div>

//           <div className="col-md-4 mb-2">
//             <div className="form-check">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 checked={safeFilters.remoteOnly}
//                 onChange={(e) => update('remoteOnly', e.target.checked)}
//                 id="filter-remote"
//               />
//               <label className="form-check-label" htmlFor="filter-remote">
//                 تسجيلات عن بُعد فقط
//               </label>
//             </div>
//           </div>

//           <div className="col-md-4 mb-2">
//             <div className="form-check">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 checked={safeFilters.outOfLocation}
//                 onChange={(e) => update('outOfLocation', e.target.checked)}
//                 id="filter-out"
//               />
//               <label className="form-check-label" htmlFor="filter-out">
//                 خارج نطاق الفرع فقط
//               </label>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeAttendanceFilters;
// import { useTranslation } from 'react-i18next';

// const EmployeeAttendanceFilters = ({
//   branches = [],
//   selectedBranch,
//   selectedDate,
//   name,
//   status,
//   invalidOnly,
//   remoteOnly,
//   outOfLocationOnly,
//   onBranchChange,
//   onDateChange,
//   onNameChange,
//   onStatusChange,
//   onInvalidChange,
//   onRemoteChange,
//   onOutOfLocationChange,
//   total = 0
// }) => {
//   const { t } = useTranslation();

//   return (
//     <div className="card shadow-sm mb-4">
//       <div className="card-body">
//         <h3 className="card-title">
//           <i className="fas fa-filter me-2" />
//           {t('attendanceFilters')}
//         </h3>

//         {/* ===== Row 1 ===== */}
//         <div className="row">
//           {/* Branch */}
//           <div className="col-md-3 mb-3">
//             <label className="form-label">{t('selectBranch')}</label>
//             <select
//               className="form-select"
//               value={selectedBranch}
//               onChange={(e) => onBranchChange(e.target.value)}
//             >
//               <option value="">{t('allBranches')}</option>
//               {branches.map((b) => (
//                 <option key={b._id} value={b._id}>
//                   {b.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Date */}
//           <div className="col-md-3 mb-3">
//             <label className="form-label">{t('selectDate')}</label>
//             <input
//               type="date"
//               className="form-control"
//               value={selectedDate}
//               onChange={(e) => onDateChange(e.target.value)}
//             />
//           </div>

//           {/* Name */}
//           <div className="col-md-3 mb-3">
//             <label className="form-label">{t('name')}</label>
//             <input
//               type="text"
//               className="form-control"
//               value={name}
//               onChange={(e) => onNameChange(e.target.value)}
//             />
//           </div>

//           {/* Status */}
//           <div className="col-md-3 mb-3">
//             <label className="form-label">{t('status')}</label>
//             <select
//               className="form-select"
//               value={status}
//               onChange={(e) => onStatusChange(e.target.value)}
//             >
//               <option value="">{t('allStatuses')}</option>
//               <option value="working">{t('working')}</option>
//               <option value="holiday">{t('holiday')}</option>
//               <option value="leave_paid">{t('leave_paid')}</option>
//               <option value="partial_leave">{t('partial_leave')}</option>
//               <option value="absent">{t('absent')}</option>
//               <option value="invalidated">{t('invalidated')}</option>
//             </select>
//           </div>
//         </div>

//         {/* ===== Row 2 ===== */}
//         <div className="row mt-2">
//           <div className="col-md-4 mb-2">
//             <div className="form-check">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 checked={invalidOnly}
//                 onChange={(e) => onInvalidChange(e.target.checked)}
//                 id="invalidOnly"
//               />
//               <label className="form-check-label" htmlFor="invalidOnly">
//                 عرض السجلات المُبطلة فقط
//               </label>
//             </div>
//           </div>

//           <div className="col-md-4 mb-2">
//             <div className="form-check">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 checked={remoteOnly}
//                 onChange={(e) => onRemoteChange(e.target.checked)}
//                 id="remoteOnly"
//               />
//               <label className="form-check-label" htmlFor="remoteOnly">
//                 تسجيلات عن بُعد فقط
//               </label>
//             </div>
//           </div>

//           <div className="col-md-4 mb-2">
//             <div className="form-check">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 checked={outOfLocationOnly}
//                 onChange={(e) => onOutOfLocationChange(e.target.checked)}
//                 id="outOfLocationOnly"
//               />
//               <label className="form-check-label" htmlFor="outOfLocationOnly">
//                 خارج نطاق الفرع فقط
//               </label>
//             </div>
//           </div>
//         </div>

//         <small className="text-muted d-block mt-2">
//           إجمالي سجلات الحضور: {total}
//         </small>
//       </div>
//     </div>
//   );
// };

// export default EmployeeAttendanceFilters;



// src/pages/admin/EmployeeAttendanceFilters.jsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiGet } from '../../helpers/api';

// Decision types — values must match backend DailyAttendanceSummary.decisionType enum
const DECISION_TYPES = [
  'WORKING_DAY',
  'ABSENT_NO_PERMISSION',
  'LEAVE_PAID',
  'LEAVE_UNPAID',
  'NON_WORKING_DAY',
  'NO_DATA',
];

const EmployeeAttendanceFilters = ({ filters, onChange }) => {
  const { t } = useTranslation('attendance');
  const [branches, setBranches] = useState([]);

  // ── branches from backend (not passed from parent) ───────────
  useEffect(() => {
    apiGet('/branches')
      .then(res => setBranches(res.data || []))
      .catch(() => {});
  }, []);

  const update = (key, value) => onChange({ ...filters, [key]: value });

  // when user picks single date → send as both from & to
  // const handleDate = (val) => {
  //   onChange({ ...filters, from: val, to: val });
  // };

  return (
    <div className="att-filters-card">
      <div className="att-filters-title">
        <i className="fas fa-filter" />
        {t('attendanceFilters')}
      </div>

      <div className="att-filters-grid">

        {/* Branch */}
        <div className="att-filter-group">
          <label>{t('branch')}</label>
          <select
            className="form-select"
            value={filters.branchId}
            onChange={e => update('branchId', e.target.value)}
          >
            <option value="">{t('allBranches')}</option>
            {branches.map(b => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Date (single day → from+to) */}
        {/* <div className="att-filter-group">
          <label>{t('date')}</label>
          <input
            type="date"
            className="form-control"
            value={filters.from || ''}
            onChange={e => handleDate(e.target.value)}
          />
        </div> */}

        {/* Date From */}
        <div className="att-filter-group">
          <label>{t('from')}</label>
          <input
            type="date"
            className="form-control"
            value={filters.from || ''}
            max={filters.to || undefined}
            onChange={e => update('from', e.target.value)}
          />
        </div>

        {/* Date To */}
        <div className="att-filter-group">
          <label>{t('to')}</label>
          <input
            type="date"
            className="form-control"
            value={filters.to || ''}
            min={filters.from || undefined}
            onChange={e => update('to', e.target.value)}
          />
        </div>

        {/* Employee name */}
        <div className="att-filter-group">
          <label>{t('employee')}</label>
          <input
            type="text"
            className="form-control"
            placeholder={t('searchByName')}
            value={filters.name}
            onChange={e => update('name', e.target.value)}
          />
        </div>

        {/* Decision type (from backend enum) */}
        <div className="att-filter-group">
          <label>{t('dayStatus')}</label>
          <select
            className="form-select"
            value={filters.decisionType}
            onChange={e => update('decisionType', e.target.value)}
          >
            <option value="">{t('all')}</option>
            {DECISION_TYPES.map(dt => (
              <option key={dt} value={dt}>{t(dt)}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Footer row */}
      <div className="att-filter-footer">
        <label className="att-filter-check">
          <input
            type="checkbox"
            checked={filters.invalidated === 'true'}
            onChange={e => update('invalidated', e.target.checked ? 'true' : '')}
          />
          <label>{t('invalidatedOnly')}</label>
        </label>

        {/* Clear all */}
        {Object.values(filters).some(Boolean) && (
          <button
            className="att-btn att-btn-ghost att-btn-sm"
            onClick={() => onChange({
              branchId: '', from: '', to: '', name: '', decisionType: '', invalidated: '',
            })}
          >
            <i className="fas fa-times" />
            {t('clearFilters')}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeAttendanceFilters;

// import { useTranslation } from 'react-i18next';

// const EmployeeAttendanceFilters = ({
//   branches = [],
//   filters,
//   onChange,
//   total = 0
// }) => {
//   const { t } = useTranslation();

//   const update = (key, value) => {
//     onChange({
//       ...filters,
//       [key]: value
//     });
//   };

//   return (
//     <div className="card shadow-sm mb-4">
//       <div className="card-body">
//         <h5 className="mb-3">
//           <i className="fas fa-filter me-2" />
//           {t('attendanceFilters')}
//         </h5>

//         <div className="row g-3">
//           {/* Branch */}
//           <div className="col-md-3">
//             <label className="form-label">{t('branch')}</label>
//             <select
//               className="form-select"
//               value={filters.branchId || ''}
//               onChange={(e) => update('branchId', e.target.value)}
//             >
//               <option value="">{t('allBranches')}</option>
//               {branches.map(b => (
//                 <option key={b._id} value={b._id}>
//                   {b.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Date */}
//           <div className="col-md-3">
//             <label className="form-label">{t('date')}</label>
//             <input
//               type="date"
//               className="form-control"
//               value={filters.date || ''}
//               onChange={(e) => update('date', e.target.value)}
//             />
//           </div>

//           {/* Name */}
//           <div className="col-md-3">
//             <label className="form-label">{t('employee')}</label>
//             <input
//               type="text"
//               className="form-control"
//               placeholder={t('searchByName')}
//               value={filters.name || ''}
//               onChange={(e) => update('name', e.target.value)}
//             />
//           </div>

//           {/* Day Status */}
//           <div className="col-md-3">
//             <label className="form-label">{t('dayStatus')}</label>
//             <select
//               className="form-select"
//               value={filters.status || ''}
//               onChange={(e) => update('status', e.target.value)}
//             >
//               <option value="">{t('all')}</option>
//               <option value="working">{t('working')}</option>
//               <option value="holiday">{t('holiday')}</option>
//               <option value="leave_paid">{t('leave_paid')}</option>
//               <option value="leave_unpaid">{t('leave_unpaid')}</option>
//               <option value="partial_leave">{t('partial_leave')}</option>
//               <option value="absent">{t('absent')}</option>
//             </select>
//           </div>
//         </div>

//         {/* Flags */}
//         <div className="form-check mt-3">
//           <input
//             className="form-check-input"
//             type="checkbox"
//             id="invalidatedOnly"
//             checked={filters.invalidated === 'true'}
//             onChange={(e) =>
//               update('invalidated', e.target.checked ? 'true' : '')
//             }
//           />
//           <label className="form-check-label" htmlFor="invalidatedOnly">
//             {t('invalidatedOnly')}
//           </label>
//         </div>

//         <small className="text-muted d-block mt-2">
//           {t('total')}: {total}
//         </small>
//       </div>
//     </div>
//   );
// };

// export default EmployeeAttendanceFilters;
