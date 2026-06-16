

// import React, { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { getBranches, searchUsers } from '../../services/holiday.api';

// const HolidayFormModal = ({ show, editingHoliday, onClose, onSave }) => {
//   const { t } = useTranslation();

//   const [form, setForm] = useState({
//     name: '',
//     startDate: '',
//     endDate: '',
//     scope: 'global',
//     branch: '',
//     user: '',
//      userObj: null
//   });

//   const [branches, setBranches] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const [userQuery, setUserQuery] = useState('');
//   const [userResults, setUserResults] = useState([]);
//   const [searchingUsers, setSearchingUsers] = useState(false);

//   /* =========================
//      Init form (create / edit)
//   ========================= */
//   useEffect(() => {
//     if (!show) return;

//     if (editingHoliday) {
//       setForm({
//         name: editingHoliday.name || '',
//         startDate: editingHoliday.startDate?.slice(0, 10) || '',
//         endDate: editingHoliday.endDate?.slice(0, 10) || '',
//         scope: editingHoliday.scope,
//         branch: editingHoliday.branch?._id || '',
//         user: editingHoliday.user?._id || '',
//                 userObj: editingHoliday.user || null

//       });

//       if (editingHoliday.user) {
//         setUserQuery(
//           `${editingHoliday.user.name} (${editingHoliday.user.email})`
//         );
//       }
//     } else {
//       setForm({
//         name: '',
//         startDate: '',
//         endDate: '',
//         scope: 'global',
//         branch: '',
//         user: '',
//       userObj: null

//       });
//       setUserQuery('');
//     }

//     setErrors({});
//     setUserResults([]);
//   }, [editingHoliday, show]);

//   /* =========================
//      Load branches
//   ========================= */
//   useEffect(() => {
//     if (!show) return;

//     (async () => {
//       try {
//         const data = await getBranches();
//         setBranches(data.data || data || []);
//       } catch (err) {
//         console.error('Load branches error', err);
//       }
//     })();
//   }, [show]);

//   /* =========================
//      User search (CREATE only)
//   ========================= */
//   useEffect(() => {
//     if (editingHoliday) return;
//     if (form.scope !== 'user' || !form.branch) return;
//     if (userQuery.length < 2) {
//       setUserResults([]);
//       return;
//     }

//     const tId = setTimeout(async () => {
//       setSearchingUsers(true);
//       try {
//         const res = await searchUsers(userQuery, form.branch);
//         setUserResults(res || []);
//       } finally {
//         setSearchingUsers(false);
//       }
//     }, 300);

//     return () => clearTimeout(tId);
//   }, [userQuery, form.branch, form.scope, editingHoliday]);

//   /* =========================
//      Validation (front-only)
//   ========================= */
//   const validate = () => {
//     const e = {};

//     if (!form.name.trim()) e.name = t('holidays.nameRequired');
//     if (!form.startDate) e.startDate = t('holidays.dateRequired');
//     if (form.endDate && form.endDate < form.startDate) {
//       e.range = t('holidays.invalidDateRange');
//     }

//     if (!editingHoliday) {
//       if (form.scope === 'branch' && !form.branch) {
//         e.branch = t('holidays.branchRequired');
//       }
//       if (form.scope === 'user') {
//         if (!form.branch) e.branch = t('holidays.branchRequired');
//         if (!form.user) e.user = t('holidays.userRequired');
//       }
//     }

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   /* =========================
//      Submit
//   ========================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setLoading(true);
//     try {
//       const payload = {
//         name: form.name.trim(),
//         startDate: form.startDate,
//         endDate: form.endDate || form.startDate
//       };

//       if (!editingHoliday) {
//         payload.scope = form.scope;
//         if (form.scope === 'branch') payload.branch = form.branch;
//         if (form.scope === 'user') payload.user = form.user;
//       }

//       await onSave(payload);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!show) return null;

//   return (
//     <div className="hm-modal-overlay" onClick={onClose}>
//       <div className="hm-modal" onClick={(e) => e.stopPropagation()}>
//         <div className="hm-modal-header">
//           <h2>
//             {editingHoliday
//               ? t('holidays.editHoliday')
//               : t('holidays.addHoliday')}
//           </h2>
//           <button onClick={onClose} className="hm-modal-close">
//             <i className="fas fa-times" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="hm-modal-body">

//             {/* Name */}
//             <div className="hm-form-group">
//               <label className="hm-form-label">{t('holidays.holidayName')} *</label>
//               <input
//                 className={`hm-form-input ${errors.name ? 'hm-error' : ''}`}
//                 value={form.name}
//                 onChange={(e) =>
//                   setForm({ ...form, name: e.target.value })
//                 }
//               />
//               {errors.name && <span className="hm-error-text">{errors.name}</span>}
//             </div>

//             {/* Dates */}
//             <div className="hm-form-group">
//               <label className="hm-form-label">{t('holidays.holidayDate')}</label>

//               {t('holidays.from')}
//               <input
//                 type="date"
//                 className={`hm-form-input ${errors.startDate ? 'hm-error' : ''}`}
//                 value={form.startDate}
//                 onChange={(e) =>
//                   setForm(prev => ({
//                     ...prev,
//                     startDate: e.target.value,
//                     endDate: prev.endDate || e.target.value
                    
//                   }))
//                 }
//               />

//               {t('holidays.to')}
              
//               <input
//                 type="date"
//                 className={`hm-form-input ${errors.range ? 'hm-error' : ''}`}
//                 value={form.endDate}
//                 onChange={(e) =>
//                   setForm({ ...form, endDate: e.target.value })
                  
//                 }
//               />

//               {editingHoliday && (
//                 <div className="hm-hint">
//                   {t('holidays.totalDays')}:{' '}
//                   <strong>{editingHoliday.totalDays}</strong>
//                 </div>
//               )}
//             </div>

//             {/* Scope */}
//             <div className="hm-form-group">
//               <label className="hm-form-label">{t('holidays.scope')}</label>
//               <select
//                 className="hm-form-select"
//                 value={form.scope}
//                 disabled={!!editingHoliday}
//                 onChange={(e) =>
//                   setForm({
//                     ...form,
//                     scope: e.target.value,
//                     branch: '',
//                     user: ''
//                   })
//                 }
//               >
//                 <option value="global">{t('holidays.global')}</option>
//                 <option value="branch">{t('holidays.branch')}</option>
//                 <option value="user">{t('holidays.user')}</option>
//               </select>
//             </div>

//             {/* Branch */}
//             {(form.scope === 'branch' || form.scope === 'user') && (
//               <div className="hm-form-group">
//                 <label className="hm-form-label">{t('holidays.selectBranch')}</label>
//                 <select
//                   className={`hm-form-select ${errors.branch ? 'hm-error' : ''}`}
//                   value={form.branch}
//                   disabled={!!editingHoliday}
//                   onChange={(e) =>
//                     setForm({ ...form, branch: e.target.value, user: '' })
//                   }
//                 >
//                   <option value="">{t('holidays.selectBranch')}</option>
//                   {branches.map(b => (
//                     <option key={b._id} value={b._id}>{b.name}</option>
//                   ))}
//                 </select>
//               </div>
//             )}

//             {/* User */}
//             {form.scope === 'user' && (
//               <div className="hm-form-group">
//                 <label className="hm-form-label">{t('holidays.selectUser')}</label>

//                 {editingHoliday ? (
//                   <input className="hm-form-input" value={userQuery} disabled />
//                 ) : (
//                   <>
//                     <input
//                       className={`hm-form-input ${errors.user ? 'hm-error' : ''}`}
//                       value={userQuery}
//                       onChange={(e) => setUserQuery(e.target.value)}
//                       disabled={!form.branch}
//                     />

//                     {userResults.length > 0 && (
//                       <ul className="hm-search-results">
//                         {userResults.map(u => (
//                           <li
//                             key={u._id}
//                             onClick={() => {
//                               setForm({ ...form, user: u._id });
//                               setUserQuery(`${u.name} (${u.email})`);
//                               setUserResults([]);
//                             }}
//                           >
//                             <strong>{u.name}</strong>
//                             <span>{u.email}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </>
//                 )}
//               </div>
//             )}

//           </div>

//           {!editingHoliday && (
//             <div className="hm-info-box">
//               <i className="fas fa-info-circle" />
//               {t('holidays.createdAsDraft')}
//             </div>
//           )}

//           <div className="hm-modal-footer">
//             <button
//               type="button"
//               onClick={onClose}
//               className="hm-btn hm-btn-secondary"
//               disabled={loading}
//             >
//               {t('holidays.cancel')}
//             </button>

//             <button
//               type="submit"
//               className="hm-btn hm-btn-primary"
//               disabled={loading || searchingUsers}
//             >
//               {loading ? (
//                 <>
//                   <i className="fas fa-spinner fa-spin" /> {t('common.saving')}
//                 </>
//               ) : (
//                 <>
//                   <i className="fas fa-check" /> {t('holidays.save')}
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default HolidayFormModal;

//============================date helper used file

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// import { getBranches, searchUsers } from '../../services/holiday.api';
import { searchUsers } from '../../services/holiday.api';
import { getBranchesWithMeta } from '../../services/branch.api';

import {
  toDateInputValue,
  toUTCMidnight,
  isValidDateRange
} from '../../helpers/dateHelpers';

const HolidayFormModal = ({ show, editingHoliday, onClose, onSave }) => {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    scope: 'global',
    branch: '',
    user: '',
    userObj: null
  });

  const [branches, setBranches] = useState([]);
  const [tenantTimezone,setTenantTimezone
] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [userQuery, setUserQuery] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

  /* =========================
     Init form (create / edit)
  ========================= */
  useEffect(() => {
    if (!show) return;

    if (editingHoliday) {
      setForm({
        name: editingHoliday.name || '',
        // ✅ التحويل الصح من ISO → YYYY-MM-DD
        startDate: toDateInputValue(editingHoliday.startDate,
          editingHoliday.timezone
        ),
        endDate: toDateInputValue(editingHoliday.endDate,
          editingHoliday.timezone
        ),



        scope: editingHoliday.scope,
        branch: editingHoliday.branch?._id || '',
        user: editingHoliday.user?._id || '',
        userObj: editingHoliday.user || null
      });

      if (editingHoliday.user) {
        setUserQuery(
          `${editingHoliday.user.name} (${editingHoliday.user.email})`
        );
      }
    } else {
      setForm({
        name: '',
        startDate: '',
        endDate: '',
        scope: 'global',
        branch: '',
        user: '',
        userObj: null
      });
      setUserQuery('');
    }

    setErrors({});
    setUserResults([]);
  }, [editingHoliday, show]);

  /* =========================
     Load branches
  ========================= */
  useEffect(() => {
    if (!show) return;

    (async () => {
      try {
     const data = await getBranchesWithMeta ();

       // console.log(data);

const res = await getBranchesWithMeta();

setBranches(
 Array.isArray(res?.data)
  ? res.data
  : []
);

setTenantTimezone(
 res.meta?.tenantTimezone || null
)

      } catch (err) {
        console.error('Load branches error', err);
      }
    })();
  }, [show]);

  /* =========================
     User search (CREATE only)
  ========================= */
  useEffect(() => {
    if (editingHoliday) return;
    if (form.scope !== 'user' || !form.branch) return;
    if (userQuery.length < 2) {
      setUserResults([]);
      return;
    }

    const tId = setTimeout(async () => {
      setSearchingUsers(true);
      try {
        const res = await searchUsers(userQuery, form.branch);
        setUserResults(res || []);
      } finally {
        setSearchingUsers(false);
      }
    }, 300);

    return () => clearTimeout(tId);
  }, [userQuery, form.branch, form.scope, editingHoliday]);

  /* =========================
     Validation (front-only)
  ========================= */
  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = t('holidays.nameRequired');
    if (!form.startDate) e.startDate = t('holidays.dateRequired');

    // ✅ تحقق آمن من نطاق التواريخ
    if (form.endDate && !isValidDateRange(form.startDate, form.endDate)) {
      e.range = t('holidays.invalidDateRange');
    }

    if (!editingHoliday) {
      if (form.scope === 'branch' && !form.branch) {
        e.branch = t('holidays.branchRequired');
      }
      if (form.scope === 'user') {
        if (!form.branch) e.branch = t('holidays.branchRequired');
        if (!form.user) e.user = t('holidays.userRequired');
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* =========================
     Submit
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        // ✅ التحويل الإجباري قبل الإرسال
        startDate: toUTCMidnight(form.startDate),
        endDate: toUTCMidnight(form.endDate || form.startDate)
      };

      if (!editingHoliday) {
        payload.scope = form.scope;
        if (form.scope === 'branch') payload.branch = form.branch;
        if (form.scope === 'user') payload.user = form.user;
      }

      await onSave(payload);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;


const previewTimezone =
 editingHoliday?.timezone ||

(
 form.scope==='global'
   ? tenantTimezone

 : form.scope==='user'
   ? form.userObj?.workTimezone

 : branches.find(
     b=>b._id===form.branch
   )?.timezone
);

// console.log({
//  tenantTimezone,
//  scope: form.scope,
//  branch: form.branch,
//  userTZ: form.userObj?.workTimezone,
//  previewTimezone
// });

  return (
    <div className="hm-modal-overlay" onClick={onClose}>
      <div className="hm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="hm-modal-header">
          <h2>
            {editingHoliday
              ? t('holidays.editHoliday')
              : t('holidays.addHoliday')}
          </h2>
          <button onClick={onClose} className="hm-modal-close">
            <i className="fas fa-times" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="hm-modal-body">

            {/* Name */}
            <div className="hm-form-group">
              <label className="hm-form-label">
                {t('holidays.holidayName')} *
              </label>
              <input
                className={`hm-form-input ${errors.name ? 'hm-error' : ''}`}
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
              {errors.name && (
                <span className="hm-error-text">{errors.name}</span>
              )}
            </div>

            {/* Dates */}
            <div className="hm-form-group">
              <label className="hm-form-label">
                {t('holidays.holidayDate')}
              </label>

              {t('holidays.from')}
              <input
                type="date"
                className={`hm-form-input ${
                  errors.startDate ? 'hm-error' : ''
                }`}
                value={form.startDate}
                onChange={(e) =>
                  setForm(prev => ({
                    ...prev,
                    startDate: e.target.value,
                    endDate: prev.endDate || e.target.value
                  }))
                }
              />

              {t('holidays.to')}
              <input
                type="date"
                className={`hm-form-input ${
                  errors.range ? 'hm-error' : ''
                }`}
                value={form.endDate}
                onChange={(e) =>
                  setForm({ ...form, endDate: e.target.value })
                }
              />

              {errors.range && (
                <span className="hm-error-text">{errors.range}</span>
              )}

              {editingHoliday && (
                <div className="hm-hint">
                  {t('holidays.totalDays')}:{' '}
                  <strong>{editingHoliday.totalDays}</strong>
                </div>
              )}
            </div>

            {/* Scope */}
            <div className="hm-form-group">
              <label className="hm-form-label">{t('holidays.scope')}</label>
              <select
                className="hm-form-select"
                value={form.scope}
                disabled={!!editingHoliday}
                onChange={(e) =>
                  setForm({
                    ...form,
                    scope: e.target.value,
                    branch: '',
                    user: '',
                    userObj:null
                  })
                }
              >
                <option value="global">{t('holidays.global')}</option>
                <option value="branch">{t('holidays.branch')}</option>
                <option value="user">{t('holidays.user')}</option>
              </select>
            </div>

            {/* Branch */}
            {(form.scope === 'branch' || form.scope === 'user') && (
              <div className="hm-form-group">
                <label className="hm-form-label">
                  {t('holidays.selectBranch')}
                </label>
                <select
                  className={`hm-form-select ${
                    errors.branch ? 'hm-error' : ''
                  }`}
                  value={form.branch}
                  disabled={!!editingHoliday}
                  onChange={(e) =>
                    setForm({ ...form, branch: e.target.value, user: '' })
                  }
                >
                  <option value="">{t('holidays.selectBranch')}</option>
                  {branches.map(b => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* User */}
            {form.scope === 'user' && (
              <div className="hm-form-group">
                <label className="hm-form-label">
                  {t('holidays.selectUser')}
                </label>

                {editingHoliday ? (
                  <input className="hm-form-input" value={userQuery} disabled />
                ) : (
                  <>
                    <input
                      className={`hm-form-input ${
                        errors.user ? 'hm-error' : ''
                      }`}
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      disabled={!form.branch}
                    />

                    {userResults.length > 0 && (
                      <ul className="hm-search-results">
                        {userResults.map(u => (
                          <li
                            key={u._id}
                            onClick={() => {
                             setForm({
 ...form,
 user: u._id,
 userObj: u
});
                              setUserQuery(`${u.name} (${u.email})`);
                              setUserResults([]);
                            }}
                          >
                            <strong>{u.name}</strong>
                            <span>{u.email}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            )}
{(previewTimezone || !editingHoliday) && (
  <div className="hm-badge-timezone">
    <i className="fas fa-clock" />

    {t('holidays.timezone')}:{' '}

    <strong>
      {
 previewTimezone
   ? previewTimezone
   : (
      form.scope==='global'
       ? t('holidays.loadingTimezone')
       : t('holidays.autoResolved')
     )
}
    </strong>
  </div>
)}

          {!editingHoliday && (
            <div className="hm-info-box">
              <i className="fas fa-info-circle" />
              {t('holidays.createdAsDraft')}
            </div>
          )}
          </div>







          <div className="hm-modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="hm-btn hm-btn-secondary"
              disabled={loading}
            >
              {t('holidays.cancel')}
            </button>

            <button
              type="submit"
              className="hm-btn hm-btn-primary"
              disabled={loading || searchingUsers}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin" /> {t('common.saving')}
                </>
              ) : (
                <>
                  <i className="fas fa-check" /> {t('holidays.save')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HolidayFormModal;
