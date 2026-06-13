
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// import { getBranches, createHolidayPlan } from '../../../services/holiday.api';

import { createHolidayPlan }
from '../../../services/holiday.api';

import { getBranches ,getBranchesWithMeta}
from '../../../services/branch.api';

import { 
  toDateInputValue, 
  toUTCMidnight,
  isValidDateRange,
  calculateDays
} from '../../../helpers/dateHelpers';

const HolidayPlanModal = ({ show, editingPlan, onClose, onSave, onToast }) => {
  const { t } = useTranslation();

  const [planName, setPlanName] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [holidays, setHolidays] = useState([]);
  const [branches, setBranches] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
const [tenantTimezone,setTenantTimezone] =
 useState(null);
  /* =========================
     Init
  ========================= */

  
  useEffect(() => {
    if (!show ) return;
    if (editingPlan) {
      setPlanName(editingPlan.name);
      setYear(editingPlan.year);
      setHolidays([]);
    } else {
      setPlanName('');
      setYear(new Date().getFullYear());
      setHolidays([]);
    }

    setErrors({});

    (async () => {
      try {
        // const data = await getBranches();
        // setBranches(data.data || data || []);
        // const branches = await getBranches();
// setBranches(branches);



const res = await getBranchesWithMeta({
 includeMeta:true
});

setBranches(res.data || []);
setTenantTimezone(
 res.meta?.tenantTimezone || null
);

      } catch (err) {
        console.error('Load branches error', err);
      }
    })();
  }, [show, editingPlan]);


  
useEffect(() => {
  if (!show || editingPlan) return;

  setHolidays(prev =>
    prev.length === 0
      ? [{
          id: Date.now(),
          name: '',
          startDate: '',
          endDate: '',
          scope: 'global',
          branch: '',
          user: ''
        }]
      : prev
  );
}, [show, editingPlan]);


  /* =========================
     Holiday Management
  ========================= */
  const addHoliday = () => {
    setHolidays([
      ...holidays,
      {
        id: Date.now(),
        name: '',
        startDate: '',
        endDate: '',
        scope: 'global',
        branch: '',
        user: ''
      }
    ]);
  };

  const removeHoliday = (id) => {
    setHolidays(holidays.filter(h => h.id !== id));
  };

  const updateHoliday = (id, field, value) => {
    setHolidays(
      holidays.map(h =>
        h.id === id
          ? {
              ...h,
              [field]: value,
              ...(field === 'scope' && { branch: '', user: '' }),
              ...(field === 'startDate' && !h.endDate && { endDate: value })
            }
          : h
      )
    );
  };

  const duplicateHoliday = (holiday) => {
    setHolidays([
      ...holidays,
      {
        ...holiday,
        id: Date.now(),
        name: `${holiday.name} (Copy)`
      }
    ]);
  };

  /* =========================
     Validation
  ========================= */
  const validate = () => {
    const e = {};

    if (!planName.trim()) {
      e.planName = t('holidays.planNameRequired');
    }

    if (!year) {
      e.year = t('holidays.yearRequired');
    }

    if (!editingPlan && holidays.length === 0) {
      e.holidays = t('holidays.atLeastOneHoliday');
    }

    holidays.forEach((h, idx) => {
      if (!h.name.trim()) {
        e[`name_${idx}`] = t('holidays.nameRequired');
      }

      if (!h.startDate) {
        e[`startDate_${idx}`] = t('holidays.dateRequired');
      }

      if (h.endDate && h.endDate < h.startDate) {
        e[`range_${idx}`] = t('holidays.invalidDateRange');
      }

      if (h.scope === 'branch' && !h.branch) {
        e[`branch_${idx}`] = t('holidays.branchRequired');
      }
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* =========================
     Submit
  ========================= */

      const buildHolidayPayload = (holidays) =>
  holidays.map(h => ({
    name: h.name.trim(),
     startDate: toUTCMidnight(h.startDate),
    endDate: toUTCMidnight(h.endDate || h.startDate),
    scope: h.scope,
    ...(h.scope === 'branch' && { branch: h.branch }),
    ...(h.scope === 'user' && { user: h.user })
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      if (editingPlan) {
        // Update plan metadata only
        await onSave({ name: planName, year });
      } else {
        // Create new plan with holidays
        // const payload = holidays.map(h => ({
        //   name: h.name.trim(),
        //   startDate: h.startDate,
        //   endDate: h.endDate || h.startDate,
        //   scope: h.scope,
        //   branch: h.scope === 'branch' ? h.branch : undefined,
        //   user: h.scope === 'user' ? h.user : undefined
        // }));

        await createHolidayPlan({ planName, year,
           holidays: buildHolidayPayload(holidays) });

        onToast?.(t('holidays.planCreated'), 'success');
        onClose();
      }
    
    }catch (err) {
  const msg =
    err.response?.status === 409
      ? t('holidays.overlapError')
      : err.response?.data?.message || t('holidays.createPlanError');

  onToast?.(msg, 'error');
}
finally {
      setLoading(false);
    }
  };

  if (!show) return null;



  const getHolidayPreviewTimezone = (holiday) => {
 if (holiday.timezone) {
   return holiday.timezone; // لو جاية من edit
 }

 if (holiday.scope === 'branch') {
   return branches.find(
      b=>b._id===holiday.branch
   )?.timezone || null;
 }

 // global plan
 return tenantTimezone || null;
};

  return (
    <div className="hm-modal-overlay" onClick={onClose}>
      <div
        className="hm-modal hm-modal-wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="hm-modal-header">
          <h2>
            {editingPlan ? t('holidays.editPlan') : t('holidays.createPlan')}
          </h2>
          <button onClick={onClose} className="hm-modal-close">
            <i className="fas fa-times" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="hm-modal-body">
            {/* Plan Metadata */}
            <div className="hm-plan-meta">
              <div className="hm-form-group">
                <label className="hm-form-label">
                  {t('holidays.planName')} *
                </label>
                <input
                  className={`hm-form-input ${errors.planName ? 'hm-error' : ''}`}
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder={t('holidays.planNamePlaceholder')}
                  // disabled={!!editingPlan}
                />
                {errors.planName && (
                  <span className="hm-error-text">{errors.planName}</span>
                )}
              </div>

              <div className="hm-form-group">
                <label className="hm-form-label">
                  {t('holidays.year')} *
                </label>
                <select
                  className={`hm-form-select ${errors.year ? 'hm-error' : ''}`}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  disabled={!!editingPlan}
                >
                  {Array.from({ length: 3 }, (_, i) => {
                    const y = new Date().getFullYear() + i;
                    return (
                      <option key={y} value={y}>{y}</option>
                    );
                  })}
                </select>
              </div>
            </div>

            {!editingPlan && (
              <>
                {/* Holidays List */}
                <div className="hm-plan-holidays">
                  <div className="hm-plan-holidays-header">
                    <h3>{t('holidays.holidaysList')}</h3>
                    <button
                      type="button"
                      onClick={addHoliday}
                      disabled={loading}
                      className="hm-btn hm-btn-sm hm-btn-primary"
                    >
                      <i className="fas fa-plus" /> {t('holidays.addHoliday')}
                    </button>
                  </div>

                  {errors.holidays && (
                    <div className="hm-error-box">{errors.holidays}</div>
                  )}

                  {holidays.map((holiday, idx) => (
                    <div key={holiday.id} className="hm-plan-holiday-row">
                      {/* Name */}
                      <div className="hm-form-group">
                        <input
                          className={`hm-form-input ${
                            errors[`name_${idx}`] ? 'hm-error' : ''
                          }`}
                          value={holiday.name}
                          onChange={(e) =>
                            updateHoliday(holiday.id, 'name', e.target.value)
                          }
                          placeholder={t('holidays.holidayName')}
                        />
                        {errors[`name_${idx}`] && (
                          <span className="hm-error-text">
                            {errors[`name_${idx}`]}
                          </span>
                        )}
                      </div>

                      {/* Start Date */}
                      <div className="hm-form-group">
                        <input
                          type="date"
                          className={`hm-form-input ${
                            errors[`startDate_${idx}`] ? 'hm-error' : ''
                          }`}
                          value={holiday.startDate}
                          onChange={(e) =>
                            updateHoliday(holiday.id, 'startDate', e.target.value)
                          }
                        />
                      </div>

                      {/* End Date */}
                      <div className="hm-form-group">
                        <input
                          type="date"
                          className={`hm-form-input ${
                            errors[`range_${idx}`] ? 'hm-error' : ''
                          }`}
                          value={holiday.endDate}
                          onChange={(e) =>
                            updateHoliday(holiday.id, 'endDate', e.target.value)
                          }
                        />
                      </div>

                      {/* Scope */}
                      <div className="hm-form-group">
                        <select
                          className="hm-form-select"
                          value={holiday.scope}
                          onChange={(e) =>
                            updateHoliday(holiday.id, 'scope', e.target.value)
                          }
                        >
                          <option value="global">{t('holidays.global')}</option>
                          <option value="branch">{t('holidays.branch')}</option>
                        </select>
                      </div>

                      {/* Branch */}
                      {holiday.scope === 'branch' && (
                        <div className="hm-form-group">
                          <select
                            className={`hm-form-select ${
                              errors[`branch_${idx}`] ? 'hm-error' : ''
                            }`}
                            value={holiday.branch}
                            onChange={(e) =>
                              updateHoliday(holiday.id, 'branch', e.target.value)
                            }
                          >
                            <option value="">{t('holidays.selectBranch')}</option>
                            {(Array.isArray(branches) ? branches : []).map(b => (
                              <option key={b._id} value={b._id}>
                                {b.name}
                              </option>
                            ))}


                          </select>
                        </div>
                      )}

{( holiday.scope !== 'branch' ||
 holiday.branch
) && getHolidayPreviewTimezone(holiday) && (
 <div className="hm-badge-timezone">
   <i className="fas fa-clock" />{t('holidays.timezone')}:{' '}
   {getHolidayPreviewTimezone(holiday)}
 </div>
)}

                      {/* Actions */}
                      <div className="hm-row-actions">
                        <button
                          type="button"
                          onClick={() => duplicateHoliday(holiday)}
                          className="hm-icon-btn hm-icon-btn-secondary"
                          title={t('holidays.duplicate')}
                        >
                          <i className="fas fa-copy"></i>
                        </button>

                        <button
                          type="button"
                          onClick={() => removeHoliday(holiday.id)}
                          className="hm-icon-btn hm-icon-btn-delete"
                          title={t('holidays.remove')}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}

                  {holidays.length === 0 && (
                    <div className="hm-empty-plan">
                      <i className="fas fa-calendar-plus"></i>
                      <p>{t('holidays.noHolidaysYet')}</p>
                      <button
                        type="button"
                        onClick={addHoliday}
                        className="hm-btn hm-btn-primary"
                      >
                        {t('holidays.addFirstHoliday')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

               {!editingPlan && (
            <div className="hm-info-box">
              <i className="fas fa-info-circle" />
              {t('holidays.planWillBeCreatedAsDraft')}
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
                  {editingPlan ? t('holidays.update') : t('holidays.createPlan')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HolidayPlanModal;

