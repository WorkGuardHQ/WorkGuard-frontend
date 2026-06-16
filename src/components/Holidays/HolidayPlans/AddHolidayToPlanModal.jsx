
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  
  searchUsers,
  addHolidayToPlan
} from '../../../services/holiday.api';

import { getBranchesWithMeta}
from '../../../services/branch.api';
import { toUTCMidnight} from '../../../helpers/dateHelpers.js';
const AddHolidayToPlanModal = ({
  show,
  planId,
  onClose,
  onSave,
  onToast
}) => {
  const { t } = useTranslation();

  /* =========================
     State
  ========================= */
  const [form, setForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    scope: 'global',
    branch: '',
    user: '',
    userTimezone:''
  });

  const [branches, setBranches] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // user search
  const [userQuery, setUserQuery] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
const [tenantTimezone,setTenantTimezone] =
 useState(null);
  /* =========================
     Init
  ========================= */
  useEffect(() => {
    if (!show) return;

    setForm({
      name: '',
      startDate: '',
      endDate: '',
      scope: 'global',
      branch: '',
      user: '',
    });

    setErrors({});
    setUserQuery('');
    setUserResults([]);

    (async () => {
      try {
   const res = await getBranchesWithMeta();

// console.log(res);

setBranches(
 Array.isArray(res?.data)
   ? res.data
   : []
);

setTenantTimezone(
 res.meta?.tenantTimezone || null
);

      } catch (err) {
        console.error('Load branches error', err);
      }
    })();
  }, [show]);

  /* =========================
     User search (scope=user)
  ========================= */
  useEffect(() => {
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
  }, [userQuery, form.branch, form.scope]);

  /* =========================
     Validation
  ========================= */
  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = t('holidays.nameRequired');
    if (!form.startDate) e.startDate = t('holidays.dateRequired');
    if (form.endDate && form.endDate < form.startDate) {
      e.range = t('holidays.invalidDateRange');
    }

    if (form.scope === 'branch' && !form.branch) {
      e.branch = t('holidays.branchRequired');
    }

    if (form.scope === 'user') {
      if (!form.branch) e.branch = t('holidays.branchRequired');
      if (!form.user) e.user = t('holidays.userRequired');
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
        startDate: toUTCMidnight(form.startDate),  
  endDate: toUTCMidnight(form.endDate || form.startDate),
        scope: form.scope
      };
    

      if (form.scope === 'branch') payload.branch = form.branch;
      if (form.scope === 'user') payload.user = form.user;

      await addHolidayToPlan(planId, payload);

      onToast?.(t('holidays.holidayAddedToPlan'), 'success');
      onClose();
      onSave?.(); // refresh holidays list
    } catch (err) {
      const msg =
        err.response?.status === 409
          ? t('holidays.overlapError')
          : err.response?.data?.message || t('holidays.addHolidayError');

      onToast?.(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  /* =========================
     Render
  ========================= */
  return (
    <div className="hm-modal-overlay" onClick={onClose}>
      <div className="hm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="hm-modal-header">
          <h2>{t('holidays.addHolidayToPlan')}</h2>
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
                className={`hm-form-input ${errors.startDate ? 'hm-error' : ''}`}
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
                className={`hm-form-input ${errors.range ? 'hm-error' : ''}`}
                value={form.endDate}
                onChange={(e) =>
                  setForm({ ...form, endDate: e.target.value })
                }
              />

              {errors.range && (
                <span className="hm-error-text">{errors.range}</span>
              )}
            </div>

            {/* Scope */}
            <div className="hm-form-group">
              <label className="hm-form-label">{t('holidays.scope')}</label>
              <select
                className="hm-form-select"
                value={form.scope}
                onChange={(e) =>
                  setForm({
                    ...form,
                    scope: e.target.value,
                    branch: '',
                    user: '',
                     userTimezone:''
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
                  className={`hm-form-select ${errors.branch ? 'hm-error' : ''}`}
                  value={form.branch}
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
                {errors.branch && (
                  <span className="hm-error-text">{errors.branch}</span>
                )}
              </div>
            )}

            {/* User (search) */}
            {form.scope === 'user' && (
              <div className="hm-form-group">
                <label className="hm-form-label">
                  {t('holidays.selectUser')}
                </label>

                <input
                  className={`hm-form-input ${errors.user ? 'hm-error' : ''}`}
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  disabled={!form.branch}
                  placeholder={t('holidays.searchUser')}
                />

                {searchingUsers && (
                  <div className="hm-hint">
                    <i className="fas fa-spinner fa-spin" /> {t('common.loading')}
                  </div>
                )}

                {userResults.length > 0 && (
                  <ul className="hm-search-results">
                    {userResults.map(u => (
                      <li
                        key={u._id}
                        onClick={() => {
                          setForm({ ...form, user: u._id , userTimezone: u.workTimezone});
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

                {errors.user && (
                  <span className="hm-error-text">{errors.user}</span>
                )}
              </div>
            )}

<div className="hm-form-hint">
 <i className="fas fa-globe"/>

 Timezone: {
  form.scope==='branch'
   ? (
      branches.find(
       b=>b._id===form.branch
      )?.timezone || 'Select branch'
     )

  : form.scope==='user'
   ? (
      form.userTimezone || 'Select user'
     )

  : (
      tenantTimezone
     )
 }
</div>
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
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin" />
                  {t('common.saving')}
                </>
              ) : (
                <>
                  <i className="fas fa-check" />
                  {t('holidays.add')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHolidayToPlanModal;
